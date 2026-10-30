import { selectSql, executeSql, setApplyingCloudSync, isWebFallbackMode } from '@/db/client';
import { supabase, getAdminClient, getCurrentSession, updateMockSession } from './supabaseClient';
import { CloudSyncState, SyncOutboxItem, AuthSession } from './syncTypes';
import { syncAppLockFromDb } from '../mobile/appLockService';
import { isUserScopedTable, currentUserId } from '@/services/auth/accountScope';

export interface MigrationResult {
  success: boolean;
  message: string;
  tableCounts: Record<string, number>;
}

/**
 * Strip kolom pemisah akun (user_id/word_id/source) dari payload — dipakai
 * sebagai fallback sementara bila skrip SQL Supabase belum menambah kolom
 * tersebut sehingga upsert tetap berhasil (data lalu terbagi legacy sampai
 * kolom dibuat).
 */
function stripUnsyncableAccountCols(payload: any, table: string): any {
  if (!isUserScopedTable(table) && table !== 'chinese_program_progress') return payload;
  const strip = (obj: any) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
    const clean: Record<string, any> = { ...obj };
    delete clean.user_id;
    delete clean.word_id;
    delete clean.source;
    return clean;
  };
  return Array.isArray(payload) ? payload.map(strip) : strip(payload);
}

/** Saring baris cloud agar hanya milik akun aktif (baris legacy tanpa user_id diizinkan). */
function filterRowsForActiveUser(table: string, rows: any[]): any[] {
  if (!isUserScopedTable(table) && table !== 'chinese_program_progress') return rows;
  const uid = currentUserId();
  return (rows || []).filter((r) => !r || !r.user_id || r.user_id === uid);
}

export const ALL_SYNC_TABLES = [
  'app_metadata',
  'chinese_vocabularies',
  'chinese_practice_sessions',
  'chinese_program_progress',
  'chinese_program_settings',
  'chinese_program_log',
  'learning_decks',
  'flashcard_notes',
  'flashcard_cards',
  // NOTE: 'imported_media_assets' is intentionally NOT synced (see LOCAL_ONLY_TABLES) —
  // base64 Anki media blew the Supabase storage/egress quota (52MB).
  // Tabel kuliah/keuangan/produktivitas tidak dipush ke cloud lagi (cloud schema
  // tidak di-drop agar rollback mudah); 'imported_media_assets' tetap LOCAL_ONLY.
];

// Module-level sync state (offline / outbox / engine guards)
let lastSyncedTimestamp: string | null = null;
let memoryOutboxCount = 0;
let isOfflineMode = false;
let isSyncEngineStarted = false;

// 1. Upload/Push All Local SQLite Data to Supabase Cloud
export async function migrateLocalDataToSupabase(): Promise<MigrationResult> {
  const adminClient = getAdminClient();
  if (!adminClient) {
    return {
      success: false,
      message: 'Client Supabase belum dikonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env.local telah diisi.',
      tableCounts: {},
    };
  }

  const tableCounts: Record<string, number> = {};
  const errorLogs: string[] = [];

  try {

    for (const table of ALL_SYNC_TABLES) {
      let rows: any[] = [];
      try {
        rows = await selectSql(`SELECT * FROM ${table};`);
      } catch (sqlErr: any) {
        rows = [];
      }

      // Filter baris milik akun aktif sebelum push ke cloud
      const filtered = isUserScopedTable(table)
        ? rows.filter((r) => !r.user_id || r.user_id === currentUserId())
        : rows;

      if (filtered && filtered.length > 0) {
        // Upsert in batches of 100 to avoid payload size limits
        const chunkSize = 100;
        let tableUploaded = 0;
        let hasError = false;

        for (let i = 0; i < filtered.length; i += chunkSize) {
          const chunk = filtered.slice(i, i + chunkSize);
          const clean = stripUnsyncableAccountCols(chunk, table);
          const { error } = await adminClient.from(table).upsert(clean);
          if (error) {
            console.error(`Supabase upsert error for table ${table}:`, error.message);
            errorLogs.push(`${table}: ${error.message}`);
            hasError = true;
            break;
          } else {
            tableUploaded += chunk.length;
          }
        }

        tableCounts[table] = hasError ? -1 : tableUploaded; // -1 signals error
      } else {
        tableCounts[table] = 0;
      }
    }

    const totalRows = Object.values(tableCounts).filter(v => v > 0).reduce((sum, count) => sum + count, 0);
    lastSyncedTimestamp = new Date().toISOString();

    // After successful upload, write a force_sync_version timestamp to app_metadata
    // so Android devices know they need to re-pull this data
    try {
      const syncVersion = new Date().toISOString();
      await adminClient.from('app_metadata').upsert([
        {
          key: 'force_sync_version',
          value: syncVersion,
          created_at: syncVersion,
          updated_at: syncVersion,
        },
      ]);
    } catch (versionErr) {
      console.warn('Could not write force_sync_version:', versionErr);
    }

    if (errorLogs.length > 0) {
      return {
        success: false,
        message: `Upload selesai dengan beberapa error. Berhasil: ${totalRows} baris.\n\nTabel yang gagal:\n${errorLogs.slice(0, 5).join('\n')}${errorLogs.length > 5 ? `\n...dan ${errorLogs.length - 5} tabel lain` : ''}\n\n⚠️ Kemungkinan penyebab: Skrip SQL belum dijalankan lengkap di Supabase SQL Editor. Jalankan seluruh supabase_schema.sql untuk mengaktifkan izin tabel.`,
        tableCounts,
      };
    }

    if (totalRows === 0) {
      return {
        success: true,
        message: `Belum ada data lokal yang ditemukan untuk diunggah (0 baris).`,
        tableCounts,
      };
    }

    return {
      success: true,
      message: `✅ Upload Berhasil! Total ${totalRows} baris dari ${ALL_SYNC_TABLES.length} tabel telah disinkronkan ke Supabase Cloud.`,
      tableCounts,
    };
  } catch (err: any) {
    console.error('Upload to cloud failed:', err);
    return {
      success: false,
      message: `Gagal Unggah: ${err?.message || 'Terjadi kesalahan jaringan'}`,
      tableCounts,
    };
  }
}

