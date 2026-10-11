/**
 * Eserler galerisi: hazır, seçilmiş tarifler. Metinler özgündür; her eser bir üreticiyi sabit
 * parametrelerle çağırır, böylece seçilen beden, renk ve dilde tam tarif üretilir.
 */
import type { GeneratedPattern, Gauge, ToolKind, Units } from '@/types';
import type { L10n } from '@/i18n';
import type { TermsCtx } from '@/knowledge/terms';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import { BALL_SIZES, BLANKET_SIZES, CIRCLE_SIZES, COWL_SIZES, HEAD_SIZES, SCARF_SIZES } from '@/knowledge/sizes';
import { generatePattern, type PatternParams, type TemplateId, type YarnSpec } from '@/engine/patterns';
import type { WorkDef, WorkSize } from './types';
import { booties } from './special/booties';
import { marketBag } from './special/marketBag';
import { headband } from './special/headband';
import { dishcloth } from './special/dishcloth';

export type { WorkDef, WorkSize, WorkCategory, IllustrationKey } from './types';

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

/* ── Renk yuvası adları ── */
const MAIN = l('Ana renk', 'Main color', 'Color principal', 'Cor principal');
const BORDER = l('Kenar', 'Border', 'Borde', 'Borda');
const CUFF = l('Bilek', 'Cuff', 'Puño', 'Punho');
const BRIM = l('Ağız', 'Brim', 'Borde', 'Barra');
const BAND = l('Bant', 'Band', 'Banda', 'Barra');
const roundSlot = (n: number) => l(`${n}. tur`, `Round ${n}`, `Vuelta ${n}`, `Volta ${n}`);
const stripeSlot = (c: string) => l(`${c} şeridi`, `Stripe ${c}`, `Raya ${c}`, `Listra ${c}`);

/* ── Bedenler ── */
const scarfSize = (id: string, extra: Partial<PatternParams> = {}): WorkSize => {
  const s = SCARF_SIZES.find((x) => x.id === id)!;
  return { id, label: s.label, params: { widthCm: s.width, lengthCm: s.length, ...extra } };
};
const headSize = (id: string): WorkSize => {
  const s = HEAD_SIZES.find((x) => x.id === id)!;
  return { id, label: s.label, params: { circumferenceCm: s.circumference, heightCm: s.hatHeight } };
};
const HAT_SIZES = ['cocuk-1-3', 'cocuk-3-10', 'genc', 'kadin', 'erkek'].map(headSize);

/** Şablon tabanlı eser üreticisi: başlığı eserin adıyla değiştirir, eser notunu başa ekler */
function tplBuild(id: TemplateId, title: L10n, base: Partial<PatternParams>, tip?: L10n) {
  return (p: PatternParams): GeneratedPattern =>
    generatePattern(id, {
      ...base,
      ...p,
      overrides: { title: title[p.lang], notesBefore: tip ? [tip[p.lang]] : [] },
    });
}

function work(def: Omit<WorkDef, 'build'> & { template?: TemplateId; base?: Partial<PatternParams>; tip?: L10n; build?: WorkDef['build'] }): WorkDef {
  const { template, base, tip, ...rest } = def;
  const build = def.build ?? tplBuild(template!, def.title, base ?? {}, tip);
  return { ...rest, build };
}

