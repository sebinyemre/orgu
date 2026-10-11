import { YarnLabelScene } from '@/engine/illust/info';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'haz-ip-secimi',
  intro: l(
    'İpin etiketi (banderol) her şeyi söyler: kalınlığı, ne kadar olduğu, hangi şişle örüleceği, nasıl yıkanacağı. Etiketi okumayı öğrenelim.',
    'The yarn label (ball band) tells you everything: weight, length, needle size and care. Let us learn to read it.',
    'La etiqueta del ovillo lo dice todo: grosor, metros, agujas recomendadas y lavado. Aprendamos a leerla.',
    'O rótulo do novelo diz tudo: espessura, metragem, agulhas indicadas e lavagem. Vamos aprender a ler.',
  ),
  needs: [{ kind: 'yarn', text: l('Elindeki bir yumağın etiketi', 'The label of any ball you have', 'La etiqueta de cualquier ovillo', 'O rótulo de qualquer novelo') }],
  steps: [
    {
      title: l('Kalınlık numarası', 'Weight number', 'Número de grosor', 'Número de espessura'),
      text: l(
        'Yumak simgesinin içindeki sayı ipin kalınlığıdır: 0 en ince (dantel), 7 en kalın (jumbo). 4 en yaygın orta kalınlıktır.',
        'The number in the skein symbol is the yarn weight: 0 is the finest (lace), 7 the thickest (jumbo). 4 is the common medium weight.',
        'El número dentro del ovillo indica el grosor: 0 el más fino (encaje), 7 el más grueso (jumbo). El 4 es el medio más común.',
        'O número dentro do novelo é a espessura: 0 o mais fino (renda), 7 o mais grosso (jumbo). O 4 é o médio mais comum.',
      ),
      scene: () => <YarnLabelScene highlight="weight" />,
      dur: 3,
    },
    {
      title: l('Lif', 'Fiber', 'Fibra', 'Fibra'),
      text: l(
        'İpin neyden yapıldığı yazar: yün, pamuk, akrilik ya da karışım. Yün sıcak ve esnektir, pamuk serin ve nettir.',
        'The fiber content: wool, cotton, acrylic or a blend. Wool is warm and stretchy, cotton cool and crisp.',
        'La composición: lana, algodón, acrílico o mezcla. La lana es cálida y elástica, el algodón fresco y definido.',
        'A composição: lã, algodão, acrílico ou mistura. Lã é quente e elástica, algodão fresco e definido.',
      ),
      scene: () => <YarnLabelScene highlight="fiber" />,
      dur: 3,
    },
    {
      title: l('Gram ve metre', 'Grams and meters', 'Gramos y metros', 'Gramas e metros'),
      text: l(
        'Bir yumağın ağırlığı ve uzunluğu. Tarif "400 m" istiyorsa 200 metrelik yumaktan 2 tane alırsın.',
        'The weight and length of one ball. If a pattern needs 400 m and a ball has 200 m, buy two.',
        'El peso y el largo de un ovillo. Si el patrón pide 400 m y el ovillo trae 200 m, compra dos.',
        'O peso e o comprimento de um novelo. Se a receita pede 400 m e o novelo tem 200 m, compre dois.',
      ),
      scene: () => <YarnLabelScene highlight="length" />,
      dur: 3,
    },
    {
      title: l('Şiş ve tığ numarası', 'Needle and hook size', 'Número de agujas', 'Número de agulhas'),
      text: l(
        'Etikette önerilen şiş ve tığ numarası milimetre olarak yazar. Türkiye’de şiş numarası doğrudan mm demektir.',
        'The suggested knitting needle and crochet hook sizes, in millimeters.',
        'Las agujas de tejer y de ganchillo recomendadas, en milímetros.',
        'As agulhas de tricô e de crochê indicadas, em milímetros.',
      ),
      scene: () => <YarnLabelScene highlight="needle" />,
      dur: 3,
    },
    {
      title: l('Ölçü örneği', 'Gauge', 'Muestra', 'Amostra'),
      text: l(
        'Karenin içindeki sayılar: önerilen şişle 10 cm’de kaç ilmek (üst) ve kaç sıra (alt) çıktığı.',
        'The numbers in the square: how many stitches (top) and rows (bottom) fit in 10 cm with the suggested needles.',
        'Los números del cuadrado: cuántos puntos (arriba) y vueltas (abajo) caben en 10 cm.',
        'Os números do quadrado: quantos pontos (em cima) e carreiras (embaixo) cabem em 10 cm.',
      ),
      scene: () => <YarnLabelScene highlight="gauge" />,
      dur: 3,
    },
    {
      title: l('Yıkama ve lot', 'Care and dye lot', 'Lavado y lote', 'Lavagem e lote'),
      text: l(
        'Yıkama simgeleri ipin nasıl yıkanacağını söyler. Lot numarası boya partisidir: bir iş için aldığın tüm yumakların lotu aynı olsun.',
        'Care symbols tell you how to wash it. The dye lot is the dye batch: buy all balls for one project from the same lot.',
        'Los símbolos indican el lavado. El lote es la tanda de tinte: compra todos los ovillos de una labor del mismo lote.',
        'Os símbolos indicam a lavagem. O lote é a partida de tingimento: compre todos os novelos de um trabalho do mesmo lote.',
      ),
      scene: () => <YarnLabelScene highlight={['care', 'lot']} />,
      dur: 3,
      warn: l('Farklı lotlar aynı renk adında bile hafif ton farkı verebilir.', 'Different lots can differ slightly in shade even with the same color name.', 'Lotes distintos pueden variar un poco de tono aunque el color se llame igual.', 'Lotes diferentes podem variar um pouco de tom mesmo com o mesmo nome de cor.'),
    },
  ],
  quiz: [
    {
      q: l('Tarif 600 m ip istiyor, yumak 150 m. Kaç yumak alırsın?', 'A pattern needs 600 m and a ball has 150 m. How many balls?', 'El patrón pide 600 m y el ovillo trae 150 m. ¿Cuántos?', 'A receita pede 600 m e o novelo tem 150 m. Quantos?'),
      options: [l('3', '3', '3', '3'), l('4', '4', '4', '4'), l('5', '5', '5', '5')],
      answer: 1,
      explain: l('600 ÷ 150 = 4. Bir yumak fazlası almak her zaman iyi fikirdir.', '600 ÷ 150 = 4. One spare ball is always a good idea.', '600 ÷ 150 = 4. Un ovillo de más siempre viene bien.', '600 ÷ 150 = 4. Um novelo a mais é sempre uma boa ideia.'),
    },
  ],
  summary: [
    l('Kalınlık numarası 0–7, şiş numarası mm.', 'Weight number 0–7, needle size in mm.', 'Grosor 0–7, agujas en mm.', 'Espessura 0–7, agulhas em mm.'),
    l('Aynı işin yumakları aynı lottan olsun.', 'Buy all balls for one project from the same lot.', 'Todos los ovillos del mismo lote.', 'Todos os novelos do mesmo lote.'),
  ],
};

export default lesson;
