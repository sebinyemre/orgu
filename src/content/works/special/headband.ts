/**
 * Tığ kulaklık bant: {hdc} ile, arka halkadan gidiş-dönüş örülür (dikey lastik görünümü).
 * Uçlar dikilir, ön tarafa sarılan küçük bir şeritle büzülür.
 */
import type { GeneratedPattern } from '@/types';
import { PatternBuilder, lk } from '@/engine/patterns/builder';
import { L, WORDS, FINISH, abbreviations, colorAt, gaugeLabel, gaugeText, notions, resolveGauge, splitMeters, storeParams, toolMaterial, yarnMaterials, sizeWxH } from '@/engine/patterns/common';
import { len } from '@/engine/patterns/fmt';
import { metersForStitches } from '@/engine/math/yarn';
import type { PatternParams } from '@/engine/patterns';

/** Arka halkadan örülen lastik çok esner: bant baş çevresinden %12 kısa */
export const HEADBAND_EASE = 0.12;

export function headbandPlan(headCm: number, widthCm: number, g: { stitches: number; rows: number }) {
  const sts = Math.max(6, Math.round((widthCm * g.stitches) / 10));
  const lengthCm = headCm * (1 - HEADBAND_EASE);
  const rows = Math.max(10, Math.round((lengthCm * g.rows) / 10));
  const cinchSts = Math.max(4, Math.round((4 * g.stitches) / 10));
  const cinchRows = Math.max(4, Math.round(((widthCm * 0.9) * g.rows) / 10));
  return { sts, rows, lengthCm: (rows * 10) / g.rows, widthCm: (sts * 10) / g.stitches, cinchSts, cinchRows };
}

