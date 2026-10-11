import { describe, expect, it } from 'vitest';
import { makeCounter } from '@/engine/counters';
import { abacusDigits, counterDisplayName, digitCount, jitter, linkCandidates, moveId, reachesTarget, ringProgress, tallyWindow, targetProgress } from './counterMath';

describe('çentik penceresi', () => {
  it('kapasiteye kadar hepsini gösterir', () => {
    expect(tallyWindow(0, 50)).toEqual({ shown: 0, hidden: 0 });
    expect(tallyWindow(7, 50)).toEqual({ shown: 7, hidden: 0 });
    expect(tallyWindow(50, 50)).toEqual({ shown: 50, hidden: 0 });
  });
  it('fazlasını sayfa olarak gizler', () => {
    expect(tallyWindow(51, 50)).toEqual({ shown: 1, hidden: 50 });
    expect(tallyWindow(153, 50)).toEqual({ shown: 3, hidden: 150 });
    expect(tallyWindow(100, 50)).toEqual({ shown: 50, hidden: 50 });
  });
});

describe('abaküs', () => {
  it('basamakları birlerden başlayarak verir', () => {
    expect(abacusDigits(0, 3)).toEqual({ digits: [0, 0, 0], overflow: 0 });
    expect(abacusDigits(47, 3)).toEqual({ digits: [7, 4, 0], overflow: 0 });
    expect(abacusDigits(1234, 3)).toEqual({ digits: [4, 3, 2], overflow: 1000 });
  });
});

describe('yumak halkası', () => {
  it('hedefe göre dolar', () => {
    expect(ringProgress(10, 40)).toBe(0.25);
    expect(ringProgress(50, 40)).toBe(1);
  });
  it('hedefsizken her 10 artışta bir tur', () => {
    expect(ringProgress(0)).toBe(0);
    expect(ringProgress(3)).toBeCloseTo(0.3);
    expect(ringProgress(10)).toBe(1);
    expect(ringProgress(11)).toBeCloseTo(0.1);
  });
});

describe('hedef', () => {
  it('ilerleme ve hedefe ulaşma', () => {
    expect(targetProgress({ value: 5 })).toBeNull();
    expect(targetProgress({ value: 5, target: 20 })).toBe(0.25);
    expect(reachesTarget({ value: 19, target: 20 }, 1)).toBe(true);
    expect(reachesTarget({ value: 20, target: 20 }, 1)).toBe(false);
    expect(reachesTarget({ value: 19, target: 20 }, -1)).toBe(false);
  });
});

describe('yardımcılar', () => {
  it('titreme deterministik ve sınırlı', () => {
    for (let i = 0; i < 50; i++) {
      expect(jitter(i)).toBe(jitter(i));
      expect(Math.abs(jitter(i, 3))).toBeLessThanOrEqual(1);
    }
  });
  it('basamak sayısı en az 3', () => {
    expect(digitCount(5)).toBe(3);
    expect(digitCount(12345)).toBe(5);
  });
  it('hazır Türkçe sayaç adları dile çevrilir, kullanıcı adları korunur', () => {
    expect(counterDisplayName('Sıra sayacı', 'en')).toBe('Row counter');
    expect(counterDisplayName('Sıra', 'pt')).toBe('Carreira');
    expect(counterDisplayName('Sıra', 'tr')).toBe('Sıra');
    expect(counterDisplayName('Burgu', 'es')).toBe('Burgu');
  });
  it('bağlantı adayları kendini ve geri bağlananı dışlar', () => {
    const a = makeCounter('A');
    const b = makeCounter('B', { link: { toId: a.id, every: 4 } });
    const c = makeCounter('C');
    expect(linkCandidates([a, b, c], a.id).map((x) => x.name)).toEqual(['C']);
    expect(linkCandidates([a, b, c], undefined)).toHaveLength(3);
  });
  it('sıra değiştirme', () => {
    expect(moveId(['a', 'b', 'c'], 'b', -1)).toEqual(['b', 'a', 'c']);
    expect(moveId(['a', 'b', 'c'], 'c', 1)).toEqual(['a', 'b', 'c']);
  });
});
