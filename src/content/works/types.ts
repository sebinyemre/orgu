/**
 * Eserler galerisi veri tipleri. Her eser, sabit ve özenle seçilmiş parametrelerle bir tarif üreticisini
 * (ya da elle yazılmış özel bir üreticiyi) çağırır; metin her zaman geçerli dilde üretilir.
 */
import type { Craft, FiberId, GeneratedPattern, ToolKind, YarnWeightId } from '@/types';
import type { L10n } from '@/i18n';
import type { PatternParams } from '@/engine/patterns';

export type WorkCategory = 'accessories' | 'home' | 'baby' | 'toys';

export type IllustrationKey = 'scarf' | 'beanie' | 'cowl' | 'blanket' | 'ball' | 'coasters' | 'granny' | 'dishcloth' | 'booties' | 'bag' | 'headband';

export interface WorkSize {
  id: string;
  label: L10n;
  params: Partial<PatternParams>;
}

export interface WorkDef {
  id: string;
  craft: Craft;
  category: WorkCategory;
  /** 1 kolay · 2 orta · 3 deneyimli */
  difficulty: 1 | 2 | 3;
  /** tahmini süre (saat) */
  hours: [number, number];
  title: L10n;
  blurb: L10n;
  yarnWeight: YarnWeightId;
  fibers: FiberId[];
  toolMm: number;
  toolKind: ToolKind;
  /** renk yuvalarının adları (Ana renk, Kenar…) */
  colorSlots: L10n[];
  defaultColors: string[];
  sizes: WorkSize[];
  defaultSize: string;
  illustration: IllustrationKey;
  /** çizim varyantı (doku, ponpon…) */
  variant?: string;
  /** önce bilinmesi gerekenler (ders kimlikleri) */
  lessons: string[];
  /** arama için ek kelimeler */
  keywords?: L10n;
  build: (p: PatternParams) => GeneratedPattern;
}
