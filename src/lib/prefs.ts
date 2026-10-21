import { useState, useEffect } from 'react';
import { clickTick } from './fx';

export interface Prefs {
  arcade: boolean;
  sound: boolean;
  target: number;
}

const STORAGE_PREFS_KEY = 'hanzi_quest_prefs';

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    arcade: localStorage.getItem('omnilife_arcade_mode') === 'true',
    sound: localStorage.getItem('omnilife_sound_enabled') !== 'false',
    target: parseInt(localStorage.getItem('omnilife_session_target') || '10', 10),
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
    localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(currentPrefs));
    localStorage.setItem('omnilife_arcade_mode', String(currentPrefs.arcade));
    localStorage.setItem('omnilife_sound_enabled', String(currentPrefs.sound));
    localStorage.setItem('omnilife_session_target', String(currentPrefs.target));
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

  const setTarget = (t: number) => {
    update({ target: t });
    clickTick(prefs.sound);
  };

  return {
    sound: prefs.sound,
    arcade: prefs.arcade,
    target: prefs.target,
    toggleSound,
    toggleArcade,
    setTarget,
    prefs,
    set: update,
  };
}
