import { KnitScene, knitArrows } from '@/engine/illust/knit';
import { SwatchScene, swatchRows } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const P = ['p', 'p', 'p', 'p'] as ('k' | 'p')[];

const lesson: Lesson = {
  id: 'sis-ters-ilmek',
  intro: l(
    'Ters ilmek, düz ilmeğin aynadaki hâlidir: ip önde durur, şiş ilmeğe sağdan sola girer. Düzle tersi birlikte bilince her deseni örebilirsin.',
    'The purl stitch is the mirror image of the knit: yarn in front, needle enters right to left. With knit and purl together you can make any texture.',
    'El punto revés es el espejo del derecho: hebra delante y la aguja entra de derecha a izquierda. Con ambos puedes hacer cualquier textura.',
    'O ponto tricô é o espelho do meia: fio na frente e a agulha entra da direita para a esquerda. Com os dois você faz qualquer textura.',
  ),
  steps: [
    {
      title: l('İp önde', 'Yarn in front', 'Hebra delante', 'Fio na frente'),
      text: l('Çalışan ipi iki şişin arasından işin önüne getir.', 'Bring the working yarn between the needles to the front of the work.', 'Lleva la hebra entre las agujas hacia delante de la labor.', 'Traga o fio entre as agulhas para a frente do trabalho.'),
      scene: () => <KnitScene left={4} right={2} rn="rest" yarn="front" leftKinds={P} rightKinds={['p', 'p']} />,
    },
    {
      title: l('1 · Bat', '1 · In', '1 · Entra', '1 · Entre'),
      text: l('Sağ şişi ilk ilmeğin önünden, sağdan sola sok. Sağ şiş sol şişin ÖNÜNDE kalır.', 'Insert the right needle into the front of the first stitch, right to left. The right needle stays IN FRONT of the left one.', 'Introduce la aguja derecha por delante del punto, de derecha a izquierda. Queda DELANTE de la izquierda.', 'Insira a agulha direita pela frente do ponto, da direita para a esquerda. Ela fica NA FRENTE da esquerda.'),
      scene: () => <KnitScene left={4} right={2} rn="insertP" rnFrom="rest" yarn="front" target leftKinds={P} arrows={knitArrows.insertP(1)} />,
    },
    {
      title: l('2 · Sar', '2 · Around', '2 · Rodea', '2 · Enrole'),
      text: l('İpi sağ şişin üstünden öne doğru aşırıp iki şişin arasından aşağı indir (saat yönünün tersine).', 'Wrap the yarn over the top of the right needle and down between the needles, counterclockwise.', 'Pasa la hebra por encima de la aguja derecha y bájala entre las agujas, en sentido antihorario.', 'Passe o fio por cima da agulha direita e desça entre as agulhas, no sentido anti-horário.'),
      scene: () => <KnitScene left={4} right={2} rn="insertP" yarn="front" wrap="p" wrapDraw={[0.1, 0.65]} leftKinds={P} arrows={knitArrows.wrapP(2)} />,
    },
    {
      title: l('3 · İt', '3 · Push through', '3 · Empuja', '3 · Empurre'),
      text: l('Sağ şişin ucunu, sardığın iple birlikte ilmeğin içinden arkaya doğru it.', 'Push the right needle tip, with the wrapped yarn, back through the stitch away from you.', 'Empuja la punta derecha con la hebra a través del punto, hacia atrás.', 'Empurre a ponta direita com o fio pelo ponto, para trás.'),
      scene: () => <KnitScene left={4} right={2} rn="pullP" rnFrom="insertP" yarn="front" leftKinds={P} arrows={knitArrows.pullP(3)} />,
    },
    {
      title: l('4 · Düşür', '4 · Off', '4 · Suelta', '4 · Solte'),
      text: l('Eski ilmeği sol şişten düşür. Bir ters ilmek ördün; ip yine önde.', 'Let the old stitch slide off the left needle. One purl stitch done; the yarn stays in front.', 'Deja caer el punto viejo. Un punto revés hecho; la hebra sigue delante.', 'Deixe o ponto antigo cair. Um ponto tricô feito; o fio continua na frente.'),
      scene: () => <KnitScene left={4} right={2} rn="rest" yarn="front" newLoop="p" dropping={[0.2, 0.6]} leftKinds={P} rightKinds={['p', 'p']} arrows={knitArrows.drop(4)} />,
    },
    {
      title: l('Ters ilmeğin yüzü', 'What purl looks like', 'Así se ve el revés', 'Assim fica o tricô'),
      text: l('Ters ilmek önden küçük bir boncuk gibi görünür. Arkasından bakınca aslında bir düz ilmektir.', 'A purl stitch looks like a little bump from the front. From the back it is a knit stitch.', 'El revés parece un granito por delante. Por detrás es un punto derecho.', 'O tricô parece uma bolinha pela frente. Por trás é um ponto meia.'),
      scene: () => <SwatchScene rows={swatchRows('jarse-back', 11, 8)} />,
      dur: 3,
    },
  ],
  practice: { text: l('Bir sıra baştan sona ters ör.', 'Purl a whole row.', 'Teje una vuelta entera al revés.', 'Faça uma carreira inteira em tricô.'), target: 20, unit: 'stitch' },
  quiz: [
    {
      q: l('Ters ilmekte ip nerede?', 'Where is the yarn for a purl?', '¿Dónde va la hebra al tejer revés?', 'Onde fica o fio no ponto tricô?'),
      options: [l('Önde', 'In front', 'Delante', 'Na frente'), l('Arkada', 'At the back', 'Detrás', 'Atrás')],
      answer: 0,
    },
  ],
  summary: [
    l('İp önde, şiş sağdan sola.', 'Yarn in front, needle right to left.', 'Hebra delante, aguja de derecha a izquierda.', 'Fio na frente, agulha da direita para a esquerda.'),
    l('Ters ilmek önden boncuk gibi görünür.', 'A purl looks like a bump from the front.', 'El revés parece un granito.', 'O tricô parece uma bolinha.'),
  ],
};

export default lesson;
