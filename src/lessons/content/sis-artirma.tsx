import { KnitScene, knitArrows, leftLoopAt, rightLoopAt } from '@/engine/illust/knit';
import { Arrow, Target, Yarn } from '@/engine/illust/parts';
import { SwatchScene, type Cell } from '@/engine/illust/swatch';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

/** sağ ve sol şiş arasındaki yatay iplik (M1 için) */
function Bar() {
  const a = leftLoopAt(0);
  const b = rightLoopAt('rest', 0);
  const p1: [number, number] = [a[0] + 12, a[1] + 44];
  const p2: [number, number] = [b[0] - 12, b[1] + 44];
  const mid: [number, number] = [(p1[0] + p2[0]) / 2, Math.max(p1[1], p2[1]) + 12];
  return (
    <g>
      <Yarn d={`M${p1[0]} ${p1[1]} Q${mid[0]} ${mid[1] + 8} ${p2[0]} ${p2[1]}`} color={YARN.second} w={8} />
      <Target c={mid} r={20} />
    </g>
  );
}

/** artırmalarla genişleyen üçgen (üstten alta) */
const widening: Cell[][] = [12, 12, 10, 10, 8, 8, 6].map((w) => {
  const pad = (12 - w) / 2;
  return Array.from({ length: 12 }, (_, c) => (c < pad || c >= 12 - pad ? 'none' : 'k')) as Cell[];
});

