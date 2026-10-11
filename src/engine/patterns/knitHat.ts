/**
 * Şiş bere (misinalı şişte, alttan yukarı): lastik ağız, desenli ya da jarse gövde, 8 dilimli tepe.
 * İlmek sayısı = (baş çevresi × (1 − darlık payı)) × ölçü; lastik katı, gövde katı ve 8'in EKOK'una yuvarlanır.
 * Tepe: önce iki turda bir, dilim başına ilmek yarıya inince her tur eksiltilir; kalan 8 ilmek büzülür.
 */
import type { GeneratedPattern, PatternDiagram } from '@/types';
import { lcm, nearestMultiple } from '@/engine/math/gauge';
import { metersForArea } from '@/engine/math/yarn';
import { PATTERN_BY_ID } from '@/knowledge/stitchPatterns';
import { HAT_NEGATIVE_EASE } from '@/knowledge/sizes';
import { circularLengthFor } from '@/knowledge/tools';
import { PatternBuilder, assertMath, lk } from './builder';
import { L, WORDS, FINISH, abbreviations, colorAt, gaugeLabel, gaugeText, isSynthetic, notions, resolveGauge, splitMeters, storeParams, toolMaterial, yarnMaterials, type AbbrKey, inlineName } from './common';
import { len } from './fmt';
import { KT, areaFactor, effGauge } from './knitCommon';
import { emitGrouped, type Line } from './rounds';
import type { PatternParams } from './types';

export const HAT_RIBS = ['lastik-1x1', 'lastik-2x2', 'burgulu-lastik'] as const;
export const HAT_BODIES = ['jarse', 'lastik-2x2', 'lastik-1x1', 'pirinc', 'cift-pirinc', 'sepet', 'burgu-6', 'haraso'] as const;
export const SECTIONS = 8;

export interface CrownRound {
  /** dilim başına ilmek (tur sonunda) */
  per: number;
  count: number;
  dec: boolean;
}

/**
 * Tepe turları: dilim başına S ilmekten 1 ilmeğe.
 * Dilim başına ilmek `t`ye inene kadar iki turda bir, sonra her tur eksiltilir.
 * `targetRounds` verilirse t, tepe derinliği bu tur sayısına yakın olacak şekilde seçilir
 * (toplam tur = 2(S − t) + (t − 1)); verilmezse t = S/2.
 */
export function crownRounds(S: number, targetRounds?: number): CrownRound[] {
  const t = targetRounds ? Math.min(S, Math.max(2, 2 * S - 1 - Math.round(targetRounds))) : Math.max(2, Math.ceil(S / 2));
  const out: CrownRound[] = [];
  let s = S;
  while (s > 1) {
    s -= 1;
    out.push({ per: s, count: s * SECTIONS, dec: true });
    if (s >= t) out.push({ per: s, count: s * SECTIONS, dec: false });
  }
  return out;
}

export function knitHatPlan(p: { headCm: number; heightCm: number; brimCm: number; ribId: string; bodyId: string; foldBrim: boolean }, g: { stitches: number; rows: number }) {
  const rib = PATTERN_BY_ID[p.ribId];
  const body = PATTERN_BY_ID[p.bodyId];
  const eg = effGauge(g, body);
  const M = lcm(lcm(rib.round?.multiple ?? 2, body.round?.multiple ?? 1), SECTIONS);
  const target = (p.headCm * (1 - HAT_NEGATIVE_EASE) * eg.stitches) / 10;
  const castOn = nearestMultiple(target, M, 0, M * 4);
  const S = castOn / SECTIONS;
  // tepe derinliği ≈ yarıçapın %80'i (jarse sıralarıyla)
  const crownTarget = (((castOn * 10) / eg.stitches / (2 * Math.PI)) * 0.8 * g.rows) / 10;
  const crown = crownRounds(S, crownTarget);
  const rowH = 10 / eg.rows;
  const crownCm = crown.length * (10 / g.rows);
  const ribRows = Math.max(4, Math.round((p.brimCm * (p.foldBrim ? 2 : 1) * g.rows * rib.rowFactor) / 10));
  const ribCm = (ribRows * 10) / (g.rows * rib.rowFactor);
  const brimWorn = p.foldBrim ? ribCm / 2 : ribCm;
  const bodyRows = Math.max(2, Math.round((p.heightCm - brimWorn - crownCm) / rowH));
  const bodyCm = bodyRows * rowH;
  return {
    castOn,
    S,
    crown,
    ribRows,
    bodyRows,
    circumference: (castOn * 10) / eg.stitches,
    height: brimWorn + bodyCm + crownCm,
    /** ilmek atılan kenardan tepeye başlarken ölçü */
    toCrownCm: ribCm + bodyCm,
    crownCm,
    ribCm,
  };
}

