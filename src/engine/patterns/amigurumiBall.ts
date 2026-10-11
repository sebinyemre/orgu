/**
 * Tığ: amigurumi top. Sihirli halkada 6 {sc}, her turda +6, düz turlar, simetrik eksiltme, doldurma, kapatma.
 *
 * Geometri: ekvator çevresi 6K ilmek (K = artırma tur sayısı). Kutuptan kutba yay uzunluğu ekvatorun yarısıdır:
 * 3K ilmek eni ≈ toplam tur yüksekliği. Artırma + eksiltme 2K−1 tur tuttuğundan düz tur sayısı
 * S = 3K·(ilmek eni / tur yüksekliği) − (2K − 1).
 */
import type { GeneratedPattern, PatternDiagram } from '@/types';
import { metersForStitches } from '@/engine/math/yarn';
import { PatternBuilder, assertMath, lk } from './builder';
import { L, WORDS, FINISH, abbreviations, colorAt, gaugeLabel, gaugeText, notions, resolveGauge, splitMeters, storeParams, toolMaterial, yarnMaterials } from './common';
import { len } from './fmt';
import { decText, decTokens, emitGrouped, incText, incTokens, plainText, produced, consumed, shapedPositions, type Line, type Tok } from './rounds';
import { colorChangeText } from './colorChange';
import type { PatternParams } from './types';

export interface SphereRound {
  n: number;
  kind: 'start' | 'inc' | 'plain' | 'dec';
  tokens: Tok[];
  count: number;
  /** artırma/eksiltme turlarında dilim başı düz ilmek */
  m: number;
  /** bu turda artırma/eksiltme kaydırılmış mı */
  stag: boolean;
}

/** Küre turları: K artırma turu (6K'ya kadar), S düz tur, K−1 eksiltme turu (6'ya kadar) */
export function sphereRounds(K: number, S: number, staggered: boolean): SphereRound[] {
  const out: SphereRound[] = [];
  let n = 1;
  out.push({ n: n++, kind: 'start', tokens: Array(6).fill('p'), count: 6, m: 0, stag: false });
  for (let k = 2; k <= K; k++) {
    const m = k - 2;
    const stag = staggered && k % 2 === 0 && m >= 2;
    const t = incTokens(6, m, stag);
    out.push({ n: n++, kind: 'inc', tokens: t, count: produced(t), m, stag });
  }
  for (let s = 0; s < S; s++) out.push({ n: n++, kind: 'plain', tokens: Array(6 * K).fill('p'), count: 6 * K, m: 0, stag: false });
  for (let k = K; k >= 2; k--) {
    const m = k - 2;
    const stag = staggered && k % 2 === 0 && m >= 2;
    const t = decTokens(6, m, stag);
    out.push({ n: n++, kind: 'dec', tokens: t, count: produced(t), m, stag });
  }
  return out;
}

export function sphereSize(diameterCm: number, g: { stitches: number; rows: number }) {
  const w = 10 / g.stitches;
  const h = 10 / g.rows;
  const K = Math.max(3, Math.round((Math.PI * diameterCm) / w / 6));
  const S = Math.max(1, Math.round((3 * K * w) / h - (2 * K - 1)));
  return { K, S, actualDiameter: (6 * K * w) / Math.PI };
}

