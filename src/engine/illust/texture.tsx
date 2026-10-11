/**
 * Doku sahneleri: burgu (yardımcı şiş), burgu kumaşı, renkli örgünün arka yüzü (ip atlamaları),
 * ölçü örneğini cetvelle saymak.
 */
import type { ReactNode } from 'react';
import { shade } from '@/lib/color';
import { add, mul, norm, sub, type P } from './geom';
import { Arrow, Badge, LoopBack, LoopFront, Needle, Target, Yarn } from './parts';
import { KnitScene, K, leftLoopAt, rightLoopAt } from './knit';
import { SwatchScene, type Cell } from './swatch';
import { C, YARN } from './theme';

/** burgu ilmeklerinin rengi (öğretici vurgu) */
export const CABLE_COL = '#d9895b';

/* ── Yardımcı şiş ── */
function CableNeedle({ from, to, loops, color = CABLE_COL }: { from: P; to: P; loops: number; color?: string }) {
  const u = norm(sub(to, from));
  const ang = (Math.atan2(u[1], u[0]) * 180) / Math.PI;
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const cs = Array.from({ length: loops }, (_, i) => add(from, mul(u, len * 0.38 + i * K.gap * 0.8)));
  const lp = { w: K.loopW * 0.9, h: K.loopH * 0.75, nw: 10, yw: K.yarnW * 0.9 };
  return (
    <g>
      {cs.map((c, i) => (
        <LoopBack key={`b${i}`} c={c} angle={ang} color={color} {...lp} />
      ))}
      <Needle base={from} tip={to} w={10} end="point" color="#b7a17a" />
      {cs.map((c, i) => (
        <LoopFront key={`f${i}`} c={c} angle={ang} color={color} {...lp} />
      ))}
    </g>
  );
}

export type CablePhase = 'slip' | 'hold' | 'fromCn' | 'result';

/** C4F: 2 ilmek yardımcı şişe, önde tutulur; sonraki 2 düz; yardımcı şiştekiler düz */
export function CableScene({ phase }: { phase: CablePhase }) {
  if (phase === 'result') return <CableSwatch />;
  const cn = { from: [92, 244] as P, to: [236, 222] as P };
  const cols = (n: number) => Array.from({ length: n }, (_, i) => (i < (phase === 'slip' ? 4 : 2) ? CABLE_COL : undefined)) as string[];
  if (phase === 'slip') {
    const a = leftLoopAt(0);
    return (
      <KnitScene
        left={6}
        right={2}
        rn="rest"
        leftColors={cols(6)}
        target={[0, 1]}
        extra={<CableNeedle {...cn} loops={0} />}
        arrows={<Arrow d={`M${a[0] - 10} ${a[1] + 40} C${a[0] - 20} ${a[1] + 70} ${cn.to[0] - 40} ${cn.to[1] - 10} ${cn.to[0] - 70} ${cn.to[1] - 2}`} n={1} start={[a[0] + 4, a[1] + 30]} />}
      />
    );
  }
  if (phase === 'hold') {
    return <KnitScene left={4} right={2} rn="insertK" rnFrom="rest" leftColors={cols(4)} target extra={<CableNeedle {...cn} loops={2} />} arrows={<Arrow d="M300 196 C268 200 236 186 202 136" n={2} start={[316, 200]} />} />;
  }
  // yardımcı şişteki ilmekleri ör
  const r0 = rightLoopAt('rest', 0);
  return (
    <KnitScene
      left={2}
      right={4}
      rn="rest"
      rightKinds={['k', 'k', 'k', 'k']}
      extra={<CableNeedle {...cn} loops={2} />}
      arrows={<Arrow d={`M${cn.to[0] - 30} ${cn.to[1] - 14} C${cn.to[0] + 10} ${cn.to[1] - 40} ${r0[0] - 30} ${r0[1] + 30} ${r0[0] - 16} ${r0[1] + 10}`} n={3} start={[cn.to[0] - 44, cn.to[1] - 10]} />}
    />
  );
}