const TX = L(
  {
    title: (b: string) => `Şiş bere · ${b}`,
    summary: (rib: string, body: string, c: string) => `Misinalı şişte alttan yukarı örülen bere: ${rib} ağız, ${body} gövde ve 8 dilimli tepe eksiltmesi. Çevresi ${c}; başı hafifçe sarar.`,
    size: (c: string, h: string) => `Çevre yaklaşık ${c} (gerilmeden), boy ${h}`,
    sBrim: 'Ağız',
    rib: (t: string, fold: boolean, x: string) => `${t} ${fold ? `Ağız iki kat olacak: lastiği ${x} örüp sonra dışa kıvıracaksın.` : ''}`.trim(),
    sBody: 'Gövde',
    bodyStart: 'Desen',
    bodyStartText: 'Gövde desenine geç:',
    bodyUntil: (x: string) => `İş, ilmek atılan kenardan ${x} olana kadar gövde desenine devam et.`,
    sCrown: 'Tepe',
    setup: (s: number) => `Hazırlık turu: tüm ilmekleri düz örerken her ${s} ilmekte bir işaretleyici tak (8 dilim; tur başı işaretleyicisi de bunlardan biri).`,
    crownPlain: 'Tepe turlarında tüm ilmekleri düz ör; desen tepede bırakılır, böylece eksiltmeler düzgün görünür.',
    dec: (k: number, first: boolean) => (k > 0 ? `*${k} düz, ${first ? lk('sis-eksiltme', '2 ilmeği birlikte düz ör') : '2 birlikte düz'}* 8 kez tekrarla.` : `*${first ? lk('sis-eksiltme', '2 ilmeği birlikte düz ör') : '2 birlikte düz'}* 8 kez tekrarla.`),
    plain: 'Tüm ilmekleri düz ör.',
    switchLabel: 'Şiş değiştir',
    switchText: `İlmekler 40 cm misinaya artık yetmiyorsa ${lk('sis-corap-sisi', 'çorap şişine')} ya da uzun misinayla ${lk('sis-magic-loop', 'magic loop')} yöntemine geç.`,
    close: 'Kapatma',
    closeText: 'İpi 20 cm uç bırakarak kes. Ucu yün iğnesine geçir, kalan 8 ilmeği şişten sırayla iğneye al, sıkıca büz ve ucu tepedeki delikten içeri geçirip gizle.',
    fold: 'Ağzı dışa doğru kıvır.',
    pompom: 'Ponponu tepenin ortasına sıkıca dik.',
    noteEase: 'Bere, baş çevresinden yaklaşık %10 dar örülür; lastik ve örgü esneyerek başı sarar.',
    noteNeedle: 'Ağzı bir numara ince şişle örersen daha toplu durur; gövdeye geçerken asıl şişe dön.',
  },
  {
    title: (b: string) => `Knitted beanie · ${b}`,
    summary: (rib: string, body: string, c: string) => `A beanie knitted bottom-up on circular needles: ${rib} brim, ${body} body and an 8-section crown. ${c} around, for a snug fit.`,
    size: (c: string, h: string) => `About ${c} around (unstretched), ${h} tall`,
    sBrim: 'Brim',
    rib: (t: string, fold: boolean, x: string) => `${t} ${fold ? `The brim is folded: work the rib to ${x}, then fold it up at the end.` : ''}`.trim(),
    sBody: 'Body',
    bodyStart: 'Pattern',
    bodyStartText: 'Change to the body pattern:',
    bodyUntil: (x: string) => `Continue in the body pattern until the hat measures ${x} from the cast-on edge.`,
    sCrown: 'Crown',
    setup: (s: number) => `Set-up round: knit all sts, placing a marker after every ${s} sts (8 sections; the BOR marker is one of them).`,
    crownPlain: 'Knit all sts in the crown rounds; the body pattern stops here so the decreases look tidy.',
    dec: (k: number, first: boolean) => (k > 0 ? `*K${k}, ${first ? lk('sis-eksiltme', 'k2tog') : 'k2tog'}* 8 times.` : `*${first ? lk('sis-eksiltme', 'K2tog') : 'K2tog'}* 8 times.`),
    plain: 'Knit all sts.',
    switchLabel: 'Change needles',
    switchText: `When the stitches no longer reach around the 40 cm (16") needle, change to ${lk('sis-corap-sisi', 'double-pointed needles')} or a long circular for ${lk('sis-magic-loop', 'magic loop')}.`,
    close: 'Closing',
    closeText: 'Cut the yarn leaving a 20 cm (8") tail. Thread it through the remaining 8 sts, pull tight and pass the tail through the hole to the inside to weave in.',
    fold: 'Fold the brim up.',
    pompom: 'Sew the pompom firmly to the top of the crown.',
    noteEase: 'The hat is about 10% smaller than the head; the ribbing and fabric stretch to hug the head.',
    noteNeedle: 'For a neater brim, work the rib on a needle one size smaller and change back for the body.',
  },
  {
    title: (b: string) => `Gorro de punto · ${b}`,
    summary: (rib: string, body: string, c: string) => `Gorro tejido de abajo arriba en aguja circular: borde de ${rib}, cuerpo de ${body} y coronilla en 8 secciones. ${c} de contorno, ajustado.`,
    size: (c: string, h: string) => `Unos ${c} de contorno (sin estirar) y ${h} de alto`,
    sBrim: 'Borde',
    rib: (t: string, fold: boolean, x: string) => `${t} ${fold ? `El borde es doble: teje el elástico hasta ${x} y dóblalo hacia fuera al final.` : ''}`.trim(),
    sBody: 'Cuerpo',
    bodyStart: 'Punto',
    bodyStartText: 'Cambiar al punto del cuerpo:',
    bodyUntil: (x: string) => `Seguir en el punto del cuerpo hasta que el gorro mida ${x} desde el montaje.`,
    sCrown: 'Coronilla',
    setup: (s: number) => `Vuelta de preparación: tejer todo al derecho colocando un marcador cada ${s} puntos (8 secciones; el marcador de inicio es uno de ellos).`,
    crownPlain: 'En la coronilla teje todos los puntos al derecho; el punto del cuerpo termina aquí para que las disminuciones queden limpias.',
    dec: (k: number, first: boolean) => (k > 0 ? `*${k} d, ${first ? lk('sis-eksiltme', '2 juntos al derecho') : '2 juntos d'}* 8 veces.` : `*${first ? lk('sis-eksiltme', '2 juntos al derecho') : '2 juntos d'}* 8 veces.`),
    plain: 'Tejer todos los puntos al derecho.',
    switchLabel: 'Cambiar de aguja',
    switchText: `Cuando los puntos ya no lleguen a dar la vuelta en la circular de 40 cm, pasa a ${lk('sis-corap-sisi', 'agujas de doble punta')} o a ${lk('sis-magic-loop', 'magic loop')} con un cable largo.`,
    close: 'Cierre',
    closeText: 'Cortar el hilo dejando 20 cm. Pasarlo por los 8 puntos restantes, tirar para cerrar y llevar la hebra al revés para esconderla.',
    fold: 'Doblar el borde hacia fuera.',
    pompom: 'Coser el pompón firmemente en lo alto de la coronilla.',
    noteEase: 'El gorro es un 10 % más pequeño que la cabeza; el elástico y el tejido ceden y se ajustan.',
    noteNeedle: 'Para un borde más firme, teje el elástico con una aguja un número más fina y vuelve a la tuya en el cuerpo.',
  },
  {
    title: (b: string) => `Gorro de tricô · ${b}`,
    summary: (rib: string, body: string, c: string) => `Gorro tricotado de baixo para cima em agulha circular: barra em ${rib}, corpo em ${body} e topo em 8 gomos. ${c} de circunferência, justinho.`,
    size: (c: string, h: string) => `Cerca de ${c} de circunferência (sem esticar) e ${h} de altura`,
    sBrim: 'Barra',
    rib: (t: string, fold: boolean, x: string) => `${t} ${fold ? `A barra é dobrada: faça a ribana até ${x} e dobre para fora no final.` : ''}`.trim(),
    sBody: 'Corpo',
    bodyStart: 'Ponto',
    bodyStartText: 'Passar para o ponto do corpo:',
    bodyUntil: (x: string) => `Continuar no ponto do corpo até o gorro medir ${x} desde a montagem.`,
    sCrown: 'Topo',
    setup: (s: number) => `Volta de preparação: tricotar tudo em meia colocando um marcador a cada ${s} pontos (8 gomos; o marcador de início é um deles).`,
    crownPlain: 'No topo tricote todos os pontos em meia; o ponto do corpo termina aqui para as diminuições ficarem bonitas.',
    dec: (k: number, first: boolean) => (k > 0 ? `*${k} m, ${first ? lk('sis-eksiltme', '2 juntos em meia') : '2 juntos em m'}* 8 vezes.` : `*${first ? lk('sis-eksiltme', '2 juntos em meia') : '2 juntos em m'}* 8 vezes.`),
    plain: 'Tricotar todos os pontos em meia.',
    switchLabel: 'Trocar de agulha',
    switchText: `Quando os pontos não alcançarem mais a volta na circular de 40 cm, passe para ${lk('sis-corap-sisi', 'agulhas de pontas duplas')} ou para ${lk('sis-magic-loop', 'magic loop')} com cabo longo.`,
    close: 'Fechamento',
    closeText: 'Cortar o fio deixando 20 cm. Passar pelos 8 pontos restantes, puxar para fechar e levar a ponta para o avesso para esconder.',
    fold: 'Dobrar a barra para fora.',
    pompom: 'Costurar o pompom firme no alto do topo.',
    noteEase: 'O gorro fica cerca de 10% menor que a cabeça; a ribana e o tecido cedem e ajustam.',
    noteNeedle: 'Para uma barra mais firme, faça a ribana com agulha um número menor e volte à sua no corpo.',
  },
);

