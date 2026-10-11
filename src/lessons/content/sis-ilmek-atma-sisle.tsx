import { KnitScene, knitArrows } from '@/engine/illust/knit';
import { Arrow } from '@/engine/illust/parts';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-ilmek-atma-sisle',
  intro: l(
    'Şişle ilmek atma, düz ilmeğin ilk üç hareketini kullanır; tek fark, yeni ilmeği sol şişe geri takmaktır. Öğrenmesi en kolay yöntemdir.',
    'The knitted cast-on uses the first three moves of a knit stitch; the only difference is that you put the new loop back on the left needle.',
    'El montaje tejido usa los tres primeros movimientos del punto derecho; solo que el punto nuevo vuelve a la aguja izquierda.',
    'A montagem tricotada usa os três primeiros movimentos do ponto meia; a diferença é que o novo ponto volta para a agulha esquerda.',
  ),
  needs: [
    { kind: 'needles', text: l('Bir çift şiş', 'A pair of needles', 'Un par de agujas', 'Um par de agulhas') },
    { kind: 'yarn', text: l('Orta kalınlıkta ip', 'Medium-weight yarn', 'Hilo medio', 'Fio médio') },
  ],
  steps: [
    {
      title: l('Kaygan düğüm', 'Slip knot', 'Nudo corredizo', 'Nó corrediço'),
      text: l('Sol şişe bir kaygan düğüm tak. Bu ilk ilmeğindir.', 'Put a slip knot on the left needle. This is your first stitch.', 'Pon un nudo corredizo en la aguja izquierda. Es tu primer punto.', 'Coloque um nó corrediço na agulha esquerda. É o primeiro ponto.'),
      scene: () => <KnitScene left={1} right={0} rn="rest" noFabric />,
    },
    {
      title: l('1 · Bat', '1 · In', '1 · Entra', '1 · Entre'),
      text: l('Sağ şişi ilmeğin önünden, soldan sağa sok; iki şiş X yapar.', 'Insert the right needle into the front of the stitch, left to right; the needles cross in an X.', 'Introduce la aguja derecha por delante, de izquierda a derecha; forman una X.', 'Insira a agulha direita pela frente, da esquerda para a direita; elas formam um X.'),
      scene: () => <KnitScene left={1} right={0} rn="insertK" rnFrom="rest" target noFabric arrows={knitArrows.insertK(1)} />,
    },
    {
      title: l('2 · Sar', '2 · Around', '2 · Rodea', '2 · Enrole'),
      text: l('Çalışan ipi sağ şişin etrafına arkadan öne sar.', 'Wrap the working yarn around the right needle from back to front.', 'Enrolla la hebra alrededor de la aguja derecha, de atrás hacia delante.', 'Enrole o fio na agulha direita, de trás para a frente.'),
      scene: () => <KnitScene left={1} right={0} rn="insertK" wrap="k" wrapDraw={[0.1, 0.65]} noFabric arrows={knitArrows.wrapK(2)} />,
    },
    {
      title: l('3 · Çek', '3 · Through', '3 · Saca', '3 · Puxe'),
      text: l('Sardığın ipi ilmeğin içinden öne çek. Eski ilmeği düşürme!', 'Pull the wrapped yarn through the stitch toward you. Do not drop the old stitch!', 'Saca la hebra enrollada a través del punto. ¡No sueltes el punto viejo!', 'Puxe o fio enrolado pelo ponto. Não solte o ponto antigo!'),
      scene: () => <KnitScene left={1} right={0} rn="pullK" rnFrom="insertK" newLoop="k" noFabric arrows={knitArrows.pullK(3)} />,
    },
    {
      title: l('4 · Sol şişe tak', '4 · Onto the left needle', '4 · A la aguja izquierda', '4 · Na agulha esquerda'),
      text: l(
        'Sağ şişteki yeni ilmeği (mavi) sol şişin ucuna geçir ve sağ şişi çıkar. Artık sol şişte 2 ilmek var.',
        'Slip the new loop (blue) from the right needle onto the tip of the left needle and pull the right needle out. You now have 2 stitches.',
        'Pasa el punto nuevo (azul) a la punta de la aguja izquierda y retira la derecha. Ya tienes 2 puntos.',
        'Passe o novo ponto (azul) para a ponta da agulha esquerda e tire a direita. Agora há 2 pontos.',
      ),
      scene: () => (
        <KnitScene
          left={2}
          right={0}
          rn="away"
          noFabric
          leftColors={[YARN.second, YARN.main]}
          arrows={<Arrow d="M300 110 C280 70 240 66 214 92" n={4} start={[312, 122]} />}
        />
      ),
    },
    {
      title: l('Tekrarla', 'Repeat', 'Repite', 'Repita'),
      text: l(
        'Her seferinde en son eklediğin ilmeğe batarak istediğin sayıya ulaşana kadar devam et.',
        'Keep going, always working into the newest stitch, until you have as many as you need.',
        'Sigue siempre en el último punto añadido hasta tener los que necesitas.',
        'Continue sempre no último ponto acrescentado até ter quantos precisa.',
      ),
      scene: () => <KnitScene left={5} right={0} rn="rest" noFabric />,
      tip: l('İlmekleri sıkı çekme; şişin üstünde rahatça kaymalılar. Sıkı ilmek atma ilk sırayı zorlaştırır.', 'Do not pull the loops tight; they should slide easily. A tight cast-on makes the first row hard.', 'No aprietes los puntos; deben deslizarse. Un montaje apretado complica la primera vuelta.', 'Não aperte os pontos; eles devem deslizar. Uma montagem apertada dificulta a primeira carreira.'),
    },
  ],
  practice: { text: l('Şişine 20 ilmek at.', 'Cast on 20 stitches.', 'Monta 20 puntos.', 'Monte 20 pontos.'), target: 20, unit: 'stitch' },
  summary: [
    l('Bat, sar, çek, sol şişe tak.', 'In, around, through, back onto the left needle.', 'Entra, rodea, saca, a la izquierda.', 'Entre, enrole, puxe, volte para a esquerda.'),
    l('İlmekler şişte rahat kaymalı.', 'Loops should slide easily on the needle.', 'Los puntos deben deslizarse.', 'Os pontos devem deslizar.'),
  ],
};

export default lesson;
