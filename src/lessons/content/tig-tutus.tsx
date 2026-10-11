import { HoldHookScene, TensionScene } from '@/engine/illust/scenes';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-tutus',
  intro: l(
    'Tığ sağ elde, ip sol eldedir. Tığı iki şekilde tutabilirsin: kalem gibi ya da bıçak gibi. İkisi de doğru; elin hangisini seviyorsa.',
    'The hook goes in your right hand and the yarn in your left. Hold the hook like a pencil or like a knife: both are right, use whichever feels natural.',
    'El ganchillo va en la mano derecha y la hebra en la izquierda. Sujétalo como un lápiz o como un cuchillo: ambas formas valen.',
    'A agulha vai na mão direita e o fio na esquerda. Segure como um lápis ou como uma faca: as duas formas estão certas.',
  ),
  needs: [
    { kind: 'hook', text: l('5 mm tığ', 'A 5 mm hook', 'Ganchillo de 5 mm', 'Agulha de crochê de 5 mm') },
    { kind: 'yarn', text: l('Orta kalınlıkta açık renk ip', 'Light-colored medium-weight yarn', 'Hilo medio de color claro', 'Fio médio de cor clara') },
  ],
  steps: [
    {
      title: l('Kalem tutuşu', 'Pencil grip', 'Agarre de lápiz', 'Pegada de lápis'),
      text: l('Tığı başparmak ve işaret parmağınla, başparmak yatağının üstünden kalem tutar gibi tut. Orta parmak destek olur.', 'Hold the hook between thumb and index finger at the thumb rest, as you would a pencil. Your middle finger supports it.', 'Sujeta el ganchillo entre pulgar e índice en la zona plana, como un lápiz. El dedo medio lo apoya.', 'Segure a agulha entre polegar e indicador na parte achatada, como um lápis. O dedo médio apoia.'),
      scene: () => <HoldHookScene grip="pencil" />,
      dur: 3,
    },
    {
      title: l('Bıçak tutuşu', 'Knife grip', 'Agarre de cuchillo', 'Pegada de faca'),
      text: l('Tığı avucunun içine al, işaret parmağın gövdenin üstünde uzansın; bıçak tutar gibi. Uzun işlerde bilek daha az yorulur.', 'Hold the hook under your palm with your index finger along the top, like a knife. Your wrist tires less on long projects.', 'Sujeta el ganchillo bajo la palma con el índice encima, como un cuchillo. La muñeca se cansa menos.', 'Segure a agulha sob a palma com o indicador por cima, como uma faca. O pulso cansa menos.'),
      scene: () => <HoldHookScene grip="knife" />,
      dur: 3,
    },
    {
      title: l('İp sol elde', 'Yarn in the left hand', 'Hebra en la izquierda', 'Fio na mão esquerda'),
      text: l('İpi serçe parmağına dola, işaret parmağının üstünden geçir. İşaret parmağını hafif kaldırınca ip gergin ve düzenli akar.', 'Wrap the yarn around your little finger and over your index finger. Raise the index finger slightly for even tension.', 'Enrolla la hebra en el meñique y pásala por el índice. Levanta un poco el índice para una tensión pareja.', 'Enrole o fio no mindinho e passe pelo indicador. Levante um pouco o indicador para a tensão ficar regular.'),
      scene: () => <TensionScene tool="hook" />,
      dur: 3,
      tip: l('Orta parmak ve başparmakla işi kancaya yakın tut; ilmekler böylece yerinde durur.', 'Pinch the work close to the hook with your middle finger and thumb so stitches stay put.', 'Sujeta la labor cerca del ganchillo con el medio y el pulgar para que los puntos no se muevan.', 'Segure o trabalho perto da agulha com o dedo médio e o polegar para os pontos não saírem do lugar.'),
    },
  ],
  summary: [
    l('Tığ sağ elde, ip sol işaret parmağında.', 'Hook in the right hand, yarn over the left index finger.', 'Ganchillo en la derecha, hebra en el índice izquierdo.', 'Agulha na direita, fio no indicador esquerdo.'),
    l('Kalem ya da bıçak tutuşu: hangisi rahatsa.', 'Pencil or knife grip: whichever is comfortable.', 'Lápiz o cuchillo: el que te resulte cómodo.', 'Lápis ou faca: o que for confortável.'),
  ],
};

export default lesson;
