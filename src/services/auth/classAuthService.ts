/**
 * classAuthService.ts
 * Sistem Autentikasi Kelas & Manajemen Siswa (Closed / Invite-Only)
 * 
 * - Tanpa registrasi publik: hanya Guru (Admin) yang bisa membuat/menghapus akun siswa.
 * - Siswa login menggunakan Username / No. Absen & PIN.
 * - Data tersinkron ke Supabase jika tersedia, dengan fallback lokal offline yang kuat.
 */

import { supabase } from '@/services/sync/supabaseClient';

export interface StudentUser {
  id: string;
  username: string;
  displayName: string;
  nickname?: string;
  role: 'admin' | 'student' | 'guest';
  isActive: boolean;
  avatar?: string;
  createdAt: number;
}

export interface StudentProgressSummary {
  userId: string;
  displayName: string;
  username: string;
  masteredCount: number;
  totalReviewed: number;
  lastActive?: number;
}

const STORAGE_ACTIVE_USER_KEY = 'omnilife_active_student_user';
const STORAGE_ADMIN_AUTH_HASH_KEY = 'omnilife_admin_auth_hash';

// ── Kanonikalisasi akun admin ───────────────────────────────────────────
// Username '260242649788' dan 'admin' adalah satu orang yang sama, tetapi
// dulu dipetakan ke ID berbeda (usr_admin_260242649788 vs usr_admin_master)
// sehingga progres login di PC dengan instance alias bisa "terpisah" dari
// HP. Semua data kini dirutekan ke satu ID kanonik; data alias lama
// digabung (merge) satu kali ke ID kanonik saat login.
const CANONICAL_ADMIN_ID = 'usr_admin_260242649788';
const ALIAS_ADMIN_ID = 'usr_admin_master';
const ADMIN_ALIAS_MERGE_FLAG = 'omnilife_admin_alias_merged_v1';

export function canonicalizeUserId(id: string): string {
  return id === ALIAS_ADMIN_ID ? CANONICAL_ADMIN_ID : id;
}

function getAdminAuthHash(): string {
  try {
    return sessionStorage.getItem(STORAGE_ADMIN_AUTH_HASH_KEY) || '';
  } catch {
    return '';
  }
}

function setAdminAuthHash(hash: string): void {
  try {
    sessionStorage.setItem(STORAGE_ADMIN_AUTH_HASH_KEY, hash);
  } catch {}
}

function clearAdminAuthHash(): void {
  try {
    sessionStorage.removeItem(STORAGE_ADMIN_AUTH_HASH_KEY);
  } catch {}
}
const STORAGE_LOCAL_USERS_KEY = 'omnilife_class_local_users';
const AUTH_STATE_CHANGE_EVENT = 'omnilife_class_auth_state_change';

function getStoredUserNicknameKey(userId: string): string {
  return `omnilife_user_nickname_${userId}`;
}

export function getStoredUserNickname(userId: string): string {
  try {
    return localStorage.getItem(getStoredUserNicknameKey(userId)) || '';
  } catch {
    return '';
  }
}

export function setStoredUserNickname(userId: string, nickname: string): void {
  try {
    if (nickname && nickname.trim()) {
      localStorage.setItem(getStoredUserNicknameKey(userId), nickname.trim());
    } else {
      localStorage.removeItem(getStoredUserNicknameKey(userId));
    }
  } catch {}
}

// Master Admin Hash cadangan (SHA-256 dari salt + pin awal '170603')
// Nilai mentah PIN tidak pernah disimpan/diekspos di bundle frontend.
const DEFAULT_MASTER_ADMIN_HASH = 'a34f2e35e058c457140ac9820e401d9a1d9859d67aeb86e6097e9b68fa960a7e';
const ENV_MASTER_PIN = (((import.meta as any).env?.VITE_APP_MASTER_PIN as string) || '').trim();

/**
 * SHA-256 Hash helper dengan salt rahasia aplikasi
 */
