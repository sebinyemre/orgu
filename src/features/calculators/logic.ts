/**
 * Hesaplayıcıların saf hesapları (React'e bağımlı değil, testli).
 * Ortak motor işlevleri (castOnFor, distribute, metersForArea …) src/engine/math altındadır;
 * burada yalnızca o işlevleri birleştiren ve birim çeviren yardımcılar bulunur.
 */
import type { Gauge, Units } from '@/types';
import type { CrochetBasic } from '@/knowledge/terms';
import type { NeedleSize } from '@/knowledge/tools';
import { castOnFor, convertCount, normalizeGauge, sizeDeviation, type CastOnResult } from '@/engine/math/gauge';
import { metersForArea, type StitchKind } from '@/engine/math/yarn';
import { normalizeSearch } from '@/lib/format';

export const CM_PER_IN = 2.54;
export const M_PER_YD = 0.9144;

/* ── Birimler ──────────────────────────────────────────── */

/** cm → kullanıcının biriminde sayı (giriş kutuları için yuvarlanır: inçte 2, cm'de 4 basamak) */
export function toUnit(cm: number, units: Units): number {
  if (units === 'in') return Math.round((cm / CM_PER_IN) * 100) / 100;
  return Math.round(cm * 10000) / 10000;
}

/** kullanıcının biriminde sayı → cm */
export function fromUnit(v: number, units: Units): number {
  return units === 'in' ? v * CM_PER_IN : v;
}

/** Birime göre "güzel" varsayılan: cm'de 20, inçte 8 gibi */
export function niceDefault(cm: number, inches: number, units: Units): number {
  return units === 'in' ? inches * CM_PER_IN : cm;
}

/** Ölçü örneğinin ölçüldüğü standart açıklık: 10 cm ya da 4 inç */
export function gaugeSpanCm(units: Units): number {
  return units === 'in' ? 4 * CM_PER_IN : 10;
}

export const metersToYards = (m: number) => m / M_PER_YD;
export const yardsToMeters = (yd: number) => yd * M_PER_YD;

/* ── Ölçü örneği ───────────────────────────────────────── */

/** "X ilmek, Y cm'de" → 10 cm'deki ilmek */
export function perTenCm(count: number, overCm: number): number {
  if (!(count > 0) || !(overCm > 0)) return NaN;
  return (count * 10) / overCm;
}

/** 10 cm'deki ilmekten seçilen açıklıktaki ilmeğe (ör. 4 inç) */
export function perSpan(perTen: number, spanCm: number): number {
  return (perTen * spanCm) / 10;
}

/**
 * Desen ilmeği için kullanılacak ölçü:
 * ölçü örneği jarse ile (ya da etiketten) alındıysa desenin genişlik oranıyla düzeltilir.
 * Lastik büzdüğü için (widthFactor < 1) 10 cm'ye daha çok ilmek sığar.
 */
export function patternPerTen(perTen: number, widthFactor: number, measuredIn: 'pattern' | 'stockinette'): number {
  if (measuredIn === 'pattern' || !(widthFactor > 0)) return perTen;
  return perTen / widthFactor;
}

export interface CastOnInput {
  widthCm: number;
  perTen: number;
  multiple: number;
  plus: number;
  /** toplam kenar ilmeği (iki kenar) */
  edge: number;
}

export function castOn(i: CastOnInput): CastOnResult | null {
  if (!(i.widthCm > 0) || !(i.perTen > 0)) return null;
  return castOnFor(i.widthCm, i.perTen, i.multiple, i.plus, i.edge);
}

/* ── Tığ: temel zincir ─────────────────────────────────── */

export interface FoundationInfo {
  chain: number;
  /** ilk ilmek tığdan itibaren kaçıncı zincire örülür */
  intoChain: number;
  /** atlanan zincirler ilk ilmek yerine sayılır mı */
  skippedCount: boolean;
}

/**
 * İstenen ilmek sayısı için temel zincir.
 * Sık iğne: N + 1 (2. zincire), yarım trabzan: N + 2 (3. zincire),
 * trabzan: N + 2 (4. zincire; atlanan 3 zincir ilk ilmek sayılır), 2 ip atmalı: N + 3.
 */
export function foundationChain(stitches: number, b: Pick<CrochetBasic, 'turningCh' | 'turningCounts' | 'firstInChainFromHook'>): FoundationInfo {
  const n = Math.max(1, Math.round(stitches));
  if (b.turningCounts)
    return {
      chain: n - 1 + b.turningCh,
      intoChain: b.firstInChainFromHook,
      skippedCount: true,
    };
  return {
    chain: n + b.firstInChainFromHook - 1,
    intoChain: b.firstInChainFromHook,
    skippedCount: false,
  };
}

/* ── WPI ───────────────────────────────────────────────── */

