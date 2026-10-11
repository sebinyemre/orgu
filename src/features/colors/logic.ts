/**
 * Renk stüdyosunun saf hesapları: şerit dizileri, sıcaklık battaniyesi, büyükanne karesi dizilimi,
 * renk kontrastı. React'e bağımlı değildir; logic.test.ts ile test edilir.
 */
import type { Gauge } from '@/types';
import { contrastRatio, grayValue } from '@/lib/color';
import { cmPerStitch, type StitchKind } from '@/engine/math/yarn';

/* ── Tohumlu rastgele sayı ─────────────────────────────── */

/** Aynı tohumla hep aynı diziyi veren küçük PRNG (mulberry32) */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Kontrast ──────────────────────────────────────────── */

export type ContrastRating = 'strong' | 'ok' | 'weak';

/**
 * Renkli örgüde iki rengin değer (açık/koyu) farkı.
 * Örgücüler bunu siyah beyaz fotoğrafla kontrol eder: gri tonlar birbirine yakınsa desen kaybolur.
 */
export function contrastRating(a: string, b: string): ContrastRating {
  const ratio = contrastRatio(a, b);
  if (ratio >= 3) return 'strong';
  if (ratio >= 1.7) return 'ok';
  return 'weak';
}

export function valueGap(a: string, b: string): number {
  return Math.abs(grayValue(a) - grayValue(b));
}

/** Paletteki tüm renk çiftleri, en zayıftan en güçlüye */
export function contrastPairs(colors: string[]): { a: number; b: number; ratio: number; rating: ContrastRating }[] {
  const out: { a: number; b: number; ratio: number; rating: ContrastRating }[] = [];
  for (let i = 0; i < colors.length; i++)
    for (let j = i + 1; j < colors.length; j++)
      out.push({
        a: i,
        b: j,
        ratio: contrastRatio(colors[i], colors[j]),
        rating: contrastRating(colors[i], colors[j]),
      });
  return out.sort((x, y) => x.ratio - y.ratio);
}

/* ── Şerit üretici ─────────────────────────────────────── */

export type StripeMode = 'random' | 'fibonacci' | 'gradient' | 'custom';

export interface StripeSettings {
  colors: string[];
  mode: StripeMode;
  /** bir şerit biriminin sıra sayısı */
  unitRows: number;
  totalRows: number;
  seed: number;
  /** özel dizi: "4A 2B 1C" */
  custom: string;
}

/** "4A 2B 1C" ya da "A4, B2" → [{rows, color}] (harf A = 0. renk) */
export function parseSequence(text: string, colorCount: number): { rows: number; color: number }[] {
  const out: { rows: number; color: number }[] = [];
  const re = /(\d+)\s*[x×*]?\s*([A-Za-z])|([A-Za-z])\s*[x×*]?\s*(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const rows = Number(m[1] ?? m[4]);
    const letter = (m[2] ?? m[3]).toUpperCase();
    const color = letter.charCodeAt(0) - 65;
    if (rows > 0 && rows <= 500 && color >= 0 && color < colorCount) out.push({ rows, color });
  }
  return out;
}

/** Fibonacci şerit yükseklikleri: 1 1 2 3 5 8 sonra geri 5 3 2 1 */
export const FIB_HEIGHTS = [1, 1, 2, 3, 5, 8, 5, 3, 2, 1];

/** 1 boyutlu sıralı titreme eşikleri (geçişli şeritlerde karışım) */
const DITHER = [0.125, 0.625, 0.375, 0.875, 0.25, 0.75, 0.5, 0.0625];

/**
 * Her sıranın renk indeksini verir (dizi[0] = 1. sıra, en alttaki).
 */
