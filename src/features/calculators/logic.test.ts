import { describe, expect, it } from 'vitest';
import { CROCHET_BASICS } from '@/knowledge/terms';
import { HOOK_SIZES, NEEDLE_SIZES } from '@/knowledge/tools';
import {
  areaOf,
  castOn,
  checkRound,
  circlePlan,
  cleanUs,
  compareGauge,
  convertPatternCount,
  foundationChain,
  fromUnit,
  gaugeSpanCm,
  gramsFromSwatch,
  matchSize,
  metersForCm2,
  normalizeSwatch,
  patternPerTen,
  perTenCm,
  substitution,
  toUnit,
  wpiFrom,
} from './logic';

describe('birimler', () => {
  it('cm ↔ inç gidiş dönüş bozulmaz', () => {
    expect(toUnit(fromUnit(8, 'in'), 'in')).toBe(8);
    expect(toUnit(fromUnit(8.5, 'in'), 'in')).toBe(8.5);
    expect(toUnit(20, 'cm')).toBe(20);
    expect(gaugeSpanCm('in')).toBeCloseTo(10.16);
  });
  it('ölçü örneği başka açıklıkta verilebilir', () => {
    expect(perTenCm(22, 10)).toBe(22);
    expect(perTenCm(11, 5)).toBe(22);
    expect(Number.isNaN(perTenCm(0, 10))).toBe(true);
  });
});

describe('kaç ilmek', () => {
  it('lastik jarse ölçüsüyle verilirse büzme payı eklenir', () => {
    expect(patternPerTen(20, 0.8, 'stockinette')).toBe(25);
    expect(patternPerTen(20, 0.8, 'pattern')).toBe(20);
  });
  it('desen katı ve kenar ilmekleri korunur', () => {
    const r = castOn({
      widthCm: 30,
      perTen: 18,
      multiple: 4,
      plus: 2,
      edge: 2,
    })!;
    for (const o of [r.lower, r.upper]) expect((o.stitches - 4) % 4).toBe(0);
    expect(r.lower.widthCm).toBeLessThanOrEqual(30 + 1e-9);
    expect(r.upper.widthCm).toBeGreaterThanOrEqual(30 - 1e-9);
  });
  it('geçersiz girişte sonuç yok', () => {
    expect(castOn({ widthCm: 0, perTen: 18, multiple: 1, plus: 0, edge: 0 })).toBeNull();
  });
});

describe('temel zincir', () => {
  it('sık iğne: ilmek + 1', () => {
    expect(foundationChain(20, CROCHET_BASICS.sc)).toEqual({
      chain: 21,
      intoChain: 2,
      skippedCount: false,
    });
  });
  it('yarım trabzan: ilmek + 2', () => {
    expect(foundationChain(20, CROCHET_BASICS.hdc).chain).toBe(22);
  });
  it('trabzan: atlanan 3 zincir ilk ilmek sayılır', () => {
    const f = foundationChain(20, CROCHET_BASICS.dc);
    expect(f.chain).toBe(22);
    expect(f.intoChain).toBe(4);
    expect(f.skippedCount).toBe(true);
    // 22 zincir: 4. zincire ilk trabzan → 19 trabzan + atlanan 3 zincir (1 ilmek) = 20
    expect(f.chain - (f.intoChain - 1) + 1).toBe(20);
  });
  it('2 ip atmalı trabzan: ilmek + 3', () => {
    expect(foundationChain(10, CROCHET_BASICS.tr).chain).toBe(13);
  });
});

describe('WPI', () => {
  it('2,54 cm üzerindeki sarım doğrudan WPI', () => {
    expect(wpiFrom(10, 2.54)).toBeCloseTo(10);
    expect(wpiFrom(20, 5.08)).toBeCloseTo(10);
    expect(wpiFrom(10, 2.5)).toBeCloseTo(10.16);
  });
});

