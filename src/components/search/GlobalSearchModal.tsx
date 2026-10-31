import { useState, useEffect, useRef } from 'react';
import type { SearchResult } from '@/services/search/searchTypes';
import { GlobalSearchService } from '@/services/search/GlobalSearchService';
import type { NavTab } from '@/types';
import { Search, X, ArrowRight, Clock, Trash2 } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab, entityId?: string) => void;
}

export function GlobalSearchModal({ isOpen, onClose, onNavigate }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(GlobalSearchService.getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search trigger
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const res = await GlobalSearchService.executeGlobalSearch(query);
      setResults(res);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation Dan Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        if (results.length > 0 && results[selectedIndex]) {
          e.preventDefault();
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelectResult = (item: SearchResult) => {
    GlobalSearchService.addRecentSearch(query || item.title);
    onNavigate(item.targetTab, item.entityId);
    onClose();
  };

  const handleSelectRecent = (q: string) => {
    setQuery(q);
  };

  const handleClearRecents = () => {
    GlobalSearchService.clearRecentSearches();
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'document':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 dark:bg-rose-950/50 text-[#C0392B] dark:text-rose-400 border border-rose-200 dark:border-rose-900 tracking-wider">
            KOSAKATA
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 tracking-wider">
            AKSI
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-start justify-center pt-8 sm:pt-16 p-3 sm:px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FFFDF9] dark:bg-[#121826] border-2 border-[#231F20] dark:border-[#334155] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] text-zinc-900 dark:text-zinc-100"
        style={{ boxShadow: '0 20px 50px -10px rgba(35, 31, 32, 0.25), 0 0 0 1px rgba(35, 31, 32, 0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b-2 border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-white dark:bg-[#151E32]">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#C0392B] flex items-center justify-center shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari hanzi, pinyin, kosakata, atau kalimat... (Ctrl + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base font-serif text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none font-bold"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300 shadow-xs">
            Esc
          </kbd>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isLoading && (
            <div className="p-10 text-center text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2">
              <Search className="w-4 h-4 text-[#C0392B] animate-spin" /> Mencari di kamus dan petualangan aksara...
            </div>
          )}

          {!isLoading && query.trim() && results.length === 0 && (
            <div className="p-10 text-center space-y-2">
              <p className="font-serif text-base font-bold text-zinc-700 dark:text-zinc-300">
                Tidak ada hasil untuk "<strong>{query}</strong>"
              </p>
              <p className="text-xs text-zinc-400">
                Coba cari dengan karakter Hanzi, ejaan Pinyin, atau arti dalam bahasa Indonesia.
              </p>
            </div>
          )}

          {!isLoading && !query.trim() && recentSearches.length > 0 && (
            <div className="p-2 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 font-sans">
                  <Clock className="w-3.5 h-3.5" /> Terakhir Dicari
                </span>
                <button
                  type="button"
                  onClick={handleClearRecents}
                  className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer flex items-center gap-1 font-sans text-[11px]"
                >
                  <Trash2 className="w-3 h-3" /> Bersihkan
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((rec, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectRecent(rec)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-[#1C2742] border border-amber-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#C0392B] hover:text-[#C0392B] transition-colors cursor-pointer shadow-2xs"
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isLoading &&
            query.trim() &&
            results.map((res, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={res.id}
                  onClick={() => handleSelectResult(res)}
                  className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs transition-all cursor-pointer border-2 ${
                    isSelected
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-[#C0392B] text-zinc-900 dark:text-zinc-100 shadow-xs translate-x-0.5'
                      : 'bg-white dark:bg-[#151E32] border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getCategoryBadge(res.category)}
                      <span className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {res.title}
                      </span>
                    </div>
                    {res.subtitle && (
                      <p className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 truncate">
                        {res.subtitle}
                      </p>
                    )}
                    {res.description && (
                      <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 truncate">
                        {res.description}
                      </p>
                    )}
                  </div>

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-[#C0392B]' : 'text-zinc-400'}`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#FAF5E8] dark:bg-[#0B101D] border-t-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-5">
          <span>Gunakan <strong>↑</strong> <strong>↓</strong> untuk memilih, <strong>Enter</strong> untuk buka</span>
          <span className="font-bold text-[#C0392B] dark:text-rose-400">Pencarian Cerdas Mandarin</span>
        </div>
      </div>
    </div>
  );
}
