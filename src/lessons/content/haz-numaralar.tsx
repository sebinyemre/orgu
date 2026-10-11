import { NeedleGaugeScene, YarnWeightsScene } from '@/engine/illust/info';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'haz-numaralar',
  intro: l(
    'Şiş ve tığ numaraları ile ip kalınlıkları birbirine bağlıdır: ince ip ince şişle, kalın ip kalın şişle örülür.',
    'Needle sizes and yarn weights go together: fine yarn with thin needles, thick yarn with fat needles.',
    'Agujas y grosores van juntos: hilo fino con agujas finas, hilo grueso con agujas gruesas.',
    'Agulhas e espessuras andam juntas: fio fino com agulha fina, fio grosso com agulha grossa.',
  ),
  steps: [
    {
      title: l('Numara milimetredir', 'The size is millimeters', 'El número son milímetros', 'O número é em milímetros'),
      text: l(
        'Şişin ya da tığın numarası gövdesinin kalınlığıdır. 5 numara şiş 5 mm kalınlığındadır. Ölçü kartının deliklerinden geçirerek numarasını bulabilirsin.',
        'The size is the shaft diameter: a 5 mm needle is 5 mm thick. Push it through a needle gauge to find an unmarked size.',
        'El número es el grosor: una aguja de 5 mm mide 5 mm. Pásala por un medidor para saber su número.',
        'O número é a espessura: uma agulha de 5 mm tem 5 mm. Passe pelo medidor para descobrir o número.',
      ),
      scene: () => <NeedleGaugeScene highlight={5} />,
      dur: 3,
      tip: l('ABD numaraları farklıdır: 5 mm = US 8. Uygulamadaki hesaplayıcıda hepsi yan yana.', 'US sizes differ: 5 mm = US 8. The converter in the app lists them side by side.', 'Las tallas de EE. UU. son otras: 5 mm = US 8. El conversor de la app las muestra juntas.', 'Os números dos EUA são outros: 5 mm = US 8. O conversor do app mostra tudo junto.'),
    },
    {
      title: l('İp kalınlıkları', 'Yarn weights', 'Grosores de hilo', 'Espessuras de fio'),
      text: l(
        '0’dan 7’ye sekiz kalınlık vardır. Rafta en sık 3 (hafif) ve 4 (orta) kalınlığı görürsün.',
        'There are eight weights from 0 to 7. On the shelf you will mostly see 3 (light) and 4 (medium).',
        'Hay ocho grosores, del 0 al 7. En la tienda verás sobre todo el 3 (ligero) y el 4 (medio).',
        'São oito espessuras, de 0 a 7. Na loja você verá sobretudo a 3 (leve) e a 4 (média).',
      ),
      scene: () => <YarnWeightsScene />,
      dur: 3,
    },
    {
      title: l('Orta kalınlık + 5 mm', 'Medium + 5 mm', 'Medio + 5 mm', 'Médio + 5 mm'),
      text: l(
        'Orta kalınlıkta (4) bir ip genellikle 4,5–5,5 mm şişle ve 5–6 mm tığla örülür. Başlamak için en rahat ikili budur.',
        'A medium (4) yarn is usually knit with 4.5–5.5 mm needles and crocheted with a 5–6 mm hook. The easiest pair to start with.',
        'Un hilo medio (4) se teje con agujas de 4,5–5,5 mm y ganchillo de 5–6 mm. La pareja más cómoda para empezar.',
        'Um fio médio (4) se tricota com agulhas de 4,5–5,5 mm e se faz crochê com 5–6 mm. O par mais fácil para começar.',
      ),
      scene: () => <YarnWeightsScene highlight={4} />,
      dur: 3,
    },
    {
      title: l('Sıkı mı gevşek mi?', 'Tight or loose?', '¿Apretado o flojo?', 'Apertado ou frouxo?'),
      text: l(
        'Kumaşın sert ve sık oluyorsa bir numara büyük, gevşek ve delikli oluyorsa bir numara küçük şiş dene.',
        'If your fabric is stiff and dense, go up a size; if it is loose and holey, go down a size.',
        'Si el tejido queda duro y denso, sube un número; si queda flojo y con agujeros, baja uno.',
        'Se o tecido fica duro e denso, aumente um número; se fica frouxo e com furos, diminua um.',
      ),
      scene: () => <NeedleGaugeScene highlight={6} />,
      dur: 3,
    },
  ],
  quiz: [
    {
      q: l('Kalın (5) bir ip için hangi şiş daha uygun?', 'Which needles suit a bulky (5) yarn?', '¿Qué agujas van con un hilo grueso (5)?', 'Que agulhas combinam com um fio grosso (5)?'),
      options: [l('2,5 mm', '2.5 mm', '2,5 mm', '2,5 mm'), l('7 mm', '7 mm', '7 mm', '7 mm'), l('15 mm', '15 mm', '15 mm', '15 mm')],
      answer: 1,
    },
  ],
  summary: [
    l('Numara = gövde kalınlığı (mm).', 'Size = shaft diameter (mm).', 'Número = grosor (mm).', 'Número = espessura (mm).'),
    l('Orta kalınlık ip, 5 mm civarı şiş.', 'Medium yarn, needles around 5 mm.', 'Hilo medio, agujas de unos 5 mm.', 'Fio médio, agulhas de uns 5 mm.'),
  ],
};

export default lesson;
