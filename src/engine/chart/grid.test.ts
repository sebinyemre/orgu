import { describe, expect, it } from 'vitest';
import {
  CONT,
  blankGrid,
  clearUnitAt,
  colorCounts,
  eraseCell,
  extractRegion,
  flipH,
  floodFill,
  lineCells,
  normalize,
  paintCell,
  paletteLetter,
  pasteRegion,
  placeSymbol,
  rectCells,
  remapColors,
  resizeGrid,
  rotate180,
  rowSide,
  rowUnits,
  symmetryTargets,
  unitAt,
} from './grid';
import { History } from './history';

const row = (g: { width: number; symbols: string[] }, y: number) => g.symbols.slice(y * g.width, (y + 1) * g.width);

describe('çok hücreli semboller', () => {
  it('burgu en soldaki hücreye yazılır, devamı > ile işaretlenir', () => {
    const g = blankGrid(6, 1);
    expect(placeSymbol(g, 1, 0, 'c4l')).toBe(1);
    expect(row(g, 0)).toEqual(['', 'c4l', CONT, CONT, CONT, '']);
    expect(unitAt(g, 3, 0)).toEqual({ x: 1, span: 4, id: 'c4l' });
  });

  it('kenardan taşan burgu sola kaydırılır', () => {
    const g = blankGrid(6, 1);
    expect(placeSymbol(g, 4, 0, 'c4r')).toBe(2);
    expect(row(g, 0)).toEqual(['', '', 'c4r', CONT, CONT, CONT]);
  });

  it('birimin herhangi bir hücresi silinince bütün birim gider', () => {
    const g = blankGrid(6, 1);
    placeSymbol(g, 0, 0, 'c6l');
    eraseCell(g, 4, 0, 'symbol');
    expect(row(g, 0)).toEqual(['', '', '', '', '', '']);
  });

  it('üstüne yazılan birim temizlenir', () => {
    const g = blankGrid(6, 1);
    placeSymbol(g, 0, 0, 'c4l');
    paintCell(g, 2, 0, { mode: 'symbol', color: 0, symbol: 'p' });
    expect(row(g, 0)).toEqual(['', '', 'p', '', '', '']);
  });

  it('normalize yetim ve yarım birimleri temizler', () => {
    const g = blankGrid(5, 2);
    g.symbols = [CONT, 'k', 'c4l', CONT, CONT, 'c2l', CONT, CONT, 'p', ''];
    expect(normalize(g)).toBe(true);
    expect(g.symbols).toEqual(['', 'k', '', '', '', 'c2l', CONT, '', 'p', '']);
  });

  it('clearUnitAt renklere dokunmaz', () => {
    const g = blankGrid(4, 1, 2);
    placeSymbol(g, 0, 0, 'c2r');
    clearUnitAt(g, 1, 0);
    expect(g.colors).toEqual([2, 2, 2, 2]);
    expect(row(g, 0)).toEqual(['', '', '', '']);
  });

  it('renk ve sembol birlikte boyanınca renk tüm birime uygulanır', () => {
    const g = blankGrid(5, 1);
    paintCell(g, 1, 0, { mode: 'both', color: 3, symbol: 'c2l' });
    expect(g.colors).toEqual([-1, 3, 3, -1, -1]);
  });
});

describe('ayna ve bölge', () => {
  it('yatay çevirmede birim bütün kalır ve yönü değişir', () => {
    const g = blankGrid(6, 1);
    g.symbols = ['k2tog', 'c4l', CONT, CONT, CONT, 'p'];
    g.colors = [0, 1, 1, 1, 1, 2];
    const f = flipH(g);
    expect(f.symbols).toEqual(['p', 'c4r', CONT, CONT, CONT, 'ssk']);
    expect(f.colors).toEqual([2, 1, 1, 1, 1, 0]);
    expect(rotate180(rotate180(g)).symbols).toEqual(g.symbols);
  });

  it('bölge kopyalanırken kesilen birim düşer, yapıştırma birimi korur', () => {
    const g = blankGrid(6, 2);
    placeSymbol(g, 0, 0, 'c4l');
    placeSymbol(g, 0, 1, 'c2r');
    const r = extractRegion(g, { x: 0, y: 0, w: 3, h: 2 });
    expect(row(r, 0)).toEqual(['', '', '']);
    expect(row(r, 1)).toEqual(['c2r', CONT, '']);
    const t = blankGrid(6, 2);
    pasteRegion(t, r, 3, 0);
    expect(row(t, 1)).toEqual(['', '', '', 'c2r', CONT, '']);
  });

  it('simetri hedefleri ve burgu aynası', () => {
    expect(symmetryTargets(10, 10, 1, 2, 'both')).toEqual([
      { x: 1, y: 2, flipX: false },
      { x: 8, y: 2, flipX: true },
      { x: 1, y: 7, flipX: false },
      { x: 8, y: 7, flipX: true },
    ]);
    expect(symmetryTargets(10, 1, 2, 0, 'v', 4)).toEqual([
      { x: 2, y: 0, flipX: false },
      { x: 4, y: 0, flipX: true },
    ]);
    // ortadaki hücre kendisinin aynası
    expect(symmetryTargets(5, 5, 2, 2, 'both')).toHaveLength(1);
  });
});

