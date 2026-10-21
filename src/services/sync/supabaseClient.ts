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

export function getCurrentSession(): AuthSession {
  return mockSession;
}

export function updateMockSession(session: AuthSession) {
  mockSession = session;
}
