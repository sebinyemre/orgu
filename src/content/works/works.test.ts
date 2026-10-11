import { describe, expect, it } from 'vitest';
import type { Lang } from '@/types';
import { LESSON_BY_ID } from '@/knowledge/curriculum';
import { lessonIdsIn } from '@/engine/patterns';
import { allText } from '@/engine/patterns/testUtil';
import { WORKS, generateWork } from './index';
import { bootiePlan } from './special/booties';
import { bagPlan } from './special/marketBag';
import { headbandPlan } from './special/headband';
import { dishclothPlan } from './special/dishcloth';

const LANGS: Lang[] = ['tr', 'en', 'es', 'pt'];
const ctx = (lang: Lang, crochetEn: 'us' | 'uk' = 'us') => ({ lang, trabzan: 'ipatma' as const, crochetEn });

describe('eserler', () => {
  it('en az 14 eser, iki zanaat, dört kategori', () => {
    expect(WORKS.length).toBeGreaterThanOrEqual(14);
    expect(new Set(WORKS.map((w) => w.craft)).size).toBe(2);
    expect(new Set(WORKS.map((w) => w.category)).size).toBe(4);
    expect(new Set(WORKS.map((w) => w.id)).size).toBe(WORKS.length);
  });

  for (const w of WORKS) {
    it(`${w.id}: her beden ve dilde temiz tarif`, () => {
      for (const l of w.lessons) expect(LESSON_BY_ID[l], l).toBeDefined();
      expect(w.defaultColors.length).toBeGreaterThanOrEqual(w.colorSlots.length);
      expect(w.sizes.some((s) => s.id === w.defaultSize)).toBe(true);
      for (const s of w.sizes) {
        const ids: string[][] = [];
        for (const lang of LANGS) {
          const p = generateWork(w.id, { sizeId: s.id }, ctx(lang, lang === 'en' && w.craft === 'crochet' ? 'uk' : 'us'), 'cm');
          const txt = allText(p);
          expect(txt, `${w.id}/${s.id}/${lang}`).not.toMatch(/\{[a-zA-Z.]+\}/);
          expect(txt).not.toMatch(/undefined|NaN|\[object/);
          expect(txt).not.toMatch(/—/);
          for (const id of lessonIdsIn(txt)) expect(LESSON_BY_ID[id], id).toBeDefined();
          expect(p.params.workId).toBe(w.id);
          expect(p.params.workSizeId).toBe(s.id);
          expect(p.yarnMeters).toBeGreaterThan(5);
          ids.push(p.sections.flatMap((x) => x.steps.map((st) => st.id)));
        }
        for (const x of ids) expect(x).toEqual(ids[0]);
      }
    });
  }

  it('renkler tarife geçer', () => {
    const p = generateWork('buyukanne-karesi', { colors: ['#111111', '#222222', '#333333', '#444444'] }, ctx('en'), 'cm');
    expect(p.diagram?.kind === 'granny' && p.diagram.colors).toEqual(['#111111', '#222222', '#333333', '#444444']);
  });
});

describe('özel eser matematiği', () => {
  it('patik: her sıra önceki sayıyı tüketir', () => {
    for (const foot of [8, 9, 11, 12])
      for (const g of [
        { stitches: 22, rows: 30 },
        { stitches: 26, rows: 36 },
      ]) {
        const p = bootiePlan(foot, 2.5, 3.5, g);
        const a = p.a;
        expect(p.castOn).toBe(2 * a + 4);
        // artırma sıraları: K j, M1, K a, M1, K 2j, M1, K a, M1, K j
        let count = p.castOn;
        [1, 2, 3].forEach((j, i) => {
          expect(j + a + 2 * j + a + j).toBe(count);
          count += 4;
          expect(count).toBe(p.sole[i]);
        });
        // eksiltme sıraları
        expect(a + 16 + a).toBe(p.sole[2]);
        expect(a + 8 + a).toBe(p.toe[0]);
        expect(2 * (a - 2) + 12).toBe(p.toe[0]);
        expect(2 * (a - 2) + 6).toBe(p.toe[1]);
        expect(2 * (a - 3) + 8).toBe(p.toe[1]);
        expect(2 * (a - 3) + 4).toBe(p.toe[2]);
        expect(p.cuffSts % 2).toBe(0);
        expect(Math.abs(p.footCm - foot)).toBeLessThan(1.5);
      }
  });

  it('file çanta: halkalar tabana, saplar banda tam oturur', () => {
    for (const base of [16, 18, 22, 26]) {
      const p = bagPlan(base, 30, 30, { stitches: 11, rows: 7 });
      expect(p.N % 12).toBe(0);
      expect(p.loops * 3).toBe(p.N);
      expect(p.k % 2).toBe(0);
      expect(Number.isInteger(p.a)).toBe(true);
      expect(4 * p.a + 2 * p.k).toBe(p.N);
      expect(p.a).toBeGreaterThan(0);
    }
  });

  it('kulaklık bant ve bulaşık bezi ölçüleri', () => {
    const h = headbandPlan(56, 10, { stitches: 9, rows: 7 });
    expect(h.lengthCm).toBeLessThan(56);
    expect(h.lengthCm).toBeGreaterThan(45);
    const d = dishclothPlan(22, { stitches: 18, rows: 25 });
    expect(d.center % 2).toBe(1);
    expect(Math.abs(d.widthCm - 22)).toBeLessThan(2);
  });
});
