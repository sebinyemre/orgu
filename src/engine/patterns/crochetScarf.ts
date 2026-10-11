/**
 * Tığ atkı: {sc}, {hdc}, {dc}, kum taneleri (moss), V ilmek ya da yelpaze desenleriyle.
 * Temel zincir, desen katına (multiple + plus) ve dönüş zincirine göre hesaplanır.
 */
import type { GeneratedPattern, Lang } from '@/types';
import { castOnFor, rowsFor } from '@/engine/math/gauge';
import { metersForArea } from '@/engine/math/yarn';
import { PATTERN_BY_ID } from '@/knowledge/stitchPatterns';
import { PatternBuilder, assertMath, lk } from './builder';
import { L, WORDS, FINISH, abbreviations, colorAt, colorName, gaugeLabel, gaugeText, notions, resolveGauge, splitMeters, storeParams, toolMaterial, yarnMaterials, sizeWxH, isSynthetic, inlineName, type AbbrKey } from './common';
import { len } from './fmt';
import type { CrochetStitch, PatternParams } from './types';
import { fringeMeters, fringeSteps } from './fringe';

export const CROCHET_SCARF_STITCHES = ['tig-sik-igne', 'tig-yarim-trabzan', 'tig-trabzan', 'tig-kum', 'tig-v', 'tig-yelpaze'] as const;
export type CrochetScarfStitch = (typeof CROCHET_SCARF_STITCHES)[number];

export const BASE_STITCH: Record<CrochetScarfStitch, CrochetStitch> = {
  'tig-sik-igne': 'sc',
  'tig-yarim-trabzan': 'hdc',
  'tig-trabzan': 'dc',
  'tig-kum': 'sc',
  'tig-v': 'dc',
  'tig-yelpaze': 'dc',
};

/** Temel zincir = ilmek + bu kadar */
const CHAIN_EXTRA: Record<CrochetScarfStitch, number> = { 'tig-sik-igne': 1, 'tig-yarim-trabzan': 2, 'tig-trabzan': 2, 'tig-kum': 2, 'tig-v': 2, 'tig-yelpaze': 1 };

export interface ScarfPlan {
  sts: number;
  chain: number;
  rows: number;
  /** desen birimi: V sayısı, yelpaze sayısı… */
  units: number;
  widthCm: number;
  lengthCm: number;
}

export function crochetScarfPlan(stitchId: CrochetScarfStitch, widthCm: number, lengthCm: number, g: { stitches: number; rows: number }): ScarfPlan {
  const sp = PATTERN_BY_ID[stitchId];
  const co = castOnFor(widthCm, g.stitches, sp.flat.multiple, sp.flat.plus).best.stitches;
  let rows = rowsFor(lengthCm, g.rows);
  if (stitchId === 'tig-yelpaze' && rows % 2 === 0) rows += 1;
  const units = stitchId === 'tig-v' ? (co - 2) / 3 : stitchId === 'tig-yelpaze' ? (co - 1) / 6 : stitchId === 'tig-kum' ? co / 2 : co;
  return { sts: co, chain: co + CHAIN_EXTRA[stitchId], rows, units, widthCm: (co * 10) / g.stitches, lengthCm: (rows * 10) / g.rows };
}

interface RowTexts {
  foundation: (n: number) => string;
  row1: (u: number) => string;
  row2: (u: number) => string;
  row3?: (u: number) => string;
  unit: (u: number) => string;
}

