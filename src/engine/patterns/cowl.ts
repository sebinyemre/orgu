/**
 * Şiş boyunluk: misinalı şişte yuvarlak örülen tüp. Desenin yuvarlak talimatları kullanılır;
 * kıvrılan desenlerde (jarse) iki uca haraşo ya da lastik kenar eklenir.
 */
import type { GeneratedPattern } from '@/types';
import { lcm, nearestMultiple } from '@/engine/math/gauge';
import { metersForArea } from '@/engine/math/yarn';
import { PATTERN_BY_ID, STITCH_PATTERNS } from '@/knowledge/stitchPatterns';
import { PatternBuilder, assertMath } from './builder';
import { L, WORDS, FINISH, abbreviations, colorAt, gaugeLabel, gaugeText, isSynthetic, notions, resolveGauge, splitMeters, storeParams, toolMaterial, yarnMaterials, type AbbrKey, inlineName } from './common';
import { len } from './fmt';
import { KT, ROW_REPEAT, areaFactor, effGauge, toRepeat } from './knitCommon';
import type { PatternParams } from './types';

/** Yuvarlak talimatı olan şiş desenleri */
export const COWL_STITCHES = STITCH_PATTERNS.filter((s) => s.craft === 'knit' && s.round).map((s) => s.id);

export function cowlPlan(stitchId: string, circumferenceCm: number, heightCm: number, edge: 'none' | 'rib' | 'garter', g: { stitches: number; rows: number }) {
  const sp = PATTERN_BY_ID[stitchId];
  const eg = effGauge(g, sp);
  const edgeMult = edge === 'rib' ? 2 : 1;
  const M = lcm(sp.round?.multiple ?? 1, edgeMult);
  const castOn = nearestMultiple((circumferenceCm * eg.stitches) / 10, M, 0, Math.max(M * 4, 40));
  const edgeRows = edge === 'none' ? 0 : edge === 'garter' ? 6 : Math.max(4, Math.round((3 * g.rows) / 10));
  const edgeCm = edge === 'none' ? 0 : edge === 'garter' ? (edgeRows * 10) / (g.rows * 1.5) : (edgeRows * 10) / g.rows;
  const rep = ROW_REPEAT[stitchId] ?? 2;
  const bodyRows = toRepeat(Math.max(4, Math.round(((heightCm - 2 * edgeCm) * eg.rows) / 10)), sp.round && sp.round.rows.length > 1 ? rep : 1);
  return { castOn, edgeRows, edgeCm, bodyRows, circumference: (castOn * 10) / eg.stitches, height: 2 * edgeCm + (bodyRows * 10) / eg.rows };
}

const TX = L(
  {
    title: (st: string) => `Boyunluk · ${st}`,
    summary: (st: string, c: string, h: string) => `${c} çevresinde, ${h} yüksekliğinde, misinalı şişte dikişsiz örülen boyunluk. Desen: ${st}.`,
    size: (c: string, h: string) => `Çevre yaklaşık ${c}, yükseklik ${h}`,
    sEdge: 'Alt kenar',
    sBody: 'Gövde',
    sTop: 'Üst kenar',
    garter: 'Haraşo kenar: 1 tur düz, 1 tur ters örerek ilerle.',
    rib: '*1 düz, 1 ters* tur sonuna kadar tekrarla (1×1 lastik).',
    until: (x: string) => `Boyunluk ${x} olana kadar devam et; son tekrarı tamamla.`,
    start: 'Desene geç.',
    noteTwist: 'Birleştirirken ilmekler burulursa boyunluk bir kez bükülmüş halka olur (Möbius). Bunu istemiyorsan ilk turda sök, yeniden diz.',
  },
  {
    title: (st: string) => `Cowl · ${st}`,
    summary: (st: string, c: string, h: string) => `A seamless cowl ${c} around and ${h} tall, knitted in the round on a circular needle. Pattern: ${st}.`,
    size: (c: string, h: string) => `About ${c} around, ${h} tall`,
    sEdge: 'Lower edge',
    sBody: 'Body',
    sTop: 'Upper edge',
    garter: 'Garter edge: alternate 1 knit round and 1 purl round.',
    rib: '*K1, p1*; repeat to end (1×1 rib).',
    until: (x: string) => `Continue until the cowl measures ${x}; finish the last repeat.`,
    start: 'Change to the stitch pattern.',
    noteTwist: 'If the stitches twist when you join, the cowl becomes a Möbius loop. If you do not want that, undo the first round and join again.',
  },
  {
    title: (st: string) => `Cuello · ${st}`,
    summary: (st: string, c: string, h: string) => `Cuello sin costuras de ${c} de contorno y ${h} de alto, tejido en redondo con aguja circular. Punto: ${st}.`,
    size: (c: string, h: string) => `Unos ${c} de contorno y ${h} de alto`,
    sEdge: 'Borde inferior',
    sBody: 'Cuerpo',
    sTop: 'Borde superior',
    garter: 'Borde de punto bobo: alternar 1 vuelta al derecho y 1 vuelta al revés.',
    rib: '*1 d, 1 r*; repetir hasta el final (elástico 1×1).',
    until: (x: string) => `Seguir hasta que el cuello mida ${x}; termina la última repetición.`,
    start: 'Pasar al punto elegido.',
    noteTwist: 'Si los puntos se tuercen al unir, el cuello queda como un aro de Möbius. Si no lo quieres, deshaz la primera vuelta y vuelve a unir.',
  },
  {
    title: (st: string) => `Gola · ${st}`,
    summary: (st: string, c: string, h: string) => `Gola sem costura de ${c} de circunferência e ${h} de altura, tricotada em circular. Ponto: ${st}.`,
    size: (c: string, h: string) => `Cerca de ${c} de circunferência e ${h} de altura`,
    sEdge: 'Borda inferior',
    sBody: 'Corpo',
    sTop: 'Borda superior',
    garter: 'Borda em ponto liga: alternar 1 volta em meia e 1 volta em tricô.',
    rib: '*1 m, 1 t*; repetir até o final (ribana 1×1).',
    until: (x: string) => `Continuar até a gola medir ${x}; complete a última repetição.`,
    start: 'Passar para o ponto escolhido.',
    noteTwist: 'Se os pontos torcerem na união, a gola vira um anel de Möbius. Se não quiser, desmanche a primeira volta e una de novo.',
  },
);

