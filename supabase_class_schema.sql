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

-- 5. Nonaktifkan RLS agar dapat dibaca & ditulis oleh public web anon key (Protected by PIN & client app)
ALTER TABLE app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quest_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quest_meta DISABLE ROW LEVEL SECURITY;
