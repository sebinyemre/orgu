/**
 * Hazır başlangıç grafikleri (özgün, kod içinde veri). Adlar dört dilde.
 * Renkli şablonlarda 0 numaralı renk zemindir; sembol şablonlarında renkler -1'dir (beyaz kağıt).
 */
import type { ChartRect, Craft } from '@/types';
import type { L10n } from '@/i18n';
import { textBitmap } from './font';

export interface TemplateData {
  width: number;
  height: number;
  colors: number[];
  symbols: string[];
  palette: string[];
  repeat?: ChartRect;
  /** {dc} gibi tığ yer tutucuları içerebilir; oluştururken fillTerms ile doldurulur */
  notes?: L10n;
}

export interface ChartTemplate {
  id: string;
  craft: Craft;
  mode: 'flat' | 'round';
  name: L10n;
  desc: L10n;
  build: () => TemplateData;
}

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

type Key = Record<string, { c?: number; s?: string }>;

/** Satır sanatından (üstten alta) ızgara üretir */
export function fromArt(rows: string[], key: Key, fallback: { c: number; s: string } = { c: 0, s: '' }): Pick<TemplateData, 'width' | 'height' | 'colors' | 'symbols'> {
  const height = rows.length;
  const width = Math.max(...rows.map((r) => r.length));
  const colors: number[] = [];
  const symbols: string[] = [];
  for (const r of rows)
    for (let x = 0; x < width; x++) {
      const k = key[r[x]] ?? {};
      colors.push(k.c ?? fallback.c);
      symbols.push(k.s ?? fallback.s);
    }
  return { width, height, colors, symbols };
}

const HEART = [
  '.............',
  '...##...##...',
  '..####.####..',
  '.###########.',
  '.###########.',
  '.###########.',
  '..#########..',
  '...#######...',
  '....#####....',
  '.....###.....',
  '......#......',
  '.............',
];

const SNOWFLAKE = ['...#...', '.#.#.#.', '..###..', '###.###', '..###..', '.#.#.#.', '...#...'];

const ECRU = '#f5f0e6';

const STAR = [
  '.................',
  '........#........',
  '........#........',
  '...##..###..##...',
  '...###.###.###...',
  '....#########....',
  '.....#######.....',
  '...#####.#####...',
  '.######.#.######.',
  '...#####.#####...',
  '.....#######.....',
  '....#########....',
  '...###.###.###...',
  '...##..###..##...',
  '........#........',
  '........#........',
  '.................',
];

function star(): TemplateData {
  return { ...fromArt(STAR, { '.': { c: 0 }, '#': { c: 1 } }), palette: [ECRU, '#1b2a4a'] };
}

function snowflakeBand(): TemplateData {
  const w = 25,
    h = 11;
  const colors = new Array(w * h).fill(0);
  for (let x = 0; x < w; x++) {
    colors[x] = x % 2 === 0 ? 1 : 0;
    colors[(h - 1) * w + x] = x % 2 === 0 ? 1 : 0;
  }
  for (const ox of [1, 9, 17])
    SNOWFLAKE.forEach((r, ry) => {
      for (let rx = 0; rx < r.length; rx++) if (r[rx] === '#') colors[(2 + ry) * w + ox + rx] = 1;
    });
  return { width: w, height: h, colors, symbols: new Array(w * h).fill(''), palette: ['#1b2a4a', ECRU], repeat: { x: 1, y: 0, w: 8, h } };
}

function zigzag(): TemplateData {
  const w = 24,
    h = 10;
  const colors = new Array(w * h).fill(0);
  for (let x = 0; x < w; x++) {
    colors[x] = x % 2 === 0 ? 1 : 0;
    colors[(h - 1) * w + x] = x % 2 === 0 ? 1 : 0;
    const z = Math.abs((x % 8) - 4);
    for (const dy of [0, 1]) colors[(2 + z + dy) * w + x] = 2;
  }
  return { width: w, height: h, colors, symbols: new Array(w * h).fill(''), palette: [ECRU, '#b5523b', '#d39a2c'], repeat: { x: 0, y: 0, w: 8, h } };
}

