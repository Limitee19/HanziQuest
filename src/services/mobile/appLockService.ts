import { executeSql, selectSql } from '@/db/client';

export type LockTimeout = 'immediately' | '1m' | '5m' | '15m' | '30m' | '1h' | 'never';

export interface AppLockConfig {
  isEnabled: boolean;
  pinHash: string; // SHA-256 hash or secure PIN verifier
  pinLength: number; // default 6
  timeout: LockTimeout;
  useBiometricsIfAvailable: boolean;
  lastActiveTimestamp: number;
}

const STORAGE_KEY = 'omnilife_app_lock_config';
const SESSION_UNLOCKED_KEY = 'omnilife_unlocked_session';

const DEFAULT_LOCK_CONFIG: AppLockConfig = {
  isEnabled: false,
  pinHash: '',
  pinLength: 6,
  timeout: '15m', // 15-min default
  useBiometricsIfAvailable: true,
  lastActiveTimestamp: Date.now(),
};

// Simple SHA-256 helper for PIN verifier
async function hashPin(pin: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`omnilife_pin_salt_${pin}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (_) {
    return pin; // fallback if crypto unavailable
  }
}

export function fetchAppLockConfig(): AppLockConfig {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Migrate old 1m default to 15m
      if (parsed.timeout === '1m' || !parsed.timeout) {
        parsed.timeout = '15m';
      }
      return { ...DEFAULT_LOCK_CONFIG, ...parsed };
    } catch (_) {}
  }
  return DEFAULT_LOCK_CONFIG;
}

export function saveAppLockConfig(config: AppLockConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  // Async persist to SQLite app_metadata in the background
  persistAppLockToDb(config).catch((e) => console.warn('persistAppLock error:', e));
}

export async function persistAppLockToDb(config: AppLockConfig): Promise<void> {
  try {
    const now = new Date().toISOString();
    const val = JSON.stringify({
      isEnabled: config.isEnabled,
      pinHash: config.pinHash,
      pinLength: config.pinLength,
      timeout: config.timeout,
      useBiometricsIfAvailable: config.useBiometricsIfAvailable,
    });

    await executeSql(
      `INSERT OR REPLACE INTO app_metadata (key, value, created_at, updated_at) VALUES ('app_lock_config', ?, ?, ?);`,
      [val, now, now]
    );
  } catch (err) {
    console.warn('persistAppLockToDb error:', err);
  }
}

export async function syncAppLockFromDb(): Promise<AppLockConfig> {
  try {
    const rows = await selectSql<{ key: string; value: string }>(
      `SELECT value FROM app_metadata WHERE key = 'app_lock_config' LIMIT 1;`
    );
    if (rows && rows.length > 0 && rows[0].value) {
      const parsed = JSON.parse(rows[0].value);
      const active = fetchAppLockConfig();
      const merged: AppLockConfig = {
        ...DEFAULT_LOCK_CONFIG,
        ...parsed,
        lastActiveTimestamp: active.lastActiveTimestamp || Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('syncAppLockFromDb error:', err);
  }
  return fetchAppLockConfig();
}

export async function setPinCode(pin: string, timeout: LockTimeout = '15m'): Promise<void> {
  const hashed = await hashPin(pin);
  const config = fetchAppLockConfig();
  config.isEnabled = true;
  config.pinHash = hashed;
  config.pinLength = pin.length || 6;
  config.timeout = timeout;
  config.lastActiveTimestamp = Date.now();
  saveAppLockConfig(config);
  await persistAppLockToDb(config);
  sessionStorage.setItem(SESSION_UNLOCKED_KEY, 'true');
}

let lastThrottledUpdate = 0;

export function updateLastActiveTimestamp(force: boolean = false): void {
  const now = Date.now();
  // Throttle updates to once every 10 seconds to avoid excessive localStorage operations
  if (!force && now - lastThrottledUpdate < 10000) {
    return;
  }
  lastThrottledUpdate = now;

  const config = fetchAppLockConfig();
  config.lastActiveTimestamp = now;
  saveAppLockConfig(config);
  sessionStorage.setItem(SESSION_UNLOCKED_KEY, 'true');
}

export function lockNow(): void {
  sessionStorage.removeItem(SESSION_UNLOCKED_KEY);
  const config = fetchAppLockConfig();
  config.lastActiveTimestamp = 0;
  saveAppLockConfig(config);
}

export function isAppLockRequired(): boolean {
  try {
    const config = fetchAppLockConfig();
    if (!config || !config.isEnabled || !config.pinHash) {
      // Self-heal: "enabled tanpa PIN" adalah state rusak (bug lama memungkinkan
      // ini tersimpan) — pulihkan agar toggle tidak memberi ilusi keamanan.
      if (config && config.isEnabled && !config.pinHash) {
        saveAppLockConfig({ ...config, isEnabled: false });
      }
      return false;
    }

    // 1. Fresh app launch / reopen check (sessionStorage is empty on app restart)
    const hasActiveSession = sessionStorage.getItem(SESSION_UNLOCKED_KEY) === 'true';
    if (!hasActiveSession) {
      return true; // Lock immediately on app exit/reopen
    }

    // 2. Inactivity timeout check
    if (config.timeout === 'immediately') return true;
    if (config.timeout === 'never') return false;

    const now = Date.now();
    const lastActive = config.lastActiveTimestamp || now;
    const diffMinutes = (now - lastActive) / (1000 * 60);

    const timeoutMinutesMap: Record<LockTimeout, number> = {
      immediately: 0,
      '1m': 1,
      '5m': 5,
      '15m': 15,
      '30m': 30,
      '1h': 60,
      never: Infinity,
    };

    const threshold = timeoutMinutesMap[config.timeout] ?? 15;
    return diffMinutes >= threshold;
  } catch (err) {
    console.error('isAppLockRequired error:', err);
    return false;
  }
}

export async function verifyPin(inputPin: string): Promise<boolean> {
  const config = fetchAppLockConfig();
  if (!config.pinHash) return false;

  // Support both SHA-256 hashed and legacy plain PIN
  const hashedInput = await hashPin(inputPin);
  const isValid = config.pinHash === hashedInput || config.pinHash === inputPin;

  if (isValid) {
    sessionStorage.setItem(SESSION_UNLOCKED_KEY, 'true');
    updateLastActiveTimestamp(true);
  }

  return isValid;
}

export function getExpectedPinLength(): number {
  const config = fetchAppLockConfig();
  return config.pinLength || (config.pinHash ? config.pinHash.length : 6);
}
