/**
 * Şiş bebek battaniyesi (düz örgü): ortada seçilen desen, dört yanda haraşo ya da pirinç kenar.
 * Ortadaki ilmekler desen katına uyar; pirinç kenarda toplam ilmek tek sayı olacak şekilde
 * bir kenara 1 ilmek eklenir (her sıra aynı talimatla örülsün diye).
 */
import type { GeneratedPattern } from '@/types';
import { castOnFor, rowsFor } from '@/engine/math/gauge';
import { metersForArea } from '@/engine/math/yarn';
import { PATTERN_BY_ID, STITCH_PATTERNS, fitsPattern } from '@/knowledge/stitchPatterns';
import { PatternBuilder, assertMath } from './builder';
import { L, WORDS, FINISH, abbreviations, colorAt, gaugeLabel, gaugeText, isSynthetic, notions, resolveGauge, sizeWxH, splitMeters, storeParams, toolMaterial, yarnMaterials, type AbbrKey, inlineName } from './common';
import { len } from './fmt';
import { KT, ROW_REPEAT, addPatternSection, areaFactor, effGauge, toRepeat } from './knitCommon';
import type { PatternParams } from './types';

export const BLANKET_CENTERS = STITCH_PATTERNS.filter((s) => s.craft === 'knit' && ['jarse', 'pirinc', 'cift-pirinc', 'sepet', 'dalga-ajur', 'goz-ajur', 'burgu-4', 'burgu-6', 'hasir', 'haraso', 'yalanci-selanik'].includes(s.id)).map((s) => s.id);

export function blanketPlan(centerId: string, borderId: 'haraso' | 'pirinc', widthCm: number, lengthCm: number, borderCm: number, g: { stitches: number; rows: number }) {
  const c = PATTERN_BY_ID[centerId];
  const bd = PATTERN_BY_ID[borderId];
  const ec = effGauge(g, c);
  const eb = effGauge(g, bd);
  const bs = Math.max(3, Math.round((borderCm * eb.stitches) / 10));
  const centerW = Math.max(10, widthCm - (2 * bs * 10) / eb.stitches);
  const center = castOnFor(centerW, ec.stitches, c.flat.multiple, c.flat.plus).best.stitches;
  const right = borderId === 'pirinc' && (center + 2 * bs) % 2 === 0 ? bs + 1 : bs;
  const castOn = bs + center + right;
  const borderRows = Math.max(4, Math.round((borderCm * eb.rows) / 10 / 2) * 2);
  const borderRowCm = (borderRows * 10) / eb.rows;
  const rep = ROW_REPEAT[centerId] ?? 2;
  const centerRows = toRepeat(rowsFor(Math.max(10, lengthCm - 2 * borderRowCm), ec.rows), rep);
  return {
    castOn,
    left: bs,
    right,
    center,
    borderRows,
    centerRows,
    widthCm: (center * 10) / ec.stitches + ((bs + right) * 10) / eb.stitches,
    lengthCm: 2 * borderRowCm + (centerRows * 10) / ec.rows,
    borderRowCm,
  };
}

