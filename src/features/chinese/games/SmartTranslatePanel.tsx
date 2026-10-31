// ====================================================================
// OmniLife Chinese Arena — SmartTranslate
//
// Ketik frasa Indonesia APA PUN → AI menerjemahkan ke Mandarin natural
// dengan pinyin, variasi gaul/formal, dan catatan pemakaian. Hasil bisa
// disimpan ke "Koleksi Saya" dan otomatis ikut di-mode latihan.
// ====================================================================
import { useState } from 'react';
import { BookmarkPlus, Check, Loader2, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { speakChineseOnline } from '@/services/chinese/passiveLearningService';
import {
  REGISTER_LABEL,
  ExpressionRegister,
} from '@/services/chinese/expressions/dailyExpressions';
import {
  SmartTranslation,
  saveSmartTranslation,
  translateExpression,
} from '@/services/chinese/expressions/expressionService';

const EXAMPLES = ['aduh!', 'gila kok bisa gitu?!', 'aku gabut banget nih', 'sini aku traktir', 'semangat ya ujiannya!'];

export function SmartTranslatePanel() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SmartTranslation | null>(null);
  const [saved, setSaved] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);

  const handleTranslate = async (text?: string) => {
    const phrase = (text ?? input).trim();
    if (!phrase || loading) return;
    setInput(phrase);
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);
    try {
      const res = await translateExpression(phrase);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result || saved) return;
    try {
      saveSmartTranslation(result);
      setSaved(true);
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan ke koleksi.');
    }
  };

  const handleListen = (text: string) => {
    speakChineseOnline(text)
      .then((ok) => {
        if (!ok) setAudioFailed(true);
      })
      .catch(() => setAudioFailed(true));
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            Terjemahkan frasa bebas dengan AI
          </p>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleTranslate();
            }
          }}
          rows={2}
          maxLength={200}
          placeholder="Contoh: kok bisa telat lagi sih…"
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 resize-none"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleTranslate(ex)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:border-blue-400 hover:text-blue-600 cursor-pointer disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
        <Button
          onClick={() => handleTranslate()}
          disabled={loading || !input.trim()}
          className="w-full justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Menerjemahkan…
            </>
          ) : (
            'Terjemahkan'
          )}
        </Button>
        <p className="text-[10px] text-zinc-400 leading-relaxed">
          Memakai provider AI aktif (AI Assistant → Config). Butuh internet.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-3 text-xs font-semibold text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Hasil */}
      {result && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                {result.hanzi}
              </p>
              {result.pinyin && (
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mt-1">
                  {result.pinyin}
                </p>
              )}
            </div>
            <button
              onClick={() => handleListen(result.hanzi)}
              title="Dengarkan"
              className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 shrink-0 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                result.register === 'gaul'
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                  : result.register === 'formal'
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
              }`}
            >
              {REGISTER_LABEL[result.register as ExpressionRegister] || 'Netral'}
            </span>
            {result.literal && (
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                harfiah: {result.literal}
              </span>
            )}
          </div>

          {result.note && (
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              💡 {result.note}
            </p>
          )}

          {result.variants.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-blue-200/60 dark:border-blue-900/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Cara ucap lain
              </p>
              {result.variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => handleListen(v.hanzi)}
                  className="w-full flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-blue-100/60 dark:hover:bg-blue-950/50 text-left cursor-pointer group"
                >
                  <span className="min-w-0">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {v.hanzi}
                    </span>
                    {v.pinyin && (
                      <span className="block text-[11px] text-zinc-500 dark:text-zinc-400">
                        {v.pinyin} • {v.register}
                      </span>
                    )}
                  </span>
                  <Volume2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Button onClick={handleSave} size="sm" variant={saved ? 'outline' : 'primary'} disabled={saved}>
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" /> Tersimpan ke koleksi
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5 mr-1" /> Simpan ke Koleksi Saya
                </>
              )}
            </Button>
          </div>
          {saved && (
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              ✓ Frasa ini sekarang ikut muncul di mode Kartu Dan Kuis.
            </p>
          )}
          {audioFailed && (
            <p className="text-[11px] text-zinc-400">Audio online tidak tersedia saat ini.</p>
          )}
        </div>
      )}
    </div>
  );
}
