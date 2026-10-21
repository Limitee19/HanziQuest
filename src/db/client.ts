import Database from '@tauri-apps/plugin-sql';
import initSqlJsAsm from 'sql.js/dist/sql-asm.js';

let dbInstance: Database | null = null;
let isTauriEnv = false;

// Web SQLite in-memory / local storage database instance (for browser preview)
let webDbPromise: Promise<any> | null = null;
let webDb: any = null;

// Dynamic sync callback reference to avoid circular dependencies
let syncHook: ((table: string, record: any, action: 'upsert' | 'delete') => Promise<void>) | null = null;

export function registerSyncHook(hook: (table: string, record: any, action: 'upsert' | 'delete') => Promise<void>) {
  syncHook = hook;
}

export function setApplyingCloudSync(_active: boolean) {
  // Deprecated: Internal cloud sync already explicitly passes skipSyncHook = true
}

export function isWebFallbackMode(): boolean {
  return !isTauriEnv;
}

export async function isNativeSqliteAvailable(): Promise<boolean> {
  await getDb();
  return isTauriEnv;
}

export async function getDb(): Promise<Database | null> {
  if (dbInstance) return dbInstance;
  try {
    // Attempt to load Tauri native SQLite plugin
    dbInstance = await Database.load('sqlite:mandarin.db');
    isTauriEnv = true;
    return dbInstance;
  } catch {
    isTauriEnv = false;
    return null;
  }
}

const IDB_NAME = 'plm_mandarin_db_store';
const IDB_STORE = 'sqlite_snapshots';
const IDB_KEY = 'wasm_db_binary';

function openSnapshotDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadSnapshotBinary(): Promise<Uint8Array | null> {
  try {
    const idb = await openSnapshotDb();
    return new Promise((resolve) => {
      const tx = idb.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => resolve(req.result instanceof Uint8Array ? req.result : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    try {
      const saved = localStorage.getItem('plm_mandarin_wasm_db');
      if (saved) {
        return Uint8Array.from(atob(saved), (c) => c.charCodeAt(0));
      }
    } catch {}
    return null;
  }
}

async function saveSnapshotBinary(bytes: Uint8Array): Promise<void> {
  try {
    const idb = await openSnapshotDb();
    const tx = idb.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(bytes, IDB_KEY);
  } catch {
    try {
      if (bytes.length < 4 * 1024 * 1024) {
        let binary = '';
        const chunk = 8192;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
        }
        localStorage.setItem('plm_mandarin_wasm_db', btoa(binary));
      }
    } catch {}
  }
}

async function getWebSqliteDb(): Promise<any> {
  if (webDb) return webDb;
  if (!webDbPromise) {
    webDbPromise = (async () => {
      try {
        const SQL = await initSqlJsAsm();
        const binary = await loadSnapshotBinary();
        if (binary && binary.length > 0) {
          try {
            webDb = new SQL.Database(binary);
          } catch {
            webDb = new SQL.Database();
          }
        } else {
          webDb = new SQL.Database();
        }
        return webDb;
      } catch (err) {
        console.error('Failed to init Web SQLite with sql.js:', err);
        return null;
      }
    })();
  }
  return webDbPromise;
}

function saveWebDbSnapshot(db: any) {
  try {
    const data = db.export();
    const bytes = new Uint8Array(data);
    saveSnapshotBinary(bytes).catch((err) => {
      console.warn('Failed to save snapshot to IndexedDB:', err);
    });
  } catch (err) {
    console.warn('Failed to export web SQLite database:', err);
  }
}

let snapshotTimer: any = null;
let pendingSaveDb: any = null;

export function scheduleWebDbSnapshot(db: any, delayMs = 600) {
  pendingSaveDb = db;
  if (snapshotTimer) clearTimeout(snapshotTimer);
  snapshotTimer = setTimeout(() => {
    snapshotTimer = null;
    if (pendingSaveDb) {
      saveWebDbSnapshot(pendingSaveDb);
      pendingSaveDb = null;
    }
  }, delayMs);
}

export async function flushWebDbSnapshot(): Promise<void> {
  if (snapshotTimer) {
    clearTimeout(snapshotTimer);
    snapshotTimer = null;
  }
  if (pendingSaveDb) {
    saveWebDbSnapshot(pendingSaveDb);
    pendingSaveDb = null;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (pendingSaveDb) {
      saveWebDbSnapshot(pendingSaveDb);
      pendingSaveDb = null;
    }
  });
}

export async function executeSql(query: string, bindParams: any[] = [], skipSyncHook = false): Promise<void> {
  const db = await getDb();
  if (db && isTauriEnv) {
    await db.execute(query, bindParams);
  } else {
    // Web fallback execution with real SQLite (sql.js)
    const wdb = await getWebSqliteDb();
    if (wdb) {
      try {
        const cleanParams = (bindParams || []).map((p) => (p === undefined ? null : p));
        if (cleanParams.length > 0) {
          wdb.run(query, cleanParams);
        } else {
          wdb.run(query);
        }
        scheduleWebDbSnapshot(wdb, 600);
      } catch (err) {
        console.warn('Web SQLite execute error:', err, { query: query.slice(0, 80) });
      }
    }
  }

  // Asynchronously notify sync engine of data mutations
  if (syncHook && !skipSyncHook && isMutationQuery(query)) {
    handleMutationSync(query, bindParams).catch((err) => {
      console.warn('Mutation sync hook warning:', err);
    });
  }
}

export async function selectSql<T = any>(query: string, bindParams: any[] = []): Promise<T[]> {
  const db = await getDb();
  if (db && isTauriEnv) {
    const result = await db.select<any>(query, bindParams);
    if (Array.isArray(result)) return result as T[];
    if (result && Array.isArray((result as any).rows)) return (result as any).rows as T[];
    return [] as T[];
  } else {
    // Web fallback select with real SQLite (sql.js)
    const wdb = await getWebSqliteDb();
    if (wdb) {
      try {
        const cleanParams = (bindParams || []).map((p) => (p === undefined ? null : p));
        const stmt = wdb.prepare(query);
        if (cleanParams.length > 0) {
          stmt.bind(cleanParams);
        }
        const rows: any[] = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows as T[];
      } catch (err) {
        console.warn('Web SQLite select error:', err, { query: query.slice(0, 80) });
        return [];
      }
    }
    return [];
  }
}

function isMutationQuery(query: string): boolean {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.startsWith('create ') || trimmed.startsWith('alter ') || trimmed.startsWith('drop ')) return false;
  if (trimmed.includes('sync_outbox')) return false;
  return (
    trimmed.startsWith('insert ') ||
    trimmed.startsWith('update ') ||
    trimmed.startsWith('delete ') ||
    trimmed.startsWith('replace ')
  );
}

