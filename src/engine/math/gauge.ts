/**
 * Ölçü örneği (gauge) hesapları.
 * Ölçü örneği 10 cm × 10 cm karedeki ilmek ve sıra sayısıdır.
 */
import type { Gauge } from '@/types';

export interface CastOnOption {
  stitches: number;
  widthCm: number;
  /** istenen genişlikten fark (cm) */
  diffCm: number;
}

export interface CastOnResult {
  /** kesirli tam değer */
  exact: number;
  lower: CastOnOption;
  upper: CastOnOption;
  /** en yakın seçenek */
  best: CastOnOption;
}

/** 10 cm'de `perTen` ilmek → `cm` genişlik için kesirli ilmek */
export const stitchesFor = (cm: number, perTen: number) => (cm * perTen) / 10;
export const cmFor = (stitches: number, perTen: number) => (stitches * 10) / perTen;

/**
 * İstenen genişlik için ilmek sayısı; desen katına uyarlanmış.
 * @param multiple desen tekrarı (ör. 2×2 lastik için 4)
 * @param plus     tekrar dışı ilmek (ör. "4'ün katı + 2" için 2)
 * @param edge     kenar ilmekleri toplamı (ör. her iki kenar 1'er → 2)
 */
export function castOnFor(widthCm: number, perTen: number, multiple = 1, plus = 0, edge = 0): CastOnResult {
  const exact = stitchesFor(widthCm, perTen);
  const base = plus + edge;
  const m = Math.max(1, Math.round(multiple));
  const min = Math.max(1, base + (multiple > 1 ? m : 0));
  let low = base + Math.floor((exact - base) / m) * m;
  if (low < min) low = min;
  const high = low >= exact - 1e-9 ? low : low + m;
  const lowOpt = mk(low, perTen, widthCm);
  const upOpt = mk(high, perTen, widthCm);
  const best = Math.abs(lowOpt.diffCm) <= Math.abs(upOpt.diffCm) ? lowOpt : upOpt;
  return { exact, lower: lowOpt, upper: upOpt, best };
}

function mk(stitches: number, perTen: number, widthCm: number): CastOnOption {
  const w = cmFor(stitches, perTen);
  return { stitches, widthCm: w, diffCm: w - widthCm };
}

/** Desen katına uyan, `target`'a en yakın sayı (yuvarlak örgü için) */
export function nearestMultiple(target: number, multiple: number, plus = 0, min = multiple + plus): number {
  const m = Math.max(1, multiple);
  const k = Math.round((target - plus) / m);
  return Math.max(min, k * m + plus);
}

/** İki sayının EKOK'u (ör. lastik katı 4 ve tepe dilimi 8 → 8) */
export function lcm(a: number, b: number): number {
  const g = (x: number, y: number): number => (y === 0 ? x : g(y, x % y));
  return Math.abs(a * b) / g(a, b);
}

/** Sıra sayısı → yükseklik ve tersi */
export const rowsFor = (cm: number, rowsPerTen: number) => Math.max(1, Math.round((cm * rowsPerTen) / 10));
export const heightFor = (rows: number, rowsPerTen: number) => (rows * 10) / rowsPerTen;

/**
 * Ölçü örneğini ölçtüğün boyuttan 10 cm'ye çevirir.
 * Ör. 12 cm'de 26 ilmek → 10 cm'de 21,7 ilmek.
 */
export function normalizeGauge(stitches: number, widthCm: number, rows: number, heightCm: number): Gauge {
  return { stitches: (stitches * 10) / widthCm, rows: (rows * 10) / heightCm };
}

/**
 * Desen ölçüsü ile kendi ölçün farklıysa: desendeki ilmek sayısını kendi ölçüne çevir.
 */
export function convertCount(patternCount: number, patternPerTen: number, myPerTen: number): number {
  return (patternCount * myPerTen) / patternPerTen;
}

/** Hücre en/boy oranı (oranlı kareli kağıt): genişlik / yükseklik */
export function cellAspect(g: Gauge): number {
  // bir ilmeğin eni = 10/st, boyu = 10/row → en/boy = row/st
  return g.rows / g.stitches;
}

/** Ölçü sapması: desen ölçüsüne göre yüzde kaç büyük/küçük çıkar */
export function sizeDeviation(patternPerTen: number, myPerTen: number): number {
  return (patternPerTen / myPerTen - 1) * 100;
}
