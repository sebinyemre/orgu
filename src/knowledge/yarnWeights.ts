/**
 * Craft Yarn Council (CYC) standart ip kalınlıkları — 0'dan 7'ye.
 * Değerler etiket ortalamalarıdır; kesin sonuç için her zaman ölçü örneği örülür.
 */
import type { Gauge, YarnWeightId } from '@/types';
import type { L10n } from '@/i18n';

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

export interface YarnWeightInfo {
  id: YarnWeightId;
  /** kısa ad */
  name: L10n;
  /** İngilizce kategori adı */
  en: string;
  /** uluslararası ticari adlar (etiketlerde ve tariflerde) */
  aliases: string[];
  /** Türkiye’de rafta kullanılan adlar */
  aliasesTr: string[];
  /** rafta nasıl tarif edilir */
  shelf: L10n;
  /** 2,5 cm'ye (1 inç) sarım sayısı aralığı */
  wpi: [number, number];
  /** önerilen şiş (mm) */
  needleMm: [number, number];
  /** önerilen tığ (mm) */
  hookMm: [number, number];
  /** 10 cm'de jarse ilmek sayısı (şiş) */
  knitSts: [number, number];
  /** 10 cm'de sık iğne sayısı (tığ) */
  crochetSts: [number, number];
  /** 100 gramda tipik metre aralığı */
  metersPer100g: [number, number];
  /** tipik projeler */
  uses: L10n[];
  /** 1 ilmeğin yaklaşık ip tüketimi (cm) — jarse / sık iğne */
  cmPerKnitSt: number;
  cmPerCrochetSc: number;
}

