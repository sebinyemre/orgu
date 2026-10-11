import { describe, expect, it } from 'vitest';
import { STITCH_PATTERNS, PATTERN_BY_ID } from '@/knowledge/stitchPatterns';
import { GLOSS_GROUPS, glossaryRows } from './glossary';
import { categoriesOf, columnOrder, englishName, filterPatterns, patternSearchKey, searchGlossary, tilesFor, type PatternFilter } from './logic';

const all: PatternFilter = { craft: 'all', category: 'all', level: 0, reversible: false, noCurl: false, query: '' };

describe('desen kütüphanesi', () => {
  it('her dilde arar', () => {
    const ids = (q: string) => filterPatterns(STITCH_PATTERNS, { ...all, query: q }).map((p) => p.id);
    expect(ids('haraşo')).toContain('haraso');
    expect(ids('haraso')).toContain('haraso');
    expect(ids('garter')).toContain('haraso');
    expect(ids('punto bobo')).toContain('haraso');
    expect(ids('ponto liga')).toContain('haraso');
    expect(ids('brioche')).toContain('selanik');
  });
  it('tığ adları her iki gelenekle ve US/UK ile bulunur', () => {
    const ids = (q: string) => filterPatterns(STITCH_PATTERNS, { ...all, query: q }).map((p) => p.id);
    expect(ids('ikili trabzan')).toContain('tig-trabzan');
    expect(ids('double crochet')).toContain('tig-trabzan');
    expect(ids('treble')).toContain('tig-trabzan');
    expect(ids('punto alto')).toContain('tig-trabzan');
    expect(patternSearchKey(PATTERN_BY_ID['tig-sik-igne'])).not.toContain('{');
  });
  it('süzgeçler', () => {
    const knit = filterPatterns(STITCH_PATTERNS, { ...all, craft: 'knit' });
    expect(knit.every((p) => p.craft === 'knit')).toBe(true);
    const flat = filterPatterns(STITCH_PATTERNS, { ...all, noCurl: true, reversible: true });
    expect(flat.every((p) => !p.curls && p.reversible)).toBe(true);
    expect(flat.map((p) => p.id)).toContain('haraso');
    expect(flat.map((p) => p.id)).not.toContain('jarse');
    const lvl3 = filterPatterns(STITCH_PATTERNS, { ...all, level: 3 });
    expect(lvl3.every((p) => p.level === 3)).toBe(true);
    expect(categoriesOf(STITCH_PATTERNS, 'crochet').every((c) => c.startsWith('tig'))).toBe(true);
  });
  it('İngilizce ad US/UK tercihine uyar', () => {
    expect(englishName(PATTERN_BY_ID['tig-trabzan'], 'us')).toBe('Double crochet rows');
    expect(englishName(PATTERN_BY_ID['tig-trabzan'], 'uk')).toBe('Treble rows');
    expect(englishName(PATTERN_BY_ID.haraso, 'uk')).toBe('Garter stitch');
  });
  it('döşeme sayısı', () => {
    expect(tilesFor(20, 2)).toEqual({ x: 1, y: 8 });
    expect(tilesFor(4, 4).x).toBe(6);
  });
});

describe('sözlük', () => {
  const rows = glossaryRows();
  it('her satırın dört dilde metni var, kimlikler tekil', () => {
    for (const r of rows) for (const l of ['tr', 'en', 'es', 'pt'] as const) expect(r[l].text.length, `${r.id}.${l}`).toBeGreaterThan(0);
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
    for (const g of GLOSS_GROUPS) expect(rows.some((r) => r.group === g)).toBe(true);
    expect(rows.some((r) => [r.tr, r.tr2, r.en, r.uk, r.es, r.pt].some((c) => c && /[{}]/.test(c.text)))).toBe(false);
  });
  it('US/UK tuzağı ve iki trabzan sistemi', () => {
    const sc = rows.find((r) => r.id === 'tig-sc')!;
    expect(sc.en.text).toBe('Single crochet');
    expect(sc.uk?.text).toBe('Double crochet');
    const dc = rows.find((r) => r.id === 'tig-dc')!;
    expect(dc.tr.text).toBe('Trabzan');
    expect(dc.tr2?.text).toBe('İkili trabzan');
    expect(dc.uk?.text).toBe('Treble');
    const fp = rows.find((r) => r.id === 'tsym-fpdc')!;
    expect(fp.uk?.text).toBe('Front post treble');
    expect(fp.tr2?.text).toBe('Ön kabartma ikili trabzan');
  });
  it('dört dilde ve kısaltmayla arar', () => {
    const ids = (q: string) => searchGlossary(rows, q).map((r) => r.id);
    expect(ids('bind off')).toContain('ilmek-kapat');
    expect(ids('cast off')).toContain('ilmek-kapat');
    expect(ids('arrematar')).toContain('ilmek-kapat');
    expect(ids('k2tog')).toContain('sym-k2tog');
    expect(ids('tension')).toContain('olcu-ornegi');
    expect(ids('punto bajo')).toContain('tig-sc');
    expect(searchGlossary(rows, '')).toHaveLength(rows.length);
  });
  it('kullanıcının dili ilk sütun', () => {
    expect(columnOrder('es')).toEqual(['es', 'tr', 'en', 'pt']);
  });
});
