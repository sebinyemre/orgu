import { ChartReadScene } from '@/engine/illust/diagram';
import { COLOR_A, COLOR_B, ColorworkBack, ColorworkFront, DIAMOND_MOTIF, TwoColorScene } from '@/engine/illust/texture';
import { l, type Lesson } from '../types';

/** motif grafiği (alttan üste, 8 ilmek tekrar) */
const chart = [...DIAMOND_MOTIF].reverse().map((row) => row.split('').map((ch) => (ch === 'B' ? COLOR_B : COLOR_A)));

const lesson: Lesson = {
  id: 'sis-renkli',
  intro: l(
    'İki renkle örmede (Fair Isle, jakar) her sırada iki ip birlikte çalışır: biri örülürken öbürü işin arkasında gevşekçe bekler. Motif kareli bir grafikten okunur. Püf noktası arkadaki ip atlamalarının ne gevşek ne sıkı olmasıdır.',
    'In stranded colorwork (Fair Isle) two yarns travel along every row: one is knitted while the other waits loosely across the back. The motif is read from a grid chart. The key is keeping those back strands, the floats, neither loose nor tight.',
    'En el tejido de colores (Fair Isle) dos hebras recorren cada vuelta: una se teje y la otra espera floja por detrás. El motivo se lee de un gráfico. La clave es que las hebras de atrás no queden ni flojas ni tirantes.',
    'No tricô de duas cores (Fair Isle) dois fios percorrem cada carreira: um é tricotado e o outro espera solto por trás. O motivo é lido num gráfico. O segredo é que os fios de trás não fiquem nem frouxos nem apertados.',
  ),
  needs: [
    { kind: 'yarn', text: l('Belirgin karşıtlıkta iki renk, aynı kalınlıkta', 'Two contrasting colors of the same weight', 'Dos colores contrastados del mismo grosor', 'Duas cores contrastantes da mesma espessura') },
    { kind: 'circular', text: l('Yuvarlak örmek kolaylaştırır: hep ön yüzü görürsün', 'Knitting in the round helps: you always see the right side', 'Tejer en redondo ayuda: siempre ves el derecho', 'Tricotar em círculo ajuda: você sempre vê o direito') },
  ],
  steps: [
    {
      title: l('Grafiği oku', 'Read the chart', 'Lee el gráfico', 'Leia o gráfico'),
      text: l(
        'Her kare bir ilmek, kare rengi o ilmeğin rengidir. Yuvarlak örgüde her tur sağdan sola okunur. Bu motif 8 ilmekte bir tekrar eder.',
        'Each square is a stitch and its color is the stitch’s color. In the round every row is read right to left. This motif repeats every 8 stitches.',
        'Cada casilla es un punto y su color es el del punto. En redondo, cada vuelta se lee de derecha a izquierda. El motivo se repite cada 8 puntos.',
        'Cada casa é um ponto e sua cor é a do ponto. Em círculo, cada volta é lida da direita para a esquerda. O motivo se repete a cada 8 pontos.',
      ),
      scene: () => <ChartReadScene cells={chart} row={4} round cell={30} />,
    },
    {
      title: l('İki ipi tut', 'Hold both yarns', 'Sujeta ambas hebras', 'Segure os dois fios'),
      text: l(
        'İki ip de arkada dursun. Gerekeni alıp ör; öbürü arkada bekler. Bir ipi sağ, öbürünü sol elinde tutarsan dolaşmaz.',
        'Keep both yarns at the back. Pick up the one you need and knit; the other waits behind. Holding one in each hand stops them tangling.',
        'Deja ambas hebras detrás. Toma la que necesitas y teje; la otra espera. Una en cada mano evita que se enreden.',
        'Deixe os dois fios atrás. Pegue o que precisa e tricote; o outro espera. Um em cada mão evita que embolem.',
      ),
      scene: () => <TwoColorScene />,
      tip: l('Hep aynı rengi üstten, öbürünü alttan taşırsan ön yüzde renkler daha düzgün görünür.', 'Always carrying the same color on top and the other below makes the colors look more even on the front.', 'Llevar siempre el mismo color por arriba y el otro por abajo da un dibujo más parejo.', 'Levar sempre a mesma cor por cima e a outra por baixo deixa o desenho mais uniforme.'),
    },
    {
      title: l('Ön yüz', 'The right side', 'El derecho', 'O direito'),
      text: l('Grafikteki motif ön yüzde aynen belirir.', 'The chart’s motif appears exactly on the right side.', 'El motivo del gráfico aparece igual en el derecho.', 'O motivo do gráfico aparece igual no direito.'),
      scene: () => <ColorworkFront />,
    },
    {
      title: l('Arkadaki atlamalar', 'Floats on the back', 'Hebras flotantes detrás', 'Fios soltos atrás'),
      text: l(
        'Arka yüzde kullanılmayan renk yatay bir ip olarak uzanır. Atlamadan önce sağ şişteki ilmekleri biraz yay: ip bu genişliğe göre gevşek kalır ve kumaş büzülmez.',
        'On the back the unused color lies as a horizontal strand. Spread the stitches on the right needle before you carry the yarn: the float matches that width and the fabric won’t pucker.',
        'Por detrás el color que no se usa queda como una hebra horizontal. Extiende los puntos de la aguja derecha antes de llevarla: así no se frunce.',
        'No avesso a cor não usada fica como um fio horizontal. Espalhe os pontos da agulha direita antes de levar o fio: assim o tecido não franze.',
      ),
      scene: () => <ColorworkBack />,
    },
    {
      title: l('Uzun atlamaları yakala', 'Catch long floats', 'Sujeta las hebras largas', 'Prenda os fios longos'),
      text: l(
        '5 ilmekten uzun atlamalar parmağa takılır. Ortalarında bir kez, örülen iple bekleyen ipi çaprazlayarak sabitle.',
        'Floats longer than 5 stitches catch fingers. Halfway along, twist the waiting yarn once around the working yarn to tack it down.',
        'Las hebras de más de 5 puntos se enganchan. A mitad de camino, cruza una vez la hebra que espera con la que trabajas.',
        'Fios de mais de 5 pontos enroscam nos dedos. No meio do caminho, cruze uma vez o fio que espera com o que está tricotando.',
      ),
      scene: () => <ColorworkBack catchLong />,
    },
  ],
  practice: {
    text: l('80 ilmekle yuvarlakta bu baklava motifini 2 kez tekrarla (16 tur).', 'In the round on 80 stitches, work this diamond motif twice (16 rounds).', 'En redondo con 80 puntos, teje el motivo de rombos dos veces (16 vueltas).', 'Em círculo com 80 pontos, faça o motivo de losangos duas vezes (16 voltas).'),
    target: 16,
    unit: 'round',
  },
  quiz: [
    {
      q: l('Arkadaki atlamalar sıkı olursa ne olur?', 'What happens if the floats are too tight?', '¿Qué pasa si las hebras quedan tirantes?', 'O que acontece se os fios ficarem apertados?'),
      options: [l('Kumaş büzülür', 'The fabric puckers', 'El tejido se frunce', 'O tecido franze'), l('Renkler karışır', 'The colors mix', 'Se mezclan los colores', 'As cores se misturam'), l('Hiçbir şey', 'Nothing', 'Nada', 'Nada')],
      answer: 0,
    },
  ],
  summary: [
    l('Grafik: kare = ilmek, renk = ip.', 'Chart: square = stitch, color = yarn.', 'Gráfico: casilla = punto, color = hebra.', 'Gráfico: casa = ponto, cor = fio.'),
    l('Atlamalar gevşek, 5’ten uzunsa yakala.', 'Keep floats relaxed; catch any longer than 5.', 'Hebras flojas; sujeta las de más de 5.', 'Fios relaxados; prenda os maiores que 5.'),
  ],
};

export default lesson;
