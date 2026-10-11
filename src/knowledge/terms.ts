/**
 * Tığ temel ilmekleri, dillere ve geleneklere göre adları; şiş temel terimleri.
 *
 * Tığ adları "lehçeye" göre değişir:
 *  - tr-ipatma   : trabzan = 1 ip atma (US dc), ikili = 2 (US tr), üçlü = 3 (US dtr)
 *  - tr-ingilizce: yarım trabzan = hdc, ikili trabzan = dc, üçlü = tr, dörtlü = dtr
 *  - en-us / en-uk: ABD ve Birleşik Krallık adları (US sc = UK dc!)
 *  - es, pt      : İspanyolca ve Portekizce (Brezilya) standart adları
 * Kanonik kimlik olarak US kısaltmaları kullanılır.
 */
import type { Lang, TrabzanConvention } from '@/types';

export type CrochetBasicId = 'ch' | 'slst' | 'sc' | 'hdc' | 'dc' | 'tr' | 'dtr' | 'trtr';

export interface CrochetBasic {
  id: CrochetBasicId;
  /** ilmeğe batmadan önce kaç kez ip atılır */
  yarnOvers: number;
  /** sık iğne cinsinden yaklaşık yükseklik */
  heightSc: number;
  /** sıra başı dönüş zinciri */
  turningCh: number;
  /** dönüş zinciri ilk ilmek yerine sayılır mı */
  turningCounts: boolean;
  /** temel zincirde tığdan itibaren kaçıncı zincire batılır */
  firstInChainFromHook: number;
  us: string;
  uk: string;
  usName: string;
  ukName: string;
  symbol: string;
}

export const CROCHET_BASICS: Record<CrochetBasicId, CrochetBasic> = {
  ch: { id: 'ch', yarnOvers: 0, heightSc: 0.5, turningCh: 0, turningCounts: false, firstInChainFromHook: 0, us: 'ch', uk: 'ch', usName: 'chain', ukName: 'chain', symbol: 'ch' },
  slst: { id: 'slst', yarnOvers: 0, heightSc: 0.1, turningCh: 0, turningCounts: false, firstInChainFromHook: 2, us: 'sl st', uk: 'ss', usName: 'slip stitch', ukName: 'slip stitch', symbol: 'slst' },
  sc: { id: 'sc', yarnOvers: 0, heightSc: 1, turningCh: 1, turningCounts: false, firstInChainFromHook: 2, us: 'sc', uk: 'dc', usName: 'single crochet', ukName: 'double crochet', symbol: 'sc' },
  hdc: { id: 'hdc', yarnOvers: 1, heightSc: 1.5, turningCh: 2, turningCounts: false, firstInChainFromHook: 3, us: 'hdc', uk: 'htr', usName: 'half double crochet', ukName: 'half treble', symbol: 'hdc' },
  dc: { id: 'dc', yarnOvers: 1, heightSc: 2, turningCh: 3, turningCounts: true, firstInChainFromHook: 4, us: 'dc', uk: 'tr', usName: 'double crochet', ukName: 'treble', symbol: 'dc' },
  tr: { id: 'tr', yarnOvers: 2, heightSc: 3, turningCh: 4, turningCounts: true, firstInChainFromHook: 5, us: 'tr', uk: 'dtr', usName: 'treble crochet', ukName: 'double treble', symbol: 'tr' },
  dtr: { id: 'dtr', yarnOvers: 3, heightSc: 4, turningCh: 5, turningCounts: true, firstInChainFromHook: 6, us: 'dtr', uk: 'trtr', usName: 'double treble crochet', ukName: 'triple treble', symbol: 'dtr' },
  trtr: { id: 'trtr', yarnOvers: 4, heightSc: 5, turningCh: 6, turningCounts: true, firstInChainFromHook: 7, us: 'trtr', uk: 'qtr', usName: 'triple treble crochet', ukName: 'quadruple treble', symbol: 'trtr' },
};

export type CrochetDialect = 'tr-ipatma' | 'tr-ingilizce' | 'en-us' | 'en-uk' | 'es' | 'pt';

/** Terim bağlamı: dil + o dildeki gelenek */
export interface TermsCtx {
  lang: Lang;
  trabzan: TrabzanConvention;
  crochetEn: 'us' | 'uk';
}

export function dialectOf(c: TermsCtx): CrochetDialect {
  if (c.lang === 'tr') return c.trabzan === 'ipatma' ? 'tr-ipatma' : 'tr-ingilizce';
  if (c.lang === 'en') return c.crochetEn === 'uk' ? 'en-uk' : 'en-us';
  return c.lang;
}

