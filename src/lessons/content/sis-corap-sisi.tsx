import { DpnScene } from '@/engine/illust/round';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-corap-sisi',
  intro: l(
    'Çorap şişleri iki ucu da sivri, kısa şişlerdir ve genelde beşli takım hâlinde satılır. İlmekler üç ya da dört şişe dağıtılır, boştaki şişle örülür. Annelerimizin çorap ördüğü klasik yöntem budur.',
    'Double-pointed needles are short, pointed at both ends and usually sold in sets of five. The stitches are spread over three or four needles and you knit with the spare one. It is the classic way socks have been knitted for generations.',
    'Las agujas de doble punta son cortas, con punta en ambos extremos, y suelen venir en juegos de cinco. Los puntos se reparten en tres o cuatro agujas y se teje con la libre. Es el método clásico para calcetines.',
    'As agulhas de pontas duplas são curtas, com ponta nos dois lados, e costumam vir em jogos de cinco. Os pontos são divididos em três ou quatro agulhas e você tricota com a livre. É o método clássico das meias.',
  ),
  needs: [{ kind: 'dpn', text: l('4 ya da 5 çorap şişi', 'A set of 4 or 5 double-pointed needles', 'Juego de 4 o 5 agujas de doble punta', 'Jogo de 4 ou 5 agulhas de pontas duplas') }],
  steps: [
    {
      title: l('Üç şişe dağıt', 'Divide over three', 'Reparte en tres', 'Divida em três'),
      text: l(
        'İlmekleri tek şişe at, sonra eşit olarak üç şişe aktar (örneğin 15 ilmek: 5, 5, 5). Şişleri üçgen gibi yerleştir.',
        'Cast on to one needle, then slip the stitches evenly onto three (15 stitches: 5, 5, 5). Arrange the needles in a triangle.',
        'Monta en una aguja y pasa los puntos por igual a tres (15 puntos: 5, 5, 5). Coloca las agujas en triángulo.',
        'Monte numa agulha e passe os pontos igualmente para três (15 pontos: 5, 5, 5). Arrume as agulhas em triângulo.',
      ),
      scene: () => <DpnScene phase="divide" />,
    },
    {
      title: l('Kontrol et ve birleştir', 'Check and join', 'Comprueba y une', 'Confira e una'),
      text: l(
        'İlmek atma kenarı (kahverengi) üçgenin içine bakmalı, hiçbir şişte burulmamalı. Çalışan ip son şişten gelir; ilk şişteki ilk ilmeği ör.',
        'The cast-on edge (brown) must face the inside of the triangle, untwisted on every needle. The working yarn comes from the last needle; knit the first stitch on the first needle.',
        'El borde de montaje (marrón) debe mirar hacia dentro, sin torcerse en ninguna aguja. La hebra sale de la última aguja; teje el primer punto de la primera.',
        'A borda de montagem (marrom) deve olhar para dentro, sem torcer em nenhuma agulha. O fio sai da última agulha; tricote o primeiro ponto da primeira.',
      ),
      scene: () => <DpnScene phase="join" />,
    },
    {
      title: l('Boştaki şişle ör', 'Knit with the spare needle', 'Teje con la aguja libre', 'Tricote com a agulha livre'),
      text: l(
        'Dördüncü şişle birinci şişin ilmeklerini ör. O şiş boşalınca o da yeni çalışma şişin olur ve sıradaki şişe geçersin.',
        'Use the fourth needle to knit the stitches of the first. When that needle is empty it becomes your new working needle for the next one.',
        'Con la cuarta aguja teje los puntos de la primera. Cuando esta queda vacía, pasa a ser tu aguja de trabajo para la siguiente.',
        'Com a quarta agulha tricote os pontos da primeira. Quando ela esvazia, vira a sua agulha de trabalho para a próxima.',
      ),
      scene: () => <DpnScene phase="knit" />,
    },
    {
      title: l('Köşelerde merdiven olmasın', 'No ladders at the corners', 'Sin escaleras en las esquinas', 'Sem escadinha nos cantos'),
      text: l(
        'Şişlerin birleştiği köşelerde ilmekler gevşerse dikey bir "merdiven" oluşur. Her şişin ilk iki ilmeğini sıkı çek; ya da her turda köşeleri bir ilmek kaydır.',
        'If stitches loosen where the needles meet, a vertical "ladder" appears. Tug the first two stitches on each needle, or shift the corners by one stitch every few rounds.',
        'Si los puntos se aflojan donde se juntan las agujas, aparece una "escalera". Aprieta los dos primeros puntos de cada aguja o desplaza las esquinas un punto cada pocas vueltas.',
        'Se os pontos afrouxam onde as agulhas se encontram, surge uma "escadinha". Aperte os dois primeiros pontos de cada agulha ou desloque os cantos um ponto a cada poucas voltas.',
      ),
      scene: () => <DpnScene phase="ladder" />,
      tip: l('Şişleri küçük bir lastikle ya da uç kapağıyla tutarsan işi bıraktığında ilmekler kaçmaz.', 'Point protectors or a small band keep stitches from sliding off when you put the work down.', 'Unos tapones en las puntas evitan que se escapen los puntos al dejar la labor.', 'Protetores de ponta evitam que os pontos escapem quando você larga o trabalho.'),
    },
  ],
  practice: {
    text: l('Çorap şişlerine 36 ilmek at (12, 12, 12), birleştir ve 10 tur 2 düz 2 ters lastik ör.', 'Cast 36 stitches onto DPNs (12, 12, 12), join and knit 10 rounds of k2, p2 rib.', 'Monta 36 puntos en agujas de doble punta (12, 12, 12), une y teje 10 vueltas de elástico 2×2.', 'Monte 36 pontos nas agulhas de pontas duplas (12, 12, 12), una e tricote 10 voltas de ribana 2×2.'),
    target: 10,
    unit: 'round',
  },
  quiz: [
    {
      q: l('Köşelerde dikey boşluk (merdiven) neden olur?', 'What causes a vertical ladder at the corners?', '¿Qué causa la escalera en las esquinas?', 'O que causa a escadinha nos cantos?'),
      options: [l('Şiş geçişindeki gevşek ilmekler', 'Loose stitches at the needle changes', 'Puntos flojos al cambiar de aguja', 'Pontos frouxos na troca de agulha'), l('Kalın ip', 'Thick yarn', 'Hilo grueso', 'Fio grosso'), l('Yanlış renk', 'The wrong color', 'Color equivocado', 'Cor errada')],
      answer: 0,
    },
  ],
  summary: [
    l('İlmekleri 3–4 şişe dağıt, boştakiyle ör.', 'Spread stitches over 3–4 needles, knit with the spare.', 'Reparte en 3–4 agujas y teje con la libre.', 'Divida em 3–4 agulhas e tricote com a livre.'),
    l('Köşelerde ilk ilmekleri sıkı çek.', 'Snug the first stitches at each corner.', 'Aprieta los primeros puntos en cada esquina.', 'Aperte os primeiros pontos em cada canto.'),
  ],
};

export default lesson;
