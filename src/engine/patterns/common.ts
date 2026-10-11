/**
 * Üreticilerin ortak metinleri (dört dilde): sıra/tur etiketleri, malzeme satırları, ölçü örneği,
 * kısaltmalar ve bitiriş adımları. Tığ metinlerinde {sc}, {dc}… yer tutucuları kullanılır; kurucu en sonda doldurur.
 */
import type { Craft, Gauge, Lang, PatternAbbr, PatternMaterial, ToolKind, Units } from '@/types';
import type { L10n } from '@/i18n';
import { YARN_WEIGHTS, typicalGauge } from '@/knowledge/yarnWeights';
import { FIBER_BY_ID } from '@/knowledge/fibers';
import { circularLengthFor } from '@/knowledge/tools';
import { nameColor } from '@/lib/color';
import { skeinsFor } from '@/engine/math/yarn';
import { grams, len, meters, num, tenLabel, toolSize } from './fmt';
import { lk } from './builder';
import type { CrochetStitch, PatternParams, YarnSpec } from './types';

export const L = <T>(tr: T, en: T, es: T, pt: T): L10n<T> => ({ tr, en, es, pt });

/* ── Sıra / tur etiketleri ───────────────────────────────── */
export interface Words {
  row: (n: number) => string;
  rows: (a: number, b: number) => string;
  rnd: (n: number) => string;
  rnds: (a: number, b: number) => string;
  times: (n: number) => string;
  sts: (n: number) => string;
  rowsN: (n: number) => string;
  rndsN: (n: number) => string;
  every: string;
  everyRow: string;
  everyRnd: string;
  colorLetter: (i: number) => string;
  color: string;
  and: string;
}

export const WORDS: L10n<Words> = {
  tr: {
    row: (n) => `${n}. sıra`,
    rows: (a, b) => (a === b ? `${a}. sıra` : `${a}.–${b}. sıra`),
    rnd: (n) => `${n}. tur`,
    rnds: (a, b) => (a === b ? `${a}. tur` : `${a}.–${b}. tur`),
    times: (n) => `${n} kez`,
    sts: (n) => `${n} ilmek`,
    rowsN: (n) => `${n} sıra`,
    rndsN: (n) => `${n} tur`,
    every: 'her',
    everyRow: 'Her sıra',
    everyRnd: 'Her tur',
    colorLetter: (i) => `${String.fromCharCode(65 + i)} rengi`,
    color: 'Renk',
    and: 've',
  },
  en: {
    row: (n) => `Row ${n}`,
    rows: (a, b) => (a === b ? `Row ${a}` : `Rows ${a}–${b}`),
    rnd: (n) => `Rnd ${n}`,
    rnds: (a, b) => (a === b ? `Rnd ${a}` : `Rnds ${a}–${b}`),
    times: (n) => `${n} times`,
    sts: (n) => `${n} st${n === 1 ? '' : 's'}`,
    rowsN: (n) => `${n} row${n === 1 ? '' : 's'}`,
    rndsN: (n) => `${n} round${n === 1 ? '' : 's'}`,
    every: 'every',
    everyRow: 'Every row',
    everyRnd: 'Every round',
    colorLetter: (i) => `Color ${String.fromCharCode(65 + i)}`,
    color: 'Color',
    and: 'and',
  },
  es: {
    row: (n) => `Vuelta ${n}`,
    rows: (a, b) => (a === b ? `Vuelta ${a}` : `Vueltas ${a}–${b}`),
    rnd: (n) => `Vuelta ${n}`,
    rnds: (a, b) => (a === b ? `Vuelta ${a}` : `Vueltas ${a}–${b}`),
    times: (n) => `${n} veces`,
    sts: (n) => `${n} p.`,
    rowsN: (n) => `${n} vuelta${n === 1 ? '' : 's'}`,
    rndsN: (n) => `${n} vuelta${n === 1 ? '' : 's'}`,
    every: 'cada',
    everyRow: 'Todas las vueltas',
    everyRnd: 'Todas las vueltas',
    colorLetter: (i) => `Color ${String.fromCharCode(65 + i)}`,
    color: 'Color',
    and: 'y',
  },
  pt: {
    row: (n) => `Carreira ${n}`,
    rows: (a, b) => (a === b ? `Carreira ${a}` : `Carreiras ${a}–${b}`),
    rnd: (n) => `Volta ${n}`,
    rnds: (a, b) => (a === b ? `Volta ${a}` : `Voltas ${a}–${b}`),
    times: (n) => `${n} vezes`,
    sts: (n) => `${n} pts`,
    rowsN: (n) => `${n} carreira${n === 1 ? '' : 's'}`,
    rndsN: (n) => `${n} volta${n === 1 ? '' : 's'}`,
    every: 'a cada',
    everyRow: 'Todas as carreiras',
    everyRnd: 'Todas as voltas',
    colorLetter: (i) => `Cor ${String.fromCharCode(65 + i)}`,
    color: 'Cor',
    and: 'e',
  },
};

