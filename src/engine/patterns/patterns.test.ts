import { describe, expect, it } from 'vitest';
import type { Lang } from '@/types';
import { LESSON_BY_ID } from '@/knowledge/curriculum';
import { PATTERN_BY_ID, fitsPattern } from '@/knowledge/stitchPatterns';
import { TEMPLATES, generatePattern, KNIT_SCARF_STITCHES, CROCHET_SCARF_STITCHES, COWL_STITCHES, BLANKET_CENTERS, HAT_BODIES, HAT_RIBS } from './index';
import { circleRounds, checkCircle, CIRCLE_START } from './coaster';
import { grannyRounds, borderFirstRound } from './granny';
import { crownRounds, knitHatPlan, SECTIONS } from './knitHat';
import { knitScarfPlan } from './knitScarf';
import { crochetScarfPlan } from './crochetScarf';
import { crochetHatPlan } from './crochetHat';
import { cowlPlan } from './cowl';
import { blanketPlan } from './babyBlanket';
import { lessonIdsIn } from './builder';
import { allText, baseParams } from './testUtil';

const LANGS: Lang[] = ['tr', 'en', 'es', 'pt'];
const G18 = { stitches: 18, rows: 25 };

describe('bardak altlığı (düz daire)', () => {
  it('her tur başlangıç sayısının katı ve önceki turu tüketir', () => {
    for (const st of ['sc', 'hdc', 'dc'] as const) {
      const s = CIRCLE_START[st];
      const r = circleRounds(s, 9, true);
      expect(checkCircle(r)).toBe(true);
      r.forEach((x, i) => expect(x.count).toBe(s * (i + 1)));
    }
  });
});

describe('büyükanne karesi', () => {
  it('her turda 4 köşe, 4n küme, 12n trabzan', () => {
    for (const r of grannyRounds(12)) {
      expect(r.corners).toBe(4);
      expect(r.clusters).toBe(4 * r.n);
      expect(r.dc).toBe(3 * r.clusters);
      expect(r.sideSpaces).toBe(4 * (r.n - 1));
    }
  });
  it('kenar 1. tur formülü tek karede doğrudan sayımla aynı', () => {
    for (let n = 1; n <= 8; n++) expect(borderFirstRound(1, 1, n)).toBe(4 * (4 * n - 1) + 4 * 3);
  });
  it('tarif metninde her turun 3 köşe tekrarı ve 4 köşe notu var', () => {
    const p = generatePattern('buyukanne-karesi', baseParams('en', { rounds: 5 }));
    const steps = p.sections[0].steps;
    expect(steps).toHaveLength(5);
    steps.forEach((s, i) => {
      expect(s.count).toBe(12 * (i + 1));
      expect(s.note).toMatch(/4 corners/);
    });
  });
});

describe('şiş bere', () => {
  it('tepe 8 ilmeğe iner, her eksiltme turu dilim başı 1 azaltır', () => {
    for (let S = 6; S <= 18; S++) {
      for (const target of [undefined, 10, 16, 22]) {
        const c = crownRounds(S, target);
        expect(c[c.length - 1].count).toBe(SECTIONS);
        let prev = S;
        for (const r of c) {
          if (r.dec) {
            expect(r.per).toBe(prev - 1);
            prev = r.per;
          } else expect(r.per).toBe(prev);
          expect(r.count).toBe(r.per * SECTIONS);
        }
        expect(c.filter((x) => x.dec)).toHaveLength(S - 1);
      }
    }
  });
  it('ilmek sayısı lastik katına, gövde katına ve 8’e uyar', () => {
    for (const rib of HAT_RIBS)
      for (const body of HAT_BODIES)
        for (const head of [35, 45, 51, 56, 58.5]) {
          const plan = knitHatPlan({ headCm: head, heightCm: 21, brimCm: 5, ribId: rib, bodyId: body, foldBrim: false }, G18);
          expect(plan.castOn % 8).toBe(0);
          expect(plan.castOn % (PATTERN_BY_ID[rib].round?.multiple ?? 1)).toBe(0);
          expect(plan.castOn % (PATTERN_BY_ID[body].round?.multiple ?? 1)).toBe(0);
          expect(plan.circumference).toBeLessThan(head);
          expect(plan.circumference).toBeGreaterThan(head * 0.8);
        }
  });
  it('yetişkin orta kalın bere 120–300 m', () => {
    const p = generatePattern('bere', baseParams('tr', { circumferenceCm: 56, heightCm: 21, ribId: 'lastik-2x2', bodyId: 'jarse', yarn: { weight: 4, colors: [{ hex: '#46698a' }] } }));
    expect(p.yarnMeters).toBeGreaterThan(120);
    expect(p.yarnMeters).toBeLessThan(300);
    const counts = p.sections.flatMap((s) => s.steps).filter((s) => s.count).map((s) => s.count!);
    expect(counts[counts.length - 1]).toBe(8);
  });
});