const TX = L(
  {
    title: 'Amigurumi top',
    summary: (d: string, stag: boolean) =>
      `${d} çapında, içi doldurulmuş yuvarlak top. Sihirli halkayla başlanır, her artırma turunda 6 ilmek eklenir, gövde düz örülür ve aynı düzenle eksiltilir.${stag ? ' Artırmalar her iki turda bir kaydırıldığı için top altıgen değil, yuvarlak görünür.' : ''}`,
    size: (d: string, c: string) => `Çap yaklaşık ${d} (çevre ${c})`,
    sStart: 'Başlangıç ve artırmalar',
    sStartIntro: `Turlar birleştirilmeden spiral örülür. Her turun ilk ilmeğine ${lk('tig-amigurumi', 'işaretleyici')} tak, turu bitirince işaretleyiciyi yeni turun ilk ilmeğine taşı.`,
    r1: `${lk('tig-sihirli-halka', 'Sihirli halka')} yap, içine 6 {sc} ör. Kuyruk ucunu çekerek halkayı kapat.`,
    sBody: 'Gövde',
    sDec: 'Eksiltmeler ve kapatma',
    stuff: 'Doldurma',
    stuffText: 'Topu elyafla sıkıca doldur. Dolguyu küçük tutamlarla, kenarlara doğru yaydırarak bastır; ilmek aralarından görünmesin. Kalan turlarda gerekirse ekle.',
    close: 'Kapatma',
    closeText: `İpi 20 cm uç bırakarak kes. Ucu yün iğnesine geçir, kalan 6 ilmeğin ön halkalarından tek tek geçir ve büzerek deliği kapat. İğneyi topun içinden geçirip karşı taraftan çıkar, ucu ${lk('tig-bitirme', 'gizleyip kes')}.`,
    noteHook: 'Amigurumide tığ, ip etiketinde önerilenden 0,5–1 numara ince seçilir; ilmekler sık olur ve dolgu görünmez.',
    noteSpiral: 'Spiral turlarda renk değişimleri küçük bir basamak yapar. Bu basamak doğaldır; topu çevirirken arkada bırak.',
    noteSafety: 'Üç yaş altı çocuklar için göz düğmesi, boncuk gibi küçük parçalar ekleme; yüzü işlemeyle yap.',
    noteStag: 'Kaydırmalı artırmada her iki turdan birinde artırmalar yarım dilim kaydırılır. İlmek sayıları aynı kalır.',
  },
  {
    title: 'Amigurumi ball',
    summary: (d: string, stag: boolean) =>
      `A stuffed ball about ${d} across. Start with a magic ring, add 6 stitches every increase round, work the middle even, then decrease the same way.${stag ? ' Increases are staggered every other round so the ball looks round, not hexagonal.' : ''}`,
    size: (d: string, c: string) => `About ${d} in diameter (${c} around)`,
    sStart: 'Start and increases',
    sStartIntro: `Work in a continuous spiral without joining. Place a ${lk('tig-amigurumi', 'stitch marker')} in the first stitch of each round and move it up as you go.`,
    r1: `Make a ${lk('tig-sihirli-halka', 'magic ring')} and work 6 {sc.a} into it. Pull the tail to close the ring.`,
    sBody: 'Body',
    sDec: 'Decreases and closing',
    stuff: 'Stuffing',
    stuffText: 'Stuff the ball firmly with fiberfill. Push in small tufts and spread them toward the sides so no stuffing shows between stitches. Top up during the last rounds if needed.',
    close: 'Closing',
    closeText: `Cut the yarn leaving a 20 cm (8") tail. Thread it on the tapestry needle, pass it through the front loop of each of the 6 remaining stitches and pull to close the hole. Push the needle through the ball, come out on the other side and ${lk('tig-bitirme', 'trim the tail')}.`,
    noteHook: 'For amigurumi, use a hook 0.5–1 mm smaller than the yarn label suggests so the fabric is dense and the stuffing does not show.',
    noteSpiral: 'Color changes in a spiral leave a small jog. It is normal; keep it at the back.',
    noteSafety: 'For children under three, do not add safety eyes, beads or other small parts; embroider the face instead.',
    noteStag: 'With staggered increases, every other round shifts the increases by half a section. Stitch counts stay the same.',
  },
  {
    title: 'Pelota amigurumi',
    summary: (d: string, stag: boolean) =>
      `Pelota rellena de unos ${d} de diámetro. Se empieza con un anillo mágico, se suman 6 puntos en cada vuelta de aumentos, el centro se teje recto y luego se disminuye igual.${stag ? ' Los aumentos se desplazan cada dos vueltas para que la pelota quede redonda y no hexagonal.' : ''}`,
    size: (d: string, c: string) => `Unos ${d} de diámetro (${c} de contorno)`,
    sStart: 'Inicio y aumentos',
    sStartIntro: `Se teje en espiral, sin cerrar las vueltas. Coloca un ${lk('tig-amigurumi', 'marcador')} en el primer punto de cada vuelta y súbelo al avanzar.`,
    r1: `Hacer un ${lk('tig-sihirli-halka', 'anillo mágico')} y tejer 6 {sc.a} dentro. Tirar de la hebra para cerrarlo.`,
    sBody: 'Cuerpo',
    sDec: 'Disminuciones y cierre',
    stuff: 'Relleno',
    stuffText: 'Rellenar la pelota con firmeza. Introducir el relleno en pequeñas porciones, repartiéndolo hacia los lados para que no se vea entre los puntos. Añadir más en las últimas vueltas si hace falta.',
    close: 'Cierre',
    closeText: `Cortar el hilo dejando 20 cm. Enhebrar la aguja lanera, pasarla por la hebra delantera de cada uno de los 6 puntos restantes y tirar para cerrar. Atravesar la pelota con la aguja, salir por el otro lado y ${lk('tig-bitirme', 'cortar la hebra')}.`,
    noteHook: 'En amigurumi usa un ganchillo 0,5–1 mm más fino que el de la etiqueta: el tejido queda denso y el relleno no se ve.',
    noteSpiral: 'En espiral, los cambios de color dejan un pequeño escalón. Es normal; déjalo en la parte de atrás.',
    noteSafety: 'Para menores de tres años no pongas ojos de seguridad, cuentas ni piezas pequeñas; borda la cara.',
    noteStag: 'Con aumentos desplazados, cada dos vueltas los aumentos se mueven medio tramo. El número de puntos no cambia.',
  },
  {
    title: 'Bola amigurumi',
    summary: (d: string, stag: boolean) =>
      `Bola com enchimento de cerca de ${d} de diâmetro. Começa com anel mágico, ganha 6 pontos a cada volta de aumentos, o meio é feito reto e depois se diminui do mesmo jeito.${stag ? ' Os aumentos são deslocados a cada duas voltas para a bola ficar redonda, não sextavada.' : ''}`,
    size: (d: string, c: string) => `Cerca de ${d} de diâmetro (${c} de circunferência)`,
    sStart: 'Início e aumentos',
    sStartIntro: `Trabalhe em espiral, sem fechar as voltas. Coloque um ${lk('tig-amigurumi', 'marcador')} no primeiro ponto de cada volta e suba-o conforme avança.`,
    r1: `Fazer um ${lk('tig-sihirli-halka', 'anel mágico')} e trabalhar 6 {sc.a} dentro dele. Puxar a ponta para fechar.`,
    sBody: 'Corpo',
    sDec: 'Diminuições e fechamento',
    stuff: 'Enchimento',
    stuffText: 'Encher a bola com firmeza. Colocar a fibra em pequenas porções, espalhando para os lados para não aparecer entre os pontos. Completar nas últimas voltas se precisar.',
    close: 'Fechamento',
    closeText: `Cortar o fio deixando 20 cm. Passar na agulha de tapeçaria, passar pela alça da frente de cada um dos 6 pontos restantes e puxar para fechar. Atravessar a bola com a agulha, sair do outro lado e ${lk('tig-bitirme', 'cortar a ponta')}.`,
    noteHook: 'No amigurumi use uma agulha 0,5–1 mm mais fina que a do rótulo: o tecido fica fechado e o enchimento não aparece.',
    noteSpiral: 'Em espiral, as trocas de cor deixam um pequeno degrau. É normal; deixe-o na parte de trás.',
    noteSafety: 'Para menores de três anos não use olhos de segurança, contas ou peças pequenas; borde o rosto.',
    noteStag: 'Com aumentos deslocados, a cada duas voltas os aumentos andam meio trecho. O número de pontos não muda.',
  },
);

