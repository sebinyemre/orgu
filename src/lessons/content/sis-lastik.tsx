import { KnitScene } from '@/engine/illust/knit';
import { Arrow } from '@/engine/illust/parts';
import { SwatchScene, swatchRows } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-lastik',
  intro: l(
    'Lastik örgü düz ve ters ilmeklerin aynı sırada yan yana örülmesidir. Püf noktası, her geçişte ipi şişlerin arasından öne ya da arkaya almaktır.',
    'Ribbing puts knits and purls side by side in the same row. The secret is moving the yarn between the needles each time you switch.',
    'El elástico combina derechos y reveses en la misma vuelta. El truco es pasar la hebra entre las agujas en cada cambio.',
    'A ribana junta meia e tricô na mesma carreira. O segredo é passar o fio entre as agulhas a cada troca.',
  ),
  steps: [
    {
      title: l('Lastik nasıl görünür', 'What ribbing looks like', 'Cómo se ve el elástico', 'Como fica a ribana'),
      text: l('Dikey V sütunları ile boncuk sütunları sırayla dizilir; kumaş akordeon gibi esner.', 'Columns of Vs alternate with columns of bumps, and the fabric stretches like an accordion.', 'Columnas de V alternan con columnas de granos; el tejido estira como un acordeón.', 'Colunas de V alternam com colunas de bolinhas; o tecido estica como sanfona.'),
      scene: () => <SwatchScene rows={swatchRows('lastik1', 12, 8)} />,
      dur: 3,
    },
    {
      title: l('Düzden sonra: ipi öne al', 'After a knit: yarn to the front', 'Tras un derecho: hebra delante', 'Depois de meia: fio para a frente'),
      text: l('Bir düz ördün, sırada ters var. İpi iki şişin ARASINDAN öne getir, sonra ters ör.', 'You knit one and a purl comes next. Bring the yarn forward BETWEEN the needles, then purl.', 'Tejiste un derecho y sigue un revés. Pasa la hebra hacia delante ENTRE las agujas y teje revés.', 'Você fez uma meia e vem um tricô. Passe o fio para a frente ENTRE as agulhas e faça tricô.'),
      scene: () => <KnitScene left={4} right={2} rn="rest" yarn="front" rightKinds={['k', 'p']} leftKinds={['k', 'p', 'k', 'p']} arrows={<Arrow d="M300 236 C292 200 280 170 264 150" n={1} start={[306, 250]} />} />,
    },
    {
      title: l('Tersten sonra: ipi arkaya al', 'After a purl: yarn to the back', 'Tras un revés: hebra detrás', 'Depois de tricô: fio para trás'),
      text: l('Bir ters ördün, sırada düz var. İpi yine şişlerin arasından arkaya götür, sonra düz ör.', 'After a purl, take the yarn back between the needles before you knit.', 'Tras el revés, lleva la hebra detrás entre las agujas antes del derecho.', 'Depois do tricô, leve o fio para trás entre as agulhas antes da meia.'),
      scene: () => <KnitScene left={4} right={2} rn="rest" yarn="back" rightKinds={['p', 'k']} leftKinds={['p', 'k', 'p', 'k']} arrows={<Arrow d="M262 146 C276 168 288 196 296 230" n={2} start={[252, 132]} />} />,
      warn: l('İpi şişin üstünden aşırırsan istemeden ip atmış olursun ve bir ilmek fazlalaşır.', 'Taking the yarn over the needle instead of between makes an accidental yarn over and an extra stitch.', 'Si pasas la hebra por encima de la aguja, haces una lazada sin querer y un punto de más.', 'Se passar o fio por cima da agulha, faz uma laçada sem querer e um ponto a mais.'),
    },
    {
      title: l('Gördüğünü ör', 'Work what you see', 'Teje lo que ves', 'Faça o que vê'),
      text: l('Sonraki sıralarda V görünen ilmeği düz, boncuk görüneni ters ör. Lastik böylece sütun sütun büyür.', 'On following rows, knit the Vs and purl the bumps. The ribs grow column by column.', 'En las siguientes vueltas, las V al derecho y los granos al revés. Así crecen las columnas.', 'Nas carreiras seguintes, faça meia nos V e tricô nas bolinhas. Assim as colunas crescem.'),
      scene: () => <SwatchScene rows={swatchRows('lastik1', 12, 8)} highlightCol={4} />,
      dur: 3,
    },
    {
      title: l('2×2 lastik', '2×2 rib', 'Elástico 2×2', 'Ribana 2×2'),
      text: l('İki düz, iki ters. Düz örgüde 4’ün katı + 2 ilmekle iki kenar da aynı biter.', 'Knit two, purl two. With a multiple of 4 + 2 stitches both edges match.', 'Dos derecho, dos revés. Con múltiplo de 4 + 2 los dos bordes coinciden.', 'Duas meia, duas tricô. Com múltiplo de 4 + 2 as duas bordas ficam iguais.'),
      scene: () => <SwatchScene rows={swatchRows('lastik2', 14, 8)} cell={26} />,
      dur: 3,
    },
  ],
  practice: { text: l('22 ilmekle 10 sıra 2×2 lastik ör.', 'Work 10 rows of 2×2 rib on 22 stitches.', 'Teje 10 vueltas de elástico 2×2 con 22 puntos.', 'Faça 10 carreiras de ribana 2×2 com 22 pontos.'), target: 10, unit: 'row' },
  summary: [
    l('Düzden terse: ip öne. Tersten düze: ip arkaya.', 'Knit to purl: yarn forward. Purl to knit: yarn back.', 'De derecho a revés: hebra delante. De revés a derecho: detrás.', 'De meia para tricô: fio para frente. De tricô para meia: para trás.'),
    l('İp hep şişlerin arasından geçer.', 'The yarn always passes between the needles.', 'La hebra siempre pasa entre las agujas.', 'O fio sempre passa entre as agulhas.'),
  ],
};

export default lesson;
