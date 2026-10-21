import { useState, useEffect } from 'react';
import {
  BookOpen,
  Flame,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Layers,
  Blocks,
  FileArchive,
  Play,
  RefreshCw,
  Cloud,
  Headphones,
  Gamepad2,
  Target,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { t, subscribeLanguageChange } from '@/services/localizationService';
import { DeckLibraryView } from './decks/DeckLibraryView';
import { LearnedVocabularyView } from './decks/LearnedVocabularyView';
import { RadicalExplorerView } from './radicals/RadicalExplorerView';
import { PassiveListeningView } from './passive/PassiveListeningView';
import { GamesHubView } from './games/GamesHubView';
import { ProgramHarianView } from './program/ProgramHarianView';
import { RadicalMasteryCard } from './radicals/RadicalMasteryCard';
import { AnkiImportModal } from './decks/AnkiImportModal';
import { FlashcardStudySession } from './decks/FlashcardStudySession';
import {
  fetchAnkiLearningOverviewStats,
  fetchDecks,
  DeckItem,
  AnkiLearningOverview,
} from '@/services/chinese/flashcardService';
import {
  pushPendingChanges,
  manualFullPullWithCooldown,
  migrateLocalDataToSupabase,
} from '@/services/sync/syncService';

export function ChineseLearningPage() {
  const [, setLangTick] = useState(0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'program' | 'decks' | 'learned' | 'radicals' | 'passive' | 'games'>('dashboard');

  // Deep-link dari Program Harian ke Arena (dengan pool kata due).
  const [arenaRequest, setArenaRequest] = useState<{
    game: 'memory' | 'timeattack';
    poolWordIds: string[];
    nonce: number;
  } | null>(null);

  // Anki Learning Overview Stats
  const [stats, setStats] = useState<AnkiLearningOverview>({
    totalDecks: 0,
    totalCards: 0,
    newCards: 0,
    learningCards: 0,
    reviewDueCards: 0,
    masteredCards: 0,
    totalReviewsDone: 0,
    currentStreak: 0,
  });

  const [decks, setDecks] = useState<DeckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Modals & Active Study
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeDeckForStudy, setActiveDeckForStudy] = useState<DeckItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [st, dList] = await Promise.all([
      fetchAnkiLearningOverviewStats(),
      fetchDecks(),
    ]);
    setStats(st);
    setDecks(dList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Listen to global DB updates (from Realtime sync)
    const handleDbUpdate = () => {
      loadData();
    };
    window.addEventListener('omnilife_db_updated', handleDbUpdate);
    return () => window.removeEventListener('omnilife_db_updated', handleDbUpdate);
  }, []);

  useEffect(() => {
    return subscribeLanguageChange(() => setLangTick((prev) => prev + 1));
  }, []);

  // Manual Cloud Sync Trigger (Push & Pull)
  const handleCloudSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncNotice(null);
    try {
      await pushPendingChanges();
      await migrateLocalDataToSupabase();
      const pullRes = await manualFullPullWithCooldown();
      await loadData();
      setSyncNotice(pullRes.message || 'Sinkronisasi Cloud Berhasil!');
      setTimeout(() => setSyncNotice(null), 5000);
    } catch (err: any) {
      setSyncNotice(`Gagal sinkron: ${err?.message || 'Koneksi error'}`);
      setTimeout(() => setSyncNotice(null), 6000);
    } finally {
      setIsSyncing(false);
    }
  };

  // If in study session mode
  if (activeDeckForStudy) {
    return (
      <FlashcardStudySession
        deckId={activeDeckForStudy.id}
        deckName={activeDeckForStudy.name}
        onExit={() => {
          setActiveDeckForStudy(null);
          loadData();
        }}
      />
    );
  }

  // Find first deck with due cards or first available deck for quick review
  const firstDueDeck = decks.find((d) => d.dueCount > 0) || decks[0];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-16 px-1 sm:px-0">
      {/* Header halaman — tenang, tanpa banner gradien (§02.4) */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">中文学习</h3>
            <span className="text-sm text-zinc-400 dark:text-zinc-500">{t('chinese.title')}</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Spaced Repetition (SRS) berbasis koleksi kartu Anki — pelafalan audio MP3 dan latihan menulis Hanzi.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            onClick={handleCloudSync}
            disabled={isSyncing}
            variant="outline"
            className="text-xs cursor-pointer"
            title="Sinkronkan kartu & deck dengan Supabase Cloud (Desktop & Mobile)"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sinkron…' : 'Sinkron Cloud'}
          </Button>

          <Button onClick={() => setIsImportModalOpen(true)} variant="outline" className="text-xs cursor-pointer">
            <FileArchive className="w-3.5 h-3.5 mr-1.5" /> Impor .apkg
          </Button>

          {firstDueDeck && (
            <Button onClick={() => setActiveDeckForStudy(firstDueDeck)} className="text-xs cursor-pointer">
              <Play className="w-3.5 h-3.5 mr-1.5" /> Mulai ({stats.reviewDueCards})
            </Button>
          )}
        </div>
      </div>

      {/* Sync Status Banner (if notice exists) */}
      {syncNotice && (
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{syncNotice}</span>
          </div>
          <button
            onClick={() => setSyncNotice(null)}
            className="text-xs font-bold text-blue-500 hover:underline shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-zinc-200 dark:border-[#24324E] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
            activeTab === 'dashboard'
              ? 'bg-[#E11D48] text-white border-[#BE123C] shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 bg-white dark:bg-[#151E32] border-zinc-200 dark:border-[#24324E] hover:bg-zinc-50 dark:hover:bg-[#1C2742]'
          }`}
        >
          Ringkasan Belajar
        </button>

        <button
          onClick={() => setActiveTab('program')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
            activeTab === 'program'
              ? 'bg-[#E11D48] text-white border-[#BE123C] shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 bg-white dark:bg-[#151E32] border-zinc-200 dark:border-[#24324E] hover:bg-zinc-50 dark:hover:bg-[#1C2742]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          Program Harian
        </button>

        <button
          onClick={() => setActiveTab('decks')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
            activeTab === 'decks'
              ? 'bg-[#E11D48] text-white border-[#BE123C] shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 bg-white dark:bg-[#151E32] border-zinc-200 dark:border-[#24324E] hover:bg-zinc-50 dark:hover:bg-[#1C2742]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Koleksi Deck ({stats.totalDecks})
        </button>

        <button
          onClick={() => setActiveTab('learned')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
            activeTab === 'learned'
              ? 'bg-[#E11D48] text-white border-[#BE123C] shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 bg-white dark:bg-[#151E32] border-zinc-200 dark:border-[#24324E] hover:bg-zinc-50 dark:hover:bg-[#1C2742]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Kosakata ({stats.totalCards})
        </button>

        <button
          onClick={() => setActiveTab('radicals')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
            activeTab === 'radicals'
              ? 'bg-[#E11D48] text-white border-[#BE123C] shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 bg-white dark:bg-[#151E32] border-zinc-200 dark:border-[#24324E] hover:bg-zinc-50 dark:hover:bg-[#1C2742]'
          }`}
        >
          <Blocks className="w-3.5 h-3.5" />
          Keluarga Radikal
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
            activeTab === 'games'
              ? 'bg-[#E11D48] text-white border-[#BE123C] shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 bg-white dark:bg-[#151E32] border-zinc-200 dark:border-[#24324E] hover:bg-zinc-50 dark:hover:bg-[#1C2742]'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          Arena Permainan
        </button>

        <button
          onClick={() => setActiveTab('passive')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
            activeTab === 'passive'
              ? 'bg-[#E11D48] text-white border-[#BE123C] shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 bg-white dark:bg-[#151E32] border-zinc-200 dark:border-[#24324E] hover:bg-zinc-50 dark:hover:bg-[#1C2742]'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          Belajar Pasif
        </button>
      </div>

      {/* 1. DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Overview Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
              <CardContent className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">Total Deck</p>
                  <h3 className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{stats.totalDecks} Decks</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
              <CardContent className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-[#C0392B] dark:text-[#FB7185] shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">Jatuh Tempo</p>
                  <h3 className="text-sm sm:text-lg font-bold text-[#C0392B] dark:text-[#FB7185] truncate">{stats.reviewDueCards} Kartu</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
              <CardContent className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">Streak Belajar</p>
                  <h3 className="text-sm sm:text-lg font-bold text-amber-600 dark:text-amber-400 truncate">{stats.currentStreak} Hari</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
              <CardContent className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">Mastered</p>
                  <h3 className="text-sm sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 truncate">{stats.masteredCards} Kartu</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Promo: Program Harian */}
          <button
            onClick={() => setActiveTab('program')}
            className="w-full text-left bg-linear-to-r from-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:opacity-95 active:scale-[0.99] transition cursor-pointer shadow-sm"
          >
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/15 text-white shrink-0">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base font-bold text-white">Program Harian — kurikulum terpandu 🎯</p>
              <p className="text-[11px] sm:text-xs text-emerald-100 mt-0.5">
                Kata baru terkurasi tiap hari dengan pengulangan bertangga D+1 → D+30. Tinggal ikuti sesinya.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
          </button>

          {/* Promo: Mode Pasif */}
          <button
            onClick={() => setActiveTab('passive')}
            className="w-full text-left bg-linear-to-r from-[#9F1239] to-[#C0392B] rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:opacity-95 active:scale-[0.99] transition cursor-pointer shadow-sm"
          >
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/15 text-white shrink-0">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base font-bold text-white">Mode Pasif — belajar sambil rebahan 🎧</p>
              <p className="text-[11px] sm:text-xs text-rose-100 mt-0.5">
                Kosakata diputar otomatis dengan jeda terjadwal. Tanpa interaksi — cukup dengarkan.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Decks Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
                <CardHeader className="px-5 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C0392B]" /> Deck Aktif Anda
                  </CardTitle>
                  <Button
                    onClick={() => setActiveTab('decks')}
                    size="sm"
                    variant="ghost"
                    className="text-xs text-[#C0392B] hover:text-[#a93226] cursor-pointer"
                  >
                    Lihat Semua Deck →
                  </Button>
                </CardHeader>

                <CardContent className="p-5 space-y-3">
                  {loading ? (
                    <div className="p-8 text-center text-xs text-zinc-400">Memuat deck...</div>
                  ) : decks.length === 0 ? (
                    <div className="py-10 px-6 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200/80 text-[#C0392B] flex items-center justify-center shadow-xs">
                        <FileArchive className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5 max-w-md mx-auto text-center">
                        <h4 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">
                          Belum Ada Deck Flashcard
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-center max-w-sm mx-auto">
                          Mulai dengan mengimpor file .apkg dari Anki atau buat deck baru untuk belajar kosakata Mandarin.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#C0392B] hover:bg-[#a93226] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mx-auto"
                      >
                        <FileArchive className="w-4 h-4" />
                        <span>Impor Deck .apkg</span>
                      </button>
                    </div>
                  ) : (
                    decks.slice(0, 5).map((deck) => (
                      <div
                        key={deck.id}
                        className="p-3 sm:p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/50 transition-all group"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors truncate">
                            {deck.name}
                          </h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[11px] sm:text-[11px]">
                            <span className="font-bold text-blue-600">{deck.newCount} Baru</span>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span className="font-bold text-amber-600">{deck.learnCount} Belajar</span>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span className="font-bold text-purple-600">{deck.dueCount} Due</span>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span className="font-bold text-emerald-600">{deck.masteredCount} Mastered</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => setActiveDeckForStudy(deck)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm shadow-blue-600/20 w-full sm:w-auto justify-center"
                        >
                          <Play className="w-3.5 h-3.5 mr-1 fill-white" /> Belajar
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Quick Actions & SRS Progress */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
                <CardHeader className="px-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Aksi Cepat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <FileArchive className="w-4 h-4 text-blue-600" />
                      Impor File .apkg Anki
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    onClick={() => setActiveTab('decks')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#C0392B]" />
                      Kelola Koleksi Deck
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#C0392B]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('learned')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      Kosakata & Karakter Hanzi
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600" />
                  </button>
                </CardContent>
              </Card>

              {/* Learning Breakdown Card */}
              <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Status Penguasaan Kartu
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-zinc-600 dark:text-zinc-400">Tuntas / Mastered</span>
                      <span className="font-bold text-emerald-600">{stats.masteredCards} / {stats.totalCards}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${stats.totalCards ? (stats.masteredCards / stats.totalCards) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-zinc-600 dark:text-zinc-400">Sedang Dipelajari (SRS)</span>
                      <span className="font-bold text-[#C0392B] dark:text-[#FB7185]">{stats.learningCards} / {stats.totalCards}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C0392B] rounded-full"
                        style={{ width: `${stats.totalCards ? (stats.learningCards / stats.totalCards) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-zinc-600 dark:text-zinc-400">Kartu Baru (Belum Mulai)</span>
                      <span className="font-bold text-blue-600">{stats.newCards} / {stats.totalCards}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${stats.totalCards ? (stats.newCards / stats.totalCards) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Radical Mastery Summary */}
              <RadicalMasteryCard onOpenRadicals={() => setActiveTab('radicals')} />
            </div>
          </div>
        </div>
      )}

      {/* 1b. PROGRAM HARIAN TAB */}
      {activeTab === 'program' && (
        <ProgramHarianView
          onOpenArena={(game, poolWordIds) => {
            setArenaRequest({ game, poolWordIds, nonce: Date.now() });
            setActiveTab('games');
          }}
        />
      )}

      {/* 2. ANKI DECKS TAB */}
      {activeTab === 'decks' && <DeckLibraryView />}

      {/* 3. LEARNED VOCABULARY & HANZI TAB */}
      {activeTab === 'learned' && <LearnedVocabularyView />}

      {/* 4. RADICAL EXPLORER TAB */}
      {activeTab === 'radicals' && <RadicalExplorerView />}

      {/* 5. GAMES ARENA TAB */}
      {activeTab === 'games' && (
        <GamesHubView
          key={arenaRequest?.nonce ?? 0}
          initialGame={arenaRequest?.game}
          poolWordIds={arenaRequest?.poolWordIds}
        />
      )}

      {/* 5. PASSIVE LISTENING TAB */}
      {activeTab === 'passive' && <PassiveListeningView />}

      {/* Global Import Modal */}
      <AnkiImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          setIsImportModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
