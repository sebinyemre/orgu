/**
 * Tığ yardımcı sahneleri: kabartma ilmek (gövde etrafından), Tunus işi, motif birleştirme, amigurumi top.
 */
import type { ReactNode } from 'react';
import { shade } from '@/lib/color';
import { type P } from './geom';
import { Arrow, Hook, HookLoopBack, HookLoopFront, Move, Needle, Target, Yarn } from './parts';
import { YARN } from './theme';

const YW = 9;

/** Trabzan gövdesi (önden): iki bacak ve ortada çapraz sarım */
function Post({ x, y0, y1, color, glow }: { x: number; y0: number; y1: number; color: string; glow?: boolean }) {
  const m = (y0 + y1) / 2;
  return (
    <g>
      {glow && <rect x={x - 18} y={y1 - 6} width={36} height={y0 - y1 + 12} rx={14} fill="var(--il-highlight)" opacity={0.25} />}
      <Yarn d={`M${x - 6} ${y0} L${x - 5} ${y1}`} color={shade(color, -0.1)} w={YW} />
      <Yarn d={`M${x + 6} ${y0} L${x + 5} ${y1}`} color={color} w={YW} />
      <Yarn d={`M${x - 12} ${m + 10} C${x - 4} ${m + 4} ${x + 4} ${m - 6} ${x + 12} ${m - 12}`} color={color} w={YW} />
    </g>
  );
}

function Top({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <Yarn d={`M${x - 20} ${y} C${x - 10} ${y - 10} ${x + 10} ${y - 10} ${x + 20} ${y}`} color={shade(color, -0.12)} w={YW * 0.9} />
      <Yarn d={`M${x - 20} ${y} C${x - 10} ${y + 10} ${x + 10} ${y + 10} ${x + 20} ${y}`} color={color} w={YW * 0.9} />
    </g>
  );
}

/* ── Kabartma ilmek ──────────────────────────────────── */
/**
 * Önden görünüş. Önden kabartma: tığ önden girer, gövdenin ARKASINDAN dolanıp önden çıkar (gövde tığın üstünde).
 * Arkadan kabartma: tığ arkadan girer, gövdenin ÖNÜNDEN geçip arkaya döner (tığ gövdenin üstünde, diğerlerinin arkasında).
 */
export function PostScene({ side }: { side: 'front' | 'back' }) {
  const color = YARN.main;
  const xs = [70, 130, 190, 250, 310, 370];
  const yb = 278;
  const yt = 168;
  const target = 2;
  const tx = xs[target];
  const tip: P = [tx - 30, 226];
  const hook = (
    <Move from={[50, -30]} at={[0.1, 0.5]}>
      <Hook tip={tip} angle={-22} length={300} w={14} throatDown />
    </Move>
  );
  const post = (i: number) => <Post key={i} x={xs[i]} y0={yb} y1={yt} color={color} glow={i === target} />;
  const others = xs.map((_, i) => (i === target ? null : post(i)));
  return (
    <g>
      {xs.map((x, i) => (
        <Top key={`t${i}`} x={x} y={yt} color={color} />
      ))}
      {side === 'front' ? (
        <g>
          {others}
          {hook}
          {post(target)}
          <Arrow d={`M${tx + 44} ${tip[1] + 40} C${tx + 20} ${tip[1] + 44} ${tx - 8} ${tip[1] + 36} ${tx - 26} ${tip[1] + 14}`} n={1} start={[tx + 56, tip[1] + 44]} />
        </g>
      ) : (
        <g>
          {post(target)}
          {hook}
          {others}
          <Arrow d={`M${tx + 44} ${tip[1] - 44} C${tx + 20} ${tip[1] - 50} ${tx - 8} ${tip[1] - 40} ${tx - 26} ${tip[1] - 14}`} n={1} start={[tx + 56, tip[1] - 48]} />
        </g>
      )}
    </g>
  );
}

/* ── Tunus işi ───────────────────────────────────────── */
export type TunisianPass = 'forward' | 'return' | 'fabric';

