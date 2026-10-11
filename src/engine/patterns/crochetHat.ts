/**
 * Tığ bere (tepeden başlayarak): {hdc} ile düz daire (8, 16, 24…), çap ≈ bere çevresi / π olunca
 * artırmayı bırak, düz turlarla boya ulaş, kabartma lastik ya da {sc} bantla bitir.
 */
import type { GeneratedPattern, PatternDiagram } from '@/types';
import { metersForStitches } from '@/engine/math/yarn';
import { PatternBuilder, assertMath, lk } from './builder';
import { L, WORDS, FINISH, abbreviations, colorAt, gaugeLabel, gaugeText, notions, resolveGauge, storeParams, toolMaterial, yarnMaterials, type AbbrKey } from './common';
import { len } from './fmt';
import { checkCircle, circleRounds } from './coaster';
import { emitGrouped, incText, plainText, shapedPositions, type Line } from './rounds';
import type { PatternParams } from './types';

/** Tığ işi daha az esner: bere çevresi baş çevresinden %7 dar */
export const CROCHET_HAT_EASE = 0.07;

export function crochetHatPlan(headCm: number, heightCm: number, brimCm: number, brim: 'rib' | 'sc' | 'none', g: { stitches: number; rows: number }) {
  const w = 10 / g.stitches;
  const h = 10 / g.rows;
  const target = headCm * (1 - CROCHET_HAT_EASE);
  const R = Math.max(3, Math.round(target / w / 8));
  const sts = 8 * R;
  const brimH = brim === 'none' ? 0 : brimCm;
  const brimRowH = brim === 'rib' ? h * 1.3 : h * 0.75;
  const brimRounds = brim === 'none' ? 0 : Math.max(2, Math.round(brimH / brimRowH));
  const body = Math.max(1, Math.round((heightCm - brimRounds * brimRowH - R * h) / h));
  return { R, sts, body, brimRounds, circumference: sts * w, crownDiameter: (sts * w) / Math.PI, height: R * h + body * h + brimRounds * brimRowH };
}

