-- ============================================================
-- OmniLife — One-time Supabase cleanup: reclaim Anki media bloat
-- ============================================================
-- Context:
--   Starting from app build with local-first Anki media, the table
--   imported_media_assets is NEVER synced to Supabase anymore, and
--   flashcard_cards rows now persist lightweight tokens instead of
--   embedded base64 data URLs. Old cloud rows must be cleaned once.
--
-- HOW TO RUN:
--   1. IMPORTANT: update BOTH devices (Desktop + Android) to the new
--      app build FIRST, and let them sync once. Otherwise an old
--      device could re-push bloated rows to the cloud.
--   2. Open Supabase Dashboard -> SQL Editor (project UTAMA).
--   3. Run the statements below one by one, checking outputs.
-- ============================================================

-- 0) Sanity check: see current sizes (top 10 tables)
SELECT relname AS table_name,
       pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;

-- 1) Check how many media rows & bytes are stored (expect several MB)
SELECT COUNT(*) AS media_rows,
       pg_size_pretty(COALESCE(SUM(length(data_base64)), 0)) AS media_bytes
FROM imported_media_assets;

-- 2) Verify cards are already tokenized (should be 0 on updated devices)
SELECT COUNT(*) AS cards_still_with_base64
FROM flashcard_cards
WHERE front_content LIKE 'data:%'
   OR back_content LIKE 'data:%';

-- 3) Delete all synced Anki media rows (safe: media lives locally now)
DELETE FROM imported_media_assets;

-- 4) Reclaim disk space (takes an exclusive lock; fine on free tier)
VACUUM FULL imported_media_assets;

-- 5) Optional extra reclaim if some old cards still carry base64 in
--    cloud rows that the app repair could not rewrite (e.g. device
--    never re-synced). ONLY run if step 2 reported > 0 AND devices
--    have synced after updating:
-- UPDATE flashcard_cards
--    SET front_content = '',
--        back_content  = ''
--  WHERE front_content LIKE 'data:%'
--     OR back_content  LIKE 'data:%';
-- VACUUM FULL flashcard_cards;

-- 6) Verify the result: database size should drop by ~50MB
SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size;

-- 7) Final size report (top 10)
SELECT relname AS table_name,
       pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;
