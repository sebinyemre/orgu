import { describe, expect, it } from 'vitest';
import { labToRgb, mapToPalette, quantize, resample, rgbToLab, rowsForImage, type RGB } from './quantize';

function image(w: number, h: number, f: (x: number, y: number) => [number, number, number, number?]) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const [r, g, b, a = 255] = f(x, y);
      data.set([r, g, b, a], (y * w + x) * 4);
    }
  return { width: w, height: h, data };
}

const RED: [number, number, number] = [200, 30, 40];
const BLUE: [number, number, number] = [30, 50, 190];

describe('küçültme', () => {
  it('alan ortalaması', () => {
    const img = image(4, 4, (x, y) => (x < 2 && y < 2 ? [255, 0, 0] : [0, 0, 255]));
    const out = resample(img, 2, 2);
    expect(Array.from(out.slice(0, 3))).toEqual([255, 0, 0]);
    expect(Array.from(out.slice(3, 6))).toEqual([0, 0, 255]);
  });
  it('kesirli ölçek ve saydamlık', () => {
    const img = image(3, 1, () => [0, 0, 0, 0]);
    const out = resample(img, 2, 1);
    expect(out[0]).toBeCloseTo(255);
  });
  it('sıra sayısı en/boy oranından', () => {
    expect(rowsForImage(400, 300, 40)).toBe(30);
    expect(rowsForImage(400, 300, 40, 30 / 22)).toBe(41);
  });
});

describe('renk azaltma', () => {
  const img = image(10, 10, (x) => (x < 5 ? RED : BLUE));
  const rgb = resample(img, 10, 10);

  it('iki renkli görsel iki renge iner', () => {
    const r = quantize(rgb, 10, 10, { k: 2 });
    expect(r.palette).toHaveLength(2);
    expect(r.indices).toHaveLength(100);
    const left = r.indices[0],
      right = r.indices[9];
    expect(left).not.toBe(right);
    for (let y = 0; y < 10; y++)
      for (let x = 0; x < 10; x++) expect(r.indices[y * 10 + x]).toBe(x < 5 ? left : right);
    // açıktan koyuya: kırmızı maviden açık
    expect(r.palette[0].r).toBeGreaterThan(150);
    expect(r.counts).toEqual([50, 50]);
  });

  it('deterministik', () => {
    const photo = image(16, 16, (x, y) => [(x * 37 + y * 11) % 256, (x * 7 + y * 53) % 256, (x * y * 3) % 256]);
    const p = resample(photo, 16, 16);
    const a = quantize(p, 16, 16, { k: 5 });
    const b = quantize(p, 16, 16, { k: 5 });
    expect(a).toEqual(b);
    expect(a.palette.length).toBeLessThanOrEqual(5);
    expect(Math.max(...a.indices)).toBeLessThan(a.palette.length);
  });

  it('istenen renk sayısı görseldekinden çoksa fazlası atılır', () => {
    expect(quantize(rgb, 10, 10, { k: 6 }).palette).toHaveLength(2);
  });

  it('sabit paletten (ip sepeti) seçer', () => {
    const fixed: RGB[] = [
      { r: 255, g: 255, b: 255 },
      { r: 0, g: 0, b: 0 },
      { r: 190, g: 40, b: 40 },
      { r: 40, g: 60, b: 180 },
    ];
    const r = quantize(rgb, 10, 10, { k: 2, fixed });
    expect(r.fixedIndex?.slice().sort()).toEqual([2, 3]);
    expect(r.palette).toHaveLength(2);
  });

  it('titreştirme ara tonu iki renge dağıtır', () => {
    const gray = new Float32Array(20 * 20 * 3).fill(128);
    const idx = mapToPalette(gray, 20, 20, [{ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }], true);
    const whites = idx.filter((i) => i === 1).length;
    expect(whites).toBeGreaterThan(120);
    expect(whites).toBeLessThan(280);
    const flat = mapToPalette(gray, 20, 20, [{ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }], false);
    expect(new Set(flat).size).toBe(1);
  });

  it('Lab dönüşümü geri döner', () => {
    for (const c of [RED, BLUE, [250, 240, 230] as [number, number, number]]) {
      const back = labToRgb(rgbToLab(...c));
      expect(Math.abs(back.r - c[0])).toBeLessThanOrEqual(1);
      expect(Math.abs(back.g - c[1])).toBeLessThanOrEqual(1);
      expect(Math.abs(back.b - c[2])).toBeLessThanOrEqual(1);
    }
  });
});
