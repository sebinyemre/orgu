/**
 * Fotoğraftan desen: görseli ilmek ızgarasına küçültür ve renk sayısını azaltır.
 *
 * - resample(): alan ortalamasıyla küçültme (kutu süzgeci), çıktı RGB üçlüleri.
 * - quantize(): Lab uzayında k-ortalamalar. Başlangıç merkezleri en-uzak-nokta (maximin) yöntemiyle
 *   seçilir; rastgelelik yoktur, aynı girdi her zaman aynı sonucu verir.
 * - Sabit palet (ip sepetindeki renkler) verilirse sonuç o renklerden seçilir.
 * - İsteğe bağlı Floyd–Steinberg titreştirme (dithering).
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type Lab = [number, number, number];

/* ── Renk uzayı ─────────────────────────────────────────────────── */

const srgbToLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

const fLab = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);

export function rgbToLab(r: number, g: number, b: number): Lab {
  const R = srgbToLinear(r),
    G = srgbToLinear(g),
    B = srgbToLinear(b);
  const X = (R * 0.4124564 + G * 0.3575761 + B * 0.1804375) / 0.95047;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.072175;
  const Z = (R * 0.0193339 + G * 0.119192 + B * 0.9503041) / 1.08883;
  const fx = fLab(X),
    fy = fLab(Y),
    fz = fLab(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

const labDist2 = (a: Lab, b: Lab) => {
  const d0 = a[0] - b[0],
    d1 = a[1] - b[1],
    d2 = a[2] - b[2];
  return d0 * d0 + d1 * d1 + d2 * d2;
};

export function hexToRgbTriple(hex: string): RGB {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16);
  if (Number.isNaN(n)) return { r: 0, g: 0, b: 0 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHexStr({ r, g, b }: RGB): string {
  const c = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/* ── Küçültme ───────────────────────────────────────────────────── */

export interface ImageLike {
  width: number;
  height: number;
  /** RGBA bayt dizisi (ImageData.data gibi) */
  data: ArrayLike<number>;
}

/**
 * Görseli w × h hücreye alan ortalamasıyla küçültür. Saydam pikseller beyaz zemin üstünde düşünülür.
 * Çıktı: uzunluğu w*h*3 olan RGB dizisi.
 */
export function resample(img: ImageLike, w: number, h: number): Float32Array {
  const out = new Float32Array(w * h * 3);
  const sx = img.width / w,
    sy = img.height / h;
  for (let cy = 0; cy < h; cy++) {
    const y0 = cy * sy,
      y1 = (cy + 1) * sy;
    for (let cx = 0; cx < w; cx++) {
      const x0 = cx * sx,
        x1 = (cx + 1) * sx;
      let r = 0,
        g = 0,
        b = 0,
        wsum = 0;
      for (let py = Math.floor(y0); py < Math.ceil(y1) && py < img.height; py++) {
        const wy = Math.min(py + 1, y1) - Math.max(py, y0);
        if (wy <= 0) continue;
        for (let px = Math.floor(x0); px < Math.ceil(x1) && px < img.width; px++) {
          const wx = Math.min(px + 1, x1) - Math.max(px, x0);
          if (wx <= 0) continue;
          const k = (py * img.width + px) * 4;
          const a = (img.data[k + 3] ?? 255) / 255;
          const ww = wx * wy;
          r += (img.data[k] * a + 255 * (1 - a)) * ww;
          g += (img.data[k + 1] * a + 255 * (1 - a)) * ww;
          b += (img.data[k + 2] * a + 255 * (1 - a)) * ww;
          wsum += ww;
        }
      }
      const o = (cy * w + cx) * 3;
      out[o] = wsum ? r / wsum : 255;
      out[o + 1] = wsum ? g / wsum : 255;
      out[o + 2] = wsum ? b / wsum : 255;
    }
  }
  return out;
}

/* ── Nicemleme ──────────────────────────────────────────────────── */

export interface QuantizeOptions {
  /** renk sayısı (2–12) */
  k: number;
  /** sabit aday renkler (ip sepeti); verilirse sonuç bu renklerden seçilir */
  fixed?: RGB[];
  dither?: boolean;
  iterations?: number;
}

export interface QuantizeResult {
  /** açıktan koyuya sıralı palet */
  palette: RGB[];
  /** her hücre için palet indeksi */
  indices: number[];
  counts: number[];
  /** sabit palet kullanıldıysa her renk için aday indeksi */
  fixedIndex?: number[];
}

interface Bin {
  lab: Lab;
  rgb: RGB;
  weight: number;
}

/** Benzer pikselleri kutulayarak tekil renk listesi çıkarır (hızlı ve deterministik) */
function binColors(rgb: Float32Array): Bin[] {
  const map = new Map<number, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < rgb.length; i += 3) {
    const r = rgb[i],
      g = rgb[i + 1],
      b = rgb[i + 2];
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const e = map.get(key);
    if (e) {
      e.r += r;
      e.g += g;
      e.b += b;
      e.n++;
    } else map.set(key, { r, g, b, n: 1 });
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, e]) => {
      const rgbv = { r: e.r / e.n, g: e.g / e.n, b: e.b / e.n };
      return { rgb: rgbv, lab: rgbToLab(rgbv.r, rgbv.g, rgbv.b), weight: e.n };
    });
}

function kmeans(bins: Bin[], k: number, iterations: number): Lab[] {
  if (!bins.length) return [];
  const kk = Math.min(k, bins.length);
  // başlangıç: en yoğun renk, sonra ağırlıklı en uzak renkler
  let first = 0;
  for (let i = 1; i < bins.length; i++) if (bins[i].weight > bins[first].weight) first = i;
  const centers: Lab[] = [[...bins[first].lab] as Lab];
  const nearest = bins.map((b) => labDist2(b.lab, centers[0]));
  while (centers.length < kk) {
    let best = -1,
      bestScore = -1;
    for (let i = 0; i < bins.length; i++) {
      const score = nearest[i] * Math.sqrt(bins[i].weight);
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    if (best < 0 || nearest[best] === 0) break;
    const c = [...bins[best].lab] as Lab;
    centers.push(c);
    for (let i = 0; i < bins.length; i++) nearest[i] = Math.min(nearest[i], labDist2(bins[i].lab, c));
  }
  // Lloyd yinelemeleri
  const assign = new Int32Array(bins.length);
  for (let it = 0; it < iterations; it++) {
    let moved = false;
    for (let i = 0; i < bins.length; i++) {
      let bi = 0,
        bd = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = labDist2(bins[i].lab, centers[c]);
        if (d < bd) {
          bd = d;
          bi = c;
        }
      }
      if (assign[i] !== bi) moved = true;
      assign[i] = bi;
    }
    const sum = centers.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < bins.length; i++) {
      const s = sum[assign[i]],
        w = bins[i].weight;
      s[0] += bins[i].lab[0] * w;
      s[1] += bins[i].lab[1] * w;
      s[2] += bins[i].lab[2] * w;
      s[3] += w;
    }
    for (let c = 0; c < centers.length; c++) if (sum[c][3] > 0) centers[c] = [sum[c][0] / sum[c][3], sum[c][1] / sum[c][3], sum[c][2] / sum[c][3]];
    if (!moved && it > 0) break;
  }
  return centers;
}

