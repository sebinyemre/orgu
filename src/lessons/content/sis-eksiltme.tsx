import { KnitScene, knitArrows, rightLoopAt } from '@/engine/illust/knit';
import { Arrow, Target } from '@/engine/illust/parts';
import { SwatchScene, type Cell } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

/** iki yanda yönlü eksiltmelerle daralan parça (üstten alta) */
const narrowing: Cell[][] = [
  ['none', 'none', 'none', 'k', 'k', 'k', 'k', 'k', 'k', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'ssk', 'k', 'k', 'k', 'k', 'k2tog', 'none', 'none', 'none'],
  ['none', 'none', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'none', 'none'],
  ['none', 'none', 'ssk', 'k', 'k', 'k', 'k', 'k', 'k', 'k2tog', 'none', 'none'],
  ['none', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'none'],
  ['none', 'ssk', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k2tog', 'none'],
  ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
];

const lesson: Lesson = {
  id: 'sis-eksiltme',
  intro: l(
    'Eksiltme ilmek sayısını azaltır ve kumaşı daraltır. Her eksiltme bir yöne yatar: 2 birlikte sağa, kaydır-kaydır-ör sola. Bere tepesinde, reglan kolda ya da çorap burnunda ikisini eşli kullanırsın.',
    'Decreases remove stitches and narrow the fabric. Each one leans: k2tog to the right, ssk to the left. Hat crowns, raglans and sock toes pair them up.',
    'Las disminuciones quitan puntos y estrechan el tejido. Cada una se inclina: 2 juntos a la derecha, deslizar-deslizar-tejer a la izquierda. En coronillas, raglanes y puntas de calcetín se usan en pareja.',
    'As diminuições tiram pontos e estreitam o tecido. Cada uma inclina: 2 juntos para a direita, deslizar-deslizar-tricotar para a esquerda. Topos de gorro, raglãs e pontas de meia usam as duas em par.',
  ),
  steps: [
    {
      title: l('2 birlikte · İkisine birden bat', 'k2tog · Into two at once', '2 juntos · Entra en dos', '2 juntos · Entre em dois'),
      text: l(
        'Sağ şişi sol şişteki İKİNCİ ilmekten başlayarak iki ilmeğin içine birden, düz örer gibi sok.',
        'Insert the right needle knitwise into the next TWO stitches at once, going through the second one first.',
        'Mete la aguja derecha como para tejer del derecho en los DOS puntos siguientes a la vez, empezando por el segundo.',
        'Insira a agulha direita como para tricotar nos DOIS próximos pontos de uma vez, começando pelo segundo.',
      ),
      scene: () => <KnitScene left={5} right={2} rn="insertK2" rnFrom="rest" target={[0, 1]} arrows={knitArrows.insertK(1)} />,
    },
    {
      title: l('Sar ve çek', 'Wrap and pull through', 'Rodea y saca', 'Enrole e puxe'),
      text: l('İpi sar ve tek bir yeni ilmeği iki ilmeğin içinden birden çek.', 'Wrap the yarn and pull one new loop through both stitches.', 'Rodea con la hebra y saca un solo lazo por los dos puntos.', 'Enrole o fio e puxe uma única alça pelos dois pontos.'),
      scene: () => <KnitScene left={5} right={2} rn="insertK2" wrap="k" wrapDraw={[0.1, 0.65]} target={[0, 1]} arrows={knitArrows.wrapK(2)} />,
    },
    {
      title: l('İkisini birden düşür', 'Drop both', 'Suelta los dos', 'Solte os dois'),
      text: l('İki eski ilmeği sol şişten birlikte düşür. İki ilmek bir oldu; yeni ilmek sağa yatar.', 'Let both old stitches slip off together. Two became one, leaning right.', 'Deja caer los dos puntos viejos juntos. Dos se volvieron uno, inclinado a la derecha.', 'Deixe os dois pontos antigos caírem juntos. Dois viraram um, inclinado para a direita.'),
      scene: () => <KnitScene left={5} right={2} rn="rest" newLoop="k" dropN={2} dropping={[0.2, 0.6]} arrows={knitArrows.drop(3)} />,
    },
    {
      title: l('Kaydır-kaydır · Tek tek al', 'ssk · Slip, slip', 'Deslizar, deslizar', 'Deslizar, deslizar'),
      text: l(
        'Sola yatan eksiltme için ilk ilmeğe düz örer gibi bat ama örmeden sağ şişe al. İkinci ilmeği de aynı şekilde al. İkisi de sağ şişte burulmuş durur.',
        'For a left-leaning decrease, insert knitwise into the first stitch and slip it to the right needle without knitting. Slip the second the same way. Both now sit turned on the right needle.',
        'Para inclinar a la izquierda, entra en el primer punto como para tejer y pásalo sin tejer. Haz lo mismo con el segundo. Ambos quedan girados en la aguja derecha.',
        'Para inclinar à esquerda, entre no primeiro ponto como para tricotar e passe-o sem tricotar. Faça o mesmo com o segundo. Os dois ficam girados na agulha direita.',
      ),
      scene: () => <KnitScene left={5} right={2} rn="insertK" rnFrom="rest" target arrows={knitArrows.insertK(1)} />,
    },
    {
      title: l('Kaydır-kaydır · Birlikte ör', 'ssk · Knit them together', 'Tejer juntos', 'Tricotar juntos'),
      text: l(
        'Sol şişin ucunu, kaydırdığın iki ilmeğin ÖNÜNDEN soldan sağa sok ve ikisini birlikte düz ör. Eksiltme sola yatar.',
        'Insert the left needle into the FRONT of the two slipped stitches, left to right, and knit them together. The decrease leans left.',
        'Mete la aguja izquierda por DELANTE de los dos puntos deslizados, de izquierda a derecha, y téjelos juntos. Se inclina a la izquierda.',
        'Insira a agulha esquerda pela FRENTE dos dois pontos deslizados, da esquerda para a direita, e tricote-os juntos. Inclina para a esquerda.',
      ),
      scene: () => (
        <KnitScene
          left={3}
          right={4}
          rn="rest"
          extra={
            <g>
              <Target c={rightLoopAt('rest', 0)} r={22} />
              <Target c={rightLoopAt('rest', 1)} r={22} />
            </g>
          }
          arrows={<Arrow d="M236 196 C258 214 300 206 322 176" n={2} start={[222, 200]} />}
        />
      ),
    },
    {
      title: l('Eşli kullan', 'Use them in pairs', 'Úsalas en pareja', 'Use em pares'),
      text: l(
        'Sıranın başında kaydır-kaydır-ör, sonunda 2 birlikte yaparsan eksiltmeler kenara paralel, temiz çizgiler oluşturur.',
        'An ssk at the start of the row and a k2tog at the end make clean lines that follow the edges.',
        'Deslizar-deslizar-tejer al inicio y 2 juntos al final forman líneas limpias que siguen los bordes.',
        'Deslizar-deslizar-tricotar no início e 2 juntos no fim formam linhas limpas que acompanham as bordas.',
      ),
      scene: () => <SwatchScene rows={narrowing} cell={26} rowH={22} />,
    },
    {
      title: l('Çift eksiltme', 'Double decrease', 'Disminución doble', 'Diminuição dupla'),
      text: l(
        'Üç ilmeği bire indirmek için: ilk iki ilmeğe birlikte düz örer gibi bat ve kaydır, üçüncüyü ör, kaydırdığın iki ilmeği ördüğünün üstünden aşır. Ortadaki ilmek dik durur.',
        'To turn three stitches into one: slip two together knitwise, knit one, pass the two slipped stitches over. The center stitch stands straight.',
        'Para pasar de tres puntos a uno: desliza dos juntos como para tejer, teje uno y pasa los dos deslizados por encima. El punto central queda recto.',
        'Para passar de três pontos a um: deslize dois juntos como para tricotar, tricote um e passe os dois deslizados por cima. O ponto central fica reto.',
      ),
      scene: () => <KnitScene left={5} right={2} rn="insertK2" rnFrom="rest" target={[0, 1]} arrows={knitArrows.insertK(1)} />,
      tip: l('Tariflerde "cdd" ya da "s2kp" diye geçer.', 'Patterns call it "cdd" or "s2kp".', 'En patrones aparece como "cdd" o "s2kp".', 'Nas receitas aparece como "cdd" ou "s2kp".'),
    },
  ],
  practice: {
    text: l('20 ilmekle başla. Her ön yüz sırasında başta kaydır-kaydır-ör, sonda 2 birlikte yap; 10 ilmeğe in.', 'Start with 20 stitches. On every right-side row work ssk at the start and k2tog at the end until 10 remain.', 'Empieza con 20 puntos. En cada vuelta del derecho haz ssk al inicio y 2 juntos al final hasta quedar 10.', 'Comece com 20 pontos. Em cada carreira do direito faça ssk no início e 2 juntos no fim até sobrarem 10.'),
    target: 10,
    unit: 'stitch',
  },
  quiz: [
    {
      q: l('2 birlikte hangi yöne yatar?', 'Which way does k2tog lean?', '¿Hacia dónde se inclina 2 juntos?', 'Para onde inclina o 2 juntos?'),
      options: [l('Sağa', 'Right', 'Derecha', 'Direita'), l('Sola', 'Left', 'Izquierda', 'Esquerda'), l('Dik durur', 'Straight up', 'Recto', 'Reto')],
      answer: 0,
    },
    {
      q: l('Çift eksiltme kaç ilmek azaltır?', 'How many stitches does a double decrease remove?', '¿Cuántos puntos quita una disminución doble?', 'Quantos pontos tira uma diminuição dupla?'),
      options: [l('1', '1', '1', '1'), l('2', '2', '2', '2'), l('3', '3', '3', '3')],
      answer: 1,
      explain: l('Üç ilmek bir olur: iki eksilir.', 'Three become one: two are removed.', 'Tres se vuelven uno: se quitan dos.', 'Três viram um: tiram-se dois.'),
    },
  ],
  summary: [
    l('2 birlikte sağa, kaydır-kaydır-ör sola yatar.', 'k2tog leans right, ssk leans left.', '2 juntos a la derecha, ssk a la izquierda.', '2 juntos para a direita, ssk para a esquerda.'),
    l('Çift eksiltme: 3 ilmek 1 olur, ortası dik.', 'Double decrease: 3 become 1, centered.', 'Doble: 3 se vuelven 1, centrado.', 'Dupla: 3 viram 1, centralizada.'),
  ],
};

export default lesson;
