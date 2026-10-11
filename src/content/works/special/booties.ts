/**
 * Haraşo bebek patiği: tek parça, düz örülür; taban ortası ilmek atılan kenardır.
 * Taban: 3 artırma sırası (her birinde topuk ve burunda 4 artırma), yanlar düz, burun: 3 eksiltme sırası,
 * bilek: 1×1 lastik. Sonra taban ve arka dikişi.
 *
 * İlmek düzeni (a = taban yarısındaki düz ilmek):
 *   İlmek at 2a + 4 → artırmalarla 2a + 16 → burunda 2a + 8, 2a + 2, 2a − 2.
 */
import type { GeneratedPattern } from '@/types';
import { PatternBuilder, assertMath, lk } from '@/engine/patterns/builder';
import { L, WORDS, FINISH, abbreviations, colorAt, gaugeLabel, gaugeText, notions, resolveGauge, splitMeters, storeParams, toolMaterial, yarnMaterials } from '@/engine/patterns/common';
import { KT } from '@/engine/patterns/knitCommon';
import { len } from '@/engine/patterns/fmt';
import { metersForStitches } from '@/engine/math/yarn';
import type { PatternParams } from '@/engine/patterns';

export interface BootiePlan {
  a: number;
  castOn: number;
  sole: number[];
  sideRows: number;
  toe: number[];
  cuffRows: number;
  cuffSts: number;
  footCm: number;
}

export function bootiePlan(footCm: number, sideCm: number, cuffCm: number, g: { stitches: number; rows: number }): BootiePlan {
  const stG = g.stitches / 1.05;
  const rowsG = g.rows * 1.5;
  const a = Math.max(10, Math.round((footCm * stG) / 10) - 4);
  const castOn = 2 * a + 4;
  const sole = [castOn + 4, castOn + 8, castOn + 12];
  const sideRows = Math.max(6, Math.round((sideCm * rowsG) / 10 / 2) * 2);
  const toe = [2 * a + 8, 2 * a + 2, 2 * a - 2];
  const cuffRows = Math.max(6, Math.round((cuffCm * g.rows * 1.05) / 10));
  return { a, castOn, sole, sideRows, toe, cuffRows, cuffSts: 2 * a - 2, footCm: ((a + 4) * 10) / stG };
}

