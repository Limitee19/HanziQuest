import React, { useState, useEffect, useRef, useMemo } from 'react';
import { marked } from 'marked';
import { 
  Bot, 
  Send, 
  Trash2, 
  Settings, 
  Key, 
  Copy, 
  Check, 
  Mic, 
  Square, 
  Volume2, 
  VolumeX, 
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { AIMessage, AISettings } from '@/services/ai/aiTypes';
import { MicRecorder, transcribeAudio, isTtsSupported, speakText, stopSpeaking } from '@/services/ai/speechService';
import { fetchAISettings, saveAISettings, processGeneralChatTurn, activeModelFor } from '@/services/ai/aiService';
import { clickTick } from '@/lib/fx';
import { usePrefs } from '@/lib/prefs';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => {
    try {
      return marked.parse(content || '') as string;
    } catch {
      return content;
    }
  }, [content]);

  return (
    <div
      className="prose prose-xs max-w-none text-xs leading-relaxed select-text cursor-text text-zinc-900 dark:text-zinc-100
        [&_p]:my-1.5 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5
        [&_strong]:font-extrabold [&_strong]:text-[#C0392B] dark:[&_strong]:text-[#FB7185]
        [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-amber-100/60 dark:[&_code]:bg-amber-950/60 [&_code]:text-amber-950 dark:[&_code]:text-amber-200 [&_code]:font-mono [&_code]:text-[11px]
        [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:bg-[#231F20] dark:[&_pre]:bg-[#0B111E] [&_pre]:text-zinc-100 [&_pre]:my-2 [&_pre]:overflow-x-auto
        [&_h1]:text-sm [&_h1]:font-bold [&_h1]:my-2 [&_h2]:text-xs [&_h2]:font-bold [&_h2]:my-1.5 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:my-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const STORAGE_KEY_PREFIX = 'omnilife_ai_chat_';

function loadMessagesFromStorage(mode: 'general'): AIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + mode);
    if (!raw) return [];
    return JSON.parse(raw) as AIMessage[];
  } catch {
    return [];
  }
}

function saveMessagesToStorage(mode: 'general', msgs: AIMessage[]) {
  try {
    const trimmed = msgs.slice(-60);
    localStorage.setItem(STORAGE_KEY_PREFIX + mode, JSON.stringify(trimmed));
  } catch {}
}

const SUGGESTED_PROMPTS = [
  'Jelaskan perbedaan 把, 拿, dan 带',
  'Buatkan dialog memesan makanan di restoran China (HSK 2)',
  'Bagaimana rumus penggunaan pola kalimat 是...的 ?',
  'Berikan 5 contoh kalimat menggunakan kata 坚持 (jiān chí)',
];

export function AiAssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>(() => loadMessagesFromStorage('general'));
  const [inputContent, setInputContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AISettings | null>(null);
  const { sound } = usePrefs();

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [activeProviderInput, setActiveProviderInput] = useState<'groq' | 'gemini' | 'local'>('groq');
  const [groqModelInput, setGroqModelInput] = useState('openai/gpt-oss-120b');
  const [geminiModelInput, setGeminiModelInput] = useState('gemini-flash-latest');

  // Confirmation Modal State
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice input
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recorderRef = useRef<MicRecorder | null>(null);
  const recordStartRef = useRef(0);

  // Text-to-speech for AI answers
  const ttsSupported = useMemo(() => isTtsSupported(), []);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => () => {
    recorderRef.current?.cancel();
    stopSpeaking();
  }, []);

  const handleToggleRecording = async () => {
    if (isRecording) {
      const rec = recorderRef.current;
      recorderRef.current = null;
      setIsRecording(false);
      if (!rec) return;
      try {
        const heldMs = Date.now() - recordStartRef.current;
        const blob = await rec.stop();
        if (heldMs < 700) return;
        if (blob.size < 1200) {
          setMicError('Rekaman terlalu pendek. Tahan tombol lebih lama saat berbicara.');
          return;
        }
        setIsTranscribing(true);
        setMicError(null);
        const text = await transcribeAudio(blob, settings?.groqApiKey || '', 'whisper-large-v3', {
          geminiApiKey: settings?.geminiApiKey || '',
          geminiModel: settings?.geminiModel || 'gemini-flash-lite-latest',
        });
        setInputContent((prev) => (prev ? `${prev.replace(/\s+$/, '')} ${text}` : text));
      } catch (err) {
        setMicError(err instanceof Error ? err.message : 'Gagal mentranskripsi suara.');
      } finally {
        setIsTranscribing(false);
      }
      return;
    }
    try {
      const rec = new MicRecorder();
      await rec.start();
      recorderRef.current = rec;
      recordStartRef.current = Date.now();
      setMicError(null);
      setIsRecording(true);
    } catch (err) {
      const e = err as DOMException;
      setMicError(
        e?.name === 'NotAllowedError'
          ? 'Izin mikrofon ditolak.'
          : e?.name === 'NotFoundError'
            ? 'Mikrofon tidak ditemukan pada perangkat ini.'
            : (err instanceof Error && err.message) || 'Mikrofon tidak dapat diakses. Coba lagi.'
      );
    }
  };

  const handleToggleSpeech = (msg: AIMessage) => {
    if (speakingId === msg.id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    const plain = msg.content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#>-]/g, '')
      .trim();
    if (!plain) return;
    setSpeakingId(msg.id);
    speakText(plain)
      .catch(() => {})
      .finally(() => setSpeakingId(null));
  };

  useEffect(() => {
    fetchAISettings().then((s) => {
      setSettings(s);
      setGroqKeyInput(s.groqApiKey || '');
      setGeminiKeyInput(s.geminiApiKey || '');
      setActiveProviderInput(s.activeProvider);
      setGroqModelInput(s.groqModel || 'openai/gpt-oss-120b');
      setGeminiModelInput(s.geminiModel || 'gemini-flash-latest');
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    clickTick(sound);
    if (!settings) return;
    const updated: AISettings = {
      ...settings,
      groqApiKey: groqKeyInput.trim(),
      geminiApiKey: geminiKeyInput.trim(),
      activeProvider: activeProviderInput,
      groqModel: groqModelInput,
      geminiModel: geminiModelInput,
    };
    await saveAISettings(updated);
    setSettings(updated);
    setIsSettingsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || isLoading) return;

    clickTick(sound);
    const userText = inputContent.trim();
    setInputContent('');

    const userMsg: AIMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    saveMessagesToStorage('general', nextMessages);
    setIsLoading(true);

    try {
      const currentSettings = settings || (await fetchAISettings());
      const res = await processGeneralChatTurn(userText, messages, currentSettings);
      setMessages(res.messages);
      saveMessagesToStorage('general', res.messages);
    } catch (err: any) {
      console.error('AI Processing Error:', err);
      const errMsg: AIMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Error: ${err.message || 'Gagal memproses permintaan AI. Silakan periksa API Key pada pengaturan Config.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    clickTick(sound);
    setMessages([]);
    saveMessagesToStorage('general', []);
    setIsClearConfirmOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Top Header Banner ── */}
      <div 
        className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ boxShadow: '0 4px 16px -2px rgba(35, 31, 32, 0.08), 0 2px 6px -1px rgba(35, 31, 32, 0.04)' }}
      >
        <div className="flex items-center gap-4">
          <div className="chop" style={{ width: 54, height: 54, fontSize: 28, background: '#C0392B', color: '#FFF', borderRadius: 16 }}>
            师
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl font-extrabold text-[#231F20] dark:text-zinc-100">
                Tutor AI Bahasa Mandarin
              </h1>
              <Badge variant="outline" className="text-[11px] font-mono border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200">
                {settings
                  ? `${settings.activeProvider === 'groq' ? 'Groq' : settings.activeProvider === 'gemini' ? 'Gemini' : 'Local'} (${activeModelFor(settings)})`
                  : '…'}
              </Badge>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl leading-relaxed">
              Konsultasi tata bahasa, tanya pinyin Dan hanzi, latihan membuat kalimat percakapan, dan bedah soal HSK bersama asisten cerdasmu.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              clickTick(sound);
              setIsClearConfirmOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#1C2742] hover:bg-zinc-100 dark:hover:bg-[#253252] text-zinc-700 dark:text-zinc-200 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
            title="Bersihkan riwayat percakapan"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" /> Hapus Chat
          </button>

          <button
            type="button"
            onClick={() => {
              clickTick(sound);
              setIsSettingsOpen(true);
            }}
            className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#1C2742] hover:bg-zinc-50 dark:hover:bg-[#253252] text-zinc-900 dark:text-zinc-100 font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" /> Config API
          </button>
        </div>
      </div>

      {/* ── Chat Messages Container ── */}
      <div 
        className="bg-[#FAF9F6] dark:bg-[#0B111E] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-5 sm:p-7 flex flex-col space-y-4"
        style={{ boxShadow: '0 4px 16px -2px rgba(35, 31, 32, 0.08), 0 2px 6px -1px rgba(35, 31, 32, 0.04)', minHeight: '460px', height: '560px' }}
      >
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="chop" style={{ width: 68, height: 68, fontSize: 36, background: '#C0392B', color: '#FFF', borderRadius: 20 }}>
                文
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Selamat Datang di Tutor AI Mandarin!
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1 leading-relaxed">
                  Tanyakan apapun seputar aksara Hanzi, nada pinyin, partikel tata bahasa, atau minta buatkan cerita latihan membaca.
                </p>
              </div>

              {/* Prompt Suggestions */}
              <div className="pt-2 flex flex-wrap gap-2 justify-center max-w-lg">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      clickTick(sound);
                      setInputContent(prompt);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-[#24324E] bg-white dark:bg-[#151E32] hover:border-[#C0392B] dark:hover:border-[#FB7185] hover:bg-rose-50/50 dark:hover:bg-rose-950/30 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer text-left shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="chop shrink-0 mt-0.5" style={{ width: 34, height: 34, fontSize: 16, background: '#C0392B', color: '#FFF', borderRadius: 10 }}>
                      师
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-3xl text-xs max-w-2xl leading-relaxed space-y-2 select-text cursor-text relative group transition-all ${
                      isUser
                        ? 'bg-[#C0392B] text-white rounded-tr-none border border-[#A93226] shadow-sm'
                        : 'bg-[#FFFDF9] dark:bg-[#151E32] text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-300 dark:border-[#24324E] shadow-sm'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap font-medium">{m.content}</p>
                    ) : (
                      <MarkdownContent content={m.content} />
                    )}

                    {/* Actions for AI responses */}
                    {!isUser && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-[#24324E]">
                        {ttsSupported && (
                          <button
                            type="button"
                            onClick={() => handleToggleSpeech(m)}
                            className="px-2.5 py-1 rounded-lg text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                          >
                            {speakingId === m.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Dengarkan</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(m.content);
                            setCopiedId(m.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="px-2.5 py-1 rounded-lg text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="chop shrink-0 mt-0.5" style={{ width: 34, height: 34, fontSize: 16, background: '#231F20', color: '#FFF', borderRadius: 10 }}>
                      我
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 p-3 bg-white dark:bg-[#151E32] border-2 border-zinc-200 dark:border-[#24324E] rounded-2xl w-fit">
              <Bot className="w-4 h-4 animate-spin text-[#C0392B] dark:text-[#FB7185]" />
              <span>Tutor AI sedang meramu penjelasan terbaik untukmu…</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Controls ── */}
        <form onSubmit={handleSendMessage} className="flex items-end gap-2.5 pt-2 border-t border-zinc-200 dark:border-[#24324E]">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={
              isRecording
                ? 'Mendengarkan… ketuk tombol mic lagi saat selesai bicara.'
                : 'Ketik pertanyaan seputar bahasa Mandarin... (Enter untuk kirim, Shift+Enter untuk baris baru)'
            }
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#151E32] text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-[#C0392B] dark:focus:border-[#FB7185] shadow-inner resize-none leading-relaxed"
            style={{ minHeight: '46px', maxHeight: '140px' }}
          />

          <button
            type="button"
            onClick={handleToggleRecording}
            disabled={isTranscribing || isLoading}
            aria-label={isRecording ? 'Hentikan rekaman' : 'Mulai rekaman suara'}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-rose-600 border-rose-800 text-white animate-pulse'
                : 'bg-white dark:bg-[#151E32] border-zinc-300 dark:border-[#24324E] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1E2B48]'
            }`}
            style={{ boxShadow: '0 3px 0 rgba(0,0,0,0.1)' }}
          >
            {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={isLoading || !inputContent.trim()}
            className="w-11 h-11 rounded-2xl bg-[#C0392B] hover:bg-[#a93226] disabled:opacity-50 text-white flex items-center justify-center border-2 border-[#78281F] transition-transform active:scale-95 cursor-pointer shrink-0"
            style={{ boxShadow: '0 3px 0 #78281F' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Status Voice */}
        {(isRecording || isTranscribing || micError) && (
          <p className={`text-[11px] px-2 ${isRecording ? 'text-rose-600 font-bold' : micError ? 'text-rose-600 font-semibold' : 'text-zinc-500 dark:text-zinc-400'}`}>
            {isRecording
              ? '● Mendengarkan… ketuk mic saat selesai berbicara.'
              : isTranscribing
                ? 'Mentranskripsi suara melalui AI Whisper…'
                : micError}
          </p>
        )}
      </div>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Konfigurasi Kunci API AI Tutor">
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1 text-zinc-800 dark:text-zinc-200">Pilih Provider AI</label>
            <select
              value={activeProviderInput}
              onChange={(e) => setActiveProviderInput(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="groq">Groq Cloud AI (Cepat Dan Direkomendasikan)</option>
              <option value="gemini">Google Gemini AI (Akurat Dan Konteks Luas)</option>
              <option value="local">Local AI (Ollama Endpoint)</option>
            </select>
          </div>

          {activeProviderInput === 'groq' && (
            <>
              <div>
                <label className="block font-bold mb-1 text-zinc-800 dark:text-zinc-200">Groq API Key *</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="gsk_..."
                    value={groqKeyInput}
                    onChange={(e) => setGroqKeyInput(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border-2 border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:outline-hidden"
                  />
                  <Key className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Dapatkan API key gratis di console.groq.com</p>
              </div>

              <div>
                <label className="block font-bold mb-1 text-zinc-800 dark:text-zinc-200">Model Groq</label>
                <select
                  value={groqModelInput}
                  onChange={(e) => setGroqModelInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden cursor-pointer"
                >
                  <option value="openai/gpt-oss-120b">GPT OSS 120B (Sangat Pintar)</option>
                  <option value="openai/gpt-oss-20b">GPT OSS 20B (Super Cepat)</option>
                  <option value="qwen/qwen3.6-27b">Qwen 3.6 27B (Khusus Mandarin)</option>
                </select>
              </div>
            </>
          )}

          {activeProviderInput === 'gemini' && (
            <>
              <div>
                <label className="block font-bold mb-1 text-zinc-800 dark:text-zinc-200">Gemini API Key *</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="AIza..."
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border-2 border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:outline-hidden"
                  />
                  <Key className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Gratis — buat API key di aistudio.google.com</p>
              </div>

              <div>
                <label className="block font-bold mb-1 text-zinc-800 dark:text-zinc-200">Model Gemini</label>
                <select
                  value={geminiModelInput}
                  onChange={(e) => setGeminiModelInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#101726] text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden cursor-pointer"
                >
                  <option value="gemini-flash-latest">Gemini Flash Latest (Rekomendasi)</option>
                  <option value="gemini-flash-lite-latest">Gemini Flash-Lite Latest</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                </select>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-[#24324E]">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 rounded-xl border-2 border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#151E32] text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#1E2742] font-bold text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#C0392B] hover:bg-[#a93226] text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Simpan Konfigurasi
            </button>
          </div>
        </form>
      </Modal>

      {/* Clear Confirm Modal */}
      <ConfirmDeleteModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearHistory}
        title="Hapus Riwayat Percakapan Tutor AI"
        itemType="Riwayat Percakapan"
        description="Seluruh pesan percakapan dengan Tutor AI pada sesi ini akan dibersihkan."
      />
    </div>
  );
}