const TX = L(
  {
    title: 'Lastik görünümlü kulaklık bant',
    summary: '{Hdc} ilmeklerin arka halkasından gidiş-dönüş örülen, esnek dikey çizgili sıcak bir bant. Uçları dikilir, önü küçük bir şeritle büzülür.',
    size: (s: string) => `Düz hâlde yaklaşık ${s}`,
    sBand: 'Bant',
    found: (n: number) => `${n} ${lk('tig-zincir', 'zincir')} çek.`,
    foundLabel: 'Temel zincir',
    r1: 'Tığdan itibaren 3. zincire 1 {hdc}, sonraki her zincire 1 {hdc}. İşi çevir.',
    r2: `2 zincir (ilmek sayılmaz), her ilmeğin ${lk('tig-halkalar', 'arka halkasına')} 1 {hdc}. İşi çevir.`,
    rN: (l: string) => `2. sırayı tekrarla; bant gerilmeden ${l} olana kadar devam et.`,
    sCinch: 'Büzgü şeridi',
    cinchF: (n: number) => `Ayrı bir parça için ${n} zincir çek.`,
    cinchRows: (n: number) => `Bantta olduğu gibi ${n} sıra ör (1. sıra zincire, sonrakiler arka halkaya).`,
    sJoin: 'Birleştirme',
    join1: `Bandı, kısa uçları üst üste gelecek şekilde ön yüzleri içe bakarak katla. İki ucu ${lk('tig-birlestirme', '{slst} ile ya da iğneyle dikerek')} birleştir.`,
    join2: 'Bandı ters çevir. Büzgü şeridini dikiş yerinin etrafına sıkıca sar, bandı büzerek şeridin kısa uçlarını içeride birbirine dik.',
    noteFit: 'Arka halkadan örülen lastik çok esner; bant baş çevresinden biraz kısa örülür ki kayıp düşmesin.',
    noteWidth: 'Genişliği değiştirmek için temel zinciri uzat ya da kısalt; boy sıra sayısıyla ayarlanır.',
  },
  {
    title: 'Ribbed ear warmer',
    summary: 'A warm, stretchy band worked back and forth in {hdc} through the back loop, which makes vertical ribs. The ends are sewn together and a small strip cinches the front.',
    size: (s: string) => `About ${s} laid flat`,
    sBand: 'Band',
    found: (n: number) => `${lk('tig-zincir', 'Ch')} ${n}.`,
    foundLabel: 'Foundation',
    r1: '{hdc.a} in 3rd ch from hook and in each ch across. Turn.',
    r2: `Ch 2 (does not count as a st), 1 {hdc.a} in the ${lk('tig-halkalar', 'back loop')} of each st across. Turn.`,
    rN: (l: string) => `Repeat row 2 until the band measures ${l} unstretched.`,
    sCinch: 'Cinch strip',
    cinchF: (n: number) => `For a separate piece, ch ${n}.`,
    cinchRows: (n: number) => `Work ${n} rows as for the band (row 1 into the chain, then back loops only).`,
    sJoin: 'Assembly',
    join1: `Fold the band so the short ends meet, right sides together. ${lk('tig-birlestirme', 'Join the ends')} with {slst.a} or sew them together.`,
    join2: 'Turn the band right side out. Wrap the cinch strip tightly around the seam, gathering the band, and sew the short ends of the strip together on the inside.',
    noteFit: 'Back-loop ribbing is very stretchy, so the band is made a little shorter than the head to stay in place.',
    noteWidth: 'To change the width, lengthen or shorten the foundation chain; the length is set by the number of rows.',
  },
  {
    title: 'Diadema calentador de orejas',
    summary: 'Una banda cálida y elástica tejida en ida y vuelta en {hdc} por la hebra trasera, que forma canalé vertical. Los extremos se cosen y una tira pequeña frunce el frente.',
    size: (s: string) => `Unos ${s} en plano`,
    sBand: 'Banda',
    found: (n: number) => `${n} ${lk('tig-zincir', 'cad')}.`,
    foundLabel: 'Cadeneta base',
    r1: '1 {hdc.a} en la 3.ª cad desde el ganchillo y 1 en cada cad. Girar.',
    r2: `2 cad (no cuentan), 1 {hdc.a} por la ${lk('tig-halkalar', 'hebra trasera')} de cada punto. Girar.`,
    rN: (l: string) => `Repetir la vuelta 2 hasta que la banda mida ${l} sin estirar.`,
    sCinch: 'Tira fruncidora',
    cinchF: (n: number) => `Para una pieza aparte, ${n} cad.`,
    cinchRows: (n: number) => `Tejer ${n} vueltas como en la banda (la 1.ª sobre la cadeneta y luego por la hebra trasera).`,
    sJoin: 'Montaje',
    join1: `Doblar la banda con los extremos cortos juntos, derecho con derecho. ${lk('tig-birlestirme', 'Unir los extremos')} con {slst} o cosiéndolos.`,
    join2: 'Dar la vuelta a la banda. Envolver la tira con firmeza alrededor de la costura, frunciendo la banda, y coser los extremos cortos de la tira por dentro.',
    noteFit: 'El canalé por la hebra trasera es muy elástico; por eso la banda se teje algo más corta que la cabeza y no se resbala.',
    noteWidth: 'Para cambiar el ancho, alarga o acorta la cadeneta base; el largo depende del número de vueltas.',
  },
  {
    title: 'Faixa aquece-orelhas',
    summary: 'Uma faixa quentinha e elástica feita em idas e voltas em {hdc} pela alça de trás, que forma canelado vertical. As pontas são costuradas e uma tira pequena franze a frente.',
    size: (s: string) => `Cerca de ${s} esticada na mesa`,
    sBand: 'Faixa',
    found: (n: number) => `${n} ${lk('tig-zincir', 'corr')}.`,
    foundLabel: 'Correntinha de base',
    r1: '1 {hdc.a} na 3ª corr a partir da agulha e 1 em cada corr. Virar.',
    r2: `2 corr (não contam), 1 {hdc.a} na ${lk('tig-halkalar', 'alça de trás')} de cada ponto. Virar.`,
    rN: (l: string) => `Repetir a carreira 2 até a faixa medir ${l} sem esticar.`,
    sCinch: 'Tira franzidora',
    cinchF: (n: number) => `Para uma peça separada, ${n} corr.`,
    cinchRows: (n: number) => `Fazer ${n} carreiras como na faixa (a 1ª sobre a correntinha e depois pela alça de trás).`,
    sJoin: 'Montagem',
    join1: `Dobrar a faixa com as pontas curtas juntas, direito com direito. ${lk('tig-birlestirme', 'Unir as pontas')} com {slst} ou costurando.`,
    join2: 'Desvirar a faixa. Enrolar a tira com firmeza ao redor da costura, franzindo a faixa, e costurar as pontas curtas da tira por dentro.',
    noteFit: 'O canelado pela alça de trás é muito elástico; por isso a faixa fica um pouco menor que a cabeça e não escorrega.',
    noteWidth: 'Para mudar a largura, aumente ou diminua a correntinha de base; o comprimento depende do número de carreiras.',
  },
);

