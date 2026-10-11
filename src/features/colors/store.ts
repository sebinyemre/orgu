/** Renk stüdyosunun kalıcı durumu (yerel depo anahtarı: ilmek.renk) */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Craft, YarnWeightId } from '@/types';
import { uid } from '@/lib/id';
import { DEFAULT_LIMITS, DEFAULT_TEMP_COLORS, type DayTemp, type GrannySquare, type StripeSettings, type TempSource } from './logic';

export type HarmonyId = 'tamamlayici' | 'komsu' | 'uclu' | 'bolunmus' | 'tonlar';

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
}

export interface PaletteDraft {
  base: string;
  harmony: HarmonyId;
  /** düzenlenmiş renkler (uyumdan gelir, tek tek değiştirilebilir) */
  colors: string[];
}

export interface TempPlace {
  name: string;
  label: string;
  lat: number;
  lon: number;
}

export interface TempPlan {
  unit: 'C' | 'F';
  source: TempSource;
  period: 'year' | 'month';
  year: number;
  month: number;
  /** °C cinsinden aralık sınırları (artan) */
  limits: number[];
  colors: string[];
  place?: TempPlace;
  days: Record<string, DayTemp>;
  rowsPerDay: number;
  widthCm: number;
  craft: Craft;
  weight: YarnWeightId;
  skeinM: number;
}

export interface GrannyPlan {
  cols: number;
  rows: number;
  rounds: number;
  colors: string[];
  squares: GrannySquare[];
  seed: number;
  weight: YarnWeightId;
  skeinM: number;
}

const now = new Date();

export const DEFAULT_STRIPE: StripeSettings = {
  colors: ['#46698a', '#f5f0e6', '#d39a2c', '#b5523b'],
  mode: 'random',
  unitRows: 2,
  totalRows: 80,
  seed: 1,
  custom: '6A 2B 4C 2B',
};

export const DEFAULT_TEMP: TempPlan = {
  unit: 'C',
  source: 'max',
  period: 'year',
  year: now.getFullYear() - 1,
  month: 1,
  limits: DEFAULT_LIMITS,
  colors: DEFAULT_TEMP_COLORS,
  days: {},
  rowsPerDay: 2,
  widthCm: 120,
  craft: 'knit',
  weight: 4,
  skeinM: 200,
};

export const DEFAULT_GRANNY: GrannyPlan = {
  cols: 6,
  rows: 8,
  rounds: 3,
  colors: ['#f5f0e6', '#d39a2c', '#5f7a61', '#b5523b', '#46698a', '#f4a7b9'],
  squares: [],
  seed: 1,
  weight: 4,
  skeinM: 200,
};

interface ColorState {
  palettes: SavedPalette[];
  draft: PaletteDraft;
  stripe: StripeSettings;
  temp: TempPlan;
  granny: GrannyPlan;
  setDraft: (p: Partial<PaletteDraft>) => void;
  savePalette: (name: string, colors: string[]) => SavedPalette;
  removePalette: (id: string) => void;
  setStripe: (p: Partial<StripeSettings>) => void;
  setTemp: (p: Partial<TempPlan>) => void;
  setDays: (days: Record<string, DayTemp>, replace?: boolean) => void;
  setGranny: (p: Partial<GrannyPlan>) => void;
}

export const useColorStudio = create<ColorState>()(
  persist(
    (set) => ({
      palettes: [],
      draft: { base: '#b5523b', harmony: 'tamamlayici', colors: [] },
      stripe: DEFAULT_STRIPE,
      temp: DEFAULT_TEMP,
      granny: DEFAULT_GRANNY,
      setDraft: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
      savePalette: (name, colors) => {
        const pal: SavedPalette = {
          id: uid('palet'),
          name,
          colors,
          createdAt: Date.now(),
        };
        set((s) => ({ palettes: [pal, ...s.palettes] }));
        return pal;
      },
      removePalette: (id) => set((s) => ({ palettes: s.palettes.filter((p) => p.id !== id) })),
      setStripe: (p) => set((s) => ({ stripe: { ...s.stripe, ...p } })),
      setTemp: (p) => set((s) => ({ temp: { ...s.temp, ...p } })),
      setDays: (days, replace) =>
        set((s) => ({
          temp: {
            ...s.temp,
            days: replace ? days : { ...s.temp.days, ...days },
          },
        })),
      setGranny: (p) => set((s) => ({ granny: { ...s.granny, ...p } })),
    }),
    { name: 'ilmek.renk', version: 1 },
  ),
);
