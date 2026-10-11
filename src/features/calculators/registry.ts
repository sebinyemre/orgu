/** Hesaplayıcı kimlikleri, simgeleri, grupları ve ilgili dersleri */
import type { LucideIcon } from 'lucide-react';
import { ArrowLeftRight, CircleDot, Columns3, Grid2x2, PencilRuler, Replace, RulerDimensionLine, Scale, Shirt } from 'lucide-react';

export const CALC_IDS = ['ilmek-sayisi', 'esit-dagitim', 'olcu-ornegi', 'tig-daire', 'ip-miktari', 'ip-degistirme', 'ip-kalinligi', 'sis-tig-olcu', 'beden'] as const;
export type CalcId = (typeof CALC_IDS)[number];

export const CALC_ICON: Record<CalcId, LucideIcon> = {
  'ilmek-sayisi': RulerDimensionLine,
  'esit-dagitim': Columns3,
  'ip-miktari': Scale,
  'sis-tig-olcu': ArrowLeftRight,
  'ip-kalinligi': PencilRuler,
  beden: Shirt,
  'tig-daire': CircleDot,
  'ip-degistirme': Replace,
  'olcu-ornegi': Grid2x2,
};

export type CalcGroup = 'groupStitches' | 'groupYarn' | 'groupTables';

export const CALC_GROUPS: { title: CalcGroup; ids: CalcId[] }[] = [
  {
    title: 'groupStitches',
    ids: ['ilmek-sayisi', 'esit-dagitim', 'olcu-ornegi', 'tig-daire'],
  },
  { title: 'groupYarn', ids: ['ip-miktari', 'ip-degistirme', 'ip-kalinligi'] },
  { title: 'groupTables', ids: ['sis-tig-olcu', 'beden'] },
];

/** Kart rengi (ip renkleri) */
export const CALC_TONE: Record<CalcId, string> = {
  'ilmek-sayisi': 'var(--denim)',
  'esit-dagitim': 'var(--terracotta)',
  'olcu-ornegi': 'var(--sage)',
  'tig-daire': 'var(--plum)',
  'ip-miktari': 'var(--mustard)',
  'ip-degistirme': 'var(--rose)',
  'ip-kalinligi': 'var(--sage)',
  'sis-tig-olcu': 'var(--denim)',
  beden: 'var(--terracotta)',
};

export function isCalcId(s: string | undefined): s is CalcId {
  return !!s && (CALC_IDS as readonly string[]).includes(s);
}
