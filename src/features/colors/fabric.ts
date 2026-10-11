/**
 * Örülmüş kumaş çizimi (canvas): her ilmek iki bacaklı bir V olarak çizilir.
 * Şerit, sıcaklık battaniyesi ve palet önizlemelerinde kullanılır.
 */
import { shade, toGrayHex } from '@/lib/color';

export interface KnitDrawOptions {
  /** satır öncelikli, ÜSTTEN alta hücre renkleri */
  cells: string[];
  cols: number;
  rows: number;
  /** ilmek genişliği (px) */
  stW: number;
  /** ilmek yüksekliği (px); jarsede genişlikten biraz kısa */
  stH?: number;
  gray?: boolean;
}

const cache = new Map<string, [string, string, string]>();
function tones(hex: string): [string, string, string] {
  let t = cache.get(hex);
  if (!t) {
    t = [shade(hex, -0.38), hex, shade(hex, 0.28)];
    cache.set(hex, t);
  }
  return t;
}

/** Bir V ilmeği: koyu dış çizgi, gövde rengi, açık parlak çizgi */
function drawV(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, hex: string) {
  const [dark, mid, light] = tones(hex);
  const cx = x + w / 2;
  const legs: [number, number, number, number][] = [
    [x + w * 0.1, y + h * 0.02, cx - w * 0.02, y + h * 1.05],
    [x + w * 0.9, y + h * 0.02, cx + w * 0.02, y + h * 1.05],
  ];
  ctx.lineCap = 'round';
  ctx.strokeStyle = dark;
  ctx.lineWidth = w * 0.46;
  for (const [x1, y1, x2, y2] of legs) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.strokeStyle = mid;
  ctx.lineWidth = w * 0.34;
  for (const [x1, y1, x2, y2] of legs) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.strokeStyle = light;
  ctx.lineWidth = Math.max(0.6, w * 0.08);
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(legs[0][0] + w * 0.06, legs[0][1] + h * 0.12);
  ctx.lineTo(legs[0][2] - w * 0.02, legs[0][3] - h * 0.3);
  ctx.moveTo(legs[1][0] - w * 0.1, legs[1][1] + h * 0.16);
  ctx.lineTo(legs[1][2] + w * 0.06, legs[1][3] - h * 0.34);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Hücreleri kumaş olarak çizer; tuvali boyutlandırır ve çizim boyunu döndürür */
export function drawKnit(canvas: HTMLCanvasElement, o: KnitDrawOptions, dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1): { width: number; height: number } {
  const stH = o.stH ?? o.stW * 0.82;
  const width = o.cols * o.stW;
  const height = o.rows * stH + stH * 0.15;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return { width, height };
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  // satırları alttan üste çiz: üstteki ilmekler alttakilerin üstüne biner
  for (let r = o.rows - 1; r >= 0; r--) {
    for (let c = 0; c < o.cols; c++) {
      const raw = o.cells[r * o.cols + c] ?? '#cccccc';
      const hex = o.gray ? toGrayHex(raw) : raw;
      if (c === 0) {
        // satır zemini (ilmek araları koyu görünür)
        ctx.fillStyle = shade(hex, -0.45);
        ctx.fillRect(0, r * stH, width, stH + 1);
      }
      drawV(ctx, c * o.stW, r * stH, o.stW, stH, hex);
    }
  }
  return { width, height };
}

/** Düz şerit çizimi (çok sıralı battaniyeler için hızlı yol): her sıra ince bir şerit */
export function drawStripesFlat(
  canvas: HTMLCanvasElement,
  rowColors: (string | null)[],
  width: number,
  rowH: number,
  empty: string,
  dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
) {
  const height = Math.max(1, rowColors.length * rowH);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // üstte son sıra: dizi alttan üste
  rowColors.forEach((hex, i) => {
    const y = height - (i + 1) * rowH;
    ctx.fillStyle = hex ?? empty;
    ctx.fillRect(0, y, width, rowH + 0.5);
    if (hex && rowH >= 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      for (let x = 0; x < width; x += 6) ctx.fillRect(x + 2.5, y, 1, rowH);
    }
  });
}

/** Sıra renkleri (alttan üste) → üstten alta hücre dizisi */
export function rowsToCells(rowColors: string[], cols: number): string[] {
  const out: string[] = [];
  for (let r = rowColors.length - 1; r >= 0; r--) for (let c = 0; c < cols; c++) out.push(rowColors[r]);
  return out;
}