/**
 * Uzun Tunus tığı yatay, ucu solda. Gidişte her dikey çubuğun altından ilmek alınır ve tığda birikir;
 * dönüşte soldan sağa "ip at, ikisinden geçir" ile kapanır. Her ilmek kendi sütununun tam üstündedir.
 */
export function TunisianScene({ pass, onHook = 4 }: { pass: TunisianPass; onHook?: number }) {
  const color = YARN.main;
  const ycol = YARN.second;
  const cols = 8;
  const x0 = 64;
  const sw = 38;
  const yHook = 132;
  const yRow = 200; // önceki sıranın üst zinciri
  const rowH = 44;
  const prev: ReactNode[] = [];
  const rowsBelow = pass === 'fabric' ? 4 : 2;
  const off = pass === 'fabric' ? -70 : 0;
  for (let r = 0; r < rowsBelow; r++) {
    const yTop = yRow + r * rowH + off;
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * sw;
      prev.push(<Yarn key={`v${r}-${c}`} d={`M${x} ${yTop + 6} L${x} ${yTop + rowH - 4}`} color={color} w={YW} />);
    }
    prev.push(<Yarn key={`h${r}`} d={`M${x0 - 16} ${yTop} L${x0 + (cols - 1) * sw + 16} ${yTop}`} color={shade(color, -0.14)} w={YW * 0.8} />);
  }
  if (pass === 'fabric') return <g>{prev}</g>;
  const first = cols - onHook; // tığdaki ilk (en soldaki) ilmeğin sütunu
  const loopXs = Array.from({ length: onHook }, (_, k) => x0 + (first + k) * sw);
  const tip: P = [loopXs[0] - 36, yHook];
  const cur: ReactNode[] = loopXs.map((x, k) => <Yarn key={`c${k}`} d={`M${x} ${yRow - 4} L${x} ${yHook + 12}`} color={color} w={YW * 0.85} />);
  if (pass === 'return') {
    // kapanmış sütunlar (solda): çubuk ve üst zincir
    for (let c = 0; c < first; c++) cur.push(<Yarn key={`d${c}`} d={`M${x0 + c * sw} ${yRow - 4} L${x0 + c * sw} ${yHook + 12}`} color={color} w={YW * 0.85} />);
    cur.push(<Yarn key="chain" d={`M${x0 - 16} ${yHook + 8} L${tip[0] + 24} ${yHook + 8}`} color={shade(color, -0.14)} w={YW * 0.8} />);
  }
  const target = x0 + (first - 1) * sw;
  return (
    <g>
      {prev}
      {cur}
      {loopXs.map((x, k) => (
        <HookLoopBack key={`b${k}`} c={[x, yHook]} angle={0} color={k === 0 && pass === 'forward' ? ycol : color} ry={13} rx={7} w={YW} />
      ))}
      <Hook tip={tip} angle={0} length={360} w={14} />
      {loopXs.map((x, k) => (
        <HookLoopFront key={`f${k}`} c={[x, yHook]} angle={0} color={k === 0 && pass === 'forward' ? ycol : color} ry={13} rx={7} w={YW} />
      ))}
      <Yarn d={`M${tip[0] + 8} ${yHook - 8} C${tip[0] + 30} ${70} 300 50 390 30`} color={ycol} w={YW} />
      {pass === 'forward' && first > 0 && (
        <g>
          <Target c={[target, yRow + rowH / 2]} r={20} />
          <Arrow d={`M${target - 40} ${yRow + 52} C${target - 10} ${yRow + 50} ${target + 4} ${yRow + 30} ${tip[0] + 6} ${tip[1] + 18}`} n={1} start={[target - 52, yRow + 56]} />
        </g>
      )}
      {pass === 'return' && (
        <g>
          <Arrow d={`M${tip[0] - 6} ${tip[1] - 36} C${tip[0] + 20} ${tip[1] - 56} ${tip[0] + 56} ${tip[1] - 44} ${loopXs[1] + 6} ${tip[1] - 18}`} n={2} start={[tip[0] - 20, tip[1] - 36]} />
        </g>
      )}
    </g>
  );
}

