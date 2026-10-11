import { describe, expect, it } from 'vitest';
import type { ChartDoc } from '@/types';
import { addColor, beginEdit, commitEdit, loadChart, moveColor, redo, removeColor, undo, useEditor } from './state';

function chart(): ChartDoc {
  return {
    id: 'g1',
    name: 'Deneme',
    craft: 'knit',
    width: 3,
    height: 1,
    colors: [0, 1, 2],
    symbols: ['', 'p', ''],
    palette: [
      { id: 'a', hex: '#ffffff', name: 'Beyaz', letter: 'A' },
      { id: 'b', hex: '#ff0000', name: 'Kırmızı', letter: 'B' },
      { id: 'c', hex: '#0000ff', name: 'Mavi', letter: 'C' },
    ],
    mode: 'flat',
    firstRowRS: true,
    proportional: false,
    createdAt: 0,
    updatedAt: 0,
  };
}

const doc = () => useEditor.getState().doc;

describe('düzenleyici paleti', () => {
  it('sıralama renk indekslerini ve harfleri günceller', () => {
    loadChart(chart());
    moveColor(0, 1);
    expect(doc().palette.map((p) => p.name)).toEqual(['Kırmızı', 'Beyaz', 'Mavi']);
    expect(doc().palette.map((p) => p.letter)).toEqual(['A', 'B', 'C']);
    expect(doc().colors).toEqual([1, 0, 2]);
  });

  it('silinen rengin kareleri seçilen renge geçer, üstteki indeksler kayar', () => {
    loadChart(chart());
    removeColor(1, 2);
    expect(doc().palette.map((p) => p.name)).toEqual(['Beyaz', 'Mavi']);
    expect(doc().colors).toEqual([0, 1, 1]);
    loadChart(chart());
    removeColor(0, -1);
    expect(doc().colors).toEqual([-1, 0, 1]);
  });

  it('geri al / yinele', () => {
    loadChart(chart());
    expect(addColor('#00ff00', 'Yeşil')).toBe(true);
    expect(doc().palette).toHaveLength(4);
    expect(useEditor.getState().color).toBe(3);
    undo();
    expect(doc().palette).toHaveLength(3);
    redo();
    expect(doc().palette[3].letter).toBe('D');
  });

  it('değişmeyen düzenleme geçmişe yazılmaz', () => {
    loadChart(chart());
    beginEdit();
    commitEdit();
    expect(useEditor.getState().canUndo).toBe(false);
    beginEdit();
    doc().colors[0] = 2;
    commitEdit();
    expect(useEditor.getState().canUndo).toBe(true);
    undo();
    expect(doc().colors[0]).toBe(0);
  });
});
