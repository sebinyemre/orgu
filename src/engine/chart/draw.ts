/** Grafik sembollerini canvas'a çizer (SVG ile aynı yol verisini kullanır). */
import { SYMBOL_BY_ID, glyphOf, type ChartSymbol, type SymbolStyle } from '@/knowledge/symbols';

const pathCache = new Map<string, Path2D>();
function path(d: string): Path2D {
  let p = pathCache.get(d);
  if (!p) {
    p = new Path2D(d);
    pathCache.set(d, p);
  }
  return p;
}

export interface DrawSymbolOptions {
  /** mürekkep rengi */
  ink: string;
  /** hücre zemin rengi (burgu kesişimlerinde öndeki şeridin "boşluğu") */
  bg: string;
  /** çizgi kalınlığı (px) */
  lineWidth?: number;
  /** CYC (varsayılan) ya da Japon JIS çizimi */
  style?: SymbolStyle;
}

/**
 * (x, y) sol üst köşeli, w × h boyutlu kutuya sembolü çizer.
 * Çok hücreli sembollerde w toplam genişliktir (span · hücre genişliği).
 */
export function drawSymbol(ctx: CanvasRenderingContext2D, symOrId: ChartSymbol | string, x: number, y: number, w: number, h: number, o: DrawSymbolOptions): void {
  const sym = typeof symOrId === 'string' ? SYMBOL_BY_ID[symOrId] : symOrId;
  if (!sym) return;
  const g = glyphOf(sym, o.style);
  const span = sym.span ?? 1;
  const m = new DOMMatrix().translateSelf(x, y).scaleSelf(w / (100 * span), h / 100);
  const lw = o.lineWidth ?? Math.max(1, Math.min(w / span, h) * 0.085);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (g.under) {
    const p = new Path2D();
    p.addPath(path(g.under), m);
    ctx.strokeStyle = o.ink;
    ctx.lineWidth = lw;
    ctx.stroke(p);
  }
  if (g.d) {
    const p = new Path2D();
    p.addPath(path(g.d), m);
    if (g.under) {
      ctx.strokeStyle = o.bg;
      ctx.lineWidth = lw * 3.4;
      ctx.stroke(p);
    }
    ctx.strokeStyle = o.ink;
    ctx.lineWidth = lw;
    ctx.stroke(p);
  }
  if (g.fd) {
    const p = new Path2D();
    p.addPath(path(g.fd), m);
    ctx.fillStyle = o.ink;
    ctx.fill(p);
  }
  ctx.restore();
}
