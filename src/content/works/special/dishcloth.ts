/**
 * Şiş pirinç örgü bulaşık bezi: kare, haraşo kenarlı. Ortadaki ilmek sayısı tek olduğu için
 * pirinç örgü her sıra aynı talimatla örülür.
 */
import type { GeneratedPattern } from '@/types';
import { castOnFor, rowsFor } from '@/engine/math/gauge';
import { metersForArea } from '@/engine/math/yarn';
import { PatternBuilder } from '@/engine/patterns/builder';
import { L, WORDS, FINISH, abbreviations, colorAt, gaugeLabel, gaugeText, notions, resolveGauge, splitMeters, storeParams, toolMaterial, yarnMaterials, sizeWxH } from '@/engine/patterns/common';
import { KT } from '@/engine/patterns/knitCommon';
import { len } from '@/engine/patterns/fmt';
import type { PatternParams } from '@/engine/patterns';

export const CLOTH_BORDER = 3;
export const CLOTH_BORDER_ROWS = 4;

export function dishclothPlan(sizeCm: number, g: { stitches: number; rows: number }) {
  const borderCm = (CLOTH_BORDER * 10) / g.stitches;
  const center = castOnFor(sizeCm - 2 * borderCm, g.stitches, 2, 1).best.stitches;
  const castOn = center + 2 * CLOTH_BORDER;
  const borderRowsCm = (CLOTH_BORDER_ROWS * 10) / (g.rows * 1.5);
  const seedRows = rowsFor(sizeCm - 2 * borderRowsCm, g.rows * 1.15);
  return { center, castOn, seedRows, widthCm: (castOn * 10) / g.stitches, heightCm: 2 * borderRowsCm + (seedRows * 10) / (g.rows * 1.15) };
}

const TX = L(
  {
    title: 'Pirinç örgü bulaşık bezi',
    summary: 'Haraşo kenarlı, pirinç örgü kare bez. Pamuk ip suyu iyi çeker ve her yıkamada yumuşar; düz ve ters ilmeği pekiştirmek için birebir.',
    size: (s: string) => `Yaklaşık ${s}`,
    sMain: 'Bez',
    garter: (n: number) => `Haraşo kenar: tüm ilmekleri düz ör (${n} sıra).`,
    seed: (b: number) => `${b} düz, 1 düz, *1 ters, 1 düz* son ${b} ilmeğe kadar tekrarla, ${b} düz.`,
    until: (x: string) => `Bez ${x} olana kadar bu sırayı tekrarla.`,
    noteCotton: 'Bulaşık bezi için %100 pamuk seç; akrilik suyu çekmez.',
    noteSeed: 'Pirinç örgüde kural: düz görünen ilmeği ters, ters görünen ilmeği düz ör. Ortadaki ilmek sayısı tek olduğu için her sıra aynı başlar ve biter.',
  },
  {
    title: 'Seed stitch dishcloth',
    summary: 'A square cloth in seed stitch with a garter border. Cotton is absorbent and softens with every wash: perfect for practicing knit and purl.',
    size: (s: string) => `About ${s}`,
    sMain: 'Cloth',
    garter: (n: number) => `Garter border: knit all sts (${n} rows).`,
    seed: (b: number) => `K${b}, k1, *p1, k1* to last ${b} sts, k${b}.`,
    until: (x: string) => `Repeat this row until the cloth measures ${x}.`,
    noteCotton: 'Choose 100% cotton for a dishcloth; acrylic does not absorb water.',
    noteSeed: 'The seed stitch rule: purl the stitches that look like knits and knit the ones that look like purls. With an odd center count every row starts and ends the same way.',
  },
  {
    title: 'Paño de cocina en punto arroz',
    summary: 'Un paño cuadrado en punto arroz con borde de punto bobo. El algodón absorbe bien y se suaviza con cada lavado: ideal para practicar derecho y revés.',
    size: (s: string) => `Unos ${s}`,
    sMain: 'Paño',
    garter: (n: number) => `Borde de punto bobo: tejer todo al derecho (${n} vueltas).`,
    seed: (b: number) => `${b} d, 1 d, *1 r, 1 d* hasta los últimos ${b} puntos, ${b} d.`,
    until: (x: string) => `Repetir esta vuelta hasta que el paño mida ${x}.`,
    noteCotton: 'Para un paño de cocina elige algodón 100 %; el acrílico no absorbe.',
    noteSeed: 'La regla del punto arroz: teje al revés los puntos que se ven al derecho y al derecho los que se ven al revés. Con número impar en el centro, todas las vueltas empiezan y terminan igual.',
  },
  {
    title: 'Pano de prato em ponto arroz',
    summary: 'Um pano quadrado em ponto arroz com borda em ponto liga. O algodão absorve bem e fica mais macio a cada lavagem: ótimo para praticar meia e tricô.',
    size: (s: string) => `Cerca de ${s}`,
    sMain: 'Pano',
    garter: (n: number) => `Borda em ponto liga: tricotar tudo em meia (${n} carreiras).`,
    seed: (b: number) => `${b} m, 1 m, *1 t, 1 m* até os últimos ${b} pontos, ${b} m.`,
    until: (x: string) => `Repetir esta carreira até o pano medir ${x}.`,
    noteCotton: 'Para pano de prato escolha algodão 100%; o acrílico não absorve.',
    noteSeed: 'A regra do ponto arroz: faça em tricô os pontos que parecem meia e em meia os que parecem tricô. Com número ímpar no centro, todas as carreiras começam e terminam igual.',
  },
);

