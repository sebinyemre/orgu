/**
 * Desen kütüphanesi: şiş ve tığ desenleri (dört dilde).
 *
 * Şiş grafikleri ÖN YÜZDEN GÖRÜNÜŞÜ anlatır (alttan üste satırlar, soldan sağa karakterler).
 * Düz örgüde ön yüz sıraları sağdan sola, arka yüz sıraları soldan sağa okunur.
 * Karakter haritası (şiş):
 *   .  düz          -  ters         o  ip at       /  2 birlikte düz   \  kaydır-kaydır-ör
 *   ^  merkezden çift eksiltme      v  kaydır (ip arkada)   f  kaydır (ip önde)
 *   t  burgulu düz   b  pıtırcık    x  ilmek yok
 *   l  1/1 sola burgu  r  1/1 sağa burgu  L  2/2 sola  R  2/2 sağa  K  3/3 sola  Q  3/3 sağa
 *   >  önceki çok hücreli sembolün devamı
 * Karakter haritası (tığ):
 *   c zincir  s kör ilmek  + sık iğne  h yarım trabzan  d trabzan(1 ip atma)  D trabzan(2 ip atma)
 *   V V ilmek  S yelpaze  P fıstık  B pıtırcık  F ön kabartma  K arka kabartma  _ boş
 *
 * Tığ metinlerinde {sc}, {hdc}, {dc}, {tr} yer tutucuları dil ve geleneğe göre doldurulur (fillTerms).
 */
import type { Craft, Lang } from '@/types';
import type { L10n } from '@/i18n';

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

export interface PatternRow {
  label: L10n;
  text: L10n;
}

export interface PatternWorking {
  /** ilmek sayısı = multiple·k + plus */
  multiple: number;
  plus: number;
  rows: PatternRow[];
  repeat?: L10n;
  note?: L10n;
}

export type PatternCategory = 'temel' | 'lastik' | 'doku' | 'ajur' | 'burgu' | 'selanik' | 'tig-temel' | 'tig-doku';

export interface StitchPattern {
  id: string;
  craft: Craft;
  name: L10n;
  aka?: L10n[];
  en: string;
  level: 1 | 2 | 3;
  category: PatternCategory;
  summary: L10n;
  flat: PatternWorking;
  round?: PatternWorking;
  /** alttan üste satırlar */
  chart?: string[];
  /** grafik yalnızca temsilîyse (ör. selanik) */
  chartIsApprox?: boolean;
  reversible: boolean;
  curls: boolean;
  /** aynı ilmek sayısında jarseye göre genişlik oranı (lastik büzer: <1) */
  widthFactor: number;
  /** aynı yükseklikte jarseye göre sıra sayısı oranı (haraşo sıkışır: >1) */
  rowFactor: number;
  /** aynı alan için jarseye göre ip oranı */
  yarnFactor: number;
  uses: L10n[];
  tips: L10n[];
  lessonIds: string[];
}

export const KNIT_CHART_CHARS: Record<string, string> = {
  '.': 'k',
  '-': 'p',
  o: 'yo',
  '/': 'k2tog',
  '\\': 'ssk',
  '^': 'cdd',
  v: 'sl',
  f: 'slf',
  t: 'ktbl',
  b: 'mb',
  x: 'ns',
  l: 'c2l',
  r: 'c2r',
  L: 'c4l',
  R: 'c4r',
  K: 'c6l',
  Q: 'c6r',
};

export const CROCHET_CHART_CHARS: Record<string, string> = {
  c: 'ch',
  s: 'slst',
  '+': 'sc',
  h: 'hdc',
  d: 'dc',
  D: 'tr',
  V: 'v',
  S: 'shell',
  P: 'puff',
  B: 'bobble',
  F: 'fpdc',
  K: 'bpdc',
};

/* ── sık kullanılan etiketler ── */
const EVERY_ROW = l('Her sıra', 'Every row', 'Todas las vueltas', 'Todas as carreiras');
const EVERY_ROUND = l('Her tur', 'Every round', 'Todas las vueltas', 'Todas as voltas');
const ROW = (n: string, side?: 'rs' | 'ws') => {
  const s = side === 'rs' ? [' (ön yüz)', ' (RS)', ' (LD)', ' (LD)'] : side === 'ws' ? [' (arka yüz)', ' (WS)', ' (LR)', ' (LA)'] : ['', '', '', ''];
  return l(`${n}. sıra${s[0]}`, `Row ${n}${s[1]}`, `Vuelta ${n}${s[2]}`, `Carreira ${n}${s[3]}`);
};
const RND = (n: string) => l(`${n}. tur`, `Round ${n}`, `Vuelta ${n}`, `Volta ${n}`);
const REP_ROWS = (a: string, b: string) => l(`${a}.–${b}. sıraları tekrarla.`, `Repeat rows ${a}–${b}.`, `Repetir las vueltas ${a}–${b}.`, `Repetir as carreiras ${a}–${b}.`);
const REP_RNDS = (a: string, b: string) => l(`${a}.–${b}. turları tekrarla.`, `Repeat rounds ${a}–${b}.`, `Repetir las vueltas ${a}–${b}.`, `Repetir as voltas ${a}–${b}.`);
const ALL_K = l('Tüm ilmekleri düz ör.', 'Knit all stitches.', 'Tejer todos los puntos al derecho.', 'Tricotar todos os pontos em meia.');
const ALL_P = l('Tüm ilmekleri ters ör.', 'Purl all stitches.', 'Tejer todos los puntos al revés.', 'Tricotar todos os pontos em tricô.');
const FOUNDATION = l('Temel zincir', 'Foundation chain', 'Cadeneta base', 'Correntinha de base');

