import { Diagram, ROUND_COLORS, chainRowMarks, fanMarks, type Mark, fitView } from '@/engine/illust/diagram';
import { l, type Lesson } from '../types';

const C1 = ROUND_COLORS[1];
const C2 = ROUND_COLORS[2];

/** zincir, sık iğne, 2 atla, yelpaze (5 trabzan), 2 atla, sık iğne… */
function shellRow(focus?: number): Mark[] {
  const marks: Mark[] = chainRowMarks(13, 238, 32, 28, 22, 0);
  const sc = (i: number) => marks.push({ id: 'sc', at: [32 + i * 28, 218], size: 26, color: C1, group: 1 });
  sc(0);
  marks.push(...fanMarks([32 + 3 * 28, 228], 5, 84, 'dc', 90, C1, 1));
  sc(6);
  marks.push(...fanMarks([32 + 9 * 28, 228], 5, 84, 'dc', 90, C1, 1));
  sc(12);
  if (focus !== undefined && focus >= 2) {
    // ikinci sıra: yelpazelerin tepesine sık iğne, aralara yelpaze
    marks.push({ id: 'sc', at: [32 + 3 * 28, 126], size: 26, color: C2, group: 2 });
    marks.push({ id: 'sc', at: [32 + 9 * 28, 126], size: 26, color: C2, group: 2 });
    marks.push(...fanMarks([32 + 6 * 28, 206], 5, 84, 'dc', 90, C2, 2));
  }
  return marks;
}

const lesson: Lesson = {
  id: 'tig-yelpaze',
  intro: l(
    'Yelpaze (shell), aynı ilmeğe örülen 5 {dc} ile açılan bir kümedir. Araya {sc} ve atlanan ilmekler girer, böylece ilmek sayısı sabit kalır. Battaniye kenarlarında ve yazlık şallarda çok kullanılır.',
    'A shell is a fan of 5 {dc} worked into one stitch. {sc} and skipped stitches go between shells, so the stitch count stays the same. It’s a favorite for blanket edges and summer shawls.',
    'El abanico son 5 {dc} en el mismo punto. Entre abanicos van {sc} y puntos saltados, así el número no cambia. Muy usado en bordes y chales de verano.',
    'O leque são 5 {dc} no mesmo ponto. Entre leques vão {sc} e pontos pulados, então a contagem não muda. Muito usado em bordas e xales de verão.',
  ),
  steps: [
    {
      title: l('Yelpaze nasıl kurulur', 'How a shell sits', 'Cómo se forma', 'Como se forma'),
      text: l('{Sc}, 2 ilmek atla, sonraki ilmeğe 5 {dc}, 2 ilmek atla, {sc}. Tekrar 6 ilmekte bir (+1).', '{Sc}, skip 2, 5 {dc} in the next stitch, skip 2, {sc}. The repeat is a multiple of 6 + 1.', '{Sc}, salta 2, 5 {dc} en el siguiente, salta 2, {sc}. Múltiplo de 6 + 1.', '{Sc}, pule 2, 5 {dc} no próximo, pule 2, {sc}. Múltiplo de 6 + 1.'),
      scene: () => <Diagram marks={shellRow(1)} focus={1} />,
      viewBox: fitView(shellRow(1)),
    },
    {
      title: l('İkinci sıra', 'The next row', 'La vuelta siguiente', 'A carreira seguinte'),
      text: l(
        'Sırayı çevir. Yeni yelpazeler önceki sıradaki {sc} ilmeklerine, yeni {sc} ilmekleri de önceki yelpazelerin orta {dc} tepesine örülür. Desen yarım tekrar kayar.',
        'Turn. New shells go into the {sc} of the row below, and new {sc} go into the center {dc} of the shells below. The pattern shifts by half a repeat.',
        'Gira. Los abanicos nuevos van en los {sc} de abajo y los {sc} nuevos en el {dc} central de cada abanico.',
        'Vire. Os leques novos vão nos {sc} de baixo e os {sc} novos no {dc} central de cada leque.',
      ),
      scene: () => <Diagram marks={shellRow(2)} focus={2} />,
      viewBox: fitView(shellRow(2)),
      tip: l('Sıra sonlarında yarım yelpaze (3 {dc}) yaparsan kenar düz kalır.', 'Half shells (3 {dc}) at the row ends keep the edges straight.', 'Medios abanicos (3 {dc}) en los extremos dejan el borde recto.', 'Meios leques (3 {dc}) nas pontas deixam a borda reta.'),
    },
  ],
  practice: {
    text: l('25 zincir (6’nın katı + 1) çek, iki sıra yelpaze ör.', 'Chain 25 (a multiple of 6 plus 1) and work two rows of shells.', 'Haz 25 cadenetas (múltiplo de 6 + 1) y dos vueltas de abanicos.', 'Faça 25 correntinhas (múltiplo de 6 + 1) e duas carreiras de leques.'),
    target: 2,
    unit: 'row',
  },
  quiz: [
    {
      q: l('Bir yelpazede kaç {dc} vardır?', 'How many {dc} are in a shell?', '¿Cuántos {dc} tiene un abanico?', 'Quantos {dc} tem um leque?'),
      options: [l('5', '5', '5', '5'), l('3', '3', '3', '3'), l('7', '7', '7', '7')],
      answer: 0,
    },
  ],
  summary: [l('{Sc}, 2 atla, 5 {dc}, 2 atla; sonraki sırada yerler değişir.', '{Sc}, skip 2, 5 {dc}, skip 2; next row they trade places.', '{Sc}, salta 2, 5 {dc}, salta 2; en la siguiente se alternan.', '{Sc}, pule 2, 5 {dc}, pule 2; na seguinte trocam de lugar.')],
};

export default lesson;