/** Ters zemin üzerinde 6 ilmeklik halat burgu */
export function CableSwatch({ cell = 26, rows = 12, rowH = 20 }: { cell?: number; rows?: number; rowH?: number }) {
  const W = 10;
  const grid: Cell[][] = Array.from({ length: rows }, () => Array.from({ length: W }, (_, c) => (c < 2 || c > 7 ? 'p' : 'none')));
  const x0 = 200 - (W * cell) / 2;
  const y0 = 150 - (rows * rowH) / 2;
  const cx = 200;
  const dx = cell * 1.5;
  const bandW = cell * 2.5;
  const period = rowH * 6;
  const yBottom = y0 + rows * rowH;
  const pieces: { d: string; front: boolean; key: string }[] = [];
  // alttan yukarı: düz kısım + çapraz
  let left = true; // A bandı solda mı
  for (let y = yBottom, k = 0; y > y0; y -= period, k++) {
    const yStraightEnd = Math.max(y0, y - period * 0.5);
    const yCrossEnd = Math.max(y0, y - period);
    const xa = left ? cx - dx : cx + dx;
    const xb = left ? cx + dx : cx - dx;
    pieces.push({ d: `M${xa} ${y} L${xa} ${yStraightEnd}`, front: false, key: `sa${k}` });
    pieces.push({ d: `M${xb} ${y} L${xb} ${yStraightEnd}`, front: false, key: `sb${k}` });
    if (yCrossEnd < yStraightEnd) {
      const m = (yStraightEnd + yCrossEnd) / 2;
      // sağdaki şerit sola, önden geçer
      const fromR = left ? xb : xa;
      const fromL = left ? xa : xb;
      pieces.push({ d: `M${fromL} ${yStraightEnd} C${fromL} ${m} ${fromR} ${m} ${fromR} ${yCrossEnd}`, front: false, key: `cb${k}` });
      pieces.push({ d: `M${fromR} ${yStraightEnd} C${fromR} ${m} ${fromL} ${m} ${fromL} ${yCrossEnd}`, front: true, key: `cf${k}` });
      left = !left;
    }
  }
  return (
    <g>
      <SwatchScene rows={grid} cell={cell} rowH={rowH} />
      <rect x={x0 + 2 * cell} y={y0} width={6 * cell} height={rows * rowH + 4} fill={shade(YARN.main, -0.25)} opacity={0.35} />
      {pieces.filter((p) => !p.front).map((p) => <Yarn key={p.key} d={p.d} color={YARN.main} w={bandW} cap="butt" />)}
      {pieces.filter((p) => p.front).map((p) => <Yarn key={p.key} d={p.d} color={shade(YARN.main, 0.08)} w={bandW} cap="butt" />)}
    </g>
  );
}

/* ── Renkli örgü ── */
/** 8 ilmeklik baklava motifi (üstten alta) */
export const DIAMOND_MOTIF = ['...B....', '..B.B...', '.B...B..', 'B.....B.', '.B...B..', '..B.B...', '...B....', '........'];
export const COLOR_A = '#efe3cc';
export const COLOR_B = '#3f6c8a';

function motifColors(motif: string[], w: number, a: string, b: string): string[][] {
  return motif.map((row) => Array.from({ length: w }, (_, c) => (row[c % row.length] === 'B' ? b : a)));
}

/** Renkli örgü ön yüz */
export function ColorworkFront({ a = COLOR_A, b = COLOR_B, w = 12 }: { a?: string; b?: string; w?: number }) {
  const colors = motifColors(DIAMOND_MOTIF, w, a, b);
  const rows: Cell[][] = colors.map((r) => r.map(() => 'k'));
  return <SwatchScene rows={rows} colors={colors} cell={26} rowH={22} />;
}

