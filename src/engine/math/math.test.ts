import { describe, expect, it } from 'vitest';
import { castOnFor, lcm, nearestMultiple, normalizeGauge } from './gauge';
import { distribute, spread } from './distribute';
import { metersForArea } from './yarn';

describe('ilmek sayısı', () => {
  it('2×2 lastik için 4ün katı + 2', () => {
    const r = castOnFor(20, 22, 4, 2);
    for (const o of [r.lower, r.upper, r.best]) expect((o.stitches - 2) % 4).toBe(0);
    expect(r.exact).toBeCloseTo(44);
    expect(r.lower.stitches).toBeLessThanOrEqual(44);
    expect(r.upper.stitches).toBeGreaterThanOrEqual(44);
  });
  it('kenar ilmekleri eklenir', () => {
    const r = castOnFor(10, 20, 2, 1, 2);
    expect((r.best.stitches - 3) % 2).toBe(0);
  });
  it('yakın kat ve ekok', () => {
    expect(nearestMultiple(97, 8)).toBe(96);
    expect(lcm(4, 8)).toBe(8);
    expect(lcm(6, 8)).toBe(24);
  });
  it('ölçü örneği normalize edilir', () => {
    const g = normalizeGauge(26, 12, 34, 11);
    expect(g.stitches).toBeCloseTo(21.67, 1);
  });
});

describe('eşit dağıtım', () => {
  it('spread toplamı korur', () => {
    for (const [t, n] of [
      [87, 12],
      [10, 3],
      [100, 7],
      [5, 5],
    ])
      expect(spread(t, n).reduce((a, b) => a + b, 0)).toBe(t);
    expect(spread(87, 13, true).reduce((a, b) => a + b, 0)).toBe(87);
  });
  it('şişte yuvarlak artırma', () => {
    const r = distribute(96, 8, 'inc', 'round');
    expect(r.ok).toBe(true);
    expect(r.after).toBe(104);
    expect(r.groups.every((g) => g.plain === 12)).toBe(true);
  });
  it('şişte düz eksiltme ilmekleri doğru sayar', () => {
    const r = distribute(87, 12, 'dec', 'flat');
    const used = r.groups.reduce((a, g) => a + g.plain + (g.shape ? 2 : 0), 0);
    expect(used).toBe(87);
    expect(r.after).toBe(75);
  });
  it('tığda artırma ilmek tüketir', () => {
    const r = distribute(36, 6, 'inc', 'round', 'crochet');
    expect(r.groups.every((g) => g.plain === 5)).toBe(true);
    expect(r.after).toBe(42);
  });
  it('imkânsız eksiltmede hata', () => {
    expect(distribute(10, 6, 'dec', 'round').ok).toBe(false);
  });
});

describe('ip hesabı', () => {
  it('orta kalınlık bere ~ 150–250 m', () => {
    const m = metersForArea(52, 21, { stitches: 18, rows: 25 }, 'knit');
    expect(m).toBeGreaterThan(120);
    expect(m).toBeLessThan(260);
  });
});