let isPullingInProgress = false;

const tableColumnCache = new Map<string, Set<string>>();

export async function safeUpsertSqliteRow(table: string, row: Record<string, any>): Promise<void> {
  let validCols = tableColumnCache.get(table);
  if (!validCols) {
    try {
      const info = await selectSql<{ name: string }>(`PRAGMA table_info(${table});`);
      if (info && info.length > 0) {
        validCols = new Set(info.map((c) => c.name));
        tableColumnCache.set(table, validCols);
      }
    } catch (err) {
      console.warn(`Failed to read PRAGMA table_info for ${table}:`, err);
      validCols = new Set();
    }
  }

  const filteredRow: Record<string, any> = {};
  for (const [key, val] of Object.entries(row)) {
    if (!validCols || validCols.size === 0 || validCols.has(key)) {
      filteredRow[key] = val;
    }
  }

  const columns = Object.keys(filteredRow);
  if (columns.length === 0) return;

  const idCol = table === 'app_metadata' ? 'key' : 'id';
  const idVal = filteredRow[idCol];

  const serializedRow: Record<string, any> = {};
  for (const [k, v] of Object.entries(filteredRow)) {
    serializedRow[k] = v !== null && typeof v === 'object' ? JSON.stringify(v) : v;
  }

  // Check if row has been deleted locally (tombstone protection against resurrection)
  if (idVal !== undefined) {
    try {
      const isDeleted = await selectSql<{ record_id: string }>(
        `SELECT record_id FROM deleted_records WHERE table_name = ? AND record_id = ? LIMIT 1;`,
        [table, String(idVal)]
      );
      if (isDeleted && isDeleted.length > 0) {
        // Record was deleted locally, ignore re-insert from cloud pull
        return;
      }
    } catch {}
  }

  // If row exists, perform partial UPDATE to preserve unmentioned columns
  if (idVal !== undefined) {
    try {
      const existing = await selectSql<{ [key: string]: any }>(
        `SELECT ${idCol} FROM ${table} WHERE ${idCol} = ? LIMIT 1;`,
        [idVal]
      );
      if (existing && existing.length > 0) {
        const updateCols = columns.filter((c) => c !== idCol);
        if (updateCols.length > 0) {
          const setClause = updateCols.map((c) => `${c} = ?`).join(', ');
          const updateValues = updateCols.map((c) => serializedRow[c]);
          await executeSql(
            `UPDATE ${table} SET ${setClause} WHERE ${idCol} = ?;`,
            [...updateValues, idVal],
            true
          );
          return;
        }
      }
    } catch {
      // Fallback to INSERT OR REPLACE below
    }
  }

  const placeholders = columns.map(() => '?').join(', ');
  const values = Object.values(serializedRow);

  await executeSql(
    `INSERT OR REPLACE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders});`,
    values,
    true
  );
}

