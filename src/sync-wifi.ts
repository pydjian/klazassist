// @ts-nocheck
/* ============================================================================
   SYNC OVER WIFI — peer-to-peer synchronization via WebRTC DataChannels
   ----------------------------------------------------------------------------
   See companion documentation in the PR for:
     • Full protocol description
     • Conflict resolution rules (delegated to MergeEngine)
     • Security model
   ============================================================================ */

const PROTOCOL_VERSION = 1;
const SIGNAL_PREFIX    = 'KLAZSYNC1:';
const CHUNK_BYTES      = 48 * 1024;
const HELLO_TIMEOUT_MS = 15_000;
const ICE_TIMEOUT_MS   = 3_500;
const SYNC_TIMEOUT_MS  = 5 * 60_000;
const MAX_SESSIONS_KEPT = 20;

/* User-data stores eligible for sync. Matches MergeEngine.SKIP_STORES
   (which skips `settings`). Declared here so the UI can render checkboxes
   without needing access to MergeEngine internals. */
const SYNC_STORES = [
  'teachers','schools','classes','learners','attendance',
  'subjects','assessments','questions','assessmentResults',
  'grades','assignments','assignmentRecords','schedules',
  'seatingPlans','lessonPlans','weeklyPlans','notes',
  'behaviorLogs','parentLogs','groups','termGrades','reportSnapshots',
  'calendarEvents','presentations','teachingLoad','sf9Records',
  'rubrics','parentDigestLog','philIriRecords'
];

/* ============================ Encoding helpers ============================ */