export function cowl(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const K = KT[lang];
  const W = WORDS[lang];
  const sp = COWL_STITCHES.includes(p.stitchId ?? '') ? PATTERN_BY_ID[p.stitchId!] : PATTERN_BY_ID.pirinc;
  const edge = p.edge === 'rib' || p.edge === 'garter' || p.edge === 'none' ? p.edge : sp.curls ? 'garter' : 'none';
  const g = resolveGauge(p, 'knit', 'jarse');
  const plan = cowlPlan(sp.id, p.circumferenceCm ?? 65, p.heightCm ?? 25, edge, g);
  assertMath(plan.castOn % (sp.round?.multiple ?? 1) === 0, 'boyunluk ilmek sayısı');
  const color = p.yarn.colors.length > 1 ? colorAt(p.yarn, 0) : undefined;
  const cEdge = p.yarn.colors.length > 1 ? colorAt(p.yarn, 1) : undefined;

  const b = new PatternBuilder('boyunluk', 'knit', ctx);
  b.section('a', edge === 'none' ? T.sBody : T.sEdge);
  b.step(K.castOnLabel, K.castOnCirc(plan.castOn), { count: plan.castOn, color: cEdge ?? color });
  b.step(K.joinLabel, K.join, { count: plan.castOn });
  let n = 1;
  const edgeText = edge === 'garter' ? T.garter : T.rib;
  if (edge !== 'none') {
    b.step(W.rnds(n, n + plan.edgeRows - 1), edgeText, { count: plan.castOn, repeat: plan.edgeRows, color: cEdge, lessonIds: edge === 'garter' ? ['sis-haraso', 'sis-ters-ilmek'] : ['sis-lastik'] });
    n += plan.edgeRows;
    b.section('b', T.sBody);
  }
  const w = sp.round!;
  const until = T.until(len(plan.height - plan.edgeCm, p.units, lang));
  if (w.rows.length === 1) {
    b.step(W.rnds(n, n + plan.bodyRows - 1), `${w.rows[0].text[lang]} ${until}`, { count: plan.castOn, repeat: plan.bodyRows, color, lessonIds: sp.lessonIds });
  } else {
    b.step(T.start, w.note?.[lang] ?? sp.summary[lang]);
    for (const r of w.rows) b.step(r.label[lang], r.text[lang], { count: plan.castOn, color, lessonIds: sp.lessonIds });
    b.step(W.rnds(n, n + plan.bodyRows - 1), `${w.repeat?.[lang] ?? ''} ${until}`.trim(), { count: plan.castOn, repeat: plan.bodyRows, color });
  }
  n += plan.bodyRows;
  if (edge !== 'none') {
    b.section('c', T.sTop);
    b.step(W.rnds(n, n + plan.edgeRows - 1), edgeText, { count: plan.castOn, repeat: plan.edgeRows, color: cEdge });
  }
  b.step(K.bindOffLabel, K.bindOff);
  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, FINISH[lang].weaveKnit);
  b.step(FINISH[lang].finishing, isSynthetic(p.yarn) ? FINISH[lang].blockAcrylic : FINISH[lang].block);

  const bodyM = metersForArea(plan.circumference, plan.height - 2 * plan.edgeCm, g, 'knit', areaFactor(sp));
  const edgeM = edge === 'none' ? 0 : metersForArea(plan.circumference, 2 * plan.edgeCm, g, 'knit', 1.05);
  const total = bodyM + edgeM + 1;
  const colorM = p.yarn.colors.length > 1 && edge !== 'none' ? splitMeters(total, [bodyM, edgeM]) : null;
  const keys: AbbrKey[] = ['co', 'bor', 'pm', 'k', 'p', 'bo', 'st', 'rep'];
  if (sp.category === 'burgu') keys.push('cable');
  const cStr = len(plan.circumference, p.units, lang);
  const hStr = len(plan.height, p.units, lang);
  return b.build({
    title: p.overrides?.title ?? T.title(sp.name[lang]),
    summary: p.overrides?.summary ?? T.summary(inlineName(sp.name[lang], lang), cStr, hStr),
    materials: [
      ...yarnMaterials(p.yarn, total, colorM, lang, p.units),
      ...toolMaterial(p.toolMm, 'sis-misinali', lang, plan.circumference),
      ...notions(['marker1', ...(sp.category === 'burgu' ? (['cableNeedle'] as const) : []), 'tapestry', 'scissors'], lang),
    ],
    gauge: g,
    yarnMeters: total,
    finishedSize: T.size(cStr, hStr),
    abbreviations: abbreviations(keys, lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteTwist, ...sp.tips.slice(0, 1).map((t) => t[lang]), FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram: { kind: 'schematic', shape: 'tube', widthCm: plan.circumference / 2, heightCm: plan.height, labels: { width: cStr, height: hStr } },
    params: storeParams(p, { gaugeLabel: gaugeText(g, 'jarse', lang, p.units), gaugeStitch: gaugeLabel('jarse', lang), castOn: plan.castOn }),
  });
}