/** Sarım sayısı ve sarılan uzunluk (cm) → 1 inçteki (2,54 cm) sarım */
export function wpiFrom(wraps: number, lengthCm: number): number {
  if (!(wraps > 0) || !(lengthCm > 0)) return NaN;
  return (wraps * CM_PER_IN) / lengthCm;
}

/* ── Tığ: düz daire ────────────────────────────────────── */

export type CircleRoundKind = 'ring' | 'incAll' | 'repeat';

export interface CircleRound {
  /** 1 tabanlı tur numarası */
  n: number;
  kind: CircleRoundKind;
  /** tur sonunda ilmek sayısı */
  stitches: number;
  /** tekrarda artırmalar arasındaki düz ilmek */
  plain: number;
  /** tekrar sayısı (= başlangıç ilmeği) */
  times: number;
  /** kaydırmalı artırmada tur başındaki düz ilmek (0 = kaydırma yok) */
  offset: number;
  /** bu tur bitince yaklaşık çap (cm) */
  diameterCm: number;
}

export interface CirclePlan {
  rounds: CircleRound[];
  roundHeightCm: number;
  finalDiameterCm: number;
}

/**
 * Düz tığ dairesi: her turda başlangıç sayısı kadar artırma yapılır (sık iğne 6, yarım trabzan 8, trabzan 12).
 * Her tur yarıçapa yaklaşık bir sıra yüksekliği ekler, bu yüzden çap ≈ 2 × tur × sıra yüksekliği.
 * @param stagger tek turlarda artırmaları kaydır (altıgen değil daha yuvarlak daire)
 */
export function circlePlan(diameterCm: number, start: number, rowsPerTen: number, stagger = false): CirclePlan | null {
  if (!(diameterCm > 0) || !(rowsPerTen > 0) || !(start > 0)) return null;
  const h = 10 / rowsPerTen;
  const count = Math.min(200, Math.max(1, Math.round(diameterCm / (2 * h))));
  const rounds: CircleRound[] = [];
  for (let k = 1; k <= count; k++) {
    const base = {
      n: k,
      stitches: start * k,
      times: start,
      diameterCm: 2 * k * h,
    };
    if (k === 1) rounds.push({ ...base, kind: 'ring', plain: 0, offset: 0 });
    else if (k === 2) rounds.push({ ...base, kind: 'incAll', plain: 0, offset: 0 });
    else {
      const plain = k - 2;
      const offset = stagger && k % 2 === 0 && plain >= 2 ? Math.floor(plain / 2) : 0;
      rounds.push({ ...base, kind: 'repeat', plain, offset });
    }
  }
  return { rounds, roundHeightCm: h, finalDiameterCm: 2 * count * h };
}

/** Bir turun gerçekten doğru sayıda ilmek tükettiğini/ürettiğini doğrular (testler için) */
export function checkRound(r: CircleRound, start: number): { consumes: number; produces: number } {
  if (r.kind === 'ring') return { consumes: 0, produces: start };
  if (r.kind === 'incAll') return { consumes: start, produces: start * 2 };
  if (r.offset > 0) {
    // offset düz, 1 artırma, *(plain düz, 1 artırma)* (times-1), (plain-offset) düz
    const consumes = r.offset + 1 + (r.times - 1) * (r.plain + 1) + (r.plain - r.offset);
    const produces = r.offset + 2 + (r.times - 1) * (r.plain + 2) + (r.plain - r.offset);
    return { consumes, produces };
  }
  return {
    consumes: r.times * (r.plain + 1),
    produces: r.times * (r.plain + 2),
  };
}

/* ── İp miktarı ────────────────────────────────────────── */

export type ShapeKind = 'rect' | 'tube' | 'circle';

/** Şekle göre alan (cm²): dikdörtgen en×boy, tüp çevre×boy, daire π·r² */
export function areaOf(shape: ShapeKind, a: number, b = 0): number {
  if (shape === 'circle') return Math.PI * (a / 2) ** 2;
  return a * b;
}

/** Alan + ölçü örneği + ilmek türü + desen çarpanı → metre (fire payı dahil) */
export function metersForCm2(areaCm2: number, g: Gauge, kind: StitchKind, factor = 1, waste = 0.1): number {
  if (!(areaCm2 > 0) || !(g.stitches > 0) || !(g.rows > 0)) return 0;
  const side = Math.sqrt(areaCm2);
  return metersForArea(side, side, g, kind, factor, waste);
}

/** Örnek tartma yöntemi: gram ve alan → toplam gram (güvenlik payı ile) */
export function gramsFromSwatch(swatchGrams: number, swatchW: number, swatchH: number, areaCm2: number, safety = 0.1): number {
  if (!(swatchGrams > 0) || !(swatchW > 0) || !(swatchH > 0) || !(areaCm2 > 0)) return 0;
  return (swatchGrams / (swatchW * swatchH)) * areaCm2 * (1 + safety);
}

