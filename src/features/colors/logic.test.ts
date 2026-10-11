import { describe, expect, it } from 'vitest';
import {
  arrangeGranny,
  archiveLastDay,
  archiveUrl,
  blanketRows,
  comboCounts,
  contrastPairs,
  contrastRating,
  countBy,
  daysOf,
  edgeClashes,
  geocodeUrl,
  grannyMetersByColor,
  metersPerRow,
  parseArchive,
  parseGeocode,
  parseSequence,
  parseTempList,
  randomSquare,
  rangeIndex,
  rng,
  runsOf,
  stripeRows,
  weekdayMon,
  cToF,
  fToC,
  type StripeSettings,
} from './logic';

const base: StripeSettings = {
  colors: ['#111111', '#888888', '#eeeeee'],
  mode: 'random',
  unitRows: 2,
  totalRows: 60,
  seed: 7,
  custom: '',
};

describe('kontrast', () => {
  it('siyah beyaz güçlü, yakın tonlar zayıf', () => {
    expect(contrastRating('#000000', '#ffffff')).toBe('strong');
    expect(contrastRating('#8e1b2a', '#c0392b')).toBe('weak');
    const pairs = contrastPairs(['#000000', '#ffffff', '#111111']);
    expect(pairs).toHaveLength(3);
    expect(pairs[0].rating).toBe('weak');
  });
});

