/** İp miktarı tahminleri */
import type { Craft, Gauge } from '@/types';

/** 1 ilmeğin ip tüketimi / ilmek eni oranı (ampirik) */
const PER_WIDTH: Record<string, number> = {
  knit: 5.9,
  sc: 6.9,
  hdc: 9.0,
  dc: 11.6,
  tr: 14.6,
};

export type StitchKind = 'knit' | 'sc' | 'hdc' | 'dc' | 'tr';

/** Desene göre çarpan (aynı ölçüde düz jarseye göre) */
export const PATTERN_YARN_FACTOR: Record<string, number> = {
  jarse: 1,
  haraso: 1.05,
  lastik: 1.05,
  pirinc: 1.08,
  sepet: 1.08,
  'yalanci-selanik': 1.15,
  selanik: 1.75,
  burgu: 1.25,
  ajur: 0.9,
  sc: 1,
  hdc: 1,
  dc: 1,
  granny: 1,
  fistik: 1.35,
  pitircik: 1.5,
};

/** Bir ilmeğin cm cinsinden ip tüketimi */
export function cmPerStitch(g: Gauge, kind: StitchKind): number {
  const width = 10 / g.stitches;
  return width * PER_WIDTH[kind];
}

/**
 * Dikdörtgen bir alan için metre.
 * @param waste fire/kuyruk payı (varsayılan %10)
 */
export function metersForArea(widthCm: number, heightCm: number, g: Gauge, kind: StitchKind, factor = 1, waste = 0.1): number {
  const sts = (widthCm * g.stitches) / 10;
  const rows = (heightCm * g.rows) / 10;
  return ((sts * rows * cmPerStitch(g, kind) * factor) / 100) * (1 + waste);
}

/** Toplam ilmek sayısından metre */
export function metersForStitches(totalStitches: number, g: Gauge, kind: StitchKind, factor = 1, waste = 0.1): number {
  return ((totalStitches * cmPerStitch(g, kind) * factor) / 100) * (1 + waste);
}

export function skeinsFor(meters: number, metersPerSkein: number): number {
  if (metersPerSkein <= 0) return 0;
  return Math.ceil((meters / metersPerSkein) * 10) / 10;
}

/** Örnek tartma yöntemi: ölçü örneği gramından toplam gram */
export function gramsBySwatch(swatchGrams: number, swatchWcm: number, swatchHcm: number, areaCm2: number): number {
  return (swatchGrams / (swatchWcm * swatchHcm)) * areaCm2;
}

/** Yaklaşık ip türü varsayılanı */
export function defaultStitchKind(craft: Craft): StitchKind {
  return craft === 'knit' ? 'knit' : 'sc';
}

/** Desendeki ip yerine başka ip: kaç yumak? */
export function substitute(patternMeters: number, mySkeinMeters: number): { skeins: number; meters: number } {
  return { meters: patternMeters, skeins: Math.ceil(patternMeters / mySkeinMeters) };
}