/* ── Ölçü örneği ─────────────────────────────────────────── */
export type GaugeStitch = 'jarse' | CrochetStitch;

/** Kullanıcının ölçü örneği ya da ip kalınlığına göre tipik ölçü */
export function resolveGauge(p: PatternParams, craft: Craft, stitch: GaugeStitch): Gauge {
  if (p.gauge && p.gauge.stitches > 0 && p.gauge.rows > 0) return p.gauge;
  return craft === 'knit' ? typicalGauge(p.yarn.weight, 'knit') : typicalGauge(p.yarn.weight, 'crochet', stitch === 'jarse' ? 'sc' : stitch);
}

const GAUGE_IN: L10n<Record<GaugeStitch, string>> = L(
  { jarse: 'jarse örgüde', sc: '{sc} ile', hdc: '{hdc} ile', dc: '{dc} ile' },
  { jarse: 'in stockinette', sc: 'in {sc}', hdc: 'in {hdc}', dc: 'in {dc}' },
  { jarse: 'en punto jersey', sc: 'en {sc}', hdc: 'en {hdc}', dc: 'en {dc}' },
  { jarse: 'em ponto jersey', sc: 'em {sc}', hdc: 'em {hdc}', dc: 'em {dc}' },
);

/** "18 ilmek ve 25 sıra = 10 cm, jarse örgüde" */
export function gaugeText(g: Gauge, stitch: GaugeStitch, lang: Lang, units: Units): string {
  const ten = tenLabel(units, lang);
  const st = num(g.stitches, lang, 1);
  const rw = num(g.rows, lang, 1);
  const where = GAUGE_IN[lang][stitch];
  switch (lang) {
    case 'tr':
      return `${ten} = ${st} ilmek × ${rw} sıra, ${where}`;
    case 'en':
      return `${st} sts × ${rw} rows = ${ten} ${where}`;
    case 'es':
      return `${st} p. × ${rw} vueltas = ${ten} ${where}`;
    case 'pt':
      return `${st} pts × ${rw} carreiras = ${ten} ${where}`;
  }
}

