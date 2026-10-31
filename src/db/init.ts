import { executeSql, selectSql, flushWebDbSnapshot } from './client';

export interface AppMetadataRecord {
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export async function initializeDatabase(): Promise<{ appStartDate: string }> {
  console.log('Initializing SQLite database schema...');

  // 1. Create app_metadata table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS app_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 2. Create calendar_entries table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_calendar_date ON calendar_entries(date);`);

  // 3. Create notes table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date);`);

  // 4. Create financial_accounts table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS financial_accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      starting_balance REAL DEFAULT 0,
      current_balance REAL DEFAULT 0,
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 5. Create financial_categories table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS financial_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      icon TEXT,
      color TEXT
    );
  `);

  // 6. Create financial_transactions table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      is_recurring INTEGER DEFAULT 0
    );
  `);
  try {
    await executeSql(`ALTER TABLE financial_transactions ADD COLUMN is_recurring INTEGER DEFAULT 0;`);
  } catch {}
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_trans_date ON financial_transactions(date);`);

  // 7. Create budgets table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      monthly_limit REAL NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 8. Create vault_categories table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS vault_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  // 9. Create vault_entries table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_vault_service ON vault_entries(service_name);`);

  // 10. Phase 1 Addition: Create tasks table
  await executeSql(`
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
      checklist TEXT DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);`);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_tasks_scheduled ON tasks(scheduled_date);`);

  // 11. Phase 1 Addition: Create routines table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 12. Phase 1 Addition: Create routine_occurrences table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS routine_occurrences (
      id TEXT PRIMARY KEY,
      routine_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      completed_checklist TEXT DEFAULT '[]',
      notes TEXT DEFAULT '',
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_routine_occ_date ON routine_occurrences(date);`);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_routine_occ_rid ON routine_occurrences(routine_id);`);

  // 13. Phase 1 Addition: Create reminders table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      remind_at TEXT NOT NULL,
      reminder_type TEXT DEFAULT 'one_time',
      is_triggered INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_reminders_time ON reminders(remind_at);`);

  // 14. Phase 2 Addition: Create goals table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT DEFAULT 'Active',
      priority TEXT DEFAULT 'medium',
      target_date TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 15. Phase 2 Addition: Create projects table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      goal_id TEXT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT DEFAULT 'Active',
      priority TEXT DEFAULT 'medium',
      start_date TEXT,
      target_date TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_projects_goal ON projects(goal_id);`);

  // 16. Phase 2 Addition: Create knowledge_categories table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS knowledge_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT
    );
  `);

  // 17. Phase 2 Addition: Create knowledge_entries table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS knowledge_entries (
      id TEXT PRIMARY KEY,
      category_id TEXT,
      project_id TEXT,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_knowledge_cat ON knowledge_entries(category_id);`);

  // 18. Phase 3 Addition: Create college_profile table
  await executeSql(`
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
      updated_at TEXT NOT NULL
    );
  `);
  try { await executeSql(`ALTER TABLE college_profile ADD COLUMN advisor_name TEXT DEFAULT '';`); } catch {}
  try { await executeSql(`ALTER TABLE college_profile ADD COLUMN advisor_nip TEXT DEFAULT '';`); } catch {}
  try { await executeSql(`ALTER TABLE college_profile ADD COLUMN program TEXT DEFAULT '';`); } catch {}
  try { await executeSql(`ALTER TABLE college_profile ADD COLUMN faculty TEXT DEFAULT '';`); } catch {}

  // 19. Phase 3 Addition: Create semesters table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS semesters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'active',
      is_active INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 20. Phase 3 Addition: Create courses table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      semester_id TEXT NOT NULL,
      name TEXT NOT NULL,
      code TEXT DEFAULT '',
      credits INTEGER DEFAULT 3,
      instructor TEXT DEFAULT '',
      room TEXT DEFAULT '',
      color TEXT DEFAULT '#3b82f6',
      status TEXT DEFAULT 'active',
      description TEXT DEFAULT '',
      website TEXT DEFAULT '',
      contact TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_courses_sem ON courses(semester_id);`);

  // 21. Phase 3 Addition: Create course_schedules table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS course_schedules (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      day_of_week INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      room TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_schedules_course ON course_schedules(course_id);`);

  // 22. Phase 3 Addition: Create assignments table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);`);

  // 23. Phase 3 Addition: Create exams table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_exams_course ON exams(course_id);`);

  // 24. Phase 3 Addition: Create grades table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS grades (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'assignment',
      score REAL NOT NULL,
      max_score REAL DEFAULT 100,
      weight REAL DEFAULT 0,
      date TEXT,
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_grades_course ON grades(course_id);`);

  // 25. Phase 4 Addition: Create subscriptions table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 26. Phase 4 Addition: Create wishlist table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 27. Phase 4 Addition: Create inventory table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 28. Phase 4 Addition: Create important_info table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS important_info (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      content TEXT DEFAULT '',
      expiration_date TEXT,
      tags TEXT DEFAULT '[]',
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 29. Phase 4 Addition: Create documents table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 30. ACA-02B Addition: Create course_syllabi table
  await executeSql(`
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
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_syllabi_course ON course_syllabi(course_id);`);

  // 31. ACA-02B Addition: Create course_learning_outcomes table
  await executeSql(`
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
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_outcomes_syl ON course_learning_outcomes(syllabus_id);`);

  // 32. ACA-02B Addition: Create course_materials table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS course_materials (
      id TEXT PRIMARY KEY,
      syllabus_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      week_number INTEGER,
      linked_outcome_ids TEXT DEFAULT '[]',
      sort_order INTEGER DEFAULT 0
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_materials_syl ON course_materials(syllabus_id);`);

  // 33. ACA-02B Addition: Create course_references table
  await executeSql(`
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
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_refs_syl ON course_references(syllabus_id);`);

  // 34. ACA-02B Addition: Create course_lecturer_assignments table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS course_lecturer_assignments (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      lecturer_id TEXT NOT NULL,
      role TEXT DEFAULT 'lecturer',
      note TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_lect_assign_course ON course_lecturer_assignments(course_id);`);

  // 35. ACA-02A/B Addition: Create um_lecturers table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS um_lecturers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      academic_identifier TEXT DEFAULT '',
      department TEXT DEFAULT '',
      email TEXT DEFAULT '',
      roles TEXT DEFAULT '[]',
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_lecturers_name ON um_lecturers(name);`);

  // 36. ACA-02C Addition: Create study_plans table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS study_plans (
      id TEXT PRIMARY KEY,
      academic_term_id TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      advisor_lecturer_id TEXT,
      advisor_name TEXT DEFAULT '',
      maximum_credits INTEGER DEFAULT 24,
      target_credits INTEGER DEFAULT 20,
      submitted_at TEXT,
      reviewed_at TEXT,
      advisor_note TEXT DEFAULT '',
      disclaimer_acknowledged INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_sp_term ON study_plans(academic_term_id);`);

  // 37. ACA-02C Addition: Create study_plan_items table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS study_plan_items (
      id TEXT PRIMARY KEY,
      study_plan_id TEXT NOT NULL,
      course_class_id TEXT NOT NULL,
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
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_spi_sp ON study_plan_items(study_plan_id);`);

  // 38. ACA-02C Addition: Create study_plan_status_history table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS study_plan_status_history (
      id TEXT PRIMARY KEY,
      study_plan_id TEXT NOT NULL,
      previous_status TEXT NOT NULL,
      next_status TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      note TEXT DEFAULT ''
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_sph_sp ON study_plan_status_history(study_plan_id);`);

  // 39. ACA-02D Addition: Create academic_calendar_events table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS academic_calendar_events (
      id TEXT PRIMARY KEY,
      academic_term_id TEXT NOT NULL,
      type TEXT DEFAULT 'other',
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      starts_at TEXT NOT NULL,
      ends_at TEXT NOT NULL,
      timezone TEXT DEFAULT 'Asia/Jakarta',
      is_all_day INTEGER DEFAULT 0,
      course_id TEXT,
      course_class_id TEXT,
      source TEXT DEFAULT 'manual_academic',
      status TEXT DEFAULT 'scheduled',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_ace_term ON academic_calendar_events(academic_term_id);`);

  // 40. ACA-02D Addition: Create class_meeting_exceptions table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS class_meeting_exceptions (
      id TEXT PRIMARY KEY,
      class_meeting_id TEXT NOT NULL,
      occurrence_date TEXT NOT NULL,
      type TEXT NOT NULL,
      replacement_starts_at TEXT,
      replacement_ends_at TEXT,
      replacement_room_id TEXT,
      replacement_room_code TEXT,
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_cme_mtg ON class_meeting_exceptions(class_meeting_id);`);

  // 41. ACA-02D Addition: Create period_profile_windows table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS period_profile_windows (
      id TEXT PRIMARY KEY,
      academic_term_id TEXT NOT NULL,
      period_profile_id TEXT NOT NULL,
      starts_on TEXT NOT NULL,
      ends_on TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_ppw_term ON period_profile_windows(academic_term_id);`);

  // 42. ACA-02F Addition: Create academic_resource_links table
  await executeSql(`
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
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_arl_src ON academic_resource_links(source_id, source_type);`);

  // 43. ACA-03A Addition: Create curriculums table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS curriculums (
      id TEXT PRIMARY KEY,
      program_name TEXT NOT NULL,
      curriculum_name TEXT NOT NULL,
      version_label TEXT NOT NULL,
      effective_from_term_id TEXT,
      total_required_credits INTEGER NOT NULL DEFAULT 144,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 44. ACA-03A Addition: Create curriculum_requirements table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS curriculum_requirements (
      id TEXT PRIMARY KEY,
      curriculum_id TEXT NOT NULL,
      category_name TEXT NOT NULL,
      course_id TEXT,
      requirement_type TEXT NOT NULL DEFAULT 'specific_course',
      title TEXT NOT NULL,
      minimum_credits INTEGER NOT NULL DEFAULT 2,
      is_required INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_cr_curr ON curriculum_requirements(curriculum_id);`);

  // 45. ACA-03A Addition: Create course_equivalencies table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS course_equivalencies (
      id TEXT PRIMARY KEY,
      source_course_id TEXT NOT NULL,
      equivalent_course_id TEXT NOT NULL,
      equivalency_type TEXT NOT NULL DEFAULT 'equivalent',
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 46. ACA-03A Addition: Create grade_scales Dan items tables
  await executeSql(`
    CREATE TABLE IF NOT EXISTS grade_scales (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      institution TEXT DEFAULT 'Universitas Negeri Malang',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS grade_scale_items (
      id TEXT PRIMARY KEY,
      grade_scale_id TEXT NOT NULL,
      letter TEXT NOT NULL,
      minimum_score REAL,
      maximum_score REAL,
      grade_point REAL NOT NULL,
      is_passing INTEGER NOT NULL DEFAULT 1,
      counts_toward_gpa INTEGER NOT NULL DEFAULT 1,
      counts_completed_credits INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_gsi_scale ON grade_scale_items(grade_scale_id);`);

  // 47. ACA-03B Addition: Create course_attempts table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS course_attempts (
      id TEXT PRIMARY KEY,
      academic_term_id TEXT NOT NULL,
      course_id TEXT,
      linked_study_plan_item_id TEXT,
      course_code_snapshot TEXT NOT NULL,
      course_name_snapshot TEXT NOT NULL,
      credits_snapshot INTEGER NOT NULL DEFAULT 2,
      status TEXT NOT NULL DEFAULT 'in_progress',
      grade_scale_id TEXT,
      grade_letter TEXT,
      numeric_score REAL,
      grade_point_snapshot REAL,
      counts_toward_gpa INTEGER NOT NULL DEFAULT 1,
      counts_completed_credits INTEGER NOT NULL DEFAULT 1,
      source TEXT NOT NULL DEFAULT 'manual',
      verification_status TEXT NOT NULL DEFAULT 'unverified',
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_ca_term ON course_attempts(academic_term_id);`);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_ca_course ON course_attempts(course_id);`);

  // 48. ACA-04A Addition: Create safety_checkpoints table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS safety_checkpoints (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      trigger_reason TEXT NOT NULL,
      payload TEXT NOT NULL,
      record_counts TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // 49. ACA-04C Addition: Create academic_audit_logs table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS academic_audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_aal_time ON academic_audit_logs(created_at);`);

  // 50. Cloud Sync Engine: Create sync_outbox table for offline change tracking
  await executeSql(`
    CREATE TABLE IF NOT EXISTS sync_outbox (
      id TEXT PRIMARY KEY,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      action TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_sync_outbox_created ON sync_outbox(created_at);`);

  // 51. CL-07A/B: Create learning_decks table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS learning_decks (
      id TEXT PRIMARY KEY,
      owner_id TEXT DEFAULT 'usr_local_default',
      name TEXT NOT NULL,
      parent_deck_id TEXT,
      source TEXT DEFAULT 'anki_import',
      source_package_fingerprint TEXT,
      card_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_decks_parent ON learning_decks(parent_deck_id);`);

  // 52. CL-07A/B: Create flashcard_notes table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS flashcard_notes (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      source_note_identifier TEXT,
      note_type_name TEXT,
      fields TEXT NOT NULL DEFAULT '{}',
      tags TEXT DEFAULT '[]',
      import_status TEXT DEFAULT 'supported',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_fnotes_deck ON flashcard_notes(deck_id);`);

  // 53. CL-07A/B: Create flashcard_cards table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS flashcard_cards (
      id TEXT PRIMARY KEY,
      note_id TEXT NOT NULL,
      deck_id TEXT NOT NULL,
      source_card_ordinal INTEGER DEFAULT 0,
      card_type TEXT DEFAULT 'basic',
      front_content TEXT NOT NULL,
      back_content TEXT NOT NULL,
      source_template_name TEXT,
      study_status TEXT DEFAULT 'not_started',
      interval_days INTEGER DEFAULT 0,
      ease_factor REAL DEFAULT 2.5,
      repetitions INTEGER DEFAULT 0,
      lapses INTEGER DEFAULT 0,
      last_reviewed_at TEXT,
      next_review_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_fcards_deck ON flashcard_cards(deck_id);`);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_fcards_note ON flashcard_cards(note_id);`);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_fcards_next_review ON flashcard_cards(next_review_at);`);

  // 54. CL-07A/B: Create imported_media_assets table
  await executeSql(`
    CREATE TABLE IF NOT EXISTS imported_media_assets (
      id TEXT PRIMARY KEY,
      owner_id TEXT DEFAULT 'usr_local_default',
      source_package_fingerprint TEXT,
      source_file_name TEXT NOT NULL,
      safe_file_name TEXT NOT NULL,
      media_type TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      data_base64 TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_media_filename ON imported_media_assets(source_file_name);`);

  // 55. Realtime Sync Tombstone table for deleted records
  await executeSql(`
    CREATE TABLE IF NOT EXISTS deleted_records (
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      deleted_at TEXT NOT NULL,
      PRIMARY KEY (table_name, record_id)
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_deleted_records ON deleted_records(table_name, record_id);`);

  // Safe Migration Helper for existing databases
  await safeAddColumn('courses', 'course_group', "TEXT DEFAULT 'required'");
  await safeAddColumn('courses', 'course_level', "TEXT DEFAULT 'program_studi'");
  await safeAddColumn('courses', 'default_semester', 'INTEGER DEFAULT 1');
  await safeAddColumn('course_schedules', 'start_period', 'INTEGER');
  await safeAddColumn('course_schedules', 'end_period', 'INTEGER');
  await safeAddColumn('course_schedules', 'instructor', "TEXT DEFAULT ''");
  await safeAddColumn('course_schedules', 'instructor_id', "TEXT DEFAULT ''");
  await safeAddColumn('tasks', 'project_id', 'TEXT');
  await safeAddColumn('tasks', 'goal_id', 'TEXT');
  await safeAddColumn('tasks', 'course_id', 'TEXT');
  await safeAddColumn('tasks', 'checklist', "TEXT DEFAULT '[]'");
  await safeAddColumn('notes', 'project_id', 'TEXT');
  await safeAddColumn('notes', 'goal_id', 'TEXT');
  await safeAddColumn('notes', 'course_id', 'TEXT');
  await safeAddColumn('knowledge_entries', 'course_id', 'TEXT');
  await safeAddColumn('projects', 'course_id', 'TEXT');
  await safeAddColumn('vault_entries', 'item_type', "TEXT DEFAULT 'login'");
  await safeAddColumn('flashcard_cards', 'audio_urls', "TEXT DEFAULT '[]'");
  await safeAddColumn('flashcard_cards', 'image_urls', "TEXT DEFAULT '[]'");

  // ===== Academic OS: SIPEJAR Integration (ACA-OS A1/A2/B1/B2) =====
  await executeSql(`
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
  `);

  await executeSql(`
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
  `);

  await executeSql(`
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
  `);

  // ===== Academic OS: Mandarin Progress Tracker (ACA-OS A4) =====
  await executeSql(`
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
  `);

  // Initialize or fetch permanent appStartDate
  let appStartDate = await getOrInitAppStartDate();

  // Seed default financial categories Dan accounts if empty
  await seedDefaultData();

  console.log('Database initialization complete. appStartDate:', appStartDate);
  return { appStartDate };
}

async function safeAddColumn(table: string, column: string, type: string) {
  try {
    await executeSql(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`);
  } catch (err) {
    // Column already exists or table freshly created
  }
}

