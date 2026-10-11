import { describe, expect, it } from 'vitest';
import { c2cArrow, c2cIntro, c2cRowText, c2cRows, c2cTilesIn } from './c2c';

const SIZES: [number, number][] = [
  [1, 1],
  [3, 3],
  [5, 3],
  [3, 5],
  [12, 11],
  [20, 7],
  [7, 20],
];

describe('C2C köşeden köşeye', () => {
  for (const [w, h] of SIZES) {
    it(`${w}×${h}: toplam karo W×H, sıra sayısı W+H-1`, () => {
      const rows = c2cRows(w, h, new Array(w * h).fill(0));
      expect(rows).toHaveLength(w + h - 1);
      expect(rows.reduce((n, r) => n + r.tiles.length, 0)).toBe(w * h);
      // her hücre tam bir kez
      const seen = new Set(rows.flatMap((r) => r.tiles.map((t) => `${t.x},${t.y}`)));
      expect(seen.size).toBe(w * h);
    });

    it(`${w}×${h}: çapraz uzunlukları ve artırma/eksiltme tutarlı`, () => {
      const rows = c2cRows(w, h, new Array(w * h).fill(0));
      rows.forEach((r, i) => {
        expect(r.tiles.length).toBe(c2cTilesIn(r.row, w, h));
        expect(r.tiles.length).toBe(Math.min(r.row, w, h, w + h - r.row));
        if (i > 0) {
          // yeni karoyla başlamak +1, son karoyu örmeden dönmek -1
          const delta = (r.start === 'inc' ? 1 : 0) - (r.end === 'dec' ? 1 : 0);
          expect(r.tiles.length - rows[i - 1].tiles.length).toBe(delta);
        }
        // komşu karolar çaprazda yan yana
        for (let j = 1; j < r.tiles.length; j++) {
          expect(Math.abs(r.tiles[j].x - r.tiles[j - 1].x)).toBe(1);
          expect(Math.abs(r.tiles[j].y - r.tiles[j - 1].y)).toBe(1);
        }
      });
    });
  }

  it('evreler: artır, orta, eksilt', () => {
    const rows = c2cRows(5, 3, new Array(15).fill(0));
    expect(rows.map((r) => r.tiles.length)).toEqual([1, 2, 3, 3, 3, 2, 1]);
    expect(rows.map((r) => r.phase)).toEqual(['inc', 'inc', 'inc', 'mid', 'mid', 'dec', 'dec']);
  });

  it('sağ elde sağ alt köşeden, solakta sol alt köşeden başlar', () => {
    expect(c2cRows(4, 3, new Array(12).fill(0))[0].tiles[0]).toMatchObject({ x: 3, y: 2 });
    expect(c2cRows(4, 3, new Array(12).fill(0), { leftHanded: true })[0].tiles[0]).toMatchObject({ x: 0, y: 2 });
    expect(c2cArrow('up')).toBe('↗');
    expect(c2cArrow('up', true)).toBe('↖');
  });

  it('renk dizileri örme sırasında', () => {
    // 2×2: alt satır [B, A], üst satır [A, A]
    const colors = [0, 0, 1, 0];
    const rows = c2cRows(2, 2, colors);
    expect(rows[0].runs).toEqual([{ color: 0, count: 1 }]);
    // 2. sıra yukarıdan aşağı: (1,0) sonra (0,1)
    expect(rows[1].dir).toBe('down');
    expect(rows[1].tiles.map((t) => [t.x, t.y])).toEqual([
      [1, 0],
      [0, 1],
    ]);
    expect(rows[1].runs).toEqual([
      { color: 0, count: 1 },
      { color: 1, count: 1 },
    ]);
    for (const r of rows) expect(r.runs.reduce((n, x) => n + x.count, 0)).toBe(r.tiles.length);
  });

  it('metin dört dilde', () => {
    const rows = c2cRows(3, 3, [0, 0, 0, 0, 1, 0, 0, 0, 0]);
    const L = (c: number) => 'AB'[c];
    expect(c2cRowText(rows[2], 'tr', L)).toEqual({ label: '3. sıra (↗ alttan yukarı, 3 kare)', text: 'A ile 1, B ile 1, A ile 1. Başta artır, sonda artır.' });
    expect(c2cRowText(rows[3], 'en', L).text).toBe('2 A. Decrease at start, decrease at end.');
    expect(c2cRowText(rows[0], 'es', L).text).toBe('1 con A.');
    expect(c2cRowText(rows[0], 'pt', L).label).toBe('Carreira 1 (↗ de baixo para cima, 1 quadradinho)');
    expect(c2cIntro('tr')).toContain('{dc}');
  });
});
