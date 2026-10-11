/** Tarif hazırlayıcı taslağı (son seçimler hatırlanır) */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FiberId, YarnWeightId } from '@/types';
import type { TemplateId } from '@/engine/patterns';
import { DEFAULTS, type Opts } from './presets';

export type RecipeToolKind = 'sis-duz' | 'sis-misinali' | 'tig';

export interface CustomYarn {
  weight: YarnWeightId;
  fiber: FiberId | '';
  metersPerSkein: number;
  gramsPerSkein: number;
  colors: string[];
}

export interface RecipeDraft {
  toolKind: RecipeToolKind;
  toolMm: number;
  yarnMode: 'stash' | 'custom';
  yarnIds: string[];
  custom: CustomYarn;
  template: TemplateId;
  opts: Record<TemplateId, Opts>;
  gaugeMode: 'typical' | 'mine';
  mine: { stitches: number; rows: number; overW: number; overH: number };
}

interface DraftState extends RecipeDraft {
  patch: (p: Partial<RecipeDraft>) => void;
  patchOpts: (t: TemplateId, o: Opts) => void;
  patchCustom: (c: Partial<CustomYarn>) => void;
}

export const DEFAULT_DRAFT: RecipeDraft = {
  toolKind: 'sis-duz',
  toolMm: 4.5,
  yarnMode: 'custom',
  yarnIds: [],
  custom: { weight: 4, fiber: '', metersPerSkein: 200, gramsPerSkein: 100, colors: ['#b5523b'] },
  template: 'atki',
  opts: DEFAULTS,
  gaugeMode: 'typical',
  mine: { stitches: 18, rows: 25, overW: 10, overH: 10 },
};

export const useRecipeDraft = create<DraftState>()(
  persist(
    (set) => ({
      ...DEFAULT_DRAFT,
      patch: (p) => set(p),
      patchOpts: (t, o) => set((s) => ({ opts: { ...s.opts, [t]: { ...s.opts[t], ...o } } })),
      patchCustom: (c) => set((s) => ({ custom: { ...s.custom, ...c } })),
    }),
    {
      name: 'ilmek.tarif',
      version: 1,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<RecipeDraft>;
        const opts = Object.fromEntries(Object.keys(DEFAULTS).map((k) => [k, { ...DEFAULTS[k as TemplateId], ...(p.opts?.[k as TemplateId] ?? {}) }])) as Record<TemplateId, Opts>;
        return { ...current, ...p, opts, custom: { ...DEFAULT_DRAFT.custom, ...(p.custom ?? {}) }, mine: { ...DEFAULT_DRAFT.mine, ...(p.mine ?? {}) } };
      },
    },
  ),
);