/* ── Motif birleştirme ───────────────────────────────── */
export type JoinMethod = 'slst' | 'sc' | 'whip';

/** İki motifin kenarı yan yana; birleştirme ilmekleri ortada */
export function JoinScene({ method, colorA = '#c08a2e', colorB = '#5f7a61' }: { method: JoinMethod; colorA?: string; colorB?: string }) {
  const y0 = 40;
  const n = 6;
  const step = 38;
  const seam = 200;
  const edge = (x: number, color: string, flip: boolean) =>
    Array.from({ length: n }, (_, i) => {
      const y = y0 + 20 + i * step;
      return (
        <g key={`${x}-${i}`}>
          <Yarn d={`M${x + (flip ? -16 : 16)} ${y - 14} C${x + (flip ? 6 : -6)} ${y - 12} ${x + (flip ? 6 : -6)} ${y + 12} ${x + (flip ? -16 : 16)} ${y + 14}`} color={color} w={YW} />
        </g>
      );
    });
  const block = (x: number, w: number, color: string) => (
    <g>
      <rect x={x} y={y0} width={w} height={n * step + 6} rx={6} fill={color} opacity={0.82} />
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d={`M${x + 8} ${y0 + 26 + i * 44} L${x + w - 8} ${y0 + 26 + i * 44}`} stroke={shade(color, -0.25)} strokeWidth={3} strokeDasharray="10 8" />
      ))}
    </g>
  );
  const joins: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const y = y0 + 20 + i * step;
    if (method === 'slst') joins.push(<circle key={i} cx={seam} cy={y} r={7} fill={YARN.second} stroke={shade(YARN.second, -0.35)} strokeWidth={1.5} />);
    else if (method === 'sc')
      joins.push(
        <g key={i}>
          <Yarn d={`M${seam - 12} ${y - 12} L${seam + 12} ${y + 12}`} color={YARN.second} w={7} />
          <Yarn d={`M${seam + 12} ${y - 12} L${seam - 12} ${y + 12}`} color={YARN.second} w={7} />
        </g>,
      );
    else joins.push(<Yarn key={i} d={`M${seam - 22} ${y + 10} C${seam - 8} ${y - 18} ${seam + 8} ${y - 18} ${seam + 22} ${y - 4}`} color={YARN.second} w={6} />);
  }
  const lastY = y0 + 20 + (n - 1) * step;
  return (
    <g>
      {block(40, 140, colorA)}
      {block(220, 140, colorB)}
      {edge(180, shade(colorA, 0.1), true)}
      {edge(220, shade(colorB, 0.1), false)}
      {joins}
      {method === 'whip' ? (
        <g>
          <Needle base={[seam + 120, lastY + 40]} tip={[seam + 26, lastY + 2]} w={7} end="none" color="#c9c3b5" />
          <Arrow d={`M${seam - 40} ${lastY + 40} C${seam - 30} ${lastY + 12} ${seam - 8} ${lastY + 4} ${seam + 18} ${lastY + 8}`} n={1} start={[seam - 52, lastY + 46]} />
        </g>
      ) : (
        <g>
          <Hook tip={[seam - 4, lastY + 4]} angle={-34} length={300} w={13} throatDown />
          <Target c={[seam, lastY]} r={24} />
        </g>
      )}
    </g>
  );
}

/* ── Amigurumi top ───────────────────────────────────── */
export type AmiPhase = 'inc' | 'even' | 'dec' | 'stuff' | 'close';

