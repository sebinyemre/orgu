import { describe, expect, it } from 'vitest';
import type { TermsCtx } from '@/knowledge/terms';
import { chartToText, detectColorMode, findRepeat, rowLine, type ChartLike } from './toText';
import { CHART_TEMPLATES } from './templates';

const TR: TermsCtx = { lang: 'tr', trabzan: 'ipatma', crochetEn: 'us' };
const EN: TermsCtx = { lang: 'en', trabzan: 'ipatma', crochetEn: 'us' };
const UK: TermsCtx = { lang: 'en', trabzan: 'ipatma', crochetEn: 'uk' };
const ES: TermsCtx = { lang: 'es', trabzan: 'ipatma', crochetEn: 'us' };
const PT: TermsCtx = { lang: 'pt', trabzan: 'ipatma', crochetEn: 'us' };

const pal = [{ letter: 'A' }, { letter: 'B' }, { letter: 'C' }];

function chart(rowsTopDown: string[][], extra: Partial<ChartLike> = {}): ChartLike {
  const height = rowsTopDown.length;
  const width = rowsTopDown[0].length;
  return {
    width,
    height,
    symbols: rowsTopDown.flat(),
    colors: new Array(width * height).fill(-1),
    palette: pal,
    craft: 'knit',
    mode: 'flat',
    firstRowRS: true,
    ...extra,
  };
}

describe('şiş, düz örgü', () => {
  it('jarse: ön yüz düz, arka yüz ters (tr ve en)', () => {
    const c = chart([['', '', '', ''], ['', '', '', '']]);
    const tr = chartToText(c, { terms: TR });
    expect(tr.intro).toBe('4 ilmek at.');
    expect(rowLine(tr.rows[0])).toBe('1. sıra (ÖY): 4 düz. (4 ilmek)');
    expect(rowLine(tr.rows[1])).toBe('2. sıra (AY): 4 ters. (4 ilmek)');
    const en = chartToText(c, { terms: EN });
    expect(en.intro).toBe('Cast on 4 stitches.');
    expect(rowLine(en.rows[0])).toBe('Row 1 (RS): k4. (4 sts)');
    expect(rowLine(en.rows[1])).toBe('Row 2 (WS): p4. (4 sts)');
  });

  it('İspanyolca ve Portekizce kısaltmalar', () => {
    const c = chart([['p', 'k', 'k', 'k', 'k', 'k']]);
    expect(chartToText(c, { terms: ES }).rows[0].text).toBe('5 d, 1 r. (6 puntos)');
    expect(chartToText(c, { terms: PT }).rows[0].text).toBe('5 m, 1 t. (6 pontos)');
  });

  it('2×2 lastik tekrar olarak kısaltılır', () => {
    const r = ['k', 'k', 'p', 'p', 'k', 'k', 'p', 'p'];
    const c = chart([r, r]);
    const en = chartToText(c, { terms: EN });
    expect(en.rows[0].text).toBe('[p2, k2] 2 times. (8 sts)');
    expect(en.rows[1].text).toBe('[p2, k2] 2 times. (8 sts)');
    const tr = chartToText(c, { terms: TR });
    expect(tr.rows[0].text).toBe('[2 ters, 2 düz] 2 kez. (8 ilmek)');
    // kısaltma kapalıysa açık yazılır
    expect(chartToText(c, { terms: EN, compact: false }).rows[0].text).toBe('p2, k2, p2, k2. (8 sts)');
  });

  it('önek ve sonekli tekrar', () => {
    const r = ['k', 'k', 'p', 'k', 'p', 'k', 'p', 'k', 'k'];
    const en = chartToText(chart([r]), { terms: EN });
    expect(en.rows[0].text).toBe('k2, [p1, k1] 3 times, k1. (9 sts)');
  });

  it('renk dizileri: A ile 4, B ile 2', () => {
    const c = chart([['', '', '', '', '', '']], { colors: [1, 1, 0, 0, 0, 0] });
    expect(detectColorMode(c)).toBe('colors');
    expect(chartToText(c, { terms: TR }).rows[0].text).toBe('Düz ör: A ile 4, B ile 2. (6 ilmek)');
    expect(chartToText(c, { terms: EN }).rows[0].text).toBe('Knit: 4 in A, 2 in B. (6 sts)');
    // solak: soldan sağa okunur
    expect(chartToText(c, { terms: EN, leftHanded: true }).rows[0].text).toBe('Knit: 2 in B, 4 in A. (6 sts)');
  });

  it('renk ve sembol birlikte', () => {
    const c = chart([['p', 'p', '', '']], { colors: [1, 1, 0, 0] });
    expect(detectColorMode(c)).toBe('both');
    expect(chartToText(c, { terms: EN }).rows[0].text).toBe('k2 in A, p2 in B. (4 sts)');
    expect(chartToText(c, { terms: TR }).rows[0].text).toBe('A ile 2 düz, B ile 2 ters. (4 ilmek)');
  });

  it('arka yüzde sembolün ws anlamı kullanılır', () => {
    const c = chart([['k2tog', 'k', 'yo'], ['k', 'k', 'k']]);
    const en = chartToText(c, { terms: EN });
    expect(en.rows[1].text).toBe('p2tog, p1, yarn over. (3 sts)');
  });

  it('burgu tek işlem olarak adlandırılır', () => {
    const c = chart([['p', 'c4l', '>', '>', '>', 'p']]);
    expect(chartToText(c, { terms: EN }).rows[0].text).toBe('p1, 2/2 LC, p1. (6 sts)');
    expect(chartToText(c, { terms: TR }).rows[0].text).toBe('1 ters, 2/2 sola burgu, 1 ters. (6 ilmek)');
  });

  it('ilmek sayısı uyuşmazlığı uyarılır', () => {
    const c = chart([['k', 'k2tog', 'k'], ['k', 'k', 'k']]);
    const en = chartToText(c, { terms: EN });
    expect(en.warnings).toHaveLength(1);
    expect(en.rows[1].warning).toBe('This row needs 4 stitches but the previous row leaves 3.');
    const tr = chartToText(c, { terms: TR });
    expect(tr.rows[1].warning).toBe('Bu sıra 4 ilmek ister, önceki sıra 3 ilmek bırakıyor.');
  });

  it('ip atma ve eksiltme dengeliyse uyarı yok', () => {
    const c = chart([['k', 'k', 'k', 'k'], ['yo', 'k2tog', 'k', 'k']]);
    expect(chartToText(c, { terms: EN }).warnings).toHaveLength(0);
  });

  it('ilmek yok kareleri atlanır', () => {
    const c = chart([['ns', 'k', 'k']]);
    expect(chartToText(c, { terms: EN }).rows[0].text).toBe('k2. (2 sts)');
  });
});