const TX = L(
  {
    title: (c: string) => `Bebek battaniyesi · ${c}`,
    summary: (c: string, b: string, s: string) => `${s} ölçüsünde, ortası ${c}, dört yanı ${b} kenarlı battaniye. Tek parça, düz (gidiş-dönüş) örülür; dikiş yok.`,
    size: (s: string) => `Yaklaşık ${s}`,
    sBottom: 'Alt kenar',
    sMain: 'Orta bölüm',
    sTop: 'Üst kenar',
    garterRows: (n: number) => `Tüm ilmekleri düz ör (${n} sıra haraşo).`,
    seedRows: (n: number) => `1 düz, *1 ters, 1 düz* sıra sonuna kadar tekrarla (${n} sıra pirinç; ilmek sayısı tek olduğu için her sıra aynı).`,
    markers: (l: number, r: number) => `Son kenar sırasında ilk ${l} ilmekten sonra ve son ${r} ilmekten önce birer işaretleyici tak.`,
    sideG: (n: number) => `${n} düz`,
    sideS: (n: number) => `${n} ilmeği pirinç ör (gördüğünün tersini: düze ters, terse düz)`,
    row: (l: string, n: number, r: string) => `${l}, işaretleyiciyi geçir, ortadaki ${n} ilmekte desenin sıradaki sırasını ör, işaretleyiciyi geçir, ${r}.`,
    until: (n: number, k: number, x: string) => `Toplam ${n} sıra (${k} desen tekrarı) ya da orta bölüm ${x} olana kadar devam et; son tekrarı tamamla.`,
    noteBorder: 'Kenar ilmekleri ortadaki desenden bağımsızdır; her sırada önce kenarı, sonra deseni, sonra yine kenarı ör.',
    noteBaby: 'Bebek için yumuşak, makinede yıkanabilen ip seç (superwash merino, pamuk ya da bebek akriliği). Püskül ve ponpon ekleme.',
  },
  {
    title: (c: string) => `Baby blanket · ${c}`,
    summary: (c: string, b: string, s: string) => `A ${s} blanket with a ${c} center and a ${b} border all around. Knitted flat in one piece, no sewing.`,
    size: (s: string) => `About ${s}`,
    sBottom: 'Lower border',
    sMain: 'Center',
    sTop: 'Upper border',
    garterRows: (n: number) => `Knit all sts (${n} rows of garter stitch).`,
    seedRows: (n: number) => `K1, *p1, k1*; repeat to end (${n} rows of seed stitch; with an odd count every row is the same).`,
    markers: (l: number, r: number) => `On the last border row, place a marker after the first ${l} sts and another before the last ${r} sts.`,
    sideG: (n: number) => `k${n}`,
    sideS: (n: number) => `work ${n} sts in seed stitch (knit the purls and purl the knits)`,
    row: (l: string, n: number, r: string) => `${capFirst(l)}, slip marker, work the next row of the stitch pattern over the center ${n} sts, slip marker, ${r}.`,
    until: (n: number, k: number, x: string) => `Continue for ${n} rows in total (${k} pattern repeats), or until the center measures ${x}; finish the last repeat.`,
    noteBorder: 'The border stitches are separate from the center pattern: on every row work the border, then the pattern, then the border again.',
    noteBaby: 'Choose a soft, machine-washable yarn for babies (superwash merino, cotton or baby acrylic). Do not add fringe or pompoms.',
  },
  {
    title: (c: string) => `Manta de bebé · ${c}`,
    summary: (c: string, b: string, s: string) => `Manta de ${s} con el centro en ${c} y borde de ${b} alrededor. Se teje en plano en una sola pieza, sin costuras.`,
    size: (s: string) => `Unos ${s}`,
    sBottom: 'Borde inferior',
    sMain: 'Centro',
    sTop: 'Borde superior',
    garterRows: (n: number) => `Tejer todos los puntos al derecho (${n} vueltas de punto bobo).`,
    seedRows: (n: number) => `1 d, *1 r, 1 d*; repetir hasta el final (${n} vueltas de punto arroz; con número impar todas las vueltas son iguales).`,
    markers: (l: number, r: number) => `En la última vuelta del borde, coloca un marcador después de los primeros ${l} puntos y otro antes de los últimos ${r}.`,
    sideG: (n: number) => `${n} d`,
    sideS: (n: number) => `tejer ${n} puntos en punto arroz (los derechos al revés y los reveses al derecho)`,
    row: (l: string, n: number, r: string) => `${capFirst(l)}, pasar el marcador, tejer la vuelta que toca del punto sobre los ${n} puntos centrales, pasar el marcador, ${r}.`,
    until: (n: number, k: number, x: string) => `Seguir hasta ${n} vueltas (${k} repeticiones del punto) o hasta que el centro mida ${x}; termina la última repetición.`,
    noteBorder: 'Los puntos del borde son independientes del punto central: en cada vuelta teje el borde, luego el punto y otra vez el borde.',
    noteBaby: 'Para bebés elige un hilo suave y lavable a máquina (merino superwash, algodón o acrílico de bebé). No pongas flecos ni pompones.',
  },
  {
    title: (c: string) => `Manta de bebê · ${c}`,
    summary: (c: string, b: string, s: string) => `Manta de ${s} com o centro em ${c} e borda em ${b} em volta. Tricotada reta em uma só peça, sem costuras.`,
    size: (s: string) => `Cerca de ${s}`,
    sBottom: 'Borda inferior',
    sMain: 'Centro',
    sTop: 'Borda superior',
    garterRows: (n: number) => `Tricotar todos os pontos em meia (${n} carreiras de ponto liga).`,
    seedRows: (n: number) => `1 m, *1 t, 1 m*; repetir até o final (${n} carreiras de ponto arroz; com número ímpar todas as carreiras são iguais).`,
    markers: (l: number, r: number) => `Na última carreira da borda, coloque um marcador depois dos primeiros ${l} pontos e outro antes dos últimos ${r}.`,
    sideG: (n: number) => `${n} m`,
    sideS: (n: number) => `fazer ${n} pontos em ponto arroz (meia sobre tricô e tricô sobre meia)`,
    row: (l: string, n: number, r: string) => `${capFirst(l)}, passar o marcador, fazer a carreira seguinte do ponto nos ${n} pontos do centro, passar o marcador, ${r}.`,
    until: (n: number, k: number, x: string) => `Continuar até ${n} carreiras (${k} repetições do ponto) ou até o centro medir ${x}; complete a última repetição.`,
    noteBorder: 'Os pontos da borda são independentes do ponto do centro: em cada carreira faça a borda, depois o ponto e de novo a borda.',
    noteBaby: 'Para bebês escolha um fio macio e lavável na máquina (merino superwash, algodão ou acrílico infantil). Não use franjas nem pompons.',
  },
);