/** Yandan görünüş: artırma turlarıyla açılan kase, düz turlarla gövde, eksiltmeyle kapanan top */
export function AmiBallScene({ phase, color = '#e8a0a6' }: { phase: AmiPhase; color?: string }) {
  const c: P = [200, 160];
  const R = 100;
  const dark = shade(color, -0.3);
  const light = shade(color, 0.2);
  // görünen tur aralığı: alt (0) ile üst (π) arası; ne kadar yükseldiğine göre
  const h = phase === 'inc' ? 0.35 : phase === 'even' ? 0.62 : phase === 'dec' ? 0.86 : phase === 'stuff' ? 0.86 : 1;
  const yTop = c[1] + R - 2 * R * h;
  const halfW = (y: number) => Math.sqrt(Math.max(0, R * R - (y - c[1]) ** 2));
  const rows: ReactNode[] = [];
  const nRows = Math.round(12 * h);
  for (let i = 1; i <= nRows; i++) {
    const y = c[1] + R - (2 * R * i) / 12;
    const w = halfW(y);
    if (w < 4) continue;
    rows.push(<path key={i} d={`M${c[0] - w} ${y} Q${c[0]} ${y + 10} ${c[0] + w} ${y}`} fill="none" stroke={dark} strokeWidth={2} opacity={0.6} />);
    // V ilmekler
    for (let k = -3; k <= 3; k++) {
      const x = c[0] + (k / 4) * w;
      rows.push(<path key={`v${i}-${k}`} d={`M${x - 5} ${y - 9} L${x} ${y + 1} L${x + 5} ${y - 9}`} fill="none" stroke={light} strokeWidth={2} strokeLinecap="round" />);
    }
  }
  const wTop = halfW(yTop);
  const body = phase === 'close' ? `M${c[0] - R} ${c[1]} A${R} ${R} 0 1 0 ${c[0] + R} ${c[1]} A${R} ${R} 0 1 0 ${c[0] - R} ${c[1]}Z` : `M${c[0] - wTop} ${yTop} A${R} ${R} 0 ${h > 0.5 ? 1 : 0} 0 ${c[0] + wTop} ${yTop} Q${c[0]} ${yTop + 12} ${c[0] - wTop} ${yTop}Z`;
  const markerX = c[0] + wTop * 0.3;
  return (
    <g>
      <path d={body} fill={color} stroke={dark} strokeWidth={2.5} />
      {phase !== 'close' && <ellipse cx={c[0]} cy={yTop} rx={wTop} ry={Math.max(4, wTop * 0.18)} fill={shade(color, -0.2)} stroke={dark} strokeWidth={2} />}
      {phase === 'stuff' && (
        <g>
          {[-30, -6, 18, 38].map((dx, i) => (
            <circle key={i} cx={c[0] + dx} cy={yTop - 6 + (i % 2) * 6} r={16} fill="#fbf7ee" stroke="#d8cfbd" strokeWidth={2} />
          ))}
          <Arrow d={`M${c[0] + 120} ${yTop - 70} C${c[0] + 80} ${yTop - 60} ${c[0] + 40} ${yTop - 40} ${c[0] + 20} ${yTop - 18}`} n={1} start={[c[0] + 132, yTop - 74]} />
        </g>
      )}
      {rows}
      {phase !== 'close' && phase !== 'stuff' && (
        <g>
          {/* tur başı işaretçisi */}
          <path d={`M${markerX} ${yTop + 2} l-6 16 l12 0 Z`} fill="#3f6c8a" stroke={shade('#3f6c8a', -0.3)} strokeWidth={1.5} />
          <Target c={[markerX, yTop + 8]} r={18} />
        </g>
      )}
      {phase === 'close' && (
        <g>
          <Yarn d={`M${c[0]} ${c[1] - R + 4} C${c[0] + 20} ${c[1] - R - 30} ${c[0] + 60} ${c[1] - R - 34} ${c[0] + 96} ${c[1] - R - 22}`} color={YARN.second} w={5} />
          <Needle base={[c[0] + 150, c[1] - R - 10]} tip={[c[0] + 96, c[1] - R - 22]} w={7} end="none" color="#c9c3b5" />
          <Arrow d={`M${c[0] - 50} ${c[1] - R + 40} C${c[0] - 30} ${c[1] - R + 16} ${c[0] - 10} ${c[1] - R + 8} ${c[0] - 4} ${c[1] - R + 4}`} n={2} start={[c[0] - 62, c[1] - R + 50]} />
        </g>
      )}
    </g>
  );
}
