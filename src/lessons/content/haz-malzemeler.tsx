import { ToolsBoardScene } from '@/engine/illust/info';
import { l, type Lesson } from '../types';

const ALL = ['needles', 'circular', 'hook', 'yarn', 'scissors', 'tapestry', 'markers', 'tape'] as const;

const lesson: Lesson = {
  id: 'haz-malzemeler',
  intro: l(
    'Örgüye başlamak için çok az şeye ihtiyacın var. Bu derste çantana neleri koyacağını ve her birinin ne işe yaradığını göreceksin.',
    'You need very little to start. In this lesson you will see what goes in your bag and what each tool is for.',
    'Necesitas muy poco para empezar. En esta lección verás qué poner en tu bolsa y para qué sirve cada cosa.',
    'Você precisa de muito pouco para começar. Nesta aula você vai ver o que colocar na bolsa e para que serve cada coisa.',
  ),
  steps: [
    {
      title: l('Hepsi bir arada', 'Everything together', 'Todo junto', 'Tudo junto'),
      text: l(
        'Şiş ya da tığ, ip, makas, yün iğnesi, işaretleyici ve mezura. Başlangıç için bu kadarı yeter.',
        'Needles or a hook, yarn, scissors, a tapestry needle, stitch markers and a tape measure. That is all you need to begin.',
        'Agujas o ganchillo, hilo, tijeras, aguja lanera, marcadores y cinta métrica. Con eso basta para empezar.',
        'Agulhas ou agulha de crochê, fio, tesoura, agulha de tapeçaria, marcadores e fita métrica. Isso basta para começar.',
      ),
      scene: () => <ToolsBoardScene kinds={[...ALL]} />,
      dur: 3,
    },
    {
      title: l('Şiş ve tığ', 'Needles and hook', 'Agujas y ganchillo', 'Agulhas e agulha de crochê'),
      text: l(
        'Şiş örgüsü için bir çift düz şiş ya da misinalı şiş, tığ işi için bir tığ. Başlangıçta 4,5–5 mm iyi bir seçimdir; bambu şişte ilmekler kaymaz.',
        'For knitting, a pair of straight needles or a circular needle; for crochet, one hook. 4.5–5 mm is a good start, and bamboo keeps stitches from sliding off.',
        'Para dos agujas, un par de agujas rectas o una circular; para ganchillo, una aguja de ganchillo. 4,5–5 mm es buen comienzo; el bambú no resbala.',
        'Para tricô, um par de agulhas retas ou uma circular; para crochê, uma agulha de crochê. 4,5–5 mm é um bom começo; bambu não deixa os pontos escorregarem.',
      ),
      scene: () => <ToolsBoardScene kinds={[...ALL]} highlight={['needles', 'circular', 'hook']} />,
      dur: 3,
    },
    {
      title: l('İp', 'Yarn', 'Hilo', 'Fio'),
      text: l(
        'İlk işin için açık renkli, düz yüzeyli, orta kalınlıkta bir ip seç. Koyu ve tüylü iplerde ilmekleri görmek zordur.',
        'For your first piece choose a smooth, light-colored, medium-weight yarn. Dark or fuzzy yarn hides your stitches.',
        'Para tu primera labor elige un hilo liso, claro y de grosor medio. En los hilos oscuros o peludos no se ven los puntos.',
        'Para o primeiro trabalho escolha um fio liso, claro e de espessura média. Em fios escuros ou peludos não se veem os pontos.',
      ),
      scene: () => <ToolsBoardScene kinds={[...ALL]} highlight={['yarn']} />,
      dur: 3,
      tip: l('Kenarı keçeleşmeyen akrilik ya da yün karışımı ip, hatalı ilmekleri sökmeyi kolaylaştırır.', 'A smooth acrylic or wool blend makes it easy to rip back mistakes.', 'Un acrílico o mezcla de lana lisa facilita deshacer errores.', 'Um acrílico ou mistura de lã lisa facilita desmanchar erros.'),
    },
    {
      title: l('Makas ve yün iğnesi', 'Scissors and tapestry needle', 'Tijeras y aguja lanera', 'Tesoura e agulha de tapeçaria'),
      text: l(
        'Makas ipi kesmek için, kalın gözlü küt uçlu yün iğnesi ise iş bitince ip uçlarını gizlemek ve parçaları dikmek içindir.',
        'Scissors cut the yarn; a blunt tapestry needle with a big eye weaves in ends and sews pieces together.',
        'Las tijeras cortan el hilo; la aguja lanera de punta roma y ojo grande esconde hebras y une piezas.',
        'A tesoura corta o fio; a agulha de tapeçaria, de ponta romba e olho grande, esconde as pontas e costura as partes.',
      ),
      scene: () => <ToolsBoardScene kinds={[...ALL]} highlight={['scissors', 'tapestry']} />,
      dur: 3,
    },
    {
      title: l('İşaretleyici ve mezura', 'Markers and tape measure', 'Marcadores y cinta métrica', 'Marcadores e fita métrica'),
      text: l(
        'İşaretleyiciler tur başını ya da desen tekrarını gösterir. Mezurayla ölçü örneğini ve işin boyunu ölçersin.',
        'Stitch markers show the start of a round or a pattern repeat. The tape measure checks your gauge and length.',
        'Los marcadores señalan el inicio de vuelta o una repetición. La cinta mide la muestra y el largo.',
        'Os marcadores mostram o início da volta ou uma repetição. A fita mede a amostra e o comprimento.',
      ),
      scene: () => <ToolsBoardScene kinds={[...ALL]} highlight={['markers', 'tape']} />,
      dur: 3,
      tip: l('İşaretleyicin yoksa farklı renkte kısa bir ip parçası bağlaman yeterli.', 'No markers? Tie on a short piece of contrasting yarn.', '¿Sin marcadores? Ata un trocito de hilo de otro color.', 'Sem marcadores? Amarre um pedacinho de fio de outra cor.'),
    },
  ],
  quiz: [
    {
      q: l('İlk işin için hangi ip daha uygun?', 'Which yarn is better for your first piece?', '¿Qué hilo es mejor para tu primera labor?', 'Qual fio é melhor para o primeiro trabalho?'),
      options: [
        l('Açık renkli, düz, orta kalınlıkta', 'Light, smooth, medium weight', 'Claro, liso, grosor medio', 'Claro, liso, espessura média'),
        l('Siyah ve tüylü', 'Black and fuzzy', 'Negro y peludo', 'Preto e peludo'),
        l('Çok ince dantel ipi', 'Very fine lace yarn', 'Hilo de encaje muy fino', 'Linha de renda bem fina'),
      ],
      answer: 0,
    },
  ],
  summary: [
    l('Şiş ya da tığ, ip, makas, yün iğnesi: başlamak için bu kadar.', 'Needles or hook, yarn, scissors, tapestry needle: that is all.', 'Agujas o ganchillo, hilo, tijeras, aguja lanera: eso es todo.', 'Agulhas ou agulha de crochê, fio, tesoura, agulha de tapeçaria: é isso.'),
    l('İlk iş için açık renkli, düz, orta kalınlıkta ip.', 'For a first piece: light, smooth, medium-weight yarn.', 'Para empezar: hilo claro, liso, de grosor medio.', 'Para começar: fio claro, liso, de espessura média.'),
  ],
};

export default lesson;