function capFirst(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function babyBlanket(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const K = KT[lang];
  const W = WORDS[lang];
  const c = BLANKET_CENTERS.includes(p.stitchId ?? '') ? PATTERN_BY_ID[p.stitchId!] : PATTERN_BY_ID['cift-pirinc'];
  let borderId: 'haraso' | 'pirinc' = p.borderId === 'pirinc' ? 'pirinc' : 'haraso';
  if (c.id === borderId) borderId = borderId === 'haraso' ? 'pirinc' : 'haraso';
  const bd = PATTERN_BY_ID[borderId];
  const g = resolveGauge(p, 'knit', 'jarse');
  const plan = blanketPlan(c.id, borderId, p.widthCm ?? 80, p.lengthCm ?? 100, p.borderCm ?? 4, g);
  assertMath(fitsPattern(plan.center, c.flat) && (borderId === 'haraso' || plan.castOn % 2 === 1), 'battaniye ilmek sayısı');
  const rep = ROW_REPEAT[c.id] ?? 2;
  const multi = p.yarn.colors.length > 1;
  const cMain = multi ? colorAt(p.yarn, 0) : undefined;
  const cBorder = multi ? colorAt(p.yarn, 1) : undefined;

  const b = new PatternBuilder('bebek-battaniyesi', 'knit', ctx);
  addPatternSection(b, c, 'flat', lang, 'p', plan.center);
  const borderText = borderId === 'haraso' ? T.garterRows(plan.borderRows) : T.seedRows(plan.borderRows);
  b.section('a', T.sBottom);
  b.step(K.castOnLabel, K.castOn(plan.castOn), { count: plan.castOn, color: cBorder });
  b.step(W.rows(1, plan.borderRows), borderText, { count: plan.castOn, repeat: plan.borderRows, color: cBorder, lessonIds: bd.lessonIds });
  b.step(W.row(plan.borderRows), T.markers(plan.left, plan.right), { count: plan.castOn });
  b.section('b', T.sMain);
  const side = (n: number) => (borderId === 'haraso' ? T.sideG(n) : T.sideS(n));
  const start = plan.borderRows + 1;
  const end = plan.borderRows + plan.centerRows;
  b.step(W.rows(start, end), `${T.row(side(plan.left), plan.center, side(plan.right))} ${T.until(plan.centerRows, plan.centerRows / rep, len(plan.lengthCm - 2 * plan.borderRowCm, p.units, lang))}`, {
    count: plan.castOn,
    repeat: plan.centerRows,
    color: cMain,
    lessonIds: c.lessonIds,
  });
  b.section('c', T.sTop);
  b.step(W.rows(end + 1, end + plan.borderRows), borderText, { count: plan.castOn, repeat: plan.borderRows, color: cBorder });
  b.step(K.bindOffLabel, borderId === 'haraso' ? K.bindOffKnit : K.bindOff, { color: cBorder });
  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, FINISH[lang].weaveKnit);
  b.step(FINISH[lang].finishing, isSynthetic(p.yarn) ? FINISH[lang].blockAcrylic : FINISH[lang].block);

  const centerW = (plan.center * 10) / effGauge(g, c).stitches;
  const centerH = plan.lengthCm - 2 * plan.borderRowCm;
  const centerM = metersForArea(centerW, centerH, g, 'knit', areaFactor(c));
  const borderM = metersForArea(plan.widthCm, plan.lengthCm, g, 'knit', areaFactor(bd)) - metersForArea(centerW, centerH, g, 'knit', areaFactor(bd));
  const total = centerM + borderM + 2;
  const colorM = multi ? splitMeters(total, [centerM, borderM]) : null;
  const keys: AbbrKey[] = ['co', 'k', 'p', 'pm', 'bo', 'rsws', 'st', 'rep'];
  if (c.category === 'ajur') keys.push('yo', 'k2tog');
  if (c.category === 'burgu') keys.push('cable');
  const size = sizeWxH(plan.widthCm, plan.lengthCm, p.units, lang);
  return b.build({
    title: p.overrides?.title ?? T.title(c.name[lang]),
    summary: p.overrides?.summary ?? T.summary(inlineName(c.name[lang], lang), inlineName(bd.name[lang], lang), size),
    materials: [
      ...yarnMaterials(p.yarn, total, colorM, lang, p.units),
      ...toolMaterial(p.toolMm, 'sis-misinali', lang),
      ...notions(['markers2', ...(c.category === 'burgu' ? (['cableNeedle'] as const) : []), 'tapestry', 'scissors', 'pins'], lang),
    ],
    gauge: g,
    yarnMeters: total,
    finishedSize: T.size(size),
    abbreviations: abbreviations(keys, lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteBorder, T.noteBaby, FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram: { kind: 'schematic', shape: 'rect', widthCm: plan.widthCm, heightCm: plan.lengthCm, labels: { width: len(plan.widthCm, p.units, lang), height: len(plan.lengthCm, p.units, lang) } },
    params: storeParams(p, {
      gaugeLabel: gaugeText(g, 'jarse', lang, p.units),
      gaugeStitch: gaugeLabel('jarse', lang),
      castOn: plan.castOn,
      fits: fitsPattern(plan.center, c.flat),
      borderColor: cBorder,
    }),
  });
}
