import { describe, expect, it } from 'vitest';
import { FONT_HEIGHT, GLYPHS, normalizeText, textBitmap } from './font';

describe('piksel yazı tipi', () => {
  it('her glif 7 satır ve düzgün genişlikte', () => {
    for (const [ch, g] of Object.entries(GLYPHS)) {
      expect(g, ch).toHaveLength(FONT_HEIGHT);
      expect(new Set(g.map((r) => r.length)).size, ch).toBe(1);
      expect(g.join('')).toMatch(/^[.#]+$/);
    }
  });

  it('Türkçe harfler ve rakamlar var', () => {
    for (const ch of 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789') expect(GLYPHS[ch], ch).toBeDefined();
  });

  it('dile göre büyük harf', () => {
    expect(normalizeText('istanbul', 'tr')).toBe('İSTANBUL');
    expect(normalizeText('istanbul', 'en')).toBe('ISTANBUL');
    expect(normalizeText('ılık', 'tr')).toBe('ILIK');
    expect(normalizeText('a~b', 'en')).toBe('AB');
  });

  it('bitmap boyutu', () => {
    const b = textBitmap('AB');
    expect(b.height).toBe(7);
    expect(b.width).toBe(11);
    expect(b.cells.filter(Boolean).length).toBeGreaterThan(20);
    const two = textBitmap('A\nB');
    expect(two.height).toBe(16);
    expect(two.width).toBe(5);
  });
});
