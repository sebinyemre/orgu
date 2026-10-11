import { CrochetScene } from '@/engine/illust/crochet';
import { tallSteps } from '../tall';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-yarim-trabzan',
  intro: l(
    '{Hdc}, {sc} ile {dc} arası boyda bir ilmektir: bir kez ip atılır ve sonunda 3 ilmekten birden geçirilir. Yumuşak ve hızlı ilerler.',
    'The {hdc} sits between {sc} and {dc} in height: one yarn over, then pull through all 3 loops at once. Soft and quick.',
    'El {hdc} está entre el {sc} y el {dc}: una lazada y al final se cierran los 3 lazos a la vez. Suave y rápido.',
    'O {hdc} fica entre o {sc} e o {dc}: uma laçada e no fim fecham-se as 3 alças de uma vez. Macio e rápido.',
  ),
  steps: [
    ...tallSteps(1, true, 'hdc'),
    {
      title: l('Sıra hâlinde', 'In a row', 'En vuelta', 'Em carreira'),
      text: l('{Hdc} sıraları {sc}’den biraz daha yüksektir. Dönüş için 2 zincir çekilir.', 'Rows of {hdc} are a little taller than {sc}. Turn with 2 chains.', 'Las vueltas de {hdc} son algo más altas que las de {sc}. Gira con 2 cadenetas.', 'As carreiras de {hdc} são um pouco mais altas que as de {sc}. Suba com 2 correntinhas.'),
      scene: () => <CrochetScene hook="up" loops={1} rowKind="hdc" done={4} target />,
      loopsOnHook: 1,
    },
  ],
  practice: { text: l('Bir sıra {hdc} ör.', 'Work one row of {hdc}.', 'Teje una vuelta de {hdc}.', 'Faça uma carreira de {hdc}.'), target: 14, unit: 'stitch' },
  summary: [l('İp at, bat, çek (3 ilmek), ip at, üçünden birden geçir.', 'Yarn over, insert, pull up (3 loops), yarn over, through all 3.', 'Lazada, entra, saca (3 lazos), lazada, cierra los 3.', 'Laçada, entre, puxe (3 alças), laçada, feche as 3.')],
};

export default lesson;