function cablePanel(): TemplateData {
  const plain = 'ppkkkkppkkkkpp';
  const cross = 'ppR>>>ppL>>>pp';
  const rows = [plain, cross, plain, plain, plain, cross, plain, plain];
  const g = fromArt(rows, { p: { s: 'p' }, k: { s: 'k' }, R: { s: 'c4r' }, L: { s: 'c4l' }, '>': { s: '>' } }, { c: -1, s: '' });
  return { ...g, colors: g.colors.map(() => -1), palette: [ECRU], repeat: { x: 0, y: 4, w: 14, h: 4 } };
}

function laceLeaf(): TemplateData {
  const P = 'kkkkkkkkkkk';
  // alttan üste: 1., 3., 5. … sıralar ön yüz
  const bottomUp = [
    'kkkkYCYkkkk',
    P,
    'kkkYkCkYkkk',
    P,
    'kkYkkCkkYkk',
    P,
    'kYkkkCkkkYk',
    P,
    'kkTYkkkYSkk',
    P,
    'kkkTYkYSkkk',
    P,
  ];
  const g = fromArt([...bottomUp].reverse(), { k: { s: 'k' }, Y: { s: 'yo' }, C: { s: 'cdd' }, T: { s: 'k2tog' }, S: { s: 'ssk' } }, { c: -1, s: '' });
  return { ...g, colors: g.colors.map(() => -1), palette: [ECRU] };
}

function c2cHeart(): TemplateData {
  return { ...fromArt(HEART, { '.': { c: 0 }, '#': { c: 1 } }), palette: ['#f8d3dc', '#c0392b'] };
}

function filetHeart(): TemplateData {
  const w = 17,
    h = 16;
  const colors = new Array(w * h).fill(0);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) if (x === 0 || y === 0 || x === w - 1 || y === h - 1) colors[y * w + x] = 1;
  HEART.forEach((r, ry) => {
    for (let rx = 0; rx < r.length; rx++) if (r[rx] === '#') colors[(2 + ry) * w + 2 + rx] = 1;
  });
  return {
    width: w,
    height: h,
    colors,
    symbols: new Array(w * h).fill(''),
    palette: [ECRU, '#2f2925'],
    notes: l(
      'Fileli iş: koyu kare dolu kare, açık kare boş karedir. Dolu kare: 3 {dc}. Boş kare: 2 zincir, 2 ilmek atla, 1 {dc}. Her sıraya 3 zincirle dönerek başla.',
      'Filet crochet: dark squares are filled, light squares are open. Filled square: 3 {dc}. Open square: ch 2, skip 2, 1 {dc}. Turn with ch 3 at the start of each row.',
      'Crochet filet: los cuadros oscuros son llenos y los claros, vacíos. Cuadro lleno: 3 {dc}. Cuadro vacío: 2 cadenetas, saltar 2, 1 {dc}. Empieza cada vuelta con 3 cadenetas.',
      'Crochê filé: quadrados escuros são cheios e claros são vazados. Quadrado cheio: 3 {dc}. Quadrado vazado: 2 correntinhas, pular 2, 1 {dc}. Comece cada carreira com 3 correntinhas.',
    ),
  };
}

function alphabet(): TemplateData {
  const bmp = textBitmap('ABC\n123', 'tr');
  const m = 2;
  const w = bmp.width + m * 2,
    h = bmp.height + m * 2;
  const colors = new Array(w * h).fill(0);
  for (let y = 0; y < bmp.height; y++) for (let x = 0; x < bmp.width; x++) if (bmp.cells[y * bmp.width + x]) colors[(y + m) * w + x + m] = 1;
  return { width: w, height: h, colors, symbols: new Array(w * h).fill(''), palette: [ECRU, '#46698a', '#b5523b'] };
}

