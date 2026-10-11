import type { LucideIcon } from 'lucide-react';
import { BookA, Calculator, FolderHeart, GraduationCap, Grid3x3, Layers, NotebookPen, Palette, Scissors, ShoppingBasket, SquareStack, Tally5, Wrench } from 'lucide-react';
import type { COMMON } from '@/i18n/common';

type MsgKey = { [K in keyof (typeof COMMON)['tr']]: (typeof COMMON)['tr'][K] extends string ? K : never }[keyof (typeof COMMON)['tr']];

export type World = 'learn' | 'create';

export interface NavItem {
  to: string;
  label: MsgKey;
  /** alt menüde kısa ad */
  short?: MsgKey;
  desc?: MsgKey;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavGroup {
  title?: MsgKey;
  items: NavItem[];
}

export const LEARN_NAV: NavGroup[] = [
  { items: [{ to: '/', label: 'navLessons', desc: 'descLessons', icon: GraduationCap, end: true }] },
  {
    title: 'groupLibrary',
    items: [
      { to: '/desenler', label: 'navPatterns', short: 'navPatternsShort', desc: 'descPatterns', icon: SquareStack },
      { to: '/sozluk', label: 'navGlossary', desc: 'descGlossary', icon: BookA },
    ],
  },
];

export const CREATE_NAV: NavGroup[] = [
  {
    items: [
      { to: '/yarat', label: 'navWorks', desc: 'descWorks', icon: Scissors, end: true },
      { to: '/projeler', label: 'navProjects', short: 'navProjectsShort', desc: 'descProjects', icon: FolderHeart },
    ],
  },
  {
    title: 'groupTools',
    items: [
      { to: '/kareli', label: 'navChart', short: 'navChartShort', desc: 'descChart', icon: Grid3x3 },
      { to: '/tarif', label: 'navRecipe', desc: 'descRecipe', icon: NotebookPen },
      { to: '/sayaclar', label: 'navCounters', desc: 'descCounters', icon: Tally5 },
      { to: '/hesap', label: 'navCalculators', desc: 'descCalculators', icon: Calculator },
      { to: '/renk', label: 'navColors', desc: 'descColors', icon: Palette },
      { to: '/sepet', label: 'navStash', desc: 'descStash', icon: ShoppingBasket },
    ],
  },
];

export const TOOLS_ITEM: NavItem = { to: '/araclar', label: 'navTools', icon: Wrench };
export const LAYERS_ICON = Layers;

/** Telefonda alt menü (dünyaya göre) */
export const BOTTOM_NAV: Record<World, string[]> = {
  learn: ['/', '/desenler', '/sozluk'],
  create: ['/yarat', '/projeler', '/kareli', '/araclar'],
};

const LEARN_PREFIXES = ['/ders', '/desenler', '/sozluk'];
const NEUTRAL = ['/ayarlar'];

/** Rota hangi dünyaya ait? Nötr sayfalarda null. */
export function worldOf(pathname: string): World | null {
  if (NEUTRAL.some((p) => pathname.startsWith(p))) return null;
  if (pathname === '/' || pathname === '/pro' || LEARN_PREFIXES.some((p) => pathname.startsWith(p))) return 'learn';
  return 'create';
}

export const ALL_ITEMS: NavItem[] = [...LEARN_NAV, ...CREATE_NAV].flatMap((g) => g.items).concat(TOOLS_ITEM);