const NAMES: Record<CrochetDialect, Record<CrochetBasicId, string>> = {
  'tr-ipatma': { ch: 'Zincir', slst: 'Kör ilmek', sc: 'Sık iğne', hdc: 'Yarım trabzan', dc: 'Trabzan', tr: 'İkili trabzan', dtr: 'Üçlü trabzan', trtr: 'Dörtlü trabzan' },
  'tr-ingilizce': { ch: 'Zincir', slst: 'Kör ilmek', sc: 'Sık iğne', hdc: 'Yarım trabzan', dc: 'İkili trabzan', tr: 'Üçlü trabzan', dtr: 'Dörtlü trabzan', trtr: 'Beşli trabzan' },
  'en-us': { ch: 'Chain', slst: 'Slip stitch', sc: 'Single crochet', hdc: 'Half double crochet', dc: 'Double crochet', tr: 'Treble crochet', dtr: 'Double treble', trtr: 'Triple treble' },
  'en-uk': { ch: 'Chain', slst: 'Slip stitch', sc: 'Double crochet', hdc: 'Half treble', dc: 'Treble', tr: 'Double treble', dtr: 'Triple treble', trtr: 'Quadruple treble' },
  es: { ch: 'Cadeneta', slst: 'Punto raso', sc: 'Punto bajo', hdc: 'Punto medio alto', dc: 'Punto alto', tr: 'Punto alto doble', dtr: 'Punto alto triple', trtr: 'Punto alto cuádruple' },
  pt: { ch: 'Correntinha', slst: 'Ponto baixíssimo', sc: 'Ponto baixo', hdc: 'Meio ponto alto', dc: 'Ponto alto', tr: 'Ponto alto duplo', dtr: 'Ponto alto triplo', trtr: 'Ponto alto quádruplo' },
};

const ABBR: Record<CrochetDialect, Record<CrochetBasicId, string>> = {
  'tr-ipatma': { ch: 'zn', slst: 'kİ', sc: 'sı', hdc: 'yt', dc: 'tr', tr: '2tr', dtr: '3tr', trtr: '4tr' },
  'tr-ingilizce': { ch: 'zn', slst: 'kİ', sc: 'sı', hdc: 'yt', dc: '2tr', tr: '3tr', dtr: '4tr', trtr: '5tr' },
  'en-us': { ch: 'ch', slst: 'sl st', sc: 'sc', hdc: 'hdc', dc: 'dc', tr: 'tr', dtr: 'dtr', trtr: 'trtr' },
  'en-uk': { ch: 'ch', slst: 'ss', sc: 'dc', hdc: 'htr', dc: 'tr', tr: 'dtr', dtr: 'trtr', trtr: 'qtr' },
  es: { ch: 'cad', slst: 'pr', sc: 'pb', hdc: 'pma', dc: 'pa', tr: 'pad', dtr: 'pat', trtr: 'pac' },
  pt: { ch: 'corr', slst: 'pbx', sc: 'pb', hdc: 'mpa', dc: 'pa', tr: 'pad', dtr: 'pat', trtr: 'paq' },
};

const LOCALE: Record<Lang, string> = { tr: 'tr-TR', en: 'en-US', es: 'es-ES', pt: 'pt-BR' };

/** "Trabzan", "Double crochet", "Punto alto" … */
export function crochetName(id: CrochetBasicId, ctx: TermsCtx): string {
  return NAMES[dialectOf(ctx)][id];
}

/** cümle içinde kullanmak için küçük harfle başlayan ad */
export function crochetNameLower(id: CrochetBasicId, ctx: TermsCtx): string {
  const n = NAMES[dialectOf(ctx)][id];
  return n.charAt(0).toLocaleLowerCase(LOCALE[ctx.lang]) + n.slice(1);
}

export function crochetAbbr(id: CrochetBasicId, ctx: TermsCtx): string {
  return ABBR[dialectOf(ctx)][id];
}

const YO_WORD: Record<Lang, (n: number) => string> = {
  tr: (n) => `${n} ip atma`,
  en: (n) => `${n} yarn over${n > 1 ? 's' : ''}`,
  es: (n) => `${n} lazada${n > 1 ? 's' : ''}`,
  pt: (n) => `${n} laçada${n > 1 ? 's' : ''}`,
};

/** "Trabzan (US dc · 1 ip atma)" — İngilizcede US/UK karşılığını gösterir */
export function crochetLabel(id: CrochetBasicId, ctx: TermsCtx, withRef = true): string {
  const b = CROCHET_BASICS[id];
  const name = crochetName(id, ctx);
  if (!withRef || id === 'ch') return name;
  const yo = b.yarnOvers > 0 ? ` · ${YO_WORD[ctx.lang](b.yarnOvers)}` : '';
  if (ctx.lang === 'en') return ctx.crochetEn === 'uk' ? `${name} (US ${b.us}${yo})` : `${name} (UK ${b.uk}${yo})`;
  return `${name} (US ${b.us}${yo})`;
}

export function yarnOverText(n: number, lang: Lang): string {
  return YO_WORD[lang](n);
}

export const CONVENTION_INFO: Record<TrabzanConvention, { title: string; summary: string }> = {
  ipatma: {
    title: 'İp atma sayısına göre',
    summary: 'Trabzan = 1 kez ip atılır (US dc). İkili trabzan = 2 kez (US tr). Üçlü trabzan = 3 kez (US dtr).',
  },
  ingilizce: {
    title: 'İngilizce adlarla eşleşen',
    summary: 'Yarım trabzan = hdc. İkili trabzan = US dc ("double"). Üçlü trabzan = US tr ("treble"). Dörtlü = US dtr.',
  },
};