async function getOrInitAppStartDate(): Promise<string> {
  const rows = await selectSql<AppMetadataRecord>(
    `SELECT value FROM app_metadata WHERE key = ? LIMIT 1;`,
    ['appStartDate']
  );

  if (rows.length > 0 && rows[0].value) {
    return rows[0].value;
  }

  // Immutable initialization date timestamp
  const nowStr = new Date().toISOString();
  await executeSql(
    `INSERT INTO app_metadata (key, value, created_at, updated_at) VALUES (?, ?, ?, ?);`,
    ['appStartDate', nowStr, nowStr, nowStr]
  );
  return nowStr;
}

async function seedDefaultData() {
  // Check if financial_accounts is empty
  const accRows = await selectSql(`SELECT COUNT(*) as count FROM financial_accounts;`);
  const accCount = (accRows[0] as any)?.count || 0;

  if (accCount === 0) {
    const now = new Date().toISOString();
    await executeSql(
      `INSERT INTO financial_accounts (id, name, type, starting_balance, current_balance, created_at, updated_at) VALUES 
      ('acc_cash', 'Cash Wallet', 'cash', 0, 0, ?, ?),
      ('acc_bank', 'Primary Bank', 'bank', 0, 0, ?, ?),
      ('acc_ewallet', 'E-Wallet', 'ewallet', 0, 0, ?, ?);`,
      [now, now, now, now, now, now]
    );
  }

  // Check if financial_categories is empty
  const catRows = await selectSql(`SELECT COUNT(*) as count FROM financial_categories;`);
  const catCount = (catRows[0] as any)?.count || 0;

  if (catCount === 0) {
    await executeSql(`
      INSERT INTO financial_categories (id, name, type, icon, color) VALUES
      ('cat_food', 'Food Dan Dining', 'expense', 'Utensils', '#f59e0b'),
      ('cat_transport', 'Transportation', 'expense', 'Car', '#3b82f6'),
      ('cat_shopping', 'Shopping', 'expense', 'ShoppingBag', '#ec4899'),
      ('cat_entertainment', 'Entertainment Dan Gaming', 'expense', 'Gamepad2', '#8b5cf6'),
      ('cat_bills', 'Bills Dan Utilities', 'expense', 'Receipt', '#ef4444'),
      ('cat_salary', 'Salary', 'income', 'Briefcase', '#10b981'),
      ('cat_freelance', 'Freelance Dan Business', 'income', 'Laptop', '#06b6d4'),
      ('cat_game_income', 'Game Income', 'income', 'Trophy', '#eab308');
    `);
  }

  // Seed default knowledge categories if empty
  const knowCatRows = await selectSql(`SELECT COUNT(*) as count FROM knowledge_categories;`);
  const knowCatCount = (knowCatRows[0] as any)?.count || 0;

  if (knowCatCount === 0) {
    await executeSql(`
      INSERT INTO knowledge_categories (id, name, icon, color) VALUES
      ('cat_prog', 'Programming Dan Tech', 'Code', '#3b82f6'),
      ('cat_roblox', 'Roblox Dan Game Dev', 'Gamepad2', '#8b5cf6'),
      ('cat_personal_kb', 'Personal Workflows', 'BookOpen', '#10b981'),
      ('cat_references', 'Guides Dan References', 'Bookmark', '#f59e0b');
    `);
  }

  // Seed default grade scales if empty
  const scaleRows = await selectSql(`SELECT COUNT(*) as count FROM grade_scales;`);
  const scaleCount = (scaleRows[0] as any)?.count || 0;

  if (scaleCount === 0) {
    const now = new Date().toISOString();
    const defaultScaleId = 'scale_um_standard';
    await executeSql(
      `INSERT INTO grade_scales (id, name, institution, is_active, created_at, updated_at) VALUES
      (?, 'Standar Nilai Universitas Negeri Malang (UM)', 'Universitas Negeri Malang', 1, ?, ?);`,
      [defaultScaleId, now, now]
    );

    await executeSql(`
      INSERT INTO grade_scale_items (id, grade_scale_id, letter, minimum_score, maximum_score, grade_point, is_passing, counts_toward_gpa, counts_completed_credits, sort_order) VALUES
      ('gsi_a', 'scale_um_standard', 'A', 85.0, 100.0, 4.0, 1, 1, 1, 1),
      ('gsi_amin', 'scale_um_standard', 'A-', 80.0, 84.99, 3.7, 1, 1, 1, 2),
      ('gsi_bplus', 'scale_um_standard', 'B+', 75.0, 79.99, 3.3, 1, 1, 1, 3),
      ('gsi_b', 'scale_um_standard', 'B', 70.0, 74.99, 3.0, 1, 1, 1, 4),
      ('gsi_bmin', 'scale_um_standard', 'B-', 65.0, 69.99, 2.7, 1, 1, 1, 5),
      ('gsi_cplus', 'scale_um_standard', 'C+', 60.0, 64.99, 2.3, 1, 1, 1, 6),
      ('gsi_c', 'scale_um_standard', 'C', 55.0, 59.99, 2.0, 1, 1, 1, 7),
      ('gsi_d', 'scale_um_standard', 'D', 40.0, 54.99, 1.0, 0, 1, 0, 8),
      ('gsi_e', 'scale_um_standard', 'E', 0.0, 39.99, 0.0, 0, 1, 0, 9);
    `);
  }

  // Seed default curriculum if empty
  const currRows = await selectSql(`SELECT COUNT(*) as count FROM curriculums;`);
  const currCount = (currRows[0] as any)?.count || 0;

  if (currCount === 0) {
    const now = new Date().toISOString();
    const currId = 'curr_mandarin_2024';
    await executeSql(
      `INSERT INTO curriculums (id, program_name, curriculum_name, version_label, total_required_credits, status, created_at, updated_at) VALUES
      (?, 'S1 Pendidikan Bahasa Mandarin', 'Kurikulum Merdeka Mandarin UM 2024', 'Kurikulum 2024', 144, 'active', ?, ?);`,
      [currId, now, now]
    );

    await executeSql(
      `INSERT INTO curriculum_requirements (id, curriculum_id, category_name, requirement_type, title, minimum_credits, is_required, sort_order, created_at, updated_at) VALUES
      ('cr_mku', ?, 'Mata Kuliah Universitas (MKU)', 'credit_minimum', 'Pendidikan Agama, Pancasila, Kewarganegaraan, Bhs Indonesia', 14, 1, 1, ?, ?),
      ('cr_mkdk', ?, 'Mata Kuliah Dasar Kependidikan (MKDK)', 'credit_minimum', 'Landasan Pendidikan, Perkembangan Peserta Didik, Belajar Dan Pembelajaran', 8, 1, 2, ?, ?),
      ('cr_mkk', ?, 'Mata Kuliah Keahlian (MKK)', 'credit_minimum', 'Kemampuan Bahasa Mandarin, Tata Bahasa, Menyimak, Berbicara, Membaca, Menulis', 96, 1, 3, ?, ?),
      ('cr_mkp', ?, 'Mata Kuliah Pilihan (MKP)', 'elective_group', 'Pilihan Peminatan Bisnis, Penerjemahan, Pariwisata, atau Budaya', 16, 0, 4, ?, ?),
      ('cr_ta', ?, 'Tugas Akhir / Skripsi Dan KKN', 'credit_minimum', 'KKN/Asistensi Mengajar, Seminar Proposal, dan Skripsi', 10, 1, 5, ?, ?);`,
      [currId, now, now, currId, now, now, currId, now, now, currId, now, now, currId, now, now]
    );
  }

  // ============================================================
  // Study Hub: Course Materials Library (SIPEJAR material import)
  // NOTE: Text content is synced to cloud. Binary file data is
  // stored ONLY locally (see document_files below) to protect
  // the Supabase egress quota (local-first strategy).
  // ============================================================
  await executeSql(`
    CREATE TABLE IF NOT EXISTS study_materials (
      id TEXT PRIMARY KEY,
      course_id TEXT,
      title TEXT NOT NULL,
      source_type TEXT DEFAULT 'text',
      file_name TEXT DEFAULT '',
      content_text TEXT DEFAULT '',
      summary TEXT DEFAULT '',
      status TEXT DEFAULT 'imported',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_study_materials_course ON study_materials(course_id);`);

  // Document binary attachments — STRICTLY LOCAL-ONLY (never synced to Supabase)
  await executeSql(`
    CREATE TABLE IF NOT EXISTS document_files (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      mime_type TEXT DEFAULT '',
      size_bytes INTEGER DEFAULT 0,
      data_base64 TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_document_files_doc ON document_files(document_id);`);

  // ============================================================
  // Chinese — Program Harian (mesin kurikulum terpandu + SRS
  // bertangga). Terpisah dari Anki/chinese_vocabularies.
  // ============================================================
  await executeSql(`
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
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_program_progress_due ON chinese_program_progress(due_date);`);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS chinese_program_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      daily_new_target INTEGER NOT NULL DEFAULT 10,
      program_started_on TEXT,
      streak_days INTEGER NOT NULL DEFAULT 0,
      last_completed_on TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS chinese_program_log (
      id TEXT PRIMARY KEY,
      log_date TEXT NOT NULL,
      words_introduced INTEGER NOT NULL DEFAULT 0,
      words_reviewed INTEGER NOT NULL DEFAULT 0,
      accuracy REAL NOT NULL DEFAULT 0,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_program_log_date ON chinese_program_log(log_date);`);

  // ============================================================
  // AKUN: partisi data pembelajaran per pengguna (multi-akun &
  // multi-device). Data lama diberi klaim ke akun yang aktif saat
  // migrasi berjalan — lingkup fix data tidak sinkron antar akun.
  // ============================================================
  await migrateAccountScopedTables();

  await flushWebDbSnapshot();
  return { appStartDate: new Date().toISOString() };
}

async function migrateAccountScopedTables(): Promise<void> {
  let activeUserId = 'usr_guest';
  try {
    const mod = await import('../services/auth/classAuthService');
    activeUserId = mod.getActiveUserId();
  } catch {}

  const tryAdd = async (table: string, column: string, def: string): Promise<void> => {
    try {
      await executeSql(`ALTER TABLE ${table} ADD COLUMN ${column} ${def};`);
    } catch {}
  };

  await tryAdd('chinese_program_progress', 'user_id', "TEXT DEFAULT ''");
  await tryAdd('chinese_program_progress', 'word_id', "TEXT DEFAULT ''");
  await tryAdd('chinese_program_progress', 'source', "TEXT DEFAULT ''");
  await tryAdd('chinese_program_log', 'user_id', "TEXT DEFAULT ''");
  await tryAdd('learning_decks', 'user_id', "TEXT DEFAULT ''");
  await tryAdd('flashcard_notes', 'user_id', "TEXT DEFAULT ''");
  await tryAdd('flashcard_cards', 'user_id', "TEXT DEFAULT ''");
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_program_progress_user ON chinese_program_progress(user_id);`);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_program_log_user ON chinese_program_log(user_id);`);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_decks_user ON learning_decks(user_id);`);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_fnotes_user ON flashcard_notes(user_id);`);
  await executeSql(`CREATE INDEX IF NOT EXISTS idx_fcards_user ON flashcard_cards(user_id);`);

  const SCOPE_FLAG = 'account_scope_migrated_v1';
  try {
    const flagRows = await selectSql(`SELECT value FROM app_metadata WHERE key = ? LIMIT 1;`, [SCOPE_FLAG]);
    if (flagRows.length > 0) return;
  } catch {}

  // 1) Progres Program Harian/Hanzi Quest: id lama (word id mentah) diubah
  //    menjadi `${uid}::${wordId}` + kolom user_id/word_id diisi.
  try {
    const legacyRows = await selectSql<{ id: string }>(
      `SELECT id FROM chinese_program_progress WHERE user_id = '' OR user_id IS NULL;`
    );
    for (const row of legacyRows) {
      const oldId = row.id || '';
      if (!oldId) continue;
      if (oldId.includes('::')) {
        // Pulled dari cloud versi baru tapi kolom user_id kosong
        await executeSql(
          `UPDATE chinese_program_progress SET user_id = ? WHERE id = ?;`,
          [oldId.split('::')[0], oldId]
        );
      } else {
        await executeSql(
          `UPDATE chinese_program_progress SET id = ?, user_id = ?, word_id = ? WHERE id = ?;`,
          [`${activeUserId}::${oldId}`, activeUserId, oldId, oldId]
        );
      }
    }
  } catch (err) {
    console.warn('Account scope migration (program progress) warning:', err);
  }

  // 2) Deck/notes/card Anki + log Program Harian: klaim data legacy ke akun aktif
  for (const table of ['learning_decks', 'flashcard_notes', 'flashcard_cards', 'chinese_program_log']) {
    try {
      await executeSql(`UPDATE ${table} SET user_id = ? WHERE user_id = '' OR user_id IS NULL;`, [activeUserId]);
    } catch (err) {
      console.warn(`Account scope migration (${table}) warning:`, err);
    }
  }

  const nowStr = new Date().toISOString();
  try {
    await executeSql(
      `INSERT OR REPLACE INTO app_metadata (key, value, created_at, updated_at) VALUES (?, ?, ?, ?);`,
      [SCOPE_FLAG, nowStr, nowStr, nowStr]
    );
  } catch {}
}
