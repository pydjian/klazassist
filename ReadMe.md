<div align="center">

<img src="./icon/icon.svg" alt="KlazAssist" width="120" height="120">

# KlazAssist

**Simplify Teaching. Empower Learning.**

An offline-first classroom management toolkit built for Filipino teachers.

[![Version](https://img.shields.io/badge/version-2.0.0-0038A8?style=flat-square)](https://github.com/pydjian/klazassist/releases)
[![License](https://img.shields.io/badge/license-Proprietary-F7C948?style=flat-square)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web-0891B2?style=flat-square)](#-browser-support)
[![Offline First](https://img.shields.io/badge/offline-first-198754?style=flat-square)](#-privacy--data-ownership)
[![DepEd Aligned](https://img.shields.io/badge/DepEd-DO%20015%2C%20s.%202026-7C3AED?style=flat-square)](#-grading-engine)
[![Made in PH](https://img.shields.io/badge/made%20in-Philippines%20%F0%9F%87%B5%F0%9F%87%AD-BE185D?style=flat-square)](#-about-the-developer)

[Features](#-features) · [Quick Start](#-quick-start) · [Screenshots](#-screenshots) · [Roadmap](#-roadmap) · [Contributing](#-contributing) · [Support](#-support)

</div>

---

## 📖 What is KlazAssist?

KlazAssist is a **fully offline, single-page classroom management application** designed from the ground up for Philippine public school teachers. It bundles attendance, grades, seating, lesson planning, and interactive teaching tools into one installable web app — with **zero servers, zero analytics, and zero tracking**.

Every byte of learner data lives on the teacher's own device, stored in the browser's IndexedDB. The app works with no internet connection, requires no account signup, and never phones home.

> **Not an official DepEd system.** KlazAssist is an independent tool built by a teacher, for teachers. It is aligned with DepEd policies (see [Grading Engine](#-grading-engine)) but is not endorsed by or affiliated with the Department of Education.

---

## ✨ Features

### 🏫 My Class
- **Class Profile** — hero dashboard with class health score, attendance trend, grade distribution, timeline, and comparison to previous school year
- **Learners** — filterable, sortable roster with photo grid, bulk actions, and full SF1-compatible fields
- **Seating Arrangement** — MS-Word-style grid with drag-to-resize rows/columns, block seats, group tables, and front-of-classroom orientation toggle
- **Groups** — save and reuse learner groupings for lab work, projects, or reading circles

### 📋 Attendance
- **Daily Attendance** — Present / Absent / Late / Excused with per-learner notes
- **History** — full record with per-day summary and rate
- **Analytics** — status distribution, per-learner breakdown, attendance rate trend
- **Reports** — daily / summary / per-learner, printable or exportable

### 📚 Class Management
- **Class Schedule** — weekly timetable with Quick Fill and day-copy features
- **Homework / Assignments** — due dates, overdue tracking, dashboard integration
- **Behavior / Discipline Log** — observation-based, with action and follow-up fields
- **Parent / Guardian Notes** — communication log with method, concern, and follow-up

### 📝 Grading & Assessment
- **Gradebook** — spreadsheet-style entry with per-term weight awareness, live computation, and column resizing
- **Assessment Builder** — multi-question assessments with multiple choice, T/F, identification, short answer
- **Quiz Manager** — practice mode + Learners View for projecting to the class
- **Item Analysis** — difficulty index per question (Very Easy → Very Difficult)
- **Class Performance** — descriptor distribution, trend line, category breakdown, attendance-grade correlation
- **Learner Performance** — per-learner trend, at-risk flag, rank, detail modal with weighted breakdown

### 🎓 School Forms (Pro)
- **SF1 — School Register** — exports to `.xlsx` matching DepEd LIS layout, with auto-totaled male/female/combined rows
- **SF2 — Daily Attendance Report** — monthly grid with configurable attendance codes
- **SF9 — Learner's Performance Report** — pixel-faithful A5 back-to-back or A4 landscape, Bookman Old Style, editable per-term grades and MAPEH auto-computation

### 🧰 Teaching Tools
- **Wheel of Names** — animated SVG wheel with optional recitation timer, auto-remove winners, and sound alerts
- **Random Student Picker** — fair picker that avoids repeats until the whole class has been called
- **Timer & Stopwatch** — countdown presets plus stopwatch with hundredths
- **Randomizer** — random numbers, D4–D20 dice, coin flip, and yes/no decisions
- **Noise Meter** — real-time microphone visualizer with bouncy balls (6 themes) or classic meter
- **Classroom Signal** — noise-level display for the projector

All six tools have a **Learners View** button that opens a chrome-free window for a projector or second screen.

### 📅 Lesson & Planning (Pro)
- **AI Lesson Planner** — generates DepEd ILAW weekly matrices across multiple sessions using Google Gemini
- **TOS & Exam Generator** — builds a Table of Specifications, then generates a full exam with answer key and rubrics
- **PowerPoint Generator** — converts a lesson plan into a ready-to-present `.pptx` with AI-generated illustrations
- **Weekly Planner** — Monday–Saturday grid with customizable time slots
- **Calendar** — meetings, exams, activities, personal reminders, and official DepEd calendar integration

### 📄 Documents & Reports (Pro)
- **Class List** — six print layouts (Standard, Detailed, With Photos, Guardian Contact, Sign-in Sheet, Seating Reference)
- **Masterlist** — every learner across all classes with duplicate-LRN detection
- **Grade Summary** — per-subject and all-subject views with General Weighted Average
- **Printable Reports** — one central hub for every printable document
- **Export Center** — JSON backup, CSV export, SF1 export, and restore

### 🔒 Security
- **Local application lock** with PBKDF2-SHA256 password hashing (adaptive iterations)
- **Auto-lock on inactivity** (5 min to never)
- **Recovery key** for offline password reset
- **Persistent storage request** to protect against browser eviction
- **Zero data transmission** — every byte stays on device

---

## 🔐 Privacy & Data Ownership

KlazAssist was built on a simple principle: **learner data belongs to the teacher, not a cloud vendor.**

| What most apps do | What KlazAssist does |
|---|---|
| Upload learner records to a server | Store everything in IndexedDB on the device |
| Track analytics and usage | Send nothing, track nothing |
| Require an account signup | Offer a local application lock instead |
| Push updates that change behavior silently | Ship all logic in one bundle — no surprise changes |
| Sync between devices via a backend | Provide JSON backup + restore |

**The one exception:** AI features (Lesson Planner, TOS Generator, PowerPoint Generator) send *only the text you paste or the lesson plan you upload* to Google's Gemini API — and only when you click Generate. **Learner names, grades, and personal data are never included in AI requests.**

See [SECURITY.md](./SECURITY.md) for the full threat model.

---

## 🚀 Quick Start

### For Teachers (end users)

KlazAssist runs in any modern browser. You have two options:

**Option 1 — Use the hosted version** *(no installation required)*
```
https://pydjian.github.io/klazassist/
```

**Option 2 — Install as a PWA** *(recommended for daily use)*
1. Open the app in Chrome, Edge, or Safari
2. Click the install icon in the address bar (or Share → Add to Home Screen on iOS)
3. Launch from your home screen — the app now works fully offline and is protected from browser eviction

> 📖 **New here?** Read the [Quick Start Guide](./docs/QUICKSTART.md) — a 10-minute walkthrough that covers account setup, adding learners, and recording attendance.

### For Developers

```bash
# Clone the repository
git clone https://github.com/pydjian/klazassist.git
cd klazassist

# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## 🧠 Grading Engine

KlazAssist implements **DepEd Order No. 015, s. 2026** — the *Revised Guidelines on Classroom Assessment, Grading System, and Awards and Recognition for the K to 12 Basic Education Program*, effective SY 2026-2027.

### Supported policies

| Policy | School Year | Term structure | Transmutation |
|---|---|---|---|
| **DO 015, s. 2026** (default) | 2026-2027 | Three terms | Adjusted transition table |
| **DO 8, s. 2015** (legacy) | 2015–2026 | Four quarters | Original table |
| **Zero-Based** (placeholder) | 2027-2028+ | Three terms | None — direct reporting |

Each class is *pinned* to the policy version in force when it was created. Historical grades always recompute against the rules that were actually applied at the time — they never silently change when policy updates ship.

### Weighted components

Weights vary by key stage and subject classification, honouring DO 015's per-subject bands:

| Key Stage | Core subjects | EPP / TLE / MAPEH | SHS (varies by subject) |
|---|---|---|---|
| KS1 (K–3) | WW 20% · PT 50% · EX 30% | WW 20% · PT 60% · EX 20% | — |
| KS2 (4–6) | WW 20% · PT 50% · EX 30% | WW 20% · PT 60% · EX 20% | — |
| KS3 (7–10) | WW 20% · PT 50% · EX 30% | WW 20% · PT 60% · EX 20% | — |
| KS4 (11–12) | — | — | 6 distinct classifications |

**WW** = Written/Oral Works · **PT** = Product/Performance Tasks · **EX** = Examinations (with ST1 30% + ST2 30% + TE 40% substructure)

### Descriptor bands

| Grade | Label |
|---|---|
| 90–100 | Advancing |
| 80–89 | Benchmarking |
| 75–79 | Connecting |
| 65–74 | Developing |
| 60–64 | Emerging |

> **Verification note:** The three-term / WW-PT-EX structure and per-subject weights are corroborated across multiple independent sources. The **descriptor labels and adjusted transmutation table** were supplied directly by the school and are encoded as given — not independently re-derived from the primary DepEd PDF. See `GRADING_POLICIES` in `src/main.ts` for full sourcing notes.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Language** | TypeScript 5 |
| **Build** | Vite |
| **Rendering** | Vanilla DOM + SVG + Canvas |
| **Storage** | IndexedDB (client-side) |
| **Crypto** | Web Crypto API (PBKDF2-SHA256, Ed25519, SHA-256) |
| **AI** | Google Gemini API (opt-in) |
| **Email** | Web3Forms (opt-in) or mailto: |
| **PDF parsing** | pdf.js |
| **DOCX parsing** | mammoth.js |
| **PPTX writing** | PptxGenJS |
| **XLSX** | Native, dependency-free (custom ZIP + XML writer) |

**No framework, no runtime, no node_modules in production.** The built app is a single self-contained HTML + JS + CSS bundle.

---

## 📁 Project Structure

```
klazassist/
├── index.html                  # App shell
├── style.css                   # All application styles
├── src/
│   ├── main.ts                 # Application logic (~30k lines)
│   └── deped-calendar.ts       # Bundled DepEd School Calendar
├── icon/
│   ├── icon.svg                # App logo
│   ├── deped.webp              # DepEd seal (for reports)
│   └── author.png              # Developer photo (About page)
├── docs/
│   ├── QUICKSTART.md           # End-user guide
│   ├── SECURITY.md             # Threat model + security notes
│   ├── GRADING.md              # Grading engine reference
│   └── screenshots/            # README images
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Configuration

KlazAssist works out of the box with zero configuration. The following are optional:

| Feature | Where to configure | Notes |
|---|---|---|
| **AI features** (Lesson Planner, TOS, PPTX) | Settings → API Configuration | Requires a [Google AI Studio](https://aistudio.google.com/app/apikey) API key (free tier available) |
| **Background email** | Settings → Security → Email Sending | Optional [Web3Forms](https://web3forms.com) access key (250 emails/month free) |
| **Pro license** | Settings → License | Activate a purchased key for AI tools + DepEd forms |
| **School profile** | Settings → School Profile | Used on printed reports (school name, ID, division, head) |

**API keys are stored only on your device** in IndexedDB. They are never sent to KlazAssist developers or any third party.

---

## 🌐 Browser Support

| Browser | Minimum | Notes |
|---|---|---|
| Chrome / Edge | 105+ | Full support, PWA install supported |
| Firefox | 110+ | Full support |
| Safari (macOS) | 16.4+ | Full support, but see Safari notice below |
| Safari (iOS) | 16.4+ | Must be installed to Home Screen to avoid 7-day data eviction |
| Chromium-based (Brave, Vivaldi) | Latest | Full support |

**Safari specific:** Safari deletes best-effort IndexedDB storage after 7 days of inactivity. KlazAssist detects this and offers a guided install-to-home-screen flow on first run.

**Not supported:** Internet Explorer, Opera Mini, browsers with IndexedDB disabled (private/incognito mode).

---

## 🗺️ Roadmap

Planned improvements, roughly in priority order:

### Near term
- [ ] Attendance ↔ grade correlation in Grade Summary
- [ ] Bulk photo upload with auto-cropping
- [ ] Class-to-class learner transfer
- [ ] Offline QR attendance scanning

### Medium term
- [ ] Multi-class Gradebook (single view across sections)
- [ ] Curriculum-aligned content library
- [ ] Learner portfolio exports (PDF compilation)
- [ ] Optional sync between devices via a user-supplied cloud folder

### Long term
- [ ] Native mobile wrappers (Capacitor)
- [ ] School-tier license (multi-teacher dashboard for school heads)
- [ ] DepEd LIS integration (when/if an API becomes available)

> **Have an idea?** Open a [feature request](https://github.com/pydjian/klazassist/issues/new?labels=enhancement).

---

## 🤝 Contributing

KlazAssist is currently a **solo project**, but contributions are welcome. Before opening a PR:

1. **Open an issue first** — describe what you want to change and why. Large PRs without prior discussion may be closed.
2. **Keep it offline-first** — no new server dependencies, no cloud storage, no analytics.
3. **Respect learner privacy** — never introduce code paths that transmit learner data without an explicit, informed opt-in.
4. **Match the code style** — no build-step framework introduction, no TypeScript strict-mode violations.
5. **Test on `file://` and `http://`** — KlazAssist is often loaded from a USB stick or a local server.

### Development workflow

```bash
# Fork the repo, then clone your fork
git clone https://github.com/YOUR-USERNAME/klazassist.git
cd klazassist
git checkout -b feature/your-feature-name

# Make your changes, then
npm run dev          # verify everything works
npm run build        # verify the production build succeeds

# Commit and push
git add .
git commit -m "Add: short description of your feature"
git push origin feature/your-feature-name
```

Then open a Pull Request against `main`. Please include:
- A short description of the change
- Screenshots for UI changes
- A note on which browsers you tested

### Code of conduct

Be kind. Assume good faith. This project exists to help teachers — the tone of its community should reflect that.

---

## 🐛 Reporting Bugs

Found a bug? [Open an issue](https://github.com/pydjian/klazassist/issues/new?labels=bug) with:

- **What you did** — steps to reproduce
- **What you expected** — the intended behavior
- **What happened** — the actual result, including any console errors (`F12` → Console tab)
- **Environment** — browser name/version, OS, whether you installed as PWA

> **⚠️ Security issues:** Do **not** open a public issue. Email `pydjian@gmail.com` directly. See [SECURITY.md](./SECURITY.md) for the disclosure policy.

---

## 💖 Support

KlazAssist is free for the core classroom features and always will be. If you find it useful:

- ⭐ **Star this repository** — helps other teachers find it
- 🐛 **Report bugs** — makes the app better for everyone
- 📣 **Share with colleagues** — especially if you're in a DepEd school
- 💳 **Buy a Pro license** — unlocks AI tools and DepEd school forms, funds ongoing development
- ☕ **Buy me a coffee** — [raket.ph/pydjian](https://www.raket.ph/pydjian)

---

## 📜 License

**Proprietary.** See [LICENSE](./LICENSE) for full terms.

**Free tier** (no license required) — Attendance, Gradebook, Learners, Seating, Groups, Teaching Tools, Notes, Calendar, Behavior Logs, Parent Logs. Free forever, including for commercial and institutional use.

**Pro tier** (one-time purchase) — AI Lesson Planner, TOS & Exam Generator, PowerPoint Generator, SF1 / SF2 / SF9, Grade Summary / GWA, Item Analysis, Export Center, Printable Reports. Per-teacher license; see [Settings → License](./docs/LICENSE.md) for device activation terms.

**Not permitted without written permission:** redistribution, resale, removing license gating, or offering KlazAssist as a hosted service.

For licensing inquiries (schools, divisions, bulk keys): `pydjian@gmail.com`.

---

## 🧑‍💻 About the Developer

<div align="center">

<img src="./icon/author.png" alt="Wilfred John C. Ortinero" width="120" style="border-radius: 50%;">

### Wilfred John C. Ortinero
**Developer · KlazAssist**

*"I built KlazAssist because I was tired of juggling five spreadsheets, a paper attendance book, and a phone full of sticky notes. Every teacher deserves better tools — and every learner deserves their data to stay private."*

[📧 pydjian@gmail.com](mailto:pydjian@gmail.com) · [📘 /pydjian](https://www.facebook.com/pydjian) · [📱 +63 926 390 728](tel:+63926390728)

</div>

---

## 🙏 Acknowledgements

- **DepEd Philippines** for publishing policies that make automated grading possible
- **Google AI Studio** for making Gemini accessible to individual teachers
- **The open-source community** — pdf.js, mammoth.js, PptxGenJS, and every library that made this app possible
- **Every teacher who tested a beta build** and sent back a bug report at 11 PM

---

<div align="center">

**KlazAssist** · v2.0.0 · © 2026 pydjianPH

*Simplify Teaching. Empower Learning.*

🇵🇭 Made with care in the Philippines 🇵🇭

</div>