export const WORKS: WorkDef[] = [
  /* ── Şiş ─────────────────────────────────────────────── */
  work({
    id: 'haraso-atki',
    craft: 'knit',
    category: 'accessories',
    difficulty: 1,
    hours: [8, 12],
    title: l('Haraşo atkı', 'Garter stitch scarf', 'Bufanda de punto bobo', 'Cachecol em ponto liga'),
    blurb: l(
      'İlk atkı: her sıra düz örülür, kenarlar kaydırmalı ilmekle düzgün durur. Yumuşak, iki yüzü aynı, kıvrılmaz.',
      'The first scarf: knit every row, with slipped edges for a tidy finish. Squishy, reversible and it never curls.',
      'La primera bufanda: todo al derecho, con orillos deslizados para un borde limpio. Mullida, reversible y no se enrolla.',
      'O primeiro cachecol: tudo em meia, com ourelas deslizadas para uma borda bonita. Fofo, reversível e não enrola.',
    ),
    yarnWeight: 4,
    fibers: ['yun'],
    toolMm: 5,
    toolKind: 'sis-duz',
    colorSlots: [MAIN],
    defaultColors: ['#46698a'],
    sizes: [scarfSize('cocuk'), scarfSize('standart'), scarfSize('genis')],
    defaultSize: 'standart',
    illustration: 'scarf',
    variant: 'garter',
    lessons: ['sis-ilmek-atma-sisle', 'sis-duz-ilmek', 'sis-haraso', 'sis-ilmek-kapatma', 'sis-uc-gizleme'],
    keywords: l('başlangıç kolay düz', 'beginner easy garter', 'principiante fácil', 'iniciante fácil'),
    template: 'atki',
    base: { stitchId: 'haraso', selvedge: true, fringe: true },
    tip: l(
      'İki sıra bir tırtıl yapar: sıra saymak yerine tırtılları say.',
      'Two rows make one ridge: count ridges instead of rows.',
      'Dos vueltas forman un surco: cuenta surcos en vez de vueltas.',
      'Duas carreiras formam um sulco: conte os sulcos em vez das carreiras.',
    ),
  }),
  work({
    id: 'lastik-bere',
    craft: 'knit',
    category: 'accessories',
    difficulty: 2,
    hours: [5, 8],
    title: l('2×2 lastik bere', '2×2 rib beanie', 'Gorro de elástico 2×2', 'Gorro de ribana 2×2'),
    blurb: l(
      'Baştan sona 2×2 lastik, kıvrık ağızlı klasik bere. Misinalı şişte yuvarlak örülür, tepesi 8 dilimle kapanır.',
      'A classic fold-up beanie in 2×2 rib from brim to crown. Knitted in the round with an 8-section crown.',
      'El gorro clásico con vuelta, en elástico 2×2 de principio a fin. En redondo y con coronilla en 8 secciones.',
      'O gorro clássico com barra dobrada, em ribana 2×2 do início ao fim. Em circular, com topo em 8 gomos.',
    ),
    yarnWeight: 4,
    fibers: ['merino'],
    toolMm: 4.5,
    toolKind: 'sis-misinali',
    colorSlots: [MAIN],
    defaultColors: ['#b5523b'],
    sizes: HAT_SIZES,
    defaultSize: 'kadin',
    illustration: 'beanie',
    variant: 'rib',
    lessons: ['sis-ilmek-atma-basparmak', 'sis-misinali', 'sis-lastik', 'sis-eksiltme', 'sis-magic-loop'],
    keywords: l('bere şapka yuvarlak', 'hat toque in the round', 'gorro en redondo', 'touca circular'),
    template: 'bere',
    base: { ribId: 'lastik-2x2', bodyId: 'lastik-2x2', foldBrim: true, brimCm: 6 },
    tip: l(
      'Lastikte ilmeği gördüğün gibi ör: V görünen düz, boncuk görünen ters.',
      'In rib, work the stitches as they appear: knit the Vs, purl the bumps.',
      'En el elástico teje lo que ves: las V al derecho, los granos al revés.',
      'Na ribana faça o que vê: os V em meia, as bolinhas em tricô.',
    ),
  }),
  work({
    id: 'yalanci-selanik-atki',
    craft: 'knit',
    category: 'accessories',
    difficulty: 1,
    hours: [7, 10],
    title: l('Yalancı selanik atkı', 'Mock brioche scarf', 'Bufanda de falso brioche', 'Cachecol de falso brioche'),
    blurb: l(
      'Selaniğin kabarık görüntüsü, tek bir sıra talimatıyla: *3 ters, 1 düz*. Kalın iple hızlı biter.',
      'The lofty look of brioche with a single-row repeat: *p3, k1*. Quick in chunky yarn.',
      'El aspecto esponjoso del brioche con una sola vuelta de repetición: *3 r, 1 d*. Rápida en hilo grueso.',
      'O visual fofo do brioche com uma única carreira de repetição: *3 t, 1 m*. Rápido em fio grosso.',
    ),
    yarnWeight: 5,
    fibers: ['yun', 'akrilik'],
    toolMm: 6,
    toolKind: 'sis-duz',
    colorSlots: [MAIN],
    defaultColors: ['#5f7a61'],
    sizes: [scarfSize('cocuk'), scarfSize('standart'), scarfSize('genis')],
    defaultSize: 'standart',
    illustration: 'scarf',
    variant: 'rib',
    lessons: ['sis-duz-ilmek', 'sis-ters-ilmek', 'sis-selanik', 'sis-kaydirma'],
    keywords: l('selanik lastik kalın', 'brioche rib chunky', 'brioche elástico', 'brioche ribana'),
    template: 'atki',
    base: { stitchId: 'yalanci-selanik', selvedge: true },
    tip: l(
      "İlmek sayısı 4'ün katı + 1 olmalı; ilk sırada say ve emin ol.",
      'The stitch count must be a multiple of 4 + 1; check it on the first row.',
      'El número de puntos debe ser múltiplo de 4 + 1; compruébalo en la primera vuelta.',
      'O número de pontos deve ser múltiplo de 4 + 1; confira na primeira carreira.',
    ),
  }),
  work({
    id: 'burgulu-bere',
    craft: 'knit',
    category: 'accessories',
    difficulty: 3,
    hours: [8, 12],
    title: l('Burgulu bere', 'Cable beanie', 'Gorro de ochos', 'Gorro de tranças'),
    blurb: l(
      'Ters jarse zemin üzerinde 6 ilmeklik halat burgular, 2×2 lastik ağız ve ponpon. Burguyu öğrenmek için iyi bir proje.',
      'Six-stitch rope cables on a reverse stockinette ground, a 2×2 rib brim and a pompom. A great way to learn cables.',
      'Ochos de cuerda de 6 puntos sobre jersey revés, borde de elástico 2×2 y pompón. Ideal para aprender ochos.',
      'Tranças de 6 pontos sobre jersey avesso, barra de ribana 2×2 e pompom. Ótimo para aprender tranças.',
    ),
    yarnWeight: 4,
    fibers: ['yun'],
    toolMm: 5,
    toolKind: 'sis-misinali',
    colorSlots: [MAIN],
    defaultColors: ['#c8b49a'],
    sizes: HAT_SIZES,
    defaultSize: 'kadin',
    illustration: 'beanie',
    variant: 'cable',
    lessons: ['sis-misinali', 'sis-lastik', 'sis-burgu', 'sis-eksiltme', 'sis-grafik-okuma'],
    keywords: l('burgu saç örgü ponpon', 'cables aran pompom', 'ochos trenzas pompón', 'tranças pompom'),
    template: 'bere',
    base: { ribId: 'lastik-2x2', bodyId: 'burgu-6', brimCm: 5, pompom: true },
    tip: l(
      'Burgu turunda yardımcı şişteki ilmekleri arkada beklet: halat sağa döner.',
      'On cable rounds, hold the cable needle in back: the rope twists to the right.',
      'En las vueltas de ocho, deja la aguja auxiliar detrás: la cuerda gira a la derecha.',
      'Nas voltas de trança, deixe a agulha auxiliar atrás: a corda gira para a direita.',
    ),
  }),
  work({
    id: 'pirinc-bez',
    craft: 'knit',
    category: 'home',
    difficulty: 1,
    hours: [2, 3],
    title: l('Pirinç örgü bulaşık bezi', 'Seed stitch dishcloth', 'Paño de cocina en punto arroz', 'Pano de prato em ponto arroz'),
    blurb: l(
      'Düz ve ters ilmeği pekiştiren küçük, kullanışlı bir kare. Pamuktan ör, mutfakta yıllarca kullan.',
      'A small, useful square to practice knit and purl. Make it in cotton and use it in the kitchen for years.',
      'Un cuadrado pequeño y útil para practicar derecho y revés. Tejido en algodón, dura años en la cocina.',
      'Um quadrado pequeno e útil para praticar meia e tricô. Em algodão, dura anos na cozinha.',
    ),
    yarnWeight: 4,
    fibers: ['pamuk'],
    toolMm: 4.5,
    toolKind: 'sis-duz',
    colorSlots: [MAIN, BORDER],
    defaultColors: ['#9fd8cb', '#f5f0e6'],
    sizes: [
      { id: 'kucuk', label: l('Küçük', 'Small', 'Pequeño', 'Pequeno'), params: { sizeCm: 20 } },
      { id: 'buyuk', label: l('Büyük', 'Large', 'Grande', 'Grande'), params: { sizeCm: 25 } },
    ],
    defaultSize: 'kucuk',
    illustration: 'dishcloth',
    lessons: ['sis-duz-ilmek', 'sis-ters-ilmek', 'sis-pirinc', 'sis-haraso'],
    keywords: l('mutfak bez pamuk', 'kitchen washcloth cotton', 'cocina algodón', 'cozinha algodão'),
    build: (p) => dishcloth(p),
  }),
  work({
    id: 'yelpaze-battaniye',
    craft: 'knit',
    category: 'baby',
    difficulty: 2,
    hours: [25, 40],
    title: l('Dalga ajurlu bebek battaniyesi', 'Feather and fan baby blanket', 'Manta de bebé de ola de mar', 'Manta de bebê em ondas'),
    blurb: l(
      'Dört sırada yalnız bir desen sırası olan klasik dalga ajur, haraşo kenarla çerçevelenir. Hafif, havadar, kucak dostu.',
      'Classic feather and fan, with only one pattern row in four, framed by a garter border. Light, airy and cuddly.',
      'El clásico ola de mar, con una sola vuelta de dibujo cada cuatro, enmarcado en punto bobo. Ligera y vaporosa.',
      'O clássico ponto ondas, com uma só carreira de desenho a cada quatro, emoldurado em ponto liga. Leve e arejada.',
    ),
    yarnWeight: 3,
    fibers: ['merino'],
    toolMm: 4,
    toolKind: 'sis-misinali',
    colorSlots: [MAIN, BORDER],
    defaultColors: ['#f8d3dc', '#f5f0e6'],
    sizes: BLANKET_SIZES.filter((s) => s.id === 'puset' || s.id === 'bebek').map((s) => ({ id: s.id, label: s.label, params: { widthCm: s.width, lengthCm: s.length } })),
    defaultSize: 'puset',
    illustration: 'blanket',
    variant: 'waves',
    lessons: ['sis-ters-ilmek', 'sis-ip-atma', 'sis-eksiltme', 'sis-haraso'],
    keywords: l('battaniye ajur dalga', 'blanket lace waves', 'manta calado', 'manta renda'),
    template: 'bebek-battaniyesi',
    base: { stitchId: 'dalga-ajur', borderId: 'haraso', borderCm: 3 },
    tip: l(
      'Desen sırasında 6 eksiltme ve 6 ip atma vardır; sıra sonunda ilmek sayısı değişmez.',
      'The pattern row has 6 decreases and 6 yarn overs, so the stitch count never changes.',
      'La vuelta de dibujo tiene 6 disminuciones y 6 lazadas: el número de puntos no cambia.',
      'A carreira de desenho tem 6 diminuições e 6 laçadas: o número de pontos não muda.',
    ),
  }),
  work({
    id: 'pirinc-boyunluk',
    craft: 'knit',
    category: 'accessories',
    difficulty: 1,
    hours: [5, 8],
    title: l('Pirinç örgü boyunluk', 'Seed stitch cowl', 'Cuello de punto arroz', 'Gola em ponto arroz'),
    blurb: l(
      'Kalın iple, misinalı şişte dikişsiz örülen sade bir boyunluk. Pirinç örgü kıvrılmaz; kenar gerekmez.',
      'A simple seamless cowl in chunky yarn on a circular needle. Seed stitch lies flat, so no border is needed.',
      'Un cuello sencillo y sin costuras en hilo grueso con aguja circular. El punto arroz no se enrolla.',
      'Uma gola simples sem costura em fio grosso na agulha circular. O ponto arroz não enrola.',
    ),
    yarnWeight: 5,
    fibers: ['yun', 'alpaka'],
    toolMm: 6,
    toolKind: 'sis-misinali',
    colorSlots: [MAIN],
    defaultColors: ['#d39a2c'],
    sizes: COWL_SIZES.filter((s) => s.id !== 'cocuk').map((s) => ({ id: s.id, label: s.label, params: { circumferenceCm: s.circumference, heightCm: s.height } })),
    defaultSize: 'standart',
    illustration: 'cowl',
    variant: 'seed',
    lessons: ['sis-ilmek-atma-basparmak', 'sis-misinali', 'sis-pirinc', 'sis-ilmek-kapatma'],
    keywords: l('boyunluk yuvarlak kalın', 'cowl infinity chunky', 'cuello redondo', 'gola circular'),
    template: 'boyunluk',
    base: { stitchId: 'pirinc', edge: 'none' },
    tip: l(
      'Yuvarlak pirinçte her tur kayar: 1. tur *1 düz, 1 ters*, 2. tur *1 ters, 1 düz*.',
      'In the round, seed stitch shifts every round: rnd 1 *k1, p1*, rnd 2 *p1, k1*.',
      'En redondo el punto arroz se desplaza cada vuelta: vuelta 1 *1 d, 1 r*, vuelta 2 *1 r, 1 d*.',
      'Em circular o ponto arroz muda a cada volta: volta 1 *1 m, 1 t*, volta 2 *1 t, 1 m*.',
    ),
  }),
  work({
    id: 'bebek-patik',
    craft: 'knit',
    category: 'baby',
    difficulty: 2,
    hours: [3, 5],
    title: l('Haraşo bebek patiği', 'Garter baby booties', 'Patucos de punto bobo', 'Sapatinhos em ponto liga'),
    blurb: l(
      'Tek parça, düz şişte örülüp dikilen yumuşak patikler. İlk artırma ve eksiltme deneyimi için küçük ve tatlı bir iş.',
      'Soft booties knitted flat in one piece, then seamed. A small, sweet project for your first increases and decreases.',
      'Patucos suaves tejidos en plano en una pieza y cosidos. Un proyecto pequeño para tus primeros aumentos y menguados.',
      'Sapatinhos macios tricotados retos em uma peça e costurados. Um projeto pequeno para os primeiros aumentos e diminuições.',
    ),
    yarnWeight: 3,
    fibers: ['merino'],
    toolMm: 3.5,
    toolKind: 'sis-duz',
    colorSlots: [MAIN, CUFF],
    defaultColors: ['#87ceeb', '#f5f0e6'],
    sizes: [
      { id: '0-6', label: l('0–6 ay', '0–6 months', '0–6 meses', '0–6 meses'), params: { footCm: 9, sideCm: 2.5, cuffCm: 3.5 } },
      { id: '6-12', label: l('6–12 ay', '6–12 months', '6–12 meses', '6–12 meses'), params: { footCm: 11, sideCm: 3, cuffCm: 4 } },
    ],
    defaultSize: '0-6',
    illustration: 'booties',
    lessons: ['sis-ilmek-atma-basparmak', 'sis-haraso', 'sis-artirma', 'sis-eksiltme', 'sis-lastik', 'sis-ilmek-kapatma'],
    keywords: l('patik bebek hediye', 'booties baby gift', 'patucos regalo', 'sapatinhos presente'),
    build: (p) => {
      const sizeLabel = WORK_SIZE_LABEL('bebek-patik', p.workSizeId, p.lang);
      return booties({ ...p, sizeLabel });
    },
  }),

  /* ── Tığ ─────────────────────────────────────────────── */
  work({
    id: 'cizgili-top',
    craft: 'crochet',
    category: 'toys',
    difficulty: 2,
    hours: [2, 3],
    title: l('Çizgili amigurumi top', 'Striped amigurumi ball', 'Pelota amigurumi a rayas', 'Bola amigurumi listrada'),
    blurb: l(
      'İki renkli şeritlerle, kaydırmalı artırmalarla yuvarlak çıkan yumuşak oyuncak top. Amigurumiye en iyi giriş.',
      'A soft toy ball with two-color stripes and staggered increases for a truly round shape. The best way into amigurumi.',
      'Una pelota blandita a rayas de dos colores, con aumentos desplazados para que quede bien redonda. La mejor entrada al amigurumi.',
      'Uma bolinha macia listrada em duas cores, com aumentos deslocados para ficar bem redonda. A melhor porta de entrada para o amigurumi.',
    ),
    yarnWeight: 3,
    fibers: ['pamuk'],
    toolMm: 3,
    toolKind: 'tig',
    colorSlots: [stripeSlot('A'), stripeSlot('B')],
    defaultColors: ['#f2c84b', '#46698a'],
    sizes: BALL_SIZES.filter((s) => s.id !== 'mini').map((s) => ({ id: s.id, label: s.label, params: { diameterCm: s.diameter } })),
    defaultSize: 'orta',
    illustration: 'ball',
    variant: 'stripes',
    lessons: ['tig-sihirli-halka', 'tig-sik-igne', 'tig-artirma', 'tig-eksiltme', 'tig-amigurumi', 'tig-renk-degistirme'],
    keywords: l('oyuncak bebek top', 'toy baby ball', 'juguete pelota', 'brinquedo bola'),
    template: 'amigurumi-top',
    base: { staggered: true, stripeRows: 2 },
  }),
  work({
    id: 'buyukanne-karesi',
    craft: 'crochet',
    category: 'home',
    difficulty: 2,
    hours: [1, 2],
    title: l('Büyükanne karesi', 'Classic granny square', 'Cuadro de la abuela clásico', 'Quadradinho da vovó clássico'),
    blurb: l(
      'Üçlü küme, köşede iki zincir: her turu ayrı renkle örülen klasik kare. Tek başına bardak altı, çoğalınca battaniye.',
      'Clusters of three and two-chain corners: the classic square with each round in a new color. One is a coaster, many are a blanket.',
      'Grupos de tres y esquinas de dos cadenetas: el cuadro clásico con cada vuelta en un color. Uno es un posavasos; muchos, una manta.',
      'Grupos de três e cantos de duas correntinhas: o quadrado clássico com cada volta numa cor. Um é porta-copos; muitos, uma manta.',
    ),
    yarnWeight: 4,
    fibers: ['akrilik'],
    toolMm: 5,
    toolKind: 'tig',
    colorSlots: [roundSlot(1), roundSlot(2), roundSlot(3), roundSlot(4)],
    defaultColors: ['#f4a7b9', '#d39a2c', '#5f7a61', '#f5f0e6'],
    sizes: [3, 4, 6].map((n) => ({ id: `${n}`, label: l(`${n} tur`, `${n} rounds`, `${n} vueltas`, `${n} voltas`), params: { rounds: n } })),
    defaultSize: '4',
    illustration: 'granny',
    lessons: ['tig-zincir', 'tig-trabzan', 'tig-sihirli-halka', 'tig-buyukanne-karesi', 'tig-renk-degistirme'],
    keywords: l('motif kare renkli', 'motif square colorful', 'motivo colorido', 'motivo colorido'),
    template: 'buyukanne-karesi',
  }),
  work({
    id: 'buyukanne-battaniye',
    craft: 'crochet',
    category: 'home',
    difficulty: 2,
    hours: [30, 60],
    title: l('Büyükanne karesi battaniye', 'Granny square blanket', 'Manta de cuadros de la abuela', 'Manta de quadradinhos da vovó'),
    blurb: l(
      'Beş turlu karelerden, dışı krem tur ve {sc} kenarlı bir battaniye. Kareleri istediğin yerde, istediğin zaman ör.',
      'A blanket of five-round squares with a cream outer round and a {sc} border. Make the squares anywhere, a few at a time.',
      'Una manta de cuadros de cinco vueltas con la vuelta exterior crema y borde de {sc}. Teje los cuadros donde y cuando quieras.',
      'Uma manta de quadrados de cinco voltas, com a volta externa creme e borda de {sc}. Faça os quadrados onde e quando quiser.',
    ),
    yarnWeight: 4,
    fibers: ['akrilik'],
    toolMm: 5,
    toolKind: 'tig',
    colorSlots: [roundSlot(1), roundSlot(2), roundSlot(3), roundSlot(4), l('5. tur ve kenar', 'Round 5 and border', 'Vuelta 5 y borde', 'Volta 5 e borda')],
    defaultColors: ['#d39a2c', '#b5523b', '#5f7a61', '#46698a', '#f5f0e6'],
    sizes: [
      { id: 'bebek', label: BLANKET_SIZES.find((s) => s.id === 'bebek')!.label, params: { blanketCols: 5, blanketRows: 6 } },
      { id: 'kucak', label: BLANKET_SIZES.find((s) => s.id === 'kucak')!.label, params: { blanketCols: 7, blanketRows: 9 } },
      { id: 'tekli', label: BLANKET_SIZES.find((s) => s.id === 'tekli')!.label, params: { blanketCols: 10, blanketRows: 14 } },
    ],
    defaultSize: 'kucak',
    illustration: 'blanket',
    variant: 'granny',
    lessons: ['tig-trabzan', 'tig-buyukanne-karesi', 'tig-renk-degistirme', 'tig-birlestirme', 'tig-sik-igne'],
    keywords: l('battaniye örtü motif', 'afghan throw motif', 'manta motivo', 'manta motivo'),
    template: 'buyukanne-karesi',
    base: { rounds: 5, join: 'slst', borderRounds: 3 },
    tip: l(
      'Her kareyi bitirince ucunu hemen gizle; en sona bırakılan uçlar en uzun işi çıkarır.',
      'Weave in the ends as you finish each square; ends left for last become the longest job.',
      'Esconde las hebras al terminar cada cuadro; dejarlas para el final es el trabajo más largo.',
      'Esconda as pontas ao terminar cada quadrado; deixá-las para o fim vira o trabalho mais longo.',
    ),
  }),
  work({
    id: 'bardak-altligi-seti',
    craft: 'crochet',
    category: 'home',
    difficulty: 1,
    hours: [2, 3],
    title: l('Renkli bardak altlığı seti', 'Striped coaster set', 'Juego de posavasos a rayas', 'Jogo de porta-copos listrados'),
    blurb: l(
      'Dört dümdüz daire, her tur bir renk. {Hdc} turlarla hızlı biter; artan pamuk iplerine en güzel yer.',
      'Four flat circles, one color per round. Quick rounds of {hdc}; the best home for leftover cotton.',
      'Cuatro círculos planos, un color por vuelta. Vueltas rápidas de {hdc}; el mejor destino para restos de algodón.',
      'Quatro círculos planos, uma cor por volta. Voltas rápidas de {hdc}; o melhor destino para sobras de algodão.',
    ),
    yarnWeight: 4,
    fibers: ['pamuk'],
    toolMm: 4.5,
    toolKind: 'tig',
    colorSlots: [roundSlot(1), roundSlot(2), roundSlot(3)],
    defaultColors: ['#2a9d8f', '#f5f0e6', '#e97c6a'],
    sizes: CIRCLE_SIZES.filter((s) => s.id === 'bardak' || s.id === 'kupa').map((s) => ({ id: s.id, label: s.label, params: { diameterCm: s.diameter } })),
    defaultSize: 'bardak',
    illustration: 'coasters',
    lessons: ['tig-sihirli-halka', 'tig-yarim-trabzan', 'tig-artirma', 'tig-kor-ilmek', 'tig-renk-degistirme'],
    keywords: l('mutfak masa hediye', 'kitchen table gift', 'mesa regalo', 'mesa presente'),
    template: 'bardak-altligi',
    base: { crochetStitch: 'hdc', count: 4, colorMode: 'rounds', edge: 'none' },
  }),
  work({
    id: 'tig-bere',
    craft: 'crochet',
    category: 'accessories',
    difficulty: 2,
    hours: [3, 5],
    title: l('Yarım trabzan bere', 'Half double crochet beanie', 'Gorro de punto medio alto', 'Gorro de meio ponto alto'),
    blurb: l(
      'Tepeden başlanan, dikişsiz, {hdc} bere; ağzı arka halkadan {sc} ile lastik gibi. Ponponu sen seç.',
      'A seamless top-down beanie in {hdc} with a back-loop {sc} brim that looks like ribbing. Pompom optional.',
      'Gorro sin costuras desde la coronilla en {hdc}, con borde de {sc} por la hebra trasera que parece elástico.',
      'Gorro sem costura de cima para baixo em {hdc}, com barra de {sc} na alça de trás que parece ribana.',
    ),
    yarnWeight: 4,
    fibers: ['akrilik', 'yun'],
    toolMm: 5,
    toolKind: 'tig',
    colorSlots: [MAIN, BRIM],
    defaultColors: ['#7d4e6d', '#b39ddb'],
    sizes: HAT_SIZES,
    defaultSize: 'kadin',
    illustration: 'beanie',
    variant: 'crochet',
    lessons: ['tig-sihirli-halka', 'tig-yarim-trabzan', 'tig-artirma', 'tig-halkalar', 'tig-daire'],
    keywords: l('bere şapka tığ', 'hat toque crochet', 'gorro ganchillo', 'touca crochê'),
    template: 'bere-tig',
    base: { brim: 'sc', brimCm: 4, pompom: true },
  }),
  work({
    id: 'kum-atki',
    craft: 'crochet',
    category: 'accessories',
    difficulty: 1,
    hours: [8, 12],
    title: l('Şeritli kum taneleri atkı', 'Striped moss stitch scarf', 'Bufanda a rayas en punto musgo', 'Cachecol listrado em ponto musgo'),
    blurb: l(
      '{Sc} ve zincirin dönüşümüyle dokuma gibi görünen düz bir kumaş, iki sırada bir renk. Kenardan taşınan ipler sayesinde az uç.',
      'Alternating {sc} and chains makes a flat, woven-looking fabric; the color changes every two rows and travels up the edge, so few ends.',
      '{Sc} y cadenetas alternados dan un tejido plano que parece tela; el color cambia cada dos vueltas y sube por el borde.',
      '{Sc} e correntinhas alternados formam um tecido plano que parece tecelagem; a cor muda a cada duas carreiras e sobe pela borda.',
    ),
    yarnWeight: 4,
    fibers: ['merino'],
    toolMm: 5,
    toolKind: 'tig',
    colorSlots: [stripeSlot('A'), stripeSlot('B'), stripeSlot('C')],
    defaultColors: ['#1b2a4a', '#87ceeb', '#f5f0e6'],
    sizes: [scarfSize('cocuk', { widthCm: 14 }), scarfSize('standart', { widthCm: 18 })],
    defaultSize: 'standart',
    illustration: 'scarf',
    variant: 'stripes',
    lessons: ['tig-zincir', 'tig-sik-igne', 'tig-donus', 'tig-renk-degistirme'],
    keywords: l('şerit renkli atkı', 'stripes linen stitch', 'rayas', 'listras'),
    template: 'atki-tig',
    base: { stitchId: 'tig-kum', stripeRows: 2 },
  }),
  work({
    id: 'file-canta',
    craft: 'crochet',
    category: 'home',
    difficulty: 2,
    hours: [4, 6],
    title: l('File pazar çantası', 'Mesh market bag', 'Bolsa de red para el mercado', 'Bolsa de feira em rede'),
    blurb: l(
      'Sağlam yuvarlak taban, zincir halkalarından file gövde ve iki sap. Katlayınca cebe sığar, doldukça genişler.',
      'A sturdy round base, a body of chain loops and two handles. It folds into a pocket and grows as you fill it.',
      'Base redonda firme, cuerpo de arcos de cadenetas y dos asas. Cabe en un bolsillo y crece al llenarla.',
      'Base redonda firme, corpo de arcos de correntinhas e duas alças. Cabe no bolso e cresce quando cheia.',
    ),
    yarnWeight: 4,
    fibers: ['pamuk'],
    toolMm: 5,
    toolKind: 'tig',
    colorSlots: [MAIN, BAND],
    defaultColors: ['#e8dcc4', '#5f7a61'],
    sizes: [
      { id: 'orta', label: l('Orta', 'Medium', 'Mediana', 'Média'), params: { baseCm: 18, bodyCm: 30, handleCm: 30 } },
      { id: 'buyuk', label: l('Büyük', 'Large', 'Grande', 'Grande'), params: { baseCm: 22, bodyCm: 36, handleCm: 36 } },
    ],
    defaultSize: 'orta',
    illustration: 'bag',
    lessons: ['tig-sihirli-halka', 'tig-trabzan', 'tig-artirma', 'tig-zincir', 'tig-sik-igne'],
    keywords: l('çanta pazar file pamuk', 'bag tote string cotton', 'bolso compra', 'sacola compras'),
    build: (p) => marketBag(p),
  }),
  work({
    id: 'kulaklik-bant',
    craft: 'crochet',
    category: 'accessories',
    difficulty: 1,
    hours: [2, 3],
    title: l('Büzgülü kulaklık bant', 'Cinched ear warmer', 'Diadema fruncida', 'Faixa aquece-orelhas franzida'),
    blurb: l(
      'Arka halkadan {hdc} ile lastik görünümlü, kalın ve sıcak bir bant; önü küçük bir şeritle büzülür. Bir akşamda biter.',
      'A thick, warm band with a ribbed look from back-loop {hdc}, cinched at the front with a small strip. Done in an evening.',
      'Una banda gruesa y cálida con aspecto de canalé gracias al {hdc} por la hebra trasera, fruncida delante. Se termina en una tarde.',
      'Uma faixa grossa e quentinha com aspecto canelado graças ao {hdc} na alça de trás, franzida na frente. Fica pronta numa noite.',
    ),
    yarnWeight: 5,
    fibers: ['akrilik', 'yun'],
    toolMm: 6.5,
    toolKind: 'tig',
    colorSlots: [MAIN],
    defaultColors: ['#8e1b2a'],
    sizes: [
      { id: 'cocuk', label: HEAD_SIZES.find((s) => s.id === 'cocuk-3-10')!.label, params: { circumferenceCm: 51, widthCm: 8 } },
      { id: 'yetiskin', label: HEAD_SIZES.find((s) => s.id === 'kadin')!.label, params: { circumferenceCm: 56, widthCm: 10 } },
      { id: 'buyuk', label: HEAD_SIZES.find((s) => s.id === 'erkek')!.label, params: { circumferenceCm: 58.5, widthCm: 11 } },
    ],
    defaultSize: 'yetiskin',
    illustration: 'headband',
    lessons: ['tig-zincir', 'tig-yarim-trabzan', 'tig-halkalar', 'tig-donus', 'tig-birlestirme'],
    keywords: l('bant saç kulak', 'headband ear', 'cinta orejas', 'tiara orelhas'),
    build: (p) => headband(p),
  }),
];

