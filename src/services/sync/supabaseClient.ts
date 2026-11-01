import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthSession } from './syncTypes';

// Configured from .env or .env.local file
let rawUrl = ((import.meta as any).env?.VITE_SUPABASE_URL || '').trim();
if (rawUrl.endsWith('/rest/v1/')) {
  rawUrl = rawUrl.slice(0, -'/rest/v1/'.length);
} else if (rawUrl.endsWith('/rest/v1')) {
  rawUrl = rawUrl.slice(0, -'/rest/v1'.length);
}
if (rawUrl.endsWith('/')) {
  rawUrl = rawUrl.slice(0, -1);
}
const SUPABASE_URL = rawUrl;
const SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '').trim();

// SECURITY: Warn if SERVICE_KEY or MASTER_PIN exposed in environment
const EXPOSED_SERVICE_KEY = ((import.meta as any).env?.VITE_SUPABASE_SERVICE_KEY as string);
const EXPOSED_MASTER_PIN = ((import.meta as any).env?.VITE_APP_MASTER_PIN as string);

if (EXPOSED_SERVICE_KEY || EXPOSED_MASTER_PIN) {
  console.warn('⚠️  SECURITY WARNING: Sensitive credentials detected in environment. Rotate immediately.');
}

// FIX: cap every HTTP request so a flaky/hung network can never stall a save
// longer than this. Timed-out pushes retry via the offline outbox heartbeat.
const SYNC_HTTP_TIMEOUT_MS = 10_000;
const timeoutFetch: typeof fetch = (input, init) =>
  typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
    ? fetch(input, { ...init, signal: AbortSignal.timeout(SYNC_HTTP_TIMEOUT_MS) })
    : fetch(input, init);

// Client — used for reads, writes, and realtime (safe for public web deployment)
export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { fetch: timeoutFetch } }) : null;

/**
 * Returns the active Supabase client.
 * Uses public anon key safe for web deployments.
 */
export function getAdminClient(): SupabaseClient | null {
  return supabase;
}

let mockSession: AuthSession = {
  user: {
    id: 'usr_local_default',
    email: 'user@omnilife.local',
  },
  accessToken: 'mock_jwt_token',
  isOnline: true,
};

export function getSupabaseConfig() {
  return {
    url: SUPABASE_URL || 'Belum Dikonfigurasi (Silakan isi .env.local)',
    key: SUPABASE_ANON_KEY ? '••••••••••••••••' : 'Belum Dikonfigurasi',
    serviceKeyConfigured: false,
    isConfigured: !!supabase,
  };
}

/**
 * SECURITY FIX: Verify RLS policies are configured
 * Call on app startup to ensure account isolation is enforced server-side
 */
export async function validateRLSPolicies(): Promise<{ valid: boolean; warnings: string[] }> {
  const warnings: string[] = [];
  
  if (!supabase) {
    return { valid: false, warnings: ['Supabase not configured'] };
  }

  // Tables that require RLS for account isolation
  const RLS_REQUIRED_TABLES = [
    'chinese_program_progress',
    'chinese_program_log',
    'learning_decks',
    'flashcard_notes',
    'flashcard_cards',
  ];

  try {
    // Query the information_schema to check RLS status
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, row_security_active')
      .in('table_name', RLS_REQUIRED_TABLES);

    if (error) {
      warnings.push(`Could not verify RLS policies: ${error.message}`);
      return { valid: false, warnings };
    }

    if (data) {
      for (const row of data) {
        if (!row.row_security_active) {
          warnings.push(`⚠️ RLS NOT ENABLED on ${row.table_name} — account isolation at risk`);
        }
      }
    }

    return {
      valid: warnings.length === 0,
      warnings,
    };
  } catch (err) {
    warnings.push(`RLS validation failed: ${err}`);
    return { valid: false, warnings };
  }
}

export function getCurrentSession(): AuthSession {
  return mockSession;
}

export function updateMockSession(session: AuthSession) {
  mockSession = session;
}
