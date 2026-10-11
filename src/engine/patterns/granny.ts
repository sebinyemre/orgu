/**
 * Tığ: klasik büyükanne karesi (3'lü {dc} kümeleri, 2 zincirli köşeler, 1 zincirli yan boşluklar).
 * n. turda 4n küme = 12n {dc}, her turda 4 köşe ve 4(n−1) yan boşluk vardır.
 * İsteğe bağlı: N × M kareden battaniye, birleştirme ve {sc} kenar.
 */
import type { GeneratedPattern, Lang, PatternDiagram } from '@/types';
import { metersForStitches } from '@/engine/math/yarn';
import { PatternBuilder, assertMath, lk } from './builder';
import { L, WORDS, FINISH, abbreviations, colorAt, colorName, gaugeLabel, gaugeText, notions, resolveGauge, splitMeters, storeParams, toolMaterial, yarnMaterials, sizeWxH } from './common';
import { len } from './fmt';
import type { PatternParams, YarnSpec } from './types';

const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

export interface GrannyRound {
  n: number;
  clusters: number;
  dc: number;
  corners: number;
  sideSpaces: number;
  chains: number;
}

export function grannyRounds(n: number): GrannyRound[] {
  return Array.from({ length: n }, (_, i) => {
    const k = i + 1;
    return { n: k, clusters: 4 * k, dc: 12 * k, corners: 4, sideSpaces: 4 * (k - 1), chains: 8 + 4 * (k - 1) };
  });
}

/** Kenarın 1. turundaki {sc} sayısı: 4(sütun + satır)(2n + 1) */
export const borderFirstRound = (cols: number, rows: number, n: number) => 4 * (cols + rows) * (2 * n + 1);

function joinColor(lang: Lang, idx: number, yarn: YarnSpec): string {
  const letter = WORDS[lang].colorLetter(idx);
  const name = colorName(yarn, idx, lang);
  switch (lang) {
    case 'tr':
      return `${lk('tig-renk-degistirme', `${letter}ni`)} (${name}) herhangi bir köşe boşluğuna {slst} ile bağla.`;
    case 'en':
      return `Join ${lk('tig-renk-degistirme', letter)} (${name}) with a {slst.a} in any ch-2 corner space.`;
    case 'es':
      return `Unir el ${lk('tig-renk-degistirme', lowerFirst(letter))} (${name}) con {slst} en cualquier esquina de 2 cad.`;
    case 'pt':
      return `Prender a ${lk('tig-renk-degistirme', lowerFirst(letter))} (${name}) com {slst} em qualquer canto de 2 corr.`;
  }
}

