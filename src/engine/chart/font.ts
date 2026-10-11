/**
 * Yazı damgası için küçük piksel yazı tipi (7 kare yüksekliğinde).
 * A–Z, Türkçe harfler (Ç Ğ İ Ö Ş Ü), İspanyolca/Portekizce aksanlı büyük harfler, 0–9 ve birkaç işaret.
 * Aksanlı harflerde gövde 5 kareye sıkıştırılır, işaret üstteki (ya da alttaki) 2 kareye yazılır.
 */
import type { Lang } from '@/types';

export const FONT_HEIGHT = 7;

type Glyph = string[];

const BASE: Record<string, Glyph> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  J: ['..###', '...#.', '...#.', '...#.', '#..#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  ' ': ['...', '...', '...', '...', '...', '...', '...'],
  '.': ['.', '.', '.', '.', '.', '.', '#'],
  ',': ['..', '..', '..', '..', '..', '.#', '#.'],
  ':': ['.', '.', '#', '.', '#', '.', '.'],
  '!': ['#', '#', '#', '#', '#', '.', '#'],
  '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'],
  '-': ['....', '....', '....', '####', '....', '....', '....'],
  '+': ['.....', '.....', '..#..', '.###.', '..#..', '.....', '.....'],
  "'": ['#', '#', '.', '.', '.', '.', '.'],
  '&': ['.##..', '#..#.', '.##..', '.#...', '#.#.#', '#..#.', '.##.#'],
  '♥': ['.......', '.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
};

/** 7 satırlık gövdeyi 5 satıra sıkıştırır (aksan için yer açmak üzere) */
const squeeze = (g: Glyph, rows: number[] = [0, 2, 3, 5, 6]): Glyph => rows.map((r) => g[r]);

/** Aksan desenini glif genişliğine ortalar */
function mark(pattern: string, width: number): string {
  const pad = Math.max(0, width - pattern.length);
  const left = Math.floor(pad / 2);
  return ('.'.repeat(left) + pattern + '.'.repeat(pad - left)).slice(0, width);
}

const ABOVE: Record<string, [string, string]> = {
  umlaut: ['#.#', '...'],
  dot: ['#', '.'],
  breve: ['#...#', '.###.'],
  acute: ['.#', '#.'],
  grave: ['#.', '.#'],
  circ: ['.#.', '#.#'],
  tilde: ['.#.#', '#.#.'],
};

function withAbove(base: Glyph, kind: keyof typeof ABOVE, rows?: number[]): Glyph {
  const w = base[0].length;
  const [a, b] = ABOVE[kind];
  return [mark(a, w), mark(b, w), ...squeeze(base, rows)];
}

function withCedilla(base: Glyph, rows: number[]): Glyph {
  const w = base[0].length;
  return [...squeeze(base, rows), mark('#', w), mark('##.', w)];
}

const COMPOSED: Record<string, Glyph> = {
  Ç: withCedilla(BASE.C, [0, 1, 3, 5, 6]),
  Ş: withCedilla(BASE.S, [0, 2, 3, 4, 6]),
  Ğ: withAbove(BASE.G, 'breve', [0, 2, 3, 5, 6]),
  İ: withAbove(BASE.I, 'dot'),
  Ö: withAbove(BASE.O, 'umlaut'),
  Ü: withAbove(BASE.U, 'umlaut'),
  Á: withAbove(BASE.A, 'acute', [0, 1, 3, 5, 6]),
  À: withAbove(BASE.A, 'grave', [0, 1, 3, 5, 6]),
  Â: withAbove(BASE.A, 'circ', [0, 1, 3, 5, 6]),
  Ã: withAbove(BASE.A, 'tilde', [0, 1, 3, 5, 6]),
  É: withAbove(BASE.E, 'acute'),
  Ê: withAbove(BASE.E, 'circ'),
  Í: withAbove(BASE.I, 'acute'),
  Ó: withAbove(BASE.O, 'acute'),
  Ô: withAbove(BASE.O, 'circ'),
  Õ: withAbove(BASE.O, 'tilde'),
  Ú: withAbove(BASE.U, 'acute'),
  Ñ: withAbove(BASE.N, 'tilde', [0, 2, 3, 4, 6]),
};

export const GLYPHS: Record<string, Glyph> = { ...BASE, ...COMPOSED };

const LOC: Record<Lang, string> = { tr: 'tr-TR', en: 'en-US', es: 'es-ES', pt: 'pt-BR' };

/** Yazılabilir karakterlere çevirir (dile göre büyük harf: Türkçede i → İ) */
export function normalizeText(text: string, lang: Lang = 'tr'): string {
  return [...text.toLocaleUpperCase(LOC[lang])].filter((ch) => GLYPHS[ch] || ch === '\n').join('');
}

export interface TextBitmap {
  width: number;
  height: number;
  /** satır öncelikli, true = dolu kare */
  cells: boolean[];
}

/**
 * Metni piksel bitmap'e çevirir. Harfler arası 1 kare, satırlar arası 2 kare boşluk.
 * "\n" yeni satır başlatır.
 */
export function textBitmap(text: string, lang: Lang = 'tr', gap = 1): TextBitmap {
  const lines = normalizeText(text, lang).split('\n');
  const lineWidths = lines.map((ln) => [...ln].reduce((w, ch, i) => w + GLYPHS[ch][0].length + (i > 0 ? gap : 0), 0));
  const width = Math.max(0, ...lineWidths);
  const lineGap = 2;
  const height = lines.length ? lines.length * FONT_HEIGHT + (lines.length - 1) * lineGap : 0;
  const cells = new Array(width * height).fill(false);
  lines.forEach((ln, li) => {
    let x = 0;
    const top = li * (FONT_HEIGHT + lineGap);
    [...ln].forEach((ch, i) => {
      if (i > 0) x += gap;
      const g = GLYPHS[ch];
      for (let r = 0; r < FONT_HEIGHT; r++) for (let c = 0; c < g[r].length; c++) if (g[r][c] === '#') cells[(top + r) * width + x + c] = true;
      x += g[0].length;
    });
  });
  return { width, height, cells };
}
