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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users(username);

-- 2. Akun Master Admin Awal (Username: admin, PIN: 170603)
-- Hash di bawah ini adalah SHA-256 dari 'hanzi_quest_class_salt_170603'
INSERT INTO app_users (id, username, display_name, role, pin_hash, is_active)
VALUES (
  'usr_admin_master',
  'admin',
  'Guru / Master Admin',
  'admin',
  'f0c11306b3a985e50529e8436ba33b664fcfead80709d6fbb6b6fe29b20e0ffb',
  true
)
ON CONFLICT (id) DO NOTHING;

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
  updated_at BIGINT NOT NULL
);

-- 5. Nonaktifkan RLS agar dapat dibaca & ditulis oleh public web anon key (Protected by PIN & client app)
ALTER TABLE app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quest_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quest_meta DISABLE ROW LEVEL SECURITY;
