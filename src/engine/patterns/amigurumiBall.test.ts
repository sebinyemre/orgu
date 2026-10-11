import { describe, expect, it } from 'vitest';
import { amigurumiBall, checkSphere, sphereRounds, sphereSize } from './amigurumiBall';
import { consumed, produced } from './rounds';
import { allText, baseParams } from './testUtil';

describe('amigurumi top', () => {
  it('her tur 6’nın katı, tüketim önceki tura eşit ve simetrik', () => {
    for (const stag of [false, true]) {
      for (let K = 3; K <= 12; K++) {
        const r = sphereRounds(K, K + 1, stag);
        expect(checkSphere(r)).toBe(true);
        for (const x of r) {
          expect(x.count % 6).toBe(0);
          expect(produced(x.tokens)).toBe(x.count);
        }
        const inc = r.filter((x) => x.kind === 'start' || x.kind === 'inc').map((x) => x.count);
        const dec = r.filter((x) => x.kind === 'dec').map((x) => x.count);
        // eksiltme turları artırma turlarının aynası (son tur 6)
        expect([...dec].reverse()).toEqual(inc.slice(0, -1));
        expect(Math.max(...r.map((x) => x.count))).toBe(6 * K);
        expect(r[r.length - 1].count).toBe(6);
        expect(consumed(r[1].tokens)).toBe(6);
      }
    }
  });

  it('kaydırmalı artırmada artırmalar üst üste binmez', () => {
    const r = sphereRounds(8, 9, true);
    expect(r.some((x) => x.stag)).toBe(true);
    expect(r.filter((x) => x.kind === 'inc').every((x, i, a) => i === 0 || x.stag !== a[i - 1].stag || x.m < 2)).toBe(true);
  });

  it('boyut makul: 10 cm top için ~ 36–60 ilmeklik ekvator', () => {
    const s = sphereSize(10, { stitches: 18, rows: 19 });
    expect(6 * s.K).toBeGreaterThanOrEqual(36);
    expect(6 * s.K).toBeLessThanOrEqual(60);
    expect(Math.abs(s.actualDiameter - 10)).toBeLessThan(1.5);
  });

  it('tarif dört dilde üretilir, yer tutucu kalmaz, metre makul', () => {
    for (const lang of ['tr', 'en', 'es', 'pt'] as const) {
      const p = amigurumiBall(baseParams(lang, { toolMm: 3, yarn: { weight: 3, metersPerSkein: 150, gramsPerSkein: 50, colors: [{ hex: '#f2c84b' }, { hex: '#46698a' }] }, diameterCm: 8, stripeRows: 2 }));
      const txt = allText(p);
      expect(txt).not.toMatch(/\{[a-zA-Z.]+\}/);
      expect(txt).not.toMatch(/undefined|NaN/);
      expect(txt).not.toMatch(/—/);
      expect(p.yarnMeters).toBeGreaterThan(10);
      expect(p.yarnMeters).toBeLessThan(120);
      const counts = p.sections.flatMap((s) => s.steps).filter((s) => s.count).map((s) => s.count!);
      expect(counts[0]).toBe(6);
      expect(counts[counts.length - 1]).toBe(6);
      expect(p.sections[0].steps[0].text).toContain('[[tig-sihirli-halka|');
    }
  });

  it('İngiltere terimlerinde sc yerine dc yazar', () => {
    const p = amigurumiBall(baseParams('en', { ctx: { lang: 'en', trabzan: 'ipatma', crochetEn: 'uk' }, diameterCm: 7 }));
    expect(p.sections[0].steps[0].text).toMatch(/6 dc/);
  });
});
