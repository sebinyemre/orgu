import { MagicLoopScene } from '@/engine/illust/round';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-magic-loop',
  intro: l(
    'Çorap, eldiven ya da bere tepesi gibi dar çevreler kısa bir misinaya sığmaz. Magic loop yönteminde uzun (80 cm ya da daha uzun) bir misinalı şiş kullanırsın: ilmekleri ikiye bölüp kablonun fazlasını iki yandan halka gibi dışarı çekersin.',
    'Small circumferences like socks, mittens and hat crowns won’t fit on a short circular. With magic loop you use one long circular (80 cm / 32 in or more): split the stitches in half and pull the extra cable out in loops on either side.',
    'Calcetines, manoplas o coronillas no caben en una circular corta. Con magic loop usas una circular larga (80 cm o más): divides los puntos en dos y sacas el cable sobrante en bucles a cada lado.',
    'Meias, luvas e topos de gorro não cabem numa circular curta. No magic loop você usa uma circular longa (80 cm ou mais): divide os pontos ao meio e puxa o cabo que sobra em alças dos dois lados.',
  ),
  needs: [{ kind: 'circular', text: l('Esnek kablolu, en az 80 cm misinalı şiş', 'A circular at least 80 cm (32 in) long with a soft cable', 'Circular de al menos 80 cm con cable flexible', 'Circular de pelo menos 80 cm com cabo macio') }],
  steps: [
    {
      title: l('1 · İkiye böl', '1 · Split in half', '1 · Divide en dos', '1 · Divida ao meio'),
      text: l(
        'İlmekleri kablonun ortasına kaydır. Tam yarıdan kabloyu bir halka gibi aradan dışarı çek: yarısı önde, yarısı arkada kalır.',
        'Slide the stitches to the middle of the cable. Exactly halfway, pull a loop of cable out between them: half the stitches in front, half behind.',
        'Lleva los puntos al centro del cable. Justo a la mitad, saca un bucle de cable entre ellos: la mitad delante y la mitad detrás.',
        'Leve os pontos ao meio do cabo. Bem na metade, puxe uma alça de cabo entre eles: metade na frente, metade atrás.',
      ),
      scene: () => <MagicLoopScene phase="split" />,
    },
    {
      title: l('2 · Arka ucu çek', '2 · Pull the back tip', '2 · Saca la punta de atrás', '2 · Puxe a ponta de trás'),
      text: l(
        'İki yarıyı da şiş uçlarına it, uçlar sağa baksın. Çalışan ip arkadaki son ilmekten gelir. Arka şiş ucunu çek: arka ilmekler kabloya kayar, uç serbest kalır.',
        'Push both halves onto the needle tips, tips pointing right. The working yarn hangs from the last stitch at the back. Pull the back tip out: those stitches slide onto the cable and the tip is free.',
        'Empuja ambas mitades a las puntas, mirando a la derecha. La hebra sale del último punto de atrás. Tira de la punta trasera: esos puntos pasan al cable y la punta queda libre.',
        'Empurre as duas metades para as pontas, viradas para a direita. O fio sai do último ponto de trás. Puxe a ponta de trás: esses pontos vão para o cabo e a ponta fica livre.',
      ),
      scene: () => <MagicLoopScene phase="pull" />,
    },
    {
      title: l('3 · Ön yarıyı ör', '3 · Knit the front half', '3 · Teje la mitad delantera', '3 · Tricote a metade da frente'),
      text: l(
        'Serbest ucu sağ şiş gibi kullanıp öndeki ilmekleri ör. Bu yarının ilk ilmeğini sıkı çekersen köşede merdiven gibi boşluk oluşmaz.',
        'Use the free tip as your right needle and knit the front stitches. Snug up the first stitch of each half so no ladder forms at the corners.',
        'Usa la punta libre como aguja derecha y teje los puntos delanteros. Aprieta el primer punto de cada mitad para que no salga una escalera.',
        'Use a ponta livre como agulha direita e tricote os pontos da frente. Aperte o primeiro ponto de cada metade para não formar escadinha.',
      ),
      scene: () => <MagicLoopScene phase="knit" />,
    },
    {
      title: l('4 · Çevir ve tekrarla', '4 · Turn and repeat', '4 · Gira y repite', '4 · Gire e repita'),
      text: l(
        'Yarı bitince işi çevir, öbür yarıyı şiş ucuna it, arka ucu çek ve ör. İki yarı = bir tur.',
        'When the half is done, turn the work, push the other half onto its tip, pull the back tip out and knit. Two halves make one round.',
        'Al terminar la mitad, gira la labor, empuja la otra mitad a su punta, saca la punta trasera y teje. Dos mitades son una vuelta.',
        'Ao terminar a metade, gire o trabalho, empurre a outra metade para a ponta, puxe a ponta de trás e tricote. Duas metades fazem uma volta.',
      ),
      scene: () => <MagicLoopScene phase="turn" />,
    },
  ],
  practice: {
    text: l('36 ilmek at, magic loop ile birleştir ve 8 tur 1 düz 1 ters lastik ör.', 'Cast on 36, join with magic loop and knit 8 rounds of k1, p1 rib.', 'Monta 36 puntos, une con magic loop y teje 8 vueltas de elástico 1×1.', 'Monte 36 pontos, una com magic loop e tricote 8 voltas de ribana 1×1.'),
    target: 8,
    unit: 'round',
  },
  quiz: [
    {
      q: l('Magic loop’ta bir tur kaç yarıdan oluşur?', 'How many halves make one round in magic loop?', '¿Cuántas mitades forman una vuelta en magic loop?', 'Quantas metades formam uma volta no magic loop?'),
      options: [l('2', '2', '2', '2'), l('3', '3', '3', '3'), l('4', '4', '4', '4')],
      answer: 0,
    },
  ],
  summary: [
    l('Uzun misina, ikiye bölünmüş ilmekler, iki yanda kablo halkası.', 'Long cable, stitches split in two, a cable loop on each side.', 'Cable largo, puntos divididos en dos, un bucle a cada lado.', 'Cabo longo, pontos divididos em dois, uma alça de cabo de cada lado.'),
    l('Her yarının ilk ilmeğini sıkı çek.', 'Snug the first stitch of each half.', 'Aprieta el primer punto de cada mitad.', 'Aperte o primeiro ponto de cada metade.'),
  ],
};

export default lesson;
