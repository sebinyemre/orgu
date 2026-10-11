/**
 * Yakın plan: sıranın tepesine yukarıdan bakış. Her ilmeğin tepesi yatık bir V gibi iki iplikten oluşur:
 * sana yakın ön halka (alttaki kavis) ve arka halka (üstteki kavis). Tığın altından geçtiği iplikler
 * tığdan sonra çizilir; böylece "nereden geçiyor" açıkça görünür.
 */
import { Arrow, Hook, Move, Yarn } from './parts';
import { C, YARN } from './theme';
import type { P } from './geom';

/** derslerde kullanılacak yakınlaştırılmış görünüm */
export const CLOSEUP_VIEW = '30 28 340 255';

export type LoopPart = 'both' | 'back' | 'front';

const W = 100;
const Y = 122;
const XS = [60, 160, 260, 360];
const TARGET = 1;
const YW = 13;

const backD = (x: number) => `M${x - W / 2 + 2} ${Y} C${x - 30} ${Y - 36} ${x + 30} ${Y - 36} ${x + W / 2 - 2} ${Y}`;
const frontD = (x: number) => `M${x - W / 2 + 2} ${Y} C${x - 30} ${Y + 42} ${x + 30} ${Y + 42} ${x + W / 2 - 2} ${Y}`;
/** ilmeğin gövdesi: tepeden aşağı inen iki bacak */
const legD = (x: number, side: -1 | 1) => `M${x + side * 10} ${Y + 30} C${x + side * 16} ${Y + 80} ${x + side * 8} ${Y + 120} ${x + side * 14} ${Y + 175}`;

/**
 * `count` 2 ise tığ yan yana iki ilmeğin ön halkalarının altından birden geçer (görünmez eksiltme).
 */
export function LoopsCloseUpScene({ part, n = 1, count = 1, color = YARN.main }: { part: LoopPart; n?: number; count?: 1 | 2; color?: string }) {
  const targets = count === 2 ? [TARGET, TARGET + 1] : [TARGET];
  const tx = XS[TARGET];
  // tığın ucu: iki halka için arka halkanın ötesinde; yalnız ön halka için iki halkanın arasında
  const two = count === 2;
  const tip: P = two ? [tx - 30, Y + 22] : part === 'front' ? [tx - 4, Y + 4] : [tx - 4, Y - 40];
  const angle = two ? -6 : 66;
  const under = (k: 'back' | 'front') => (two ? k === 'front' : part === 'both' || part === k);
  const isT = (i: number) => targets.includes(i);
  const hl = (d: string, k: string) => <path key={k} d={d} fill="none" stroke={C.highlight} strokeWidth={YW + 14} strokeLinecap="round" opacity={0.4} />;
  return (
    <g>
      {/* ilmek gövdeleri */}
      {XS.map((x) => (
        <g key={`l${x}`}>
          <Yarn d={legD(x, -1)} color={color} w={YW} faded />
          <Yarn d={legD(x, 1)} color={color} w={YW} faded />
        </g>
      ))}
      {/* vurgular */}
      {targets.map((i) => under('back') && hl(backD(XS[i]), `hb${i}`))}
      {targets.map((i) => under('front') && hl(frontD(XS[i]), `hf${i}`))}
      {/* tepeler: tığın üstünde kalacak iplikler sonra çizilir */}
      {XS.map((x, i) => (
        <g key={`t${x}`}>
          {!(isT(i) && under('back')) && <Yarn d={backD(x)} color={color} w={YW} />}
          {!(isT(i) && under('front')) && <Yarn d={frontD(x)} color={color} w={YW} />}
        </g>
      ))}
      <Move from={two ? [120, -10] : [60, 120]} at={[0.1, 0.55]}>
        <Hook tip={tip} angle={angle} length={300} w={16} />
      </Move>
      {targets.map((i) => under('back') && <Yarn key={`ob${i}`} d={backD(XS[i])} color={color} w={YW} />)}
      {targets.map((i) => under('front') && <Yarn key={`of${i}`} d={frontD(XS[i])} color={color} w={YW} />)}
      {two ? (
        <Arrow d={`M${XS[TARGET + 1] + 60} ${Y + 76} C${XS[TARGET + 1]} ${Y + 80} ${tx} ${Y + 66} ${tip[0] + 4} ${tip[1] + 16}`} n={n} start={[XS[TARGET + 1] + 72, Y + 76]} show={[0.55, 0.62]} />
      ) : (
        <Arrow d={`M${tx - 52} ${Y + 150} C${tx - 48} ${Y + 100} ${tip[0] - 30} ${tip[1] + 40} ${tip[0] - 14} ${tip[1] + 4}`} n={n} start={[tx - 52, Y + 150]} show={[0.55, 0.62]} />
      )}
    </g>
  );
}
