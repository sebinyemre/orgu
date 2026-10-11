/**
 * Yuvarlak örgü matematiği: eşit artırma/eksiltme turlarının ilmek dizileri ve metinleri.
 *
 * Bir tur, "simge" dizisidir:
 *   'p' : düz ilmek (1 ilmek tüketir, 1 üretir)
 *   'i' : artırma (1 tüketir, 2 üretir)
 *   'd' : eksiltme (2 tüketir, 1 üretir)
 * Her tur `n` eşit dilimden oluşur (amigurumi 6, yarım trabzan daire 8, trabzan daire 12, şiş bere tepesi 8).
 */
import type { Lang } from '@/types';
import type { PatternBuilder } from './builder';
import { lk } from './builder';
import { WORDS } from './common';
import type { CrochetStitch } from './types';

export type Tok = 'p' | 'i' | 'd';

export const consumed = (t: Tok[]) => t.reduce((n, x) => n + (x === 'd' ? 2 : 1), 0);
export const produced = (t: Tok[]) => t.reduce((n, x) => n + (x === 'i' ? 2 : 1), 0);

/**
 * Artırma turu: `sections` dilim, her dilimde `m` düz + 1 artırma.
 * Kaydırmalı (staggered) ise ilk dilimin düzleri ikiye bölünür: a düz, artırma, … , b düz.
 */
export function incTokens(sections: number, m: number, staggered: boolean): Tok[] {
  const out: Tok[] = [];
  if (staggered && m >= 2) {
    const a = Math.floor(m / 2);
    const b = m - a;
    for (let i = 0; i < a; i++) out.push('p');
    out.push('i');
    for (let s = 0; s < sections - 1; s++) {
      for (let i = 0; i < m; i++) out.push('p');
      out.push('i');
    }
    for (let i = 0; i < b; i++) out.push('p');
    return out;
  }
  for (let s = 0; s < sections; s++) {
    for (let i = 0; i < m; i++) out.push('p');
    out.push('i');
  }
  return out;
}

/** Eksiltme turu: her dilimde m düz + 1 eksiltme (kaydırmalıda ilk dilim bölünür) */
export function decTokens(sections: number, m: number, staggered: boolean): Tok[] {
  return incTokens(sections, m, staggered).map((t) => (t === 'i' ? 'd' : t));
}

/** Simge dizisinden şema için artırma/eksiltme konumları (üretilen ilmek sırasına göre) */
export function shapedPositions(t: Tok[]): { inc: number[]; dec: number[] } {
  const inc: number[] = [];
  const dec: number[] = [];
  let k = 0;
  for (const x of t) {
    if (x === 'i') {
      inc.push(k, k + 1);
      k += 2;
    } else if (x === 'd') {
      dec.push(k);
      k += 1;
    } else k += 1;
  }
  return { inc, dec };
}

/* ── Tığ metinleri ───────────────────────────────────────── */
interface StitchWords {
  plain: (m: number) => string;
  inc: string;
  dec: string;
  allInc: string;
  allDec: (n: number) => string;
  each: string;
  rep: (body: string, n: number) => string;
}

