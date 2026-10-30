import { useState, useEffect } from 'react';
import { clickTick } from './fx';
import { prefGet, prefSet } from '@/services/auth/userScopedStorage';

export interface Prefs {
  arcade: boolean;
  sound: boolean;
  target: number;
  hidePinyinAudio: boolean;
}

const STORAGE_PREFS_KEY = 'hanzi_quest_prefs';

function loadPrefs(): Prefs {
  const raw = prefGet(STORAGE_PREFS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  return {
    arcade: prefGet('omnilife_arcade_mode') === 'true',
    sound: prefGet('omnilife_sound_enabled', 'true') !== 'false',
    target: parseInt(prefGet('omnilife_session_target') || '10', 10),
    hidePinyinAudio: prefGet('hanzi_quest_hide_pinyin_audio') === 'true',
  };
}

let currentPrefs: Prefs = loadPrefs();
const listeners = new Set<(p: Prefs) => void>();

export function getPrefs(): Prefs {
  return currentPrefs;
}

export function setPrefs(patch: Partial<Prefs>): void {
  currentPrefs = { ...currentPrefs, ...patch };
  try {
    prefSet(STORAGE_PREFS_KEY, JSON.stringify(currentPrefs));
    prefSet('omnilife_arcade_mode', String(currentPrefs.arcade));
    prefSet('omnilife_sound_enabled', String(currentPrefs.sound));
    prefSet('omnilife_session_target', String(currentPrefs.target));
    if (currentPrefs.hidePinyinAudio !== undefined) {
      prefSet('hanzi_quest_hide_pinyin_audio', String(currentPrefs.hidePinyinAudio));
    }
  } catch {}

  listeners.forEach((fn) => fn(currentPrefs));
  window.dispatchEvent(new CustomEvent('hanzi_prefs_changed', { detail: currentPrefs }));
}

export function usePrefs() {
  const [prefs, set] = useState<Prefs>(currentPrefs);

  useEffect(() => {
    const handler = (p: Prefs) => set(p);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const update = (patch: Partial<Prefs>) => {
    setPrefs(patch);
    clickTick(patch.sound ?? prefs.sound);
  };

  const toggleSound = () => {
    const next = !prefs.sound;
    update({ sound: next });
    clickTick(next);
  };

  const toggleArcade = () => {
    const next = !prefs.arcade;
    update({ arcade: next });
    clickTick(prefs.sound);
    window.dispatchEvent(new CustomEvent('omnilife_arcade_toggled', { detail: { arcade: next } }));
  };

  const toggleHidePinyinAudio = () => {
    const next = !prefs.hidePinyinAudio;
    update({ hidePinyinAudio: next });
    clickTick(prefs.sound);
  };

  const setTarget = (t: number) => {
    update({ target: t });
    clickTick(prefs.sound);
  };

  return {
    sound: prefs.sound,
    arcade: prefs.arcade,
    target: prefs.target,
    hidePinyinAudio: prefs.hidePinyinAudio,
    toggleSound,
    toggleArcade,
    toggleHidePinyinAudio,
    setTarget,
    prefs,
    set: update,
  };
}