export const CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: 'kalp',
    craft: 'knit',
    mode: 'flat',
    name: l('Kalp motifi', 'Heart motif', 'Motivo de corazón', 'Motivo de coração'),
    desc: l('İki renkli küçük kalp', 'Small two-color heart', 'Corazón pequeño a dos colores', 'Coração pequeno em duas cores'),
    build: () => ({ ...fromArt(HEART, { '.': { c: 0 }, '#': { c: 1 } }), palette: [ECRU, '#c0392b'] }),
  },
  {
    id: 'yildiz',
    craft: 'knit',
    mode: 'flat',
    name: l('Sekiz köşeli yıldız', 'Eight-point star', 'Estrella de ocho puntas', 'Estrela de oito pontas'),
    desc: l('Kuzey örgülerinin yıldızı', 'The classic Nordic star', 'La estrella nórdica clásica', 'A estrela nórdica clássica'),
    build: star,
  },
  {
    id: 'kar-bordur',
    craft: 'knit',
    mode: 'round',
    name: l('Kar tanesi bordürü', 'Snowflake band', 'Cenefa de copos de nieve', 'Barrado de flocos de neve'),
    desc: l('Bere ve kazak etekleri için', 'For hat brims and sweater hems', 'Para gorros y bajos de jersey', 'Para gorros e barras de suéter'),
    build: snowflakeBand,
  },
  {
    id: 'zikzak',
    craft: 'knit',
    mode: 'round',
    name: l('Fair Isle zikzak bordür', 'Fair Isle zigzag band', 'Cenefa de zigzag Fair Isle', 'Barrado zigue-zague Fair Isle'),
    desc: l('Her sırada en çok iki renk', 'At most two colors per row', 'Como mucho dos colores por vuelta', 'No máximo duas cores por carreira'),
    build: zigzag,
  },
  {
    id: 'burgu-panel',
    craft: 'knit',
    mode: 'flat',
    name: l('Küçük burgu paneli', 'Little cable panel', 'Panel de ochos pequeño', 'Painel de tranças pequeno'),
    desc: l('İki 2/2 burgu, ters zemin', 'Two 2/2 cables on purl ground', 'Dos ochos 2/2 sobre fondo revés', 'Duas tranças 2/2 sobre fundo tricô'),
    build: cablePanel,
  },
  {
    id: 'ajur-yaprak',
    craft: 'knit',
    mode: 'flat',
    name: l('Ajurlu yaprak', 'Lace leaf', 'Hoja calada', 'Folha rendada'),
    desc: l('İp atma ve eksiltmelerle', 'Yarn overs and decreases', 'Lazadas y disminuciones', 'Laçadas e diminuições'),
    build: laceLeaf,
  },
  {
    id: 'c2c-kalp',
    craft: 'crochet',
    mode: 'flat',
    name: l('C2C kalp', 'C2C heart', 'Corazón C2C', 'Coração C2C'),
    desc: l('Köşeden köşeye karolarla', 'Worked corner to corner in tiles', 'Tejido de esquina a esquina', 'Feito de canto a canto'),
    build: c2cHeart,
  },
  {
    id: 'fileli-kalp',
    craft: 'crochet',
    mode: 'flat',
    name: l('Fileli kalp', 'Filet heart', 'Corazón en crochet filet', 'Coração em crochê filé'),
    desc: l('Dolu ve boş karelerle', 'Filled and open squares', 'Cuadros llenos y vacíos', 'Quadrados cheios e vazados'),
    build: filetHeart,
  },
  {
    id: 'harfler',
    craft: 'knit',
    mode: 'flat',
    name: l('Harf örnekliği', 'Alphabet sampler', 'Muestrario de letras', 'Mostruário de letras'),
    desc: l('Yazı damgasıyla devam et', 'Continue with the text stamp', 'Continúa con el sello de texto', 'Continue com o carimbo de texto'),
    build: alphabet,
  },
];

export const TEMPLATE_BY_ID: Record<string, ChartTemplate> = Object.fromEntries(CHART_TEMPLATES.map((t) => [t.id, t]));