/* ── İp değiştirme ─────────────────────────────────────── */

export interface SubstituteResult {
  /** kesirli yumak */
  exact: number;
  /** alınacak yumak */
  buy: number;
  /** artan metre */
  leftover: number;
  /** artan ip ihtiyacın %10'undan az: bir yumak fazla alınmalı */
  tight: boolean;
}

export function substitution(neededMeters: number, mySkeinMeters: number): SubstituteResult | null {
  if (!(neededMeters > 0) || !(mySkeinMeters > 0)) return null;
  const exact = neededMeters / mySkeinMeters;
  const buy = Math.ceil(exact - 1e-9);
  const leftover = buy * mySkeinMeters - neededMeters;
  return { exact, buy, leftover, tight: leftover < neededMeters * 0.1 };
}

/* ── Ölçü örneği karşılaştırma ─────────────────────────── */

export interface GaugeCompare {
  /** + ise parça daha geniş çıkar */
  widthPct: number;
  heightPct: number;
  /** 'up' : şiş/tığ numarasını büyüt, 'down': küçült, 'ok': yakın */
  advice: 'up' | 'down' | 'ok';
}

export function compareGauge(pattern: Gauge, mine: Gauge): GaugeCompare | null {
  if (!(pattern.stitches > 0) || !(mine.stitches > 0)) return null;
  const widthPct = sizeDeviation(pattern.stitches, mine.stitches);
  const heightPct = pattern.rows > 0 && mine.rows > 0 ? sizeDeviation(pattern.rows, mine.rows) : NaN;
  // 10 cm'de yarım ilmekten az fark: tamam
  const diff = mine.stitches - pattern.stitches;
  const advice = Math.abs(diff) < 0.5 ? 'ok' : diff > 0 ? 'up' : 'down';
  return { widthPct, heightPct, advice };
}

/** Desendeki sayıyı kendi ölçüne çevir (tam sayıya yuvarlar) */
export function convertPatternCount(count: number, patternPerTen: number, myPerTen: number): number {
  if (!(count > 0) || !(patternPerTen > 0) || !(myPerTen > 0)) return NaN;
  return Math.round(convertCount(count, patternPerTen, myPerTen));
}

/** Herhangi bir boyutta ölçülmüş örneği 10 cm'ye çevir */
export function normalizeSwatch(stitches: number, widthCm: number, rows: number, heightCm: number): Gauge | null {
  if (!(stitches > 0) || !(widthCm > 0)) return null;
  const g = normalizeGauge(stitches, widthCm, rows > 0 ? rows : 0, heightCm > 0 ? heightCm : 1);
  return {
    stitches: g.stitches,
    rows: rows > 0 && heightCm > 0 ? g.rows : NaN,
  };
}

/* ── Şiş/tığ tablosu araması ───────────────────────────── */

/** Tığ tablosundaki "14 (çelik)" gibi US değerlerini sadeleştirir */
export function cleanUs(us: string | undefined): {
  us: string;
  steel: boolean;
} {
  if (!us) return { us: '', steel: false };
  const steel = /\(.*\)/.test(us);
  return { us: us.replace(/\s*\(.*\)\s*/, '').trim(), steel };
}

/** Arama sorgusu bir ölçü satırına uyuyor mu? ("4", "4,5 mm", "us 8", "g-6", "uk 7") */
export function matchSize(s: NeedleSize, query: string): boolean {
  let q = normalizeSearch(query).replace(',', '.').replace(/\s+/g, ' ').trim();
  if (!q) return false;
  let scope: 'all' | 'mm' | 'us' | 'uk' = 'all';
  if (/^us\b/.test(q)) {
    scope = 'us';
    q = q.slice(2).trim();
  } else if (/^uk\b/.test(q)) {
    scope = 'uk';
    q = q.slice(2).trim();
  } else if (/mm$/.test(q)) {
    scope = 'mm';
    q = q.replace(/\s*mm$/, '').trim();
  }
  if (!q) return false;
  const us = cleanUs(s.us).us.toLowerCase();
  const uk = (s.uk ?? '').toLowerCase();
  const num = Number(q);
  const isNum = /^\d+(\.\d+)?$/.test(q) && Number.isFinite(num);
  const mmHit = isNum && Math.abs(s.mm - num) < 1e-6;
  // US harfli numaralar: "G-6", "K-10½", "M/N-13"
  const usParts = us.split(/[-/ ]/).filter(Boolean);
  const usHit = !!us && (us === q || usParts.includes(q) || us.replace('½', '.5') === q);
  const ukHit = !!uk && uk === q;
  if (scope === 'mm') return mmHit;
  if (scope === 'us') return usHit;
  if (scope === 'uk') return ukHit;
  return mmHit || usHit || ukHit;
}
