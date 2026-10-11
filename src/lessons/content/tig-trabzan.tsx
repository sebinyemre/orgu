import { CrochetScene } from '@/engine/illust/crochet';
import { tallSteps } from '../tall';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-trabzan',
  intro: l(
    '{Dc} bir kez ip atılarak yapılan uzun ilmektir. Sırrı: sonda ilmeklerden ikişer ikişer geçirmek. Bu derste tığdaki ilmek sayısını adım adım izleyeceksin.',
    'The {dc} is a tall stitch with one yarn over. The secret: pull through two loops at a time. You will follow the number of loops on the hook at every step.',
    'El {dc} es un punto alto con una lazada. El secreto: cerrar los lazos de dos en dos. Seguirás el número de lazos en cada paso.',
    'O {dc} é um ponto alto com uma laçada. O segredo: fechar as alças de duas em duas. Você vai acompanhar o número de alças em cada passo.',
  ),
  steps: [
    ...tallSteps(1, false, 'dc'),
    {
      title: l('Sıra hâlinde', 'In a row', 'En vuelta', 'Em carreira'),
      text: l('{Dc} sıraları hızlı yükselir. 3 dönüş zinciri ilk ilmek sayılır.', 'Rows of {dc} grow fast. The 3 turning chains count as the first stitch.', 'Las vueltas de {dc} crecen rápido. Las 3 cadenetas cuentan como primer punto.', 'As carreiras de {dc} crescem rápido. As 3 correntinhas contam como primeiro ponto.'),
      scene: () => <CrochetScene hook="up" loops={1} rowKind="dc" done={4} target />,
      loopsOnHook: 1,
    },
  ],
  practice: { text: l('Bir sıra {dc} ör.', 'Work one row of {dc}.', 'Teje una vuelta de {dc}.', 'Faça uma carreira de {dc}.'), target: 14, unit: 'stitch' },
  quiz: [
    {
      q: l('{Dc} örerken çektikten sonra tığda kaç ilmek olur?', 'After pulling up during a {dc}, how many loops are on the hook?', 'Al sacar durante un {dc}, ¿cuántos lazos hay?', 'Depois de puxar num {dc}, quantas alças há?'),
      options: [l('2', '2', '2', '2'), l('3', '3', '3', '3'), l('4', '4', '4', '4')],
      answer: 1,
    },
  ],
  summary: [l('İp at, bat, çek (3), ip at 2’den geçir (2), ip at 2’den geçir (1).', 'Yo, insert, pull up (3), yo through 2 (2), yo through 2 (1).', 'Lazada, entra, saca (3), lazada cierra 2 (2), lazada cierra 2 (1).', 'Laçada, entre, puxe (3), laçada feche 2 (2), laçada feche 2 (1).')],
};

export default lesson;
