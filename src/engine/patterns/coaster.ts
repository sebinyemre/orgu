/**
 * Tığ: yuvarlak bardak altlığı (düz daire). Başlangıç {sc} 6 / {hdc} 8 / {dc} 12 ilmek;
 * her turda başlangıç sayısı kadar artırma. Turlar kör ilmekle birleştirilir.
 */
import type { GeneratedPattern, PatternDiagram } from '@/types';
import { metersForStitches } from '@/engine/math/yarn';
import { CROCHET_BASICS } from '@/knowledge/terms';
import { PatternBuilder, assertMath, lk } from './builder';
import { L, WORDS, FINISH, abbreviations, colorAt, colorName, gaugeLabel, gaugeText, notions, resolveGauge, splitMeters, storeParams, toolMaterial, yarnMaterials } from './common';
import { len } from './fmt';
import { incText, incTokens, produced, consumed, shapedPositions, type Tok } from './rounds';
import { joinWithColorText } from './colorChange';
import type { CrochetStitch, PatternParams } from './types';

export const CIRCLE_START: Record<CrochetStitch, number> = { sc: 6, hdc: 8, dc: 12 };

export interface CircleRound {
  n: number;
  tokens: Tok[];
  count: number;
  m: number;
  stag: boolean;
}

/** Düz daire turları: 1. tur `s` ilmek, sonra her tur +s */
export function circleRounds(s: number, R: number, staggered: boolean): CircleRound[] {
  const out: CircleRound[] = [{ n: 1, tokens: Array(s).fill('p'), count: s, m: 0, stag: false }];
  for (let r = 2; r <= R; r++) {
    const m = r - 2;
    const stag = staggered && r % 2 === 1 && m >= 2;
    const t = incTokens(s, m, stag);
    out.push({ n: r, tokens: t, count: produced(t), m, stag });
  }
  return out;
}

export function checkCircle(r: CircleRound[]): boolean {
  return r.every((x, i) => i === 0 || consumed(x.tokens) === r[i - 1].count);
}

/** Bir tur yüksekliği ve ilmek eniyle daire turu sayısı ve gerçek çap */
export function circlePlan(diameterCm: number, s: number, g: { stitches: number; rows: number }) {
  const w = 10 / g.stitches;
  const h = 10 / g.rows;
  const perRound = (2 * h + (s * w) / Math.PI) / 2;
  const R = Math.max(2, Math.round(diameterCm / perRound));
  return { R, diameter: R * perRound };
}

