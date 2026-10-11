/**
 * Şiş atkı: kütüphanedeki kıvrılmayan her desenle. İlmek sayısı desen katına (multiple + plus) uyar;
 * isteğe bağlı kaydırmalı kenar ilmekleri; iki yüzü farklı desenlerde (burgu, ajur, hasır) haraşo çerçeve.
 */
import type { GeneratedPattern } from '@/types';
import { castOnFor, rowsFor } from '@/engine/math/gauge';
import { metersForArea } from '@/engine/math/yarn';
import { PATTERN_BY_ID, STITCH_PATTERNS, fitsPattern, multipleText } from '@/knowledge/stitchPatterns';
import { PatternBuilder, assertMath } from './builder';
import { L, WORDS, FINISH, abbreviations, colorName, gaugeLabel, gaugeText, isSynthetic, notions, resolveGauge, sizeWxH, splitMeters, storeParams, toolMaterial, yarnMaterials, type AbbrKey, inlineName } from './common';
import { len } from './fmt';
import { KT, ROW_REPEAT, addPatternSection, areaFactor, effGauge, selvedgeRow, toRepeat } from './knitCommon';
import { fringeMeters, fringeSteps } from './fringe';
import type { PatternParams } from './types';

/** Atkıya uygun şiş desenleri (kıvrılmayanlar) */
export const KNIT_SCARF_STITCHES = STITCH_PATTERNS.filter((s) => s.craft === 'knit' && !s.curls).map((s) => s.id);

export const BORDER_STS = 3;
export const BORDER_ROWS = 6;

export interface KnitScarfPlan {
  castOn: number;
  center: number;
  edge: number;
  rows: number;
  patternRows: number;
  border: boolean;
  widthCm: number;
  lengthCm: number;
}

export function knitScarfPlan(stitchId: string, widthCm: number, lengthCm: number, g: { stitches: number; rows: number }, selvedge: boolean): KnitScarfPlan {
  const sp = PATTERN_BY_ID[stitchId] ?? PATTERN_BY_ID.haraso;
  const border = !sp.reversible;
  const edge = (border ? 2 * BORDER_STS : 0) + (selvedge && !border ? 2 : 0);
  const eg = effGauge(g, sp);
  const edgeCm = (edge * 10) / g.stitches;
  const co = castOnFor(Math.max(5, widthCm - edgeCm), eg.stitches, sp.flat.multiple, sp.flat.plus);
  const center = co.best.stitches;
  const rep = ROW_REPEAT[sp.id] ?? 2;
  const borderRowsCm = border ? (2 * BORDER_ROWS * 10) / (g.rows * 1.5) : 0;
  const patternRows = toRepeat(rowsFor(Math.max(10, lengthCm - borderRowsCm), eg.rows), rep);
  return {
    castOn: center + edge,
    center,
    edge,
    rows: patternRows + (border ? 2 * BORDER_ROWS : 0),
    patternRows,
    border,
    widthCm: (center * 10) / eg.stitches + edgeCm,
    lengthCm: (patternRows * 10) / eg.rows + borderRowsCm,
  };
}

