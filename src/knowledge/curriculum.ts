/**
 * Ders müfredatı: yollar → seviyeler → dersler.
 * Ders içerikleri (resimli adımlar) src/lessons/ altında, aynı id ile tanımlanır.
 * Diğer modüller derslere `lessonHref(id)` ile bağlantı verir.
 */
import type { L10n } from '@/i18n';
import type { Lang } from '@/types';
import { fillTerms, type TermsCtx } from './terms';

export type PathId = 'hazirlik' | 'sis' | 'tig';

export interface LessonMeta {
  id: string;
  path: PathId;
  title: L10n;
  /** tek satırlık açıklama */
  subtitle: L10n;
  /** tahmini süre (dk) */
  minutes: number;
}

export interface LevelMeta {
  id: string;
  path: PathId;
  /** 0: hazırlık, 1–5 */
  n: number;
  title: L10n;
  desc: L10n;
  /** ücretsiz seviye mi */
  free: boolean;
  lessons: LessonMeta[];
}

export interface PathMeta {
  id: PathId;
  title: L10n;
  desc: L10n;
  color: string;
}

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

export const PATHS: PathMeta[] = [
  { id: 'hazirlik', title: l('Hazırlık', 'Getting ready', 'Preparación', 'Preparação'), desc: l('Malzemeler, ip ve numaralar, ilk düğüm', 'Tools, yarn and sizes, the first knot', 'Materiales, hilo y números, el primer nudo', 'Materiais, fio e números, o primeiro nó'), color: '#d39a2c' },
  { id: 'sis', title: l('Şiş', 'Knitting', 'Dos agujas', 'Tricô'), desc: l('Düz şiş ve misinalı şişle örgü', 'Straight and circular needle knitting', 'Tejer con agujas rectas y circulares', 'Tricô com agulhas retas e circulares'), color: '#b5523b' },
  { id: 'tig', title: l('Tığ', 'Crochet', 'Ganchillo', 'Crochê'), desc: l('Zincirden amigurumiye tığ işi', 'From chains to amigurumi', 'De la cadeneta al amigurumi', 'Da correntinha ao amigurumi'), color: '#5f7a61' },
];

type Row = [id: string, tr: [string, string], en: [string, string], es: [string, string], pt: [string, string], minutes: number];

const mk = (path: PathId, rows: Row[]): LessonMeta[] =>
  rows.map(([id, tr, en, es, pt, minutes]) => ({
    id,
    path,
    minutes,
    title: l(tr[0], en[0], es[0], pt[0]),
    subtitle: l(tr[1], en[1], es[1], pt[1]),
  }));