const TX = L(
  {
    title: 'Tığ bere',
    summary: (c: string, br: string) => `Tepeden başlanan, {hdc} ile örülen dikişsiz bere. Düz bir daireyle başlar, ${c} çevreye ulaşınca düz turlarla devam eder${br}.`,
    brRib: ' ve kabartma lastikle biter',
    brSc: ' ve {sc} bantla biter',
    size: (c: string, h: string) => `Çevre yaklaşık ${c}, boy ${h}`,
    sCrown: 'Tepe',
    intro: `Turlar birleştirilir, iş çevrilmez. Her tur 2 zincirle başlar (ilmek sayılmaz); ilk {hdc} ilmeğini birleştirdiğin ilmeğe ör, turu ilk ilmeğe {slst} ile kapat.`,
    r1: `${lk('tig-sihirli-halka', 'Sihirli halka')} yap. 2 zincir, halkaya 8 {hdc} ör. Halkayı kapat, ilk ilmeğe {slst} ile birleştir.`,
    crownCheck: (d: string) => `Tepeyi düz bir yere ser: çapı yaklaşık ${d} olmalı. Küçükse bir artırma turu ekle, büyükse son artırma turunu sök.`,
    sBody: 'Gövde',
    sBrim: 'Ağız',
    rib1: `2 zincir (sayılmaz), *sonraki ilmeğe ${lk('tig-kabartma', 'ön kabartma {dc}')}, sonraki ilmeğe arka kabartma {dc}* tur sonuna kadar tekrarla; ilk ilmeğe {slst} ile birleştir.`,
    ribN: '2 zincir (sayılmaz), *ön kabartma {dc} ilmeğine ön kabartma {dc}, arka kabartma {dc} ilmeğine arka kabartma {dc}* tekrarla; ilk ilmeğe {slst} ile birleştir.',
    sc: `1 zincir (sayılmaz), her ilmeğin ${lk('tig-halkalar', 'arka halkasına')} 1 {sc}; ilk ilmeğe {slst} ile birleştir.`,
    pompom: 'Ponponu tepenin ortasına sıkıca dik.',
    noteSeam: 'Tur başları dikey bir çizgi oluşturur; bu çizgiyi bere giyilince arkada bırak.',
    noteTry: 'Gövde turlarında bereyi ara ara başına dene. Boy, tepeden ölçülür ve ağız dahildir.',
  },
  {
    title: 'Crochet beanie',
    summary: (c: string, br: string) => `A seamless top-down beanie in {hdc}. It starts as a flat circle, then works even once it reaches ${c} around${br}.`,
    brRib: ', and finishes with a post-stitch rib',
    brSc: ', and finishes with a {sc} band',
    size: (c: string, h: string) => `About ${c} around, ${h} tall`,
    sCrown: 'Crown',
    intro: `Work in joined rounds without turning. Start each round with ch 2 (does not count as a stitch), work the first {hdc.a} into the same stitch as the join and close the round with a {slst.a} into the first stitch.`,
    r1: `Make a ${lk('tig-sihirli-halka', 'magic ring')}. Ch 2, work 8 {hdc.a} into the ring. Pull it closed and join with a {slst.a} to the first stitch.`,
    crownCheck: (d: string) => `Lay the crown flat: it should measure about ${d} across. If smaller, add one more increase round; if larger, undo the last increase round.`,
    sBody: 'Body',
    sBrim: 'Brim',
    rib1: `Ch 2 (does not count), *${lk('tig-kabartma', 'FP{dc.a}')} around next st, BP{dc.a} around next st* around; join with a {slst.a} to the first st.`,
    ribN: 'Ch 2 (does not count), *FP{dc.a} around the FP{dc.a}, BP{dc.a} around the BP{dc.a}* around; join with a {slst.a} to the first st.',
    sc: `Ch 1 (does not count), 1 {sc.a} in the ${lk('tig-halkalar', 'back loop')} of each st around; join with a {slst.a} to the first st.`,
    pompom: 'Sew the pompom firmly to the center of the crown.',
    noteSeam: 'The round joins form a faint vertical line; wear it at the back.',
    noteTry: 'Try the hat on now and then while working the body. Height is measured from the crown and includes the brim.',
  },
  {
    title: 'Gorro de ganchillo',
    summary: (c: string, br: string) => `Gorro sin costuras tejido desde la coronilla en {hdc}. Empieza como un círculo plano y sigue recto al llegar a ${c} de contorno${br}.`,
    brRib: ', y termina con un elástico en relieve',
    brSc: ', y termina con una banda de {sc}',
    size: (c: string, h: string) => `Unos ${c} de contorno y ${h} de alto`,
    sCrown: 'Coronilla',
    intro: `Se teje en vueltas cerradas sin girar. Cada vuelta empieza con 2 cad (no cuentan); el primer {hdc.a} va en el mismo punto del cierre y la vuelta se cierra con {slst} en el primer punto.`,
    r1: `Hacer un ${lk('tig-sihirli-halka', 'anillo mágico')}. 2 cad, 8 {hdc.a} dentro del anillo. Cerrarlo y unir con {slst} al primer punto.`,
    crownCheck: (d: string) => `Extiende la coronilla: debe medir unos ${d} de diámetro. Si es menor, añade una vuelta de aumentos; si es mayor, deshaz la última.`,
    sBody: 'Cuerpo',
    sBrim: 'Borde',
    rib1: `2 cad (no cuentan), *1 ${lk('tig-kabartma', '{dc.a} en relieve por delante')} en el siguiente punto, 1 {dc.a} en relieve por detrás en el siguiente* alrededor; unir con {slst} al primer punto.`,
    ribN: '2 cad (no cuentan), *relieve por delante sobre los de delante, relieve por detrás sobre los de detrás* alrededor; unir con {slst} al primer punto.',
    sc: `1 cad (no cuenta), 1 {sc.a} por la ${lk('tig-halkalar', 'hebra trasera')} de cada punto; unir con {slst} al primer punto.`,
    pompom: 'Cose el pompón firmemente en el centro de la coronilla.',
    noteSeam: 'Los cierres de vuelta forman una línea vertical suave; déjala detrás.',
    noteTry: 'Pruébate el gorro de vez en cuando mientras tejes el cuerpo. El alto se mide desde la coronilla e incluye el borde.',
  },
  {
    title: 'Gorro de crochê',
    summary: (c: string, br: string) => `Gorro sem costura feito de cima para baixo em {hdc}. Começa como um círculo plano e segue reto ao chegar a ${c} de circunferência${br}.`,
    brRib: ', e termina com uma ribana em relevo',
    brSc: ', e termina com uma barra de {sc}',
    size: (c: string, h: string) => `Cerca de ${c} de circunferência e ${h} de altura`,
    sCrown: 'Topo',
    intro: `Trabalhe em voltas fechadas sem virar. Cada volta começa com 2 corr (não contam); o primeiro {hdc.a} vai no mesmo ponto do fechamento e a volta se fecha com {slst} no primeiro ponto.`,
    r1: `Fazer um ${lk('tig-sihirli-halka', 'anel mágico')}. 2 corr, 8 {hdc.a} dentro do anel. Fechar e unir com {slst} ao primeiro ponto.`,
    crownCheck: (d: string) => `Estique o topo: ele deve medir cerca de ${d} de diâmetro. Se for menor, faça mais uma volta de aumentos; se for maior, desmanche a última.`,
    sBody: 'Corpo',
    sBrim: 'Barra',
    rib1: `2 corr (não contam), *1 ${lk('tig-kabartma', '{dc.a} em relevo pela frente')} no próximo ponto, 1 {dc.a} em relevo por trás no seguinte* ao redor; unir com {slst} ao primeiro ponto.`,
    ribN: '2 corr (não contam), *relevo pela frente sobre os da frente, relevo por trás sobre os de trás* ao redor; unir com {slst} ao primeiro ponto.',
    sc: `1 corr (não conta), 1 {sc.a} na ${lk('tig-halkalar', 'alça de trás')} de cada ponto; unir com {slst} ao primeiro ponto.`,
    pompom: 'Costure o pompom firme no centro do topo.',
    noteSeam: 'Os fechamentos das voltas formam uma linha vertical discreta; deixe-a atrás.',
    noteTry: 'Experimente o gorro de vez em quando enquanto faz o corpo. A altura é medida a partir do topo e inclui a barra.',
  },
);

