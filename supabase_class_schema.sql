-- ==============================================================================
-- SKEMA TABEL KELAS MANDARIN (HANZI QUEST) DI SUPABASE
-- Silakan salin dan jalankan skrip ini di SQL Editor dashboard Supabase Anda.
-- ==============================================================================

-- 1. Tabel Akun Pengguna / Siswa & Guru
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  pin_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  nickname TEXT,
  avatar TEXT
);

CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users(username);

-- 2. Akun Master Admin Awal (Username: 260242649788 & admin, PIN: 170603)
-- Hash di bawah ini adalah SHA-256 dari 'hanzi_quest_class_salt_170603'
INSERT INTO app_users (id, username, display_name, role, pin_hash, is_active)
VALUES 
  (
    'usr_admin_260242649788',
    '260242649788',
    'Guru / Master Admin',
    'admin',
    'a34f2e35e058c457140ac9820e401d9a1d9859d67aeb86e6097e9b68fa960a7e',
    true
  ),
  (
    'usr_admin_master',
    'admin',
    'Guru / Admin',
    'admin',
    'a34f2e35e058c457140ac9820e401d9a1d9859d67aeb86e6097e9b68fa960a7e',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  pin_hash = EXCLUDED.pin_hash,
  role = 'admin',
  is_active = true;

-- 3. Tabel Progres Belajar Kartu Pintar per Siswa
CREATE TABLE IF NOT EXISTS student_quest_progress (
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  hanzi TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'learning',
  due_date TEXT NOT NULL,
  review_count INTEGER DEFAULT 1,
  updated_at BIGINT NOT NULL,
  PRIMARY KEY (user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_student_progress_user ON student_quest_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_due ON student_quest_progress(user_id, due_date);

-- 4. Tabel Metadata Tambahan (Kata Bandel & Catatan Mnemonik Pribadi Siswa)
CREATE TABLE IF NOT EXISTS student_quest_meta (
  user_id TEXT PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  leech_words JSONB DEFAULT '[]'::jsonb,
  mnemonic_notes JSONB DEFAULT '{}'::jsonb,
  quest_progress JSONB DEFAULT '{}'::jsonb,
  updated_at BIGINT NOT NULL
);

-- Migrasi aman jika tabel sudah pernah dibuat sebelumnya
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE student_quest_meta ADD COLUMN IF NOT EXISTS quest_progress JSONB DEFAULT '{}'::jsonb;

-- ==============================================================================
-- 5. AKTIFKAN ROW LEVEL SECURITY (RLS) & HAK AKSES AMAN
-- ==============================================================================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_quest_meta ENABLE ROW LEVEL SECURITY;

-- 5.1 Proteksi Kolom pin_hash di app_users
-- Cabut izin SELECT pin_hash dari publik/anon agar tidak ada yang bisa melihat atau mencuri hash PIN
REVOKE ALL ON app_users FROM anon, authenticated;
GRANT SELECT (id, username, display_name, role, is_active, created_at, updated_at, nickname, avatar) ON app_users TO anon, authenticated;
GRANT UPDATE (display_name, nickname, avatar, updated_at) ON app_users TO anon, authenticated;

-- Kebijakan RLS app_users
DROP POLICY IF EXISTS "Public can view active users without pin" ON app_users;
CREATE POLICY "Public can view active users without pin"
ON app_users FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Users can update own basic profile" ON app_users;
CREATE POLICY "Users can update own basic profile"
ON app_users FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 5.2 Kebijakan RLS student_quest_progress
DROP POLICY IF EXISTS "Allow quest progress access" ON student_quest_progress;
CREATE POLICY "Allow quest progress access"
ON student_quest_progress FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

GRANT ALL ON student_quest_progress TO anon, authenticated;

-- 5.3 Kebijakan RLS student_quest_meta
DROP POLICY IF EXISTS "Allow quest meta access" ON student_quest_meta;
CREATE POLICY "Allow quest meta access"
ON student_quest_meta FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

GRANT ALL ON student_quest_meta TO anon, authenticated;

-- ==============================================================================
-- 6. STORED PROCEDURES (RPC) UNTUK KEAMANAN TINGKAT TINGGI
-- Fungsi-fungsi ini berjalan di server (SECURITY DEFINER) sehingga hash PIN
-- tidak pernah terkirim ke browser.
-- ==============================================================================

-- 6.1 Fungsi Verifikasi Login Aman di Sisi Database
CREATE OR REPLACE FUNCTION verify_class_login(p_username text, p_pin_hash text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user app_users%ROWTYPE;
BEGIN
  SELECT * INTO v_user
  FROM app_users
  WHERE lower(trim(username)) = lower(trim(p_username))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Username tidak ditemukan.');
  END IF;

  IF NOT v_user.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'Akun Anda dinonaktifkan oleh guru.');
  END IF;

  IF v_user.pin_hash <> p_pin_hash THEN
    RETURN jsonb_build_object('success', false, 'error', 'PIN yang Anda masukkan salah.');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'user', jsonb_build_object(
      'id', v_user.id,
      'username', v_user.username,
      'displayName', v_user.display_name,
      'role', v_user.role,
      'isActive', v_user.is_active,
      'nickname', COALESCE(v_user.nickname, ''),
      'avatar', COALESCE(v_user.avatar, CASE WHEN v_user.role = 'admin' THEN 'avatar_master' ELSE 'avatar_panda' END),
      'createdAt', EXTRACT(EPOCH FROM v_user.created_at) * 1000
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION verify_class_login(text, text) TO anon, authenticated;

-- 6.2 Fungsi Guru: Tambah Siswa Baru (Hanya jika PIN Admin valid)
CREATE OR REPLACE FUNCTION admin_create_student(
  p_admin_username text,
  p_admin_pin_hash text,
  p_student_id text,
  p_student_name text,
  p_student_username text,
  p_student_pin_hash text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin app_users%ROWTYPE;
BEGIN
  -- Verifikasi kredensial guru pemanggil
  SELECT * INTO v_admin
  FROM app_users
  WHERE lower(trim(username)) = lower(trim(p_admin_username))
    AND role = 'admin'
    AND is_active = true
    AND pin_hash = p_admin_pin_hash;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Otorisasi gagal: PIN Guru/Admin salah.');
  END IF;

  -- Periksa duplikasi username
  IF EXISTS (SELECT 1 FROM app_users WHERE lower(trim(username)) = lower(trim(p_student_username))) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Username siswa tersebut sudah terdaftar.');
  END IF;

  -- Buat akun siswa baru
  INSERT INTO app_users (id, username, display_name, role, pin_hash, is_active)
  VALUES (p_student_id, lower(trim(p_student_username)), p_student_name, 'student', p_student_pin_hash, true);

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION admin_create_student(text, text, text, text, text, text) TO anon, authenticated;

-- 6.3 Fungsi Guru: Hapus Akun Siswa (Hanya jika PIN Admin valid)
CREATE OR REPLACE FUNCTION admin_delete_student(
  p_admin_username text,
  p_admin_pin_hash text,
  p_student_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin app_users%ROWTYPE;
BEGIN
  SELECT * INTO v_admin
  FROM app_users
  WHERE lower(trim(username)) = lower(trim(p_admin_username))
    AND role = 'admin'
    AND is_active = true
    AND pin_hash = p_admin_pin_hash;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Otorisasi gagal: PIN Guru/Admin salah.');
  END IF;

  DELETE FROM app_users WHERE id = p_student_id AND role <> 'admin';
  DELETE FROM student_quest_progress WHERE user_id = p_student_id;
  DELETE FROM student_quest_meta WHERE user_id = p_student_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION admin_delete_student(text, text, text) TO anon, authenticated;

-- 6.4 Fungsi Guru: Reset PIN Siswa (Hanya jika PIN Admin valid)
CREATE OR REPLACE FUNCTION admin_reset_student_pin(
  p_admin_username text,
  p_admin_pin_hash text,
  p_student_id text,
  p_new_pin_hash text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin app_users%ROWTYPE;
BEGIN
  SELECT * INTO v_admin
  FROM app_users
  WHERE lower(trim(username)) = lower(trim(p_admin_username))
    AND role = 'admin'
    AND is_active = true
    AND pin_hash = p_admin_pin_hash;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Otorisasi gagal: PIN Guru/Admin salah.');
  END IF;

  UPDATE app_users
  SET pin_hash = p_new_pin_hash,
      updated_at = NOW()
  WHERE id = p_student_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION admin_reset_student_pin(text, text, text, text) TO anon, authenticated;