describe('şiş atkı', () => {
  it('ilmek sayısı desen katına uyar (her desen, her genişlik)', () => {
    for (const id of KNIT_SCARF_STITCHES)
      for (const w of [12, 18, 20, 25, 30, 50])
        for (const sel of [true, false]) {
          const plan = knitScarfPlan(id, w, 160, G18, sel);
          expect(fitsPattern(plan.center, PATTERN_BY_ID[id].flat)).toBe(true);
          expect(plan.castOn - plan.center).toBe(plan.edge);
          expect(Math.abs(plan.widthCm - w)).toBeLessThan(Math.max(4, (PATTERN_BY_ID[id].flat.multiple * 10) / G18.stitches));
        }
  });
  it('haraşo atkı metresi makul', () => {
    const p = generatePattern('atki', baseParams('en', { stitchId: 'haraso', widthCm: 20, lengthCm: 160, yarn: { weight: 4, colors: [{ hex: '#b5523b' }] } }));
    expect(p.yarnMeters).toBeGreaterThan(250);
    expect(p.yarnMeters).toBeLessThan(800);
  });
});

describe('tığ atkı', () => {
  it('temel zincir desen katına ve dönüş zincirine uyar', () => {
    const g = { stitches: 12, rows: 9 };
    for (const id of CROCHET_SCARF_STITCHES)
      for (const w of [12, 18, 25]) {
        const plan = crochetScarfPlan(id, w, 150, g);
        expect(fitsPattern(plan.sts, PATTERN_BY_ID[id].flat)).toBe(true);
        expect(Number.isInteger(plan.units)).toBe(true);
        if (id === 'tig-v') expect(plan.chain).toBe(3 * plan.units + 4);
        if (id === 'tig-yelpaze') expect(plan.chain).toBe(6 * plan.units + 2);
        if (id === 'tig-kum') expect(plan.chain % 2).toBe(0);
        if (id === 'tig-sik-igne') expect(plan.chain).toBe(plan.sts + 1);
      }
  });
});

describe('tığ bere', () => {
  it('8’in katı, tepe dairesi düzgün', () => {
    for (const head of [35, 41, 48, 56, 58.5]) {
      const plan = crochetHatPlan(head, 20, 4, 'rib', { stitches: 12, rows: 9 });
      expect(plan.sts % 8).toBe(0);
      expect(plan.circumference).toBeLessThan(head);
      expect(plan.circumference).toBeGreaterThan(head * 0.85);
      expect(Math.abs(plan.height - 20)).toBeLessThan(2.5);
    }
  });
});

describe('boyunluk ve battaniye', () => {
  it('boyunluk ilmeği yuvarlak desen katına uyar', () => {
    for (const id of COWL_STITCHES) {
      const plan = cowlPlan(id, 65, 25, 'rib', G18);
      expect(plan.castOn % (PATTERN_BY_ID[id].round?.multiple ?? 1)).toBe(0);
      expect(plan.castOn % 2).toBe(0);
    }
  });
  it('battaniye ortası desene uyar, pirinç kenarda toplam tek sayı', () => {
    for (const id of BLANKET_CENTERS)
      for (const border of ['haraso', 'pirinc'] as const) {
        const plan = blanketPlan(id, border, 80, 100, 4, G18);
        expect(fitsPattern(plan.center, PATTERN_BY_ID[id].flat)).toBe(true);
        if (border === 'pirinc') expect(plan.castOn % 2).toBe(1);
        expect(plan.borderRows % 2).toBe(0);
      }
  });
});