/**
 * Metindeki {sc}, {dc} gibi yer tutucuları kullanıcının diline ve geleneğine göre doldurur.
 * Cümle başında büyük harf için {Sc}, {Dc}; kısaltma için {sc.a}, {dc.a}.
 */
export function fillTerms(text: string, ctx: TermsCtx): string {
  return text
    .replace(/\{(ch|slst|sc|hdc|dc|tr|dtr|trtr)\.a\}/g, (_, k: CrochetBasicId) => crochetAbbr(k, ctx))
    .replace(/\{(Ch|Slst|Sc|Hdc|Dc|Tr|Dtr|Trtr)\}/g, (_, k: string) => crochetName(k.toLowerCase() as CrochetBasicId, ctx))
    .replace(/\{(ch|slst|sc|hdc|dc|tr|dtr|trtr)\}/g, (_, k: CrochetBasicId) => crochetNameLower(k, ctx));
}

/* ── Şiş temel terimleri (tarif metinleri üretmek için) ───────────────── */
export interface KnitVocab {
  k: string;
  p: string;
  kAbbr: string;
  pAbbr: string;
  yo: string;
  k2tog: string;
  ssk: string;
  sl: string;
  castOn: string;
  bindOff: string;
  rs: string;
  ws: string;
  rsShort: string;
  wsShort: string;
  stitch: (n: number) => string;
  row: (n: number) => string;
  round: (n: number) => string;
  rowWord: string;
  roundWord: string;
  repeat: string;
  /** "*1 düz, 1 ters* tekrarla" kalıbındaki tekrar kelimesi */
  repeatToEnd: string;
}

export const KNIT_VOCAB: Record<Lang, KnitVocab> = {
  tr: {
    k: 'düz',
    p: 'ters',
    kAbbr: 'd',
    pAbbr: 't',
    yo: 'ip at',
    k2tog: '2 ilmeği birlikte düz ör',
    ssk: 'kaydır, kaydır, birlikte düz ör',
    sl: 'kaydır',
    castOn: 'ilmek at',
    bindOff: 'ilmek kapat',
    rs: 'ön yüz',
    ws: 'arka yüz',
    rsShort: 'ÖY',
    wsShort: 'AY',
    stitch: (n) => `${n} ilmek`,
    row: (n) => `${n}. sıra`,
    round: (n) => `${n}. tur`,
    rowWord: 'sıra',
    roundWord: 'tur',
    repeat: 'tekrarla',
    repeatToEnd: 'sıra sonuna kadar tekrarla',
  },
  en: {
    k: 'knit',
    p: 'purl',
    kAbbr: 'k',
    pAbbr: 'p',
    yo: 'yarn over',
    k2tog: 'knit 2 together',
    ssk: 'slip, slip, knit together',
    sl: 'slip',
    castOn: 'cast on',
    bindOff: 'bind off',
    rs: 'right side',
    ws: 'wrong side',
    rsShort: 'RS',
    wsShort: 'WS',
    stitch: (n) => `${n} stitch${n === 1 ? '' : 'es'}`,
    row: (n) => `Row ${n}`,
    round: (n) => `Round ${n}`,
    rowWord: 'row',
    roundWord: 'round',
    repeat: 'repeat',
    repeatToEnd: 'repeat to end',
  },
  es: {
    k: 'derecho',
    p: 'revés',
    kAbbr: 'd',
    pAbbr: 'r',
    yo: 'lazada',
    k2tog: 'tejer 2 puntos juntos al derecho',
    ssk: 'deslizar, deslizar, tejer juntos',
    sl: 'deslizar',
    castOn: 'montar puntos',
    bindOff: 'cerrar puntos',
    rs: 'derecho de la labor',
    ws: 'revés de la labor',
    rsShort: 'LD',
    wsShort: 'LR',
    stitch: (n) => `${n} punto${n === 1 ? '' : 's'}`,
    row: (n) => `Vuelta ${n}`,
    round: (n) => `Vuelta ${n}`,
    rowWord: 'vuelta',
    roundWord: 'vuelta',
    repeat: 'repetir',
    repeatToEnd: 'repetir hasta el final',
  },
  pt: {
    k: 'meia',
    p: 'tricô',
    kAbbr: 'm',
    pAbbr: 't',
    yo: 'laçada',
    k2tog: 'tricotar 2 pontos juntos em meia',
    ssk: 'deslizar, deslizar, tricotar juntos',
    sl: 'deslizar',
    castOn: 'montar os pontos',
    bindOff: 'arrematar',
    rs: 'lado direito',
    ws: 'lado avesso',
    rsShort: 'LD',
    wsShort: 'LA',
    stitch: (n) => `${n} ponto${n === 1 ? '' : 's'}`,
    row: (n) => `Carreira ${n}`,
    round: (n) => `Volta ${n}`,
    rowWord: 'carreira',
    roundWord: 'volta',
    repeat: 'repetir',
    repeatToEnd: 'repetir até o final',
  },
};