export function headband(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const g = resolveGauge(p, 'crochet', 'hdc');
  const plan = headbandPlan(p.circumferenceCm ?? 56, p.widthCm ?? 10, g);
  const multi = p.yarn.colors.length > 1;
  const c0 = multi ? colorAt(p.yarn, 0) : undefined;
  const c1 = multi ? colorAt(p.yarn, 1) : undefined;

  const b = new PatternBuilder('kulaklik-bant', 'crochet', ctx);
  b.section('a', T.sBand);
  b.step(T.foundLabel, T.found(plan.sts + 2), { count: plan.sts + 2, color: c0 });
  b.step(W.row(1), T.r1, { count: plan.sts, color: c0, lessonIds: ['tig-yarim-trabzan'] });
  b.step(W.row(2), T.r2, { count: plan.sts, color: c0 });
  b.step(W.rows(3, plan.rows), T.rN(len(plan.lengthCm, p.units, lang)), { count: plan.sts, repeat: plan.rows - 2, color: c0 });
  b.step(FINISH[lang].finishing, FINISH[lang].weaveCrochet);
  b.section('b', T.sCinch);
  b.step(T.foundLabel, T.cinchF(plan.cinchSts + 2), { count: plan.cinchSts + 2, color: c1 });
  b.step(W.rows(1, plan.cinchRows), T.cinchRows(plan.cinchRows), { count: plan.cinchSts, repeat: plan.cinchRows, color: c1 });
  b.section('c', T.sJoin);
  b.step('1', T.join1);
  b.step('2', T.join2);
  b.step('3', FINISH[lang].weaveCrochet);

  const bandM = metersForStitches(plan.sts * plan.rows, g, 'hdc', 1, 0.12) + 1;
  const cinchM = metersForStitches(plan.cinchSts * plan.cinchRows, g, 'hdc', 1, 0.2) + 1;
  const total = bandM + cinchM;
  const size = sizeWxH(plan.lengthCm, plan.widthCm, p.units, lang);
  return b.build({
    title: p.overrides?.title ?? T.title,
    summary: p.overrides?.summary ?? T.summary,
    materials: [...yarnMaterials(p.yarn, total, multi ? splitMeters(total, [bandM, cinchM]) : null, lang, p.units), ...toolMaterial(p.toolMm, 'tig', lang), ...notions(['tapestry', 'scissors'], lang)],
    gauge: g,
    yarnMeters: total,
    finishedSize: T.size(size),
    abbreviations: abbreviations(['ch', 'hdc', 'blo', 'slst', 'st'], lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteFit, T.noteWidth, FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    diagram: { kind: 'schematic', shape: 'rect', widthCm: plan.lengthCm, heightCm: plan.widthCm, labels: { width: len(plan.lengthCm, p.units, lang), height: len(plan.widthCm, p.units, lang) } },
    params: storeParams(p, { gaugeLabel: gaugeText(g, 'hdc', lang, p.units), gaugeStitch: gaugeLabel('hdc', lang), castOn: plan.sts + 2 }),
  });
}
