-- ====================================================================
-- OMNILIFE: Skrip Pembuatan 4 Tabel Flashcard Anki di Supabase Cloud
-- Jalankan skrip ini di Supabase SQL Editor:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> SQL Editor -> New query
-- 3. Tempel (Paste) seluruh skrip di bawah ini, lalu klik RUN
-- ====================================================================

-- 1. Tabel Learning Decks (Koleksi Deck Anki & Subdeck)
CREATE TABLE IF NOT EXISTS public.learning_decks (
  id TEXT PRIMARY KEY,
  owner_id TEXT DEFAULT 'usr_local_default',
  name TEXT NOT NULL,
  parent_deck_id TEXT,
  source TEXT DEFAULT 'anki_import',
  source_package_fingerprint TEXT,
  card_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Flashcard Notes (Data Catatan/Field Anki)
CREATE TABLE IF NOT EXISTS public.flashcard_notes (
  id TEXT PRIMARY KEY,
  deck_id TEXT NOT NULL,
  source_note_identifier TEXT,
  note_type_name TEXT,
  fields JSONB DEFAULT '{}'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  import_status TEXT DEFAULT 'supported',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Flashcard Cards (Kartu Belajar SRS, Audio & Gambar)
CREATE TABLE IF NOT EXISTS public.flashcard_cards (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  deck_id TEXT NOT NULL,
  source_card_ordinal INTEGER DEFAULT 0,
  card_type TEXT DEFAULT 'basic',
  front_content TEXT NOT NULL,
  back_content TEXT NOT NULL,
  audio_urls TEXT DEFAULT '[]',
  image_urls TEXT DEFAULT '[]',
  source_template_name TEXT,
  study_status TEXT DEFAULT 'not_started',
  interval_days INTEGER DEFAULT 0,
  ease_factor REAL DEFAULT 2.5,
  repetitions INTEGER DEFAULT 0,
  lapses INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Imported Media Assets (Audio MP3 & Gambar Anki)
CREATE TABLE IF NOT EXISTS public.imported_media_assets (
  id TEXT PRIMARY KEY,
  owner_id TEXT DEFAULT 'usr_local_default',
  source_package_fingerprint TEXT,
  source_file_name TEXT NOT NULL,
  safe_file_name TEXT NOT NULL,
  media_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  data_base64 TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- RLS & PERMISSION SETUP (Agar Sync Bebas Hambatan)
-- ====================================================================

ALTER TABLE public.learning_decks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.imported_media_assets DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all public" ON public.learning_decks;
DROP POLICY IF EXISTS "Allow all public" ON public.flashcard_notes;
DROP POLICY IF EXISTS "Allow all public" ON public.flashcard_cards;
DROP POLICY IF EXISTS "Allow all public" ON public.imported_media_assets;

CREATE POLICY "Allow all public" ON public.learning_decks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public" ON public.flashcard_notes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public" ON public.flashcard_cards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public" ON public.imported_media_assets FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ====================================================================
-- REALTIME PUBLICATION REPLICATION (<1 Detik Otomatis Berubah di HP)
-- ====================================================================

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_decks;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flashcard_notes;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flashcard_cards;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.imported_media_assets;
  EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

NOTIFY pgrst, 'reload schema';
