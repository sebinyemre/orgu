import { describe, expect, it } from 'vitest';
import { ALL_SYMBOLS, symbolHint, symbolName } from './symbols';
import type { TermsCtx } from './terms';

const CTXS: TermsCtx[] = [
  { lang: 'tr', trabzan: 'ipatma', crochetEn: 'us' },
  { lang: 'tr', trabzan: 'ingilizce', crochetEn: 'us' },
  { lang: 'en', trabzan: 'ipatma', crochetEn: 'us' },
  { lang: 'en', trabzan: 'ipatma', crochetEn: 'uk' },
  { lang: 'es', trabzan: 'ipatma', crochetEn: 'us' },
  { lang: 'pt', trabzan: 'ipatma', crochetEn: 'us' },
];

describe('sembol adları', () => {
  it('yer tutucu kalmaz, her dilde dolu', () => {
    for (const ctx of CTXS)
      for (const s of ALL_SYMBOLS) {
        const n = symbolName(s, ctx);
        const h = symbolHint(s, ctx);
        expect(n.length, `${s.id} ${ctx.lang}`).toBeGreaterThan(0);
        expect(n).not.toMatch(/[{}]/);
        expect(h).not.toMatch(/[{}]/);
      }
  });

  it('kabartma trabzan adlandırma sistemine uyar', () => {
    const fp = ALL_SYMBOLS.find((s) => s.id === 'fpdc')!;
    expect(symbolName(fp, CTXS[0])).toBe('Ön kabartma trabzan');
    expect(symbolName(fp, CTXS[1])).toBe('Ön kabartma ikili trabzan');
    expect(symbolName(fp, CTXS[2])).toMatch(/double crochet/i);
    expect(symbolName(fp, CTXS[3])).toMatch(/treble/i);
  });
});
