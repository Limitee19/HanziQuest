import { useState, useMemo } from 'react';
import { course } from '@/data/course';
import type { CourseWord } from '@/data/course.types';
import { meaningOf } from '@/data/course.types';
import { DrillKind, getSimilarDistractors } from '@/services/chinese/questService';
import { clickTick, playErrorBuzz, playSuccessChime, speakHanzi } from '@/lib/fx';
import { usePrefs } from '@/lib/prefs';
import { NavTab } from '@/types';

interface DrillPageProps {
  onNavigate?: (tab: NavTab) => void;
  onBackToMap?: () => void;
  initialLevel?: number;
  initialKind?: DrillKind;
}

const DRILL_TABS: { id: DrillKind; name: string; hint: string; icon: string }[] = [
  { id: 'tone', name: 'Jebakan Nada', hint: 'Bunyi serupa, beda nada intonasi', icon: 'ph-music-notes' },
  { id: 'visual', name: 'Kembaran Mirip', hint: 'Bentuk aksara & goresan mirip', icon: 'ph-eye' },
  { id: 'radical', name: 'Satu Atap', hint: 'Golongan & rumpun kelas kata sama', icon: 'ph-puzzle-piece' },
];

export function DrillPage({ onNavigate, onBackToMap, initialLevel = 1, initialKind = 'tone' }: DrillPageProps) {
  const { prefs } = usePrefs();
  const [level, setLevel] = useState(initialLevel);
  const [kind, setKind] = useState<DrillKind>(initialKind);
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleGoBack = () => {
    clickTick(prefs.sound);
    if (onBackToMap) {
      onBackToMap();
    } else if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  // Filter pool kata sesuai level
  const wordsInLevel = useMemo(() => {
    return course.words.filter((w) => w.level === String(level));
  }, [level]);

  // Bangun 10 ronde drill
  const rounds = useMemo(() => {
    if (wordsInLevel.length < 4) return [];
    const shuffled = [...wordsInLevel].sort(() => Math.random() - 0.5).slice(0, 10);
    return shuffled.map((target) => {
      const distractors = getSimilarDistractors(target, wordsInLevel, kind, 3);
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);
      return { target, options };
    });
  }, [wordsInLevel, kind]);

  const curRound = rounds[roundIdx];
  const isFinished = roundIdx >= rounds.length && rounds.length > 0;

  const handlePick = (picked: CourseWord) => {
    if (isAnswered || !curRound) return;
    setSelectedWordId(picked.id);
    setIsAnswered(true);

    const isCorrect = picked.id === curRound.target.id;
    if (isCorrect) {
      setScore((s) => s + 1);
      playSuccessChime(prefs.sound);
      speakHanzi(curRound.target.hanzi);
    } else {
      playErrorBuzz(prefs.sound);
    }
  };

  const handleNext = () => {
    clickTick(prefs.sound);
    setSelectedWordId(null);
    setIsAnswered(false);
    setRoundIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    clickTick(prefs.sound);
    setRoundIdx(0);
    setScore(0);
    setSelectedWordId(null);
    setIsAnswered(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* ── HEADER CARD ── */}
      <div className="card p-4 sm:p-6 md:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div
              className="shrink-0 w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl shadow-xs transition-colors"
            >
              <i className="ph-duotone ph-lightning" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.25rem', color: 'var(--ink)' }} className="break-words">
                  Drill Aksara Mirip · HSK {level}
                </h1>
                <span className="pack-badge shrink-0" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                  Pos {level}
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                Uji ketajaman visual, nada, dan arti agar aksara tidak mudah tertukar.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn--outline w-full sm:w-auto shrink-0 justify-center"
            onClick={handleGoBack}
          >
            <i className="ph-bold ph-arrow-left" /> Kembali ke Peta
          </button>
        </div>

        {/* Level Pills & Kind Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 22, paddingTop: 16, borderTop: '1px dashed var(--border)' }}>
          {/* Level Switcher (1-6) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-soft)', marginRight: 4 }}>
              Pilih Pos:
            </span>
            {[1, 2, 3, 4, 5, 6].map((l) => (
              <button
                key={l}
                type="button"
                className={`transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                  level === l ? 'btn btn--primary' : 'btn btn--outline'
                }`}
                style={{ padding: '4px 12px', fontSize: '0.82rem', borderRadius: 10 }}
                onClick={() => {
                  clickTick(prefs.sound);
                  setLevel(l);
                  handleRestart();
                }}
              >
                HSK {l}
              </button>
            ))}
          </div>

          {/* Drill Kind Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DRILL_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                  kind === t.id ? 'btn btn--primary' : 'btn btn--outline'
                }`}
                style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: 10 }}
                onClick={() => {
                  clickTick(prefs.sound);
                  setKind(t.id);
                  handleRestart();
                }}
              >
                <i className={`ph-duotone ${t.icon}`} style={{ marginRight: 4 }} />
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── DRILL ARENA ── */}
      {isFinished ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#ECFDF5',
              border: '2px solid #10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '2.5rem',
              boxShadow: '0 8px 24px -2px rgba(16, 185, 129, 0.2)',
            }}
          >
            🌸
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 6px', fontSize: '1.6rem', color: 'var(--ink)' }}>
            Drill Selesai! Skor: {score} / {rounds.length}
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', maxWidth: 440, margin: '0 auto 24px' }}>
            {score >= 8
              ? 'Luar biasa! Matamu sangat tajam membedakan detail halus aksara.'
              : 'Terus latih ketajamanmu. Perhatikan nada dan bagian radikalnya!'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button type="button" className="btn btn--outline hover:-translate-y-0.5 transition-all" onClick={handleRestart}>
              <i className="ph-bold ph-arrows-clockwise" /> Ulangi Ronde
            </button>
            <button type="button" className="btn btn--primary hover:-translate-y-0.5 transition-all" onClick={handleGoBack}>
              <i className="ph-bold ph-map-trifold" /> Lanjut ke Peta
            </button>
          </div>
        </div>
      ) : curRound ? (
        <div className="card" style={{ padding: '32px 28px' }}>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--ink-soft)' }}>
              SOAL {roundIdx + 1} DARI {rounds.length}
            </span>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--cinnabar)' }}>
              Skor: {score} Benar
            </span>
          </div>

          {/* Question Box */}
          <div
            style={{
              padding: '28px 20px',
              background: 'var(--surface-dormant)',
              border: '1.5px solid var(--border)',
              borderRadius: 18,
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  fontFamily: 'var(--font-hanzi)',
                  fontSize: '4.2rem',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  lineHeight: 1,
                }}
              >
                {curRound.target.hanzi}
              </span>
              <button
                type="button"
                className="btn-juicy hover:scale-105 active:scale-95 transition-transform"
                style={{ padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer' }}
                onClick={() => speakHanzi(curRound.target.hanzi)}
                title="Dengarkan lafal"
              >
                <i className="ph-fill ph-speaker-high" style={{ fontSize: '1.2rem', color: 'var(--cinnabar)' }} />
              </button>
            </div>

            {/* Pinyin only revealed after answering */}
            {isAnswered ? (
              <div style={{ marginTop: 8, fontSize: '1.25rem', fontWeight: 800, color: 'var(--cinnabar)' }}>
                {curRound.target.pinyin} · {meaningOf(curRound.target)}
              </div>
            ) : (
              <div style={{ marginTop: 8, fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink-soft)' }}>
                Tebak arti yang tepat untuk karakter aksara di atas
              </div>
            )}

            <p style={{ margin: '8px 0 0', fontSize: '0.86rem', color: 'var(--ink-soft)' }}>
              {kind === 'tone' && 'Perhatikan nada intonasinya — pilih arti kata yang benar!'}
              {kind === 'visual' && 'Bentuk goresan mirip — teliti guratan dan artinya!'}
              {kind === 'radical' && 'Keluarga kata serupa — pilih yang maknanya paling tepat!'}
            </p>
          </div>

          {/* Options Grid with Lively Hover */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginTop: 22 }}>
            {curRound.options.map((opt) => {
              const isPicked = selectedWordId === opt.id;
              const isTarget = opt.id === curRound.target.id;

              let bg = 'var(--surface)';
              let borderColor = 'var(--border)';
              let textColor = 'var(--ink)';

              if (isAnswered) {
                if (isTarget) {
                  bg = 'rgba(16, 185, 129, 0.22)';
                  borderColor = '#059669';
                  textColor = '#059669';
                } else if (isPicked) {
                  bg = 'rgba(239, 68, 68, 0.22)';
                  borderColor = '#DC2626';
                  textColor = '#DC2626';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isAnswered}
                  className={`btn-juicy transition-all duration-200 cursor-pointer ${
                    !isAnswered ? 'hover:-translate-y-1 hover:shadow-lg hover:border-amber-400 active:scale-[0.98]' : ''
                  }`}
                  style={{
                    background: bg,
                    borderColor,
                    color: textColor,
                    padding: '18px 16px',
                    borderRadius: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 84,
                    boxShadow: `0 4px 0 ${borderColor}`,
                  }}
                  onClick={() => handlePick(opt)}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    {isAnswered ? `${opt.pinyin} · ${meaningOf(opt)}` : meaningOf(opt)}
                  </span>
                  {isAnswered && (
                    <span style={{ fontSize: '0.8rem', color: isTarget ? '#047857' : '#B91C1C', marginTop: 4, fontWeight: 700 }}>
                      {isTarget ? '✓ Jawaban Tepat' : `(Aksara lain: ${opt.hanzi})`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Lanjut Button */}
          {isAnswered && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 14,
                background: selectedWordId === curRound.target.id ? '#ECFDF5' : '#FFF5F5',
                border: `2px solid ${selectedWordId === curRound.target.id ? '#059669' : '#DC2626'}`,
                marginTop: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i
                  className={`ph-fill ${selectedWordId === curRound.target.id ? 'ph-check-circle' : 'ph-x-circle'}`}
                  style={{ fontSize: '1.6rem', color: selectedWordId === curRound.target.id ? '#059669' : '#DC2626' }}
                />
                <span style={{ fontWeight: 800, fontSize: '0.96rem', color: selectedWordId === curRound.target.id ? '#065F46' : '#991B1B' }}>
                  {selectedWordId === curRound.target.id ? 'Tepat Sekali!' : 'Belum Tepat!'}
                </span>
              </div>

              <button
                type="button"
                className="btn btn--primary"
                onClick={handleNext}
                autoFocus
              >
                Soal Berikutnya <i className="ph-bold ph-arrow-right" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p>Memuat soal drill...</p>
        </div>
      )}
    </div>
  );
}