export function knitHat(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const K = KT[lang];
  const W = WORDS[lang];
  const ribId = (HAT_RIBS as readonly string[]).includes(p.ribId ?? '') ? p.ribId! : 'lastik-2x2';
  const bodyId = (HAT_BODIES as readonly string[]).includes(p.bodyId ?? '') ? p.bodyId! : 'jarse';
  const rib = PATTERN_BY_ID[ribId];
  const body = PATTERN_BY_ID[bodyId];
  const g = resolveGauge(p, 'knit', 'jarse');
  const fold = !!p.foldBrim;
  const plan = knitHatPlan({ headCm: p.circumferenceCm ?? 56, heightCm: p.heightCm ?? 21, brimCm: p.brimCm ?? 5, ribId, bodyId, foldBrim: fold }, g);
  assertMath(plan.castOn % SECTIONS === 0 && plan.crown[plan.crown.length - 1].count === SECTIONS, 'bere tepesi 8 ilmeğe inmeli');
  const multi = p.yarn.colors.length > 1;
  const cBrim = multi ? colorAt(p.yarn, 1) : undefined;
  const cBody = multi ? colorAt(p.yarn, 0) : undefined;

  const b = new PatternBuilder('bere', 'knit', ctx);
  b.section('a', T.sBrim);
  b.step(K.castOnLabel, K.castOnCirc(plan.castOn), { count: plan.castOn, color: cBrim });
  b.step(K.joinLabel, K.join, { count: plan.castOn });
  let n = 1;
  const ribText = rib.round!.rows[0].text[lang];
  b.step(W.rnds(n, n + plan.ribRows - 1), T.rib(ribText, fold, len(plan.ribCm, p.units, lang)), { count: plan.castOn, repeat: plan.ribRows, color: cBrim, lessonIds: rib.lessonIds });
  n += plan.ribRows;

  b.section('b', T.sBody);
  const bw = body.round!;
  const untilText = T.bodyUntil(len(plan.toCrownCm, p.units, lang));
  if (bw.rows.length === 1) {
    b.step(W.rnds(n, n + plan.bodyRows - 1), `${bw.rows[0].text[lang]} ${untilText}`, { count: plan.castOn, repeat: plan.bodyRows, color: cBody, lessonIds: body.lessonIds });
  } else {
    b.step(T.bodyStart, `${T.bodyStartText} ${bw.note?.[lang] ?? body.summary[lang]}`, { color: cBody });
    for (const r of bw.rows) b.step(r.label[lang], r.text[lang], { count: plan.castOn, color: cBody, lessonIds: body.lessonIds });
    b.step(W.rnds(n, n + plan.bodyRows - 1), `${bw.repeat?.[lang] ?? ''} ${untilText}`.trim(), { count: plan.castOn, repeat: plan.bodyRows, color: cBody });
  }
  n += plan.bodyRows;

  b.section('c', T.sCrown, body.id === 'jarse' ? undefined : T.crownPlain);
  b.step(W.rnd(n), T.setup(plan.S), { count: plan.castOn, color: cBody, lessonIds: ['sis-ilk-bere'] });
  n += 1;
  // misina değişimi: kalan ilmeklerin çevresi 35 cm'nin altına inince
  const stW = 10 / g.stitches;
  let switched = circularLengthFor(plan.circumference, lang).lengthCm === 0;
  const lines: Line[] = [];
  let first = true;
  plan.crown.forEach((r) => {
    if (!switched && r.count * stW < 35 * 0.9) {
      emitGrouped(b, lines.splice(0), W.rnds);
      b.step(T.switchLabel, T.switchText);
      switched = true;
    }
    lines.push({ n: n++, text: r.dec ? T.dec(r.per - 1, first) : T.plain, count: r.count, color: cBody });
    if (r.dec) first = false;
  });
  emitGrouped(b, lines, W.rnds);
  b.step(T.close, T.closeText, { lessonIds: ['sis-ilk-bere'] });

  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, FINISH[lang].weaveKnit);
  if (fold) b.step(FINISH[lang].finishing, T.fold);
  b.step(FINISH[lang].finishing, isSynthetic(p.yarn) ? FINISH[lang].blockAcrylic : FINISH[lang].block);
  if (p.pompom) b.step(FINISH[lang].finishing, T.pompom);

  const C = plan.circumference;
  const ribM = metersForArea(C, plan.ribCm, g, 'knit', areaFactor(rib));
  const bodyM = metersForArea(C, plan.toCrownCm - plan.ribCm, g, 'knit', areaFactor(body));
  const crownM = metersForArea(C, plan.crownCm * 0.55, g, 'knit', 1);
  const total = ribM + bodyM + crownM + 1;
  const colorM = multi ? splitMeters(total, [bodyM + crownM, ribM]) : null;

  // tepe şeması: merkez = son tur (8 ilmek), dışa doğru ilk tepe turu
  const crownRings = [...plan.crown].reverse();
  const diagram: PatternDiagram = {
    kind: 'rounds',
    craft: 'knit',
    rounds: crownRings.map((r, i) => {
      const per = r.per;
      const decPositions: number[] = [];
      if (r.dec) for (let s = 0; s < SECTIONS; s++) decPositions.push(s * per + per - 1);
      return { stitches: r.count, label: String(n - 1 - i), color: cBody ?? colorAt(p.yarn, 0), symbol: 'k', decPositions };
    }),
  };
  const keys: AbbrKey[] = ['co', 'bor', 'pm', 'k', 'p', 'k2tog', 'bo', 'st', 'rep'];
  if (body.category === 'burgu') keys.push('cable');
  const cStr = len(C, p.units, lang);
  const hStr = len(plan.height, p.units, lang);
  return b.build({
    title: p.overrides?.title ?? T.title(body.name[lang]),
    summary: p.overrides?.summary ?? T.summary(inlineName(rib.name[lang], lang), inlineName(body.name[lang], lang), cStr),
    materials: [
      ...yarnMaterials(p.yarn, total, colorM, lang, p.units),
      ...toolMaterial(p.toolMm, 'sis-misinali', lang, C),
      ...notions(['dpn', 'markers8', ...(body.category === 'burgu' ? (['cableNeedle'] as const) : []), 'tapestry', 'scissors', ...(p.pompom ? (['pompom'] as const) : [])], lang, { toolMm: p.toolMm }),
    ],
    gauge: g,
    yarnMeters: total,
    finishedSize: T.size(cStr, hStr),
    abbreviations: abbreviations(keys, lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteEase, T.noteNeedle, FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram,
    params: storeParams(p, {
      gaugeLabel: gaugeText(g, 'jarse', lang, p.units),
      gaugeStitch: gaugeLabel('jarse', lang),
      castOn: plan.castOn,
      extraDiagrams: [{ kind: 'schematic', shape: 'beanie', widthCm: C / 2, heightCm: plan.height, labels: { width: cStr, height: hStr } }],
    }),
  });
}
