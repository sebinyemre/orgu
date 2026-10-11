/**
 * Grafik canvas çizicisi (düzenleyici, salt okunur görünüm, küçük resim, PNG çıktısı, takip modu).
 *
 * - Görünen bölge dışındaki hücreler çizilmez (200×200 grafikte de akıcı).
 * - Sembol çizimleri önbelleğe alınmış küçük canvas'lardan (sprite) basılır.
 * - "Temiz" kağıt: ince ızgara, 10'arlı kalın çizgi. "Kurşun kalem" kağıt: grafit izleri,
 *   hafif titrek çizimler, boya kalemi taraması ve kağıt dokusu.
 * Bu dosya tarayıcıda çalışır (canvas), React'e bağımlı değildir.
 */
import type { ChartDoc, ChartRect } from '@/types';
import type { SymbolStyle } from '@/knowledge/symbols';
import { drawSymbol } from './draw';
import { CONT, rowSide, spanOf } from './grid';

export interface ChartTheme {
  gridBg: string;
  gridLine: string;
  gridStrong: string;
  number: string;
  ink: string;
  ink3: string;
  paper: string;
  card: string;
  highlight: string;
  highlightStrong: string;
  ruler: string;
  rulerEdge: string;
  danger: string;
  accent: string;
  fontBody: string;
  fontHand: string;
  dark: boolean;
}

/** Dışa aktarılan dosyalar (PNG, yazdırma) her zaman açık renkli kağıtta çıkar */
export const PRINT_THEME: ChartTheme = {
  gridBg: '#ffffff',
  gridLine: '#c9d6df',
  gridStrong: '#7f9fb4',
  number: '#5b7486',
  ink: '#2f2925',
  ink3: '#8f8378',
  paper: '#ffffff',
  card: '#ffffff',
  highlight: 'rgba(255, 226, 64, 0.5)',
  highlightStrong: 'rgba(255, 210, 0, 0.75)',
  ruler: 'rgba(70, 105, 138, 0.18)',
  rulerEdge: '#46698a',
  danger: '#c0392b',
  accent: '#46698a',
  fontBody: 'Nunito, system-ui, sans-serif',
  fontHand: 'Caveat, cursive',
  dark: false,
};

export type PaperStyle = 'clean' | 'pencil';

export interface ChartSource {
  width: number;
  height: number;
  colors: ArrayLike<number>;
  symbols: ArrayLike<string>;
  palette: { hex: string }[];
}

export interface DrawChartOptions {
  /** grafiğin sol üst köşesi (CSS px) */
  x: number;
  y: number;
  /** hücre eni ve boyu (CSS px) */
  cw: number;
  ch: number;
  dpr: number;
  theme: ChartTheme;
  paper?: PaperStyle;
  symbolStyle?: SymbolStyle;
  /** görünen bölge (CSS px); dışı çizilmez */
  clip?: { x: number; y: number; w: number; h: number };
  grid?: boolean;
  symbols?: boolean;
  /** kalın çizgileri sağdan saymak için (solakta soldan) */
  leftHanded?: boolean;
  repeat?: ChartRect;
  /** el çizimi titremesi için tohum */
  seed?: number;
}

/* ── Yardımcılar ────────────────────────────────────────────────── */

function parseColor(c: string): [number, number, number, number] {
  if (c.startsWith('#')) {
    let h = c.slice(1);
    if (h.length === 3) h = h.split('').map((x) => x + x).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0] ?? 0, p[1] ?? 0, p[2] ?? 0, p[3] ?? 1];
  }
  return [0, 0, 0, 1];
}

