import { LongTailScene, SlipKnotScene } from '@/engine/illust/scenes';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-ilmek-atma-basparmak',
  intro: l(
    'Başparmakla (çift kuyruklu) ilmek atma esnek, düzgün bir kenar verir ve ilk sırayı da hazır örmüş gibi olursun. Sol elin bir sapan şeklini alır.',
    'The long-tail cast-on gives a neat, stretchy edge and works your first row at the same time. Your left hand makes a slingshot.',
    'El montaje de cola larga da un borde limpio y elástico, y además teje la primera vuelta. Tu mano izquierda forma un tirachinas.',
    'A montagem com fio longo dá uma borda bonita e elástica e já faz a primeira carreira. Sua mão esquerda vira um estilingue.',
  ),
  needs: [
    { kind: 'needles', text: l('Bir şiş', 'One needle', 'Una aguja', 'Uma agulha') },
    { kind: 'yarn', text: l('İp (kuyruk için bol pay bırak)', 'Yarn (leave a long tail)', 'Hilo (deja una cola larga)', 'Fio (deixe uma ponta longa)') },
  ],
  steps: [
    {
      title: l('Kuyruğu ölç', 'Measure the tail', 'Mide la cola', 'Meça a ponta'),
      text: l(
        'Kuyruk, örgünün eninin yaklaşık 3 katı olmalı (ya da her ilmek için 2,5 cm). Bu noktada kaygan düğümü şişe tak.',
        'The tail should be about 3 times the width of your piece (or 2.5 cm / 1 inch per stitch). Put a slip knot on the needle there.',
        'La cola debe medir unas 3 veces el ancho de la labor (o 2,5 cm por punto). Haz ahí el nudo corredizo.',
        'A ponta deve ter umas 3 vezes a largura do trabalho (ou 2,5 cm por ponto). Faça ali o nó corrediço.',
      ),
      scene: () => <SlipKnotScene phase="tighten" />,
    },
    {
      title: l('Sapan tutuşu', 'Slingshot hold', 'Posición de tirachinas', 'Posição de estilingue'),
      text: l(
        'Kuyruğu (sarı) başparmağının, yumağa giden ipi (mavi) işaret parmağının üstünden geçir. İki ipi avucunda diğer parmaklarınla tut. Şiş iki ipin arasında yukarıda dursun.',
        'Put the tail (yellow) over your thumb and the ball yarn (blue) over your index finger. Hold both strands in your palm with your other fingers. The needle rests above, between the strands.',
        'La cola (amarilla) sobre el pulgar y el hilo del ovillo (azul) sobre el índice. Sujeta ambos con los otros dedos. La aguja queda arriba, entre las hebras.',
        'A ponta (amarela) sobre o polegar e o fio do novelo (azul) sobre o indicador. Segure os dois com os outros dedos. A agulha fica em cima, entre os fios.',
      ),
      scene: () => <LongTailScene phase="setup" stitches={1} />,
    },
    {
      title: l('1 · Başparmak ilmeğine', '1 · Up through the thumb loop', '1 · Por el lazo del pulgar', '1 · Pela laçada do polegar'),
      text: l('Şiş ucunu başparmaktaki ipin önündeki koldan aşağıdan yukarı sok.', 'Bring the needle tip up through the loop on your thumb, under the front strand.', 'Mete la punta de abajo arriba por el lazo del pulgar, bajo la hebra delantera.', 'Passe a ponta de baixo para cima pela laçada do polegar, por baixo do fio da frente.'),
      scene: () => <LongTailScene phase="thumb" stitches={1} />,
    },
    {
      title: l('2 · İşaret parmağını yakala', '2 · Catch the index strand', '2 · Atrapa la hebra del índice', '2 · Pegue o fio do indicador'),
      text: l('Şişle işaret parmağındaki ipi üstten dolanıp yakala.', 'Go over the strand on your index finger and catch it with the needle.', 'Pasa por encima de la hebra del índice y atrápala con la aguja.', 'Passe por cima do fio do indicador e pegue-o com a agulha.'),
      scene: () => <LongTailScene phase="index" stitches={1} />,
    },
    {
      title: l('3 · Geri çık', '3 · Back down', '3 · Vuelve a bajar', '3 · Volte'),
      text: l('Yakaladığın iple birlikte başparmak ilmeğinin içinden geri aşağı çık.', 'Bring the caught yarn back down through the thumb loop.', 'Vuelve a bajar con la hebra atrapada por el lazo del pulgar.', 'Volte com o fio pego pela laçada do polegar.'),
      scene: () => <LongTailScene phase="back" stitches={1} />,
    },
    {
      title: l('4 · Başparmağı çek', '4 · Drop and snug', '4 · Suelta y ajusta', '4 · Solte e ajuste'),
      text: l('Başparmağındaki ilmeği bırak, başparmağını kuyruğa geçirip hafifçe ger. Şişte yeni bir ilmek var.', 'Let the loop slip off your thumb, put your thumb back on the tail and gently snug the stitch. A new stitch is on the needle.', 'Deja caer el lazo del pulgar, vuelve a poner el pulgar en la cola y ajusta suave. Hay un punto nuevo.', 'Solte a laçada do polegar, recoloque o polegar na ponta e ajuste de leve. Há um novo ponto.'),
      scene: () => <LongTailScene phase="tighten" stitches={2} />,
      tip: l('İlmekler arasında küçük bir boşluk bırak; kenar esnek kalır.', 'Leave a little space between stitches so the edge stays stretchy.', 'Deja un poco de espacio entre puntos para que el borde sea elástico.', 'Deixe um pequeno espaço entre os pontos para a borda ficar elástica.'),
    },
  ],
  practice: { text: l('Başparmak yöntemiyle 20 ilmek at.', 'Cast on 20 stitches with the long-tail method.', 'Monta 20 puntos con cola larga.', 'Monte 20 pontos com fio longo.'), target: 20, unit: 'stitch' },
  summary: [
    l('Kuyruk: enin 3 katı.', 'Tail: 3 times the width.', 'Cola: 3 veces el ancho.', 'Ponta: 3 vezes a largura.'),
    l('Başparmaktan gir, işaret parmağını yakala, geri çık.', 'Up through the thumb, catch the index strand, back down.', 'Por el pulgar, atrapa el índice, vuelve a bajar.', 'Pelo polegar, pegue o indicador, volte.'),
  ],
};

export default lesson;
