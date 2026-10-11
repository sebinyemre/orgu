import { SwatchScene, swatchRows } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-pirinc',
  intro: l(
    'Pirinç örgü de bir düz bir ters örülür ama lastiğin tersine, her sırada kayar: düzün üstüne ters gelir. Sonuç noktalı, kıvrılmayan, iki yüzü aynı bir kumaştır.',
    'Seed stitch is also knit one, purl one, but unlike ribbing it shifts every row: purls sit on top of knits. The result is a dotted, flat, reversible fabric.',
    'El punto arroz también alterna derecho y revés, pero se desplaza cada vuelta. Resultado: un tejido punteado, plano y reversible.',
    'O ponto arroz também alterna meia e tricô, mas muda a cada carreira. Resultado: um tecido pontilhado, plano e reversível.',
  ),
  steps: [
    {
      title: l('Pirinç taneleri', 'Little seeds', 'Granitos de arroz', 'Grãos de arroz'),
      text: l('Her V’nin üstünde ve yanında boncuk vardır; kumaş dama gibi noktalıdır.', 'Every V has bumps above and beside it, like a tiny checkerboard.', 'Cada V tiene granos encima y al lado, como un damero diminuto.', 'Cada V tem bolinhas em cima e ao lado, como um tabuleiro pequenino.'),
      scene: () => <SwatchScene rows={swatchRows('pirinc', 12, 8)} />,
      dur: 3,
    },
    {
      title: l('Gördüğünün tersini ör', 'Work the opposite', 'Teje lo contrario', 'Faça o contrário'),
      text: l('V görünen ilmeği ters, boncuk görüneni düz ör. Lastikte yaptığının tam tersi.', 'Purl the Vs and knit the bumps: exactly the opposite of ribbing.', 'Las V al revés y los granos al derecho: justo lo contrario del elástico.', 'Os V em tricô e as bolinhas em meia: o contrário da ribana.'),
      scene: () => <SwatchScene rows={swatchRows('pirinc', 12, 8)} highlightRow={0} />,
      dur: 3,
    },
    {
      title: l('Tek sayının sırrı', 'The odd-number trick', 'El truco del impar', 'O truque do ímpar'),
      text: l('Tek sayıda ilmek atarsan her sıra "1 düz, 1 ters" diye başlar ve biter; desen kendiliğinden kayar.', 'With an odd number of stitches every row is "k1, p1" from start to end and the pattern shifts by itself.', 'Con número impar, todas las vueltas son "1 d, 1 r" y el dibujo se desplaza solo.', 'Com número ímpar, todas as carreiras são "1 m, 1 t" e o desenho muda sozinho.'),
      scene: () => <SwatchScene rows={swatchRows('pirinc', 11, 8)} highlightCol={0} />,
      dur: 3,
      tip: l('Pirinç örgü bordür olarak harikadır: jarse işin kenarına 4 ilmek pirinç koy, kıvrılmaz.', 'Seed stitch makes a great border: 4 seed stitches at the edge of stockinette stop the curl.', 'El punto arroz es un gran borde: 4 puntos a cada lado evitan que el jersey se enrolle.', 'O ponto arroz é ótima borda: 4 pontos de cada lado evitam que o jersey enrole.'),
    },
  ],
  practice: { text: l('21 ilmekle 12 sıra pirinç ör.', 'Knit 12 rows of seed stitch on 21 stitches.', 'Teje 12 vueltas de punto arroz con 21 puntos.', 'Faça 12 carreiras de ponto arroz com 21 pontos.'), target: 12, unit: 'row' },
  quiz: [
    {
      q: l('Pirinç örgüde karşında V var. Ne örersin?', 'In seed stitch you see a V. What do you work?', 'En punto arroz ves una V. ¿Qué tejes?', 'No ponto arroz você vê um V. O que faz?'),
      options: [l('Ters', 'Purl', 'Revés', 'Tricô'), l('Düz', 'Knit', 'Derecho', 'Meia')],
      answer: 0,
    },
  ],
  summary: [l('Pirinç: gördüğünün tersini ör.', 'Seed: work the opposite of what you see.', 'Arroz: teje lo contrario de lo que ves.', 'Arroz: faça o contrário do que vê.')],
};

export default lesson;