export function withAlpha(c: string, a: number): string {
  const [r, g, b, a0] = parseColor(c);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a * a0))})`;
}

export function luminanceOf(c: string): number {
  const [r, g, b] = parseColor(c);
  const f = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function darken(hex: string, t: number): string {
  const [r, g, b] = parseColor(hex);
  return `rgb(${Math.round(r * (1 - t))}, ${Math.round(g * (1 - t))}, ${Math.round(b * (1 - t))})`;
}

/** Tohumlu sözde rastgele sayı (0–1) */
export function hash01(a: number, b = 0, c = 0): number {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

const snap = (v: number, dpr: number) => Math.round(v * dpr) / dpr;

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  return c;
}

let layerCanvas: HTMLCanvasElement | null = null;
function colorLayer(w: number, h: number): HTMLCanvasElement {
  if (!layerCanvas) layerCanvas = makeCanvas(w, h);
  if (layerCanvas.width < w || layerCanvas.height < h) {
    layerCanvas.width = Math.max(layerCanvas.width, w);
    layerCanvas.height = Math.max(layerCanvas.height, h);
  }
  return layerCanvas;
}

const sprites = new Map<string, HTMLCanvasElement>();
function sprite(key: string, w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void): HTMLCanvasElement {
  let s = sprites.get(key);
  if (s) return s;
  if (sprites.size > 700) sprites.clear();
  s = makeCanvas(w, h);
  const ctx = s.getContext('2d')!;
  paint(ctx);
  sprites.set(key, s);
  return s;
}

/** Kağıt dokusu deseni (kurşun kalem stili) */
const textures = new Map<string, CanvasPattern | null>();
function paperTexture(ctx: CanvasRenderingContext2D, dark: boolean): CanvasPattern | null {
  const key = dark ? 'd' : 'l';
  if (textures.has(key)) return textures.get(key)!;
  const n = 128;
  const c = makeCanvas(n, n);
  const t = c.getContext('2d')!;
  for (let i = 0; i < 900; i++) {
    const x = hash01(i, 1) * n,
      y = hash01(i, 2) * n,
      r = 0.3 + hash01(i, 3) * 0.9;
    const light = hash01(i, 4) > 0.55;
    t.fillStyle = light ? (dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.22)') : dark ? 'rgba(0,0,0,0.07)' : 'rgba(90,70,40,0.05)';
    t.beginPath();
    t.arc(x, y, r, 0, Math.PI * 2);
    t.fill();
  }
  // lif çizgileri
  t.lineWidth = 0.5;
  for (let i = 0; i < 40; i++) {
    const x = hash01(i, 5) * n,
      y = hash01(i, 6) * n,
      a = hash01(i, 7) * Math.PI;
    t.strokeStyle = dark ? 'rgba(255,255,255,0.03)' : 'rgba(120,95,60,0.05)';
    t.beginPath();
    t.moveTo(x, y);
    t.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9);
    t.stroke();
  }
  const p = ctx.createPattern(c, 'repeat');
  textures.set(key, p);
  return p;
}

/* ── Hücre boyaları ─────────────────────────────────────────────── */

function pencilFill(hex: string, w: number, h: number, variant: number): HTMLCanvasElement {
  return sprite(`pf|${hex}|${w}|${h}|${variant}`, w, h, (c) => {
    // boya kalemi çizgiyi biraz taşırır: köşeler çoğunlukla dışarı oynar
    c.fillStyle = withAlpha(hex, 0.86);
    const j = (k: number) => (hash01(variant, k, w) - 0.25) * Math.max(1, w * 0.05);
    c.beginPath();
    c.moveTo(-j(1), -j(2));
    c.lineTo(w + j(3), -j(4));
    c.lineTo(w + j(5), h + j(6));
    c.lineTo(-j(7), h + j(8));
    c.closePath();
    c.fill();
    // boya kalemi taraması
    c.strokeStyle = darken(hex, 0.18);
    c.globalAlpha = 0.32;
    c.lineWidth = Math.max(0.6, w * 0.045);
    const step = Math.max(2.2, w / 6);
    for (let k = -h; k < w + h; k += step) {
      const o = (hash01(variant, k | 0) - 0.5) * step * 0.5;
      c.beginPath();
      c.moveTo(k + o, h);
      c.lineTo(k + o + h * 0.9, 0);
      c.stroke();
    }
    c.globalAlpha = 1;
  });
}

function nostitchSprite(theme: ChartTheme, w: number, h: number, pencil: boolean): HTMLCanvasElement {
  return sprite(`ns|${theme.ink3}|${theme.gridBg}|${w}|${h}|${pencil}`, w, h, (c) => {
    c.fillStyle = withAlpha(theme.ink3, theme.dark ? 0.35 : 0.42);
    c.fillRect(0, 0, w, h);
    if (pencil) {
      c.strokeStyle = withAlpha(theme.ink, 0.35);
      c.lineWidth = Math.max(0.6, w * 0.05);
      const step = Math.max(3, w / 4);
      for (let k = -h; k < w + h; k += step) {
        c.beginPath();
        c.moveTo(k, h);
        c.lineTo(k + h, 0);
        c.stroke();
      }
    }
  });
}

/** Sembol sprite'ı (cihaz pikseli boyutunda) */
function symbolSprite(id: string, style: SymbolStyle, ink: string, bg: string, wDev: number, hDev: number, pencil: boolean, variant: number): HTMLCanvasElement {
  return sprite(`s|${id}|${style}|${ink}|${bg}|${wDev}|${hDev}|${pencil ? variant : -1}`, wDev, hDev, (c) => {
    const span = spanOf(id);
    const lw = Math.max(1, Math.min(wDev / span, hDev) * (pencil ? 0.075 : 0.085));
    if (!pencil) {
      drawSymbol(c, id, 0, 0, wDev, hDev, { ink, bg, style, lineWidth: lw });
      return;
    }
    // iki geçişli, hafif titrek grafit çizgisi
    const cell = Math.min(wDev / span, hDev);
    for (let pass = 0; pass < 2; pass++) {
      const a = (hash01(variant, pass, 11) - 0.5) * 0.16;
      const dx = (hash01(variant, pass, 12) - 0.5) * cell * 0.09;
      const dy = (hash01(variant, pass, 13) - 0.5) * cell * 0.09;
      c.save();
      c.translate(wDev / 2 + dx, hDev / 2 + dy);
      c.rotate(a);
      c.translate(-wDev / 2, -hDev / 2);
      c.globalAlpha = pass === 0 ? 0.88 : 0.45;
      drawSymbol(c, id, wDev * 0.03, hDev * 0.03, wDev * 0.94, hDev * 0.94, { ink, bg, style, lineWidth: lw * (pass === 0 ? 1 : 0.7) });
      c.restore();
    }
  });
}

/* ── Ana çizim ──────────────────────────────────────────────────── */

export function drawChart(ctx: CanvasRenderingContext2D, src: ChartSource, o: DrawChartOptions): void {
  const { x: ox, y: oy, cw, ch, dpr, theme } = o;
  const W = src.width,
    H = src.height;
  const pencil = o.paper === 'pencil';
  const style = o.symbolStyle ?? 'cyc';
  const clip = o.clip ?? { x: ox, y: oy, w: W * cw, h: H * ch };
  const x0 = Math.max(0, Math.floor((clip.x - ox) / cw));
  const x1 = Math.min(W, Math.ceil((clip.x + clip.w - ox) / cw));
  const y0 = Math.max(0, Math.floor((clip.y - oy) / ch));
  const y1 = Math.min(H, Math.ceil((clip.y + clip.h - oy) / ch));
  if (x1 <= x0 || y1 <= y0) return;
  const seed = o.seed ?? 1;

  const X = (i: number) => snap(ox + i * cw, dpr);
  const Y = (j: number) => snap(oy + j * ch, dpr);

  // kağıt
  ctx.fillStyle = theme.gridBg;
  ctx.fillRect(X(x0), Y(y0), X(x1) - X(x0), Y(y1) - Y(y0));

  // renkler
  const small = cw < 7 || ch < 7;
  if (pencil && !small) {
    for (let y = y0; y < y1; y++) {
      const row = y * W;
      for (let x = x0; x < x1; x++) {
        const c = src.colors[row + x];
        const hex = c >= 0 ? src.palette[c]?.hex : undefined;
        if (!hex) continue;
        const wd = Math.round((X(x + 1) - X(x)) * dpr),
          hd = Math.round((Y(y + 1) - Y(y)) * dpr);
        ctx.drawImage(pencilFill(hex, wd, hd, Math.floor(hash01(x, y, seed) * 4)), X(x), Y(y), X(x + 1) - X(x), Y(y + 1) - Y(y));
      }
    }
  } else {
    // her hücre bir piksel: tek drawImage ile ölçeklenir (200×200'de de hızlı)
    const bw = x1 - x0,
      bh = y1 - y0;
    const layer = colorLayer(bw, bh);
    const lctx = layer.getContext('2d')!;
    const img = lctx.createImageData(bw, bh);
    const px = new Uint32Array(img.data.buffer);
    const rgba = src.palette.map((p) => {
      const [r, g, b] = parseColor(p.hex);
      const a = pencil ? 209 : 255;
      return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
    });
    for (let y = y0; y < y1; y++) {
      const row = y * W,
        o = (y - y0) * bw - x0;
      for (let x = x0; x < x1; x++) {
        const c = src.colors[row + x];
        px[o + x] = c >= 0 && c < rgba.length ? rgba[c] : 0;
      }
    }
    lctx.putImageData(img, 0, 0);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(layer, 0, 0, bw, bh, X(x0), Y(y0), X(x1) - X(x0), Y(y1) - Y(y0));
    ctx.restore();
  }

  // ilmek yok kareleri
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++)
      if (src.symbols[y * W + x] === 'ns') {
        const wd = Math.max(1, Math.round((X(x + 1) - X(x)) * dpr)),
          hd = Math.max(1, Math.round((Y(y + 1) - Y(y)) * dpr));
        ctx.drawImage(nostitchSprite(theme, wd, hd, pencil), X(x), Y(y), X(x + 1) - X(x), Y(y + 1) - Y(y));
      }

  if (pencil) {
    const p = paperTexture(ctx, theme.dark);
    if (p) {
      ctx.save();
      ctx.fillStyle = p;
      ctx.translate(ox, oy);
      ctx.fillRect(X(x0) - ox, Y(y0) - oy, X(x1) - X(x0), Y(y1) - Y(y0));
      ctx.restore();
    }
  }

  // ızgara
  if (o.grid !== false) drawGrid(ctx, W, H, o, x0, x1, y0, y1);

  // semboller
  if (o.symbols !== false && cw >= 6 && ch >= 6) {
    for (let y = y0; y < y1; y++) {
      const row = y * W;
      // sola taşan çok hücreli birimin başlangıcını da yakala
      let x = x0;
      while (x > 0 && src.symbols[row + x] === CONT) x--;
      for (; x < x1; x++) {
        const id = src.symbols[row + x];
        if (!id || id === CONT || id === 'ns') continue;
        const span = Math.min(spanOf(id), W - x);
        const c = src.colors[row + x];
        const cellHex = c >= 0 ? src.palette[c]?.hex : undefined;
        const bg = cellHex ?? theme.gridBg;
        let ink: string;
        if (cellHex) ink = luminanceOf(cellHex) > 0.36 ? (pencil ? '#3a3633' : '#1f1a16') : pencil ? '#f4efe8' : '#ffffff';
        else ink = pencil ? withAlpha(theme.ink, theme.dark ? 0.85 : 0.78) : theme.ink;
        const px = X(x),
          py = Y(y),
          pw = X(x + span) - px,
          ph = Y(y + 1) - py;
        if (span > 1) {
          // çok hücreli sembolün içindeki ızgara çizgilerini ört
          const inset = Math.max(1, Math.round(dpr)) / dpr;
          if (cellHex && pencil) ctx.drawImage(pencilFill(cellHex, Math.round(pw * dpr), Math.round(ph * dpr), 0), px, py, pw, ph);
          else {
            ctx.fillStyle = bg;
            ctx.fillRect(px + inset, py + inset, pw - inset * 2, ph - inset * 2);
          }
        }
        const wd = Math.max(1, Math.round(pw * dpr)),
          hd = Math.max(1, Math.round(ph * dpr));
        ctx.drawImage(symbolSprite(id, style, ink, bg, wd, hd, pencil, Math.floor(hash01(x, y, seed + 7) * 4)), px, py, pw, ph);
      }
    }
  }

  // tekrar kutusu
  if (o.repeat) drawRepeat(ctx, o.repeat, o);
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, o: DrawChartOptions, x0: number, x1: number, y0: number, y1: number) {
  const { x: ox, y: oy, cw, ch, dpr, theme } = o;
  const thin = 1 / dpr;
  const showThin = cw >= 4 && ch >= 4;
  const top = snap(oy + y0 * ch, dpr),
    bottom = snap(oy + y1 * ch, dpr);
  const left = snap(ox + x0 * cw, dpr),
    right = snap(ox + x1 * cw, dpr);
  const pencil = o.paper === 'pencil';
  const thinColor = pencil ? withAlpha(theme.gridLine, 0.85) : theme.gridLine;
  // açık kağıtta çizgiler çarpma kipinde: renkli karelerin üstünde de basılı ızgara gibi koyulaşır
  ctx.save();
  if (!theme.dark) ctx.globalCompositeOperation = 'multiply';
  // ince çizgiler
  if (showThin) {
    ctx.fillStyle = thinColor;
    for (let x = x0; x <= x1; x++) ctx.fillRect(snap(ox + x * cw, dpr), top, thin, bottom - top);
    for (let y = y0; y <= y1; y++) ctx.fillRect(left, snap(oy + y * ch, dpr), right - left, thin);
  }
  // 10'arlı kalın çizgiler: sütunlar sağdan (solakta soldan), sıralar alttan sayılır
  const major = Math.max(1, Math.round(1.3 * dpr)) / dpr;
  const border = Math.max(2, Math.round(2 * dpr)) / dpr;
  ctx.fillStyle = theme.gridStrong;
  for (let x = x0; x <= x1; x++) {
    const edge = x === 0 || x === W;
    const fromEdge = o.leftHanded ? x : W - x;
    if (!edge && fromEdge % 10 !== 0) continue;
    const lw = edge ? border : major;
    const px = snap(ox + x * cw, dpr) - (x === W ? lw - thin : 0);
    ctx.fillRect(px, top, lw, bottom - top);
  }
  for (let y = y0; y <= y1; y++) {
    const edge = y === 0 || y === H;
    if (!edge && (H - y) % 10 !== 0) continue;
    const lw = edge ? border : major;
    const py = snap(oy + y * ch, dpr) - (y === H ? lw - thin : 0);
    ctx.fillRect(left, py, right - left, lw);
  }
  ctx.restore();
}

/** Kırmızı tekrar kutusu (basılı grafiklerdeki gibi) */
export function drawRepeat(ctx: CanvasRenderingContext2D, r: ChartRect, o: Pick<DrawChartOptions, 'x' | 'y' | 'cw' | 'ch' | 'theme' | 'paper' | 'dpr'>): void {
  const lw = Math.max(2, Math.min(o.cw, o.ch) * 0.14);
  const x = o.x + r.x * o.cw,
    y = o.y + r.y * o.ch,
    w = r.w * o.cw,
    h = r.h * o.ch;
  ctx.save();
  ctx.strokeStyle = o.theme.danger;
  ctx.lineJoin = 'round';
  if (o.paper === 'pencil') {
    for (let pass = 0; pass < 2; pass++) {
      ctx.globalAlpha = pass ? 0.5 : 0.85;
      ctx.lineWidth = lw * (pass ? 0.7 : 0.9);
      const j = (k: number) => (hash01(pass, k, r.x + r.y) - 0.5) * lw * 1.2;
      ctx.beginPath();
      ctx.moveTo(x + j(1), y + j(2));
      ctx.lineTo(x + w + j(3), y + j(4));
      ctx.lineTo(x + w + j(5), y + h + j(6));
      ctx.lineTo(x + j(7), y + h + j(8));
      ctx.closePath();
      ctx.stroke();
    }
  } else {
    ctx.lineWidth = lw;
    ctx.strokeRect(x, y, w, h);
  }
  ctx.restore();
}

/* ── Numaralar ──────────────────────────────────────────────────── */

export interface NumberOptions {
  mode: ChartDoc['mode'];
  firstRowRS: boolean;
  leftHanded?: boolean;
  /** görünen alan: numaralar ekran kenarına yapışık kalır */
  sticky?: { w: number; h: number };
  paper?: PaperStyle;
  /** 1 tabanlı vurgulanan sıra (numarası kalın yazılır) */
  activeRow?: number;
}

export function numberFontSize(cw: number, ch: number, paper?: PaperStyle): number {
  const base = Math.max(8, Math.min(13, ch * 0.62, cw * 0.75 + 3));
  return paper === 'pencil' ? base * 1.3 : base;
}

/** Numaralar için kenar boşlukları (CSS px) */
export function numberMargins(width: number, height: number, cw: number, ch: number, paper?: PaperStyle): { side: number; bottom: number } {
  const fs = numberFontSize(cw, ch, paper);
  const digits = String(Math.max(width, height)).length;
  return { side: Math.ceil(fs * 0.62 * digits + 10), bottom: Math.ceil(fs + 10) };
}

const rowStep = (ch: number) => (ch >= 9 ? 1 : ch >= 4 ? 5 : 10);
const colStep = (cw: number, fs: number, digits: number) => {
  const need = fs * 0.6 * digits + 3;
  for (const s of [1, 2, 5, 10, 20]) if (cw * s >= need) return s;
  return 50;
};

export function drawNumbers(ctx: CanvasRenderingContext2D, size: { width: number; height: number }, g: { x: number; y: number; cw: number; ch: number }, theme: ChartTheme, o: NumberOptions): void {
  const { width: W, height: H } = size;
  const { x: ox, y: oy, cw, ch } = g;
  const fs = numberFontSize(cw, ch, o.paper);
  const font = o.paper === 'pencil' ? theme.fontHand : theme.fontBody;
  const m = numberMargins(W, H, cw, ch, o.paper);
  ctx.save();
  ctx.textBaseline = 'middle';
  let leftX = ox - 5,
    rightX = ox + W * cw + 5,
    bottomY = oy + H * ch + 4 + fs / 2;
  const stick = o.sticky;
  if (stick) {
    // ekrandan taşan kenarlarda numaralar ekran kenarında, hafif zeminle kalır
    const pad = m.side;
    const bandBg = withAlpha(theme.gridBg, 0.88);
    if (leftX - pad < 0) {
      leftX = pad - 4;
      ctx.fillStyle = bandBg;
      ctx.fillRect(0, Math.max(0, oy), pad, Math.min(stick.h, oy + H * ch) - Math.max(0, oy));
    }
    if (rightX + pad > stick.w) {
      rightX = stick.w - pad + 4;
      ctx.fillStyle = bandBg;
      ctx.fillRect(stick.w - pad, Math.max(0, oy), pad, Math.min(stick.h, oy + H * ch) - Math.max(0, oy));
    }
    if (bottomY + fs / 2 + 4 > stick.h) {
      bottomY = stick.h - fs / 2 - 4;
      ctx.fillStyle = bandBg;
      ctx.fillRect(Math.max(0, ox), stick.h - m.bottom, Math.min(stick.w, ox + W * cw) - Math.max(0, ox), m.bottom);
    }
  }
  const step = rowStep(ch);
  const vy0 = stick ? Math.max(0, Math.floor(-oy / ch)) : 0;
  const vy1 = stick ? Math.min(H, Math.ceil((stick.h - oy) / ch)) : H;
  for (let y = vy0; y < vy1; y++) {
    const row = H - y;
    if (step > 1 && row % step !== 0 && row !== 1) continue;
    const side = rowSide(row, o, o.leftHanded);
    const active = o.activeRow === row;
    ctx.font = `${active ? 800 : o.paper === 'pencil' ? 600 : 700} ${active ? fs * 1.1 : fs}px ${font}`;
    ctx.fillStyle = active ? theme.ink : theme.number;
    const cy = oy + y * ch + ch / 2;
    if (side.numberSide === 'left') {
      ctx.textAlign = 'right';
      ctx.fillText(String(row), leftX, cy);
    } else {
      ctx.textAlign = 'left';
      ctx.fillText(String(row), rightX, cy);
    }
  }
  // sütun numaraları: sağdan (solakta soldan)
  ctx.font = `${o.paper === 'pencil' ? 600 : 700} ${fs * 0.92}px ${font}`;
  ctx.fillStyle = theme.number;
  ctx.textAlign = 'center';
  const cs = colStep(cw, fs * 0.92, String(W).length);
  const vx0 = stick ? Math.max(0, Math.floor(-ox / cw)) : 0;
  const vx1 = stick ? Math.min(W, Math.ceil((stick.w - ox) / cw)) : W;
  for (let x = vx0; x < vx1; x++) {
    const col = o.leftHanded ? x + 1 : W - x;
    if (cs > 1 && col % cs !== 0 && col !== 1) continue;
    ctx.fillText(String(col), ox + x * cw + cw / 2, bottomY);
  }
  ctx.restore();
}

/** Bir sırayı fosforlu kalemle vurgular */
export function drawRowBand(ctx: CanvasRenderingContext2D, g: { x: number; y: number; cw: number; ch: number }, width: number, y: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(g.x, g.y + y * g.ch, width * g.cw, g.ch);
}

/* ── Durağan grafik (küçük resim, salt okunur görünüm, PNG) ────── */

export interface StaticChartOptions {
  cell: number;
  /** oranlı hücre: en/boy */
  aspect?: number;
  theme: ChartTheme;
  dpr: number;
  paper?: PaperStyle;
  symbolStyle?: SymbolStyle;
  numbers?: NumberOptions | false;
  repeat?: ChartRect;
  highlightRow?: number;
  pad?: number;
}

export function staticChartSize(src: { width: number; height: number }, o: Pick<StaticChartOptions, 'cell' | 'aspect' | 'numbers' | 'paper' | 'pad'>) {
  const ch = o.cell;
  const cw = o.cell * (o.aspect ?? 1);
  const pad = o.pad ?? 2;
  const m = o.numbers ? numberMargins(src.width, src.height, cw, ch, o.paper) : { side: 0, bottom: 0 };
  return { cw, ch, left: m.side + pad, top: pad + (o.numbers ? 4 : 0), width: src.width * cw + m.side * 2 + pad * 2, height: src.height * ch + m.bottom + pad * 2 + (o.numbers ? 4 : 0) };
}

/** Grafiği verilen canvas'a (boyutunu ayarlayarak) çizer */
export function renderStaticChart(canvas: HTMLCanvasElement, src: ChartSource, o: StaticChartOptions): { width: number; height: number } {
  const s = staticChartSize(src, o);
  canvas.width = Math.ceil(s.width * o.dpr);
  canvas.height = Math.ceil(s.height * o.dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(o.dpr, 0, 0, o.dpr, 0, 0);
  ctx.clearRect(0, 0, s.width, s.height);
  drawChart(ctx, src, { x: s.left, y: s.top, cw: s.cw, ch: s.ch, dpr: o.dpr, theme: o.theme, paper: o.paper, symbolStyle: o.symbolStyle, leftHanded: o.numbers ? o.numbers.leftHanded : false, repeat: o.repeat });
  if (o.highlightRow && o.highlightRow >= 1 && o.highlightRow <= src.height) {
    const y = src.height - o.highlightRow;
    drawRowBand(ctx, { x: s.left, y: s.top, cw: s.cw, ch: s.ch }, src.width, y, o.theme.highlight);
    ctx.strokeStyle = o.theme.rulerEdge;
    ctx.lineWidth = 2;
    ctx.strokeRect(s.left, s.top + y * s.ch, src.width * s.cw, s.ch);
  }
  if (o.numbers) drawNumbers(ctx, src, { x: s.left, y: s.top, cw: s.cw, ch: s.ch }, o.theme, { ...o.numbers, paper: o.paper, activeRow: o.highlightRow });
  return { width: s.width, height: s.height };
}
