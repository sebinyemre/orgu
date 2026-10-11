import { HoldNeedlesScene, TensionScene } from '@/engine/illust/scenes';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-tutus',
  intro: l(
    'Şişleri tutmanın iki yaygın yolu var: ipi sağ elde tutan "atma" (İngiliz) ve ipi sol elde tutan "çekme" (Kıta) yöntemi. İkisi de doğrudur; sana rahat geleni seç.',
    'There are two common ways to hold needles: yarn in the right hand ("throwing", English style) or in the left ("picking", Continental). Both are correct; choose what feels natural.',
    'Hay dos formas habituales: hebra en la mano derecha (estilo inglés) o en la izquierda (estilo continental). Las dos son correctas; elige la más cómoda.',
    'Há duas formas comuns: fio na mão direita (estilo inglês) ou na esquerda (estilo continental). As duas estão certas; escolha a mais confortável.',
  ),
  needs: [{ kind: 'needles', text: l('Bir çift şiş', 'A pair of needles', 'Un par de agujas', 'Um par de agulhas') }],
  steps: [
    {
      title: l('Sol şiş ilmekleri taşır', 'The left needle carries the stitches', 'La aguja izquierda lleva los puntos', 'A agulha esquerda leva os pontos'),
      text: l(
        'İlmekli şişi sol elinle, şiş ucuna yakın tut. Başparmağın ve işaret parmağın ilk ilmekleri uca doğru iter.',
        'Hold the needle with stitches in your left hand, near the tip. Your thumb and index finger nudge the stitches toward the tip.',
        'Sujeta la aguja con puntos en la izquierda, cerca de la punta. Pulgar e índice empujan los puntos hacia la punta.',
        'Segure a agulha com os pontos na mão esquerda, perto da ponta. Polegar e indicador empurram os pontos para a ponta.',
      ),
      scene: () => <HoldNeedlesScene style="english" />,
      dur: 3,
    },
    {
      title: l('İp sağ elde', 'Yarn in the right hand', 'Hebra en la derecha', 'Fio na mão direita'),
      text: l(
        'İngiliz yönteminde ip sağ işaret parmağının üstünden geçer. Her ilmekte parmağınla ipi şişin etrafına "atarsın".',
        'In English style the yarn runs over your right index finger and you "throw" it around the needle for each stitch.',
        'En estilo inglés la hebra pasa sobre el índice derecho y la "lanzas" alrededor de la aguja.',
        'No estilo inglês o fio passa sobre o indicador direito e você o "joga" em volta da agulha.',
      ),
      scene: () => <HoldNeedlesScene style="english" />,
      dur: 3,
    },
    {
      title: l('İp sol elde', 'Yarn in the left hand', 'Hebra en la izquierda', 'Fio na mão esquerda'),
      text: l(
        'Kıta yönteminde ip sol işaret parmağındadır ve sağ şiş ipi "yakalar". Tığ işi bilenler bu yöntemi hızlı öğrenir.',
        'In Continental style the yarn sits on your left index finger and the right needle "picks" it. Crocheters often find this easier.',
        'En estilo continental la hebra va en el índice izquierdo y la aguja derecha la "recoge". Quien sabe ganchillo lo aprende rápido.',
        'No estilo continental o fio fica no indicador esquerdo e a agulha direita o "pega". Quem faz crochê aprende rápido.',
      ),
      scene: () => <TensionScene tool="needle" />,
      dur: 3,
    },
    {
      title: l('Gerginlik', 'Tension', 'Tensión', 'Tensão'),
      text: l(
        'İpi serçe parmağına bir kez dolayıp işaret parmağının üstünden geçirirsen akış düzenli olur. İp ne gevşek ne de gergin olmalı.',
        'Wrapping the yarn once around your little finger and over your index finger gives an even flow: not too loose, not too tight.',
        'Enrollar la hebra una vez en el meñique y pasarla por el índice da un flujo regular: ni flojo ni tenso.',
        'Enrolar o fio uma vez no mindinho e passar pelo indicador dá um fluxo regular: nem frouxo nem apertado.',
      ),
      scene: () => <TensionScene tool="needle" />,
      dur: 3,
      tip: l('Omuzlarını gevşet. Kaslar gerilirse ilmekler de sıkılaşır.', 'Relax your shoulders. Tense muscles make tight stitches.', 'Relaja los hombros. Si te tensas, los puntos se aprietan.', 'Relaxe os ombros. Músculos tensos deixam os pontos apertados.'),
    },
  ],
  summary: [
    l('İlmekler sol şişte, iş sağ şişe geçer.', 'Stitches start on the left needle and move to the right.', 'Los puntos pasan de la aguja izquierda a la derecha.', 'Os pontos passam da agulha esquerda para a direita.'),
    l('İngiliz: ip sağ elde. Kıta: ip sol elde.', 'English: yarn in the right hand. Continental: in the left.', 'Inglés: hebra en la derecha. Continental: en la izquierda.', 'Inglês: fio na direita. Continental: na esquerda.'),
  ],
};

export default lesson;