export const LEVELS: LevelMeta[] = [
  {
    id: 'hazirlik-0',
    path: 'hazirlik',
    n: 0,
    title: l('Başlamadan önce', 'Before you start', 'Antes de empezar', 'Antes de começar'),
    desc: l('Neye ihtiyacın var, hangi ip, hangi numara, ilk düğüm.', 'What you need, which yarn, which size, the first knot.', 'Qué necesitas, qué hilo, qué número, el primer nudo.', 'Do que você precisa, qual fio, qual número, o primeiro nó.'),
    free: true,
    lessons: mk('hazirlik', [
      ['haz-malzemeler', ['Örgü çantası', 'Başlamak için gereken her şey'], ['Your knitting bag', 'Everything you need to start'], ['Tu bolsa de labores', 'Todo lo que necesitas para empezar'], ['Sua bolsa de tricô', 'Tudo o que você precisa para começar'], 4],
      ['haz-ip-secimi', ['İp seçmek ve etiket okumak', 'Kalınlık, lif, metre ve gram'], ['Choosing yarn, reading labels', 'Weight, fiber, meters and grams'], ['Elegir hilo y leer la etiqueta', 'Grosor, fibra, metros y gramos'], ['Escolher o fio e ler o rótulo', 'Espessura, fibra, metros e gramas'], 5],
      ['haz-numaralar', ['Şiş ve tığ numaraları', 'Hangi iple hangi numara'], ['Needle and hook sizes', 'Which size for which yarn'], ['Números de agujas', 'Qué número para qué hilo'], ['Números de agulhas', 'Qual número para qual fio'], 4],
      ['haz-yumak', ['Yumağı açmak', 'İç uçtan başlamak, ip dolaşmasın'], ['Opening the skein', 'Pull from the center, no tangles'], ['Abrir el ovillo', 'Tirar desde el centro, sin enredos'], ['Abrir o novelo', 'Puxar pelo centro, sem embaraçar'], 3],
      ['haz-kaygan-dugum', ['Kaygan düğüm', 'Hem şişin hem tığın ilk ilmeği'], ['Slip knot', 'The first loop for knitting and crochet'], ['Nudo corredizo', 'El primer punto para dos agujas y ganchillo'], ['Nó corrediço', 'O primeiro ponto do tricô e do crochê'], 4],
    ]),
  },
  /* ── Şiş ── */
  {
    id: 'sis-1',
    path: 'sis',
    n: 1,
    title: l('İlk ilmekler', 'First stitches', 'Primeros puntos', 'Primeiros pontos'),
    desc: l('Şişi tutmak, ilmek atmak, düz ilmek, ilk kumaş ve kapatma.', 'Holding needles, casting on, the knit stitch, first fabric and binding off.', 'Sujetar las agujas, montar, punto derecho, primer tejido y cerrar.', 'Segurar as agulhas, montar, ponto meia, primeiro tecido e arrematar.'),
    free: true,
    lessons: mk('sis', [
      ['sis-tutus', ['Şişleri tutmak', 'Şiş tutuşu ve ipi parmağa almak'], ['Holding the needles', 'Grip and tensioning the yarn'], ['Sujetar las agujas', 'Postura y tensión del hilo'], ['Segurar as agulhas', 'Postura e tensão do fio'], 5],
      ['sis-ilmek-atma-sisle', ['Şişle ilmek atma', 'En kolay ilmek atma yöntemi'], ['Knitted cast-on', 'The easiest way to cast on'], ['Montaje tejido', 'La forma más fácil de montar'], ['Montagem tricotada', 'O jeito mais fácil de montar'], 6],
      ['sis-ilmek-atma-basparmak', ['Başparmakla ilmek atma', 'Esnek ve düzgün kenar, sapan tutuşu'], ['Long-tail cast-on', 'A neat, stretchy edge with the slingshot hold'], ['Montaje de cola larga', 'Un borde limpio y elástico'], ['Montagem com fio longo', 'Uma borda bonita e elástica'], 8],
      ['sis-duz-ilmek', ['Düz ilmek', 'Bat, sar, çek, düşür'], ['The knit stitch', 'In, around, through, off'], ['Punto derecho', 'Entrar, rodear, sacar, soltar'], ['Ponto meia', 'Entrar, enrolar, puxar, soltar'], 7],
      ['sis-haraso', ['İlk kumaş: haraşo', 'Her sıra düz, sırayı çevirmek'], ['First fabric: garter', 'Knit every row, turning the work'], ['Primer tejido: punto bobo', 'Todo al derecho, girar la labor'], ['Primeiro tecido: ponto liga', 'Tudo em meia, virar o trabalho'], 6],
      ['sis-ilmek-kapatma', ['İlmek kapatma', 'İşi şişten güvenle almak'], ['Binding off', 'Taking your work safely off the needle'], ['Cerrar puntos', 'Sacar la labor de la aguja con seguridad'], ['Arrematar', 'Tirar o trabalho da agulha com segurança'], 6],
    ]),
  },
  {
    id: 'sis-2',
    path: 'sis',
    n: 2,
    title: l('Ters ve doku', 'Purl and texture', 'Revés y texturas', 'Tricô e texturas'),
    desc: l('Ters ilmek, jarse, lastik, pirinç ve hata düzeltme.', 'Purl, stockinette, ribbing, seed stitch and fixing mistakes.', 'Revés, jersey, elástico, punto arroz y corregir errores.', 'Ponto tricô, jersey, ribana, ponto arroz e corrigir erros.'),
    free: true,
    lessons: mk('sis', [
      ['sis-ters-ilmek', ['Ters ilmek', 'İp önde, sağdan sola bat'], ['The purl stitch', 'Yarn in front, insert right to left'], ['Punto revés', 'Hebra delante, entrar de derecha a izquierda'], ['Ponto tricô', 'Fio na frente, entrar da direita para a esquerda'], 7],
      ['sis-jarse', ['Jarse ve ilmek okumak', 'V ve boncuğu tanımak'], ['Stockinette and reading stitches', 'Spot the V and the bump'], ['Jersey y leer los puntos', 'Reconocer la V y el grano'], ['Jersey e ler os pontos', 'Reconhecer o V e a bolinha'], 5],
      ['sis-lastik', ['Lastik örgü', '1×1 ve 2×2, ipin önden arkaya geçişi'], ['Ribbing', '1×1 and 2×2, moving the yarn front and back'], ['Elástico', '1×1 y 2×2, pasar la hebra delante y detrás'], ['Ribana', '1×1 e 2×2, passar o fio para frente e para trás'], 6],
      ['sis-pirinc', ['Pirinç örgü', 'Gördüğünün tersini örmek'], ['Seed stitch', 'Work the opposite of what you see'], ['Punto arroz', 'Tejer lo contrario de lo que ves'], ['Ponto arroz', 'Fazer o contrário do que você vê'], 5],
      ['sis-hata', ['Hataları düzeltmek', 'Geri sökmek ve kaçan ilmeği toplamak'], ['Fixing mistakes', 'Tinking back and picking up dropped stitches'], ['Corregir errores', 'Deshacer y recoger puntos escapados'], ['Corrigir erros', 'Desmanchar e recuperar pontos caídos'], 8],
      ['sis-uc-gizleme', ['İp eklemek, uç gizlemek', 'Yeni yumağa geçmek ve temiz bitirmek'], ['Joining yarn, weaving in ends', 'Starting a new ball and finishing neatly'], ['Unir hilo y esconder hebras', 'Empezar un ovillo nuevo y rematar limpio'], ['Emendar fio e esconder pontas', 'Começar novo novelo e acabar com capricho'], 5],
    ]),
  },
  {
    id: 'sis-3',
    path: 'sis',
    n: 3,
    title: l('Şekil vermek', 'Shaping', 'Dar forma', 'Dar forma'),
    desc: l('Artırma, eksiltme, ip atma ve ölçü örneği.', 'Increases, decreases, yarn overs and gauge.', 'Aumentos, disminuciones, lazadas y muestra.', 'Aumentos, diminuições, laçadas e amostra.'),
    free: false,
    lessons: mk('sis', [
      ['sis-artirma', ['Artırma', 'Önden-arkadan örme ve M1'], ['Increases', 'Knit front and back, and M1'], ['Aumentos', 'Por delante y por detrás, y M1'], ['Aumentos', 'Pela frente e por trás, e M1'], 7],
      ['sis-eksiltme', ['Eksiltme', '2 birlikte, kaydır-kaydır-ör, çift eksiltme'], ['Decreases', 'k2tog, ssk and double decreases'], ['Disminuciones', '2 juntos, deslizar-deslizar-tejer, dobles'], ['Diminuições', '2 juntos, deslizar-deslizar-tricotar, duplas'], 7],
      ['sis-ip-atma', ['İp atma ve ajur', 'Bilerek delik açmak'], ['Yarn overs and lace', 'Making holes on purpose'], ['Lazadas y calados', 'Hacer agujeros a propósito'], ['Laçadas e rendas', 'Fazer furos de propósito'], 6],
      ['sis-olcu-ornegi', ['Ölçü örneği', 'Tarifin tutması için ilk kare'], ['Gauge swatch', 'The square that makes patterns fit'], ['Muestra de tensión', 'El cuadrado que hace que todo encaje'], ['Amostra de tensão', 'O quadrado que faz tudo servir'], 6],
    ]),
  },
  {
    id: 'sis-4',
    path: 'sis',
    n: 4,
    title: l('Yuvarlak örgü', 'In the round', 'En redondo', 'Tricô circular'),
    desc: l('Misinalı şiş, magic loop, çorap şişi ve ilk bere.', 'Circular needles, magic loop, double-pointed needles and a first hat.', 'Agujas circulares, magic loop, agujas de doble punta y un primer gorro.', 'Agulha circular, magic loop, agulhas de pontas duplas e um primeiro gorro.'),
    free: false,
    lessons: mk('sis', [
      ['sis-misinali', ['Misinalı şişte birleştirme', 'İlmekleri burmadan halka yapmak'], ['Joining in the round', 'Closing the ring without a twist'], ['Unir en redondo', 'Cerrar el círculo sin torcer'], ['Unir em circular', 'Fechar o círculo sem torcer'], 6],
      ['sis-magic-loop', ['Magic loop', 'Uzun misinayla dar çevre örmek'], ['Magic loop', 'Small circumferences on a long cable'], ['Magic loop', 'Diámetros pequeños con cable largo'], ['Magic loop', 'Diâmetros pequenos com cabo longo'], 7],
      ['sis-corap-sisi', ['Çorap şişi', 'Dört şişe dağıtıp örmek'], ['Double-pointed needles', 'Spreading stitches over four needles'], ['Agujas de doble punta', 'Repartir los puntos en cuatro agujas'], ['Agulhas de pontas duplas', 'Dividir os pontos em quatro agulhas'], 6],
      ['sis-ilk-bere', ['İlk bere', 'Lastik, gövde ve tepe eksiltmesi'], ['Your first hat', 'Brim, body and crown decreases'], ['Tu primer gorro', 'Elástico, cuerpo y coronilla'], ['Seu primeiro gorro', 'Barra, corpo e topo'], 15],
    ]),
  },
  {
    id: 'sis-5',
    path: 'sis',
    n: 5,
    title: l('Usta işi', 'Master techniques', 'Técnicas de maestría', 'Técnicas avançadas'),
    desc: l('Kaydırma, burgu, selanik, iki renk ve grafik okuma.', 'Slipped stitches, cables, brioche, two colors and chart reading.', 'Puntos deslizados, ochos, brioche, dos colores y leer gráficos.', 'Pontos deslizados, tranças, brioche, duas cores e leitura de gráficos.'),
    free: false,
    lessons: mk('sis', [
      ['sis-kaydirma', ['İlmek kaydırma', 'Hasır örgü ve kenar ilmeği'], ['Slipping stitches', 'Linen stitch and selvedges'], ['Deslizar puntos', 'Punto tela y orillos'], ['Deslizar pontos', 'Ponto linho e ourela'], 5],
      ['sis-burgu', ['Burgu', 'Yardımcı şişle çaprazlamak'], ['Cables', 'Crossing stitches with a cable needle'], ['Ochos', 'Cruzar puntos con aguja auxiliar'], ['Tranças', 'Cruzar pontos com agulha auxiliar'], 9],
      ['sis-selanik', ['Selanik ve yalancı selanik', 'İp at, kaydır, birlikte ör'], ['Brioche and mock brioche', 'Yarn over, slip, knit together'], ['Brioche y falso brioche', 'Lazada, deslizar, tejer juntos'], ['Brioche e falso brioche', 'Laçada, deslizar, tricotar juntos'], 10],
      ['sis-renkli', ['İki renkle örmek', 'Arkadan ip taşımak'], ['Knitting with two colors', 'Stranding yarn across the back'], ['Tejer con dos colores', 'Llevar la hebra por detrás'], ['Tricô com duas cores', 'Levar o fio por trás'], 9],
      ['sis-grafik-okuma', ['Grafik okumak', 'Kareli kağıttaki deseni örgüye çevirmek'], ['Reading charts', 'Turning a grid into knitting'], ['Leer gráficos', 'Pasar la cuadrícula al tejido'], ['Ler gráficos', 'Passar o gráfico para o tricô'], 7],
    ]),
  },
  /* ── Tığ ── */
  {
    id: 'tig-1',
    path: 'tig',
    n: 1,
    title: l('İlk ilmekler', 'First stitches', 'Primeros puntos', 'Primeiros pontos'),
    desc: l('Tığı tutmak, zincir, kör ilmek, sık iğne ve sıra çevirmek.', 'Holding the hook, chains, slip stitch, single crochet and turning.', 'Sujetar la aguja, cadenetas, punto raso, punto bajo y girar.', 'Segurar a agulha, correntinha, ponto baixíssimo, ponto baixo e virar.'),
    free: true,
    lessons: mk('tig', [
      ['tig-tutus', ['Tığı tutmak', 'Kalem ve bıçak tutuşu, ip gerginliği'], ['Holding the hook', 'Pencil and knife grip, yarn tension'], ['Sujetar la aguja', 'Agarre de lápiz y de cuchillo, tensión'], ['Segurar a agulha', 'Pegada de lápis e de faca, tensão'], 5],
      ['tig-zincir', ['{Ch}', 'Her tığ işinin başlangıcı'], ['{Ch}', 'Where every crochet piece begins'], ['{Ch}', 'El comienzo de todo'], ['{Ch}', 'O começo de tudo'], 6],
      ['tig-kor-ilmek', ['{Slst}', 'Birleştirmek ve ilerlemek için'], ['{Slst}', 'For joining and moving along'], ['{Slst}', 'Para unir y avanzar'], ['{Slst}', 'Para unir e avançar'], 4],
      ['tig-sik-igne', ['{Sc}', 'Bat, çek, iki ilmekten geçir'], ['{Sc}', 'Insert, pull up, through two'], ['{Sc}', 'Entrar, sacar, cerrar dos'], ['{Sc}', 'Entrar, puxar, fechar dois'], 7],
      ['tig-donus', ['Sırayı çevirmek', 'Dönüş zinciri ve ilmek saymak'], ['Turning rows', 'Turning chains and counting stitches'], ['Girar la labor', 'Cadenetas de giro y contar puntos'], ['Virar o trabalho', 'Correntinhas de subida e contar pontos'], 6],
      ['tig-bitirme', ['Bitirmek ve uç gizlemek', 'İpi kesip düğümlemek, ucu saklamak'], ['Fastening off', 'Cutting, securing and hiding the tail'], ['Rematar', 'Cortar, asegurar y esconder la hebra'], ['Arrematar', 'Cortar, prender e esconder a ponta'], 4],
    ]),
  },
  {
    id: 'tig-2',
    path: 'tig',
    n: 2,
    title: l('Uzun ilmekler', 'Taller stitches', 'Puntos altos', 'Pontos altos'),
    desc: l('Yarım trabzandan üç ip atmalı trabzana, ön ve arka halka.', 'From half double to triple treble, front and back loops.', 'Del punto medio alto al alto triple, hebras delantera y trasera.', 'Do meio ponto alto ao alto triplo, alças da frente e de trás.'),
    free: true,
    lessons: mk('tig', [
      ['tig-yarim-trabzan', ['{Hdc}', '1 ip at, 3 ilmekten birden geçir'], ['{Hdc}', '1 yarn over, through all 3 loops'], ['{Hdc}', '1 lazada, cerrar las 3 de una vez'], ['{Hdc}', '1 laçada, fechar as 3 de uma vez'], 6],
      ['tig-trabzan', ['{Dc}', 'İkişer ikişer geçirmek'], ['{Dc}', 'Pulling through two at a time'], ['{Dc}', 'Cerrar de dos en dos'], ['{Dc}', 'Fechar de duas em duas'], 7],
      ['tig-trabzan-2', ['{Tr}', 'Daha uzun ilmek'], ['{Tr}', 'A taller stitch'], ['{Tr}', 'Un punto más alto'], ['{Tr}', 'Um ponto mais alto'], 6],
      ['tig-trabzan-3', ['{Dtr}', 'En uzun ilmekler'], ['{Dtr}', 'The tallest basic stitch'], ['{Dtr}', 'El punto básico más alto'], ['{Dtr}', 'O ponto básico mais alto'], 5],
      ['tig-halkalar', ['Ön halka, arka halka', 'Nereye batarsan doku değişir'], ['Front and back loops', 'Where you insert changes the texture'], ['Hebra delantera y trasera', 'Dónde entras cambia la textura'], ['Alça da frente e de trás', 'Onde você entra muda a textura'], 5],
    ]),
  },
  {
    id: 'tig-3',
    path: 'tig',
    n: 3,
    title: l('Yuvarlak ve amigurumi', 'Rounds and amigurumi', 'En redondo y amigurumi', 'Circular e amigurumi'),
    desc: l('Sihirli halka, artırma, eksiltme, daire ve top.', 'Magic ring, increases, decreases, circles and balls.', 'Anillo mágico, aumentos, disminuciones, círculos y bolas.', 'Anel mágico, aumentos, diminuições, círculos e bolas.'),
    free: false,
    lessons: mk('tig', [
      ['tig-sihirli-halka', ['Sihirli halka', 'Ortası delik kalmayan başlangıç'], ['Magic ring', 'A start with no hole in the middle'], ['Anillo mágico', 'Un inicio sin agujero en el centro'], ['Anel mágico', 'Um início sem furo no meio'], 8],
      ['tig-artirma', ['Artırma', 'Aynı ilmeğe iki ilmek'], ['Increasing', 'Two stitches in one'], ['Aumentar', 'Dos puntos en uno'], ['Aumentar', 'Dois pontos em um'], 4],
      ['tig-eksiltme', ['Eksiltme', 'Görünmez eksiltme'], ['Decreasing', 'The invisible decrease'], ['Disminuir', 'La disminución invisible'], ['Diminuir', 'A diminuição invisível'], 5],
      ['tig-daire', ['Düz daire', '6, 12, 18… dümdüz bir daire'], ['Flat circle', '6, 12, 18… a perfectly flat circle'], ['Círculo plano', '6, 12, 18… un círculo bien plano'], ['Círculo plano', '6, 12, 18… um círculo bem plano'], 7],
      ['tig-amigurumi', ['Amigurumi top', 'Spiral örmek, doldurmak, kapatmak'], ['Amigurumi ball', 'Spiral rounds, stuffing, closing'], ['Bola amigurumi', 'Espiral, relleno y cierre'], ['Bola amigurumi', 'Espiral, enchimento e fechamento'], 15],
    ]),
  },
  {
    id: 'tig-4',
    path: 'tig',
    n: 4,
    title: l('Motif ve renk', 'Motifs and color', 'Motivos y color', 'Motivos e cor'),
    desc: l('Büyükanne karesi, renk değiştirme ve birleştirme.', 'Granny squares, changing colors and joining.', 'Cuadros de la abuela, cambiar de color y unir.', 'Quadradinhos da vovó, trocar de cor e unir.'),
    free: false,
    lessons: mk('tig', [
      ['tig-buyukanne-karesi', ['Büyükanne karesi', 'Köşeler, kümeler ve boşluklar'], ['Granny square', 'Corners, clusters and spaces'], ['Cuadro de la abuela', 'Esquinas, grupos y espacios'], ['Quadradinho da vovó', 'Cantos, grupos e espaços'], 12],
      ['tig-renk-degistirme', ['Renk değiştirmek', 'Son çekişte yeni renk'], ['Changing color', 'New color on the last pull-through'], ['Cambiar de color', 'Color nuevo en el último cierre'], ['Trocar de cor', 'Cor nova no último fechamento'], 5],
      ['tig-birlestirme', ['Motifleri birleştirmek', 'Kör ilmek, sık iğne ve dikiş'], ['Joining motifs', 'Slip stitch, single crochet and sewing'], ['Unir motivos', 'Punto raso, punto bajo y costura'], ['Unir motivos', 'Ponto baixíssimo, ponto baixo e costura'], 7],
    ]),
  },
  {
    id: 'tig-5',
    path: 'tig',
    n: 5,
    title: l('Doku ilmekleri', 'Textured stitches', 'Puntos con textura', 'Pontos com textura'),
    desc: l('Fıstık, pıtırcık, yelpaze, V, kabartma, yengeç ve Tunus işi.', 'Puff, bobble, shell, V-stitch, post stitches, crab stitch and Tunisian.', 'Puff, bodoque, abanico, punto V, relieve, cangrejo y tunecino.', 'Puff, pipoca, leque, ponto V, relevo, caranguejo e tunisiano.'),
    free: false,
    lessons: mk('tig', [
      ['tig-fistik', ['Fıstık', 'Kabarık puf ilmek'], ['Puff stitch', 'A soft, puffy stitch'], ['Punto puff', 'Un punto esponjoso'], ['Ponto puff', 'Um ponto fofinho'], 6],
      ['tig-pitircik', ['Pıtırcık ve patlamış mısır', 'Yarım kalmış ilmekleri tepede birleştirmek'], ['Bobble and popcorn', 'Gathering unfinished stitches at the top'], ['Bodoque y palomita', 'Cerrar puntos incompletos juntos'], ['Pipoca e pipoca fechada', 'Fechar pontos incompletos juntos'], 7],
      ['tig-yelpaze', ['Yelpaze', 'Aynı ilmeğe beş uzun ilmek'], ['Shell stitch', 'Five tall stitches in one'], ['Abanico', 'Cinco puntos altos en uno'], ['Leque', 'Cinco pontos altos em um'], 5],
      ['tig-v-ilmek', ['V ilmek', 'Uzun ilmek, zincir, uzun ilmek'], ['V-stitch', 'Tall stitch, chain, tall stitch'], ['Punto V', 'Punto alto, cadeneta, punto alto'], ['Ponto V', 'Ponto alto, correntinha, ponto alto'], 4],
      ['tig-kabartma', ['Kabartma ilmek', 'Gövdenin önünden ve arkasından'], ['Post stitches', 'Around the post, front and back'], ['Puntos en relieve', 'Alrededor del pilar, por delante y por detrás'], ['Pontos em relevo', 'Ao redor da haste, pela frente e por trás'], 7],
      ['tig-yengec', ['Yengeç ilmeği', 'Ters yönde sık iğneyle kenar'], ['Crab stitch', 'A corded edge worked backwards'], ['Punto cangrejo', 'Un borde trenzado hacia atrás'], ['Ponto caranguejo', 'Uma borda cordão para trás'], 5],
      ['tig-tunus', ['Tunus işi', 'Gidiş ve dönüş geçişleri'], ['Tunisian crochet', 'Forward and return passes'], ['Ganchillo tunecino', 'Pasadas de ida y vuelta'], ['Crochê tunisiano', 'Passadas de ida e volta'], 9],
    ]),
  },
];

