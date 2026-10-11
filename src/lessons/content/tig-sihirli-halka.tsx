import { MagicRingScene } from '@/engine/illust/scenes';
import { Diagram, circleMarks, zoomView } from '@/engine/illust/diagram';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-sihirli-halka',
  intro: l(
    'Sihirli halka (amigurumi halkası), yuvarlak işlere ortası delik kalmadan başlamanın yoludur. İpi bir halka gibi sarar, ilk turu bu halkanın içine örer, sonra kuyruğu çekip halkayı tamamen kapatırsın.',
    'The magic ring (magic circle) starts work in the round with no hole in the middle. You wrap the yarn into a loop, work the first round into it, then pull the tail to close the ring completely.',
    'El anillo mágico permite empezar en redondo sin agujero en el centro. Enrollas la hebra en un aro, tejes la primera vuelta dentro y tiras de la cola para cerrarlo del todo.',
    'O anel mágico começa o trabalho em círculo sem furo no meio. Você enrola o fio num aro, faz a primeira volta dentro dele e puxa a ponta para fechar tudo.',
  ),
  steps: [
    {
      title: l('1 · Halka sar', '1 · Wrap a loop', '1 · Haz un aro', '1 · Faça um aro'),
      text: l(
        'İpin ucunu 15 cm bırak. Çalışan ipi iki parmağının etrafından bir kez sar; kuyruk ve çalışan ip halkanın altında çaprazlansın.',
        'Leave a 15 cm (6 in) tail. Wrap the working yarn once around two fingers so the tail and working yarn cross below the loop.',
        'Deja 15 cm de cola. Enrolla la hebra una vez alrededor de dos dedos, cruzando cola y hebra bajo el aro.',
        'Deixe 15 cm de ponta. Enrole o fio uma vez em dois dedos, cruzando ponta e fio embaixo do aro.',
      ),
      scene: () => <MagicRingScene phase="wrap" />,
    },
    {
      title: l('2 · Halkanın içine bat', '2 · Insert into the ring', '2 · Entra en el aro', '2 · Entre no aro'),
      text: l('Tığı halkanın içinden sok, çalışan ipi yakala.', 'Insert the hook through the ring and catch the working yarn.', 'Mete la aguja por el aro y toma la hebra de trabajo.', 'Passe a agulha pelo aro e pegue o fio de trabalho.'),
      scene: () => <MagicRingScene phase="insert" />,
    },
    {
      title: l('3 · Çek ve zincir', '3 · Pull up and chain', '3 · Saca y haz cadeneta', '3 · Puxe e faça correntinha'),
      text: l(
        'İpi halkanın içinden çek, sonra bir zincir çek. Bu zincir ilmek sayılmaz, halkayı sabitler.',
        'Pull the yarn through the ring, then chain one. This chain doesn’t count as a stitch; it locks the ring.',
        'Saca la hebra por el aro y haz una cadeneta. No cuenta como punto: fija el aro.',
        'Puxe o fio pelo aro e faça uma correntinha. Ela não conta como ponto: trava o aro.',
      ),
      scene: () => <MagicRingScene phase="pull" />,
    },
    {
      title: l('4 · Halkanın içine ör', '4 · Work into the ring', '4 · Teje dentro del aro', '4 · Trabalhe dentro do aro'),
      text: l(
        'İlk turun ilmeklerini (genelde 6 {sc}) hem halkanın hem kuyruğun üstünden, halkanın içine ör.',
        'Work the first round (usually 6 {sc}) into the ring, over both the ring and the tail.',
        'Teje la primera vuelta (normalmente 6 {sc}) dentro del aro, sobre aro y cola.',
        'Faça a primeira volta (geralmente 6 {sc}) dentro do aro, sobre aro e ponta.',
      ),
      scene: () => <MagicRingScene phase="work" count={4} />,
    },
    {
      title: l('5 · Kuyruğu çek, kapat', '5 · Pull the tail closed', '5 · Tira de la cola', '5 · Puxe a ponta'),
      text: l(
        'Kuyruğu sıkıca çek: halka büzülür ve ortadaki delik tamamen kapanır. Turu ilk ilmeğe bir {slst} ile birleştir ya da spiral devam et.',
        'Pull the tail firmly: the ring cinches and the center hole closes. Join with a {slst} into the first stitch, or keep going in a spiral.',
        'Tira fuerte de la cola: el aro se cierra del todo. Une con un {slst} al primer punto o sigue en espiral.',
        'Puxe a ponta com firmeza: o aro fecha totalmente. Una com um {slst} no primeiro ponto ou siga em espiral.',
      ),
      scene: () => <MagicRingScene phase="close" count={6} />,
      tip: l('Kuyruğu ilk birkaç turdan sonra bir kez daha çekip sonra gizle; halka gevşemez.', 'Tug the tail again after a few rounds before weaving it in, so the ring stays shut.', 'Vuelve a tirar de la cola tras unas vueltas antes de esconderla.', 'Puxe a ponta de novo depois de algumas voltas antes de escondê-la.'),
    },
    {
      title: l('Şemada', 'On a diagram', 'En el diagrama', 'No diagrama'),
      text: l('Şemalarda sihirli halka ortadaki küçük bir daireyle, ilk turun ilmekleri de onun etrafında gösterilir.', 'Diagrams show the magic ring as a small circle in the center, with the first round around it.', 'En los diagramas el anillo es un círculo pequeño en el centro con la primera vuelta alrededor.', 'Nos diagramas o anel é um círculo pequeno no centro com a primeira volta ao redor.'),
      scene: () => <Diagram marks={circleMarks({ rounds: 1, size: 34, step: 52 })} />,
      viewBox: zoomView(84),
    },
  ],
  practice: {
    text: l('Sihirli halka yap, içine 6 {sc} ör, kuyruğu çekip kapat. Üç kez tekrarla.', 'Make a magic ring, work 6 {sc} into it and pull it closed. Repeat three times.', 'Haz un anillo mágico, teje 6 {sc} y ciérralo. Repite tres veces.', 'Faça um anel mágico, 6 {sc} dentro e feche. Repita três vezes.'),
    target: 6,
    unit: 'stitch',
  },
  quiz: [
    {
      q: l('Sihirli halkanın zincir halkaya göre üstünlüğü nedir?', 'What does a magic ring do better than a chain ring?', '¿Qué ventaja tiene sobre el aro de cadenetas?', 'Qual a vantagem sobre o aro de correntinhas?'),
      options: [l('Ortası tamamen kapanır', 'The center closes completely', 'El centro se cierra del todo', 'O centro fecha totalmente'), l('Daha hızlı biter', 'It’s quicker', 'Es más rápido', 'É mais rápido'), l('Daha az ip harcar', 'It uses less yarn', 'Gasta menos hilo', 'Gasta menos fio')],
      answer: 0,
    },
  ],
  summary: [
    l('Sar, bat, çek, zincir, halkaya ör, kuyruğu çek.', 'Wrap, insert, pull up, chain, work into the ring, pull the tail.', 'Enrolla, entra, saca, cadeneta, teje en el aro, tira de la cola.', 'Enrole, entre, puxe, correntinha, trabalhe no aro, puxe a ponta.'),
  ],
};

export default lesson;