/** Lab → sRGB (yaklaşık ters dönüşüm) */
export function labToRgb([L, a, b]: Lab): RGB {
  const fy = (L + 16) / 116,
    fx = fy + a / 500,
    fz = fy - b / 200;
  const inv = (t: number) => (t * t * t > 216 / 24389 ? t * t * t : (116 * t - 16) / (24389 / 27));
  const X = inv(fx) * 0.95047,
    Y = inv(fy),
    Z = inv(fz) * 1.08883;
  const R = X * 3.2404542 - Y * 1.5371385 - Z * 0.4985314;
  const G = -X * 0.969266 + Y * 1.8760108 + Z * 0.041556;
  const B = X * 0.0556434 - Y * 0.2040259 + Z * 1.0572252;
  const g = (v: number) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(0, v), 1 / 2.4) - 0.055);
  return { r: Math.round(Math.min(255, Math.max(0, g(R)))), g: Math.round(Math.min(255, Math.max(0, g(G)))), b: Math.round(Math.min(255, Math.max(0, g(B)))) };
}

/** Pikselleri palete atar (isteğe bağlı titreştirmeyle) */
export function mapToPalette(rgb: Float32Array, w: number, h: number, palette: RGB[], dither = false): number[] {
  const labs = palette.map((p) => rgbToLab(p.r, p.g, p.b));
  const idxs = new Array<number>(w * h);
  const nearest = (r: number, g: number, b: number) => {
    const L = rgbToLab(r, g, b);
    let bi = 0,
      bd = Infinity;
    for (let c = 0; c < labs.length; c++) {
      const d = labDist2(L, labs[c]);
      if (d < bd) {
        bd = d;
        bi = c;
      }
    }
    return bi;
  };
  if (!dither) {
    for (let i = 0; i < w * h; i++) idxs[i] = nearest(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]);
    return idxs;
  }
  const buf = Float32Array.from(rgb);
  const push = (x: number, y: number, er: number, eg: number, eb: number, f: number) => {
    if (x < 0 || x >= w || y >= h) return;
    const o = (y * w + x) * 3;
    buf[o] += er * f;
    buf[o + 1] += eg * f;
    buf[o + 2] += eb * f;
  };
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 3;
      const r = Math.min(255, Math.max(0, buf[o])),
        g = Math.min(255, Math.max(0, buf[o + 1])),
        b = Math.min(255, Math.max(0, buf[o + 2]));
      const c = nearest(r, g, b);
      idxs[y * w + x] = c;
      const p = palette[c];
      const er = r - p.r,
        eg = g - p.g,
        eb = b - p.b;
      push(x + 1, y, er, eg, eb, 7 / 16);
      push(x - 1, y + 1, er, eg, eb, 3 / 16);
      push(x, y + 1, er, eg, eb, 5 / 16);
      push(x + 1, y + 1, er, eg, eb, 1 / 16);
    }
  return idxs;
}