export const WORK_BY_ID: Record<string, WorkDef> = Object.fromEntries(WORKS.map((w) => [w.id, w]));

function WORK_SIZE_LABEL(workId: string, sizeId: string | undefined, lang: PatternParams['lang']): string {
  const w = WORK_BY_ID[workId];
  const s = w?.sizes.find((x) => x.id === sizeId) ?? w?.sizes[0];
  return s ? s.label[lang] : '';
}

/** Eserin varsayılan ipi: kalınlığa göre 100 g'lık yumak */
export function defaultYarn(w: WorkDef, colors: string[]): YarnSpec {
  const info = YARN_WEIGHTS[w.yarnWeight];
  const m = Math.round((info.metersPer100g[0] + info.metersPer100g[1]) / 2 / 5) * 5;
  return { weight: w.yarnWeight, fibers: w.fibers, metersPerSkein: m, gramsPerSkein: 100, colors: colors.map((hex) => ({ hex })) };
}

export interface WorkOptions {
  sizeId?: string;
  colors?: string[];
  /** varsayılan yerine kullanıcının ipi */
  yarn?: YarnSpec;
  toolMm?: number;
  toolKind?: ToolKind;
  gauge?: Gauge;
}

/** Eserin seçilen beden ve renklerle, geçerli dilde tam tarifi */
export function generateWork(workId: string, opts: WorkOptions, ctx: TermsCtx, units: Units): GeneratedPattern {
  const w = WORK_BY_ID[workId];
  if (!w) throw new Error(`Bilinmeyen eser: ${workId}`);
  const size = w.sizes.find((s) => s.id === opts.sizeId) ?? w.sizes.find((s) => s.id === w.defaultSize) ?? w.sizes[0];
  const colors = (opts.colors?.length ? opts.colors : w.defaultColors).slice(0, Math.max(1, w.colorSlots.length));
  while (colors.length < w.colorSlots.length) colors.push(w.defaultColors[colors.length] ?? colors[0]);
  const yarn: YarnSpec = opts.yarn ? { ...opts.yarn, colors: colors.map((hex, i) => ({ ...(opts.yarn!.colors[i] ?? {}), hex })) } : defaultYarn(w, colors);
  const params: PatternParams = {
    lang: ctx.lang,
    ctx,
    units,
    toolMm: opts.toolMm ?? w.toolMm,
    toolKind: opts.toolKind ?? w.toolKind,
    yarn,
    gauge: opts.gauge,
    workId: w.id,
    workSizeId: size.id,
    ...size.params,
  };
  return w.build(params);
}

/** Eser kartları için süre metni */
export function hoursText(h: [number, number], lang: PatternParams['lang']): string {
  const [a, b] = h;
  const U = { tr: 'saat', en: 'h', es: 'h', pt: 'h' }[lang];
  return a === b ? `${a} ${U}` : `${a}–${b} ${U}`;
}