const TX = L(
  {
    title: (st: string) => `Şiş atkı · ${st}`,
    summary: (st: string, w: string, l: string, border: boolean) => `${w} genişliğinde, ${l} boyunda, ${st} ile düz şişte örülen atkı.${border ? ' Kenarları haraşo çerçeveyle düz durur.' : ''}`,
    size: (s: string) => `Yaklaşık ${s}`,
    sMain: 'Atkı',
    borderRows: (n: number) => `Haraşo kenar: ${n} sıra boyunca tüm ilmekleri düz ör.`,
    bLeft: `${BORDER_STS} düz (kenar)`,
    bRight: `${BORDER_STS} düz (kenar)`,
    pattern: (n: number, r: number, x: string) => `Desen sıraları: ${n} sıra (${r} tekrar). ${x} devam et; son tekrarı tamamla.`,
    noteFit: (m: string) => `İlmek sayısı desenin kuralına uyar (${m}). Genişliği değiştirirsen bu kurala uygun bir sayı seç.`,
  },
  {
    title: (st: string) => `Knitted scarf · ${st}`,
    summary: (st: string, w: string, l: string, border: boolean) => `A scarf ${w} wide and ${l} long, knitted flat in ${st}.${border ? ' A garter frame keeps the edges flat.' : ''}`,
    size: (s: string) => `About ${s}`,
    sMain: 'Scarf',
    borderRows: (n: number) => `Garter border: knit all sts for ${n} rows.`,
    bLeft: `k${BORDER_STS} (border)`,
    bRight: `k${BORDER_STS} (border)`,
    pattern: (n: number, r: number, x: string) => `Pattern rows: ${n} rows (${r} repeats). ${x}; finish the last repeat.`,
    noteFit: (m: string) => `The stitch count fits the pattern rule (${m}). If you change the width, choose a count that follows the rule.`,
  },
  {
    title: (st: string) => `Bufanda de punto · ${st}`,
    summary: (st: string, w: string, l: string, border: boolean) => `Bufanda de ${w} de ancho y ${l} de largo, tejida en plano en ${st}.${border ? ' Un marco de punto bobo mantiene los bordes planos.' : ''}`,
    size: (s: string) => `Unos ${s}`,
    sMain: 'Bufanda',
    borderRows: (n: number) => `Borde de punto bobo: tejer todos los puntos al derecho durante ${n} vueltas.`,
    bLeft: `${BORDER_STS} d (borde)`,
    bRight: `${BORDER_STS} d (borde)`,
    pattern: (n: number, r: number, x: string) => `Vueltas de punto: ${n} vueltas (${r} repeticiones). ${x}; termina la última repetición.`,
    noteFit: (m: string) => `El número de puntos cumple la regla del punto (${m}). Si cambias el ancho, elige un número que la cumpla.`,
  },
  {
    title: (st: string) => `Cachecol de tricô · ${st}`,
    summary: (st: string, w: string, l: string, border: boolean) => `Cachecol de ${w} de largura e ${l} de comprimento, tricotado reto em ${st}.${border ? ' Uma moldura em ponto liga deixa as bordas planas.' : ''}`,
    size: (s: string) => `Cerca de ${s}`,
    sMain: 'Cachecol',
    borderRows: (n: number) => `Borda em ponto liga: tricotar todos os pontos em meia durante ${n} carreiras.`,
    bLeft: `${BORDER_STS} m (borda)`,
    bRight: `${BORDER_STS} m (borda)`,
    pattern: (n: number, r: number, x: string) => `Carreiras de ponto: ${n} carreiras (${r} repetições). ${x}; complete a última repetição.`,
    noteFit: (m: string) => `O número de pontos segue a regra do ponto (${m}). Se mudar a largura, escolha um número que siga a regra.`,
  },
);

