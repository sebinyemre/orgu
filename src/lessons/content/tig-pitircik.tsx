import { CrochetScene, crochetArrows } from '@/engine/illust/crochet';
import { Diagram, ROUND_COLORS, chainRowMarks, type Mark, fitView } from '@/engine/illust/diagram';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

const S = YARN.second;
const M = YARN.main;

function row(id: 'bobble' | 'popcorn'): Mark[] {
  const c = ROUND_COLORS[id === 'bobble' ? 0 : 3];
  const marks: Mark[] = chainRowMarks(9, 214, 40, 40, 28, 0);
  for (let i = 0; i < 9; i++) {
    const x = 40 + i * 40;
    marks.push(i % 2 === 1 ? { id, at: [x, 168], size: 64, color: c, group: 1 } : { id: 'sc', at: [x, 190], size: 30, color: c, group: 1 });
  }
  return marks;
}

const lesson: Lesson = {
  id: 'tig-pitircik',
  intro: l(
    'Pıtırcık (bobble), aynı ilmeğe yarım bırakılmış birkaç {dc} örüp tepede birleştirmektir; işin arka yüzünde örüldüğünde ön yüze boncuk gibi çıkar. Patlamış mısır (popcorn) ise ilmekleri tamamen bitirip tepede kapatarak yapılır ve daha belirgin durur.',
    'A bobble works several unfinished {dc} into one stitch and joins them at the top; worked on a wrong-side row it pops out on the front like a bead. A popcorn completes the stitches first and then closes them at the top, so it stands out even more.',
    'El bodoque son varios {dc} sin cerrar en un punto, unidos arriba; tejido por el revés sale por el derecho. La palomita completa los puntos y luego los cierra arriba: resalta aún más.',
    'A pipoca são vários {dc} incompletos no mesmo ponto, unidos em cima; feita pelo avesso, sobressai no direito. A pipoca fechada completa os pontos e depois fecha em cima: fica ainda mais saliente.',
  ),
  steps: [
    {
      title: l('Pıtırcık · Yarım {dc}', 'Bobble · Half-finished {dc}', 'Bodoque · {dc} sin cerrar', 'Pipoca · {dc} incompleto'),
      text: l('İp at, bat, çek, ip at ve 2 ilmekten geçir; son adımı yapma. Tığda 2 ilmek kalır.', 'Yarn over, insert, pull up, yarn over and pull through 2; skip the final step. 2 loops stay on the hook.', 'Lazada, entra, saca, lazada y cierra 2; no hagas el último paso. Quedan 2 lazos.', 'Laçada, entre, puxe, laçada e feche 2; não faça o último passo. Ficam 2 alças.'),
      scene: () => <CrochetScene hook="pulled" loops={2} loopColors={[S, M]} rowKind="dc" />,
      loopsOnHook: 2,
    },
    {
      title: l('Pıtırcık · 5 kez', 'Bobble · Five times', 'Bodoque · Cinco veces', 'Pipoca · Cinco vezes'),
      text: l('Aynı ilmekte 4 yarım {dc} daha ör. Tığda 6 ilmek birikir.', 'Work 4 more half-finished {dc} in the same stitch. 6 loops gather on the hook.', 'Teje 4 {dc} más sin cerrar en el mismo punto. Hay 6 lazos.', 'Faça mais 4 {dc} incompletos no mesmo ponto. Há 6 alças.'),
      scene: () => <CrochetScene hook="pulled" loops={6} loopColors={[S, S, S, S, S, M]} rowKind="dc" />,
      loopsOnHook: 6,
    },
    {
      title: l('Pıtırcık · Hepsini kapat', 'Bobble · Close them all', 'Bodoque · Ciérralos', 'Pipoca · Feche todas'),
      text: l('İp at ve 6 ilmekten birden geçir. Arka yüz sırasında örersen boncuk ön yüze çıkar.', 'Yarn over and pull through all 6. Worked on a wrong-side row, the bobble pops to the front.', 'Lazada y cierra los 6. Por el revés, el bodoque sale al derecho.', 'Laçada e feche as 6. Pelo avesso, a pipoca sai no direito.'),
      scene: () => <CrochetScene hook="pulled" loops={6} loopColors={[S, S, S, S, S, M]} yo through={{ n: 7, at: [0.2, 0.6] }} rowKind="dc" arrows={crochetArrows.through(1)} />,
      loopsOnHook: 1,
    },
    {
      title: l('Pıtırcık sırası', 'Bobble row', 'Vuelta de bodoques', 'Carreira de pipocas'),
      text: l('Şemada pıtırcık, tepesi birleşmiş oval bir demetle çizilir; aralarına {sc} girer.', 'Diagrams draw a bobble as an oval bundle joined at the top, with {sc} between.', 'En el diagrama es un óvalo unido arriba, con {sc} entre ellos.', 'No diagrama é um oval unido em cima, com {sc} entre eles.'),
      scene: () => <Diagram marks={row('bobble')} />,
      viewBox: fitView(row('bobble')),
    },
    {
      title: l('Patlamış mısır', 'Popcorn', 'Palomita', 'Pipoca fechada'),
      text: l(
        'Aynı ilmeğe 5 tam {dc} ör. Tığı çıkar, ilk {dc} tepesine sok, bıraktığın ilmeği yakala ve içinden çek. 5 ilmek tepede toplanır ve kabarır.',
        'Work 5 complete {dc} in one stitch. Take the hook out, insert it into the top of the first {dc}, catch the dropped loop and pull it through. The 5 stitches gather into a raised cup.',
        'Teje 5 {dc} completos en un punto. Saca la aguja, métela en el primer {dc}, toma el lazo y pásalo. Los 5 se juntan en relieve.',
        'Faça 5 {dc} completos no mesmo ponto. Tire a agulha, entre no primeiro {dc}, pegue a alça e puxe. Os 5 se juntam em relevo.',
      ),
      scene: () => <Diagram marks={row('popcorn')} />,
      viewBox: fitView(row('popcorn')),
    },
  ],
  quiz: [
    {
      q: l('Pıtırcıkta 5 yarım {dc} sonrası tığda kaç ilmek olur?', 'After 5 half-finished {dc}, how many loops are on the hook?', 'Tras 5 {dc} sin cerrar, ¿cuántos lazos hay?', 'Depois de 5 {dc} incompletos, quantas alças há?'),
      options: [l('6', '6', '6', '6'), l('5', '5', '5', '5'), l('10', '10', '10', '10')],
      answer: 0,
      explain: l('Her yarım {dc} 1 ilmek bırakır, artı başlangıç ilmeği: 5 + 1 = 6.', 'Each leaves 1 loop, plus the starting loop: 5 + 1 = 6.', 'Cada uno deja 1 lazo, más el inicial: 5 + 1 = 6.', 'Cada um deixa 1 alça, mais a inicial: 5 + 1 = 6.'),
    },
  ],
  summary: [
    l('Pıtırcık: 5 yarım {dc}, hepsinden geçir.', 'Bobble: 5 unfinished {dc}, through all.', 'Bodoque: 5 {dc} sin cerrar, cierra todo.', 'Pipoca: 5 {dc} incompletos, feche tudo.'),
    l('Patlamış mısır: 5 tam {dc}, ilkinin tepesinden kapat.', 'Popcorn: 5 full {dc}, close through the first.', 'Palomita: 5 {dc} completos, cierra en el primero.', 'Pipoca fechada: 5 {dc} completos, feche no primeiro.'),
  ],
};

export default lesson;
