import { useState, useEffect } from 'react';
import {
  Flame,
  Layers,
  Sparkles,
  ArrowRight,
  Headphones,
  Gamepad2,
  Bot,
  PenTool,
} from 'lucide-react';
import { SpeakButton } from '@/features/chinese/SpeakButton';
import { HanziPracticeView } from '@/features/chinese/HanziPracticeView';
import { fetchStudyStreak, StudyStreak } from '@/services/study/streakService';
import { getProgramSummary, ProgramSummary } from '@/services/chinese/program/programService';
import {
  fetchAnkiLearningOverviewStats,
  fetchDecks,
  AnkiLearningOverview,
  DeckItem,
} from '@/services/chinese/flashcardService';
import { GameWorldMap } from '@/components/game/GameWorldMap';
import { fetchOutpostStats } from '@/services/chinese/questService';
import { clickTick, speakHanzi } from '@/lib/fx';
import { usePrefs } from '@/lib/prefs';
import { course } from '@/data/course';
import { NavTab } from '@/types';
import { cn } from '@/lib/utils';
import { getActiveUser, onAuthStateChange, StudentUser } from '@/services/auth/classAuthService';
import { CustomAvatar } from '@/components/common/CustomAvatar';

interface DashboardPageProps {
  onNavigate: (tab: NavTab) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeInfo, setActiveInfo] = useState<'arcade' | 'sound' | null>(null);
  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false);

  // Settings & Preferences (persisted & synced with navbar)
  const { sound, arcade, target: sessionTarget, toggleSound, toggleArcade, setTarget: setSessionTarget } = usePrefs();

  // Data states
  const [streak, setStreak] = useState<StudyStreak>({
    currentStreak: 0,
    bestStreak: 0,
    totalActiveDays: 0,
    activeToday: false,
    lastActiveDay: undefined,
  });

  const [ankiStats, setAnkiStats] = useState<AnkiLearningOverview>({
    totalDecks: 0,
    totalCards: 0,
    newCards: 0,
    learningCards: 0,
    reviewDueCards: 0,
    masteredCards: 0,
    totalReviewsDone: 0,
    currentStreak: 0,
  });

  const [programSummary, setProgramSummary] = useState<ProgramSummary | null>(null);
  const [decks, setDecks] = useState<DeckItem[]>([]);
  const [outpostStats, setOutpostStats] = useState<Record<number, { total: number; due: number; mastered: number }>>({});
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => getActiveUser());

  useEffect(() => {
    return onAuthStateChange((u) => setCurrentUser(u));
  }, []);

  const loadData = async () => {
    try {
      const [streakData, ankiData, progData, deckList, opStats] = await Promise.all([
        fetchStudyStreak(),
        fetchAnkiLearningOverviewStats(),
        getProgramSummary(),
        fetchDecks(),
        fetchOutpostStats(),
      ]);
      setStreak(streakData);
      setAnkiStats(ankiData);
      setProgramSummary(progData);
      setDecks(deckList);
      setOutpostStats(opStats);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();

    const handleDbUpdate = () => loadData();
    window.addEventListener('omnilife_db_updated', handleDbUpdate);
    window.addEventListener('db_mutation', handleDbUpdate);
    return () => {
      window.removeEventListener('omnilife_db_updated', handleDbUpdate);
      window.removeEventListener('db_mutation', handleDbUpdate);
    };
  }, []);

  const handleSelectTarget = (t: number) => {
    setSessionTarget(t);
    clickTick(sound);
  };

  // Focus word of the day
  const focusWords = [
    { hanzi: '学习', pinyin: 'xué xí', meaning: 'Belajar, mempelajari', hsk: 'HSK 1', note: 'Kata kunci untuk membangun kebiasaan belajar harian.' },
    { hanzi: '坚持', pinyin: 'jiān chí', meaning: 'Bertahan, konsisten', hsk: 'HSK 3', note: 'Konsistensi adalah rahasia menguasai bahasa Mandarin.' },
    { hanzi: '进步', pinyin: 'jìn bù', meaning: 'Kemajuan, berkembang', hsk: 'HSK 2', note: 'Sedikit demi sedikit, setiap kata membawamu maju.' },
    { hanzi: '朋友', pinyin: 'péng you', meaning: 'Teman, sahabat', hsk: 'HSK 1', note: 'Bahasa adalah jembatan untuk berteman di seluruh dunia.' },
    { hanzi: '加油', pinyin: 'jiā yóu', meaning: 'Semangat! Ayo!', hsk: 'Frasa Populer', note: 'Ungkapan penyemangat sehari-hari dalam budaya Tionghoa.' },
  ];
  const dayIndex = new Date().getDate() % focusWords.length;
  const todayWord = focusWords[dayIndex];

  const totalCourseWords = course.words.length;

  // Sapaan Ramah Pengguna berdasarkan waktu lokal (Klasik Oriental tanpa emoji)
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) {
      return {
        mandarin: '早上好',
        pinyin: 'Zǎoshang hǎo',
        indo: 'Selamat Pagi',
        seal: '晨曦 · Pagi',
        motto: '千里之行，始于足下 — Perjalanan ribuan li selalu berawal dari satu langkah kecil hari ini.',
      };
    } else if (hour >= 11 && hour < 15) {
      return {
        mandarin: '中午好',
        pinyin: 'Zhōngwǔ hǎo',
        indo: 'Selamat Siang',
        seal: '日中 · Siang',
        motto: '学而时习之，不亦说乎 — Belajar dan terus melatihnya berulang kali, bukankah sangat menyenangkan?',
      };
    } else if (hour >= 15 && hour < 18) {
      return {
        mandarin: '下午好',
        pinyin: 'Xiàwǔ hǎo',
        indo: 'Selamat Sore',
        seal: '暮色 · Sore',
        motto: '熟能生巧 — Kunci utama kemahiran bahasa Mandarin adalah kebiasaan mengulang setiap hari.',
      };
    } else {
      return {
        mandarin: '晚上好',
        pinyin: 'Wǎnshang hǎo',
        indo: 'Selamat Malam',
        seal: '星夜 · Malam',
        motto: '温故而知新 — Meninjau materi lama akan menghadirkan pemahaman baru yang mendalam.',
      };
    }
  };

  const greeting = getGreetingData();
  const callingName = currentUser?.nickname?.trim() || currentUser?.displayName?.trim() || 'Teman Petualang';

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* ── 0. WELCOME GREETING BANNER DENGAN SAPAAN MANDARIN ── */}
      <div 
        className="bg-linear-to-r from-amber-50 via-rose-50/70 to-orange-50/50 dark:from-[#151E32] dark:via-[#19243C] dark:to-[#121929] border border-amber-200/80 dark:border-[#24324E] rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 sm:gap-4 relative z-10 min-w-0 flex-1">
          <CustomAvatar
            id={currentUser?.avatar || (currentUser?.role === 'admin' ? 'avatar_master' : 'avatar_panda')}
            size="lg"
            className="ring-2 ring-amber-400/40 shadow-md shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 text-amber-900 dark:text-amber-300 font-serif text-xs font-bold border border-amber-500/25 tracking-wide">
                {greeting.seal}
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <span className="font-serif text-sm sm:text-base font-extrabold">{greeting.mandarin}</span>
                <span className="font-mono text-xs opacity-75">({greeting.pinyin})</span>
              </span>
              <button
                type="button"
                onClick={() => speakHanzi(greeting.mandarin)}
                className="text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 text-xs cursor-pointer p-0.5"
                title="Dengarkan Pengucapan Sapaan Mandarin"
              >
                🔊
              </button>
              {currentUser?.role === 'guest' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                  Mode Tamu
                </span>
              )}
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mt-0.5 break-words">
              {greeting.indo}, {callingName}!
            </h2>

            <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 mt-1 italic max-w-3xl leading-relaxed">
              "{greeting.motto}"
            </p>
          </div>
        </div>
      </div>

      {/* ── 1. CORE HANZI QUEST ADVENTURE LAYOUT ── */}
      <div className="layout" style={{ margin: '0 0 32px 0', padding: 0 }}>
        {/* Kolom Kiri: Kemah Petualang & Tas Bekal */}
        <div className="col-side" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hero Card */}
          <section className={cn('hero card', arcade && 'hero--arcade')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
              <span className="pack-badge">
                <i className="ph-duotone ph-backpack" />
                <span>
                  <b>{totalCourseWords.toLocaleString()}</b> kata di bekalmu
                </span>
              </span>
              {arcade && (
                <span className="arcade-flag">
                  <i className="ph-fill ph-lightning" /> Arkade
                </span>
              )}
            </div>

            <h1 className="hero__title" style={{ marginTop: 14 }}>
              Tenang itu default. Arkade opsional.
            </h1>
            <p className="hero__tagline">
              Belajar santai, satu kartu satu napas. Siram aksara tiap hari agar tumbuh mekar.
            </p>

            {/* Toggle Switch Grid */}
            <div className="switch-grid" style={{ marginTop: 18 }}>
              {/* Mode Arkade Toggle */}
              <div className="switch-item">
                <div className="switch-row">
                  <button
                    type="button"
                    className="toggle-pill toggle-pill--jade"
                    aria-pressed={arcade}
                    onClick={() => {
                      clickTick(sound);
                      toggleArcade();
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className="ph-duotone ph-joystick" />
                      <span>Mode arkade</span>
                    </span>
                    <span className="toggle-pill__led" />
                  </button>
                  <button
                    type="button"
                    className={cn('toggle-info-btn', activeInfo === 'arcade' && 'toggle-info-btn--active')}
                    aria-label="Informasi fungsi Mode Arkade"
                    title="Apa itu Mode Arkade?"
                    onClick={() => {
                      setActiveInfo(activeInfo === 'arcade' ? null : 'arcade');
                      clickTick(sound);
                    }}
                  >
                    <i className="ph-bold ph-info" />
                  </button>
                </div>
                {activeInfo === 'arcade' && (
                  <div className="toggle-info-box">
                    <div className="toggle-info-box__title">
                      <i className="ph-bold ph-sparkle" style={{ color: 'var(--amber)' }} />
                      <span>Apa fungsi Mode Arkade?</span>
                    </div>
                    <p>
                      Saat aktif, sesi belajar dilengkapi letupan <strong>Bonus XP (+20 XP)</strong>, streak beruntun, getaran visual interaktif, dan pesta <strong>hujan konfeti 🎉</strong> saat berhasil menjawab berturut-turut!
                    </p>
                  </div>
                )}
              </div>

              {/* Mode Suara Audio Toggle */}
              <div className="switch-item">
                <div className="switch-row">
                  <button
                    type="button"
                    className="toggle-pill"
                    aria-pressed={sound}
                    onClick={() => {
                      toggleSound();
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className={`ph-duotone ${sound ? 'ph-speaker-high' : 'ph-speaker-slash'}`} />
                      <span>{sound ? 'Audio aktif' : 'Audio senyap'}</span>
                    </span>
                    <span className="toggle-pill__led" />
                  </button>
                  <button
                    type="button"
                    className={cn('toggle-info-btn', activeInfo === 'sound' && 'toggle-info-btn--active')}
                    aria-label="Informasi fungsi Audio"
                    title="Apa itu Audio?"
                    onClick={() => {
                      setActiveInfo(activeInfo === 'sound' ? null : 'sound');
                      clickTick(sound);
                    }}
                  >
                    <i className="ph-bold ph-info" />
                  </button>
                </div>
                {activeInfo === 'sound' && (
                  <div className="toggle-info-box">
                    <div className="toggle-info-box__title">
                      <i className="ph-bold ph-speaker-high" style={{ color: 'var(--ochre)' }} />
                      <span>Suara Sintesis & Ketukan</span>
                    </div>
                    <p>
                      Menyuarakan pelafalan aksara Hanzi asli (Putonghua TTS) dan lonceng audio setiap kartu dijawab benar.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Target Kartu per Sesi */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="field-label" style={{ margin: 0 }}>Target kartu per sesi</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--cinnabar)' }}>
                  {sessionTarget} kartu
                </span>
              </div>
              <div className="segmented">
                {[5, 10, 20, 50].map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={sessionTarget === t}
                    onClick={() => handleSelectTarget(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Start */}
            <div style={{ marginTop: 20 }}>
              <button
                type="button"
                className="btn btn--primary btn--juicy"
                style={{ width: '100%', padding: '12px 18px', fontSize: '1rem' }}
                onClick={() => {
                  clickTick(sound);
                  onNavigate('session');
                }}
              >
                <i className="ph-bold ph-compass" /> Mulai Petualangan Pos 1
              </button>
            </div>
          </section>

          {/* Bento Quick Action Cards Grid */}
          <div className="bento">
            {/* 1. Ulas Kesalahan (Leech Chamber) */}
            <button
              type="button"
              className="action-card action-card--jade"
              onClick={() => {
                clickTick(sound);
                onNavigate('leech');
              }}
            >
              <div className="action-card__icon">
                <i className="ph-duotone ph-bug-beetle" />
              </div>
              <span>
                <b>Ulas kesalahan</b>
                <small>jebak kata bandel</small>
              </span>
            </button>

            {/* 2. Kebun & Statistik (Garden) */}
            <button
              type="button"
              className="action-card action-card--ochre"
              onClick={() => {
                clickTick(sound);
                onNavigate('garden');
              }}
            >
              <div className="action-card__icon">
                <i className="ph-duotone ph-plant" />
              </div>
              <span>
                <b>Kebun & statistik</b>
                <small>petak bunga mekar</small>
              </span>
            </button>

            {/* 3. Drill Aksara Mirip */}
            <button
              type="button"
              className="action-card action-card--cinnabar"
              onClick={() => {
                clickTick(sound);
                onNavigate('drill');
              }}
            >
              <div className="action-card__icon">
                <i className="ph-duotone ph-lightning" />
              </div>
              <span>
                <b>Drill mirip</b>
                <small>jangan tertukar nada</small>
              </span>
            </button>

            {/* 4. Kurikulum Harian & Menulis */}
            <button
              type="button"
              className="action-card action-card--jade"
              onClick={() => {
                clickTick(sound);
                onNavigate('chinese_learning');
              }}
            >
              <div className="action-card__icon">
                <i className="ph-duotone ph-books" />
              </div>
              <span>
                <b>Program belajar</b>
                <small>menulis & latihan SRS</small>
              </span>
            </button>
          </div>
        </div>

        {/* Kolom Kanan: PETA DUNIA PETUALANGAN HSK (Interactive Game World Map) */}
        <div className="col-main">
          <GameWorldMap
            counts={outpostStats}
            soundEnabled={sound}
            onSelectStage={() => {
              clickTick(sound);
              onNavigate('session');
            }}
            onStartStudy={() => {
              clickTick(sound);
              onNavigate('session');
            }}
            onDrill={() => {
              clickTick(sound);
              onNavigate('drill');
            }}
            onOpenDeck={() => {
              clickTick(sound);
              onNavigate('chinese_learning');
            }}
          />
        </div>
      </div>

      {/* ── 2. METRIK & KATA HARI INI ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri (2 cols): Program Harian & Statistik Ingatan */}
        <div
          className="lg:col-span-2 card"
          style={{
            border: '1.5px solid var(--border)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 10px 24px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-[#C0392B] dark:text-[#FB7185] flex items-center justify-center shrink-0 shadow-xs">
                <i className="ph-duotone ph-trend-up" style={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.18rem', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                  Statistik Belajar & Spaced Repetition (SRS)
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--ink-soft)' }}>
                  Pantau daya ingat kata dan perkembangan kurikulum harianmu.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('chinese_learning')}
              className="px-4 py-2 rounded-xl bg-[#C0392B] hover:bg-[#a93226] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Buka Program</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
            <div className="stat">
              <span className="small">Jatuh Tempo (SRS)</span>
              <b style={{ color: ankiStats.reviewDueCards > 0 ? 'var(--cinnabar)' : 'var(--ink)' }}>
                {ankiStats.reviewDueCards} kata
              </b>
            </div>

            <div className="stat">
              <span className="small">Rentetan Hari</span>
              <b style={{ color: '#D97706', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                {streak.currentStreak} hari
              </b>
            </div>

            <div className="stat">
              <span className="small">Kata Dikuasai</span>
              <b style={{ color: 'var(--jade)' }}>
                {ankiStats.masteredCards} lulus
              </b>
            </div>

            <div className="stat">
              <span className="small">Total Deck Anki</span>
              <b>{ankiStats.totalDecks} deck</b>
            </div>
          </div>

          {/* Progress Kurikulum */}
          {programSummary && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Progres Kurikulum HSK</span>
                <span style={{ fontWeight: 700, color: 'var(--cinnabar)' }}>
                  {programSummary.totalCurriculum > 0
                    ? Math.round((programSummary.newDoneTotal / programSummary.totalCurriculum) * 100)
                    : 0}%
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${
                      programSummary.totalCurriculum > 0
                        ? Math.min(100, (programSummary.newDoneTotal / programSummary.totalCurriculum) * 100)
                        : 0
                    }%`,
                    background: 'var(--cinnabar)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan (1 col): Kata Fokus Hari Ini */}
        <div
          className="card"
          style={{
            border: '1.5px solid var(--border)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 10px 24px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="pack-badge">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Kata Hari Ini
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: '0.74rem',
                  fontWeight: 700,
                }}
                className="bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200"
              >
                {todayWord.hsk}
              </span>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-hanzi)',
                    fontSize: '3rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: 'var(--ink)',
                  }}
                >
                  {todayWord.hanzi}
                </span>
                <SpeakButton text={todayWord.hanzi} className="w-8 h-8 p-1.5 text-rose-600 hover:text-rose-700" />
              </div>
              <p style={{ margin: '8px 0 2px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--cinnabar)' }}>
                {todayWord.pinyin}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '0.94rem', fontWeight: 600, color: 'var(--ink)' }}>
                {todayWord.meaning}
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                {todayWord.note}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px dashed var(--border)' }} className="space-y-2">
            <button
              type="button"
              className="btn btn--primary"
              style={{
                width: '100%',
                padding: '9px 14px',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
              }}
              onClick={() => {
                clickTick(sound);
                setIsWritingModalOpen(true);
              }}
            >
              <PenTool className="w-4 h-4" />
              <span>Latihan Menulis Aksara</span>
            </button>
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                onNavigate('vocab');
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 0 0 0',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--ink-soft)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                width: '100%',
              }}
              className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <span>Jelajahi di Gudang Kosakata</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. AKSES CEPAT MODUL BELAJAR LAINNYA ── */}
      <div style={{ marginTop: 36 }}>
        <h3
          style={{
            margin: '0 0 14px',
            fontSize: '1.15rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--ink)',
          }}
        >
          Akses Cepat Modul Pembelajaran
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {/* Flashcard Anki */}
          <div
            onClick={() => {
              clickTick(sound);
              onNavigate('chinese_learning');
            }}
            className="action-card action-card--jade"
            style={{ cursor: 'pointer', padding: 18 }}
          >
            <div className="action-card__icon">
              <Layers className="w-5 h-5" />
            </div>
            <span>
              <b>Koleksi Flashcard</b>
              <small>{ankiStats.totalDecks} deck kartu Anki Spaced Repetition</small>
            </span>
          </div>

          {/* Mode Belajar Pasif */}
          <div
            onClick={() => {
              clickTick(sound);
              onNavigate('chinese_learning');
            }}
            className="action-card action-card--ochre"
            style={{ cursor: 'pointer', padding: 18 }}
          >
            <div className="action-card__icon">
              <Headphones className="w-5 h-5" />
            </div>
            <span>
              <b>Mode Belajar Pasif</b>
              <small>Dengarkan audio kata & arti Indonesia saat santai</small>
            </span>
          </div>

          {/* Arena Permainan */}
          <div
            onClick={() => {
              clickTick(sound);
              onNavigate('chinese_learning');
            }}
            className="action-card action-card--cinnabar"
            style={{ cursor: 'pointer', padding: 18 }}
          >
            <div className="action-card__icon">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span>
              <b>Arena Permainan</b>
              <small>Time Attack, Memory Match, dan susun aksara</small>
            </span>
          </div>

          {/* Asisten AI Mandarin */}
          <div
            onClick={() => {
              clickTick(sound);
              onNavigate('ai_assistant');
            }}
            className="action-card action-card--jade"
            style={{ cursor: 'pointer', padding: 18 }}
          >
            <div className="action-card__icon">
              <Bot className="w-5 h-5" />
            </div>
            <span>
              <b>Tutor AI Mandarin</b>
              <small>Tanya tata bahasa, koreksi kalimat & penjelasan hanzi</small>
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. DAFTAR DECK AKTIF ── */}
      {decks.length > 0 && (
        <div
          className="card"
          style={{
            border: '1.5px solid var(--border)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 10px 24px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
              Koleksi Deck Anki Aktif
            </h3>
            <button
              type="button"
              className="btn btn--outline"
              style={{ fontSize: '0.8rem', padding: '4px 12px' }}
              onClick={() => onNavigate('chinese_learning')}
            >
              Lihat Semua ({decks.length})
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {decks.slice(0, 4).map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  clickTick(sound);
                  onNavigate('chinese_learning');
                }}
                style={{
                  padding: '12px 14px',
                  background: 'var(--surface-dormant)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 14,
                  boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--ink)' }}>{d.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', marginTop: 2 }}>
                    {d.cardCount} kartu · {d.dueCount} jatuh tempo
                  </div>
                </div>
                <i className="ph-bold ph-caret-right" style={{ color: 'var(--ink-soft)' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL LATIHAN MENULIS AKSARA (KATA HARI INI) ── */}
      {isWritingModalOpen && (
        <HanziPracticeView
          character={todayWord.hanzi}
          pinyin={todayWord.pinyin}
          meaning={todayWord.meaning}
          onClose={() => setIsWritingModalOpen(false)}
        />
      )}
    </div>
  );
}
