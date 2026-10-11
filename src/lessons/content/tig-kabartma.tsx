import { PostScene } from '@/engine/illust/crochet2';
import { Diagram, ROUND_COLORS, chainRowMarks, type Mark, fitView } from '@/engine/illust/diagram';
import { l, type Lesson } from '../types';

/** kabartma lastik: önden ve arkadan kabartma sırayla */
function ribRow(): Mark[] {
  const marks: Mark[] = chainRowMarks(8, 250, 60, 40, 24, 0);
  for (let i = 0; i < 8; i++) {
    marks.push({ id: 'dc', at: [60 + i * 40, 205], size: 72, color: ROUND_COLORS[0], group: 0 });
    marks.push({ id: i % 2 === 0 ? 'fpdc' : 'bpdc', at: [60 + i * 40, 130], size: 72, color: ROUND_COLORS[1], group: 1 });
  }
  return marks;
}

const lesson: Lesson = {
  id: 'tig-kabartma',
  intro: l(
    'Kabartma ilmeklerde tığı ilmeğin tepesine değil, alttaki ilmeğin gövdesinin etrafına sokarsın. Önden kabartma ilmeği öne, arkadan kabartma arkaya iter. İkisini sırayla örünce tığla şiş lastiğine benzeyen bir doku, çaprazlayınca da burgular çıkar.',
    'Post stitches go around the body (post) of the stitch below instead of into its top. A front post stitch pushes forward, a back post stitch pushes back. Alternate them for a ribbing that looks knitted; cross them for cables.',
    'En los puntos en relieve la aguja rodea el pilar del punto de abajo en vez de entrar por arriba. Por delante empuja hacia fuera, por detrás hacia dentro. Alternados dan un elástico; cruzados, ochos.',
    'Nos pontos em relevo a agulha contorna a haste do ponto de baixo em vez de entrar por cima. Pela frente empurra para fora, por trás para dentro. Alternados dão uma ribana; cruzados, tranças.',
  ),
  steps: [
    {
      title: l('Önden kabartma', 'Front post', 'Relieve por delante', 'Relevo pela frente'),
      text: l(
        'İp at. Tığı ÖNDEN, alttaki {dc} gövdesinin sağından sok, gövdenin arkasından dolaştır ve solundan öne çıkar. Sonra {dc} gibi bitir. İlmek öne çıkar.',
        'Yarn over. Insert from the FRONT, to the right of the {dc} post below, pass behind the post and come out to the front on its left. Finish like a {dc}. The stitch stands forward.',
        'Lazada. Entra por DELANTE a la derecha del pilar, pasa por detrás y sal por delante a la izquierda. Termina como un {dc}. El punto sobresale.',
        'Laçada. Entre pela FRENTE à direita da haste, passe por trás e saia pela frente à esquerda. Termine como um {dc}. O ponto sobressai.',
      ),
      scene: () => <PostScene side="front" />,
    },
    {
      title: l('Arkadan kabartma', 'Back post', 'Relieve por detrás', 'Relevo por trás'),
      text: l(
        'İp at. Tığı ARKADAN, gövdenin sağından sok, gövdenin önünden geç ve solundan arkaya çık. {Dc} gibi bitir. İlmek geriye çekilir.',
        'Yarn over. Insert from the BACK, to the right of the post, pass in front of it and go back out on its left. Finish like a {dc}. The stitch sinks back.',
        'Lazada. Entra por DETRÁS a la derecha del pilar, pasa por delante y vuelve atrás a la izquierda. Termina como un {dc}. El punto se hunde.',
        'Laçada. Entre por TRÁS à direita da haste, passe pela frente e volte para trás à esquerda. Termine como um {dc}. O ponto afunda.',
      ),
      scene: () => <PostScene side="back" />,
    },
    {
      title: l('Kabartma lastik', 'Post stitch ribbing', 'Elástico en relieve', 'Ribana em relevo'),
      text: l('Bir önden, bir arkadan kabartma örerek lastik yaparsın. Sırayı çevirince ön yüzde öne çıkanlara yine önden kabartma ör.', 'Alternate one front post and one back post for ribbing. After turning, work front posts over the stitches that stand forward on the right side.', 'Alterna uno por delante y otro por detrás. Al girar, sigue el relieve que se ve por el derecho.', 'Alterne um pela frente e um por trás. Ao virar, siga o relevo visto pelo direito.'),
      scene: () => <Diagram marks={ribRow()} />,
      viewBox: fitView(ribRow()),
      tip: l('Kabartma ilmekler daha çok ip harcar ve kumaşı daraltır; bere ağızlarında çok işe yarar.', 'Post stitches use more yarn and pull the fabric in, which is perfect for hat brims.', 'Gastan más hilo y estrechan el tejido: ideales para bordes de gorro.', 'Gastam mais fio e estreitam o tecido: ótimos para barras de gorro.'),
    },
  ],
  quiz: [
    {
      q: l('Önden kabartmada tığ gövdenin neresinden geçer?', 'In a front post stitch, where does the hook pass?', 'En el relieve por delante, ¿por dónde pasa la aguja?', 'No relevo pela frente, por onde passa a agulha?'),
      options: [l('Gövdenin arkasından', 'Behind the post', 'Por detrás del pilar', 'Por trás da haste'), l('Gövdenin önünden', 'In front of the post', 'Por delante del pilar', 'Pela frente da haste'), l('İlmeğin tepesinden', 'Through the top', 'Por arriba', 'Pelo topo')],
      answer: 0,
      explain: l('Önden girer, arkadan dolaşır, öne çıkar: gövde tığın önünde kalır ve ilmek öne itilir.', 'In from the front, around the back, out to the front: the post ends up in front of the hook and is pushed forward.', 'Entra por delante, rodea por detrás y sale por delante.', 'Entra pela frente, contorna por trás e sai pela frente.'),
    },
  ],
  summary: [l('Önden kabartma öne, arkadan kabartma geriye iter.', 'Front post pushes forward, back post pushes back.', 'Por delante sobresale, por detrás se hunde.', 'Pela frente sobressai, por trás afunda.')],
};

export default lesson;
