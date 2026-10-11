/** Desen kütüphanesi ve sözlük için saf yardımcılar: arama, süzme, İngilizce ad */
import type { Craft, Lang } from '@/types';
import { normalizeSearch } from '@/lib/format';
import { PATTERN_CATEGORY_LABEL, type PatternCategory, type StitchPattern } from '@/knowledge/stitchPatterns';
import { fillTerms, type TermsCtx } from '@/knowledge/terms';
import type { GlossCell, GlossRow } from './glossary';

const LANGS: Lang[] = ['tr', 'en', 'es', 'pt'];

/** Bir desenin dört dildeki bütün adlarından arama anahtarı (tığ adları her iki gelenekle doldurulur) */
export function patternSearchKey(p: StitchPattern): string {
  const parts: string[] = [p.en, p.id];
  const ctxs: TermsCtx[] = [
    { lang: 'tr', trabzan: 'ipatma', crochetEn: 'us' },
    { lang: 'tr', trabzan: 'ingilizce', crochetEn: 'us' },
    { lang: 'en', trabzan: 'ipatma', crochetEn: 'us' },
    { lang: 'en', trabzan: 'ipatma', crochetEn: 'uk' },
    { lang: 'es', trabzan: 'ipatma', crochetEn: 'us' },
    { lang: 'pt', trabzan: 'ipatma', crochetEn: 'us' },
  ];
  for (const x of ctxs) {
    parts.push(fillTerms(p.name[x.lang], x));
    for (const a of p.aka ?? []) parts.push(fillTerms(a[x.lang], x));
  }
  for (const l of LANGS) parts.push(PATTERN_CATEGORY_LABEL[p.category][l]);
  return normalizeSearch(parts.join(' | '));
}

export interface PatternFilter {
  craft: Craft | 'all';
  category: PatternCategory | 'all';
  level: 0 | 1 | 2 | 3;
  reversible: boolean;
  noCurl: boolean;
  query: string;
}

export function filterPatterns(list: StitchPattern[], f: PatternFilter): StitchPattern[] {
  const q = normalizeSearch(f.query.trim());
  const words = q.split(/\s+/).filter(Boolean);
  return list.filter((p) => {
    if (f.craft !== 'all' && p.craft !== f.craft) return false;
    if (f.category !== 'all' && p.category !== f.category) return false;
    if (f.level && p.level !== f.level) return false;
    if (f.reversible && !p.reversible) return false;
    if (f.noCurl && p.curls) return false;
    if (words.length) {
      const key = patternSearchKey(p);
      if (!words.every((w) => key.includes(w))) return false;
    }
    return true;
  });
}

/** Kategoriler, desen sırasına göre (zanaata göre süzülmüş) */
export function categoriesOf(list: StitchPattern[], craft: Craft | 'all'): PatternCategory[] {
  const out: PatternCategory[] = [];
  for (const p of list) if ((craft === 'all' || p.craft === craft) && !out.includes(p.category)) out.push(p.category);
  return out;
}

/**
 * Desenin İngilizce adı. Tığ desenlerinde ad ilmek adı içeriyorsa kullanıcının ABD/İngiltere tercihine göre doldurulur.
 */
export function englishName(p: StitchPattern, crochetEn: 'us' | 'uk'): string {
  if (p.craft === 'crochet' && /\{/.test(p.name.en)) return fillTerms(p.name.en, { lang: 'en', trabzan: 'ipatma', crochetEn });
  return p.en;
}

/** Grafik tekrarının kumaş önizlemesinde kaç kez döşeneceği (yaklaşık hedef boyuta göre) */
export function tilesFor(width: number, height: number, targetW = 24, targetH = 16): { x: number; y: number } {
  return { x: Math.max(1, Math.min(8, Math.round(targetW / Math.max(1, width)))), y: Math.max(1, Math.min(12, Math.round(targetH / Math.max(1, height)))) };
}

/* ── Sözlük ── */

const cellText = (c?: GlossCell) => (c ? `${c.text} ${c.abbr ?? ''}` : '');

export function glossKey(r: GlossRow): string {
  return normalizeSearch([r.tr, r.tr2, r.en, r.uk, r.es, r.pt].map(cellText).join(' | '));
}

export function searchGlossary(rows: GlossRow[], query: string): GlossRow[] {
  const words = normalizeSearch(query.trim()).split(/\s+/).filter(Boolean);
  if (!words.length) return rows;
  return rows.filter((r) => {
    const key = glossKey(r);
    return words.every((w) => key.includes(w));
  });
}

/** Sütun sırası: kullanıcının dili önce, sonra tr, en, es, pt */
export function columnOrder(lang: Lang): Lang[] {
  return [lang, ...LANGS.filter((l) => l !== lang)];
}
