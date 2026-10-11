import { KnitScene, knitArrows } from '@/engine/illust/knit';
import { SwatchScene, TurnScene, swatchRows } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-haraso',
  intro: l(
    'Haraşo, her sırası düz örülen ilk kumaşındır. Burada sıra bitince işi çevirmeyi ve haraşonun tırtıllarını saymayı öğreneceksin.',
    'Garter stitch is knit on every row: your first real fabric. You will learn to turn your work and count garter ridges.',
    'El punto bobo se teje al derecho en todas las vueltas. Aprenderás a girar la labor y a contar los surcos.',
    'O ponto liga é tricotado em meia em todas as carreiras. Você vai aprender a virar o trabalho e contar os sulcos.',
  ),
  steps: [
    {
      title: l('Sıra bitti', 'End of the row', 'Fin de la vuelta', 'Fim da carreira'),
      text: l('Sol şişteki bütün ilmekleri düz ördüğünde hepsi sağ şişe geçmiş olur.', 'When every stitch has been knit, they are all on the right needle.', 'Cuando tejes todos los puntos, quedan en la aguja derecha.', 'Quando todos os pontos foram tricotados, ficam na agulha direita.'),
      scene: () => <KnitScene left={0} right={5} rn="rest" />,
    },
    {
      title: l('İşi çevir', 'Turn the work', 'Gira la labor', 'Vire o trabalho'),
      text: l(
        'Dolu şişi sol eline al ve işi kitap sayfası çevirir gibi döndür. Çalışan ip şimdi sol şişin ucundaki ilk ilmekten çıkar.',
        'Move the full needle to your left hand, turning the work like the page of a book. The working yarn now hangs from the first stitch at the tip.',
        'Pasa la aguja llena a la mano izquierda girando la labor como la página de un libro. La hebra sale ahora del primer punto.',
        'Passe a agulha cheia para a mão esquerda virando o trabalho como página de livro. O fio sai agora do primeiro ponto.',
      ),
      scene: () => <TurnScene />,
      dur: 3,
    },
    {
      title: l('Yeni sırayı ör', 'Knit the new row', 'Teje la nueva vuelta', 'Tricote a nova carreira'),
      text: l('Boş şişi sağ eline al ve yine her ilmeği düz ör.', 'Take the empty needle in your right hand and knit every stitch again.', 'Toma la aguja vacía en la derecha y teje otra vez todo al derecho.', 'Pegue a agulha vazia na direita e faça meia em todos os pontos de novo.'),
      scene: () => <KnitScene left={5} right={0} rn="insertK" rnFrom="rest" target arrows={knitArrows.insertK(1)} />,
    },
    {
      title: l('Haraşonun görünüşü', 'What garter looks like', 'Así es el punto bobo', 'Assim é o ponto liga'),
      text: l(
        'Her sıra düz örülünce bir sıra V, bir sıra boncuk görünür. İki yüzü de aynıdır ve kumaş kıvrılmaz.',
        'Knitting every row gives alternating rows of Vs and bumps. Both sides look the same and the fabric lies flat.',
        'Al tejer todo al derecho se alternan filas de V y de granos. Las dos caras son iguales y no se enrolla.',
        'Fazendo meia em tudo, alternam carreiras de V e de bolinhas. Os dois lados são iguais e não enrola.',
      ),
      scene: () => <SwatchScene rows={swatchRows('haraso', 11, 9)} />,
      dur: 3,
    },
    {
      title: l('Tırtılları say', 'Count the ridges', 'Cuenta los surcos', 'Conte os sulcos'),
      text: l('Her tırtıl (boncuk sırası) 2 sıradır. 10 tırtıl saydıysan 20 sıra örmüşsündür.', 'Each ridge (row of bumps) is 2 rows. 10 ridges means 20 rows.', 'Cada surco son 2 vueltas. 10 surcos son 20 vueltas.', 'Cada sulco são 2 carreiras. 10 sulcos são 20 carreiras.'),
      scene: () => <SwatchScene rows={swatchRows('haraso', 11, 9)} highlightRow={4} />,
      dur: 3,
      tip: l('Kenarlar düzgün olsun istersen her sıranın ilk ilmeğini örmeden sağ şişe kaydır.', 'For tidy edges, slip the first stitch of every row.', 'Para orillos limpios, desliza el primer punto de cada vuelta.', 'Para bordas bonitas, deslize o primeiro ponto de cada carreira.'),
    },
  ],
  practice: { text: l('20 ilmekle 20 sıra haraşo ör.', 'Knit 20 rows of garter on 20 stitches.', 'Teje 20 vueltas de punto bobo con 20 puntos.', 'Tricote 20 carreiras de ponto liga com 20 pontos.'), target: 20, unit: 'row' },
  quiz: [
    {
      q: l('12 tırtıl kaç sıradır?', 'How many rows are 12 ridges?', '¿Cuántas vueltas son 12 surcos?', 'Quantas carreiras são 12 sulcos?'),
      options: [l('12', '12', '12', '12'), l('24', '24', '24', '24'), l('6', '6', '6', '6')],
      answer: 1,
    },
  ],
  summary: [
    l('Haraşo: her sıra düz.', 'Garter: knit every row.', 'Punto bobo: todo al derecho.', 'Ponto liga: tudo em meia.'),
    l('1 tırtıl = 2 sıra.', '1 ridge = 2 rows.', '1 surco = 2 vueltas.', '1 sulco = 2 carreiras.'),
  ],
};

export default lesson;