/** Renk sayısını azaltır. rgb: resample() çıktısı (w*h*3). */
export function quantize(rgb: Float32Array, w: number, h: number, o: QuantizeOptions): QuantizeResult {
  const k = Math.max(1, Math.min(32, Math.round(o.k)));
  const bins = binColors(rgb);
  let palette: RGB[];
  let fixedIndex: number[] | undefined;
  if (o.fixed && o.fixed.length) {
    const candLab = o.fixed.map((c) => rgbToLab(c.r, c.g, c.b));
    let chosen: number[];
    if (o.fixed.length <= k) chosen = o.fixed.map((_, i) => i);
    else {
      // önce serbest merkezler, sonra her merkeze en yakın (kullanılmamış) aday
      const centers = kmeans(bins, k, o.iterations ?? 12);
      const weight = centers.map(() => 0);
      for (const b of bins) {
        let bi = 0,
          bd = Infinity;
        centers.forEach((c, i) => {
          const d = labDist2(b.lab, c);
          if (d < bd) {
            bd = d;
            bi = i;
          }
        });
        weight[bi] += b.weight;
      }
      const order = centers.map((_, i) => i).sort((a, b) => weight[b] - weight[a] || a - b);
      chosen = [];
      for (const ci of order) {
        let best = -1,
          bd = Infinity;
        candLab.forEach((cl, j) => {
          if (chosen.includes(j)) return;
          const d = labDist2(cl, centers[ci]);
          if (d < bd) {
            bd = d;
            best = j;
          }
        });
        if (best >= 0) chosen.push(best);
      }
    }
    palette = chosen.map((i) => ({ ...o.fixed![i] }));
    fixedIndex = chosen;
  } else {
    palette = kmeans(bins, k, o.iterations ?? 16).map(labToRgb);
  }

  let indices = mapToPalette(rgb, w, h, palette, o.dither);
  // kullanılmayan renkleri at, açıktan koyuya sırala
  const counts = palette.map(() => 0);
  for (const i of indices) counts[i]++;
  const keep = palette
    .map((p, i) => ({ i, L: rgbToLab(p.r, p.g, p.b)[0], n: counts[i] }))
    .filter((e) => e.n > 0)
    .sort((a, b) => b.L - a.L || a.i - b.i);
  const remap = new Array(palette.length).fill(0);
  keep.forEach((e, j) => (remap[e.i] = j));
  indices = indices.map((i) => remap[i]);
  return {
    palette: keep.map((e) => palette[e.i]),
    indices,
    counts: keep.map((e) => e.n),
    fixedIndex: fixedIndex ? keep.map((e) => fixedIndex![e.i]) : undefined,
  };
}

/**
 * Görsel en/boy oranından sıra sayısı. aspect: hücre en/boy oranı (oranlı kağıtta satır/ilmek ölçüsü, kare kağıtta 1).
 */
export function rowsForImage(imgW: number, imgH: number, stitches: number, aspect = 1): number {
  return Math.max(1, Math.round((stitches * imgH * aspect) / imgW));
}
