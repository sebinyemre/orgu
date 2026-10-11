/**
 * Örülmüş kumaş önizlemesi: grafik hücrelerini gerçek örgü görünümüyle canvas'a çizer.
 *
 * Şiş: düz ilmek iki gölgeli yaprak bacaktan oluşan V, ters ilmek yatay boncuk, ip atma delik,
 * 2 birlikte/kaydır-kaydır-ör yatık V, merkezden çift eksiltme, kaydırılmış (uzun) ilmek, burgulu ilmek,
 * pıtırcık, burgular (önden ve arkadan geçen şeritler), "ilmek yok" boşluk.
 * Sıralar alttan yukarı çizilir: üstteki ilmeğin ucu alttakinin tepesini örter, tıpkı kumaştaki gibi.
 * Tığ: sık iğne, yarım trabzan, trabzan yüksekliklerine göre dokulu karolar.
 */
import type { Craft } from '@/types';
import { SYMBOL_BY_ID, type FabricLook } from '@/knowledge/symbols';
import { mix } from '@/lib/color';
import { CONT, spanOf } from './grid';

export interface FabricSource {
  width: number;
  height: number;
  symbols: ArrayLike<string>;
  colors?: ArrayLike<number>;
  palette?: { hex: string }[];
  craft: Craft;
  yarnColor?: string;
}

export interface FabricOptions {
  stitchPx: number;
  dpr: number;
  tileX?: number;
  tileY?: number;
}

interface Shades {
  base: string;
  light: string;
  dark: string;
  deep: string;
}

const shadeCache = new Map<string, Shades>();
function shades(hex: string): Shades {
  let s = shadeCache.get(hex);
  if (!s) {
    s = { base: hex, light: mix(hex, '#ffffff', 0.38), dark: mix(hex, '#000000', 0.32), deep: mix(hex, '#000000', 0.62) };
    shadeCache.set(hex, s);
  }
  return s;
}

const DEFAULT_YARN = '#d9c6a5';

/** Satır yüksekliği oranı (ilmek eni × oran) */
export const rowRatio = (craft: Craft) => (craft === 'knit' ? 0.7 : 0.86);

export function fabricSize(src: Pick<FabricSource, 'width' | 'height' | 'craft'>, o: Pick<FabricOptions, 'stitchPx' | 'tileX' | 'tileY'>) {
  const sw = o.stitchPx;
  const rh = sw * rowRatio(src.craft);
  const tx = Math.max(1, o.tileX ?? 1),
    ty = Math.max(1, o.tileY ?? 1);
  const top = rh * 0.7;
  return { sw, rh, top, width: src.width * tx * sw, height: src.height * ty * rh + top + rh * 0.35 };
}

/* ── Şiş ilmek parçaları ────────────────────────────────────────── */

/** Bir bacak: yaprak biçimli, enine gölgeli, büküm çizgili */
function leg(ctx: CanvasRenderingContext2D, bx: number, by: number, tx: number, ty: number, thick: number, s: Shades) {
  const dx = tx - bx,
    dy = ty - by;
  const len = Math.hypot(dx, dy);
  const ang = Math.atan2(dy, dx);
  const a = len / 2 + thick * 0.25,
    b = thick;
  ctx.save();
  ctx.translate((bx + tx) / 2, (by + ty) / 2);
  ctx.rotate(ang);
  const g = ctx.createLinearGradient(0, -b, 0, b);
  g.addColorStop(0, s.dark);
  g.addColorStop(0.32, s.light);
  g.addColorStop(0.6, s.base);
  g.addColorStop(1, s.dark);
  ctx.fillStyle = g;
  ctx.beginPath();
  // yaprak: iki ucu sivri elips
  ctx.moveTo(-a, 0);
  ctx.bezierCurveTo(-a * 0.55, -b * 1.25, a * 0.55, -b * 1.25, a, 0);
  ctx.bezierCurveTo(a * 0.55, b * 1.25, -a * 0.55, b * 1.25, -a, 0);
  ctx.fill();
  // büküm (kat) çizgileri
  ctx.strokeStyle = s.deep;
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = Math.max(0.5, b * 0.18);
  ctx.lineCap = 'round';
  for (let t = -a * 0.55; t <= a * 0.6; t += b * 1.15) {
    ctx.beginPath();
    ctx.moveTo(t - b * 0.35, -b * 0.75);
    ctx.lineTo(t + b * 0.35, b * 0.75);
    ctx.stroke();
  }
  ctx.restore();
}