const TX = L(
  {
    title: 'Yuvarlak bardak altlığı',
    titleN: (n: number) => `Yuvarlak bardak altlığı seti (${n} adet)`,
    summary: (d: string, st: string) => `${d} çapında, ${st} ile turlar hâlinde örülen dümdüz daire. Her turda aynı sayıda artırma yapılarak daire düz kalır.`,
    size: (d: string, n: number) => (n > 1 ? `Çap yaklaşık ${d}, ${n} adet` : `Çap yaklaşık ${d}`),
    sRounds: 'Daire',
    intro: (ch: number, st: string) => `Turlar birleştirilerek örülür. Her tur ${ch} zincirle başlar (ilmek sayılmaz); turun ilk ${st} ilmeğini birleştirdiğin ilmeğe ör, turu ilk ilmeğe {slst} ile kapat.`,
    r1: (ch: number, s: number, st: string) => `${lk('tig-sihirli-halka', 'Sihirli halka')} yap. ${ch} zincir çek, halkaya ${s} ${st} ör. Halkayı sıkıca kapat, ilk ilmeğe {slst} ile birleştir.`,
    crab: 'Kenar',
    crabText: `1 zincir çek, ${lk('tig-yengec', 'yengeç ilmeği')} ile (soldan sağa doğru {sc}) her ilmeğe 1 ilmek ör; ilk ilmeğe {slst} ile birleştir.`,
    setLabel: 'Set',
    more: (n: number) => `Toplam ${n} altlık ör.`,
    moreColors: 'Her altlığı sıradaki renkle ör.',
    noteFlat: 'Daire dalgalanıyorsa (fırfır) bir numara ince tığ kullan; çanak gibi kıvrılıyorsa bir numara kalın tığa geç ya da sıkı örüyorsan gevşet.',
    noteCotton: 'Bardak altlığı için pamuk ya da penye ip seç: sıcağa dayanır, suyu emer ve yıkanınca biçimini korur.',
    noteSeam: 'Birleştirme yerleri her turda aynı noktaya gelir. Daha az görünsün istersen tur başını her turda bir ilmek kaydırabilirsin.',
  },
  {
    title: 'Round coaster',
    titleN: (n: number) => `Round coaster set (${n} pieces)`,
    summary: (d: string, st: string) => `A flat circle about ${d} across, worked in joined rounds of ${st}. Each round adds the same number of increases so the circle stays flat.`,
    size: (d: string, n: number) => (n > 1 ? `About ${d} in diameter, set of ${n}` : `About ${d} in diameter`),
    sRounds: 'Circle',
    intro: (ch: number, st: string) => `Work in joined rounds. Start each round with ch ${ch} (does not count as a stitch), work the first ${st} into the same stitch as the join and close the round with a {slst.a} into the first stitch.`,
    r1: (ch: number, s: number, st: string) => `Make a ${lk('tig-sihirli-halka', 'magic ring')}. Ch ${ch}, work ${s} ${st} into the ring. Pull the ring closed and join with a {slst.a} to the first stitch.`,
    crab: 'Edging',
    crabText: `Ch 1, work ${lk('tig-yengec', 'crab stitch')} (reverse {sc.a}, from left to right) in each st around; join with a {slst.a} to the first stitch.`,
    setLabel: 'Set',
    more: (n: number) => `Make ${n} coasters in total.`,
    moreColors: 'Work each coaster in the next color.',
    noteFlat: 'If the circle ruffles, go down a hook size; if it cups like a bowl, go up a hook size or loosen your tension.',
    noteCotton: 'Choose cotton for coasters: it handles heat, absorbs drips and keeps its shape in the wash.',
    noteSeam: 'The joins line up in the same place every round. To hide them, move the start of each round over by one stitch.',
  },
  {
    title: 'Posavasos redondo',
    titleN: (n: number) => `Juego de posavasos redondos (${n} piezas)`,
    summary: (d: string, st: string) => `Un círculo plano de unos ${d} de diámetro, tejido en vueltas cerradas de ${st}. Cada vuelta suma los mismos aumentos para que quede plano.`,
    size: (d: string, n: number) => (n > 1 ? `Unos ${d} de diámetro, ${n} piezas` : `Unos ${d} de diámetro`),
    sRounds: 'Círculo',
    intro: (ch: number, st: string) => `Se teje en vueltas cerradas. Cada vuelta empieza con ${ch} cad (no cuentan como punto); el primer ${st} se teje en el mismo punto del cierre y la vuelta se cierra con un {slst} en el primer punto.`,
    r1: (ch: number, s: number, st: string) => `Hacer un ${lk('tig-sihirli-halka', 'anillo mágico')}. ${ch} cad, tejer ${s} ${st} dentro del anillo. Cerrar el anillo y unir con {slst} al primer punto.`,
    crab: 'Borde',
    crabText: `1 cad, tejer ${lk('tig-yengec', 'punto cangrejo')} ({sc} hacia atrás, de izquierda a derecha) en cada punto; cerrar con {slst} en el primer punto.`,
    setLabel: 'Juego',
    more: (n: number) => `Tejer ${n} posavasos en total.`,
    moreColors: 'Tejer cada posavasos con el color siguiente.',
    noteFlat: 'Si el círculo hace ondas, usa un ganchillo más fino; si se curva como un cuenco, usa uno más grueso o afloja la tensión.',
    noteCotton: 'Para posavasos elige algodón: aguanta el calor, absorbe las gotas y no se deforma al lavarlo.',
    noteSeam: 'Los cierres caen en el mismo lugar en cada vuelta. Para disimularlos, desplaza el inicio un punto en cada vuelta.',
  },
  {
    title: 'Porta-copos redondo',
    titleN: (n: number) => `Jogo de porta-copos redondos (${n} peças)`,
    summary: (d: string, st: string) => `Um círculo plano de cerca de ${d} de diâmetro, feito em voltas fechadas de ${st}. Cada volta tem o mesmo número de aumentos para o círculo ficar plano.`,
    size: (d: string, n: number) => (n > 1 ? `Cerca de ${d} de diâmetro, ${n} peças` : `Cerca de ${d} de diâmetro`),
    sRounds: 'Círculo',
    intro: (ch: number, st: string) => `Trabalhe em voltas fechadas. Cada volta começa com ${ch} corr (não contam como ponto); o primeiro ${st} vai no mesmo ponto do fechamento e a volta se fecha com {slst} no primeiro ponto.`,
    r1: (ch: number, s: number, st: string) => `Fazer um ${lk('tig-sihirli-halka', 'anel mágico')}. ${ch} corr, trabalhar ${s} ${st} dentro do anel. Fechar o anel e unir com {slst} ao primeiro ponto.`,
    crab: 'Borda',
    crabText: `1 corr, trabalhar ${lk('tig-yengec', 'ponto caranguejo')} ({sc} para trás, da esquerda para a direita) em cada ponto; fechar com {slst} no primeiro ponto.`,
    setLabel: 'Jogo',
    more: (n: number) => `Fazer ${n} porta-copos no total.`,
    moreColors: 'Fazer cada porta-copos com a cor seguinte.',
    noteFlat: 'Se o círculo ondular, use uma agulha mais fina; se curvar como uma tigela, use uma mais grossa ou solte a tensão.',
    noteCotton: 'Para porta-copos escolha algodão: aguenta o calor, absorve as gotas e não deforma na lavagem.',
    noteSeam: 'Os fechamentos ficam no mesmo lugar em todas as voltas. Para disfarçar, desloque o início um ponto a cada volta.',
  },
);

