/** Türkçe sayı/biçim yardımcıları */

const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });

/** 1234.5 → "1.234,5" (en fazla `digits` ondalık) */
export function fmt(n: number, digits: 0 | 1 | 2 = 1): string {
  if (!Number.isFinite(n)) return '–';
  return (digits === 0 ? nf0 : digits === 1 ? nf1 : nf2).format(n);
}

/** cm cinsinden uzunluğu birime göre yazar */
export function fmtLength(cm: number, units: 'cm' | 'in' = 'cm', digits: 0 | 1 | 2 = 1): string {
  return units === 'in' ? `${fmt(cm / 2.54, digits)} inç` : `${fmt(cm, digits)} cm`;
}

/** metre → "320 m" */
export function fmtMeters(m: number): string {
  return `${fmt(Math.round(m), 0)} m`;
}

/** 3 → "3." (Türkçe sıra sayısı) */
export function ordinal(n: number): string {
  return `${n}.`;
}

/** Saniye → "2 sa 15 dk" */
export function fmtDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h} sa ${m} dk`;
  if (m > 0) return `${m} dk`;
  return `${s} sn`;
}

const dtf = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const dtfShort = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' });

export function fmtDate(ts: number, short = false): string {
  return (short ? dtfShort : dtf).format(new Date(ts));
}

/** "az önce", "3 gün önce" */
export function timeAgo(ts: number, now = Date.now()): string {
  const d = Math.round((now - ts) / 1000);
  if (d < 45) return 'az önce';
  if (d < 3600) return `${Math.round(d / 60)} dk önce`;
  if (d < 86400) return `${Math.round(d / 3600)} sa önce`;
  if (d < 86400 * 30) return `${Math.round(d / 86400)} gün önce`;
  return fmtDate(ts);
}

/** Türkçe büyük harf (i → İ) */
export function upperTR(s: string): string {
  return s.toLocaleUpperCase('tr-TR');
}

/** Türkçe karakterleri sadeleştirip arama için normalize eder */
export function normalizeSearch(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Harf dizisi: 0 → A, 1 → B, … 25 → Z, 26 → AA */
export function letterFor(i: number): string {
  let s = '';
  let n = i;
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}
