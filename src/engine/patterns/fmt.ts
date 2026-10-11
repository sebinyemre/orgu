/**
 * Motor içi sayı/uzunluk biçimleri (React ve depo bağımlılığı olmadan; lib/format ile aynı kurallar).
 */
import type { Lang, Units } from '@/types';
import { HOOK_SIZES, NEEDLE_SIZES } from '@/knowledge/tools';

const LOC: Record<Lang, string> = { tr: 'tr-TR', en: 'en-US', es: 'es-ES', pt: 'pt-BR' };
const cache = new Map<string, Intl.NumberFormat>();

/** 12.5 → "12,5" (tr) */
export function num(n: number, lang: Lang, digits = 1): string {
  if (!Number.isFinite(n)) return '–';
  const k = `${lang}:${digits}`;
  let f = cache.get(k);
  if (!f) {
    f = new Intl.NumberFormat(LOC[lang], { maximumFractionDigits: digits });
    cache.set(k, f);
  }
  return f.format(n);
}

const INCH: Record<Lang, string> = { tr: 'inç', en: 'in', es: 'pulg', pt: 'pol' };

/** cm → "20 cm" ya da "7,9 inç"; 20 cm ve üstü tam sayı */
export function len(cm: number, units: Units, lang: Lang): string {
  if (units === 'in') {
    const v = cm / 2.54;
    return `${num(v, lang, v >= 10 ? 0 : 1)} ${INCH[lang]}`;
  }
  return `${num(cm, lang, cm >= 20 ? 0 : 1)} cm`;
}

/** Ölçü örneği penceresi: "10 cm" ya da geleneksel "4 in" */
export function tenLabel(units: Units, lang: Lang): string {
  return units === 'in' ? `4 ${INCH[lang]}` : '10 cm';
}

/** "320 m" (İngilizce ve inç biriminde yarda da) */
export function meters(m: number, lang: Lang, units: Units = 'cm'): string {
  const r = Math.max(1, Math.round(m / 5) * 5);
  if (units === 'in' || lang === 'en') return `${num(r, lang, 0)} m (${num(Math.round((r * 1.0936) / 5) * 5, lang, 0)} yd)`;
  return `${num(r, lang, 0)} m`;
}

export function grams(g: number, lang: Lang): string {
  return `${num(Math.max(1, Math.round(g)), lang, 0)} g`;
}

/** "4,5 mm (US 7)" */
export function toolSize(mm: number, hook: boolean, lang: Lang): string {
  const list = hook ? HOOK_SIZES : NEEDLE_SIZES;
  const hit = list.find((s) => Math.abs(s.mm - mm) < 0.06);
  const mmTxt = `${num(mm, lang, 2)} mm`;
  if (!hit?.us || /\(/.test(hit.us)) return mmTxt;
  return `${mmTxt} (US ${hit.us})`;
}

/** Yuvarlama: en yakın tam sayı, en az `min` */
export const atLeast = (n: number, min: number) => Math.max(min, Math.round(n));

/** Çift sayıya yuvarla */
export const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);