export function coaster(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const st: CrochetStitch = p.crochetStitch ?? 'hdc';
  const g = resolveGauge(p, 'crochet', st);
  const s = CIRCLE_START[st];
  const n = Math.max(1, p.count ?? 1);
  const { R, diameter } = circlePlan(p.diameterCm ?? 10, s, g);
  const rounds = circleRounds(s, R, true);
  assertMath(checkCircle(rounds), 'daire turları');
  const multi = p.yarn.colors.length > 1;
  const perRound = multi && p.colorMode === 'rounds';
  const ch = Math.max(1, CROCHET_BASICS[st].turningCh === 3 ? 2 : CROCHET_BASICS[st].turningCh);
  const stName = lang === 'tr' ? `{${st}}` : `{${st}.a}`;
  const stLong = `{${st}}`;
  const edge = p.edge === 'crab';

  const b = new PatternBuilder('bardak-altligi', 'crochet', ctx);
  b.section('a', T.sRounds, T.intro(ch, stName));
  rounds.forEach((r, i) => {
    let text = r.n === 1 ? T.r1(ch, s, stName) : r.m === 0 ? incText(lang, st, s, 0, false, true) : incText(lang, st, s, r.m, r.stag, false);
    const color = perRound ? colorAt(p.yarn, i) : multi ? colorAt(p.yarn, 0) : undefined;
    if (perRound && (i + 1 < rounds.length || edge)) text = `${text} ${joinWithColorText(lang, (i + 1) % p.yarn.colors.length, p.yarn)}`;
    b.step(W.rnd(r.n), text, { count: r.count, color });
  });
  const last = rounds[rounds.length - 1].count;
  if (edge) b.step(`${W.rnd(R + 1)} · ${T.crab}`, T.crabText, { count: last, color: perRound ? colorAt(p.yarn, R) : multi ? colorAt(p.yarn, 0) : undefined });
  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, FINISH[lang].weaveCrochet);
  if (n > 1) b.step(T.setLabel, `${T.more(n)}${multi && !perRound ? ` ${T.moreColors}` : ''}`, { repeat: n });

  const stitchesPer = rounds.reduce((a, r) => a + r.count, 0) + (edge ? last : 0);
  const kind = st;
  const per = metersForStitches(stitchesPer, g, kind, 1, 0.15) + 0.6;
  const total = per * n;
  let colorM: number[] | null = null;
  if (multi) {
    if (perRound) {
      const w = p.yarn.colors.map(() => 0);
      rounds.forEach((r, i) => (w[i % w.length] += r.count));
      if (edge) w[R % w.length] += last;
      colorM = splitMeters(total, w);
    } else {
      const w = p.yarn.colors.map((_, i) => Math.ceil((n - i) / p.yarn.colors.length));
      colorM = splitMeters(total, w.map((x) => Math.max(0, x)));
    }
  }

  const diagram: PatternDiagram = {
    kind: 'rounds',
    craft: 'crochet',
    rounds: rounds.map((r, i) => ({ stitches: r.count, label: String(r.n), color: perRound ? colorAt(p.yarn, i) : colorAt(p.yarn, 0), symbol: st, incPositions: shapedPositions(r.tokens).inc })),
  };
  const dStr = len(diameter, p.units, lang);
  const stLabel = `${stLong}`;
  return b.build({
    title: p.overrides?.title ?? (n > 1 ? T.titleN(n) : T.title),
    summary: p.overrides?.summary ?? T.summary(dStr, stLabel),
    materials: [...yarnMaterials(p.yarn, total, colorM, lang, p.units), ...toolMaterial(p.toolMm, 'tig', lang), ...notions(['tapestry', 'scissors'], lang)],
    gauge: g,
    yarnMeters: total,
    finishedSize: T.size(dStr, n),
    abbreviations: abbreviations(['mr', 'ch', 'slst', st === 'sc' ? 'sc' : st, ...(st === 'sc' ? (['inc'] as const) : []), ...(edge ? (['sc'] as const) : []), 'st', 'rep'], lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteCotton, T.noteFlat, T.noteSeam, FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram,
    params: storeParams(p, {
      gaugeLabel: gaugeText(g, st, lang, p.units),
      gaugeStitch: gaugeLabel(st, lang),
      castOn: s,
      maxStitches: last,
      colorNames: p.yarn.colors.map((_, i) => colorName(p.yarn, i, lang)),
    }),
  });
}