const lesson: Lesson = {
  id: 'sis-artirma',
  intro: l(
    'Artırma ilmek sayısını çoğaltır ve kumaşı genişletir: kol ağzından omuza, şalın ucundan ortasına. En çok kullanılan iki yol var: önden-arkadan örme kolay ve sağlamdır, küçük bir boncuk bırakır; aradan artırma (M1) neredeyse görünmez.',
    'Increases add stitches and widen the fabric: from cuff to shoulder, from a shawl’s tip to its middle. Two methods cover most patterns: knit front and back (kfb) is easy and sturdy and leaves a small bar; make one (M1) is almost invisible.',
    'Los aumentos suman puntos y ensanchan el tejido: del puño al hombro, de la punta del chal al centro. Dos métodos cubren casi todo: tejer por delante y por detrás (kfb) es fácil y deja una pequeña barra; el aumento intercalado (M1) casi no se ve.',
    'Os aumentos somam pontos e alargam o tecido: do punho ao ombro, da ponta do xale ao meio. Dois métodos cobrem quase tudo: tricotar pela frente e por trás (kfb) é fácil e deixa uma barrinha; o aumento intercalado (M1) quase não aparece.',
  ),
  steps: [
    {
      title: l('1 · Önden ör, düşürme', '1 · Knit, but keep it', '1 · Teje sin soltar', '1 · Tricote sem soltar'),
      text: l(
        'İlmeği her zamanki gibi düz ör: bat, sar, çek. Ama eski ilmeği sol şişten DÜŞÜRME.',
        'Knit the stitch as usual: in, around, through. But do NOT drop the old stitch off the left needle.',
        'Teje el punto como siempre: entra, rodea, saca. Pero NO sueltes el punto viejo de la aguja izquierda.',
        'Tricote o ponto como sempre: entre, enrole, puxe. Mas NÃO solte o ponto antigo da agulha esquerda.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="pullK" rnFrom="insertK" newLoop="k" target arrows={knitArrows.pullK(1)} />,
    },
    {
      title: l('2 · Arka bacağa bat', '2 · Into the back leg', '2 · Por la hebra trasera', '2 · Na perna de trás'),
      text: l(
        'Sağ şişi aynı ilmeğin ARKA bacağına, sağdan sola ve sol şişin arkasından sok.',
        'Insert the right needle into the BACK leg of the same stitch, from right to left, behind the left needle.',
        'Mete la aguja derecha en la hebra TRASERA del mismo punto, de derecha a izquierda, por detrás de la aguja izquierda.',
        'Insira a agulha direita na perna de TRÁS do mesmo ponto, da direita para a esquerda, por trás da agulha esquerda.',
      ),
      scene: () => <KnitScene left={4} right={3} rn="insertTbl" rnFrom="rest" target arrows={<Arrow d="M330 150 C290 150 236 144 196 140" n={2} start={[344, 152]} />} />,
    },
    {
      title: l('3 · Sar, çek, şimdi düşür', '3 · Wrap, pull, now drop', '3 · Rodea, saca y suelta', '3 · Enrole, puxe e solte'),
      text: l(
        'İpi sar, yeni ilmeği çek ve eski ilmeği şimdi düşür. Bir ilmekten iki ilmek çıktı; ikincisinin dibinde küçük bir boncuk görünür.',
        'Wrap, pull the new loop through and now drop the old stitch. One stitch became two; a little bar shows at the base of the second.',
        'Rodea, saca el lazo nuevo y ahora suelta el punto viejo. De un punto salieron dos; en la base del segundo se ve una barrita.',
        'Enrole, puxe a nova alça e agora solte o ponto antigo. De um ponto saíram dois; na base do segundo aparece uma barrinha.',
      ),
      scene: () => <KnitScene left={4} right={3} rn="rest" newLoop="k" dropping={[0.2, 0.6]} arrows={knitArrows.drop(3)} />,
      tip: l('Tariflerde kısaltması "kfb" ya da "önden-arkadan 1 ilmek".', 'Patterns write it as "kfb".', 'Los patrones lo escriben como "kfb".', 'As receitas escrevem "kfb".'),
    },
    {
      title: l('Aradaki iplik', 'The bar between', 'La hebra entre puntos', 'O fio entre os pontos'),
      text: l(
        'Aradan artırma için şişleri hafifçe ayır: iki şiş arasında, iki ilmeği birbirine bağlayan yatay bir iplik görürsün. Yeni ilmek bu iplikten yapılır.',
        'For a make one, spread the needles a little: between them you will see a horizontal strand linking the two stitches. The new stitch is made from this bar.',
        'Para el aumento intercalado separa un poco las agujas: entre ellas verás una hebra horizontal que une los dos puntos. El punto nuevo sale de esa hebra.',
        'Para o aumento intercalado afaste um pouco as agulhas: entre elas há um fio horizontal unindo os dois pontos. O novo ponto sai desse fio.',
      ),
      scene: () => <KnitScene left={4} right={3} rn="rest" extra={<Bar />} />,
    },
    {
      title: l('M1L · Önden kaldır, arkadan ör', 'M1L · Lift from the front, knit the back', 'M1L · Levanta por delante, teje por detrás', 'M1L · Levante pela frente, tricote por trás'),
      text: l(
        'Sol şişin ucuyla ipliği ÖNDEN ARKAYA doğru kaldır. Sonra onu arka bacağından düz ör, böylece burulur ve delik kalmaz. Bu artırma sola yatar.',
        'With the left needle tip, lift the bar from FRONT to BACK. Then knit it through the back leg so it twists and leaves no hole. This increase leans left.',
        'Con la punta izquierda levanta la hebra de DELANTE hacia ATRÁS. Tejela por la hebra trasera para que se cruce y no deje agujero. Se inclina a la izquierda.',
        'Com a ponta esquerda levante o fio da FRENTE para TRÁS. Tricote pela perna de trás para que torça e não deixe furo. Este aumento inclina para a esquerda.',
      ),
      scene: () => <KnitScene left={5} right={3} rn="insertTbl" rnFrom="rest" leftColors={[YARN.second]} target arrows={<Arrow d="M330 150 C290 150 236 144 196 140" n={1} start={[344, 152]} />} />,
    },
    {
      title: l('M1R · Arkadan kaldır, önden ör', 'M1R · Lift from the back, knit the front', 'M1R · Levanta por detrás, teje por delante', 'M1R · Levante por trás, tricote pela frente'),
      text: l(
        'İpliği bu kez ARKADAN ÖNE doğru kaldır ve normal düz ilmek gibi önden ör. Bu artırma sağa yatar. Bir kolun iki yanında M1L ve M1R’yi eşli kullanırsan şekil simetrik olur.',
        'This time lift the bar from BACK to FRONT and knit it through the front like a normal stitch. This one leans right. Pair M1L and M1R on either side of a sleeve for a symmetrical shape.',
        'Esta vez levanta la hebra de ATRÁS hacia DELANTE y tejela por delante como un punto normal. Se inclina a la derecha. Usa M1L y M1R en pareja para una forma simétrica.',
        'Desta vez levante o fio de TRÁS para a FRENTE e tricote pela frente como um ponto normal. Inclina para a direita. Use M1L e M1R em par para uma forma simétrica.',
      ),
      scene: () => <KnitScene left={5} right={3} rn="insertK" rnFrom="rest" leftColors={[YARN.second]} target arrows={knitArrows.insertK(2)} />,
    },
    {
      title: l('Kumaş genişler', 'The fabric widens', 'El tejido se ensancha', 'O tecido alarga'),
      text: l(
        'Artırmaları kenardan bir ilmek içeride yaparsan kenar düzgün kalır ve dikiş kolaylaşır.',
        'Work increases one stitch in from the edge to keep the selvedge neat and seaming easy.',
        'Haz los aumentos a un punto del borde para que el orillo quede limpio y coser sea fácil.',
        'Faça os aumentos a um ponto da borda para a ourela ficar limpa e a costura fácil.',
      ),
      scene: () => <SwatchScene rows={widening} cell={24} rowH={20} />,
    },
  ],
  practice: {
    text: l('10 ilmek at. Her ön yüz sırasında baştaki ve sondaki ilmeğin içeri tarafına birer artırma yap; 20 ilmeğe ulaş.', 'Cast on 10. On every right-side row increase once near each edge until you have 20 stitches.', 'Monta 10 puntos. En cada vuelta del derecho aumenta uno cerca de cada borde hasta tener 20.', 'Monte 10 pontos. Em cada carreira do direito aumente um perto de cada borda até ter 20.'),
    target: 20,
    unit: 'stitch',
  },
  quiz: [
    {
      q: l('Önden-arkadan örme bir ilmeği kaç ilmek yapar?', 'Knit front and back turns one stitch into how many?', '¿En cuántos puntos convierte un punto el kfb?', 'O kfb transforma um ponto em quantos?'),
      options: [l('2', '2', '2', '2'), l('3', '3', '3', '3'), l('1', '1', '1', '1')],
      answer: 0,
      explain: l('Önden bir, arkadan bir: iki ilmek.', 'One from the front, one from the back: two stitches.', 'Uno por delante y otro por detrás: dos puntos.', 'Um pela frente, outro por trás: dois pontos.'),
    },
    {
      q: l('Aradan artırmada iplik neden burularak örülür?', 'Why is the lifted bar knitted twisted in a make one?', '¿Por qué se teje cruzada la hebra en el M1?', 'Por que o fio é tricotado torcido no M1?'),
      options: [l('Delik kalmasın diye', 'So no hole forms', 'Para que no quede agujero', 'Para não ficar furo'), l('Daha hızlı olsun diye', 'To be faster', 'Para ir más rápido', 'Para ser mais rápido'), l('Renk değişsin diye', 'To change color', 'Para cambiar de color', 'Para mudar de cor')],
      answer: 0,
    },
  ],
  summary: [
    l('Önden-arkadan: 1 ilmekten 2 ilmek, küçük boncuklu.', 'kfb: one stitch becomes two, with a small bar.', 'kfb: un punto se vuelve dos, con barrita.', 'kfb: um ponto vira dois, com barrinha.'),
    l('M1L sola, M1R sağa yatar; ikisini eşli kullan.', 'M1L leans left, M1R leans right: use them in pairs.', 'M1L se inclina a la izquierda y M1R a la derecha: úsalos en pareja.', 'M1L inclina à esquerda e M1R à direita: use em pares.'),
  ],
};

export default lesson;