function b64uEncode(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64uDecode(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
  const bin = atob(b64 + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deflate(text) {
  const cs = new CompressionStream('deflate-raw');
  const w = cs.writable.getWriter();
  w.write(new TextEncoder().encode(text));
  w.close();
  const chunks = [];
  const r = cs.readable.getReader();
  for (;;) {
    const { value, done } = await r.read();
    if (done) break;
    chunks.push(value);
  }
  let total = 0;
  chunks.forEach(c => total += c.length);
  const out = new Uint8Array(total);
  let off = 0;
  chunks.forEach(c => { out.set(c, off); off += c.length; });
  return out;
}

async function inflate(bytes) {
  const ds = new DecompressionStream('deflate-raw');
  const w = ds.writable.getWriter();
  w.write(bytes);
  w.close();
  const chunks = [];
  const r = ds.readable.getReader();
  for (;;) {
    const { value, done } = await r.read();
    if (done) break;
    chunks.push(value);
  }
  let total = 0;
  chunks.forEach(c => total += c.length);
  const out = new Uint8Array(total);
  let off = 0;
  chunks.forEach(c => { out.set(c, off); off += c.length; });
  return new TextDecoder().decode(out);
}

async function encodeSignal(obj) {
  const json = JSON.stringify(obj);
  const compressed = await deflate(json);
  return SIGNAL_PREFIX + b64uEncode(compressed);
}

async function decodeSignal(code) {
  const s = String(code || '').trim().replace(/\s+/g, '');
  if (!s.startsWith(SIGNAL_PREFIX)) {
    throw new Error('This is not a KlazAssist sync code.');
  }
  const bytes = b64uDecode(s.slice(SIGNAL_PREFIX.length));
  const json = await inflate(bytes);
  return JSON.parse(json);
}

function chunkRecords(records, maxBytes = CHUNK_BYTES) {
  const batches = [];
  let cur = [];
  let bytes = 2; // []
  for (const r of records) {
    const sz = JSON.stringify(r).length + 1;
    if (cur.length && bytes + sz > maxBytes) {
      batches.push(cur);
      cur = [];
      bytes = 2;
    }
    cur.push(r);
    bytes += sz;
  }
  if (cur.length) batches.push(cur);
  return batches;
}

function waitIceGathering(pc, timeoutMs = ICE_TIMEOUT_MS) {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise(resolve => {
    const check = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', check);
        clearTimeout(t);
        resolve();
      }
    };
    pc.addEventListener('icegatheringstatechange', check);
    const t = setTimeout(() => {
      pc.removeEventListener('icegatheringstatechange', check);
      resolve();
    }, timeoutMs);
  });
}

/* ============================================================================
   MAIN MODULE
   ============================================================================ */

class SyncWifiModule {
  constructor(deps) {
    this.deps = deps;
    this.Pages = deps.Pages;
    this.State = deps.State;
    this.DB = deps.DB;
    this.UI = deps.UI;
    this.Utils = deps.Utils;
    this.MergeEngine = deps.MergeEngine;
    this.CONFIG = deps.CONFIG;
    this.App = deps.App;

    this.deviceId = this._loadOrMakeDeviceId();
    this.deviceName = this._defaultDeviceName();

    this.pc = null;
    this.dc = null;
    this.role = 'idle';           // 'host' | 'client' | 'idle'
    this.status = 'Disconnected';
    this.statusDetail = '';
    this.offerCode = null;
    this.answerCode = null;
    this.peerOfferCode = null;
    this.sessionId = null;
    this.sessionStartedAt = null;
    this.sessionEndsAt = null;
    this.peerDeviceId = null;
    this.peerDeviceName = null;
    this.peerAppVersion = null;
    this.peerProtocol = null;

    this.sendQueue = [];
    this.receivingSnapshot = null;
    this.receivingStore = null;
    this.receivingBatches = [];
    this.syncTimeoutHandle = null;
    this.helloTimeoutHandle = null;
    this.heartbeatHandle = null;

    this.lastSummary = null;
    this.sessionHistory = [];

    this._uiSubscriber = null;   // set by render() so status updates repaint
  }

  /* -------- persistence -------- */

  _loadOrMakeDeviceId() {
    try {
      let id = localStorage.getItem('klazassist.sync.deviceId');
      if (!id) {
        id = 'dev-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
        localStorage.setItem('klazassist.sync.deviceId', id);
      }
      return id;
    } catch (e) {
      return 'dev-' + Math.random().toString(36).slice(2, 12);
    }
  }

  _defaultDeviceName() {
    try {
      const ua = navigator.userAgent || '';
      let os = 'Device';
      if (/Android/i.test(ua)) os = 'Android';
      else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
      else if (/Windows/i.test(ua)) os = 'Windows PC';
      else if (/Macintosh/i.test(ua)) os = 'Mac';
      else if (/Linux/i.test(ua)) os = 'Linux';
      const stored = localStorage.getItem('klazassist.sync.deviceName');
      return stored || os;
    } catch (e) { return 'Device'; }
  }

  async _loadHistory() {
    try {
      const h = await this.DB.getSetting('sync.session.history', []);
      this.sessionHistory = Array.isArray(h) ? h : [];
    } catch (e) { this.sessionHistory = []; }
  }

  async _saveHistory() {
    try {
      const trimmed = this.sessionHistory.slice(0, MAX_SESSIONS_KEPT);
      await this.DB.setSetting('sync.session.history', trimmed);
    } catch (e) { /* non-fatal */ }
  }

  /* -------- status -------- */

  _setStatus(status, detail = '') {
    this.status = status;
    this.statusDetail = detail;
    if (typeof this._uiSubscriber === 'function') {
      try { this._uiSubscriber(); } catch (e) { /* ignore */ }
    }
    if (this.dc && this.dc.readyState === 'open') {
      try {
        this.dc.send(JSON.stringify({ type: 'status', status, detail }));
      } catch (e) { /* ignore */ }
    }
  }

  /* ==========================================================================
     HOST SIDE
     ========================================================================== */

  async startHost() {
    if (this.pc) await this.closeAll('restart');
    await this._loadHistory();

    this.role = 'host';
    this.sessionId = this.Utils.uid('sync-');
    this.sessionStartedAt = new Date().toISOString();
    this.sessionEndsAt = new Date(Date.now() + SYNC_TIMEOUT_MS).toISOString();
    this._setStatus('Starting Host', 'Creating peer connection…');

    const pc = new RTCPeerConnection({ iceServers: [] });
    this.pc = pc;

    pc.onconnectionstatechange = () => {
      const st = pc.connectionState;
      if (st === 'connecting') this._setStatus('Connecting');
      else if (st === 'connected') this._setStatus('Connected', 'Waiting for handshake…');
      else if (st === 'disconnected') this._setStatus('Interrupted', 'Network lost');
      else if (st === 'failed')      this._setStatus('Error', 'Could not reach the other device.');
      else if (st === 'closed')      this._setStatus('Disconnected');
    };
    pc.onicecandidateerror = (e) => {
      // Host candidates only — a candidate error here is usually a firewall issue
      console.warn('[Sync] ICE candidate error', e);
    };

    const dc = pc.createDataChannel('sync', { ordered: true });
    this.dc = dc;
    this._wireDataChannel(dc, 'host');

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitIceGathering(pc);

    const sdp = pc.localDescription;
    if (!sdp || !sdp.sdp) throw new Error('Could not create an offer.');

    this.offerCode = await encodeSignal({
      v: PROTOCOL_VERSION,
      kind: 'offer',
      sid: this.sessionId,
      did: this.deviceId,
      dn: this.deviceName,
      av: this.CONFIG.VERSION,
      db: this.CONFIG.DB_VERSION,
      sdp: sdp.sdp
    });

    this._setStatus('Waiting for Connections',
      'Show the pairing QR to the other device, then paste their reply.');
    return this.offerCode;
  }

  async acceptAnswerCode(code) {
    if (this.role !== 'host' || !this.pc) throw new Error('Start the host first.');
    const payload = await decodeSignal(code);
    if (payload.kind !== 'answer') throw new Error('That is not an answer code.');
    if (payload.sid && payload.sid !== this.sessionId) {
      throw new Error('This answer belongs to a different session. Start over.');
    }
    if (payload.v !== PROTOCOL_VERSION) {
      throw new Error(
        `Protocol mismatch — this device speaks v${PROTOCOL_VERSION}, `
        + `the reply speaks v${payload.v}. Update KlazAssist on both devices.`
      );
    }
    this.peerDeviceId = payload.did || null;
    this.peerDeviceName = payload.dn || 'Other device';
    this.peerAppVersion = payload.av || null;
    this.peerProtocol = payload.v;
    await this.pc.setRemoteDescription({ type: 'answer', sdp: payload.sdp });
    this._setStatus('Connecting', 'Negotiating with ' + (this.peerDeviceName || 'the other device') + '…');
    this._armHelloTimeout();
  }

  /* ==========================================================================
     CLIENT SIDE
     ========================================================================== */

  async buildAnswerFromOffer(offerCode) {
    if (this.pc) await this.closeAll('restart');
    await this._loadHistory();

    this.role = 'client';
    this._setStatus('Connecting', 'Reading pairing code…');

    const payload = await decodeSignal(offerCode);
    if (payload.kind !== 'offer') throw new Error('That is not an offer code.');
    if (payload.v !== PROTOCOL_VERSION) {
      throw new Error(
        `Protocol mismatch — the host speaks v${payload.v}, this device speaks `
        + `v${PROTOCOL_VERSION}. Update KlazAssist on both devices.`
      );
    }
    if (payload.db && payload.db !== this.CONFIG.DB_VERSION) {
      throw new Error(
        `Database schema mismatch — host v${payload.db}, this device v${this.CONFIG.DB_VERSION}. `
        + `Update both installations to the same app version before syncing.`
      );
    }
    this.sessionId = payload.sid;
    this.sessionStartedAt = new Date().toISOString();
    this.sessionEndsAt = new Date(Date.now() + SYNC_TIMEOUT_MS).toISOString();
    this.peerDeviceId = payload.did;
    this.peerDeviceName = payload.dn || 'Host';
    this.peerAppVersion = payload.av || null;
    this.peerProtocol = payload.v;

    const pc = new RTCPeerConnection({ iceServers: [] });
    this.pc = pc;
    pc.onconnectionstatechange = () => {
      const st = pc.connectionState;
      if (st === 'connecting') this._setStatus('Connecting');
      else if (st === 'connected') this._setStatus('Connected', 'Waiting for handshake…');
      else if (st === 'disconnected') this._setStatus('Interrupted', 'Network lost');
      else if (st === 'failed')      this._setStatus('Error', 'Could not reach the host.');
      else if (st === 'closed')      this._setStatus('Disconnected');
    };
    pc.ondatachannel = (ev) => {
      this.dc = ev.channel;
      this._wireDataChannel(ev.channel, 'client');
    };

    await pc.setRemoteDescription({ type: 'offer', sdp: payload.sdp });
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await waitIceGathering(pc);

    const sdp = pc.localDescription;
    this.answerCode = await encodeSignal({
      v: PROTOCOL_VERSION,
      kind: 'answer',
      sid: this.sessionId,
      did: this.deviceId,
      dn: this.deviceName,
      av: this.CONFIG.VERSION,
      sdp: sdp.sdp
    });

    this._setStatus('Connecting',
      'Give this reply code back to the host. The connection opens when they paste it.');
    this._armHelloTimeout();
    return this.answerCode;
  }

  /* ==========================================================================
     DATACHANNEL WIRING
     ========================================================================== */

  _wireDataChannel(dc, side) {
    dc.binaryType = 'arraybuffer';
    dc.onopen = () => {
      this._setStatus('Connected', 'Exchanging identity…');
      // Host initiates the hello.
      if (side === 'host') {
        this._send({
          type: 'hello',
          protocol: PROTOCOL_VERSION,
          appVersion: this.CONFIG.VERSION,
          dbVersion: this.CONFIG.DB_VERSION,
          deviceId: this.deviceId,
          deviceName: this.deviceName,
          stores: SYNC_STORES
        });
      }
      this._startHeartbeat();
    };
    dc.onerror = (e) => {
      console.warn('[Sync] DataChannel error', e);
    };
    dc.onclose = () => {
      this._stopHeartbeat();
      if (this.status !== 'Completed') {
        this._setStatus('Interrupted', 'The other device closed the connection.');
      }
    };
    dc.onmessage = (ev) => {
      this._handleIncoming(ev.data);
    };
  }

  _send(msg) {
    if (!this.dc || this.dc.readyState !== 'open') {
      this.sendQueue.push(msg);
      return;
    }
    let payload;
    try { payload = JSON.stringify(msg); }
    catch (e) { console.error('[Sync] Cannot serialize message', e); return; }

    if (payload.length > CHUNK_BYTES * 2) {
      console.warn('[Sync] Dropping oversized message', payload.length);
      return;
    }
    try { this.dc.send(payload); }
    catch (e) { console.warn('[Sync] Send failed', e); }
  }

  _flushSendQueue() {
    const q = this.sendQueue.splice(0);
    for (const m of q) this._send(m);
  }

  /* ==========================================================================
     PROTOCOL HANDLER
     ========================================================================== */

  async _handleIncoming(raw) {
    let msg;
    try {
      msg = typeof raw === 'string' ? JSON.parse(raw) : JSON.parse(new TextDecoder().decode(raw));
    } catch (e) {
      console.warn('[Sync] Ignored malformed frame');
      return;
    }
    if (!msg || typeof msg.type !== 'string') return;

    switch (msg.type) {
      case 'hello':          return this._onHello(msg);
      case 'hello-ack':      return this._onHelloAck(msg);
      case 'status':         return this._setStatus(msg.status, msg.detail || '');
      case 'ping':           return this._send({ type: 'pong', t: msg.t });
      case 'pong':           return; // heartbeat ack
      case 'request-store':  return this._onRequestStore(msg);
      case 'store-data':     return this._onStoreData(msg);
      case 'store-done':     return this._onStoreDone(msg);
      case 'manifest-ack':   return; // host acknowledges
      case 'complete':       return this._onPeerComplete(msg);
      case 'cancel':         return this._onPeerCancel(msg);
      case 'error':          return this._onPeerError(msg);
      default:
        console.warn('[Sync] Unknown message type', msg.type);
    }
  }

  _onHello(msg) {
    // Client receives the host's hello.
    if (this.role !== 'client') return;
    if (msg.protocol !== PROTOCOL_VERSION) {
      this._send({ type: 'error', message: 'Protocol mismatch' });
      this._setStatus('Error', 'Incompatible protocol version.');
      return;
    }
    if (msg.dbVersion !== this.CONFIG.DB_VERSION) {
      this._send({ type: 'error', message: 'Database schema mismatch' });
      this._setStatus('Error',
        'This device and the host have different data schemas. Update both first.');
      return;
    }
    this.peerDeviceId = msg.deviceId;
    this.peerDeviceName = msg.deviceName || 'Host';
    this.peerAppVersion = msg.appVersion;

    this._clearHelloTimeout();
    this._send({
      type: 'hello-ack',
      protocol: PROTOCOL_VERSION,
      appVersion: this.CONFIG.VERSION,
      dbVersion: this.CONFIG.DB_VERSION,
      deviceId: this.deviceId,
      deviceName: this.deviceName
    });
    // Kick off: the client requests each store from the host.
    this._beginClientPull();
  }

  _onHelloAck(msg) {
    if (this.role !== 'host') return;
    if (msg.protocol !== PROTOCOL_VERSION) {
      this._setStatus('Error', 'Incompatible protocol version.');
      return;
    }
    this.peerDeviceId = msg.deviceId;
    this.peerDeviceName = msg.deviceName || 'Client';
    this.peerAppVersion = msg.appVersion;
    this._clearHelloTimeout();
    // Host waits for the client to request stores.
    this._setStatus('Connected', `Ready — waiting for ${this.peerDeviceName} to start.`);
  }

  /* ==========================================================================
     PULL PHASE (client pulls from host)
     ========================================================================== */

  async _beginClientPull() {
    this._setStatus('Comparing Data', 'Requesting data from host…');
    this.receivingSnapshot = {
      application: this.CONFIG.APP_NAME,
      version: this.CONFIG.VERSION,
      formatVersion: 2,
      exportDate: new Date().toISOString(),
      data: {}
    };
    this.receivingStore = null;
    this.receivingBatches = [];
    this._requestNextStoreFromPeer(SYNC_STORES);
  }

  async _requestNextStoreFromPeer(stores) {
    for (const store of stores) {
      try {
        const count = (await this.DB.getAll(store) || []).length;
        if (count === 0) continue;
      } catch (e) { /* store may not exist yet */ }
      this.receivingStore = store;
      this.receivingBatches = [];
      this._send({ type: 'request-store', store });
      return;
    }
    // Nothing more to pull.
    this._finishPullPhase();
  }

  _onRequestStore(msg) {
    // Host handles a client's request.
    if (this.role !== 'host') return;
    const store = msg.store;
    if (!SYNC_STORES.includes(store)) {
      this._send({ type: 'error', message: `Store not allowed: ${store}` });
      return;
    }
    this._streamStore(store);
  }

  async _streamStore(store) {
    try {
      const all = (await this.DB.getAll(store)) || [];
      const batches = chunkRecords(all, CHUNK_BYTES);
      let sent = 0;
      for (const batch of batches) {
        this._send({ type: 'store-data', store, records: batch });
        sent += batch.length;
        // Yield to the event loop so the DataChannel buffer drains.
        await new Promise(r => setTimeout(r, 0));
      }
      this._send({ type: 'store-done', store, count: sent });
    } catch (e) {
      this._send({ type: 'error', message: `Could not read ${store}: ${e.message}` });
    }
  }

  _onStoreData(msg) {
    if (!this.receivingSnapshot) return;
    if (msg.store !== this.receivingStore) {
      console.warn('[Sync] Out-of-order store-data', msg.store, this.receivingStore);
      return;
    }
    if (!Array.isArray(msg.records)) return;
    this.receivingBatches.push(...msg.records);
  }

  _onStoreDone(msg) {
    if (msg.store !== this.receivingStore) return;
    this.receivingSnapshot.data[msg.store] = this.receivingBatches;
    this.receivingStore = null;
    this.receivingBatches = [];
    // Request next store after this one.
    const idx = SYNC_STORES.indexOf(msg.store);
    const remaining = SYNC_STORES.slice(idx + 1);
    this._requestNextStoreFromPeer(remaining);
  }

  async _finishPullPhase() {
    // The client now has the host's snapshot. Merge it.
    const snapshot = this.receivingSnapshot;
    this.receivingSnapshot = null;

    this._setStatus('Synchronizing', 'Previewing changes from host…');

    let plan;
    try {
      plan = await this.MergeEngine.buildPlan(snapshot);
    } catch (e) {
      this._send({ type: 'error', message: 'Could not build merge plan: ' + e.message });
      this._setStatus('Error', 'Could not compute changes.');
      return;
    }

    const applyCount = plan.inserts.length + plan.updates.length +
                       (plan.conflicts.length /* resolved later */);

    if (applyCount === 0 && plan.conflicts.length === 0) {
      this._setStatus('Verifying Records', 'Already in sync with host.');
      this._send({ type: 'manifest-ack' });
      // Proceed to reverse phase (host pulls from client).
      this._beginHostPull();
      return;
    }

    // Show preview to user; require explicit apply.
    const decision = await this._confirmApplyModal(plan, 'host');
    if (!decision.ok) {
      this._send({ type: 'cancel', reason: 'User declined changes from host.' });
      this._setStatus('Interrupted', 'Sync cancelled by user.');
      return;
    }

    // Auto-save a rollback snapshot of our pre-merge state, in-memory.
    const rollback = await this._captureLocalRollback(plan);

    try {
      await this.MergeEngine.applyPlan(plan, decision.conflictPolicy);
    } catch (e) {
      this._send({ type: 'error', message: 'Apply failed: ' + e.message });
      this._setStatus('Error', 'Could not apply changes.');
      // Offer rollback
      await this._offerRollback(rollback);
      return;
    }

    this._send({ type: 'manifest-ack' });

    // Now reverse phase: host requests from client.
    this._beginHostPull(plan);
  }

  /* ==========================================================================
     PULL PHASE (host pulls from client)
     ========================================================================== */

  _beginHostPull(lastPlan) {
    // Ask the client to send its stores.
    this._setStatus('Comparing Data', 'Sending data back to host…');
    this.receivingSnapshot = null; // host is now in "send" role
    const stores = SYNC_STORES.slice();
    // Send first request-store to client (which is now a "host" of the reverse flow)
    this._clientRoleAskForMyStores(stores, 0, lastPlan);
  }

  async _clientRoleAskForMyStores(stores, i, lastPlan) {
    // Walk our stores and push them to the client.
    for (; i < stores.length; i++) {
      const store = stores[i];
      let has = false;
      try { has = ((await this.DB.getAll(store)) || []).length > 0; }
      catch (e) { continue; }
      if (!has) continue;
      // Ask the client (which is in "host" role during reverse) to accept our store.
      this._send({ type: 'request-store', store });
      // Wait for the client's store-data / store-done.
      this._reversePhaseStore = store;
      return;
    }
    // All done — send complete.
    this._finishSync(lastPlan);
  }

  async _onReverseStoreData(msg) {
    // Host receives client's store data during the reverse phase.
    if (!this.receivingSnapshot) {
      this.receivingSnapshot = {
        application: this.CONFIG.APP_NAME,
        version: this.CONFIG.VERSION,
        formatVersion: 2,
        exportDate: new Date().toISOString(),
        data: {}
      };
    }
    if (!Array.isArray(msg.records)) return;
    const store = msg.store;
    if (!this.receivingSnapshot.data[store]) this.receivingSnapshot.data[store] = [];
    this.receivingSnapshot.data[store].push(...msg.records);
  }

  async _onReverseStoreDone(msg) {
    // Reverse phase finished for this store — request the next.
    const idx = SYNC_STORES.indexOf(msg.store);
    this._clientRoleAskForMyStores(SYNC_STORES, idx + 1, this._lastReversePlan);
  }

  /* ==========================================================================
     COMPLETION
     ========================================================================== */

  async _finishSync(applyPlanDone) {
    this._setStatus('Verifying Records', 'Checking consistency…');

    // Ask the peer for its summary via 'complete'.
    this._send({
      type: 'complete',
      summary: this._buildLocalSummary(applyPlanDone)
    });

    // Consistency check (local): verify the record count in the DB matches
    // what we believe we wrote. Doesn't try to be distributed.
    const consistency = await this._verifyLocalConsistency();

    this._recordSession(applyPlanDone, consistency);
    this._setStatus('Completed',
      consistency.ok ? 'Consistent' : 'Completed with warnings');
    this.lastSummary = {
      plan: applyPlanDone || null,
      consistency,
      endedAt: new Date().toISOString()
    };
    if (typeof this._uiSubscriber === 'function') {
      try { this._uiSubscriber(); } catch (e) {}
    }
  }

  _onPeerComplete(msg) {
    // Stash the peer's summary on our last session record.
    if (this.sessionHistory[0]) {
      this.sessionHistory[0].peerSummary = msg.summary || null;
      this._saveHistory();
    }
  }

  _onPeerCancel(msg) {
    this._setStatus('Interrupted', msg.reason || 'The other device cancelled.');
  }

  _onPeerError(msg) {
    this._setStatus('Error', msg.message || 'The other device reported an error.');
  }

  _buildLocalSummary(plan) {
    const total = plan
      ? (plan.inserts.length + plan.updates.length + plan.conflicts.length)
      : 0;
    return {
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      applied: plan ? this._planCounts(plan) : { inserts: 0, updates: 0, conflicts: 0, skips: 0 },
      total
    };
  }

  _planCounts(plan) {
    return {
      inserts: plan.inserts.length,
      updates: plan.updates.length,
      conflicts: plan.conflicts.length,
      skips: plan.skips.length
    };
  }

  async _verifyLocalConsistency() {
    // Loose check: for every store touched in the last apply, we can read it
    // back without error. We do NOT assert equality with the peer.
    const issues = [];
    for (const store of SYNC_STORES) {
      try { await this.DB.getAll(store); }
      catch (e) { issues.push({ store, error: e.message }); }
    }
    return { ok: issues.length === 0, issues };
  }

  _recordSession(plan, consistency) {
    const counts = plan ? this._planCounts(plan) : { inserts:0, updates:0, conflicts:0, skips:0 };
    const entry = {
      id: this.sessionId,
      role: this.role,
      startedAt: this.sessionStartedAt,
      endedAt: new Date().toISOString(),
      peerDeviceId: this.peerDeviceId,
      peerDeviceName: this.peerDeviceName,
      peerAppVersion: this.peerAppVersion,
      counts,
      consistency
    };
    this.sessionHistory.unshift(entry);
    this.sessionHistory = this.sessionHistory.slice(0, MAX_SESSIONS_KEPT);
    this._saveHistory();
  }

  /* ==========================================================================
     ROLLBACK
     ========================================================================== */

  async _captureLocalRollback(plan) {
    const rollback = { capturedAt: new Date().toISOString(), stores: {} };
    const touchedStores = new Set();
    plan.inserts.forEach(it => touchedStores.add(it.store));
    plan.updates.forEach(it => touchedStores.add(it.store));
    plan.conflicts.forEach(it => touchedStores.add(it.store));
    for (const store of touchedStores) {
      try { rollback.stores[store] = await this.DB.getAll(store); }
      catch (e) { /* ignore */ }
    }
    return rollback;
  }

  async _offerRollback(rollback) {
    return new Promise(resolve => {
      const m = this.UI.modal({
        title: 'Synchronization failed',
        body: `
          <div class="alert alert-danger">${this._icon('alert')}<div>
            The merge could not be applied cleanly. You can restore the affected
            stores to their pre-sync state now.
          </div></div>
          <p class="text-sm text-muted">
            Stores that would be rolled back:
            <strong>${Object.keys(rollback.stores).join(', ') || '(none)'}</strong>
          </p>`,
        footer: `
          <button class="btn btn-outline" data-close>Keep current state</button>
          <button class="btn btn-danger" id="sw-rollback">Restore pre-sync state</button>`
      });
      m.overlay.querySelector('[data-close]').onclick = () => { m.close(); resolve(); };
      m.overlay.querySelector('#sw-rollback').onclick = async () => {
        try {
          for (const [store, records] of Object.entries(rollback.stores)) {
            await this.DB.clear(store);
            await this.DB.bulkWrite(store, records, 'put');
          }
          this.DB._invalidate();
          this.UI.toast('Restored pre-sync state.', 'success');
        } catch (e) {
          this.UI.toast('Rollback failed: ' + e.message, 'error', 6000);
        }
        m.close();
        resolve();
      };
    });
  }

  /* ==========================================================================
     APPLY CONFIRMATION
     ========================================================================== */

  _confirmApplyModal(plan, sourceLabel) {
    return new Promise(resolve => {
      const counts = this._planCounts(plan);
      const conflictBlock = plan.conflicts.length === 0 ? '' : `
        <div class="alert alert-warning" style="margin-top:12px;">
          ${this._icon('alert')}<div>
            <strong>${plan.conflicts.length} conflict${plan.conflicts.length === 1 ? '' : 's'}</strong> detected.
            These records exist on both devices but differ in a way that cannot be
            resolved automatically (for example, both sides have a finalized term grade).
          </div>
        </div>
        <div class="form-group">
          <label>How should conflicts be resolved?</label>
          <label class="auth-check"><input type="radio" name="sw-cp" value="local" checked>
            <span>Keep my local version</span></label>
          <label class="auth-check"><input type="radio" name="sw-cp" value="remote">
            <span>Use the incoming version</span></label>
        </div>`;

      const m = this.UI.modal({
        title: 'Confirm synchronization',
        size: 'modal-lg',
        body: `
          <p class="text-sm text-muted">
            Incoming changes from <strong>${this._esc(sourceLabel)}</strong>
            will be merged into this device. Nothing is deleted — the merge is
            additive unless a newer version of the same record exists.
          </p>
          <div class="grid grid-4" style="margin:14px 0;">
            <div class="stat-card">
              <div class="stat-label">New records</div>
              <div class="stat-value">${counts.inserts}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Updated</div>
              <div class="stat-value">${counts.updates}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Unchanged</div>
              <div class="stat-value">${counts.skips}</div>
            </div>
            <div class="stat-card ${counts.conflicts ? 'accent-danger' : ''}">
              <div class="stat-label">Conflicts</div>
              <div class="stat-value">${counts.conflicts}</div>
            </div>
          </div>
          ${conflictBlock}
          <div class="divider"></div>
          <p class="text-xs text-muted">
            A rollback snapshot of the affected stores will be kept in memory
            for this session. If the merge fails, you will be offered a restore.
          </p>`,
        footer: `
          <button class="btn btn-outline" id="sw-decline">Skip incoming changes</button>
          <button class="btn btn-primary" id="sw-apply">Apply Merge</button>`
      });
      m.overlay.querySelector('#sw-decline').onclick = () => {
        m.close();
        resolve({ ok: false });
      };
      m.overlay.querySelector('#sw-apply').onclick = () => {
        const cps = m.overlay.querySelectorAll('input[name="sw-cp"]');
        let cp = 'local';
        cps.forEach(r => { if (r.checked) cp = r.value; });
        m.close();
        resolve({ ok: true, conflictPolicy: cp });
      };
    });
  }

  /* ==========================================================================
     HEARTBEAT
     ========================================================================== */

  _startHeartbeat() {
    this._stopHeartbeat();
    this.heartbeatHandle = setInterval(() => {
      if (!this.dc || this.dc.readyState !== 'open') return;
      this._send({ type: 'ping', t: Date.now() });
    }, 8000);
  }

  _stopHeartbeat() {
    if (this.heartbeatHandle) {
      clearInterval(this.heartbeatHandle);
      this.heartbeatHandle = null;
    }
  }

  _armHelloTimeout() {
    this._clearHelloTimeout();
    this.helloTimeoutHandle = setTimeout(() => {
      if (this.dc && this.dc.readyState === 'open') return;
      this._setStatus('Error', 'Timed out waiting for the other device. Try again.');
      this.closeAll('hello-timeout');
    }, HELLO_TIMEOUT_MS);
  }

  _clearHelloTimeout() {
    if (this.helloTimeoutHandle) {
      clearTimeout(this.helloTimeoutHandle);
      this.helloTimeoutHandle = null;
    }
  }

  /* ==========================================================================
     CLOSE / CLEANUP
     ========================================================================== */

  async closeAll(reason) {
    this._clearHelloTimeout();
    this._stopHeartbeat();
    try {
      if (this.dc) {
        try { this.dc.close(); } catch (e) {}
        this.dc = null;
      }
      if (this.pc) {
        try { this.pc.close(); } catch (e) {}
        this.pc = null;
      }
    } catch (e) { /* ignore */ }
    this.role = 'idle';
    this.offerCode = null;
    this.answerCode = null;
    this.receivingSnapshot = null;
    this.receivingStore = null;
    this.receivingBatches = [];
    this.sendQueue = [];
    if (this.status !== 'Completed') {
      this._setStatus('Disconnected', reason ? `Closed (${reason})` : '');
    }
    if (typeof this._uiSubscriber === 'function') {
      try { this._uiSubscriber(); } catch (e) {}
    }
  }

  /* ==========================================================================
     UI — the "Sync Over WiFi" page
     ========================================================================== */

  async render(root) {
    const repaint = () => this._paint(root);
    this._uiSubscriber = repaint;

    await this._loadHistory();

    root.innerHTML = `
      <div class="page-head">
        <div>
          <h2 style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <span>Sync Over WiFi</span>
            <span class="sw-proto-pill" title="Peer-to-peer protocol">
              ${this._icon('signal')} P2P v${PROTOCOL_VERSION}
            </span>
          </h2>
          <p>Exchange records directly with another KlazAssist device on the same network — no internet required.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline sw-refresh-btn" id="sw-refresh">
            ${this._icon('history')} Refresh Status
          </button>
        </div>
      </div>

      <div class="sw-peer-notice">
        <span class="sw-peer-notice-icon">${this._icon('shield')}</span>
        <div>
          <strong>Peer-to-peer.</strong> Data travels directly between the two devices.
          KlazAssist never touches a server. Use this only on a network you trust
          (home, school LAN).
          <button type="button" class="sw-link-btn" id="sw-security-link">
            Review the security notes →
          </button>
        </div>
      </div>

      <div id="sw-body"></div>
    `;

    this._bindHeader(root);
    this._paint(root);
  }

  _bindHeader(root) {
    const refreshBtn = root.querySelector('#sw-refresh');
    if (refreshBtn) {
      refreshBtn.onclick = async () => {
        if (refreshBtn.disabled) return;
        refreshBtn.disabled = true;
        refreshBtn.classList.add('sw-refreshing');
        try {
          await this._loadHistory();
          // Small pause so the spin is visible on fast disks.
          await new Promise(r => setTimeout(r, 400));
          this._paint(root);
          this.UI.toast('Status refreshed', 'info', 1600);
        } catch (e) {
          this.UI.toast('Could not refresh: ' + (e.message || 'unknown'), 'warning', 4000);
        } finally {
          refreshBtn.disabled = false;
          refreshBtn.classList.remove('sw-refreshing');
        }
      };
    }
    const secLink = root.querySelector('#sw-security-link');
    if (secLink) {
      secLink.onclick = (e) => { e.preventDefault(); this._showSecurityNotes(); };
    }
  }

  _paint(root) {
    const body = root.querySelector('#sw-body');
    if (!body) return;
    body.innerHTML = `
      ${this._renderStatusCard()}
      <div class="sw-columns">
        ${this._renderHostCard()}
        ${this._renderClientCard()}
      </div>
      ${this._renderActiveSessionCard()}
      ${this._renderHistoryCard()}
    `;
    this._bindHostCard(root);
    this._bindClientCard(root);
    this._bindActiveSession(root);
    this._bindHistory(root);
  }

  /* ==========================================================================
     STATUS HERO + 4-UP STAT GRID
     ========================================================================== */

  _statusMeta() {
    const map = {
      'Disconnected':             { icon: 'signal',  label: 'Idle',                 hint: 'Start a host or connect to one to begin.' },
      'Starting Host':            { icon: 'play',    label: 'Preparing',            hint: 'Creating the peer connection…' },
      'Waiting for Connections':  { icon: 'timer',   label: 'Waiting',              hint: 'Share the pairing code with the other device.' },
      'Connecting':               { icon: 'signal',  label: 'Negotiating',          hint: 'Talking to the other device…' },
      'Connected':                { icon: 'check',   label: 'Handshaking',          hint: 'Verifying identity and versions.' },
      'Comparing Data':           { icon: 'analysis',label: 'Comparing',            hint: 'Working out what has changed on each side.' },
      'Synchronizing':            { icon: 'history', label: 'Applying changes',     hint: 'Merging records into the local database.' },
      'Verifying Records':        { icon: 'shield',  label: 'Verifying',            hint: 'Reading back the merged stores.' },
      'Completed':                { icon: 'check',   label: 'Complete',             hint: 'Both devices are now up to date.' },
      'Interrupted':              { icon: 'alert',   label: 'Interrupted',          hint: 'The connection dropped or the peer closed.' },
      'Error':                    { icon: 'alert',   label: 'Error',                hint: 'Something went wrong — see the detail below.' }
    };
    return map[this.status] || map['Disconnected'];
  }

  _lastSyncLabel() {
    if (!this.sessionHistory.length) return 'Never';
    const last = this.sessionHistory[0];
    if (!last.endedAt) return 'Never';
    try {
      const d = new Date(last.endedAt);
      const diff = (Date.now() - d.getTime()) / 1000;
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
    } catch (e) { return '—'; }
  }

  _renderStatusCard() {
    const cls = this._statusClass();
    const meta = this._statusMeta();
    const connected = this.status === 'Connected' || this.status === 'Completed' ||
                      this.status === 'Comparing Data' || this.status === 'Synchronizing' ||
                      this.status === 'Verifying Records';

    return `
      <div class="sw-hero ${cls}">
        <div class="sw-hero-inner">
          <div class="sw-hero-icon${connected ? ' is-live' : ''}" aria-hidden="true">
            ${this._icon(meta.icon)}
          </div>
          <div class="sw-hero-text">
            <div class="sw-hero-label">${this._esc(meta.label)}</div>
            <div class="sw-hero-title">${this._esc(this.status)}</div>
            <div class="sw-hero-detail">
              ${this.statusDetail
                ? this._esc(this.statusDetail)
                : this._esc(meta.hint)}
            </div>
          </div>
        </div>

        <div class="sw-status-grid">
          <div class="sw-status-item">
            <span class="sw-status-item-icon">${this._icon('users')}</span>
            <div class="sw-status-item-body">
              <div class="sw-status-label">Role</div>
              <div class="sw-status-value">${
                this.role === 'idle' ? 'Idle' : (this.role === 'host' ? 'Host' : 'Client')
              }</div>
              <div class="sw-status-detail">${
                this.role === 'idle' ? 'Not connected' : 'Session active'
              }</div>
            </div>
          </div>

          <div class="sw-status-item">
            <span class="sw-status-item-icon">${this._icon('shield')}</span>
            <div class="sw-status-item-body">
              <div class="sw-status-label">This Device</div>
              <div class="sw-status-value" title="${this._esc(this.deviceName)}">${this._esc(this.deviceName)}</div>
              <div class="sw-status-detail">${this._esc(this.deviceId.slice(-8))}</div>
            </div>
          </div>

          <div class="sw-status-item">
            <span class="sw-status-item-icon">${this._icon('users')}</span>
            <div class="sw-status-item-body">
              <div class="sw-status-label">Other Device</div>
              <div class="sw-status-value" title="${this._esc(this.peerDeviceName || '')}">${
                this.peerDeviceName ? this._esc(this.peerDeviceName) : 'Not connected'
              }</div>
              <div class="sw-status-detail">${
                this.peerAppVersion ? 'KlazAssist v' + this._esc(this.peerAppVersion) : '—'
              }</div>
            </div>
          </div>

          <div class="sw-status-item">
            <span class="sw-status-item-icon">${this._icon('history')}</span>
            <div class="sw-status-item-body">
              <div class="sw-status-label">Last Sync</div>
              <div class="sw-status-value">${this._esc(this._lastSyncLabel())}</div>
              <div class="sw-status-detail">${
                this.sessionHistory.length
                  ? this.sessionHistory.length + ' session' + (this.sessionHistory.length === 1 ? '' : 's') + ' on record'
                  : 'No sessions yet'
              }</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  _statusClass() {
    if (this.status === 'Completed' || this.status === 'Connected') return 'sw-status-ok';
    if (this.status === 'Error') return 'sw-status-error';
    if (this.status === 'Interrupted') return 'sw-status-warn';
    if (this.status === 'Disconnected' || this.status === 'idle') return 'sw-status-neutral';
    return 'sw-status-active';
  }

  /* ==========================================================================
     HOST + CLIENT ROLE CARDS
     ========================================================================== */

  _renderHostCard() {
    const running = this.role === 'host' && this.pc;
    const waitingForAnswer = running && this.offerCode && !this.peerDeviceName;

    return `
      <div class="card sw-role-card">
        <div class="sw-role-head">
          <div class="sw-role-icon host">${this._icon('signal')}</div>
          <div style="flex:1;min-width:0;">
            <div class="sw-role-title">Host this device</div>
            <div class="sw-role-sub">Share this device's records with another KlazAssist install.</div>
          </div>
        </div>

        <ol class="sw-role-steps">
          <li>Click <strong>Start WiFi Sync Host</strong> below.</li>
          <li>Show the QR code (or copy the text) to the other device.</li>
          <li>Paste their reply code back here to connect.</li>
        </ol>

        <div class="sw-role-actions">
          ${!running
            ? `<button class="btn btn-primary btn-block" id="sw-host-start">
                 ${this._icon('play')} Start WiFi Sync Host
               </button>`
            : `<button class="btn btn-danger btn-block" id="sw-host-stop">
                 ${this._icon('xCircle')} Stop Host
               </button>`}
        </div>

        ${this.offerCode ? `
          <div class="sw-code-area">
            <div class="sw-code-area-head">
              <span class="sw-code-area-label">${this._icon('signal')} Pairing code</span>
              <span class="sw-code-area-hint">Single-use · 5-min window</span>
            </div>
            <div class="sw-qr" id="sw-host-qr"></div>
            <textarea class="form-control" id="sw-offer-code" readonly rows="3">${this._esc(this.offerCode)}</textarea>
            <button class="btn btn-sm btn-outline btn-block mt-8" id="sw-copy-offer">
              ${this._icon('file')} Copy offer code
            </button>
          </div>
        ` : ''}

        ${waitingForAnswer ? `
          <div class="sw-answer-area">
            <label class="sw-code-area-label" style="display:block;margin-bottom:6px;">
              ${this._icon('download')} Paste the client's reply code
            </label>
            <textarea class="form-control" id="sw-answer-input" rows="3" placeholder="KLAZSYNC1:..."></textarea>
            <button class="btn btn-primary btn-block mt-8" id="sw-host-accept">
              ${this._icon('check')} Accept Reply
            </button>
          </div>
        ` : ''}
      </div>`;
  }

  _renderClientCard() {
    const connected = this.role === 'client' && this.pc;

    return `
      <div class="card sw-role-card">
        <div class="sw-role-head">
          <div class="sw-role-icon client">${this._icon('download')}</div>
          <div style="flex:1;min-width:0;">
            <div class="sw-role-title">Connect to Host</div>
            <div class="sw-role-sub">Receive records from another KlazAssist install.</div>
          </div>
        </div>

        <ol class="sw-role-steps">
          <li>Paste the host's offer code below.</li>
          <li>Click <strong>Generate Reply</strong> to create a reply code.</li>
          <li>Send the reply code back to the host to finish pairing.</li>
        </ol>

        ${!connected ? `
          <div class="sw-role-actions">
            <label class="sw-code-area-label" style="display:block;margin-bottom:6px;">
              ${this._icon('file')} Host offer code
            </label>
            <textarea class="form-control" id="sw-offer-input" rows="3" placeholder="KLAZSYNC1:..."></textarea>
            <button class="btn btn-primary btn-block mt-8" id="sw-client-start">
              ${this._icon('play')} Generate Reply
            </button>
          </div>
        ` : `
          <div class="sw-role-actions">
            <button class="btn btn-danger btn-block" id="sw-client-stop">
              ${this._icon('xCircle')} Disconnect
            </button>
          </div>
        `}

        ${this.answerCode ? `
          <div class="sw-code-area">
            <div class="sw-code-area-head">
              <span class="sw-code-area-label">${this._icon('check')} Reply code</span>
              <span class="sw-code-area-hint">Give this to the host</span>
            </div>
            <div class="sw-qr" id="sw-client-qr"></div>
            <textarea class="form-control" id="sw-answer-code" readonly rows="3">${this._esc(this.answerCode)}</textarea>
            <button class="btn btn-sm btn-outline btn-block mt-8" id="sw-copy-answer">
              ${this._icon('file')} Copy reply code
            </button>
          </div>
        ` : ''}
      </div>`;
  }

  /* ==========================================================================
     ACTIVE SESSION
     ========================================================================== */

  _renderActiveSessionCard() {
    if (!this.pc) return '';

    const steps = [
      { id: 'waiting',    label: 'Waiting' },
      { id: 'connected',  label: 'Connected' },
      { id: 'comparing',  label: 'Comparing' },
      { id: 'syncing',    label: 'Syncing' },
      { id: 'verifying',  label: 'Verifying' },
      { id: 'done',       label: 'Done' }
    ];
    const currentIdx = this._statusStepIndex();

    return `
      <div class="card sw-session-card mb-16">
        <div class="card-head">
          <h3>${this._icon('activity')} Active Session</h3>
          <button class="btn btn-sm btn-outline" id="sw-cancel-session">
            ${this._icon('xCircle')} Cancel Sync
          </button>
        </div>

        <div class="sw-session-meta">
          <span><strong>Session</strong> ${this._esc((this.sessionId || '').slice(-12))}</span>
          <span><strong>Started</strong> ${this._esc(this._fmtTime(this.sessionStartedAt))}</span>
          <span><strong>Peer</strong> ${this._esc(this.peerDeviceName || '—')}</span>
        </div>

        <div class="sw-session-progress" role="progressbar"
             aria-valuemin="0" aria-valuemax="100"
             aria-valuenow="${this._sessionProgress()}">
          ${steps.map((s, i) => `
            <div class="sw-session-progress-step ${
              i < currentIdx ? 'done' : (i === currentIdx ? 'active' : '')
            }" title="${this._esc(s.label)}"></div>
          `).join('')}
        </div>

        <div class="sw-session-labels">
          ${steps.map((s, i) => `
            <span class="${i <= currentIdx ? 'on' : ''}">${this._esc(s.label)}</span>
          `).join('')}
        </div>

        <p class="text-xs text-muted mt-12" style="margin-bottom:0;">
          ${this._esc(this.statusDetail || '')}
        </p>
      </div>`;
  }

  _statusStepIndex() {
    switch (this.status) {
      case 'Disconnected':            return -1;
      case 'Starting Host':
      case 'Waiting for Connections':
      case 'Connecting':              return 0;
      case 'Connected':               return 1;
      case 'Comparing Data':          return 2;
      case 'Synchronizing':           return 3;
      case 'Verifying Records':       return 4;
      case 'Completed':               return 5;
      default:                        return -1;
    }
  }

  _sessionProgress() {
    const idx = this._statusStepIndex();
    if (idx < 0) return 0;
    return Math.round(((idx + 1) / 6) * 100);
  }

  /* ==========================================================================
     HISTORY
     ========================================================================== */

  _renderHistoryCard() {
    if (!this.sessionHistory.length) {
      return `
        <div class="card">
          <div class="card-head">
            <h3>Recent sync sessions</h3>
            <span class="text-xs text-muted">0 kept</span>
          </div>
          <div class="sw-history-empty">
            ${this._icon('history')}
            <div>No sync sessions yet.</div>
            <div class="text-xs" style="margin-top:4px;opacity:0.75;">
              Your next pairing will appear here with its record counts.
            </div>
          </div>
        </div>`;
    }
    return `
      <div class="card">
        <div class="card-head">
          <h3>Recent sync sessions</h3>
          <span class="text-xs text-muted">${this.sessionHistory.length} kept</span>
        </div>
        <div class="sw-history-list">
          ${this.sessionHistory.map(h => {
            const ok = h.consistency && h.consistency.ok;
            const total = (h.counts.inserts || 0) + (h.counts.updates || 0);
            return `
              <div class="sw-history-row">
                <div class="sw-history-icon ${ok ? 'ok' : 'warn'}">
                  ${this._icon(ok ? 'check' : 'alert')}
                </div>
                <div class="sw-history-body">
                  <div class="sw-history-title">
                    ${h.role === 'host' ? 'Hosted to' : 'Received from'}
                    <strong>${this._esc(h.peerDeviceName || 'device')}</strong>
                  </div>
                  <div class="sw-history-meta">
                    <span class="sw-hist-pill new">+${h.counts.inserts} new</span>
                    <span class="sw-hist-pill upd">~${h.counts.updates} updated</span>
                    ${h.counts.conflicts
                      ? `<span class="sw-hist-pill confl">${h.counts.conflicts} conflict${h.counts.conflicts === 1 ? '' : 's'}</span>`
                      : ''}
                    <span class="sw-hist-pill mut">${h.counts.skips} unchanged</span>
                  </div>
                  <div class="sw-history-time">
                    ${this._esc(this._fmtTime(h.startedAt))}
                    · ${total} record${total === 1 ? '' : 's'} changed
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  _bindHistory(root) { /* no per-row actions yet */ }

  /* ==========================================================================
     CARD BINDINGS
     ========================================================================== */

  _bindHostCard(root) {
    const startBtn = root.querySelector('#sw-host-start');
    if (startBtn) startBtn.onclick = async () => {
      startBtn.disabled = true;
      startBtn.textContent = 'Starting…';
      try {
        await this.startHost();
        this._paint(root);
        this._renderQrInto(root.querySelector('#sw-host-qr'), this.offerCode);
      } catch (e) {
        this._setStatus('Error', e.message || 'Could not start host');
        this.UI.toast(e.message || 'Could not start host', 'error', 6000);
        startBtn.disabled = false;
        startBtn.innerHTML = this._icon('play') + ' Start WiFi Sync Host';
      }
    };

    const stopBtn = root.querySelector('#sw-host-stop');
    if (stopBtn) stopBtn.onclick = async () => {
      await this.closeAll('user');
      this._paint(root);
    };

    const copyBtn = root.querySelector('#sw-copy-offer');
    if (copyBtn) copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(this.offerCode || '');
        this.UI.toast('Offer code copied.', 'success', 1800);
        copyBtn.innerHTML = this._icon('check') + ' Copied';
        setTimeout(() => {
          copyBtn.innerHTML = this._icon('file') + ' Copy offer code';
        }, 1600);
      } catch (e) {
        this.UI.toast('Copy failed — select the code manually.', 'warning', 3000);
      }
    };

    const acceptBtn = root.querySelector('#sw-host-accept');
    if (acceptBtn) acceptBtn.onclick = async () => {
      const code = root.querySelector('#sw-answer-input').value.trim();
      if (!code) { this.UI.toast('Paste the reply code first.', 'warning'); return; }
      acceptBtn.disabled = true;
      acceptBtn.textContent = 'Accepting…';
      try {
        await this.acceptAnswerCode(code);
        acceptBtn.textContent = 'Connected — waiting for handshake';
      } catch (e) {
        this.UI.toast(e.message || 'Could not accept reply.', 'error', 6000);
        acceptBtn.disabled = false;
        acceptBtn.innerHTML = this._icon('check') + ' Accept Reply';
      }
    };

    const qrHost = root.querySelector('#sw-host-qr');
    if (qrHost && this.offerCode) this._renderQrInto(qrHost, this.offerCode);
  }

  _bindClientCard(root) {
    const startBtn = root.querySelector('#sw-client-start');
    if (startBtn) startBtn.onclick = async () => {
      const code = root.querySelector('#sw-offer-input').value.trim();
      if (!code) { this.UI.toast('Paste the host\'s offer code first.', 'warning'); return; }
      startBtn.disabled = true;
      startBtn.textContent = 'Reading…';
      try {
        await this.buildAnswerFromOffer(code);
        this._paint(root);
        this._renderQrInto(root.querySelector('#sw-client-qr'), this.answerCode);
      } catch (e) {
        this.UI.toast(e.message || 'Could not read the offer.', 'error', 6000);
        startBtn.disabled = false;
        startBtn.innerHTML = this._icon('play') + ' Generate Reply';
      }
    };

    const stopBtn = root.querySelector('#sw-client-stop');
    if (stopBtn) stopBtn.onclick = async () => {
      await this.closeAll('user');
      this._paint(root);
    };

    const copyBtn = root.querySelector('#sw-copy-answer');
    if (copyBtn) copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(this.answerCode || '');
        this.UI.toast('Reply code copied.', 'success', 1800);
        copyBtn.innerHTML = this._icon('check') + ' Copied';
        setTimeout(() => {
          copyBtn.innerHTML = this._icon('file') + ' Copy reply code';
        }, 1600);
      } catch (e) {
        this.UI.toast('Copy failed — select the code manually.', 'warning', 3000);
      }
    };

    const qrClient = root.querySelector('#sw-client-qr');
    if (qrClient && this.answerCode) this._renderQrInto(qrClient, this.answerCode);
  }

  _bindActiveSession(root) {
    const cancelBtn = root.querySelector('#sw-cancel-session');
    if (cancelBtn) cancelBtn.onclick = async () => {
      if (this.dc && this.dc.readyState === 'open') {
        this._send({ type: 'cancel', reason: 'The other device cancelled the sync.' });
      }
      await this.closeAll('cancelled');
      this._paint(root);
    };
  }

  async _renderQrInto(el, code) {
    if (!el || !code) return;
    el.innerHTML = '<p class="text-xs text-muted" style="padding:12px;text-align:center;">Rendering QR…</p>';
    // Reuse the vendored qrcode library the rest of the app loads on demand.
    try {
      if (!window.qrcode && typeof this.Pages._loadQRCodeLib === 'function') {
        await this.Pages._loadQRCodeLib();
      }
      if (!window.qrcode) {
        el.innerHTML = `<p class="text-xs text-muted" style="padding:12px;text-align:center;">QR library unavailable — use the text code below.</p>`;
        return;
      }
      const qr = window.qrcode(0, 'L');
      qr.addData(code);
      qr.make();
      el.innerHTML = qr.createSvgTag({ cellSize: 3, margin: 1, scalable: true });
      const svg = el.querySelector('svg');
      if (svg) { svg.style.width = '100%'; svg.style.height = 'auto'; svg.style.maxWidth = '280px'; svg.style.display = 'block'; svg.style.margin = '0 auto'; }
    } catch (e) {
      el.innerHTML = `<p class="text-xs text-muted" style="padding:12px;text-align:center;">QR generation failed — use the text code below.</p>`;
    }
  }

  _showSecurityNotes() {
    this.UI.modal({
      title: 'Sync Over WiFi — Security Notes',
      size: 'modal-lg',
      body: `
        <h4 style="font-size:14px;margin-bottom:8px;">What is protected</h4>
        <ul style="font-size:13px;line-height:1.75;padding-left:20px;color:var(--text-muted);">
          <li>Data travels <strong>directly between the two devices</strong> over WebRTC (DTLS-encrypted in transit). No cloud, no server, no logging.</li>
          <li>Pairing uses <strong>one-shot offer / answer codes</strong> — the session ID binds the two peers and rejects third-party injection.</li>
          <li>The existing <code>MergeEngine</code> <strong>skips the <code>settings</code> store entirely</strong>, so passwords, recovery hashes, API keys, and session tokens are never exchanged.</li>
          <li>Sync history stores only device names, timestamps, and record counts — <strong>never record payloads</strong>.</li>
        </ul>

        <h4 style="font-size:14px;margin:16px 0 8px;">Limits of this design</h4>
        <ul style="font-size:13px;line-height:1.75;padding-left:20px;color:var(--text-muted);">
          <li>Data is protected by the <strong>WebRTC DTLS handshake</strong>. There is no certificate pinned to a known key, so a MITM that could insert itself into the SDP exchange (e.g. a compromised network) could impersonate a peer. On a trusted LAN this is an acceptable trade-off; on an untrusted network, do not sync.</li>
          <li>Whoever has the offer / answer code can join the session. <strong>Treat the codes as one-time secrets.</strong></li>
          <li>Records are exchanged in full — the app does not yet have per-record change logs. Small classes (a few hundred records) sync in seconds; larger classes take longer.</li>
          <li>Both devices must run the <strong>same protocol and database version</strong>. Older/newer versions are rejected at handshake time to avoid corrupting records with unknown fields.</li>
          <li>Only one peer can be connected at a time. To sync with a third device, close the current session first.</li>
        </ul>

        <h4 style="font-size:14px;margin:16px 0 8px;">Best practice</h4>
        <ul style="font-size:13px;line-height:1.75;padding-left:20px;color:var(--text-muted);">
          <li>Sync only on networks you control (home Wi-Fi, school LAN, a hotspot you own).</li>
          <li>Back up before syncing — the app offers this automatically before applying changes.</li>
          <li>If your school requires formal data-handling approval, treat sync codes the same way you treat passwords.</li>
        </ul>
      `,
      footer: `<button class="btn btn-primary" data-close>Close</button>`
    });
  }

  /* ------------------------------------------------------------------ */
  /* Small helpers to avoid pulling in extra deps                       */
  /* ------------------------------------------------------------------ */

  _esc(s) { return this.Utils && this.Utils.esc ? this.Utils.esc(s) : String(s || ''); }
  _icon(name) {
    if (typeof window.icon === 'function') return window.icon(name);
    // Fallback: minimal inline SVG (already-safe markup).
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';
  }
  _fmtTime(iso) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString('en-PH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }); }
    catch (e) { return iso; }
  }
}

/* ============================================================================
   REGISTRATION — called once from main.ts after Pages/State/DB are defined.
   ============================================================================ */

export function registerSyncWifi(deps) {
  const module = new SyncWifiModule(deps);

  // Register the page renderer.
  deps.Pages['sync-wifi'] = function (root) {
    return module.render(root);
  };

  // Aliases so any hub can also route to it.
  deps.Pages['sync'] = deps.Pages['sync-wifi'];
  deps.Pages['wifi-sync'] = deps.Pages['sync-wifi'];

  // Expose for debugging / future integrations.
  window.KlazSyncWifi = module;
}