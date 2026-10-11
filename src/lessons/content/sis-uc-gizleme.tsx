import { KnitScene } from '@/engine/illust/knit';
import { WeaveScene } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-uc-gizleme',
  intro: l(
    'Yumak bitince yeni ipi sıra başında eklersin. İş bitince de bütün ip uçlarını yün iğnesiyle arka yüzde gizlersin; görünmez ve çözülmez.',
    'When a ball runs out, join the new one at the start of a row. When you finish, weave all ends in on the wrong side with a tapestry needle: invisible and secure.',
    'Cuando se acaba el ovillo, une el nuevo al inicio de una vuelta. Al terminar, esconde todas las hebras por el revés con aguja lanera.',
    'Quando o novelo acaba, emende o novo no começo da carreira. No fim, esconda todas as pontas pelo avesso com agulha de tapeçaria.',
  ),
  needs: [{ kind: 'tapestry', text: l('Yün iğnesi', 'Tapestry needle', 'Aguja lanera', 'Agulha de tapeçaria') }],
  steps: [
    {
      title: l('Sıra başında yeni ip', 'New yarn at a row start', 'Hilo nuevo al inicio', 'Fio novo no começo'),
      text: l('Eski ipten 15 cm bırak. Yeni ipin ucunu da 15 cm bırakarak ilk ilmeği yeni iple ör.', 'Leave 15 cm of the old yarn. Leaving a 15 cm tail of the new yarn, knit the first stitch with it.', 'Deja 15 cm del hilo viejo. Con 15 cm de cola del nuevo, teje el primer punto.', 'Deixe 15 cm do fio velho. Com 15 cm de ponta do novo, tricote o primeiro ponto.'),
      scene: () => <KnitScene left={5} right={0} rn="rest" yarnColor="#c47f7f" />,
    },
    {
      title: l('Yün iğnesine geçir', 'Thread the needle', 'Enhebra la aguja', 'Passe na agulha'),
      text: l('İş bitince her ucu yün iğnesine geçir ve işin arka yüzüne çevir.', 'When the piece is done, thread each end onto the tapestry needle and turn to the wrong side.', 'Al terminar, enhebra cada hebra y gira al revés.', 'No fim, passe cada ponta na agulha e vire para o avesso.'),
      scene: () => <WeaveScene phase="thread" />,
      dur: 3,
    },
    {
      title: l('Boncuklardan geçir', 'Weave through the bumps', 'Pasa por los granos', 'Passe pelas bolinhas'),
      text: l('Ucu arka yüzdeki boncukların altından 5–6 ilmek boyunca bir yöne, sonra geri yöne geçir.', 'Run the end under the purl bumps for 5–6 stitches in one direction, then back the other way.', 'Pasa la hebra bajo los granos 5–6 puntos en una dirección y luego de vuelta.', 'Passe a ponta por baixo das bolinhas 5–6 pontos num sentido e depois no outro.'),
      scene: () => <WeaveScene phase="weave" />,
    },
    {
      title: l('Kes', 'Trim', 'Corta', 'Corte'),
      text: l('Kumaşı hafifçe esnet, sonra ucu kumaşa yakın kes. İp yerinde kalır.', 'Stretch the fabric gently, then trim the end close to the fabric. It stays put.', 'Estira un poco el tejido y corta la hebra al ras. Queda fija.', 'Estique o tecido de leve e corte rente. A ponta fica presa.'),
      scene: () => <WeaveScene phase="trim" />,
      dur: 3,
    },
  ],
  summary: [
    l('Yeni ipi sıra başında ekle.', 'Join new yarn at the start of a row.', 'Une el hilo nuevo al inicio de vuelta.', 'Emende o fio novo no começo da carreira.'),
    l('Uçları arka yüzde iki yöne gizle.', 'Weave ends on the wrong side in two directions.', 'Esconde las hebras por el revés en dos direcciones.', 'Esconda as pontas pelo avesso em duas direções.'),
  ],
};

export default lesson;
