/** Atkı püskülü: adımlar ve ip payı */
import type { Craft, Lang, Units } from '@/types';
import type { PatternBuilder } from './builder';
import { len } from './fmt';

const STRANDS = 3;
const STRAND_CM = 30;

export const fringeGroups = (widthCm: number) => Math.max(4, Math.round(widthCm / 2.5));

/** iki kısa kenar için püskül ipi (m) */
export const fringeMeters = (widthCm: number) => (2 * fringeGroups(widthCm) * STRANDS * STRAND_CM) / 100;

export function fringeSteps(b: PatternBuilder, lang: Lang, widthCm: number, units: Units, _craft: Craft): void {
  const n = fringeGroups(widthCm);
  const tot = n * STRANDS * 2;
  const card = len(15, units, lang);
  const strand = len(STRAND_CM, units, lang);
  const gap = len(2.5, units, lang);
  const T: Record<Lang, [string, string]> = {
    tr: ['Püskül', `${card} genişliğinde bir kartona ipi sar, bir kenarından kes: ${tot} parça ${strand} ip elde edersin. Her kısa kenara yaklaşık ${gap} arayla ${n} püskül tak: ${STRANDS} parçayı ikiye katla, katlanan yeri tığla kenardan geçir, uçları bu halkanın içinden çekip sık. Püsküllerin ucunu eşit kes.`],
    en: ['Fringe', `Wrap yarn around a ${card} piece of card and cut along one edge to get ${tot} strands of ${strand}. Attach ${n} tassels about ${gap} apart along each short end: fold ${STRANDS} strands in half, pull the fold through the edge with a crochet hook, pull the ends through the loop and tighten. Trim the fringe evenly.`],
    es: ['Flecos', `Enrolla hilo en un cartón de ${card} y córtalo por un lado: tendrás ${tot} hebras de ${strand}. Coloca ${n} flecos a unos ${gap} de distancia en cada extremo corto: dobla ${STRANDS} hebras por la mitad, pasa el doblez por el borde con un ganchillo, saca las puntas por el lazo y aprieta. Iguala los flecos con la tijera.`],
    pt: ['Franjas', `Enrole o fio num papelão de ${card} e corte de um lado: você terá ${tot} fios de ${strand}. Prenda ${n} franjas a cerca de ${gap} de distância em cada ponta curta: dobre ${STRANDS} fios ao meio, passe a dobra pela borda com uma agulha de crochê, puxe as pontas pela laçada e aperte. Apare as franjas por igual.`],
  };
  b.step(T[lang][0], T[lang][1], { repeat: 2 * n });
}
