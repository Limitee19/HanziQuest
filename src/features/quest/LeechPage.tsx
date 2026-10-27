import React, { useState, useEffect } from 'react';
import { Flame, Bug, Sparkles } from 'lucide-react';
import { getLeechItems, removeLeechRecord, saveMnemonicNote, LeechItem } from '@/services/chinese/questService';
import { clickTick, speakHanzi } from '@/lib/fx';
import { usePrefs } from '@/lib/prefs';

interface LeechPageProps {
  onBackToMap?: () => void;
  onStartSession?: (level?: number) => void;
}

export const LeechPage: React.FC<LeechPageProps> = ({ onBackToMap, onStartSession }) => {
  const [items, setItems] = useState<LeechItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
  const { sound } = usePrefs();

  const loadData = () => {
    const list = getLeechItems();
    setItems(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (item: LeechItem) => {
    clickTick(sound);
    setEditingId(item.wordId);
    setNoteText(item.note || '');
  };

  const handleSaveNote = (wordId: string) => {
    clickTick(sound);
    saveMnemonicNote(wordId, noteText);
    setSavedSuccessId(wordId);
    setEditingId(null);
    loadData();
    setTimeout(() => setSavedSuccessId(null), 2500);
  };

  const handleTame = (item: LeechItem) => {
    clickTick(sound);
    removeLeechRecord(item.wordId);
    loadData();
  };

  const filteredItems = filterLevel === 'all' 
    ? items 
    : items.filter(it => it.level === filterLevel);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div 
        className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{ boxShadow: '0 12px 32px -4px rgba(35, 31, 32, 0.08), 0 2px 6px -1px rgba(35, 31, 32, 0.04)' }}
      >
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shrink-0 shadow-xs">
            <Bug className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-[#231F20] dark:text-zinc-100 tracking-tight break-words">
                Ruang Leech · Karantina Kata Bandel
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold shrink-0">
                {items.length} Kata
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Kata yang keliru ≥3 kali saat latihan otomatis dikarantina ke sini. Beri jembatan keledai (mnemonik asosiatif) dan latih berulang kali sampai jinak!
            </p>
          </div>
        </div>

        {/* Back and Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto sm:justify-end shrink-0">
          {onBackToMap && (
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                onBackToMap();
              }}
              className="px-4 py-2.5 rounded-2xl border border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#1C2742] hover:bg-zinc-100 dark:hover:bg-[#253252] text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>←</span> Peta Petualangan
            </button>
          )}

          {items.length > 0 && onStartSession && (
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                onStartSession(1);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#C0392B] hover:bg-[#a93226] text-white font-bold text-xs sm:text-sm cursor-pointer transition-transform active:scale-95 shadow-xs flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 fill-white shrink-0" />
              <span>Latih Sekarang</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      {items.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mr-2">Filter Pos:</span>
          {(['all', 1, 2, 3, 4, 5, 6] as const).map((lvl) => (
            <button
              key={String(lvl)}
              type="button"
              onClick={() => {
                clickTick(sound);
                setFilterLevel(lvl);
              }}
              className={`px-3.5 py-1.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                filterLevel === lvl
                  ? 'bg-[#231F20] dark:bg-rose-600 text-white border-[#231F20] dark:border-rose-600 shadow-xs'
                  : 'bg-white dark:bg-[#1C2742] text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-[#24324E] hover:border-zinc-300 dark:hover:border-zinc-500'
              }`}
            >
              {lvl === 'all' ? 'Semua Pos' : `Pos ${lvl} (HSK ${lvl})`}
            </button>
          ))}
        </div>
      )}

      {/* Leech List / Empty State */}
      {filteredItems.length === 0 ? (
        <div 
          className="bg-white dark:bg-[#151E32] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 sm:p-16 flex flex-col items-center justify-center text-center space-y-4"
          style={{ boxShadow: '0 8px 24px -4px rgba(35, 31, 32, 0.05)' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100 text-center">
            {items.length === 0 ? 'Ruang Karantina Kosong & Bersih!' : 'Tidak Ada Kata Bandel di Pos Ini!'}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-center leading-relaxed">
            {items.length === 0 
              ? 'Hebat! Semua aksara yang kamu pelajari berjalan mulus tanpa hambatan berulang. Terus pertahankan kelancaran belajarmu!'
              : 'Pilih filter pos lain atau kembali ke peta petualangan.'}
          </p>
          {onBackToMap && (
            <button
              type="button"
              onClick={onBackToMap}
              className="mt-3 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs inline-flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              Lanjut Petualangan Peta →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isEditing = editingId === item.wordId;

            return (
              <div
                key={item.wordId}
                className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-5 space-y-3.5 transition-all hover:border-zinc-800 dark:hover:border-zinc-500"
                style={{ boxShadow: '0 8px 24px -4px rgba(35, 31, 32, 0.06), 0 2px 6px -1px rgba(35, 31, 32, 0.03)' }}
              >
                {/* Top Row: Hanzi, Pinyin, Fails Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => speakHanzi(item.hanzi)}
                      title="Klik untuk dengarkan suara"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 dark:bg-[#1C2742] border-2 border-amber-200 dark:border-amber-700/60 flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold text-[#C0392B] dark:text-[#FB7185] hover:bg-amber-100 dark:hover:bg-[#253252] transition-colors cursor-pointer shrink-0"
                    >
                      {item.hanzi}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-400">
                          {item.pinyin}
                        </span>
                        <button
                          type="button"
                          onClick={() => speakHanzi(item.hanzi)}
                          className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs cursor-pointer"
                          title="Lafalkan"
                        >
                          🔊
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug break-words">
                        {item.meaning}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold">
                      Salah {item.fails}x
                    </span>
                    {item.level && (
                      <span className="text-[10px] font-bold text-zinc-400">
                        HSK {item.level}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mnemonic Display / Editor */}
                {isEditing ? (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border-2 border-amber-300 dark:border-amber-700 space-y-2 animate-in fade-in">
                    <label className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                      💡 Tulis Jembatan Keledai (Mnemonik) Pribadi:
                    </label>
                    <textarea
                      rows={3}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Misal: Ingat karakter ini ada bentuk mata (目) dan pohon (木)..."
                      className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-[#0B111E] text-zinc-900 dark:text-zinc-100 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveNote(item.wordId)}
                        className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Simpan Mnemonik
                      </button>
                    </div>
                  </div>
                ) : item.note ? (
                  <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                    <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">💡 Mnemonik:</span>
                    <span className="italic flex-1 leading-relaxed">{item.note}</span>
                    {savedSuccessId === item.wordId && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓ Tersimpan</span>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0B111E] border border-dashed border-zinc-200 dark:border-[#24324E] text-xs text-zinc-400 dark:text-zinc-500 italic">
                    Belum ada catatan mnemonik untuk kata ini.
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-[#24324E]">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>✎</span> {item.note ? 'Ubah Catatan' : '+ Tambah Mnemonik'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTame(item)}
                    className="px-3 py-1.5 rounded-xl border-2 border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                    title="Tandai kata ini sudah berhasil dikuasai dan keluarkan dari karantina"
                  >
                    <span>✓</span> Sudah Jinak
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
