import { CrochetScene, crochetArrows } from '@/engine/illust/crochet';
import { Diagram, ROUND_COLORS, chainRowMarks, type Mark, fitView } from '@/engine/illust/diagram';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

const S = YARN.second;
const M = YARN.main;

function puffRow(): Mark[] {
  const c = ROUND_COLORS[4];
  const marks: Mark[] = chainRowMarks(9, 214, 40, 40, 28, 0);
  for (let i = 0; i < 9; i++) {
    const x = 40 + i * 40;
    marks.push(i % 2 === 1 ? { id: 'puff', at: [x, 168], size: 64, color: c, group: 1 } : { id: 'ch', at: [x, 150], size: 26, color: c, group: 1 });
  }
  return marks;
}

const lesson: Lesson = {
  id: 'tig-fistik',
  intro: l(
    'Fıstık (puf) ilmek, aynı ilmekten birkaç kez uzun ilmek çekip hepsini birden kapatarak yapılır. Ortaya yastık gibi kabarık, yumuşak bir tümsek çıkar. Bere, battaniye ve bebek işlerinde çok sevilir.',
    'A puff stitch pulls up several long loops in the same stitch and closes them all at once. The result is a soft, pillowy bump, popular for hats, blankets and baby things.',
    'El punto puff saca varios lazos largos del mismo punto y los cierra todos juntos. Queda un bulto suave y esponjoso, ideal para gorros y mantas.',
    'O ponto puff puxa várias alças longas do mesmo ponto e fecha todas juntas. Fica um volume macio e fofo, ótimo para gorros e mantas.',
  ),
  steps: [
    {
      title: l('1 · İp at, bat, uzun çek', '1 · Yarn over, insert, pull up long', '1 · Lazada, entra, saca largo', '1 · Laçada, entre, puxe longo'),
      text: l('İp at, ilmeğe bat, ip at ve ilmeği {dc} boyunda uzun çek. Tığda 3 ilmek var.', 'Yarn over, insert, yarn over and pull up a loop as tall as a {dc}. 3 loops on the hook.', 'Lazada, entra, lazada y saca un lazo alto como un {dc}. 3 lazos.', 'Laçada, entre, laçada e puxe uma alça alta como um {dc}. 3 alças.'),
      scene: () => <CrochetScene hook="pulled" hookFrom="inserted" loops={3} pulledLoop loopColors={[S, M, M]} arrows={crochetArrows.pullUp(1)} />,
      loopsOnHook: 3,
    },
    {
      title: l('2 · Aynı ilmekte tekrarla', '2 · Repeat in the same stitch', '2 · Repite en el mismo punto', '2 · Repita no mesmo ponto'),
      text: l('Aynı ilmekte iki kez daha "ip at, bat, uzun çek" yap. Tığda 7 ilmek olur; hepsi aynı boyda olsun.', 'Twice more in the same stitch: yarn over, insert, pull up long. Now 7 loops on the hook, all the same height.', 'Dos veces más en el mismo punto. Ahora hay 7 lazos, todos a la misma altura.', 'Mais duas vezes no mesmo ponto. Agora há 7 alças, todas da mesma altura.'),
      scene: () => <CrochetScene hook="pulled" loops={7} pulledLoop loopColors={[S, M, S, M, S, M, M]} arrows={crochetArrows.pullUp(2)} />,
      loopsOnHook: 7,
    },
    {
      title: l('3 · Hepsinden geçir', '3 · Through all loops', '3 · Cierra todos', '3 · Feche todas'),
      text: l('İp at ve 7 ilmeğin hepsinden birden geçir. Sonra 1 zincirle fıstığı kapat.', 'Yarn over and pull through all 7 loops. Then chain 1 to close the puff.', 'Lazada y cierra los 7 lazos. Luego 1 cadeneta para cerrar el puff.', 'Laçada e feche as 7 alças. Depois 1 correntinha para fechar o puff.'),
      scene: () => <CrochetScene hook="pulled" loops={7} loopColors={[S, M, S, M, S, M, M]} yo through={{ n: 8, at: [0.2, 0.6] }} arrows={crochetArrows.through(3)} />,
      loopsOnHook: 1,
      tip: l('İlmekleri geçirmek zorlaşırsa tığı biraz döndür ya da bir numara kalın tığ kullan.', 'If pulling through is hard, rotate the hook a little or use a larger hook.', 'Si cuesta cerrar, gira un poco la aguja o usa una más gruesa.', 'Se for difícil fechar, gire um pouco a agulha ou use uma maior.'),
    },
    {
      title: l('Fıstık sırası', 'A row of puffs', 'Una vuelta de puffs', 'Uma carreira de puffs'),
      text: l('Fıstıklar genelde aralarına 1 zincir ya da bir ilmek atlanarak dizilir.', 'Puffs are usually spaced with a chain or a skipped stitch between them.', 'Los puffs suelen ir separados por una cadeneta o un punto saltado.', 'Os puffs costumam ser separados por uma correntinha ou um ponto pulado.'),
      scene: () => <Diagram marks={puffRow()} />,
      viewBox: fitView(puffRow()),
    },
  ],
  quiz: [
    {
      q: l('3 kez çekilmiş bir fıstıkta tığda kaç ilmek olur?', 'How many loops are on the hook in a 3-pull puff?', '¿Cuántos lazos hay en un puff de 3?', 'Quantas alças há num puff de 3?'),
      options: [l('7', '7', '7', '7'), l('6', '6', '6', '6'), l('4', '4', '4', '4')],
      answer: 0,
      explain: l('Her tekrar 2 ilmek ekler: 1 + 3 × 2 = 7.', 'Each repeat adds 2 loops: 1 + 3 × 2 = 7.', 'Cada repetición suma 2: 1 + 3 × 2 = 7.', 'Cada repetição soma 2: 1 + 3 × 2 = 7.'),
    },
  ],
  summary: [l('İp at, bat, uzun çek × 3; hepsinden geçir; 1 zincir.', 'Yarn over, insert, pull up long × 3; through all; chain 1.', 'Lazada, entra, saca largo × 3; cierra todo; 1 cadeneta.', 'Laçada, entre, puxe longo × 3; feche tudo; 1 correntinha.')],
};

export default lesson;
