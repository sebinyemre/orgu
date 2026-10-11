import { KnitScene, knitArrows } from '@/engine/illust/knit';
import { SwatchScene, type Cell } from '@/engine/illust/swatch';
import { YARN } from '@/engine/illust/theme';
import { l, type Lesson } from '../types';

/** hasır örgü görünümü: kaydırılan ilmekler iki sıra boyu, önlerinde yatay ip (üstten alta) */
const linen: Cell[][] = Array.from({ length: 8 }, (_, r) =>
  Array.from({ length: 12 }, (_, c) => {
    const slip = (c + (r % 4 < 2 ? 0 : 1)) % 2 === 0;
    if (r % 2 === 0) return slip ? 'sl' : 'k';
    return slip ? 'none' : 'p';
  }),
);

/** zincir kenar: her sıranın ilk ilmeği kaydırılmış (üstten alta) */
const chainEdge: Cell[][] = Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => (c === 0 || c === 9 ? (r % 2 === 0 ? 'sl' : 'none') : 'k')));

const lesson: Lesson = {
  id: 'sis-kaydirma',
  intro: l(
    'Kaydırmak, bir ilmeği örmeden sol şişten sağ şişe almaktır. Basit ama çok işe yarar: düzgün zincir kenarlar, hasır örgü, renkli kaydırma desenleri ve bazı eksiltmeler bununla yapılır. Önemli olan iki şey var: ters mi düz mü kaydırdığın ve ipin önde mi arkada mı durduğu.',
    'To slip a stitch is to move it from the left needle to the right without knitting it. Simple, and very useful: tidy chain edges, linen stitch, slipped colorwork and some decreases all rely on it. Two things matter: whether you slip purlwise or knitwise, and whether the yarn is in front or behind.',
    'Deslizar es pasar un punto de la aguja izquierda a la derecha sin tejerlo. Sencillo y muy útil: orillos de cadeneta, punto tela, mosaicos y algunas disminuciones dependen de ello. Importan dos cosas: si deslizas del revés o del derecho, y si la hebra queda delante o detrás.',
    'Deslizar é passar um ponto da agulha esquerda para a direita sem tricotar. Simples e muito útil: ourelas em correntinha, ponto linho, mosaicos e algumas diminuições dependem disso. Duas coisas importam: deslizar como tricô ou como meia, e o fio na frente ou atrás.',
  ),
  steps: [
    {
      title: l('Ters kaydır', 'Slip purlwise', 'Desliza del revés', 'Deslize como tricô'),
      text: l(
        'Sağ şişi ilmeğe ters örer gibi, sağdan sola sok ve ilmeği örmeden sağ şişe al. İlmek burulmaz. Tarif bir şey demiyorsa hep böyle kaydır.',
        'Insert the right needle as if to purl, right to left, and move the stitch over without working it. The stitch stays untwisted. Unless the pattern says otherwise, always slip this way.',
        'Mete la aguja derecha como para tejer del revés, de derecha a izquierda, y pasa el punto sin tejerlo. No se tuerce. Si el patrón no dice otra cosa, desliza siempre así.',
        'Insira a agulha direita como para tricô, da direita para a esquerda, e passe o ponto sem trabalhar. Ele não torce. Se a receita não disser nada, deslize sempre assim.',
      ),
      scene: () => <KnitScene left={4} right={2} rn="insertP" rnFrom="rest" target arrows={knitArrows.insertP(1)} />,
    },
    {
      title: l('İlmek sağ şişte', 'Now on the right needle', 'Ya en la aguja derecha', 'Já na agulha direita'),
      text: l(
        'Kaydırılan ilmek aynı renk ve aynı yönde sağ şişte durur; altında yeni ilmek yoktur, bu yüzden iki sıra boyunca uzar.',
        'The slipped stitch sits on the right needle in the same color and orientation; no new loop is made, so it stretches over two rows.',
        'El punto deslizado queda en la aguja derecha igual que estaba; no hay lazo nuevo, por eso se alarga dos vueltas.',
        'O ponto deslizado fica na agulha direita como estava; não há alça nova, por isso ele se estica por duas carreiras.',
      ),
      scene: () => <KnitScene left={3} right={2} rn="rest" newLoop="k" newLoopColor={YARN.main} />,
    },
    {
      title: l('İp önde ya da arkada', 'Yarn in front or behind', 'Hebra delante o detrás', 'Fio na frente ou atrás'),
      text: l(
        'Tarif "ip önde kaydır" diyorsa ip ilmeğin önünden yatay geçer ve kumaşta görünür. "İp arkada" diyorsa ip arkada kalır, ön yüzde görünmez.',
        '"Slip with yarn in front" leaves a horizontal strand across the front of the slipped stitch. "With yarn in back" keeps the strand behind, hidden from the right side.',
        '"Desliza con hebra delante" deja una hebra horizontal visible. "Con hebra detrás" la deja oculta por detrás.',
        '"Deslize com fio na frente" deixa um fio horizontal à mostra. "Com fio atrás" deixa o fio escondido atrás.',
      ),
      scene: () => <KnitScene left={3} right={2} rn="rest" yarn="front" newLoop="k" newLoopColor={YARN.main} />,
    },
    {
      title: l('Zincir kenar', 'Chain selvedge', 'Orillo de cadeneta', 'Ourela em correntinha'),
      text: l(
        'Her sıranın ilk ilmeğini ip önde ters kaydır, sonuncusunu düz ör. Kenarlarda her iki sırada bir büyük ilmek olur: dikiş ve ilmek toplamak çok kolaylaşır.',
        'Slip the first stitch of every row purlwise with yarn in front and knit the last one. The edges show one large stitch every two rows, perfect for seaming and picking up.',
        'Desliza el primer punto de cada vuelta del revés con la hebra delante y teje el último. El borde muestra un punto grande cada dos vueltas, ideal para coser y recoger.',
        'Deslize o primeiro ponto de cada carreira como tricô com fio na frente e tricote o último. A borda mostra um ponto grande a cada duas carreiras, ótimo para costurar e levantar pontos.',
      ),
      scene: () => <SwatchScene rows={chainEdge} cell={24} rowH={18} highlightCol={0} />,
    },
    {
      title: l('Hasır örgü', 'Linen stitch', 'Punto tela', 'Ponto linho'),
      text: l(
        'Ön yüz: *1 düz, 1 ip önde kaydır*. Arka yüz: *1 ters, 1 ip arkada kaydır*. Her sırada kaydırılan ilmek bir kayar ve dokuma gibi sık, esnemeyen bir kumaş çıkar.',
        'Right side: *k1, slip 1 with yarn in front*. Wrong side: *p1, slip 1 with yarn in back*. The slipped stitch shifts each row, giving a dense, woven-looking fabric that barely stretches.',
        'Derecho: *1 d, desliza 1 con hebra delante*. Revés: *1 r, desliza 1 con hebra detrás*. El punto deslizado se alterna y sale un tejido denso, como tela.',
        'Direito: *1 m, deslize 1 com fio na frente*. Avesso: *1 t, deslize 1 com fio atrás*. O ponto deslizado alterna e sai um tecido denso, como pano.',
      ),
      scene: () => <SwatchScene rows={linen} cell={26} rowH={22} />,
      tip: l('Hasır örgü sıkı durur; bir iki numara kalın şiş kullan.', 'Linen stitch is dense; go up a needle size or two.', 'El punto tela es denso: usa una o dos agujas más gruesas.', 'O ponto linho é denso: use agulha um ou dois números maior.'),
    },
  ],
  quiz: [
    {
      q: l('Tarif belirtmiyorsa ilmek nasıl kaydırılır?', 'If the pattern doesn’t say, how do you slip?', 'Si el patrón no lo dice, ¿cómo deslizas?', 'Se a receita não diz, como deslizar?'),
      options: [l('Ters örer gibi', 'Purlwise', 'Del revés', 'Como tricô'), l('Düz örer gibi', 'Knitwise', 'Del derecho', 'Como meia'), l('Fark etmez', 'It doesn’t matter', 'Da igual', 'Tanto faz')],
      answer: 0,
      explain: l('Ters kaydırmak ilmeği burmaz. Düz kaydırma genelde eksiltmelerde kullanılır.', 'Slipping purlwise doesn’t twist the stitch. Knitwise slips are mostly for decreases.', 'Deslizar del revés no tuerce el punto. Del derecho se usa en disminuciones.', 'Deslizar como tricô não torce. Como meia é para diminuições.'),
    },
  ],
  summary: [
    l('Kaydırmak = örmeden diğer şişe almak.', 'Slip = move without working.', 'Deslizar = pasar sin tejer.', 'Deslizar = passar sem trabalhar.'),
    l('Varsayılan ters kaydırmaktır; ipin yerini tarif söyler.', 'Purlwise by default; the pattern tells you where the yarn goes.', 'Por defecto del revés; el patrón dice dónde va la hebra.', 'Por padrão como tricô; a receita diz onde fica o fio.'),
  ],
};

export default lesson;
