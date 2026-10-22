import { useState, useEffect } from 'react';
import {
  FileArchive,
  Plus,
  Play,
  Trash2,
  FolderTree,
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DeckItem, fetchDecks, createDeck, deleteDeck, createCard } from '@/services/chinese/flashcardService';
import { chineseAudioPlayer, PlaybackStatus } from '@/services/chinese/chineseAudioPlayer';
import { AnkiImportModal } from './AnkiImportModal';
import { FlashcardStudySession } from './FlashcardStudySession';

export function DeckLibraryView() {
  const [decks, setDecks] = useState<DeckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Study Mode
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [activeDeckForStudy, setActiveDeckForStudy] = useState<DeckItem | null>(null);
  // Mode "Belajar Ulang": semua kartu deck diacak, dipakai saat deck sudah tuntas
  // (kartu baru habis) agar tetap bisa dibuka untuk review ulang.
  const [isRelearnStudy, setIsRelearnStudy] = useState(false);
  const [selectedDeckForCard, setSelectedDeckForCard] = useState<string | null>(null);

  // Form States
  const [newDeckName, setNewDeckName] = useState('');
  const [newParentDeckId, setNewParentDeckId] = useState<string>('');
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');

  // Expanded subdeck tracking
  const [expandedDecks, setExpandedDecks] = useState<Record<string, boolean>>({});

  // Diagnostik suara: rantai MP3 offline → TTS lokal → TTS online (zh-CN)
  const [soundTest, setSoundTest] = useState<'idle' | 'running' | 'ok' | 'fail'>('idle');
  const runSoundTest = async () => {
    setSoundTest('running');
    try {
      // MP3 offline → TTS lokal → TTS online, semua di dalam playText()
      await chineseAudioPlayer.playText('你好', 1.0);
      const st: PlaybackStatus = chineseAudioPlayer.getStatus();
      setSoundTest(st === 'error' ? 'fail' : 'ok');
    } catch {
      setSoundTest('fail');
    }
  };

  const loadDecks = async () => {
    setLoading(true);
    try {
      const data = await fetchDecks();
      setDecks(data);
    } catch (err) {
      console.error('Error loading decks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();

    const handleDbUpdate = () => {
      loadDecks();
    };
    window.addEventListener('omnilife_db_updated', handleDbUpdate);
    return () => window.removeEventListener('omnilife_db_updated', handleDbUpdate);
  }, []);

  const handleCreateDeckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;
    await createDeck(newDeckName, newParentDeckId || undefined);
    setNewDeckName('');
    setNewParentDeckId('');
    setIsCreateDeckModalOpen(false);
    loadDecks();
  };

  const handleCreateCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeckForCard || !cardFront.trim() || !cardBack.trim()) return;
    await createCard(selectedDeckForCard, cardFront.trim(), cardBack.trim());
    setCardFront('');
    setCardBack('');
    setIsAddCardModalOpen(false);
    loadDecks();
  };

  const handleDeleteDeck = async (deck: DeckItem) => {
    if (confirm(`Hapus deck "${deck.name}" beserta seluruh kartu di dalamnya?`)) {
      await deleteDeck(deck.id);
      loadDecks();
    }
  };

  const toggleExpand = (deckId: string) => {
    setExpandedDecks((prev: Record<string, boolean>) => ({ ...prev, [deckId]: !prev[deckId] }));
  };

  const openStudy = (deck: DeckItem, relearn: boolean) => {
    setIsRelearnStudy(relearn);
    setActiveDeckForStudy(deck);
  };

  /** Deck "tuntas": punya kartu tapi tidak ada kartu baru & tidak ada yang jatuh tempo. */
  const isDeckFinished = (d: DeckItem) => d.cardCount > 0 && d.newCount === 0 && d.dueCount === 0;

  // Filtered Decks
  const filteredDecks = decks.filter((d: DeckItem) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Total aggregates
  const totalCards = decks.reduce((sum: number, d: DeckItem) => sum + d.cardCount + (d.subdecks?.reduce((s: number, sub: DeckItem) => s + sub.cardCount, 0) || 0), 0);
  const totalDue = decks.reduce((sum: number, d: DeckItem) => sum + d.dueCount + (d.subdecks?.reduce((s: number, sub: DeckItem) => s + sub.dueCount, 0) || 0), 0);
  const totalNew = decks.reduce((sum: number, d: DeckItem) => sum + d.newCount + (d.subdecks?.reduce((s: number, sub: DeckItem) => s + sub.newCount, 0) || 0), 0);

  // If in study session mode
  if (activeDeckForStudy) {
    return (
      <FlashcardStudySession
        deckId={activeDeckForStudy.id}
        deckName={activeDeckForStudy.name}
        initialRelearn={isRelearnStudy}
        onExit={() => {
          setActiveDeckForStudy(null);
          setIsRelearnStudy(false);
          loadDecks();
        }}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 select-none">
      {/* 1. HEADER — tipografi & statistik, tanpa banner gradien (§02.4) */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <h3 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Koleksi Flashcard & Anki Decks
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Sistem belajar berbasis Spaced Repetition (SRS). Impor deck dari Anki (.apkg) atau buat deck kustom.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            onClick={runSoundTest}
            variant="outline"
            className={`text-xs flex-1 sm:flex-initial cursor-pointer ${
              soundTest === 'ok' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : soundTest === 'fail' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : ''
            }`}
            title="Uji rantai suara: MP3 offline → TTS perangkat → TTS online"
          >
            <Volume2 className="w-3.5 h-3.5 mr-1" />
            {soundTest === 'running' ? 'Menguji…' : soundTest === 'ok' ? 'Suara OK ✓' : soundTest === 'fail' ? 'Suara gagal ✗' : 'Tes Suara'}
          </Button>
          <Button onClick={() => setIsImportModalOpen(true)} className="text-xs flex-1 sm:flex-initial cursor-pointer">
            <FileArchive className="w-3.5 h-3.5 mr-1.5" /> Impor .apkg
          </Button>
          <Button onClick={() => setIsCreateDeckModalOpen(true)} variant="outline" className="text-xs flex-1 sm:flex-initial cursor-pointer">
            <Plus className="w-3.5 h-3.5 mr-1" /> Buat Deck
          </Button>
        </div>
      </div>

      {/* Aggregate Stats — baris angka (§50 Ex.3) */}
      <div className="flex items-center gap-8">
        <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Total kartu</p>
          <p className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{totalCards}</p>
        </div>
        <div>
          <p className="text-xs text-amber-600 dark:text-amber-400">Due (jatuh tempo)</p>
          <p className="text-lg font-semibold tabular-nums text-amber-600 dark:text-amber-400">{totalDue}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Kartu baru</p>
          <p className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{totalNew}</p>
        </div>
      </div>

      {/* 2. SEARCH BAR & ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari deck flashcard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-xs text-zinc-500">
          Menampilkan {filteredDecks.length} deck
        </p>
      </div>

      {/* 3. DECKS LIST & SUBDECKS */}
      {loading ? (
        <div className="py-12 text-center text-zinc-500 space-y-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Memuat koleksi deck...</p>
        </div>
      ) : filteredDecks.length === 0 ? (
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-zinc-200 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Belum Ada Deck Flashcard</h4>
            <p className="text-xs text-zinc-500">
              Impor deck Anki (.apkg) yang sudah Anda miliki atau buat deck baru untuk mulai belajar kosakata Mandarin.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
            >
              <FileArchive className="w-4 h-4 mr-1.5" /> Impor .apkg
            </Button>
            <Button
              onClick={() => setIsCreateDeckModalOpen(true)}
              variant="outline"
              className="text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" /> Buat Deck Baru
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDecks.map((deck: DeckItem) => {
            const hasSubdecks = deck.subdecks && deck.subdecks.length > 0;
            const isExpanded = expandedDecks[deck.id];

            return (
              <Card
                key={deck.id}
                className="p-4 sm:p-5 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-3 sm:space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm rounded-2xl group"
              >
                <div className="space-y-2.5">
                  {/* Top Badges & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        {deck.source === 'anki_import' ? (
                          <>
                            <FileArchive className="w-3 h-3" /> Anki Import
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-3 h-3" /> Native Deck
                          </>
                        )}
                      </span>
                      {hasSubdecks && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {deck.subdecks!.length} Subdeck
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setSelectedDeckForCard(deck.id);
                          setIsAddCardModalOpen(true);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-blue-600 rounded-lg cursor-pointer"
                        title="Tambah Kartu"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDeck(deck)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        title="Hapus Deck"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Deck Title */}
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                      {deck.name}
                    </h4>
                  </div>

                  {/* Status Chips */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[11px] sm:text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                      Baru: {deck.newCount}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold">
                      Belajar: {deck.learnCount}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">
                      Due: {deck.dueCount}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                      Selesai: {deck.masteredCount}
                    </span>
                  </div>
                </div>

                {/* Subdecks Section if exists */}
                {hasSubdecks && (
                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2 space-y-1">
                    <button
                      onClick={() => toggleExpand(deck.id)}
                      className="w-full text-left text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center justify-between py-1 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <FolderTree className="w-3.5 h-3.5 shrink-0" /> Subdeck ({deck.subdecks!.length})
                      </span>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="pl-2 sm:pl-3 space-y-1.5 pt-1">
                        {deck.subdecks!.map((sub: DeckItem) => (
                          <div
                            key={sub.id}
                            className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between gap-2 text-xs"
                          >
                            <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate text-[11px] sm:text-xs">
                              {sub.name.replace(`${deck.name}::`, '')}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[11px] text-zinc-400">{sub.cardCount} kartu</span>
                              {isDeckFinished(sub) && (
                                <button
                                  onClick={() => openStudy(sub, true)}
                                  className="p-1.5 text-emerald-600 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg cursor-pointer"
                                  title="Semua kartu sudah dipelajari — belajar ulang (diacak)"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => openStudy(sub, false)}
                                className="h-6 px-2 text-[11px] bg-blue-600 text-white font-bold cursor-pointer"
                              >
                                Belajar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Study Button */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                  <span className="text-[11px] sm:text-xs text-zinc-500 font-medium">
                    Total {deck.cardCount} Kartu
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isDeckFinished(deck) && (
                      <Button
                        onClick={() => openStudy(deck, true)}
                        size="sm"
                        variant="outline"
                        className="text-xs font-bold cursor-pointer border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 px-3 py-1.5"
                        title="Semua kartu sudah dipelajari — tinjau ulang seluruh deck (urutan diacak)"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" /> Belajar Ulang
                      </Button>
                    )}
                    <Button
                      onClick={() => openStudy(deck, false)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-600/20 px-3 sm:px-4 py-1.5 sm:py-2"
                    >
                      <Play className="w-3.5 h-3.5 mr-1 fill-white" /> Mulai Belajar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. MODALS */}
      <AnkiImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          setIsImportModalOpen(false);
          loadDecks();
        }}
      />

      {/* Modal Buat Deck Baru */}
      {isCreateDeckModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl space-y-4">
            <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Buat Deck Flashcard Baru
            </h3>
            <form onSubmit={handleCreateDeckSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nama Deck</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: HSK 1 - Kosakata Percakapan"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Induk Deck (Opsional)</label>
                <select
                  value={newParentDeckId}
                  onChange={(e) => setNewParentDeckId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Tanpa Induk (Root Deck) --</option>
                  {decks.map((d: DeckItem) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateDeckModalOpen(false)}>
                  Batal
                </Button>
                <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">
                  Buat Deck
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Modal Tambah Kartu Manual */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl space-y-4">
            <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Tambah Kartu ke Deck
            </h3>
            <form onSubmit={handleCreateCardSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Bagian Depan / Pertanyaan (Front)
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Misal: 苹果 (Píngguǒ)"
                  value={cardFront}
                  onChange={(e) => setCardFront(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Bagian Belakang / Jawaban (Back)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Misal: Apel (Buah) - Contoh: 我喜欢吃苹果"
                  value={cardBack}
                  onChange={(e) => setCardBack(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAddCardModalOpen(false)}>
                  Batal
                </Button>
                <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">
                  Simpan Kartu
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
