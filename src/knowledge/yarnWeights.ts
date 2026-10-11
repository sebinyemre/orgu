/**
 * Craft Yarn Council (CYC) standart ip kalınlıkları — 0'dan 7'ye.
 * Değerler etiket ortalamalarıdır; kesin sonuç için her zaman ölçü örneği örülür.
 */
import type { Gauge, YarnWeightId } from '@/types';

export interface YarnWeightInfo {
  id: YarnWeightId;
  /** Türkçe kısa ad */
  name: string;
  /** İngilizce kategori adı */
  en: string;
  /** ip türü adları (TR + yaygın EN) */
  aliases: string[];
  /** Türkiye'de rafta nasıl tarif edilir */
  trShelf: string;
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
  uses: string[];
  /** 1 ilmeğin yaklaşık ip tüketimi (cm) — jarse / sık iğne */
  cmPerKnitSt: number;
  cmPerCrochetSc: number;
}

export const YARN_WEIGHTS: YarnWeightInfo[] = [
  {
    id: 0,
    name: 'Dantel',
    en: 'Lace',
    aliases: ['dantel ipi', 'ince merserize', 'lace', 'cobweb', 'light fingering'],
    trShelf: 'Çok ince — oya, dantel, iğne oyası ve tığ dantelleri (ör. 10–20 numara koton).',
    wpi: [30, 40],
    needleMm: [1.5, 2.25],
    hookMm: [1.25, 2.25],
    knitSts: [33, 40],
    crochetSts: [32, 42],
    metersPer100g: [600, 1200],
    uses: ['Şal ve ajur', 'Tığ dantel örtü', 'Oya'],
    cmPerKnitSt: 1.6,
    cmPerCrochetSc: 2.6,
  },
  {
    id: 1,
    name: 'Süper ince',
    en: 'Super Fine',
    aliases: ['çorap ipi', 'bebe ince', 'fingering', 'sock', '4 kat'],
    trShelf: 'Çorap ve ince bebek yünleri; 2–3 numara şişle örülür.',
    wpi: [14, 30],
    needleMm: [2.25, 3.25],
    hookMm: [2.25, 3.5],
    knitSts: [27, 32],
    crochetSts: [21, 32],
    metersPer100g: [350, 460],
    uses: ['Çorap', 'Bebek giysisi', 'İnce kazak', 'Renkli (fair isle) örgü'],
    cmPerKnitSt: 2.0,
    cmPerCrochetSc: 3.3,
  },
  {
    id: 2,
    name: 'İnce',
    en: 'Fine',
    aliases: ['bebe yünü', 'sport', '5 kat', 'baby'],
    trShelf: 'Bebek yünleri ve ince pamuklar; 3–3,5 numara şiş, 3–4 numara tığ.',
    wpi: [12, 18],
    needleMm: [3.25, 3.75],
    hookMm: [3.5, 4.5],
    knitSts: [23, 26],
    crochetSts: [16, 20],
    metersPer100g: [280, 350],
    uses: ['Bebek battaniyesi', 'Amigurumi (ince)', 'Hırka', 'Yazlık bluz'],
    cmPerKnitSt: 2.4,
    cmPerCrochetSc: 4.0,
  },
  {
    id: 3,
    name: 'Hafif',
    en: 'Light',
    aliases: ['DK', 'ince yün', 'light worsted', '8 kat', 'amigurumi pamuğu'],
    trShelf: 'Günlük örgü ipleri, amigurumi pamukları; 3,5–4,5 numara şiş.',
    wpi: [11, 15],
    needleMm: [3.75, 4.5],
    hookMm: [3.5, 5.5],
    knitSts: [21, 24],
    crochetSts: [12, 17],
    metersPer100g: [200, 280],
    uses: ['Kazak', 'Amigurumi', 'Şal', 'Bebek giysisi'],
    cmPerKnitSt: 2.8,
    cmPerCrochetSc: 4.6,
  },
  {
    id: 4,
    name: 'Orta',
    en: 'Medium',
    aliases: ['worsted', 'aran', 'afghan', 'orta kalınlık', '10 kat'],
    trShelf: 'Rafların en yaygın kalınlığı; 4,5–5,5 numara şiş, 5–6 numara tığ.',
    wpi: [9, 12],
    needleMm: [4.5, 5.5],
    hookMm: [5.0, 6.5],
    knitSts: [16, 20],
    crochetSts: [11, 14],
    metersPer100g: [150, 200],
    uses: ['Atkı', 'Bere', 'Kazak', 'Battaniye', 'Çanta'],
    cmPerKnitSt: 3.4,
    cmPerCrochetSc: 5.5,
  },
  {
    id: 5,
    name: 'Kalın',
    en: 'Bulky',
    aliases: ['chunky', 'kalın yün', 'craft', 'rug', '12 kat'],
    trShelf: 'Kışlık kalın yünler; 6–8 numara şiş, 6,5–9 numara tığ.',
    wpi: [6, 9],
    needleMm: [5.5, 8],
    hookMm: [6.5, 9],
    knitSts: [12, 15],
    crochetSts: [8, 11],
    metersPer100g: [80, 150],
    uses: ['Kalın atkı', 'Bere', 'Hızlı battaniye', 'Kalın hırka'],
    cmPerKnitSt: 4.4,
    cmPerCrochetSc: 7.2,
  },
  {
    id: 6,
    name: 'Çok kalın',
    en: 'Super Bulky',
    aliases: ['super chunky', 'roving', 'çok kalın yün', 'kadife ip (kalın)'],
    trShelf: 'Çok kalın ipler ve kalın kadife (şönil) ipler; 9–12 numara şiş.',
    wpi: [5, 6],
    needleMm: [8, 12.75],
    hookMm: [9, 15],
    knitSts: [7, 11],
    crochetSts: [6, 9],
    metersPer100g: [40, 80],
    uses: ['Hızlı atkı', 'Battaniye', 'Puf / minder'],
    cmPerKnitSt: 6.0,
    cmPerCrochetSc: 9.5,
  },
  {
    id: 7,
    name: 'Jumbo',
    en: 'Jumbo',
    aliases: ['jumbo', 'kol örgüsü', 'dev ip', 'chenille jumbo'],
    trShelf: 'Elle (kol) örgüsü ve 15 mm üzeri şişler için dev ipler.',
    wpi: [1, 4],
    needleMm: [12.75, 25],
    hookMm: [15, 25],
    knitSts: [3, 6],
    crochetSts: [3, 5],
    metersPer100g: [10, 40],
    uses: ['Kol örgüsü battaniye', 'Dev minder', 'Sepet'],
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