// 2. Download/Pull All Supabase Cloud Data into Local SQLite (for Android or Secondary Desktop)
export async function pullCloudDataFromSupabase(): Promise<MigrationResult> {
  if (!supabase) {
    return {
      success: false,
      message: 'Client Supabase belum dikonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY telah diisi.',
      tableCounts: {},
    };
  }

  if (isPullingInProgress) {
    console.log('⏳ Pull already in progress, skipping duplicate request...');
    return {
      success: true,
      message: 'Sinkronisasi cloud sedang berjalan...',
      tableCounts: {},
    };
  }

  isPullingInProgress = true;
  setApplyingCloudSync(true);
  const tableCounts: Record<string, number> = {};
  const errorLogs: string[] = [];

  try {
    for (const table of ALL_SYNC_TABLES) {
      // EGRESS-SAFE: pull in pages of 500 rows instead of one giant SELECT *,
      // so huge tables (vocabularies, flashcards, media) don't produce massive
      // single responses that can time out and be retried (doubling egress).
      const PAGE_SIZE = 500;
      const cloudRows: any[] = [];
      let offset = 0;
      let pageError: string | null = null;

      while (true) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .range(offset, offset + PAGE_SIZE - 1);
        if (error) {
          pageError = error.message;
          break;
        }
        const page = data || [];
        // Saring baris cloud agar hanya milik akun aktif
        const filtered = filterRowsForActiveUser(table, page);
        cloudRows.push(...filtered);
        if (page.length < PAGE_SIZE) break;
        offset += PAGE_SIZE;
      }

      if (pageError) {
        console.warn(`Supabase select warning for ${table}:`, pageError);
        tableCounts[table] = 0;
        continue;
      }

      const idCol = table === 'app_metadata' ? 'key' : 'id';
      const cloudIdSet = new Set(cloudRows.map((r: any) => String(r[idCol] || r.id || r.key)).filter(Boolean));

      try {
        // 1. Reconcile: Purge local SQLite ghost rows that no longer exist in Supabase Cloud
        // SAFETY GUARD (egress limit / fresh empty project):
        // If the cloud returned ZERO rows for this table (e.g. brand-new/misconfigured
        // Supabase project, or egress quota blocked), treat that as "no cloud data yet"
        // and NEVER purge local rows — otherwise a pull against an empty project would
        // delete ALL local data. Only reconcile when the cloud actually has rows.
        if (cloudRows.length > 0) {
          const localRows = await selectSql<{ [key: string]: any }>(`SELECT ${idCol} FROM ${table};`);
          for (const loc of localRows) {
            const locId = String(loc[idCol]);
            if (locId && !cloudIdSet.has(locId)) {
              await executeSql(`DELETE FROM ${table} WHERE ${idCol} = ?;`, [locId], true);
            }
          }
        }

        // 2. Safe Upsert/Merge cloud rows into local SQLite
        for (const row of cloudRows) {
          await safeUpsertSqliteRow(table, row);
        }
        tableCounts[table] = cloudRows.length;
      } catch (localErr: any) {
        console.warn(`Local SQLite sync warning for ${table}:`, localErr);
        errorLogs.push(`${table}: ${localErr?.message || 'Sync error'}`);
        tableCounts[table] = 0;
      }
    }

    // Auto sync PIN and app lock configuration from freshly pulled app_metadata
    await syncAppLockFromDb();
    const totalRows = Object.values(tableCounts).reduce((sum, count) => sum + count, 0);
    lastSyncedTimestamp = new Date().toISOString();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('omnilife_db_updated', { detail: { action: 'pull' } }));
    }

    if (totalRows === 0) {
      return {
        success: true,
        message: `Tidak ada data yang ditemukan di Supabase Cloud untuk diunduh (0 baris).`,
        tableCounts,
      };
    }

    return {
      success: true,
      message: `Tarik Data Berhasil! Total ${totalRows} baris data dari Supabase Cloud telah disinkronkan.`,
      tableCounts,
    };
  } catch (err: any) {
    console.error('Pull from cloud failed:', err);
    return {
      success: false,
      message: `Gagal Tarik Data: ${err?.message || 'Terjadi kesalahan jaringan'}`,
      tableCounts,
    };
  } finally {
    setApplyingCloudSync(false);
    isPullingInProgress = false;
  }
}