export const STITCH_PATTERNS: StitchPattern[] = [
  /* ── Şiş: temel ───────────────────────────────────────── */
  {
    id: 'haraso',
    craft: 'knit',
    name: l('Haraşo', 'Garter stitch', 'Punto bobo', 'Ponto liga'),
    aka: [l('Her sıra düz', 'Knit every row', 'Todo al derecho', 'Tudo em meia')],
    en: 'Garter stitch',
    level: 1,
    category: 'temel',
    summary: l(
      'Her sıra düz örülür. İki yüzü aynı, yatay tırtıllı, kıvrılmayan, esnek bir kumaş verir. İlk örgü için en iyi başlangıç.',
      'Knit every row. A squishy, reversible fabric with horizontal ridges that does not curl. The best first fabric.',
      'Se tejen todas las vueltas al derecho. Un tejido reversible, con surcos horizontales, que no se enrolla. Ideal para empezar.',
      'Todas as carreiras em meia. Um tecido reversível, com sulcos horizontais, que não enrola. O melhor para começar.',
    ),
    flat: { multiple: 1, plus: 0, rows: [{ label: EVERY_ROW, text: ALL_K }] },
    round: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: RND('1'), text: ALL_K },
        { label: RND('2'), text: ALL_P },
      ],
      repeat: REP_RNDS('1', '2'),
      note: l(
        'Yuvarlak örgüde iş hiç dönmediği için haraşo görüntüsü turlar sırayla düz ve ters örülerek elde edilir.',
        'In the round the work never turns, so garter is made by alternating knit and purl rounds.',
        'En redondo la labor no se gira, así que se alternan vueltas al derecho y al revés.',
        'No circular o trabalho não vira, então se alternam voltas em meia e em tricô.',
      ),
    },
    chart: ['....................', '--------------------'],
    reversible: true,
    curls: false,
    widthFactor: 1.05,
    rowFactor: 1.5,
    yarnFactor: 1.05,
    uses: [l('İlk atkı', 'First scarf', 'Primera bufanda', 'Primeiro cachecol'), l('Bebek battaniyesi', 'Baby blanket', 'Manta de bebé', 'Manta de bebê'), l('Jarse işlerin kenarı', 'Borders for stockinette', 'Bordes de jersey', 'Bordas de jersey')],
    tips: [
      l('İki sıra bir tırtıl yapar. Sıra saymak için tırtılları say ve 2 ile çarp.', 'Two rows make one ridge. Count ridges and multiply by 2.', 'Dos vueltas forman un surco. Cuenta surcos y multiplica por 2.', 'Duas carreiras formam um sulco. Conte os sulcos e multiplique por 2.'),
      l('Kenarlar düzgün olsun istersen her sıranın ilk ilmeğini örmeden kaydır.', 'For neat edges, slip the first stitch of every row.', 'Para orillos limpios, desliza el primer punto de cada vuelta.', 'Para bordas bonitas, deslize o primeiro ponto de cada carreira.'),
    ],
    lessonIds: ['sis-duz-ilmek', 'sis-haraso'],
  },
  {
    id: 'jarse',
    craft: 'knit',
    name: l('Jarse', 'Stockinette stitch', 'Punto jersey', 'Ponto jersey'),
    aka: [l('Süveter örgüsü', 'Stocking stitch', 'Punto media', 'Ponto meia')],
    en: 'Stockinette stitch',
    level: 1,
    category: 'temel',
    summary: l(
      'Ön yüzde düz, arka yüzde ters. Ön yüzde düzgün V sütunları, arkada boncuklu bir yüzey. Kenarları kendiliğinden kıvrılır.',
      'Knit on the right side, purl on the wrong side. Neat columns of Vs in front, bumps on the back. The edges curl.',
      'Derecho en el lado derecho, revés en el revés. Columnas de V por delante y granos detrás. Los bordes se enrollan.',
      'Meia no lado direito, tricô no avesso. Colunas de V na frente e bolinhas atrás. As bordas enrolam.',
    ),
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: ROW('1', 'rs'), text: ALL_K },
        { label: ROW('2', 'ws'), text: ALL_P },
      ],
      repeat: REP_ROWS('1', '2'),
    },
    round: { multiple: 1, plus: 0, rows: [{ label: EVERY_ROUND, text: ALL_K }] },
    chart: ['....................'],
    reversible: false,
    curls: true,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: [l('Kazak', 'Sweaters', 'Jerséis', 'Suéteres'), l('Bere gövdesi', 'Hat bodies', 'Cuerpo de gorros', 'Corpo de gorros'), l('Renkli örgü', 'Colorwork', 'Jacquard', 'Jacquard')],
    tips: [
      l('Kıvrılmayı önlemek için kenarlara 3–4 ilmek haraşo ya da pirinç ekle.', 'To stop curling, add 3–4 garter or seed stitches at the edges.', 'Para que no se enrolle, añade 3–4 puntos de bobo o arroz en los bordes.', 'Para não enrolar, acrescente 3–4 pontos de liga ou arroz nas bordas.'),
      l('Ölçü örneği çoğu tarifte jarse ile verilir.', 'Most patterns give gauge in stockinette.', 'La mayoría de patrones da la muestra en jersey.', 'A maioria das receitas dá a amostra em jersey.'),
    ],
    lessonIds: ['sis-duz-ilmek', 'sis-ters-ilmek', 'sis-jarse'],
  },
  {
    id: 'ters-jarse',
    craft: 'knit',
    name: l('Ters jarse', 'Reverse stockinette', 'Jersey revés', 'Jersey avesso'),
    en: 'Reverse stockinette',
    level: 1,
    category: 'temel',
    summary: l(
      'Jarsenin boncuklu yüzünün ön yüz olarak kullanılması. Burgu desenlerinin zemini olarak çok sık görülür.',
      'The bumpy side of stockinette used as the right side. The classic background for cables.',
      'El lado de granos del jersey usado como derecho. El fondo clásico de los ochos.',
      'O lado de bolinhas do jersey usado como direito. O fundo clássico das tranças.',
    ),
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: ROW('1', 'rs'), text: ALL_P },
        { label: ROW('2', 'ws'), text: ALL_K },
      ],
      repeat: REP_ROWS('1', '2'),
    },
    round: { multiple: 1, plus: 0, rows: [{ label: EVERY_ROUND, text: ALL_P }] },
    chart: ['--------------------'],
    reversible: false,
    curls: true,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: [l('Burgu zemini', 'Cable backgrounds', 'Fondo de ochos', 'Fundo de tranças'), l('Doku kontrastı', 'Texture contrast', 'Contraste de textura', 'Contraste de textura')],
    tips: [l('Ters ilmek düzden biraz gevşek çıkabilir; fark varsa ters sıralarda ipi biraz daha sıkı tut.', 'Purls can be looser than knits: tension a little tighter on purl rows.', 'El revés puede quedar más flojo: aprieta un poco más en esas vueltas.', 'O tricô pode ficar mais frouxo: aperte um pouco mais nessas carreiras.')],
    lessonIds: ['sis-ters-ilmek'],
  },
  /* ── Şiş: lastikler ───────────────────────────────────── */
  {
    id: 'lastik-1x1',
    craft: 'knit',
    name: l('1×1 lastik', '1×1 rib', 'Elástico 1×1', 'Ribana 1×1'),
    aka: [l('Bir düz bir ters', 'Knit one, purl one', 'Uno derecho, uno revés', 'Uma meia, uma tricô')],
    en: '1×1 rib',
    level: 1,
    category: 'lastik',
    summary: l(
      'Bir düz, bir ters. Çok esner ve geri toplanır; bere ağzı, kol ve yaka için klasik.',
      'Knit one, purl one. Very stretchy and springs back: the classic for hat brims, cuffs and collars.',
      'Uno derecho, uno revés. Muy elástico: el clásico para bordes de gorros, puños y cuellos.',
      'Uma meia, uma tricô. Muito elástica: a clássica para barras de gorros, punhos e golas.',
    ),
    flat: {
      multiple: 2,
      plus: 1,
      rows: [
        { label: ROW('1', 'rs'), text: l('1 düz, *1 ters, 1 düz* sıra sonuna kadar tekrarla.', 'K1, *p1, k1*; repeat to end.', '1 d, *1 r, 1 d*; repetir hasta el final.', '1 m, *1 t, 1 m*; repetir até o final.') },
        { label: ROW('2', 'ws'), text: l('1 ters, *1 düz, 1 ters* sıra sonuna kadar tekrarla.', 'P1, *k1, p1*; repeat to end.', '1 r, *1 d, 1 r*; repetir hasta el final.', '1 t, *1 m, 1 t*; repetir até o final.') },
      ],
      repeat: REP_ROWS('1', '2'),
      note: l(
        'Kural: ilmeği nasıl görüyorsan öyle ör. V gördüğün ilmeği düz, boncuk gördüğünü ters ör.',
        'Rule: work stitches as they appear. Knit the Vs, purl the bumps.',
        'Regla: teje los puntos como se presentan. Las V al derecho, los granos al revés.',
        'Regra: faça os pontos como eles se apresentam. Os V em meia, as bolinhas em tricô.',
      ),
    },
    round: { multiple: 2, plus: 0, rows: [{ label: EVERY_ROUND, text: l('*1 düz, 1 ters* tur sonuna kadar tekrarla.', '*K1, p1*; repeat to end.', '*1 d, 1 r*; repetir hasta el final.', '*1 m, 1 t*; repetir até o final.') }] },
    chart: ['.-.-.-.-.-.-.-.-.-.'],
    reversible: true,
    curls: false,
    widthFactor: 0.75,
    rowFactor: 1.05,
    yarnFactor: 1.05,
    uses: [l('Bere ağzı', 'Hat brims', 'Bordes de gorros', 'Barras de gorros'), l('Kol ve etek ucu', 'Cuffs and hems', 'Puños y bajos', 'Punhos e barras'), l('Yaka', 'Collars', 'Cuellos', 'Golas')],
    tips: [
      l(
        'Düzden terse geçerken ipi şişlerin ARASINDAN öne al. İpi şişin üstünden aşırırsan istemeden ip atmış olursun.',
        'When switching from knit to purl, bring the yarn forward BETWEEN the needles. Taking it over the needle makes an accidental yarn over.',
        'Al pasar de derecho a revés, lleva la hebra hacia delante ENTRE las agujas. Pasarla por encima crea una lazada sin querer.',
        'Ao passar de meia para tricô, leve o fio para a frente ENTRE as agulhas. Passar por cima cria uma laçada sem querer.',
      ),
      l('Lastiği ana örgüden 0,5–1 numara ince şişle örmek daha toplu durur.', 'Ribbing looks neater on needles 0.5–1 mm smaller than the body.', 'El elástico queda más firme con agujas 0,5–1 mm más finas.', 'A ribana fica mais firme com agulhas 0,5–1 mm mais finas.'),
    ],
    lessonIds: ['sis-lastik'],
  },
  {
    id: 'lastik-2x2',
    craft: 'knit',
    name: l('2×2 lastik', '2×2 rib', 'Elástico 2×2', 'Ribana 2×2'),
    aka: [l('İki düz iki ters', 'Knit two, purl two', 'Dos derecho, dos revés', 'Duas meia, duas tricô')],
    en: '2×2 rib',
    level: 1,
    category: 'lastik',
    summary: l(
      'İki düz, iki ters. 1×1 lastikten daha belirgin dikey çizgiler, aynı esneklik.',
      'Knit two, purl two. Bolder vertical lines than 1×1 with the same stretch.',
      'Dos derecho, dos revés. Líneas verticales más marcadas que el 1×1.',
      'Duas meia, duas tricô. Linhas verticais mais marcadas que a 1×1.',
    ),
    flat: {
      multiple: 4,
      plus: 2,
      rows: [
        { label: ROW('1', 'rs'), text: l('2 düz, *2 ters, 2 düz* sıra sonuna kadar tekrarla.', 'K2, *p2, k2*; repeat to end.', '2 d, *2 r, 2 d*; repetir hasta el final.', '2 m, *2 t, 2 m*; repetir até o final.') },
        { label: ROW('2', 'ws'), text: l('2 ters, *2 düz, 2 ters* sıra sonuna kadar tekrarla.', 'P2, *k2, p2*; repeat to end.', '2 r, *2 d, 2 r*; repetir hasta el final.', '2 t, *2 m, 2 t*; repetir até o final.') },
      ],
      repeat: REP_ROWS('1', '2'),
    },
    round: { multiple: 4, plus: 0, rows: [{ label: EVERY_ROUND, text: l('*2 düz, 2 ters* tur sonuna kadar tekrarla.', '*K2, p2*; repeat to end.', '*2 d, 2 r*; repetir hasta el final.', '*2 m, 2 t*; repetir até o final.') }] },
    chart: ['..--..--..--..--..'],
    reversible: true,
    curls: false,
    widthFactor: 0.72,
    rowFactor: 1.05,
    yarnFactor: 1.05,
    uses: [l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Atkı', 'Scarves', 'Bufandas', 'Cachecóis'), l('Kazak etekleri', 'Sweater hems', 'Bajos de jersey', 'Barras de suéter'), l('Çorap konçu', 'Sock cuffs', 'Puños de calcetín', 'Canos de meia')],
    tips: [l("Düz örgüde 4'ün katı + 2 ilmekle iki kenar da 2 düz ile başlar ve biter: atkı simetrik olur.", 'With a multiple of 4 + 2, both edges start and end with k2, so a scarf looks symmetrical.', 'Con múltiplo de 4 + 2, ambos bordes empiezan y terminan con 2 d: la bufanda queda simétrica.', 'Com múltiplo de 4 + 2, as duas bordas começam e terminam com 2 m: o cachecol fica simétrico.')],
    lessonIds: ['sis-lastik'],
  },
  {
    id: 'burgulu-lastik',
    craft: 'knit',
    name: l('Burgulu lastik', 'Twisted rib', 'Elástico retorcido', 'Ribana torcida'),
    en: 'Twisted rib',
    level: 2,
    category: 'lastik',
    summary: l(
      'Düz ilmekler arka bacaktan örülür; ilmekler burularak keskin, ip gibi çizgiler oluşturur.',
      'Knit stitches are worked through the back loop, twisting them into crisp, cord-like lines.',
      'Los derechos se tejen por detrás y se retuercen formando líneas nítidas.',
      'Os pontos meia são feitos por trás e torcem formando linhas nítidas.',
    ),
    flat: {
      multiple: 2,
      plus: 1,
      rows: [
        { label: ROW('1', 'rs'), text: l('1 burgulu düz, *1 ters, 1 burgulu düz* tekrarla.', 'K1 tbl, *p1, k1 tbl*; repeat.', '1 d retorcido, *1 r, 1 d retorcido*; repetir.', '1 m torcida, *1 t, 1 m torcida*; repetir.') },
        { label: ROW('2', 'ws'), text: l('1 ters, *1 düz, 1 ters* tekrarla.', 'P1, *k1, p1*; repeat.', '1 r, *1 d, 1 r*; repetir.', '1 t, *1 m, 1 t*; repetir.') },
      ],
      repeat: REP_ROWS('1', '2'),
    },
    round: { multiple: 2, plus: 0, rows: [{ label: EVERY_ROUND, text: l('*1 burgulu düz, 1 ters* tekrarla.', '*K1 tbl, p1*; repeat.', '*1 d retorcido, 1 r*; repetir.', '*1 m torcida, 1 t*; repetir.') }] },
    chart: ['t-t-t-t-t-t-t-t-t-t', 't-t-t-t-t-t-t-t-t-t'],
    reversible: false,
    curls: false,
    widthFactor: 0.72,
    rowFactor: 1.05,
    yarnFactor: 1.05,
    uses: [l('Çorap', 'Socks', 'Calcetines', 'Meias'), l('Eldiven bilekliği', 'Mitten cuffs', 'Puños de manopla', 'Punhos de luva'), l('Dar yaka', 'Neat collars', 'Cuellos finos', 'Golas finas')],
    tips: [l('Burgulu ilmek daha az esner ama çok düzgün görünür.', 'Twisted stitches stretch less but look very tidy.', 'El punto retorcido estira menos pero queda muy pulcro.', 'O ponto torcido estica menos mas fica muito caprichado.')],
    lessonIds: ['sis-lastik'],
  },
  /* ── Şiş: doku ────────────────────────────────────────── */
  {
    id: 'pirinc',
    craft: 'knit',
    name: l('Pirinç örgü', 'Seed stitch', 'Punto arroz', 'Ponto arroz'),
    en: 'Seed stitch',
    level: 1,
    category: 'doku',
    summary: l(
      'Bir düz bir ters, ama her sırada kayar: düzün üstüne ters, tersin üstüne düz gelir. Noktalı, kıvrılmayan, iki yüzü aynı kumaş.',
      'Knit one, purl one, shifted every row: purls sit on knits and knits on purls. A dotted, reversible fabric that lies flat.',
      'Uno derecho, uno revés, alternando cada vuelta. Un tejido punteado, reversible y que no se enrolla.',
      'Uma meia, uma tricô, alternando a cada carreira. Um tecido pontilhado, reversível e que não enrola.',
    ),
    flat: {
      multiple: 2,
      plus: 1,
      rows: [{ label: EVERY_ROW, text: l('1 düz, *1 ters, 1 düz* sıra sonuna kadar tekrarla.', 'K1, *p1, k1*; repeat to end.', '1 d, *1 r, 1 d*; repetir hasta el final.', '1 m, *1 t, 1 m*; repetir até o final.') }],
      note: l(
        'Tek sayıda ilmekle her sıra aynı talimatla örülür, desen kendiliğinden kayar. Kural: V görünen ilmeği ters, boncuk görüneni düz ör.',
        'With an odd count every row is the same and the pattern shifts by itself. Rule: purl the Vs, knit the bumps.',
        'Con número impar todas las vueltas son iguales. Regla: las V al revés, los granos al derecho.',
        'Com número ímpar todas as carreiras são iguais. Regra: os V em tricô, as bolinhas em meia.',
      ),
    },
    round: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: RND('1'), text: l('*1 düz, 1 ters* tekrarla.', '*K1, p1*; repeat.', '*1 d, 1 r*; repetir.', '*1 m, 1 t*; repetir.') },
        { label: RND('2'), text: l('*1 ters, 1 düz* tekrarla.', '*P1, k1*; repeat.', '*1 r, 1 d*; repetir.', '*1 t, 1 m*; repetir.') },
      ],
      repeat: REP_RNDS('1', '2'),
    },
    chart: ['.-.-.-.-.-.-.-.-.-.', '-.-.-.-.-.-.-.-.-.-'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1.15,
    yarnFactor: 1.08,
    uses: [l('Kenar bordürü', 'Borders', 'Bordes', 'Bordas'), l('Bebek battaniyesi', 'Baby blankets', 'Mantas de bebé', 'Mantas de bebê'), l('Bardak altlığı', 'Coasters', 'Posavasos', 'Porta-copos'), l('Atkı', 'Scarves', 'Bufandas', 'Cachecóis')],
    tips: [l('Lastikle karıştırma: lastikte ilmeği gördüğün gibi örersin, pirinçte tam tersini.', "Don't confuse it with rib: rib works stitches as they look, seed works the opposite.", 'No lo confundas con el elástico: en el elástico tejes lo que ves, en el arroz lo contrario.', 'Não confunda com a ribana: na ribana você faz o que vê, no arroz o contrário.')],
    lessonIds: ['sis-pirinc'],
  },
  {
    id: 'cift-pirinc',
    craft: 'knit',
    name: l('Çift pirinç', 'Moss stitch', 'Punto arroz doble', 'Ponto arroz duplo'),
    en: 'Moss stitch (US) / Double moss (UK)',
    level: 2,
    category: 'doku',
    summary: l(
      'Pirinç örgünün iki sırada bir kayan hâli. Daha uzun taneler, kıvrılmaz ve iki yüzü aynı.',
      'Seed stitch that shifts every two rows. Longer "grains", flat and reversible.',
      'Punto arroz que se desplaza cada dos vueltas. Granos más largos, plano y reversible.',
      'Ponto arroz que muda a cada duas carreiras. Grãos mais longos, plano e reversível.',
    ),
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: l('1. ve 2. sıra', 'Rows 1 and 2', 'Vueltas 1 y 2', 'Carreiras 1 e 2'), text: l('*1 düz, 1 ters* tekrarla.', '*K1, p1*; repeat.', '*1 d, 1 r*; repetir.', '*1 m, 1 t*; repetir.') },
        { label: l('3. ve 4. sıra', 'Rows 3 and 4', 'Vueltas 3 y 4', 'Carreiras 3 e 4'), text: l('*1 ters, 1 düz* tekrarla.', '*P1, k1*; repeat.', '*1 r, 1 d*; repetir.', '*1 t, 1 m*; repetir.') },
      ],
      repeat: REP_ROWS('1', '4'),
    },
    round: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: l('1. ve 2. tur', 'Rounds 1 and 2', 'Vueltas 1 y 2', 'Voltas 1 e 2'), text: l('*1 düz, 1 ters* tekrarla.', '*K1, p1*; repeat.', '*1 d, 1 r*; repetir.', '*1 m, 1 t*; repetir.') },
        { label: l('3. ve 4. tur', 'Rounds 3 and 4', 'Vueltas 3 y 4', 'Voltas 3 e 4'), text: l('*1 ters, 1 düz* tekrarla.', '*P1, k1*; repeat.', '*1 r, 1 d*; repetir.', '*1 t, 1 m*; repetir.') },
      ],
      repeat: REP_RNDS('1', '4'),
    },
    chart: ['-.-.-.-.-.-.-.-.-.-.', '-.-.-.-.-.-.-.-.-.-.', '.-.-.-.-.-.-.-.-.-.-', '.-.-.-.-.-.-.-.-.-.-'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1.12,
    yarnFactor: 1.08,
    uses: [l('Hırka', 'Cardigans', 'Chaquetas', 'Casaquinhos'), l('Yastık kılıfı', 'Pillow covers', 'Fundas de cojín', 'Capas de almofada'), l('Kenar', 'Borders', 'Bordes', 'Bordas')],
    tips: [l('Çift sayıda ilmekle 1. ve 2. sıralar aynı talimatla örülür; 3. sırada desen kayar.', 'With an even count, rows 1 and 2 share the same instruction; the pattern shifts on row 3.', 'Con número par, las vueltas 1 y 2 son iguales; el dibujo cambia en la 3.', 'Com número par, as carreiras 1 e 2 são iguais; o desenho muda na 3.')],
    lessonIds: ['sis-pirinc'],
  },
  {
    id: 'sepet',
    craft: 'knit',
    name: l('Sepet örgü', 'Basketweave', 'Punto cesta', 'Ponto cesta'),
    en: 'Basketweave',
    level: 2,
    category: 'doku',
    summary: l(
      'Düz ve ters bloklar dama tahtası gibi yer değiştirir: hasır sepet görünümü. Kıvrılmaz.',
      'Knit and purl blocks swap places like a checkerboard for a woven look. Lies flat.',
      'Bloques de derecho y revés alternados como un tablero: aspecto de cesta. No se enrolla.',
      'Blocos de meia e tricô alternados como um tabuleiro: aspecto de cesta. Não enrola.',
    ),
    flat: {
      multiple: 8,
      plus: 4,
      rows: [
        { label: l('1. ve 3. sıra (ön yüz)', 'Rows 1 and 3 (RS)', 'Vueltas 1 y 3 (LD)', 'Carreiras 1 e 3 (LD)'), text: l('*4 düz, 4 ters*, 4 düz.', '*K4, p4*, k4.', '*4 d, 4 r*, 4 d.', '*4 m, 4 t*, 4 m.') },
        { label: l('2. ve 4. sıra (arka yüz)', 'Rows 2 and 4 (WS)', 'Vueltas 2 y 4 (LR)', 'Carreiras 2 e 4 (LA)'), text: l('4 ters, *4 düz, 4 ters*.', 'P4, *k4, p4*.', '4 r, *4 d, 4 r*.', '4 t, *4 m, 4 t*.') },
        { label: l('5. ve 7. sıra (ön yüz)', 'Rows 5 and 7 (RS)', 'Vueltas 5 y 7 (LD)', 'Carreiras 5 e 7 (LD)'), text: l('*4 ters, 4 düz*, 4 ters.', '*P4, k4*, p4.', '*4 r, 4 d*, 4 r.', '*4 t, 4 m*, 4 t.') },
        { label: l('6. ve 8. sıra (arka yüz)', 'Rows 6 and 8 (WS)', 'Vueltas 6 y 8 (LR)', 'Carreiras 6 e 8 (LA)'), text: l('4 düz, *4 ters, 4 düz*.', 'K4, *p4, k4*.', '4 d, *4 r, 4 d*.', '4 m, *4 t, 4 m*.') },
      ],
      repeat: REP_ROWS('1', '8'),
    },
    round: {
      multiple: 8,
      plus: 0,
      rows: [
        { label: l('1.–4. tur', 'Rounds 1–4', 'Vueltas 1–4', 'Voltas 1–4'), text: l('*4 düz, 4 ters* tekrarla.', '*K4, p4*; repeat.', '*4 d, 4 r*; repetir.', '*4 m, 4 t*; repetir.') },
        { label: l('5.–8. tur', 'Rounds 5–8', 'Vueltas 5–8', 'Voltas 5–8'), text: l('*4 ters, 4 düz* tekrarla.', '*P4, k4*; repeat.', '*4 r, 4 d*; repetir.', '*4 t, 4 m*; repetir.') },
      ],
      repeat: REP_RNDS('1', '8'),
    },
    chart: ['....----....----....', '....----....----....', '....----....----....', '....----....----....', '----....----....----', '----....----....----', '----....----....----', '----....----....----'],
    reversible: true,
    curls: false,
    widthFactor: 0.95,
    rowFactor: 1.08,
    yarnFactor: 1.08,
    uses: [l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Yastık', 'Pillows', 'Cojines', 'Almofadas'), l('Bulaşık bezi', 'Dishcloths', 'Paños', 'Panos')],
    tips: [l('Blokları kare yapmak için blok yüksekliğini ölçü örneğine göre 5–6 sıraya çıkarabilirsin.', 'To make square blocks, raise the block height to 5–6 rows to suit your gauge.', 'Para bloques cuadrados, sube la altura a 5–6 vueltas según tu muestra.', 'Para blocos quadrados, aumente a altura para 5–6 carreiras conforme a amostra.')],
    lessonIds: ['sis-pirinc'],
  },
  {
    id: 'hasir',
    craft: 'knit',
    name: l('Hasır örgü', 'Linen stitch', 'Punto tela', 'Ponto linho'),
    en: 'Linen stitch',
    level: 2,
    category: 'doku',
    summary: l(
      'İp önde kaydırılan ilmekler önde küçük yatay çubuklar bırakır; dokuma kumaş gibi sık ve düz bir yüzey.',
      'Stitches slipped with the yarn in front leave little bars on the surface: a dense, flat fabric that looks woven.',
      'Los puntos deslizados con la hebra delante dejan barritas: un tejido denso que parece tela.',
      'Pontos deslizados com o fio na frente deixam barrinhas: um tecido denso que parece tecelagem.',
    ),
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: ROW('1', 'rs'), text: l('*1 düz, ipi öne al, 1 ilmeği ters örer gibi kaydır, ipi arkaya al* tekrarla.', '*K1, bring yarn forward, slip 1 purlwise, take yarn back*; repeat.', '*1 d, hebra delante, deslizar 1 como al revés, hebra detrás*; repetir.', '*1 m, fio para frente, deslizar 1 como tricô, fio para trás*; repetir.') },
        { label: ROW('2', 'ws'), text: l('*1 ters, ipi arkaya al, 1 ilmeği ters örer gibi kaydır, ipi öne al* tekrarla.', '*P1, take yarn back, slip 1 purlwise, bring yarn forward*; repeat.', '*1 r, hebra detrás, deslizar 1 como al revés, hebra delante*; repetir.', '*1 t, fio para trás, deslizar 1 como tricô, fio para frente*; repetir.') },
      ],
      repeat: REP_ROWS('1', '2'),
      note: l('Çok sık bir kumaş verir; önerilenden 1–2 numara kalın şiş kullan.', 'It is very dense: use needles 1–2 sizes larger than usual.', 'Es muy denso: usa agujas 1–2 números más gruesas.', 'Fica muito denso: use agulhas 1–2 números maiores.'),
    },
    chart: ['f.f.f.f.f.f.f.f.f.f.', '.f.f.f.f.f.f.f.f.f.f'],
    reversible: false,
    curls: false,
    widthFactor: 0.82,
    rowFactor: 1.8,
    yarnFactor: 1.25,
    uses: [l('Çanta', 'Bags', 'Bolsos', 'Bolsas'), l('Bulaşık bezi', 'Dishcloths', 'Paños', 'Panos'), l('Renkli şerit atkı', 'Striped scarves', 'Bufandas a rayas', 'Cachecóis listrados')],
    tips: [l('Her iki sırada bir renk değiştirerek örünce çok güzel karışık bir doku olur.', 'Changing color every two rows gives a beautiful blended look.', 'Cambiar de color cada dos vueltas da un efecto mezclado precioso.', 'Trocar de cor a cada duas carreiras dá um efeito mesclado lindo.')],
    lessonIds: ['sis-kaydirma'],
  },
  /* ── Şiş: selanik ailesi ──────────────────────────────── */
  {
    id: 'yalanci-selanik',
    craft: 'knit',
    name: l('Yalancı selanik', 'Mock brioche rib', 'Falso brioche', 'Falso brioche'),
    en: 'Mock rib',
    level: 1,
    category: 'selanik',
    summary: l(
      'Her sıra aynı talimatla örülen, selaniğe benzeyen kalın, esnek, iki yüzü benzer bir desen. Gerçek selanikten çok daha kolay ve az ip harcar.',
      'A thick, stretchy, nearly reversible rib that looks like brioche but every row is the same. Much easier and uses less yarn.',
      'Un elástico grueso y casi reversible que parece brioche, con todas las vueltas iguales. Mucho más fácil y gasta menos hilo.',
      'Uma ribana grossa e quase reversível que lembra brioche, com todas as carreiras iguais. Bem mais fácil e gasta menos fio.',
    ),
    flat: {
      multiple: 4,
      plus: 1,
      rows: [{ label: EVERY_ROW, text: l('*3 ters, 1 düz* sıra sonuna kadar tekrarla, son ilmeği ters ör.', '*P3, k1*; repeat to last stitch, p1.', '*3 r, 1 d*; repetir hasta el último punto, 1 r.', '*3 t, 1 m*; repetir até o último ponto, 1 t.') }],
      note: l(
        "İlmek sayısı 4'ün katı + 1 olmalı (41, 45, 49…). Bu sayıda her sıradaki düz ilmek bir alt sıradaki 3 tersin ortasına denk gelir ve desen kendiliğinden oturur.",
        'Cast on a multiple of 4 + 1 (41, 45, 49…). With that count each knit stitch lands in the middle of the 3 purls below and the pattern sets itself.',
        'Monta un múltiplo de 4 + 1 (41, 45, 49…). Así cada derecho cae en el centro de los 3 reveses de abajo.',
        'Monte um múltiplo de 4 + 1 (41, 45, 49…). Assim cada meia cai no meio das 3 tricôs de baixo.',
      ),
    },
    chart: ['-.---.---.---.---.---', '...-...-...-...-...-.'],
    reversible: true,
    curls: false,
    widthFactor: 0.88,
    rowFactor: 1.2,
    yarnFactor: 1.15,
    uses: [l('Atkı', 'Scarves', 'Bufandas', 'Cachecóis'), l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Boyunluk', 'Cowls', 'Cuellos', 'Golas'), l('Bebek yeleği', 'Baby vests', 'Chalecos de bebé', 'Coletes de bebê')],
    tips: [
      l('İlk iki sırada desen görünmez; 4–6 sıra sonra dikey çizgiler belirginleşir.', 'You will not see the pattern in the first two rows; the lines appear after 4–6 rows.', 'En las primeras vueltas no se ve; las líneas aparecen tras 4–6 vueltas.', 'Nas primeiras carreiras não aparece; as linhas surgem depois de 4–6 carreiras.'),
      l("Sayı 4'ün katı + 1 değilse desen lastiğe ya da haraşoya dönüşür. İlk sırada sayını kontrol et.", 'If the count is not a multiple of 4 + 1 the pattern turns into plain rib or garter. Check your count on row 1.', 'Si no es múltiplo de 4 + 1 sale otro punto. Comprueba el número en la primera vuelta.', 'Se não for múltiplo de 4 + 1 sai outro ponto. Confira o número na primeira carreira.'),
    ],
    lessonIds: ['sis-ters-ilmek', 'sis-selanik'],
  },
  {
    id: 'selanik',
    craft: 'knit',
    name: l('Selanik', 'Brioche stitch', 'Punto brioche', 'Ponto brioche'),
    aka: [l('Brioche', 'Patent rib', 'Punto inglés', 'Ponto inglês')],
    en: 'Brioche stitch',
    level: 3,
    category: 'selanik',
    summary: l(
      'İp atılıp kaydırılan ilmeklerle örülen kabarık, iki yüzü aynı, çok sıcak ve esnek desen. Her ilmek bir sonraki sırada atılan ipiyle birlikte örülür.',
      'A lofty, reversible, very warm rib made with slipped stitches and yarn overs. Each stitch is knitted together with its yarn over on the next row.',
      'Un elástico esponjoso, reversible y muy cálido hecho con puntos deslizados y lazadas, que se tejen juntos en la vuelta siguiente.',
      'Uma ribana fofa, reversível e muito quente feita com pontos deslizados e laçadas, tricotados juntos na carreira seguinte.',
    ),
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: l('Hazırlık sırası', 'Set-up row', 'Vuelta de preparación', 'Carreira de preparação'), text: l('*1 ip at, 1 ilmeği ters örer gibi kaydır, 1 düz* sıra sonuna kadar tekrarla.', '*Yo, slip 1 purlwise, k1*; repeat to end.', '*1 lazada, deslizar 1 como al revés, 1 d*; repetir hasta el final.', '*1 laçada, deslizar 1 como tricô, 1 m*; repetir até o final.') },
        {
          label: l('Selanik sırası', 'Brioche row', 'Vuelta brioche', 'Carreira brioche'),
          text: l(
            '*1 ip at, 1 ilmeği ters örer gibi kaydır, sonraki ilmeği üstündeki atılmış iple birlikte düz ör* sıra sonuna kadar tekrarla.',
            '*Yo, slip 1 purlwise, knit the next stitch together with its yarn over*; repeat to end.',
            '*1 lazada, deslizar 1 como al revés, tejer el siguiente punto junto con su lazada*; repetir hasta el final.',
            '*1 laçada, deslizar 1 como tricô, tricotar o ponto seguinte junto com a sua laçada*; repetir até o final.',
          ),
        },
      ],
      repeat: l('Hep selanik sırasını tekrarla.', 'Repeat the brioche row.', 'Repetir siempre la vuelta brioche.', 'Repetir sempre a carreira brioche.'),
      note: l(
        'Çift sayıda ilmek at. Kaydırılan ilmek ile atılan ip şişte tek ilmek gibi durur; sayarken ikisi 1 ilmek sayılır.',
        'Cast on an even number. A slipped stitch and its yarn over sit together like one stitch: count them as one.',
        'Monta un número par. El punto deslizado y su lazada cuentan como un solo punto.',
        'Monte um número par. O ponto deslizado e sua laçada contam como um ponto só.',
      ),
    },
    chart: ['.-.-.-.-.-.-.-.-.-.-', '.-.-.-.-.-.-.-.-.-.-'],
    chartIsApprox: true,
    reversible: true,
    curls: false,
    widthFactor: 1.05,
    rowFactor: 2,
    yarnFactor: 1.75,
    uses: [l('Kalın atkı', 'Cozy scarves', 'Bufandas gruesas', 'Cachecóis grossos'), l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Boyunluk', 'Cowls', 'Cuellos', 'Golas'), l('Kışlık hırka', 'Winter cardigans', 'Chaquetas de invierno', 'Casacos de inverno')],
    tips: [
      l('Diğer desenlere göre 1,5–2 kat ip harcar; ipini buna göre al.', 'Uses 1.5–2 times more yarn than other stitches: buy accordingly.', 'Gasta 1,5–2 veces más hilo: compra de más.', 'Gasta 1,5–2 vezes mais fio: compre a mais.'),
      l('Görünen her sıra aslında iki örülmüş sıradır.', 'Each visible row is really two knitted rows.', 'Cada fila visible son en realidad dos vueltas tejidas.', 'Cada fileira visível são na verdade duas carreiras.'),
      l('Sökmek zordur. Arada bir can simidi (ilmeklerin içinden geçirilmiş ince ip) bırak.', 'Ripping back is hard: thread a lifeline through your stitches now and then.', 'Deshacer es difícil: pasa de vez en cuando una hebra salvavidas.', 'Desmanchar é difícil: passe de vez em quando uma linha de segurança.'),
    ],
    lessonIds: ['sis-selanik'],
  },
  /* ── Şiş: ajur ────────────────────────────────────────── */
  {
    id: 'goz-ajur',
    craft: 'knit',
    name: l('Göz ajur', 'Eyelet rows', 'Calados de ojal', 'Ilhoses'),
    en: 'Eyelet row',
    level: 2,
    category: 'ajur',
    summary: l('Jarse zemin üzerinde aralıklı delik sıraları: kurdele geçirmek ya da hafif bir süs için.', 'Rows of little holes on stockinette, for threading a ribbon or a light accent.', 'Filas de agujeritos sobre jersey, para pasar una cinta o como adorno.', 'Fileiras de furinhos sobre jersey, para passar uma fita ou enfeitar.'),
    flat: {
      multiple: 2,
      plus: 1,
      rows: [
        { label: ROW('1', 'rs'), text: l('1 düz, *1 ip at, 2 ilmeği birlikte düz ör* tekrarla.', 'K1, *yo, k2tog*; repeat.', '1 d, *1 lazada, 2 juntos al derecho*; repetir.', '1 m, *1 laçada, 2 juntos em meia*; repetir.') },
        { label: ROW('2', 'ws'), text: l('Tüm ilmekleri (atılan ipler dahil) ters ör.', 'Purl all stitches, including the yarn overs.', 'Todo al revés, incluidas las lazadas.', 'Tudo em tricô, inclusive as laçadas.') },
        { label: ROW('3'), text: ALL_K },
        { label: ROW('4'), text: ALL_P },
      ],
      repeat: REP_ROWS('1', '4'),
    },
    chart: ['/o/o/o/o.', '.........', '.........', '.........'],
    reversible: false,
    curls: true,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 0.95,
    uses: [l('Bebek giysisi kurdele yolu', 'Ribbon paths on baby clothes', 'Pasacintas en ropa de bebé', 'Passa-fitas em roupa de bebê'), l('Şal', 'Shawls', 'Chales', 'Xales'), l('Yazlık', 'Summer tops', 'Prendas de verano', 'Peças de verão')],
    tips: [l('Her ip atma 1 ilmek ekler, her "2 birlikte" 1 ilmek eksiltir; sıra sonunda sayı değişmez.', 'Each yarn over adds a stitch and each k2tog removes one, so the count stays the same.', 'Cada lazada suma un punto y cada 2 juntos resta uno: el total no cambia.', 'Cada laçada soma um ponto e cada 2 juntos tira um: o total não muda.')],
    lessonIds: ['sis-ip-atma', 'sis-eksiltme'],
  },
  {
    id: 'dalga-ajur',
    craft: 'knit',
    name: l('Dalga ajur', 'Feather and fan', 'Ola de mar', 'Ondas'),
    aka: [l('Tavus kuyruğu', 'Old shale', 'Pluma y abanico', 'Pena e leque')],
    en: 'Feather and fan',
    level: 2,
    category: 'ajur',
    summary: l(
      'Eksiltmeler ve ip atmalar bir araya toplanarak dalgalı kenarlı, yelpazeli bir kumaş oluşturur. Dört sırada bir tek desen sırası vardır.',
      'Decreases and yarn overs grouped together make scalloped waves. Only one pattern row in every four.',
      'Disminuciones y lazadas agrupadas forman ondas. Solo una vuelta de dibujo cada cuatro.',
      'Diminuições e laçadas agrupadas formam ondas. Só uma carreira de desenho a cada quatro.',
    ),
    flat: {
      multiple: 18,
      plus: 0,
      rows: [
        { label: ROW('1', 'rs'), text: ALL_K },
        { label: ROW('2', 'ws'), text: ALL_P },
        {
          label: ROW('3'),
          text: l(
            '*3 kez (2 birlikte düz), 6 kez (1 ip at, 1 düz), 3 kez (2 birlikte düz)* tekrarla.',
            '*(K2tog) 3 times, (yo, k1) 6 times, (k2tog) 3 times*; repeat.',
            '*3 veces (2 juntos al derecho), 6 veces (lazada, 1 d), 3 veces (2 juntos al derecho)*; repetir.',
            '*3 vezes (2 juntos em meia), 6 vezes (laçada, 1 m), 3 vezes (2 juntos em meia)*; repetir.',
          ),
        },
        { label: ROW('4'), text: ALL_K },
      ],
      repeat: REP_ROWS('1', '4'),
      note: l('Kenarlar için iki yana 2–3 haraşo ilmek eklemek iyi olur.', 'Add 2–3 garter stitches at each edge for a neat border.', 'Añade 2–3 puntos de bobo en cada borde.', 'Acrescente 2–3 pontos de liga em cada borda.'),
    },
    chart: ['..................', '..................', '///.o.o.o.o.o.o///', '------------------'],
    reversible: false,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 0.95,
    uses: [l('Şal', 'Shawls', 'Chales', 'Xales'), l('Bebek battaniyesi', 'Baby blankets', 'Mantas de bebé', 'Mantas de bebê'), l('Yazlık atkı', 'Summer scarves', 'Bufandas de verano', 'Cachecóis de verão')],
    tips: [
      l('3. sırada ilmek sayısı değişmez: 6 eksiltme, 6 ip atma.', 'Row 3 keeps the count: 6 decreases, 6 yarn overs.', 'En la vuelta 3 el número no cambia: 6 disminuciones, 6 lazadas.', 'Na carreira 3 o número não muda: 6 diminuições, 6 laçadas.'),
      l('Renk değiştirmek için en güzel yer 1. sıradır.', 'Row 1 is the best place to change colors.', 'La vuelta 1 es el mejor lugar para cambiar de color.', 'A carreira 1 é o melhor lugar para trocar de cor.'),
    ],
    lessonIds: ['sis-ip-atma', 'sis-eksiltme'],
  },
  /* ── Şiş: burgu ───────────────────────────────────────── */
  {
    id: 'burgu-6',
    craft: 'knit',
    name: l('Klasik burgu (6 ilmek)', 'Classic 6-stitch cable', 'Ocho clásico de 6 puntos', 'Trança clássica de 6 pontos'),
    aka: [l('Saç örgü', 'Rope cable', 'Ocho de cuerda', 'Trança corda')],
    en: '3/3 cable',
    level: 3,
    category: 'burgu',
    summary: l(
      'Ters jarse zemin üzerinde 6 ilmeklik halat. Her 8 sırada bir 3 ilmek yardımcı şişe alınıp çaprazlanır.',
      'A 6-stitch rope on reverse stockinette. Every 8 rows, 3 stitches are crossed using a cable needle.',
      'Una cuerda de 6 puntos sobre jersey revés. Cada 8 vueltas se cruzan 3 puntos con aguja auxiliar.',
      'Uma corda de 6 pontos sobre jersey avesso. A cada 8 carreiras cruzam-se 3 pontos com agulha auxiliar.',
    ),
    flat: {
      multiple: 8,
      plus: 2,
      rows: [
        { label: l('1., 3. ve 7. sıra (ön yüz)', 'Rows 1, 3 and 7 (RS)', 'Vueltas 1, 3 y 7 (LD)', 'Carreiras 1, 3 e 7 (LD)'), text: l('*2 ters, 6 düz*, 2 ters.', '*P2, k6*, p2.', '*2 r, 6 d*, 2 r.', '*2 t, 6 m*, 2 t.') },
        { label: l('Tüm arka yüz sıraları', 'All WS rows', 'Todas las vueltas del revés', 'Todas as carreiras do avesso'), text: l('*2 düz, 6 ters*, 2 düz.', '*K2, p6*, k2.', '*2 d, 6 r*, 2 d.', '*2 m, 6 t*, 2 m.') },
        {
          label: ROW('5', 'rs'),
          text: l(
            '*2 ters, 3/3 sağa burgu (3 ilmeği yardımcı şişe al, arkada beklet, 3 düz, yardımcıdaki 3 ilmeği düz ör)*, 2 ters.',
            '*P2, 3/3 RC (slip 3 to cable needle, hold in back, k3, k3 from cable needle)*, p2.',
            '*2 r, cruce 3/3 a la derecha (3 puntos a la auxiliar detrás, 3 d, 3 d de la auxiliar)*, 2 r.',
            '*2 t, trança 3/3 à direita (3 pontos na auxiliar atrás, 3 m, 3 m da auxiliar)*, 2 t.',
          ),
        },
      ],
      repeat: REP_ROWS('1', '8'),
    },
    round: {
      multiple: 8,
      plus: 0,
      rows: [
        { label: l('5. tur dışındaki turlar', 'All rounds except round 5', 'Todas las vueltas menos la 5', 'Todas as voltas menos a 5'), text: l('*2 ters, 6 düz* tekrarla.', '*P2, k6*; repeat.', '*2 r, 6 d*; repetir.', '*2 t, 6 m*; repetir.') },
        { label: RND('5'), text: l('*2 ters, 3/3 sağa burgu* tekrarla.', '*P2, 3/3 RC*; repeat.', '*2 r, cruce 3/3 derecha*; repetir.', '*2 t, trança 3/3 direita*; repetir.') },
      ],
      repeat: REP_RNDS('1', '8'),
    },
    chart: ['--......--......--', '--......--......--', '--......--......--', '--......--......--', '--Q>>>>>--Q>>>>>--', '--......--......--', '--......--......--', '--......--......--'],
    reversible: false,
    curls: false,
    widthFactor: 0.82,
    rowFactor: 1,
    yarnFactor: 1.25,
    uses: [l('Kazak', 'Sweaters', 'Jerséis', 'Suéteres'), l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Atkı', 'Scarves', 'Bufandas', 'Cachecóis'), l('Yastık', 'Pillows', 'Cojines', 'Almofadas')],
    tips: [
      l('Yardımcı şiş yoksa kısa bir çorap şişi, kürdan ya da tığ kullanabilirsin.', 'No cable needle? Use a short double-pointed needle, a toothpick or a crochet hook.', '¿Sin aguja auxiliar? Usa una de doble punta, un palillo o un ganchillo.', 'Sem agulha auxiliar? Use uma de pontas duplas, um palito ou uma agulha de crochê.'),
      l('Arkada beklet = sağa yatan burgu, önde beklet = sola yatan burgu.', 'Hold in back = right-leaning cable, hold in front = left-leaning cable.', 'Detrás = ocho hacia la derecha, delante = hacia la izquierda.', 'Atrás = trança para a direita, na frente = para a esquerda.'),
    ],
    lessonIds: ['sis-burgu'],
  },
  {
    id: 'burgu-4',
    craft: 'knit',
    name: l('Küçük burgu (4 ilmek)', 'Little 4-stitch cable', 'Ocho pequeño de 4 puntos', 'Trança pequena de 4 pontos'),
    en: '2/2 cable',
    level: 2,
    category: 'burgu',
    summary: l(
      'Ters jarse zeminde 4 ilmeklik ince halat; her 4 sırada bir çaprazlanır. İlk burgu denemesi için ideal.',
      'A slim 4-stitch rope on reverse stockinette, crossed every 4 rows. Perfect first cable.',
      'Una cuerda fina de 4 puntos cruzada cada 4 vueltas. Ideal como primer ocho.',
      'Uma corda fina de 4 pontos cruzada a cada 4 carreiras. Ideal como primeira trança.',
    ),
    flat: {
      multiple: 6,
      plus: 2,
      rows: [
        {
          label: ROW('1', 'rs'),
          text: l(
            '*2 ters, 2/2 sola burgu (2 ilmeği yardımcı şişe al, önde beklet, 2 düz, yardımcıdakileri düz ör)*, 2 ters.',
            '*P2, 2/2 LC (slip 2 to cable needle, hold in front, k2, k2 from cable needle)*, p2.',
            '*2 r, cruce 2/2 a la izquierda (2 puntos a la auxiliar delante, 2 d, 2 d de la auxiliar)*, 2 r.',
            '*2 t, trança 2/2 à esquerda (2 pontos na auxiliar na frente, 2 m, 2 m da auxiliar)*, 2 t.',
          ),
        },
        { label: l('2. ve 4. sıra (arka yüz)', 'Rows 2 and 4 (WS)', 'Vueltas 2 y 4 (LR)', 'Carreiras 2 e 4 (LA)'), text: l('*2 düz, 4 ters*, 2 düz.', '*K2, p4*, k2.', '*2 d, 4 r*, 2 d.', '*2 m, 4 t*, 2 m.') },
        { label: ROW('3', 'rs'), text: l('*2 ters, 4 düz*, 2 ters.', '*P2, k4*, p2.', '*2 r, 4 d*, 2 r.', '*2 t, 4 m*, 2 t.') },
      ],
      repeat: REP_ROWS('1', '4'),
    },
    chart: ['--L>>>--L>>>--L>>>--', '--....--....--....--', '--....--....--....--', '--....--....--....--'],
    reversible: false,
    curls: false,
    widthFactor: 0.85,
    rowFactor: 1,
    yarnFactor: 1.2,
    uses: [l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Bebek hırkası', 'Baby cardigans', 'Chaquetas de bebé', 'Casaquinhos de bebê'), l('Atkı kenarı', 'Scarf borders', 'Bordes de bufanda', 'Bordas de cachecol')],
    tips: [l('6 sırada bir çaprazlarsan daha uzun ve yumuşak kıvrımlar elde edersin.', 'Cross every 6 rows for longer, softer twists.', 'Cruza cada 6 vueltas para giros más largos.', 'Cruze a cada 6 carreiras para voltas mais longas.')],
    lessonIds: ['sis-burgu'],
  },

  /* ── Tığ ──────────────────────────────────────────────── */
  {
    id: 'tig-sik-igne',
    craft: 'crochet',
    name: l('{Sc} sıraları', '{Sc} rows', 'Vueltas de {sc}', 'Carreiras de {sc}'),
    en: 'Single crochet rows',
    level: 1,
    category: 'tig-temel',
    summary: l(
      'Sık, sağlam, neredeyse kare ilmekli kumaş. Amigurumi, sepet ve çantanın temeli.',
      'A dense, sturdy fabric with almost square stitches. The basis of amigurumi, baskets and bags.',
      'Un tejido denso y firme con puntos casi cuadrados. La base del amigurumi, cestas y bolsos.',
      'Um tecido denso e firme com pontos quase quadrados. A base do amigurumi, cestos e bolsas.',
    ),
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: FOUNDATION, text: l('İstenen ilmek sayısı + 1 zincir çek.', 'Chain the number of stitches you need + 1.', 'Haz tantas cadenetas como puntos necesites + 1.', 'Faça tantas correntinhas quanto os pontos necessários + 1.') },
        { label: ROW('1'), text: l('Tığdan itibaren 2. zincire 1 {sc}, sonraki her zincire 1 {sc}. İşi çevir.', '{Sc} in 2nd chain from hook and in each chain across. Turn.', '1 {sc} en la 2.ª cadeneta desde la aguja y en cada cadeneta. Girar.', '1 {sc} na 2ª correntinha a partir da agulha e em cada correntinha. Virar.') },
        { label: ROW('2'), text: l('1 zincir (dönüş zinciri, ilmek sayılmaz), her ilmeğe 1 {sc}. İşi çevir.', 'Ch 1 (does not count as a stitch), {sc} in each stitch across. Turn.', '1 cadeneta (no cuenta como punto), 1 {sc} en cada punto. Girar.', '1 correntinha (não conta como ponto), 1 {sc} em cada ponto. Virar.') },
      ],
      repeat: l('2. sırayı tekrarla.', 'Repeat row 2.', 'Repetir la vuelta 2.', 'Repetir a carreira 2.'),
    },
    chart: ['++++++++++c', 'c++++++++++', '++++++++++c'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: [l('Amigurumi', 'Amigurumi', 'Amigurumi', 'Amigurumi'), l('Sepet', 'Baskets', 'Cestas', 'Cestos'), l('Bardak altlığı', 'Coasters', 'Posavasos', 'Porta-copos'), l('Çanta', 'Bags', 'Bolsos', 'Bolsas')],
    tips: [l('Sıra sonundaki son ilmeği atlamak en sık hatadır; kenarlar daralıyorsa her sıra sonunda ilmek say.', 'Skipping the last stitch is the most common mistake. If your edges narrow, count at the end of every row.', 'Saltarse el último punto es el error más común: cuenta al final de cada vuelta.', 'Pular o último ponto é o erro mais comum: conte no fim de cada carreira.')],
    lessonIds: ['tig-sik-igne', 'tig-donus'],
  },
  {
    id: 'tig-yarim-trabzan',
    craft: 'crochet',
    name: l('{Hdc} sıraları', '{Hdc} rows', 'Vueltas de {hdc}', 'Carreiras de {hdc}'),
    en: 'Half double crochet rows',
    level: 1,
    category: 'tig-temel',
    summary: l(
      '{Sc} ile {dc} arası yükseklikte, yumuşak ve hızlı ilerleyen kumaş. Battaniye ve bereye çok uygun.',
      'Between {sc} and {dc} in height: soft and quick. Great for blankets and hats.',
      'Entre {sc} y {dc} de altura: suave y rápido. Ideal para mantas y gorros.',
      'Entre {sc} e {dc} de altura: macio e rápido. Ótimo para mantas e gorros.',
    ),
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: FOUNDATION, text: l('İstenen ilmek sayısı + 2 zincir çek.', 'Chain the number of stitches you need + 2.', 'Haz tantas cadenetas como puntos + 2.', 'Faça tantas correntinhas quanto os pontos + 2.') },
        { label: ROW('1'), text: l('Tığdan itibaren 3. zincire 1 {hdc}, sonraki her zincire 1 {hdc}. İşi çevir.', '{Hdc} in 3rd chain from hook and in each chain across. Turn.', '1 {hdc} en la 3.ª cadeneta desde la aguja y en cada cadeneta. Girar.', '1 {hdc} na 3ª correntinha a partir da agulha e em cada correntinha. Virar.') },
        { label: ROW('2'), text: l('2 zincir (sayılmaz), her ilmeğe 1 {hdc}. İşi çevir.', 'Ch 2 (does not count), {hdc} in each stitch across. Turn.', '2 cadenetas (no cuentan), 1 {hdc} en cada punto. Girar.', '2 correntinhas (não contam), 1 {hdc} em cada ponto. Virar.') },
      ],
      repeat: l('2. sırayı tekrarla.', 'Repeat row 2.', 'Repetir la vuelta 2.', 'Repetir a carreira 2.'),
    },
    chart: ['hhhhhhhhhcc', 'cchhhhhhhhh', 'hhhhhhhhhcc'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: [l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Atkı', 'Scarves', 'Bufandas', 'Cachecóis')],
    tips: [
      l(
        '{Hdc} üç halka bırakır: ön, arka ve arkada yatan üçüncü halka. Üçüncü halkaya batarak örersen ön yüzde örgü gibi yatay çizgiler oluşur.',
        '{Hdc} leaves three loops: front, back and a third loop lying behind. Working into the third loop makes knit-look horizontal lines.',
        'El {hdc} deja tres hebras: delantera, trasera y una tercera detrás. Trabajar en la tercera crea líneas tipo punto de media.',
        'O {hdc} deixa três alças: da frente, de trás e uma terceira atrás. Trabalhar na terceira cria linhas que parecem tricô.',
      ),
    ],
    lessonIds: ['tig-yarim-trabzan'],
  },
  {
    id: 'tig-trabzan',
    craft: 'crochet',
    name: l('{Dc} sıraları', '{Dc} rows', 'Vueltas de {dc}', 'Carreiras de {dc}'),
    en: 'Double crochet rows',
    level: 1,
    category: 'tig-temel',
    summary: l('Uzun ilmekli, hızlı büyüyen, yumuşak dökümlü kumaş.', 'Tall stitches that grow fast with a soft drape.', 'Puntos altos que crecen rápido y caen suaves.', 'Pontos altos que crescem rápido e caem macios.'),
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: FOUNDATION, text: l('İstenen ilmek sayısı + 2 zincir çek.', 'Chain the number of stitches you need + 2.', 'Haz tantas cadenetas como puntos + 2.', 'Faça tantas correntinhas quanto os pontos + 2.') },
        {
          label: ROW('1'),
          text: l(
            'Tığdan itibaren 4. zincire 1 {dc} (atlanan 3 zincir ilk ilmek sayılır), sonraki her zincire 1 {dc}. İşi çevir.',
            '{Dc} in 4th chain from hook (the skipped 3 chains count as the first stitch) and in each chain across. Turn.',
            '1 {dc} en la 4.ª cadeneta desde la aguja (las 3 saltadas cuentan como primer punto) y en cada cadeneta. Girar.',
            '1 {dc} na 4ª correntinha a partir da agulha (as 3 puladas contam como primeiro ponto) e em cada correntinha. Virar.',
          ),
        },
        {
          label: ROW('2'),
          text: l(
            '3 zincir (ilk ilmek sayılır), ilk ilmeği atla, sonraki her ilmeğe 1 {dc}; son {dc} önceki sıranın dönüş zincirinin tepesine. İşi çevir.',
            'Ch 3 (counts as first stitch), skip first stitch, {dc} in each stitch across, working the last {dc} into the top of the turning chain. Turn.',
            '3 cadenetas (cuentan como primer punto), saltar el primero, 1 {dc} en cada punto; el último en la cadeneta de giro. Girar.',
            '3 correntinhas (contam como primeiro ponto), pular o primeiro, 1 {dc} em cada ponto; o último na correntinha de subida. Virar.',
          ),
        },
      ],
      repeat: l('2. sırayı tekrarla.', 'Repeat row 2.', 'Repetir la vuelta 2.', 'Repetir a carreira 2.'),
    },
    chart: ['ddddddddccc', 'cccdddddddd', 'ddddddddccc'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: [l('Şal', 'Shawls', 'Chales', 'Xales'), l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Yazlık', 'Summer tops', 'Prendas de verano', 'Peças de verão')],
    tips: [
      l(
        'Dönüş zinciri sayıldığı için son ilmeği önceki sıranın dönüş zincirinin tepesine örmeyi unutma; yoksa her sıra 1 ilmek kaybedersin.',
        'Because the turning chain counts, remember to work into its top at the end of the row, or you will lose a stitch every row.',
        'Como la cadeneta de giro cuenta, trabaja en ella al final; si no, perderás un punto cada vuelta.',
        'Como a correntinha de subida conta, trabalhe nela no final; senão, você perde um ponto a cada carreira.',
      ),
    ],
    lessonIds: ['tig-trabzan', 'tig-donus'],
  },
  {
    id: 'tig-kum',
    craft: 'crochet',
    name: l('Kum taneleri', 'Moss stitch (crochet)', 'Punto musgo', 'Ponto musgo'),
    aka: [l('Zincirli sık iğne', 'Linen stitch', 'Punto granito', 'Ponto granito')],
    en: 'Moss stitch / Linen stitch',
    level: 2,
    category: 'tig-doku',
    summary: l(
      '{Sc} ve zincirin dönüşümlü örülmesiyle dokuma kumaş gibi düz ve ince bir doku. Renk şeritleriyle çok güzel olur.',
      'Alternating {sc} and chains gives a flat, woven-looking fabric. Gorgeous in stripes.',
      'Alternar {sc} y cadenetas da un tejido plano que parece tela. Precioso a rayas.',
      'Alternar {sc} e correntinhas dá um tecido plano que parece tecelagem. Lindo listrado.',
    ),
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: FOUNDATION, text: l('Çift sayıda zincir çek.', 'Chain an even number.', 'Haz un número par de cadenetas.', 'Faça um número par de correntinhas.') },
        { label: ROW('1'), text: l('Tığdan itibaren 4. zincire 1 {sc}, *1 zincir, 1 zincir atla, sonrakine 1 {sc}* tekrarla. İşi çevir.', '{Sc} in 4th chain from hook, *ch 1, skip 1 chain, {sc} in next*; repeat. Turn.', '1 {sc} en la 4.ª cadeneta, *1 cad, saltar 1, 1 {sc} en la siguiente*; repetir. Girar.', '1 {sc} na 4ª correntinha, *1 corr, pular 1, 1 {sc} na seguinte*; repetir. Virar.') },
        {
          label: ROW('2'),
          text: l(
            '2 zincir, ilk zincir boşluğuna 1 {sc}, *1 zincir, sonraki zincir boşluğuna 1 {sc}* tekrarla, son {sc} dönüş zinciri boşluğuna. İşi çevir.',
            'Ch 2, {sc} in first chain space, *ch 1, {sc} in next chain space*; repeat, working the last {sc} into the turning-chain space. Turn.',
            '2 cad, 1 {sc} en el primer espacio, *1 cad, 1 {sc} en el siguiente espacio*; repetir; el último en el espacio de giro. Girar.',
            '2 corr, 1 {sc} no primeiro espaço, *1 corr, 1 {sc} no espaço seguinte*; repetir; o último no espaço de subida. Virar.',
          ),
        },
      ],
      repeat: l('2. sırayı tekrarla.', 'Repeat row 2.', 'Repetir la vuelta 2.', 'Repetir a carreira 2.'),
    },
    chart: ['+c+c+c+c+cc', 'cc+c+c+c+c+', '+c+c+c+c+cc'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 0.95,
    uses: [l('Atkı', 'Scarves', 'Bufandas', 'Cachecóis'), l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Çanta', 'Bags', 'Bolsos', 'Bolsas')],
    tips: [l('İlmeklere değil zincir boşluklarına batılır; saymak ve ilerlemek çok kolaydır.', 'You work into chain spaces, not stitches, so it is easy to keep track.', 'Se trabaja en los espacios, no en los puntos: muy fácil de seguir.', 'Trabalha-se nos espaços, não nos pontos: muito fácil de acompanhar.')],
    lessonIds: ['tig-sik-igne', 'tig-zincir'],
  },
  {
    id: 'tig-v',
    craft: 'crochet',
    name: l('V ilmek deseni', 'V-stitch', 'Punto V', 'Ponto V'),
    en: 'V-stitch',
    level: 2,
    category: 'tig-doku',
    summary: l('Aynı ilmeğe "{dc}, zincir, {dc}" örülerek oluşan V şekilleri. Hafif, havadar ve hızlı.', 'V shapes made with "{dc}, chain, {dc}" in one stitch. Light, airy and quick.', 'Formas de V con "{dc}, cadeneta, {dc}" en un punto. Ligero y rápido.', 'Formas de V com "{dc}, correntinha, {dc}" no mesmo ponto. Leve e rápido.'),
    flat: {
      multiple: 3,
      plus: 2,
      rows: [
        { label: FOUNDATION, text: l("3'ün katı + 5 zincir çek.", 'Chain a multiple of 3 + 5.', 'Haz un múltiplo de 3 + 5 cadenetas.', 'Faça um múltiplo de 3 + 5 correntinhas.') },
        {
          label: ROW('1'),
          text: l(
            'Tığdan itibaren 5. zincire (1 {dc}, 1 zincir, 1 {dc}) = V, *2 zincir atla, sonrakine V* tekrarla, 1 zincir atla, son zincire 1 {dc}. İşi çevir.',
            '(1 {dc}, ch 1, 1 {dc}) in 5th chain from hook = V, *skip 2 chains, V in next*; repeat, skip 1 chain, {dc} in last chain. Turn.',
            '(1 {dc}, 1 cad, 1 {dc}) en la 5.ª cadeneta = V, *saltar 2, V en la siguiente*; repetir, saltar 1, 1 {dc} en la última. Girar.',
            '(1 {dc}, 1 corr, 1 {dc}) na 5ª correntinha = V, *pular 2, V na seguinte*; repetir, pular 1, 1 {dc} na última. Virar.',
          ),
        },
        { label: ROW('2'), text: l('3 zincir, her V\'nin ortasındaki boşluğa 1 V, dönüş zincirinin tepesine 1 {dc}. İşi çevir.', 'Ch 3, V in the center space of each V, {dc} in top of turning chain. Turn.', '3 cad, 1 V en el centro de cada V, 1 {dc} en la cadeneta de giro. Girar.', '3 corr, 1 V no centro de cada V, 1 {dc} na correntinha de subida. Virar.') },
      ],
      repeat: l('2. sırayı tekrarla.', 'Repeat row 2.', 'Repetir la vuelta 2.', 'Repetir a carreira 2.'),
    },
    chart: ['dVVVVVccc', 'cccVVVVVd'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 0.85,
    uses: [l('Şal', 'Shawls', 'Chales', 'Xales'), l('Bebek battaniyesi', 'Baby blankets', 'Mantas de bebé', 'Mantas de bebê'), l('Yazlık hırka', 'Summer cardigans', 'Chaquetas de verano', 'Casaquinhos de verão')],
    tips: [l("V'ler üst üste dizilir; sırayı V'nin göbeğindeki boşluktan saymak kolaydır.", 'Vs stack on top of each other, so counting rows is easy.', 'Las V se apilan: contar vueltas es fácil.', 'Os V se empilham: contar carreiras é fácil.')],
    lessonIds: ['tig-v-ilmek'],
  },
  {
    id: 'tig-yelpaze',
    craft: 'crochet',
    name: l('Yelpaze deseni', 'Shell stitch', 'Punto abanico', 'Ponto leque'),
    aka: [l('Deniz kabuğu', 'Scallops', 'Conchas', 'Conchas')],
    en: 'Shell stitch',
    level: 2,
    category: 'tig-doku',
    summary: l("Aynı ilmeğe 5 {dc} örülerek oluşan yelpazeler ve aralarındaki {sc}'lerle dalgalı bir kumaş.", 'Fans of 5 {dc} worked into one stitch with {sc} between them make a wavy fabric.', 'Abanicos de 5 {dc} en un punto con {sc} entre ellos forman ondas.', 'Leques de 5 {dc} no mesmo ponto com {sc} entre eles formam ondas.'),
    flat: {
      multiple: 6,
      plus: 1,
      rows: [
        { label: FOUNDATION, text: l("6'nın katı + 2 zincir çek.", 'Chain a multiple of 6 + 2.', 'Haz un múltiplo de 6 + 2 cadenetas.', 'Faça um múltiplo de 6 + 2 correntinhas.') },
        {
          label: ROW('1'),
          text: l(
            'Tığdan itibaren 2. zincire 1 {sc}, *2 zincir atla, sonrakine 5 {dc} (yelpaze), 2 zincir atla, sonrakine 1 {sc}* tekrarla. İşi çevir.',
            '{Sc} in 2nd chain from hook, *skip 2, 5 {dc} in next (shell), skip 2, {sc} in next*; repeat. Turn.',
            '1 {sc} en la 2.ª cadeneta, *saltar 2, 5 {dc} en la siguiente (abanico), saltar 2, 1 {sc}*; repetir. Girar.',
            '1 {sc} na 2ª correntinha, *pular 2, 5 {dc} na seguinte (leque), pular 2, 1 {sc}*; repetir. Virar.',
          ),
        },
        {
          label: ROW('2'),
          text: l(
            "3 zincir, ilk {sc}'ye 2 {dc}, *yelpazenin ortasındaki {dc}'ye 1 {sc}, sonraki {sc}'ye 5 {dc}* tekrarla, son {sc}'ye 3 {dc}. İşi çevir.",
            'Ch 3, 2 {dc} in first {sc}, *{sc} in center {dc} of shell, 5 {dc} in next {sc}*; repeat, ending 3 {dc} in last {sc}. Turn.',
            '3 cad, 2 {dc} en el primer {sc}, *1 {sc} en el centro del abanico, 5 {dc} en el siguiente {sc}*; repetir, terminar con 3 {dc}. Girar.',
            '3 corr, 2 {dc} no primeiro {sc}, *1 {sc} no centro do leque, 5 {dc} no {sc} seguinte*; repetir, terminar com 3 {dc}. Virar.',
          ),
        },
        {
          label: ROW('3'),
          text: l(
            "1 zincir, ilk ilmeğe 1 {sc}, *sonraki {sc}'ye 5 {dc}, yelpazenin ortasına 1 {sc}* tekrarla, son {sc} dönüş zincirinin tepesine. İşi çevir.",
            'Ch 1, {sc} in first stitch, *5 {dc} in next {sc}, {sc} in center of shell*; repeat, last {sc} in top of turning chain. Turn.',
            '1 cad, 1 {sc} en el primer punto, *5 {dc} en el siguiente {sc}, 1 {sc} en el centro*; repetir; el último en la cadeneta de giro. Girar.',
            '1 corr, 1 {sc} no primeiro ponto, *5 {dc} no {sc} seguinte, 1 {sc} no centro*; repetir; o último na correntinha de subida. Virar.',
          ),
        },
      ],
      repeat: l('2. ve 3. sıraları tekrarla.', 'Repeat rows 2 and 3.', 'Repetir las vueltas 2 y 3.', 'Repetir as carreiras 2 e 3.'),
    },
    chart: ['+_S_+_S_+_S_+', 'd_+_S_+_S_+_d'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1.05,
    uses: [l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Şal kenarı', 'Shawl edges', 'Bordes de chal', 'Bordas de xale'), l('Bebek elbisesi eteği', 'Baby dress skirts', 'Faldas de vestido de bebé', 'Saias de vestido de bebê')],
    tips: [l('Battaniye kenarına tek sıra yelpaze işi bir anda bitmiş gösterir.', 'One row of shells around a blanket instantly looks finished.', 'Una vuelta de abanicos alrededor de una manta la remata al instante.', 'Uma carreira de leques ao redor da manta já dá acabamento.')],
    lessonIds: ['tig-yelpaze'],
  },
  {
    id: 'tig-kabartma-lastik',
    craft: 'crochet',
    name: l('Kabartma lastik', 'Post-stitch rib', 'Elástico en relieve', 'Ribana em relevo'),
    en: 'Post stitch rib (FPdc / BPdc)',
    level: 3,
    category: 'tig-doku',
    summary: l("Ön ve arka kabartma {dc}'lerin dönüşümlü örülmesiyle şiş lastiğine çok benzeyen esnek bir doku.", 'Alternating front and back post {dc} makes a stretchy texture that looks like knitted ribbing.', 'Alternar {dc} en relieve por delante y por detrás crea un elástico como de punto.', 'Alternar {dc} em relevo pela frente e por trás cria uma ribana parecida com tricô.'),
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: l('Temel', 'Base', 'Base', 'Base'), text: l('Çift sayıda ilmekle 1 sıra {dc} ör.', 'Work one row of {dc} over an even number of stitches.', 'Teje una vuelta de {dc} sobre un número par de puntos.', 'Faça uma carreira de {dc} com número par de pontos.') },
        { label: l('Lastik sırası', 'Rib row', 'Vuelta de elástico', 'Carreira de ribana'), text: l('2 zincir, *1 ön kabartma {dc}, 1 arka kabartma {dc}* tekrarla, dönüş zincirine 1 {hdc}. İşi çevir.', 'Ch 2, *FP{dc}, BP{dc}*; repeat, {hdc} in turning chain. Turn.', '2 cad, *1 {dc} en relieve delante, 1 {dc} en relieve detrás*; repetir, 1 {hdc} en la cadeneta de giro. Girar.', '2 corr, *1 {dc} em relevo pela frente, 1 {dc} em relevo por trás*; repetir, 1 {hdc} na correntinha de subida. Virar.') },
        { label: l('Sonraki sıralar', 'Following rows', 'Vueltas siguientes', 'Carreiras seguintes'), text: l('Önde kabarık görünen ilmeği ön kabartma, geride kalanı arka kabartma ile ör.', 'Work front post into stitches that stand out toward you, back post into those that recede.', 'Relieve delante en los puntos que sobresalen hacia ti, detrás en los que se hunden.', 'Relevo pela frente nos pontos saltados para você, por trás nos afundados.') },
      ],
    },
    chart: ['dddddddddd', 'FKFKFKFKFK', 'FKFKFKFKFK'],
    reversible: false,
    curls: false,
    widthFactor: 0.85,
    rowFactor: 1,
    yarnFactor: 1.3,
    uses: [l('Bere ağzı', 'Hat brims', 'Bordes de gorro', 'Barras de gorro'), l('Kol ucu', 'Cuffs', 'Puños', 'Punhos'), l('Battaniye kenarı', 'Blanket borders', 'Bordes de manta', 'Bordas de manta')],
    tips: [l("Kabartma ilmekler çok ip yer; düz {dc}'ye göre yaklaşık %30 fazla ip ayır.", 'Post stitches eat yarn: plan about 30% more than plain {dc}.', 'Los puntos en relieve gastan mucho: calcula un 30 % más.', 'Pontos em relevo gastam muito fio: calcule 30% a mais.')],
    lessonIds: ['tig-kabartma'],
  },
  {
    id: 'tig-fistik',
    craft: 'crochet',
    name: l('Fıstık deseni', 'Puff stitch rows', 'Punto puff', 'Ponto puff'),
    en: 'Puff stitch',
    level: 2,
    category: 'tig-doku',
    summary: l('Aynı ilmekte birkaç kez ip atıp çekilen ilmeklerin tek seferde kapatılmasıyla oluşan kabarık fıstıklar.', 'Several loops pulled up in one stitch and closed together make soft, puffy bumps.', 'Varias lazadas sacadas en un punto y cerradas juntas forman bultitos esponjosos.', 'Várias laçadas puxadas no mesmo ponto e fechadas juntas formam bolinhas fofas.'),
    flat: {
      multiple: 2,
      plus: 1,
      rows: [
        { label: FOUNDATION, text: l('Tek sayıda zincir çek.', 'Chain an odd number.', 'Haz un número impar de cadenetas.', 'Faça um número ímpar de correntinhas.') },
        { label: ROW('1'), text: l("Tığdan itibaren 2. zincire {sc}, sonraki her zincire {sc}. İşi çevir.", '{Sc} in 2nd chain from hook and in each chain across. Turn.', '1 {sc} en la 2.ª cadeneta y en cada cadeneta. Girar.', '1 {sc} na 2ª correntinha e em cada correntinha. Virar.') },
        {
          label: ROW('2'),
          text: l(
            '2 zincir, *sonraki ilmeğe 1 fıstık (3 kez: ip at, bat, ipi çek; tığdaki 7 ilmekten birden geçir), 1 zincir, 1 ilmek atla* tekrarla, son ilmeğe 1 {hdc}. İşi çevir.',
            'Ch 2, *puff in next stitch (3 times: yarn over, insert, pull up; pull through all 7 loops), ch 1, skip 1*; repeat, {hdc} in last stitch. Turn.',
            '2 cad, *1 puff en el siguiente punto (3 veces: lazada, entrar, sacar; cerrar las 7 lazadas), 1 cad, saltar 1*; repetir, 1 {hdc} en el último. Girar.',
            '2 corr, *1 puff no ponto seguinte (3 vezes: laçada, entrar, puxar; fechar as 7 alças), 1 corr, pular 1*; repetir, 1 {hdc} no último. Virar.',
          ),
        },
        { label: ROW('3'), text: l('1 zincir, her fıstığa ve her zincir boşluğuna 1 {sc}. İşi çevir.', 'Ch 1, {sc} in each puff and each chain space. Turn.', '1 cad, 1 {sc} en cada puff y cada espacio. Girar.', '1 corr, 1 {sc} em cada puff e cada espaço. Virar.') },
      ],
      repeat: l('2. ve 3. sıraları tekrarla.', 'Repeat rows 2 and 3.', 'Repetir las vueltas 2 y 3.', 'Repetir as carreiras 2 e 3.'),
    },
    chart: ['+++++++++++', 'ccP_P_P_P_h', '+++++++++++'],
    reversible: false,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1.35,
    uses: [l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Yastık', 'Pillows', 'Cojines', 'Almofadas')],
    tips: [l('Çektiğin her ilmeği aynı yüksekliğe kaldır; düzgün fıstığın sırrı budur.', 'Pull every loop up to the same height: that is the secret of a neat puff.', 'Saca cada lazada a la misma altura: ese es el secreto.', 'Puxe cada alça na mesma altura: esse é o segredo.')],
    lessonIds: ['tig-fistik'],
  },
];

export const PATTERN_BY_ID: Record<string, StitchPattern> = Object.fromEntries(STITCH_PATTERNS.map((p) => [p.id, p]));

export const PATTERN_CATEGORY_LABEL: Record<PatternCategory, L10n> = {
  temel: l('Temel', 'Basics', 'Básicos', 'Básicos'),
  lastik: l('Lastikler', 'Ribbing', 'Elásticos', 'Ribanas'),
  doku: l('Doku', 'Texture', 'Texturas', 'Texturas'),
  ajur: l('Ajur', 'Lace', 'Calados', 'Rendas'),
  burgu: l('Burgu', 'Cables', 'Ochos', 'Tranças'),
  selanik: l('Selanik ailesi', 'Brioche family', 'Familia brioche', 'Família brioche'),
  'tig-temel': l('Tığ temel', 'Crochet basics', 'Ganchillo básico', 'Crochê básico'),
  'tig-doku': l('Tığ doku', 'Crochet textures', 'Texturas de ganchillo', 'Texturas de crochê'),
};

const TR_SUFFIX: Record<number, string> = { 2: "'nin", 3: "'ün", 4: "'ün", 5: "'in", 6: "'nın", 7: "'nin", 8: "'in", 9: "'un", 10: "'un", 12: "'nin", 18: "'in" };

/** İlmek kuralını yazıya döker: "4'ün katı + 1", "Multiple of 4 + 1" */
export function multipleText(w: { multiple: number; plus: number }, lang: Lang): string {
  const any = { tr: 'Her sayıda ilmek', en: 'Any number of stitches', es: 'Cualquier número de puntos', pt: 'Qualquer número de pontos' };
  const even = { tr: 'Çift sayı', en: 'Even number', es: 'Número par', pt: 'Número par' };
  const odd = { tr: 'Tek sayı', en: 'Odd number', es: 'Número impar', pt: 'Número ímpar' };
  if (w.multiple <= 1 && w.plus === 0) return any[lang];
  if (w.multiple === 2 && w.plus === 0) return even[lang];
  if (w.multiple === 2 && w.plus === 1) return odd[lang];
  const base =
    lang === 'tr' ? `${w.multiple}${TR_SUFFIX[w.multiple] ?? "'in"} katı` : lang === 'en' ? `Multiple of ${w.multiple}` : lang === 'es' ? `Múltiplo de ${w.multiple}` : `Múltiplo de ${w.multiple}`;
  return w.plus ? `${base} + ${w.plus}` : base;
}

/** Grafik satırlarını sembol dizilerine çevirir (ChartDoc sırası: üstten alta) */
export function patternChartCells(p: StitchPattern): { width: number; height: number; symbols: string[] } | null {
  if (!p.chart?.length) return null;
  const map = p.craft === 'knit' ? KNIT_CHART_CHARS : CROCHET_CHART_CHARS;
  const width = Math.max(...p.chart.map((r) => r.length));
  const topDown = [...p.chart].reverse();
  const symbols: string[] = [];
  for (const row of topDown) {
    for (let x = 0; x < width; x++) {
      const ch = row[x] ?? '';
      symbols.push(ch === '>' || ch === '_' || ch === '' ? '' : (map[ch] ?? ''));
    }
  }
  return { width, height: topDown.length, symbols };
}

/** Desen + ilmek sayısı uygun mu? */
export function fitsPattern(stitches: number, w: { multiple: number; plus: number }): boolean {
  if (w.multiple <= 1) return stitches >= Math.max(1, w.plus);
  return stitches >= w.multiple + w.plus && (stitches - w.plus) % w.multiple === 0;
}
