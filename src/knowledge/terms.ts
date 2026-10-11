/**
 * Tığ temel ilmekleri ve trabzan adlandırma sistemleri.
 *
 * Türkçe kaynaklarda iki sistem birlikte yaşar:
 *  - 'ipatma'   → adı ip atma sayısından gelir: trabzan (1 ip atma = US dc), ikili trabzan (2 = US tr),
 *                 üçlü trabzan (3 = US dtr), dörtlü trabzan (4 = US trtr).
 *  - 'ingilizce'→ İngilizce adlarla eşleşir: yarım trabzan = hdc, ikili trabzan = dc, üçlü = tr, dörtlü = dtr.
 * Kanonik kimlik olarak US kısaltmaları kullanılır; ekranda kullanıcının sistemine göre ad gösterilir.
 */
import type { TrabzanConvention } from '@/types';

export type CrochetBasicId = 'ch' | 'slst' | 'sc' | 'hdc' | 'dc' | 'tr' | 'dtr' | 'trtr';

export interface CrochetBasic {
  id: CrochetBasicId;
  /** tığa ilmeğe batmadan önce kaç kez ip atılır */
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

const NAMES: Record<TrabzanConvention, Record<CrochetBasicId, string>> = {
  ipatma: {
    ch: 'Zincir',
    slst: 'Kör ilmek',
    sc: 'Sık iğne',
    hdc: 'Yarım trabzan',
    dc: 'Trabzan',
    tr: 'İkili trabzan',
    dtr: 'Üçlü trabzan',
    trtr: 'Dörtlü trabzan',
  },
  ingilizce: {
    ch: 'Zincir',
    slst: 'Kör ilmek',
    sc: 'Sık iğne',
    hdc: 'Yarım trabzan',
    dc: 'İkili trabzan',
    tr: 'Üçlü trabzan',
    dtr: 'Dörtlü trabzan',
    trtr: 'Beşli trabzan',
  },
};

const ABBR: Record<TrabzanConvention, Record<CrochetBasicId, string>> = {
  ipatma: { ch: 'zn', slst: 'kİ', sc: 'sı', hdc: 'yt', dc: 'tr', tr: '2tr', dtr: '3tr', trtr: '4tr' },
  ingilizce: { ch: 'zn', slst: 'kİ', sc: 'sı', hdc: 'yt', dc: '2tr', tr: '3tr', dtr: '4tr', trtr: '5tr' },
};

/** "Trabzan" / "İkili trabzan" … kullanıcının sistemine göre */
export function crochetName(id: CrochetBasicId, conv: TrabzanConvention): string {
  return NAMES[conv][id];
}

/** küçük harfle başlayan ad: cümle içinde kullanmak için ("3 trabzan ör") */
export function crochetNameLower(id: CrochetBasicId, conv: TrabzanConvention): string {
  const n = NAMES[conv][id];
  return n.charAt(0).toLocaleLowerCase('tr-TR') + n.slice(1);
}

export function crochetAbbr(id: CrochetBasicId, conv: TrabzanConvention): string {
  return ABBR[conv][id];
}

/** "Trabzan (US dc · 1 ip atma)" */
export function crochetLabel(id: CrochetBasicId, conv: TrabzanConvention, withEnglish = true): string {
  const b = CROCHET_BASICS[id];
  const name = crochetName(id, conv);
  if (!withEnglish) return name;
  const yo = b.yarnOvers > 0 ? ` · ${b.yarnOvers} ip atma` : '';
  return `${name} (US ${b.us}${yo})`;
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

/* ── Sık kullanılan genel terimler ─────────────────────── */
export const KNIT_TERMS = {
  k: { tr: 'düz', abbr: 'd', us: 'k', usName: 'knit' },
  p: { tr: 'ters', abbr: 't', us: 'p', usName: 'purl' },
  yo: { tr: 'ip at', abbr: 'ia', us: 'yo', usName: 'yarn over' },
  k2tog: { tr: '2 ilmeği birlikte düz ör', abbr: '2bd', us: 'k2tog', usName: 'knit two together' },
  ssk: { tr: 'kaydır, kaydır, birlikte düz ör', abbr: 'kkd', us: 'ssk', usName: 'slip slip knit' },
  sl: { tr: 'ilmeği örmeden kaydır', abbr: 'kay', us: 'sl', usName: 'slip' },
  co: { tr: 'ilmek at', abbr: '', us: 'CO', usName: 'cast on' },
  bo: { tr: 'ilmek kapat', abbr: '', us: 'BO', usName: 'bind off' },
  rs: { tr: 'ön yüz (sağ yüz)', abbr: 'ÖY', us: 'RS', usName: 'right side' },
  ws: { tr: 'arka yüz (ters yüz)', abbr: 'AY', us: 'WS', usName: 'wrong side' },
  pm: { tr: 'işaretleyici tak', abbr: '', us: 'pm', usName: 'place marker' },
  sm: { tr: 'işaretleyiciyi kaydır', abbr: '', us: 'sm', usName: 'slip marker' },
} as const;

const PLACEHOLDER = /\{(ch|slst|sc|hdc|dc|tr|dtr|trtr)\}/g;

/**
 * Metindeki {sc}, {dc} gibi yer tutucuları kullanıcının trabzan sistemine göre doldurur.
 * Büyük harfle başlatmak için {Dc} gibi yazılabilir.
 */
export function fillTerms(text: string, conv: TrabzanConvention): string {
  return text
    .replace(/\{(Ch|Slst|Sc|Hdc|Dc|Tr|Dtr|Trtr)\}/g, (_, k: string) => crochetName(k.toLowerCase() as CrochetBasicId, conv))
    .replace(PLACEHOLDER, (_, k: CrochetBasicId) => crochetNameLower(k, conv));
}