const TX = L(
  {
    title: 'Büyükanne karesi',
    titleBlanket: 'Büyükanne karesi battaniye',
    summary: (n: number, multi: boolean) =>
      `${n} turlu klasik büyükanne karesi: üçlü {dc} kümeleri, 2 zincirli köşeler ve aralarda 1 zincirlik boşluklar.${multi ? ' Her tur farklı renkle örülür.' : ''}`,
    summaryBlanket: (c: number, r: number) => ` ${c} × ${r} kare birleştirilip {sc} kenarla çevrelenir.`,
    size: (s: string) => `Bir kare yaklaşık ${s}`,
    sizeBlanket: (s: string, c: number, r: number, b: string) => `Battaniye yaklaşık ${b} (${c} × ${r} kare, her kare ${s})`,
    sSquare: 'Kare',
    sSquareIntro: 'Her tur başlangıçtaki 3 zincirin tepesine {slst} ile birleştirilir. Başlangıçtaki 3 zincir ilk {dc} sayılır.',
    r1: `${lk('tig-sihirli-halka', 'Sihirli halka')} yap (ya da 4 zincir çekip {slst} ile halka yap). 3 zincir, halkaya 2 {dc}, 2 zincir, *halkaya 3 {dc}, 2 zincir* 3 kez tekrarla. Halkayı kapat, başlangıçtaki 3 zincirin tepesine {slst} ile birleştir.`,
    moveCorner: 'Sonraki 2 ilmeğe ve köşe boşluğuna birer {slst} yaparak köşeye ilerle.',
    corner1: '3 zincir, aynı köşeye (2 {dc}, 2 zincir, 3 {dc})',
    side: (k: number) => (k === 1 ? 'sonraki 1 zincir boşluğuna 3 {dc}, 1 zincir' : `(sonraki 1 zincir boşluğuna 3 {dc}, 1 zincir) ${k} kez`),
    corner: 'sonraki köşe boşluğuna (3 {dc}, 2 zincir, 3 {dc}), 1 zincir',
    end: 'başlangıç zincirinin tepesine {slst} ile birleştir.',
    rep3: (s: string) => `*${s}* 3 kez tekrarla`,
    fasten: 'Rengi değiştireceğin için ipi 10 cm uç bırakarak kes.',
    count: (dc: number, sp: number) => `${dc} {dc} · 4 köşe${sp ? ` · ${sp} yan boşluk` : ''}`,
    sJoin: 'Birleştirme',
    squares: 'Kareler',
    make: (c: number, r: number) => `Toplam ${c * r} kare ör (${c} sütun × ${r} sıra). Renkleri karıştırarak diz; aynı renkler yan yana gelmesin.`,
    joinSlst: `İki kareyi ön yüzleri içe gelecek şekilde üst üste tut. Köşe zincirinden köşe zincirine kadar iki karenin ${lk('tig-halkalar', 'arka halkalarından')} birlikte {slst} ile ${lk('tig-birlestirme', 'birleştir')}.`,
    joinSc: `İki kareyi ters yüzleri içe gelecek şekilde tut. Köşeden köşeye iki karenin dış halkalarından birlikte {sc} ile ${lk('tig-birlestirme', 'birleştir')}; ön yüzde kabarık bir çizgi oluşur.`,
    joinWhip: `Kareleri ön yüzleri yukarı bakacak şekilde yan yana koy. Yün iğnesiyle iki karenin arka halkalarından ${lk('tig-birlestirme', 'kenar dikişi')} yap.`,
    rowsFirst: (c: number, r: number) => `Önce her sıradaki ${c} kareyi yan yana birleştir (${r} şerit). Sonra şeritleri uzun kenarlarından birleştir; dikiş köşelerde kesişsin.`,
    sBorder: 'Kenar',
    b1: `Herhangi bir köşeye ipi {slst} ile bağla. 1 zincir, aynı köşeye 3 {sc}. Kenarlar boyunca her ilmeğe ve her 1 zincir boşluğuna 1 {sc} ör; karelerin birleştiği yerlerde iki köşe boşluğuna ve dikişe birer {sc}, battaniyenin köşelerine 3 {sc} ör. İlk ilmeğe {slst} ile birleştir.`,
    bN: '1 zincir, her ilmeğe 1 {sc}; köşelerdeki 3 ilmeğin ortadakine 3 {sc}. İlk ilmeğe {slst} ile birleştir.',
    noteTension: 'Kareler aynı ölçüde olsun diye hepsini aynı tığla ve aynı gerginlikte ör; birleştirmeden önce dinlendirmek kenarları eşitler.',
    noteBack: 'Kareyi her turda çevirmeden, hep ön yüzden ör. Köşeler eğiliyorsa köşe zincirini 3 zincire çıkar.',
    noteEnds: 'Her renk değişiminde kalan uçları bir sonraki turu örerken ilmeklerin içine alırsan sonda gizlenecek uç azalır.',
  },
  {
    title: 'Granny square',
    titleBlanket: 'Granny square blanket',
    summary: (n: number, multi: boolean) => `A classic ${n}-round granny square: clusters of three {dc.a}, ch-2 corners and ch-1 spaces between clusters.${multi ? ' Each round is worked in a new color.' : ''}`,
    summaryBlanket: (c: number, r: number) => ` ${c} × ${r} squares are joined and finished with a {sc} border.`,
    size: (s: string) => `One square is about ${s}`,
    sizeBlanket: (s: string, c: number, r: number, b: string) => `Blanket about ${b} (${c} × ${r} squares, each ${s})`,
    sSquare: 'Square',
    sSquareIntro: 'Join every round with a {slst.a} to the top of the beginning ch-3. The beginning ch-3 counts as the first {dc.a}.',
    r1: `Make a ${lk('tig-sihirli-halka', 'magic ring')} (or ch 4 and join with a {slst.a} to form a ring). Ch 3, 2 {dc.a} into the ring, ch 2, *3 {dc.a} into the ring, ch 2* 3 times. Pull the ring closed and join with a {slst.a} to the top of the beginning ch-3.`,
    moveCorner: '{slst.a} in each of the next 2 sts and into the corner space.',
    corner1: 'Ch 3, (2 {dc.a}, ch 2, 3 {dc.a}) in the same corner space',
    side: (k: number) => (k === 1 ? '3 {dc.a} in the next ch-1 space, ch 1' : `(3 {dc.a} in the next ch-1 space, ch 1) ${k} times`),
    corner: '(3 {dc.a}, ch 2, 3 {dc.a}) in the next corner space, ch 1',
    end: 'join with a {slst.a} to the top of the beginning ch-3.',
    rep3: (s: string) => `*${s}* 3 times`,
    fasten: 'Fasten off, leaving a 10 cm (4") tail, to change color.',
    count: (dc: number, sp: number) => `${dc} {dc.a} · 4 corners${sp ? ` · ${sp} side spaces` : ''}`,
    sJoin: 'Joining',
    squares: 'Squares',
    make: (c: number, r: number) => `Make ${c * r} squares in total (${c} across × ${r} down). Mix the colors so that matching squares do not sit side by side.`,
    joinSlst: `Hold two squares with right sides together. From corner chain to corner chain, ${lk('tig-birlestirme', 'join')} with {slst.a} through the ${lk('tig-halkalar', 'back loops')} of both squares.`,
    joinSc: `Hold two squares with wrong sides together. From corner to corner, ${lk('tig-birlestirme', 'join')} with {sc.a} through the outer loops of both squares; it makes a raised ridge on the front.`,
    joinWhip: `Lay the squares side by side, right side up. With the tapestry needle, ${lk('tig-birlestirme', 'whip stitch')} through the back loops of both squares.`,
    rowsFirst: (c: number, r: number) => `First join the ${c} squares of each row into a strip (${r} strips). Then join the strips along their long edges so the seams meet at the corners.`,
    sBorder: 'Border',
    b1: `Join the yarn with a {slst.a} in any corner. Ch 1, 3 {sc.a} in the same corner. Along the sides work 1 {sc.a} in each st and each ch-1 space; where squares meet, work 1 {sc.a} in each of the two corner spaces and 1 in the seam; work 3 {sc.a} in each blanket corner. Join with a {slst.a} to the first st.`,
    bN: 'Ch 1, 1 {sc.a} in each st, 3 {sc.a} in the center st of each corner. Join with a {slst.a} to the first st.',
    noteTension: 'Use the same hook and tension for every square so they match; blocking before joining evens out the edges.',
    noteBack: 'Do not turn between rounds; always work from the right side. If the corners curl, use ch 3 for the corners.',
    noteEnds: 'Crochet over the tails of each color change while working the next round and you will have fewer ends to weave in.',
  },
  {
    title: 'Cuadro de la abuela',
    titleBlanket: 'Manta de cuadros de la abuela',
    summary: (n: number, multi: boolean) => `Un cuadro de la abuela clásico de ${n} vueltas: grupos de tres {dc.a}, esquinas de 2 cad y espacios de 1 cad entre grupos.${multi ? ' Cada vuelta se teje con un color nuevo.' : ''}`,
    summaryBlanket: (c: number, r: number) => ` Se unen ${c} × ${r} cuadros y se rematan con un borde de {sc}.`,
    size: (s: string) => `Un cuadro mide unos ${s}`,
    sizeBlanket: (s: string, c: number, r: number, b: string) => `Manta de unos ${b} (${c} × ${r} cuadros de ${s})`,
    sSquare: 'Cuadro',
    sSquareIntro: 'Cada vuelta se cierra con {slst} en la 3.ª cad del inicio. Las 3 cad del inicio cuentan como el primer {dc.a}.',
    r1: `Hacer un ${lk('tig-sihirli-halka', 'anillo mágico')} (o 4 cad cerradas con {slst}). 3 cad, 2 {dc.a} en el anillo, 2 cad, *3 {dc.a} en el anillo, 2 cad* 3 veces. Cerrar el anillo y unir con {slst} a la 3.ª cad del inicio.`,
    moveCorner: '{slst} en los 2 puntos siguientes y en la esquina para llegar a ella.',
    corner1: '3 cad, (2 {dc.a}, 2 cad, 3 {dc.a}) en la misma esquina',
    side: (k: number) => (k === 1 ? '3 {dc.a} en el siguiente esp de 1 cad, 1 cad' : `(3 {dc.a} en el siguiente esp de 1 cad, 1 cad) ${k} veces`),
    corner: '(3 {dc.a}, 2 cad, 3 {dc.a}) en la esquina siguiente, 1 cad',
    end: 'unir con {slst} a la 3.ª cad del inicio.',
    rep3: (s: string) => `*${s}* 3 veces`,
    fasten: 'Cortar el hilo dejando 10 cm para cambiar de color.',
    count: (dc: number, sp: number) => `${dc} {dc.a} · 4 esquinas${sp ? ` · ${sp} espacios laterales` : ''}`,
    sJoin: 'Unión',
    squares: 'Cuadros',
    make: (c: number, r: number) => `Tejer ${c * r} cuadros (${c} de ancho × ${r} de alto). Mezcla los colores para que no queden iguales uno al lado del otro.`,
    joinSlst: `Poner dos cuadros derecho con derecho. De esquina a esquina, ${lk('tig-birlestirme', 'unir')} con {slst} por las ${lk('tig-halkalar', 'hebras traseras')} de ambos.`,
    joinSc: `Poner dos cuadros revés con revés. De esquina a esquina, ${lk('tig-birlestirme', 'unir')} con {sc} por las hebras exteriores de ambos; queda un cordón en relieve.`,
    joinWhip: `Colocar los cuadros uno al lado del otro, derecho arriba. Con la aguja lanera, ${lk('tig-birlestirme', 'coser a punto por encima')} por las hebras traseras de ambos.`,
    rowsFirst: (c: number, r: number) => `Primero unir los ${c} cuadros de cada fila formando tiras (${r} tiras). Después unir las tiras por los lados largos, haciendo coincidir las esquinas.`,
    sBorder: 'Borde',
    b1: `Unir el hilo con {slst} en una esquina. 1 cad, 3 {sc.a} en la misma esquina. Por los lados, 1 {sc.a} en cada punto y en cada esp de 1 cad; donde se juntan los cuadros, 1 {sc.a} en cada esquina y 1 en la costura; 3 {sc.a} en cada esquina de la manta. Unir con {slst} al primer punto.`,
    bN: '1 cad, 1 {sc.a} en cada punto y 3 {sc.a} en el punto central de cada esquina. Unir con {slst} al primer punto.',
    noteTension: 'Teje todos los cuadros con el mismo ganchillo y la misma tensión; bloquearlos antes de unirlos iguala los bordes.',
    noteBack: 'No gires la labor entre vueltas: trabaja siempre por el derecho. Si las esquinas se curvan, haz esquinas de 3 cad.',
    noteEnds: 'Teje por encima de las hebras de cada cambio de color en la vuelta siguiente y tendrás menos hebras que esconder.',
  },
  {
    title: 'Quadradinho da vovó',
    titleBlanket: 'Manta de quadradinhos da vovó',
    summary: (n: number, multi: boolean) => `Um quadradinho da vovó clássico de ${n} voltas: grupos de três {dc.a}, cantos de 2 corr e espaços de 1 corr entre os grupos.${multi ? ' Cada volta é feita com uma cor nova.' : ''}`,
    summaryBlanket: (c: number, r: number) => ` ${c} × ${r} quadrados são unidos e arrematados com uma borda de {sc}.`,
    size: (s: string) => `Cada quadrado mede cerca de ${s}`,
    sizeBlanket: (s: string, c: number, r: number, b: string) => `Manta de cerca de ${b} (${c} × ${r} quadrados de ${s})`,
    sSquare: 'Quadrado',
    sSquareIntro: 'Cada volta se fecha com {slst} na 3ª correntinha do início. As 3 corr do início contam como o primeiro {dc.a}.',
    r1: `Fazer um ${lk('tig-sihirli-halka', 'anel mágico')} (ou 4 corr fechadas com {slst}). 3 corr, 2 {dc.a} no anel, 2 corr, *3 {dc.a} no anel, 2 corr* 3 vezes. Fechar o anel e unir com {slst} na 3ª corr do início.`,
    moveCorner: '{slst} nos 2 pontos seguintes e no canto para chegar até ele.',
    corner1: '3 corr, (2 {dc.a}, 2 corr, 3 {dc.a}) no mesmo canto',
    side: (k: number) => (k === 1 ? '3 {dc.a} no próximo esp de 1 corr, 1 corr' : `(3 {dc.a} no próximo esp de 1 corr, 1 corr) ${k} vezes`),
    corner: '(3 {dc.a}, 2 corr, 3 {dc.a}) no próximo canto, 1 corr',
    end: 'unir com {slst} na 3ª corr do início.',
    rep3: (s: string) => `*${s}* 3 vezes`,
    fasten: 'Cortar o fio deixando 10 cm para trocar de cor.',
    count: (dc: number, sp: number) => `${dc} {dc.a} · 4 cantos${sp ? ` · ${sp} espaços laterais` : ''}`,
    sJoin: 'União',
    squares: 'Quadrados',
    make: (c: number, r: number) => `Fazer ${c * r} quadrados (${c} na largura × ${r} na altura). Misture as cores para que iguais não fiquem lado a lado.`,
    joinSlst: `Colocar dois quadrados direito com direito. De canto a canto, ${lk('tig-birlestirme', 'unir')} com {slst} pelas ${lk('tig-halkalar', 'alças de trás')} dos dois.`,
    joinSc: `Colocar dois quadrados avesso com avesso. De canto a canto, ${lk('tig-birlestirme', 'unir')} com {sc} pelas alças de fora dos dois; forma um cordão em relevo.`,
    joinWhip: `Colocar os quadrados lado a lado, direito para cima. Com a agulha de tapeçaria, ${lk('tig-birlestirme', 'costurar com ponto por cima')} pelas alças de trás dos dois.`,
    rowsFirst: (c: number, r: number) => `Primeiro unir os ${c} quadrados de cada fileira formando tiras (${r} tiras). Depois unir as tiras pelos lados compridos, casando os cantos.`,
    sBorder: 'Borda',
    b1: `Prender o fio com {slst} em um canto. 1 corr, 3 {sc.a} no mesmo canto. Pelos lados, 1 {sc.a} em cada ponto e em cada esp de 1 corr; onde os quadrados se encontram, 1 {sc.a} em cada canto e 1 na costura; 3 {sc.a} em cada canto da manta. Unir com {slst} no primeiro ponto.`,
    bN: '1 corr, 1 {sc.a} em cada ponto e 3 {sc.a} no ponto central de cada canto. Unir com {slst} no primeiro ponto.',
    noteTension: 'Faça todos os quadrados com a mesma agulha e a mesma tensão; blocar antes de unir iguala as bordas.',
    noteBack: 'Não vire o trabalho entre as voltas: trabalhe sempre pelo direito. Se os cantos curvarem, faça cantos de 3 corr.',
    noteEnds: 'Trabalhe por cima das pontas de cada troca de cor na volta seguinte e você terá menos pontas para esconder.',
  },
);

