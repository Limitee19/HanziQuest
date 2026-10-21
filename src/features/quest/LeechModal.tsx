import { useState, useEffect } from 'react';
import { getLeechItems, removeLeechRecord, saveMnemonicNote, LeechItem } from '@/services/chinese/questService';
import { clickTick, speakHanzi } from '@/lib/fx';

interface LeechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartStudy?: () => void;
  soundEnabled?: boolean;
}

export function LeechModal({ isOpen, onClose, onStartStudy, soundEnabled = true }: LeechModalProps) {
  const [items, setItems] = useState<LeechItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const loadData = () => {
    const list = getLeechItems();
    setItems(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEdit = (item: LeechItem) => {
    clickTick(soundEnabled);
    setEditingId(item.wordId);
    setNoteText(item.note || '');
  };

  const handleSaveNote = (wordId: string) => {
    saveMnemonicNote(wordId, noteText);
    setSavedSuccessId(wordId);
    setEditingId(null);
    loadData();
    setTimeout(() => setSavedSuccessId(null), 2000);
  };

  const handleTame = (item: LeechItem) => {
    clickTick(soundEnabled);
    removeLeechRecord(item.wordId);
    loadData();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FFFDF9] dark:bg-[#151E32] border-2 border-[#231F20] dark:border-[#24324E] rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 8px 0 #231F20' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 flex items-center justify-center font-bold text-xl">
              🐛
            </span>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Ruang Leech · Karantina Kata Bandel
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Kata yang salah ≥3x disimpan di sini. Beri jembatan keledai (mnemonik) sampai jinak!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Leech List */}
        {items.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="text-5xl">✨</div>
            <h4 className="font-serif text-lg font-bold text-zinc-800 dark:text-zinc-200">Ruang Karantina Bersih!</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Tidak ada kata bandel saat ini. Terus jaga konsistensi belajar harianmu!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-500 pb-1">
              <span>{items.length} kata dalam karantina</span>
              {onStartStudy && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartStudy();
                  }}
                  className="text-rose-600 hover:underline cursor-pointer"
                >
                  Latih Semua Kata Sekarang →
                </button>
              )}
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {items.map((item) => {
                const isEditing = editingId === item.wordId;

                return (
                  <div key={item.wordId} className="py-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                          {item.hanzi}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400">
                              {item.pinyin}
                            </span>
                            <button
                              type="button"
                              onClick={() => speakHanzi(item.hanzi)}
                              className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs cursor-pointer"
                            >
                              🔊
                            </button>
                            <span className="px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-[10px] font-bold">
                              Salah {item.fails}x
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                            {item.meaning}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTame(item)}
                          className="px-2.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer"
                          title="Tandai sudah jinak dan keluarkan dari karantina"
                        >
                          ✓ Jinak
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="px-2.5 py-1.5 rounded-xl border border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#1C2742] text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-[#253252] transition-all cursor-pointer"
                        >
                          {item.note ? 'Ubah Catatan' : '+ Mnemonik'}
                        </button>
                      </div>
                    </div>

                    {/* Mnemonic Editor / Preview */}
                    {isEditing ? (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2 animate-in fade-in">
                        <label className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block">
                          Tulis Jembatan Keledai (Mnemonik) Pribadi:
                        </label>
                        <textarea
                          rows={2}
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Misal: Ingat karakter ini ada bentuk mata (目) dan pohon (木)..."
                          className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-[#0B111E] text-zinc-900 dark:text-zinc-100 text-xs font-medium focus:ring-1 focus:ring-amber-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNote(item.wordId)}
                            className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                          >
                            Simpan Mnemonik
                          </button>
                        </div>
                      </div>
                    ) : item.note ? (
                      <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">💡 Mnemonik:</span>
                        <span className="italic flex-1">{item.note}</span>
                        {savedSuccessId === item.wordId && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓ Tersimpan</span>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
