import { BindOffScene } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-ilmek-kapatma',
  intro: l(
    'İşin bitince ilmekleri şişten çözülmeyecek şekilde almak için kapatırsın. Her seferinde bir ilmeği diğerinin üstünden geçirirsin.',
    'When your piece is done, you bind off so the stitches cannot unravel. You lift one stitch over the next, one at a time.',
    'Al terminar, cierras los puntos para que no se deshagan. Pasas un punto por encima del siguiente, uno a uno.',
    'Ao terminar, você arremata para os pontos não desmancharem. Passa um ponto por cima do seguinte, um de cada vez.',
  ),
  needs: [{ kind: 'scissors', text: l('Makas', 'Scissors', 'Tijeras', 'Tesoura') }],
  steps: [
    {
      title: l('İki ilmek ör', 'Knit two', 'Teje dos', 'Tricote dois'),
      text: l('Sıranın başında iki ilmeği düz ör. Sağ şişte 2 ilmek olur.', 'Knit the first two stitches. There are 2 stitches on the right needle.', 'Teje dos puntos. Hay 2 en la aguja derecha.', 'Tricote dois pontos. Há 2 na agulha direita.'),
      scene: () => <BindOffScene phase="two" />,
      dur: 3,
    },
    {
      title: l('1 · Sol şişle bat', '1 · Insert the left needle', '1 · Entra con la izquierda', '1 · Entre com a esquerda'),
      text: l('Sol şişin ucunu sağ şişteki uzaktaki (ilk örülen) ilmeğe sok.', 'Insert the left needle tip into the farther (first knitted) stitch on the right needle.', 'Mete la punta izquierda en el punto más lejano (el primero tejido) de la aguja derecha.', 'Insira a ponta esquerda no ponto mais distante (o primeiro tricotado) da agulha direita.'),
      scene: () => <BindOffScene phase="insert" />,
    },
    {
      title: l('2 · Üstünden geçir', '2 · Lift it over', '2 · Pásalo por encima', '2 · Passe por cima'),
      text: l('Bu ilmeği yakındaki ilmeğin üstünden aşırıp şişin ucundan düşür. Sağ şişte 1 ilmek kaldı.', 'Lift that stitch over the nearer one and off the needle. One stitch remains.', 'Pásalo por encima del más cercano y fuera de la aguja. Queda 1 punto.', 'Passe-o por cima do mais próximo e para fora da agulha. Fica 1 ponto.'),
      scene: () => <BindOffScene phase="lift" />,
    },
    {
      title: l('3 · Bir ilmek daha ör', '3 · Knit one more', '3 · Teje uno más', '3 · Tricote mais um'),
      text: l('Bir ilmek daha ör ve 1–2. adımları tekrarla. Sol şiş boşalana kadar devam et.', 'Knit one more and repeat steps 1–2 until the left needle is empty.', 'Teje uno más y repite los pasos 1–2 hasta vaciar la aguja izquierda.', 'Tricote mais um e repita os passos 1–2 até esvaziar a agulha esquerda.'),
      scene: () => <BindOffScene phase="one" />,
    },
    {
      title: l('4 · Son ilmek', '4 · The last stitch', '4 · El último punto', '4 · O último ponto'),
      text: l('Tek ilmek kalınca ipi 15 cm bırakıp kes ve ucunu son ilmeğin içinden geçirip çek.', 'With one stitch left, cut the yarn leaving 15 cm and pull the end through the last stitch.', 'Con un punto, corta dejando 15 cm y pasa el cabo por el último punto.', 'Com um ponto, corte deixando 15 cm e passe a ponta pelo último ponto.'),
      scene: () => <BindOffScene phase="last" />,
      tip: l('Kapatma kenarı sıkı olursa bir numara büyük şişle kapat.', 'If your bind-off is tight, use a needle one size larger.', 'Si el cierre queda tenso, usa una aguja un número mayor.', 'Se o arremate ficar apertado, use uma agulha um número maior.'),
    },
  ],
  summary: [
    l('İki ör, ilkini üstünden geçir.', 'Knit two, pass the first over.', 'Teje dos, pasa el primero por encima.', 'Tricote dois, passe o primeiro por cima.'),
    l('Son ilmekte ipi içinden çek.', 'Pull the yarn through the last stitch.', 'Pasa la hebra por el último punto.', 'Passe o fio pelo último ponto.'),
  ],
};

export default lesson;
