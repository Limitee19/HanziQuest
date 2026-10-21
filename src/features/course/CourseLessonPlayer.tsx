import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { groupById, wordsOfGroup, course } from '@/data/course';
import { buildQuiz, mixSteps } from '@/quiz/quiz';
import { speakHanzi, playSuccessChime, playErrorBuzz, clickTick } from '@/lib/fx';
import { addLeechRecord } from '@/services/chinese/questService';

interface CourseLessonPlayerProps {
  isOpen: boolean;
  groupId: string;
  stageTitle?: string;
  onClose: () => void;
  soundEnabled?: boolean;
  arcadeEnabled?: boolean;
}

export const CourseLessonPlayer: React.FC<CourseLessonPlayerProps> = ({
  isOpen,
  groupId,
  stageTitle,
  onClose,
  soundEnabled = true,
  arcadeEnabled = true,
}) => {
  const g = useMemo(() => groupById(groupId), [groupId]);

  const words = useMemo(() => {
    if (g) return wordsOfGroup(g);
    // Fallback: pick 5 words by level or stage
    const lvl = groupId.replace(/[^0-9]/g, '') || '1';
    return course.words.filter((w) => w.level === lvl).slice(0, 5);
  }, [g, groupId]);

  const pool = useMemo(() => {
    const lvl = g ? g.level : groupId.replace(/[^0-9]/g, '') || '1';
    const wordIds = new Set(words.map((w) => w.id));
    return course.words.filter((w) => w.level === String(lvl) && !wordIds.has(w.id));
  }, [g, groupId, words]);

  const steps = useMemo(() => {
    if (!words.length) return [];
    return mixSteps(buildQuiz(words, pool));
  }, [words, pool]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [marks, setMarks] = useState<('pass' | 'fail')[]>([]);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  // Reset when opening a new lesson
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setPicked(null);
      setAnswered(false);
      setMarks([]);
      setDone(false);
      setStreak(0);
      setXp(0);
    }
  }, [isOpen, groupId]);

  const step = steps[currentIndex];

  // Auto-speak on listen step
  useEffect(() => {
    if (isOpen && step?.kind === 'listen' && step.listenHanzi && !answered) {
      speakHanzi(step.listenHanzi);
    }
  }, [isOpen, step, answered]);

  if (!isOpen) return null;

  if (!words.length || !steps.length) {
    return (
      <div className="hq-modal-backdrop" onClick={onClose}>
        <div className="hq-modal-card" style={{ maxWidth: 480, textAlign: 'center' }}>
          <i className="ph-duotone ph-warning-circle" style={{ fontSize: 48, color: 'var(--ochre)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', margin: '12px 0 6px' }}>Materi Kosong</h2>
          <p style={{ color: 'var(--ink-subtle)', fontSize: '0.9rem' }}>
            Tidak ada kata yang dapat dipelajari untuk pos ini.
          </p>
          <button type="button" className="btn btn--primary" style={{ marginTop: 16 }} onClick={onClose}>
            Kembali ke Peta
          </button>
        </div>
      </div>
    );
  }

  const handleChoose = (idx: number) => {
    if (answered) return;
    setPicked(idx);
    setAnswered(true);

    const isCorrect = idx === step.answerIndex;
    const currentWord = words.find((w) => w.id === step.wordId) || words[0];

    if (isCorrect) {
      playSuccessChime(soundEnabled);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const earned = 15 + (arcadeEnabled ? newStreak * 5 : 0);
      setXp((prev) => prev + earned);
      setMarks((prev) => [...prev, 'pass']);

      if (arcadeEnabled && newStreak % 3 === 0) {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } else {
      playErrorBuzz(soundEnabled);
      setStreak(0);
      setMarks((prev) => [...prev, 'fail']);
      // Automatically send tricky word to the Leech Chamber!
      if (currentWord) {
        addLeechRecord(currentWord, 1);
      }
    }
  };

  const handleNext = () => {
    clickTick(soundEnabled);
    if (currentIndex + 1 >= steps.length) {
      if (arcadeEnabled) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
      setDone(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setPicked(null);
    setAnswered(false);
  };

  // Completion Screen
  if (done) {
    const correctCount = marks.filter((m) => m === 'pass').length;
    const isPerfect = correctCount === steps.length;

    return (
      <div className="hq-modal-backdrop">
        <div className="hq-modal-card" style={{ maxWidth: 520, textAlign: 'center', padding: '36px 28px' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: isPerfect ? '#FEF3C7' : '#ECFDF5',
              border: `3px solid ${isPerfect ? '#F59E0B' : '#10B981'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '2.5rem',
              boxShadow: `0 4px 0 ${isPerfect ? '#F59E0B' : '#10B981'}`,
            }}
          >
            {isPerfect ? '🌸' : '✨'}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 6px', fontSize: '1.6rem', color: 'var(--ink)' }}>
            {isPerfect ? 'Sempurna! Luar Biasa' : 'Misi Pos Selesai!'}
          </h2>
          <p style={{ margin: 0, color: 'var(--ink-subtle)', fontSize: '0.92rem' }}>
            {stageTitle || (g ? `Pos ${g.level} · Bab ${g.idx + 1}` : 'Sesi Latihan HSK')}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              margin: '22px 0',
              padding: '16px',
              background: '#FAF9F6',
              border: '2px solid var(--border-soft)',
              borderRadius: 14,
            }}
          >
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-subtle)', fontWeight: 600, display: 'block' }}>
                EXP PETUALANG
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#D97706' }}>
                +{xp} XP
              </span>
            </div>
            <div style={{ width: 1, height: 36, background: '#D1D5DB' }} />
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-subtle)', fontWeight: 600, display: 'block' }}>
                KETEPATAN
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: isPerfect ? 'var(--jade)' : 'var(--ink)' }}>
                {correctCount} / {steps.length}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              className="btn btn--primary btn--juicy"
              style={{ width: '100%', padding: '12px 18px', fontSize: '1rem' }}
              onClick={onClose}
            >
              <i className="ph-bold ph-map-pin" /> Lanjutkan Petualangan
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chosenCorrect = picked !== null && picked === step.answerIndex;

  return (
    <div className="hq-modal-backdrop">
      <div
        className="hq-modal-card"
        style={{
          maxWidth: 620,
          width: '95%',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          padding: '24px 28px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="pack-badge" style={{ background: '#FAF9F6' }}>
              <i className="ph-bold ph-compass" />
              <span>{stageTitle || (g ? `Pos ${g.level} · Bab ${g.idx + 1}` : 'Sesi Latihan')}</span>
            </span>
            {arcadeEnabled && streak > 1 && (
              <span className="arcade-flag" style={{ animation: 'bounce 0.3s ease' }}>
                🔥 {streak}x Streak!
              </span>
            )}
          </div>

          <button
            type="button"
            className="btn btn--outline"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            onClick={onClose}
          >
            <i className="ph-bold ph-x" /> Keluar
          </button>
        </div>

        {/* Step Progress Dots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {steps.map((_, i) => {
            const isCurrent = i === currentIndex;
            const mark = marks[i];
            const bg = mark === 'pass' ? 'var(--jade)' : mark === 'fail' ? 'var(--cinnabar)' : isCurrent ? 'var(--ink)' : '#E5E7EB';
            const width = isCurrent ? 24 : 10;

            return (
              <div
                key={i}
                style={{
                  height: 6,
                  width,
                  borderRadius: 3,
                  background: bg,
                  transition: 'all 0.2s ease',
                }}
              />
            );
          })}
        </div>

        {/* Question Prompt Card */}
        <div
          style={{
            background: '#FAF9F6',
            border: '2px solid var(--ink)',
            borderRadius: 16,
            padding: '26px 20px',
            textAlign: 'center',
            boxShadow: '0 4px 0 var(--ink)',
            position: 'relative',
          }}
        >
          {step.kind === 'meaning' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-hanzi)',
                    fontSize: '3.6rem',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: 'var(--ink)',
                  }}
                >
                  {step.prompt}
                </span>
                <button
                  type="button"
                  className="btn-juicy"
                  style={{ padding: '8px 12px', background: '#FFFFFF', borderRadius: 10 }}
                  onClick={() => speakHanzi(step.prompt)}
                  title="Dengarkan lafal"
                >
                  <i className="ph-fill ph-speaker-high" style={{ fontSize: '1.2rem', color: 'var(--cinnabar)' }} />
                </button>
              </div>
              {step.pinyinHint && (
                <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--ink-subtle)', marginTop: 4 }}>
                  {step.pinyinHint}
                </div>
              )}
              <div style={{ fontSize: '0.84rem', color: 'var(--ink-subtle)', marginTop: 8, fontWeight: 500 }}>
                Pilih arti bahasa Indonesia yang tepat
              </div>
            </div>
          ) : step.kind === 'reverse' ? (
            <div>
              <span className="pack-badge" style={{ marginBottom: 8, display: 'inline-block' }}>
                Tebak Aksara Hanzi
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink)', margin: '6px 0' }}>
                "{step.prompt}"
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--ink-subtle)' }}>
                Manakah aksara Hanzi yang cocok dengan arti di atas?
              </div>
            </div>
          ) : step.kind === 'tone' ? (
            <div>
              <span className="pack-badge" style={{ marginBottom: 8, display: 'inline-block' }}>
                Uji Ketajaman Nada (Tone)
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', margin: '6px 0' }}>
                {step.prompt}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--ink-subtle)' }}>
                1 = Datar (ˉ) · 2 = Naik (ˊ) · 3 = Turun-Naik (ˇ) · 4 = Turun (ˋ)
              </div>
            </div>
          ) : (
            <div>
              <span className="pack-badge" style={{ marginBottom: 8, display: 'inline-block' }}>
                Uji Pendengaran (Listening)
              </span>
              <div style={{ margin: '10px 0' }}>
                <button
                  type="button"
                  className="btn btn--primary btn--juicy"
                  style={{ padding: '10px 20px', fontSize: '1rem' }}
                  onClick={() => speakHanzi(step.listenHanzi || '')}
                >
                  <i className="ph-fill ph-speaker-high" /> Putar Ulang Suara
                </button>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--ink-subtle)' }}>
                Dengarkan baik-baik lalu pilih karakter yang diucapkan
              </div>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {step.options.map((option, idx) => {
            let btnStyle = 'btn-juicy';
            let bg = '#FFFFFF';
            let borderColor = 'var(--ink)';
            let textColor = 'var(--ink)';

            if (answered) {
              if (idx === step.answerIndex) {
                bg = '#D1FAE5';
                borderColor = '#059669';
                textColor = '#065F46';
              } else if (idx === picked) {
                bg = '#FEE2E2';
                borderColor = '#DC2626';
                textColor = '#991B1B';
              } else {
                bg = '#F9FAFB';
                borderColor = '#D1D5DB';
                textColor = '#9CA3AF';
              }
            }

            const isHanziOption = step.kind === 'reverse' || step.kind === 'listen';

            return (
              <button
                key={idx}
                type="button"
                className={btnStyle}
                disabled={answered}
                style={{
                  background: bg,
                  borderColor,
                  color: textColor,
                  padding: '16px 14px',
                  borderRadius: 14,
                  fontSize: isHanziOption ? '1.8rem' : '1rem',
                  fontFamily: isHanziOption ? 'var(--font-hanzi)' : 'inherit',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: 64,
                  lineHeight: 1.2,
                  boxShadow: `0 4px 0 ${borderColor}`,
                  transition: 'all 0.15s ease',
                }}
                onClick={() => handleChoose(idx)}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback Bar & Next Button */}
        {answered && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: 14,
              background: chosenCorrect ? '#ECFDF5' : '#FFF5F5',
              border: `2px solid ${chosenCorrect ? '#059669' : '#DC2626'}`,
              animation: 'slideUp 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <i
                className={`ph-fill ${chosenCorrect ? 'ph-check-circle' : 'ph-x-circle'}`}
                style={{ fontSize: '1.6rem', color: chosenCorrect ? '#059669' : '#DC2626' }}
              />
              <div>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '0.96rem',
                    color: chosenCorrect ? '#065F46' : '#991B1B',
                  }}
                >
                  {chosenCorrect ? 'Jawaban Benar!' : 'Belum Tepat!'}
                </span>
                {!chosenCorrect && (
                  <div style={{ fontSize: '0.82rem', color: '#7F1D1D' }}>
                    Jawaban: <b>{step.options[step.answerIndex]}</b> · Dimasukkan ke Ruang Jebakan (Leech)
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="btn btn--primary btn--juicy"
              style={{ padding: '8px 22px', fontSize: '0.95rem' }}
              onClick={handleNext}
              autoFocus
            >
              Lanjut <i className="ph-bold ph-arrow-right" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
