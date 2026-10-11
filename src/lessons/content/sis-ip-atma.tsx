import { KnitScene } from '@/engine/illust/knit';
import { Arrow } from '@/engine/illust/parts';
import { SwatchScene, type Cell } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const k = (n: number): Cell[] => Array.from({ length: n }, () => 'k');
/** jarse içinde tek sıra delik (üstten alta) */
const eyelets: Cell[][] = [k(12), k(12), ['k', 'k', 'yo', 'k2tog', 'k', 'k', 'yo', 'k2tog', 'k', 'k', 'yo', 'k2tog'], k(12), k(12), k(12)];
/** ajur yaprak: ip atmalar eksiltmelerle eşli (üstten alta) */
const lace: Cell[][] = [
  ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
  ['k', 'k', 'k', 'k', 'k2tog', 'yo', 'k', 'yo', 'ssk', 'k', 'k', 'k'],
  ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
  ['k', 'k', 'k', 'k2tog', 'yo', 'k', 'k', 'k', 'yo', 'ssk', 'k', 'k'],
  ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
  ['k', 'k', 'k2tog', 'yo', 'k', 'k', 'k', 'k', 'k', 'yo', 'ssk', 'k'],
  ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
];

const lesson: Lesson = {
  id: 'sis-ip-atma',
  intro: l(
    'İp atma, sağ şişin üstüne fazladan bir ip sarar. Bu ip bir sonraki sırada ilmek gibi örülür ve altında küçük, düzenli bir delik kalır. Ajur (dantel) örgülerin hepsi bu delikle kurulur. Her ip atmanın yanına bir eksiltme koyarsan ilmek sayısı değişmez.',
    'A yarn over wraps an extra strand over the right needle. On the next row you work it like a stitch and a small, neat hole stays below it. All lace is built from this hole. Pair every yarn over with a decrease and the stitch count stays the same.',
    'La lazada enrolla una hebra extra sobre la aguja derecha. En la vuelta siguiente se teje como un punto y debajo queda un agujerito ordenado. Todo el calado se construye así. Si cada lazada va con una disminución, el número de puntos no cambia.',
    'A laçada enrola um fio extra sobre a agulha direita. Na carreira seguinte ela é tricotada como um ponto e embaixo fica um furinho certinho. Toda renda nasce disso. Se cada laçada vier com uma diminuição, o número de pontos não muda.',
  ),
  steps: [
    {
      title: l('İpi öne al', 'Bring the yarn forward', 'Pasa la hebra delante', 'Traga o fio para a frente'),
      text: l(
        'Düz ilmekler arasında ip arkadadır. İpi iki şişin ARASINDAN öne getir.',
        'Between knit stitches the yarn is at the back. Bring it to the front BETWEEN the needles.',
        'Entre puntos del derecho la hebra está detrás. Pásala hacia delante ENTRE las agujas.',
        'Entre pontos de meia o fio fica atrás. Traga-o para a frente ENTRE as agulhas.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="rest" yarn="front" arrows={<Arrow d="M300 236 C292 200 280 170 264 150" n={1} start={[306, 250]} />} />,
    },
    {
      title: l('Sonraki ilmeği ör', 'Knit the next stitch', 'Teje el siguiente', 'Tricote o próximo'),
      text: l(
        'İp önde dururken sonraki ilmeği düz ör. İp, sağ şişin ÜSTÜNDEN arkaya aşar ve şişte fazladan bir halka (mavi) oluşur.',
        'With the yarn in front, knit the next stitch. The yarn travels OVER the right needle to the back and leaves an extra loop (blue) on the needle.',
        'Con la hebra delante, teje el siguiente punto. La hebra pasa POR ENCIMA de la aguja derecha hacia atrás y deja un lazo extra (azul).',
        'Com o fio na frente, tricote o próximo ponto. O fio passa POR CIMA da agulha direita para trás e deixa uma alça extra (azul).',
      ),
      scene: () => <KnitScene left={3} right={3} rn="rest" newLoop="yo" arrows={<Arrow d="M262 146 C276 168 288 196 296 230" n={2} start={[252, 132]} />} />,
    },
    {
      title: l('Sıra dönüşünde ör', 'Work it on the way back', 'Téjela a la vuelta', 'Tricote na volta'),
      text: l(
        'Arka yüz sırasında ip atmaya gelince onu normal bir ilmek gibi tersle. Ön yüze döndüğünde yerinde yuvarlak bir delik görürsün.',
        'On the wrong-side row, purl the yarn over like any stitch. Turn back to the right side and a round hole sits where it was.',
        'En la vuelta del revés, teje la lazada del revés como un punto. Al volver al derecho verás un agujero redondo.',
        'Na carreira do avesso, trabalhe a laçada em tricô como um ponto. Ao voltar ao direito verá um furo redondo.',
      ),
      scene: () => <SwatchScene rows={eyelets} cell={26} rowH={22} highlightRow={2} />,
    },
    {
      title: l('İp at ve eksilt', 'Yarn over, then decrease', 'Lazada y disminución', 'Laçada e diminuição'),
      text: l(
        'İp atma bir ilmek ekler; yanındaki 2 birlikte bir ilmek eksiltir. İkisi birlikte ilmek sayısını korur. Deliklerin dizildiği yer deseni çizer.',
        'The yarn over adds a stitch; the k2tog beside it takes one away. Together they keep the count. Where the holes line up draws the pattern.',
        'La lazada suma un punto y el 2 juntos a su lado lo resta: el número se mantiene. Donde se alinean los agujeros se dibuja el motivo.',
        'A laçada soma um ponto e o 2 juntos ao lado tira um: a contagem se mantém. Onde os furos se alinham surge o desenho.',
      ),
      scene: () => <SwatchScene rows={eyelets} cell={26} rowH={22} highlightCol={2} />,
    },
    {
      title: l('Ajur yaprak', 'A lace leaf', 'Una hoja calada', 'Uma folha rendada'),
      text: l(
        'İp atmaları her ön yüz sırasında bir ilmek kaydırırsan delikler çapraz çizgiler oluşturur. Eksiltmenin yönü (sağa ya da sola) çizgiye eşlik eder.',
        'Shift the yarn overs by one stitch on each right-side row and the holes form diagonal lines. The direction of each decrease follows the line.',
        'Si desplazas las lazadas un punto en cada vuelta del derecho, los agujeros forman diagonales. La inclinación de la disminución acompaña la línea.',
        'Desloque as laçadas um ponto a cada carreira do direito e os furos formam diagonais. A inclinação da diminuição acompanha a linha.',
      ),
      scene: () => <SwatchScene rows={lace} cell={26} rowH={22} />,
    },
  ],
  practice: {
    text: l('20 ilmekle jarse ör. Her 4. sırada *2 düz, ip at, 2 birlikte* tekrarla. 12 sıra ör.', 'Knit stockinette on 20 stitches. Every 4th row work *k2, yo, k2tog* across. Knit 12 rows.', 'Teje jersey con 20 puntos. Cada 4 vueltas haz *2 d, lazada, 2 juntos*. Teje 12 vueltas.', 'Tricote jersey com 20 pontos. A cada 4 carreiras faça *2 m, laçada, 2 juntos*. Faça 12 carreiras.'),
    target: 12,
    unit: 'row',
  },
  quiz: [
    {
      q: l('Bir ip atma ve bir 2 birlikte yapınca ilmek sayısı ne olur?', 'After one yarn over and one k2tog, what happens to the count?', 'Tras una lazada y un 2 juntos, ¿qué pasa con los puntos?', 'Depois de uma laçada e um 2 juntos, o que acontece com os pontos?'),
      options: [l('Aynı kalır', 'It stays the same', 'Se mantiene', 'Fica igual'), l('1 artar', 'It goes up by 1', 'Aumenta 1', 'Aumenta 1'), l('1 azalır', 'It goes down by 1', 'Baja 1', 'Diminui 1')],
      answer: 0,
    },
  ],
  summary: [
    l('İp atma = yeni ilmek + delik.', 'Yarn over = a new stitch + a hole.', 'Lazada = punto nuevo + agujero.', 'Laçada = ponto novo + furo.'),
    l('Ajurda her ip atmanın bir eksiltme eşi vardır.', 'In lace every yarn over has a decrease partner.', 'En el calado cada lazada tiene su disminución.', 'Na renda cada laçada tem sua diminuição.'),
  ],
};

export default lesson;
