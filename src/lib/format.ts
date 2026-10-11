/** Dile duyarlı sayı/tarih/biçim yardımcıları. `lang` verilmezse geçerli dil kullanılır. */
import type { Lang } from '@/types';
import { useSettings } from '@/store/settings';

const LOC: Record<Lang, string> = { tr: 'tr-TR', en: 'en-US', es: 'es-ES', pt: 'pt-BR' };
const cur = (): Lang => useSettings.getState().lang;

const nfCache = new Map<string, Intl.NumberFormat>();
function nf(lang: Lang, digits: number): Intl.NumberFormat {
  const k = `${lang}:${digits}`;
  let f = nfCache.get(k);
  if (!f) {
    f = new Intl.NumberFormat(LOC[lang], { maximumFractionDigits: digits });
    nfCache.set(k, f);
  }
  return f;
}

/** 1234.5 → "1.234,5" (tr) / "1,234.5" (en) */
export function fmt(n: number, digits: 0 | 1 | 2 = 1, lang: Lang = cur()): string {
  if (!Number.isFinite(n)) return '–';
  return nf(lang, digits).format(n);
}

const INCH: Record<Lang, string> = { tr: 'inç', en: 'in', es: 'pulg', pt: 'pol' };

/** cm cinsinden uzunluğu birime göre yazar */
export function fmtLength(cm: number, units: 'cm' | 'in' = 'cm', digits: 0 | 1 | 2 = 1, lang: Lang = cur()): string {
  return units === 'in' ? `${fmt(cm / 2.54, digits, lang)} ${INCH[lang]}` : `${fmt(cm, digits, lang)} cm`;
}

/** metre → "320 m" */
export function fmtMeters(m: number, lang: Lang = cur()): string {
  return `${fmt(Math.round(m), 0, lang)} m`;
}

/** 3 → "3." (tr), "3rd" (en), "3.º" (es), "3º" (pt) */
export function ordinal(n: number, lang: Lang = cur()): string {
  if (lang === 'en') {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  if (lang === 'es') return `${n}.º`;
  if (lang === 'pt') return `${n}º`;
  return `${n}.`;
}

const DUR: Record<Lang, [string, string, string]> = {
  tr: ['sa', 'dk', 'sn'],
  en: ['h', 'min', 's'],
  es: ['h', 'min', 's'],
  pt: ['h', 'min', 's'],
};

/** Saniye → "2 sa 15 dk" */
export function fmtDuration(sec: number, lang: Lang = cur()): string {
  const [H, M, S] = DUR[lang];
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h} ${H} ${m} ${M}`;
  if (m > 0) return `${m} ${M}`;
  return `${s} ${S}`;
}

export function fmtDate(ts: number, short = false, lang: Lang = cur()): string {
  return new Intl.DateTimeFormat(LOC[lang], short ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ts));
}

/** "3 gün önce", "3 days ago" … */
export function timeAgo(ts: number, now = Date.now(), lang: Lang = cur()): string {
  const rtf = new Intl.RelativeTimeFormat(LOC[lang], { numeric: 'auto' });
  const d = Math.round((ts - now) / 1000);
  const a = Math.abs(d);
  if (a < 45) return rtf.format(0, 'second');
  if (a < 3600) return rtf.format(Math.round(d / 60), 'minute');
  if (a < 86400) return rtf.format(Math.round(d / 3600), 'hour');
  if (a < 86400 * 30) return rtf.format(Math.round(d / 86400), 'day');
  return fmtDate(ts, false, lang);
}

/** Dile göre büyük harf (Türkçe i → İ) */
export function upperTR(s: string, lang: Lang = cur()): string {
  return s.toLocaleUpperCase(LOC[lang]);
}

/** Arama için normalleştirme (Türkçe ve aksanlı harfleri sadeleştirir) */
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
