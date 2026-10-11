/**
 * Desen grafiği sembolleri (Craft Yarn Council / JIS gelenekleri esas alınmıştır).
 *
 * Çizim verisi 100×100'lük bir hücre kutusundadır (çok hücreli burgu sembollerinde span·100 × 100).
 *  - d     : mürekkeple çizilecek çizgiler (SVG path)
 *  - fd    : içi dolu şekiller
 *  - under : burgu sembollerinde ALTTA kalan şeritler (öndeki şerit onları keser)
 *  - bg    : hücre arka planı ('nostitch' → gri "ilmek yok" hücresi)
 * Şiş sembolleri ÖN YÜZDEN görünüşü anlatır; ters yüz sıralarında anlamı tersine döner (ws).
 */
import type { Craft, TrabzanConvention } from '@/types';
import { crochetName, type CrochetBasicId } from './terms';

/** Kumaş simülasyonunda bu hücre nasıl görünür */
export type FabricLook = 'knit' | 'purl' | 'yo' | 'k2tog' | 'ssk' | 'cdd' | 'sl' | 'inc' | 'twist' | 'bobble' | 'cableL' | 'cableR' | 'none';

export interface ChartSymbol {
  id: string;
  craft: Craft;
  /** Türkçe ad */
  name: string;
  /** kısa açıklama (araç ipucu) */
  hint: string;
  /** US kısaltması */
  en: string;
  d?: string;
  fd?: string;
  under?: string;
  span?: number;
  bg?: 'nostitch';
  /* ── şiş anlamı ── */
  /** ön yüz sırasında yapılacak işlem */
  rs?: string;
  /** arka yüz sırasında yapılacak işlem (ön yüzde aynı görüntüyü vermek için) */
  ws?: string;
  /** kaç ilmek tüketir / kaç ilmek üretir */
  consumes?: number;
  produces?: number;
  fabric?: FabricLook;
  /** ilgili Akademi dersi */
  lessonId?: string;
  /* ── tığ anlamı ── */
  basic?: CrochetBasicId;
  group: 'temel' | 'artirma' | 'eksiltme' | 'doku' | 'burgu' | 'ozel';
}

const dot = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const ring = dot;
const T = 'M50 86 L50 16 M30 16 L70 16';