export async function hashPin(pin: string): Promise<string> {
  try {
    const enc = new TextEncoder();
    const data = enc.encode(`hanzi_quest_class_salt_${pin.trim()}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return `hash_${pin.trim()}`;
  }
}

/**
 * Dapatkan daftar akun lokal dari localStorage
 */
function getStoredLocalUsers(): Array<StudentUser & { pinHash: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_LOCAL_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

/**
 * Simpan daftar akun lokal ke localStorage
 */
function saveStoredLocalUsers(users: Array<StudentUser & { pinHash: string }>): void {
  try {
    localStorage.setItem(STORAGE_LOCAL_USERS_KEY, JSON.stringify(users));
  } catch {}
}

/**
 * Inisialisasi akun Master Admin default jika belum pernah dibuat sama sekali
 */
export async function ensureDefaultAdminExists(): Promise<void> {
  const users = getStoredLocalUsers();
  const defaultAdminHash = ENV_MASTER_PIN ? await hashPin(ENV_MASTER_PIN) : DEFAULT_MASTER_ADMIN_HASH;

  // 1. Akun Admin Utama: 260242649788
  if (!users.some((u) => u.username === '260242649788')) {
    const adminAccount: StudentUser & { pinHash: string } = {
      id: 'usr_admin_260242649788',
      username: '260242649788',
      displayName: 'Guru / Master Admin',
      role: 'admin',
      isActive: true,
      avatar: '👑',
      createdAt: Date.now(),
      pinHash: defaultAdminHash,
    };
    users.unshift(adminAccount);
  }

  // 2. Alias Admin cadangan: admin
  if (!users.some((u) => u.username === 'admin')) {
    users.push({
      id: 'usr_admin_master',
      username: 'admin',
      displayName: 'Guru / Admin',
      role: 'admin',
      isActive: true,
      avatar: '👑',
      createdAt: Date.now(),
      pinHash: defaultAdminHash,
    });
  }

  saveStoredLocalUsers(users);

  // Sync juga ke Supabase jika terhubung
  if (supabase) {
    try {
      await supabase.from('app_users').upsert([
        {
          id: 'usr_admin_260242649788',
          username: '260242649788',
          display_name: 'Guru / Master Admin',
          role: 'admin',
          pin_hash: defaultAdminHash,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'usr_admin_master',
          username: 'admin',
          display_name: 'Guru / Admin',
          role: 'admin',
          pin_hash: defaultAdminHash,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.warn('Sync admin accounts to Supabase failed (offline fallback active):', err);
    }
  }
}

// Inisialisasi otomatis akun default & sinkronisasi profil dari cloud saat browser pertama kali memuat modul
if (typeof window !== 'undefined') {
  ensureDefaultAdminExists().then(() => {
    syncActiveUserProfileFromCloud().catch(() => {});
  }).catch(() => {});
}

/**
 * Dapatkan pengguna yang sedang aktif/login saat ini
 */
export function getActiveUser(): StudentUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

/**
 * Dapatkan ID pengguna aktif untuk partisi data
 */
export function getActiveUserId(): string {
  const u = getActiveUser();
  if (!u) return 'usr_guest';
  // Sesi lama bisa menyimpan id alias admin kanonikalisasi agar semua
  // data (localStorage & DB) memakai satu partisi yang sama.
  return canonicalizeUserId(u.id);
}

/**
 * Cek apakah ada pengguna yang sedang login
 */
export function isAuthenticated(): boolean {
  return getActiveUser() !== null;
}

/**
 * Cek apakah pengguna saat ini adalah Admin (Guru)
 */
export function isAdmin(): boolean {
  const u = getActiveUser();
  return u?.role === 'admin';
}

/**
 * Berlangganan perubahan status login (login/logout/ganti akun)
 */
export function onAuthStateChange(callback: (user: StudentUser | null) => void): () => void {
  const handler = () => {
    callback(getActiveUser());
  };
  window.addEventListener(AUTH_STATE_CHANGE_EVENT, handler);
  return () => window.removeEventListener(AUTH_STATE_CHANGE_EVENT, handler);
}

function notifyAuthChange(user: StudentUser | null) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_STATE_CHANGE_EVENT, { detail: { user } }));
    window.dispatchEvent(new CustomEvent('omnilife_db_updated'));
  }
}

// ── Merge data alias admin lama ke ID kanonik (satu kali per device/cloud) ──

function stageRank(s?: string): number {
  if (s === 'production') return 3;
  if (s === 'recognition') return 2;
  if (s === 'learning') return 1;
  return 0;
}

type QuestProgressEntry = {
  id?: string;
  word_id?: string;
  hanzi?: string;
  stage: string;
  due_date: string;
  review_count: number;
  updated_at: number;
};

function mergeQuestMaps(
  target: Record<string, QuestProgressEntry>,
  aliasMap: Record<string, QuestProgressEntry> | null
): boolean {
  let changed = false;
  if (!aliasMap) return changed;
  for (const [wordId, item] of Object.entries(aliasMap) as [string, QuestProgressEntry][]) {
    const cur = target[wordId];
    if (!cur) {
      target[wordId] = item;
      changed = true;
      continue;
    }
    const tScore = stageRank(cur.stage);
    const aScore = stageRank(item.stage);
    const tTs = cur.updated_at || 0;
    const aTs = item.updated_at || 0;
    if (aScore > tScore || (aScore === tScore && aTs > tTs)) {
      target[wordId] = item;
      changed = true;
    }
  }
  return changed;
}

async function mergeAliasAdminDataIntoCanonical(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(ADMIN_ALIAS_MERGE_FLAG) === '1') return;
  } catch {}

  // 1. Merge localStorage progres quest alias → kanonik
  let localMerged = false;
  try {
    const aliasRaw = localStorage.getItem(`omnilife_quest_progress_${ALIAS_ADMIN_ID}`);
    if (aliasRaw) {
      const canonicalRaw = localStorage.getItem(`omnilife_quest_progress_${CANONICAL_ADMIN_ID}`);
      const canonicalMap: Record<string, QuestProgressEntry> =
        canonicalRaw ? JSON.parse(canonicalRaw) : {};
      const aliasMap: Record<string, QuestProgressEntry> = JSON.parse(aliasRaw);
      const changed = mergeQuestMaps(canonicalMap, aliasMap);
      if (changed || !canonicalRaw) {
        localStorage.setItem(`omnilife_quest_progress_${CANONICAL_ADMIN_ID}`, JSON.stringify(canonicalMap));
        localMerged = true;
      }
      localStorage.removeItem(`omnilife_quest_progress_${ALIAS_ADMIN_ID}`);
      localMerged = true;
    }
  } catch {}

  // 2. Merge cloud (student_quest_progress & student_quest_meta) alias → kanonik
  let cloudMerged = false;
  if (supabase) {
    try {
      // 2a. Progres per kata
      const { data: aliasRows } = await supabase
        .from('student_quest_progress')
        .select('word_id, hanzi, stage, due_date, review_count, updated_at')
        .eq('user_id', ALIAS_ADMIN_ID);
      const { data: canonRows } = await supabase
        .from('student_quest_progress')
        .select('word_id, hanzi, stage, due_date, review_count, updated_at')
        .eq('user_id', CANONICAL_ADMIN_ID);

      if (aliasRows && aliasRows.length > 0) {
        const canonIds = new Set((canonRows || []).map((r: any) => r.word_id));
        const aliasMap: Record<string, any> = {};
        aliasRows.forEach((r: any) => (aliasMap[r.word_id] = r));
        const toUpload = aliasRows.filter((r: any) => !canonIds.has(r.word_id));
        for (let i = 0; i < toUpload.length; i += 200) {
          const batch = toUpload.slice(i, i + 200).map((r: any) => ({ ...r, user_id: CANONICAL_ADMIN_ID }));
          await supabase.from('student_quest_progress').upsert(batch);
        }
        // Jika alias lebih maju dari kanonik untuk kata yang sama, timpa
        for (const [wordId, aItem] of Object.entries(aliasMap)) {
          const cItem = (canonRows || []).find((r: any) => r.word_id === wordId);
          if (
            cItem &&
            (stageRank(aItem.stage) > stageRank(cItem.stage) ||
              (stageRank(aItem.stage) === stageRank(cItem.stage) &&
                (aItem.updated_at || 0) > (cItem.updated_at || 0)))
          ) {
            await supabase.from('student_quest_progress').upsert({
              ...aItem,
              user_id: CANONICAL_ADMIN_ID,
            });
          }
        }
        cloudMerged = true;
      }

      // 2b. Meta (profile, leech, mnemonik, snapshot progres)
      const { data: aliasMeta } = await supabase
        .from('student_quest_meta')
        .select('*')
        .eq('user_id', ALIAS_ADMIN_ID)
        .maybeSingle();
      const { data: canonMeta } = await supabase
        .from('student_quest_meta')
        .select('*')
        .eq('user_id', CANONICAL_ADMIN_ID)
        .maybeSingle();

      if (aliasMeta) {
        const notes: Record<string, any> = { ...(aliasMeta.mnemonic_notes || {}) };
        const canonNotes: Record<string, any> = canonMeta?.mnemonic_notes || {};
        for (const [k, v] of Object.entries(canonNotes)) {
          if (k === '__profile_meta') {
            const aPm = notes[k] as any;
            const cPm = v as any;
            notes[k] = (cPm?.updatedAt || 0) >= (aPm?.updatedAt || 0) ? cPm : aPm;
            continue;
          }
          if (k === '__quest_progress') continue; // di-handle via 2a
          if (typeof notes[k] === 'object' && notes[k] && typeof v === 'object' && v) {
            const mergedItem = { ...(notes[k] as object), ...(v as object) };
            notes[k] = mergedItem;
          } else {
            notes[k] = v;
          }
        }
        // leech: merge berdasar wordId terbaru
        const aliasLeech: any[] = Array.isArray(aliasMeta.leech_words) ? aliasMeta.leech_words : [];
        const canonLeech: any[] = Array.isArray(canonMeta?.leech_words) ? canonMeta!.leech_words : [];
        const leechMap = new Map<string, any>();
        [...canonLeech, ...aliasLeech].forEach((l) => {
          const k = l?.wordId || l?.word_id;
          if (!k) return;
          const prev = leechMap.get(k);
          if (!prev || (l.updatedAt || 0) >= (prev.updatedAt || 0)) leechMap.set(k, l);
        });
        await supabase.from('student_quest_meta').upsert({
          user_id: CANONICAL_ADMIN_ID,
          mnemonic_notes: notes,
          leech_words: Array.from(leechMap.values()),
          updated_at: Date.now(),
        });
        await supabase.from('student_quest_meta').delete().eq('user_id', ALIAS_ADMIN_ID);
        cloudMerged = true;
      }

      // 2c. Hapus baris progres alias setelah merge sukses
      if (cloudMerged) {
        await supabase.from('student_quest_progress').delete().eq('user_id', ALIAS_ADMIN_ID);
      }
    } catch (err) {
      console.warn('Merge data alias admin gagal (akan dicoba lagi saat berikutnya):', err);
      return; // Jangan pasang flag agar dicoba ulang
    }
  }

  try {
    if (localMerged || cloudMerged || !supabase) {
      localStorage.setItem(ADMIN_ALIAS_MERGE_FLAG, '1');
    }
  } catch {}

  if (localMerged || cloudMerged) {
    try {
      const mod = await import('@/services/chinese/questService');
      mod.syncStudentQuestProgress(true).catch(() => {});
    } catch {}
  }
}

/**
 * Rute akhir setiap path login: kanonikalisasi ID, merge data alias,
 * simpan sesi, dan sinkronkan progres quest dari cloud.
 */
async function finalizeLogin(user: StudentUser, authHash?: string): Promise<StudentUser> {
  const resolved: StudentUser =
    user.id === ALIAS_ADMIN_ID
      ? { ...user, id: CANONICAL_ADMIN_ID }
      : user;

  if (resolved.id === CANONICAL_ADMIN_ID) {
    try {
      await mergeAliasAdminDataIntoCanonical();
    } catch {}
  }

  try {
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(resolved));
  } catch {}
  if (authHash && resolved.role === 'admin') setAdminAuthHash(authHash);
  notifyAuthChange(resolved);
  if (resolved.role !== 'guest') {
    // Tarik profil (nama panggilan, nama lengkap, avatar) & gap-fill profil
    // dari cloud + adopt profil lokal bila cloud kosong.
    void syncActiveUserProfileFromCloud()
      .then((fresh) => fresh && notifyAuthChange(fresh))
      .catch(() => {});
    import('@/services/chinese/questService')
      .then((m) => m.syncStudentQuestProgress(true))
      .catch(() => {});
  }
  return resolved;
}

/**
 * Login Siswa atau Guru
 */
export async function loginUser(
  usernameInput: string,
  pinInput: string
): Promise<{ success: boolean; user?: StudentUser; error?: string }> {
  const cleanUsername = usernameInput.trim().toLowerCase();
  const cleanPin = pinInput.trim();

  if (!cleanUsername) {
    return { success: false, error: 'Silakan masukkan username atau nomor absen.' };
  }
  if (!cleanPin) {
    return { success: false, error: 'Silakan masukkan PIN Anda.' };
  }

  await ensureDefaultAdminExists();
  const inputHash = await hashPin(cleanPin);

  // 1. Coba verifikasi via Supabase RPC (Server-Side Verification tanpa ekspos pin_hash ke browser)
  if (supabase) {
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('verify_class_login', {
        p_username: cleanUsername,
        p_pin_hash: inputHash,
      });

      if (!rpcErr && rpcRes && typeof rpcRes === 'object') {
        if (!rpcRes.success) {
          return { success: false, error: rpcRes.error || 'PIN yang Anda masukkan salah.' };
        }
        const loggedUser: StudentUser = {
          id: rpcRes.user.id,
          username: rpcRes.user.username,
          displayName: rpcRes.user.displayName,
          nickname: rpcRes.user.nickname || getStoredUserNickname(rpcRes.user.id),
          avatar: rpcRes.user.avatar || (rpcRes.user.role === 'admin' ? 'avatar_master' : 'avatar_panda'),
          role: rpcRes.user.role as 'admin' | 'student',
          isActive: rpcRes.user.isActive ?? true,
          createdAt: rpcRes.user.createdAt || Date.now(),
        };
        return { success: true, user: await finalizeLogin(loggedUser, inputHash) };
      }
    } catch {}

    // Fallback direct table query jika RPC belum diinstall di Supabase
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('id, username, display_name, role, is_active, created_at, nickname, avatar, pin_hash')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (!error && data) {
        if (!data.is_active) {
          return { success: false, error: 'Akun Anda dinonaktifkan oleh guru.' };
        }
        if (data.pin_hash === inputHash) {
          let cloudNickname = (data as any).nickname || '';
          let cloudAvatar = (data as any).avatar || (data.role === 'admin' ? 'avatar_master' : 'avatar_panda');
          let cloudDisplayName = data.display_name;

          // Cek metadata profil dari student_quest_meta
          try {
            const { data: meta } = await supabase
              .from('student_quest_meta')
              .select('mnemonic_notes')
              .eq('user_id', data.id)
              .maybeSingle();

            if (meta?.mnemonic_notes?.__profile_meta) {
              const pm = meta.mnemonic_notes.__profile_meta;
              if (pm.nickname) cloudNickname = pm.nickname;
              if (pm.avatar) cloudAvatar = pm.avatar;
              if (pm.displayName) cloudDisplayName = pm.displayName;
            }
          } catch {}

          if (!cloudNickname) {
            cloudNickname = getStoredUserNickname(data.id);
          } else {
            setStoredUserNickname(data.id, cloudNickname);
          }

          const loggedUser: StudentUser = {
            id: data.id,
            username: data.username,
            displayName: cloudDisplayName,
            nickname: cloudNickname,
            avatar: cloudAvatar,
            role: data.role as 'admin' | 'student',
            isActive: data.is_active,
            createdAt: new Date(data.created_at).getTime(),
          };
          return { success: true, user: await finalizeLogin(loggedUser, inputHash) };
        } else {
          return { success: false, error: 'PIN yang Anda masukkan salah.' };
        }
      }
    } catch (err) {
      console.warn('Supabase login check failed, falling back to local users:', err);
    }
  }

  // 2. Fallback verifikasi lokal offline
  const localUsers = getStoredLocalUsers();
  const found = localUsers.find((u) => u.username.toLowerCase() === cleanUsername);

  if (!found) {
    // Khusus Admin darurat jika hash PIN cocok secara kriptografis
    const isMasterAdminMatch = inputHash === DEFAULT_MASTER_ADMIN_HASH || (ENV_MASTER_PIN ? inputHash === await hashPin(ENV_MASTER_PIN) : false);
    if ((cleanUsername === '260242649788' || cleanUsername === 'admin') && isMasterAdminMatch) {
      const adminId = cleanUsername === '260242649788' ? 'usr_admin_260242649788' : 'usr_admin_master';
      const adminNickname = getStoredUserNickname(adminId);
      const adminUser: StudentUser = {
        id: adminId,
        username: cleanUsername,
        displayName: 'Guru / Master Admin',
        nickname: adminNickname,
        role: 'admin',
        isActive: true,
        avatar: 'avatar_master',
        createdAt: Date.now(),
      };
      return { success: true, user: await finalizeLogin(adminUser, inputHash) };
    }
    return {
      success: false,
      error: 'Username tidak ditemukan. Pastikan sudah didaftarkan oleh guru kelas.',
    };
  }

  if (!found.isActive) {
    return { success: false, error: 'Akun ini dinonaktifkan oleh guru.' };
  }

  if (found.pinHash !== inputHash) {
    return { success: false, error: 'PIN yang Anda masukkan salah.' };
  }

  const userNickname = found.nickname || getStoredUserNickname(found.id) || '';
  if (userNickname) setStoredUserNickname(found.id, userNickname);

  const sessionUser: StudentUser = {
    id: found.id,
    username: found.username,
    displayName: found.displayName,
    nickname: userNickname,
    role: found.role,
    isActive: found.isActive,
    avatar: found.avatar || (found.role === 'admin' ? 'avatar_master' : 'avatar_panda'),
    createdAt: found.createdAt,
  };

  return { success: true, user: await finalizeLogin(sessionUser, inputHash) };
}

/**
 * Logout pengguna yang sedang aktif
 */
export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
    clearAdminAuthHash();
  } catch {}
  notifyAuthChange(null);
}

/**
 * Login sebagai Tamu (Mode Bebas Tanpa Akun & Tanpa Konsumsi Database Cloud)
 */
export function loginGuestUser(): StudentUser {
  const guestUser: StudentUser = {
    id: 'usr_guest',
    username: 'tamu',
    displayName: 'Tamu Petualang',
    nickname: 'Tamu',
    role: 'guest',
    isActive: true,
    avatar: '🎒',
    createdAt: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(guestUser));
  } catch {}

  notifyAuthChange(guestUser);
  return guestUser;
}

/**
 * Perbarui profil pengguna yang sedang login (Nama Panggilan, Nama Tampilan, Username, PIN, Avatar)
 */
export async function updateUserProfile(updates: {
  displayName?: string;
  nickname?: string;
  username?: string;
  pin?: string;
  avatar?: string;
}): Promise<{ success: boolean; error?: string; user?: StudentUser }> {
  const currentUser = getActiveUser();
  if (!currentUser) {
    return { success: false, error: 'Tidak ada sesi pengguna aktif.' };
  }

  // Jika akun tamu: perbarui di state lokal saja
  if (currentUser.role === 'guest') {
    const updatedUser: StudentUser = {
      ...currentUser,
      displayName: updates.displayName?.trim() || currentUser.displayName,
      nickname: updates.nickname !== undefined ? updates.nickname.trim() : currentUser.nickname,
      avatar: updates.avatar || currentUser.avatar,
    };
    try {
      localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(updatedUser));
    } catch {}
    notifyAuthChange(updatedUser);
    return { success: true, user: updatedUser };
  }

  const localUsers = getStoredLocalUsers();
  const userIdx = localUsers.findIndex((u) => u.id === currentUser.id);
  const targetUser = userIdx >= 0 ? localUsers[userIdx] : null;

  let newUsername = currentUser.username;
  if (updates.username && updates.username.trim()) {
    const cleanU = updates.username.trim().toLowerCase().replace(/\s+/g, '_');
    if (cleanU.length < 2) {
      return { success: false, error: 'Username minimal 2 karakter (tanpa spasi).' };
    }
    const conflict = localUsers.find((u) => u.username.toLowerCase() === cleanU && u.id !== currentUser.id);
    if (conflict) {
      return { success: false, error: `Username "${cleanU}" sudah digunakan oleh akun lain.` };
    }
    newUsername = cleanU;
  }

  let newPinHash = targetUser?.pinHash;
  if (updates.pin && updates.pin.trim()) {
    const cleanPin = updates.pin.trim();
    if (cleanPin.length < 4) {
      return { success: false, error: 'PIN baru minimal 4 angka.' };
    }
    newPinHash = await hashPin(cleanPin);
  }

  const updatedDisplayName = updates.displayName?.trim() || currentUser.displayName;
  const updatedNickname = updates.nickname !== undefined ? updates.nickname.trim() : (currentUser.nickname || '');
  const updatedAvatar = updates.avatar || currentUser.avatar || (currentUser.role === 'admin' ? '👑' : '🌱');

  const updatedUser: StudentUser = {
    ...currentUser,
    username: newUsername,
    displayName: updatedDisplayName,
    nickname: updatedNickname,
    avatar: updatedAvatar,
  };

  // Simpan perubahan ke local storage
  if (targetUser) {
    targetUser.username = newUsername;
    targetUser.displayName = updatedDisplayName;
    targetUser.nickname = updatedNickname;
    targetUser.avatar = updatedAvatar;
    if (newPinHash) targetUser.pinHash = newPinHash;
    saveStoredLocalUsers(localUsers);
  }

  try {
    setStoredUserNickname(currentUser.id, updatedNickname);
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(updatedUser));
  } catch {}

  // Sync update profil ke Supabase app_users dan student_quest_meta jika online
  if (supabase) {
    try {
      // 1. Update kolom profil yang pasti di-GRANT ke anon:
      //    display_name, nickname, avatar, updated_at.
      //    (username/pin_hash TIDAK di-grant → update berisi kolom itu
      //     menggelembongkan error dan membuat seluruh update profil gagal)
      const profileUpdates: Record<string, any> = {
        display_name: updatedDisplayName,
        nickname: updatedNickname,
        avatar: updatedAvatar,
        updated_at: new Date().toISOString(),
      };
      const { error: profileErr } = await supabase
        .from('app_users')
        .update(profileUpdates)
        .eq('id', currentUser.id);

      // 2. Username & PIN diupdate terpisah (dengan toleransi bila kolom
      //    tidak di-grant — tetap tersinkroni via RPC admin atau meta).
      if (newUsername !== currentUser.username || newPinHash) {
        const credUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
        if (newUsername !== currentUser.username) credUpdates.username = newUsername;
        if (newPinHash) credUpdates.pin_hash = newPinHash;
        const { error: credErr } = await supabase
          .from('app_users')
          .update(credUpdates)
          .eq('id', currentUser.id);
        if (credErr) {
          console.warn('Update username/PIN ke app_users ditolak kolom GRANT (dicoba via meta):', credErr.message);
        }
      }

      if (profileErr) {
        console.warn('Update profil app_users gagal (tetap lanjut ke mirror meta):', profileErr.message);
      }

      // 2. Simpan juga ke student_quest_meta agar selalu 100% tersinkronkan antar device (HP & PC)
      const { data: existingMeta } = await supabase
        .from('student_quest_meta')
        .select('mnemonic_notes')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      const curNotes = (existingMeta?.mnemonic_notes as Record<string, any>) || {};
      curNotes.__profile_meta = {
        nickname: updatedNickname,
        displayName: updatedDisplayName,
        avatar: updatedAvatar,
        updatedAt: Date.now(),
      };

      await supabase.from('student_quest_meta').upsert({
        user_id: currentUser.id,
        mnemonic_notes: curNotes,
        updated_at: Date.now(),
      });
    } catch (err) {
      console.warn('Gagal sync update profil ke Supabase (offline mode aktif):', err);
    }
  }

  notifyAuthChange(updatedUser);
  return { success: true, user: updatedUser };
}

/**
 * Sinkronkan profil user aktif dari Supabase Cloud (Dipanggil otomatis saat app dimuat di PC maupun HP)
 */
export async function syncActiveUserProfileFromCloud(): Promise<StudentUser | null> {
  const currentUser = getActiveUser();
  if (!currentUser || currentUser.role === 'guest' || !supabase) {
    return currentUser;
  }

  try {
    // 1. Ambil data terbaru dari app_users (hanya kolom publik profil tanpa pin_hash)
    const { data, error } = await supabase
      .from('app_users')
      .select('id, username, display_name, role, is_active, created_at, updated_at, nickname, avatar')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error || !data) {
      return currentUser;
    }

    let updatedDisplayName = data.display_name || '';
    let updatedNickname = (data as any).nickname || '';
    let updatedAvatar = (data as any).avatar || '';
    let cloudEmpty = !updatedNickname && !updatedAvatar;

    // 2. Mirror cadangan di student_quest_meta (__profile_meta)
    try {
      const { data: meta } = await supabase
        .from('student_quest_meta')
        .select('mnemonic_notes')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (meta?.mnemonic_notes?.__profile_meta) {
        const pm = meta.mnemonic_notes.__profile_meta;
        if (pm.nickname) updatedNickname = pm.nickname;
        if (pm.displayName) updatedDisplayName = pm.displayName;
        if (pm.avatar) updatedAvatar = pm.avatar;
        if (updatedNickname || updatedAvatar) cloudEmpty = false;
      }
    } catch {}

    // 3. Profile default-role bila memang tidak pernah diset di manapun
    const roleDefaultAvatar = data.role === 'admin' ? 'avatar_master' : 'avatar_panda';

    // 4. ADOPT: profil lokal device dipush ke cloud bila cloud masih kosong
    //    (profil diset saat masa sync error / belum pernah upload)
    if (cloudEmpty) {
      const localNickname = currentUser.nickname || getStoredUserNickname(currentUser.id) || '';
      const localDisplayName = currentUser.displayName || '';
      const localAvatar = currentUser.avatar || '';
      const hasLocalProfile = !!localNickname || !!localAvatar || (localDisplayName && localDisplayName !== data.display_name);

      if (hasLocalProfile) {
        updatedDisplayName = localDisplayName || data.display_name;
        updatedNickname = localNickname;
        updatedAvatar = localAvatar || roleDefaultAvatar;

        try {
          await supabase
            .from('app_users')
            .update({
              display_name: updatedDisplayName,
              nickname: updatedNickname,
              avatar: updatedAvatar,
              updated_at: new Date().toISOString(),
            })
            .eq('id', currentUser.id);
        } catch {}
        cloudEmpty = false;
      }
    }

    if (!updatedNickname) {
      updatedNickname = getStoredUserNickname(currentUser.id) || '';
    }
    if (!updatedAvatar) {
      updatedAvatar = currentUser.avatar || roleDefaultAvatar;
    }
    if (!updatedDisplayName) {
      updatedDisplayName = currentUser.displayName || data.display_name;
    }

    setStoredUserNickname(currentUser.id, updatedNickname);

    // 5. Tulis mirror __profile_meta agar profil tetap tersinkron antar device
    //    meski kolom app_users bermasalah (kolom ini jauh lebih bebas).
    try {
      const { data: existingMeta } = await supabase
        .from('student_quest_meta')
        .select('mnemonic_notes')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      const curNotesRoot = (existingMeta?.mnemonic_notes as Record<string, any>) || {};
      const prevPm = curNotesRoot.__profile_meta || {};
      const newPm = {
        nickname: updatedNickname,
        displayName: updatedDisplayName,
        avatar: updatedAvatar,
        updatedAt: Math.max(Date.now(), prevPm.updatedAt || 0),
      };
      const changed =
        newPm.nickname !== prevPm.nickname ||
        newPm.displayName !== prevPm.displayName ||
        newPm.avatar !== prevPm.avatar;
      if (changed) {
        curNotesRoot.__profile_meta = newPm;
        await supabase.from('student_quest_meta').upsert({
          user_id: currentUser.id,
          mnemonic_notes: curNotesRoot,
          updated_at: Date.now(),
        });
      }
    } catch {}

    const freshUser: StudentUser = {
      ...currentUser,
      username: data.username || currentUser.username,
      displayName: updatedDisplayName,
      nickname: updatedNickname,
      avatar: updatedAvatar,
      role: data.role as 'admin' | 'student',
      isActive: data.is_active,
    };

    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(freshUser));
    notifyAuthChange(freshUser);
    return freshUser;
  } catch (err) {
    console.warn('Gagal sinkronkan profil dari cloud:', err);
    return currentUser;
  }
}

// ══════════════════════════════════════════════════════════════════════════
// FITUR KHUSUS GURU / ADMIN (MANAJEMEN KELAS & SISWA)
// ══════════════════════════════════════════════════════════════════════════

/**
 * Dapatkan semua siswa di kelas (hanya bisa dipanggil oleh Admin)
 */
export async function listAllStudents(): Promise<StudentUser[]> {
  const localUsers = getStoredLocalUsers();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('id, username, display_name, role, is_active, created_at, nickname, avatar')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Merge Supabase users with local cache
        const merged: StudentUser[] = data.map((d: any) => ({
          id: d.id,
          username: d.username,
          displayName: d.display_name,
          role: d.role as 'admin' | 'student',
          isActive: d.is_active,
          createdAt: new Date(d.created_at).getTime(),
        }));
        return merged;
      }
    } catch (err) {
      console.warn('Failed to load students from Supabase:', err);
    }
  }

  return localUsers.map((u) => ({
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    role: u.role,
    isActive: u.isActive,
    avatar: u.avatar,
    createdAt: u.createdAt,
  }));
}

/**
 * Daftarkan siswa baru oleh Guru (Tanpa registrasi umum)
 */
export async function createStudentAccount(
  displayName: string,
  username: string,
  pin: string
): Promise<{ success: boolean; user?: StudentUser; error?: string }> {
  if (!isAdmin()) {
    return { success: false, error: 'Hanya Guru/Admin yang diizinkan menambah akun siswa.' };
  }

  const cleanName = displayName.trim();
  const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
  const cleanPin = pin.trim();

  if (!cleanName || cleanName.length < 2) {
    return { success: false, error: 'Nama lengkap siswa minimal 2 karakter.' };
  }
  if (!cleanUsername || cleanUsername.length < 2) {
    return { success: false, error: 'Username minimal 2 karakter (huruf/angka tanpa spasi).' };
  }
  if (!cleanPin || cleanPin.length < 4) {
    return { success: false, error: 'PIN minimal 4 angka.' };
  }

  const localUsers = getStoredLocalUsers();
  if (localUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: `Username "${cleanUsername}" sudah digunakan oleh siswa lain.` };
  }

  const pinHash = await hashPin(cleanPin);
  const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();

  const newStudent: StudentUser & { pinHash: string } = {
    id: newId,
    username: cleanUsername,
    displayName: cleanName,
    role: 'student',
    isActive: true,
    avatar: '🌱',
    createdAt: now,
    pinHash,
  };

  // Simpan lokal
  localUsers.push(newStudent);
  saveStoredLocalUsers(localUsers);

  // Simpan ke Supabase jika terhubung (Gunakan RPC aman atau fallback direct insert)
  if (supabase) {
    try {
      const adminUser = getActiveUser();
      const adminAuthHash = getAdminAuthHash();
      let rpcUsed = false;

      if (adminUser && adminAuthHash) {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('admin_create_student', {
          p_admin_username: adminUser.username,
          p_admin_pin_hash: adminAuthHash,
          p_student_id: newStudent.id,
          p_student_name: newStudent.displayName,
          p_student_username: newStudent.username,
          p_student_pin_hash: newStudent.pinHash,
        });
        if (!rpcErr && rpcRes && rpcRes.success) {
          rpcUsed = true;
        }
      }

      if (!rpcUsed) {
        const { error } = await supabase.from('app_users').insert({
          id: newStudent.id,
          username: newStudent.username,
          display_name: newStudent.displayName,
          role: newStudent.role,
          pin_hash: newStudent.pinHash,
          is_active: true,
          created_at: new Date(now).toISOString(),
          updated_at: new Date(now).toISOString(),
        });
        if (error) {
          console.warn('Gagal sync akun siswa ke Supabase:', error.message);
        }
      }
    } catch (err) {
      console.warn('Supabase insert error (fallback lokal tetap aktif):', err);
    }
  }

  return {
    success: true,
    user: {
      id: newStudent.id,
      username: newStudent.username,
      displayName: newStudent.displayName,
      role: newStudent.role,
      isActive: newStudent.isActive,
      avatar: newStudent.avatar,
      createdAt: newStudent.createdAt,
    },
  };
}

/**
 * Reset PIN Siswa oleh Guru jika siswa lupa PIN
 */
export async function resetStudentPin(
  userId: string,
  newPin: string
): Promise<{ success: boolean; error?: string }> {
  if (!isAdmin()) {
    return { success: false, error: 'Hanya Guru/Admin yang diizinkan mereset PIN siswa.' };
  }
  if (!newPin || newPin.trim().length < 4) {
    return { success: false, error: 'PIN baru minimal 4 angka.' };
  }

  const newPinHash = await hashPin(newPin.trim());

  // Update lokal
  const localUsers = getStoredLocalUsers();
  const target = localUsers.find((u) => u.id === userId);
  if (target) {
    target.pinHash = newPinHash;
    saveStoredLocalUsers(localUsers);
  }

  // Update Supabase (Gunakan RPC aman atau fallback direct update)
  if (supabase) {
    try {
      const adminUser = getActiveUser();
      const adminAuthHash = getAdminAuthHash();
      let rpcUsed = false;

      if (adminUser && adminAuthHash) {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('admin_reset_student_pin', {
          p_admin_username: adminUser.username,
          p_admin_pin_hash: adminAuthHash,
          p_student_id: userId,
          p_new_pin_hash: newPinHash,
        });
        if (!rpcErr && rpcRes && rpcRes.success) {
          rpcUsed = true;
        }
      }

      if (!rpcUsed) {
        await supabase
          .from('app_users')
          .update({
            pin_hash: newPinHash,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }
    } catch (err) {
      console.warn('Gagal update PIN di Supabase:', err);
    }
  }

  return { success: true };
}

/**
 * Hapus atau nonaktifkan akun siswa oleh Guru
 */
export async function deleteStudentAccount(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!isAdmin()) {
    return { success: false, error: 'Hanya Guru/Admin yang diizinkan menghapus akun siswa.' };
  }

  const localUsers = getStoredLocalUsers();
  const filtered = localUsers.filter((u) => u.id !== userId);
  saveStoredLocalUsers(filtered);

  // Hapus data progres lokal siswa tersebut (key lama sempat salah tulis:
  // omnilife_leech_words_/omnilife_mnemonic_notes_ — kini semua key asli)
  try {
    localStorage.removeItem(`omnilife_quest_progress_${userId}`);
    localStorage.removeItem(`omnilife_leeches_${userId}`);
    localStorage.removeItem(`omnilife_mnemonics_${userId}`);
    localStorage.removeItem(`omnilife_word_fails_${userId}`);
    localStorage.removeItem(`omnilife_user_nickname_${userId}`);
    localStorage.removeItem(`omnilife_program_settings__${userId}`);
    localStorage.removeItem(`hanzi_quest_prefs__${userId}`);
  } catch {}

  // Hapus di Supabase (Gunakan RPC aman atau fallback direct delete)
  if (supabase) {
    try {
      const adminUser = getActiveUser();
      const adminAuthHash = getAdminAuthHash();
      let rpcUsed = false;

      if (adminUser && adminAuthHash) {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('admin_delete_student', {
          p_admin_username: adminUser.username,
          p_admin_pin_hash: adminAuthHash,
          p_student_id: userId,
        });
        if (!rpcErr && rpcRes && rpcRes.success) {
          rpcUsed = true;
        }
      }

      if (!rpcUsed) {
        await supabase.from('app_users').delete().eq('id', userId);
        await supabase.from('student_quest_progress').delete().eq('user_id', userId);
        await supabase.from('student_quest_meta').delete().eq('user_id', userId);
      }
    } catch (err) {
      console.warn('Gagal hapus di Supabase:', err);
    }
  }

  return { success: true };
}
