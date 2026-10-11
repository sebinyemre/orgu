import { Diagram, grannyMarks, zoomView } from '@/engine/illust/diagram';
import { MagicRingScene } from '@/engine/illust/scenes';
import { l, type Lesson } from '../types';

const marks = grannyMarks({ rounds: 3 });
const granny = (focus: number) => () => <Diagram marks={marks} focus={focus} />;

const lesson: Lesson = {
  id: 'tig-buyukanne-karesi',
  intro: l(
    'Büyükanne karesi, üçlü {dc} kümelerinden oluşan klasik bir motiftir. Kümeler ilmeklere değil, aradaki boşluklara örülür; köşelerde iki küme arasına 2 zincir girer. Battaniyeden çantaya her şey bu karelerin birleşmesiyle yapılır.',
    'The granny square is a classic motif made of clusters of three {dc}. The clusters go into the spaces between, not into stitches, and each corner gets two clusters with 2 chains between them. Blankets, bags and more are made by joining these squares.',
    'El cuadro de la abuela es un motivo clásico de grupos de tres {dc}. Los grupos se tejen en los espacios, no en los puntos, y cada esquina lleva dos grupos con 2 cadenetas en medio.',
    'O quadradinho da vovó é um motivo clássico de grupos de três {dc}. Os grupos vão nos espaços, não nos pontos, e cada canto leva dois grupos com 2 correntinhas no meio.',
  ),
  needs: [
    { kind: 'hook', text: l('İpe uygun tığ (orta kalınlık için 4–5 mm)', 'A hook to suit the yarn (4–5 mm for worsted)', 'Aguja adecuada (4–5 mm para hilo medio)', 'Agulha adequada (4–5 mm para fio médio)') },
    { kind: 'yarn', text: l('Birkaç renk artık ip', 'Scraps in a few colors', 'Restos de varios colores', 'Sobras de algumas cores') },
  ],
  steps: [
    {
      title: l('Başlangıç halkası', 'Starting ring', 'Anillo inicial', 'Anel inicial'),
      text: l('Sihirli halka yap ya da 4 zincir çekip ilkine {slst} ile birleştir.', 'Make a magic ring, or chain 4 and join with a {slst} into the first chain.', 'Haz un anillo mágico, o 4 cadenetas unidas con un {slst}.', 'Faça um anel mágico, ou 4 correntinhas unidas com um {slst}.'),
      scene: () => <MagicRingScene phase="wrap" />,
    },
    {
      title: l('1. tur', 'Round 1', 'Vuelta 1', 'Volta 1'),
      text: l(
        '3 zincir (ilk {dc} sayılır), halkaya 2 {dc}, 2 zincir. *Halkaya 3 {dc}, 2 zincir* 3 kez. Turun başındaki 3. zincire {slst} ile birleştir. 4 küme, 4 köşe.',
        'Chain 3 (counts as the first {dc}), 2 {dc} into the ring, chain 2. *3 {dc} into the ring, chain 2* three times. Join with a {slst} to the top of the starting chain. 4 clusters, 4 corners.',
        '3 cadenetas (cuentan como el primer {dc}), 2 {dc} en el aro, 2 cadenetas. *3 {dc}, 2 cadenetas* 3 veces. Une con un {slst}. 4 grupos, 4 esquinas.',
        '3 correntinhas (contam como o primeiro {dc}), 2 {dc} no anel, 2 correntinhas. *3 {dc}, 2 correntinhas* 3 vezes. Una com um {slst}. 4 grupos, 4 cantos.',
      ),
      scene: granny(1),
      viewBox: zoomView(78),
    },
    {
      title: l('2. tur', 'Round 2', 'Vuelta 2', 'Volta 2'),
      text: l(
        'Köşe boşluğuna kör ilmekle ilerle. Her köşeye (3 {dc}, 2 zincir, 3 {dc}) ve köşeler arasına 1 zincir. Kümeler, alttaki köşenin iki yanına açılır.',
        'Slip stitch over to a corner space. Into each corner work (3 {dc}, chain 2, 3 {dc}), with 1 chain between corners. The clusters open out on either side of the corner below.',
        'Avanza con puntos rasos hasta una esquina. En cada esquina (3 {dc}, 2 cadenetas, 3 {dc}) y 1 cadeneta entre esquinas.',
        'Avance com pontos baixíssimos até um canto. Em cada canto (3 {dc}, 2 correntinhas, 3 {dc}) e 1 correntinha entre cantos.',
      ),
      scene: granny(2),
      viewBox: zoomView(112),
    },
    {
      title: l('3. tur', 'Round 3', 'Vuelta 3', 'Volta 3'),
      text: l(
        'Köşeler aynı: (3 {dc}, 2 zincir, 3 {dc}). Kenarlarda her 1 zincirlik boşluğa 3 {dc}, aralarına 1 zincir. Her turda her kenara bir küme daha eklenir.',
        'Corners as before: (3 {dc}, chain 2, 3 {dc}). Along the sides work 3 {dc} into each 1-chain space, with 1 chain between. Each round adds one more cluster per side.',
        'Esquinas igual: (3 {dc}, 2 cadenetas, 3 {dc}). En los lados, 3 {dc} en cada espacio de 1 cadeneta, con 1 cadeneta entre ellos.',
        'Cantos igual: (3 {dc}, 2 correntinhas, 3 {dc}). Nos lados, 3 {dc} em cada espaço de 1 correntinha, com 1 correntinha entre eles.',
      ),
      scene: granny(3),
      tip: l('Her turu farklı renkle örebilirsin: renk değiştirme dersine bak.', 'You can work each round in a different color: see the changing color lesson.', 'Puedes tejer cada vuelta de un color: mira la lección de cambiar de color.', 'Você pode fazer cada volta de uma cor: veja a lição de trocar de cor.'),
    },
  ],
  practice: {
    text: l('3 turluk bir büyükanne karesi ör.', 'Crochet a 3-round granny square.', 'Teje un cuadro de la abuela de 3 vueltas.', 'Faça um quadradinho da vovó de 3 voltas.'),
    target: 3,
    unit: 'round',
  },
  quiz: [
    {
      q: l('Bir köşede ne örülür?', 'What goes into a corner?', '¿Qué se teje en una esquina?', 'O que se faz num canto?'),
      options: [l('3 {dc}, 2 zincir, 3 {dc}', '3 {dc}, ch 2, 3 {dc}', '3 {dc}, 2 cad, 3 {dc}', '3 {dc}, 2 corr, 3 {dc}'), l('6 {dc}', '6 {dc}', '6 {dc}', '6 {dc}'), l('3 {dc}, 1 zincir', '3 {dc}, ch 1', '3 {dc}, 1 cad', '3 {dc}, 1 corr')],
      answer: 0,
    },
  ],
  summary: [
    l('Kümeler boşluklara örülür.', 'Clusters go into spaces.', 'Los grupos van en los espacios.', 'Os grupos vão nos espaços.'),
    l('Köşe: 3, 2 zincir, 3. Kenar: 1 zincir aralıklı kümeler.', 'Corner: 3, ch 2, 3. Side: clusters with 1 chain between.', 'Esquina: 3, 2 cad, 3. Lado: grupos con 1 cad.', 'Canto: 3, 2 corr, 3. Lado: grupos com 1 corr.'),
  ],
};

export default lesson;
