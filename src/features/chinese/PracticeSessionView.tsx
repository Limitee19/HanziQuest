import { useState } from 'react';
import { PracticeSessionManager, PracticeSessionSummary } from '@/services/chinese/chinesePracticeEngine';
import { ValidationResult } from '@/services/chinese/chineseAnswerValidator';
import { PinyinToneInput } from './PinyinToneInput';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { t } from '@/services/localizationService';

interface PracticeSessionViewProps {
  manager: PracticeSessionManager;
  onFinishSession: () => void;
}

export function PracticeSessionView({ manager, onFinishSession }: PracticeSessionViewProps) {
  const [userInput, setUserInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [summary, setSummary] = useState<PracticeSessionSummary | null>(null);

  const currentQuestion = manager.getCurrentQuestion();
  const currentIndex = manager.getCurrentIndex();
  const totalCount = manager.getTotalCount();
  const isSubmitted = manager.getIsSubmitted();

  if (isCompleted || !currentQuestion) {
    const finalSummary = summary || manager.getSummary();
    return (
      <Card className="max-w-xl mx-auto bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xl overflow-hidden">
        <CardHeader className="p-6 text-center space-y-1 border-b border-zinc-200 dark:border-zinc-800">
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t('cl.practiceComplete')}</CardTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Sesi latihan Mandarin selesai.</p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="text-center py-2 space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('cl.accuracy')}</span>
            <h2 className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              {finalSummary.accuracyPercentage}%
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">✓ Correct</p>
              <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{finalSummary.correctCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-800/60">
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">✗ Incorrect</p>
              <p className="text-xl font-bold text-rose-900 dark:text-rose-100">{finalSummary.incorrectCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">⏩ Skipped</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{finalSummary.skippedCount}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button onClick={onFinishSession} variant="outline" className="w-full cursor-pointer">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('cl.backToLibrary')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCheckSubmission = async () => {
    if (!userInput.trim() || isSubmitted) return;
    const res = await manager.evaluateSubmission(userInput);
    setValidationResult(res);
  };

  const handleSkip = () => {
    manager.skipQuestion();
    handleNext();
  };

  const handleNext = () => {
    const hasNext = manager.nextQuestion();
    setUserInput('');
    setValidationResult(null);
    if (!hasNext) {
      const sum = manager.getSummary();
      setSummary(sum);
      setIsCompleted(true);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-lg space-y-6">
      {/* Session Progress Header */}
      <CardHeader className="px-6 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Question {currentIndex + 1} of {totalCount}
        </CardTitle>
        <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
          {currentQuestion.questionType}
        </span>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Question Prompt Display */}
        <div className="text-center py-4 space-y-2 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {currentQuestion.questionType === 'hanziToPinyin' || currentQuestion.questionType === 'hanziToMeaning'
              ? 'Recall Answer for Hanzi:'
              : 'Recall Hanzi for:'}
          </p>
          <h2 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">{currentQuestion.promptText}</h2>
        </div>

        {/* Input Widgets */}
        {currentQuestion.questionType === 'hanziToPinyin' ? (
          <PinyinToneInput
            targetCanonicalPinyin={currentQuestion.expectedCanonicalAnswer}
            onValidate={async (res) => {
              const result = await manager.evaluateSubmission(res.userAnswer);
              setValidationResult(result);
            }}
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Your Answer (Jawaban Anda):</label>
              <input
                type="text"
                disabled={isSubmitted}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSubmitted) handleCheckSubmission();
                }}
                placeholder="Type your answer here..."
                className="w-full h-11 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm font-medium text-zinc-900 dark:text-zinc-100"
              />
            </div>

            {!isSubmitted && (
              <div className="flex items-center justify-between pt-2">
                <Button onClick={handleSkip} variant="ghost" className="text-xs text-zinc-500 cursor-pointer">
                  {t('cl.skipQuestion')}
                </Button>
                <Button onClick={handleCheckSubmission} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                  {t('cl.checkAnswer')}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Instant Feedback Banner */}
        {validationResult && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
              validationResult.isValid
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200/80 dark:border-rose-800/80 text-rose-800 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {validationResult.isValid ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              )}
              <div className="space-y-0.5">
                <p className="text-sm font-bold">{validationResult.feedbackMessage}</p>
                {!validationResult.isValid && (
                  <p className="text-xs opacity-90 font-mono">Expected: {validationResult.expectedAnswer}</p>
                )}
              </div>
            </div>

            <Button onClick={handleNext} className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-black cursor-pointer shrink-0">
              {t('cl.nextQuestion')} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