export function crochetHat(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const g = resolveGauge(p, 'crochet', 'hdc');
  const brim = p.brim ?? 'rib';
  const plan = crochetHatPlan(p.circumferenceCm ?? 56, p.heightCm ?? 21, p.brimCm ?? 4, brim, g);
  const crown = circleRounds(8, plan.R, true);
  assertMath(checkCircle(crown) && crown[crown.length - 1].count === plan.sts, 'bere tepesi');
  const color = p.yarn.colors.length > 1 ? colorAt(p.yarn, 0) : undefined;

  const b = new PatternBuilder('bere-tig', 'crochet', ctx);
  b.section('a', T.sCrown, T.intro);
  crown.forEach((r) => {
    const text = r.n === 1 ? T.r1 : r.m === 0 ? incText(lang, 'hdc', 8, 0, false, true) : incText(lang, 'hdc', 8, r.m, r.stag, false);
    b.step(W.rnd(r.n), text, { count: r.count, color, note: r.n === plan.R ? T.crownCheck(len(plan.crownDiameter, p.units, lang)) : undefined });
  });
  b.section('b', T.sBody);
  const bodyLines: Line[] = [];
  for (let i = 1; i <= plan.body; i++) bodyLines.push({ n: plan.R + i, text: plainText(lang, 'hdc'), count: plan.sts, color });
  emitGrouped(b, bodyLines, W.rnds);
  if (brim !== 'none') {
    b.section('c', T.sBrim);
    const start = plan.R + plan.body + 1;
    const lines: Line[] = [];
    for (let i = 0; i < plan.brimRounds; i++) lines.push({ n: start + i, text: brim === 'rib' ? (i === 0 ? T.rib1 : T.ribN) : T.sc, count: plan.sts, color: p.yarn.colors.length > 1 ? colorAt(p.yarn, 1) : undefined });
    emitGrouped(b, lines, W.rnds);
  }
  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, FINISH[lang].weaveCrochet);
  if (p.pompom) b.step(FINISH[lang].finishing, T.pompom);

  const crownSts = crown.reduce((a, r) => a + r.count, 0);
  const total = metersForStitches(crownSts + plan.body * plan.sts + plan.brimRounds * plan.sts * (brim === 'rib' ? 1.6 : 0.8), g, 'hdc', 1, 0.12);
  const brimM = brim === 'none' ? 0 : metersForStitches(plan.brimRounds * plan.sts * (brim === 'rib' ? 1.6 : 0.8), g, 'hdc', 1, 0.12);
  const colorM = p.yarn.colors.length > 1 && brim !== 'none' ? [total - brimM, brimM] : null;

  const diagram: PatternDiagram = {
    kind: 'rounds',
    craft: 'crochet',
    rounds: crown.map((r) => ({ stitches: r.count, label: String(r.n), color: color ?? colorAt(p.yarn, 0), symbol: 'hdc', incPositions: shapedPositions(r.tokens).inc })),
  };
  const cStr = len(plan.circumference, p.units, lang);
  const hStr = len(plan.height, p.units, lang);
  const keys: AbbrKey[] = ['mr', 'ch', 'slst', 'hdc', 'st', 'rep'];
  if (brim === 'rib') keys.push('fpdc', 'bpdc');
  if (brim === 'sc') keys.push('sc', 'blo');
  return b.build({
    title: p.overrides?.title ?? T.title,
    summary: p.overrides?.summary ?? T.summary(cStr, brim === 'rib' ? T.brRib : brim === 'sc' ? T.brSc : ''),
    materials: [...yarnMaterials(p.yarn, total, colorM, lang, p.units), ...toolMaterial(p.toolMm, 'tig', lang), ...notions(p.pompom ? ['tapestry', 'scissors', 'pompom'] : ['tapestry', 'scissors'], lang)],
    gauge: g,
    yarnMeters: total,
    finishedSize: T.size(cStr, hStr),
    abbreviations: abbreviations(keys, lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteTry, T.noteSeam, FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram,
    params: storeParams(p, {
      gaugeLabel: gaugeText(g, 'hdc', lang, p.units),
      gaugeStitch: gaugeLabel('hdc', lang),
      castOn: 8,
      maxStitches: plan.sts,
      extraDiagrams: [{ kind: 'schematic', shape: 'beanie', widthCm: plan.circumference / 2, heightCm: plan.height, labels: { width: cStr, height: hStr } }],
    }),
  });
}
