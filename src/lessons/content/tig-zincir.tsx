import { CrochetScene, crochetArrows } from '@/engine/illust/crochet';
import { SlipKnotScene } from '@/engine/illust/scenes';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-zincir',
  intro: l(
    '{Ch}, tığ işinin temelidir: ip at ve tığdaki ilmeğin içinden çek. Hepsi bu. Her iş bir {ch} dizisiyle başlar.',
    'The {ch} is the foundation of crochet: yarn over and pull through the loop on the hook. That is all. Almost every project starts with a row of chains.',
    'La {ch} es la base del ganchillo: lazada y sacar por el lazo de la aguja. Eso es todo. Casi todo empieza con cadenetas.',
    'A {ch} é a base do crochê: laçada e puxar pela alça da agulha. Só isso. Quase tudo começa com correntinhas.',
  ),
  needs: [
    { kind: 'hook', text: l('Tığ', 'Hook', 'Ganchillo', 'Agulha de crochê') },
    { kind: 'yarn', text: l('İp', 'Yarn', 'Hilo', 'Fio') },
  ],
  steps: [
    {
      title: l('Kaygan düğüm', 'Slip knot', 'Nudo corredizo', 'Nó corrediço'),
      text: l('Tığa bir kaygan düğüm tak. Bu ilmek sayılmaz.', 'Put a slip knot on the hook. It does not count as a stitch.', 'Pon un nudo corredizo en el ganchillo. No cuenta como punto.', 'Coloque um nó corrediço na agulha. Ele não conta como ponto.'),
      scene: () => <SlipKnotScene phase="onHook" tool="hook" />,
    },
    {
      title: l('1 · İp at', '1 · Yarn over', '1 · Lazada', '1 · Laçada'),
      text: l('İpi tığın arkasından üstüne, sonra önüne doğru sar. İp tığın boğazına oturur.', 'Wrap the yarn over the hook from back to front. It settles in the throat of the hook.', 'Pasa la hebra sobre el ganchillo de atrás hacia delante. Queda en la garganta.', 'Passe o fio sobre a agulha de trás para a frente. Ele fica na garganta.'),
      scene: () => <CrochetScene hook="chain" work="chain" chainCount={3} loops={1} yo yoDraw={[0.1, 0.65]} arrows={crochetArrows.yo(1)} />,
      loopsOnHook: 2,
    },
    {
      title: l('2 · İçinden çek', '2 · Pull through', '2 · Saca', '2 · Puxe'),
      text: l('Boğazdaki ipi tığdaki ilmeğin içinden çek. Bir {ch} yaptın; tığda yine 1 ilmek var.', 'Draw the yarn through the loop on the hook. One {ch} made; there is 1 loop on the hook again.', 'Saca la hebra por el lazo de la aguja. Una {ch} hecha; vuelve a haber 1 lazo.', 'Puxe o fio pela alça da agulha. Uma {ch} feita; há 1 alça de novo.'),
      scene: () => <CrochetScene hook="chain" work="chain" chainCount={3} loops={1} yo through={{ n: 2, at: [0.2, 0.6] }} arrows={crochetArrows.through(2)} />,
      loopsOnHook: 1,
    },
    {
      title: l('Tekrarla', 'Repeat', 'Repite', 'Repita'),
      text: l('İp at, çek; ip at, çek. Zincirler eşit büyüklükte olsun diye her seferinde aynı hızda çek.', 'Yarn over, pull through; yarn over, pull through. Pull at the same pace so every chain is the same size.', 'Lazada, saca; lazada, saca. Tira siempre igual para que las cadenetas sean iguales.', 'Laçada, puxe; laçada, puxe. Puxe sempre igual para as correntinhas ficarem iguais.'),
      scene: () => <CrochetScene hook="chain" work="chain" chainCount={7} loops={1} />,
      loopsOnHook: 1,
      tip: l('Zinciri tığın hemen altından başparmak ve orta parmağınla tut; her birkaç zincirde tutuşunu yukarı kaydır.', 'Pinch the chain just below the hook with your thumb and middle finger, moving up every few chains.', 'Sujeta la cadeneta justo bajo el ganchillo con pulgar y medio; sube cada pocas cadenetas.', 'Segure a correntinha logo abaixo da agulha com polegar e dedo médio; suba a cada poucas.'),
    },
    {
      title: l('Zincir saymak', 'Counting chains', 'Contar cadenetas', 'Contar correntinhas'),
      text: l('Her zincir küçük bir V’dir. Tığdan başlayarak say; tığdaki ilmeği ve kaygan düğümü sayma.', 'Each chain is a little V. Count from the hook outwards; do not count the loop on the hook or the slip knot.', 'Cada cadeneta es una pequeña V. Cuenta desde la aguja; no cuentes el lazo de la aguja ni el nudo.', 'Cada correntinha é um pequeno V. Conte a partir da agulha; não conte a alça da agulha nem o nó.'),
      scene: () => <CrochetScene hook="chain" work="chain" chainCount={6} loops={1} numberChains />,
      dur: 3,
    },
  ],
  practice: { text: l('20 zincir çek ve say.', 'Make 20 chains and count them.', 'Haz 20 cadenetas y cuéntalas.', 'Faça 20 correntinhas e conte.'), target: 20, unit: 'chain' },
  quiz: [
    {
      q: l('Tığdaki ilmek zincir sayısına dahil mi?', 'Does the loop on the hook count as a chain?', '¿El lazo de la aguja cuenta como cadeneta?', 'A alça na agulha conta como correntinha?'),
      options: [l('Hayır', 'No', 'No', 'Não'), l('Evet', 'Yes', 'Sí', 'Sim')],
      answer: 0,
    },
  ],
  summary: [
    l('İp at, tığdaki ilmekten çek.', 'Yarn over, pull through the loop on the hook.', 'Lazada, saca por el lazo.', 'Laçada, puxe pela alça.'),
    l('Tığdaki ilmek sayılmaz.', 'The loop on the hook is not counted.', 'El lazo de la aguja no cuenta.', 'A alça na agulha não conta.'),
  ],
};

export default lesson;
