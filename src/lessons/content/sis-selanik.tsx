import { KnitScene, knitArrows, leftLoopAt } from '@/engine/illust/knit';
import { Target } from '@/engine/illust/parts';
import { SwatchScene, swatchRows } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const below = () => {
  const c = leftLoopAt(0);
  return <Target c={[c[0] + 2, c[1] + 58]} r={20} />;
};

const lesson: Lesson = {
  id: 'sis-selanik',
  intro: l(
    'Selanik (İngilizcede brioche), kalın, yumuşak ve iki yüzü aynı görünen bir lastiktir. Sırrı, her ilmeğin üstüne bir ip atılıp kaydırılması ve bir sonraki sırada ilmekle ipin birlikte örülmesidir. Yalancı selanik aynı görüntüyü ip atmadan, bir alttaki ilmeğe batarak verir.',
    'Brioche is a thick, squishy rib that looks the same on both sides. The secret: each stitch is slipped with a yarn over draped on top, and on the next row the stitch and its yarn over are knitted together. Mock brioche (fisherman’s rib) gets a similar look without yarn overs by knitting into the stitch below.',
    'El brioche es un elástico grueso, mullido e igual por ambas caras. El secreto: cada punto se desliza con una lazada encima y en la vuelta siguiente se tejen juntos. El falso brioche logra un aspecto parecido sin lazadas, tejiendo en el punto de abajo.',
    'O brioche é uma ribana grossa, fofa e igual dos dois lados. O segredo: cada ponto é deslizado com uma laçada por cima e na carreira seguinte ponto e laçada são tricotados juntos. O falso brioche dá um efeito parecido sem laçadas, tricotando no ponto de baixo.',
  ),
  steps: [
    {
      title: l('1 · İp önde, ters kaydır', '1 · Yarn in front, slip purlwise', '1 · Hebra delante, desliza', '1 · Fio na frente, deslize'),
      text: l(
        'İpi öne al ve sonraki ilmeği ters örer gibi kaydır.',
        'Bring the yarn to the front and slip the next stitch purlwise.',
        'Lleva la hebra delante y desliza el siguiente punto del revés.',
        'Traga o fio para a frente e deslize o próximo ponto como tricô.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="insertP" rnFrom="rest" yarn="front" target arrows={knitArrows.insertP(1)} />,
    },
    {
      title: l('2 · İp ilmeğin üstünden aşsın', '2 · Yarn over the slipped stitch', '2 · Hebra sobre el punto', '2 · Fio por cima do ponto'),
      text: l(
        'Bir sonraki ilmeği örerken ip, kaydırdığın ilmeğin üstünden şişe aşar. İlmek ve üstündeki ip (mavi) bir şal gibi birlikte durur ve tek ilmek sayılır.',
        'As you work the next stitch, the yarn travels over the needle on top of the slipped stitch. The stitch and its yarn over (blue) sit together like a shawl and count as one.',
        'Al tejer el siguiente punto, la hebra pasa por encima de la aguja sobre el punto deslizado. Punto y lazada (azul) quedan juntos como un chal y cuentan como uno.',
        'Ao tricotar o próximo ponto, o fio passa por cima da agulha sobre o ponto deslizado. Ponto e laçada (azul) ficam juntos como um xale e contam como um.',
      ),
      scene: () => <KnitScene left={3} right={2} rn="rest" newLoop="yo" />,
    },
    {
      title: l('3 · İlmeği ipiyle birlikte ör', '3 · Knit the stitch with its yarn over', '3 · Teje el punto con su lazada', '3 · Tricote o ponto com a laçada'),
      text: l(
        'Sonraki sırada bu "şallı" ilmeğe gelince ilmeği ve üstündeki ipi BİRLİKTE düz ör. Selanik deseni bu iki hareketin sırayla tekrarıdır.',
        'On the next row, when you reach a "shawled" stitch, knit the stitch and its yarn over TOGETHER. Brioche is just these two moves repeated.',
        'En la vuelta siguiente, al llegar a un punto "con chal", teje el punto y su lazada JUNTOS. El brioche es repetir estos dos gestos.',
        'Na carreira seguinte, ao chegar num ponto "com xale", tricote o ponto e a laçada JUNTOS. O brioche é repetir esses dois gestos.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="insertK" rnFrom="rest" leftYo target arrows={knitArrows.insertK(2)} />,
      warn: l('İpi saymayı unutma: ip atmalar ilmek sayısını artırmaz.', 'Don’t count the yarn overs: they don’t add stitches.', 'No cuentes las lazadas: no suman puntos.', 'Não conte as laçadas: não somam pontos.'),
    },
    {
      title: l('Selanik kumaşı', 'Brioche fabric', 'Tejido brioche', 'Tecido brioche'),
      text: l('Kalın, havalı ve iki yüzü de aynı görünen bir lastik çıkar. Atkı ve boyunluk için harikadır.', 'A thick, airy rib that looks the same on both sides. Lovely for scarves and cowls.', 'Un elástico grueso y aireado, igual por ambas caras. Ideal para bufandas y cuellos.', 'Uma ribana grossa e aerada, igual dos dois lados. Ótima para cachecóis e golas.'),
      scene: () => <SwatchScene rows={swatchRows('lastik1', 12, 6)} rowH={30} cell={26} />,
    },
    {
      title: l('Yalancı selanik: bir alttan ör', 'Mock brioche: knit below', 'Falso brioche: teje abajo', 'Falso brioche: tricote abaixo'),
      text: l(
        'Yalancı selanikte ip atma yoktur. Düz ilmeği, sol şişteki ilmeğin BİR ALTINDAKİ ilmeğin ortasından ör; üstteki ilmek çözülür ve ikisi tek ilmek olur.',
        'Mock brioche uses no yarn overs. Knit into the center of the stitch ONE ROW BELOW the one on the needle; the stitch above unravels and both become one.',
        'El falso brioche no lleva lazadas. Teje en el centro del punto UNA VUELTA MÁS ABAJO del que está en la aguja; el de arriba se suelta y ambos son uno.',
        'O falso brioche não tem laçadas. Tricote no centro do ponto UMA CARREIRA ABAIXO do que está na agulha; o de cima se solta e os dois viram um.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="insertK" rnFrom="rest" extra={below()} arrows={knitArrows.insertK(1)} />,
    },
    {
      title: l('Yalancı selanik kumaşı', 'Mock brioche fabric', 'Tejido falso brioche', 'Tecido falso brioche'),
      text: l(
        'Tek sayıda ilmekle: 1. sıra hep 1 düz 1 ters; sonraki sıralarda düzler bir alttan örülür. Selanikten biraz daha ince ama yine kabarık bir lastik.',
        'With an odd number of stitches: row 1 is k1, p1; on the rows after, the knits are worked into the stitch below. A little thinner than brioche, still plump.',
        'Con número impar: vuelta 1 es 1 d, 1 r; después, los derechos se tejen en el punto de abajo. Algo más fino que el brioche, igual de mullido.',
        'Com número ímpar: carreira 1 é 1 m, 1 t; depois, as meias são feitas no ponto de baixo. Um pouco mais fino que o brioche, ainda fofo.',
      ),
      scene: () => <SwatchScene rows={swatchRows('yalanci', 13, 8)} cell={26} />,
    },
  ],
  practice: {
    text: l('Tek sayıda (21) ilmekle yalancı selanik ör: 20 sıra.', 'Knit mock brioche on an odd number of stitches (21): 20 rows.', 'Teje falso brioche con 21 puntos: 20 vueltas.', 'Tricote falso brioche com 21 pontos: 20 carreiras.'),
    target: 20,
    unit: 'row',
  },
  quiz: [
    {
      q: l('Selanikte ilmeğin üstündeki ip ne olur?', 'What happens to the yarn over sitting on a brioche stitch?', '¿Qué pasa con la lazada sobre el punto brioche?', 'O que acontece com a laçada sobre o ponto brioche?'),
      options: [l('Sonraki sırada ilmekle birlikte örülür', 'It is knitted together with its stitch next row', 'Se teje junto a su punto en la vuelta siguiente', 'É tricotada junto com o ponto na carreira seguinte'), l('Ayrı bir ilmek olarak örülür', 'It is worked as a separate stitch', 'Se teje como punto aparte', 'É tricotada como ponto separado'), l('Şişten düşürülür', 'It is dropped', 'Se suelta', 'É solta')],
      answer: 0,
    },
  ],
  summary: [
    l('Selanik: ip önde kaydır + ip at, sonra ilmeği ipiyle birlikte ör.', 'Brioche: slip with a yarn over, then knit the stitch with its yarn over.', 'Brioche: desliza con lazada y luego teje punto y lazada juntos.', 'Brioche: deslize com laçada e depois tricote ponto e laçada juntos.'),
    l('Yalancı selanik: düzleri bir alttan ör.', 'Mock brioche: knit the knits one row below.', 'Falso brioche: teje los derechos en el punto de abajo.', 'Falso brioche: tricote as meias no ponto de baixo.'),
  ],
};

export default lesson;
