-- ====================================================================
-- OmniLife — Complete & Up-to-Date Supabase Cloud Database Schema
-- Jalankan seluruh skrip SQL ini di Supabase SQL Editor:
-- Supabase Dashboard -> Project Anda -> SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. App Metadata
CREATE TABLE IF NOT EXISTS app_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. College Profile
CREATE TABLE IF NOT EXISTS college_profile (
  id TEXT PRIMARY KEY,
  institution_name TEXT NOT NULL,
  major TEXT DEFAULT '',
  student_id TEXT DEFAULT '',
  campus TEXT DEFAULT '',
  advisor_name TEXT DEFAULT '',
  advisor_nip TEXT DEFAULT '',
  program TEXT DEFAULT '',
  faculty TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Semesters
CREATE TABLE IF NOT EXISTS semesters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'active',
  is_active INTEGER DEFAULT 0,
  academic_year TEXT DEFAULT '2026/2027',
  is_current INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Courses
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  semester_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT DEFAULT '',
  credits INTEGER DEFAULT 3,
  sks INTEGER DEFAULT 2,
  course_group TEXT DEFAULT 'required',
  course_level TEXT DEFAULT 'program_studi',
  default_semester INTEGER DEFAULT 1,
  instructor TEXT DEFAULT '',
  room TEXT DEFAULT '',
  color TEXT DEFAULT '#3b82f6',
  status TEXT DEFAULT 'active',
  description TEXT DEFAULT '',
  website TEXT DEFAULT '',
  contact TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Course Schedules
CREATE TABLE IF NOT EXISTS course_schedules (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  room TEXT DEFAULT '',
  start_period INTEGER,
  end_period INTEGER,
  instructor TEXT DEFAULT '',
  instructor_id TEXT DEFAULT '',
  period_profile_id TEXT DEFAULT 'prof_um_regular',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  task_id TEXT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  due_date TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'not_started',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Exams
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  exam_type TEXT DEFAULT 'midterm',
  date TEXT NOT NULL,
  start_time TEXT DEFAULT '',
  end_time TEXT DEFAULT '',
  location TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Grades
CREATE TABLE IF NOT EXISTS grades (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'assignment',
  score NUMERIC NOT NULL,
  max_score NUMERIC DEFAULT 100,
  weight NUMERIC DEFAULT 0,
  date TEXT,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. UM Lecturers (Dosen UM)
CREATE TABLE IF NOT EXISTS um_lecturers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  academic_identifier TEXT DEFAULT '',
  department TEXT DEFAULT '',
  email TEXT DEFAULT '',
  roles TEXT DEFAULT '[]',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Study Plans (KRS)
CREATE TABLE IF NOT EXISTS study_plans (
  id TEXT PRIMARY KEY,
  academic_term_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  advisor_lecturer_id TEXT,
  advisor_name TEXT DEFAULT '',
  maximum_credits INTEGER DEFAULT 24,
  target_credits INTEGER DEFAULT 20,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  advisor_note TEXT DEFAULT '',
  personal_tracking_disclaimer_acknowledged BOOLEAN DEFAULT true,
  disclaimer_acknowledged BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Study Plan Items (Mata Kuliah di KRS)
CREATE TABLE IF NOT EXISTS study_plan_items (
  id TEXT PRIMARY KEY,
  study_plan_id TEXT NOT NULL,
  course_class_id TEXT,
  course_id_snapshot TEXT NOT NULL,
  course_name_snapshot TEXT NOT NULL,
  course_code_snapshot TEXT DEFAULT '',
  credits_snapshot INTEGER DEFAULT 3,
  status TEXT DEFAULT 'selected',
  note TEXT DEFAULT '',
  conflict_override_reason TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
-- Upgrade idempoten (versi lama -> versi app):
ALTER TABLE study_plan_items ALTER COLUMN course_id DROP NOT NULL;
ALTER TABLE study_plan_items ADD COLUMN IF NOT EXISTS course_id_snapshot TEXT;
ALTER TABLE study_plan_items ADD COLUMN IF NOT EXISTS course_name_snapshot TEXT;
ALTER TABLE study_plan_items ADD COLUMN IF NOT EXISTS course_code_snapshot TEXT DEFAULT '';
ALTER TABLE study_plan_items ADD COLUMN IF NOT EXISTS credits_snapshot INTEGER DEFAULT 3;
ALTER TABLE study_plan_items ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'selected';
ALTER TABLE study_plan_items ADD COLUMN IF NOT EXISTS note TEXT DEFAULT '';
ALTER TABLE study_plan_items ADD COLUMN IF NOT EXISTS conflict_override_reason TEXT DEFAULT '';
ALTER TABLE study_plan_items ADD COLUMN IF NOT EXISTS created_at TEXT;
ALTER TABLE study_plan_items ADD COLUMN IF NOT EXISTS updated_at TEXT;
ALTER TABLE study_plan_items ALTER COLUMN created_at DROP NOT NULL;
ALTER TABLE study_plan_items ALTER COLUMN updated_at DROP NOT NULL;

-- 12. Study Plan Status History
CREATE TABLE IF NOT EXISTS study_plan_status_history (
  id TEXT PRIMARY KEY,
  study_plan_id TEXT NOT NULL,
  previous_status TEXT NOT NULL,
  next_status TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  note TEXT DEFAULT ''
);

-- 13. Academic Calendar Events
CREATE TABLE IF NOT EXISTS academic_calendar_events (
  id TEXT PRIMARY KEY,
  academic_term_id TEXT,
  category TEXT DEFAULT 'general',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  is_full_day BOOLEAN DEFAULT true,
  affects_schedule BOOLEAN DEFAULT false,
  is_holiday BOOLEAN DEFAULT false,
  is_exam_period BOOLEAN DEFAULT false,
  is_krs_period BOOLEAN DEFAULT false,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Class Meeting Exceptions
CREATE TABLE IF NOT EXISTS class_meeting_exceptions (
  id TEXT PRIMARY KEY,
  class_meeting_id TEXT NOT NULL,
  occurrence_date TEXT NOT NULL,
  type TEXT NOT NULL,
  replacement_date TEXT,
  replacement_starts_at TEXT,
  replacement_ends_at TEXT,
  replacement_room_id TEXT,
  replacement_room_code TEXT,
  note TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
-- Upgrade idempoten (versi lama -> versi app):
ALTER TABLE class_meeting_exceptions ALTER COLUMN original_date DROP NOT NULL;
ALTER TABLE class_meeting_exceptions ALTER COLUMN exception_type DROP NOT NULL;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS class_meeting_id TEXT;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS occurrence_date TEXT;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS replacement_date TEXT;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS replacement_starts_at TEXT;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS replacement_ends_at TEXT;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS replacement_room_id TEXT;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS replacement_room_code TEXT;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS note TEXT DEFAULT '';
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS created_at TEXT;
ALTER TABLE class_meeting_exceptions ADD COLUMN IF NOT EXISTS updated_at TEXT;
ALTER TABLE class_meeting_exceptions ALTER COLUMN created_at DROP NOT NULL;
ALTER TABLE class_meeting_exceptions ALTER COLUMN updated_at DROP NOT NULL;

-- 15. Period Profile Windows
CREATE TABLE IF NOT EXISTS period_profile_windows (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Academic Resource Links
CREATE TABLE IF NOT EXISTS academic_resource_links (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relationship_type TEXT DEFAULT 'primary',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
-- Upgrade idempoten (versi lama -> versi app):
ALTER TABLE academic_resource_links ALTER COLUMN resource_type DROP NOT NULL;
ALTER TABLE academic_resource_links ALTER COLUMN resource_id DROP NOT NULL;
ALTER TABLE academic_resource_links ADD COLUMN IF NOT EXISTS source_type TEXT;
ALTER TABLE academic_resource_links ADD COLUMN IF NOT EXISTS source_id TEXT;
ALTER TABLE academic_resource_links ADD COLUMN IF NOT EXISTS target_type TEXT;
ALTER TABLE academic_resource_links ADD COLUMN IF NOT EXISTS target_id TEXT;
ALTER TABLE academic_resource_links ADD COLUMN IF NOT EXISTS relationship_type TEXT DEFAULT 'primary';
ALTER TABLE academic_resource_links ADD COLUMN IF NOT EXISTS created_at TEXT;
ALTER TABLE academic_resource_links ADD COLUMN IF NOT EXISTS updated_at TEXT;

-- 17. Course Syllabi (RPS)
CREATE TABLE IF NOT EXISTS course_syllabi (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  version_label TEXT NOT NULL,
  effective_from_term_id TEXT,
  status TEXT DEFAULT 'active',
  description TEXT DEFAULT '',
  learning_methods TEXT DEFAULT '',
  assessment_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Course Learning Outcomes (CPMK)
CREATE TABLE IF NOT EXISTS course_learning_outcomes (
  id TEXT PRIMARY KEY,
  syllabus_id TEXT NOT NULL,
  type TEXT NOT NULL,
  code TEXT DEFAULT '',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  parent_outcome_id TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 19. Course Materials (Materi Mingguan)
CREATE TABLE IF NOT EXISTS course_materials (
  id TEXT PRIMARY KEY,
  syllabus_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  week_number INTEGER,
  linked_outcome_ids TEXT DEFAULT '[]',
  sort_order INTEGER DEFAULT 0
);

-- 20. Course References (Buku & Rujukan)
CREATE TABLE IF NOT EXISTS course_references (
  id TEXT PRIMARY KEY,
  syllabus_id TEXT NOT NULL,
  type TEXT DEFAULT 'book',
  citation TEXT NOT NULL,
  title TEXT DEFAULT '',
  author TEXT DEFAULT '',
  publisher TEXT DEFAULT '',
  publication_year TEXT DEFAULT '',
  url TEXT DEFAULT '',
  note TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

-- 21. Course Lecturer Assignments (Dosen Pengampu Matkul)
CREATE TABLE IF NOT EXISTS course_lecturer_assignments (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  lecturer_id TEXT NOT NULL,
  role TEXT DEFAULT 'lecturer',
  note TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

-- 22. Mandarin Vocabularies
CREATE TABLE IF NOT EXISTS chinese_vocabularies (
  id TEXT PRIMARY KEY,
  course_id TEXT,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  meaning_id TEXT NOT NULL,
  meaning_en TEXT DEFAULT '',
  hsk_level INTEGER DEFAULT 1,
  notes TEXT DEFAULT '',
  mastery_level INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. Mandarin Practice Sessions
CREATE TABLE IF NOT EXISTS chinese_practice_sessions (
  id TEXT PRIMARY KEY,
  course_id TEXT,
  session_date TEXT NOT NULL,
  mode TEXT DEFAULT 'flashcard',
  cards_reviewed INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  task_type TEXT DEFAULT 'one_time',
  due_date TEXT,
  scheduled_date TEXT,
  completed_at TEXT,
  project_id TEXT,
  goal_id TEXT,
  course_id TEXT,
  checklist TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. Notes
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  date TEXT,
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  is_pinned INTEGER DEFAULT 0,
  is_important INTEGER DEFAULT 0,
  project_id TEXT,
  goal_id TEXT,
  course_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. Calendar Entries
CREATE TABLE IF NOT EXISTS calendar_entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  category TEXT DEFAULT 'Personal',
  priority TEXT DEFAULT 'normal',
  is_important INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. Financial Accounts
CREATE TABLE IF NOT EXISTS financial_accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  starting_balance REAL DEFAULT 0,
  current_balance REAL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. Financial Categories
CREATE TABLE IF NOT EXISTS financial_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT,
  color TEXT
);

-- 29. Financial Transactions
CREATE TABLE IF NOT EXISTS financial_transactions (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  category_id TEXT,
  account_id TEXT NOT NULL,
  destination_account_id TEXT,
  description TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 30. Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  monthly_limit REAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 31. Reminders
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  remind_at TEXT NOT NULL,
  reminder_type TEXT DEFAULT 'one_time',
  is_triggered INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 32. Goals
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'Active',
  priority TEXT DEFAULT 'medium',
  target_date TEXT,
  completed_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 33. Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT DEFAULT 'IDR',
  billing_cycle TEXT DEFAULT 'monthly',
  next_billing_date TEXT NOT NULL,
  category TEXT DEFAULT 'Entertainment',
  account_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 34. Inventory
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  quantity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'owned',
  purchase_date TEXT,
  purchase_price REAL DEFAULT 0,
  location TEXT DEFAULT '',
  brand TEXT DEFAULT '',
  model TEXT DEFAULT '',
  serial_number TEXT DEFAULT '',
  warranty_expiration TEXT,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 35. Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  estimated_price REAL DEFAULT 0,
  currency TEXT DEFAULT 'IDR',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'want',
  goal_id TEXT,
  target_date TEXT,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 36. Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  goal_id TEXT,
  course_id TEXT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'Active',
  priority TEXT DEFAULT 'medium',
  start_date TEXT,
  target_date TEXT,
  completed_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 37. Curriculums
CREATE TABLE IF NOT EXISTS curriculums (
  id TEXT PRIMARY KEY,
  program_name TEXT NOT NULL,
  curriculum_name TEXT NOT NULL,
  version_label TEXT NOT NULL,
  total_required_credits INTEGER DEFAULT 144,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 38. Curriculum Requirements
CREATE TABLE IF NOT EXISTS curriculum_requirements (
  id TEXT PRIMARY KEY,
  curriculum_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  minimum_credits INTEGER DEFAULT 0,
  is_required INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 39. Course Equivalencies
CREATE TABLE IF NOT EXISTS course_equivalencies (
  id TEXT PRIMARY KEY,
  source_course_code TEXT NOT NULL,
  source_course_name TEXT NOT NULL,
  target_course_id TEXT NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 40. Grade Scales
CREATE TABLE IF NOT EXISTS grade_scales (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  institution TEXT DEFAULT 'Universitas Negeri Malang',
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 41. Grade Scale Items
CREATE TABLE IF NOT EXISTS grade_scale_items (
  id TEXT PRIMARY KEY,
  grade_scale_id TEXT NOT NULL,
  letter TEXT NOT NULL,
  minimum_score NUMERIC NOT NULL,
  maximum_score NUMERIC NOT NULL,
  grade_point NUMERIC NOT NULL,
  is_passing INTEGER DEFAULT 1,
  counts_toward_gpa INTEGER DEFAULT 1,
  counts_completed_credits INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

-- 42. Course Attempts (KHS & Nilai Huruf Matkul)
CREATE TABLE IF NOT EXISTS course_attempts (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  semester_id TEXT NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  numeric_score NUMERIC,
  letter_grade TEXT,
  grade_point NUMERIC,
  credits_earned INTEGER DEFAULT 0,
  is_passed INTEGER DEFAULT 1,
  is_transfer INTEGER DEFAULT 0,
  counts_toward_gpa INTEGER DEFAULT 1,
  counts_completed_credits INTEGER DEFAULT 1,
  is_latest_attempt INTEGER DEFAULT 1,
  is_highest_grade INTEGER DEFAULT 1,
  notes TEXT DEFAULT '',
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 43. Safety Checkpoints
CREATE TABLE IF NOT EXISTS safety_checkpoints (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  reason TEXT NOT NULL,
  data_json TEXT NOT NULL,
  checksum TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 44. Academic Audit Logs
CREATE TABLE IF NOT EXISTS academic_audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 45. Vault Categories & Entries
CREATE TABLE IF NOT EXISTS vault_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vault_entries (
  id TEXT PRIMARY KEY,
  service_name TEXT NOT NULL,
  username TEXT,
  email TEXT,
  encrypted_password TEXT,
  account_id TEXT,
  recovery_info TEXT,
  notes TEXT,
  url TEXT,
  category_id TEXT,
  item_type TEXT DEFAULT 'login',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 46. Knowledge Categories & Entries
CREATE TABLE IF NOT EXISTS knowledge_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT
);

CREATE TABLE IF NOT EXISTS knowledge_entries (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  course_id TEXT,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 47. Routines & Occurrences
CREATE TABLE IF NOT EXISTS routines (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  frequency TEXT NOT NULL,
  weekdays TEXT DEFAULT '[]',
  time_of_day TEXT,
  checklist TEXT DEFAULT '[]',
  category TEXT DEFAULT 'Personal',
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routine_occurrences (
  id TEXT PRIMARY KEY,
  routine_id TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  completed_checklist TEXT DEFAULT '[]',
  notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 48. Important Info & Documents
CREATE TABLE IF NOT EXISTS important_info (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  content TEXT DEFAULT '',
  expiration_date TEXT,
  tags TEXT DEFAULT '[]',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  description TEXT DEFAULT '',
  document_date TEXT,
  expiration_date TEXT,
  document_number TEXT DEFAULT '',
  issuer TEXT DEFAULT '',
  location_reference TEXT DEFAULT '',
  file_path TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 49. Sync Outbox (Queue Offline Sync)
CREATE TABLE IF NOT EXISTS sync_outbox (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- ====================================================================
-- SAFE COLUMN MIGRATION FOR EXISTING SUPABASE TABLES
-- (Menambahkan kolom-kolom baru jika tabel sudah pernah dibuat sebelumnya)
-- ====================================================================

-- 1. Courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS sks INTEGER DEFAULT 2;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_group TEXT DEFAULT 'required';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_level TEXT DEFAULT 'program_studi';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS default_semester INTEGER DEFAULT 1;

-- 2. Course Schedules
ALTER TABLE course_schedules ADD COLUMN IF NOT EXISTS start_period INTEGER;
ALTER TABLE course_schedules ADD COLUMN IF NOT EXISTS end_period INTEGER;
ALTER TABLE course_schedules ADD COLUMN IF NOT EXISTS instructor TEXT DEFAULT '';
ALTER TABLE course_schedules ADD COLUMN IF NOT EXISTS instructor_id TEXT DEFAULT '';
ALTER TABLE course_schedules ADD COLUMN IF NOT EXISTS period_profile_id TEXT DEFAULT 'prof_um_regular';

-- 3. UM Lecturers
ALTER TABLE um_lecturers ADD COLUMN IF NOT EXISTS department TEXT DEFAULT '';
ALTER TABLE um_lecturers ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';

-- 4. Reminders
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS remind_at TEXT;
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS reminder_type TEXT DEFAULT 'one_time';
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS is_triggered INTEGER DEFAULT 0;
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS target_type TEXT DEFAULT 'general';
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS target_id TEXT;
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS due_date TEXT;

-- 5. Goals
ALTER TABLE goals ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE goals ADD COLUMN IF NOT EXISTS completed_at TEXT;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE goals ADD COLUMN IF NOT EXISTS target_date TEXT;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- 6. Curriculums
ALTER TABLE curriculums ADD COLUMN IF NOT EXISTS effective_from_term_id TEXT;
ALTER TABLE curriculums ADD COLUMN IF NOT EXISTS total_required_credits INTEGER DEFAULT 144;
ALTER TABLE curriculums ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 7. Curriculum Requirements
ALTER TABLE curriculum_requirements ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE curriculum_requirements ADD COLUMN IF NOT EXISTS requirement_type TEXT DEFAULT 'specific_course';
ALTER TABLE curriculum_requirements ADD COLUMN IF NOT EXISTS minimum_credits INTEGER DEFAULT 2;
ALTER TABLE curriculum_requirements ADD COLUMN IF NOT EXISTS is_required INTEGER DEFAULT 1;
ALTER TABLE curriculum_requirements ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE curriculum_requirements ADD COLUMN IF NOT EXISTS note TEXT;

-- 8. Course Equivalencies
ALTER TABLE course_equivalencies ADD COLUMN IF NOT EXISTS source_course_id TEXT;
ALTER TABLE course_equivalencies ADD COLUMN IF NOT EXISTS target_course_id TEXT;
ALTER TABLE course_equivalencies ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE course_equivalencies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 9. Grade Scales & Scale Items
ALTER TABLE grade_scales ADD COLUMN IF NOT EXISTS is_default INTEGER DEFAULT 1;
ALTER TABLE grade_scale_items ADD COLUMN IF NOT EXISTS scale_id TEXT;
ALTER TABLE grade_scale_items ADD COLUMN IF NOT EXISTS grade_point REAL DEFAULT 4.0;
ALTER TABLE grade_scale_items ADD COLUMN IF NOT EXISTS letter_grade TEXT DEFAULT 'A';
ALTER TABLE grade_scale_items ADD COLUMN IF NOT EXISTS min_score REAL DEFAULT 85;
ALTER TABLE grade_scale_items ADD COLUMN IF NOT EXISTS max_score REAL DEFAULT 100;

-- 10. Course Attempts
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS academic_term_id TEXT;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS enrollment_status TEXT DEFAULT 'completed';
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS grade_id TEXT;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS credits_earned INTEGER DEFAULT 0;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS grade_point_snapshot REAL DEFAULT 0.0;

-- 11. Tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS goal_id TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS checklist TEXT DEFAULT '[]';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS scheduled_date TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TEXT;

-- 12. Notes
ALTER TABLE notes ADD COLUMN IF NOT EXISTS project_id TEXT;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS goal_id TEXT;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_pinned INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_important INTEGER DEFAULT 0;

-- 13. Knowledge Entries & Categories
ALTER TABLE knowledge_entries ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE knowledge_entries ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';
ALTER TABLE knowledge_entries ADD COLUMN IF NOT EXISTS is_pinned INTEGER DEFAULT 0;

-- 14. Projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS goal_id TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_date TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS completed_at TEXT;

-- 15. Vault Entries & Categories
ALTER TABLE vault_entries ADD COLUMN IF NOT EXISTS item_type TEXT DEFAULT 'login';
ALTER TABLE vault_entries ADD COLUMN IF NOT EXISTS custom_fields TEXT DEFAULT '[]';
ALTER TABLE vault_entries ADD COLUMN IF NOT EXISTS is_favorite INTEGER DEFAULT 0;

-- 16. Routines & Routine Occurrences
ALTER TABLE routines ADD COLUMN IF NOT EXISTS weekdays TEXT DEFAULT '[]';
ALTER TABLE routines ADD COLUMN IF NOT EXISTS checklist TEXT DEFAULT '[]';
ALTER TABLE routines ADD COLUMN IF NOT EXISTS is_active INTEGER DEFAULT 1;
ALTER TABLE routine_occurrences ADD COLUMN IF NOT EXISTS completed_checklist TEXT DEFAULT '[]';

-- 17. Calendar Entries
ALTER TABLE calendar_entries ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE calendar_entries ADD COLUMN IF NOT EXISTS end_time TEXT;
ALTER TABLE calendar_entries ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE calendar_entries ADD COLUMN IF NOT EXISTS is_important INTEGER DEFAULT 0;
ALTER TABLE calendar_entries ADD COLUMN IF NOT EXISTS is_completed INTEGER DEFAULT 0;

-- 18. Financial Accounts & Transactions
ALTER TABLE financial_transactions ADD COLUMN IF NOT EXISTS is_recurring INTEGER DEFAULT 0;
ALTER TABLE financial_accounts ADD COLUMN IF NOT EXISTS is_archived INTEGER DEFAULT 0;
ALTER TABLE financial_accounts ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'IDR';

-- 19. Subscriptions, Inventory, Wishlist
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'IDR';
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'owned';
ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'want';

-- 20. Study Plans
ALTER TABLE study_plans ADD COLUMN IF NOT EXISTS personal_tracking_disclaimer_acknowledged BOOLEAN DEFAULT true;
ALTER TABLE study_plans ADD COLUMN IF NOT EXISTS disclaimer_acknowledged BOOLEAN DEFAULT true;
ALTER TABLE study_plans ADD COLUMN IF NOT EXISTS advisor_name TEXT DEFAULT '';
ALTER TABLE study_plans ADD COLUMN IF NOT EXISTS advisor_lecturer_id TEXT;

-- 21. CL-07A/B: Learning Decks, Flashcard Notes, Flashcard Cards, Imported Media Assets
CREATE TABLE IF NOT EXISTS learning_decks (
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

CREATE TABLE IF NOT EXISTS flashcard_notes (
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

CREATE TABLE IF NOT EXISTS flashcard_cards (
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

ALTER TABLE flashcard_cards ADD COLUMN IF NOT EXISTS audio_urls TEXT DEFAULT '[]';
ALTER TABLE flashcard_cards ADD COLUMN IF NOT EXISTS image_urls TEXT DEFAULT '[]';

CREATE TABLE IF NOT EXISTS imported_media_assets (
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
-- SAFE RELAX NOT-NULL CONSTRAINTS FOR LEGACY TABLES & COLUMNS
-- (Mencegah error 'violates not-null constraint' pada kolom lama seperti 'due_date')
-- ====================================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  -- Hapus batasan NOT NULL pada seluruh kolom non-PK selain 'id' dan 'key' agar kolom legacy tidak memblokir sinkronisasi
  FOR r IN (
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND is_nullable = 'NO' 
      AND column_name NOT IN ('id', 'key')
      AND table_name IN (
        'reminders', 'tasks', 'goals', 'projects', 'notes', 'curriculums', 
        'curriculum_requirements', 'calendar_entries', 'routines', 'routine_occurrences',
        'financial_transactions', 'financial_accounts', 'subscriptions', 'inventory', 'wishlist',
        'course_schedules', 'courses', 'um_lecturers', 'assignments', 'exams', 'grades',
        'vault_entries', 'knowledge_entries', 'important_info', 'documents',
        'learning_decks', 'flashcard_notes', 'flashcard_cards', 'imported_media_assets'
      )
  ) LOOP
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I DROP NOT NULL;', r.table_name, r.column_name);
  END LOOP;
END $$;

-- ====================================================================
-- DISABLE ROW LEVEL SECURITY (RLS) & SET PERMISSIVE POLICIES FOR SYNC
-- ====================================================================

DO $$
DECLARE
  t text;
  table_list text[] := ARRAY[
    'app_metadata', 'college_profile', 'semesters', 'courses', 'course_schedules',
    'assignments', 'exams', 'grades', 'um_lecturers', 'study_plans', 'study_plan_items',
    'study_plan_status_history', 'academic_calendar_events', 'class_meeting_exceptions',
    'period_profile_windows', 'academic_resource_links', 'course_syllabi',
    'course_learning_outcomes', 'course_materials', 'course_references',
    'course_lecturer_assignments', 'chinese_vocabularies', 'chinese_practice_sessions',
    'tasks', 'notes', 'calendar_entries', 'financial_accounts', 'financial_categories',
    'financial_transactions', 'budgets', 'reminders', 'goals', 'subscriptions',
    'inventory', 'wishlist', 'projects', 'curriculums', 'curriculum_requirements',
    'course_equivalencies', 'grade_scales', 'grade_scale_items', 'course_attempts',
    'safety_checkpoints', 'academic_audit_logs', 'vault_categories', 'vault_entries',
    'knowledge_categories', 'knowledge_entries', 'routines', 'routine_occurrences',
    'important_info', 'documents', 'sync_outbox',
    'learning_decks', 'flashcard_notes', 'flashcard_cards', 'imported_media_assets'
  ];
BEGIN
  FOREACH t IN ARRAY table_list
  LOOP
    -- 1. Matikan RLS agar client sync bisa melakukan upsert/select tanpa batasan
    EXECUTE format('ALTER TABLE IF EXISTS public.%I DISABLE ROW LEVEL SECURITY;', t);
    
    -- 2. Drop policy lama jika ada
    EXECUTE format('DROP POLICY IF EXISTS "Allow all public" ON public.%I;', t);
    
    -- 3. Buat policy allow all agar tetap aman jika RLS diaktifkan kembali
    EXECUTE format('CREATE POLICY "Allow all public" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;

-- ====================================================================
-- ENABLE SUPABASE REALTIME REPLICATION FOR INSTANT LIVE SYNC (<1s)
-- ====================================================================

DO $$
DECLARE
  t text;
  table_list text[] := ARRAY[
    'app_metadata', 'college_profile', 'semesters', 'courses', 'course_schedules',
    'assignments', 'exams', 'grades', 'um_lecturers', 'study_plans', 'study_plan_items',
    'study_plan_status_history', 'academic_calendar_events', 'class_meeting_exceptions',
    'period_profile_windows', 'academic_resource_links', 'course_syllabi',
    'course_learning_outcomes', 'course_materials', 'course_references',
    'course_lecturer_assignments', 'chinese_vocabularies', 'chinese_practice_sessions',
    'tasks', 'notes', 'calendar_entries', 'financial_accounts', 'financial_categories',
    'financial_transactions', 'budgets', 'reminders', 'goals', 'subscriptions',
    'inventory', 'wishlist', 'projects', 'curriculums', 'curriculum_requirements',
    'course_equivalencies', 'grade_scales', 'grade_scale_items', 'course_attempts',
    'safety_checkpoints', 'academic_audit_logs', 'vault_categories', 'vault_entries',
    'knowledge_categories', 'knowledge_entries', 'routines', 'routine_occurrences',
    'important_info', 'documents',
    'learning_decks', 'flashcard_notes', 'flashcard_cards', 'imported_media_assets'
  ];
BEGIN
  FOREACH t IN ARRAY table_list
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', t);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

-- Reload Supabase Schema Cache agar PostgREST langsung mengenali semua kolom dan tabel baru
NOTIFY pgrst, 'reload schema';-- ====================================================================
-- Study Hub: Study Materials (SIPEJAR course material import)
-- NOTE: Hanya TEKS hasil ekstraksi yang disinkronkan ke cloud (kecil).
-- File binary TIDAK disimpan di Supabase (local-first untuk hemat
-- kuota egress). Lihat LOCAL_ONLY_TABLES di src/services/sync/syncService.ts.
-- ====================================================================
CREATE TABLE IF NOT EXISTS study_materials (
  id TEXT PRIMARY KEY,
  course_id TEXT,
  title TEXT NOT NULL,
  source_type TEXT DEFAULT 'text',
  file_name TEXT DEFAULT '',
  content_text TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  status TEXT DEFAULT 'imported',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_materials_course ON study_materials(course_id);

-- Daftarkan tabel baru ke realtime publication (aman jika sudah ada)
DO $$
DECLARE
  t text;
BEGIN
  BEGIN
    EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', 'study_materials');
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

NOTIFY pgrst, 'reload schema';
-- ====================================================================
-- Academic OS: SIPEJAR Courses, Meetings, Activities & Mandarin Progress
-- (ACA-OS A1/A2/B1/B2 + A4) - wajib ada di cloud agar sync tidak error.
-- Kolom disamakan dengan app lokal (src/db/init.ts).
-- ====================================================================
CREATE TABLE IF NOT EXISTS sipejar_courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sipejar_course_code TEXT,
  siakad_course_id TEXT,
  link_status TEXT NOT NULL DEFAULT 'unlinked',
  total_meetings INTEGER,
  completed_meetings INTEGER,
  source TEXT NOT NULL DEFAULT 'SIPEJAR',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sipejar_meetings (
  id TEXT PRIMARY KEY,
  sipejar_course_id TEXT NOT NULL,
  meeting_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  date TEXT,
  description TEXT,
  is_completed INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'SIPEJAR',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sipejar_activities (
  id TEXT PRIMARY KEY,
  sipejar_course_id TEXT NOT NULL,
  sipejar_meeting_id TEXT,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'material',
  description TEXT,
  official_deadline TEXT,
  personal_deadline TEXT,
  completion_status TEXT NOT NULL DEFAULT 'not_started',
  source_url TEXT,
  estimated_hours REAL,
  priority TEXT NOT NULL DEFAULT 'medium',
  linked_task_id TEXT,
  linked_calendar_id TEXT,
  source TEXT NOT NULL DEFAULT 'SIPEJAR',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mandarin_progress (
  id TEXT PRIMARY KEY,
  skills TEXT NOT NULL DEFAULT '[]',
  hsk_level_self_assessed INTEGER,
  hsk_level_official INTEGER,
  official_test_date TEXT,
  study_streak_days INTEGER DEFAULT 0,
  total_study_hours REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- RLS: matikan + policy allow-all agar client sync (anon/authenticated) dapat
-- baca/tulis. study_materials JUGAA dipastikan di sini (tabel dibuat SETELAH
-- blok RLS utama sehingga blok utama tidak menjangkaunya).
DO $$
DECLARE
  t text;
  rls_tables text[] := ARRAY['study_materials', 'sipejar_courses', 'sipejar_meetings', 'sipejar_activities', 'mandarin_progress'];
BEGIN
  FOREACH t IN ARRAY rls_tables
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE IF EXISTS public.%I DISABLE ROW LEVEL SECURITY;', t);
      EXECUTE format('DROP POLICY IF EXISTS "Allow all public" ON public.%I;', t);
      EXECUTE format('CREATE POLICY "Allow all public" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', t);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

-- Daftarkan ke realtime publication
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['sipejar_courses'::text, 'sipejar_meetings'::text, 'sipejar_activities'::text, 'mandarin_progress'::text]
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', t);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
-- ====================================================================
-- COLUMN ALIGNMENT (sinkronisasi kolom dengan app lokal saat ini)
-- Idempoten: aman dijalankan ulang, untuk DB baru maupun DB yang sudah
-- dibuat dari versi schema lama. Menghindari gagal upsert karena kolom
-- baru tidak ada / kolom lama NOT NULL tanpa nilai.
-- ====================================================================

-- academic_calendar_events
ALTER TABLE academic_calendar_events ALTER COLUMN start_date DROP NOT NULL;
ALTER TABLE academic_calendar_events ALTER COLUMN end_date DROP NOT NULL;
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'other';
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS starts_at TEXT;
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS ends_at TEXT;
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Jakarta';
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS is_all_day INTEGER DEFAULT 0;
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS course_class_id TEXT;
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual_academic';
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled';
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS created_at TEXT;
ALTER TABLE academic_calendar_events ADD COLUMN IF NOT EXISTS updated_at TEXT;

-- period_profile_windows
ALTER TABLE period_profile_windows ALTER COLUMN profile_id DROP NOT NULL;
ALTER TABLE period_profile_windows ALTER COLUMN name DROP NOT NULL;
ALTER TABLE period_profile_windows ALTER COLUMN start_date DROP NOT NULL;
ALTER TABLE period_profile_windows ALTER COLUMN end_date DROP NOT NULL;
ALTER TABLE period_profile_windows ADD COLUMN IF NOT EXISTS academic_term_id TEXT;
ALTER TABLE period_profile_windows ADD COLUMN IF NOT EXISTS period_profile_id TEXT;
ALTER TABLE period_profile_windows ADD COLUMN IF NOT EXISTS starts_on TEXT;
ALTER TABLE period_profile_windows ADD COLUMN IF NOT EXISTS ends_on TEXT;

-- curriculums
ALTER TABLE curriculums ADD COLUMN IF NOT EXISTS effective_from_term_id TEXT;

-- curriculum_requirements
ALTER TABLE curriculum_requirements ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE curriculum_requirements ADD COLUMN IF NOT EXISTS note TEXT;

-- course_equivalencies
ALTER TABLE course_equivalencies ALTER COLUMN source_course_code DROP NOT NULL;
ALTER TABLE course_equivalencies ALTER COLUMN source_course_name DROP NOT NULL;
ALTER TABLE course_equivalencies ALTER COLUMN target_course_id DROP NOT NULL;
ALTER TABLE course_equivalencies ADD COLUMN IF NOT EXISTS source_course_id TEXT;
ALTER TABLE course_equivalencies ADD COLUMN IF NOT EXISTS equivalent_course_id TEXT;
ALTER TABLE course_equivalencies ADD COLUMN IF NOT EXISTS equivalency_type TEXT DEFAULT 'equivalent';
ALTER TABLE course_equivalencies ADD COLUMN IF NOT EXISTS updated_at TEXT;

-- course_attempts
ALTER TABLE course_attempts ALTER COLUMN semester_id DROP NOT NULL;
ALTER TABLE course_attempts ALTER COLUMN course_id DROP NOT NULL;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS academic_term_id TEXT;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS linked_study_plan_item_id TEXT;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS course_code_snapshot TEXT;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS course_name_snapshot TEXT;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS credits_snapshot INTEGER DEFAULT 2;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress';
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS grade_scale_id TEXT;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS grade_letter TEXT;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS grade_point_snapshot REAL;
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE course_attempts ADD COLUMN IF NOT EXISTS note TEXT;

-- safety_checkpoints
ALTER TABLE safety_checkpoints ALTER COLUMN name DROP NOT NULL;
ALTER TABLE safety_checkpoints ALTER COLUMN reason DROP NOT NULL;
ALTER TABLE safety_checkpoints ALTER COLUMN data_json DROP NOT NULL;
ALTER TABLE safety_checkpoints ALTER COLUMN checksum DROP NOT NULL;
ALTER TABLE safety_checkpoints ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE safety_checkpoints ADD COLUMN IF NOT EXISTS trigger_reason TEXT;
ALTER TABLE safety_checkpoints ADD COLUMN IF NOT EXISTS payload TEXT;
ALTER TABLE safety_checkpoints ADD COLUMN IF NOT EXISTS record_counts TEXT;

-- financial_transactions
ALTER TABLE financial_transactions ADD COLUMN IF NOT EXISTS is_recurring INTEGER DEFAULT 0;

-- knowledge_entries
ALTER TABLE knowledge_entries ALTER COLUMN category_id DROP NOT NULL;
ALTER TABLE knowledge_entries ADD COLUMN IF NOT EXISTS project_id TEXT;

NOTIFY pgrst, 'reload schema';

-- ====================================================================
-- Chinese -- Program Harian (mesin kurikulum terpandu + SRS bertangga)
-- 3 tabel baru, wajib ada di cloud agar sync lintas perangkat jalan.
-- RLS dimatikan + policy allow-all, konsisten dengan tabel sync lain.
-- ====================================================================
CREATE TABLE IF NOT EXISTS chinese_program_progress (
  id TEXT PRIMARY KEY,
  order_index INTEGER NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'new',
  interval_days INTEGER NOT NULL DEFAULT 1,
  due_date TEXT NOT NULL,
  streak INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  introduced_on TEXT,
  last_reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_program_progress_due ON chinese_program_progress(due_date);

CREATE TABLE IF NOT EXISTS chinese_program_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  daily_new_target INTEGER NOT NULL DEFAULT 10,
  program_started_on TEXT,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_completed_on TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chinese_program_log (
  id TEXT PRIMARY KEY,
  log_date TEXT NOT NULL,
  words_introduced INTEGER NOT NULL DEFAULT 0,
  words_reviewed INTEGER NOT NULL DEFAULT 0,
  accuracy REAL NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_program_log_date ON chinese_program_log(log_date);

-- RLS off + policy allow-all (konsisten dengan tabel sync lainnya)
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['chinese_program_progress'::text, 'chinese_program_settings'::text, 'chinese_program_log'::text]
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE IF EXISTS public.%I DISABLE ROW LEVEL SECURITY;', t);
      EXECUTE format('DROP POLICY IF EXISTS "Allow all public" ON public.%I;', t);
      EXECUTE format('CREATE POLICY "Allow all public" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', t);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

-- Daftarkan ke realtime publication untuk live-sync (<1s)
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['chinese_program_progress'::text, 'chinese_program_settings'::text, 'chinese_program_log'::text]
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', t);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';