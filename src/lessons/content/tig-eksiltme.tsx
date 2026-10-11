import { CLOSEUP_VIEW, LoopsCloseUpScene } from '@/engine/illust/closeup';
import { CrochetScene, crochetArrows } from '@/engine/illust/crochet';
import { Diagram, ROUND_COLORS, chainRowMarks, type Mark, fitView } from '@/engine/illust/diagram';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

const N2 = [YARN.second, YARN.main];
const N3 = [YARN.second, YARN.second, YARN.main];

/** her 3. ve 4. ilmek birlikte örülen sıra (ters V) */
function decRow(): Mark[] {
  const marks: Mark[] = chainRowMarks(10, 196, 20, 40, 28, 0);
  const c = ROUND_COLORS[1];
  for (let i = 0; i < 10; ) {
    const x = 20 + i * 40;
    if (i % 4 === 2) {
      marks.push({ id: 'sc2tog', at: [x + 20, 160], size: 48, color: c, group: 1 });
      i += 2;
    } else {
      marks.push({ id: 'sc', at: [x, 162], size: 40, color: c, group: 1 });
      i += 1;
    }
  }
  return marks;
}

const lesson: Lesson = {
  id: 'tig-eksiltme',
  intro: l(
    'Eksiltme iki ilmeği birlikte tek ilmek gibi bitirmektir. Klasik yolda iki ilmekten de ip çekip hepsinden birden geçirirsin. Amigurumide ise "görünmez eksiltme" kullanılır: yalnız ön halkalara batıldığı için delik ve tümsek bırakmaz.',
    'A decrease finishes two stitches together as one. The classic way pulls up a loop in each and then goes through all. Amigurumi uses the "invisible decrease": working only the front loops leaves no gap or bump.',
    'Disminuir es cerrar dos puntos juntos como uno. Lo clásico es sacar un lazo de cada uno y cerrar todos. En amigurumi se usa la "disminución invisible": solo por las hebras delanteras, sin huecos ni bultos.',
    'Diminuir é fechar dois pontos juntos como um. O clássico é puxar uma alça de cada um e fechar todas. No amigurumi usa-se a "diminuição invisível": só nas alças da frente, sem buracos nem calombos.',
  ),
  steps: [
    {
      title: l('1 · İlk ilmekten çek', '1 · Pull up in the first', '1 · Saca del primero', '1 · Puxe do primeiro'),
      text: l('İlk ilmeğe bat, ip at ve çek. Tığda 2 ilmek var; bitirme.', 'Insert in the first stitch, yarn over and pull up. 2 loops on the hook; don’t finish.', 'Entra en el primero, lazada y saca. 2 lazos en la aguja; no cierres.', 'Entre no primeiro, laçada e puxe. 2 alças na agulha; não feche.'),
      scene: () => <CrochetScene hook="pulled" hookFrom="inserted" loops={2} pulledLoop loopColors={N2} arrows={crochetArrows.pullUp(1)} />,
      loopsOnHook: 2,
    },
    {
      title: l('2 · İkinci ilmekten de çek', '2 · Pull up in the second', '2 · Saca del segundo', '2 · Puxe do segundo'),
      text: l('Sonraki ilmeğe bat, ip at ve çek. Tığda 3 ilmek var.', 'Insert in the next stitch, yarn over and pull up. 3 loops on the hook.', 'Entra en el siguiente, lazada y saca. 3 lazos.', 'Entre no próximo, laçada e puxe. 3 alças.'),
      scene: () => <CrochetScene hook="pulled" hookFrom="inserted" loops={3} pulledLoop loopColors={N3} arrows={crochetArrows.pullUp(2)} />,
      loopsOnHook: 3,
    },
    {
      title: l('3 · Üçünden birden geçir', '3 · Through all three', '3 · Cierra las tres', '3 · Feche as três'),
      text: l('İp at ve tığdaki 3 ilmekten birden geçir. İki ilmek bir oldu.', 'Yarn over and pull through all 3 loops. Two stitches became one.', 'Lazada y cierra los 3 lazos. Dos puntos pasan a uno.', 'Laçada e feche as 3 alças. Dois pontos viram um.'),
      scene: () => <CrochetScene hook="pulled" loops={3} loopColors={N3} yo through={{ n: 4, at: [0.2, 0.6] }} arrows={crochetArrows.through(3)} />,
      loopsOnHook: 1,
    },
    {
      title: l('Görünmez · İki ön halkaya bat', 'Invisible · Into two front loops', 'Invisible · Dos hebras delanteras', 'Invisível · Duas alças da frente'),
      text: l(
        'Tığı sonraki iki ilmeğin yalnız ÖN halkalarının altından, ikisine birden sok. Tığda 3 ilmek varmış gibi görünür ama halkalar çok kısadır.',
        'Insert the hook under the FRONT loops only of the next two stitches, both at once. It looks like 3 loops on the hook, but the front loops are short.',
        'Mete la aguja solo bajo las hebras DELANTERAS de los dos puntos siguientes, a la vez.',
        'Passe a agulha só sob as alças da FRENTE dos dois próximos pontos, de uma vez.',
      ),
      scene: () => <LoopsCloseUpScene part="front" count={2} n={1} />,
      viewBox: CLOSEUP_VIEW,
    },
    {
      title: l('Görünmez · Çek ve bitir', 'Invisible · Pull through and finish', 'Invisible · Saca y cierra', 'Invisível · Puxe e feche'),
      text: l(
        'İp at, iki ön halkanın içinden çek (tığda 2 ilmek), yine ip at ve ikisinden geçir. Ön yüzde neredeyse hiç iz kalmaz.',
        'Yarn over, pull through both front loops (2 loops on hook), yarn over and pull through both. It barely shows on the right side.',
        'Lazada, saca por las dos hebras delanteras (2 lazos), lazada y cierra ambos. Casi no se nota.',
        'Laçada, puxe pelas duas alças da frente (2 alças), laçada e feche as duas. Quase não aparece.',
      ),
      scene: () => <CrochetScene hook="pulled" loops={2} pulledLoop loopColors={N2} yo through={{ n: 3, at: [0.2, 0.6] }} arrows={crochetArrows.through(2)} />,
      loopsOnHook: 1,
    },
    {
      title: l('Şemada eksiltme', 'Decreases on a diagram', 'Disminuciones en el diagrama', 'Diminuições no diagrama'),
      text: l('Eksiltme, tepede birleşen iki ilmekle (ters V) çizilir.', 'A decrease is drawn as two stitches meeting at the top (an upside-down V).', 'La disminución son dos puntos que se unen arriba (V invertida).', 'A diminuição são dois pontos que se juntam em cima (V invertido).'),
      scene: () => <Diagram marks={decRow()} />,
      viewBox: fitView(decRow()),
    },
  ],
  quiz: [
    {
      q: l('Klasik {sc} eksiltmede bitirmeden önce tığda kaç ilmek olur?', 'In a classic {sc} decrease, how many loops are on the hook before finishing?', 'En la disminución clásica de {sc}, ¿cuántos lazos hay antes de cerrar?', 'Na diminuição clássica de {sc}, quantas alças há antes de fechar?'),
      options: [l('3', '3', '3', '3'), l('2', '2', '2', '2'), l('4', '4', '4', '4')],
      answer: 0,
    },
  ],
  summary: [
    l('Klasik: iki ilmekten çek, üçünden geçir.', 'Classic: pull up in two, through all three.', 'Clásica: saca de dos, cierra tres.', 'Clássica: puxe de dois, feche três.'),
    l('Görünmez: iki ön halka, çek, ikisinden geçir.', 'Invisible: two front loops, pull through, finish.', 'Invisible: dos hebras delanteras, saca, cierra.', 'Invisível: duas alças da frente, puxe, feche.'),
  ],
};

export default lesson;
