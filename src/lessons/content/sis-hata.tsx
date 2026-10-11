import { KnitScene } from '@/engine/illust/knit';
import { Arrow } from '@/engine/illust/parts';
import { LadderScene } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-hata',
  intro: l(
    'Hata yapmak örgünün parçasıdır. İlmek ilmek geri sökmeyi ve kaçan bir ilmeği tığla yakalayıp yukarı taşımayı öğrenince hiçbir hata seni korkutmaz.',
    'Mistakes are part of knitting. Once you can unknit stitch by stitch and rescue a dropped stitch with a crochet hook, nothing will scare you.',
    'Equivocarse es parte de tejer. Cuando sepas deshacer punto a punto y recoger un punto escapado con ganchillo, nada te asustará.',
    'Errar faz parte do tricô. Quando souber desmanchar ponto a ponto e recuperar um ponto caído com agulha de crochê, nada vai assustar você.',
  ),
  needs: [{ kind: 'hook', text: l('Bir tığ (şişinle aynı ya da biraz ince)', 'A crochet hook (same size as your needle or smaller)', 'Un ganchillo (igual o más fino que tus agujas)', 'Uma agulha de crochê (igual ou mais fina que suas agulhas)') }],
  steps: [
    {
      title: l('İlmek ilmek geri sök', 'Unknit stitch by stitch', 'Deshaz punto a punto', 'Desmanche ponto a ponto'),
      text: l(
        'Sol şişin ucunu sağ şişteki son ilmeğin hemen altındaki ilmeğe önden sok, sonra sağ şişi çıkar ve ipi çek. İlmek sol şişe geri döner.',
        'Insert the left needle tip from the front into the stitch just below the last one on the right needle, slide the right needle out and pull the yarn. The stitch is back on the left needle.',
        'Mete la punta izquierda por delante en el punto justo debajo del último de la aguja derecha, saca la derecha y tira de la hebra. El punto vuelve a la izquierda.',
        'Insira a ponta esquerda pela frente no ponto logo abaixo do último da agulha direita, tire a direita e puxe o fio. O ponto volta para a esquerda.',
      ),
      scene: () => <KnitScene left={3} right={3} rn="rest" arrows={<Arrow d="M232 110 C260 96 290 110 300 140" n={1} start={[220, 100]} />} />,
    },
    {
      title: l('Kaçan ilmeği bul', 'Find the dropped stitch', 'Encuentra el punto escapado', 'Ache o ponto caído'),
      text: l('Kaçan ilmek aşağıya doğru merdiven gibi yatay iplikler bırakır. İlmeğin kendisini bir işaretleyiciyle tut ki daha da kaçmasın.', 'A dropped stitch leaves a ladder of horizontal strands. Secure the loop with a marker so it does not run further.', 'Un punto escapado deja una escalera de hebras horizontales. Sujeta el lazo con un marcador para que no baje más.', 'Um ponto caído deixa uma escadinha de fios horizontais. Prenda a laçada com um marcador para não descer mais.'),
      scene: () => <LadderScene phase="see" />,
      dur: 3,
    },
    {
      title: l('1 · Tığı ilmeğe sok', '1 · Hook the loop', '1 · Mete el ganchillo', '1 · Pegue a laçada'),
      text: l('Ön yüzden bakarak tığı ilmeğin içine önden arkaya sok; en alttaki yatay ip ilmeğin arkasında kalsın.', 'From the right side, put the hook through the loop from front to back, with the lowest ladder strand behind the loop.', 'Desde el derecho, mete el ganchillo por el lazo de delante hacia atrás, con la hebra más baja detrás.', 'Pelo lado direito, passe a agulha de crochê pela laçada da frente para trás, com o fio mais baixo atrás.'),
      scene: () => <LadderScene phase="hook" />,
    },
    {
      title: l('2 · Basamağı çek', '2 · Pull the rung through', '2 · Saca el peldaño', '2 · Puxe o degrau'),
      text: l('Yatay ipi tığla yakala ve ilmeğin içinden öne çek. İlmek bir sıra yukarı çıktı. Her basamak için tekrarla, sonra şişe tak.', 'Catch the horizontal strand and pull it through the loop. The stitch climbs one row. Repeat for every rung, then put it back on the needle.', 'Atrapa la hebra horizontal y sácala por el lazo. El punto sube una vuelta. Repite en cada peldaño y vuelve a la aguja.', 'Pegue o fio horizontal e puxe pela laçada. O ponto sobe uma carreira. Repita em cada degrau e volte para a agulha.'),
      scene: () => <LadderScene phase="pull" />,
      tip: l('Uzun işlerde arada bir "can simidi" bırak: ince bir ipi bir sıranın ilmeklerinden geçir. Sökmen gerekirse oraya kadar güvenle sökersin.', 'On long projects thread a "lifeline": a thin yarn through all stitches of one row. If you need to rip back, you stop safely there.', 'En labores largas pasa una "línea de vida": un hilo fino por los puntos de una vuelta. Si deshaces, paras ahí.', 'Em trabalhos longos passe uma "linha de segurança": um fio fino pelos pontos de uma carreira. Se desmanchar, para ali.'),
    },
  ],
  summary: [
    l('Geri sökme: alttaki ilmeğe bat, sağ şişi çıkar.', 'Unknit: insert into the stitch below, remove the right needle.', 'Deshacer: entra en el punto de abajo, saca la aguja.', 'Desmanchar: entre no ponto de baixo, tire a agulha.'),
    l('Kaçan ilmek: tığla basamak basamak yukarı.', 'Dropped stitch: climb the ladder with a hook.', 'Punto escapado: sube la escalera con ganchillo.', 'Ponto caído: suba a escada com a agulha de crochê.'),
  ],
};

export default lesson;