/** Arka yüz: ters boncuklar ve kullanılmayan rengin arkada uzanan atlamaları; 5'ten uzun atlamalar işaretli */
export function ColorworkBack({ a = COLOR_A, b = COLOR_B, w = 12, catchLong = false }: { a?: string; b?: string; w?: number; catchLong?: boolean }) {
  const colors = motifColors(DIAMOND_MOTIF, w, a, b).map((r) => [...r].reverse()); // arka yüz aynalı
  const rows: Cell[][] = colors.map((r) => r.map(() => 'p'));
  const cell = 26;
  const rowH = 22;
  const x0 = 200 - (w * cell) / 2;
  const y0 = 150 - (colors.length * rowH) / 2;
  const floats: ReactNode[] = [];
  colors.forEach((row, r) => {
    for (const col of [a, b]) {
      const idx = row.map((c, i) => (c === col ? i : -1)).filter((i) => i >= 0);
      for (let k = 0; k < idx.length - 1; k++) {
        const i0 = idx[k];
        const i1 = idx[k + 1];
        if (i1 - i0 < 2) continue;
        const y = y0 + r * rowH + rowH * 0.42;
        const xA = x0 + i0 * cell + cell * 0.7;
        const xB = x0 + i1 * cell + cell * 0.3;
        const long = i1 - i0 - 1 >= 5;
        floats.push(<Yarn key={`${r}-${col}-${k}`} d={`M${xA} ${y} C${xA + 10} ${y - 3} ${xB - 10} ${y - 3} ${xB} ${y}`} color={col} w={4.5} />);
        if (long && catchLong) floats.push(<Target key={`t${r}-${k}`} c={[(xA + xB) / 2, y]} r={16} />);
      }
    }
  });
  return <SwatchScene rows={rows} colors={colors} cell={cell} rowH={rowH} extra={<g>{floats}</g>} />;
}

/** İki renkle örerken: iki ip arkada, biri önde kullanılır; kullanılmayan arkada gevşek uzanır */
export function TwoColorScene() {
  return (
    <KnitScene
      left={4}
      right={3}
      rn="insertK"
      rnFrom="rest"
      rightKinds={['k', 'k', 'k']}
      yarnColor={COLOR_B}
      extra={<Yarn d="M300 190 C330 210 360 260 380 330" color={shade(COLOR_A, -0.08)} w={K.yarnW} />}
      arrows={<Arrow d="M300 196 C268 200 236 186 202 136" n={1} start={[316, 200]} />}
    />
  );
}

/* ── Ölçü örneği ── */
/** Ölçü örneği üzerinde 10 cm cetvel; `dir`: ilmek (yatay) ya da sıra (dikey) sayımı */
export function GaugeScene({ dir, count }: { dir: 'st' | 'row'; count: number }) {
  const W = dir === 'st' ? count + 5 : 14;
  const H = dir === 'row' ? count + 3 : 12;
  const cell = Math.min(26, 350 / W);
  const rowH = Math.min(cell * 0.72, 240 / H);
  const rows: Cell[][] = Array.from({ length: H }, () => Array.from({ length: W }, () => 'k' as Cell));
  const x0 = 200 - (W * cell) / 2;
  const y0 = 150 - (H * rowH) / 2;
  const tape = '#f2c94c';
  const ink = C.ink;
  let ruler: ReactNode;
  if (dir === 'st') {
    const y = y0 + rowH * 6;
    const xs = x0 + cell * 2.5;
    const len = count * cell;
    ruler = (
      <g>
        <rect x={xs - 8} y={y - 4} width={len + 16} height={26} rx={3} fill={tape} stroke={shade(tape, -0.4)} strokeWidth={1.5} opacity={0.95} />
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} d={`M${xs + (len * i) / 10} ${y - 4} l0 ${i % 5 === 0 ? 14 : 8}`} stroke={ink} strokeWidth={1.6} />
        ))}
        <rect x={xs} y={y0 - 4} width={len} height={H * rowH + 12} fill="var(--il-highlight)" opacity={0.14} stroke="var(--il-highlight)" strokeWidth={2} strokeDasharray="6 5" />
        <Badge c={[xs + len / 2, y0 - 16]} n={count} />
      </g>
    );
  } else {
    const x = x0 + cell * 6;
    const ys = y0 + rowH * 1.5;
    const len = count * rowH;
    ruler = (
      <g>
        <rect x={x - 4} y={ys - 8} width={26} height={len + 16} rx={3} fill={tape} stroke={shade(tape, -0.4)} strokeWidth={1.5} opacity={0.95} />
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} d={`M${x - 4} ${ys + (len * i) / 10} l${i % 5 === 0 ? 14 : 8} 0`} stroke={ink} strokeWidth={1.6} />
        ))}
        <rect x={x0 - 4} y={ys} width={W * cell + 8} height={len} fill="var(--il-highlight)" opacity={0.14} stroke="var(--il-highlight)" strokeWidth={2} strokeDasharray="6 5" />
        <Badge c={[x0 + W * cell + 18, ys + len / 2]} n={count} />
      </g>
    );
  }
  return <SwatchScene rows={rows} cell={cell} rowH={rowH} extra={ruler} />;
}
