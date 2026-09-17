import { openDB } from 'idb';

const DB_NAME = 'emergency-app-db';
const DB_VERSION = 1;
const STATUS_STORE = 'status-reports';
const SOS_STORE = 'sos-incidents';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STATUS_STORE)) {
        db.createObjectStore(STATUS_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(SOS_STORE)) {
        db.createObjectStore(SOS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveOfflineStatus = async (statusReport) => {
  const db = await initDB();
  const tx = db.transaction(STATUS_STORE, 'readwrite');
  await tx.store.add({ ...statusReport, offlineTimestamp: Date.now() });
  await tx.done;
};

export const getOfflineStatuses = async () => {
  const db = await initDB();
  return db.getAll(STATUS_STORE);
};

export const deleteOfflineStatus = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STATUS_STORE, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};

export const saveOfflineSOS = async (incident) => {
  const db = await initDB();
  const tx = db.transaction(SOS_STORE, 'readwrite');
  await tx.store.add({ ...incident, offlineTimestamp: Date.now() });
  await tx.done;
};

export const getOfflineSOS = async () => {
  const db = await initDB();
  return db.getAll(SOS_STORE);
};

export const deleteOfflineSOS = async (id) => {
  const db = await initDB();
  const tx = db.transaction(SOS_STORE, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};
