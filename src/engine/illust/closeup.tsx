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

export function LoopsCloseUpScene({ part, n = 1, color = YARN.main }: { part: LoopPart; n?: number; color?: string }) {
  const tx = XS[TARGET];
  // tığın ucu: iki halka için arka halkanın ötesinde; yalnız ön halka için iki halkanın arasında
  const tip: P = part === 'front' ? [tx - 4, Y + 4] : [tx - 4, Y - 40];
  const angle = 66;
  const under = (k: 'back' | 'front') => part === 'both' || part === k;
  const hl = (d: string) => <path d={d} fill="none" stroke={C.highlight} strokeWidth={YW + 14} strokeLinecap="round" opacity={0.4} />;
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
      {under('back') && hl(backD(tx))}
      {under('front') && hl(frontD(tx))}
      {/* tepeler: tığın üstünde kalacak iplikler sonra çizilir */}
      {XS.map((x, i) => (
        <g key={`t${x}`}>
          {!(i === TARGET && under('back')) && <Yarn d={backD(x)} color={color} w={YW} />}
          {!(i === TARGET && under('front')) && <Yarn d={frontD(x)} color={color} w={YW} />}
        </g>
      ))}
      <Move from={[60, 120]} at={[0.1, 0.55]}>
        <Hook tip={tip} angle={angle} length={300} w={16} />
      </Move>
      {under('back') && <Yarn d={backD(tx)} color={color} w={YW} />}
      {under('front') && <Yarn d={frontD(tx)} color={color} w={YW} />}
      <Arrow d={`M${tx - 52} ${Y + 150} C${tx - 48} ${Y + 100} ${tip[0] - 30} ${tip[1] + 40} ${tip[0] - 14} ${tip[1] + 4}`} n={n} start={[tx - 52, Y + 150]} show={[0.55, 0.62]} />
    </g>
  );
}