export function knitScarf(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const K = KT[lang];
  const W = WORDS[lang];
  const sp = PATTERN_BY_ID[p.stitchId ?? ''] && PATTERN_BY_ID[p.stitchId!].craft === 'knit' ? PATTERN_BY_ID[p.stitchId!] : PATTERN_BY_ID.haraso;
  const g = resolveGauge(p, 'knit', 'jarse');
  const selvedge = p.selvedge ?? true;
  const plan = knitScarfPlan(sp.id, p.widthCm ?? 20, p.lengthCm ?? 160, g, selvedge);
  assertMath(fitsPattern(plan.center, sp.flat), 'atkı ilmek sayısı desen katına uymalı');
  const rep = ROW_REPEAT[sp.id] ?? 2;
  const multi = p.yarn.colors.length > 1;
  const stripe = multi && (p.stripeRows ?? 0) > 0 ? Math.round(p.stripeRows!) : 0;
  const lStr = len(plan.lengthCm, p.units, lang);

  const b = new PatternBuilder('atki', 'knit', ctx);
  addPatternSection(b, sp, 'flat', lang, 'p', plan.center);
  b.section('a', T.sMain);
  b.step(K.castOnLabel, K.castOn(plan.castOn), { count: plan.castOn });
  let row = 1;
  if (plan.border) {
    b.step(W.rows(row, row + BORDER_ROWS - 1), T.borderRows(BORDER_ROWS), { count: plan.castOn, repeat: BORDER_ROWS, lessonIds: ['sis-haraso'] });
    row += BORDER_ROWS;
  }
  const rowText = selvedgeRow(lang, plan.center, selvedge || plan.border, plan.border ? { left: T.bLeft, right: T.bRight } : undefined);
  b.step(W.rows(row, row + plan.patternRows - 1), `${rowText} ${T.pattern(plan.patternRows, plan.patternRows / rep, K.measureFrom(lStr))}`, {
    count: plan.castOn,
    repeat: plan.patternRows,
    note: selvedge ? K.selNote : undefined,
  });
  row += plan.patternRows;
  if (plan.border) {
    b.step(W.rows(row, row + BORDER_ROWS - 1), T.borderRows(BORDER_ROWS), { count: plan.castOn, repeat: BORDER_ROWS });
    row += BORDER_ROWS;
  }
  if (stripe) {
    const seq = p.yarn.colors.map((_, i) => K.seqItem(stripe, `${W.colorLetter(i)} (${colorName(p.yarn, i, lang)})`)).join(', ');
    b.step(K.stripeLabel, K.stripes(seq, stripe % 2 === 0), { lessonIds: ['sis-uc-gizleme'] });
  }
  b.step(K.bindOffLabel, sp.id === 'haraso' ? K.bindOffKnit : K.bindOff);

  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, FINISH[lang].weaveKnit);
  if (p.fringe) fringeSteps(b, lang, plan.widthCm, p.units, 'knit');
  b.step(FINISH[lang].finishing, isSynthetic(p.yarn) ? FINISH[lang].blockAcrylic : FINISH[lang].block);

  const yarnM = metersForArea(plan.widthCm, plan.lengthCm, g, 'knit', areaFactor(sp)) + (p.fringe ? fringeMeters(plan.widthCm) : 0);
  const colorM = stripe ? splitMeters(yarnM, p.yarn.colors.map(() => 1)) : null;
  const keys: AbbrKey[] = ['co', 'k', 'p', 'sl', 'bo', 'rsws', 'st', 'rep'];
  if (sp.category === 'ajur') keys.push('yo', 'k2tog');
  if (sp.category === 'burgu') keys.push('cable');
  const size = sizeWxH(plan.widthCm, plan.lengthCm, p.units, lang);
  return b.build({
    title: p.overrides?.title ?? T.title(sp.name[lang]),
    summary: p.overrides?.summary ?? T.summary(inlineName(sp.name[lang], lang), len(plan.widthCm, p.units, lang), lStr, plan.border),
    materials: [
      ...yarnMaterials(p.yarn, yarnM, colorM, lang, p.units),
      ...toolMaterial(p.toolMm, 'sis-duz', lang),
      ...notions([...(sp.category === 'burgu' ? (['cableNeedle'] as const) : []), 'tapestry', 'scissors', ...(p.fringe ? (['cardboard'] as const) : [])], lang),
    ],
    gauge: g,
    yarnMeters: yarnM,
    finishedSize: T.size(size),
    abbreviations: abbreviations(keys, lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteFit(multipleRule(sp.id, lang)), ...sp.tips.slice(0, 1).map((t) => t[lang]), FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram: { kind: 'schematic', shape: 'rect', widthCm: plan.widthCm, heightCm: plan.lengthCm, labels: { width: len(plan.widthCm, p.units, lang), height: lStr } },
    params: storeParams(p, {
      gaugeLabel: gaugeText(g, 'jarse', lang, p.units),
      gaugeStitch: gaugeLabel('jarse', lang),
      castOn: plan.castOn,
      rowsTotal: plan.rows,
      fits: fitsPattern(plan.center, sp.flat),
      stripeColors: stripe ? p.yarn.colors.map((c) => c.hex) : undefined,
    }),
  });
}

function multipleRule(id: string, lang: PatternParams['lang']): string {
  return multipleText(PATTERN_BY_ID[id].flat, lang);
}
