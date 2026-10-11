import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '@/types';

export const DEFAULT_SETTINGS: Settings = {
  trabzan: 'ipatma',
  units: 'cm',
  theme: 'auto',
  leftHanded: false,
  counterSound: true,
  counterVibrate: true,
  keepAwake: true,
  showEnglish: true,
  animSpeed: 1,
  onboarded: false,
};

interface SettingsState extends Settings {
  set: (patch: Partial<Settings>) => void;
  reset: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      set: (patch) => set(patch),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    { name: 'ilmek.ayarlar', version: 1 },
  ),
);

/** Temayı <html data-theme> özniteliğine uygular */
export function applyTheme(theme: Settings['theme']): void {
  const el = document.documentElement;
  if (theme === 'auto') el.removeAttribute('data-theme');
  else el.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  meta?.setAttribute('content', dark ? '#1c1916' : '#fbf6ee');
}
