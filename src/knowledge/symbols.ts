/**
 * Desen grafiği sembolleri (Craft Yarn Council ve Japon JIS gelenekleri).
 *
 * Çizim verisi 100×100'lük bir hücre kutusundadır (çok hücreli burgu sembollerinde span·100 × 100).
 *  - d     : mürekkeple çizilecek çizgiler (SVG path)
 *  - fd    : içi dolu şekiller
 *  - under : burgu sembollerinde ALTTA kalan şeritler (öndeki şerit onları keser)
 *  - bg    : hücre arka planı ('nostitch' → gri "ilmek yok" hücresi)
 *  - jis   : Japon tarzı çizim (düz = |, ters = —); yoksa CYC çizimi kullanılır
 * Şiş sembolleri ÖN YÜZDEN görünüşü anlatır; arka yüz sıralarında yapılacak iş `ws` alanındadır.
 */
import type { Craft, Lang } from '@/types';
import type { L10n } from '@/i18n';
import { crochetName, type CrochetBasicId, type TermsCtx } from './terms';

/** Kumaş simülasyonunda bu hücre nasıl görünür */
export type FabricLook = 'knit' | 'purl' | 'yo' | 'k2tog' | 'ssk' | 'cdd' | 'sl' | 'inc' | 'twist' | 'bobble' | 'cableL' | 'cableR' | 'none';

export type SymbolStyle = 'cyc' | 'jis';

export interface SymbolGlyphData {
  d?: string;
  fd?: string;
  under?: string;
}

export interface ChartSymbol extends SymbolGlyphData {
  id: string;
  craft: Craft;
  name: L10n;
  hint: L10n;
  /** US kısaltması */
  en: string;
  span?: number;
  bg?: 'nostitch';
  jis?: SymbolGlyphData;
  /* ── şiş anlamı ── */
  /** ön yüz sırasında yapılacak işlem */
  rs?: L10n;
  /** arka yüz sırasında yapılacak işlem (ön yüzde aynı görüntüyü vermek için) */
  ws?: L10n;
  consumes?: number;
  produces?: number;
  fabric?: FabricLook;
  /** ilgili ders */
  lessonId?: string;
  /* ── tığ anlamı ── */
  basic?: CrochetBasicId;
  group: 'temel' | 'artirma' | 'eksiltme' | 'doku' | 'burgu' | 'ozel';
}

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });
const dot = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const ring = dot;
const T = 'M50 86 L50 16 M30 16 L70 16';

