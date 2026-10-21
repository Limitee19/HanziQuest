import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileArchive,
  Layers,
  FileText,
  Volume2,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  ShieldCheck,
  ChevronRight,
  FolderTree,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  parseAnkiPackage,
  commitAnkiImport,
  AnkiPackagePreview,
  AnkiImportResult,
} from '@/services/chinese/ankiImporter';

interface AnkiImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function AnkiImportModal({ isOpen, onClose, onImportSuccess }: AnkiImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<AnkiPackagePreview | null>(null);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<AnkiImportResult | null>(null);
  const [translateToIndonesian, setTranslateToIndonesian] = useState(true);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    setErrorMsg(null);
    setImportResult(null);

    const fileNameLower = (file.name || '').toLowerCase();

    // Reject .colpkg immediately with helpful explanation (CL-07A Section 3)
    if (fileNameLower.endsWith('.colpkg') || fileNameLower.includes('collection.apkg')) {
      setErrorMsg(
        'File ini adalah koleksi Anki penuh (.colpkg), bukan deck yang dapat diimpor langsung. Ekspor deck tertentu dari Anki sebagai file .apkg, lalu impor file tersebut ke OmniLife.'
      );
      return;
    }

    const isRecognizedExt =
      fileNameLower.endsWith('.apkg') ||
      fileNameLower.endsWith('.zip') ||
      fileNameLower.includes('.apkg') ||
      file.type === 'application/zip' ||
      file.type === 'application/x-zip-compressed' ||
      file.type === 'application/octet-stream' ||
      file.type === '';

    // If extension is completely different (e.g. .pdf, .mp3, .txt), warn user
    if (
      !isRecognizedExt &&
      !fileNameLower.endsWith('.apkg') &&
      !fileNameLower.endsWith('.zip')
    ) {
      setErrorMsg(`Format file "${file.name}" tidak didukung. Harap pilih file paket Anki (.apkg).`);
      return;
    }

    setAnalyzing(true);
    try {
      const prev = await parseAnkiPackage(file, file.name, { translateToIndonesian });
      setPreview(prev);
      setSelectedDeckIds(prev.decks.map((d) => d.id));
    } catch (err: any) {
      console.error('Anki import error:', err);
      setErrorMsg(err?.message || 'Gagal menganalisis file .apkg. Pastikan file tidak korup.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const toggleDeckSelection = (deckId: string) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId) ? prev.filter((id) => id !== deckId) : [...prev, deckId]
    );
  };

  const handleCommitImport = async () => {
    if (!preview) return;
    setImporting(true);
    setErrorMsg(null);

    try {
      const result = await commitAnkiImport(preview, selectedDeckIds);
      setImportResult(result);
      onImportSuccess();
    } catch (err: any) {
      console.error('Import commit failed:', err);
      setErrorMsg(err?.message || 'Gagal menyimpan kartu ke database.');
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setImportResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
              <FileArchive className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                Safe Anki (.apkg) Importer
                <span className="text-[11px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Zero-JS
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-500">
                Impor deck flashcard Anki lengkap dengan audio & gambar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* STEP 1: UPLOAD ZONE (if no preview & no result) */}
          {!preview && !importResult && !analyzing && (
            <div className="space-y-4">
              {/* Opsi terjemahan Inggris → Indonesia */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={translateToIndonesian}
                  onChange={(e) => setTranslateToIndonesian(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 w-4 h-4 shrink-0"
                />
                <span className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-200">
                  <strong>Terjemahkan arti Inggris → Bahasa Indonesia</strong>
                  <br />
                  Karakter Hanzi, pinyin, dan audio tidak diubah. Hanya teks arti berbahasa Inggris yang diterjemahkan secara offline.
                </span>
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="*/*,.apkg,.zip,application/zip,application/octet-stream,application/x-zip-compressed"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 shrink-0">
                  <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Pilih file .apkg atau seret ke sini
                </h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                  Mendukung deck Bahasa Mandarin, HSK Vocab, Hanzi, Cloze Deletion, audio pelafalan (.mp3), dan gambar.
                </p>
                <div className="mt-4">
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer text-xs"
                  >
                    Telusuri File
                  </Button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Keamanan Privasi:</strong> Analisis file dilakukan 100% di browser Anda menggunakan WebAssembly SQLite parser. Seluruh script berbahaya atau tracking external diblokir secara ketat.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: ANALYZING SPINNER */}
          {analyzing && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Menganalisis Paket Anki...</h4>
              <p className="text-xs text-zinc-500 max-w-xs">
                Mengekstrak hierarki deck, struktur field, audio pelafalan, dan sanitasi template...
              </p>
            </div>
          )}

          {/* STEP 3: PREVIEW SCREEN */}
          {preview && !importResult && !importing && (
            <div className="space-y-5">
              {/* File & Meta Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <div className="flex items-center gap-3">
                  <FileArchive className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-xs md:max-w-md">
                      {preview.fileName}
                    </h4>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      {(preview.fileSize / (1024 * 1024)).toFixed(2)} MB • {preview.packageFingerprint.substring(0, 12)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-semibold cursor-pointer underline"
                >
                  Ganti File
                </button>
              </div>

              {/* Stats Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500">Total Deck</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{preview.totalDecks}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-purple-600 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500">Kartu Belajar</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{preview.totalCards}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex items-center gap-2.5">
                  <Volume2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500">Audio Suara</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{preview.totalAudio}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 flex items-center gap-2.5">
                  <ImageIcon className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500">Gambar</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{preview.totalImages}</p>
                  </div>
                </div>
              </div>

              {/* Decks Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                    <FolderTree className="w-3.5 h-3.5" /> Pilih Deck untuk Diimpor ({selectedDeckIds.length}/{preview.decks.length})
                  </label>
                  <button
                    onClick={() =>
                      setSelectedDeckIds(
                        selectedDeckIds.length === preview.decks.length ? [] : preview.decks.map((d) => d.id)
                      )
                    }
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    {selectedDeckIds.length === preview.decks.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                  </button>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 max-h-48 overflow-y-auto">
                  {preview.decks.map((deck) => (
                    <label
                      key={deck.id}
                      className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                        selectedDeckIds.includes(deck.id)
                          ? 'bg-blue-50/40 dark:bg-blue-950/20'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={selectedDeckIds.includes(deck.id)}
                          onChange={() => toggleDeckSelection(deck.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className={`text-xs font-medium ${deck.isSubdeck ? 'pl-4 text-zinc-700 dark:text-zinc-300' : 'font-bold text-zinc-900 dark:text-zinc-100'}`}>
                          {deck.name}
                        </span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                        {deck.cardCount} kartu
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Detected Fields & Card Types */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Field & Format Terdeteksi
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {preview.fieldsDetected.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono"
                    >
                      {f}
                    </span>
                  ))}
                  {preview.cardTypesDetected.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Warnings if any */}
              {preview.warnings.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Peringatan Kompatibilitas ({preview.warnings.length})
                  </p>
                  {preview.warnings.map((w, idx) => (
                    <p key={idx} className="text-[11px] text-amber-700 dark:text-amber-400 pl-5">
                      • {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: IMPORTING PROGRESS */}
          {importing && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Menyimpan Deck ke Database...</h4>
              <p className="text-xs text-zinc-500 max-w-xs">
                Menyusun kartu, mengaitkan audio dan gambar, serta menyiapkan jadwal Spaced Repetition (SRS)...
              </p>
            </div>
          )}

          {/* STEP 5: IMPORT RESULT */}
          {importResult && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Deck Anki Berhasil Diimpor!
                </h4>
                <p className="text-xs text-zinc-500">
                  Semua kartu dan media telah tersimpan aman dan siap dipelajari.
                </p>
              </div>

              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-center">
                  <p className="text-xs text-zinc-500">Deck</p>
                  <p className="text-base font-bold text-blue-600">{importResult.decksImported}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-center">
                  <p className="text-xs text-zinc-500">Kartu Dibuat</p>
                  <p className="text-base font-bold text-purple-600">{importResult.cardsCreated}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-center">
                  <p className="text-xs text-zinc-500">Media Audio/Foto</p>
                  <p className="text-base font-bold text-emerald-600">{importResult.mediaImported}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-center">
                  <p className="text-xs text-zinc-500">Duplikat Dilewati</p>
                  <p className="text-base font-bold text-zinc-600">{importResult.skippedDuplicates}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2 sm:gap-3 bg-zinc-50 dark:bg-zinc-800/50">
          {!importResult ? (
            <>
              <Button variant="outline" size="sm" onClick={onClose} disabled={analyzing || importing} className="text-xs">
                Batal
              </Button>
              {preview && (
                <Button
                  size="sm"
                  onClick={handleCommitImport}
                  disabled={importing || selectedDeckIds.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Mengimpor...
                    </>
                  ) : (
                    <>
                      Impor {selectedDeckIds.length} Deck <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <Button size="sm" onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer">
              Selesai & Buka Koleksi
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