export const KNIT_SYMBOLS: ChartSymbol[] = [
  { id: 'k', craft: 'knit', name: 'Düz', hint: 'Ön yüzde düz, arka yüzde ters ör', en: 'k', rs: 'düz', ws: 'ters', consumes: 1, produces: 1, fabric: 'knit', lessonId: 'sis-duz-ilmek', group: 'temel' },
  { id: 'p', craft: 'knit', name: 'Ters', hint: 'Ön yüzde ters, arka yüzde düz ör', en: 'p', fd: dot(50, 50, 11), rs: 'ters', ws: 'düz', consumes: 1, produces: 1, fabric: 'purl', lessonId: 'sis-ters-ilmek', group: 'temel' },
  { id: 'yo', craft: 'knit', name: 'İp at', hint: 'Şişe ip at (ajur deliği, 1 ilmek artar)', en: 'yo', d: ring(50, 50, 22), rs: 'ip at', ws: 'ip at', consumes: 0, produces: 1, fabric: 'yo', lessonId: 'sis-ip-atma', group: 'artirma' },
  { id: 'k2tog', craft: 'knit', name: '2 birlikte düz', hint: 'Sağa yatık eksiltme', en: 'k2tog', d: 'M20 84 L80 16', rs: '2 ilmeği birlikte düz ör', ws: '2 ilmeği birlikte ters ör', consumes: 2, produces: 1, fabric: 'k2tog', lessonId: 'sis-eksiltme', group: 'eksiltme' },
  { id: 'ssk', craft: 'knit', name: 'Kaydır-kaydır-ör', hint: 'Sola yatık eksiltme (ssk)', en: 'ssk', d: 'M20 16 L80 84', rs: 'kaydır, kaydır, birlikte düz ör (ssk)', ws: 'kaydır, kaydır, birlikte arkadan ters ör (ssp)', consumes: 2, produces: 1, fabric: 'ssk', lessonId: 'sis-eksiltme', group: 'eksiltme' },
  { id: 'cdd', craft: 'knit', name: 'Merkezden çift eksiltme', hint: '2 ilmeği birlikte kaydır, 1 düz, kaydırılanları üstünden geçir', en: 's2kp', d: 'M18 84 L50 16 L82 84 M50 16 L50 84', rs: '2 ilmeği birlikte kaydır, 1 düz, kaydırılanları üstünden geçir', ws: '3 ilmeği birlikte ters ör', consumes: 3, produces: 1, fabric: 'cdd', lessonId: 'sis-eksiltme', group: 'eksiltme' },
  { id: 'k3tog', craft: 'knit', name: '3 birlikte düz', hint: 'Sağa yatık çift eksiltme', en: 'k3tog', d: 'M18 84 L82 16 M48 84 L82 16', rs: '3 ilmeği birlikte düz ör', ws: '3 ilmeği birlikte ters ör', consumes: 3, produces: 1, fabric: 'k2tog', group: 'eksiltme' },
  { id: 'sk2p', craft: 'knit', name: 'Kaydır-2 birlikte-geçir', hint: 'Sola yatık çift eksiltme', en: 'sk2p', d: 'M18 16 L82 84 M18 16 L52 84', rs: '1 kaydır, 2 birlikte düz, kaydırılanı üstünden geçir', ws: '3 ilmeği birlikte arkadan ters ör', consumes: 3, produces: 1, fabric: 'ssk', group: 'eksiltme' },
  { id: 'm1l', craft: 'knit', name: 'Sola artırma (M1L)', hint: 'Aradaki ipi önden kaldırıp arkasından ör', en: 'M1L', d: 'M30 82 L30 30 L50 58 L70 30 L70 82', fd: 'M10 12 L32 12 L10 34Z', rs: 'sola yatık artır (M1L)', ws: 'sola yatık ters artır (M1LP)', consumes: 0, produces: 1, fabric: 'inc', lessonId: 'sis-artirma', group: 'artirma' },
  { id: 'm1r', craft: 'knit', name: 'Sağa artırma (M1R)', hint: 'Aradaki ipi arkadan kaldırıp önünden ör', en: 'M1R', d: 'M30 82 L30 30 L50 58 L70 30 L70 82', fd: 'M90 12 L68 12 L90 34Z', rs: 'sağa yatık artır (M1R)', ws: 'sağa yatık ters artır (M1RP)', consumes: 0, produces: 1, fabric: 'inc', lessonId: 'sis-artirma', group: 'artirma' },
  { id: 'kfb', craft: 'knit', name: 'Önden-arkadan ör', hint: 'Aynı ilmeği önce önden sonra arkadan ör (kfb)', en: 'kfb', d: 'M50 86 L50 52 M50 52 L26 16 M50 52 L74 16', rs: 'aynı ilmeği önden ve arkadan düz ör (kfb)', ws: 'aynı ilmeği önden ve arkadan ters ör (pfb)', consumes: 1, produces: 2, fabric: 'inc', lessonId: 'sis-artirma', group: 'artirma' },
  { id: 'sl', craft: 'knit', name: 'Kaydır (ip arkada)', hint: 'İlmeği örmeden sağ şişe al; ip işin arkasında', en: 'sl wyib', d: 'M26 20 L50 82 L74 20', rs: 'ip arkada ilmeği ters örer gibi kaydır', ws: 'ip önde ilmeği ters örer gibi kaydır', consumes: 1, produces: 1, fabric: 'sl', group: 'doku' },
  { id: 'slf', craft: 'knit', name: 'Kaydır (ip önde)', hint: 'İlmeği örmeden kaydır; ip işin önünde (önde çizgi bırakır)', en: 'sl wyif', d: 'M30 30 L50 82 L70 30 M20 16 L80 16', rs: 'ip önde ilmeği kaydır', ws: 'ip arkada ilmeği kaydır', consumes: 1, produces: 1, fabric: 'sl', group: 'doku' },
  { id: 'ktbl', craft: 'knit', name: 'Burgulu düz', hint: 'İlmeğin arka bacağından düz ör (burgulu ilmek)', en: 'k tbl', d: 'M36 86 C36 46 64 54 64 16 M64 86 C64 46 36 54 36 16', rs: 'arka bacaktan düz ör (burgulu)', ws: 'arka bacaktan ters ör (burgulu)', consumes: 1, produces: 1, fabric: 'twist', group: 'doku' },
  { id: 'mb', craft: 'knit', name: 'Pıtırcık (bobble)', hint: 'Aynı ilmekten 5 ilmek çıkar, 4 sıra ör, birleştir', en: 'MB', fd: 'M50 18 L78 38 L68 76 L32 76 L22 38Z', rs: 'pıtırcık yap', ws: 'pıtırcık yap', consumes: 1, produces: 1, fabric: 'bobble', lessonId: 'sis-artirma', group: 'doku' },
  { id: 'ns', craft: 'knit', name: 'İlmek yok', hint: 'Bu karede ilmek yok — atla', en: 'no stitch', bg: 'nostitch', rs: '', ws: '', consumes: 0, produces: 0, fabric: 'none', group: 'ozel' },
  {
    id: 'c2l',
    craft: 'knit',
    name: '1/1 sola burgu',
    hint: '1 ilmeği öne al (yardımcı şiş önde), 1 düz, yardımcıdakini düz ör',
    en: '1/1 LC',
    span: 2,
    d: 'M150 92 L50 8',
    under: 'M50 92 L150 8',
    rs: '1/1 sola burgu (yardımcı şiş önde)',
    ws: '1/1 sola burgu (ters yüzde)',
    consumes: 2,
    produces: 2,
    fabric: 'cableL',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c2r',
    craft: 'knit',
    name: '1/1 sağa burgu',
    hint: '1 ilmeği arkaya al (yardımcı şiş arkada), 1 düz, yardımcıdakini düz ör',
    en: '1/1 RC',
    span: 2,
    d: 'M50 92 L150 8',
    under: 'M150 92 L50 8',
    rs: '1/1 sağa burgu (yardımcı şiş arkada)',
    ws: '1/1 sağa burgu (ters yüzde)',
    consumes: 2,
    produces: 2,
    fabric: 'cableR',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c4l',
    craft: 'knit',
    name: '2/2 sola burgu',
    hint: '2 ilmeği yardımcı şişe alıp öne bırak, 2 düz, yardımcıdakileri düz ör',
    en: '2/2 LC',
    span: 4,
    d: 'M250 92 L50 8 M350 92 L150 8',
    under: 'M50 92 L250 8 M150 92 L350 8',
    rs: '2/2 sola burgu (yardımcı şiş önde)',
    ws: '2/2 sola burgu',
    consumes: 4,
    produces: 4,
    fabric: 'cableL',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c4r',
    craft: 'knit',
    name: '2/2 sağa burgu',
    hint: '2 ilmeği yardımcı şişe alıp arkaya bırak, 2 düz, yardımcıdakileri düz ör',
    en: '2/2 RC',
    span: 4,
    d: 'M50 92 L250 8 M150 92 L350 8',
    under: 'M250 92 L50 8 M350 92 L150 8',
    rs: '2/2 sağa burgu (yardımcı şiş arkada)',
    ws: '2/2 sağa burgu',
    consumes: 4,
    produces: 4,
    fabric: 'cableR',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c6l',
    craft: 'knit',
    name: '3/3 sola burgu',
    hint: '3 ilmeği yardımcı şişe alıp öne bırak, 3 düz, yardımcıdakileri düz ör',
    en: '3/3 LC',
    span: 6,
    d: 'M350 92 L50 8 M450 92 L150 8 M550 92 L250 8',
    under: 'M50 92 L350 8 M150 92 L450 8 M250 92 L550 8',
    rs: '3/3 sola burgu (yardımcı şiş önde)',
    ws: '3/3 sola burgu',
    consumes: 6,
    produces: 6,
    fabric: 'cableL',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c6r',
    craft: 'knit',
    name: '3/3 sağa burgu',
    hint: '3 ilmeği yardımcı şişe alıp arkaya bırak, 3 düz, yardımcıdakileri düz ör',
    en: '3/3 RC',
    span: 6,
    d: 'M50 92 L350 8 M150 92 L450 8 M250 92 L550 8',
    under: 'M350 92 L50 8 M450 92 L150 8 M550 92 L250 8',
    rs: '3/3 sağa burgu (yardımcı şiş arkada)',
    ws: '3/3 sağa burgu',
    consumes: 6,
    produces: 6,
    fabric: 'cableR',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
];

const slash = (y: number) => `M38 ${y} L62 ${y - 14}`;

export const CROCHET_SYMBOLS: ChartSymbol[] = [
  { id: 'ch', craft: 'crochet', name: 'Zincir', hint: 'Zincir ilmek', en: 'ch', d: 'M22 50 a28 15 0 1 0 56 0 a28 15 0 1 0 -56 0Z', basic: 'ch', lessonId: 'tig-zincir', group: 'temel' },
  { id: 'slst', craft: 'crochet', name: 'Kör ilmek', hint: 'Kaydırma ilmeği', en: 'sl st', fd: dot(50, 50, 12), basic: 'slst', lessonId: 'tig-kor-ilmek', group: 'temel' },
  { id: 'sc', craft: 'crochet', name: 'Sık iğne', hint: 'US sc', en: 'sc', d: 'M30 30 L70 70 M70 30 L30 70', basic: 'sc', lessonId: 'tig-sik-igne', group: 'temel' },
  { id: 'hdc', craft: 'crochet', name: 'Yarım trabzan', hint: 'US hdc · 1 ip atma, 3 ilmekten birden geçir', en: 'hdc', d: T, basic: 'hdc', lessonId: 'tig-yarim-trabzan', group: 'temel' },
  { id: 'dc', craft: 'crochet', name: 'Trabzan (1 ip atma)', hint: 'US dc', en: 'dc', d: `${T} ${slash(58)}`, basic: 'dc', lessonId: 'tig-trabzan', group: 'temel' },
  { id: 'tr', craft: 'crochet', name: 'Trabzan (2 ip atma)', hint: 'US tr', en: 'tr', d: `${T} ${slash(50)} ${slash(66)}`, basic: 'tr', lessonId: 'tig-trabzan-2', group: 'temel' },
  { id: 'dtr', craft: 'crochet', name: 'Trabzan (3 ip atma)', hint: 'US dtr', en: 'dtr', d: `${T} ${slash(44)} ${slash(58)} ${slash(72)}`, basic: 'dtr', lessonId: 'tig-trabzan-3', group: 'temel' },
  { id: 'trtr', craft: 'crochet', name: 'Trabzan (4 ip atma)', hint: 'US trtr', en: 'trtr', d: `${T} ${slash(40)} ${slash(52)} ${slash(64)} ${slash(76)}`, basic: 'trtr', group: 'temel' },
  { id: 'mr', craft: 'crochet', name: 'Sihirli halka', hint: 'Ayarlanabilir başlangıç halkası', en: 'MR', d: ring(50, 50, 30), lessonId: 'tig-sihirli-halka', group: 'ozel' },
  { id: 'scinc', craft: 'crochet', name: 'Sık iğne artırma', hint: 'Aynı ilmeğe 2 sık iğne', en: 'sc inc', d: 'M50 90 L28 22 M50 90 L72 22 M22 28 L36 42 M36 28 L22 42 M64 28 L78 42 M78 28 L64 42', basic: 'sc', lessonId: 'tig-artirma', group: 'artirma' },
  { id: 'sc2tog', craft: 'crochet', name: 'Sık iğne eksiltme', hint: '2 ilmeği birlikte sık iğne (görünmez eksiltme)', en: 'sc2tog', d: 'M28 88 L50 14 L72 88 M22 60 L36 74 M36 60 L22 74 M64 60 L78 74 M78 60 L64 74', basic: 'sc', lessonId: 'tig-eksiltme', group: 'eksiltme' },
  { id: 'dcinc', craft: 'crochet', name: 'Trabzan artırma', hint: 'Aynı ilmeğe 2 trabzan (1 ip atmalı)', en: 'dc inc', d: 'M50 90 L32 16 M50 90 L68 16 M22 16 L42 16 M58 16 L78 16 M30 52 L44 44 M56 44 L70 52', basic: 'dc', lessonId: 'tig-artirma', group: 'artirma' },
  { id: 'dc2tog', craft: 'crochet', name: 'Trabzan eksiltme', hint: '2 trabzanı tepede birleştir', en: 'dc2tog', d: 'M32 90 L50 16 M68 90 L50 16 M36 16 L64 16 M30 60 L44 52 M56 52 L70 60', basic: 'dc', lessonId: 'tig-eksiltme', group: 'eksiltme' },
  { id: 'shell', craft: 'crochet', name: 'Yelpaze', hint: 'Aynı ilmeğe 5 trabzan', en: 'shell', d: 'M50 92 L14 24 M50 92 L31 15 M50 92 L50 11 M50 92 L69 15 M50 92 L86 24', basic: 'dc', lessonId: 'tig-yelpaze', group: 'doku' },
  { id: 'v', craft: 'crochet', name: 'V ilmek', hint: 'Aynı ilmeğe 1 trabzan, 1 zincir, 1 trabzan', en: 'V-st', d: 'M50 90 L28 18 M50 90 L72 18 M18 18 L38 18 M62 18 L82 18 M28 56 L42 48 M58 48 L72 56 M42 12 a8 5 0 1 0 16 0 a8 5 0 1 0 -16 0Z', basic: 'dc', lessonId: 'tig-v-ilmek', group: 'doku' },
  { id: 'puff', craft: 'crochet', name: 'Fıstık (puff)', hint: 'Aynı ilmekte 3–4 kez ip at-çek, hepsinden birden geçir', en: 'puff', d: 'M50 88 C24 70 28 28 50 16 C72 28 76 70 50 88Z M50 88 C42 66 43 32 50 16 M50 88 C58 66 57 32 50 16 M36 10 L64 10', lessonId: 'tig-fistik', group: 'doku' },
  { id: 'bobble', craft: 'crochet', name: 'Pıtırcık (bobble)', hint: 'Aynı ilmeğe 5 yarım kalmış trabzan, tepede birleştir', en: 'bobble', d: 'M50 90 C30 70 30 34 50 14 C70 34 70 70 50 90 M50 90 L50 14 M38 14 L62 14', fd: dot(50, 52, 6), lessonId: 'tig-pitircik', group: 'doku' },
  { id: 'popcorn', craft: 'crochet', name: 'Patlamış mısır', hint: 'Aynı ilmeğe 5 trabzan; tığı çıkarıp ilkine batır, birleştir', en: 'pc', d: 'M50 92 L24 34 M50 92 L37 28 M50 92 L50 26 M50 92 L63 28 M50 92 L76 34 M22 30 a28 13 0 1 0 56 0 a28 13 0 1 0 -56 0Z', lessonId: 'tig-pitircik', group: 'doku' },
  { id: 'fpdc', craft: 'crochet', name: 'Ön kabartma trabzan', hint: 'Alttaki trabzanın gövdesini önden sararak ör', en: 'FPdc', d: `M50 16 L50 76 C50 92 68 92 68 78 M30 16 L70 16 ${slash(52)}`, basic: 'dc', lessonId: 'tig-kabartma', group: 'doku' },
  { id: 'bpdc', craft: 'crochet', name: 'Arka kabartma trabzan', hint: 'Alttaki trabzanın gövdesini arkadan sararak ör', en: 'BPdc', d: `M50 16 L50 76 C50 92 32 92 32 78 M30 16 L70 16 ${slash(52)}`, basic: 'dc', lessonId: 'tig-kabartma', group: 'doku' },
  { id: 'scblo', craft: 'crochet', name: 'Arka halkadan sık iğne', hint: 'Yalnız arka halkaya bat (BLO)', en: 'sc BLO', d: 'M32 22 L68 58 M68 22 L32 58 M28 78 Q50 96 72 78', basic: 'sc', lessonId: 'tig-halkalar', group: 'doku' },
  { id: 'scflo', craft: 'crochet', name: 'Ön halkadan sık iğne', hint: 'Yalnız ön halkaya bat (FLO)', en: 'sc FLO', d: 'M32 22 L68 58 M68 22 L32 58 M28 92 Q50 74 72 92', basic: 'sc', lessonId: 'tig-halkalar', group: 'doku' },
  { id: 'crab', craft: 'crochet', name: 'Yengeç (ters sık iğne)', hint: 'Soldan sağa doğru sık iğne — burgulu kenar', en: 'rev sc', d: 'M30 30 L70 70 M70 30 L30 70 M18 88 Q50 70 82 88', basic: 'sc', lessonId: 'tig-yengec', group: 'doku' },
];

export const ALL_SYMBOLS: ChartSymbol[] = [...KNIT_SYMBOLS, ...CROCHET_SYMBOLS];

export const SYMBOL_BY_ID: Record<string, ChartSymbol> = Object.fromEntries(ALL_SYMBOLS.map((s) => [s.id, s]));

export function symbolsFor(craft: Craft): ChartSymbol[] {
  return craft === 'knit' ? KNIT_SYMBOLS : CROCHET_SYMBOLS;
}

export const SYMBOL_GROUP_LABEL: Record<ChartSymbol['group'], string> = {
  temel: 'Temel',
  artirma: 'Artırma',
  eksiltme: 'Eksiltme',
  doku: 'Doku',
  burgu: 'Burgu',
  ozel: 'Özel',
};

/** Sembolün kullanıcıya gösterilecek adı (tığ trabzanlarında adlandırma sistemine uyar) */
export function symbolName(sym: ChartSymbol, conv: TrabzanConvention): string {
  if (sym.craft === 'crochet' && sym.group === 'temel' && sym.basic) return crochetName(sym.basic, conv);
  if (sym.craft === 'crochet' && sym.basic && (sym.id === 'dcinc' || sym.id === 'dc2tog')) {
    const n = crochetName('dc', conv);
    return sym.id === 'dcinc' ? `${n} artırma` : `${n} eksiltme`;
  }
  return sym.name;
}
