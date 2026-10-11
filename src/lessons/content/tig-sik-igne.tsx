import { CrochetScene, crochetArrows } from '@/engine/illust/crochet';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

const N = [YARN.second, YARN.main];

const lesson: Lesson = {
  id: 'tig-sik-igne',
  intro: l(
    '{Sc} kısa, sağlam ve neredeyse kare bir ilmektir. Amigurumiden sepete pek çok işin temelidir. Tığda önce 2 ilmek olur, sonra ikisinden birden geçirirsin.',
    'The {sc} is short, sturdy and almost square: the base of amigurumi, baskets and much more. You make 2 loops on the hook, then pull through both.',
    'El {sc} es bajo, firme y casi cuadrado: la base del amigurumi y de mucho más. Haces 2 lazos y cierras ambos.',
    'O {sc} é baixo, firme e quase quadrado: a base do amigurumi e de muito mais. Você faz 2 alças e fecha as duas.',
  ),
  steps: [
    {
      title: l('1 · Bat', '1 · Insert', '1 · Entra', '1 · Entre'),
      text: l('Tığı sonraki ilmeğin iki halkasının altından önden arkaya sok. Temel zincirde tığdan itibaren 2. zincire batılır.', 'Insert the hook front to back under both loops of the next stitch. On a foundation chain, start in the 2nd chain from the hook.', 'Mete el ganchillo de delante atrás bajo las dos hebras del siguiente punto. En la cadeneta base, empieza en la 2.ª desde la aguja.', 'Insira a agulha da frente para trás sob as duas alças do ponto seguinte. Na correntinha de base, comece na 2ª a partir da agulha.'),
      scene: () => <CrochetScene hook="inserted" hookFrom="up" loops={1} target arrows={crochetArrows.insert(1)} />,
      loopsOnHook: 1,
    },
    {
      title: l('2 · İp at', '2 · Yarn over', '2 · Lazada', '2 · Laçada'),
      text: l('İpi tığın arkasından öne doğru sar.', 'Wrap the yarn over the hook from back to front.', 'Echa la hebra de atrás hacia delante.', 'Passe o fio de trás para a frente.'),
      scene: () => <CrochetScene hook="inserted" loops={1} yo yoDraw={[0.1, 0.6]} arrows={crochetArrows.yo(2)} />,
    },
    {
      title: l('3 · Çek', '3 · Pull up', '3 · Saca', '3 · Puxe'),
      text: l('İpi ilmeğin içinden öne çek. Tığda 2 ilmek var.', 'Pull the yarn through the stitch. There are 2 loops on the hook.', 'Saca la hebra por el punto. Hay 2 lazos en la aguja.', 'Puxe o fio pelo ponto. Há 2 alças na agulha.'),
      scene: () => <CrochetScene hook="pulled" hookFrom="inserted" loops={2} pulledLoop loopColors={N} arrows={crochetArrows.pullUp(3)} />,
      loopsOnHook: 2,
    },
    {
      title: l('4 · İp at', '4 · Yarn over', '4 · Lazada', '4 · Laçada'),
      text: l('Yine ipi tığa sar.', 'Yarn over again.', 'Otra lazada.', 'Outra laçada.'),
      scene: () => <CrochetScene hook="pulled" loops={2} pulledLoop loopColors={N} yo yoDraw={[0.1, 0.6]} arrows={crochetArrows.yo(4)} />,
      loopsOnHook: 3,
    },
    {
      title: l('5 · İkisinden geçir', '5 · Through both', '5 · Cierra las dos', '5 · Feche as duas'),
      text: l('İpi tığdaki iki ilmeğin içinden birden çek. Bir {sc} tamam; tığda 1 ilmek kaldı.', 'Pull through both loops on the hook. One {sc} done; 1 loop remains.', 'Saca la hebra por los dos lazos. Un {sc} hecho; queda 1 lazo.', 'Puxe pelas duas alças. Um {sc} pronto; fica 1 alça.'),
      scene: () => <CrochetScene hook="pulled" loops={2} pulledLoop loopColors={N} yo through={{ n: 3, at: [0.2, 0.6] }} arrows={crochetArrows.through(5)} />,
      loopsOnHook: 1,
    },
    {
      title: l('Sıradaki ilmek', 'Next stitch', 'El siguiente', 'O próximo'),
      text: l('Bir sonraki ilmeğe geç ve tekrarla. {Sc} sıraları küçük X’ler gibi görünür.', 'Move to the next stitch and repeat. Rows of {sc} look like little Xs.', 'Pasa al siguiente punto y repite. Las vueltas de {sc} parecen pequeñas X.', 'Passe ao próximo ponto e repita. As carreiras de {sc} parecem pequenos X.'),
      scene: () => <CrochetScene hook="up" loops={1} done={4} target />,
      loopsOnHook: 1,
    },
  ],
  practice: { text: l('15 zincir çek, üstüne bir sıra {sc} ör (14 ilmek).', 'Chain 15 and work one row of {sc} (14 stitches).', 'Haz 15 cadenetas y una vuelta de {sc} (14 puntos).', 'Faça 15 correntinhas e uma carreira de {sc} (14 pontos).'), target: 14, unit: 'stitch' },
  quiz: [
    {
      q: l('{Sc} örerken tığda en fazla kaç ilmek olur?', 'What is the most loops on the hook during a {sc}?', '¿Cuántos lazos hay como máximo en un {sc}?', 'Quantas alças há no máximo num {sc}?'),
      options: [l('2', '2', '2', '2'), l('3', '3', '3', '3'), l('4', '4', '4', '4')],
      answer: 0,
      explain: l('Çektikten sonra 2 ilmek olur, ip atınca ikisinden birden geçirirsin.', 'After pulling up you have 2 loops; yarn over and pull through both.', 'Tras sacar hay 2 lazos; lazada y cierras ambos.', 'Depois de puxar há 2 alças; laçada e feche as duas.'),
    },
  ],
  summary: [
    l('Bat, ip at, çek (2 ilmek), ip at, ikisinden geçir.', 'Insert, yarn over, pull up (2 loops), yarn over, pull through both.', 'Entra, lazada, saca (2 lazos), lazada, cierra ambos.', 'Entre, laçada, puxe (2 alças), laçada, feche as duas.'),
  ],
};

export default lesson;