describe('şerit üretici', () => {
  it('aynı tohum aynı sonucu verir, toplam sıra tutar', () => {
    const a = stripeRows(base);
    expect(a).toHaveLength(60);
    expect(stripeRows(base)).toEqual(a);
    expect(stripeRows({ ...base, seed: 8 })).not.toEqual(a);
  });
  it('rastgele modda ardışık şeritler farklı renktir', () => {
    const runs = runsOf(stripeRows({ ...base, totalRows: 400 }));
    for (let i = 1; i < runs.length; i++) expect(runs[i].color).not.toBe(runs[i - 1].color);
    for (const r of runs.slice(0, -1)) expect((r.to - r.from + 1) % 2).toBe(0);
  });
  it('Fibonacci yükseklikleri', () => {
    const runs = runsOf(stripeRows({ ...base, mode: 'fibonacci', unitRows: 1, totalRows: 20 }));
    expect(runs.slice(0, 5).map((r) => r.to - r.from + 1)).toEqual([1, 1, 2, 3, 5]);
    expect(runs.slice(0, 4).map((r) => r.color)).toEqual([0, 1, 2, 0]);
  });
  it('geçişli mod ilk renkle başlar, son renkle biter', () => {
    const rows = stripeRows({
      ...base,
      mode: 'gradient',
      unitRows: 1,
      totalRows: 90,
    });
    expect(rows[0]).toBe(0);
    expect(rows[rows.length - 1]).toBe(2);
    const counts = countBy(rows, 3);
    expect(counts.every((c) => c > 0)).toBe(true);
  });
  it('özel dizi', () => {
    expect(parseSequence('4A 2b, C1, 3×A, 9Z', 3)).toEqual([
      { rows: 4, color: 0 },
      { rows: 2, color: 1 },
      { rows: 1, color: 2 },
      { rows: 3, color: 0 },
    ]);
    const rows = stripeRows({
      ...base,
      mode: 'custom',
      custom: '2A 1B',
      totalRows: 7,
    });
    expect(rows).toEqual([0, 0, 1, 0, 0, 1, 0]);
  });
  it('tohumlu rastgele 0–1 arası', () => {
    const r = rng(1);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('sıcaklık battaniyesi', () => {
  it('aralık seçimi sınırı dahil eder', () => {
    const lim = [-5, 0, 5];
    expect(rangeIndex(-10, lim)).toBe(0);
    expect(rangeIndex(-5, lim)).toBe(0);
    expect(rangeIndex(-4.9, lim)).toBe(1);
    expect(rangeIndex(5, lim)).toBe(2);
    expect(rangeIndex(30, lim)).toBe(3);
  });
  it('dönem günleri ve hafta günü', () => {
    expect(daysOf(2024)).toHaveLength(366);
    expect(daysOf(2023)).toHaveLength(365);
    expect(daysOf(2024, 2)).toHaveLength(29);
    expect(daysOf(2024, 2)[0]).toBe('2024-02-01');
    expect(weekdayMon('2024-01-01')).toBe(0);
    expect(weekdayMon('2024-01-07')).toBe(6);
  });
  it('arşivin son günü birkaç gün geridedir', () => {
    expect(archiveLastDay(new Date(Date.UTC(2026, 0, 3)))).toBe('2025-12-29');
  });
  it('adresler ve yanıt çözümleme', () => {
    expect(geocodeUrl('İstanbul', 'tr')).toContain('name=%C4%B0stanbul');
    expect(archiveUrl(41.01, 28.97, '2024-01-01', '2024-12-31')).toContain('daily=temperature_2m_max,temperature_2m_mean');
    expect(
      parseGeocode({
        results: [
          {
            id: 1,
            name: 'Ankara',
            latitude: 39.9,
            longitude: 32.8,
            country: 'Türkiye',
          },
          { name: 'x' },
        ],
      }),
    ).toHaveLength(1);
    expect(parseGeocode({})).toEqual([]);
    const d = parseArchive({
      daily: {
        time: ['2024-01-01', '2024-01-02'],
        temperature_2m_max: [5.2, null],
        temperature_2m_mean: [2.1, 1],
      },
    });
    expect(d['2024-01-01']).toEqual({ max: 5.2, mean: 2.1 });
    expect(d['2024-01-02']).toEqual({ mean: 1 });
  });
  it('yapıştırılan liste', () => {
    expect(parseTempList('12 13,5\n-2;7.5')).toEqual([12, 13.5, -2, 7.5]);
    expect(parseTempList('1.5,2.5,3')).toEqual([1.5, 2.5, 3]);
  });
  it('battaniye sıraları ve ip', () => {
    const days = ['a', 'b', 'c'];
    expect(blanketRows(days, { a: { max: 3 }, b: { mean: 9 } }, 'max', [0, 5])).toEqual([1, -1, -1]);
    const m = metersPerRow(100, { stitches: 20, rows: 28 }, 'knit');
    expect(m).toBeGreaterThan(1);
    expect(metersPerRow(200, { stitches: 20, rows: 28 }, 'knit')).toBeCloseTo(m * 2);
  });
  it('°C ↔ °F', () => {
    expect(cToF(0)).toBe(32);
    expect(fToC(212)).toBeCloseTo(100);
  });
});

describe('büyükanne karesi', () => {
  it('kare içinde art arda aynı renk yok', () => {
    const r = rng(3);
    for (let i = 0; i < 50; i++) {
      const sq = randomSquare(r, 5, 4);
      expect(new Set(sq).size).toBe(4);
      const sq2 = randomSquare(r, 2, 4);
      for (let k = 1; k < sq2.length; k++) expect(sq2[k]).not.toBe(sq2[k - 1]);
    }
  });
  it('komşu karelerin dış turları farklıdır', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const g = arrangeGranny(8, 10, 5, 3, [], seed);
      expect(g).toHaveLength(80);
      expect(edgeClashes(g, 8, 10)).toBe(0);
    }
    expect(edgeClashes(arrangeGranny(6, 6, 2, 2, [], 9), 6, 6)).toBe(0);
  });
  it('kilitli kareler korunur', () => {
    const first = arrangeGranny(4, 4, 5, 3, [], 1);
    first[5] = { rounds: [4, 3, 2], locked: true };
    const next = arrangeGranny(4, 4, 5, 3, first, 2);
    expect(next[5]).toEqual({ rounds: [4, 3, 2], locked: true });
    expect(edgeClashes(next, 4, 4)).toBe(0);
  });
  it('kombinasyon sayıları ve ip', () => {
    const sq = [
      { rounds: [0, 1], locked: false },
      { rounds: [0, 1], locked: false },
      { rounds: [1, 0], locked: false },
    ];
    expect(comboCounts(sq)[0]).toEqual({ rounds: [0, 1], count: 2 });
    const m = grannyMetersByColor(sq, 2, { stitches: 14, rows: 7 });
    // renk 0: 2×(12 trabzan) + 1×(24 trabzan) = 48; renk 1: 2×24 + 12 = 60
    expect(m[1] / m[0]).toBeCloseTo(60 / 48);
  });
});
