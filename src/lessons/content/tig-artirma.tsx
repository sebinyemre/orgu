import { CK, CrochetScene, StitchPost, StitchTop, TARGET_X, crochetArrows } from '@/engine/illust/crochet';
import { Diagram, ROUND_COLORS, chainRowMarks, fanMarks, type Mark, fitView } from '@/engine/illust/diagram';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

/** hedef ilmekten sağa yatık, az önce örülmüş ilk ilmek */
function FirstOfPair() {
  const y = CK.rowY;
  return (
    <g transform={`translate(${TARGET_X} ${y}) skewX(-28) translate(${-TARGET_X} ${-y})`}>
      <StitchPost x={TARGET_X + 4} y0={y + 2} y1={y - CK.scH + 6} color={YARN.main} />
      <StitchTop x={TARGET_X + 4} y={y - CK.scH} color={YARN.main} />
    </g>
  );
}

/** sık iğne sırası: her 3. ilmekte artırma */
function incRow(): Mark[] {
  const marks: Mark[] = chainRowMarks(9, 196, 40, 40, 28, 0);
  for (let i = 0; i < 9; i++) {
    const base: [number, number] = [40 + i * 40, 182];
    if (i % 3 === 2) marks.push(...fanMarks(base, 2, 44, 'sc', 40, ROUND_COLORS[1], 1));
    else marks.push({ id: 'sc', at: [base[0], base[1] - 20], size: 40, color: ROUND_COLORS[1], group: 1 });
  }
  return marks;
}

/** trabzan sırası: iki artırma */
function dcIncRow(): Mark[] {
  const c = ROUND_COLORS[2];
  const marks: Mark[] = chainRowMarks(7, 236, 80, 40, 28, 0);
  [0, 1, 3, 4, 6].forEach((i) => {
    const x = 80 + i * 40;
    if (i === 1 || i === 4) marks.push(...fanMarks([x, 222], 2, 34, 'dc', 96, c, 1));
    else marks.push({ id: 'dc', at: [x, 174], size: 96, color: c, group: 1 });
  });
  return marks;
}

const lesson: Lesson = {
  id: 'tig-artirma',
  intro: l(
    'Tığda artırma çok basittir: aynı ilmeğe iki ilmek örersin. Daireler, amigurumiler ve üçgen şallar bu tek hareketle büyür.',
    'Increasing in crochet is simple: work two stitches into the same stitch. Circles, amigurumi and triangle shawls all grow with this one move.',
    'Aumentar en ganchillo es sencillo: dos puntos en el mismo punto. Círculos, amigurumis y chales triangulares crecen así.',
    'Aumentar no crochê é simples: dois pontos no mesmo ponto. Círculos, amigurumis e xales triangulares crescem assim.',
  ),
  steps: [
    {
      title: l('Bir {sc} ör', 'Work one {sc}', 'Teje un {sc}', 'Faça um {sc}'),
      text: l('Hedef ilmeğe her zamanki gibi bir {sc} ör.', 'Work one {sc} into the target stitch as usual.', 'Teje un {sc} en el punto marcado como siempre.', 'Faça um {sc} no ponto marcado como sempre.'),
      scene: () => <CrochetScene hook="inserted" hookFrom="up" loops={1} target arrows={crochetArrows.insert(1)} />,
      loopsOnHook: 1,
    },
    {
      title: l('Aynı ilmeğe tekrar bat', 'Insert into the same stitch again', 'Entra otra vez en el mismo punto', 'Entre de novo no mesmo ponto'),
      text: l(
        'Sonraki ilmeğe geçme: tığı az önce kullandığın AYNI ilmeğe yeniden sok ve ikinci {sc} ör. İki ilmek aynı tabandan V gibi açılır.',
        'Don’t move on: insert the hook into the SAME stitch you just used and work a second {sc}. Both stitches fan out from one base like a V.',
        'No avances: mete la aguja en el MISMO punto y teje un segundo {sc}. Ambos salen de la misma base como una V.',
        'Não avance: entre no MESMO ponto e faça um segundo {sc}. Os dois saem da mesma base como um V.',
      ),
      scene: () => <CrochetScene hook="inserted" hookFrom="up" loops={1} done={0} target extra={<FirstOfPair />} arrows={crochetArrows.insert(2)} />,
      loopsOnHook: 1,
    },
    {
      title: l('Şemada artırma', 'Increases on a diagram', 'Aumentos en el diagrama', 'Aumentos no diagrama'),
      text: l(
        'Şemada artırma, aynı noktadan çıkan iki ilmekle (V) çizilir. Bu sırada her 3. ilmeğe artırma yapılmış: 9 ilmek 12 oldu.',
        'Diagrams draw an increase as two stitches leaving the same point (a V). This row increases in every 3rd stitch: 9 stitches became 12.',
        'En el diagrama el aumento son dos puntos que salen del mismo sitio (una V). Aquí se aumenta cada 3 puntos: 9 pasan a 12.',
        'No diagrama o aumento são dois pontos saindo do mesmo lugar (um V). Aqui se aumenta a cada 3 pontos: 9 viram 12.',
      ),
      scene: () => <Diagram marks={incRow()} />,
      viewBox: fitView(incRow()),
    },
    {
      title: l('Uzun ilmeklerde de aynı', 'The same for tall stitches', 'Igual en puntos altos', 'Igual nos pontos altos'),
      text: l('Aynı ilmeğe iki {dc} ya da iki {hdc} de artırmadır. Tarif "2 {dc} aynı ilmeğe" ya da kısaca "art" der.', 'Two {dc} or two {hdc} in one stitch are increases too. Patterns say "2 {dc} in the same stitch" or simply "inc".', 'Dos {dc} o dos {hdc} en un punto también son aumentos. El patrón dice "2 {dc} en el mismo punto" o "aum".', 'Dois {dc} ou dois {hdc} no mesmo ponto também são aumentos. A receita diz "2 {dc} no mesmo ponto" ou "aum".'),
      scene: () => <Diagram marks={dcIncRow()} />,
      viewBox: fitView(dcIncRow()),
    },
  ],
  practice: {
    text: l('12 {sc} bir sıra: her 3. ilmeğe artırma yap ve 16 ilmeğe ulaş.', 'A row of 12 {sc}: increase in every 3rd stitch to reach 16.', 'Una vuelta de 12 {sc}: aumenta cada 3 puntos hasta 16.', 'Uma carreira de 12 {sc}: aumente a cada 3 pontos até 16.'),
    target: 16,
    unit: 'stitch',
  },
  quiz: [
    {
      q: l('Aynı ilmeğe 2 {sc} örünce ilmek sayısı kaç artar?', 'Two {sc} in one stitch add how many stitches?', '¿Cuántos puntos suman 2 {sc} en uno?', 'Quantos pontos somam 2 {sc} em um?'),
      options: [l('1', '1', '1', '1'), l('2', '2', '2', '2'), l('0', '0', '0', '0')],
      answer: 0,
      explain: l('Bir ilmeğin yerine iki ilmek: bir artar.', 'Two stitches where there was one: one more.', 'Dos donde había uno: uno más.', 'Dois onde havia um: um a mais.'),
    },
  ],
  summary: [l('Artırma = aynı ilmeğe 2 ilmek.', 'Increase = 2 stitches in one.', 'Aumento = 2 puntos en uno.', 'Aumento = 2 pontos em um.')],
};

export default lesson;