export function granny(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const g = resolveGauge(p, 'crochet', 'dc');
  const n = Math.max(1, Math.min(30, Math.round(p.rounds ?? 4)));
  const cols = Math.max(0, Math.round(p.blanketCols ?? 0));
  const rowsB = Math.max(0, Math.round(p.blanketRows ?? 0));
  const blanket = cols > 0 && rowsB > 0;
  const borderN = blanket ? Math.max(0, Math.round(p.borderRounds ?? 2)) : 0;
  const multi = p.yarn.colors.length > 1;
  const rounds = grannyRounds(n);
  assertMath(rounds.every((r) => r.corners === 4 && r.dc === 12 * r.n), 'büyükanne karesi turları');
  const b = new PatternBuilder('buyukanne-karesi', 'crochet', ctx);

  b.section('a', T.sSquare, T.sSquareIntro);
  rounds.forEach((r, i) => {
    const color = colorAt(p.yarn, i);
    const nextNew = multi && i + 1 < n && colorAt(p.yarn, i + 1) !== color;
    let text: string;
    if (r.n === 1) text = T.r1;
    else {
      const start = multi && colorAt(p.yarn, i - 1) !== color ? joinColor(lang, i % p.yarn.colors.length, p.yarn) : T.moveCorner;
      const sides = r.n - 2;
      const rest = sides > 0 ? `${T.corner}, ${T.side(sides)}` : T.corner;
      const ch1 = { tr: '1 zincir', en: 'ch 1', es: '1 cad', pt: '1 corr' }[lang];
      const first = sides > 0 ? `${T.corner1}, ${ch1}, ${T.side(sides)}` : `${T.corner1}, ${ch1}`;
      text = `${start} ${capFirst(first, lang)}, ${T.rep3(rest)}; ${T.end}`;
    }
    if (nextNew) text = `${text} ${T.fasten}`;
    b.step(W.rnd(r.n), text, { count: r.dc, color: multi ? color : undefined, note: T.count(r.dc, r.sideSpaces) });
  });

  // ölçüler
  const h = 10 / g.rows;
  const side = 2 * n * h + 0.4 * h;
  const scH = h * 0.5;
  const bW = cols * side + 2 * borderN * scH;
  const bH = rowsB * side + 2 * borderN * scH;

  if (blanket) {
    b.section('j', T.sJoin);
    b.step(T.squares, T.make(cols, rowsB), { repeat: cols * rowsB });
    b.step(T.sJoin, p.join === 'whip' ? T.joinWhip : p.join === 'sc' ? T.joinSc : T.joinSlst);
    b.step(`${cols} × ${rowsB}`, T.rowsFirst(cols, rowsB));
    if (borderN > 0) {
      b.section('k', T.sBorder);
      let c = borderFirstRound(cols, rowsB, n);
      for (let k = 1; k <= borderN; k++) {
        b.step(W.rnd(k), k === 1 ? T.b1 : T.bN, { count: c, color: multi ? colorAt(p.yarn, n - 1) : undefined });
        c += 8;
      }
    }
  }
  b.section('f', FINISH[lang].finishing);
  b.step(FINISH[lang].finishing, `${FINISH[lang].weaveCrochet} ${FINISH[lang].block}`, { lessonIds: ['tig-bitirme'] });

  // ip
  const dcTotal = rounds.reduce((a, r) => a + r.dc, 0);
  const chTotal = rounds.reduce((a, r) => a + r.chains, 0);
  const perSquare = metersForStitches(dcTotal + 0.35 * chTotal, g, 'dc', 1, 0.15) + 0.3 * (multi ? n : 1);
  const squares = blanket ? cols * rowsB : 1;
  let borderSts = 0;
  for (let k = 0; k < borderN; k++) borderSts += borderFirstRound(cols, rowsB, n) + 8 * k;
  const joinSts = blanket ? (cols * (rowsB - 1) + rowsB * (cols - 1)) * (4 * n + 1) : 0;
  const extra = metersForStitches(borderSts * 0.5 + joinSts * 0.3, g, 'dc', 1, 0.1);
  const total = perSquare * squares + extra;
  let colorM: number[] | null = null;
  if (multi) {
    const w = p.yarn.colors.map(() => 0);
    rounds.forEach((r, i) => (w[i % w.length] += r.dc * squares));
    w[(n - 1) % w.length] += (borderSts + joinSts) * 0.4;
    colorM = splitMeters(total, w);
  }

  const diagram: PatternDiagram = { kind: 'granny', rounds: n, colors: rounds.map((_, i) => colorAt(p.yarn, i) ?? '#b5523b') };
  const sideStr = sizeWxH(side, side, p.units, lang);
  const extraDiagrams = blanket ? [{ kind: 'schematic', shape: 'rect', widthCm: bW, heightCm: bH, labels: { width: len(bW, p.units, lang), height: len(bH, p.units, lang) } }] : [];
  const notes = [...(p.overrides?.notesBefore ?? []), T.noteBack, T.noteTension];
  if (multi) notes.push(T.noteEnds);
  notes.push(FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? []));

  return b.build({
    title: p.overrides?.title ?? (blanket ? T.titleBlanket : T.title),
    summary: p.overrides?.summary ?? T.summary(n, multi) + (blanket ? T.summaryBlanket(cols, rowsB) : ''),
    materials: [...yarnMaterials(p.yarn, total, colorM, lang, p.units), ...toolMaterial(p.toolMm, 'tig', lang), ...notions(['tapestry', 'scissors'], lang)],
    gauge: g,
    yarnMeters: total,
    finishedSize: blanket ? T.sizeBlanket(sideStr, cols, rowsB, sizeWxH(bW, bH, p.units, lang)) : T.size(sideStr),
    abbreviations: abbreviations(['mr', 'ch', 'slst', 'dc', 'sp', ...(blanket ? (['sc', 'blo'] as const) : []), 'st', 'rep'], lang),
    notes,
    diagram,
    params: storeParams(p, {
      gaugeLabel: gaugeText(g, 'dc', lang, p.units),
      gaugeStitch: gaugeLabel('dc', lang),
      extraDiagrams,
      squareCm: side,
      squares,
      colorNames: p.yarn.colors.map((_, i) => colorName(p.yarn, i, lang)),
    }),
  });
}

function capFirst(s: string, lang: Lang): string {
  const loc = { tr: 'tr-TR', en: 'en-US', es: 'es-ES', pt: 'pt-BR' }[lang];
  return s ? s.charAt(0).toLocaleUpperCase(loc) + s.slice(1) : s;
}