/* ── Malzemeler ──────────────────────────────────────────── */
const MAT = L(
  {
    yarn: 'İp',
    needles: 'Şiş',
    circular: 'Misinalı şiş',
    dpn: 'Çorap şişi ya da uzun misina',
    hook: 'Tığ',
    tapestry: 'Yün iğnesi',
    tapestryD: 'Uçları gizlemek ve dikmek için kör uçlu iri iğne',
    markers: 'İlmek işaretleyici',
    markersD: (n: number) => `${n} adet (biri farklı renkte: tur başı)`,
    marker1: '1 adet (tur başını göstermek için)',
    marker2: '2 adet (kenarı ortadan ayırmak için)',
    scissors: 'Makas',
    stuffing: 'Elyaf dolgu',
    stuffingD: (g: string) => `yaklaşık ${g}`,
    cableNeedle: 'Burgu şişi (yardımcı şiş)',
    cableNeedleD: 'Kısa çorap şişi ya da kürdan da olur',
    pompom: 'Ponpon (isteğe bağlı)',
    pompomD: 'Hazır ponpon ya da artan ipten 6–8 cm ponpon',
    pins: 'Toplu iğne ve mezura',
    pinsD: 'Ölçmek ve dinlendirmek için',
    cardboard: 'Karton (püskül için)',
    skein: (n: number) => `${n} yumak`,
    perSkein: (m: string, g: string) => `${g} / ${m} yumak`,
    total: (m: string) => `toplam yaklaşık ${m}`,
    yarnFor: (c: string, m: string) => `${c}: yaklaşık ${m}`,
    circLen: (cm: number) => `${cm} cm misina`,
    flatOnCirc: 'Çok ilmek olduğu için misinalı şişte düz (gidiş-dönüş) örülür',
  },
  {
    yarn: 'Yarn',
    needles: 'Needles',
    circular: 'Circular needle',
    dpn: 'Double-pointed needles or a long circular for magic loop',
    hook: 'Crochet hook',
    tapestry: 'Tapestry needle',
    tapestryD: 'A blunt needle for weaving in ends and seaming',
    markers: 'Stitch markers',
    markersD: (n: number) => `${n} (one in a different color for the beginning of the round)`,
    marker1: '1 (to mark the beginning of the round)',
    marker2: '2 (to separate the border from the center)',
    scissors: 'Scissors',
    stuffing: 'Fiberfill stuffing',
    stuffingD: (g: string) => `about ${g}`,
    cableNeedle: 'Cable needle',
    cableNeedleD: 'A short double-pointed needle or a toothpick works too',
    pompom: 'Pompom (optional)',
    pompomD: 'Ready-made or a 6–8 cm pompom from leftover yarn',
    pins: 'Pins and tape measure',
    pinsD: 'For measuring and blocking',
    cardboard: 'Piece of card (for fringe)',
    skein: (n: number) => `${n} skein${n === 1 ? '' : 's'}`,
    perSkein: (m: string, g: string) => `${g} / ${m} per skein`,
    total: (m: string) => `about ${m} in total`,
    yarnFor: (c: string, m: string) => `${c}: about ${m}`,
    circLen: (cm: number) => `${cm} cm (${Math.round(cm / 2.54)}") cable`,
    flatOnCirc: 'Worked flat (back and forth) on a circular needle to hold all the stitches',
  },
  {
    yarn: 'Hilo',
    needles: 'Agujas',
    circular: 'Aguja circular',
    dpn: 'Agujas de doble punta o una circular larga para magic loop',
    hook: 'Aguja de ganchillo',
    tapestry: 'Aguja lanera',
    tapestryD: 'Aguja de punta roma para esconder hebras y coser',
    markers: 'Marcadores de puntos',
    markersD: (n: number) => `${n} (uno de otro color para el inicio de vuelta)`,
    marker1: '1 (para marcar el inicio de vuelta)',
    marker2: '2 (para separar el borde del centro)',
    scissors: 'Tijeras',
    stuffing: 'Relleno de fibra',
    stuffingD: (g: string) => `unos ${g}`,
    cableNeedle: 'Aguja auxiliar de ochos',
    cableNeedleD: 'También sirve una aguja de doble punta corta o un palillo',
    pompom: 'Pompón (opcional)',
    pompomD: 'Comprado o de 6–8 cm con hilo sobrante',
    pins: 'Alfileres y cinta métrica',
    pinsD: 'Para medir y bloquear',
    cardboard: 'Un cartón (para los flecos)',
    skein: (n: number) => `${n} ovillo${n === 1 ? '' : 's'}`,
    perSkein: (m: string, g: string) => `ovillos de ${g} / ${m}`,
    total: (m: string) => `unos ${m} en total`,
    yarnFor: (c: string, m: string) => `${c}: unos ${m}`,
    circLen: (cm: number) => `cable de ${cm} cm`,
    flatOnCirc: 'Se teje en plano (ida y vuelta) en una aguja circular para que quepan todos los puntos',
  },
  {
    yarn: 'Fio',
    needles: 'Agulhas',
    circular: 'Agulha circular',
    dpn: 'Agulhas de pontas duplas ou circular longa para magic loop',
    hook: 'Agulha de crochê',
    tapestry: 'Agulha de tapeçaria',
    tapestryD: 'Agulha de ponta romba para esconder pontas e costurar',
    markers: 'Marcadores de pontos',
    markersD: (n: number) => `${n} (um de outra cor para o início da volta)`,
    marker1: '1 (para marcar o início da volta)',
    marker2: '2 (para separar a borda do centro)',
    scissors: 'Tesoura',
    stuffing: 'Fibra para enchimento',
    stuffingD: (g: string) => `cerca de ${g}`,
    cableNeedle: 'Agulha auxiliar de tranças',
    cableNeedleD: 'Uma agulha de pontas duplas curta ou um palito também servem',
    pompom: 'Pompom (opcional)',
    pompomD: 'Pronto ou de 6–8 cm com sobras de fio',
    pins: 'Alfinetes e fita métrica',
    pinsD: 'Para medir e bloquear',
    cardboard: 'Um pedaço de papelão (para as franjas)',
    skein: (n: number) => `${n} novelo${n === 1 ? '' : 's'}`,
    perSkein: (m: string, g: string) => `novelos de ${g} / ${m}`,
    total: (m: string) => `cerca de ${m} no total`,
    yarnFor: (c: string, m: string) => `${c}: cerca de ${m}`,
    circLen: (cm: number) => `cabo de ${cm} cm`,
    flatOnCirc: 'Tricotado reto (ida e volta) na agulha circular para caberem todos os pontos',
  },
);

export function colorName(yarn: YarnSpec, i: number, lang: Lang): string {
  const c = yarn.colors[i] ?? yarn.colors[0];
  return c?.name || nameColor(c?.hex ?? '#b5523b', lang);
}