describe('tüm şablonlar, dört dil', () => {
  const variants: Record<string, object[]> = {
    'amigurumi-top': [{ diameterCm: 7 }, { diameterCm: 15, staggered: false, stripeRows: 3 }],
    'bardak-altligi': [{ crochetStitch: 'sc' }, { crochetStitch: 'dc', count: 4, colorMode: 'rounds', edge: 'crab' }],
    'buyukanne-karesi': [{ rounds: 3 }, { rounds: 6, blanketCols: 4, blanketRows: 5, join: 'sc', borderRounds: 3 }],
    'atki-tig': CROCHET_SCARF_STITCHES.map((stitchId, i) => ({ stitchId, stripeRows: i % 2 ? 2 : 0, fringe: i === 2 })),
    'bere-tig': [{ brim: 'rib' }, { brim: 'sc', pompom: true }, { brim: 'none', circumferenceCm: 41, heightCm: 15 }],
    atki: ['haraso', 'yalanci-selanik', 'burgu-6', 'dalga-ajur', 'selanik'].map((stitchId) => ({ stitchId, stripeRows: 2 })),
    bere: [{ bodyId: 'burgu-6', foldBrim: true, pompom: true }, { bodyId: 'pirinc', ribId: 'lastik-1x1', circumferenceCm: 41, heightCm: 15 }],
    boyunluk: [{ stitchId: 'jarse' }, { stitchId: 'sepet', edge: 'rib', circumferenceCm: 130 }],
    'bebek-battaniyesi': [{ stitchId: 'dalga-ajur', borderId: 'pirinc' }, { stitchId: 'burgu-6' }],
    'olcu-ornegi': [{ craft: 'knit', stitchId: 'jarse' }, { craft: 'crochet', crochetStitch: 'hdc' }],
  };
  for (const t of TEMPLATES) {
    it(`${t.id}: metin temiz, kimlikler dilden bağımsız, ders bağlantıları geçerli`, () => {
      for (const v of variants[t.id] ?? [{}]) {
        const ids: string[][] = [];
        for (const lang of LANGS) {
          for (const crochetEn of lang === 'en' ? (['us', 'uk'] as const) : (['us'] as const)) {
            const p = generatePattern(t.id, baseParams(lang, { ...v, ctx: { lang, trabzan: 'ingilizce', crochetEn } }));
            const txt = allText(p);
            expect(txt, `${t.id} ${lang}`).not.toMatch(/\{[a-zA-Z.]+\}/);
            expect(txt).not.toMatch(/undefined|NaN|\[object/);
            expect(txt).not.toMatch(/—/);
            expect(String(p.params.gaugeLabel)).not.toMatch(/\{/);
            for (const id of lessonIdsIn(txt)) expect(LESSON_BY_ID[id], `${t.id}: ${id}`).toBeDefined();
            for (const a of p.abbreviations) if (a.lessonId) expect(LESSON_BY_ID[a.lessonId]).toBeDefined();
            for (const s of p.sections) for (const st of s.steps) for (const l of st.lessonIds ?? []) expect(LESSON_BY_ID[l], l).toBeDefined();
            expect(p.yarnMeters).toBeGreaterThan(0);
            expect(p.sections.length).toBeGreaterThan(0);
            ids.push(p.sections.flatMap((s) => s.steps.map((x) => x.id)));
            const flat = ids[ids.length - 1];
            expect(new Set(flat).size).toBe(flat.length);
          }
        }
        for (const x of ids) expect(x).toEqual(ids[0]);
      }
    });
  }
});
