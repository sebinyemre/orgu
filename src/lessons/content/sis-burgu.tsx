import { ChartReadScene } from '@/engine/illust/diagram';
import { CableScene, CableSwatch } from '@/engine/illust/texture';
import { l, type Lesson } from '../types';

/** 2 ters, 4 ilmeklik burgu, 2 ters; 4 sırada bir, ön yüz sırasında çapraz (alttan üste) */
const cableChart = [
  ['p', 'p', 'k', 'k', 'k', 'k', 'p', 'p'],
  ['p', 'p', 'k', 'k', 'k', 'k', 'p', 'p'],
  ['p', 'p', 'c4l', '>', '>', '>', 'p', 'p'],
  ['p', 'p', 'k', 'k', 'k', 'k', 'p', 'p'],
];

const lesson: Lesson = {
  id: 'sis-burgu',
  intro: l(
    'Burgu (saç örgüsü), ilmeklerin sırasını değiştirip birbirinin üstünden çaprazlamasıdır. Birkaç ilmeği kısa bir yardımcı şişe alıp işin önünde ya da arkasında bekletir, sonrakileri örer, sonra bekleyenleri örersin. Önde bekletirsen burgu sola, arkada bekletirsen sağa yatar.',
    'A cable crosses stitches over each other by changing their order. You hold a few stitches on a short cable needle in front of or behind the work, knit the next ones, then knit the held ones. Held in front, the cable leans left; held behind, it leans right.',
    'Un ocho cruza puntos cambiando su orden. Pones unos puntos en una aguja auxiliar delante o detrás de la labor, tejes los siguientes y luego los guardados. Delante, el ocho se inclina a la izquierda; detrás, a la derecha.',
    'Uma trança cruza pontos trocando sua ordem. Você coloca alguns pontos numa agulha auxiliar na frente ou atrás do trabalho, tricota os próximos e depois os guardados. Na frente, a trança inclina para a esquerda; atrás, para a direita.',
  ),
  needs: [{ kind: 'cable', text: l('Yardımcı (burgu) şiş ya da ince bir çorap şişi', 'Cable needle or a thin DPN', 'Aguja auxiliar o una de doble punta fina', 'Agulha auxiliar ou uma de pontas duplas fina') }],
  steps: [
    {
      title: l('1 · İki ilmeği yardımcı şişe al', '1 · Slip two to the cable needle', '1 · Pasa dos a la auxiliar', '1 · Passe dois para a auxiliar'),
      text: l(
        'Burgu ilmeklerine (turuncu) gelince ilk iki ilmeği ters kaydırır gibi yardımcı şişe al.',
        'At the cable stitches (orange), slip the first two purlwise onto the cable needle.',
        'Al llegar a los puntos del ocho (naranja), pasa los dos primeros a la aguja auxiliar como del revés.',
        'Ao chegar nos pontos da trança (laranja), passe os dois primeiros para a auxiliar como tricô.',
      ),
      scene: () => <CableScene phase="slip" />,
    },
    {
      title: l('2 · Önde beklet, sonrakileri ör', '2 · Hold in front, knit the next', '2 · Delante y teje los siguientes', '2 · Na frente, tricote os próximos'),
      text: l(
        'Yardımcı şişi işin ÖNÜNDE bırak ve sol şişteki sonraki iki ilmeği düz ör.',
        'Leave the cable needle IN FRONT of the work and knit the next two stitches from the left needle.',
        'Deja la auxiliar DELANTE de la labor y teje los dos puntos siguientes de la aguja izquierda.',
        'Deixe a auxiliar NA FRENTE do trabalho e tricote os dois próximos pontos da agulha esquerda.',
      ),
      scene: () => <CableScene phase="hold" />,
    },
    {
      title: l('3 · Bekleyenleri ör', '3 · Knit the held stitches', '3 · Teje los guardados', '3 · Tricote os guardados'),
      text: l(
        'Şimdi yardımcı şişteki iki ilmeği doğrudan yardımcı şişten düz ör. Dört ilmek yer değiştirdi: bu bir sola burgu (C4F).',
        'Now knit the two stitches straight off the cable needle. Four stitches have swapped places: a left cross (C4F).',
        'Ahora teje los dos puntos directamente de la auxiliar. Cuatro puntos cambiaron de sitio: un cruce a la izquierda (C4F).',
        'Agora tricote os dois pontos direto da auxiliar. Quatro pontos trocaram de lugar: um cruzamento à esquerda (C4F).',
      ),
      scene: () => <CableScene phase="fromCn" />,
      tip: l('Arkada bekletirsen (C4B) burgu sağa döner. Halat burgu için hep aynısını yap.', 'Hold behind (C4B) and the cross turns right. For a rope cable, always use the same one.', 'Si la dejas detrás (C4B) gira a la derecha. Para una soga, repite siempre el mismo.', 'Atrás (C4B) gira para a direita. Para uma corda, repita sempre o mesmo.'),
    },
    {
      title: l('Grafikte burgu', 'Cables on a chart', 'El ocho en el gráfico', 'A trança no gráfico'),
      text: l(
        'Grafikte burgu birkaç kareye yayılan çapraz çizgilerle gösterilir. Bu örnekte 3. sırada çapraz yapılır ve 4 sırada bir tekrarlanır; aradaki sıralar ilmekler nasıl görünüyorsa öyle örülür.',
        'Charts draw a cable as crossing lines spanning several squares. Here the cross is on row 3 and repeats every 4 rows; work the rows in between as the stitches appear.',
        'En los gráficos el ocho se dibuja con líneas cruzadas sobre varias casillas. Aquí el cruce está en la vuelta 3 y se repite cada 4; las intermedias se tejen como se presentan.',
        'Nos gráficos a trança aparece como linhas cruzadas sobre várias casas. Aqui o cruzamento fica na carreira 3 e se repete a cada 4; as do meio são feitas como os pontos se apresentam.',
      ),
      scene: () => <ChartReadScene cells={cableChart} row={3} cell={36} />,
    },
    {
      title: l('Halat burgu', 'A rope cable', 'Ocho de soga', 'Trança corda'),
      text: l(
        'Aynı çaprazı düzenli aralıklarla tekrarlayınca ters zemin üzerinde kabarık bir halat oluşur.',
        'Repeat the same cross at regular intervals and a raised rope forms on the purl background.',
        'Repitiendo el mismo cruce a intervalos regulares, aparece una soga en relieve sobre fondo revés.',
        'Repetindo o mesmo cruzamento em intervalos regulares, surge uma corda em relevo sobre fundo tricô.',
      ),
      scene: () => <CableSwatch />,
    },
  ],
  practice: {
    text: l('24 ilmek: *2 ters, 4 düz* ile başla; her 6. sırada 4’lük burguları sola çaprazla. 24 sıra ör.', 'On 24 stitches work *p2, k4*; cross each 4-stitch cable to the left every 6th row. Knit 24 rows.', 'Con 24 puntos teje *2 r, 4 d*; cruza a la izquierda cada 6 vueltas. Teje 24 vueltas.', 'Com 24 pontos faça *2 t, 4 m*; cruze à esquerda a cada 6 carreiras. Faça 24 carreiras.'),
    target: 24,
    unit: 'row',
  },
  quiz: [
    {
      q: l('Yardımcı şişi önde bekletirsen burgu hangi yöne yatar?', 'Holding the cable needle in front makes the cable lean which way?', 'Con la auxiliar delante, ¿hacia dónde se inclina el ocho?', 'Com a auxiliar na frente, para onde a trança inclina?'),
      options: [l('Sola', 'Left', 'Izquierda', 'Esquerda'), l('Sağa', 'Right', 'Derecha', 'Direita'), l('Dik kalır', 'Straight', 'Recto', 'Reto')],
      answer: 0,
    },
  ],
  summary: [
    l('Önde beklet: sola. Arkada beklet: sağa.', 'Hold in front: left. Hold behind: right.', 'Delante: izquierda. Detrás: derecha.', 'Na frente: esquerda. Atrás: direita.'),
    l('Çapraz sıraları say; aralar desen nasıl görünüyorsa öyle örülür.', 'Count rows between crosses; work the others as the stitches appear.', 'Cuenta las vueltas entre cruces; las demás, como se presentan.', 'Conte as carreiras entre cruzamentos; as outras, como se apresentam.'),
  ],
};

export default lesson;