export function amigurumiBall(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const g = resolveGauge(p, 'crochet', 'sc');
  const diameter = p.diameterCm ?? 10;
  const staggered = p.staggered ?? true;
  const { K, S, actualDiameter } = sphereSize(diameter, g);
  const rounds = sphereRounds(K, S, staggered);
  assertMath(checkSphere(rounds) && rounds[rounds.length - 1].count === 6, 'amigurumi turları');
  const stripe = p.stripeRows && p.yarn.colors.length > 1 ? Math.max(1, p.stripeRows) : 0;
  const colorOf = (n: number) => (stripe ? colorAt(p.yarn, Math.floor((n - 1) / stripe)) : undefined);

  const b = new PatternBuilder('amigurumi-top', 'crochet', ctx);
  const lines: Line[] = [];
  let firstInc = true;
  let firstDec = true;
  const lastColorIdx = { v: 0 };
  const decStart = rounds.find((r) => r.kind === 'dec')?.n ?? rounds.length;
  // doldurma: sayı 18'in altına inmeden önce (küçük toplarda eksiltmelerin başında)
  const stuffBefore = rounds.find((r) => r.kind === 'dec' && r.count < 18)?.n ?? decStart;

  const flush = (label: (a: number, z: number) => string) => {
    emitGrouped(b, lines.splice(0), label);
  };

  for (const r of rounds) {
    let text = '';
    if (r.kind === 'start') text = T.r1;
    else if (r.kind === 'inc') {
      text = incText(lang, 'sc', 6, r.m, r.stag, firstInc);
      firstInc = false;
    } else if (r.kind === 'plain') text = plainText(lang, 'sc');
    else {
      text = decText(lang, 'sc', 6, r.m, r.stag, firstDec);
      firstDec = false;
    }
    const color = colorOf(r.n);
    if (stripe) {
      const idx = Math.floor((r.n - 1) / stripe) % p.yarn.colors.length;
      if (r.n > 1 && idx !== lastColorIdx.v) {
        text = `${colorChangeText(lang, 'crochet', idx, p.yarn, true)} ${text}`;
        lastColorIdx.v = idx;
      }
    }
    if (r.kind === 'start') b.section('a', T.sStart, T.sStartIntro);
    if (r.kind === 'plain' && rounds[r.n - 2]?.kind !== 'plain') {
      flush(W.rnds);
      b.section('b', T.sBody);
    }
    if (r.kind === 'dec' && r.n === decStart) {
      flush(W.rnds);
      b.section('c', T.sDec);
    }
    if (r.kind === 'dec' && r.n === stuffBefore) {
      flush(W.rnds);
      b.step(T.stuff, T.stuffText, { lessonIds: ['tig-amigurumi'] });
    }
    lines.push({ n: r.n, text, count: r.count, color });
  }
  flush(W.rnds);
  b.step(T.close, T.closeText, { lessonIds: ['tig-amigurumi'] });

  // ip
  const totalSts = rounds.reduce((n, r) => n + r.count, 0);
  const yarnM = metersForStitches(totalSts, g, 'sc', 1, 0.15) + 1;
  let colorM: number[] | null = null;
  if (stripe) {
    const w = p.yarn.colors.map(() => 0);
    for (const r of rounds) w[Math.floor((r.n - 1) / stripe) % p.yarn.colors.length] += r.count;
    colorM = splitMeters(yarnM, w);
  }
  const vol = (4 / 3) * Math.PI * Math.pow(actualDiameter / 2, 3);

  const incRounds = rounds.filter((r) => r.kind === 'start' || r.kind === 'inc');
  const diagram: PatternDiagram = {
    kind: 'rounds',
    craft: 'crochet',
    rounds: incRounds.map((r) => ({ stitches: r.count, label: String(r.n), color: colorOf(r.n), symbol: 'sc', incPositions: shapedPositions(r.tokens).inc })),
  };
  const dStr = len(actualDiameter, p.units, lang);
  const notes = [...(p.overrides?.notesBefore ?? []), T.noteHook];
  if (staggered) notes.push(T.noteStag);
  if (stripe) notes.push(T.noteSpiral);
  notes.push(T.noteSafety, FINISH[lang].measureNote, FINISH[lang].estimateNote, ...(p.overrides?.notesAfter ?? []));

  return b.build({
    title: p.overrides?.title ?? `${T.title} · ${dStr}`,
    summary: p.overrides?.summary ?? T.summary(dStr, staggered),
    materials: [
      ...yarnMaterials(p.yarn, yarnM, colorM, lang, p.units),
      ...toolMaterial(p.toolMm, 'tig', lang),
      ...notions(['stuffing', 'marker1', 'tapestry', 'scissors'], lang, { stuffingG: Math.max(2, vol * 0.025) }),
    ],
    gauge: g,
    yarnMeters: yarnM,
    finishedSize: T.size(dStr, len(Math.PI * actualDiameter, p.units, lang)),
    abbreviations: abbreviations(['mr', 'sc', 'inc', 'dec', 'st', 'rep'], lang),
    notes,
    diagram,
    params: storeParams(p, {
      gaugeLabel: gaugeText(g, 'sc', lang, p.units),
      gaugeStitch: gaugeLabel('sc', lang),
      extraDiagrams: [{ kind: 'schematic', shape: 'sphere', widthCm: actualDiameter, heightCm: actualDiameter, labels: { width: dStr } }],
      castOn: 6,
      maxStitches: 6 * K,
    }),
  });
}

/** Testler için: her turun tükettiği ilmek önceki turun sayısına eşit mi */
export function checkSphere(rounds: SphereRound[]): boolean {
  for (let i = 1; i < rounds.length; i++) if (consumed(rounds[i].tokens) !== rounds[i - 1].count) return false;
  return true;
}