// 3. Persistent SQLite Outbox Queue for Offline Mutations
export async function enqueueOutboxMutation(
  tableName: string,
  recordId: string,
  action: 'insert' | 'update' | 'delete',
  payload: any
): Promise<void> {
  try {
    const id = `out_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);

    await executeSql(
      `INSERT OR REPLACE INTO sync_outbox (id, table_name, record_id, action, payload, created_at) VALUES (?, ?, ?, ?, ?, ?);`,
      [id, tableName, recordId, action, payloadStr, now]
    );
    memoryOutboxCount++;
  } catch (err) {
    console.warn('Failed to enqueue outbox mutation:', err);
  }
}

// 4. Auto-Sync Single Record to Supabase with Offline Fallback

// EGRESS GUARD: Tables that must NEVER leave the device. Binary attachments
// can be megabytes each; pushing them on every mutation (and re-downloading
// them on every other device) would explode the Supabase egress quota.
// Local-first strategy: binaries stay local; only metadata/text syncs.
export const LOCAL_ONLY_TABLES = [
  'document_files',
  'imported_media_assets', // Anki media (audio/images base64) — local-only (52MB cloud bloat fix)
  'deleted_records',
  'ai_chat_messages',
];

export async function autoSyncRecordToSupabase(
  table: string,
  record: any,
  action: 'upsert' | 'delete' | undefined = 'upsert'
): Promise<void> {
  if (LOCAL_ONLY_TABLES.includes(table.toLowerCase())) return;

  const adminClient = getAdminClient();
  if (!adminClient || isOfflineMode) {
    const recordId = typeof record === 'string' ? record : record?.id || record?.key || 'unknown';
    await enqueueOutboxMutation(table, recordId, action === 'delete' ? 'delete' : 'update', record);
    return;
  }

  // Check network connectivity
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const recordId = typeof record === 'string' ? record : record?.id || record?.key || 'unknown';
    await enqueueOutboxMutation(table, recordId, action === 'delete' ? 'delete' : 'update', record);
    return;
  }

  try {
    if (action === 'delete') {
      if (typeof record === 'object' && record?._deleteByCol) {
        const customCol = record._deleteByCol;
        const customVal = record[customCol];
        if (customVal) {
          const { error } = await (adminClient.from(table as any) as any).delete().eq(customCol, customVal);
          if (error) throw error;
        }
        return;
      }

      const id = typeof record === 'string' ? record : record?.id || record?.key;
      if (id) {
        // Record in local deleted_records tombstone
        try {
          await executeSql(
            `INSERT OR REPLACE INTO deleted_records (table_name, record_id, deleted_at) VALUES (?, ?, ?);`,
            [table, String(id), new Date().toISOString()],
            true
          );
        } catch {}

        const idCol = table === 'app_metadata' ? 'key' : 'id';
        const { error } = await (adminClient.from(table as any) as any).delete().eq(idCol, id);
        if (error) throw error;
      }
    } else {
      let dataToUpsert = record;
      // If record is an object with an ID, check if we should fetch full row from SQLite to prevent partial column overwrite
      // OPT-OUT: callers may set _localOnlyPayload = true when they have deliberately
      // stripped volatile/large fields (e.g. base64 media) from the payload — the
      // full-row re-fetch would otherwise restore them and blow the egress budget.
      const skipFullRowFetch =
        typeof record === 'object' && record !== null && !Array.isArray(record) && (record as any)._localOnlyPayload === true;
      if (!skipFullRowFetch && typeof record === 'object' && record !== null && !Array.isArray(record)) {
        const idCol = table === 'app_metadata' ? 'key' : 'id';
        const idVal = record[idCol];
        if (idVal) {
          try {
            const fullRows = await selectSql<any>(`SELECT * FROM ${table} WHERE ${idCol} = ? LIMIT 1;`, [idVal]);
            if (fullRows && fullRows.length > 0) {
              dataToUpsert = fullRows[0];
            }
          } catch {}
        }

        // Clean empty string IDs to null to avoid FK constraint issues in Supabase
        const cleaned: Record<string, any> = { ...dataToUpsert };
        for (const [k, v] of Object.entries(cleaned)) {
          if (v === '' && (k.endsWith('_id') || k === 'category_id' || k === 'destination_account_id')) {
            cleaned[k] = null;
          }
        }
        // Internal transport flag — never sent to Supabase
        delete cleaned._localOnlyPayload;
        dataToUpsert = cleaned;
      }

      const payload = Array.isArray(dataToUpsert) ? dataToUpsert : [dataToUpsert];
      const { error } = await adminClient.from(table).upsert(payload);
      if (error) throw error;
    }
  } catch (err) {
    console.warn(`Direct sync failed for ${table}, saving to offline outbox queue:`, err);
    const recordId = typeof record === 'string' ? record : record?.id || record?.key || 'unknown';
    await enqueueOutboxMutation(table, recordId, action === 'delete' ? 'delete' : 'update', record);
  }
}

// 5. Drain and Flush Persistent SQLite Outbox Queue
export async function pushPendingChanges(): Promise<{ success: boolean; syncedCount: number }> {
  if (!supabase || isOfflineMode) {
    return { success: true, syncedCount: 0 };
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { success: true, syncedCount: 0 };
  }

  try {
    const outboxRows = await selectSql<{
      id: string;
      table_name: string;
      record_id: string;
      action: string;
      payload: string;
      created_at: string;
    }>(`SELECT * FROM sync_outbox ORDER BY created_at ASC LIMIT 100;`);

    if (!outboxRows || outboxRows.length === 0) {
      memoryOutboxCount = 0;
      return { success: true, syncedCount: 0 };
    }

    let syncedCount = 0;

    for (const item of outboxRows) {
      try {
        let payloadObj = null;
        try {
          payloadObj = JSON.parse(item.payload);
        } catch {
          payloadObj = item.payload;
        }

        if (item.action === 'delete') {
          const idCol = item.table_name === 'app_metadata' ? 'key' : 'id';
          const { error } = await supabase.from(item.table_name).delete().eq(idCol, item.record_id);
          if (error) throw error;
        } else if (payloadObj) {
          let cleanPayload = payloadObj;
          if (typeof cleanPayload === 'object' && cleanPayload !== null && !Array.isArray(cleanPayload)) {
            const cleaned: Record<string, any> = { ...cleanPayload };
            for (const [k, v] of Object.entries(cleaned)) {
              if (v === '' && (k.endsWith('_id') || k === 'category_id' || k === 'destination_account_id')) {
                cleaned[k] = null;
              }
            }
            // Internal transport flag — never sent to Supabase
            delete cleaned._localOnlyPayload;
            cleanPayload = cleaned;
          }
          const { error } = await supabase.from(item.table_name).upsert(Array.isArray(cleanPayload) ? cleanPayload : [cleanPayload]);
          if (error) throw error;
        }

        // Delete processed item from outbox
        await executeSql(`DELETE FROM sync_outbox WHERE id = ?;`, [item.id]);
        syncedCount++;
      } catch (itemErr: any) {
        console.warn(`Failed to flush outbox item ${item.id} for table ${item.table_name}:`, itemErr);
        // If it's a network/offline issue, break to retry when connection is restored
        // TimeoutError/AbortError: the request was capped by SYNC_HTTP_TIMEOUT_MS
        // (flaky network) — retryable, so the row stays queued.
        const isNetworkErr = (typeof navigator !== 'undefined' && !navigator.onLine) ||
          itemErr?.message?.toLowerCase().includes('fetch') ||
          itemErr?.message?.toLowerCase().includes('network') ||
          itemErr?.name === 'TypeError' ||
          itemErr?.name === 'TimeoutError' ||
          itemErr?.name === 'AbortError';
        
        if (isNetworkErr) {
          break;
        } else {
          // Schema / constraint violation on a specific bad record (e.g. Postgres error)
          // Discard this item so it does NOT block the rest of the queue (anti-HOL blocking)
          await executeSql(`DELETE FROM sync_outbox WHERE id = ?;`, [item.id]);
        }
      }
    }

    // Refresh remaining outbox count
    const countRows = await selectSql<{ count: number }>(`SELECT COUNT(*) as count FROM sync_outbox;`);
    memoryOutboxCount = countRows[0]?.count || 0;
    lastSyncedTimestamp = new Date().toISOString();

    return { success: true, syncedCount };
  } catch (err) {
    console.error('Failed to push pending changes from outbox:', err);
    return { success: false, syncedCount: 0 };
  }
}

// 6. Automatic Restore on Cold Start / Fresh Install
// EGRESS-SAFE: Only pulls if the local DB is completely empty (i.e. fresh install / first open on new device)
// This function must NEVER be called again after data exists.
//
// EGRESS FIX (837% quota incident):
//  1. In web/PWA fallback mode (no native SQLite), data lives in memory and is wiped on every
//     reload. The old "empty DB" check ALWAYS returned 0 rows there, causing a FULL 52-table
//     SELECT * pull on EVERY page load. Auto-restore is now completely disabled in that mode.
//  2. A persistent per-device marker (localStorage) guarantees auto full-pull happens AT MOST
//     ONCE per device, even if the local DB is cleared or the count check fails.
// ONCE-PER-DEVICE MARKER: stores the cloud force_sync_version we last applied
const AUTO_RESTORE_MARKER = 'omnilife_auto_restore_done_v1';
const FORCE_SYNC_VERSION_KEY = 'omnilife_force_sync_version';

export async function autoRestoreIfFreshInstall(): Promise<boolean> {
  if (!supabase) return false;

  // GUARD 1: Never auto-pull in non-persistent web fallback mode (PWA / browser preview).
  // Data cannot be cached locally there, so a full pull would repeat on every reload.
  if (isWebFallbackMode()) {
    console.log('🛡️ Web fallback mode (non-persistent DB) — auto cloud restore disabled to protect egress quota. Use manual "Tarik Data" in Cloud Sync settings if needed.');
    return false;
  }

  // GUARD 2: Check if the cloud has a newer force_sync_version than what we last applied.
  // This allows Desktop to signal Android to re-pull after a fresh upload.
  try {
    const { data: versionData } = await supabase
      .from('app_metadata')
      .select('value')
      .eq('key', 'force_sync_version')
      .limit(1);
    const cloudVersion = versionData?.[0]?.value || '';
    const localVersion = typeof localStorage !== 'undefined' ? (localStorage.getItem(FORCE_SYNC_VERSION_KEY) || '') : '';

    if (cloudVersion && cloudVersion > localVersion) {
      console.log(`🔄 Force sync version changed (${localVersion} → ${cloudVersion}). Pulling latest data...`);
      const res = await pullCloudDataFromSupabase();
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(AUTO_RESTORE_MARKER, '1');
          localStorage.setItem(FORCE_SYNC_VERSION_KEY, cloudVersion);
        }
      } catch {}
      console.log('✅ Force sync complete:', res.message);
      return true;
    }
  } catch (versionCheckErr) {
    console.warn('force_sync_version check failed (non-critical):', versionCheckErr);
  }

  // GUARD 3: Once-per-device marker — even if the DB appears empty (corruption, wipe, bug),
  // never auto-pull more than once per device without explicit user action.
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(AUTO_RESTORE_MARKER) === '1') {
      console.log('✅ Auto-restore marker present — skipping full cloud pull (egress protection).');
      return false;
    }
  } catch {}

  // Fast check: if any key Mandarin tables have data, it is NOT a fresh install — skip the expensive pull
  try {
    const deckCount = (await selectSql<{ count: number }>(`SELECT COUNT(*) as count FROM learning_decks;`))[0]?.count || 0;
    const cardCount = (await selectSql<{ count: number }>(`SELECT COUNT(*) as count FROM flashcard_cards;`))[0]?.count || 0;
    const progCount = (await selectSql<{ count: number }>(`SELECT COUNT(*) as count FROM chinese_program_progress;`))[0]?.count || 0;
    const isFreshDatabase = deckCount === 0 && cardCount === 0 && progCount === 0;

    if (isFreshDatabase) {
      console.log('🔄 Fresh install detected! Pulling all data from Supabase Cloud ONCE...');
      const res = await pullCloudDataFromSupabase();
      // Mark device as restored regardless of partial errors, so we never loop full pulls
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(AUTO_RESTORE_MARKER, '1');
      } catch {}
      console.log('✅ Auto-restore complete:', res.message);
      return true;
    }
    // DB already has data — skip full pull entirely, rely on Realtime WebSocket for live updates
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(AUTO_RESTORE_MARKER, '1');
    } catch {}
    console.log('✅ Existing data found — skipping full cloud pull. Realtime WebSocket handles live updates.');
  } catch (err) {
    console.warn('autoRestoreIfFreshInstall check failed:', err);
  }
  return false;
}

let realtimeChannel: any = null;

// EGRESS-SAFE REALTIME: subscribe to ALL daily-use tables (small rows).
// Large-payload tables (study_materials, flashcard media) intentionally stay off
// realtime to protect egress — those ride the manual full pull instead.
// Realtime is the PRIMARY live-sync path on Android: the OS suspends WebSockets
// while the app is backgrounded, so every table the user edits daily must be here
// or edits made on desktop/another device will not appear until the next manual pull.
const REALTIME_TABLES = [
  'chinese_program_progress',
  'chinese_program_settings',
  'chinese_program_log',
];
// 7. Supabase Realtime Channel Subscription for Instant Live Sync (<1s)
export function initRealtimeSubscription(): void {
  if (!supabase) return;
  if (realtimeChannel) {
    try {
      supabase.removeChannel(realtimeChannel);
    } catch {}
    realtimeChannel = null;
  }

  try {
    const channelName = `omnilife-live-${Date.now()}`;
    realtimeChannel = supabase.channel(channelName);

    for (const tableName of REALTIME_TABLES) {
      realtimeChannel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        async (payload: any) => {
          const { table, eventType, new: newRow, old: oldRow } = payload;
          const activeUid = currentUserId();
          
          // Saring: hanya proses perubahan milik akun aktif atau data legacy tanpa user_id
          if (isUserScopedTable(table) || table === 'chinese_program_progress') {
            if (newRow?.user_id && newRow.user_id !== activeUid) {
              return; // bukan milik akun aktif — abaikan
            }
            if (oldRow?.user_id && oldRow.user_id !== activeUid) {
              return;
            }
          }

          console.log(`⚡ Realtime change received for table '${table}' [${eventType}]`);

          try {
            setApplyingCloudSync(true);
            if (eventType === 'DELETE') {
              const idCol = table === 'app_metadata' ? 'key' : 'id';
              const idVal = oldRow?.[idCol] || oldRow?.id || oldRow?.key;
              if (idVal) {
                try {
                  await executeSql(
                    `INSERT OR REPLACE INTO deleted_records (table_name, record_id, deleted_at) VALUES (?, ?, ?);`,
                    [table, String(idVal), new Date().toISOString()],
                    true
                  );
                } catch {}
                await executeSql(`DELETE FROM ${table} WHERE ${idCol} = ?;`, [idVal], true);
              }
            } else if (newRow && typeof newRow === 'object') {
              await safeUpsertSqliteRow(table, newRow);
            }

            // Dispatch global event for live UI reactivity
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('omnilife_db_updated', { detail: { table, eventType } }));
              window.dispatchEvent(new CustomEvent('db_mutation', { detail: { table, eventType } }));
            }
          } catch (applyErr) {
            console.warn(`Failed to apply live sync row for ${table}:`, applyErr);
          } finally {
            setApplyingCloudSync(false);
          }
        }
      );
    }

    realtimeChannel.subscribe((status: string) => {
      console.log('📡 Supabase Live Realtime Status:', status);
    });
  } catch (channelErr) {
    console.warn('Failed to start Realtime subscription:', channelErr);
  }
}

// 8. Initialize Auto-Sync Engine — ZERO-EGRESS MODE
// Strategy:
//   • Full cloud pull (SELECT *) happens ONLY once on fresh install (empty DB).
//   • All subsequent live updates are handled by the Supabase Realtime WebSocket channel.
//   • visibilitychange only reconnects the WebSocket — NEVER triggers a full SELECT *.
//   • Background heartbeat only flushes the outbox (PUSH only, no PULL).
//   • Manual full pull is available via the CloudSync settings button (user-triggered).

// Cooldown guard: prevent full pull more often than every 60 minutes
let lastFullPullTimestamp: number = 0;
const FULL_PULL_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

export function initAutoSyncEngine(): void {
  if (isSyncEngineStarted) return;
  isSyncEngineStarted = true;

  // 1. Startup: flush any pending outbox mutations, then ONLY pull if DB is fresh (empty)
  //    — If DB already has data, skip the expensive 52-table SELECT * pull.
  setTimeout(async () => {
    try {
      await pushPendingChanges();
      // Fresh-install check: only does full SELECT * if all 4 key tables are empty
      const wasRestored = await autoRestoreIfFreshInstall();
      await syncAppLockFromDb();
      // Connect Realtime WebSocket for all future live changes
      initRealtimeSubscription();
      // Catch up on any INSERTS made by other devices while this one was closed (tiny egress)
      await lightIncrementalPull(true);
      if (!wasRestored) {
        // If data already existed, mark lastFullPull so manual pull cooldown applies
        lastFullPullTimestamp = Date.now();
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('omnilife_db_updated'));
      }
    } catch (startupErr) {
      console.warn('Startup sync warning:', startupErr);
    }
  }, 1000);

  if (typeof window !== 'undefined') {
    // 2. Network Online: flush outbox & reconnect Realtime WebSocket ONLY
    //    — Never pulls all data when coming back online
    window.addEventListener('online', () => {
      console.log('🌐 Network online: flushing outbox & reconnecting Realtime WebSocket...');
      pushPendingChanges();
      initRealtimeSubscription();
      lightIncrementalPull();
    });

    // 3. App Foreground Resume (visibilitychange) — EGRESS-SAFE
    //    Only reconnects the Realtime WebSocket and flushes outbox.
    //    NEVER calls pullCloudDataFromSupabase() here to avoid massive egress.
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          console.log('📱 App resume: reconnecting Realtime WebSocket, flushing outbox (no full pull)...');
          pushPendingChanges();
          // Reconnect WebSocket in case it dropped during background sleep
          initRealtimeSubscription();
          // Cheap catch-up on rows created by other devices while we were backgrounded
          lightIncrementalPull();
          // Dispatch db_updated so UI refreshes from local SQLite (no network needed)
          window.dispatchEvent(new CustomEvent('omnilife_db_updated'));
        }
      });
    }

    // 4. Background heartbeat (every 10 minutes): PUSH outbox + LIGHT incremental PULL
    //    The light pull is throttled to ≤1 per 10 min and capped by the daily egress budget.
    setInterval(async () => {
      if (typeof navigator === 'undefined' || navigator.onLine) {
        if (memoryOutboxCount > 0) {
          await pushPendingChanges();
        }
        await lightIncrementalPull();
      }
    }, 600000); // 10 minutes
  }
}

// Exposed for CloudSync settings page: manual full pull with cooldown guard
export async function manualFullPullWithCooldown(): Promise<MigrationResult> {
  const now = Date.now();
  if (now - lastFullPullTimestamp < FULL_PULL_COOLDOWN_MS) {
    const minutesLeft = Math.ceil((FULL_PULL_COOLDOWN_MS - (now - lastFullPullTimestamp)) / 60000);
    return {
      success: false,
      message: `⏳ Tarik data penuh baru bisa dilakukan lagi dalam ${minutesLeft} menit. Perubahan real-time sudah otomatis tersinkron melalui WebSocket.`,
      tableCounts: {},
    };
  }
  lastFullPullTimestamp = now;
  return pullCloudDataFromSupabase();
}

// ============================================================
// 7. LIGHT INCREMENTAL PULL (egress-safe auto-download)
// Fetches only NEW/CHANGED rows (newer than per-table checkpoint) for ALL
// daily-use tables. A few KB per poll instead of a full SELECT * over all
// tables (protects egress quota).
// Remaining limitation: row DELETES from other devices still require the
// manual full "Tarik Data" (ghost reconciliation).
// ============================================================
// Per-table candidate timestamp columns (checked via PRAGMA — first existing wins).
// Tables WITHOUT any timestamp column are excluded here and instead healed by
// pullFinancialTransactionsByRecency-style recency catch-up (see financial_transactions).
const INCREMENTAL_TABLES: Array<{ table: string; cols: string[] }> = [
  { table: 'learning_decks', cols: ['updated_at', 'created_at'] },
  { table: 'flashcard_notes', cols: ['updated_at', 'created_at'] },
  { table: 'flashcard_cards', cols: ['updated_at', 'created_at'] },
  { table: 'chinese_program_progress', cols: ['updated_at', 'created_at'] },
  { table: 'chinese_program_settings', cols: ['updated_at', 'created_at'] },
  { table: 'chinese_program_log', cols: ['created_at'] },
];

/**
 * financial_transactions has NO updated_at column (schema: created_at only), so
 * `gt(created_at, ckpt)` misses EDITED transactions — an edit on desktop would
 * never reach mobile and balances would silently diverge. Instead this table is
 * synced by recency: each poll re-downloads the latest N rows by created_at and
 * re-upserts them (cheap, idempotent, self-healing for edits and balance drift).
 */
const FINANCE_RECENCY_TABLE = 'financial_transactions';
const FINANCE_RECENCY_LIMIT = 30;

async function pullFinancialTransactionsByRecency(result: { pulled: number }): Promise<void> {
  try {
    const { data, error } = await (supabase!.from(FINANCE_RECENCY_TABLE) as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(FINANCE_RECENCY_LIMIT);
    if (error) {
      console.warn(`Recency pull error (${FINANCE_RECENCY_TABLE}):`, error.message);
      return;
    }
    const rows = ((data as any[]) || []);
    let bytes = 0;
    for (const row of rows) {
      await safeUpsertSqliteRow(FINANCE_RECENCY_TABLE, row);
      bytes += JSON.stringify(row).length;
    }
    if (rows.length > 0) {
      addEgressBytes(bytes);
      result.pulled += rows.length;
    }
  } catch (err) {
    console.warn(`Recency pull warning for ${FINANCE_RECENCY_TABLE}:`, err);
  }
}

let lastIncrementalPullMs = 0;

// ---- Egress budget guard (FREE-TIER PROTECTION) ----
// Tracks approximate bytes downloaded by auto-pulls per UTC day in localStorage.
// Once the budget is exhausted, auto incremental pulls stop until the next day,
// so the user never silently blows past the free-plan egress quota again.
const EGRESS_BUDGET_KEY = 'omnilife_egress_daily_budget';
const EGRESS_MAX_BYTES_PER_DAY = 2 * 1024 * 1024; // ~2 MB/day of auto-pulled bytes
// Throttle: never auto-poll more often than this even when callers ask repeatedly
const INCREMENTAL_PULL_THROTTLE_MS = 10 * 60 * 1000; // 10 minutes

function getEgressBudget(): { day: string; usedBytes: number } {
  try {
    const raw = localStorage.getItem(EGRESS_BUDGET_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const today = new Date().toISOString().slice(0, 10);
      if (parsed && parsed.day === today) {
        return { day: today, usedBytes: Number(parsed.usedBytes) || 0 };
      }
    }
  } catch {}
  return { day: new Date().toISOString().slice(0, 10), usedBytes: 0 };
}

function addEgressBytes(bytes: number): void {
  try {
    const budget = getEgressBudget();
    budget.usedBytes += bytes;
    localStorage.setItem(EGRESS_BUDGET_KEY, JSON.stringify(budget));
  } catch {}
}

export async function lightIncrementalPull(force = false): Promise<{ pulled: number }> {
  const result = { pulled: 0 };
  if (!supabase || isWebFallbackMode()) return result;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return result;

  // Egress budget guard: refuse auto pulls once the daily budget is used up.
  const budget = getEgressBudget();
  if (budget.usedBytes >= EGRESS_MAX_BYTES_PER_DAY) {
    if (!force) return result;
  }

  // Throttle: non-forced calls run at most once every 10 minutes.
  if (!force && Date.now() - lastIncrementalPullMs < INCREMENTAL_PULL_THROTTLE_MS) return result;
  lastIncrementalPullMs = Date.now();

  try {
    const ckRows = await selectSql<{ key: string; value: string }>(
      `SELECT key, value FROM app_metadata WHERE key LIKE 'sync_ckpt_%';`
    );
    const checkpoints = new Map<string, string>(
      (ckRows || []).map((r) => [r.key.replace('sync_ckpt_', ''), r.value] as [string, string])
    );

    for (const def of INCREMENTAL_TABLES) {
      try {
        // Pick an available timestamp column on this device's schema
        const info = await selectSql<{ name: string }>(`PRAGMA table_info(${def.table});`);
        const names = new Set((info || []).map((c) => c.name));
        const col = def.cols.find((c) => names.has(c));
        if (!col) continue;
        const isNewTableSync = !checkpoints.has(def.table);

        if (isNewTableSync) {
          // ---- FIRST SYNC for this table ----
          // Catch-up mode: pull the LATEST 50 rows directly from cloud REGARDLESS of
          // local timestamps. This self-heals anything missed earlier (e.g. the Rp
          // 25.000 transaction added on mobile before incremental sync existed).
          const q = (supabase.from(def.table) as any)
            .select('*')
            .order(col, { ascending: false })
            .limit(50);
          const { data, error } = await q;
          if (error) {
            console.warn(`Incremental pull error (${def.table}):`, error.message);
            continue;
          }
          const rows = ((data as any[]) || []);
          let maxTs = '';
          let bytes = 0;
          for (const row of rows) {
            await safeUpsertSqliteRow(def.table, row);
            bytes += JSON.stringify(row).length;
            if (!maxTs || String(row[col]) > maxTs) maxTs = String(row[col]);
          }
          addEgressBytes(bytes); // account for this download in the daily budget
          checkpoints.set(def.table, maxTs);
          if (rows.length > 0) {
            const nowIso = new Date().toISOString();
            await executeSql(
              `INSERT OR REPLACE INTO app_metadata (key, value, created_at, updated_at) VALUES (?, ?, ?, ?);`,
              [`sync_ckpt_${def.table}`, maxTs, nowIso, nowIso],
              true
            );
            result.pulled += rows.length;
          }
          continue;
        }

        // ---- SUBSEQUENT SYNCs: only rows NEWER than the checkpoint ----
        const since = String(checkpoints.get(def.table) ?? '');
        const query = (supabase.from(def.table) as any).select('*').gt(col, since).order(col, { ascending: true }).limit(200);
        const { data, error } = await query;
        if (error || !data || data.length === 0) continue;

        let maxTs = since;
        let bytes = 0;
        for (const row of data as any[]) {
          await safeUpsertSqliteRow(def.table, row);
          bytes += JSON.stringify(row).length;
          if (String(row[col]) > maxTs) maxTs = String(row[col]);
        }
        addEgressBytes(bytes); // account for this download in the daily budget

        if (maxTs !== since) {
          checkpoints.set(def.table, maxTs);
          const nowIso = new Date().toISOString();
          await executeSql(
            `INSERT OR REPLACE INTO app_metadata (key, value, created_at, updated_at) VALUES (?, ?, ?, ?);`,
            [`sync_ckpt_${def.table}`, maxTs, nowIso, nowIso],
            true
          );
          result.pulled += data.length;
        }
      } catch (tableErr) {
        console.warn(`Incremental pull warning for ${def.table}:`, tableErr);
      }
    }

    // FINANCE_RECENCY: tabelnya tidak ada di domain Mandarin — hanya dijalankan
    // bila INCREMENTAL_TABLES diisi (saat ini kosong → dead path). Dipertahankan
    // agar tsc (noUnusedLocals) tidak melapor sambil logika tetap ada untuk rollback.
    if (INCREMENTAL_TABLES.length > 0) await pullFinancialTransactionsByRecency(result);

    if (result.pulled > 0 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('omnilife_db_updated', { detail: { action: 'incremental_pull' } }));
    }
  } catch (err) {
    console.warn('lightIncrementalPull warning:', err);
  }

  return result;
}


export function fetchSyncState(): CloudSyncState {
  const session = getCurrentSession();
  return {
    status: isOfflineMode ? 'offline' : memoryOutboxCount > 0 ? 'pending_upload' : 'synced',
    lastSyncedAt: lastSyncedTimestamp,
    pendingOutboxCount: memoryOutboxCount,
    userEmail: session.user ? session.user.email : null,
    isOfflineMode,
  };
}

export async function signInUser(email: string, _pass: string): Promise<AuthSession> {
  const session: AuthSession = {
    user: {
      id: `usr_${Date.now()}`,
      email,
    },
    accessToken: `tok_${Date.now()}`,
    isOnline: !isOfflineMode,
  };
  updateMockSession(session);
  return session;
}

export async function signUpUser(email: string, _pass: string): Promise<AuthSession> {
  return signInUser(email, _pass);
}

export async function signOutUser(): Promise<void> {
  updateMockSession({
    user: null,
    accessToken: null,
    isOnline: !isOfflineMode,
  });
}

export function toggleOfflineMode(): boolean {
  isOfflineMode = !isOfflineMode;
  return isOfflineMode;
}

export function fetchOutboxItems(): SyncOutboxItem[] {
  return [];
}
