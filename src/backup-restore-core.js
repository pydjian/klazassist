/**
 * Pure backup validation and restore planning. Kept free of DOM and IndexedDB
 * dependencies so it can be regression-tested with Node's built-in test runner.
 */
export function prepareRestoreData(data, stores) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid backup data: expected a snapshot with a data object.');
  }
  if (!Array.isArray(stores) || stores.length === 0) {
    throw new Error('No application stores are configured for restore.');
  }

  const normalized = Object.create(null);
  const presentStores = [];
  const missingStores = [];

  for (const store of stores) {
    if (!Object.prototype.hasOwnProperty.call(data, store) || data[store] === undefined || data[store] === null) {
      missingStores.push(store);
      continue;
    }
    const records = data[store];
    if (!Array.isArray(records)) {
      throw new Error(`Invalid backup data for "${store}" — expected an array.`);
    }
    const seenIds = new Set();
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      if (!record || typeof record !== 'object' || Array.isArray(record) ||
          record.id === undefined || record.id === null || String(record.id).trim() === '') {
        throw new Error(`Invalid record found in "${store}" at position ${index + 1}: every record must have an ID.`);
      }
      const id = String(record.id);
      if (seenIds.has(id)) throw new Error(`Duplicate record ID "${id}" found in "${store}".`);
      seenIds.add(id);
    }
    normalized[store] = records;
    presentStores.push(store);
  }

  if (presentStores.length === 0) {
    throw new Error('This backup contains no recognized KlazAssist data stores. No data was changed.');
  }
  return { normalized, presentStores, missingStores };
}
