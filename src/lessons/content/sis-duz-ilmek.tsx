import { KnitScene, knitArrows } from '@/engine/illust/knit';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-duz-ilmek',
  intro: l(
    'Düz ilmek, şiş örgüsünün yarısıdır. Dört hareketi var: bat, sar, çek, düşür. Sağ şiş her seferinde sol şişteki bir ilmeğin içinden yeni bir ilmek çeker.',
    'The knit stitch is half of all knitting. It has four moves: in, around, through, off. Each time, the right needle pulls a new loop through a stitch on the left needle.',
    'El punto derecho es la mitad del tejido. Tiene cuatro movimientos: entrar, rodear, sacar, soltar. La aguja derecha saca un punto nuevo a través de un punto de la aguja izquierda.',
    'O ponto meia é metade do tricô. São quatro movimentos: entrar, enrolar, puxar, soltar. A agulha direita puxa uma nova alça através de um ponto da agulha esquerda.',
  ),
  needs: [
    { kind: 'needles', text: l('Bir çift şiş (5 mm iyi bir başlangıç)', 'A pair of needles (5 mm is a good start)', 'Un par de agujas (5 mm para empezar)', 'Um par de agulhas (5 mm é um bom começo)') },
    { kind: 'yarn', text: l('Açık renkli, orta kalınlıkta ip', 'Light-colored medium-weight yarn', 'Hilo de grosor medio y color claro', 'Fio médio de cor clara') },
  ],
  steps: [
    {
      title: l('Hazırlan', 'Get set', 'Prepárate', 'Prepare-se'),
      text: l(
        'İlmekli şiş sol elinde, boş şiş sağ elinde. Çalışan ip (mavi) işin arkasında dursun.',
        'Hold the needle with stitches in your left hand and the empty needle in your right. Keep the working yarn (blue) at the back.',
        'La aguja con puntos en la mano izquierda y la vacía en la derecha. La hebra de trabajo (azul) queda detrás.',
        'A agulha com pontos na mão esquerda e a vazia na direita. O fio de trabalho (azul) fica atrás.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="rest" />,
    },
    {
      title: l('1 · Bat', '1 · In', '1 · Entra', '1 · Entre'),
      text: l(
        'Sağ şişin ucunu sol şişteki ilk ilmeğin ÖNÜNDEN, soldan sağa doğru sok. Sağ şiş sol şişin arkasına geçer ve iki şiş X şeklinde çaprazlanır.',
        'Insert the right needle into the FRONT of the first stitch, from left to right. The right needle goes behind the left one and the needles form an X.',
        'Introduce la aguja derecha por DELANTE del primer punto, de izquierda a derecha. Pasa por detrás de la izquierda y forman una X.',
        'Insira a agulha direita pela FRENTE do primeiro ponto, da esquerda para a direita. Ela passa por trás da esquerda e as agulhas formam um X.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="insertK" rnFrom="rest" target arrows={knitArrows.insertK(1)} />,
      tip: l('İlmeğin ön bacağı sağ şişin üstünde kalmalı.', 'The front leg of the stitch should sit over the right needle.', 'La pierna delantera del punto queda sobre la aguja derecha.', 'A perna da frente do ponto fica por cima da agulha direita.'),
    },
    {
      title: l('2 · Sar', '2 · Around', '2 · Rodea', '2 · Enrole'),
      text: l(
        'Çalışan ipi arkadan getir, sağ şişin ucunun üstünden aşırıp iki şişin arasından aşağı indir. İp sağ şişe saat yönünün tersine sarılır.',
        'Bring the working yarn from the back, over the tip of the right needle and down between the needles. The yarn wraps counterclockwise.',
        'Trae la hebra desde atrás, pásala por encima de la punta derecha y bájala entre las agujas. Se enrolla en sentido antihorario.',
        'Traga o fio de trás, passe por cima da ponta direita e desça entre as agulhas. O fio enrola no sentido anti-horário.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="insertK" wrap="k" wrapDraw={[0.1, 0.65]} arrows={knitArrows.wrapK(2)} />,
    },
    {
      title: l('3 · Çek', '3 · Through', '3 · Saca', '3 · Puxe'),
      text: l(
        'Sağ şişin ucunu, sardığın iple birlikte ilmeğin içinden öne doğru geri çek. Sağ şişte yeni bir ilmek oluşur.',
        'Bring the right needle tip, with the wrapped yarn, back through the stitch toward you. A new loop now sits on the right needle.',
        'Saca la punta derecha con la hebra enrollada a través del punto, hacia ti. Queda un punto nuevo en la aguja derecha.',
        'Traga a ponta direita com o fio enrolado de volta pelo ponto, para a frente. Uma nova alça fica na agulha direita.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="pullK" rnFrom="insertK" newLoop="k" arrows={knitArrows.pullK(3)} />,
      warn: l('Yeni ilmeği çekerken eski ilmeği sol şişten kaçırma.', 'Keep the old stitch on the left needle while you pull through.', 'No dejes caer el punto viejo mientras sacas el nuevo.', 'Não deixe o ponto antigo cair enquanto puxa o novo.'),
    },
    {
      title: l('4 · Düşür', '4 · Off', '4 · Suelta', '4 · Solte'),
      text: l(
        'Sağ şişi biraz daha sağa kaydır ve eski ilmeğin sol şişin ucundan düşmesine izin ver. Bir düz ilmek ördün.',
        'Slide the right needle a little further and let the old stitch drop off the left needle. You have made one knit stitch.',
        'Desliza la aguja derecha un poco más y deja caer el punto viejo de la aguja izquierda. Has tejido un punto derecho.',
        'Deslize a agulha direita um pouco mais e deixe o ponto antigo cair da agulha esquerda. Você fez um ponto meia.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="rest" newLoop="k" dropping={[0.2, 0.6]} arrows={knitArrows.drop(4)} />,
    },
    {
      title: l('Tekrarla', 'Repeat', 'Repite', 'Repita'),
      text: l(
        'Sol şişteki her ilmek için aynı dört hareketi yap. Sol şiş boşalınca sıra biter; dolu şişi sol eline al ve yeni sıraya başla.',
        'Repeat the four moves for every stitch on the left needle. When it is empty the row is done: swap the full needle into your left hand and begin again.',
        'Repite los cuatro movimientos en cada punto. Cuando la aguja izquierda quede vacía, termina la vuelta: cambia de mano y empieza otra.',
        'Repita os quatro movimentos em cada ponto. Quando a agulha esquerda esvaziar, a carreira acabou: troque de mão e comece outra.',
      ),
      scene: () => <KnitScene left={2} right={4} rn="rest" />,
      tip: l('Ezber cümlesi: "Kapıdan gir, etrafından dolan, pencereden çık, aşağı atla."', 'A rhyme to remember: "In through the front door, around the back, out through the window, off jumps Jack."', 'Para recordar: "entra por la puerta, rodea la casa, sale por la ventana y salta."', 'Para lembrar: "entra pela porta, dá a volta, sai pela janela e pula."'),
    },
  ],
  practice: { text: l('Şişindeki tüm ilmekleri düz ör. Her ilmekte bir kez dokun.', 'Knit every stitch on your needle. Tap once for each stitch.', 'Teje al derecho todos los puntos. Toca una vez por punto.', 'Faça meia em todos os pontos. Toque uma vez por ponto.'), target: 15, unit: 'stitch' },
  quiz: [
    {
      q: l('Düz ilmekte sağ şiş ilmeğe nereden girer?', 'Where does the right needle enter the stitch for a knit?', '¿Por dónde entra la aguja derecha en el punto derecho?', 'Por onde a agulha direita entra no ponto meia?'),
      options: [
        l('Önden, soldan sağa', 'Front, left to right', 'Por delante, de izquierda a derecha', 'Pela frente, da esquerda para a direita'),
        l('Önden, sağdan sola', 'Front, right to left', 'Por delante, de derecha a izquierda', 'Pela frente, da direita para a esquerda'),
        l('Arkadan', 'From the back', 'Por detrás', 'Por trás'),
      ],
      answer: 0,
      explain: l('Sağdan sola ve önden girmek ters ilmektir.', 'Front, right to left is the purl stitch.', 'Por delante y de derecha a izquierda es el punto revés.', 'Pela frente e da direita para a esquerda é o ponto tricô.'),
    },
    {
      q: l('Düz ilmek örerken çalışan ip nerede durur?', 'Where is the working yarn while you knit?', '¿Dónde está la hebra al tejer al derecho?', 'Onde fica o fio quando você faz meia?'),
      options: [l('İşin arkasında', 'At the back', 'Detrás de la labor', 'Atrás do trabalho'), l('İşin önünde', 'In front', 'Delante de la labor', 'Na frente do trabalho')],
      answer: 0,
    },
  ],
  summary: [
    l('Bat, sar, çek, düşür.', 'In, around, through, off.', 'Entra, rodea, saca, suelta.', 'Entre, enrole, puxe, solte.'),
    l('Düzde ip arkada, şiş önden ve soldan sağa girer.', 'For a knit, yarn at the back; enter from the front, left to right.', 'Al derecho, hebra detrás; entra por delante de izquierda a derecha.', 'Na meia, fio atrás; entre pela frente, da esquerda para a direita.'),
    l('Ön yüzde her düz ilmek bir "V" gibi görünür.', 'On the right side every knit stitch looks like a "V".', 'En el derecho cada punto parece una "V".', 'No lado direito cada ponto parece um "V".'),
  ],
};

export default lesson;