describe('tığ dairesi', () => {
  it('her tur başlangıç sayısı kadar artar ve ilmek sayıları tutarlıdır', () => {
    for (const start of [6, 8, 12]) {
      for (const stagger of [false, true]) {
        const p = circlePlan(20, start, 10, stagger)!;
        expect(p.rounds.length).toBe(10);
        let prev = 0;
        for (const r of p.rounds) {
          expect(r.stitches).toBe(start * r.n);
          const c = checkRound(r, start);
          expect(c.consumes).toBe(prev);
          expect(c.produces).toBe(r.stitches);
          prev = r.stitches;
        }
      }
    }
  });
  it('kaydırmalı artırma yalnızca bazı turlarda uygulanır', () => {
    const p = circlePlan(20, 6, 10, true)!;
    expect(p.rounds.some((r) => r.offset > 0)).toBe(true);
    expect(p.rounds.filter((r) => r.n % 2 === 1).every((r) => r.offset === 0)).toBe(true);
  });
  it('çap ≈ 2 × tur × sıra yüksekliği', () => {
    const p = circlePlan(15, 6, 12)!;
    expect(p.finalDiameterCm).toBeCloseTo(p.rounds.length * 2 * (10 / 12));
    expect(Math.abs(p.finalDiameterCm - 15)).toBeLessThanOrEqual(10 / 12);
  });
});

describe('ip miktarı', () => {
  it('alan hesapları', () => {
    expect(areaOf('rect', 20, 160)).toBe(3200);
    expect(areaOf('circle', 20)).toBeCloseTo(Math.PI * 100);
  });
  it('alan iki katına çıkınca metre de iki katına çıkar', () => {
    const g = { stitches: 18, rows: 24 };
    const a = metersForCm2(1000, g, 'knit');
    const b = metersForCm2(2000, g, 'knit');
    expect(b).toBeCloseTo(a * 2);
    expect(metersForCm2(1000, g, 'knit', 1.5)).toBeCloseTo(a * 1.5);
  });
  it('örnek tartma', () => {
    // 10×10 örnek 5 g → 100×100 battaniye 500 g, %10 pay ile 550 g
    expect(gramsFromSwatch(5, 10, 10, 10000)).toBeCloseTo(550);
    expect(gramsFromSwatch(5, 10, 10, 10000, 0)).toBeCloseTo(500);
  });
});

describe('ip değiştirme', () => {
  it('yumak sayısı yukarı yuvarlanır', () => {
    const r = substitution(1000, 180)!;
    expect(r.buy).toBe(6);
    expect(r.leftover).toBeCloseTo(80);
    expect(r.tight).toBe(true);
    expect(substitution(1000, 250)!.buy).toBe(4);
    expect(substitution(900, 200)!.tight).toBe(false);
  });
});

describe('ölçü örneği karşılaştırma', () => {
  it('daha az ilmek = daha geniş parça, numarayı küçült', () => {
    const c = compareGauge({ stitches: 22, rows: 30 }, { stitches: 20, rows: 28 })!;
    expect(c.widthPct).toBeCloseTo(10);
    expect(c.advice).toBe('down');
    expect(compareGauge({ stitches: 20, rows: 28 }, { stitches: 22, rows: 30 })!.advice).toBe('up');
    expect(compareGauge({ stitches: 20, rows: 28 }, { stitches: 20.2, rows: 30 })!.advice).toBe('ok');
  });
  it('desendeki sayıyı kendi ölçüne çevirir', () => {
    expect(convertPatternCount(110, 22, 20)).toBe(100);
  });
  it("örneği 10 cm'ye çevirir", () => {
    const g = normalizeSwatch(26, 12, 36, 12)!;
    expect(g.stitches).toBeCloseTo(21.67, 1);
    expect(g.rows).toBeCloseTo(30);
  });
});

describe('şiş/tığ tablosu', () => {
  it('mm, US ve UK ile bulunur', () => {
    const hits = (q: string) => NEEDLE_SIZES.filter((s) => matchSize(s, q)).map((s) => s.mm);
    expect(hits('4')).toContain(4);
    expect(hits('4,5 mm')).toEqual([4.5]);
    expect(hits('us 8')).toEqual([5]);
    expect(hits('uk 8')).toEqual([4]);
  });
  it('tığ harfleri', () => {
    const hits = (q: string) => HOOK_SIZES.filter((s) => matchSize(s, q)).map((s) => s.mm);
    expect(hits('G-6')).toEqual([4]);
    expect(hits('us h')).toEqual([5]);
    expect(cleanUs('14 (çelik)')).toEqual({ us: '14', steel: true });
  });
});
