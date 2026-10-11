/**
 * Ölçü örneği (şiş ya da tığ): kenarlı küçük kare ve nasıl ölçüleceği.
 */
import type { GeneratedPattern } from '@/types';
import { castOnFor, rowsFor } from '@/engine/math/gauge';
import { metersForArea } from '@/engine/math/yarn';
import { CROCHET_BASICS } from '@/knowledge/terms';
import { PATTERN_BY_ID } from '@/knowledge/stitchPatterns';
import { PatternBuilder, lk } from './builder';
import { L, WORDS, FINISH, abbreviations, gaugeLabel, gaugeText, notions, resolveGauge, sizeWxH, storeParams, toolMaterial, yarnMaterials, type AbbrKey, inlineName } from './common';
import { len, num, tenLabel } from './fmt';
import { KT, ROW_REPEAT, addPatternSection, effGauge, toRepeat } from './knitCommon';
import type { CrochetStitch, PatternParams } from './types';

const TX = L(
  {
    title: 'Ölçü örneği',
    summary: (s: string, st: string) => `${s} boyutunda, ${st} ile örülen deneme karesi. Tariflerin tutması için ilmek ve sıra sayını bununla ölçersin.`,
    size: (s: string) => `Yaklaşık ${s}`,
    sKnit: 'Örnek',
    garter: (n: number) => `Tüm ilmekleri düz ör (${n} sıra haraşo kenar).`,
    rowK: (n: number) => `3 düz, ortadaki ${n} ilmekte desenin sıradaki sırasını ör, 3 düz.`,
    until: (n: number, x: string) => `${n} sıra ya da örnek ${x} olana kadar devam et.`,
    sMeasure: 'Ölçme',
    m1: 'Örneği ıslat ya da yıka ve düz serip kurut. İpler yıkanınca açılır ya da çeker; ölçüyü dinlenmiş örnekte al.',
    m2: (ten: string) => `Örneği germeden düz bir yüzeye koy. Ortaya cetvel yerleştir, kenarlardan uzak dur ve ${ten} içindeki ilmekleri say; yarım ilmekleri de hesaba kat.`,
    m3: (ten: string) => `Cetveli dik tutup ${ten} içindeki sıraları say.`,
    m4: (st: string, rw: string) => `Beklenen ölçü: ${st} ilmek ve ${rw} sıra. Fazla ilmek sayıyorsan daha kalın şişe/tığa, az sayıyorsan daha ince şişe/tığa geç ve yeni bir örnek ör.`,
    m5: 'Kendi sayılarını tarif hazırlayıcıya "Kendi ölçü örneğim" olarak gir; tüm hesaplar senin elinle yeniden yapılır.',
    note: '10 cm içinde yarım ilmeklik fark bile 50 cm çevreli bir berede 2–3 cm fark eder.',
    sCrochet: 'Örnek',
    foundLabel: 'Temel zincir',
    found: (n: number) => `${n} ${lk('tig-zincir', 'zincir')} çek.`,
    rowC: (st: string, ch: number) => `Tığdan itibaren ${ch}. zincire 1 ${st}, sonraki her zincire 1 ${st}. İşi çevir.`,
    rowCN: (st: string, ch: number, counts: boolean) => `${ch} zincir (${counts ? 'ilk ilmek sayılır' : 'ilmek sayılmaz'}), ${counts ? 'ilk ilmeği atla, ' : ''}her ilmeğe 1 ${st}. İşi çevir.`,
  },
  {
    title: 'Gauge swatch',
    summary: (s: string, st: string) => `A ${s} test square in ${st}. Measure your stitches and rows on it so patterns come out the right size.`,
    size: (s: string) => `About ${s}`,
    sKnit: 'Swatch',
    garter: (n: number) => `Knit all sts (${n} rows of garter border).`,
    rowK: (n: number) => `K3, work the next row of the stitch pattern over the center ${n} sts, k3.`,
    until: (n: number, x: string) => `Continue for ${n} rows or until the swatch measures ${x}.`,
    sMeasure: 'Measuring',
    m1: 'Soak or wash the swatch and let it dry flat. Yarn relaxes or shrinks when washed, so measure the blocked swatch.',
    m2: (ten: string) => `Lay the swatch flat without stretching it. Place a ruler in the middle, away from the edges, and count the stitches in ${ten}; include half stitches.`,
    m3: (ten: string) => `Turn the ruler upright and count the rows in ${ten}.`,
    m4: (st: string, rw: string) => `Expected gauge: ${st} sts and ${rw} rows. If you have more stitches, go up a needle or hook size; if fewer, go down a size, then swatch again.`,
    m5: 'Enter your own numbers in the pattern maker as "My swatch" and every count is recalculated for your hands.',
    note: 'Even half a stitch per 10 cm changes a 50 cm hat by 2–3 cm.',
    sCrochet: 'Swatch',
    foundLabel: 'Foundation',
    found: (n: number) => `${lk('tig-zincir', 'Ch')} ${n}.`,
    rowC: (st: string, ch: number) => `${st} in ${ch === 2 ? '2nd' : ch === 3 ? '3rd' : `${ch}th`} ch from hook and in each ch across. Turn.`,
    rowCN: (st: string, ch: number, counts: boolean) => `Ch ${ch} (${counts ? 'counts as first st' : 'does not count'}), ${counts ? 'skip first st, ' : ''}${st} in each st across. Turn.`,
  },
  {
    title: 'Muestra de tensión',
    summary: (s: string, st: string) => `Cuadrado de prueba de ${s} en ${st}. Con él mides tus puntos y vueltas para que los patrones salgan a la medida.`,
    size: (s: string) => `Unos ${s}`,
    sKnit: 'Muestra',
    garter: (n: number) => `Tejer todos los puntos al derecho (${n} vueltas de borde en punto bobo).`,
    rowK: (n: number) => `3 d, tejer la vuelta que toca del punto sobre los ${n} puntos centrales, 3 d.`,
    until: (n: number, x: string) => `Seguir ${n} vueltas o hasta que la muestra mida ${x}.`,
    sMeasure: 'Medir',
    m1: 'Moja o lava la muestra y déjala secar en plano. El hilo cede o encoge al lavarlo: mide la muestra bloqueada.',
    m2: (ten: string) => `Coloca la muestra en plano sin estirarla. Pon una regla en el centro, lejos de los bordes, y cuenta los puntos en ${ten}, medios puntos incluidos.`,
    m3: (ten: string) => `Pon la regla en vertical y cuenta las vueltas en ${ten}.`,
    m4: (st: string, rw: string) => `Muestra esperada: ${st} puntos y ${rw} vueltas. Si tienes más puntos, usa agujas o ganchillo más gruesos; si tienes menos, más finos, y teje otra muestra.`,
    m5: 'Introduce tus números en el creador de patrones como "Mi muestra" y todo se recalcula para tus manos.',
    note: 'Medio punto de diferencia en 10 cm cambia un gorro de 50 cm en 2–3 cm.',
    sCrochet: 'Muestra',
    foundLabel: 'Cadeneta base',
    found: (n: number) => `${n} ${lk('tig-zincir', 'cad')}.`,
    rowC: (st: string, ch: number) => `1 ${st} en la ${ch}.ª cad desde el ganchillo y 1 en cada cad. Girar.`,
    rowCN: (st: string, ch: number, counts: boolean) => `${ch} cad (${counts ? 'cuentan como primer punto' : 'no cuentan'}), ${counts ? 'saltar el primer punto, ' : ''}1 ${st} en cada punto. Girar.`,
  },
  {
    title: 'Amostra de tensão',
    summary: (s: string, st: string) => `Quadrado de teste de ${s} em ${st}. Com ele você mede seus pontos e carreiras para as receitas saírem no tamanho certo.`,
    size: (s: string) => `Cerca de ${s}`,
    sKnit: 'Amostra',
    garter: (n: number) => `Tricotar todos os pontos em meia (${n} carreiras de borda em ponto liga).`,
    rowK: (n: number) => `3 m, fazer a carreira seguinte do ponto nos ${n} pontos do centro, 3 m.`,
    until: (n: number, x: string) => `Continuar ${n} carreiras ou até a amostra medir ${x}.`,
    sMeasure: 'Medir',
    m1: 'Molhe ou lave a amostra e deixe secar na horizontal. O fio cede ou encolhe na lavagem: meça a amostra blocada.',
    m2: (ten: string) => `Coloque a amostra na horizontal sem esticar. Ponha uma régua no meio, longe das bordas, e conte os pontos em ${ten}, incluindo meios pontos.`,
    m3: (ten: string) => `Ponha a régua na vertical e conte as carreiras em ${ten}.`,
    m4: (st: string, rw: string) => `Amostra esperada: ${st} pontos e ${rw} carreiras. Se tiver mais pontos, use agulha mais grossa; se tiver menos, mais fina, e faça outra amostra.`,
    m5: 'Coloque seus números no criador de receitas como "Minha amostra" e tudo é recalculado para as suas mãos.',
    note: 'Meio ponto de diferença em 10 cm muda um gorro de 50 cm em 2–3 cm.',
    sCrochet: 'Amostra',
    foundLabel: 'Correntinha de base',
    found: (n: number) => `${n} ${lk('tig-zincir', 'corr')}.`,
    rowC: (st: string, ch: number) => `1 ${st} na ${ch}ª corr a partir da agulha e 1 em cada corr. Virar.`,
    rowCN: (st: string, ch: number, counts: boolean) => `${ch} corr (${counts ? 'contam como primeiro ponto' : 'não contam'}), ${counts ? 'pular o primeiro ponto, ' : ''}1 ${st} em cada ponto. Virar.`,
  },
);

