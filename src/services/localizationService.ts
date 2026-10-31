export type Language = 'id' | 'en';

type Listener = (lang: Language) => void;
const listeners: Set<Listener> = new Set();

const PREF_KEY = 'omnilife_language_pref';

export function getCurrentLanguage(): Language {
  try {
    const saved = localStorage.getItem(PREF_KEY);
    if (saved === 'id' || saved === 'en') return saved;
  } catch (_) {}
  return 'en';
}

export function setLanguage(lang: Language): void {
  try {
    localStorage.setItem(PREF_KEY, lang);
  } catch (_) {}
  listeners.forEach((l) => l(lang));
}

export function subscribeLanguageChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const dictionaries: Record<Language, Record<string, string>> = {
  id: {
    // Top Level Navigation Hubs
    'nav.home': 'Beranda',
    'nav.plan': 'Perencanaan',
    'nav.life': 'Kehidupan',
    'nav.money': 'Keuangan',
    'nav.study': 'Akademik Dan Studi',
    'nav.secure': 'Keamanan Dan Brankas',
    'nav.settings': 'Pengaturan',

    // Specific Tabs
    'tab.dashboard': 'Dashboard Utama',
    'tab.calendar': 'Kalender Agenda',
    'tab.tasks': 'Daftar Tugas',
    'tab.routines': 'Rutinitas Berulang',
    'tab.reminders': 'Pengingat',
    'tab.projects': 'Proyek Dan Pekerjaan',
    'tab.goals': 'Target Dan Tujuan',
    'tab.knowledge': 'Basis Pengetahuan',
    'tab.timeline': 'Lini Masa Kehidupan',
    'tab.academic': 'Perkuliahan Dan Studi',
    'tab.finance': 'Manajemen Keuangan',
    'tab.subscriptions': 'Langganan Berulang',
    'tab.wishlist': 'Daftar Keinginan',
    'tab.inventory': 'Inventaris Barang',
    'tab.important_info': 'Informasi Penting',
    'tab.documents': 'Dokumen',
    'tab.notes': 'Catatan Pribadi',
    'tab.vault': 'Brankas Rahasia',
    'tab.reviews': 'Evaluasi Kehidupan',
    'tab.ai_assistant': 'Asisten pintar AI',
    'tab.chinese_learning': 'Belajar Bahasa Mandarin',
    'tab.study_hub': 'Study Hub (Materi Kuliah)',
    'tab.analytics': 'Analitik Dan Wawasan',
    'tab.settings': 'Pengaturan',

    // Chinese Learning Module
    'chinese.title': 'Belajar Bahasa Mandarin',
    'chinese.hanziTitle': '中文学习',
    'chinese.subtitle': 'Tingkatkan kemampuan Bahasa Mandarin Anda setiap hari.',
    'chinese.todaysLearning': 'Pembelajaran Hari Ini',
    'chinese.emptyState': 'Belum ada aktivitas pembelajaran',
    'chinese.emptyDesc': 'Mulai bangun sistem pembelajaran Bahasa Mandarin Anda.',
    'chinese.quickAccess': 'Akses Cepat',
    'chinese.vocabOverview': 'Kosakata Mandarin',
    'chinese.hanziOverview': 'Karakter Hanzi',
    'chinese.streak': 'Hari Berturut-turut',
    'chinese.progress': 'Kemajuan Studi',
    'cl.vocabLibrary': 'Pustaka Kosakata Mandarin',
    'cl.searchPlaceholder': 'Cari Hanzi, Pinyin, atau arti...',
    'cl.statusNew': 'Baru',
    'cl.statusLearning': 'Sedang Dipelajari',
    'cl.statusFamiliar': 'Familiar',
    'cl.statusMastered': 'Dikuasai',
    'cl.startPractice': 'Mulai Latihan',
    'cl.allStatus': 'Semua Status',
    'cl.checkAnswer': 'Periksa Jawaban',
    'cl.nextQuestion': 'Soal Berikutnya',
    'cl.skipQuestion': 'Lewati Soal',
    'cl.practiceComplete': 'Sesi Latihan Selesai!',
    'cl.accuracy': 'Akurasi Jawaban',
    'cl.practiceAgain': 'Latihan Lagi',
    'cl.backToLibrary': 'Kembali ke Pustaka',
    'cl.hanziWriting': 'Latihan Menulis Hanzi',
    'cl.strokeOrder': 'Urutan Goresan',
    'cl.strokeCount': 'Jumlah Goresan',
    'cl.guidedPractice': 'Latihan Terpandu (Tracing)',
    'cl.freePractice': 'Latihan Bebas (Recall)',
    'cl.clearCanvas': 'Hapus Kanvas',
    'cl.undoStroke': 'Urungkan Goresan',
    'cl.evaluateWriting': 'Evaluasi Penulisan',
    'cl.strokeDataUnavailable': 'Data urutan goresan untuk karakter ini belum tersedia.',
    'cl.reviewTab': 'Review Spaced Repetition',
    'cl.dueToday': 'Review Hari Ini',
    'cl.overdue': 'Review Terlambat',
    'cl.newLearningItems': 'Materi Pembelajaran Baru',
    'cl.startDailyReview': 'Mulai Review Harian',
    'cl.allReviewsComplete': 'Semua review saat ini sudah selesai!',
    'cl.noReviewsDue': 'Tidak ada review yang perlu dilakukan sekarang.',
    'cl.listeningTab': 'Latihan Listening Dan Audio',
    'cl.playAudio': 'Putar Audio Mandarin',
    'cl.playbackSpeed': 'Kecepatan Pemutaran',
    'cl.slowSpeed': '0.75x Pelan',
    'cl.normalSpeed': '1.0x Normal',
    'cl.fastSpeed': '1.25x Cepat',
    'cl.startListeningPractice': 'Mulai Latihan Listening',
    'cl.audioUnavailable': 'Audio pengucapan belum tersedia.',

    // ACA-01 Academic Dan KRS Keys
    'aca.krs': 'Rencana Studi (KRS)',
    'aca.krsStatus': 'Status Persetujuan KRS',
    'aca.waitingPa': 'Menunggu Persetujuan Dosen PA',
    'aca.approved': 'Disetujui Dosen PA',
    'aca.revisionRequired': 'Perlu Perbaikan KRS',
    'aca.draft': 'Draft / Belum Dikirim',
    'aca.totalSks': 'Total SKS Diambil',
    'aca.scheduleConflict': 'Bentrok Jadwal Perkuliahan',
    'aca.khs': 'Kartu Hasil Studi (KHS)',
    'aca.ips': 'Indeks Prestasi Semester (IPS)',
    'aca.ipk': 'Indeks Prestasi Kumulatif (IPK)',
    'aca.advisor': 'Dosen Pembimbing Akademik (Dosen PA)',
    'aca.submitKrs': 'Kirim KRS ke Dosen PA',
    'aca.simulateApprove': 'Simulasi Persetujuan PA',
    'aca.simulateRevision': 'Simulasi Perlu Perbaikan',
    'aca.masterData': 'Master Data Dan Jam UM',
    'aca.periodProfiles': 'Profil Jam Kuliah UM (1-14)',
    'aca.regularSchedule': 'Jadwal Reguler UM',
    'aca.ramadanSchedule': 'Jadwal Ramadhan UM',
    'aca.periodRange': 'Rentang Jam Ke',
    'aca.rooms': 'Ruang Dan Gedung Perkuliahan',
    'aca.lecturers': 'Daftar Dosen Dan Dosen PA',
    'aca.classMeetings': 'Jadwal Pertemuan Kelas',
    'sync.title': 'Cloud Sync Dan Akun',
    'sync.syncing': 'Menyingkronkan Data...',
    'sync.synced': 'Tersinkronisasi',
    'sync.syncNow': 'Sync Sekarang',

    // Common Actions Dan Buttons
    'action.add': 'Tambah',
    'action.create': 'Buat Baru',
    'action.edit': 'Ubah',
    'action.delete': 'Hapus',
    'action.save': 'Simpan',
    'action.cancel': 'Batal',
    'action.search': 'Cari...',
    'action.export': 'Ekspor Data',
    'action.import': 'Impor Data',
    'action.backup': 'Buat Cadangan',
    'action.restore': 'Pulihkan Cadangan',
    'action.convert': 'Konversi',
    'action.pause': 'Hentikan Sementara',
    'action.resume': 'Lanjutkan',
    'action.complete': 'Selesaikan',

    // Common Labels
    'label.status': 'Status',
    'label.priority': 'Prioritas',
    'label.dueDate': 'Tenggat Waktu',
    'label.date': 'Tanggal',
    'label.category': 'Kategori',
    'label.price': 'Harga',
    'label.amount': 'Jumlah',
    'label.balance': 'Saldo',
    'label.total': 'Total',
    'label.language': 'Bahasa / Language',
    'label.indonesian': 'Bahasa Indonesia',
    'label.english': 'English',
  },
  en: {
    // Top Level Navigation Hubs
    'nav.home': 'Home',
    'nav.plan': 'Plan Dan Time',
    'nav.life': 'Life Dan Knowledge',
    'nav.money': 'Money Dan Finance',
    'nav.study': 'Study Dan College',
    'nav.secure': 'Security Dan Vault',
    'nav.settings': 'Settings',

    // Specific Tabs
    'tab.dashboard': 'Dashboard',
    'tab.calendar': 'Calendar',
    'tab.tasks': 'Tasks',
    'tab.routines': 'Routines',
    'tab.reminders': 'Reminders',
    'tab.projects': 'Projects',
    'tab.goals': 'Goals',
    'tab.knowledge': 'Knowledge Base',
    'tab.timeline': 'Life Timeline',
    'tab.academic': 'Academic Dan Study',
    'tab.finance': 'Finance',
    'tab.subscriptions': 'Subscriptions',
    'tab.wishlist': 'Wishlist',
    'tab.inventory': 'Inventory',
    'tab.important_info': 'Important Info',
    'tab.documents': 'Documents',
    'tab.notes': 'Notes',
    'tab.vault': 'Vault',
    'tab.reviews': 'Life Reviews',
    'tab.ai_assistant': 'AI Assistant',
    'tab.chinese_learning': 'Chinese Learning',
    'tab.study_hub': 'Study Hub (Course Materials)',
    'tab.analytics': 'Analytics Dan Insights',
    'tab.settings': 'Settings',

    // Chinese Learning Module
    'chinese.title': 'Chinese Learning',
    'chinese.hanziTitle': '中文学习',
    'chinese.subtitle': 'Improve your Mandarin every day.',
    'chinese.todaysLearning': "Today's Learning",
    'chinese.emptyState': 'No learning activities yet',
    'chinese.emptyDesc': 'Start building your Chinese learning system.',
    'chinese.quickAccess': 'Quick Access',
    'chinese.vocabOverview': 'Mandarin Vocabulary',
    'chinese.hanziOverview': 'Hanzi Characters',
    'chinese.streak': 'Learning Streak',
    'chinese.progress': 'Study Progress',
    'cl.vocabLibrary': 'Mandarin Vocabulary Library',
    'cl.searchPlaceholder': 'Search Hanzi, Pinyin, or meaning...',
    'cl.statusNew': 'New',
    'cl.statusLearning': 'Learning',
    'cl.statusFamiliar': 'Familiar',
    'cl.statusMastered': 'Mastered',
    'cl.startPractice': 'Start Practice',
    'cl.allStatus': 'All Statuses',
    'cl.checkAnswer': 'Check Answer',
    'cl.nextQuestion': 'Next Question',
    'cl.skipQuestion': 'Skip Question',
    'cl.practiceComplete': 'Practice Complete!',
    'cl.accuracy': 'Answer Accuracy',
    'cl.practiceAgain': 'Practice Again',
    'cl.backToLibrary': 'Back to Library',
    'cl.hanziWriting': 'Hanzi Writing Practice',
    'cl.strokeOrder': 'Stroke Order',
    'cl.strokeCount': 'Stroke Count',
    'cl.guidedPractice': 'Guided Tracing',
    'cl.freePractice': 'Free Recall Practice',
    'cl.clearCanvas': 'Clear Canvas',
    'cl.undoStroke': 'Undo Stroke',
    'cl.evaluateWriting': 'Evaluate Writing',
    'cl.strokeDataUnavailable': 'Stroke-order data for this character is not available yet.',
    'cl.reviewTab': 'Spaced Repetition Review',
    'cl.dueToday': 'Due Today',
    'cl.overdue': 'Overdue Reviews',
    'cl.newLearningItems': 'New Learning Items',
    'cl.startDailyReview': 'Start Daily Review',
    'cl.allReviewsComplete': 'All current reviews are complete!',
    'cl.noReviewsDue': 'No reviews are due right now.',
    'cl.listeningTab': 'Listening Dan Audio Practice',
    'cl.playAudio': 'Play Mandarin Audio',
    'cl.playbackSpeed': 'Playback Speed',
    'cl.slowSpeed': '0.75x Slow',
    'cl.normalSpeed': '1.0x Normal',
    'cl.fastSpeed': '1.25x Fast',
    'cl.startListeningPractice': 'Start Listening Practice',
    'cl.audioUnavailable': 'Audio pronunciation is unavailable.',

    // ACA-01 Academic Dan KRS Keys
    'aca.krs': 'Study Plan (KRS)',
    'aca.krsStatus': 'KRS Approval Status',
    'aca.waitingPa': 'Waiting for Academic Advisor Approval',
    'aca.approved': 'Approved by Advisor',
    'aca.revisionRequired': 'KRS Revision Required',
    'aca.draft': 'Draft / Not Submitted',
    'aca.totalSks': 'Total Credits (SKS)',
    'aca.scheduleConflict': 'Course Schedule Conflict',
    'aca.khs': 'Semester Grade Report (KHS)',
    'aca.ips': 'Semester GPA (IPS)',
    'aca.ipk': 'Cumulative GPA (IPK)',
    'aca.advisor': 'Academic Advisor (Dosen PA)',
    'aca.submitKrs': 'Submit KRS to Advisor',
    'aca.simulateApprove': 'Simulate Advisor Approval',
    'aca.simulateRevision': 'Simulate Request Revision',
    'aca.masterData': 'Master Data Dan UM Periods',
    'aca.periodProfiles': 'UM Lecture Period Profiles (1-14)',
    'aca.regularSchedule': 'UM Regular Schedule',
    'aca.ramadanSchedule': 'UM Ramadan Schedule',
    'aca.periodRange': 'Period Range',
    'aca.rooms': 'Lecture Rooms Dan Buildings',
    'aca.lecturers': 'Lecturers Dan Advisors',
    'aca.classMeetings': 'Class Meeting Schedules',
    'sync.title': 'Cloud Sync Dan Account',
    'sync.syncing': 'Syncing Data...',
    'sync.synced': 'Synced',
    'sync.syncNow': 'Sync Now',

    // Common Actions Dan Buttons
    'action.add': 'Add',
    'action.create': 'Create New',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.search': 'Search...',
    'action.export': 'Export Data',
    'action.import': 'Import Data',
    'action.backup': 'Create Backup',
    'action.restore': 'Restore Backup',
    'action.convert': 'Convert',
    'action.pause': 'Pause',
    'action.resume': 'Resume',
    'action.complete': 'Complete',

    // Common Labels
    'label.status': 'Status',
    'label.priority': 'Priority',
    'label.dueDate': 'Due Date',
    'label.date': 'Date',
    'label.category': 'Category',
    'label.price': 'Price',
    'label.amount': 'Amount',
    'label.balance': 'Balance',
    'label.total': 'Total',
    'label.language': 'Language / Bahasa',
    'label.indonesian': 'Bahasa Indonesia',
    'label.english': 'English',
  },
};

export function t(key: string, params?: Record<string, string>): string {
  const lang = getCurrentLanguage();
  let text = dictionaries[lang][key] || dictionaries['en'][key] || key;

  if (params) {
    Object.entries(params).forEach(([pKey, pVal]) => {
      text = text.replace(new RegExp(`{${pKey}}`, 'g'), pVal);
    });
  }

  return text;
}

export function formatDateLocale(dateStr?: string): string {
  if (!dateStr) return '';
  const lang = getCurrentLanguage();
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (_) {
    return dateStr;
  }
}

export function formatCurrencyLocale(amount: number, currency: string = 'IDR'): string {
  const lang = getCurrentLanguage();
  try {
    return new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency === 'IDR' ? 'IDR' : currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (_) {
    return `Rp ${amount.toLocaleString()}`;
  }
}
