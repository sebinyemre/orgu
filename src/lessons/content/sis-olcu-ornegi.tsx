import { NeedleGaugeScene } from '@/engine/illust/info';
import { SwatchScene, swatchRows } from '@/engine/illust/swatch';
import { GaugeScene } from '@/engine/illust/texture';
import { l, type Lesson } from '../types';

/** kenarlarından iğnelenmiş örnek (kurutma) */
function Pinned() {
  const pins: [number, number][] = [
    [52, 52], [148, 46], [252, 46], [348, 52],
    [46, 150], [354, 150],
    [52, 248], [148, 254], [252, 254], [348, 248],
  ];
  return (
    <g>
      {pins.map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y} L${x + (x < 200 ? -14 : 14)} ${y + (y < 150 ? -14 : 14)}`} stroke="#8a95a0" strokeWidth={3} strokeLinecap="round" />
          <circle cx={x} cy={y} r={5} fill="#b5523b" stroke="#6e2f22" strokeWidth={1.2} />
        </g>
      ))}
    </g>
  );
}

const lesson: Lesson = {
  id: 'sis-olcu-ornegi',
  intro: l(
    'Ölçü örneği, tarifteki ölçüyle senin elinin aynı olup olmadığını gösteren küçük bir karedir. 10 cm’deki ilmek ve sıra sayısını sayarsın. 10 cm’de 2 ilmeklik fark, 100 cm’lik bir kazakta 10 cm fark demektir.',
    'A gauge swatch is a small square that tells you whether your hands match the pattern. You count stitches and rows over 10 cm (4 in). Two stitches off over 10 cm becomes 10 cm off on a 100 cm sweater.',
    'La muestra es un cuadrado pequeño que dice si tu mano coincide con el patrón. Cuentas puntos y vueltas en 10 cm. Dos puntos de diferencia en 10 cm son 10 cm en un jersey de 100 cm.',
    'A amostra é um quadradinho que diz se a sua mão bate com a receita. Você conta pontos e carreiras em 10 cm. Dois pontos de diferença em 10 cm viram 10 cm num suéter de 100 cm.',
  ),
  needs: [
    { kind: 'needles', text: l('Tarifte yazan numarada şiş', 'The needle size the pattern gives', 'Agujas del número del patrón', 'Agulhas no número da receita') },
    { kind: 'yarn', text: l('Projede kullanacağın ipin kendisi', 'The very yarn you will use', 'El mismo hilo del proyecto', 'O mesmo fio do projeto') },
    { kind: 'tape', text: l('Mezura ya da cetvel', 'Tape measure or ruler', 'Cinta métrica o regla', 'Fita métrica ou régua') },
  ],
  steps: [
    {
      title: l('Büyük bir kare ör', 'Knit a generous square', 'Teje un cuadrado amplio', 'Tricote um quadrado generoso'),
      text: l(
        'En az 15 × 15 cm ör: kenar ilmekleri sayıma girmez. Tarifteki desenle ve şişle ör; ölçü genelde jarse ya da ana desen üzerinden verilir.',
        'Knit at least 15 × 15 cm (6 × 6 in): edge stitches don’t count. Use the pattern’s stitch and needle; gauge is usually given in stockinette or the main pattern.',
        'Teje al menos 15 × 15 cm: los puntos del borde no cuentan. Usa el punto y las agujas del patrón; la muestra suele darse en jersey o en el punto principal.',
        'Tricote pelo menos 15 × 15 cm: os pontos da borda não contam. Use o ponto e as agulhas da receita; a amostra costuma ser em jersey ou no ponto principal.',
      ),
      scene: () => <SwatchScene rows={swatchRows('jarse', 14, 12)} cell={24} rowH={18} />,
    },
    {
      title: l('Yıka ve kurut', 'Wash and dry it', 'Lávala y sécala', 'Lave e seque'),
      text: l(
        'Örneği bitmiş işe nasıl davranacaksan öyle davran: yıka, havluyla sık, düz bir yerde kenarlarından iğneleyerek kurut. Yün açılır, pamuk biraz uzar.',
        'Treat the swatch the way you will treat the finished piece: wash it, roll it in a towel, pin it flat to dry. Wool blooms, cotton stretches a little.',
        'Trata la muestra como tratarás la prenda: lávala, escúrrela en una toalla y sécala estirada con alfileres. La lana se abre, el algodón se estira un poco.',
        'Trate a amostra como vai tratar a peça: lave, enrole numa toalha e seque esticada com alfinetes. A lã abre, o algodão estica um pouco.',
      ),
      scene: () => <SwatchScene rows={swatchRows('jarse', 14, 12)} cell={24} rowH={18} extra={<Pinned />} />,
    },
    {
      title: l('İlmekleri say', 'Count the stitches', 'Cuenta los puntos', 'Conte os pontos'),
      text: l(
        'Cetveli bir sıranın üstüne, kenardan uzağa yatay koy. 10 cm içindeki V’leri say; yarım ilmekleri de kat. Bu örnekte 18 ilmek var.',
        'Lay the ruler across a row, away from the edges. Count the V’s inside 10 cm, including halves. Here there are 18 stitches.',
        'Coloca la regla en horizontal, lejos de los bordes. Cuenta las V dentro de 10 cm, mitades incluidas. Aquí hay 18 puntos.',
        'Coloque a régua na horizontal, longe das bordas. Conte os V dentro de 10 cm, contando metades. Aqui há 18 pontos.',
      ),
      scene: () => <GaugeScene dir="st" count={18} />,
    },
    {
      title: l('Sıraları say', 'Count the rows', 'Cuenta las vueltas', 'Conte as carreiras'),
      text: l(
        'Cetveli dik koy ve bir sütundaki V’leri aşağıdan yukarı say. Bu örnekte 10 cm’de 24 sıra var.',
        'Turn the ruler upright and count the V’s up one column. Here there are 24 rows over 10 cm.',
        'Pon la regla en vertical y cuenta las V de una columna. Aquí hay 24 vueltas en 10 cm.',
        'Coloque a régua na vertical e conte os V de uma coluna. Aqui há 24 carreiras em 10 cm.',
      ),
      scene: () => <GaugeScene dir="row" count={24} />,
    },
    {
      title: l('Şişi ayarla', 'Adjust the needle', 'Ajusta la aguja', 'Ajuste a agulha'),
      text: l(
        'Fazla ilmek saydıysan elin sıkıdır: bir numara KALIN şişe geç. Az saydıysan elin gevşektir: bir numara İNCE şişe geç. Tutana kadar yeni bir örnek ör.',
        'More stitches than the pattern means you knit tightly: go up a needle size. Fewer means loosely: go down a size. Swatch again until it matches.',
        'Más puntos que el patrón: tejes apretado, sube un número de aguja. Menos: tejes flojo, baja un número. Repite la muestra hasta que coincida.',
        'Mais pontos que a receita: você tricota apertado, suba um número. Menos: tricota frouxo, desça um número. Refaça a amostra até bater.',
      ),
      scene: () => <NeedleGaugeScene highlight={5} />,
      tip: l('Hesaplayıcılar bölümündeki ölçü örneği dönüştürücüsü, kendi ölçünle tarifi yeniden hesaplar.', 'The gauge converter in Calculators can recalculate a pattern for your gauge.', 'El conversor de muestra en Calculadoras recalcula el patrón para tu tensión.', 'O conversor de amostra em Calculadoras recalcula a receita para a sua tensão.'),
    },
  ],
  quiz: [
    {
      q: l('Tarif 10 cm’de 18 ilmek istiyor, senin örneğinde 20 var. Ne yaparsın?', 'The pattern wants 18 stitches per 10 cm and you get 20. What do you do?', 'El patrón pide 18 puntos en 10 cm y tú tienes 20. ¿Qué haces?', 'A receita pede 18 pontos em 10 cm e você tem 20. O que faz?'),
      options: [l('Daha kalın şişe geçerim', 'Use a larger needle', 'Uso una aguja más gruesa', 'Uso uma agulha mais grossa'), l('Daha ince şişe geçerim', 'Use a smaller needle', 'Uso una aguja más fina', 'Uso uma agulha mais fina'), l('Olduğu gibi örerim', 'Knit it as is', 'Tejo igual', 'Tricoto assim mesmo')],
      answer: 0,
      explain: l('Fazla ilmek, ilmeklerin küçük olduğunu gösterir: kalın şiş ilmekleri büyütür.', 'Extra stitches mean they are small: a larger needle makes them bigger.', 'Más puntos significa que son pequeños: una aguja más gruesa los agranda.', 'Mais pontos significa que são pequenos: agulha mais grossa os aumenta.'),
    },
  ],
  summary: [
    l('15 × 15 cm ör, yıka, kurut, ortadan say.', 'Knit 15 × 15 cm, wash, dry, count in the middle.', 'Teje 15 × 15 cm, lava, seca y cuenta en el centro.', 'Tricote 15 × 15 cm, lave, seque e conte no meio.'),
    l('Fazla ilmek: kalın şiş. Az ilmek: ince şiş.', 'Too many stitches: larger needle. Too few: smaller.', 'Muchos puntos: aguja gruesa. Pocos: aguja fina.', 'Muitos pontos: agulha grossa. Poucos: agulha fina.'),
  ],
};

export default lesson;
