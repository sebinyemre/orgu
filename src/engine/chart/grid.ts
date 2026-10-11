/**
 * Kareli kağıt ızgara modeli: hücre işlemleri, çok hücreli semboller, araç geometrisi.
 *
 * Izgara satır öncelikli düz dizilerdir (y=0 EN ÜST satır). Çok hücreli semboller (burgular)
 * en soldaki hücrede sembol kimliğiyle, sağındaki hücrelerde CONT ('>') işaretiyle tutulur:
 *   ['', 'c4l', '>', '>', '>', 'p']  →  4 ilmeklik sola burgu 1..4. hücrelerde.
 * Silme, taşıma, çevirme işlemleri birimi bütün olarak ele alır; normalize() yarım kalan birimleri temizler.
 */
import type { ChartDoc, ChartRect } from '@/types';
import { SYMBOL_BY_ID } from '@/knowledge/symbols';

/** Çok hücreli sembolün devam hücresi */
export const CONT = '>';

export interface Grid {
  width: number;
  height: number;
  colors: number[];
  symbols: string[];
}

/** Kalem neyi boyar */
export type PaintMode = 'color' | 'symbol' | 'both';

export interface Brush {
  mode: PaintMode;
  /** palet indeksi (-1: boş) */
  color: number;
  /** sembol kimliği ('' : sembolsüz) */
  symbol: string;
}

export type Symmetry = 'none' | 'v' | 'h' | 'both';

export const idx = (w: number, x: number, y: number) => y * w + x;

/** Palet harfi: 0 → A, 25 → Z, 26 → AA */
export function paletteLetter(i: number): string {
  let s = '';
  let n = Math.max(0, i);
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}
export const inBounds = (g: { width: number; height: number }, x: number, y: number) => x >= 0 && y >= 0 && x < g.width && y < g.height;

/** Sembolün kapladığı hücre sayısı */
export function spanOf(id: string): number {
  if (!id || id === CONT) return 1;
  return Math.max(1, SYMBOL_BY_ID[id]?.span ?? 1);
}

export function cloneGrid(g: Grid): Grid {
  return { width: g.width, height: g.height, colors: g.colors.slice(), symbols: g.symbols.slice() };
}

export function blankGrid(width: number, height: number, color = -1): Grid {
  return { width, height, colors: new Array(width * height).fill(color), symbols: new Array(width * height).fill('') };
}

/** (x, y) hücresini kaplayan birimin en soldaki x'i */
export function unitStart(g: Grid, x: number, y: number): number {
  const row = y * g.width;
  let x0 = x;
  while (x0 > 0 && g.symbols[row + x0] === CONT) x0--;
  return x0;
}

/** (x, y) hücresini kaplayan birim: başlangıç, genişlik ve kimlik */
export function unitAt(g: Grid, x: number, y: number): { x: number; span: number; id: string } {
  const x0 = unitStart(g, x, y);
  const id = g.symbols[y * g.width + x0];
  if (id === CONT) return { x, span: 1, id: '' };
  return { x: x0, span: spanOf(id), id };
}

/** (x, y)'yi kaplayan birimin sembolünü temizler (renklere dokunmaz) */
export function clearUnitAt(g: Grid, x: number, y: number): void {
  const row = y * g.width;
  const s = g.symbols[row + x];
  if (!s) return;
  const u = unitAt(g, x, y);
  for (let i = 0; i < u.span && u.x + i < g.width; i++) {
    const k = row + u.x + i;
    if (i === 0 || g.symbols[k] === CONT) g.symbols[k] = '';
  }
  // birim başlangıcı bozuksa (yetim '>') tek hücreyi temizle
  if (g.symbols[row + x] === CONT) g.symbols[row + x] = '';
}

/**
 * Sembolü yerleştirir; çakışan birimleri temizler. Taşan çok hücreli sembol sola kaydırılır.
 * @returns yerleşen birimin x'i (yerleşemezse -1)
 */