/** Ip satırları: kalınlık, lif, toplam metre, yumak; birden fazla renkte renk başına metre */
export function yarnMaterials(yarn: YarnSpec, totalMeters: number, colorMeters: number[] | null, lang: Lang, units: Units): PatternMaterial[] {
  const m = MAT[lang];
  const w = YARN_WEIGHTS[yarn.weight];
  const fiber = yarn.fibers?.length ? yarn.fibers.map((f) => FIBER_BY_ID[f]?.name[lang] ?? f).join(' / ') : '';
  const head = [yarn.name, lang === 'en' ? `${w.name[lang]} (CYC ${w.id})` : `${w.name[lang]} (CYC ${w.id}, ${w.en})`, fiber].filter(Boolean).join(' · ');
  const out: PatternMaterial[] = [];
  const skeinPart = (mm: number) => {
    if (!yarn.metersPerSkein) return '';
    const sk = Math.max(1, Math.ceil(skeinsFor(mm, yarn.metersPerSkein) - 0.05));
    return ` · ${m.skein(sk)}`;
  };
  const per = yarn.metersPerSkein ? ` · ${m.perSkein(meters(yarn.metersPerSkein, lang, units), grams(yarn.gramsPerSkein ?? 100, lang))}` : '';
  if (colorMeters && colorMeters.length > 1) {
    out.push({ label: m.yarn, detail: `${head}${per} · ${m.total(meters(totalMeters, lang, units))}` });
    colorMeters.forEach((cm, i) => {
      const c = `${WORDS[lang].colorLetter(i)} (${colorName(yarn, i, lang)})`;
      out.push({ label: WORDS[lang].colorLetter(i), detail: `${m.yarnFor(c, meters(cm, lang, units))}${skeinPart(cm)}` });
    });
  } else {
    out.push({ label: m.yarn, detail: `${head}${per} · ${m.total(meters(totalMeters, lang, units))}${skeinPart(totalMeters)} · ${colorName(yarn, 0, lang)}` });
  }
  return out;
}

export function toolMaterial(mm: number, kind: ToolKind, lang: Lang, circumferenceCm?: number): PatternMaterial[] {
  const m = MAT[lang];
  const size = toolSize(mm, kind === 'tig', lang);
  if (kind === 'tig') return [{ label: m.hook, detail: size }];
  if (kind === 'sis-misinali' && circumferenceCm) {
    const c = circularLengthFor(circumferenceCm, lang);
    const out: PatternMaterial[] = [{ label: m.circular, detail: c.lengthCm ? `${size}, ${m.circLen(c.lengthCm)}` : `${size}. ${c.note}` }];
    return out;
  }
  if (kind === 'sis-misinali') return [{ label: m.circular, detail: `${size}, ${m.circLen(80)}. ${m.flatOnCirc}` }];
  return [{ label: m.needles, detail: size }];
}

export type Notion = 'tapestry' | 'markers8' | 'marker1' | 'markers2' | 'scissors' | 'stuffing' | 'cableNeedle' | 'pompom' | 'pins' | 'cardboard' | 'dpn';

export function notions(list: Notion[], lang: Lang, opts: { stuffingG?: number; toolMm?: number } = {}): PatternMaterial[] {
  const m = MAT[lang];
  return list.map((n): PatternMaterial => {
    switch (n) {
      case 'tapestry':
        return { label: m.tapestry, detail: m.tapestryD };
      case 'markers8':
        return { label: m.markers, detail: m.markersD(8) };
      case 'marker1':
        return { label: m.markers, detail: m.marker1 };
      case 'markers2':
        return { label: m.markers, detail: m.marker2 };
      case 'scissors':
        return { label: m.scissors, detail: '' };
      case 'stuffing':
        return { label: m.stuffing, detail: m.stuffingD(grams(opts.stuffingG ?? 10, lang)) };
      case 'cableNeedle':
        return { label: m.cableNeedle, detail: m.cableNeedleD };
      case 'pompom':
        return { label: m.pompom, detail: m.pompomD };
      case 'pins':
        return { label: m.pins, detail: m.pinsD };
      case 'cardboard':
        return { label: m.cardboard, detail: '' };
      case 'dpn':
        return { label: m.dpn, detail: opts.toolMm ? toolSize(opts.toolMm, false, lang) : '' };
    }
  });
}

/** Renk başına metreyi en az 1 m'ye yuvarlar */
export const splitMeters = (total: number, weights: number[]): number[] => {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  return weights.map((w) => Math.max(1, (total * w) / sum));
};

/* ── Kısaltmalar ─────────────────────────────────────────── */
export type AbbrKey =
  // şiş
  | 'k'
  | 'p'
  | 'k2tog'
  | 'ssk'
  | 'yo'
  | 'sl'
  | 'kfb'
  | 'm1'
  | 'pm'
  | 'bor'
  | 'co'
  | 'bo'
  | 'rsws'
  | 'cable'
  // tığ
  | 'ch'
  | 'slst'
  | 'sc'
  | 'hdc'
  | 'dc'
  | 'inc'
  | 'dec'
  | 'mr'
  | 'sp'
  | 'fpdc'
  | 'bpdc'
  | 'blo'
  | 'sk'
  // ortak
  | 'st'
  | 'rep';