async function handleMutationSync(query: string, bindParams: any[]): Promise<void> {
  if (!syncHook) return;
  const trimmed = query.trim();

  // 1. Check for DELETE
  const deleteMatch = trimmed.match(/^delete\s+from\s+([a-zA-Z0-9_]+)(?:\s+where\s+([a-zA-Z0-9_]+)\s*=\s*\?)?/i);
  if (deleteMatch) {
    const table = deleteMatch[1].toLowerCase();
    const whereCol = (deleteMatch[2] || 'id').toLowerCase();
    const id = bindParams[0];
    if (id) {
      if (whereCol === 'id' || whereCol === 'key') {
        await syncHook(table, id, 'delete');
      } else {
        await syncHook(table, { [whereCol]: id, _deleteByCol: whereCol }, 'delete');
      }
    }
    return;
  }

  // 2. Check for INSERT or REPLACE
  const insertMatch = trimmed.match(/^(?:insert\s+or\s+replace\s+into|insert\s+into|replace\s+into)\s+([a-zA-Z0-9_]+)/i);
  if (insertMatch) {
    const table = insertMatch[1].toLowerCase();
    const idParam = bindParams[0];

    if (idParam && typeof idParam === 'string') {
      const idCol = table === 'app_metadata' ? 'key' : 'id';
      const rows = await selectSql(`SELECT * FROM ${table} WHERE ${idCol} = ? LIMIT 1;`, [idParam]);
      if (rows && rows.length > 0) {
        await syncHook(table, rows[0], 'upsert');
      }
    }
    return;
  }

  // 3. Check for UPDATE
  const updateMatch = trimmed.match(/^update\s+([a-zA-Z0-9_]+)/i);
  if (updateMatch) {
    const table = updateMatch[1].toLowerCase();
    const idParam = bindParams[bindParams.length - 1];

    if (idParam && typeof idParam === 'string') {
      const idCol = table === 'app_metadata' ? 'key' : 'id';
      const rows = await selectSql(`SELECT * FROM ${table} WHERE ${idCol} = ? LIMIT 1;`, [idParam]);
      if (rows && rows.length > 0) {
        await syncHook(table, rows[0], 'upsert');
      }
    }
  }
}