interface VOpts {
  /** eğiklik (skewX katsayısı, alt uç sabit) */
  lean?: number;
  /** uzunluk çarpanı (kaydırılmış ilmek için > 1) */
  tall?: number;
  /** bacak açıklığı çarpanı */
  spread?: number;
  /** bacaklar altta çaprazlanır (burgulu ilmek) */
  cross?: boolean;
  shadow?: boolean;
}

function knitV(ctx: CanvasRenderingContext2D, cx: number, top: number, sw: number, rh: number, s: Shades, o: VOpts = {}) {
  const bottom = top + rh * 1.02;
  const tall = o.tall ?? 1;
  const spread = o.spread ?? 1;
  const tipY = bottom - rh * 1.34 * tall;
  ctx.save();
  if (o.lean) {
    ctx.translate(cx, bottom);
    ctx.transform(1, 0, o.lean, 1, 0, 0);
    ctx.translate(-cx, -bottom);
  }
  if (o.shadow !== false) {
    ctx.fillStyle = s.deep;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.ellipse(cx, bottom - rh * 0.25, sw * 0.42 * spread, rh * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  const thick = sw * 0.215;
  const off = o.cross ? sw * 0.1 : -sw * 0.03;
  leg(ctx, cx + off, bottom, cx - sw * 0.39 * spread, tipY, thick, s);
  leg(ctx, cx - off, bottom, cx + sw * 0.39 * spread, tipY, thick, s);
  ctx.restore();
}

function purlBump(ctx: CanvasRenderingContext2D, cx: number, top: number, sw: number, rh: number, s: Shades, tilt: number) {
  const cy = top + rh * 0.5;
  ctx.save();
  ctx.fillStyle = s.deep;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.ellipse(cx, cy + rh * 0.14, sw * 0.56, rh * 0.38, tilt, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  const g = ctx.createRadialGradient(cx - sw * 0.12, cy - rh * 0.16, rh * 0.05, cx, cy, sw * 0.6);
  g.addColorStop(0, s.light);
  g.addColorStop(0.55, s.base);
  g.addColorStop(1, s.dark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy, sw * 0.55, rh * 0.36, tilt, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = s.deep;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = Math.max(0.5, sw * 0.04);
  for (let k = -2; k <= 2; k++) {
    ctx.beginPath();
    ctx.moveTo(cx + k * sw * 0.17 - sw * 0.05, cy - rh * 0.25);
    ctx.lineTo(cx + k * sw * 0.17 + sw * 0.05, cy + rh * 0.25);
    ctx.stroke();
  }
  ctx.restore();
}

function yoHole(ctx: CanvasRenderingContext2D, cx: number, top: number, sw: number, rh: number, s: Shades) {
  const cy = top + rh * 0.55;
  ctx.save();
  ctx.fillStyle = s.deep;
  ctx.beginPath();
  ctx.ellipse(cx, cy, sw * 0.27, rh * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + rh * 0.05, sw * 0.18, rh * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  // deliğin üstünden geçen ip
  ctx.lineCap = 'round';
  ctx.strokeStyle = s.base;
  ctx.lineWidth = sw * 0.17;
  ctx.beginPath();
  ctx.moveTo(cx - sw * 0.42, cy - rh * 0.05);
  ctx.quadraticCurveTo(cx, cy - rh * 0.85, cx + sw * 0.42, cy - rh * 0.05);
  ctx.stroke();
  ctx.strokeStyle = s.light;
  ctx.lineWidth = sw * 0.05;
  ctx.beginPath();
  ctx.moveTo(cx - sw * 0.34, cy - rh * 0.16);
  ctx.quadraticCurveTo(cx, cy - rh * 0.88, cx + sw * 0.3, cy - rh * 0.2);
  ctx.stroke();
  ctx.restore();
}

function bobble(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, s: Shades) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(cx + r * 0.12, cy + r * 0.2, r * 1.02, r * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();
  const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
  g.addColorStop(0, s.light);
  g.addColorStop(0.5, s.base);
  g.addColorStop(1, s.dark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = s.deep;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = Math.max(0.6, r * 0.09);
  for (let k = -1; k <= 1; k++) {
    ctx.beginPath();
    ctx.ellipse(cx + k * r * 0.35, cy, r * 0.32, r * 0.9, 0, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  ctx.restore();
}

/* ── Sprite önbelleği ───────────────────────────────────────────── */

const sprites = new Map<string, { c: HTMLCanvasElement; ox: number; oy: number }>();

function cached(key: string, sw: number, rh: number, dpr: number, paint: (ctx: CanvasRenderingContext2D, cx: number, top: number) => void) {
  let s = sprites.get(key);
  if (s) return s;
  if (sprites.size > 500) sprites.clear();
  const w = sw * 2.4,
    h = rh * 3.0;
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * dpr);
  c.height = Math.ceil(h * dpr);
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  const cx = w / 2,
    top = rh * 1.65;
  paint(ctx, cx, top);
  s = { c, ox: cx, oy: top };
  sprites.set(key, s);
  return s;
}

function stamp(ctx: CanvasRenderingContext2D, key: string, cx: number, top: number, sw: number, rh: number, dpr: number, paint: (c: CanvasRenderingContext2D, cx: number, top: number) => void) {
  const s = cached(`${key}|${sw.toFixed(2)}|${rh.toFixed(2)}|${dpr}`, sw, rh, dpr, paint);
  ctx.drawImage(s.c, cx - s.ox, top - s.oy, s.c.width / dpr, s.c.height / dpr);
}

/* ── Tek ilmek çizimi ───────────────────────────────────────────── */

function lookOf(id: string): FabricLook {
  if (!id) return 'knit';
  return SYMBOL_BY_ID[id]?.fabric ?? 'knit';
}

function drawKnitStitch(ctx: CanvasRenderingContext2D, look: FabricLook, id: string, cx: number, top: number, sw: number, rh: number, dpr: number, s: Shades, tilt: number) {
  const key = `${look}|${id}|${s.base}`;
  switch (look) {
    case 'knit':
      return stamp(ctx, key, cx, top, sw, rh, dpr, (c, x, t) => knitV(c, x, t, sw, rh, s));
    case 'purl':
      return stamp(ctx, `${key}|${tilt > 0 ? 1 : 0}`, cx, top, sw, rh, dpr, (c, x, t) => purlBump(c, x, t, sw, rh, s, tilt));
    case 'yo':
      return stamp(ctx, key, cx, top, sw, rh, dpr, (c, x, t) => yoHole(c, x, t, sw, rh, s));
    case 'k2tog':
    case 'ssk': {
      const dir = look === 'k2tog' ? -1 : 1;
      return stamp(ctx, key, cx, top, sw, rh, dpr, (c, x, t) => {
        knitV(c, x - dir * sw * 0.16, t, sw, rh, { ...s, base: s.dark, light: s.base }, { lean: dir * 0.22, spread: 0.85 });
        knitV(c, x, t, sw, rh, s, { lean: dir * 0.55, spread: 0.9, shadow: false });
      });
    }
    case 'cdd':
      return stamp(ctx, key, cx, top, sw, rh, dpr, (c, x, t) => {
        const back = { ...s, base: s.dark, light: s.base };
        knitV(c, x - sw * 0.14, t, sw, rh, back, { lean: -0.45, spread: 0.8 });
        knitV(c, x + sw * 0.14, t, sw, rh, back, { lean: 0.45, spread: 0.8, shadow: false });
        knitV(c, x, t, sw, rh, s, { spread: 0.78, shadow: false, tall: 1.05 });
      });
    case 'sl':
      return stamp(ctx, key, cx, top, sw, rh, dpr, (c, x, t) => knitV(c, x, t, sw, rh, s, { tall: 1.75, spread: 0.72 }));
    case 'twist':
      return stamp(ctx, key, cx, top, sw, rh, dpr, (c, x, t) => knitV(c, x, t, sw, rh, s, { cross: true, spread: 0.85 }));
    case 'inc':
      return stamp(ctx, key, cx, top, sw, rh, dpr, (c, x, t) => {
        const side = id === 'm1l' ? -1 : id === 'm1r' ? 1 : 0;
        if (side) {
          c.save();
          c.strokeStyle = s.dark;
          c.lineWidth = sw * 0.12;
          c.lineCap = 'round';
          c.beginPath();
          c.moveTo(x + side * sw * 0.42, t + rh * 0.95);
          c.lineTo(x + side * sw * 0.12, t + rh * 0.35);
          c.stroke();
          c.restore();
        } else {
          c.save();
          c.fillStyle = s.dark;
          c.beginPath();
          c.ellipse(x + sw * 0.18, t + rh * 0.9, sw * 0.24, rh * 0.16, 0, 0, Math.PI * 2);
          c.fill();
          c.restore();
        }
        knitV(c, x, t, sw, rh, s, { spread: 0.95 });
      });
    case 'bobble':
      // pıtırcık en son ayrıca çizilir; burada zemin olarak ters ilmek
      return stamp(ctx, `purl|p|${s.base}|0`, cx, top, sw, rh, dpr, (c, x, t) => purlBump(c, x, t, sw, rh, s, 0));
    default:
      return undefined;
  }
}

/** Burgu birimi: arkadaki şerit önce, öndeki şerit gölgesiyle üstte */
function drawCable(ctx: CanvasRenderingContext2D, look: FabricLook, x0: number, span: number, top: number, sw: number, rh: number, colorAt: (x: number) => Shades) {
  const half = Math.floor(span / 2);
  const front: [number, number][] = [];
  const back: [number, number][] = [];
  for (let i = 0; i < half; i++) {
    const L = x0 + i,
      R = x0 + half + i;
    // sola burguda öndeki ilmekler sağdan sola geçer
    if (look === 'cableL') {
      front.push([R, L]);
      back.push([L, R]);
    } else {
      front.push([L, R]);
      back.push([R, L]);
    }
  }
  const height = rh * 1.34 * 1.2;
  const bottom = top + rh * 1.02;
  const strand = (pairs: [number, number][], isFront: boolean) => {
    for (const [from, to] of pairs) {
      const xb = (from + 0.5) * sw,
        xt = (to + 0.5) * sw;
      const s = colorAt(from);
      const shade = isFront ? s : { ...s, base: s.dark, light: s.base, dark: s.deep };
      const lean = -(xt - xb) / height;
      knitV(ctx, xb, top, sw, rh, shade, { lean, tall: 1.2, spread: 0.92, shadow: isFront });
    }
  };
  strand(back, false);
  // öndeki şeridin gölgesi
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (const [from, to] of front) {
    const xb = (from + 0.5) * sw,
      xt = (to + 0.5) * sw;
    ctx.beginPath();
    ctx.ellipse((xb + xt) / 2 + sw * 0.08, bottom - height / 2 + rh * 0.1, sw * 0.55, height * 0.55, Math.atan2(height, xt - xb) - Math.PI / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  strand(front, true);
}

/* ── Tığ ────────────────────────────────────────────────────────── */

type CrochetLook = 'sc' | 'hdc' | 'dc' | 'tall' | 'ch' | 'ball' | 'fan' | 'ring' | 'slst';

function crochetLookOf(id: string): CrochetLook {
  switch (id) {
    case '':
    case 'sc':
    case 'scinc':
    case 'sc2tog':
    case 'scblo':
    case 'scflo':
    case 'crab':
      return 'sc';
    case 'slst':
      return 'slst';
    case 'hdc':
      return 'hdc';
    case 'dc':
    case 'dcinc':
    case 'dc2tog':
    case 'v':
    case 'fpdc':
    case 'bpdc':
      return 'dc';
    case 'tr':
    case 'dtr':
    case 'trtr':
      return 'tall';
    case 'ch':
      return 'ch';
    case 'puff':
    case 'bobble':
    case 'popcorn':
      return 'ball';
    case 'shell':
      return 'fan';
    case 'mr':
      return 'ring';
    default:
      return 'sc';
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function crochetStitch(ctx: CanvasRenderingContext2D, look: CrochetLook, cx: number, top: number, sw: number, rh: number, s: Shades) {
  ctx.save();
  ctx.lineCap = 'round';
  if (look === 'ball') {
    bobble(ctx, cx, top + rh * 0.5, Math.min(sw, rh) * 0.5, s);
    ctx.restore();
    return;
  }
  if (look === 'ch' || look === 'ring') {
    ctx.strokeStyle = s.base;
    ctx.lineWidth = Math.min(sw, rh) * 0.2;
    ctx.beginPath();
    if (look === 'ring') ctx.arc(cx, top + rh * 0.5, Math.min(sw, rh) * 0.3, 0, Math.PI * 2);
    else ctx.ellipse(cx, top + rh * 0.5, sw * 0.36, rh * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = s.light;
    ctx.lineWidth = Math.min(sw, rh) * 0.06;
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (look === 'fan') {
    for (let k = -2; k <= 2; k++) {
      ctx.strokeStyle = k % 2 ? s.dark : s.base;
      ctx.lineWidth = sw * 0.16;
      ctx.beginPath();
      ctx.moveTo(cx, top + rh * 0.95);
      ctx.lineTo(cx + k * sw * 0.2, top + rh * 0.12);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }
  const narrow = look === 'dc' || look === 'tall';
  const bw = sw * (narrow ? 0.74 : 0.9);
  const bodyTop = top + rh * (look === 'slst' ? 0.45 : 0.14);
  const bodyH = top + rh * 0.97 - bodyTop;
  // gölge
  ctx.fillStyle = s.deep;
  ctx.globalAlpha = 0.5;
  roundRect(ctx, cx - bw / 2 + sw * 0.03, bodyTop + rh * 0.05, bw, bodyH, sw * 0.2);
  ctx.fill();
  ctx.globalAlpha = 1;
  const g = ctx.createLinearGradient(cx, bodyTop, cx, bodyTop + bodyH);
  g.addColorStop(0, s.light);
  g.addColorStop(0.35, s.base);
  g.addColorStop(1, s.dark);
  ctx.fillStyle = g;
  roundRect(ctx, cx - bw / 2, bodyTop, bw, bodyH, sw * 0.2);
  ctx.fill();
  // tepe halkaları: yatık zincir (<<) görünümü
  if (look !== 'slst') {
    const ty = bodyTop + rh * 0.1;
    ctx.lineWidth = Math.max(0.8, rh * 0.09);
    ctx.strokeStyle = s.deep;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.42, ty + rh * 0.05);
    ctx.quadraticCurveTo(cx, ty + rh * 0.13, cx + bw * 0.42, ty + rh * 0.05);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = s.light;
    ctx.lineWidth = Math.max(0.8, rh * 0.075);
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.4, ty);
    ctx.quadraticCurveTo(cx - bw * 0.1, ty - rh * 0.06, cx + bw * 0.05, ty);
    ctx.moveTo(cx - bw * 0.02, ty + rh * 0.01);
    ctx.quadraticCurveTo(cx + bw * 0.22, ty - rh * 0.05, cx + bw * 0.4, ty);
    ctx.stroke();
  }
  // gövdedeki ilmek izi
  const vTop = bodyTop + bodyH * 0.3;
  const vBot = bodyTop + bodyH * 0.88;
  ctx.lineCap = 'round';
  if (look === 'sc' || look === 'slst') {
    // sık iğnenin önünde küçük V
    ctx.strokeStyle = s.deep;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(0.8, sw * 0.11);
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.3, vTop + rh * 0.04);
    ctx.lineTo(cx, vBot + rh * 0.04);
    ctx.lineTo(cx + bw * 0.3, vTop + rh * 0.04);
    ctx.stroke();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = s.light;
    ctx.lineWidth = Math.max(0.6, sw * 0.07);
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.3, vTop);
    ctx.lineTo(cx, vBot);
    ctx.lineTo(cx + bw * 0.3, vTop);
    ctx.stroke();
  } else {
    // trabzan gövdesi: sarılı ip atmaları
    const wraps = look === 'hdc' ? 1 : look === 'dc' ? 1 : 2;
    for (let k = 0; k < wraps; k++) {
      const y = vTop + (vBot - vTop) * (wraps === 1 ? 0.45 : 0.25 + k * 0.5);
      ctx.strokeStyle = s.deep;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = Math.max(0.8, sw * 0.1);
      ctx.beginPath();
      if (look === 'hdc') {
        ctx.moveTo(cx - bw * 0.38, y + 1);
        ctx.lineTo(cx + bw * 0.38, y + 1);
      } else {
        ctx.moveTo(cx - bw * 0.4, y + rh * 0.12);
        ctx.lineTo(cx + bw * 0.4, y - rh * 0.08);
      }
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = s.light;
      ctx.lineWidth = Math.max(0.6, sw * 0.06);
      ctx.beginPath();
      if (look === 'hdc') {
        ctx.moveTo(cx - bw * 0.38, y);
        ctx.lineTo(cx + bw * 0.38, y);
      } else {
        ctx.moveTo(cx - bw * 0.4, y + rh * 0.1);
        ctx.lineTo(cx + bw * 0.4, y - rh * 0.1);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* ── Ana çizim ──────────────────────────────────────────────────── */

export function renderFabric(canvas: HTMLCanvasElement, src: FabricSource, o: FabricOptions): { width: number; height: number } {
  const size = fabricSize(src, o);
  const { sw, rh, top: mt } = size;
  const dpr = o.dpr;
  canvas.width = Math.max(1, Math.ceil(size.width * dpr));
  canvas.height = Math.max(1, Math.ceil(size.height * dpr));
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const W = src.width,
    H = src.height;
  const tx = Math.max(1, o.tileX ?? 1),
    ty = Math.max(1, o.tileY ?? 1);
  const fallback = src.yarnColor ?? src.palette?.[0]?.hex ?? DEFAULT_YARN;
  const hexAt = (x: number, y: number) => {
    const c = src.colors?.[y * W + x] ?? -1;
    return (c >= 0 ? src.palette?.[c]?.hex : undefined) ?? fallback;
  };

  // zemin: ilmekler arası gölge (en çok kullanılan rengin koyusu)
  const freq = new Map<string, number>();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) freq.set(hexAt(x, y), (freq.get(hexAt(x, y)) ?? 0) + 1);
  const main = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? fallback;
  ctx.fillStyle = mix(main, '#000000', src.craft === 'knit' ? 0.55 : 0.5);
  ctx.fillRect(0, 0, size.width, size.height);

  const bobbles: [number, number, string][] = [];
  const totalRows = H * ty;
  for (let gr = totalRows - 1; gr >= 0; gr--) {
    const y = gr % H;
    const top = mt + gr * rh;
    for (let t = 0; t < tx; t++) {
      const baseX = t * W;
      let x = 0;
      while (x < W) {
        const id = src.symbols[y * W + x] ?? '';
        if (id === CONT) {
          x++;
          continue;
        }
        const span = Math.min(spanOf(id), W - x);
        const cx = (baseX + x + 0.5) * sw;
        const s = shades(hexAt(x, y));
        if (src.craft === 'crochet') {
          crochetStitch(ctx, crochetLookOf(id), cx, top, sw, rh, s);
          x += span;
          continue;
        }
        const look = lookOf(id);
        if (look === 'none') {
          x += span;
          continue;
        }
        if ((look === 'cableL' || look === 'cableR') && span > 1) {
          ctx.save();
          ctx.translate(baseX * sw, 0);
          drawCable(ctx, look, x, span, top, sw, rh, (cx2) => shades(hexAt(cx2, y)));
          ctx.restore();
          x += span;
          continue;
        }
        drawKnitStitch(ctx, look, id, cx, top, sw, rh, dpr, s, (x + gr) % 2 ? 0.05 : -0.05);
        if (look === 'bobble') bobbles.push([cx, top + rh * 0.45, hexAt(x, y)]);
        x += span;
      }
    }
  }
  for (const [cx, cy, hex] of bobbles) bobble(ctx, cx, cy, Math.min(sw * 0.62, rh * 0.95), shades(hex));
  return { width: size.width, height: size.height };
}
