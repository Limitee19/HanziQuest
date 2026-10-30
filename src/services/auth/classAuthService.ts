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

// Master PIN cadangan dari environment (jika ada)
const ENV_MASTER_PIN = (((import.meta as any).env?.VITE_APP_MASTER_PIN as string) || '170603').trim();

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
  const defaultAdminHash = await hashPin(ENV_MASTER_PIN);

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
  return u ? u.id : 'usr_guest';
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

  // 1. Coba verifikasi via Supabase jika online & terkonfigurasi
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
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
          localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(loggedUser));
          notifyAuthChange(loggedUser);
          import('@/services/chinese/questService').then((m) => m.syncStudentQuestProgress(true)).catch(() => {});
          return { success: true, user: loggedUser };
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
    // Khusus Admin darurat jika PIN sesuai ENV_MASTER_PIN (170603)
    if ((cleanUsername === '260242649788' || cleanUsername === 'admin') && (cleanPin === '170603' || cleanPin === ENV_MASTER_PIN)) {
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
      localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(adminUser));
      notifyAuthChange(adminUser);
      import('@/services/chinese/questService').then((m) => m.syncStudentQuestProgress(true)).catch(() => {});
      return { success: true, user: adminUser };
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

  localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(sessionUser));
  notifyAuthChange(sessionUser);
  import('@/services/chinese/questService').then((m) => m.syncStudentQuestProgress(true)).catch(() => {});
  return { success: true, user: sessionUser };
}

/**
 * Logout pengguna yang sedang aktif
 */
export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
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
      // 1. Coba update app_users dengan semua kolom
      const dbUpdates: Record<string, any> = {
        username: newUsername,
        display_name: updatedDisplayName,
        nickname: updatedNickname,
        avatar: updatedAvatar,
        updated_at: new Date().toISOString(),
      };
      if (newPinHash) {
        dbUpdates.pin_hash = newPinHash;
      }

      const { error: primaryErr } = await supabase.from('app_users').update(dbUpdates).eq('id', currentUser.id);
      if (primaryErr) {
        // Fallback jika kolom nickname/avatar belum ada di app_users
        const safeUpdates: Record<string, any> = {
          username: newUsername,
          display_name: updatedDisplayName,
          updated_at: new Date().toISOString(),
        };
        if (newPinHash) safeUpdates.pin_hash = newPinHash;
        await supabase.from('app_users').update(safeUpdates).eq('id', currentUser.id);
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
    // 1. Ambil data terbaru dari app_users
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error || !data) {
      return currentUser;
    }

    let updatedDisplayName = data.display_name || currentUser.displayName;
    let updatedNickname = (data as any).nickname || currentUser.nickname || '';
    let updatedAvatar = (data as any).avatar || currentUser.avatar || (data.role === 'admin' ? 'avatar_master' : 'avatar_panda');

    // 2. Cek juga di student_quest_meta untuk sinkronisasi cadangan
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
      }
    } catch {}

    if (!updatedNickname) {
      updatedNickname = getStoredUserNickname(currentUser.id);
    } else {
      setStoredUserNickname(currentUser.id, updatedNickname);
    }

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
        .select('*')
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

  // Simpan ke Supabase jika terhubung
  if (supabase) {
    try {
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

  // Update Supabase
  if (supabase) {
    try {
      await supabase
        .from('app_users')
        .update({
          pin_hash: newPinHash,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
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

  // Hapus data progres lokal siswa tersebut
  try {
    localStorage.removeItem(`omnilife_quest_progress_${userId}`);
    localStorage.removeItem(`omnilife_leech_words_${userId}`);
    localStorage.removeItem(`omnilife_mnemonic_notes_${userId}`);
  } catch {}

  // Hapus di Supabase
  if (supabase) {
    try {
      await supabase.from('app_users').delete().eq('id', userId);
      await supabase.from('student_quest_progress').delete().eq('user_id', userId);
      await supabase.from('student_quest_meta').delete().eq('user_id', userId);
    } catch (err) {
      console.warn('Gagal hapus di Supabase:', err);
    }
  }

  return { success: true };
}