export function placeSymbol(g: Grid, x: number, y: number, id: string): number {
  if (!inBounds(g, x, y)) return -1;
  const span = spanOf(id);
  if (span > g.width) return -1;
  const x0 = Math.min(x, g.width - span);
  for (let i = 0; i < span; i++) clearUnitAt(g, x0 + i, y);
  const row = y * g.width;
  g.symbols[row + x0] = id;
  for (let i = 1; i < span; i++) g.symbols[row + x0 + i] = CONT;
  return x0;
}

/** Fırçayla bir hücreyi boyar. Çok hücreli sembolde renk tüm birime uygulanır. */
export function paintCell(g: Grid, x: number, y: number, b: Brush): { x: number; span: number } | null {
  if (!inBounds(g, x, y)) return null;
  let x0 = x;
  let span = 1;
  if (b.mode !== 'color') {
    if (b.symbol) {
      x0 = placeSymbol(g, x, y, b.symbol);
      if (x0 < 0) return null;
      span = spanOf(b.symbol);
    } else clearUnitAt(g, x, y);
  }
  if (b.mode !== 'symbol') {
    for (let i = 0; i < span; i++) g.colors[y * g.width + x0 + i] = b.color;
  }
  return { x: x0, span };
}

/** Silgi: moda göre rengi (-1), sembolü ya da ikisini temizler */
export function eraseCell(g: Grid, x: number, y: number, mode: PaintMode): void {
  if (!inBounds(g, x, y)) return;
  if (mode !== 'color') clearUnitAt(g, x, y);
  if (mode !== 'symbol') g.colors[y * g.width + x] = -1;
}

/** Yarım kalan birimleri ve yetim devam işaretlerini temizler. Değişiklik olduysa true. */
export function normalize(g: Grid): boolean {
  let changed = false;
  for (let y = 0; y < g.height; y++) {
    const row = y * g.width;
    let x = 0;
    while (x < g.width) {
      const s = g.symbols[row + x];
      if (s === CONT) {
        g.symbols[row + x] = '';
        changed = true;
        x++;
        continue;
      }
      const span = spanOf(s);
      if (span > 1) {
        let ok = x + span <= g.width;
        for (let i = 1; ok && i < span; i++) if (g.symbols[row + x + i] !== CONT) ok = false;
        if (!ok) {
          g.symbols[row + x] = '';
          changed = true;
          x++;
          continue;
        }
        x += span;
        continue;
      }
      x++;
    }
  }
  return changed;
}

/* ── Ayna (simetri, çevirme) ───────────────────────────────────────── */

/** Yatay aynada sola/sağa yatık sembol çiftleri */
export const MIRROR_SYMBOL: Record<string, string> = {
  k2tog: 'ssk',
  ssk: 'k2tog',
  k3tog: 'sk2p',
  sk2p: 'k3tog',
  m1l: 'm1r',
  m1r: 'm1l',
  c2l: 'c2r',
  c2r: 'c2l',
  c4l: 'c4r',
  c4r: 'c4l',
  c6l: 'c6r',
  c6r: 'c6l',
  fpdc: 'fpdc',
};

export const mirrorSymbol = (id: string) => MIRROR_SYMBOL[id] ?? id;

export interface MirrorTarget {
  x: number;
  y: number;
  /** yatayda aynalandı mı (sembol çifti değişir) */
  flipX: boolean;
}