type AbbrRow = [abbr: string, meaning: string, lessonId?: string];

const ABBR: L10n<Record<AbbrKey, AbbrRow>> = {
  tr: {
    k: ['düz', 'Düz ilmek (İng. knit, k)', 'sis-duz-ilmek'],
    p: ['ters', 'Ters ilmek (İng. purl, p)', 'sis-ters-ilmek'],
    k2tog: ['2 birlikte düz', 'İki ilmeği birlikte düz örerek 1 ilmek eksilt; sağa yatar (İng. k2tog)', 'sis-eksiltme'],
    ssk: ['kaydır, kaydır, ör', 'İki ilmeği tek tek kaydır, birlikte arkadan düz ör; sola yatar (İng. ssk)', 'sis-eksiltme'],
    yo: ['ip at', 'İpi sağ şişe sararak yeni ilmek ve delik aç (İng. yo)', 'sis-ip-atma'],
    sl: ['kaydır', 'İlmeği örmeden sağ şişe geçir (İng. sl)', 'sis-kaydirma'],
    kfb: ['önden-arkadan ör', 'Aynı ilmeği önce önden sonra arkadan düz ör; 1 ilmek artar (İng. kfb)', 'sis-artirma'],
    m1: ['1 artır', 'İki ilmek arasındaki yatay ipi sol şişe al ve arkasından düz ör; 1 ilmek artar (İng. M1)', 'sis-artirma'],
    pm: ['işaretleyici', 'İlmek işaretleyici tak / geçir (İng. pm, sm)'],
    bor: ['tur başı', 'Turun başladığı yer; farklı renk işaretleyiciyle gösterilir (İng. BOR)', 'sis-misinali'],
    co: ['ilmek at', 'Şişe ilk ilmekleri dizmek (İng. CO)', 'sis-ilmek-atma-basparmak'],
    bo: ['ilmek kapat', 'İşi şişten almak için ilmekleri kapatmak (İng. BO)', 'sis-ilmek-kapatma'],
    rsws: ['ÖY / AY', 'Ön yüz / arka yüz (İng. RS / WS)'],
    cable: ['burgu', 'İlmekleri yardımcı şişle çaprazlamak (İng. cable)', 'sis-burgu'],
    ch: ['zincir', 'Zincir ilmek (US ch)', 'tig-zincir'],
    slst: ['{slst}', '{Slst} (US sl st)', 'tig-kor-ilmek'],
    sc: ['{sc}', '{Sc} (US sc)', 'tig-sik-igne'],
    hdc: ['{hdc}', '{Hdc} (US hdc · 1 ip atma)', 'tig-yarim-trabzan'],
    dc: ['{dc}', '{Dc} (US dc · 1 ip atma)', 'tig-trabzan'],
    inc: ['artırma', 'Aynı ilmeğe 2 ilmek (US inc)', 'tig-artirma'],
    dec: ['eksiltme', 'Görünmez eksiltme: sonraki 2 ilmeğin yalnız ön halkalarından geçip birlikte ör (US dec)', 'tig-eksiltme'],
    mr: ['sihirli halka', 'Ayarlanabilir başlangıç halkası (US MR)', 'tig-sihirli-halka'],
    sp: ['boşluk', 'Alt turdaki zincirlerin oluşturduğu boşluk (US sp)'],
    fpdc: ['ön kabartma {dc}', 'İlmeğin gövdesini önden sararak {dc} (US FPdc)', 'tig-kabartma'],
    bpdc: ['arka kabartma {dc}', 'İlmeğin gövdesini arkadan sararak {dc} (US BPdc)', 'tig-kabartma'],
    blo: ['arka halka', 'Yalnız arka halkaya bat (US BLO)', 'tig-halkalar'],
    sk: ['atla', 'İlmeği ya da zinciri boş geç (US sk)'],
    st: ['ilmek', 'İlmek (İng. st, sts)'],
    rep: ['*…*', 'Yıldızlar arasını belirtilen sayıda tekrarla (İng. rep)'],
  },
  en: {
    k: ['k', 'knit', 'sis-duz-ilmek'],
    p: ['p', 'purl', 'sis-ters-ilmek'],
    k2tog: ['k2tog', 'knit 2 stitches together (1 st decreased, leans right)', 'sis-eksiltme'],
    ssk: ['ssk', 'slip, slip, knit the 2 slipped sts together through the back loops (leans left)', 'sis-eksiltme'],
    yo: ['yo', 'yarn over', 'sis-ip-atma'],
    sl: ['sl', 'slip a stitch without working it', 'sis-kaydirma'],
    kfb: ['kfb', 'knit into the front and back of the same stitch (1 st increased)', 'sis-artirma'],
    m1: ['M1', 'make 1: lift the bar between two stitches onto the left needle and knit it through the back loop (1 st increased)', 'sis-artirma'],
    pm: ['pm / sm', 'place marker / slip marker'],
    bor: ['BOR', 'beginning of round', 'sis-misinali'],
    co: ['CO', 'cast on', 'sis-ilmek-atma-basparmak'],
    bo: ['BO', 'bind off', 'sis-ilmek-kapatma'],
    rsws: ['RS / WS', 'right side / wrong side'],
    cable: ['cable', 'cross stitches using a cable needle', 'sis-burgu'],
    ch: ['{ch.a}', 'chain', 'tig-zincir'],
    slst: ['{slst.a}', 'slip stitch', 'tig-kor-ilmek'],
    sc: ['{sc.a}', '{sc}', 'tig-sik-igne'],
    hdc: ['{hdc.a}', '{hdc}', 'tig-yarim-trabzan'],
    dc: ['{dc.a}', '{dc}', 'tig-trabzan'],
    inc: ['inc', 'increase: 2 sts in the same stitch', 'tig-artirma'],
    dec: ['dec', 'invisible decrease: insert in front loops of next 2 sts, yarn over, pull through both, finish as {sc.a}', 'tig-eksiltme'],
    mr: ['MR', 'magic ring (adjustable ring)', 'tig-sihirli-halka'],
    sp: ['sp', 'space made by chains in the round below'],
    fpdc: ['FP{dc.a}', 'front post {dc}: work around the post from the front', 'tig-kabartma'],
    bpdc: ['BP{dc.a}', 'back post {dc}: work around the post from the back', 'tig-kabartma'],
    blo: ['BLO', 'back loop only', 'tig-halkalar'],
    sk: ['sk', 'skip'],
    st: ['st(s)', 'stitch(es)'],
    rep: ['*…*', 'repeat the instructions between asterisks as stated'],
  },
  es: {
    k: ['d', 'punto derecho', 'sis-duz-ilmek'],
    p: ['r', 'punto revés', 'sis-ters-ilmek'],
    k2tog: ['2 juntos d', 'tejer 2 puntos juntos al derecho (disminuye 1, inclinada a la derecha)', 'sis-eksiltme'],
    ssk: ['desl-desl-d', 'deslizar 2 puntos de uno en uno y tejerlos juntos por detrás (inclinada a la izquierda)', 'sis-eksiltme'],
    yo: ['lazada', 'echar la hebra sobre la aguja (aumenta 1 y hace un calado)', 'sis-ip-atma'],
    sl: ['desl', 'deslizar un punto sin tejerlo', 'sis-kaydirma'],
    kfb: ['aum d', 'tejer por delante y por detrás del mismo punto (aumenta 1)', 'sis-artirma'],
    m1: ['aum 1', 'levantar la hebra horizontal entre dos puntos y tejerla retorcida al derecho (aumenta 1)', 'sis-artirma'],
    pm: ['marc.', 'colocar / pasar el marcador'],
    bor: ['inicio', 'inicio de vuelta (marcador de otro color)', 'sis-misinali'],
    co: ['montar', 'montar puntos', 'sis-ilmek-atma-basparmak'],
    bo: ['cerrar', 'cerrar puntos', 'sis-ilmek-kapatma'],
    rsws: ['LD / LR', 'lado derecho / lado revés de la labor'],
    cable: ['ocho', 'cruzar puntos con aguja auxiliar', 'sis-burgu'],
    ch: ['{ch.a}', 'cadeneta', 'tig-zincir'],
    slst: ['{slst.a}', '{slst}', 'tig-kor-ilmek'],
    sc: ['{sc.a}', '{sc} (US sc)', 'tig-sik-igne'],
    hdc: ['{hdc.a}', '{hdc} (US hdc)', 'tig-yarim-trabzan'],
    dc: ['{dc.a}', '{dc} (US dc)', 'tig-trabzan'],
    inc: ['aum', 'aumento: 2 puntos en el mismo punto', 'tig-artirma'],
    dec: ['dism', 'disminución invisible: entrar por las hebras delanteras de los 2 puntos siguientes y cerrar como {sc.a}', 'tig-eksiltme'],
    mr: ['am', 'anillo mágico', 'tig-sihirli-halka'],
    sp: ['esp', 'espacio formado por cadenetas'],
    fpdc: ['{dc.a} rel. del.', '{dc} en relieve por delante', 'tig-kabartma'],
    bpdc: ['{dc.a} rel. det.', '{dc} en relieve por detrás', 'tig-kabartma'],
    blo: ['hebra tras.', 'solo por la hebra trasera', 'tig-halkalar'],
    sk: ['saltar', 'saltar un punto o cadeneta'],
    st: ['p.', 'punto(s)'],
    rep: ['*…*', 'repetir lo indicado entre asteriscos'],
  },
  pt: {
    k: ['m', 'ponto meia', 'sis-duz-ilmek'],
    p: ['t', 'ponto tricô', 'sis-ters-ilmek'],
    k2tog: ['2 juntos em m', 'tricotar 2 pontos juntos em meia (diminui 1, inclinada para a direita)', 'sis-eksiltme'],
    ssk: ['desl-desl-m', 'deslizar 2 pontos um a um e tricotá-los juntos por trás (inclinada para a esquerda)', 'sis-eksiltme'],
    yo: ['laçada', 'passar o fio sobre a agulha (aumenta 1 e faz um furinho)', 'sis-ip-atma'],
    sl: ['desl', 'deslizar um ponto sem tricotar', 'sis-kaydirma'],
    kfb: ['aum m', 'tricotar pela frente e por trás do mesmo ponto (aumenta 1)', 'sis-artirma'],
    m1: ['aum 1', 'levantar o fio horizontal entre dois pontos e tricotá-lo torcido em meia (aumenta 1)', 'sis-artirma'],
    pm: ['marc.', 'colocar / passar o marcador'],
    bor: ['início', 'início da volta (marcador de outra cor)', 'sis-misinali'],
    co: ['montar', 'montar os pontos', 'sis-ilmek-atma-basparmak'],
    bo: ['arrematar', 'arrematar os pontos', 'sis-ilmek-kapatma'],
    rsws: ['LD / LA', 'lado direito / lado avesso'],
    cable: ['trança', 'cruzar pontos com agulha auxiliar', 'sis-burgu'],
    ch: ['{ch.a}', 'correntinha', 'tig-zincir'],
    slst: ['{slst.a}', '{slst}', 'tig-kor-ilmek'],
    sc: ['{sc.a}', '{sc} (US sc)', 'tig-sik-igne'],
    hdc: ['{hdc.a}', '{hdc} (US hdc)', 'tig-yarim-trabzan'],
    dc: ['{dc.a}', '{dc} (US dc)', 'tig-trabzan'],
    inc: ['aum', 'aumento: 2 pontos no mesmo ponto', 'tig-artirma'],
    dec: ['dim', 'diminuição invisível: entrar pelas alças da frente dos 2 pontos seguintes e fechar como {sc.a}', 'tig-eksiltme'],
    mr: ['am', 'anel mágico', 'tig-sihirli-halka'],
    sp: ['esp', 'espaço formado por correntinhas'],
    fpdc: ['{dc.a} rel. frente', '{dc} em relevo pela frente', 'tig-kabartma'],
    bpdc: ['{dc.a} rel. trás', '{dc} em relevo por trás', 'tig-kabartma'],
    blo: ['alça tras.', 'só pela alça de trás', 'tig-halkalar'],
    sk: ['pular', 'pular um ponto ou correntinha'],
    st: ['pt(s)', 'ponto(s)'],
    rep: ['*…*', 'repetir o que está entre asteriscos'],
  },
};