function words(lang: Lang, st: CrochetStitch, incLink: boolean, decLink: boolean): StitchWords {
  const W = WORDS[lang];
  const inc = (t: string) => (incLink ? lk('tig-artirma', t) : t);
  const dec = (t: string) => (decLink ? lk('tig-eksiltme', t) : t);
  switch (lang) {
    case 'tr':
      return {
        plain: (m) => `${m} {${st}}`,
        inc: st === 'sc' ? `1 ${inc('artırma')}` : `sonraki ilmeğe ${inc(`2 {${st}}`)}`,
        dec: `1 ${dec('eksiltme')}`,
        allInc: st === 'sc' ? `Her ilmeğe ${inc('artırma')} (aynı ilmeğe 2 {sc}).` : `Her ilmeğe ${inc(`2 {${st}}`)}.`,
        allDec: (n) => `${n} kez ${dec('eksiltme')} (2 ilmeği birlikte ör).`,
        each: `Her ilmeğe 1 {${st}}.`,
        rep: (b, n) => `*${b}* ${W.times(n)} tekrarla`,
      };
    case 'en':
      return {
        plain: (m) => `{${st}.a} in next ${m === 1 ? 'st' : `${m} sts`}`,
        inc: st === 'sc' ? inc('inc') : `${inc(`2 {${st}.a}`)} in next st`,
        dec: dec('dec'),
        allInc: st === 'sc' ? `${inc('Inc')} in each st around.` : `Work ${inc(`2 {${st}.a}`)} in each st around.`,
        allDec: (n) => `${dec('Dec')} ${W.times(n)}.`,
        each: `Work 1 {${st}.a} in each st around.`,
        rep: (b, n) => `*${b}* ${W.times(n)}`,
      };
    case 'es':
      return {
        plain: (m) => `${m} {${st}.a}`,
        inc: st === 'sc' ? `1 ${inc('aum')}` : `${inc(`2 {${st}.a}`)} en el siguiente`,
        dec: `1 ${dec('dism')}`,
        allInc: st === 'sc' ? `1 ${inc('aum')} en cada punto.` : `${inc(`2 {${st}.a}`)} en cada punto.`,
        allDec: (n) => `${n} ${dec('dism')}.`,
        each: `1 {${st}.a} en cada punto.`,
        rep: (b, n) => `*${b}* ${W.times(n)}`,
      };
    case 'pt':
      return {
        plain: (m) => `${m} {${st}.a}`,
        inc: st === 'sc' ? `1 ${inc('aum')}` : `${inc(`2 {${st}.a}`)} no seguinte`,
        dec: `1 ${dec('dim')}`,
        allInc: st === 'sc' ? `1 ${inc('aum')} em cada ponto.` : `${inc(`2 {${st}.a}`)} em cada ponto.`,
        allDec: (n) => `${n} ${dec('dim')}.`,
        each: `1 {${st}.a} em cada ponto.`,
        rep: (b, n) => `*${b}* ${W.times(n)}`,
      };
  }
}

/** Artırma turu metni */
export function incText(lang: Lang, st: CrochetStitch, sections: number, m: number, staggered: boolean, link = false): string {
  const w = words(lang, st, link, false);
  if (m === 0) return w.allInc;
  if (staggered && m >= 2) {
    const a = Math.floor(m / 2);
    const b = m - a;
    return `${w.plain(a)}, ${w.inc}, ${w.rep(`${w.plain(m)}, ${w.inc}`, sections - 1)}, ${w.plain(b)}.`;
  }
  return `${w.rep(`${w.plain(m)}, ${w.inc}`, sections)}.`;
}

/** Eksiltme turu metni */
export function decText(lang: Lang, st: CrochetStitch, sections: number, m: number, staggered: boolean, link = false): string {
  const w = words(lang, st, false, link);
  if (m === 0) return w.allDec(sections);
  if (staggered && m >= 2) {
    const a = Math.floor(m / 2);
    const b = m - a;
    return `${w.plain(a)}, ${w.dec}, ${w.rep(`${w.plain(m)}, ${w.dec}`, sections - 1)}, ${w.plain(b)}.`;
  }
  return `${w.rep(`${w.plain(m)}, ${w.dec}`, sections)}.`;
}

export function plainText(lang: Lang, st: CrochetStitch): string {
  return words(lang, st, false, false).each;
}

/* ── Tur/sıra satırlarını gruplama ───────────────────────── */
export interface Line {
  n: number;
  text: string;
  count: number;
  color?: string;
  note?: string;
}

/**
 * Art arda aynı metin + renk + ilmek sayısındaki satırları "8.–14. tur" gibi tek adımda toplar.
 */
export function emitGrouped(b: PatternBuilder, lines: Line[], label: (a: number, z: number) => string): void {
  let i = 0;
  while (i < lines.length) {
    let j = i;
    while (j + 1 < lines.length && lines[j + 1].text === lines[i].text && lines[j + 1].color === lines[i].color && lines[j + 1].count === lines[i].count && !lines[j + 1].note) j++;
    const first = lines[i];
    const n = j - i + 1;
    b.step(label(first.n, lines[j].n), first.text, { count: first.count, color: first.color, repeat: n > 1 ? n : undefined, note: first.note });
    i = j + 1;
  }
}