export function swatch(p: PatternParams): GeneratedPattern {
  const lang = p.lang;
  const ctx = { ...p.ctx, lang };
  const T = TX[lang];
  const W = WORDS[lang];
  const craft = p.craft ?? (p.toolKind === 'tig' ? 'crochet' : 'knit');
  const size = p.swatchCm ?? 15;
  const ten = tenLabel(p.units, lang);
  const b = new PatternBuilder('olcu-ornegi', craft, ctx);
  let g;
  let gaugeStitch: 'jarse' | CrochetStitch;
  let yarnM: number;
  let castOn: number;
  let stName: string;
  const keys: AbbrKey[] = [];

  if (craft === 'knit') {
    const sp = PATTERN_BY_ID[p.stitchId ?? ''] && PATTERN_BY_ID[p.stitchId!].craft === 'knit' ? PATTERN_BY_ID[p.stitchId!] : PATTERN_BY_ID.jarse;
    g = resolveGauge(p, 'knit', 'jarse');
    gaugeStitch = 'jarse';
    const eg = effGauge(g, sp);
    const center = castOnFor(size - (6 * 10) / g.stitches, eg.stitches, sp.flat.multiple, sp.flat.plus).best.stitches;
    castOn = center + 6;
    const rows = toRepeat(rowsFor(size - (8 * 10) / (g.rows * 1.5), eg.rows), ROW_REPEAT[sp.id] ?? 2);
    stName = sp.name[lang];
    addPatternSection(b, sp, 'flat', lang, 'p', center);
    b.section('a', T.sKnit);
    b.step(KT[lang].castOnLabel, KT[lang].castOn(castOn), { count: castOn });
    b.step(W.rows(1, 4), T.garter(4), { count: castOn, repeat: 4, lessonIds: ['sis-haraso'] });
    b.step(W.rows(5, 4 + rows), `${T.rowK(center)} ${T.until(rows, len(size - 2, p.units, lang))}`, { count: castOn, repeat: rows, lessonIds: sp.lessonIds });
    b.step(W.rows(5 + rows, 8 + rows), T.garter(4), { count: castOn, repeat: 4 });
    b.step(KT[lang].bindOffLabel, KT[lang].bindOffKnit);
    yarnM = metersForArea(size, size, g, 'knit', sp.yarnFactor) + 1;
    keys.push('co', 'k', 'p', 'bo', 'st', 'rep');
  } else {
    const st: CrochetStitch = p.crochetStitch ?? 'sc';
    g = resolveGauge(p, 'crochet', st);
    gaugeStitch = st;
    const basic = CROCHET_BASICS[st];
    const sts = Math.max(8, Math.round((size * g.stitches) / 10));
    const extra = st === 'sc' ? 1 : 2;
    castOn = sts + extra;
    const rows = rowsFor(size, g.rows);
    stName = `{${st}}`;
    const stTxt = lang === 'tr' ? `{${st}}` : `{${st}.a}`;
    b.section('a', T.sCrochet);
    b.step(T.foundLabel, T.found(castOn), { count: castOn });
    b.step(W.row(1), T.rowC(stTxt, basic.firstInChainFromHook), { count: sts });
    const ch = st === 'dc' ? 3 : basic.turningCh;
    b.step(W.rows(2, rows), T.rowCN(stTxt, ch, st === 'dc'), { count: sts, repeat: rows - 1, lessonIds: ['tig-donus'] });
    b.step(FINISH[lang].finishing, FINISH[lang].weaveCrochet);
    yarnM = metersForArea(size, size, g, st, 1) + 1;
    keys.push('ch', st, 'st');
  }
  b.section('m', T.sMeasure);
  b.step('1', T.m1);
  b.step('2', T.m2(ten), { lessonIds: ['sis-olcu-ornegi'] });
  b.step('3', T.m3(ten));
  b.step('4', T.m4(num(g.stitches, lang), num(g.rows, lang)));
  b.step('5', T.m5);

  const s = sizeWxH(size, size, p.units, lang);
  return b.build({
    title: p.overrides?.title ?? T.title,
    summary: p.overrides?.summary ?? T.summary(s, inlineName(stName, lang)),
    materials: [...yarnMaterials(p.yarn, yarnM, null, lang, p.units), ...toolMaterial(p.toolMm, craft === 'crochet' ? 'tig' : 'sis-duz', lang), ...notions(['pins', 'tapestry', 'scissors'], lang)],
    gauge: g,
    yarnMeters: yarnM,
    finishedSize: T.size(s),
    abbreviations: abbreviations(keys, lang),
    notes: [...(p.overrides?.notesBefore ?? []), T.note, ...(p.overrides?.notesAfter ?? [])],
    diagram: { kind: 'schematic', shape: 'rect', widthCm: size, heightCm: size, labels: { width: len(size, p.units, lang), height: len(size, p.units, lang), window: ten } },
    params: storeParams(p, { gaugeLabel: gaugeText(g, gaugeStitch, lang, p.units), gaugeStitch: gaugeLabel(gaugeStitch, lang), castOn }),
  });
}
