/**
 * Tığ file pazar çantası: {dc} ile düz yuvarlak taban, zincir halkalarından spiral file gövde,
 * {sc} bant ve iki sap.
 *
 *   Taban: 12, 24, … 12R ilmek.  File: L = 12R / 3 = 4R halka (her halka 2 ilmek atlar).
 *   Bant: her halkaya 3 {sc} → yine 12R.  Saplar: a {sc}, c zincir (k atla), 2a {sc}, c zincir (k atla), a {sc}.
 */
import type { GeneratedPattern, PatternDiagram } from '@/types';
import { PatternBuilder, assertMath, lk } from '@/engine/patterns/builder';
import { L, WORDS, FINISH, abbreviations, colorAt, gaugeLabel, gaugeText, notions, resolveGauge, storeParams, toolMaterial, yarnMaterials } from '@/engine/patterns/common';
import { circlePlan, circleRounds } from '@/engine/patterns/coaster';
import { emitGrouped, incText, shapedPositions, type Line } from '@/engine/patterns/rounds';
import { len } from '@/engine/patterns/fmt';
import { metersForStitches } from '@/engine/math/yarn';
import type { PatternParams } from '@/engine/patterns';

export function bagPlan(baseCm: number, bodyCm: number, handleCm: number, g: { stitches: number; rows: number }) {
  const { R, diameter } = circlePlan(baseCm, 12, g);
  const N = 12 * R;
  const loops = N / 3;
  const h = 10 / g.rows;
  const mesh = Math.max(6, Math.round(bodyCm / (1.6 * h)));
  const k = 2 * Math.round(N / 8);
  const a = (N - 2 * k) / 4;
  const c = Math.max(20, Math.round(handleCm / (10 / g.stitches)));
  return { R, N, loops, mesh, k, a, c, handleSts: 4 * a + 2 * c, diameter, height: mesh * 1.6 * h + 5 * h * 0.6 };
}

