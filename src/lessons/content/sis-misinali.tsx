import { CircularScene } from '@/engine/illust/round';
import { SwatchScene, swatchRows } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-misinali',
  intro: l(
    'Misinalı şiş, iki kısa şiş ucunun esnek bir kabloyla birleşmiş hâlidir. Halka hâlinde örersen hiç dikiş olmadan bere, boyunluk ve kazak gövdesi çıkar. İşin tek püf noktası: ilmekleri birleştirmeden önce burulmadıklarından emin olmak.',
    'A circular needle is two short tips joined by a flexible cable. Knit in a ring and you get hats, cowls and sweater bodies with no seams. The one trick: make sure the stitches are not twisted before you join.',
    'La aguja circular son dos puntas cortas unidas por un cable flexible. Tejiendo en redondo salen gorros, cuellos y cuerpos sin costuras. El único truco: comprobar que los puntos no estén torcidos antes de unir.',
    'A agulha circular são duas pontas curtas unidas por um cabo flexível. Tricotando em círculo saem gorros, golas e corpos sem costura. O único segredo: conferir que os pontos não estejam torcidos antes de unir.',
  ),
  needs: [
    { kind: 'circular', text: l('Misinalı şiş: kablo boyu işin çevresinden biraz kısa (bere için 40 cm)', 'Circular needle a little shorter than the piece’s circumference (40 cm / 16 in for a hat)', 'Circular algo más corta que el contorno (40 cm para gorro)', 'Circular um pouco menor que a circunferência (40 cm para gorro)') },
    { kind: 'markers', text: l('Bir ilmek işaretçisi', 'One stitch marker', 'Un marcador', 'Um marcador') },
  ],
  steps: [
    {
      title: l('İlmekleri at', 'Cast on', 'Monta los puntos', 'Monte os pontos'),
      text: l(
        'İlmekleri her zamanki gibi şişlerden birine at, sonra kabloya ve öbür uca yay. İlmekler kabloda rahatça kaymalı, gerilmemeli.',
        'Cast on as usual onto one tip, then spread the stitches along the cable to the other tip. They should slide freely, not stretch.',
        'Monta como siempre en una punta y reparte los puntos por el cable hasta la otra. Deben deslizarse sin estirarse.',
        'Monte como sempre numa ponta e espalhe os pontos pelo cabo até a outra. Eles devem deslizar sem esticar.',
      ),
      scene: () => <CircularScene phase="cast" />,
    },
    {
      title: l('Burulmayı kontrol et', 'Check for twists', 'Comprueba que no estén torcidos', 'Confira se não torceu'),
      text: l(
        'Şişi masaya koy. İlmek atma kenarı (kahverengi çizgi) baştan sona halkanın İÇİNE bakmalı. Bir yerde kablonun üstünden dışarı dönüyorsa iş burulmuştur.',
        'Lay the needle flat. The cast-on edge (brown line) must face the INSIDE of the ring all the way round. If it rolls over the cable somewhere, the work is twisted.',
        'Deja la aguja plana. El borde de montaje (línea marrón) debe mirar hacia DENTRO en todo el círculo. Si en algún punto pasa por encima del cable, está torcido.',
        'Deixe a agulha plana. A borda de montagem (linha marrom) deve olhar para DENTRO em todo o círculo. Se em algum ponto passar por cima do cabo, torceu.',
      ),
      scene: () => <CircularScene phase="check" />,
    },
    {
      title: l('Burulmuş hâli', 'What a twist looks like', 'Así se ve torcido', 'Assim fica torcido'),
      text: l(
        'Bu hâlde birleştirirsen iş bir Möbius şeridine döner ve sökmekten başka çare kalmaz. Kenarı düzeltip yeniden kontrol et.',
        'Join like this and the piece becomes a Möbius strip that can only be ripped out. Straighten the edge and check again.',
        'Si unes así, la pieza se vuelve una cinta de Möbius y solo queda deshacer. Endereza el borde y comprueba otra vez.',
        'Se unir assim, a peça vira uma fita de Möbius e só resta desmanchar. Endireite a borda e confira de novo.',
      ),
      scene: () => <CircularScene phase="twisted" />,
      warn: l('Birleştirmeden önce her zaman bir kez daha bak.', 'Always look once more before joining.', 'Mira siempre una vez más antes de unir.', 'Olhe sempre mais uma vez antes de unir.'),
    },
    {
      title: l('İşaretçiyi tak', 'Place the marker', 'Coloca el marcador', 'Coloque o marcador'),
      text: l(
        'Sağ uçtaki son ilmeğin yanına bir işaretçi tak. Bu, turun başıdır; her geçişinde bir tur bitmiş olur.',
        'Slip a marker onto the right tip next to the last stitch. This marks the start of the round; each time you pass it, a round is done.',
        'Pon un marcador en la punta derecha junto al último punto. Marca el inicio de vuelta; cada vez que lo pases, terminaste una vuelta.',
        'Coloque um marcador na ponta direita junto ao último ponto. Marca o início da volta; cada vez que passar por ele, uma volta terminou.',
      ),
      scene: () => <CircularScene phase="marker" />,
    },
    {
      title: l('Halkayı birleştir', 'Join the round', 'Une en redondo', 'Una em círculo'),
      text: l(
        'Çalışan ip sağ uçtan gelir. Sol uçtaki İLK ilmeği bu iple sıkıca ör: halka kapandı. İlk birkaç ilmeği sıkı çekersen birleşme yerinde boşluk kalmaz.',
        'The working yarn hangs from the right tip. Knit the FIRST stitch on the left tip with it, snugly: the ring is closed. Tugging the first few stitches avoids a gap at the join.',
        'La hebra de trabajo sale de la punta derecha. Teje con ella el PRIMER punto de la punta izquierda, firme: el círculo se cierra. Apretar los primeros puntos evita un hueco.',
        'O fio de trabalho sai da ponta direita. Tricote com ele o PRIMEIRO ponto da ponta esquerda, firme: o círculo fecha. Apertar os primeiros pontos evita um buraco.',
      ),
      scene: () => <CircularScene phase="join" />,
    },
    {
      title: l('Tur tur ör', 'Knit round and round', 'Teje vuelta tras vuelta', 'Tricote volta após volta'),
      text: l(
        'Hiç dönmeden hep aynı yöne örersin; ön yüz hep sana bakar. Bu yüzden yuvarlakta her tur düz örülürse jarse çıkar, haraşo için turlar düz ve ters sırayla örülür.',
        'You never turn; the right side always faces you. So knitting every round gives stockinette, and garter stitch needs alternating knit and purl rounds.',
        'Nunca giras; el derecho siempre te mira. Por eso tejer todas las vueltas del derecho da jersey, y el punto bobo necesita alternar vueltas del derecho y del revés.',
        'Você nunca vira; o direito sempre fica para você. Por isso tricotar todas as voltas em meia dá jersey, e o tricô precisa alternar voltas de meia e de tricô.',
      ),
      scene: () => <CircularScene phase="around" />,
    },
    {
      title: l('Dikişsiz kumaş', 'Seamless fabric', 'Tejido sin costura', 'Tecido sem costura'),
      text: l('Birkaç tur sonra düzgün bir tüp elde edersin; jarse yüzü dışta.', 'After a few rounds you have a neat tube with the stockinette side out.', 'Tras unas vueltas tienes un tubo con el jersey por fuera.', 'Depois de algumas voltas você tem um tubo com o jersey por fora.'),
      scene: () => <SwatchScene rows={swatchRows('jarse', 12, 8)} />,
    },
  ],
  practice: {
    text: l('40 cm misinalıya 80 ilmek at, burulmadan birleştir ve 10 tur düz ör.', 'Cast 80 stitches onto a 40 cm circular, join without twisting and knit 10 rounds.', 'Monta 80 puntos en una circular de 40 cm, une sin torcer y teje 10 vueltas.', 'Monte 80 pontos numa circular de 40 cm, una sem torcer e tricote 10 voltas.'),
    target: 10,
    unit: 'round',
  },
  quiz: [
    {
      q: l('Yuvarlak örgüde her turu düz örersen hangi kumaş çıkar?', 'Knitting every round in the round gives which fabric?', 'Tejiendo todas las vueltas del derecho en redondo, ¿qué tejido sale?', 'Tricotando todas as voltas em meia em círculo, que tecido sai?'),
      options: [l('Jarse', 'Stockinette', 'Jersey', 'Jersey'), l('Haraşo', 'Garter', 'Punto bobo', 'Tricô (ponto liga)'), l('Lastik', 'Ribbing', 'Elástico', 'Ribana')],
      answer: 0,
      explain: l('Dönmediğin için hep ön yüzü örersin.', 'You never turn, so you always work the right side.', 'No giras, así que siempre trabajas el derecho.', 'Você não vira, então sempre trabalha o direito.'),
    },
  ],
  summary: [
    l('Kablo boyu işin çevresinden kısa olmalı.', 'The cable should be shorter than the circumference.', 'El cable debe ser más corto que el contorno.', 'O cabo deve ser menor que a circunferência.'),
    l('Kenar içe bakıyor mu? Bak, sonra birleştir.', 'Edge facing in? Check, then join.', '¿Borde hacia dentro? Mira y luego une.', 'Borda para dentro? Confira e depois una.'),
  ],
};

export default lesson;
