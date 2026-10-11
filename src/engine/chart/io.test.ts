import { describe, expect, it } from 'vitest';
import { exportCharts, parseChartsJSON, sanitizeChart } from './io';
import { CHART_TEMPLATES } from './templates';
import { normalize } from './grid';

let n = 0;
const id = (p: string) => `${p}_${++n}`;

describe('içe/dışa aktarma', () => {
  const doc = {
    id: 'x',
    name: 'Kalp',
    craft: 'knit',
    width: 2,
    height: 2,
    colors: [0, 1, 5, -1],
    symbols: ['k', '>', 'c2l', '>'],
    palette: [{ hex: '#FF0000', name: 'Kırmızı' }, { hex: 'bad' }],
    mode: 'flat',
    firstRowRS: true,
    proportional: false,
    repeat: { x: 0, y: 0, w: 5, h: 1 },
  };

  it('geçersiz değerleri onarır', () => {
    const c = sanitizeChart(doc, id)!;
    expect(c.id).not.toBe('x');
    expect(c.colors).toEqual([0, 1, -1, -1]);
    expect(c.symbols).toEqual(['k', '', 'c2l', '>']);
    expect(c.palette.map((p) => p.hex)).toEqual(['#ff0000', '#9e9e9e']);
    expect(c.palette.map((p) => p.letter)).toEqual(['A', 'B']);
    expect(c.repeat).toBeUndefined();
  });

  it('paket, dizi ve tek grafik kabul edilir', () => {
    expect(parseChartsJSON(exportCharts([doc as never]), id)).toHaveLength(1);
    expect(parseChartsJSON([doc, doc], id)).toHaveLength(2);
    expect(parseChartsJSON(doc, id)).toHaveLength(1);
    expect(parseChartsJSON({ width: 0 }, id)).toHaveLength(0);
    expect(parseChartsJSON('metin', id)).toHaveLength(0);
  });
});

describe('şablonlar', () => {
  it('her şablon geçerli bir ızgara üretir', () => {
    for (const t of CHART_TEMPLATES) {
      const d = t.build();
      expect(d.colors, t.id).toHaveLength(d.width * d.height);
      expect(d.symbols, t.id).toHaveLength(d.width * d.height);
      expect(d.colors.every((c) => c >= -1 && c < d.palette.length), t.id).toBe(true);
      const g = { width: d.width, height: d.height, colors: d.colors.slice(), symbols: d.symbols.slice() };
      expect(normalize(g), t.id).toBe(false);
      expect(d.width).toBeLessThanOrEqual(200);
    }
  });
});
