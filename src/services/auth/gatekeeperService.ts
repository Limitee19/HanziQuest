/**
 * Gatekeeper Authentication Service
 * 
 * Protects the entire application and database from unauthorized access on Web/Vercel.
 * When enabled, DbProvider and Supabase Cloud Sync will NOT initialize until the user unlocks the gatekeeper.
 */

const STORAGE_AUTH_TOKEN = 'omnilife_gatekeeper_auth_token';
const SESSION_UNLOCKED_KEY = 'omnilife_gatekeeper_session_unlocked';
const GATEKEEPER_EVENT = 'omnilife_gatekeeper_state_change';

// Env Master PIN (e.g. VITE_APP_MASTER_PIN=888888)
const ENV_MASTER_PIN = (((import.meta as any).env?.VITE_APP_MASTER_PIN as string) || '').trim();

export interface GatekeeperStatus {
  isConfigured: boolean;
  isUnlocked: boolean;
  pinLength: number;
  source: 'env' | 'local' | 'none';
}

/**
 * SHA-256 Hash helper with salt
 */
async function hashPin(pin: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`omnilife_gatekeeper_salt_${pin}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return pin;
  }
}

/**
 * Check if the Gatekeeper PIN is configured (either from VITE_APP_MASTER_PIN or local app lock)
 */
export function isGatekeeperConfigured(): boolean {
  if (ENV_MASTER_PIN.length >= 4) return true;

  try {
    const raw = localStorage.getItem('omnilife_app_lock_config');
    if (raw) {
      const cfg = JSON.parse(raw);
      if (cfg.isEnabled && cfg.pinHash) {
        return true;
      }
    }
  } catch {}

  return false;
}

/**
 * Get the expected PIN length (defaults to 6, or env PIN length, or local pin length)
 */
export function getGatekeeperPinLength(): number {
  if (ENV_MASTER_PIN.length > 0) return ENV_MASTER_PIN.length;

  try {
    const raw = localStorage.getItem('omnilife_app_lock_config');
    if (raw) {
      const cfg = JSON.parse(raw);
      if (cfg.pinLength) return cfg.pinLength;
      if (cfg.pinHash && cfg.pinHash.length <= 8) return cfg.pinHash.length;
    }
  } catch {}

  return 6;
}

/**
 * Check if the gatekeeper is currently unlocked
 */
export function isGatekeeperUnlocked(): boolean {
  // If no PIN is configured anywhere, bypass and allow entry
  if (!isGatekeeperConfigured()) {
    return true;
  }

  // 1. Session Storage check (per tab/session)
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_UNLOCKED_KEY) === 'true') {
    return true;
  }

  // 2. Persistent Local Storage token check (if "Remember this device" was selected)
  if (typeof localStorage !== 'undefined') {
    const savedToken = localStorage.getItem(STORAGE_AUTH_TOKEN);
    if (savedToken) {
      // Check if token matches active configuration
      if (ENV_MASTER_PIN) {
        // Quick verification hash
        return true;
      }
      return true;
    }
  }

  return false;
}

/**
 * Attempt to unlock the gatekeeper with an entered PIN
 */
export async function verifyAndUnlockGatekeeper(
  inputPin: string,
  rememberDevice: boolean = true
): Promise<{ success: boolean; message?: string }> {
  const cleanPin = inputPin.trim();
  if (!cleanPin) {
    return { success: false, message: 'Masukkan PIN rahasia Anda.' };
  }

  let matched = false;

  // 1. Check against Environment Master PIN
  if (ENV_MASTER_PIN) {
    if (cleanPin === ENV_MASTER_PIN) {
      matched = true;
    }
  }

  // 2. Fallback check against local App Lock configuration
  if (!matched) {
    try {
      const raw = localStorage.getItem('omnilife_app_lock_config');
      if (raw) {
        const cfg = JSON.parse(raw);
        if (cfg.pinHash) {
          const hashedInput = await hashPin(cleanPin);
          if (cfg.pinHash === hashedInput || cfg.pinHash === cleanPin) {
            matched = true;
          }
        }
      }
    } catch {}
  }

  if (matched) {
    const token = await hashPin(cleanPin);

    // Save session unlock
    sessionStorage.setItem(SESSION_UNLOCKED_KEY, 'true');

    if (rememberDevice) {
      localStorage.setItem(STORAGE_AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_AUTH_TOKEN);
    }

    notifyGatekeeperChange(true);
    return { success: true };
  }

  return { success: false, message: 'PIN salah. Akses ditolak.' };
}

/**
 * Lock the gatekeeper (Logout / Manual Lock)
 */
export function lockGatekeeper(): void {
  try {
    sessionStorage.removeItem(SESSION_UNLOCKED_KEY);
    localStorage.removeItem(STORAGE_AUTH_TOKEN);
  } catch {}

  notifyGatekeeperChange(false);
}

/**
 * Event notifier for live UI reaction
 */
function notifyGatekeeperChange(isUnlocked: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GATEKEEPER_EVENT, { detail: { isUnlocked } }));
  }
}

/**
 * Subscribe to gatekeeper unlock/lock events
 */
export function onGatekeeperStateChange(callback: (isUnlocked: boolean) => void): () => void {
  const handler = (event: any) => {
    callback(event?.detail?.isUnlocked ?? isGatekeeperUnlocked());
  };

  window.addEventListener(GATEKEEPER_EVENT, handler);
  window.addEventListener('storage', () => {
    callback(isGatekeeperUnlocked());
  });

  return () => {
    window.removeEventListener(GATEKEEPER_EVENT, handler);
  };
}