export const YARN_WEIGHTS: YarnWeightInfo[] = [
  {
    id: 0,
    name: l('Dantel', 'Lace', 'Encaje', 'Renda'),
    en: 'Lace',
    aliases: ['lace', 'cobweb', 'light fingering'],
    aliasesTr: ['dantel ipi', 'ince merserize'],
    shelf: l('Çok ince: oya, dantel ve tığ dantelleri (ör. 10–20 numara koton).', 'Very fine: lace shawls, doilies and thread crochet.', 'Muy fino: chales de encaje, tapetes y ganchillo con hilo.', 'Muito fino: xales rendados, toalhinhas e crochê com linha.'),
    wpi: [30, 40],
    needleMm: [1.5, 2.25],
    hookMm: [1.25, 2.25],
    knitSts: [33, 40],
    crochetSts: [32, 42],
    metersPer100g: [600, 1200],
    uses: [l('Şal ve ajur', 'Lace shawls', 'Chales calados', 'Xales rendados'), l('Tığ dantel örtü', 'Doilies', 'Tapetes de ganchillo', 'Toalhinhas de crochê'), l('Oya', 'Edgings', 'Puntillas', 'Bicos')],
    cmPerKnitSt: 1.6,
    cmPerCrochetSc: 2.6,
  },
  {
    id: 1,
    name: l('Süper ince', 'Super fine', 'Súper fino', 'Superfino'),
    en: 'Super Fine',
    aliases: ['fingering', 'sock'],
    aliasesTr: ['çorap ipi', 'bebe ince', '4 kat'],
    shelf: l('Çorap ve ince bebek yünleri; 2–3 numara şişle örülür.', 'Sock and fingering yarns; knit on 2–3 mm needles.', 'Hilos para calcetines y bebé finos; agujas de 2–3 mm.', 'Fios para meias e bebê finos; agulhas de 2–3 mm.'),
    wpi: [14, 30],
    needleMm: [2.25, 3.25],
    hookMm: [2.25, 3.5],
    knitSts: [27, 32],
    crochetSts: [21, 32],
    metersPer100g: [350, 460],
    uses: [l('Çorap', 'Socks', 'Calcetines', 'Meias'), l('Bebek giysisi', 'Baby clothes', 'Ropa de bebé', 'Roupa de bebê'), l('İnce kazak', 'Fine sweaters', 'Jerséis finos', 'Suéteres finos'), l('Renkli örgü', 'Colorwork', 'Jacquard', 'Jacquard')],
    cmPerKnitSt: 2.0,
    cmPerCrochetSc: 3.3,
  },
  {
    id: 2,
    name: l('İnce', 'Fine', 'Fino', 'Fino'),
    en: 'Fine',
    aliases: ['sport', 'baby'],
    aliasesTr: ['bebe yünü', '5 kat'],
    shelf: l('Bebek yünleri ve ince pamuklar; 3–3,5 numara şiş, 3–4 numara tığ.', 'Sport and baby yarns; 3–3.75 mm needles, 3.5–4.5 mm hooks.', 'Hilos de bebé y algodones finos; agujas de 3–3,75 mm.', 'Fios de bebê e algodões finos; agulhas de 3–3,75 mm.'),
    wpi: [12, 18],
    needleMm: [3.25, 3.75],
    hookMm: [3.5, 4.5],
    knitSts: [23, 26],
    crochetSts: [16, 20],
    metersPer100g: [280, 350],
    uses: [l('Bebek battaniyesi', 'Baby blankets', 'Mantas de bebé', 'Mantas de bebê'), l('İnce amigurumi', 'Small amigurumi', 'Amigurumi pequeño', 'Amigurumi pequeno'), l('Hırka', 'Cardigans', 'Chaquetas', 'Casaquinhos'), l('Yazlık bluz', 'Summer tops', 'Blusas de verano', 'Blusas de verão')],
    cmPerKnitSt: 2.4,
    cmPerCrochetSc: 4.0,
  },
  {
    id: 3,
    name: l('Hafif', 'Light', 'Ligero', 'Leve'),
    en: 'Light',
    aliases: ['DK', 'light worsted'],
    aliasesTr: ['ince yün', '8 kat', 'amigurumi pamuğu'],
    shelf: l('Günlük örgü ipleri ve amigurumi pamukları; 3,5–4,5 numara şiş.', 'DK and light worsted; 3.75–4.5 mm needles.', 'Grosor DK; agujas de 3,75–4,5 mm.', 'Fios DK; agulhas de 3,75–4,5 mm.'),
    wpi: [11, 15],
    needleMm: [3.75, 4.5],
    hookMm: [3.5, 5.5],
    knitSts: [21, 24],
    crochetSts: [12, 17],
    metersPer100g: [200, 280],
    uses: [l('Kazak', 'Sweaters', 'Jerséis', 'Suéteres'), l('Amigurumi', 'Amigurumi', 'Amigurumi', 'Amigurumi'), l('Şal', 'Shawls', 'Chales', 'Xales'), l('Bebek giysisi', 'Baby clothes', 'Ropa de bebé', 'Roupa de bebê')],
    cmPerKnitSt: 2.8,
    cmPerCrochetSc: 4.6,
  },
  {
    id: 4,
    name: l('Orta', 'Medium', 'Medio', 'Médio'),
    en: 'Medium',
    aliases: ['worsted', 'aran', 'afghan'],
    aliasesTr: ['orta kalınlık', '10 kat'],
    shelf: l('Rafların en yaygın kalınlığı; 4,5–5,5 numara şiş, 5–6 numara tığ.', 'Worsted and aran, the most common weight; 4.5–5.5 mm needles.', 'El grosor más común (worsted, aran); agujas de 4,5–5,5 mm.', 'A espessura mais comum (worsted, aran); agulhas de 4,5–5,5 mm.'),
    wpi: [9, 12],
    needleMm: [4.5, 5.5],
    hookMm: [5.0, 6.5],
    knitSts: [16, 20],
    crochetSts: [11, 14],
    metersPer100g: [150, 200],
    uses: [l('Atkı', 'Scarves', 'Bufandas', 'Cachecóis'), l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Kazak', 'Sweaters', 'Jerséis', 'Suéteres'), l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Çanta', 'Bags', 'Bolsos', 'Bolsas')],
    cmPerKnitSt: 3.4,
    cmPerCrochetSc: 5.5,
  },
  {
    id: 5,
    name: l('Kalın', 'Bulky', 'Grueso', 'Grosso'),
    en: 'Bulky',
    aliases: ['chunky', 'craft', 'rug'],
    aliasesTr: ['kalın yün', '12 kat'],
    shelf: l('Kışlık kalın yünler; 6–8 numara şiş, 6,5–9 numara tığ.', 'Chunky winter yarns; 5.5–8 mm needles.', 'Hilos gruesos de invierno; agujas de 5,5–8 mm.', 'Fios grossos de inverno; agulhas de 5,5–8 mm.'),
    wpi: [6, 9],
    needleMm: [5.5, 8],
    hookMm: [6.5, 9],
    knitSts: [12, 15],
    crochetSts: [8, 11],
    metersPer100g: [80, 150],
    uses: [l('Kalın atkı', 'Chunky scarves', 'Bufandas gruesas', 'Cachecóis grossos'), l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Hızlı battaniye', 'Quick blankets', 'Mantas rápidas', 'Mantas rápidas'), l('Kalın hırka', 'Chunky cardigans', 'Chaquetas gruesas', 'Casacos grossos')],
    cmPerKnitSt: 4.4,
    cmPerCrochetSc: 7.2,
  },
  {
    id: 6,
    name: l('Çok kalın', 'Super bulky', 'Muy grueso', 'Muito grosso'),
    en: 'Super Bulky',
    aliases: ['super chunky', 'roving'],
    aliasesTr: ['çok kalın yün', 'kadife ip (kalın)'],
    shelf: l('Çok kalın ipler ve kalın kadife ipler; 9–12 numara şiş.', 'Super chunky and thick chenille yarns; 8–12.75 mm needles.', 'Hilos muy gruesos y chenilla gruesa; agujas de 8–12 mm.', 'Fios muito grossos e chenille grossa; agulhas de 8–12 mm.'),
    wpi: [5, 6],
    needleMm: [8, 12.75],
    hookMm: [9, 15],
    knitSts: [7, 11],
    crochetSts: [6, 9],
    metersPer100g: [40, 80],
    uses: [l('Hızlı atkı', 'Quick scarves', 'Bufandas rápidas', 'Cachecóis rápidos'), l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Puf ve minder', 'Poufs and cushions', 'Pufs y cojines', 'Pufes e almofadas')],
    cmPerKnitSt: 6.0,
    cmPerCrochetSc: 9.5,
  },
  {
    id: 7,
    name: l('Jumbo', 'Jumbo', 'Jumbo', 'Jumbo'),
    en: 'Jumbo',
    aliases: ['jumbo', 'chenille jumbo'],
    aliasesTr: ['kol örgüsü', 'dev ip'],
    shelf: l('Kol örgüsü ve 15 mm üzeri şişler için dev ipler.', 'Giant yarns for arm knitting and needles over 12.75 mm.', 'Hilos gigantes para tejer con los brazos y agujas de más de 12 mm.', 'Fios gigantes para tricô com os braços e agulhas acima de 12 mm.'),
    wpi: [1, 4],
    needleMm: [12.75, 25],
    hookMm: [15, 25],
    knitSts: [3, 6],
    crochetSts: [3, 5],
    metersPer100g: [10, 40],
    uses: [l('Kol örgüsü battaniye', 'Arm-knit blankets', 'Mantas tejidas con los brazos', 'Mantas de tricô de braço'), l('Dev minder', 'Giant cushions', 'Cojines gigantes', 'Almofadas gigantes'), l('Sepet', 'Baskets', 'Cestas', 'Cestos')],
    cmPerKnitSt: 9.0,
    cmPerCrochetSc: 14,
  },
];

export function yarnWeight(id: YarnWeightId): YarnWeightInfo {
  return YARN_WEIGHTS[id];
}

const mid = (r: [number, number]) => (r[0] + r[1]) / 2;

/** Bu kalınlık için tipik ölçü örneği (10 × 10 cm) */
export function typicalGauge(id: YarnWeightId, craft: 'knit' | 'crochet', stitch: 'sc' | 'hdc' | 'dc' | 'jarse' = craft === 'knit' ? 'jarse' : 'sc'): Gauge {
  const w = YARN_WEIGHTS[id];
  if (craft === 'knit') {
    const st = Math.round(mid(w.knitSts));
    // jarse örgüde sıra/ilmek oranı ~1,35–1,4
    return { stitches: st, rows: Math.round(st * 1.38) };
  }
  const sc = mid(w.crochetSts);
  // sık iğne neredeyse kare; yarım trabzan ve trabzan daha yüksek
  if (stitch === 'hdc') return { stitches: Math.round(sc * 0.92), rows: Math.round(sc * 0.75) };
  if (stitch === 'dc') return { stitches: Math.round(sc * 0.88), rows: Math.round(sc * 0.52) };
  return { stitches: Math.round(sc), rows: Math.round(sc * 1.1) };
}

/** WPI (2,5 cm'de sarım) değerinden kalınlık tahmini */
export function weightFromWpi(wpi: number): YarnWeightInfo {
  // aralıklar örtüşür; en yakın merkeze göre seç
  let best = YARN_WEIGHTS[4];
  let bd = Infinity;
  for (const w of YARN_WEIGHTS) {
    if (wpi >= w.wpi[0] && wpi <= w.wpi[1]) {
      const d = Math.abs(wpi - mid(w.wpi));
      if (d < bd) {
        bd = d;
        best = w;
      }
    }
  }
  if (bd === Infinity) return wpi > 40 ? YARN_WEIGHTS[0] : YARN_WEIGHTS[7];
  return best;
}

/** Şiş/tığ numarasından kalınlık tahmini */
export function weightFromTool(mm: number, craft: 'knit' | 'crochet'): YarnWeightInfo {
  const key = craft === 'knit' ? 'needleMm' : 'hookMm';
  let best = YARN_WEIGHTS[4];
  let bd = Infinity;
  for (const w of YARN_WEIGHTS) {
    const r = w[key];
    const d = mm < r[0] ? r[0] - mm : mm > r[1] ? mm - r[1] : 0;
    const tie = Math.abs(mm - mid(r)) / 100;
    if (d + tie < bd) {
      bd = d + tie;
      best = w;
    }
  }
  return best;
}

/** 100 gram/metre oranından kalınlık tahmini (etikette kalınlık yazmıyorsa) */
export function weightFromLength(metersPer100g: number): YarnWeightInfo {
  let best = YARN_WEIGHTS[4];
  let bd = Infinity;
  for (const w of YARN_WEIGHTS) {
    const [a, b] = w.metersPer100g;
    const d = metersPer100g < a ? a - metersPer100g : metersPer100g > b ? metersPer100g - b : 0;
    const tie = Math.abs(Math.log(metersPer100g / Math.sqrt(a * b))) / 100;
    if (d + tie < bd) {
      bd = d + tie;
      best = w;
    }
  }
  return best;
}

/** Kalınlığın gösterilecek diğer adları: Türkçede raf adları önce */
export function weightAliases(w: { aliases: string[]; aliasesTr: string[] }, lang: string): string[] {
  return lang === 'tr' ? [...w.aliasesTr, ...w.aliases] : w.aliases;
}
