import { executeSql, selectSql } from '@/db/client';

export interface BackupPayload {
  version: string;
  app: string;
  exportedAt: string;
  checksum: string;
  data: Record<string, any[]>;
}

const TABLE_MAPPING: Record<string, string> = {
  appMetadata: 'app_metadata',
  calendarEntries: 'calendar_entries',
  notes: 'notes',
  financialAccounts: 'financial_accounts',
  financialCategories: 'financial_categories',
  financialTransactions: 'financial_transactions',
  budgets: 'budgets',
  vaultCategories: 'vault_categories',
  vaultEntries: 'vault_entries',
  tasks: 'tasks',
  reminders: 'reminders',
  goals: 'goals',
  subscriptions: 'subscriptions',
  inventory: 'inventory',
  wishlist: 'wishlist',
  projects: 'projects',
  collegeProfile: 'college_profile',
  semesters: 'semesters',
  courses: 'courses',
  courseSchedules: 'course_schedules',
  assignments: 'assignments',
  exams: 'exams',
  grades: 'grades',
  chineseVocabularies: 'chinese_vocabularies',
  chinesePracticeSessions: 'chinese_practice_sessions',
  courseSyllabi: 'course_syllabi',
  courseLearningOutcomes: 'course_learning_outcomes',
  courseMaterials: 'course_materials',
  courseReferences: 'course_references',
  courseLecturerAssignments: 'course_lecturer_assignments',
  umLecturers: 'um_lecturers',
  studyPlans: 'study_plans',
  studyPlanItems: 'study_plan_items',
  studyPlanStatusHistory: 'study_plan_status_history',
  academicCalendarEvents: 'academic_calendar_events',
  classMeetingExceptions: 'class_meeting_exceptions',
  periodProfileWindows: 'period_profile_windows',
  academicResourceLinks: 'academic_resource_links',
  learningDecks: 'learning_decks',
  flashcardNotes: 'flashcard_notes',
  flashcardCards: 'flashcard_cards',
  importedMediaAssets: 'imported_media_assets',
};

function generateChecksum(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

// 1. Export all application data as a complete JSON backup file (.json / .plmbackup)
export async function exportBackupData(): Promise<void> {
  const rawData: Record<string, any[]> = {};

  for (const [key, tableName] of Object.entries(TABLE_MAPPING)) {
    try {
      const rows = await selectSql(`SELECT * FROM ${tableName};`);
      rawData[key] = rows || [];
    } catch (_) {
      rawData[key] = [];
    }
  }

  const dataStr = JSON.stringify(rawData);
  const checksum = generateChecksum(dataStr);
  const exportedAt = new Date().toISOString();
  const dateStr = exportedAt.split('T')[0];

  const payload: BackupPayload = {
    version: '2.5.0',
    app: 'OmniLife',
    exportedAt,
    checksum,
    data: rawData,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `omnilife_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 2. Export Table to CSV
export async function exportToCSV(tableName: 'transactions' | 'inventory'): Promise<void> {
  let rows: any[] = [];
  let filename = '';

  if (tableName === 'transactions') {
    rows = await selectSql(`SELECT * FROM financial_transactions ORDER BY date DESC;`);
    filename = `OmniLife_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
  } else {
    rows = await selectSql(`SELECT * FROM inventory ORDER BY name ASC;`);
    filename = `OmniLife_Inventory_${new Date().toISOString().split('T')[0]}.csv`;
  }

  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]).join(',');
  const csvLines = rows.map((r) =>
    Object.values(r)
      .map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );

  const csvContent = [headers, ...csvLines].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 3. Validate and Restore Complete Backup Data into SQLite
export async function validateAndRestoreBackup(backupJsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const payload: BackupPayload = JSON.parse(backupJsonString);

    if (!payload.app || (payload.app !== 'PersonalLifeManager' && payload.app !== 'OmniLife') || !payload.data) {
      return { success: false, message: 'Format file cadangan tidak valid.' };
    }

    const dataStr = JSON.stringify(payload.data);
    const calculatedChecksum = generateChecksum(dataStr);

    if (payload.checksum && payload.checksum !== calculatedChecksum) {
      console.warn('Checksum mismatch, attempting restoration with provided data.');
    }

    let restoredTableCount = 0;
    let totalRestoredRows = 0;

    for (const [key, tableName] of Object.entries(TABLE_MAPPING)) {
      const rows = payload.data[key];
      if (Array.isArray(rows) && rows.length > 0) {
        try {
          // Clear current table data before restoring
          await executeSql(`DELETE FROM ${tableName};`);

          for (const row of rows) {
            const columns = Object.keys(row);
            if (columns.length === 0) continue;

            const placeholders = columns.map(() => '?').join(', ');
            const values = Object.values(row);

            await executeSql(
              `INSERT OR REPLACE INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders});`,
              values
            );
            totalRestoredRows++;
          }
          restoredTableCount++;
        } catch (tableErr: any) {
          console.warn(`Warning restoring table ${tableName}:`, tableErr);
        }
      }
    }

    return {
      success: true,
      message: `Pemulihan data berhasil! Total ${totalRestoredRows} baris data dari ${restoredTableCount} modul (termasuk data Akademik, Keuangan, Tugas, Catatan, dll.) berhasil dipulihkan ke SQLite lokal.`,
    };
  } catch (err: any) {
    console.error('Error during backup restoration:', err);
    return { success: false, message: `Gagal memulihkan data: ${err?.message || 'Kesalahan tidak diketahui'}` };
  }
}
