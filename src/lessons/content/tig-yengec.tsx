import { CK, CrochetScene, TARGET_X, crochetArrows } from '@/engine/illust/crochet';
import { Diagram, ROUND_COLORS, type Mark, fitView } from '@/engine/illust/diagram';
import { ellipse } from '@/engine/illust/geom';
import { Arrow, Target, Yarn } from '@/engine/illust/parts';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

const NEXT: [number, number] = [TARGET_X + CK.st, CK.rowY];

/** burgulu kordon kenar */
function Cord() {
  const xs = Array.from({ length: 10 }, (_, i) => TARGET_X + (i - 3) * CK.st);
  return (
    <g>
      {xs.map((x, i) => (
        <Yarn key={i} d={ellipse([x, CK.rowY - 10], 22, 11, -32)} color={YARN.second} w={8} />
      ))}
    </g>
  );
}

const crabRow: Mark[] = Array.from({ length: 7 }, (_, i) => ({ id: 'crab', at: [56 + i * 48, 150] as [number, number], size: 54, color: ROUND_COLORS[1], group: 0 }));

const lesson: Lesson = {
  id: 'tig-yengec',
  intro: l(
    'Yengeç ilmeği, ters yönde örülen {sc} ilmeğidir: sağdan sola değil, soldan sağa ilerlersin. İlmekler kendi üstüne bükülür ve kenarda burgulu, sağlam bir kordon oluşur. Battaniye ve çanta kenarları için idealdir.',
    'Crab stitch is a {sc} worked backwards: you move left to right instead of right to left. The stitches twist over themselves and form a sturdy, corded edge, ideal for blankets and bags.',
    'El punto cangrejo es un {sc} tejido al revés: avanzas de izquierda a derecha. Los puntos se retuercen y forman un borde de cordón firme.',
    'O ponto caranguejo é um {sc} feito ao contrário: você avança da esquerda para a direita. Os pontos se torcem e formam uma borda de cordão firme.',
  ),
  steps: [
    {
      title: l('Çevirme, sağa git', 'Don’t turn, go right', 'No gires, ve a la derecha', 'Não vire, vá para a direita'),
      text: l('Bir {sc} sırası bitince işi çevirme. Tığı SAĞINDAKİ ilmeğe, önden arkaya sok.', 'At the end of a {sc} row, don’t turn. Insert the hook front to back into the stitch to your RIGHT.', 'Al terminar una vuelta de {sc}, no gires. Mete la aguja en el punto de tu DERECHA.', 'Ao terminar uma carreira de {sc}, não vire. Entre no ponto à sua DIREITA.'),
      scene: () => <CrochetScene hook="up" loops={1} done={0} extra={<Target c={NEXT} r={26} />} arrows={<Arrow d={`M${TARGET_X - 10} ${CK.rowY - 70} C${TARGET_X + 20} ${CK.rowY - 80} ${NEXT[0] - 10} ${NEXT[1] - 60} ${NEXT[0]} ${NEXT[1] - 22}`} n={1} start={[TARGET_X - 24, CK.rowY - 70]} />} />,
      loopsOnHook: 1,
    },
    {
      title: l('Çek ve ikisinden geçir', 'Pull up and finish', 'Saca y cierra', 'Puxe e feche'),
      text: l('İp at, ilmeği öne çek (2 ilmek), ip at ve ikisinden geçir: normal {sc} gibi. Her seferinde bir ilmek sağa ilerle.', 'Yarn over, pull up (2 loops), yarn over and pull through both, just like a {sc}. Move one stitch to the right each time.', 'Lazada, saca (2 lazos), lazada y cierra ambos, como un {sc}. Avanza un punto a la derecha.', 'Laçada, puxe (2 alças), laçada e feche as duas, como um {sc}. Avance um ponto para a direita.'),
      scene: () => <CrochetScene hook="pulled" loops={2} pulledLoop loopColors={[YARN.second, YARN.main]} yo through={{ n: 3, at: [0.2, 0.6] }} arrows={crochetArrows.through(2)} />,
      loopsOnHook: 1,
    },
    {
      title: l('Kordon kenar', 'Corded edge', 'Borde de cordón', 'Borda de cordão'),
      text: l('Ters yönde örüldükleri için ilmekler çapraz yatar ve kalın, burgulu bir kordon gibi görünür.', 'Because they are worked backwards, the stitches lie at a slant and look like a thick, twisted cord.', 'Al tejerse al revés quedan inclinados y parecen un cordón retorcido.', 'Feitos ao contrário, ficam inclinados e parecem um cordão torcido.'),
      scene: () => <CrochetScene hook="up" loops={1} done={0} extra={<Cord />} />,
    },
    {
      title: l('Şemada', 'On a diagram', 'En el diagrama', 'No diagrama'),
      text: l('Şemada {sc} işaretinin altında ters yöne kıvrılan bir yay olarak çizilir.', 'Diagrams draw it as a {sc} mark with a curved line beneath.', 'Se dibuja como un {sc} con una curva debajo.', 'Aparece como um {sc} com uma curva embaixo.'),
      scene: () => <Diagram marks={crabRow} />,
      viewBox: fitView(crabRow),
      tip: l('Kenar dalgalanıyorsa bir numara küçük tığ kullan ya da arada bir ilmek atla.', 'If the edge ruffles, use a smaller hook or skip a stitch now and then.', 'Si el borde se ondula, usa una aguja más fina o salta un punto de vez en cuando.', 'Se a borda ondular, use agulha menor ou pule um ponto de vez em quando.'),
    },
  ],
  quiz: [
    {
      q: l('Yengeç ilmeği hangi yönde örülür?', 'Which way is crab stitch worked?', '¿En qué dirección se teje el cangrejo?', 'Em que direção se faz o caranguejo?'),
      options: [l('Soldan sağa (ters yönde)', 'Left to right (backwards)', 'De izquierda a derecha', 'Da esquerda para a direita'), l('Sağdan sola', 'Right to left', 'De derecha a izquierda', 'Da direita para a esquerda'), l('Yukarıdan aşağı', 'Top to bottom', 'De arriba abajo', 'De cima para baixo')],
      answer: 0,
    },
  ],
  summary: [l('Çevirmeden sağa doğru {sc}: burgulu kordon kenar.', '{Sc} worked to the right without turning: a twisted cord edge.', '{Sc} hacia la derecha sin girar: borde de cordón.', '{Sc} para a direita sem virar: borda de cordão.')],
};

export default lesson;
