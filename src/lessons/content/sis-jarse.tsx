import { SwatchScene, swatchRows } from '@/engine/illust/swatch';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'sis-jarse',
  intro: l(
    'Jarse, bir sıra düz bir sıra ters örülen klasik süveter kumaşıdır. Bu derste ilmekleri okumayı da öğreneceksin: V düzdür, boncuk terstir.',
    'Stockinette is the classic sweater fabric: one row knit, one row purl. You will also learn to read your stitches: a V is a knit, a bump is a purl.',
    'El punto jersey es el clásico de los jerséis: una vuelta derecho, otra revés. También aprenderás a leer los puntos: la V es derecho, el grano es revés.',
    'O jersey é o tecido clássico de suéter: uma carreira meia, outra tricô. Você também vai aprender a ler os pontos: V é meia, bolinha é tricô.',
  ),
  steps: [
    {
      title: l('Ön yüz: V’ler', 'Right side: Vs', 'Derecho: las V', 'Lado direito: os V'),
      text: l('Ön yüzde ilmekler üst üste dizilmiş V’ler gibi görünür. Bu yüzü düz örersin.', 'On the right side the stitches look like stacked Vs. You knit this side.', 'En el derecho los puntos parecen V apiladas. Este lado se teje al derecho.', 'No lado direito os pontos parecem V empilhados. Este lado se tricota em meia.'),
      scene: () => <SwatchScene rows={swatchRows('jarse', 11, 8)} />,
      dur: 3,
    },
    {
      title: l('Arka yüz: boncuklar', 'Wrong side: bumps', 'Revés: los granos', 'Avesso: as bolinhas'),
      text: l('Arkada ilmekler küçük yatay boncuklar gibidir. Bu yüzü ters örersin.', 'On the back the stitches look like little horizontal bumps. You purl this side.', 'Detrás los puntos parecen granitos horizontales. Este lado se teje al revés.', 'Atrás os pontos parecem bolinhas horizontais. Este lado se tricota em tricô.'),
      scene: () => <SwatchScene rows={swatchRows('jarse-back', 11, 8)} />,
      dur: 3,
    },
    {
      title: l('Kural', 'The rule', 'La regla', 'A regra'),
      text: l('1. sıra (ön yüz): hepsini düz ör. 2. sıra (arka yüz): hepsini ters ör. Tekrarla.', 'Row 1 (right side): knit all. Row 2 (wrong side): purl all. Repeat.', 'Vuelta 1 (derecho): todo al derecho. Vuelta 2 (revés): todo al revés. Repite.', 'Carreira 1 (direito): tudo em meia. Carreira 2 (avesso): tudo em tricô. Repita.'),
      scene: () => <SwatchScene rows={swatchRows('jarse', 11, 8)} highlightRow={7} />,
      dur: 3,
    },
    {
      title: l('Hangi sıradayım?', 'Which row am I on?', '¿En qué vuelta estoy?', 'Em que carreira estou?'),
      text: l('Şişi tutarken karşında V’ler varsa düz örersin, boncuklar varsa ters. Ezberlemene gerek yok; ilmeklere bak.', 'Holding the needle, if you see Vs facing you, knit; if you see bumps, purl. No need to memorize: read the stitches.', 'Si ves V frente a ti, teje al derecho; si ves granos, al revés. No memorices: lee los puntos.', 'Se você vê V, faça meia; se vê bolinhas, tricô. Não precisa decorar: leia os pontos.'),
      scene: () => <SwatchScene rows={swatchRows('jarse', 11, 8)} highlightCol={5} />,
      dur: 3,
      tip: l('Jarsenin kenarları kendiliğinden kıvrılır. Atkı örerken kenarlara birkaç haraşo ilmeği ekle.', 'Stockinette edges curl. For a scarf, add a few garter stitches at each edge.', 'Los bordes del jersey se enrollan. En una bufanda añade unos puntos de bobo en los bordes.', 'As bordas do jersey enrolam. Num cachecol, acrescente alguns pontos de liga nas bordas.'),
    },
  ],
  quiz: [
    {
      q: l('Karşında boncuklar var. Ne örersin?', 'You see bumps facing you. What do you work?', 'Ves granos frente a ti. ¿Qué tejes?', 'Você vê bolinhas. O que faz?'),
      options: [l('Ters', 'Purl', 'Revés', 'Tricô'), l('Düz', 'Knit', 'Derecho', 'Meia')],
      answer: 0,
      explain: l('Jarsede ilmeği gördüğün gibi örersin.', 'In stockinette you work stitches as they appear.', 'En jersey tejes los puntos como se presentan.', 'No jersey você faz os pontos como eles aparecem.'),
    },
  ],
  summary: [
    l('Ön yüz düz, arka yüz ters.', 'Knit the right side, purl the wrong side.', 'Derecho por delante, revés por detrás.', 'Meia no direito, tricô no avesso.'),
    l('V = düz, boncuk = ters.', 'V = knit, bump = purl.', 'V = derecho, grano = revés.', 'V = meia, bolinha = tricô.'),
  ],
};

export default lesson;