const TX = L(
  {
    title: 'File pazar çantası',
    summary: 'Pazar için geniş bir file çanta: {dc} ile örülen sağlam yuvarlak taban, zincir halkalarından açık bir gövde ve iki saplı {sc} bant. Pamuk ip biçimini korur ve kolay yıkanır.',
    size: (d: string, h: string) => `Taban çapı yaklaşık ${d}, boş hâlde boy ${h}; doldukça uzar`,
    sBase: 'Taban',
    baseIntro: 'Turlar birleştirilir. Her tur 2 zincirle başlar (ilmek sayılmaz) ve ilk ilmeğe {slst} ile kapanır.',
    r1: `${lk('tig-sihirli-halka', 'Sihirli halka')} yap. 2 zincir, halkaya 12 {dc}. Halkayı kapat, ilk ilmeğe {slst} ile birleştir.`,
    sMesh: 'File gövde',
    meshIntro: 'File, zincir halkalarıyla spiral örülür. Her tur "2 zincir, ilk {sc} ilmeğine 1 {dc}" ile biter: bu ikisi son halkayı oluşturur ve tığı halkanın ortasına getirir.',
    m1: (n: number) => `1 zincir, birleştirdiğin ilmeğe 1 {sc}, *5 zincir, 2 ilmek atla, sonraki ilmeğe 1 {sc}* ${n} kez tekrarla, 2 zincir, 2 ilmek atla, ilk {sc} ilmeğine 1 {dc}.`,
    mN: (n: number) => `1 zincir, az önce yaptığın {dc} ilmeğinin gövdesinin etrafına 1 {sc}, *5 zincir, sonraki 5 zincir halkasına 1 {sc}* ${n} kez tekrarla, 2 zincir, ilk {sc} ilmeğine 1 {dc}.`,
    loops: (n: number) => `${n} halka`,
    sBand: 'Bant',
    b1: '1 zincir, her halkaya 3 {sc}; ilk ilmeğe {slst} ile birleştir.',
    bN: '1 zincir, her ilmeğe 1 {sc}; ilk ilmeğe {slst} ile birleştir.',
    sHandles: 'Saplar',
    h1: (a: number, c: number, k: number) => `1 zincir, sonraki ${a} ilmeğe birer {sc}, ${c} zincir, ${k} ilmek atla, sonraki ${2 * a} ilmeğe birer {sc}, ${c} zincir, ${k} ilmek atla, son ${a} ilmeğe birer {sc}; ilk ilmeğe {slst} ile birleştir.`,
    hN: '1 zincir, her {sc} ilmeğine ve her zincire 1 {sc}; ilk ilmeğe {slst} ile birleştir.',
    noteStretch: 'File çanta doldukça uzar ve genişler; boş hâlde kısa görünmesi doğaldır.',
    noteCotton: 'Pamuk ya da pamuk-keten karışımı seç; akrilik ağır yükte fazla uzar.',
    noteHandles: 'Sapları omuza almak istersen zincir sayısını artır: her 10 zincir sapı yaklaşık 4–5 cm uzatır.',
  },
  {
    title: 'Mesh market bag',
    summary: 'A roomy string bag for the market: a sturdy round base in {dc}, an open body of chain loops and a {sc} band with two handles. Cotton keeps its shape and washes well.',
    size: (d: string, h: string) => `Base about ${d} across, ${h} tall when empty; it stretches when full`,
    sBase: 'Base',
    baseIntro: 'Work in joined rounds. Start each round with ch 2 (does not count as a stitch) and close it with a {slst.a} into the first stitch.',
    r1: `Make a ${lk('tig-sihirli-halka', 'magic ring')}. Ch 2, work 12 {dc.a} into the ring. Pull it closed and join with a {slst.a} to the first stitch.`,
    sMesh: 'Mesh body',
    meshIntro: 'The mesh is worked in a spiral of chain loops. Each round ends with "ch 2, {dc.a} into the first {sc.a}": together they make the last loop and bring the hook to its middle.',
    m1: (n: number) => `Ch 1, {sc.a} in the same st as the join, *ch 5, sk 2 sts, {sc.a} in next st* ${n} times, ch 2, sk 2 sts, {dc.a} into the first {sc.a}.`,
    mN: (n: number) => `Ch 1, {sc.a} around the post of the {dc.a} just made, *ch 5, {sc.a} in next ch-5 loop* ${n} times, ch 2, {dc.a} into the first {sc.a}.`,
    loops: (n: number) => `${n} loops`,
    sBand: 'Band',
    b1: 'Ch 1, 3 {sc.a} in each loop around; join with a {slst.a} to the first st.',
    bN: 'Ch 1, 1 {sc.a} in each st around; join with a {slst.a} to the first st.',
    sHandles: 'Handles',
    h1: (a: number, c: number, k: number) => `Ch 1, {sc.a} in each of the next ${a} sts, ch ${c}, sk ${k} sts, {sc.a} in each of the next ${2 * a} sts, ch ${c}, sk ${k} sts, {sc.a} in each of the last ${a} sts; join with a {slst.a} to the first st.`,
    hN: 'Ch 1, 1 {sc.a} in each {sc.a} and in each ch around; join with a {slst.a} to the first st.',
    noteStretch: 'A mesh bag grows longer and wider as you fill it; it is normal for it to look short when empty.',
    noteCotton: 'Choose cotton or a cotton-linen blend; acrylic stretches too much under weight.',
    noteHandles: 'For shoulder straps, add more chains: every 10 chains make the handle about 4–5 cm longer.',
  },
  {
    title: 'Bolsa de red para el mercado',
    summary: 'Una bolsa amplia para la compra: base redonda firme en {dc}, cuerpo calado de arcos de cadenetas y una banda de {sc} con dos asas. El algodón mantiene la forma y se lava bien.',
    size: (d: string, h: string) => `Base de unos ${d} de diámetro, ${h} de alto vacía; se estira al llenarla`,
    sBase: 'Base',
    baseIntro: 'Se teje en vueltas cerradas. Cada vuelta empieza con 2 cad (no cuentan) y se cierra con {slst} en el primer punto.',
    r1: `Hacer un ${lk('tig-sihirli-halka', 'anillo mágico')}. 2 cad, 12 {dc.a} dentro del anillo. Cerrarlo y unir con {slst} al primer punto.`,
    sMesh: 'Cuerpo de red',
    meshIntro: 'La red se teje en espiral con arcos de cadenetas. Cada vuelta termina con "2 cad, 1 {dc.a} en el primer {sc.a}": juntos forman el último arco y dejan el ganchillo en su centro.',
    m1: (n: number) => `1 cad, 1 {sc.a} en el mismo punto del cierre, *5 cad, saltar 2 puntos, 1 {sc.a} en el siguiente* ${n} veces, 2 cad, saltar 2 puntos, 1 {dc.a} en el primer {sc.a}.`,
    mN: (n: number) => `1 cad, 1 {sc.a} alrededor del {dc.a} recién hecho, *5 cad, 1 {sc.a} en el siguiente arco de 5 cad* ${n} veces, 2 cad, 1 {dc.a} en el primer {sc.a}.`,
    loops: (n: number) => `${n} arcos`,
    sBand: 'Banda',
    b1: '1 cad, 3 {sc.a} en cada arco; unir con {slst} al primer punto.',
    bN: '1 cad, 1 {sc.a} en cada punto; unir con {slst} al primer punto.',
    sHandles: 'Asas',
    h1: (a: number, c: number, k: number) => `1 cad, 1 {sc.a} en cada uno de los ${a} puntos siguientes, ${c} cad, saltar ${k} puntos, 1 {sc.a} en cada uno de los ${2 * a} siguientes, ${c} cad, saltar ${k} puntos, 1 {sc.a} en cada uno de los últimos ${a}; unir con {slst} al primer punto.`,
    hN: '1 cad, 1 {sc.a} en cada {sc.a} y en cada cadeneta; unir con {slst} al primer punto.',
    noteStretch: 'La bolsa de red se alarga y ensancha al llenarla; es normal que vacía parezca corta.',
    noteCotton: 'Elige algodón o algodón con lino; el acrílico se estira demasiado con peso.',
    noteHandles: 'Para llevarla al hombro, añade cadenetas: cada 10 cad alargan el asa unos 4–5 cm.',
  },
  {
    title: 'Bolsa de feira em rede',
    summary: 'Uma bolsa espaçosa para a feira: base redonda firme em {dc}, corpo vazado de arcos de correntinhas e uma barra de {sc} com duas alças. O algodão mantém a forma e lava bem.',
    size: (d: string, h: string) => `Base de cerca de ${d} de diâmetro, ${h} de altura vazia; estica quando cheia`,
    sBase: 'Base',
    baseIntro: 'Trabalhe em voltas fechadas. Cada volta começa com 2 corr (não contam) e se fecha com {slst} no primeiro ponto.',
    r1: `Fazer um ${lk('tig-sihirli-halka', 'anel mágico')}. 2 corr, 12 {dc.a} dentro do anel. Fechar e unir com {slst} ao primeiro ponto.`,
    sMesh: 'Corpo em rede',
    meshIntro: 'A rede é feita em espiral com arcos de correntinhas. Cada volta termina com "2 corr, 1 {dc.a} no primeiro {sc.a}": juntos formam o último arco e deixam a agulha no meio dele.',
    m1: (n: number) => `1 corr, 1 {sc.a} no mesmo ponto do fechamento, *5 corr, pular 2 pontos, 1 {sc.a} no seguinte* ${n} vezes, 2 corr, pular 2 pontos, 1 {dc.a} no primeiro {sc.a}.`,
    mN: (n: number) => `1 corr, 1 {sc.a} ao redor do {dc.a} recém-feito, *5 corr, 1 {sc.a} no próximo arco de 5 corr* ${n} vezes, 2 corr, 1 {dc.a} no primeiro {sc.a}.`,
    loops: (n: number) => `${n} arcos`,
    sBand: 'Barra',
    b1: '1 corr, 3 {sc.a} em cada arco; unir com {slst} ao primeiro ponto.',
    bN: '1 corr, 1 {sc.a} em cada ponto; unir com {slst} ao primeiro ponto.',
    sHandles: 'Alças',
    h1: (a: number, c: number, k: number) => `1 corr, 1 {sc.a} em cada um dos ${a} pontos seguintes, ${c} corr, pular ${k} pontos, 1 {sc.a} em cada um dos ${2 * a} seguintes, ${c} corr, pular ${k} pontos, 1 {sc.a} em cada um dos últimos ${a}; unir com {slst} ao primeiro ponto.`,
    hN: '1 corr, 1 {sc.a} em cada {sc.a} e em cada correntinha; unir com {slst} ao primeiro ponto.',
    noteStretch: 'A bolsa de rede alonga e alarga quando cheia; é normal parecer curta vazia.',
    noteCotton: 'Escolha algodão ou algodão com linho; o acrílico estica demais com peso.',
    noteHandles: 'Para levar no ombro, aumente as correntinhas: cada 10 corr alongam a alça cerca de 4–5 cm.',
  },
);