export function stripeRows(s: StripeSettings): number[] {
  const n = Math.max(1, s.colors.length);
  const total = Math.max(1, Math.min(2000, Math.round(s.totalRows)));
  const unit = Math.max(1, Math.round(s.unitRows));
  const rows: number[] = [];
  const push = (color: number, count: number) => {
    for (let i = 0; i < count && rows.length < total; i++) rows.push(color);
  };
  if (s.mode === 'random') {
    const r = rng(s.seed);
    let prev = -1;
    while (rows.length < total) {
      let c = Math.floor(r() * n);
      if (n > 1 && c === prev) c = (c + 1 + Math.floor(r() * (n - 1))) % n;
      push(c, unit * (1 + Math.floor(r() * 4)));
      prev = c;
    }
  } else if (s.mode === 'fibonacci') {
    let i = 0;
    while (rows.length < total) {
      push(i % n, unit * FIB_HEIGHTS[i % FIB_HEIGHTS.length]);
      i++;
    }
  } else if (s.mode === 'gradient') {
    if (n === 1) push(0, total);
    else {
      const blocks = Math.ceil(total / unit);
      for (let b = 0; b < blocks; b++) {
        const x = blocks === 1 ? 0 : (b / (blocks - 1)) * (n - 1);
        const k = Math.min(n - 2, Math.floor(x));
        const f = x - k;
        // her rengin ortasında düz bölge, aralarda karışım
        const p = f < 0.25 ? 0 : f > 0.75 ? 1 : (f - 0.25) / 0.5;
        push(p > DITHER[b % DITHER.length] ? k + 1 : k, unit);
      }
    }
  } else {
    const seq = parseSequence(s.custom, n);
    if (!seq.length) push(0, total);
    else {
      let i = 0;
      while (rows.length < total) {
        push(seq[i % seq.length].color, seq[i % seq.length].rows);
        i++;
      }
    }
  }
  return rows;
}

export interface Run {
  /** 1 tabanlı ilk ve son sıra */
  from: number;
  to: number;
  color: number;
}

/** Ardışık aynı renkli sıraları gruplar */
export function runsOf(rows: number[]): Run[] {
  const out: Run[] = [];
  rows.forEach((c, i) => {
    const last = out[out.length - 1];
    if (last && last.color === c) last.to = i + 1;
    else out.push({ from: i + 1, to: i + 1, color: c });
  });
  return out;
}

export function countBy(values: number[], n: number): number[] {
  const out = new Array(n).fill(0);
  for (const v of values) if (v >= 0 && v < n) out[v]++;
  return out;
}

/* ── Sıcaklık battaniyesi ──────────────────────────────── */

export type TempSource = 'max' | 'mean';

export interface DayTemp {
  max?: number;
  mean?: number;
}

/** Varsayılan aralık sınırları (°C): ≤ −5, −5…0, … , > 35 */
export const DEFAULT_LIMITS = [-5, 0, 5, 10, 15, 20, 25, 30, 35];
export const DEFAULT_TEMP_COLORS = ['#1b2a4a', '#46698a', '#87ceeb', '#9fd8cb', '#5f7a61', '#8a9a5b', '#f2c84b', '#d39a2c', '#e97c6a', '#8e1b2a'];

/** Sıcaklığın düştüğü aralık: sınırdan küçük ya da eşitse o aralık */
export function rangeIndex(t: number, limits: number[]): number {
  let i = 0;
  while (i < limits.length && t > limits[i]) i++;
  return i;
}

export const cToF = (c: number) => (c * 9) / 5 + 32;
export const fToC = (f: number) => ((f - 32) * 5) / 9;

export const pad2 = (n: number) => String(n).padStart(2, '0');
export const dateKey = (y: number, m: number, d: number) => `${y}-${pad2(m)}-${pad2(d)}`;

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Dönemin günleri (YYYY-MM-DD); month verilmezse bütün yıl */
export function daysOf(year: number, month?: number): string[] {
  const months = month ? [month] : Array.from({ length: 12 }, (_, i) => i + 1);
  const out: string[] = [];
  for (const m of months) for (let d = 1; d <= daysInMonth(year, m); d++) out.push(dateKey(year, m, d));
  return out;
}