describe('araçlar', () => {
  it('çizgi uç noktaları içerir', () => {
    const c = lineCells(0, 0, 4, 2);
    expect(c[0]).toEqual([0, 0]);
    expect(c[c.length - 1]).toEqual([4, 2]);
    expect(c).toHaveLength(5);
  });

  it('dikdörtgen çerçeve ve dolu', () => {
    expect(rectCells(0, 0, 3, 2, false)).toHaveLength(10);
    expect(rectCells(3, 2, 0, 0, true)).toHaveLength(12);
  });

  it('kova bitişik aynı renkleri doldurur', () => {
    const g = blankGrid(4, 3, 0);
    g.colors[1] = 1;
    g.colors[5] = 1;
    g.colors[9] = 1;
    const n = floodFill(g, 0, 0, { mode: 'color', color: 2, symbol: '' });
    expect(n).toBe(3);
    expect(g.colors.filter((c) => c === 2)).toHaveLength(3);
    expect(g.colors[3]).toBe(0);
  });

  it('boyut değiştirme içeriği kaydırır', () => {
    const g = blankGrid(2, 2, 0);
    g.colors = [1, 2, 3, 4];
    const r = resizeGrid(g, { top: 1, bottom: 0, left: 1, right: -1 }, -1);
    expect(r.width).toBe(2);
    expect(r.height).toBe(3);
    expect(r.colors).toEqual([-1, -1, -1, 1, -1, 3]);
  });

  it('renk sayımı ve yeniden eşleme', () => {
    const g = blankGrid(3, 1, 0);
    g.colors = [0, 1, -1];
    g.symbols = ['', 'ns', ''];
    expect(colorCounts(g, 2)).toEqual({ counts: [1, 0], empty: 1 });
    expect(remapColors([0, 1, 2, -1], [-1, 0, 1])).toEqual([-1, 0, 1, -1]);
  });

  it('palet harfleri', () => {
    expect(paletteLetter(0)).toBe('A');
    expect(paletteLetter(25)).toBe('Z');
    expect(paletteLetter(26)).toBe('AA');
  });
});

describe('okuma yönü', () => {
  const flat = { mode: 'flat' as const, firstRowRS: true };
  it('düz örgüde ön yüz sağdan sola, numara sağda', () => {
    expect(rowSide(1, flat)).toEqual({ rs: true, numberSide: 'right', dir: 'rtl' });
    expect(rowSide(2, flat)).toEqual({ rs: false, numberSide: 'left', dir: 'ltr' });
  });
  it('solak modunda aynalanır', () => {
    expect(rowSide(1, flat, true)).toEqual({ rs: true, numberSide: 'left', dir: 'ltr' });
  });
  it('yuvarlakta her tur ön yüz', () => {
    expect(rowSide(2, { mode: 'round', firstRowRS: true })).toEqual({ rs: true, numberSide: 'right', dir: 'rtl' });
  });
  it('birimler okuma yönünde, ilmek yok atlanır', () => {
    const g = blankGrid(5, 1);
    g.symbols = ['k', 'c2l', CONT, 'ns', 'p'];
    expect(rowUnits(g, 0, 'rtl').map((u) => u.id)).toEqual(['p', 'c2l', 'k']);
    expect(rowUnits(g, 0, 'ltr').map((u) => u.x)).toEqual([0, 1, 4]);
  });
});

describe('geri al', () => {
  it('geri al ve yinele', () => {
    const h = new History<number>(3);
    h.push(1);
    h.push(2);
    expect(h.undo(3)).toBe(2);
    expect(h.redo(2)).toBe(3);
    expect(h.canRedo).toBe(false);
    h.push(3);
    h.push(4);
    h.push(5);
    expect(h.size).toBe(3);
  });
  it('bütçe aşılınca eskiler atılır', () => {
    const h = new History<number[]>(100, (s) => s.length, 10);
    h.push([1, 2, 3, 4]);
    h.push([1, 2, 3, 4]);
    h.push([1, 2, 3, 4]);
    expect(h.size).toBe(2);
  });
});
