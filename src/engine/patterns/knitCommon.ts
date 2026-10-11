/** Şiş üreticilerinin ortak metinleri ve desen yardımcıları */
import type { Gauge, Lang } from '@/types';
import { multipleText, type StitchPattern } from '@/knowledge/stitchPatterns';
import { PatternBuilder, lk } from './builder';
import { L } from './common';

/** Bir desen tekrarının kaç sıra/tur sürdüğü */
export const ROW_REPEAT: Record<string, number> = {
  haraso: 2,
  jarse: 2,
  'ters-jarse': 2,
  'lastik-1x1': 2,
  'lastik-2x2': 2,
  'burgulu-lastik': 2,
  pirinc: 2,
  'cift-pirinc': 4,
  sepet: 8,
  hasir: 2,
  'yalanci-selanik': 2,
  selanik: 2,
  'goz-ajur': 4,
  'dalga-ajur': 4,
  'burgu-6': 8,
  'burgu-4': 4,
};

/** Desene göre etkin ölçü (jarse ölçüsünden): lastik büzer, haraşo sıkışır */
export function effGauge(g: Gauge, sp: StitchPattern): Gauge {
  return { stitches: g.stitches / sp.widthFactor, rows: g.rows * sp.rowFactor };
}

/** Sayıyı desen tekrarına yuvarla (en az 1 tekrar) */
export const toRepeat = (rows: number, rep: number) => Math.max(rep, Math.round(rows / rep) * rep);

/**
 * Desen bölümü: kütüphanedeki sıra/tur talimatlarını tarife koyar.
 * `over` verilirse "bu talimatlar ortadaki X ilmeğe uygulanır" notu eklenir.
 */
export function addPatternSection(b: PatternBuilder, sp: StitchPattern, mode: 'flat' | 'round', lang: Lang, id: string, over?: number): void {
  const w = mode === 'round' && sp.round ? sp.round : sp.flat;
  const T = PS[lang];
  const intro = [T.rule(multipleText(w, lang)), over ? T.over(over) : '', w.note?.[lang] ?? ''].filter(Boolean).join(' ');
  b.section(id, `${T.title}: ${sp.name[lang]}`, intro);
  for (const r of w.rows) b.step(r.label[lang], r.text[lang], { lessonIds: sp.lessonIds });
  if (w.repeat) b.step(T.rep, w.repeat[lang]);
}

const PS = L(
  {
    title: 'Desen',
    rule: (m: string) => `İlmek kuralı: ${m}.`,
    over: (n: number) => `Bu talimatlar kenar ilmekleri arasındaki ${n} ilmeğe uygulanır.`,
    rep: 'Tekrar',
  },
  {
    title: 'Stitch pattern',
    rule: (m: string) => `Stitch count: ${m}.`,
    over: (n: number) => `These instructions are worked over the ${n} stitches between the edge stitches.`,
    rep: 'Repeat',
  },
  {
    title: 'Punto',
    rule: (m: string) => `Número de puntos: ${m}.`,
    over: (n: number) => `Estas instrucciones se trabajan sobre los ${n} puntos entre los puntos de orillo.`,
    rep: 'Repetición',
  },
  {
    title: 'Ponto',
    rule: (m: string) => `Número de pontos: ${m}.`,
    over: (n: number) => `Estas instruções valem para os ${n} pontos entre as ourelas.`,
    rep: 'Repetição',
  },
);