export const ALL_LESSONS: LessonMeta[] = LEVELS.flatMap((x) => x.lessons);

export const LESSON_BY_ID: Record<string, LessonMeta> = Object.fromEntries(ALL_LESSONS.map((x) => [x.id, x]));

export function levelOf(lessonId: string): LevelMeta | undefined {
  return LEVELS.find((x) => x.lessons.some((y) => y.id === lessonId));
}

export function levelsFor(path: PathId): LevelMeta[] {
  return LEVELS.filter((x) => x.path === path);
}

/** Ders başlığı (tığ ilmek adları kullanıcının diline ve geleneğine göre doldurulur) */
export function lessonTitle(meta: LessonMeta, ctx: TermsCtx): string {
  return fillTerms(meta.title[ctx.lang], ctx);
}

export function lessonSubtitle(meta: LessonMeta, lang: Lang): string {
  return meta.subtitle[lang];
}

/** Derse bağlantı (diğer modüller için) */
export const lessonHref = (id: string) => `/ders/${id}`;

/** Aynı yoldaki sonraki ders */
export function nextLesson(id: string): LessonMeta | undefined {
  const meta = LESSON_BY_ID[id];
  if (!meta) return undefined;
  const list = LEVELS.filter((x) => x.path === meta.path).flatMap((x) => x.lessons);
  const i = list.findIndex((x) => x.id === id);
  return list[i + 1];
}