export function abbreviations(keys: AbbrKey[], lang: Lang): PatternAbbr[] {
  const seen = new Set<AbbrKey>();
  const out: PatternAbbr[] = [];
  for (const k of keys) {
    if (seen.has(k)) continue;
    seen.add(k);
    const [abbr, meaning, lessonId] = ABBR[lang][k];
    out.push(lessonId ? { abbr, meaning, lessonId } : { abbr, meaning });
  }
  return out;
}

/* ── Ortak adımlar ve notlar ─────────────────────────────── */
export const FINISH = L(
  {
    finishing: 'Bitiriş',
    weaveKnit: `İpi 15 cm uç bırakarak kes. Tüm uçları ${lk('sis-uc-gizleme', 'yün iğnesiyle tersten gizle')}.`,
    weaveCrochet: `İpi 15 cm uç bırakarak kes, son ilmekten çekip ${lk('tig-bitirme', 'sıkıca bitir')}. Tüm uçları yün iğnesiyle tersten gizle.`,
    block: 'Parçayı ılık suda ıslat, havluya sarıp suyunu al, ölçülerine göre düz bir yüzeyde serip kurut (dinlendirme).',
    blockAcrylic: 'Akrilik ipte ıslak dinlendirme yerine parçayı serip üzerine nemli bir bez koy ve kurumaya bırak.',
    measureNote: 'Sayılar ölçü örneğine göre hesaplandı. Kendi ölçü örneğin farklıysa ölçüler de değişir; önce küçük bir örnek ör.',
    estimateNote: 'İp miktarı tahminidir ve yaklaşık %10 pay içerir. Aynı boya partisinden (lot) yeterli ip al.',
  },
  {
    finishing: 'Finishing',
    weaveKnit: `Cut the yarn leaving a 15 cm (6") tail. ${lk('sis-uc-gizleme', 'Weave in all ends')} on the wrong side.`,
    weaveCrochet: `Cut the yarn leaving a 15 cm (6") tail and ${lk('tig-bitirme', 'fasten off')}. Weave in all ends on the wrong side.`,
    block: 'Soak the piece in lukewarm water, roll it in a towel to press out the water, then lay it flat to its measurements to dry (blocking).',
    blockAcrylic: 'For acrylic, instead of wet blocking, lay the piece flat, cover it with a damp cloth and let it dry.',
    measureNote: 'All numbers are calculated from the gauge. If your gauge is different, the size will change too, so knit a small swatch first.',
    estimateNote: 'Yarn amounts are estimates and include about 10% extra. Buy enough yarn from the same dye lot.',
  },
  {
    finishing: 'Acabado',
    weaveKnit: `Cortar el hilo dejando 15 cm. ${lk('sis-uc-gizleme', 'Esconder todas las hebras')} por el revés.`,
    weaveCrochet: `Cortar el hilo dejando 15 cm y ${lk('tig-bitirme', 'rematar')}. Esconder todas las hebras por el revés.`,
    block: 'Remojar la pieza en agua tibia, envolverla en una toalla para quitar el agua y dejarla secar en plano con sus medidas (bloqueo).',
    blockAcrylic: 'Con acrílico, en lugar de bloquear en húmedo, extiende la pieza, cúbrela con un paño húmedo y deja que se seque.',
    measureNote: 'Todos los números salen de la muestra. Si tu muestra es distinta, las medidas también cambian: teje antes una muestra pequeña.',
    estimateNote: 'La cantidad de hilo es una estimación con un 10 % de margen. Compra hilo suficiente del mismo baño de color.',
  },
  {
    finishing: 'Acabamento',
    weaveKnit: `Cortar o fio deixando 15 cm. ${lk('sis-uc-gizleme', 'Esconder todas as pontas')} pelo avesso.`,
    weaveCrochet: `Cortar o fio deixando 15 cm e ${lk('tig-bitirme', 'arrematar')}. Esconder todas as pontas pelo avesso.`,
    block: 'Molhar a peça em água morna, enrolar numa toalha para tirar a água e secar na horizontal com as medidas certas (blocagem).',
    blockAcrylic: 'Com acrílico, em vez de blocar úmido, estique a peça, cubra com um pano úmido e deixe secar.',
    measureNote: 'Todos os números vêm da amostra. Se a sua amostra for diferente, as medidas também mudam: faça antes uma amostra pequena.',
    estimateNote: 'A quantidade de fio é uma estimativa com cerca de 10% de folga. Compre fio suficiente do mesmo lote de tingimento.',
  },
);

