import { TunisianScene } from '@/engine/illust/crochet2';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-tunus',
  intro: l(
    'Tunus işi tığla şiş arasında bir tekniktir: uzun bir Tunus tığıyla, sıranın tüm ilmeklerini tığda toplarsın (gidiş), sonra ikişer ikişer kapatarak geri dönersin (dönüş). İş hiç çevrilmez. Ortaya sık, dokuma gibi, az esneyen bir kumaş çıkar.',
    'Tunisian crochet sits between crochet and knitting: with a long Tunisian hook you gather a whole row of loops on the hook (forward pass), then close them two at a time on the way back (return pass). You never turn the work. The fabric is dense, woven-looking and stable.',
    'El ganchillo tunecino está entre el ganchillo y el punto: con una aguja larga recoges todos los lazos de la vuelta (ida) y luego los cierras de dos en dos (vuelta). Nunca giras. Sale un tejido denso, como tela.',
    'O crochê tunisiano fica entre o crochê e o tricô: com uma agulha longa você junta todas as alças da carreira (ida) e depois fecha de duas em duas (volta). Nunca vira. Sai um tecido denso, como pano.',
  ),
  needs: [{ kind: 'hook', text: l('Uzun Tunus tığı (ucunda durdurucu olan)', 'A long Tunisian hook with a stopper', 'Aguja tunecina larga con tope', 'Agulha tunisiana longa com trava') }],
  steps: [
    {
      title: l('Gidiş: çubuktan ilmek al', 'Forward: pick up from each bar', 'Ida: recoge de cada barra', 'Ida: pegue de cada barra'),
      text: l(
        'Tığı alttaki sıranın bir sonraki DİKEY çubuğunun altından sağdan sola sok, ip at ve bir ilmek çek. Bu ilmeği tığda bırak. Sıranın sonuna kadar tekrarla.',
        'Insert the hook right to left under the next VERTICAL bar of the row below, yarn over and pull up a loop. Keep it on the hook. Repeat to the end of the row.',
        'Mete la aguja de derecha a izquierda bajo la siguiente barra VERTICAL, lazada y saca un lazo. Déjalo en la aguja. Repite hasta el final.',
        'Passe a agulha da direita para a esquerda sob a próxima barra VERTICAL, laçada e puxe uma alça. Deixe na agulha. Repita até o fim.',
      ),
      scene: () => <TunisianScene pass="forward" onHook={4} />,
      tip: l('Her ilmeği aynı boyda tut; Tunus işinde gerginlik her şeydir.', 'Keep every loop the same height; in Tunisian, tension is everything.', 'Mantén todos los lazos a la misma altura.', 'Mantenha todas as alças da mesma altura.'),
    },
    {
      title: l('Dönüş: ikişer kapat', 'Return: close two at a time', 'Vuelta: cierra de dos en dos', 'Volta: feche de duas em duas'),
      text: l(
        'Önce ip at ve 1 ilmekten geçir. Sonra "ip at, 2 ilmekten geçir" ile soldan sağa ilerle. Tığda 1 ilmek kalınca sıra biter; bu ilmek yeni sıranın ilk ilmeğidir.',
        'Yarn over and pull through 1 loop first. Then "yarn over, pull through 2" across from left to right. When 1 loop remains, the row is done; it counts as the first stitch of the next row.',
        'Primero lazada y pasa por 1 lazo. Luego "lazada, cierra 2" de izquierda a derecha. Cuando queda 1, termina la vuelta.',
        'Primeiro laçada e passe por 1 alça. Depois "laçada, feche 2" da esquerda para a direita. Quando sobra 1, a carreira acabou.',
      ),
      scene: () => <TunisianScene pass="return" onHook={4} />,
    },
    {
      title: l('Tunus kumaşı', 'Tunisian fabric', 'Tejido tunecino', 'Tecido tunisiano'),
      text: l(
        'Tunus basit ilmeği dikey çubuklar ve yatay zincirlerle küçük karelerden oluşan bir ızgara gibi görünür. Bu karelerin üstüne çarpı işi yapmak çok kolaydır.',
        'Tunisian simple stitch looks like a grid of small squares made of vertical bars and horizontal chains. It’s easy to cross-stitch on top.',
        'El punto tunecino simple parece una cuadrícula de barras verticales y cadenetas horizontales. Es fácil bordar punto de cruz encima.',
        'O ponto tunisiano simples parece uma grade de barras verticais e correntinhas horizontais. É fácil bordar ponto cruz por cima.',
      ),
      scene: () => <TunisianScene pass="fabric" />,
      warn: l('Tunus kumaşı kıvrılmaya meyillidir; bir numara kalın tığ ve kenara bir {sc} sırası bunu azaltır.', 'Tunisian fabric tends to curl; a larger hook and a {sc} border help.', 'Tiende a enrollarse: una aguja más gruesa y un borde de {sc} ayudan.', 'Tende a enrolar: agulha maior e uma borda de {sc} ajudam.'),
    },
  ],
  practice: {
    text: l('15 zincir çek ve 8 sıra Tunus basit ilmeği ör.', 'Chain 15 and work 8 rows of Tunisian simple stitch.', 'Haz 15 cadenetas y teje 8 vueltas de punto tunecino simple.', 'Faça 15 correntinhas e 8 carreiras de ponto tunisiano simples.'),
    target: 8,
    unit: 'row',
  },
  quiz: [
    {
      q: l('Tunus işinde iş ne zaman çevrilir?', 'When do you turn the work in Tunisian crochet?', '¿Cuándo se gira la labor en tunecino?', 'Quando se vira o trabalho no tunisiano?'),
      options: [l('Hiç çevrilmez', 'Never', 'Nunca', 'Nunca'), l('Her sırada', 'Every row', 'Cada vuelta', 'Toda carreira'), l('Her iki sırada', 'Every two rows', 'Cada dos vueltas', 'A cada duas carreiras')],
      answer: 0,
    },
  ],
  summary: [l('Gidişte ilmek topla, dönüşte ikişer kapat; hiç çevirme.', 'Gather loops going, close two at a time returning; never turn.', 'Recoge a la ida, cierra de dos en dos a la vuelta; nunca gires.', 'Junte na ida, feche de duas em duas na volta; nunca vire.')],
};

export default lesson;
