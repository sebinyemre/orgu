import { Diagram, ROUND_COLORS, chainRowMarks, fanMarks, type Mark, fitView } from '@/engine/illust/diagram';
import { l, type Lesson } from '../types';

const C1 = ROUND_COLORS[2];
const C2 = ROUND_COLORS[4];

/** V: aynı ilmeğe {dc}, 1 zincir, {dc}; aralarda 1 ilmek atlanır */
function vRow(rows: number): Mark[] {
  const marks: Mark[] = chainRowMarks(10, 244, 38, 36, 24, 0);
  const v = (x: number, base: number, color: string, group: number) => {
    marks.push(...fanMarks([x, base], 2, 58, 'dc', 70, color, group));
    marks.push({ id: 'ch', at: [x, base - 70], size: 22, color, group });
  };
  [1, 4, 7].forEach((i) => v(38 + i * 36, 232, C1, 1));
  if (rows >= 2) [1, 4, 7].forEach((i) => v(38 + i * 36, 160, C2, 2));
  return marks;
}

const lesson: Lesson = {
  id: 'tig-v-ilmek',
  intro: l(
    'V ilmek, aynı ilmeğe bir {dc}, bir zincir ve bir {dc} daha örülerek yapılır. Hızlı ilerler, havalı ve esnek bir kumaş verir. Sonraki sırada yeni V’ler, alttaki V’lerin ortasındaki zincir boşluğuna örülür.',
    'A V-stitch is a {dc}, a chain and another {dc} all in the same stitch. It grows fast and makes an airy, drapey fabric. On the next row, new Vs go into the chain space at the center of the Vs below.',
    'El punto V es un {dc}, una cadeneta y otro {dc} en el mismo punto. Avanza rápido y da un tejido aireado. En la vuelta siguiente, las V nuevas van en el espacio central de las de abajo.',
    'O ponto V é um {dc}, uma correntinha e outro {dc} no mesmo ponto. Rende rápido e dá um tecido arejado. Na carreira seguinte, os V novos vão no espaço central dos de baixo.',
  ),
  steps: [
    {
      title: l('Bir V', 'One V', 'Una V', 'Um V'),
      text: l('Aynı ilmeğe: 1 {dc}, 1 zincir, 1 {dc}. Sonra 2 ilmek atla ve tekrarla.', 'In the same stitch: 1 {dc}, chain 1, 1 {dc}. Then skip 2 and repeat.', 'En el mismo punto: 1 {dc}, 1 cadeneta, 1 {dc}. Salta 2 y repite.', 'No mesmo ponto: 1 {dc}, 1 correntinha, 1 {dc}. Pule 2 e repita.'),
      scene: () => <Diagram marks={vRow(1)} focus={1} />,
      viewBox: fitView(vRow(1)),
    },
    {
      title: l('V’nin içine V', 'A V into a V', 'V dentro de V', 'V dentro de V'),
      text: l('Sırayı çevir, 3 zincirle kalk. Her yeni V’yi alttaki V’nin ortasındaki zincir boşluğuna ör.', 'Turn and chain 3. Work each new V into the chain space at the center of the V below.', 'Gira y haz 3 cadenetas. Cada V nueva va en el espacio central de la V de abajo.', 'Vire e faça 3 correntinhas. Cada V novo vai no espaço central do V de baixo.'),
      scene: () => <Diagram marks={vRow(2)} focus={2} />,
      viewBox: fitView(vRow(2)),
    },
  ],
  quiz: [
    {
      q: l('Sonraki sırada V nereye örülür?', 'Where does a V go on the next row?', '¿Dónde va la V en la vuelta siguiente?', 'Onde vai o V na carreira seguinte?'),
      options: [l('Alttaki V’nin zincir boşluğuna', 'Into the chain space of the V below', 'En el espacio de cadeneta de la V de abajo', 'No espaço de correntinha do V de baixo'), l('Alttaki {dc} tepesine', 'Into the top of a {dc} below', 'En la parte superior de un {dc}', 'No topo de um {dc}'), l('Atlanan ilmeğe', 'Into a skipped stitch', 'En un punto saltado', 'Num ponto pulado')],
      answer: 0,
    },
  ],
  summary: [l('V = {dc}, zincir, {dc} aynı ilmeğe; sonraki sırada boşluğa.', 'V = {dc}, ch, {dc} in one stitch; next row into the space.', 'V = {dc}, cad, {dc} en un punto; luego en el espacio.', 'V = {dc}, corr, {dc} no mesmo ponto; depois no espaço.')],
};

export default lesson;