/** Haftanın günü, pazartesi = 0 */
export function weekdayMon(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

/** Arşiv verisi birkaç gün geriden gelir: en son hangi gün istenebilir */
export function archiveLastDay(today: Date, lagDays = 5): string {
  const t = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - lagDays));
  return dateKey(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

export function geocodeUrl(name: string, lang: string): string {
  return `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name.trim())}&count=5&language=${lang}&format=json`;
}

export function archiveUrl(lat: number, lon: number, start: string, end: string): string {
  return `https://archive-api.open-meteo.com/v1/archive?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_mean&timezone=auto`;
}

export interface GeoPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export function parseGeocode(json: unknown): GeoPlace[] {
  const results = (json as { results?: unknown[] })?.results;
  if (!Array.isArray(results)) return [];
  return results
    .map((r) => r as Partial<GeoPlace>)
    .filter((r) => typeof r.latitude === 'number' && typeof r.longitude === 'number' && typeof r.name === 'string')
    .map((r) => ({
      id: Number(r.id ?? 0),
      name: r.name!,
      latitude: r.latitude!,
      longitude: r.longitude!,
      country: r.country,
      admin1: r.admin1,
    }));
}

/** Open-Meteo arşiv yanıtı → gün gün sıcaklık */
export function parseArchive(json: unknown): Record<string, DayTemp> {
  const d = (
    json as {
      daily?: {
        time?: string[];
        temperature_2m_max?: (number | null)[];
        temperature_2m_mean?: (number | null)[];
      };
    }
  )?.daily;
  const out: Record<string, DayTemp> = {};
  if (!d?.time) return out;
  d.time.forEach((day, i) => {
    const max = d.temperature_2m_max?.[i];
    const mean = d.temperature_2m_mean?.[i];
    const v: DayTemp = {};
    if (typeof max === 'number') v.max = max;
    if (typeof mean === 'number') v.mean = mean;
    if (v.max !== undefined || v.mean !== undefined) out[day] = v;
  });
  return out;
}

/**
 * Yapıştırılmış listeyi sayılara çevirir. Boşluk, satır ve noktalı virgül ayırır;
 * tek virgüllü sayı ondalıktır ("13,5"), "12.5,13" ya da "12,13,14" virgülden bölünür.
 */
export function parseTempList(text: string): number[] {
  const out: number[] = [];
  for (const tok of text.split(/[\s;]+/)) {
    if (!tok) continue;
    const commas = tok.match(/,/g)?.length ?? 0;
    const parts = tok.includes('.') || commas > 1 ? tok.split(',') : [tok];
    for (const p of parts) {
      const n = Number(p.replace(',', '.'));
      if (p !== '' && Number.isFinite(n)) out.push(n);
    }
  }
  return out;
}

/** Sıcaklıklardan sıra (renk indeksi) listesi; değeri olmayan gün -1 */
export function blanketRows(days: string[], data: Record<string, DayTemp>, source: TempSource, limits: number[]): number[] {
  return days.map((k) => {
    const v = data[k]?.[source];
    return typeof v === 'number' ? rangeIndex(v, limits) : -1;
  });
}

/** Bir sıra için gereken metre (genişlik + ölçü örneği), fire payı dahil */
export function metersPerRow(widthCm: number, g: Gauge, kind: StitchKind, waste = 0.1): number {
  if (!(widthCm > 0) || !(g.stitches > 0)) return 0;
  const sts = (widthCm * g.stitches) / 10;
  return ((sts * cmPerStitch(g, kind)) / 100) * (1 + waste);
}

/* ── Büyükanne karesi ──────────────────────────────────── */

export interface GrannySquare {
  /** merkezden dışa tur renkleri (renk indeksleri) */
  rounds: number[];
  locked: boolean;
}

function neighbors(i: number, cols: number, rows: number): number[] {
  const x = i % cols;
  const y = Math.floor(i / cols);
  const out: number[] = [];
  if (x > 0) out.push(i - 1);
  if (x < cols - 1) out.push(i + 1);
  if (y > 0) out.push(i - cols);
  if (y < rows - 1) out.push(i + cols);
  return out;
}

/** Bir karenin çevresiyle çatışması: dış tur aynıysa ağır ceza, aynı merkez ya da aynı karışım hafif ceza */
function conflict(sq: number[], i: number, grid: (number[] | null)[], cols: number, rows: number): number {
  let score = 0;
  for (const j of neighbors(i, cols, rows)) {
    const o = grid[j];
    if (!o) continue;
    if (o[o.length - 1] === sq[sq.length - 1]) score += 100;
    if (o[0] === sq[0]) score += 3;
    if (o.join() === sq.join()) score += 10;
  }
  return score;
}

/** Bir kare için rastgele tur renkleri: art arda aynı renk yok, renk yetiyorsa hepsi farklı */
export function randomSquare(r: () => number, nColors: number, nRounds: number): number[] {
  const out: number[] = [];
  const pool = Array.from({ length: nColors }, (_, i) => i);
  for (let k = 0; k < nRounds; k++) {
    let options = nColors >= nRounds ? pool.filter((c) => !out.includes(c)) : pool.filter((c) => c !== out[k - 1]);
    if (!options.length) options = pool;
    out.push(options[Math.floor(r() * options.length)]);
  }
  return out;
}

/**
 * Battaniyeyi rastgele dizer. Kilitli kareler korunur.
 * Kenar komşusu iki karenin dış turu aynı renge gelmez (en az 2 renk varsa).
 */
export function arrangeGranny(cols: number, rows: number, nColors: number, nRounds: number, current: GrannySquare[], seed: number): GrannySquare[] {
  const r = rng(seed);
  const total = cols * rows;
  const grid: (number[] | null)[] = Array.from({ length: total }, (_, i) => (current[i]?.locked ? current[i].rounds.slice(0, nRounds) : null));
  const fixLen = (sq: number[]) => {
    const out = sq.slice(0, nRounds).map((c) => Math.min(nColors - 1, Math.max(0, c)));
    while (out.length < nRounds) out.push(randomSquare(r, nColors, 1)[0]);
    return out;
  };
  for (let i = 0; i < total; i++) if (grid[i]) grid[i] = fixLen(grid[i]!);
  for (let i = 0; i < total; i++) {
    if (grid[i]) continue;
    let best: number[] = randomSquare(r, nColors, nRounds);
    let bestScore = conflict(best, i, grid, cols, rows);
    for (let tries = 0; tries < 80 && bestScore > 0; tries++) {
      const cand = randomSquare(r, nColors, nRounds);
      const sc = conflict(cand, i, grid, cols, rows);
      if (sc < bestScore) {
        best = cand;
        bestScore = sc;
      }
    }
    grid[i] = best;
  }
  return grid.map((rounds, i) => ({
    rounds: rounds!,
    locked: !!current[i]?.locked,
  }));
}

/** Kenar komşusu olup dış turu aynı olan çift sayısı */
export function edgeClashes(squares: GrannySquare[], cols: number, rows: number): number {
  let n = 0;
  for (let i = 0; i < squares.length; i++)
    for (const j of neighbors(i, cols, rows)) {
      if (j < i) continue;
      const a = squares[i].rounds;
      const b = squares[j]?.rounds;
      if (b && a[a.length - 1] === b[b.length - 1]) n++;
    }
  return n;
}

/** Aynı tur dizilimine sahip kareleri sayar */
export function comboCounts(squares: GrannySquare[]): { rounds: number[]; count: number }[] {
  const m = new Map<string, { rounds: number[]; count: number }>();
  for (const s of squares) {
    const k = s.rounds.join('-');
    const e = m.get(k);
    if (e) e.count++;
    else m.set(k, { rounds: s.rounds, count: 1 });
  }
  return [...m.values()].sort((a, b) => b.count - a.count);
}

/** Klasik büyükanne karesinde k. turda 12·k trabzan (her köşede 2, her kenar aralığında 1 üçlü küme) */
export const grannyDcInRound = (k: number) => 12 * k;

/**
 * Renk başına ip (metre): her turdaki trabzan sayısı × bir trabzanın ip tüketimi.
 * Zincirler, birleştirme ve uç gizleme için %20 pay eklenir.
 */
export function grannyMetersByColor(squares: GrannySquare[], nColors: number, g: Gauge, extra = 0.2): number[] {
  const perDc = cmPerStitch(g, 'dc') / 100;
  const out = new Array(nColors).fill(0);
  for (const s of squares) s.rounds.forEach((c, k) => (out[c] += grannyDcInRound(k + 1) * perDc * (1 + extra)));
  return out;
}

/** Kare kenarı (cm) yaklaşık: her tur iki yandan birer trabzan yüksekliği ekler */
export function grannySideCm(nRounds: number, g: Gauge): number {
  return g.rows > 0 ? 2 * nRounds * (10 / g.rows) : 0;
}
