import { ChartReadScene } from '@/engine/illust/diagram';
import { SwatchScene, type Cell } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

/** küçük ajur ve doku grafiği (alttan üste); boş = ön yüzde düz */
const chart = [
  ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
  ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
  ['k', 'yo', 'k2tog', 'k', 'k', 'yo', 'k2tog', 'k'],
  ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
  ['p', 'p', 'k', 'k', 'p', 'p', 'k', 'k'],
  ['p', 'p', 'k', 'k', 'p', 'p', 'k', 'k'],
];

/** aynı grafiğin kumaştaki karşılığı (üstten alta) */
const fabric: Cell[][] = [...chart].reverse().map((row) => row.map((c) => (c === 'yo' ? 'yo' : c === 'k2tog' ? 'k2tog' : c === 'p' ? 'p' : 'k')) as Cell[]);

const lesson: Lesson = {
  id: 'sis-grafik-okuma',
  intro: l(
    'Grafik, örgünün kareli kağıda çizilmiş hâlidir: her kare bir ilmek, her satır bir sıra. Ön yüzden bakıldığı gibi çizilir, bu yüzden kumaşla birebir eşleşir. Okumayı öğrenince Japon dergilerindeki desenleri bile dil bilmeden örebilirsin.',
    'A chart is knitting drawn on graph paper: each square is a stitch, each line a row. It shows the fabric as seen from the right side, so it matches the knitting exactly. Once you can read one, you can knit from Japanese stitch books without reading a word.',
    'Un gráfico es el tejido dibujado en papel cuadriculado: cada casilla un punto, cada fila una vuelta. Muestra la labor vista por el derecho, así que coincide con el tejido. Sabiendo leerlo puedes tejer de libros japoneses sin entender el idioma.',
    'Um gráfico é o tricô desenhado em papel quadriculado: cada casa um ponto, cada linha uma carreira. Mostra o trabalho visto pelo direito, então bate com o tecido. Sabendo ler, você tricota até de livros japoneses sem saber a língua.',
  ),
  steps: [
    {
      title: l('Sağ alttan başla', 'Start bottom right', 'Empieza abajo a la derecha', 'Comece embaixo à direita'),
      text: l(
        'Grafik aşağıdan yukarı örülür. 1. sıra en alttadır ve numarası sağdadır: sağdan sola okunur, tıpkı şişteki ilmekleri örme sırası gibi.',
        'Charts are knitted bottom to top. Row 1 is at the bottom with its number on the right: read it right to left, just as stitches come off the needle.',
        'El gráfico se teje de abajo arriba. La vuelta 1 está abajo con su número a la derecha: se lee de derecha a izquierda, como salen los puntos de la aguja.',
        'O gráfico é tricotado de baixo para cima. A carreira 1 fica embaixo, com o número à direita: lê-se da direita para a esquerda, como os pontos saem da agulha.',
      ),
      scene: () => <ChartReadScene cells={chart} row={1} cell={32} />,
    },
    {
      title: l('Arka yüz sıraları', 'Wrong-side rows', 'Vueltas del revés', 'Carreiras do avesso'),
      text: l(
        'Düz örgüde 2. sıranın numarası soldadır: soldan sağa okunur. Grafik ön yüzü gösterdiği için arka yüzde sembolleri tersine çevirirsin: boş kare ters, nokta düz örülür.',
        'Knitting flat, row 2 has its number on the left: read it left to right. Since the chart shows the right side, flip the symbols on the wrong side: blank squares are purled, dots are knitted.',
        'En plano, la vuelta 2 tiene el número a la izquierda: se lee de izquierda a derecha. Como el gráfico muestra el derecho, en el revés inviertes: casilla vacía del revés, punto del derecho.',
        'No tricô reto, a carreira 2 tem o número à esquerda: lê-se da esquerda para a direita. Como o gráfico mostra o direito, no avesso você inverte: casa vazia em tricô, ponto em meia.',
      ),
      scene: () => <ChartReadScene cells={chart} row={2} cell={32} />,
      tip: l('Yuvarlak örgüde her tur sağdan sola okunur ve semboller olduğu gibi örülür.', 'In the round every round is read right to left and symbols are worked as drawn.', 'En redondo todas las vueltas se leen de derecha a izquierda y como están dibujadas.', 'Em círculo todas as voltas são lidas da direita para a esquerda e como desenhadas.'),
    },
    {
      title: l('Sembolleri tanı', 'Know the symbols', 'Conoce los símbolos', 'Conheça os símbolos'),
      text: l(
        'Boş kare: düz. Nokta: ters. Daire: ip atma. Sağa eğik çizgi: 2 birlikte. Her grafiğin yanında bir anahtar (lejant) bulunur; önce ona bak.',
        'Blank: knit. Dot: purl. Circle: yarn over. Slash to the right: k2tog. Every chart has a key beside it; read that first.',
        'Vacía: derecho. Punto: revés. Círculo: lazada. Barra a la derecha: 2 juntos. Cada gráfico trae una leyenda; léela primero.',
        'Vazia: meia. Ponto: tricô. Círculo: laçada. Barra para a direita: 2 juntos. Todo gráfico tem uma legenda; leia primeiro.',
      ),
      scene: () => <ChartReadScene cells={chart} row={3} cell={32} />,
    },
    {
      title: l('Grafik ve kumaş', 'Chart and fabric', 'Gráfico y tejido', 'Gráfico e tecido'),
      text: l(
        'Aynı desenin örülmüş hâli: delikler ve ters ilmekler grafikteki yerlerinde. Kareli kağıt bölümünde kendi grafiğini çizip yazılı tarifini alabilirsin.',
        'The same pattern knitted: holes and purl bumps sit where the chart put them. In Graph paper you can draw your own chart and get written instructions.',
        'El mismo motivo tejido: agujeros y puntos revés donde los puso el gráfico. En Papel cuadriculado puedes dibujar tu gráfico y obtener el patrón escrito.',
        'O mesmo desenho tricotado: furos e pontos tricô onde o gráfico mostrou. Em Papel quadriculado você desenha seu gráfico e recebe a receita escrita.',
      ),
      scene: () => <SwatchScene rows={fabric} cell={30} rowH={24} />,
    },
  ],
  quiz: [
    {
      q: l('Düz örgüde 1. sıra nereden okunur?', 'Knitting flat, where do you start reading row 1?', 'En plano, ¿por dónde empiezas la vuelta 1?', 'No reto, por onde começa a carreira 1?'),
      options: [l('Sağdan sola', 'Right to left', 'De derecha a izquierda', 'Da direita para a esquerda'), l('Soldan sağa', 'Left to right', 'De izquierda a derecha', 'Da esquerda para a direita'), l('Yukarıdan aşağı', 'Top to bottom', 'De arriba abajo', 'De cima para baixo')],
      answer: 0,
    },
    {
      q: l('Arka yüz sırasında boş kare nasıl örülür?', 'On a wrong-side row, how do you work a blank square?', 'En una vuelta del revés, ¿cómo tejes una casilla vacía?', 'Numa carreira do avesso, como fazer uma casa vazia?'),
      options: [l('Ters', 'Purl', 'Del revés', 'Tricô'), l('Düz', 'Knit', 'Del derecho', 'Meia'), l('Kaydırılır', 'Slip it', 'Se desliza', 'Desliza')],
      answer: 0,
    },
  ],
  summary: [
    l('Aşağıdan yukarı; ön yüz sağdan sola, arka yüz soldan sağa.', 'Bottom to top; right side right to left, wrong side left to right.', 'De abajo arriba; derecho de derecha a izquierda, revés al contrario.', 'De baixo para cima; direito da direita para a esquerda, avesso ao contrário.'),
    l('Grafik ön yüzü gösterir; arka yüzde sembolleri çevir.', 'The chart shows the right side; flip symbols on the wrong side.', 'El gráfico muestra el derecho; invierte en el revés.', 'O gráfico mostra o direito; inverta no avesso.'),
  ],
};

export default lesson;