function texts(lang: Lang, id: CrochetScarfStitch): RowTexts {
  const turnLink = (t: string) => lk('tig-donus', t);
  const U: Record<Lang, { found: (n: number) => string; turn: string }> = {
    tr: { found: (n) => `${n} ${lk('tig-zincir', 'zincir')} çek.`, turn: 'İşi çevir.' },
    en: { found: (n) => `${lk('tig-zincir', 'Ch')} ${n}.`, turn: 'Turn.' },
    es: { found: (n) => `${n} ${lk('tig-zincir', 'cad')}.`, turn: 'Girar.' },
    pt: { found: (n) => `${n} ${lk('tig-zincir', 'corr')}.`, turn: 'Virar.' },
  };
  const u = U[lang];
  const base = { foundation: u.found };
  const t = {
    tr: {
      'tig-sik-igne': {
        row1: () => `Tığdan itibaren 2. zincire 1 {sc}, sonraki her zincire 1 {sc}. ${u.turn}`,
        row2: () => `1 zincir (${turnLink('dönüş zinciri')}, ilmek sayılmaz), her ilmeğe 1 {sc}. ${u.turn}`,
        unit: (n: number) => `${n} {sc}`,
      },
      'tig-yarim-trabzan': {
        row1: () => `Tığdan itibaren 3. zincire 1 {hdc}, sonraki her zincire 1 {hdc}. ${u.turn}`,
        row2: () => `2 zincir (${turnLink('dönüş zinciri')}, ilmek sayılmaz), her ilmeğe 1 {hdc}. ${u.turn}`,
        unit: (n: number) => `${n} {hdc}`,
      },
      'tig-trabzan': {
        row1: () => `Tığdan itibaren 4. zincire 1 {dc} (atlanan 3 zincir ilk ilmek sayılır), sonraki her zincire 1 {dc}. ${u.turn}`,
        row2: () => `3 zincir (${turnLink('dönüş zinciri')}, ilk ilmek sayılır), ilk ilmeği atla, sonraki her ilmeğe 1 {dc}; son {dc} dönüş zincirinin tepesine. ${u.turn}`,
        unit: (n: number) => `${n} {dc}`,
      },
      'tig-kum': {
        row1: () => `Tığdan itibaren 4. zincire 1 {sc}, *1 zincir, 1 zincir atla, sonraki zincire 1 {sc}* sıra sonuna kadar tekrarla. ${u.turn}`,
        row2: () => `2 zincir (${turnLink('dönüş zinciri')}), ilk 1 zincir boşluğuna 1 {sc}, *1 zincir, sonraki boşluğa 1 {sc}* tekrarla; son {sc} dönüş zinciri boşluğuna. ${u.turn}`,
        unit: (n: number) => `${n} {sc} ve ${n} boşluk`,
      },
      'tig-v': {
        row1: (m: number) => `Tığdan itibaren 5. zincire (1 {dc}, 1 zincir, 1 {dc}) = ${lk('tig-v-ilmek', 'V ilmek')}. *2 zincir atla, sonraki zincire 1 V* ${m - 1} kez tekrarla, 1 zincir atla, son zincire 1 {dc}. ${u.turn}`,
        row2: () => `3 zincir (ilk {dc} sayılır), her V'nin ortasındaki boşluğa 1 V, dönüş zincirinin tepesine 1 {dc}. ${u.turn}`,
        unit: (n: number) => `${n} V ve 2 kenar {dc}`,
      },
      'tig-yelpaze': {
        row1: (k: number) => `Tığdan itibaren 2. zincire 1 {sc}, *2 zincir atla, sonraki zincire 5 {dc} (${lk('tig-yelpaze', 'yelpaze')}), 2 zincir atla, sonraki zincire 1 {sc}* ${k} kez tekrarla. ${u.turn}`,
        row2: (k: number) => `3 zincir (ilk {dc} sayılır), ilk ilmeğe 2 {dc}, *sonraki yelpazenin ortadaki ilmeğine 1 {sc}, sonraki {sc} ilmeğine 5 {dc}* ${k - 1} kez tekrarla, son yelpazenin ortasına 1 {sc}, son ilmeğe 3 {dc}. ${u.turn}`,
        row3: (k: number) => `1 zincir, ilk ilmeğe 1 {sc}, *sonraki {sc} ilmeğine 5 {dc}, sonraki yelpazenin ortasına 1 {sc}* ${k - 1} kez tekrarla, sonraki {sc} ilmeğine 5 {dc}, dönüş zincirinin tepesine 1 {sc}. ${u.turn}`,
        unit: (n: number) => `${n} yelpaze`,
      },
    },
    en: {
      'tig-sik-igne': {
        row1: () => `{sc.a} in 2nd ch from hook and in each ch across. ${u.turn}`,
        row2: () => `Ch 1 (${turnLink('turning chain')}, does not count as a st), {sc.a} in each st across. ${u.turn}`,
        unit: (n: number) => `${n} {sc.a}`,
      },
      'tig-yarim-trabzan': {
        row1: () => `{hdc.a} in 3rd ch from hook and in each ch across. ${u.turn}`,
        row2: () => `Ch 2 (${turnLink('turning chain')}, does not count as a st), {hdc.a} in each st across. ${u.turn}`,
        unit: (n: number) => `${n} {hdc.a}`,
      },
      'tig-trabzan': {
        row1: () => `{dc.a} in 4th ch from hook (the skipped 3 ch count as the first st) and in each ch across. ${u.turn}`,
        row2: () => `Ch 3 (${turnLink('turning chain')}, counts as first st), skip the first st, {dc.a} in each st across, working the last {dc.a} into the top of the turning chain. ${u.turn}`,
        unit: (n: number) => `${n} {dc.a}`,
      },
      'tig-kum': {
        row1: () => `{sc.a} in 4th ch from hook, *ch 1, sk 1 ch, {sc.a} in next ch* across. ${u.turn}`,
        row2: () => `Ch 2 (${turnLink('turning chain')}), {sc.a} in first ch-1 sp, *ch 1, {sc.a} in next ch-1 sp* across, working the last {sc.a} into the turning-chain space. ${u.turn}`,
        unit: (n: number) => `${n} {sc.a} and ${n} spaces`,
      },
      'tig-v': {
        row1: (m: number) => `({dc.a}, ch 1, {dc.a}) in 5th ch from hook = ${lk('tig-v-ilmek', 'V-st')}. *Sk 2 ch, V-st in next ch* ${m - 1} times, sk 1 ch, {dc.a} in last ch. ${u.turn}`,
        row2: () => `Ch 3 (counts as {dc.a}), V-st in the ch-1 sp at the center of each V across, {dc.a} in top of turning chain. ${u.turn}`,
        unit: (n: number) => `${n} V-sts and 2 edge {dc.a}`,
      },
      'tig-yelpaze': {
        row1: (k: number) => `{sc.a} in 2nd ch from hook, *sk 2 ch, 5 {dc.a} in next ch (${lk('tig-yelpaze', 'shell')}), sk 2 ch, {sc.a} in next ch* ${k} times. ${u.turn}`,
        row2: (k: number) => `Ch 3 (counts as {dc.a}), 2 {dc.a} in first st, *{sc.a} in center {dc.a} of next shell, 5 {dc.a} in next {sc.a}* ${k - 1} times, {sc.a} in center of last shell, 3 {dc.a} in last st. ${u.turn}`,
        row3: (k: number) => `Ch 1, {sc.a} in first st, *5 {dc.a} in next {sc.a}, {sc.a} in center {dc.a} of next shell* ${k - 1} times, 5 {dc.a} in next {sc.a}, {sc.a} in top of turning chain. ${u.turn}`,
        unit: (n: number) => `${n} shells`,
      },
    },
    es: {
      'tig-sik-igne': {
        row1: () => `1 {sc.a} en la 2.ª cad desde el ganchillo y 1 en cada cad. ${u.turn}`,
        row2: () => `1 cad (${turnLink('cadeneta de giro')}, no cuenta como punto), 1 {sc.a} en cada punto. ${u.turn}`,
        unit: (n: number) => `${n} {sc.a}`,
      },
      'tig-yarim-trabzan': {
        row1: () => `1 {hdc.a} en la 3.ª cad desde el ganchillo y 1 en cada cad. ${u.turn}`,
        row2: () => `2 cad (${turnLink('cadeneta de giro')}, no cuentan como punto), 1 {hdc.a} en cada punto. ${u.turn}`,
        unit: (n: number) => `${n} {hdc.a}`,
      },
      'tig-trabzan': {
        row1: () => `1 {dc.a} en la 4.ª cad desde el ganchillo (las 3 cad saltadas cuentan como primer punto) y 1 en cada cad. ${u.turn}`,
        row2: () => `3 cad (${turnLink('cadeneta de giro')}, cuentan como primer punto), saltar el primer punto, 1 {dc.a} en cada punto; el último en la cadeneta de giro. ${u.turn}`,
        unit: (n: number) => `${n} {dc.a}`,
      },
      'tig-kum': {
        row1: () => `1 {sc.a} en la 4.ª cad desde el ganchillo, *1 cad, saltar 1 cad, 1 {sc.a} en la siguiente* hasta el final. ${u.turn}`,
        row2: () => `2 cad (${turnLink('cadeneta de giro')}), 1 {sc.a} en el primer esp, *1 cad, 1 {sc.a} en el esp siguiente* hasta el final; el último en el espacio de giro. ${u.turn}`,
        unit: (n: number) => `${n} {sc.a} y ${n} espacios`,
      },
      'tig-v': {
        row1: (m: number) => `(1 {dc.a}, 1 cad, 1 {dc.a}) en la 5.ª cad desde el ganchillo = ${lk('tig-v-ilmek', 'punto V')}. *Saltar 2 cad, 1 V en la siguiente* ${m - 1} veces, saltar 1 cad, 1 {dc.a} en la última. ${u.turn}`,
        row2: () => `3 cad (cuentan como {dc.a}), 1 V en el espacio central de cada V, 1 {dc.a} en la cadeneta de giro. ${u.turn}`,
        unit: (n: number) => `${n} V y 2 {dc.a} de orilla`,
      },
      'tig-yelpaze': {
        row1: (k: number) => `1 {sc.a} en la 2.ª cad desde el ganchillo, *saltar 2 cad, 5 {dc.a} en la siguiente (${lk('tig-yelpaze', 'abanico')}), saltar 2 cad, 1 {sc.a} en la siguiente* ${k} veces. ${u.turn}`,
        row2: (k: number) => `3 cad (cuentan como {dc.a}), 2 {dc.a} en el primer punto, *1 {sc.a} en el {dc.a} central del abanico siguiente, 5 {dc.a} en el {sc.a} siguiente* ${k - 1} veces, 1 {sc.a} en el centro del último abanico, 3 {dc.a} en el último punto. ${u.turn}`,
        row3: (k: number) => `1 cad, 1 {sc.a} en el primer punto, *5 {dc.a} en el {sc.a} siguiente, 1 {sc.a} en el centro del abanico siguiente* ${k - 1} veces, 5 {dc.a} en el {sc.a} siguiente, 1 {sc.a} en la cadeneta de giro. ${u.turn}`,
        unit: (n: number) => `${n} abanicos`,
      },
    },
    pt: {
      'tig-sik-igne': {
        row1: () => `1 {sc.a} na 2ª corr a partir da agulha e 1 em cada corr. ${u.turn}`,
        row2: () => `1 corr (${turnLink('correntinha de subida')}, não conta como ponto), 1 {sc.a} em cada ponto. ${u.turn}`,
        unit: (n: number) => `${n} {sc.a}`,
      },
      'tig-yarim-trabzan': {
        row1: () => `1 {hdc.a} na 3ª corr a partir da agulha e 1 em cada corr. ${u.turn}`,
        row2: () => `2 corr (${turnLink('correntinha de subida')}, não contam como ponto), 1 {hdc.a} em cada ponto. ${u.turn}`,
        unit: (n: number) => `${n} {hdc.a}`,
      },
      'tig-trabzan': {
        row1: () => `1 {dc.a} na 4ª corr a partir da agulha (as 3 corr puladas contam como primeiro ponto) e 1 em cada corr. ${u.turn}`,
        row2: () => `3 corr (${turnLink('correntinha de subida')}, contam como primeiro ponto), pular o primeiro ponto, 1 {dc.a} em cada ponto; o último na correntinha de subida. ${u.turn}`,
        unit: (n: number) => `${n} {dc.a}`,
      },
      'tig-kum': {
        row1: () => `1 {sc.a} na 4ª corr a partir da agulha, *1 corr, pular 1 corr, 1 {sc.a} na seguinte* até o final. ${u.turn}`,
        row2: () => `2 corr (${turnLink('correntinha de subida')}), 1 {sc.a} no primeiro esp, *1 corr, 1 {sc.a} no esp seguinte* até o final; o último no espaço da subida. ${u.turn}`,
        unit: (n: number) => `${n} {sc.a} e ${n} espaços`,
      },
      'tig-v': {
        row1: (m: number) => `(1 {dc.a}, 1 corr, 1 {dc.a}) na 5ª corr a partir da agulha = ${lk('tig-v-ilmek', 'ponto V')}. *Pular 2 corr, 1 V na seguinte* ${m - 1} vezes, pular 1 corr, 1 {dc.a} na última. ${u.turn}`,
        row2: () => `3 corr (contam como {dc.a}), 1 V no espaço central de cada V, 1 {dc.a} na correntinha de subida. ${u.turn}`,
        unit: (n: number) => `${n} V e 2 {dc.a} de borda`,
      },
      'tig-yelpaze': {
        row1: (k: number) => `1 {sc.a} na 2ª corr a partir da agulha, *pular 2 corr, 5 {dc.a} na seguinte (${lk('tig-yelpaze', 'leque')}), pular 2 corr, 1 {sc.a} na seguinte* ${k} vezes. ${u.turn}`,
        row2: (k: number) => `3 corr (contam como {dc.a}), 2 {dc.a} no primeiro ponto, *1 {sc.a} no {dc.a} central do próximo leque, 5 {dc.a} no {sc.a} seguinte* ${k - 1} vezes, 1 {sc.a} no centro do último leque, 3 {dc.a} no último ponto. ${u.turn}`,
        row3: (k: number) => `1 corr, 1 {sc.a} no primeiro ponto, *5 {dc.a} no {sc.a} seguinte, 1 {sc.a} no centro do próximo leque* ${k - 1} vezes, 5 {dc.a} no {sc.a} seguinte, 1 {sc.a} na correntinha de subida. ${u.turn}`,
        unit: (n: number) => `${n} leques`,
      },
    },
  } as const;
  return { ...base, ...(t[lang][id] as Omit<RowTexts, 'foundation'>) };
}

