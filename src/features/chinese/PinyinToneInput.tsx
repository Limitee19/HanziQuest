import React, { useState } from 'react';
import { applyToneToSyllable, PinyinToneNumber } from '@/services/chinese/pinyinEngine';
import { validatePinyinAnswer, ValidationResult } from '@/services/chinese/chineseAnswerValidator';
import { Button } from '@/components/ui/Button';

interface PinyinToneInputProps {
  targetCanonicalPinyin?: string;
  onValidate?: (result: ValidationResult) => void;
}

export function PinyinToneInput({ targetCanonicalPinyin = 'nǐ', onValidate }: PinyinToneInputProps) {
  const [plainPinyin, setPlainPinyin] = useState('ni');
  const [selectedTone, setSelectedTone] = useState<PinyinToneNumber>(3);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const previewPinyin = applyToneToSyllable(plainPinyin, selectedTone);

  const handleCheck = () => {
    const res = validatePinyinAnswer(targetCanonicalPinyin, plainPinyin, selectedTone, true);
    setValidationResult(res);
    if (onValidate) onValidate(res);
  };

  const handleToneSelect = (tone: PinyinToneNumber) => {
    setSelectedTone(tone);
    setValidationResult(null);
  };

  return (
    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Pinyin Tone Input Engine</h4>
        <span className="text-xs font-mono text-zinc-400">Target: <strong className="text-red-500">{targetCanonicalPinyin}</strong></span>
      </div>

      {/* Tone Selection Buttons */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Select Tone (Pilih Nada):</label>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { tone: 1, label: 'Tone 1 ( ˉ )' },
            { tone: 2, label: 'Tone 2 ( ˊ )' },
            { tone: 3, label: 'Tone 3 ( ˇ )' },
            { tone: 4, label: 'Tone 4 ( ˋ )' },
            { tone: 5, label: 'Neutral' },
          ].map((item) => (
            <button
              key={item.tone}
              type="button"
              onClick={() => handleToneSelect(item.tone as PinyinToneNumber)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTone === item.tone
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Syllable Input Dan Live Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Latin Pinyin Syllable:</label>
          <input
            type="text"
            value={plainPinyin}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPlainPinyin(e.target.value);
              setValidationResult(null);
            }}
            placeholder="e.g. ni, hao, xuē"
            className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-xs font-mono text-zinc-900 dark:text-zinc-100 mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Real-Time Tone Preview:</label>
          <div className="h-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-red-600 dark:text-red-400 font-mono">
              {previewPinyin || '—'}
            </span>
            <span className="text-[11px] text-zinc-400">Tone {selectedTone}</span>
          </div>
        </div>
      </div>

      {/* Validate Button */}
      <div className="flex items-center justify-between pt-1">
        <Button onClick={handleCheck} size="sm" className="bg-red-600 text-white hover:bg-red-700 cursor-pointer">
          Validate Answer
        </Button>
        {validationResult && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-md ${
              validationResult.isValid
                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
            }`}
          >
            {validationResult.feedbackMessage}
          </span>
        )}
      </div>
    </div>
  );
}
