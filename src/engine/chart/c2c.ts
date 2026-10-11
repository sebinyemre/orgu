/**
 * C2C (köşeden köşeye) tığ tarifi: renkli grafik çapraz sıralar hâlinde okunur.
 *
 * Her kare bir "karo"dur (3 zincir + 3 trabzan). Sağ elle örende iş sağ alt köşeden başlar
 * (solak modunda sol alt). k = i + j (i: başlangıç kenarından sütun, j: alttan sıra) aynı çaprazdır.
 * Çapraz d'deki karo sayısı: min(d, W, H, W+H-d).
 *  - Alt uçta: k < W iken artır, sonra eksilt.   - Yan uçta: k < H iken artır, sonra eksilt.
 * Tek sıralar alt kenardan yukarı, çift sıralar yukarıdan aşağı örülür.
 */
import type { Lang } from '@/types';

export type C2CPhase = 'inc' | 'mid' | 'dec';
export type C2CEdge = 'inc' | 'dec';

export interface C2CRun {
  color: number;
  count: number;
}

export interface C2CTile {
  /** grafik koordinatı (y=0 üst satır) */
  x: number;
  y: number;
  color: number;
}

export interface C2CRow {
  /** 1 tabanlı çapraz sıra */
  row: number;
  tiles: C2CTile[];
  /** 'up': alt kenardan yukarı, 'down': yukarıdan alt kenara */
  dir: 'up' | 'down';
  runs: C2CRun[];
  start: C2CEdge;
  end: C2CEdge;
  phase: C2CPhase;
}

export interface C2COptions {
  leftHanded?: boolean;
}

/** Çapraz d'deki karo sayısı (1 tabanlı) */
export const c2cTilesIn = (d: number, w: number, h: number) => Math.max(0, Math.min(d, w, h, w + h - d));

export function c2cRows(width: number, height: number, colors: ArrayLike<number>, o: C2COptions = {}): C2CRow[] {
  const rows: C2CRow[] = [];
  const total = width + height - 1;
  for (let d = 1; d <= total; d++) {
    const k = d - 1;
    const jMin = Math.max(0, k - width + 1);
    const jMax = Math.min(k, height - 1);
    const tiles: C2CTile[] = [];
    for (let j = jMin; j <= jMax; j++) {
      const i = k - j;
      const x = o.leftHanded ? i : width - 1 - i;
      const y = height - 1 - j;
      tiles.push({ x, y, color: Math.max(0, colors[y * width + x] ?? 0) });
    }
    const up = d % 2 === 1;
    if (!up) tiles.reverse();
    const bottom: C2CEdge = k < width ? 'inc' : 'dec';
    const side: C2CEdge = k < height ? 'inc' : 'dec';
    const start = up ? bottom : side;
    const end = up ? side : bottom;
    const phase: C2CPhase = start === 'inc' && end === 'inc' ? 'inc' : start === 'dec' && end === 'dec' ? 'dec' : 'mid';
    const runs: C2CRun[] = [];
    for (const t of tiles) {
      const last = runs[runs.length - 1];
      if (last && last.color === t.color) last.count++;
      else runs.push({ color: t.color, count: 1 });
    }
    rows.push({ row: d, tiles, dir: up ? 'up' : 'down', runs, start, end, phase });
  }
  return rows;
}

interface C2CWords {
  row: (n: number) => string;
  tiles: (n: number) => string;
  run: (letter: string, n: number) => string;
  edge: (start: C2CEdge, end: C2CEdge) => string;
  intro: string;
  dirUp: string;
  dirDown: string;
}

/** Yön okları: sağ el için çaprazlar ↗/↙, solak için ↖/↘ */
export function c2cArrow(dir: 'up' | 'down', leftHanded = false): string {
  if (leftHanded) return dir === 'up' ? '↖' : '↘';
  return dir === 'up' ? '↗' : '↙';
}

const CW: Record<Lang, C2CWords> = {
  tr: {
    row: (n) => `${n}. sıra`,
    tiles: (n) => `${n} kare`,
    run: (L, n) => `${L} ile ${n}`,
    edge: (s, e) => `Başta ${s === 'inc' ? 'artır' : 'eksilt'}, sonda ${e === 'inc' ? 'artır' : 'eksilt'}.`,
    intro: 'Her kare bir karodur: 3 zincir ve 3 {dc}. Artırırken sıraya 6 zincirle yeni karo açarak başla; eksiltirken son karonun üstünden kör ilmekle geç ya da son karoyu örmeden dön.',
    dirUp: 'alttan yukarı',
    dirDown: 'yukarıdan aşağı',
  },
  en: {
    row: (n) => `Row ${n}`,
    tiles: (n) => `${n} tile${n === 1 ? '' : 's'}`,
    run: (L, n) => `${n} ${L}`,
    edge: (s, e) => `${s === 'inc' ? 'Increase' : 'Decrease'} at start, ${e === 'inc' ? 'increase' : 'decrease'} at end.`,
    intro: 'Each square is one tile: ch 3 and 3 {dc}. To increase, start the row with ch 6 and a new tile; to decrease, slip stitch across the last tile or turn before the last tile.',
    dirUp: 'bottom to top',
    dirDown: 'top to bottom',
  },
  es: {
    row: (n) => `Vuelta ${n}`,
    tiles: (n) => `${n} cuadro${n === 1 ? '' : 's'}`,
    run: (L, n) => `${n} con ${L}`,
    edge: (s, e) => `${s === 'inc' ? 'Aumentar' : 'Disminuir'} al inicio, ${e === 'inc' ? 'aumentar' : 'disminuir'} al final.`,
    intro: 'Cada cuadro es una baldosa: 3 cadenetas y 3 {dc}. Para aumentar, empieza la vuelta con 6 cadenetas y una baldosa nueva; para disminuir, pasa con puntos raso sobre la última baldosa o gira antes de ella.',
    dirUp: 'de abajo arriba',
    dirDown: 'de arriba abajo',
  },
  pt: {
    row: (n) => `Carreira ${n}`,
    tiles: (n) => `${n} quadradinho${n === 1 ? '' : 's'}`,
    run: (L, n) => `${n} com ${L}`,
    edge: (s, e) => `${s === 'inc' ? 'Aumentar' : 'Diminuir'} no início, ${e === 'inc' ? 'aumentar' : 'diminuir'} no final.`,
    intro: 'Cada quadradinho é um bloco: 3 correntinhas e 3 {dc}. Para aumentar, comece a carreira com 6 correntinhas e um bloco novo; para diminuir, passe com pontos baixíssimos sobre o último bloco ou vire antes dele.',
    dirUp: 'de baixo para cima',
    dirDown: 'de cima para baixo',
  },
};

/** C2C girişi ({dc} yer tutuculu; fillTerms ile doldurulur) */
export const c2cIntro = (lang: Lang) => CW[lang].intro;

/** Bir C2C sırasının metni */
export function c2cRowText(r: C2CRow, lang: Lang, letter: (c: number) => string, leftHanded = false): { label: string; text: string } {
  const w = CW[lang];
  const runs = r.runs.map((x) => w.run(letter(x.color), x.count)).join(', ');
  const label = `${w.row(r.row)} (${c2cArrow(r.dir, leftHanded)} ${r.dir === 'up' ? w.dirUp : w.dirDown}, ${w.tiles(r.tiles.length)})`;
  const edge = r.row === 1 ? '' : ` ${w.edge(r.start, r.end)}`;
  return { label, text: `${runs}.${edge}` };
}
