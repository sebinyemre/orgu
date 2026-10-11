/** Renk yardımcıları (hex ↔ rgb/hsl, parlaklık, kontrast, uyum) */
import type { Lang } from '@/types';
import { YARN_SWATCHES } from '@/knowledge/swatches';

export interface RGB {
  r: number;
  g: number;
  b: number;
}
export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return { r: 0, g: 0, b: 0 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const c = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rr = r / 255,
    gg = g / 255,
    bb = b / 255;
  const max = Math.max(rr, gg, bb),
    min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hh = (((h % 360) + 360) % 360) / 360;
  if (s === 0) return { r: l * 255, g: l * 255, b: l * 255 };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const t = (x: number) => {
    let v = x;
    if (v < 0) v += 1;
    if (v > 1) v -= 1;
    if (v < 1 / 6) return p + (q - p) * 6 * v;
    if (v < 1 / 2) return q;
    if (v < 2 / 3) return p + (q - p) * (2 / 3 - v) * 6;
    return p;
  };
  return { r: t(hh + 1 / 3) * 255, g: t(hh) * 255, b: t(hh - 1 / 3) * 255 };
}

export const hexToHsl = (hex: string) => rgbToHsl(hexToRgb(hex));
export const hslToHex = (hsl: HSL) => rgbToHex(hslToRgb(hsl));

/** WCAG göreli parlaklık (0–1) */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a),
    lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Bu zemin üstüne yazı için siyah mı beyaz mı? */
export function inkOn(hex: string): '#1f1a16' | '#ffffff' {
  return luminance(hex) > 0.42 ? '#1f1a16' : '#ffffff';
}

/** Algısal gri değer (0–255) — renkli örgüde "değer kontrastı" testi için */
export function grayValue(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

export function toGrayHex(hex: string): string {
  const v = grayValue(hex);
  return rgbToHex({ r: v, g: v, b: v });
}

/** İki rengi t oranında karıştırır */
export function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a),
    B = hexToRgb(b);
  return rgbToHex({ r: A.r + (B.r - A.r) * t, g: A.g + (B.g - A.g) * t, b: A.b + (B.b - A.b) * t });
}

export function shade(hex: string, amount: number): string {
  return amount >= 0 ? mix(hex, '#ffffff', amount) : mix(hex, '#000000', -amount);
}

/** Basit renk uzaklığı (redmean yaklaşımı) */
export function colorDistance(a: string, b: string): number {
  const A = hexToRgb(a),
    B = hexToRgb(b);
  const rm = (A.r + B.r) / 2;
  const dr = A.r - B.r,
    dg = A.g - B.g,
    db = A.b - B.b;
  return Math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db);
}

/** En yakın hazır ip renginin adı (geçerli dilde) */
export function nameColor(hex: string, lang: Lang): string {
  let best = YARN_SWATCHES[0];
  let bd = Infinity;
  for (const n of YARN_SWATCHES) {
    const d = colorDistance(hex, n.hex);
    if (d < bd) {
      bd = d;
      best = n;
    }
  }
  return best.name[lang];
}

/** Uyumlu renk önerileri */
export function harmonies(hex: string): Record<'tamamlayici' | 'komsu' | 'uclu' | 'bolunmus' | 'tonlar', string[]> {
  const base = hexToHsl(hex);
  const rot = (d: number) => hslToHex({ ...base, h: base.h + d });
  return {
    tamamlayici: [hex, rot(180)],
    komsu: [rot(-30), hex, rot(30)],
    uclu: [hex, rot(120), rot(240)],
    bolunmus: [hex, rot(150), rot(210)],
    tonlar: [0.35, 0.18, 0, -0.18, -0.35].map((a) => shade(hex, a)),
  };
}
