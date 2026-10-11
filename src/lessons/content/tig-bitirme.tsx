import { CrochetScene } from '@/engine/illust/crochet';
import { Arrow } from '@/engine/illust/parts';
import { WeaveScene } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-bitirme',
  intro: l(
    'İş bitince ipi kesip son ilmekten geçirerek düğümlersin; sonra ucu yün iğnesiyle gizlersin.',
    'To finish, cut the yarn and pull it through the last loop to fasten off, then hide the end with a tapestry needle.',
    'Para terminar, corta la hebra y pásala por el último lazo; luego escóndela con aguja lanera.',
    'Para terminar, corte o fio e passe pela última alça; depois esconda a ponta com agulha de tapeçaria.',
  ),
  needs: [
    { kind: 'scissors', text: l('Makas', 'Scissors', 'Tijeras', 'Tesoura') },
    { kind: 'tapestry', text: l('Yün iğnesi', 'Tapestry needle', 'Aguja lanera', 'Agulha de tapeçaria') },
  ],
  steps: [
    {
      title: l('İpi kes', 'Cut the yarn', 'Corta la hebra', 'Corte o fio'),
      text: l('Son ilmeği bitirince ipi 15 cm bırakarak kes.', 'After the last stitch, cut the yarn leaving a 15 cm tail.', 'Tras el último punto, corta dejando 15 cm.', 'Depois do último ponto, corte deixando 15 cm.'),
      scene: () => <CrochetScene hook="up" loops={1} done={5} />,
      loopsOnHook: 1,
    },
    {
      title: l('Ucu ilmekten çek', 'Pull the tail through', 'Saca la cola', 'Puxe a ponta'),
      text: l('İp at ve ucu tığdaki ilmeğin içinden sonuna kadar çek. Düğüm sıkılaşır.', 'Yarn over and pull the whole tail through the loop on the hook. The knot tightens.', 'Lazada y saca toda la cola por el lazo. El nudo se cierra.', 'Laçada e puxe a ponta inteira pela alça. O nó se fecha.'),
      scene: () => <CrochetScene hook="pulled" loops={1} yo through={{ n: 2, at: [0.25, 0.6] }} arrows={<Arrow d="M150 120 C150 80 170 50 200 30" n={1} start={[140, 134]} />} />,
    },
    {
      title: l('Ucu gizle', 'Weave in the end', 'Esconde la hebra', 'Esconda a ponta'),
      text: l('Ucu yün iğnesine geçirip ilmeklerin içinden birkaç cm bir yöne, sonra geri geçir ve kes.', 'Thread the end and weave it through the stitches for a few cm one way, then back, and trim.', 'Enhebra la cola, pásala unos cm en un sentido y luego de vuelta, y corta.', 'Passe a ponta na agulha, entre nos pontos alguns cm num sentido e depois no outro, e corte.'),
      scene: () => <WeaveScene phase="weave" />,
    },
  ],
  summary: [l('Kes, ilmekten geçir, gizle.', 'Cut, pull through, weave in.', 'Corta, saca, esconde.', 'Corte, puxe, esconda.')],
};

export default lesson;
