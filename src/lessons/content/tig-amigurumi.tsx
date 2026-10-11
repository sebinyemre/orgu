import { AmiBallScene } from '@/engine/illust/crochet2';
import { Diagram, fitView, spiralMarks } from '@/engine/illust/diagram';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-amigurumi',
  intro: l(
    'Amigurumi, sık ve sıkı örülmüş, içi doldurulmuş küçük figürlerdir. Hepsinin temeli bu toptur: artırmalarla açılır, düz turlarla büyür, eksiltmelerle kapanır. Turlar birleştirilmez, spiral örülür; bu yüzden tur başını bir işaretçiyle takip edersin.',
    'Amigurumi are small, stuffed figures crocheted tightly. They all start from this ball: it opens with increases, grows with plain rounds and closes with decreases. Rounds are not joined but worked in a spiral, so you track the start with a marker.',
    'Los amigurumis son figuras pequeñas, tejidas apretadas y rellenas. Todas parten de esta bola: se abre con aumentos, crece con vueltas lisas y se cierra con disminuciones. Se teje en espiral, con un marcador al inicio.',
    'Amigurumis são bonequinhos pequenos, bem firmes e recheados. Todos partem desta bola: abre com aumentos, cresce com voltas lisas e fecha com diminuições. Faz-se em espiral, com um marcador no início.',
  ),
  needs: [
    { kind: 'hook', text: l('İpe göre küçük bir tığ (pamuklu ip için 2,5–3 mm)', 'A hook smaller than the label says (2.5–3 mm for cotton)', 'Una aguja más fina de lo habitual (2,5–3 mm para algodón)', 'Agulha mais fina que o normal (2,5–3 mm para algodão)') },
    { kind: 'yarn', text: l('Pamuklu ya da akrilik ip', 'Cotton or acrylic yarn', 'Hilo de algodón o acrílico', 'Fio de algodão ou acrílico') },
    { kind: 'markers', text: l('Bir ilmek işaretçisi', 'One stitch marker', 'Un marcador', 'Um marcador') },
    { kind: 'stuffing', text: l('Elyaf dolgu', 'Fiberfill stuffing', 'Relleno de fibra', 'Enchimento de fibra') },
    { kind: 'tapestry', text: l('Yün iğnesi', 'Tapestry needle', 'Aguja lanera', 'Agulha de tapeçaria') },
  ],
  steps: [
    {
      title: l('Spiral turlar', 'Spiral rounds', 'Vueltas en espiral', 'Voltas em espiral'),
      text: l(
        '1. tur: sihirli halkaya 6 {sc}. Birleştirme yapma, ilk ilmeğe işaretçi tak ve doğrudan 2. tura geç. Her turun ilk ilmeğine işaretçiyi taşı.',
        'Round 1: 6 {sc} in a magic ring. Don’t join; put a marker in the first stitch and go straight into round 2. Move the marker up each round.',
        'Vuelta 1: 6 {sc} en un anillo mágico. Sin unir: pon un marcador en el primer punto y sigue. Súbelo cada vuelta.',
        'Volta 1: 6 {sc} num anel mágico. Sem unir: coloque um marcador no primeiro ponto e siga. Suba-o a cada volta.',
      ),
      scene: () => <Diagram marks={spiralMarks({ rounds: 3 })} focus={3} />,
      viewBox: fitView(spiralMarks({ rounds: 3 })),
    },
    {
      title: l('Artırma turları', 'Increase rounds', 'Vueltas de aumento', 'Voltas de aumento'),
      text: l(
        '2. tur: her ilmeğe artırma (12). 3. tur: *1 {sc}, art* (18). 4. tur: *2 {sc}, art* (24). Parça kâse gibi açılır.',
        'Round 2: increase in each stitch (12). Round 3: *1 {sc}, inc* (18). Round 4: *2 {sc}, inc* (24). The piece opens like a bowl.',
        'Vuelta 2: aumento en cada punto (12). Vuelta 3: *1 {sc}, aum* (18). Vuelta 4: *2 {sc}, aum* (24). Se abre como un cuenco.',
        'Volta 2: aumento em cada ponto (12). Volta 3: *1 {sc}, aum* (18). Volta 4: *2 {sc}, aum* (24). Abre como uma tigela.',
      ),
      scene: () => <AmiBallScene phase="inc" />,
    },
    {
      title: l('Düz turlar', 'Even rounds', 'Vueltas lisas', 'Voltas lisas'),
      text: l('5–8. turlar: artırmasız 24 {sc}. Kenarlar dikleşir ve top şekillenir.', 'Rounds 5–8: 24 {sc} with no increases. The sides rise and the ball takes shape.', 'Vueltas 5–8: 24 {sc} sin aumentos. Los lados suben y toma forma.', 'Voltas 5–8: 24 {sc} sem aumentos. Os lados sobem e a bola toma forma.'),
      scene: () => <AmiBallScene phase="even" />,
    },
    {
      title: l('Eksiltme turları', 'Decrease rounds', 'Vueltas de disminución', 'Voltas de diminuição'),
      text: l(
        '9. tur: *2 {sc}, eks* (18). 10. tur: *1 {sc}, eks* (12). Artırmaların aynasıdır. Görünmez eksiltme kullan.',
        'Round 9: *2 {sc}, dec* (18). Round 10: *1 {sc}, dec* (12). It mirrors the increases. Use the invisible decrease.',
        'Vuelta 9: *2 {sc}, dism* (18). Vuelta 10: *1 {sc}, dism* (12). Es el espejo de los aumentos. Usa la disminución invisible.',
        'Volta 9: *2 {sc}, dim* (18). Volta 10: *1 {sc}, dim* (12). É o espelho dos aumentos. Use a diminuição invisível.',
      ),
      scene: () => <AmiBallScene phase="dec" />,
    },
    {
      title: l('Doldur', 'Stuff it', 'Rellena', 'Encha'),
      text: l('Açıklık kapanmadan doldur. Dolguyu küçük parçalar hâlinde, sıkıca ama ilmekleri açmadan bastır.', 'Stuff before the opening gets too small. Push the fiberfill in small pieces, firmly but without stretching the stitches open.', 'Rellena antes de que se cierre la abertura. Mete el relleno en trozos pequeños, firme pero sin abrir los puntos.', 'Encha antes que a abertura feche. Coloque o enchimento em pedacinhos, firme mas sem abrir os pontos.'),
      scene: () => <AmiBallScene phase="stuff" />,
    },
    {
      title: l('Kapat', 'Close', 'Cierra', 'Feche'),
      text: l(
        '11. tur: 6 eksiltme (6). İpi kes, yün iğnesiyle kalan 6 ilmeğin ön halkalarından geçir, büz ve ucu topun içinden geçirip gizle.',
        'Round 11: 6 decreases (6). Cut the yarn, thread it through the front loops of the last 6 stitches, cinch and hide the end through the ball.',
        'Vuelta 11: 6 disminuciones (6). Corta, pasa la hebra por las hebras delanteras de los 6 puntos, frunce y esconde el final.',
        'Volta 11: 6 diminuições (6). Corte, passe o fio pelas alças da frente dos 6 pontos, franza e esconda a ponta.',
      ),
      scene: () => <AmiBallScene phase="close" />,
      tip: l('Sıkı ör: dolgunun ilmek aralarından görünmemesi için tığ, ipin önerdiğinden 0,5–1 mm küçük olsun.', 'Crochet tightly: a hook 0.5–1 mm smaller than the label keeps stuffing from peeking through.', 'Teje apretado: una aguja 0,5–1 mm más fina evita que se vea el relleno.', 'Faça bem firme: agulha 0,5–1 mm menor evita que o enchimento apareça.'),
    },
  ],
  practice: {
    text: l('Tarifteki 11 turu ör ve bir top yap.', 'Work the 11 rounds above to make a ball.', 'Teje las 11 vueltas y haz una bola.', 'Faça as 11 voltas e monte uma bola.'),
    target: 11,
    unit: 'round',
  },
  quiz: [
    {
      q: l('Amigurumide tur başını neden işaretçiyle takip ederiz?', 'Why track the start of the round with a marker in amigurumi?', '¿Por qué se marca el inicio de vuelta en amigurumi?', 'Por que marcar o início da volta no amigurumi?'),
      options: [l('Turlar spiral örülür, başı görünmez', 'Rounds spiral, so the start is invisible', 'Se teje en espiral y el inicio no se ve', 'Faz-se em espiral e o início não aparece'), l('Süs olsun diye', 'For decoration', 'Como adorno', 'Como enfeite'), l('Dolgu kaçmasın diye', 'To keep the stuffing in', 'Para que no salga el relleno', 'Para segurar o enchimento')],
      answer: 0,
    },
  ],
  summary: [
    l('6 → 12 → 18 → 24, düz turlar, 18 → 12 → 6.', '6 → 12 → 18 → 24, even rounds, 18 → 12 → 6.', '6 → 12 → 18 → 24, lisas, 18 → 12 → 6.', '6 → 12 → 18 → 24, lisas, 18 → 12 → 6.'),
    l('Spiral ör, işaretçiyi taşı, sıkı ör, kapanmadan doldur.', 'Work in a spiral, move the marker, work tightly, stuff before closing.', 'Espiral, sube el marcador, teje apretado, rellena antes de cerrar.', 'Espiral, suba o marcador, faça firme, encha antes de fechar.'),
  ],
};

export default lesson;
