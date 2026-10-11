/** İp sepeti ve alet çantası için saf yardımcılar. */
import type { FiberId, Tool, ToolKind, Yarn, YarnWeightId } from '@/types';
import { HOOK_SIZES, NEEDLE_SIZES, type NeedleSize } from '@/knowledge/tools';
import { yarnMetersLeft } from '@/store/stash';
import { normalizeSearch } from '@/lib/format';
import { colorFamily, type ColorFamily } from './colorFamily';

export const TOOL_KINDS: ToolKind[] = ['sis-duz', 'sis-misinali', 'sis-corap', 'sis-degistirilebilir', 'tig', 'tunus-tigi'];

export const isHookKind = (k: ToolKind) => k === 'tig' || k === 'tunus-tigi';

export function sizesFor(kind: ToolKind): NeedleSize[] {
  return isHookKind(kind) ? HOOK_SIZES : NEEDLE_SIZES;
}

/** "(çelik)" gibi Türkçe veri notlarını geçerli dildeki kelimeyle değiştirir */
export function localizeUs(us: string | undefined, steel: string): string | undefined {
  return us?.replace('(çelik)', `(${steel})`);
}

/** Aletin numara karşılıkları (US/UK) */
export function toolSizeInfo(t: Pick<Tool, 'kind' | 'sizeMm'>, steel = 'steel'): { mm: number; us?: string; uk?: string } {
  const e = sizesFor(t.kind).find((s) => Math.abs(s.mm - t.sizeMm) < 0.001);
  return { mm: t.sizeMm, us: localizeUs(e?.us, steel), uk: e?.uk };
}

/** Şiş ölçerde gösterilen yaygın numaralar (mm) */
export const GAUGE_SIZES = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8, 9, 10];

/** Sahip olunan numaralar: şiş ve tığ ayrı */
export function ownedSizes(tools: Tool[]): { needles: Map<number, number>; hooks: Map<number, number> } {
  const needles = new Map<number, number>();
  const hooks = new Map<number, number>();
  for (const t of tools) {
    const m = isHookKind(t.kind) ? hooks : needles;
    m.set(t.sizeMm, (m.get(t.sizeMm) ?? 0) + t.count);
  }
  return { needles, hooks };
}

export interface StashTotals {
  meters: number;
  skeins: number;
  /** metreye göre büyükten küçüğe */
  byWeight: { weight: YarnWeightId; meters: number; count: number }[];
}

export function stashTotals(yarns: Yarn[]): StashTotals {
  const map = new Map<YarnWeightId, { meters: number; count: number }>();
  let meters = 0;
  let skeins = 0;
  for (const y of yarns) {
    const m = yarnMetersLeft(y);
    meters += m;
    skeins += y.skeins;
    const e = map.get(y.weight) ?? { meters: 0, count: 0 };
    e.meters += m;
    e.count += 1;
    map.set(y.weight, e);
  }
  const byWeight = [...map.entries()].map(([weight, v]) => ({ weight, ...v })).sort((a, b) => b.meters - a.meters || a.weight - b.weight);
  return { meters, skeins, byWeight };
}

export interface YarnFilter {
  q: string;
  weight: YarnWeightId | 'all';
  fiber: FiberId | 'all';
  family: ColorFamily | 'all';
}

export const EMPTY_FILTER: YarnFilter = { q: '', weight: 'all', fiber: 'all', family: 'all' };

export function filterYarns(yarns: Yarn[], f: YarnFilter, fiberNames: (id: FiberId) => string): Yarn[] {
  const q = normalizeSearch(f.q.trim());
  return yarns.filter((y) => {
    if (f.weight !== 'all' && y.weight !== f.weight) return false;
    if (f.fiber !== 'all' && !y.fibers.includes(f.fiber)) return false;
    if (f.family !== 'all' && colorFamily(y.colorHex) !== f.family) return false;
    if (q) {
      const hay = normalizeSearch([y.brand, y.name, y.colorName, y.dyeLot ?? '', ...y.fibers.map(fiberNames)].join(' '));
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/** 100 gramdaki metre (kalınlık tahmini için) */
export function metersPer100g(metersPerSkein: number, gramsPerSkein: number): number | null {
  if (!(metersPerSkein > 0) || !(gramsPerSkein > 0)) return null;
  return (metersPerSkein / gramsPerSkein) * 100;
}
