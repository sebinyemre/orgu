import { HatScene } from '@/engine/illust/round';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-ilk-bere',
  intro: l(
    'Bere, yuvarlak örgünün en güzel ilk projesidir: lastik, düz gövde ve tepe eksiltmesi. Bu derste kendi ölçüne göre bir bere hesaplayıp baştan sona öreceksin. Örnek hesap 10 cm’de 20 ilmek ve 54 cm baş çevresi içindir.',
    'A hat is the best first project in the round: ribbing, a plain body and crown decreases. In this lesson you will size a hat for yourself and knit it start to finish. The worked example uses 20 stitches per 10 cm and a 54 cm (21¼ in) head.',
    'El gorro es el mejor primer proyecto en redondo: elástico, cuerpo liso y disminuciones de coronilla. Aquí calcularás un gorro a tu medida y lo tejerás de principio a fin. El ejemplo usa 20 puntos en 10 cm y 54 cm de cabeza.',
    'O gorro é o melhor primeiro projeto em círculo: ribana, corpo liso e diminuições no topo. Nesta lição você calcula um gorro na sua medida e tricota do começo ao fim. O exemplo usa 20 pontos em 10 cm e 54 cm de cabeça.',
  ),
  needs: [
    { kind: 'circular', text: l('40 cm misinalı şiş (ipin numarası)', '40 cm (16 in) circular in your yarn’s size', 'Circular de 40 cm del número del hilo', 'Circular de 40 cm no número do fio') },
    { kind: 'dpn', text: l('Tepe için çorap şişleri ya da uzun misina', 'DPNs or a long circular for the crown', 'Agujas de doble punta o circular larga para la coronilla', 'Agulhas de pontas duplas ou circular longa para o topo') },
    { kind: 'yarn', text: l('Yaklaşık 100 g orta kalınlıkta ip', 'About 100 g of worsted-weight yarn', 'Unos 100 g de hilo medio', 'Cerca de 100 g de fio médio') },
    { kind: 'markers', text: l('8 işaretçi (biri farklı renk)', '8 markers (one in a different color)', '8 marcadores (uno de otro color)', '8 marcadores (um de outra cor)') },
    { kind: 'tapestry', text: l('Yün iğnesi', 'Tapestry needle', 'Aguja lanera', 'Agulha de tapeçaria') },
  ],
  steps: [
    {
      title: l('Ölç ve hesapla', 'Measure and calculate', 'Mide y calcula', 'Meça e calcule'),
      text: l(
        'Başını kulakların üstünden ölç: 54 cm. Bere esnemeli, bu yüzden %10 küçük ör: 48,6 cm. 10 cm’de 20 ilmek → cm’de 2 ilmek → 97. Hem lastiğe (4’ün katı) hem tepeye (8’in katı) uysun diye 96 ilmek at.',
        'Measure around your head above the ears: 54 cm. A hat should stretch, so knit it 10% smaller: 48.6 cm. 20 stitches per 10 cm → 2 per cm → 97. Round to 96 so it fits both the rib (multiple of 4) and the crown (multiple of 8).',
        'Mide la cabeza por encima de las orejas: 54 cm. El gorro debe ceñir, así que un 10% menos: 48,6 cm. 20 puntos en 10 cm → 2 por cm → 97. Redondea a 96: múltiplo de 4 (elástico) y de 8 (coronilla).',
        'Meça a cabeça acima das orelhas: 54 cm. O gorro deve ajustar, então 10% menor: 48,6 cm. 20 pontos em 10 cm → 2 por cm → 97. Arredonde para 96: múltiplo de 4 (ribana) e de 8 (topo).',
      ),
      scene: () => <HatScene part="measure" />,
      tip: l('Hesaplayıcılardaki beden tablosu ve ilmek sayısı hesaplayıcısı bunu senin için yapar.', 'The size tables and stitch count calculator in Calculators do this for you.', 'Las tablas de tallas y la calculadora de puntos lo hacen por ti.', 'As tabelas de medidas e a calculadora de pontos fazem isso por você.'),
    },
    {
      title: l('Lastik', 'Brim', 'Elástico', 'Ribana'),
      text: l(
        '96 ilmek at, burulmadan birleştir, tur başına farklı renk işaretçiyi tak. 5 cm boyunca *2 düz, 2 ters* lastik ör.',
        'Cast on 96, join without twisting and place the odd-colored marker. Work *k2, p2* rib for 5 cm (2 in).',
        'Monta 96, une sin torcer y pon el marcador de otro color. Teje elástico *2 d, 2 r* durante 5 cm.',
        'Monte 96, una sem torcer e coloque o marcador de outra cor. Faça ribana *2 m, 2 t* por 5 cm.',
      ),
      scene: () => <HatScene part="brim" />,
    },
    {
      title: l('Gövde', 'Body', 'Cuerpo', 'Corpo'),
      text: l(
        'Her turu düz örerek jarse devam et. Başlangıçtan itibaren 15 cm olunca tepeye geç (yetişkin için toplam boy yaklaşık 20 cm olur).',
        'Knit every round in stockinette until the hat measures 15 cm (6 in) from the cast-on edge (about 20 cm in total for an adult).',
        'Teje todas las vueltas del derecho hasta 15 cm desde el montaje (unos 20 cm en total para adulto).',
        'Tricote todas as voltas em meia até 15 cm desde a montagem (uns 20 cm no total para adulto).',
      ),
      scene: () => <HatScene part="body" />,
    },
    {
      title: l('Tepe eksiltmesi', 'Crown decreases', 'Disminuciones de coronilla', 'Diminuições do topo'),
      text: l(
        'Turu 12’şer ilmeklik 8 parçaya böl, aralara işaretçi tak. Eksiltme turu: *işaretçiden önceki 2 ilmeğe kadar düz, 2 birlikte*. Önce bir eksiltme bir düz tur, 48 ilmek kalınca her tur eksilt. 8 ilmek kalınca dur.',
        'Divide the round into 8 sections of 12 with markers. Decrease round: *knit to 2 before the marker, k2tog*. Alternate decrease and plain rounds, then decrease every round once 48 remain. Stop at 8 stitches.',
        'Divide la vuelta en 8 partes de 12 con marcadores. Vuelta de disminución: *derecho hasta 2 antes del marcador, 2 juntos*. Alterna con vueltas lisas y, al quedar 48, disminuye en cada vuelta. Para con 8 puntos.',
        'Divida a volta em 8 partes de 12 com marcadores. Volta de diminuição: *meia até 2 antes do marcador, 2 juntos*. Alterne com voltas lisas e, ao sobrar 48, diminua em toda volta. Pare com 8 pontos.',
      ),
      scene: () => <HatScene part="crown" />,
      tip: l('İlmekler misinaya sığmayınca magic loop ya da çorap şişlerine geç.', 'When the stitches no longer fit the cable, switch to magic loop or DPNs.', 'Cuando los puntos ya no quepan, pasa a magic loop o agujas de doble punta.', 'Quando os pontos não couberem mais, passe para magic loop ou agulhas de pontas duplas.'),
    },
    {
      title: l('Tepeyi kapat', 'Close the top', 'Cierra la coronilla', 'Feche o topo'),
      text: l(
        'İpi 20 cm bırakarak kes. Yün iğnesiyle kalan 8 ilmeğin içinden geçir, şişten çıkar ve sıkıca büz. Ucu içeride gizle.',
        'Cut the yarn leaving 20 cm (8 in). Thread it through the remaining 8 stitches with a tapestry needle, take them off and pull tight. Weave in the end inside.',
        'Corta dejando 20 cm. Con la aguja lanera pásala por los 8 puntos, sácalos y frunce fuerte. Esconde la hebra por dentro.',
        'Corte deixando 20 cm. Com a agulha de tapeçaria passe pelos 8 pontos, tire-os e franza bem. Esconda a ponta por dentro.',
      ),
      scene: () => <HatScene part="close" />,
    },
    {
      title: l('Bitti', 'Done', 'Listo', 'Pronto'),
      text: l('Bereni yıka ve düz kurut. Lastik toparlanır, jarse yumuşar.', 'Wash and dry the hat flat. The rib bounces back and the stockinette softens.', 'Lava el gorro y sécalo en plano. El elástico recupera y el jersey se suaviza.', 'Lave o gorro e seque na horizontal. A ribana volta e o jersey amacia.'),
      scene: () => <HatScene part="all" />,
    },
  ],
  quiz: [
    {
      q: l('Baş 54 cm, ölçü 10 cm’de 20 ilmek. %10 küçültüp lastiğe ve tepeye uyacak sayı hangisi?', 'Head 54 cm, gauge 20 sts per 10 cm. With 10% negative ease, which count fits rib and crown?', 'Cabeza 54 cm, muestra 20 puntos en 10 cm. Con un 10% menos, ¿qué número sirve?', 'Cabeça 54 cm, amostra 20 pontos em 10 cm. Com 10% a menos, qual número serve?'),
      options: [l('96', '96', '96', '96'), l('108', '108', '108', '108'), l('120', '120', '120', '120')],
      answer: 0,
      explain: l('54 × 0,9 × 2 = 97; 4’e ve 8’e bölünen en yakın sayı 96.', '54 × 0.9 × 2 = 97; the nearest multiple of both 4 and 8 is 96.', '54 × 0,9 × 2 = 97; el múltiplo de 4 y 8 más cercano es 96.', '54 × 0,9 × 2 = 97; o múltiplo de 4 e 8 mais próximo é 96.'),
    },
  ],
  summary: [
    l('Baş çevresi × 0,9 × cm’deki ilmek = ilmek sayısı.', 'Head × 0.9 × stitches per cm = cast-on.', 'Cabeza × 0,9 × puntos por cm = montaje.', 'Cabeça × 0,9 × pontos por cm = montagem.'),
    l('Lastik, gövde, 8 parçalı tepe, büz.', 'Rib, body, crown in 8 sections, gather.', 'Elástico, cuerpo, coronilla en 8 partes, fruncir.', 'Ribana, corpo, topo em 8 partes, franzir.'),
  ],
};

export default lesson;
