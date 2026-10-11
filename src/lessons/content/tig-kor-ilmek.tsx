import { CrochetScene, crochetArrows } from '@/engine/illust/crochet';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-kor-ilmek',
  intro: l(
    '{Slst} en kısa ilmektir; neredeyse yükseklik eklemez. Turları birleştirmek ve işi görünmeden ilerletmek için kullanılır.',
    'The {slst} is the shortest stitch and adds almost no height. Use it to join rounds and to move along without adding bulk.',
    'El {slst} es el punto más bajo y casi no añade altura. Sirve para cerrar vueltas y desplazarse.',
    'O {slst} é o ponto mais baixo e quase não acrescenta altura. Serve para fechar voltas e se deslocar.',
  ),
  steps: [
    {
      title: l('1 · Bat', '1 · Insert', '1 · Entra', '1 · Entre'),
      text: l('Tığı ilmeğin iki halkasının altından sok.', 'Insert the hook under both loops of the stitch.', 'Mete el ganchillo bajo las dos hebras del punto.', 'Insira a agulha sob as duas alças do ponto.'),
      scene: () => <CrochetScene hook="inserted" hookFrom="up" loops={1} target arrows={crochetArrows.insert(1)} />,
      loopsOnHook: 1,
    },
    {
      title: l('2 · İp at', '2 · Yarn over', '2 · Lazada', '2 · Laçada'),
      text: l('İpi tığa sar.', 'Wrap the yarn over the hook.', 'Echa la hebra sobre el ganchillo.', 'Passe o fio sobre a agulha.'),
      scene: () => <CrochetScene hook="inserted" loops={1} yo yoDraw={[0.1, 0.6]} arrows={crochetArrows.yo(2)} />,
    },
    {
      title: l('3 · Hepsinden birden çek', '3 · Pull through everything', '3 · Saca por todo', '3 · Puxe por tudo'),
      text: l('İpi tek hareketle hem ilmeğin içinden hem de tığdaki ilmekten çek. Tığda 1 ilmek kalır.', 'In one motion, pull the yarn through the stitch AND the loop on the hook. 1 loop remains.', 'De una vez, saca la hebra por el punto Y por el lazo de la aguja. Queda 1 lazo.', 'De uma vez, puxe o fio pelo ponto E pela alça da agulha. Fica 1 alça.'),
      scene: () => <CrochetScene hook="pulled" hookFrom="inserted" loops={1} pulledLoop through={{ n: 2, at: [0.45, 0.75] }} arrows={crochetArrows.pullUp(3)} />,
      loopsOnHook: 1,
      tip: l('{Slst} sıkı olur; gevşek çekmeye özen göster.', 'Slip stitches tend to be tight; keep them relaxed.', 'Los {slst} tienden a quedar tensos; hazlos sueltos.', 'Os {slst} tendem a ficar apertados; faça com folga.'),
    },
  ],
  summary: [l('Bat, ip at, hepsinden birden çek.', 'Insert, yarn over, pull through everything.', 'Entra, lazada, saca por todo.', 'Entre, laçada, puxe por tudo.')],
};

export default lesson;