/** Kullanılan ip akrilik mi? (dinlendirme notu için) */
export const isSynthetic = (y: YarnSpec) => !!y.fibers?.length && y.fibers.every((f) => f === 'akrilik' || f === 'polyester' || f === 'naylon' || f === 'kadife');

/** Bitiş ölçüsü metni: "20 × 160 cm" */
export function sizeWxH(w: number, h: number, units: Units, lang: Lang): string {
  return `${len(w, units, lang)} × ${len(h, units, lang)}`;
}

/** Renk sırası: i. sıradaki renk (döngülü) */
export const colorAt = (yarn: YarnSpec, i: number) => yarn.colors[((i % yarn.colors.length) + yarn.colors.length) % yarn.colors.length]?.hex;

/** Parametrelerin saklanabilir kopyası (fonksiyon yok, düz nesne) */
export function storeParams(p: PatternParams, extra: Record<string, unknown> = {}): Record<string, unknown> {
  return JSON.parse(JSON.stringify({ ...p, ...extra })) as Record<string, unknown>;
}

/** Ölçü örneği satırı için gösterilecek açıklama (params içine konur) */
export function gaugeLabel(stitch: GaugeStitch, lang: Lang): string {
  return GAUGE_IN[lang][stitch];
}

/** Desen adını cümle içinde kullanmak için küçük harfle başlatır ("{Sc} sıraları" → "{sc} sıraları") */
export function inlineName(name: string, lang: Lang): string {
  const loc = { tr: 'tr-TR', en: 'en-US', es: 'es-ES', pt: 'pt-BR' }[lang];
  if (name.startsWith('{') && name.length > 1) return '{' + name.charAt(1).toLocaleLowerCase(loc) + name.slice(2);
  // kısaltma ya da sayı ile başlayanlara dokunma (V ilmek, 1×1 lastik)
  if (/^[A-ZÇĞİÖŞÜ0-9][A-ZÇĞİÖŞÜ0-9×/-]/.test(name) || /^[A-Z][- ]/.test(name)) return name;
  return name.charAt(0).toLocaleLowerCase(loc) + name.slice(1);
}