const TX = L(
  {
    title: 'Haraşo bebek patiği',
    summary: 'Tek parça, düz şişte haraşo örülen yumuşak patik; sonra tabanın altından ve arkasından dikilir. Her sıra düz örüldüğü için artırma ve eksiltmeye nazik bir ilk adım.',
    size: (f: string, l: string) => `Taban yaklaşık ${f} (${l})`,
    sSole: 'Taban',
    soleIntro: 'Her sıra düz örülür (haraşo). İlmek atılan kenar, tabanın ortası olur.',
    co: (n: number) => `Dikiş için 30 cm uç bırakarak ${lk('sis-ilmek-atma-basparmak', 'başparmakla')} ${n} ilmek at.`,
    knit: 'Tüm ilmekleri düz ör.',
    inc: (e: number, a: number, m: number, first: boolean) => `${e} düz, ${first ? lk('sis-artirma', '1 artır') : '1 artır'}, ${a} düz, 1 artır, ${m} düz, 1 artır, ${a} düz, 1 artır, ${e} düz.`,
    sSide: 'Yanlar',
    side: 'Tüm ilmekleri düz ör.',
    sToe: 'Burun',
    dec: (k: number, n: number, first: boolean) => `${k} düz, *${first ? lk('sis-eksiltme', '2 ilmeği birlikte düz ör') : '2 birlikte düz'}* ${n} kez tekrarla, ${k} düz.`,
    sCuff: 'Bilek',
    cuff: (c: string) => `${c}*1 düz, 1 ters* sıra sonuna kadar tekrarla. Çift sayıda ilmek olduğu için her sıra aynı talimatla 1×1 ${lk('sis-lastik', 'lastik')} oluşur.`,
    cuffColor: (c: string) => `İstersen ${c}ne geç. `,
    bo: `Dikiş için 30 cm uç bırakarak ilmekleri lastiğe uygun olarak gevşekçe ${lk('sis-ilmek-kapatma', 'kapat')}.`,
    sSeam: 'Dikiş',
    seam1: 'Patiği boyuna ikiye katla: ilmek atılan kenar tabanın altında ikiye katlanır. İlmek atma ucunu yün iğnesine geçir ve tabanı topuktan buruna doğru, iki kenarın en dış ilmeklerinden geçerek dik.',
    seam2: 'Kapatma ucuyla arka dikişi bilekten topuğa doğru dik. Dikiş yerlerini düzleştirmek için patiği hafifçe çekiştir.',
    second: 'İkinci patiği aynı şekilde ör.',
    noteSafety: 'Bebek patiğine düğme, boncuk ya da ponpon gibi küçük parçalar ekleme.',
    noteFit: 'Haraşo esnektir; patik bir iki santim daha uzun ayaklara da olur. Yetişkin elinde değil, bebeğin ayağında dene.',
    noteSeam: 'Haraşo kenarları birbirine "tırtıl tırtıla" dikilince dikiş neredeyse görünmez.',
  },
  {
    title: 'Garter stitch baby booties',
    summary: 'Soft booties knitted flat in one piece in garter stitch, then seamed under the sole and up the back. Every row is a knit row, so they are a gentle first step into increasing and decreasing.',
    size: (f: string, l: string) => `Sole about ${f} long (${l})`,
    sSole: 'Sole',
    soleIntro: 'Knit every row (garter stitch). The cast-on edge becomes the center of the sole.',
    co: (n: number) => `Leaving a 30 cm (12") tail for seaming, cast on ${n} sts with the ${lk('sis-ilmek-atma-basparmak', 'long-tail cast-on')}.`,
    knit: 'Knit all sts.',
    inc: (e: number, a: number, m: number, first: boolean) => `K${e}, ${first ? lk('sis-artirma', 'M1') : 'M1'}, k${a}, M1, k${m}, M1, k${a}, M1, k${e}.`,
    sSide: 'Sides',
    side: 'Knit all sts.',
    sToe: 'Toe',
    dec: (k: number, n: number, first: boolean) => `K${k}, *${first ? lk('sis-eksiltme', 'k2tog') : 'k2tog'}* ${n} times, k${k}.`,
    sCuff: 'Cuff',
    cuff: (c: string) => `${c}*K1, p1*; repeat to end. With an even number of stitches every row is the same and forms 1×1 ${lk('sis-lastik', 'rib')}.`,
    cuffColor: (c: string) => `Change to ${c} if you like. `,
    bo: `Leaving a 30 cm (12") tail for seaming, ${lk('sis-ilmek-kapatma', 'bind off')} loosely in rib.`,
    sSeam: 'Seaming',
    seam1: 'Fold the bootie in half lengthwise so the cast-on edge folds along the bottom of the sole. Thread the cast-on tail on a tapestry needle and sew the sole from heel to toe through the outermost stitches of both edges.',
    seam2: 'With the bind-off tail, sew the back seam from the cuff down to the heel. Give the bootie a gentle tug to even out the seams.',
    second: 'Make a second bootie the same way.',
    noteSafety: 'Do not add buttons, beads or pompoms to baby booties.',
    noteFit: 'Garter stitch stretches, so the booties fit feet a centimeter or two longer. Check the fit on the baby, not on your hand.',
    noteSeam: 'When garter edges are sewn ridge to ridge, the seam almost disappears.',
  },
  {
    title: 'Patucos de punto bobo',
    summary: 'Patucos suaves tejidos en plano en una sola pieza en punto bobo y cosidos bajo la suela y por detrás. Todas las vueltas son al derecho: un primer paso amable para aumentar y disminuir.',
    size: (f: string, l: string) => `Suela de unos ${f} (${l})`,
    sSole: 'Suela',
    soleIntro: 'Todas las vueltas al derecho (punto bobo). El borde de montaje queda en el centro de la suela.',
    co: (n: number) => `Dejando 30 cm de hebra para coser, montar ${n} puntos con el ${lk('sis-ilmek-atma-basparmak', 'montaje de cola larga')}.`,
    knit: 'Tejer todos los puntos al derecho.',
    inc: (e: number, a: number, m: number, first: boolean) => `${e} d, ${first ? lk('sis-artirma', 'aum 1') : 'aum 1'}, ${a} d, aum 1, ${m} d, aum 1, ${a} d, aum 1, ${e} d.`,
    sSide: 'Laterales',
    side: 'Tejer todos los puntos al derecho.',
    sToe: 'Puntera',
    dec: (k: number, n: number, first: boolean) => `${k} d, *${first ? lk('sis-eksiltme', '2 juntos al derecho') : '2 juntos d'}* ${n} veces, ${k} d.`,
    sCuff: 'Puño',
    cuff: (c: string) => `${c}*1 d, 1 r*; repetir hasta el final. Con número par de puntos todas las vueltas son iguales y forman ${lk('sis-lastik', 'elástico')} 1×1.`,
    cuffColor: (c: string) => `Si quieres, cambia al ${c.charAt(0).toLowerCase() + c.slice(1)}. `,
    bo: `Dejando 30 cm de hebra para coser, ${lk('sis-ilmek-kapatma', 'cerrar')} sin apretar siguiendo el elástico.`,
    sSeam: 'Costura',
    seam1: 'Doblar el patuco a lo largo, de modo que el borde de montaje quede doblado bajo la suela. Enhebrar la hebra del montaje en la aguja lanera y coser la suela del talón a la puntera por los puntos más externos de ambos bordes.',
    seam2: 'Con la hebra del cierre, coser la costura trasera desde el puño hasta el talón. Estirar un poco el patuco para igualar las costuras.',
    second: 'Tejer el segundo patuco igual.',
    noteSafety: 'No añadas botones, cuentas ni pompones a los patucos de bebé.',
    noteFit: 'El punto bobo cede: los patucos sirven para pies uno o dos centímetros más largos. Pruébalos en el bebé, no en tu mano.',
    noteSeam: 'Si coses los bordes de punto bobo surco con surco, la costura casi no se ve.',
  },
  {
    title: 'Sapatinhos de bebê em ponto liga',
    summary: 'Sapatinhos macios tricotados retos em uma só peça em ponto liga e costurados sob a sola e atrás. Todas as carreiras são em meia: um primeiro passo gentil para aumentar e diminuir.',
    size: (f: string, l: string) => `Sola de cerca de ${f} (${l})`,
    sSole: 'Sola',
    soleIntro: 'Todas as carreiras em meia (ponto liga). A borda da montagem fica no centro da sola.',
    co: (n: number) => `Deixando 30 cm de fio para costurar, montar ${n} pontos com a ${lk('sis-ilmek-atma-basparmak', 'montagem com fio longo')}.`,
    knit: 'Tricotar todos os pontos em meia.',
    inc: (e: number, a: number, m: number, first: boolean) => `${e} m, ${first ? lk('sis-artirma', 'aum 1') : 'aum 1'}, ${a} m, aum 1, ${m} m, aum 1, ${a} m, aum 1, ${e} m.`,
    sSide: 'Laterais',
    side: 'Tricotar todos os pontos em meia.',
    sToe: 'Bico',
    dec: (k: number, n: number, first: boolean) => `${k} m, *${first ? lk('sis-eksiltme', '2 juntos em meia') : '2 juntos em m'}* ${n} vezes, ${k} m.`,
    sCuff: 'Punho',
    cuff: (c: string) => `${c}*1 m, 1 t*; repetir até o final. Com número par de pontos todas as carreiras são iguais e formam ${lk('sis-lastik', 'ribana')} 1×1.`,
    cuffColor: (c: string) => `Se quiser, troque para a ${c.charAt(0).toLowerCase() + c.slice(1)}. `,
    bo: `Deixando 30 cm de fio para costurar, ${lk('sis-ilmek-kapatma', 'arrematar')} sem apertar seguindo a ribana.`,
    sSeam: 'Costura',
    seam1: 'Dobrar o sapatinho ao comprido, de modo que a borda da montagem fique dobrada sob a sola. Passar o fio da montagem na agulha de tapeçaria e costurar a sola do calcanhar ao bico pelos pontos mais externos das duas bordas.',
    seam2: 'Com o fio do arremate, costurar a parte de trás do punho até o calcanhar. Puxe levemente o sapatinho para igualar as costuras.',
    second: 'Fazer o segundo sapatinho igual.',
    noteSafety: 'Não coloque botões, contas ou pompons em sapatinhos de bebê.',
    noteFit: 'O ponto liga cede: os sapatinhos servem para pés um ou dois centímetros maiores. Experimente no bebê, não na sua mão.',
    noteSeam: 'Costurando as bordas de ponto liga sulco com sulco, a costura quase desaparece.',
  },
);

