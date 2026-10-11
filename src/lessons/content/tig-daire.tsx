import { Diagram, RoundBadges, circleMarks, zoomView } from '@/engine/illust/diagram';
import { l, type Lesson } from '../types';

const marks = circleMarks({ rounds: 4 });
const circle = (focus: number) => () => <Diagram marks={marks} focus={focus} extra={<RoundBadges rounds={focus} />} />;

const lesson: Lesson = {
  id: 'tig-daire',
  intro: l(
    'Dümdüz bir daire için her turda aynı sayıda artırma yaparsın: {sc} ile her tur 6 ilmek. Böylece daire kâse gibi kalkmaz, dalga gibi de kıvrılmaz. Kural basit: tur numarası × 6.',
    'For a flat circle you add the same number of stitches every round: with {sc}, 6 per round. That keeps it from cupping into a bowl or ruffling into waves. The rule is simple: round number × 6.',
    'Para un círculo plano sumas lo mismo cada vuelta: con {sc}, 6 por vuelta. Así no se ahueca ni se ondula. La regla: número de vuelta × 6.',
    'Para um círculo plano você soma o mesmo a cada volta: com {sc}, 6 por volta. Assim não vira tigela nem ondula. A regra: número da volta × 6.',
  ),
  steps: [
    {
      title: l('1. tur · 6 ilmek', 'Round 1 · 6 stitches', 'Vuelta 1 · 6 puntos', 'Volta 1 · 6 pontos'),
      text: l('Sihirli halkaya 6 {sc} ör, ilk ilmeğe {slst} ile birleştir.', 'Work 6 {sc} into a magic ring and join with a {slst} to the first stitch.', 'Teje 6 {sc} en un anillo mágico y une con un {slst}.', 'Faça 6 {sc} num anel mágico e una com um {slst}.'),
      scene: circle(1),
      viewBox: zoomView(34 * 1 + 34),
    },
    {
      title: l('2. tur · 12 ilmek', 'Round 2 · 12 stitches', 'Vuelta 2 · 12 puntos', 'Volta 2 · 12 pontos'),
      text: l('1 zincir, sonra her ilmeğe artırma (2 {sc}). 6 × 2 = 12.', 'Chain 1, then increase in every stitch (2 {sc}). 6 × 2 = 12.', '1 cadeneta y aumento en cada punto (2 {sc}). 6 × 2 = 12.', '1 correntinha e aumento em cada ponto (2 {sc}). 6 × 2 = 12.'),
      scene: circle(2),
      viewBox: zoomView(34 * 2 + 34),
    },
    {
      title: l('3. tur · 18 ilmek', 'Round 3 · 18 stitches', 'Vuelta 3 · 18 puntos', 'Volta 3 · 18 pontos'),
      text: l('*1 {sc}, artırma* 6 kez. Her artırmanın arasına bir düz ilmek girer.', '*1 {sc}, increase* 6 times. One plain stitch now sits between increases.', '*1 {sc}, aumento* 6 veces. Entre aumentos hay un punto liso.', '*1 {sc}, aumento* 6 vezes. Entre aumentos há um ponto liso.'),
      scene: circle(3),
      viewBox: zoomView(34 * 3 + 34),
    },
    {
      title: l('4. tur · 24 ilmek', 'Round 4 · 24 stitches', 'Vuelta 4 · 24 puntos', 'Volta 4 · 24 pontos'),
      text: l(
        '*2 {sc}, artırma* 6 kez. Her turda artırmalar arasındaki düz ilmek bir artar: 5. tur *3 {sc}, artırma*, 6. tur *4 {sc}, artırma*…',
        '*2 {sc}, increase* 6 times. Each round adds one plain stitch between increases: round 5 is *3 {sc}, inc*, round 6 *4 {sc}, inc*…',
        '*2 {sc}, aumento* 6 veces. Cada vuelta suma un punto liso entre aumentos: vuelta 5 *3 {sc}, aum*, vuelta 6 *4 {sc}, aum*…',
        '*2 {sc}, aumento* 6 vezes. Cada volta soma um ponto liso entre aumentos: volta 5 *3 {sc}, aum*, volta 6 *4 {sc}, aum*…',
      ),
      scene: circle(4),
      viewBox: zoomView(34 * 4 + 34),
      tip: l('Artırmaları her turda biraz kaydırırsan (ör. turun ortasından başlayarak) daire altıgen değil yuvarlak görünür.', 'Shift the increases a little each round (for example, start mid-repeat) and the circle looks round rather than hexagonal.', 'Desplaza un poco los aumentos cada vuelta y el círculo será redondo, no hexagonal.', 'Desloque um pouco os aumentos a cada volta e o círculo fica redondo, não hexagonal.'),
    },
    {
      title: l('Kâse mi, dalga mı?', 'Cupping or ruffling?', '¿Se ahueca o se ondula?', 'Vira tigela ou ondula?'),
      text: l(
        'Daire kâse gibi kalkıyorsa artırma azdır; dalgalanıyorsa fazladır. Elin sıkıysa bir numara kalın tığ dene. {dc} ile daire 12 ilmekle başlar ve her tur 12 artar.',
        'If it cups like a bowl, there are too few increases; if it ruffles, too many. A tight hand may need a larger hook. With {dc} a circle starts with 12 and adds 12 a round.',
        'Si se ahueca faltan aumentos; si se ondula, sobran. Si tejes apretado, prueba una aguja más gruesa. Con {dc} empieza con 12 y suma 12 por vuelta.',
        'Se vira tigela faltam aumentos; se ondula, sobram. Se tricota apertado, tente uma agulha maior. Com {dc} começa com 12 e soma 12 por volta.',
      ),
      scene: () => <Diagram marks={circleMarks({ rounds: 3, stitch: 'dc', start: 12, step: 42 })} />,
      viewBox: zoomView(148),
    },
  ],
  practice: {
    text: l('{sc} ile 6 turluk bir daire ör: son tur 36 ilmek. Masaya koy, düz duruyor mu bak.', 'Crochet a 6-round circle in {sc}: the last round has 36 stitches. Lay it on the table and check it lies flat.', 'Teje un círculo de 6 vueltas en {sc}: la última con 36 puntos. Comprueba que quede plano.', 'Faça um círculo de 6 voltas em {sc}: a última com 36 pontos. Confira se fica plano.'),
    target: 6,
    unit: 'round',
  },
  quiz: [
    {
      q: l('{sc} dairede 5. turda kaç ilmek olur?', 'How many stitches in round 5 of a {sc} circle?', '¿Cuántos puntos tiene la vuelta 5 de un círculo de {sc}?', 'Quantos pontos tem a volta 5 de um círculo de {sc}?'),
      options: [l('30', '30', '30', '30'), l('25', '25', '25', '25'), l('36', '36', '36', '36')],
      answer: 0,
      explain: l('Tur numarası × 6 = 5 × 6 = 30.', 'Round number × 6 = 5 × 6 = 30.', 'Vuelta × 6 = 5 × 6 = 30.', 'Volta × 6 = 5 × 6 = 30.'),
    },
  ],
  summary: [
    l('{sc}: her tur +6. {dc}: her tur +12.', '{sc}: +6 each round. {dc}: +12 each round.', '{sc}: +6 por vuelta. {dc}: +12 por vuelta.', '{sc}: +6 por volta. {dc}: +12 por volta.'),
    l('Kâse: artırma az. Dalga: artırma fazla.', 'Cupping: too few. Ruffling: too many.', 'Se ahueca: faltan. Se ondula: sobran.', 'Tigela: faltam. Ondula: sobram.'),
  ],
};

export default lesson;