export function marketBag(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const g = resolveGauge(p, 'crochet', 'dc');
  const plan = bagPlan(p.baseCm ?? 18, p.bodyCm ?? 30, p.handleCm ?? 30, g);
  const color = p.yarn.colors.length > 1 ? colorAt(p.yarn, 0) : undefined;
  const cBand = p.yarn.colors.length > 1 ? colorAt(p.yarn, 1) : undefined;
  const base = circleRounds(12, plan.R, true);
  assertMath(plan.loops * 3 === plan.N && 4 * plan.a + 2 * plan.k === plan.N && plan.a > 0, 'file çanta');

  const b = new PatternBuilder('file-canta', 'crochet', ctx);
  b.section('a', T.sBase, T.baseIntro);
  base.forEach((r) => {
    const text = r.n === 1 ? T.r1 : r.m === 0 ? incText(lang, 'dc', 12, 0, false, true) : incText(lang, 'dc', 12, r.m, r.stag, false);
    b.step(W.rnd(r.n), text, { count: r.count, color });
  });
  let n = plan.R + 1;
  b.section('b', T.sMesh, T.meshIntro);
  b.step(W.rnd(n++), T.m1(plan.loops - 1), { color, note: T.loops(plan.loops) });
  b.step(W.rnds(n, n + plan.mesh - 2), T.mN(plan.loops - 1), { color, repeat: plan.mesh - 1, note: T.loops(plan.loops) });
  n += plan.mesh - 1;
  b.section('c', T.sBand);
  const band: Line[] = [{ n: n++, text: T.b1, count: plan.N, color: cBand }];
  for (let i = 0; i < 2; i++) band.push({ n: n++, text: T.bN, count: plan.N, color: cBand });
  emitGrouped(b, band, W.rnds);
  b.section('d', T.sHandles);
  b.step(W.rnd(n++), T.h1(plan.a, plan.c, plan.k), { count: plan.handleSts, color: cBand });
  b.step(W.rnds(n, n + 1), T.hN, { count: plan.handleSts, repeat: 2, color: cBand });
  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, FINISH[lang].weaveCrochet);

  const baseSts = base.reduce((s, r) => s + r.count, 0);
  const meshSts = plan.mesh * plan.loops * (1 + 5 * 0.4);
  const bandSts = 3 * plan.N + 3 * plan.handleSts;
  const bodyM = metersForStitches(baseSts + meshSts, g, 'dc', 1, 0.12);
  const bandM = metersForStitches(bandSts * 0.6, g, 'dc', 1, 0.12);
  const total = bodyM + bandM + 1;
  const diagram: PatternDiagram = {
    kind: 'rounds',
    craft: 'crochet',
    rounds: base.map((r) => ({ stitches: r.count, label: String(r.n), color: color ?? colorAt(p.yarn, 0), symbol: 'dc', incPositions: shapedPositions(r.tokens).inc })),
  };
  return b.build({
    title: p.overrides?.title ?? T.title,
    summary: p.overrides?.summary ?? T.summary,
    materials: [...yarnMaterials(p.yarn, total, p.yarn.colors.length > 1 ? [bodyM, bandM + 1] : null, lang, p.units), ...toolMaterial(p.toolMm, 'tig', lang), ...notions(['tapestry', 'scissors'], lang)],
    gauge: g,
    yarnMeters: total,
    finishedSize: T.size(len(plan.diameter, p.units, lang), len(plan.height, p.units, lang)),
    abbreviations: abbreviations(['mr', 'ch', 'slst', 'sc', 'dc', 'sk', 'st', 'rep'], lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteStretch, T.noteCotton, T.noteHandles, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram,
    params: storeParams(p, { gaugeLabel: gaugeText(g, 'dc', lang, p.units), gaugeStitch: gaugeLabel('dc', lang), castOn: 12 }),
  });
}
