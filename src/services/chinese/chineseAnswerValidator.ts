import { normalizePinyin, applyToneToSyllable, PinyinToneNumber } from './pinyinEngine';

export interface ValidationResult {
  isValid: boolean;
  userAnswer: string;
  expectedAnswer: string;
  feedbackMessage: string;
}

/**
 * Validates user Pinyin input against target canonical Pinyin
 * Supports Mode A (Tone-blind) and Mode B (Tone-aware)
 */
export function validatePinyinAnswer(
  targetCanonicalPinyin: string,
  userPinyinInput: string,
  selectedTone?: PinyinToneNumber,
  isToneAware: boolean = false
): ValidationResult {
  const normTarget = normalizePinyin(targetCanonicalPinyin);
  const normUser = normalizePinyin(userPinyinInput);

  if (!isToneAware) {
    // Mode A — Tone-blind validation
    const isValid = normTarget === normUser;
    return {
      isValid,
      userAnswer: userPinyinInput,
      expectedAnswer: targetCanonicalPinyin,
      feedbackMessage: isValid
        ? 'Correct Pinyin!'
        : `Incorrect. Expected Pinyin: ${targetCanonicalPinyin}`,
    };
  }

  // Mode B — Tone-aware validation
  const toneApplied = selectedTone
    ? applyToneToSyllable(userPinyinInput, selectedTone)
    : userPinyinInput;

  const isValid = toneApplied.toLowerCase() === targetCanonicalPinyin.toLowerCase();

  return {
    isValid,
    userAnswer: toneApplied,
    expectedAnswer: targetCanonicalPinyin,
    feedbackMessage: isValid
      ? 'Correct Pinyin Dan Tone!'
      : `Incorrect tone or spelling. Expected: ${targetCanonicalPinyin}, got: ${toneApplied}`,
  };
}

/**
 * Validates Hanzi input against target Hanzi
 */
export function validateHanziAnswer(targetHanzi: string, userHanziInput: string): ValidationResult {
  const cleanTarget = targetHanzi.trim();
  const cleanUser = userHanziInput.trim();
  const isValid = cleanTarget === cleanUser;

  return {
    isValid,
    userAnswer: cleanUser,
    expectedAnswer: cleanTarget,
    feedbackMessage: isValid ? 'Correct Hanzi!' : `Incorrect Hanzi. Expected: ${cleanTarget}`,
  };
}

/**
 * Validates user meaning translation against array of accepted meanings
 */
export function validateMeaningAnswer(
  acceptedMeanings: string[],
  userMeaningInput: string
): ValidationResult {
  const cleanUser = userMeaningInput.trim().toLowerCase();
  const isValid = acceptedMeanings.some((m) => m.trim().toLowerCase() === cleanUser);

  return {
    isValid,
    userAnswer: cleanUser,
    expectedAnswer: acceptedMeanings.join(' / '),
    feedbackMessage: isValid
      ? 'Correct Translation!'
      : `Incorrect. Accepted translations: ${acceptedMeanings.join(', ')}`,
  };
}