export function booties(p: PatternParams & { sizeLabel?: string }): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const K = KT[lang];
  const g = resolveGauge(p, 'knit', 'jarse');
  const plan = bootiePlan(p.footCm ?? 9, p.sideCm ?? 2.5, p.cuffCm ?? 3.5, g);
  const multi = p.yarn.colors.length > 1;
  const cMain = multi ? colorAt(p.yarn, 0) : undefined;
  const cCuff = multi ? colorAt(p.yarn, 1) : undefined;
  const a = plan.a;
  assertMath(plan.sole[2] === 2 * a + 16 && plan.toe[2] === plan.cuffSts && a >= 4, 'patik sayıları');

  const b = new PatternBuilder('bebek-patik', 'knit', ctx);
  b.section('a', T.sSole, T.soleIntro);
  b.step(K.castOnLabel, T.co(plan.castOn), { count: plan.castOn, color: cMain });
  b.step(W.row(1), T.knit, { count: plan.castOn, color: cMain, lessonIds: ['sis-haraso'] });
  b.step(W.row(2), T.inc(1, a, 2, true), { count: plan.sole[0], color: cMain });
  b.step(W.row(3), T.knit, { count: plan.sole[0], color: cMain });
  b.step(W.row(4), T.inc(2, a, 4, false), { count: plan.sole[1], color: cMain });
  b.step(W.row(5), T.knit, { count: plan.sole[1], color: cMain });
  b.step(W.row(6), T.inc(3, a, 6, false), { count: plan.sole[2], color: cMain });
  let r = 7;
  b.section('b', T.sSide);
  b.step(W.rows(r, r + plan.sideRows - 1), T.side, { count: plan.sole[2], repeat: plan.sideRows, color: cMain });
  r += plan.sideRows;
  b.section('c', T.sToe);
  b.step(W.row(r++), T.dec(a, 8, true), { count: plan.toe[0], color: cMain });
  b.step(W.row(r++), T.knit, { count: plan.toe[0], color: cMain });
  b.step(W.row(r++), T.dec(a - 2, 6, false), { count: plan.toe[1], color: cMain });
  b.step(W.row(r++), T.knit, { count: plan.toe[1], color: cMain });
  b.step(W.row(r++), T.dec(a - 3, 4, false), { count: plan.toe[2], color: cMain });
  b.step(W.row(r++), T.knit, { count: plan.toe[2], color: cMain });
  b.section('d', T.sCuff);
  b.step(W.rows(r, r + plan.cuffRows - 1), T.cuff(multi ? T.cuffColor(W.colorLetter(1)) : ''), { count: plan.cuffSts, repeat: plan.cuffRows, color: cCuff });
  b.step(K.bindOffLabel, T.bo);
  b.section('e', T.sSeam);
  b.step('1', T.seam1);
  b.step('2', T.seam2);
  b.step('3', FINISH[lang].weaveKnit);
  b.step('×2', T.second, { repeat: 2 });

  // ip: iki patik
  const rowsSts = plan.castOn + plan.sole[0] * 2 + plan.sole[1] * 2 + plan.sole[2] * (1 + plan.sideRows) + plan.toe[0] * 2 + plan.toe[1] * 2 + plan.toe[2] * 2;
  const cuffSts = plan.cuffSts * plan.cuffRows;
  const mainM = 2 * metersForStitches(rowsSts, g, 'knit', 1.05, 0.12) + 1.2;
  const cuffM = 2 * metersForStitches(cuffSts, g, 'knit', 1.05, 0.12) + 0.6;
  const total = mainM + cuffM;
  const fStr = len(plan.footCm, p.units, lang);
  return b.build({
    title: p.overrides?.title ?? T.title,
    summary: p.overrides?.summary ?? T.summary,
    materials: [...yarnMaterials(p.yarn, total, multi ? splitMeters(total, [mainM, cuffM]) : null, lang, p.units), ...toolMaterial(p.toolMm, 'sis-duz', lang), ...notions(['tapestry', 'scissors'], lang)],
    gauge: g,
    yarnMeters: total,
    finishedSize: T.size(fStr, p.sizeLabel ?? ''),
    abbreviations: abbreviations(['co', 'k', 'p', 'm1', 'k2tog', 'bo', 'st', 'rep'], lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.noteFit, T.noteSeam, T.noteSafety, FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? [])],
    params: storeParams(p, { gaugeLabel: gaugeText(g, 'jarse', lang, p.units), gaugeStitch: gaugeLabel('jarse', lang), castOn: plan.castOn }),
  });
}