/** Simetri modunda boyanacak noktalar (tekrarlar elenir). span: çok hücreli birimin genişliği */
export function symmetryTargets(w: number, h: number, x: number, y: number, sym: Symmetry, span = 1): MirrorTarget[] {
  const out: MirrorTarget[] = [{ x, y, flipX: false }];
  const mx = w - x - span;
  const my = h - 1 - y;
  if (sym === 'v' || sym === 'both') out.push({ x: mx, y, flipX: true });
  if (sym === 'h' || sym === 'both') out.push({ x, y: my, flipX: false });
  if (sym === 'both') out.push({ x: mx, y: my, flipX: true });
  const seen = new Set<string>();
  return out.filter((p) => {
    const k = `${p.x},${p.y}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/* ── Araç geometrisi ───────────────────────────────────────────────── */

/** Bresenham çizgisi */
export function lineCells(x0: number, y0: number, x1: number, y1: number): [number, number][] {
  const out: [number, number][] = [];
  let x = x0,
    y = y0;
  const dx = Math.abs(x1 - x0),
    dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    out.push([x, y]);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
  return out;
}

/** Dikdörtgen hücreleri (çerçeve ya da dolu) */
export function rectCells(x0: number, y0: number, x1: number, y1: number, filled: boolean): [number, number][] {
  const ax = Math.min(x0, x1),
    bx = Math.max(x0, x1),
    ay = Math.min(y0, y1),
    by = Math.max(y0, y1);
  const out: [number, number][] = [];
  for (let y = ay; y <= by; y++)
    for (let x = ax; x <= bx; x++) if (filled || y === ay || y === by || x === ax || x === bx) out.push([x, y]);
  return out;
}

export function normRect(x0: number, y0: number, x1: number, y1: number): ChartRect {
  const x = Math.min(x0, x1),
    y = Math.min(y0, y1);
  return { x, y, w: Math.abs(x1 - x0) + 1, h: Math.abs(y1 - y0) + 1 };
}

/** Dikdörtgeni ızgaraya kırpar; tamamen dışarıdaysa null */
export function clipRect(r: ChartRect, w: number, h: number): ChartRect | null {
  const x = Math.max(0, r.x),
    y = Math.max(0, r.y);
  const x2 = Math.min(w, r.x + r.w),
    y2 = Math.min(h, r.y + r.h);
  if (x2 <= x || y2 <= y) return null;
  return { x, y, w: x2 - x, h: y2 - y };
}

/** Kova: 4 komşulu taşma doldurması. Değişen hücre sayısını döndürür. */
export function floodFill(g: Grid, x: number, y: number, b: Brush): number {
  if (!inBounds(g, x, y)) return 0;
  const w = g.width;
  const start = idx(w, x, y);
  const matchColor = b.mode !== 'symbol';
  const matchSym = b.mode !== 'color';
  const c0 = g.colors[start];
  const s0 = unitAt(g, x, y).id;
  const sameColor = !matchColor || c0 === b.color;
  const sameSym = !matchSym || s0 === b.symbol;
  if (sameColor && sameSym) return 0;
  // çok hücreli semboller kovayla dökülmez
  if (matchSym && spanOf(b.symbol) > 1) return 0;
  const seen = new Uint8Array(w * g.height);
  const stack = [start];
  seen[start] = 1;
  let n = 0;
  while (stack.length) {
    const i = stack.pop()!;
    const cx = i % w,
      cy = (i - cx) / w;
    if (matchColor) g.colors[i] = b.color;
    if (matchSym) {
      clearUnitAt(g, cx, cy);
      g.symbols[i] = b.symbol;
    }
    n++;
    const nb = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];
    for (const [nx, ny] of nb) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= g.height) continue;
      const j = ny * w + nx;
      if (seen[j]) continue;
      if (matchColor && g.colors[j] !== c0) continue;
      if (matchSym) {
        const s = g.symbols[j] === CONT ? unitAt(g, nx, ny).id : g.symbols[j];
        if (s !== s0) continue;
      }
      seen[j] = 1;
      stack.push(j);
    }
  }
  normalize(g);
  return n;
}

/* ── Bölge (seçim, kopyala/yapıştır) ───────────────────────────────── */

export type Region = Grid;

/** Dikdörtgen bölgeyi kopyalar; kesilen birimler temizlenir */
export function extractRegion(g: Grid, r: ChartRect): Region {
  const out = blankGrid(r.w, r.h);
  for (let y = 0; y < r.h; y++)
    for (let x = 0; x < r.w; x++) {
      const sx = r.x + x,
        sy = r.y + y;
      if (!inBounds(g, sx, sy)) continue;
      out.colors[y * r.w + x] = g.colors[sy * g.width + sx];
      out.symbols[y * r.w + x] = g.symbols[sy * g.width + sx];
    }
  normalize(out);
  return out;
}

/** Bölgeyi temizler (renk -1, sembol ''). Kenardan taşan birimler de silinir. */
export function clearRegion(g: Grid, r: ChartRect): void {
  for (let y = r.y; y < r.y + r.h; y++)
    for (let x = r.x; x < r.x + r.w; x++) {
      if (!inBounds(g, x, y)) continue;
      clearUnitAt(g, x, y);
      g.colors[y * g.width + x] = -1;
    }
}

/** Bölgeyi (x, y) konumuna yapıştırır, ızgara dışında kalanları atar */
export function pasteRegion(g: Grid, reg: Region, x: number, y: number, opts: { skipEmpty?: boolean } = {}): void {
  for (let ry = 0; ry < reg.height; ry++)
    for (let rx = 0; rx < reg.width; rx++) {
      const gx = x + rx,
        gy = y + ry;
      if (!inBounds(g, gx, gy)) continue;
      const c = reg.colors[ry * reg.width + rx];
      const s = reg.symbols[ry * reg.width + rx];
      if (opts.skipEmpty && c < 0 && !s) continue;
      if (s !== CONT) clearUnitAt(g, gx, gy);
      else if (g.symbols[gy * g.width + gx] && g.symbols[gy * g.width + gx] !== CONT) clearUnitAt(g, gx, gy);
      g.colors[gy * g.width + gx] = c;
      g.symbols[gy * g.width + gx] = s;
    }
  normalize(g);
}

/** Yatay çevirme: birimler bütün olarak ters sıralanır, yatık semboller aynalanır */
export function flipH(reg: Region): Region {
  const out = blankGrid(reg.width, reg.height);
  const w = reg.width;
  for (let y = 0; y < reg.height; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) out.colors[row + (w - 1 - x)] = reg.colors[row + x];
    let x = 0;
    while (x < w) {
      const s = reg.symbols[row + x];
      const span = s && s !== CONT ? spanOf(s) : 1;
      const nx = w - x - span;
      if (s && s !== CONT && nx >= 0) {
        out.symbols[row + nx] = mirrorSymbol(s);
        for (let i = 1; i < span; i++) out.symbols[row + nx + i] = CONT;
      }
      x += span;
    }
  }
  normalize(out);
  return out;
}

/** Dikey çevirme (satırların sırası ters döner) */
export function flipV(reg: Region): Region {
  const out = blankGrid(reg.width, reg.height);
  const w = reg.width;
  for (let y = 0; y < reg.height; y++) {
    const src = y * w,
      dst = (reg.height - 1 - y) * w;
    for (let x = 0; x < w; x++) {
      out.colors[dst + x] = reg.colors[src + x];
      out.symbols[dst + x] = reg.symbols[src + x];
    }
  }
  return out;
}

export const rotate180 = (reg: Region) => flipV(flipH(reg));

/* ── Boyut değiştirme ──────────────────────────────────────────────── */

export interface ResizeEdges {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const MAX_SIZE = 200;

/** Kenarlara satır/sütun ekler (pozitif) ya da kaldırır (negatif) */
export function resizeGrid(g: Grid, e: ResizeEdges, fill = -1): Grid {
  const w = Math.max(1, Math.min(MAX_SIZE, g.width + e.left + e.right));
  const h = Math.max(1, Math.min(MAX_SIZE, g.height + e.top + e.bottom));
  const out = blankGrid(w, h, fill);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const sx = x - e.left,
        sy = y - e.top;
      if (!inBounds(g, sx, sy)) continue;
      out.colors[y * w + x] = g.colors[sy * g.width + sx];
      out.symbols[y * w + x] = g.symbols[sy * g.width + sx];
    }
  normalize(out);
  return out;
}

/** Boyut değişince tekrar kutusunu kaydırır / kırpar */
export function shiftRect(r: ChartRect | undefined, e: ResizeEdges, w: number, h: number): ChartRect | undefined {
  if (!r) return undefined;
  return clipRect({ x: r.x + e.left, y: r.y + e.top, w: r.w, h: r.h }, w, h) ?? undefined;
}

/* ── Sayımlar ──────────────────────────────────────────────────────── */

/** Her palet rengi için ilmek sayısı ("ilmek yok" kareleri sayılmaz). -1 kareler ayrıca döner. */
export function colorCounts(g: Grid, paletteSize: number): { counts: number[]; empty: number } {
  const counts = new Array(paletteSize).fill(0);
  let empty = 0;
  for (let y = 0; y < g.height; y++) {
    const row = y * g.width;
    for (let x = 0; x < g.width; x++) {
      const i = row + x;
      if (g.symbols[i] === 'ns') continue;
      const c = g.colors[i];
      if (c >= 0 && c < paletteSize) counts[c]++;
      else empty++;
    }
  }
  return { counts, empty };
}

/** Kullanılan sembol kimlikleri (görünme sırasıyla) */
export function usedSymbols(g: Pick<Grid, 'symbols'>): string[] {
  const seen = new Set<string>();
  for (const s of g.symbols) if (s && s !== CONT) seen.add(s);
  return [...seen];
}

/** Palet silme/sıralama sonrası renk indekslerini dönüştürür. map[eski] = yeni (-1: boş) */
export function remapColors(colors: number[], map: number[]): number[] {
  return colors.map((c) => (c >= 0 && c < map.length ? map[c] : c));
}

/* ── Okuma yönü ve sıra numaraları ─────────────────────────────────── */

export interface RowSide {
  /** ön yüz sırası mı */
  rs: boolean;
  /** sıra numarası grafiğin hangi kenarında yazılır */
  numberSide: 'left' | 'right';
  /** okuma yönü: sağdan sola ya da soldan sağa */
  dir: 'rtl' | 'ltr';
}

/**
 * Sıra (1 tabanlı, alttan) bilgisi. Düz örgüde ön yüz sıraları sağdan sola okunur ve numarası sağda,
 * arka yüz sıraları soldan sağa okunur ve numarası soldadır. Yuvarlakta her tur ön yüzdür.
 * Solak modunda yönler aynalanır.
 */
export function rowSide(row: number, meta: Pick<ChartDoc, 'mode' | 'firstRowRS'>, leftHanded = false): RowSide {
  const rs = meta.mode === 'round' ? true : row % 2 === 1 ? meta.firstRowRS : !meta.firstRowRS;
  const rtl = rs !== leftHanded;
  return { rs, numberSide: rtl ? 'right' : 'left', dir: rtl ? 'rtl' : 'ltr' };
}

/** y (üstten) ↔ sıra (alttan, 1 tabanlı) */
export const rowOfY = (height: number, y: number) => height - y;
export const yOfRow = (height: number, row: number) => height - row;

/** Okuma yönünde bir sıranın birimleri (x ve genişlik). "İlmek yok" kareleri atlanır. */
export function rowUnits(g: Grid, y: number, dir: 'rtl' | 'ltr'): { x: number; span: number; id: string }[] {
  const units: { x: number; span: number; id: string }[] = [];
  const row = y * g.width;
  let x = 0;
  while (x < g.width) {
    const s = g.symbols[row + x];
    if (s === CONT) {
      x++;
      continue;
    }
    const span = spanOf(s);
    if (s !== 'ns') units.push({ x, span: Math.min(span, g.width - x), id: s });
    x += span;
  }
  return dir === 'rtl' ? units.reverse() : units;
}
