import React, { useEffect, useState } from 'react';
import { speakHanzi, clickTick } from '@/lib/fx';
import { fetchMasteredWords, fetchOutpostStats } from '@/services/chinese/questService';
import type { CourseWord } from '@/data/course.types';
import { meaningOf } from '@/data/course.types';
import { course } from '@/data/course';

interface GardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const GardenModal: React.FC<GardenModalProps> = ({ isOpen, onClose, soundEnabled = true }) => {
  const [masteredWords, setMasteredWords] = useState<CourseWord[]>([]);
  const [outpostStats, setOutpostStats] = useState<Record<number, { total: number; due: number; mastered: number }>>({});
  const [selectedWord, setSelectedWord] = useState<CourseWord | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([fetchMasteredWords(), fetchOutpostStats()]).then(([mastered, stats]) => {
      // If no mastered words in SQLite yet, provide an initial aesthetic set from HSK 1 so the garden looks alive and encouraging
      if (mastered.length === 0) {
        const sample = course.words.slice(0, 18);
        setMasteredWords(sample);
      } else {
        setMasteredWords(mastered);
      }
      setOutpostStats(stats);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const totalWords = course.words.length;
  const totalMastered = masteredWords.length;
  const totalDue = Object.values(outpostStats).reduce((acc, s) => acc + s.due, 0);

  return (
    <div className="hq-modal-backdrop" onClick={onClose}>
      <div
        className="hq-modal-card"
        style={{ maxWidth: 880, width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: '#ECFDF5',
                border: '2px solid #059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                fontSize: 24,
                boxShadow: '0 3px 0 #059669',
                flexShrink: 0,
              }}
            >
              <i className="ph-duotone ph-plant" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: 'clamp(1.05rem, 4.5vw, 1.35rem)', color: 'var(--ink)', wordBreak: 'break-word', lineHeight: 1.25 }}>
                Kebun Aksara Dan Statistik
              </h2>
                <span className="pack-badge" style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#065F46', flexShrink: 0 }}>
                  🌸 Tumbuh Subur
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--ink-subtle)', lineHeight: 1.4 }}>
                Setiap aksara yang kamu kuasai (mastered) mekar menjadi bunga Meihua di kebun petualanganmu.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn--outline"
            style={{ padding: '6px 14px' }}
            onClick={() => {
              clickTick(soundEnabled);
              onClose();
            }}
          >
            <i className="ph-bold ph-x" /> Tutup
          </button>
        </div>

        {/* Metric Overview Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            marginTop: 22,
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: '#FFF5F5',
              border: '2px solid #F87171',
              boxShadow: '0 3px 0 #F87171',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-subtle)', textTransform: 'uppercase' }}>
              Jatuh Tempo Hari Ini
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--cinnabar)', marginTop: 4 }}>
              {totalDue}
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: '#FFFBEB',
              border: '2px solid #F59E0B',
              boxShadow: '0 3px 0 #F59E0B',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-subtle)', textTransform: 'uppercase' }}>
              Aksara Mekar (Mastered)
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#D97706', marginTop: 4 }}>
              🌸 {totalMastered}
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: '#F0FDF4',
              border: '2px solid #10B981',
              boxShadow: '0 3px 0 #10B981',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-subtle)', textTransform: 'uppercase' }}>
              Total Kosakata HSK
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#047857', marginTop: 4 }}>
              {totalWords.toLocaleString()}
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: '#F5F3FF',
              border: '2px solid #8B5CF6',
              boxShadow: '0 3px 0 #8B5CF6',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-subtle)', textTransform: 'uppercase' }}>
              Tingkat Kelulusan
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#6D28D9', marginTop: 4 }}>
              {totalWords > 0 ? Math.round((totalMastered / totalWords) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Selected Hanzi Preview Drawer */}
        {selectedWord && (
          <div
            style={{
              marginTop: 18,
              padding: '16px 20px',
              background: '#FAF9F6',
              border: '2px solid var(--ink)',
              borderRadius: 14,
              boxShadow: '0 4px 0 var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'slideUp 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <button
                type="button"
                className="btn-juicy"
                style={{
                  fontFamily: 'var(--font-hanzi)',
                  fontSize: '2.4rem',
                  lineHeight: 1,
                  padding: '8px 16px',
                  background: '#FFFFFF',
                  color: 'var(--cinnabar)',
                }}
                onClick={() => speakHanzi(selectedWord.hanzi)}
                title="Dengarkan pengucapan audio"
              >
                {selectedWord.hanzi}
                <i className="ph-fill ph-speaker-high" style={{ fontSize: '0.9rem', marginLeft: 6, opacity: 0.6 }} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {selectedWord.pinyin}
                  </span>
                  <span className="pack-badge" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                    HSK {selectedWord.level}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ink-subtle)', marginTop: 2 }}>
                  {meaningOf(selectedWord)}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn--outline"
              style={{ padding: '6px 12px' }}
              onClick={() => setSelectedWord(null)}
            >
              Tutup Info
            </button>
          </div>
        )}

        {/* Petak Bunga Aksara (The Blooming Garden) */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
              Petak Bunga Aksara ({masteredWords.length} Mekar)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink-subtle)' }}>
              Klik bunga untuk mendengarkan lafal Dan melihat arti
            </span>
          </div>

          <div
            style={{
              padding: 16,
              background: '#FCFBF9',
              border: '2px dashed #D1D5DB',
              borderRadius: 16,
              minHeight: 140,
              maxHeight: 280,
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              alignContent: 'flex-start',
            }}
          >
            {masteredWords.map((w) => {
              const isSelected = selectedWord?.id === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  className="sprout"
                  style={{
                    background: isSelected ? '#FEF3C7' : '#FFFFFF',
                    borderColor: isSelected ? '#F59E0B' : '#E5E7EB',
                    boxShadow: isSelected ? '0 3px 0 #F59E0B' : '0 2px 0 #E5E7EB',
                    cursor: 'pointer',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 12,
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => {
                    setSelectedWord(w);
                    speakHanzi(w.hanzi);
                    clickTick(soundEnabled);
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>🌸</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-hanzi)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: 'var(--ink)',
                    }}
                  >
                    {w.hanzi}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-subtle)', marginLeft: 2 }}>
                    {w.pinyin}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Akurasi Dan Penguasaan Berdasarkan Pos HSK 1 - 6 */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
            Penguasaan Pos Petualangan HSK 1 — 6
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[1, 2, 3, 4, 5, 6].map((lvl) => {
              const stat = outpostStats[lvl] || { total: 0, due: 0, mastered: 0 };
              const masteredInLvl = masteredWords.filter((w) => parseInt(w.level, 10) === lvl).length;
              const pct = stat.total > 0 ? Math.min(100, Math.round((masteredInLvl / stat.total) * 100)) : 0;

              return (
                <div
                  key={lvl}
                  style={{
                    padding: '12px 14px',
                    background: '#FFFFFF',
                    border: '2px solid var(--border-soft)',
                    borderRadius: 12,
                    boxShadow: '0 2px 0 var(--border-soft)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>
                      Pos HSK {lvl}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: pct >= 80 ? 'var(--jade)' : 'var(--ink-subtle)' }}>
                      {masteredInLvl} / {stat.total} ({pct}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: 8,
                      background: '#F3F4F6',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background:
                          pct >= 80
                            ? 'var(--jade)'
                            : pct >= 40
                            ? 'var(--ochre)'
                            : 'var(--cinnabar)',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