const TX = L(
  {
    title: (st: string) => `Tığ atkı · ${st}`,
    summary: (st: string, w: string, l: string) => `${w} genişliğinde, ${l} boyunda, ${st} deseniyle gidiş-dönüş örülen atkı.`,
    sizeT: (s: string) => `Yaklaşık ${s}`,
    sMain: 'Atkı',
    found: 'Temel zincir',
    foundNote: 'Zincirleri gevşek çek ya da bir numara kalın tığ kullan; temel kenar atkının geri kalanından dar kalmasın.',
    repeatTo: (a: string, n: number, l: string) => `${a} sıraları tekrarla; toplam ${n} sıra ya da atkı ${l} olana kadar devam et.`,
    repeatRow: (n: number, l: string) => `2. sırayı tekrarla; toplam ${n} sıra ya da atkı ${l} olana kadar devam et.`,
    stripes: (_s: number, seq: string) => `${lk('tig-renk-degistirme', 'Renk düzeni')}: ${seq}; düzeni sona kadar tekrarla. Rengi, önceki sıranın son ilmeğinin son çekişinde değiştir.`,
    stripeCarry: 'Sıra sayısı çift olduğu için kullanmadığın renkleri kesme; atkının kenarından yukarı taşı.',
    stripeCut: 'Her renk değişiminde eski rengi 10 cm uç bırakıp kes.',
    seqItem: (n: number, c: string) => `${n} sıra ${c}`,
    stripeLabel: 'Şeritler',
    noteEdge: 'Kenarlar düz olsun diye her sıranın sonunda ilmek say. İlk ve son ilmekler en sık atlanan ilmeklerdir.',
  },
  {
    title: (st: string) => `Crochet scarf · ${st}`,
    summary: (st: string, w: string, l: string) => `A scarf ${w} wide and ${l} long, worked back and forth in ${st}.`,
    sizeT: (s: string) => `About ${s}`,
    sMain: 'Scarf',
    found: 'Foundation',
    foundNote: 'Chain loosely or use a hook one size larger so the foundation edge is not tighter than the rest of the scarf.',
    repeatTo: (a: string, n: number, l: string) => `Repeat ${a} until you have ${n} rows in total or the scarf measures ${l}.`,
    repeatRow: (n: number, l: string) => `Repeat row 2 until you have ${n} rows in total or the scarf measures ${l}.`,
    stripes: (_s: number, seq: string) => `${lk('tig-renk-degistirme', 'Stripe sequence')}: ${seq}; repeat the sequence to the end. Change color on the last pull-through of the last stitch of the previous row.`,
    stripeCarry: 'Because each stripe has an even number of rows, do not cut the colors you are not using; carry them up the side edge.',
    stripeCut: 'At each color change, cut the old color leaving a 10 cm (4") tail.',
    seqItem: (n: number, c: string) => `${n} rows ${c}`,
    stripeLabel: 'Stripes',
    noteEdge: 'Count your stitches at the end of every row to keep the edges straight. The first and last stitches are the ones most often missed.',
  },
  {
    title: (st: string) => `Bufanda de ganchillo · ${st}`,
    summary: (st: string, w: string, l: string) => `Bufanda de ${w} de ancho y ${l} de largo, tejida en ida y vuelta en ${st}.`,
    sizeT: (s: string) => `Unos ${s}`,
    sMain: 'Bufanda',
    found: 'Cadeneta base',
    foundNote: 'Haz las cadenetas flojas o usa un ganchillo un número más grueso para que el borde inicial no quede más estrecho.',
    repeatTo: (a: string, n: number, l: string) => `Repetir las vueltas ${a} hasta tener ${n} vueltas en total o hasta que la bufanda mida ${l}.`,
    repeatRow: (n: number, l: string) => `Repetir la vuelta 2 hasta tener ${n} vueltas en total o hasta que la bufanda mida ${l}.`,
    stripes: (_s: number, seq: string) => `${lk('tig-renk-degistirme', 'Orden de colores')}: ${seq}; repetir hasta el final. Cambiar de color en el último cierre del último punto de la vuelta anterior.`,
    stripeCarry: 'Como cada raya tiene un número par de vueltas, no cortes los colores que no usas: súbelos por el borde.',
    stripeCut: 'En cada cambio, corta el color anterior dejando 10 cm.',
    seqItem: (n: number, c: string) => `${n} vueltas ${c}`,
    stripeLabel: 'Rayas',
    noteEdge: 'Cuenta los puntos al final de cada vuelta para que los bordes queden rectos. El primero y el último son los que más se olvidan.',
  },
  {
    title: (st: string) => `Cachecol de crochê · ${st}`,
    summary: (st: string, w: string, l: string) => `Cachecol de ${w} de largura e ${l} de comprimento, feito em idas e voltas em ${st}.`,
    sizeT: (s: string) => `Cerca de ${s}`,
    sMain: 'Cachecol',
    found: 'Correntinha de base',
    foundNote: 'Faça as correntinhas frouxas ou use uma agulha um número maior para a borda inicial não ficar mais estreita.',
    repeatTo: (a: string, n: number, l: string) => `Repetir as carreiras ${a} até ter ${n} carreiras no total ou até o cachecol medir ${l}.`,
    repeatRow: (n: number, l: string) => `Repetir a carreira 2 até ter ${n} carreiras no total ou até o cachecol medir ${l}.`,
    stripes: (_s: number, seq: string) => `${lk('tig-renk-degistirme', 'Sequência de cores')}: ${seq}; repetir até o final. Trocar de cor no último fechamento do último ponto da carreira anterior.`,
    stripeCarry: 'Como cada listra tem número par de carreiras, não corte as cores que não está usando: leve-as pela lateral.',
    stripeCut: 'A cada troca, corte a cor anterior deixando 10 cm.',
    seqItem: (n: number, c: string) => `${n} carreiras ${c}`,
    stripeLabel: 'Listras',
    noteEdge: 'Conte os pontos no fim de cada carreira para as bordas ficarem retas. O primeiro e o último são os mais esquecidos.',
  },
);

