import { SlipKnotScene } from '@/engine/illust/scenes';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'haz-kaygan-dugum',
  intro: l(
    'Kaygan düğüm, şişin de tığın da ilk ilmeğidir. Bir ucunu çekince sıkılır, diğerini çekince bollaşır.',
    'The slip knot is the very first loop for both knitting and crochet. Pull one end to tighten it, the other to loosen.',
    'El nudo corredizo es el primer punto en dos agujas y en ganchillo. Un cabo lo aprieta, el otro lo afloja.',
    'O nó corrediço é o primeiro ponto no tricô e no crochê. Uma ponta aperta, a outra afrouxa.',
  ),
  needs: [
    { kind: 'yarn', text: l('Bir ip ucu', 'A yarn end', 'Un cabo de hilo', 'Uma ponta de fio') },
    { kind: 'needles', text: l('Bir şiş ya da tığ', 'A needle or hook', 'Una aguja o ganchillo', 'Uma agulha ou agulha de crochê') },
  ],
  steps: [
    {
      title: l('Halka yap', 'Make a loop', 'Haz un lazo', 'Faça uma laçada'),
      text: l(
        'Uçtan 15 cm kadar bırak. Yumağa giden ipi (mavi) kuyruğun (sarı) üstünden geçirerek bir halka oluştur.',
        'Leave a 15 cm tail. Cross the yarn going to the ball (blue) over the tail (yellow) to form a loop.',
        'Deja una cola de 15 cm. Cruza el hilo del ovillo (azul) sobre la cola (amarilla) formando un lazo.',
        'Deixe uma ponta de 15 cm. Cruze o fio do novelo (azul) por cima da ponta (amarela) formando uma laçada.',
      ),
      scene: () => <SlipKnotScene phase="loop" />,
    },
    {
      title: l('İçinden çek', 'Pull through', 'Saca por dentro', 'Puxe por dentro'),
      text: l(
        'Yumak tarafındaki ipten bir kat yap ve halkanın içinden arkadan öne doğru çek. Yeni bir ilmek oluşur.',
        'Fold the ball-side yarn into a bight and pull it through the loop from back to front. A new loop appears.',
        'Haz una doblez con el hilo del ovillo y sácala por el lazo de atrás hacia delante. Aparece un nuevo lazo.',
        'Faça uma dobra com o fio do novelo e puxe pela laçada de trás para a frente. Surge uma nova laçada.',
      ),
      scene: () => <SlipKnotScene phase="through" />,
    },
    {
      title: l('Şişe tak ve sık', 'On the needle, snug it', 'A la aguja y ajusta', 'Na agulha e ajuste'),
      text: l(
        'Yeni ilmeği şişe geçir. İki ucu ayrı yönlere çekerek ilmeği şişin üstünde rahatça kayacak kadar sık; boğma.',
        'Slip the new loop onto the needle. Pull both ends apart until it sits snugly but still slides; do not strangle the needle.',
        'Pasa el lazo a la aguja. Tira de ambos cabos hasta que quede ajustado pero deslice; no lo aprietes demasiado.',
        'Coloque a laçada na agulha. Puxe as duas pontas até ficar justa mas ainda deslizando; não estrangule a agulha.',
      ),
      scene: () => <SlipKnotScene phase="tighten" />,
    },
    {
      title: l('Tığda da aynı', 'Same on a hook', 'Igual en ganchillo', 'Igual no crochê'),
      text: l(
        'Tığ işinde aynı düğümü tığın gövdesine takarsın. Tığdaki bu ilk ilmek sayılmaz.',
        'For crochet, place the same knot on the hook shaft. This first loop on the hook is never counted as a stitch.',
        'En ganchillo, el mismo nudo va en la aguja. Este primer lazo nunca cuenta como punto.',
        'No crochê, o mesmo nó vai na agulha. Essa primeira laçada nunca conta como ponto.',
      ),
      scene: () => <SlipKnotScene phase="onHook" tool="hook" />,
    },
  ],
  practice: { text: l('Kaygan düğümü yap, çöz ve tekrar yap.', 'Make a slip knot, undo it and make it again.', 'Haz el nudo, deshazlo y vuelve a hacerlo.', 'Faça o nó, desfaça e faça de novo.'), target: 5, unit: 'stitch' },
  summary: [
    l('Halka yap, içinden ilmek çek, şişe tak.', 'Make a loop, pull a loop through, place it on the needle.', 'Lazo, saca otro lazo por dentro, a la aguja.', 'Laçada, puxe outra por dentro, coloque na agulha.'),
    l('Tığdaki ilk ilmek sayılmaz.', 'The loop on a hook is not counted.', 'El lazo en el ganchillo no cuenta.', 'A laçada na agulha de crochê não conta.'),
  ],
};

export default lesson;