export const KNIT_SYMBOLS: ChartSymbol[] = [
  {
    id: 'k',
    craft: 'knit',
    name: l('Düz', 'Knit', 'Derecho', 'Meia'),
    hint: l('Ön yüzde düz, arka yüzde ters ör', 'Knit on RS, purl on WS', 'Derecho en el LD, revés en el LR', 'Meia no lado direito, tricô no avesso'),
    en: 'k',
    jis: { d: 'M50 14 L50 86' },
    rs: l('düz', 'knit', 'derecho', 'meia'),
    ws: l('ters', 'purl', 'revés', 'tricô'),
    consumes: 1,
    produces: 1,
    fabric: 'knit',
    lessonId: 'sis-duz-ilmek',
    group: 'temel',
  },
  {
    id: 'p',
    craft: 'knit',
    name: l('Ters', 'Purl', 'Revés', 'Tricô'),
    hint: l('Ön yüzde ters, arka yüzde düz ör', 'Purl on RS, knit on WS', 'Revés en el LD, derecho en el LR', 'Tricô no lado direito, meia no avesso'),
    en: 'p',
    fd: dot(50, 50, 11),
    jis: { d: 'M16 50 L84 50' },
    rs: l('ters', 'purl', 'revés', 'tricô'),
    ws: l('düz', 'knit', 'derecho', 'meia'),
    consumes: 1,
    produces: 1,
    fabric: 'purl',
    lessonId: 'sis-ters-ilmek',
    group: 'temel',
  },
  {
    id: 'yo',
    craft: 'knit',
    name: l('İp at', 'Yarn over', 'Lazada', 'Laçada'),
    hint: l('Şişe ip at: ajur deliği açar, 1 ilmek artar', 'Wrap yarn over needle: makes a hole, adds 1 stitch', 'Echar hebra: hace un calado y aumenta 1 punto', 'Passar o fio sobre a agulha: faz um furo e aumenta 1 ponto'),
    en: 'yo',
    d: ring(50, 50, 22),
    rs: l('ip at', 'yarn over', 'lazada', 'laçada'),
    ws: l('ip at', 'yarn over', 'lazada', 'laçada'),
    consumes: 0,
    produces: 1,
    fabric: 'yo',
    lessonId: 'sis-ip-atma',
    group: 'artirma',
  },
  {
    id: 'k2tog',
    craft: 'knit',
    name: l('2 birlikte düz', 'Knit 2 together', '2 juntos al derecho', '2 juntos em meia'),
    hint: l('Sağa yatık eksiltme', 'Right-leaning decrease', 'Disminución inclinada a la derecha', 'Diminuição inclinada para a direita'),
    en: 'k2tog',
    d: 'M20 84 L80 16',
    jis: { d: 'M20 86 L62 14 M49 36 L80 86' },
    rs: l('2 ilmeği birlikte düz ör', 'k2tog', 'tejer 2 juntos al derecho', 'tricotar 2 juntos em meia'),
    ws: l('2 ilmeği birlikte ters ör', 'p2tog', 'tejer 2 juntos al revés', 'tricotar 2 juntos em tricô'),
    consumes: 2,
    produces: 1,
    fabric: 'k2tog',
    lessonId: 'sis-eksiltme',
    group: 'eksiltme',
  },
  {
    id: 'ssk',
    craft: 'knit',
    name: l('Kaydır-kaydır-ör', 'Slip slip knit', 'Deslizar, deslizar, tejer', 'Deslizar, deslizar, tricotar'),
    hint: l('Sola yatık eksiltme', 'Left-leaning decrease', 'Disminución inclinada a la izquierda', 'Diminuição inclinada para a esquerda'),
    en: 'ssk',
    d: 'M20 16 L80 84',
    jis: { d: 'M80 86 L38 14 M51 36 L20 86' },
    rs: l('kaydır, kaydır, birlikte düz ör', 'ssk', 'deslizar, deslizar, tejer juntos al derecho', 'deslizar, deslizar, tricotar juntos em meia'),
    ws: l('kaydır, kaydır, arkadan birlikte ters ör', 'ssp', 'deslizar, deslizar, tejer juntos al revés por detrás', 'deslizar, deslizar, tricotar juntos em tricô por trás'),
    consumes: 2,
    produces: 1,
    fabric: 'ssk',
    lessonId: 'sis-eksiltme',
    group: 'eksiltme',
  },
  {
    id: 'cdd',
    craft: 'knit',
    name: l('Merkezden çift eksiltme', 'Centered double decrease', 'Disminución doble central', 'Diminuição dupla central'),
    hint: l(
      '2 ilmeği birlikte kaydır, 1 düz, kaydırılanları üstünden geçir',
      'Slip 2 together, knit 1, pass the slipped stitches over',
      'Deslizar 2 juntos, tejer 1, pasar los deslizados por encima',
      'Deslizar 2 juntos, tricotar 1, passar os deslizados por cima',
    ),
    en: 's2kp',
    d: 'M18 84 L50 16 L82 84 M50 16 L50 84',
    rs: l('2 ilmeği birlikte kaydır, 1 düz, kaydırılanları üstünden geçir', 's2kp', 'deslizar 2 juntos, 1 derecho, pasar por encima', 'deslizar 2 juntos, 1 meia, passar por cima'),
    ws: l('3 ilmeği birlikte ters ör', 'p3tog', 'tejer 3 juntos al revés', 'tricotar 3 juntos em tricô'),
    consumes: 3,
    produces: 1,
    fabric: 'cdd',
    lessonId: 'sis-eksiltme',
    group: 'eksiltme',
  },
  {
    id: 'k3tog',
    craft: 'knit',
    name: l('3 birlikte düz', 'Knit 3 together', '3 juntos al derecho', '3 juntos em meia'),
    hint: l('Sağa yatık çift eksiltme', 'Right-leaning double decrease', 'Disminución doble a la derecha', 'Diminuição dupla para a direita'),
    en: 'k3tog',
    d: 'M18 84 L82 16 M48 84 L82 16',
    rs: l('3 ilmeği birlikte düz ör', 'k3tog', 'tejer 3 juntos al derecho', 'tricotar 3 juntos em meia'),
    ws: l('3 ilmeği birlikte ters ör', 'p3tog', 'tejer 3 juntos al revés', 'tricotar 3 juntos em tricô'),
    consumes: 3,
    produces: 1,
    fabric: 'k2tog',
    lessonId: 'sis-eksiltme',
    group: 'eksiltme',
  },
  {
    id: 'sk2p',
    craft: 'knit',
    name: l('Kaydır, 2 birlikte, geçir', 'Slip, k2tog, pass over', 'Deslizar, 2 juntos, pasar', 'Deslizar, 2 juntos, passar'),
    hint: l('Sola yatık çift eksiltme', 'Left-leaning double decrease', 'Disminución doble a la izquierda', 'Diminuição dupla para a esquerda'),
    en: 'sk2p',
    d: 'M18 16 L82 84 M18 16 L52 84',
    rs: l('1 kaydır, 2 birlikte düz, kaydırılanı üstünden geçir', 'sk2p', 'deslizar 1, 2 juntos al derecho, pasar el deslizado', 'deslizar 1, 2 juntos em meia, passar o deslizado'),
    ws: l('3 ilmeği arkadan birlikte ters ör', 'p3tog tbl', 'tejer 3 juntos al revés por detrás', 'tricotar 3 juntos em tricô por trás'),
    consumes: 3,
    produces: 1,
    fabric: 'ssk',
    lessonId: 'sis-eksiltme',
    group: 'eksiltme',
  },
  {
    id: 'm1l',
    craft: 'knit',
    name: l('Sola artırma', 'Make 1 left', 'Aumento a la izquierda', 'Aumento à esquerda'),
    hint: l('Aradaki ipi önden kaldırıp arka bacağından ör', 'Lift the bar front to back, knit through the back loop', 'Levantar la hebra de delante hacia atrás y tejer por detrás', 'Levantar o fio da frente para trás e tricotar por trás'),
    en: 'M1L',
    d: 'M30 82 L30 30 L50 58 L70 30 L70 82',
    fd: 'M10 12 L32 12 L10 34Z',
    rs: l('sola yatık artır (M1L)', 'M1L', 'aumento a la izquierda (M1L)', 'aumento à esquerda (M1L)'),
    ws: l('sola yatık ters artır (M1LP)', 'M1LP', 'aumento al revés a la izquierda', 'aumento em tricô à esquerda'),
    consumes: 0,
    produces: 1,
    fabric: 'inc',
    lessonId: 'sis-artirma',
    group: 'artirma',
  },
  {
    id: 'm1r',
    craft: 'knit',
    name: l('Sağa artırma', 'Make 1 right', 'Aumento a la derecha', 'Aumento à direita'),
    hint: l('Aradaki ipi arkadan kaldırıp ön bacağından ör', 'Lift the bar back to front, knit through the front loop', 'Levantar la hebra de atrás hacia delante y tejer por delante', 'Levantar o fio de trás para a frente e tricotar pela frente'),
    en: 'M1R',
    d: 'M30 82 L30 30 L50 58 L70 30 L70 82',
    fd: 'M90 12 L68 12 L90 34Z',
    rs: l('sağa yatık artır (M1R)', 'M1R', 'aumento a la derecha (M1R)', 'aumento à direita (M1R)'),
    ws: l('sağa yatık ters artır (M1RP)', 'M1RP', 'aumento al revés a la derecha', 'aumento em tricô à direita'),
    consumes: 0,
    produces: 1,
    fabric: 'inc',
    lessonId: 'sis-artirma',
    group: 'artirma',
  },
  {
    id: 'kfb',
    craft: 'knit',
    name: l('Önden-arkadan ör', 'Knit front and back', 'Tejer por delante y por detrás', 'Tricotar pela frente e por trás'),
    hint: l('Aynı ilmeği önce önden sonra arkadan ör', 'Knit into the same stitch through front then back loop', 'Tejer el mismo punto por delante y luego por detrás', 'Tricotar o mesmo ponto pela frente e depois por trás'),
    en: 'kfb',
    d: 'M50 86 L50 52 M50 52 L26 16 M50 52 L74 16',
    rs: l('aynı ilmeği önden ve arkadan düz ör (kfb)', 'kfb', 'tejer por delante y por detrás (kfb)', 'tricotar pela frente e por trás (kfb)'),
    ws: l('aynı ilmeği önden ve arkadan ters ör (pfb)', 'pfb', 'tejer al revés por delante y por detrás', 'tricotar em tricô pela frente e por trás'),
    consumes: 1,
    produces: 2,
    fabric: 'inc',
    lessonId: 'sis-artirma',
    group: 'artirma',
  },
  {
    id: 'sl',
    craft: 'knit',
    name: l('Kaydır (ip arkada)', 'Slip with yarn in back', 'Deslizar (hebra detrás)', 'Deslizar (fio atrás)'),
    hint: l('İlmeği örmeden sağ şişe al, ip işin arkasında', 'Move the stitch unworked, yarn at back', 'Pasar el punto sin tejer, hebra detrás', 'Passar o ponto sem tricotar, fio atrás'),
    en: 'sl wyib',
    d: 'M26 20 L50 82 L74 20',
    rs: l('ip arkada ilmeği ters örer gibi kaydır', 'slip 1 purlwise with yarn in back', 'deslizar 1 como al revés con hebra detrás', 'deslizar 1 como em tricô com fio atrás'),
    ws: l('ip önde ilmeği ters örer gibi kaydır', 'slip 1 purlwise with yarn in front', 'deslizar 1 como al revés con hebra delante', 'deslizar 1 como em tricô com fio na frente'),
    consumes: 1,
    produces: 1,
    fabric: 'sl',
    lessonId: 'sis-kaydirma',
    group: 'doku',
  },
  {
    id: 'slf',
    craft: 'knit',
    name: l('Kaydır (ip önde)', 'Slip with yarn in front', 'Deslizar (hebra delante)', 'Deslizar (fio na frente)'),
    hint: l('İlmeği örmeden kaydır, ip önde: önde yatay çubuk bırakır', 'Slip with yarn in front: leaves a bar on the front', 'Deslizar con hebra delante: deja una barra delante', 'Deslizar com fio na frente: deixa uma barra na frente'),
    en: 'sl wyif',
    d: 'M30 30 L50 82 L70 30 M20 16 L80 16',
    rs: l('ip önde ilmeği kaydır', 'slip 1 with yarn in front', 'deslizar 1 con hebra delante', 'deslizar 1 com fio na frente'),
    ws: l('ip arkada ilmeği kaydır', 'slip 1 with yarn in back', 'deslizar 1 con hebra detrás', 'deslizar 1 com fio atrás'),
    consumes: 1,
    produces: 1,
    fabric: 'sl',
    lessonId: 'sis-kaydirma',
    group: 'doku',
  },
  {
    id: 'ktbl',
    craft: 'knit',
    name: l('Burgulu düz', 'Knit through back loop', 'Derecho retorcido', 'Meia torcida'),
    hint: l('İlmeğin arka bacağından düz ör', 'Knit into the back leg of the stitch', 'Tejer por la hebra de atrás del punto', 'Tricotar pela perna de trás do ponto'),
    en: 'k tbl',
    d: 'M36 86 C36 46 64 54 64 16 M64 86 C64 46 36 54 36 16',
    jis: { d: 'M50 86 L50 56 C30 50 30 16 50 16 C70 16 70 50 50 56' },
    rs: l('arka bacaktan düz ör', 'k tbl', 'derecho por detrás', 'meia por trás'),
    ws: l('arka bacaktan ters ör', 'p tbl', 'revés por detrás', 'tricô por trás'),
    consumes: 1,
    produces: 1,
    fabric: 'twist',
    lessonId: 'sis-lastik',
    group: 'doku',
  },
  {
    id: 'mb',
    craft: 'knit',
    name: l('Pıtırcık', 'Make bobble', 'Bodoque', 'Pipoca'),
    hint: l('Aynı ilmekten 5 ilmek çıkar, birkaç sıra ör, birleştir', 'Make 5 stitches from one, work a few rows, gather them', 'Hacer 5 puntos de uno, tejer unas vueltas, cerrar juntos', 'Fazer 5 pontos de um, tricotar algumas carreiras, fechar juntos'),
    en: 'MB',
    fd: 'M50 18 L78 38 L68 76 L32 76 L22 38Z',
    jis: { fd: dot(50, 50, 20) },
    rs: l('pıtırcık yap', 'make bobble', 'hacer bodoque', 'fazer pipoca'),
    ws: l('pıtırcık yap', 'make bobble', 'hacer bodoque', 'fazer pipoca'),
    consumes: 1,
    produces: 1,
    fabric: 'bobble',
    group: 'doku',
  },
  {
    id: 'ns',
    craft: 'knit',
    name: l('İlmek yok', 'No stitch', 'Sin punto', 'Sem ponto'),
    hint: l('Bu karede ilmek yok, atla', 'No stitch here, skip this square', 'No hay punto, saltar', 'Não há ponto, pular'),
    en: 'no stitch',
    bg: 'nostitch',
    rs: l('', '', '', ''),
    ws: l('', '', '', ''),
    consumes: 0,
    produces: 0,
    fabric: 'none',
    group: 'ozel',
  },
  {
    id: 'c2l',
    craft: 'knit',
    name: l('1/1 sola burgu', '1/1 left cross', 'Cruce 1/1 a la izquierda', 'Trança 1/1 à esquerda'),
    hint: l('1 ilmeği yardımcı şişte önde beklet, 1 düz, yardımcıdakini düz ör', 'Hold 1 st in front on cable needle, k1, k1 from cable needle', '1 punto en aguja auxiliar delante, 1 derecho, el auxiliar al derecho', '1 ponto na agulha auxiliar na frente, 1 meia, o auxiliar em meia'),
    en: '1/1 LC',
    span: 2,
    d: 'M150 92 L50 8',
    under: 'M50 92 L150 8',
    rs: l('1/1 sola burgu', '1/1 LC', 'cruce 1/1 izquierda', 'trança 1/1 esquerda'),
    ws: l('1/1 sola burgu', '1/1 LC', 'cruce 1/1 izquierda', 'trança 1/1 esquerda'),
    consumes: 2,
    produces: 2,
    fabric: 'cableL',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c2r',
    craft: 'knit',
    name: l('1/1 sağa burgu', '1/1 right cross', 'Cruce 1/1 a la derecha', 'Trança 1/1 à direita'),
    hint: l('1 ilmeği yardımcı şişte arkada beklet, 1 düz, yardımcıdakini düz ör', 'Hold 1 st in back on cable needle, k1, k1 from cable needle', '1 punto en aguja auxiliar detrás, 1 derecho, el auxiliar al derecho', '1 ponto na agulha auxiliar atrás, 1 meia, o auxiliar em meia'),
    en: '1/1 RC',
    span: 2,
    d: 'M50 92 L150 8',
    under: 'M150 92 L50 8',
    rs: l('1/1 sağa burgu', '1/1 RC', 'cruce 1/1 derecha', 'trança 1/1 direita'),
    ws: l('1/1 sağa burgu', '1/1 RC', 'cruce 1/1 derecha', 'trança 1/1 direita'),
    consumes: 2,
    produces: 2,
    fabric: 'cableR',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c4l',
    craft: 'knit',
    name: l('2/2 sola burgu', '2/2 left cross', 'Cruce 2/2 a la izquierda', 'Trança 2/2 à esquerda'),
    hint: l('2 ilmeği yardımcı şişte önde beklet, 2 düz, yardımcıdakileri düz ör', 'Hold 2 sts in front, k2, k2 from cable needle', '2 puntos delante en auxiliar, 2 derecho, los auxiliares al derecho', '2 pontos na frente na auxiliar, 2 meia, os auxiliares em meia'),
    en: '2/2 LC',
    span: 4,
    d: 'M250 92 L50 8 M350 92 L150 8',
    under: 'M50 92 L250 8 M150 92 L350 8',
    rs: l('2/2 sola burgu', '2/2 LC', 'cruce 2/2 izquierda', 'trança 2/2 esquerda'),
    ws: l('2/2 sola burgu', '2/2 LC', 'cruce 2/2 izquierda', 'trança 2/2 esquerda'),
    consumes: 4,
    produces: 4,
    fabric: 'cableL',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c4r',
    craft: 'knit',
    name: l('2/2 sağa burgu', '2/2 right cross', 'Cruce 2/2 a la derecha', 'Trança 2/2 à direita'),
    hint: l('2 ilmeği yardımcı şişte arkada beklet, 2 düz, yardımcıdakileri düz ör', 'Hold 2 sts in back, k2, k2 from cable needle', '2 puntos detrás en auxiliar, 2 derecho, los auxiliares al derecho', '2 pontos atrás na auxiliar, 2 meia, os auxiliares em meia'),
    en: '2/2 RC',
    span: 4,
    d: 'M50 92 L250 8 M150 92 L350 8',
    under: 'M250 92 L50 8 M350 92 L150 8',
    rs: l('2/2 sağa burgu', '2/2 RC', 'cruce 2/2 derecha', 'trança 2/2 direita'),
    ws: l('2/2 sağa burgu', '2/2 RC', 'cruce 2/2 derecha', 'trança 2/2 direita'),
    consumes: 4,
    produces: 4,
    fabric: 'cableR',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c6l',
    craft: 'knit',
    name: l('3/3 sola burgu', '3/3 left cross', 'Cruce 3/3 a la izquierda', 'Trança 3/3 à esquerda'),
    hint: l('3 ilmeği yardımcı şişte önde beklet, 3 düz, yardımcıdakileri düz ör', 'Hold 3 sts in front, k3, k3 from cable needle', '3 puntos delante en auxiliar, 3 derecho, los auxiliares al derecho', '3 pontos na frente na auxiliar, 3 meia, os auxiliares em meia'),
    en: '3/3 LC',
    span: 6,
    d: 'M350 92 L50 8 M450 92 L150 8 M550 92 L250 8',
    under: 'M50 92 L350 8 M150 92 L450 8 M250 92 L550 8',
    rs: l('3/3 sola burgu', '3/3 LC', 'cruce 3/3 izquierda', 'trança 3/3 esquerda'),
    ws: l('3/3 sola burgu', '3/3 LC', 'cruce 3/3 izquierda', 'trança 3/3 esquerda'),
    consumes: 6,
    produces: 6,
    fabric: 'cableL',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
  {
    id: 'c6r',
    craft: 'knit',
    name: l('3/3 sağa burgu', '3/3 right cross', 'Cruce 3/3 a la derecha', 'Trança 3/3 à direita'),
    hint: l('3 ilmeği yardımcı şişte arkada beklet, 3 düz, yardımcıdakileri düz ör', 'Hold 3 sts in back, k3, k3 from cable needle', '3 puntos detrás en auxiliar, 3 derecho, los auxiliares al derecho', '3 pontos atrás na auxiliar, 3 meia, os auxiliares em meia'),
    en: '3/3 RC',
    span: 6,
    d: 'M50 92 L350 8 M150 92 L450 8 M250 92 L550 8',
    under: 'M350 92 L50 8 M450 92 L150 8 M550 92 L250 8',
    rs: l('3/3 sağa burgu', '3/3 RC', 'cruce 3/3 derecha', 'trança 3/3 direita'),
    ws: l('3/3 sağa burgu', '3/3 RC', 'cruce 3/3 derecha', 'trança 3/3 direita'),
    consumes: 6,
    produces: 6,
    fabric: 'cableR',
    lessonId: 'sis-burgu',
    group: 'burgu',
  },
];

const slash = (y: number) => `M38 ${y} L62 ${y - 14}`;

export const CROCHET_SYMBOLS: ChartSymbol[] = [
  { id: 'ch', craft: 'crochet', name: l('Zincir', 'Chain', 'Cadeneta', 'Correntinha'), hint: l('Zincir ilmek', 'Chain stitch', 'Punto cadeneta', 'Ponto correntinha'), en: 'ch', d: 'M22 50 a28 15 0 1 0 56 0 a28 15 0 1 0 -56 0Z', basic: 'ch', lessonId: 'tig-zincir', group: 'temel' },
  { id: 'slst', craft: 'crochet', name: l('Kör ilmek', 'Slip stitch', 'Punto raso', 'Ponto baixíssimo'), hint: l('Kaydırma ilmeği', 'Slip stitch', 'Punto deslizado', 'Ponto deslizado'), en: 'sl st', fd: dot(50, 50, 12), basic: 'slst', lessonId: 'tig-kor-ilmek', group: 'temel' },
  { id: 'sc', craft: 'crochet', name: l('Sık iğne', 'Single crochet', 'Punto bajo', 'Ponto baixo'), hint: l('US sc', 'US sc (UK dc)', 'US sc', 'US sc'), en: 'sc', d: 'M30 30 L70 70 M70 30 L30 70', basic: 'sc', lessonId: 'tig-sik-igne', group: 'temel' },
  { id: 'hdc', craft: 'crochet', name: l('Yarım trabzan', 'Half double crochet', 'Punto medio alto', 'Meio ponto alto'), hint: l('1 ip atma, 3 ilmekten birden geçir', '1 yarn over, pull through all 3 loops', '1 lazada, sacar por las 3 lazadas', '1 laçada, puxar pelas 3 alças'), en: 'hdc', d: T, basic: 'hdc', lessonId: 'tig-yarim-trabzan', group: 'temel' },
  { id: 'dc', craft: 'crochet', name: l('Trabzan (1 ip atma)', 'Double crochet', 'Punto alto', 'Ponto alto'), hint: l('US dc', 'US dc (UK tr)', 'US dc', 'US dc'), en: 'dc', d: `${T} ${slash(58)}`, basic: 'dc', lessonId: 'tig-trabzan', group: 'temel' },
  { id: 'tr', craft: 'crochet', name: l('Trabzan (2 ip atma)', 'Treble crochet', 'Punto alto doble', 'Ponto alto duplo'), hint: l('US tr', 'US tr (UK dtr)', 'US tr', 'US tr'), en: 'tr', d: `${T} ${slash(50)} ${slash(66)}`, basic: 'tr', lessonId: 'tig-trabzan-2', group: 'temel' },
  { id: 'dtr', craft: 'crochet', name: l('Trabzan (3 ip atma)', 'Double treble', 'Punto alto triple', 'Ponto alto triplo'), hint: l('US dtr', 'US dtr (UK trtr)', 'US dtr', 'US dtr'), en: 'dtr', d: `${T} ${slash(44)} ${slash(58)} ${slash(72)}`, basic: 'dtr', lessonId: 'tig-trabzan-3', group: 'temel' },
  { id: 'trtr', craft: 'crochet', name: l('Trabzan (4 ip atma)', 'Triple treble', 'Punto alto cuádruple', 'Ponto alto quádruplo'), hint: l('US trtr', 'US trtr', 'US trtr', 'US trtr'), en: 'trtr', d: `${T} ${slash(40)} ${slash(52)} ${slash(64)} ${slash(76)}`, basic: 'trtr', group: 'temel' },
  { id: 'mr', craft: 'crochet', name: l('Sihirli halka', 'Magic ring', 'Anillo mágico', 'Anel mágico'), hint: l('Ayarlanabilir başlangıç halkası', 'Adjustable starting ring', 'Anillo ajustable de inicio', 'Anel ajustável de início'), en: 'MR', d: ring(50, 50, 30), lessonId: 'tig-sihirli-halka', group: 'ozel' },
  { id: 'scinc', craft: 'crochet', name: l('Sık iğne artırma', 'Single crochet increase', 'Aumento de punto bajo', 'Aumento de ponto baixo'), hint: l('Aynı ilmeğe 2 sık iğne', '2 sc in the same stitch', '2 pb en el mismo punto', '2 pb no mesmo ponto'), en: 'sc inc', d: 'M50 90 L28 22 M50 90 L72 22 M22 28 L36 42 M36 28 L22 42 M64 28 L78 42 M78 28 L64 42', basic: 'sc', lessonId: 'tig-artirma', group: 'artirma' },
  { id: 'sc2tog', craft: 'crochet', name: l('Sık iğne eksiltme', 'Single crochet 2 together', 'Disminución de punto bajo', 'Diminuição de ponto baixo'), hint: l('2 ilmeği birlikte sık iğne', 'Work 2 sts together as one sc', '2 pb cerrados juntos', '2 pb fechados juntos'), en: 'sc2tog', d: 'M28 88 L50 14 L72 88 M22 60 L36 74 M36 60 L22 74 M64 60 L78 74 M78 60 L64 74', basic: 'sc', lessonId: 'tig-eksiltme', group: 'eksiltme' },
  { id: 'dcinc', craft: 'crochet', name: l('Trabzan artırma', 'Double crochet increase', 'Aumento de punto alto', 'Aumento de ponto alto'), hint: l('Aynı ilmeğe 2 trabzan', '2 dc in the same stitch', '2 pa en el mismo punto', '2 pa no mesmo ponto'), en: 'dc inc', d: 'M50 90 L32 16 M50 90 L68 16 M22 16 L42 16 M58 16 L78 16 M30 52 L44 44 M56 44 L70 52', basic: 'dc', lessonId: 'tig-artirma', group: 'artirma' },
  { id: 'dc2tog', craft: 'crochet', name: l('Trabzan eksiltme', 'Double crochet 2 together', 'Disminución de punto alto', 'Diminuição de ponto alto'), hint: l('2 trabzanı tepede birleştir', 'Join 2 dc at the top', '2 pa cerrados juntos', '2 pa fechados juntos'), en: 'dc2tog', d: 'M32 90 L50 16 M68 90 L50 16 M36 16 L64 16 M30 60 L44 52 M56 52 L70 60', basic: 'dc', lessonId: 'tig-eksiltme', group: 'eksiltme' },
  { id: 'shell', craft: 'crochet', name: l('Yelpaze', 'Shell', 'Abanico', 'Leque'), hint: l('Aynı ilmeğe 5 trabzan', '5 dc in the same stitch', '5 pa en el mismo punto', '5 pa no mesmo ponto'), en: 'shell', d: 'M50 92 L14 24 M50 92 L31 15 M50 92 L50 11 M50 92 L69 15 M50 92 L86 24', basic: 'dc', lessonId: 'tig-yelpaze', group: 'doku' },
  { id: 'v', craft: 'crochet', name: l('V ilmek', 'V-stitch', 'Punto V', 'Ponto V'), hint: l('Aynı ilmeğe trabzan, zincir, trabzan', 'dc, ch 1, dc in the same stitch', 'pa, cad, pa en el mismo punto', 'pa, corr, pa no mesmo ponto'), en: 'V-st', d: 'M50 90 L28 18 M50 90 L72 18 M18 18 L38 18 M62 18 L82 18 M28 56 L42 48 M58 48 L72 56 M42 12 a8 5 0 1 0 16 0 a8 5 0 1 0 -16 0Z', basic: 'dc', lessonId: 'tig-v-ilmek', group: 'doku' },
  { id: 'puff', craft: 'crochet', name: l('Fıstık', 'Puff stitch', 'Punto puff', 'Ponto puff'), hint: l('Aynı ilmekte 3–4 kez ip at ve çek, hepsinden birden geçir', 'Yarn over and pull up 3–4 times in one stitch, pull through all', 'Lazada y sacar 3–4 veces en un punto, cerrar todas', 'Laçada e puxar 3–4 vezes no mesmo ponto, fechar todas'), en: 'puff', d: 'M50 88 C24 70 28 28 50 16 C72 28 76 70 50 88Z M50 88 C42 66 43 32 50 16 M50 88 C58 66 57 32 50 16 M36 10 L64 10', lessonId: 'tig-fistik', group: 'doku' },
  { id: 'bobble', craft: 'crochet', name: l('Pıtırcık', 'Bobble', 'Bodoque', 'Pipoca'), hint: l('Aynı ilmeğe 5 yarım kalmış trabzan, tepede birleştir', '5 unfinished dc in one stitch, close together', '5 pa sin cerrar en un punto, cerrar juntos', '5 pa incompletos no mesmo ponto, fechar juntos'), en: 'bobble', d: 'M50 90 C30 70 30 34 50 14 C70 34 70 70 50 90 M50 90 L50 14 M38 14 L62 14', fd: dot(50, 52, 6), lessonId: 'tig-pitircik', group: 'doku' },
  { id: 'popcorn', craft: 'crochet', name: l('Patlamış mısır', 'Popcorn', 'Punto palomita', 'Ponto pipoca fechado'), hint: l('Aynı ilmeğe 5 trabzan, tığı çıkarıp ilkine batır, birleştir', '5 dc in one stitch, drop loop, insert in first, pull through', '5 pa en un punto, sacar la aguja, meter en el primero y cerrar', '5 pa no mesmo ponto, tirar a agulha, inserir no primeiro e fechar'), en: 'pc', d: 'M50 92 L24 34 M50 92 L37 28 M50 92 L50 26 M50 92 L63 28 M50 92 L76 34 M22 30 a28 13 0 1 0 56 0 a28 13 0 1 0 -56 0Z', lessonId: 'tig-pitircik', group: 'doku' },
  { id: 'fpdc', craft: 'crochet', name: l('Ön kabartma trabzan', 'Front post double crochet', 'Punto alto en relieve por delante', 'Ponto alto em relevo pela frente'), hint: l('Alttaki ilmeğin gövdesini önden sararak ör', 'Work around the post from the front', 'Tejer alrededor del pilar por delante', 'Trabalhar ao redor da haste pela frente'), en: 'FPdc', d: `M50 16 L50 76 C50 92 68 92 68 78 M30 16 L70 16 ${slash(52)}`, basic: 'dc', lessonId: 'tig-kabartma', group: 'doku' },
  { id: 'bpdc', craft: 'crochet', name: l('Arka kabartma trabzan', 'Back post double crochet', 'Punto alto en relieve por detrás', 'Ponto alto em relevo por trás'), hint: l('Alttaki ilmeğin gövdesini arkadan sararak ör', 'Work around the post from the back', 'Tejer alrededor del pilar por detrás', 'Trabalhar ao redor da haste por trás'), en: 'BPdc', d: `M50 16 L50 76 C50 92 32 92 32 78 M30 16 L70 16 ${slash(52)}`, basic: 'dc', lessonId: 'tig-kabartma', group: 'doku' },
  { id: 'scblo', craft: 'crochet', name: l('Arka halkadan sık iğne', 'Single crochet in back loop', 'Punto bajo por la hebra de atrás', 'Ponto baixo na alça de trás'), hint: l('Yalnız arka halkaya bat', 'Insert in the back loop only', 'Solo por la hebra de atrás', 'Só pela alça de trás'), en: 'sc BLO', d: 'M32 22 L68 58 M68 22 L32 58 M28 78 Q50 96 72 78', basic: 'sc', lessonId: 'tig-halkalar', group: 'doku' },
  { id: 'scflo', craft: 'crochet', name: l('Ön halkadan sık iğne', 'Single crochet in front loop', 'Punto bajo por la hebra de delante', 'Ponto baixo na alça da frente'), hint: l('Yalnız ön halkaya bat', 'Insert in the front loop only', 'Solo por la hebra de delante', 'Só pela alça da frente'), en: 'sc FLO', d: 'M32 22 L68 58 M68 22 L32 58 M28 92 Q50 74 72 92', basic: 'sc', lessonId: 'tig-halkalar', group: 'doku' },
  { id: 'crab', craft: 'crochet', name: l('Yengeç ilmeği', 'Reverse single crochet', 'Punto cangrejo', 'Ponto caranguejo'), hint: l('Ters yönde sık iğne: burgulu kenar', 'Single crochet worked backwards for a corded edge', 'Punto bajo hacia atrás: borde cordón', 'Ponto baixo para trás: borda cordão'), en: 'rev sc', d: 'M30 30 L70 70 M70 30 L30 70 M18 88 Q50 70 82 88', basic: 'sc', lessonId: 'tig-yengec', group: 'doku' },
];

export const ALL_SYMBOLS: ChartSymbol[] = [...KNIT_SYMBOLS, ...CROCHET_SYMBOLS];

export const SYMBOL_BY_ID: Record<string, ChartSymbol> = Object.fromEntries(ALL_SYMBOLS.map((s) => [s.id, s]));

export function symbolsFor(craft: Craft): ChartSymbol[] {
  return craft === 'knit' ? KNIT_SYMBOLS : CROCHET_SYMBOLS;
}

/** Seçilen stile göre çizim verisi */
export function glyphOf(sym: ChartSymbol, style: SymbolStyle = 'cyc'): SymbolGlyphData {
  if (style === 'jis' && sym.jis) return sym.jis;
  return { d: sym.d, fd: sym.fd, under: sym.under };
}

export const SYMBOL_GROUP_LABEL: Record<ChartSymbol['group'], L10n> = {
  temel: l('Temel', 'Basic', 'Básicos', 'Básicos'),
  artirma: l('Artırma', 'Increases', 'Aumentos', 'Aumentos'),
  eksiltme: l('Eksiltme', 'Decreases', 'Disminuciones', 'Diminuições'),
  doku: l('Doku', 'Texture', 'Textura', 'Textura'),
  burgu: l('Burgu', 'Cables', 'Ochos', 'Tranças'),
  ozel: l('Özel', 'Special', 'Especial', 'Especial'),
};

/** Sembolün kullanıcıya gösterilecek adı (tığ ilmeklerinde dil ve geleneğe uyar) */
export function symbolName(sym: ChartSymbol, ctx: TermsCtx): string {
  if (sym.craft === 'crochet' && sym.group === 'temel' && sym.basic) return crochetName(sym.basic, ctx);
  if (sym.craft === 'crochet' && (sym.id === 'dcinc' || sym.id === 'dc2tog' || sym.id === 'scinc' || sym.id === 'sc2tog')) {
    const base = crochetName(sym.id.startsWith('dc') ? 'dc' : 'sc', ctx);
    const inc = sym.id.endsWith('inc');
    const low = (s: string) => s.charAt(0).toLocaleLowerCase(ctx.lang) + s.slice(1);
    const w: Record<Lang, [string, string]> = {
      tr: [`${base} artırma`, `${base} eksiltme`],
      en: [`${base} increase`, `${base} 2 together`],
      es: [`Aumento de ${low(base)}`, `Disminución de ${low(base)}`],
      pt: [`Aumento de ${low(base)}`, `Diminuição de ${low(base)}`],
    };
    return w[ctx.lang][inc ? 0 : 1];
  }
  return sym.name[ctx.lang];
}