export function crochetScarf(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const id = (CROCHET_SCARF_STITCHES as readonly string[]).includes(p.stitchId ?? '') ? (p.stitchId as CrochetScarfStitch) : 'tig-yarim-trabzan';
  const base = BASE_STITCH[id];
  const g = resolveGauge(p, 'crochet', base);
  const plan = crochetScarfPlan(id, p.widthCm ?? 18, p.lengthCm ?? 160, g);
  const sp = PATTERN_BY_ID[id];
  assertMath(Number.isInteger(plan.units) && plan.units > 0, 'tığ atkı desen birimi');
  const RT = texts(lang, id);
  const multi = p.yarn.colors.length > 1;
  const stripe = multi && (p.stripeRows ?? 0) > 0 ? Math.round(p.stripeRows!) : 0;
  const stName = sp.name[lang];

  const b = new PatternBuilder('atki-tig', 'crochet', ctx);
  b.section('a', T.sMain);
  b.step(T.found, RT.foundation(plan.chain), { count: plan.chain, note: T.foundNote, color: multi ? colorAt(p.yarn, 0) : undefined });
  b.step(W.row(1), RT.row1(plan.units), { count: plan.sts, note: RT.unit(plan.units), lessonIds: sp.lessonIds });
  const lStr = len(plan.lengthCm, p.units, lang);
  if (RT.row3) {
    b.step(W.row(2), RT.row2(plan.units), { count: plan.sts });
    b.step(W.row(3), RT.row3(plan.units), { count: plan.sts, note: RT.unit(plan.units) });
    b.step(W.rows(4, plan.rows), T.repeatTo({ tr: '2. ve 3.', en: 'rows 2 and 3', es: '2 y 3', pt: '2 e 3' }[lang], plan.rows, lStr), { count: plan.sts, repeat: Math.max(1, plan.rows - 3) });
  } else {
    b.step(W.row(2), RT.row2(plan.units), { count: plan.sts, note: RT.unit(plan.units) });
    b.step(W.rows(3, plan.rows), T.repeatRow(plan.rows, lStr), { count: plan.sts, repeat: Math.max(1, plan.rows - 2) });
  }
  if (stripe) {
    const seq = p.yarn.colors.map((_, i) => T.seqItem(stripe, `${W.colorLetter(i)} (${colorName(p.yarn, i, lang)})`)).join(', ');
    b.step(T.stripeLabel, `${T.stripes(stripe, seq)} ${stripe % 2 === 0 ? T.stripeCarry : T.stripeCut}`);
  }

  const fringe = !!p.fringe;
  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, FINISH[lang].weaveCrochet);
  if (fringe) fringeSteps(b, lang, plan.widthCm, p.units, 'crochet');
  b.step(FINISH[lang].finishing, isSynthetic(p.yarn) ? FINISH[lang].blockAcrylic : FINISH[lang].block);

  const factor = sp.yarnFactor;
  const yarnM = metersForArea(plan.widthCm, plan.lengthCm, g, base, factor) + (fringe ? fringeMeters(plan.widthCm) : 0);
  const colorM = stripe ? splitMeters(yarnM, p.yarn.colors.map(() => 1)) : null;
  const size = sizeWxH(plan.widthCm, plan.lengthCm, p.units, lang);
  const keys: AbbrKey[] = ['ch', base];
  if (id === 'tig-kum') keys.push('sp', 'sk');
  if (id === 'tig-v' || id === 'tig-yelpaze') keys.push('sc', 'sk', 'sp');
  keys.push('st', 'rep');
  return b.build({
    title: p.overrides?.title ?? T.title(stName),
    summary: p.overrides?.summary ?? T.summary(inlineName(stName, lang), len(plan.widthCm, p.units, lang), lStr),
    materials: [...yarnMaterials(p.yarn, yarnM, colorM, lang, p.units), ...toolMaterial(p.toolMm, 'tig', lang), ...notions(fringe ? ['tapestry', 'scissors', 'cardboard'] : ['tapestry', 'scissors'], lang)],
    gauge: g,
    yarnMeters: yarnM,
    finishedSize: T.sizeT(size),
    abbreviations: abbreviations(keys, lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteEdge, FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram: { kind: 'schematic', shape: 'rect', widthCm: plan.widthCm, heightCm: plan.lengthCm, labels: { width: len(plan.widthCm, p.units, lang), height: lStr } },
    params: storeParams(p, {
      gaugeLabel: gaugeText(g, base, lang, p.units),
      gaugeStitch: gaugeLabel(base, lang),
      castOn: plan.chain,
      rowsTotal: plan.rows,
      stripeColors: stripe ? p.yarn.colors.map((c) => c.hex) : undefined,
    }),
  });
}