export function dishcloth(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const K = KT[lang];
  const g = resolveGauge(p, 'knit', 'jarse');
  const plan = dishclothPlan(p.sizeCm ?? 22, g);
  const multi = p.yarn.colors.length > 1;
  const cB = multi ? colorAt(p.yarn, 1) : undefined;
  const cM = multi ? colorAt(p.yarn, 0) : undefined;
  const b = new PatternBuilder('bulasik-bezi', 'knit', ctx);
  b.section('a', T.sMain);
  b.step(K.castOnLabel, K.castOn(plan.castOn), { count: plan.castOn, color: cB ?? cM });
  b.step(W.rows(1, CLOTH_BORDER_ROWS), T.garter(CLOTH_BORDER_ROWS), { count: plan.castOn, repeat: CLOTH_BORDER_ROWS, color: cB ?? cM, lessonIds: ['sis-haraso'] });
  const s = CLOTH_BORDER_ROWS + 1;
  const e = CLOTH_BORDER_ROWS + plan.seedRows;
  b.step(W.rows(s, e), `${T.seed(CLOTH_BORDER)} ${T.until(len(plan.heightCm - (CLOTH_BORDER_ROWS * 10) / (g.rows * 1.5), p.units, lang))}`, { count: plan.castOn, repeat: plan.seedRows, color: cM, lessonIds: ['sis-pirinc'] });
  b.step(W.rows(e + 1, e + CLOTH_BORDER_ROWS), T.garter(CLOTH_BORDER_ROWS), { count: plan.castOn, repeat: CLOTH_BORDER_ROWS, color: cB ?? cM });
  b.step(K.bindOffLabel, K.bindOffKnit);
  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, FINISH[lang].weaveKnit);

  const total = metersForArea(plan.widthCm, plan.heightCm, g, 'knit', 1.08) + 1;
  const size = sizeWxH(plan.widthCm, plan.heightCm, p.units, lang);
  return b.build({
    title: p.overrides?.title ?? T.title,
    summary: p.overrides?.summary ?? T.summary,
    materials: [...yarnMaterials(p.yarn, total, multi ? splitMeters(total, [0.8, 0.2]) : null, lang, p.units), ...toolMaterial(p.toolMm, 'sis-duz', lang), ...notions(['tapestry', 'scissors'], lang)],
    gauge: g,
    yarnMeters: total,
    finishedSize: T.size(size),
    abbreviations: abbreviations(['co', 'k', 'p', 'bo', 'st', 'rep'], lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteSeed, T.noteCotton, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram: { kind: 'schematic', shape: 'rect', widthCm: plan.widthCm, heightCm: plan.heightCm, labels: { width: len(plan.widthCm, p.units, lang), height: len(plan.heightCm, p.units, lang) } },
    params: storeParams(p, { gaugeLabel: gaugeText(g, 'jarse', lang, p.units), gaugeStitch: gaugeLabel('jarse', lang), castOn: plan.castOn }),
  });
}
