import { describe, expect, it } from 'vitest';
import { colorFamily } from './colorFamily';
import { fitOf, ideaHref, yarnIdeas } from './ideas';
import { stashTotals, toolSizeInfo } from './stashMath';
import type { Tool, Yarn } from '@/types';

describe('renk aileleri', () => {
  it('hazır ip renklerini doğru aileye koyar', () => {
    expect(colorFamily('#f5f0e6')).toBe('neutral'); // ekru
    expect(colorFamily('#e8dcc4')).toBe('neutral'); // bej
    expect(colorFamily('#2f2925')).toBe('neutral'); // kömür
    expect(colorFamily('#9e9e9e')).toBe('neutral'); // gri
    expect(colorFamily('#8b6f4e')).toBe('brown'); // taba
    expect(colorFamily('#5c3d2e')).toBe('brown'); // kahve
    expect(colorFamily('#8e1b2a')).toBe('red'); // bordo
    expect(colorFamily('#c0392b')).toBe('red');
    expect(colorFamily('#b5523b')).toBe('orange'); // kiremit
    expect(colorFamily('#d39a2c')).toBe('yellow'); // hardal
    expect(colorFamily('#f2c84b')).toBe('yellow');
    expect(colorFamily('#5f7a61')).toBe('green'); // adaçayı
    expect(colorFamily('#9fd8cb')).toBe('green'); // mint
    expect(colorFamily('#46698a')).toBe('blue'); // denim
    expect(colorFamily('#1b2a4a')).toBe('blue'); // lacivert
    expect(colorFamily('#b39ddb')).toBe('purple'); // lila
    expect(colorFamily('#7d4e6d')).toBe('purple'); // mürdüm
    expect(colorFamily('#f4a7b9')).toBe('pink');
    expect(colorFamily('#f8d3dc')).toBe('pink');
  });
});

describe('bu iple ne örerim', () => {
  it('orta kalınlık 720 m: standart atkı yeter, bebek battaniyesi yetmez', () => {
    const ideas = yarnIdeas(4, 720);
    const scarf = ideas.find((i) => i.templateId === 'atki')!;
    expect(scarf.fit).not.toBe('short');
    expect(scarf.size.dims).toEqual({ kind: 'rect', w: 20, h: 160 });
    expect(scarf.meters).toBeGreaterThan(400);
    expect(scarf.meters).toBeLessThan(720);
    const blanket = ideas.find((i) => i.templateId === 'bebek-battaniyesi')!;
    expect(blanket.fit).toBe('short');
    // eksik olanlar sonda
    expect(ideas[ideas.length - 1].fit).toBe('short');
  });

  it('yetişkin beresi için makul metraj (orta kalınlık 120–260 m)', () => {
    const hat = yarnIdeas(4, 5000).find((i) => i.templateId === 'bere')!;
    expect(hat.meters).toBeGreaterThan(120);
    expect(hat.meters).toBeLessThan(260);
  });

  it('küçük parçalarda adet sayar', () => {
    const coaster = yarnIdeas(4, 100).find((i) => i.templateId === 'bardak-altligi')!;
    expect(coaster.pieces).toBeGreaterThanOrEqual(5);
    const granny = yarnIdeas(4, 100).find((i) => i.templateId === 'buyukanne-karesi')!;
    expect(granny.pieces).toBeGreaterThanOrEqual(3);
  });

  it('kalınlığa uymayan şablonları göstermez', () => {
    const lace = yarnIdeas(0, 2000).map((i) => i.templateId);
    expect(lace).not.toContain('bebek-battaniyesi');
    expect(lace).not.toContain('bere');
    const jumbo = yarnIdeas(7, 200).map((i) => i.templateId);
    expect(jumbo).not.toContain('amigurumi-top');
    expect(jumbo).toContain('atki');
  });

  it('yeterlilik eşikleri ve bağlantı', () => {
    expect(fitOf(50, 100)).toBe('ok');
    expect(fitOf(90, 100)).toBe('tight');
    expect(fitOf(120, 100)).toBe('short');
    expect(fitOf(10, 0)).toBe('short');
    expect(ideaHref('ip_1', 'bere')).toBe('/tarif?ip=ip_1&tur=bere');
  });
});

describe('sepet toplamları', () => {
  const y = (weight: Yarn['weight'], m: number, skeins: number): Yarn => ({
    id: `y${weight}${m}`,
    brand: '',
    name: '',
    colorName: '',
    colorHex: '#000',
    weight,
    fibers: [],
    metersPerSkein: m,
    gramsPerSkein: 100,
    skeins,
    createdAt: 0,
  });
  it('metre, yumak ve kalınlık dağılımı', () => {
    const t = stashTotals([y(4, 200, 2), y(4, 100, 1.5), y(2, 300, 1)]);
    expect(t.meters).toBe(850);
    expect(t.skeins).toBe(4.5);
    expect(t.byWeight).toEqual([
      { weight: 4, meters: 550, count: 2 },
      { weight: 2, meters: 300, count: 1 },
    ]);
  });
  it('alet numara bilgisi', () => {
    const tool = (kind: Tool['kind'], sizeMm: number): Tool => ({ id: 'a', kind, sizeMm, count: 1, createdAt: 0 });
    expect(toolSizeInfo(tool('sis-misinali', 4.5))).toMatchObject({ us: '7', uk: '7' });
    expect(toolSizeInfo(tool('tig', 5))).toMatchObject({ us: 'H-8', uk: '6' });
    expect(toolSizeInfo(tool('tig', 1.0), 'steel')).toMatchObject({ us: '10 (steel)' });
  });
});
