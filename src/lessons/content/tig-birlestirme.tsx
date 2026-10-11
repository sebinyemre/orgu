import { JoinScene } from '@/engine/illust/crochet2';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-birlestirme',
  intro: l(
    'Motifleri birleştirmenin üç yaygın yolu var: {slst} ile düz ve görünmez bir dikiş, {sc} ile kabarık ve süs gibi bir sırt, yün iğnesiyle de esnek, gizli bir dikiş. Hepsinde iki motifi yüz yüze ya da yan yana tutup kenar ilmeklerini eşlersin.',
    'There are three common ways to join motifs: a flat, discreet seam with {slst}, a raised decorative ridge with {sc}, and a stretchy, hidden whipstitch with a tapestry needle. In each you hold two motifs together and match their edge stitches.',
    'Hay tres formas habituales de unir motivos: costura plana con {slst}, cordón en relieve con {sc} y costura flexible con aguja lanera. En todas emparejas los puntos del borde.',
    'Há três formas comuns de unir motivos: costura plana com {slst}, cordão em relevo com {sc} e costura flexível com agulha de tapeçaria. Em todas você emparelha os pontos da borda.',
  ),
  needs: [{ kind: 'tapestry', text: l('Dikiş için yün iğnesi', 'Tapestry needle for sewing', 'Aguja lanera para coser', 'Agulha de tapeçaria para costurar') }],
  steps: [
    {
      title: l('{Slst} ile birleştirme', 'Joining with {slst}', 'Unir con {slst}', 'Unir com {slst}'),
      text: l(
        'Motifleri ters yüzleri içe gelecek şekilde üst üste koy. Tığı iki motifin karşılıklı ilmeklerinden birden geçir ve {slst} yap. Düz, ince bir dikiş olur.',
        'Place the motifs right sides together. Insert the hook through matching stitches of both and work a {slst}. The seam is flat and slim.',
        'Pon los motivos derecho con derecho. Pasa la aguja por los puntos enfrentados y haz un {slst}. Costura plana y fina.',
        'Coloque os motivos direito com direito. Passe a agulha pelos pontos correspondentes e faça um {slst}. Costura plana e fina.',
      ),
      scene: () => <JoinScene method="slst" />,
    },
    {
      title: l('{Sc} ile birleştirme', 'Joining with {sc}', 'Unir con {sc}', 'Unir com {sc}'),
      text: l(
        'Motifleri ters yüzleri birbirine bakacak şekilde tutarsan {sc} ile birleştirme ön yüzde kabarık bir sırt bırakır. Kontrast renkte çok güzel durur.',
        'Holding the motifs wrong sides together, a {sc} join leaves a raised ridge on the front. It looks great in a contrast color.',
        'Revés con revés, la unión con {sc} deja un cordón en relieve por el derecho. Queda muy bien en color contraste.',
        'Avesso com avesso, a união com {sc} deixa um cordão em relevo no direito. Fica lindo em cor contrastante.',
      ),
      scene: () => <JoinScene method="sc" />,
    },
    {
      title: l('Yün iğnesiyle dikiş', 'Whipstitch', 'Costura por encima', 'Costura chuleado'),
      text: l(
        'İpi yün iğnesine geçir. İki kenarın yalnız dış halkalarından, hep aynı yönden geçerek dik. Esnektir ve neredeyse görünmez.',
        'Thread the yarn on a tapestry needle. Sew through the outer loops of both edges, always from the same side. Stretchy and nearly invisible.',
        'Enhebra la aguja lanera. Cose por las hebras exteriores de ambos bordes, siempre desde el mismo lado. Elástica y casi invisible.',
        'Passe o fio na agulha de tapeçaria. Costure pelas alças externas das duas bordas, sempre do mesmo lado. Elástica e quase invisível.',
      ),
      scene: () => <JoinScene method="whip" />,
      tip: l('Önce köşeleri eşle, sonra ortaya doğru ilerle; ilmek sayıları aynı olmalı.', 'Match the corners first, then work toward the middle; the stitch counts must match.', 'Empareja primero las esquinas; los puntos deben coincidir.', 'Emparelhe primeiro os cantos; as contagens devem bater.'),
    },
  ],
  quiz: [
    {
      q: l('Hangi birleştirme ön yüzde kabarık bir sırt bırakır?', 'Which join leaves a raised ridge on the front?', '¿Qué unión deja un cordón en relieve?', 'Qual união deixa um cordão em relevo?'),
      options: [l('{Sc}, ters yüzler birbirine bakarken', '{Sc}, wrong sides together', '{Sc}, revés con revés', '{Sc}, avesso com avesso'), l('{Slst}, ön yüzler birbirine bakarken', '{Slst}, right sides together', '{Slst}, derecho con derecho', '{Slst}, direito com direito'), l('Yün iğnesiyle dikiş', 'Whipstitch', 'Costura por encima', 'Chuleado')],
      answer: 0,
    },
  ],
  summary: [l('{Slst}: düz. {Sc}: kabarık. İğne: esnek ve gizli.', '{Slst}: flat. {Sc}: raised. Needle: stretchy and hidden.', '{Slst}: plana. {Sc}: en relieve. Aguja: flexible y oculta.', '{Slst}: plana. {Sc}: em relevo. Agulha: flexível e escondida.')],
};

export default lesson;
