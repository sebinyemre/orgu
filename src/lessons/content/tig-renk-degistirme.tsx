import { CrochetScene, crochetArrows } from '@/engine/illust/crochet';
import { Yarn } from '@/engine/illust/parts';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

const NEW = '#b5523b';
const OLD = YARN.main;

/** eski rengin kesilmiş ucu, işin arkasında */
const oldTail = <Yarn d="M118 150 C100 200 90 250 70 300" color={OLD} w={9} />;

const lesson: Lesson = {
  id: 'tig-renk-degistirme',
  intro: l(
    'Yeni renge geçmenin temiz yolu, son ilmeğin son çekişini yeni renkle yapmaktır. Böylece sıradaki ilmeğin tepesi de yeni renkte olur ve iki renk arasında kayma görünmez.',
    'The clean way to change color is to make the final pull-through of the last stitch with the new color. The top of the next stitch is then already in the new color, with no jog between the two.',
    'La forma limpia de cambiar de color es hacer el último cierre del último punto con el color nuevo. Así la parte superior ya sale del color nuevo, sin saltos.',
    'O jeito limpo de trocar de cor é fazer o último fechamento do último ponto com a cor nova. Assim o topo já sai na cor nova, sem degrau.',
  ),
  steps: [
    {
      title: l('Son ilmeği bitirme', 'Don’t finish the last stitch', 'No cierres el último punto', 'Não feche o último ponto'),
      text: l('Eski renkle son ilmeği son adıma kadar ör: {sc} için tığda 2 ilmek kalsın.', 'Work the last stitch in the old color up to its final step: for a {sc}, stop with 2 loops on the hook.', 'Teje el último punto con el color viejo hasta el paso final: para un {sc}, deja 2 lazos.', 'Faça o último ponto com a cor antiga até o passo final: para um {sc}, pare com 2 alças.'),
      scene: () => <CrochetScene hook="pulled" loops={2} pulledLoop loopColors={[OLD, OLD]} yarnColor={OLD} />,
      loopsOnHook: 2,
    },
    {
      title: l('Yeni renkle ip at', 'Yarn over with the new color', 'Lazada con el color nuevo', 'Laçada com a cor nova'),
      text: l(
        'Yeni rengin ucunu 10 cm bırakıp tığa at. Eski rengi arkada bırak.',
        'Leave a 10 cm (4 in) tail of the new color and yarn over with it. Let the old color hang at the back.',
        'Deja 10 cm de cola del color nuevo y haz la lazada con él. El viejo queda detrás.',
        'Deixe 10 cm de ponta da cor nova e faça a laçada com ela. A antiga fica atrás.',
      ),
      scene: () => <CrochetScene hook="pulled" loops={2} pulledLoop loopColors={[OLD, OLD]} yarnColor={NEW} yo yoDraw={[0.1, 0.6]} extra={oldTail} arrows={crochetArrows.yo(1)} />,
      loopsOnHook: 3,
    },
    {
      title: l('Yeni renkle bitir', 'Finish with the new color', 'Cierra con el color nuevo', 'Feche com a cor nova'),
      text: l('Yeni rengi iki ilmekten birden geçir. Tığdaki ilmek artık yeni renkte.', 'Pull the new color through both loops. The loop on your hook is now the new color.', 'Pasa el color nuevo por los dos lazos. El lazo en la aguja ya es del color nuevo.', 'Passe a cor nova pelas duas alças. A alça na agulha já é da cor nova.'),
      scene: () => <CrochetScene hook="pulled" loops={2} pulledLoop loopColors={[OLD, OLD]} yarnColor={NEW} yo through={{ n: 3, at: [0.2, 0.6] }} extra={oldTail} arrows={crochetArrows.through(2)} />,
      loopsOnHook: 1,
    },
    {
      title: l('Uçları ör ya da gizle', 'Work over or weave in the ends', 'Teje sobre las colas', 'Trabalhe sobre as pontas'),
      text: l(
        'Eski rengin ve yeni rengin uçlarını sonraki birkaç ilmeğin içine alarak örebilir (uçları üstünden örmek) ya da sonra yün iğnesiyle gizleyebilirsin. Şeritli işlerde kullanmadığın rengi kesmeden kenardan yukarı taşıyabilirsin.',
        'Crochet over both tails for the next few stitches, or weave them in later with a tapestry needle. For stripes you can carry the unused color up the side instead of cutting it.',
        'Teje sobre ambas colas unos puntos o escóndelas luego con la aguja lanera. En rayas puedes subir el color sin cortarlo por el borde.',
        'Trabalhe sobre as duas pontas por alguns pontos ou esconda depois com a agulha de tapeçaria. Em listras dá para subir a cor pela lateral sem cortar.',
      ),
      scene: () => <CrochetScene hook="up" loops={1} loopColors={[NEW]} yarnColor={NEW} done={4} extra={oldTail} />,
    },
  ],
  quiz: [
    {
      q: l('Yeni renge ne zaman geçilir?', 'When do you switch to the new color?', '¿Cuándo pasas al color nuevo?', 'Quando passar para a cor nova?'),
      options: [l('Önceki ilmeğin son çekişinde', 'On the last pull-through of the previous stitch', 'En el último cierre del punto anterior', 'No último fechamento do ponto anterior'), l('Yeni ilmeğe başlarken', 'When starting the new stitch', 'Al empezar el punto nuevo', 'Ao começar o ponto novo'), l('Sıra bitince', 'At the end of the row', 'Al acabar la vuelta', 'No fim da carreira')],
      answer: 0,
    },
  ],
  summary: [l('Son çekişi yeni renkle yap; uçları ör ya da gizle.', 'Do the last pull-through in the new color; work over or weave in the ends.', 'Último cierre con el color nuevo; teje sobre las colas o escóndelas.', 'Último fechamento com a cor nova; trabalhe sobre as pontas ou esconda.')],
};

export default lesson;