export const KT = L(
  {
    castOnLabel: 'İlmek atma',
    castOn: (n: number) => `${lk('sis-ilmek-atma-basparmak', 'Başparmakla ilmek atma')} yöntemiyle ${n} ilmek at. (Yeni başlıyorsan ${lk('sis-ilmek-atma-sisle', 'şişle ilmek atma')} da olur.)`,
    castOnCirc: (n: number) => `Misinalı şişe ${lk('sis-ilmek-atma-basparmak', 'başparmakla')} ${n} ilmek at.`,
    joinLabel: 'Birleştirme',
    join: `İlmeklerin burulmadığından emin ol: hepsinin alt kenarı misinanın iç tarafına baksın. Tur başına farklı renkte bir işaretleyici tak ve ilk ilmeği örerek ${lk('sis-misinali', 'halkayı birleştir')}.`,
    bindOffLabel: 'Kapatma',
    bindOff: `İlmekleri desene uygun olarak (düzleri düz, tersleri ters örerek) gevşekçe ${lk('sis-ilmek-kapatma', 'kapat')}. Kenar sıkı kalıyorsa bir numara kalın şişle kapat.`,
    bindOffKnit: `Tüm ilmekleri gevşekçe ${lk('sis-ilmek-kapatma', 'kapat')}.`,
    selStart: `ilk ilmeği ip önde ters örer gibi ${lk('sis-kaydirma', 'kaydır')} ve ipi şişlerin arasından arkaya al`,
    selEnd: 'son ilmeği düz ör',
    workOver: (n: number) => `sonraki ${n} ilmekte desenin sıradaki sırasını ör`,
    selNote: 'Kaydırılan kenar ilmekleri düzgün bir zincir kenar oluşturur. Desen ters ilmekle başlıyorsa kaydırdıktan sonra ipi yeniden öne al.',
    allK: 'Tüm ilmekleri düz ör.',
    allP: 'Tüm ilmekleri ters ör.',
    stripeLabel: 'Şeritler',
    stripes: (seq: string, carry: boolean) => `Renk düzeni: ${seq}; düzeni sona kadar tekrarla. Rengi her zaman aynı kenarda, sıra başında değiştir.${carry ? ' Kullanmadığın iplikleri kesme; kenardan yukarı taşı.' : ' Her değişimde eski ipi 10 cm uç bırakarak kes.'}`,
    seqItem: (n: number, c: string) => `${n} sıra ${c}`,
    measureFrom: (x: string) => `İş, ilmek atılan kenardan ${x} olana kadar`,
  },
  {
    castOnLabel: 'Cast on',
    castOn: (n: number) => `Using the ${lk('sis-ilmek-atma-basparmak', 'long-tail cast-on')}, cast on ${n} sts. (If you are just starting, the ${lk('sis-ilmek-atma-sisle', 'knitted cast-on')} works too.)`,
    castOnCirc: (n: number) => `Using the ${lk('sis-ilmek-atma-basparmak', 'long-tail cast-on')}, cast on ${n} sts onto the circular needle.`,
    joinLabel: 'Join',
    join: `Make sure the stitches are not twisted: the cast-on edge should face the inside of the circle all the way around. Place a marker in a different color for the beginning of the round (BOR) and ${lk('sis-misinali', 'join in the round')} by knitting the first stitch.`,
    bindOffLabel: 'Bind off',
    bindOff: `${lk('sis-ilmek-kapatma', 'Bind off')} loosely in pattern (knit the knits, purl the purls). If the edge is tight, bind off with a needle one size larger.`,
    bindOffKnit: `${lk('sis-ilmek-kapatma', 'Bind off')} all sts loosely.`,
    selStart: `sl 1 purlwise with yarn in front (${lk('sis-kaydirma', 'slipped selvedge')}), take the yarn to the back between the needles`,
    selEnd: 'k1',
    workOver: (n: number) => `work the next row of the stitch pattern over the next ${n} sts`,
    selNote: 'The slipped edge stitches make a neat chain edge. If the pattern begins with a purl, bring the yarn back to the front after slipping.',
    allK: 'Knit all sts.',
    allP: 'Purl all sts.',
    stripeLabel: 'Stripes',
    stripes: (seq: string, carry: boolean) => `Stripe sequence: ${seq}; repeat to the end. Always change color at the beginning of a row on the same edge.${carry ? ' Do not cut the yarns you are not using; carry them loosely up the side.' : ' Cut the old yarn at each change, leaving a 10 cm (4") tail.'}`,
    seqItem: (n: number, c: string) => `${n} rows ${c}`,
    measureFrom: (x: string) => `Work until the piece measures ${x} from the cast-on edge`,
  },
  {
    castOnLabel: 'Montaje',
    castOn: (n: number) => `Montar ${n} puntos con el ${lk('sis-ilmek-atma-basparmak', 'montaje de cola larga')}. (Si estás empezando, también sirve el ${lk('sis-ilmek-atma-sisle', 'montaje tejido')}.)`,
    castOnCirc: (n: number) => `Montar ${n} puntos en la aguja circular con el ${lk('sis-ilmek-atma-basparmak', 'montaje de cola larga')}.`,
    joinLabel: 'Unión',
    join: `Comprueba que los puntos no estén torcidos: el borde de montaje debe mirar hacia el interior del círculo en toda la vuelta. Coloca un marcador de otro color para el inicio de vuelta y ${lk('sis-misinali', 'une en redondo')} tejiendo el primer punto.`,
    bindOffLabel: 'Cierre',
    bindOff: `${lk('sis-ilmek-kapatma', 'Cerrar')} sin apretar siguiendo el punto (derechos al derecho, reveses al revés). Si el borde queda tirante, cierra con una aguja un número más gruesa.`,
    bindOffKnit: `${lk('sis-ilmek-kapatma', 'Cerrar')} todos los puntos sin apretar.`,
    selStart: `deslizar el primer punto como al revés con la hebra delante (${lk('sis-kaydirma', 'orillo')}) y pasar la hebra atrás entre las agujas`,
    selEnd: 'tejer el último punto al derecho',
    workOver: (n: number) => `tejer la vuelta que toca del punto sobre los ${n} puntos siguientes`,
    selNote: 'Los puntos de orillo deslizados forman una cadenita limpia. Si el punto empieza con revés, vuelve a pasar la hebra delante tras deslizar.',
    allK: 'Tejer todos los puntos al derecho.',
    allP: 'Tejer todos los puntos al revés.',
    stripeLabel: 'Rayas',
    stripes: (seq: string, carry: boolean) => `Orden de colores: ${seq}; repetir hasta el final. Cambia siempre de color al principio de la vuelta, en el mismo borde.${carry ? ' No cortes los hilos que no usas: súbelos sin tirar por el lateral.' : ' Corta el hilo anterior en cada cambio, dejando 10 cm.'}`,
    seqItem: (n: number, c: string) => `${n} vueltas ${c}`,
    measureFrom: (x: string) => `Tejer hasta que la labor mida ${x} desde el montaje`,
  },
  {
    castOnLabel: 'Montagem',
    castOn: (n: number) => `Montar ${n} pontos com a ${lk('sis-ilmek-atma-basparmak', 'montagem com fio longo')}. (Se você está começando, a ${lk('sis-ilmek-atma-sisle', 'montagem tricotada')} também serve.)`,
    castOnCirc: (n: number) => `Montar ${n} pontos na agulha circular com a ${lk('sis-ilmek-atma-basparmak', 'montagem com fio longo')}.`,
    joinLabel: 'União',
    join: `Confira se os pontos não estão torcidos: a borda da montagem deve ficar voltada para dentro do círculo em toda a volta. Coloque um marcador de outra cor no início da volta e ${lk('sis-misinali', 'una em circular')} tricotando o primeiro ponto.`,
    bindOffLabel: 'Arremate',
    bindOff: `${lk('sis-ilmek-kapatma', 'Arrematar')} sem apertar seguindo o ponto (meia sobre meia, tricô sobre tricô). Se a borda ficar justa, arremate com uma agulha um número maior.`,
    bindOffKnit: `${lk('sis-ilmek-kapatma', 'Arrematar')} todos os pontos sem apertar.`,
    selStart: `deslizar o primeiro ponto como tricô com o fio na frente (${lk('sis-kaydirma', 'ourela')}) e passar o fio para trás entre as agulhas`,
    selEnd: 'tricotar o último ponto em meia',
    workOver: (n: number) => `fazer a carreira seguinte do ponto nos ${n} pontos seguintes`,
    selNote: 'As ourelas deslizadas formam uma correntinha bonita na borda. Se o ponto começa com tricô, traga o fio de novo para a frente depois de deslizar.',
    allK: 'Tricotar todos os pontos em meia.',
    allP: 'Tricotar todos os pontos em tricô.',
    stripeLabel: 'Listras',
    stripes: (seq: string, carry: boolean) => `Sequência de cores: ${seq}; repetir até o final. Troque sempre de cor no começo da carreira, na mesma borda.${carry ? ' Não corte os fios que não está usando: leve-os sem puxar pela lateral.' : ' Corte o fio anterior a cada troca, deixando 10 cm.'}`,
    seqItem: (n: number, c: string) => `${n} carreiras ${c}`,
    measureFrom: (x: string) => `Tricotar até a peça medir ${x} desde a montagem`,
  },
);

/** "Sl 1…, sonraki 40 ilmekte desen, son ilmeği düz ör." */
export function selvedgeRow(lang: Lang, over: number, selvedge: boolean, border?: { left: string; right: string }): string {
  const T = KT[lang];
  const parts: string[] = [];
  if (selvedge) parts.push(T.selStart);
  if (border) parts.push(border.left);
  parts.push(T.workOver(over));
  if (border) parts.push(border.right);
  if (selvedge) parts.push(T.selEnd);
  const s = parts.join(', ');
  return s.charAt(0).toLocaleUpperCase(lang === 'tr' ? 'tr-TR' : 'en-US') + s.slice(1) + '.';
}

/** Aynı alan için jarseye göre ip çarpanı (lastik ve burgu gibi büzen desenler daha çok ip yer) */
export const areaFactor = (sp: StitchPattern) => Math.max(sp.yarnFactor, sp.yarnFactor / sp.widthFactor);