describe('şiş, yuvarlak örgü', () => {
  it('her tur ön yüz ve sağdan sola', () => {
    const c = chart([['', '', ''], ['p', '', '']], { mode: 'round' });
    const en = chartToText(c, { terms: EN });
    expect(en.intro).toBe('Cast on 3 stitches and join in the round without twisting.');
    expect(rowLine(en.rows[0])).toBe('Round 1: k2, p1. (3 sts)');
    expect(rowLine(en.rows[1])).toBe('Round 2: k3. (3 sts)');
    expect(rowLine(chartToText(c, { terms: TR }).rows[0])).toBe('1. tur: 2 düz, 1 ters. (3 ilmek)');
  });
});

describe('tığ', () => {
  it('renkli sıra, gidiş dönüş', () => {
    const c = chart([['', '', '', '', '', ''], ['', '', '', '', '', '']], { craft: 'crochet', colors: [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0] });
    const tr = chartToText(c, { terms: TR });
    expect(tr.intro).toBe('7 zincir çek. İlk sırayı sık iğne ile ör.');
    expect(rowLine(tr.rows[0])).toBe('1. sıra: Sık iğne: A ile 4, B ile 2. (6 ilmek)');
    expect(tr.rows[1].dir).toBe('ltr');
    const en = chartToText(c, { terms: EN });
    expect(en.intro).toBe('Ch 7. Work the first row in single crochet.');
    expect(en.rows[0].text).toBe('Single crochet: 4 in A, 2 in B. (6 sts)');
  });

  it('sembollü sıra kullanıcının terimleriyle', () => {
    const c = chart([['dc', 'dc', 'sc', 'sc']], { craft: 'crochet' });
    expect(chartToText(c, { terms: EN }).rows[0].text).toBe('2 sc, 2 dc. (4 sts)');
    expect(chartToText(c, { terms: UK }).rows[0].text).toBe('2 dc, 2 tr. (4 sts)');
    expect(chartToText(c, { terms: TR }).rows[0].text).toBe('2 sık iğne, 2 trabzan. (4 ilmek)');
    expect(chartToText(c, { terms: { ...TR, trabzan: 'ingilizce' } }).rows[0].text).toBe('2 sık iğne, 2 ikili trabzan. (4 ilmek)');
  });
});

describe('şablonlar', () => {
  it('şiş şablonlarında ilmek sayıları tutarlı', () => {
    for (const t of CHART_TEMPLATES.filter((x) => x.craft === 'knit')) {
      const d = t.build();
      const c: ChartLike = { ...d, palette: d.palette.map((_, i) => ({ letter: String.fromCharCode(65 + i) })), craft: t.craft, mode: t.mode, firstRowRS: true };
      const res = chartToText(c, { terms: EN });
      expect(res.warnings, t.id).toEqual([]);
      expect(res.rows).toHaveLength(d.height);
    }
  });

  it('ajurlu yaprak 11 ilmekte kalır', () => {
    const d = CHART_TEMPLATES.find((t) => t.id === 'ajur-yaprak')!.build();
    const res = chartToText({ ...d, palette: [{ letter: 'A' }], craft: 'knit', mode: 'flat', firstRowRS: true }, { terms: EN });
    expect(res.rows.every((r) => r.stitchesOut === 11)).toBe(true);
    expect(res.rows[0].text).toBe('k4, yarn over, s2kp, yarn over, k4. (11 sts)');
  });
});

describe('tekrar bulma', () => {
  it('kısa sıralarda tekrar aramaz', () => {
    expect(findRepeat([0, 1, 0])).toBeNull();
  });
  it('tek dizilik birimi tekrar saymaz', () => {
    expect(findRepeat([0, 0, 0, 0, 0, 0])).toBeNull();
  });
});
