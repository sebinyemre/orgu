/**
 * Kumaş ve şiş yardımcı sahneleri: örgü örneği (haraşo, jarse, lastik, pirinç…), ilmek kapatma,
 * kaçan ilmeği tığla toplama, uç gizleme, işi çevirme.
 */
import type { ReactNode } from 'react';
import { shade } from '@/lib/color';
import { type P } from './geom';
import { Arrow, Hook, HookLoopBack, HookLoopFront, LoopBack, LoopFront, Move, Needle, Slide, Fade, Target, Yarn } from './parts';
import { YARN } from './theme';

/** k düz, p ters, yo delik, k2tog sağa yatık, ssk sola yatık, sl iki sıra boyu kaydırılmış, ladder kaçak, none boş */
export type Cell = 'k' | 'p' | 'yo' | 'k2tog' | 'ssk' | 'sl' | 'ladder' | 'none';

/** Ön yüzden görünüşle örgü örneği; rows[0] en ÜST sıra */
export function SwatchScene({
  rows,
  color = YARN.main,
  cell = 30,
  rowH = 22,
  origin = [200, 150],
  highlightRow,
  highlightCol,
  colors,
  extra,
}: {
  rows: Cell[][];
  /** hücre renkleri (renkli örgü); verilmeyen hücre `color` */
  colors?: (string | undefined)[][];
  color?: string;
  cell?: number;
  rowH?: number;
  origin?: P;
  highlightRow?: number;
  highlightCol?: number;
  extra?: ReactNode;
}) {
  const W = Math.max(...rows.map((r) => r.length));
  const H = rows.length;
  const x0 = origin[0] - (W * cell) / 2;
  const y0 = origin[1] - (H * rowH) / 2;
  const yw = cell * 0.24;
  const items: ReactNode[] = [];
  for (let r = H - 1; r >= 0; r--) {
    for (let c = 0; c < W; c++) {
      const k = rows[r][c] ?? 'k';
      const x = x0 + c * cell + cell / 2;
      const y = y0 + r * rowH;
      const key = `${r}-${c}`;
      const col = colors?.[r]?.[c] ?? color;
      const dark = shade(col, -0.32);
      const light = shade(col, 0.24);
      if (k === 'k' || k === 'k2tog' || k === 'ssk' || k === 'sl') {
        const top = k === 'sl' ? y - rowH : y;
        const hh = k === 'sl' ? rowH * 2 : rowH;
        const legL = `M${x - cell * 0.42} ${top} C${x - cell * 0.36} ${top + hh * 0.55} ${x - cell * 0.12} ${top + hh * 0.95} ${x} ${top + hh * 1.18 - (k === 'sl' ? rowH * 0.2 : 0)}`;
        const legR = `M${x + cell * 0.42} ${top} C${x + cell * 0.36} ${top + hh * 0.55} ${x + cell * 0.12} ${top + hh * 0.95} ${x} ${top + hh * 1.18 - (k === 'sl' ? rowH * 0.2 : 0)}`;
        const skew = k === 'k2tog' ? -24 : k === 'ssk' ? 24 : 0;
        const cy = y + rowH * 0.6;
        items.push(
          <g key={key} transform={skew ? `translate(${x} ${cy}) skewX(${skew}) translate(${-x} ${-cy})` : undefined}>
            {[legL, legR].map((d, i) => (
              <g key={i}>
                <path d={d} stroke={dark} strokeWidth={yw + 2.2} fill="none" strokeLinecap="round" />
                <path d={d} stroke={skew && i === (skew < 0 ? 1 : 0) ? shade(col, 0.1) : col} strokeWidth={yw} fill="none" strokeLinecap="round" />
                <path d={d} stroke={light} strokeWidth={yw * 0.35} fill="none" strokeLinecap="round" strokeDasharray={`${yw * 0.7} ${yw * 0.9}`} />
              </g>
            ))}
          </g>,
        );
      } else if (k === 'p') {
        items.push(
          <g key={key}>
            <ellipse cx={x} cy={y + rowH * 0.55} rx={cell * 0.5} ry={Math.max(yw * 0.8, rowH * 0.3)} fill={col} stroke={dark} strokeWidth={1.6} />
            <path d={`M${x - cell * 0.34} ${y + rowH * 0.5} Q${x} ${y + rowH * 0.3} ${x + cell * 0.34} ${y + rowH * 0.5}`} stroke={light} strokeWidth={yw * 0.3} fill="none" />
          </g>,
        );
      } else if (k === 'yo') {
        items.push(<ellipse key={key} cx={x} cy={y + rowH * 0.6} rx={cell * 0.26} ry={rowH * 0.4} fill="var(--il-bg)" stroke={dark} strokeWidth={yw * 0.6} />);
      } else if (k === 'ladder') {
        items.push(<path key={key} d={`M${x - cell * 0.5} ${y + rowH * 0.6} L${x + cell * 0.5} ${y + rowH * 0.6}`} stroke={col} strokeWidth={yw * 0.8} strokeLinecap="round" />);
      }
    }
  }
  return (
    <g>
      {items}
      {highlightRow !== undefined && (
        <rect x={x0 - 6} y={y0 + highlightRow * rowH - 4} width={W * cell + 12} height={rowH + 10} rx={8} fill="var(--il-highlight)" opacity={0.18} stroke="var(--il-highlight)" strokeWidth={2} />
      )}
      {highlightCol !== undefined && (
        <rect x={x0 + highlightCol * cell - 3} y={y0 - 6} width={cell + 6} height={H * rowH + 14} rx={8} fill="var(--il-highlight)" opacity={0.18} stroke="var(--il-highlight)" strokeWidth={2} />
      )}
      {extra}
    </g>
  );
}

/** Hazır örnek desenler (üstten alta sıralar) */
export function swatchRows(kind: 'jarse' | 'jarse-back' | 'haraso' | 'lastik1' | 'lastik2' | 'pirinc' | 'yalanci', w = 10, h = 8): Cell[][] {
  const rows: Cell[][] = [];
  for (let r = 0; r < h; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < w; c++) {
      let k: Cell = 'k';
      if (kind === 'jarse-back') k = 'p';
      else if (kind === 'haraso') k = r % 2 === 0 ? 'p' : 'k';
      else if (kind === 'lastik1') k = c % 2 === 0 ? 'k' : 'p';
      else if (kind === 'lastik2') k = c % 4 < 2 ? 'k' : 'p';
      else if (kind === 'pirinc') k = (c + r) % 2 === 0 ? 'k' : 'p';
      else if (kind === 'yalanci') {
        const m = c % 4;
        k = m === 1 ? 'k' : m === 3 ? 'p' : r % 2 === 0 ? 'p' : 'k';
      }
      row.push(k);
    }
    rows.push(row);
  }
  return rows;
}

/* ── İlmek kapatma ────────────────────────────────────── */
export type BindOffPhase = 'two' | 'insert' | 'lift' | 'one' | 'last';

/** Sağ şişteki iki ilmekten uzaktakini yakındakinin üstünden geçirip düşürme */
export function BindOffScene({ phase }: { phase: BindOffPhase }) {
  const main = YARN.main;
  const work = YARN.second;
  const rnTip: P = [150, 128];
  const rnBase: P = [470, 168];
  const a = 7.1;
  const near: P = [196, 134];
  const far: P = [244, 140];
  const loopP = { w: 34, h: 44, nw: 15, yw: 9.5 };
  const showFar = phase !== 'one' && phase !== 'last';
  const lnTip: P = phase === 'insert' || phase === 'lift' ? [232, 108] : [120, 190];
  const lnBase: P = [-40, 252];
  return (
    <g>
      {/* kapatılmış kenar (alt) */}
      {[290, 330, 370].map((x, i) => (
        <Yarn key={i} d={`M${x - 20} ${190 + i * 2} C${x - 10} ${176 + i * 2} ${x + 10} ${176 + i * 2} ${x + 20} ${190 + i * 2}`} color={main} w={9} />
      ))}
      <LoopBack c={near} angle={a} color={work} {...loopP} />
      {showFar && (phase === 'lift' ? (
        <Fade at={[0.62, 0.72]} out>
          <Slide to={[-70, -40]} at={[0.15, 0.6]}>
            <LoopBack c={far} angle={a} color={main} {...loopP} />
          </Slide>
        </Fade>
      ) : (
        <LoopBack c={far} angle={a} color={main} {...loopP} />
      ))}
      {(phase === 'insert' || phase === 'lift') && <Needle base={lnBase} tip={lnTip} w={15} />}
      <Needle base={rnBase} tip={rnTip} w={15} />
      <LoopFront c={near} angle={a} color={work} {...loopP} />
      {showFar && (phase === 'lift' ? (
        <Fade at={[0.62, 0.72]} out>
          <Slide to={[-70, -40]} at={[0.15, 0.6]}>
            <LoopFront c={far} angle={a} color={main} {...loopP} />
          </Slide>
        </Fade>
      ) : (
        <LoopFront c={far} angle={a} color={main} {...loopP} />
      ))}
      {phase === 'last' && (
        <g>
          <Yarn d="M196 120 C196 80 210 50 240 30" color={work} w={9} />
          <Arrow d="M220 90 C232 70 236 50 236 30" n={4} start={[214, 104]} />
        </g>
      )}
      {phase === 'two' && <Target c={far} r={24} />}
      {phase === 'insert' && <Arrow d="M150 230 C180 200 210 160 228 116" n={1} start={[142, 244]} />}
      {phase === 'lift' && <Arrow d="M246 112 C236 70 190 70 160 110" n={2} start={[258, 104]} />}
      {phase === 'one' && <Arrow d="M110 200 C130 180 160 160 182 146" n={3} start={[100, 212]} />}
    </g>
  );
}

/* ── Kaçan ilmeği tığla toplama ───────────────────────── */
export function LadderScene({ phase }: { phase: 'see' | 'hook' | 'pull' }) {
  const rows: Cell[][] = Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => (c === 3 ? (r < 4 ? 'ladder' : 'k') : 'k')));
  const loopC: P = phase === 'see' ? [200, 216] : phase === 'hook' ? [200, 216] : [200, 196];
  return (
    <g>
      <SwatchScene rows={rows} origin={[200, 170]} cell={34} rowH={26} />
      {/* kaçan ilmek */}
      <g>
        <ellipse cx={loopC[0]} cy={loopC[1]} rx={14} ry={10} fill="none" stroke={YARN.second} strokeWidth={8} />
      </g>
      {phase !== 'see' && (
        <Move from={[30, -40]} at={[0.1, 0.45]}>
          <g>
            <HookLoopBack c={[208, 150]} angle={-62} color={YARN.second} ry={12} rx={6} w={7} />
            <Hook tip={[196, 206]} angle={-70} length={260} w={13} />
            <HookLoopFront c={[208, 150]} angle={-62} color={YARN.second} ry={12} rx={6} w={7} />
          </g>
        </Move>
      )}
      {phase === 'see' && <Target c={loopC} r={26} />}
      {phase === 'hook' && <Arrow d="M260 110 C240 130 222 170 206 204" n={1} start={[270, 98]} />}
      {phase === 'pull' && <Arrow d="M240 196 C246 176 240 160 226 146" n={2} start={[250, 210]} />}
    </g>
  );
}

/* ── Uç gizleme (yün iğnesiyle arka yüzde) ────────────── */
export function WeaveScene({ phase }: { phase: 'thread' | 'weave' | 'trim' }) {
  const rows = swatchRows('jarse-back', 9, 7);
  return (
    <g>
      <SwatchScene rows={rows} origin={[200, 168]} cell={34} rowH={26} />
      {phase !== 'thread' && (
        <Yarn d="M60 250 C100 236 120 216 150 216 C180 216 196 230 230 230 C250 230 262 222 280 222" color={YARN.second} w={7} draw={phase === 'weave' ? [0.1, 0.65] : undefined} />
      )}
      {phase === 'thread' && <Yarn d="M60 250 C80 240 90 230 110 228" color={YARN.second} w={7} />}
      {phase === 'weave' && (
        <Move from={[-120, 10]} at={[0.1, 0.65]}>
          <g>
            <path d="M280 222 L360 210" stroke="#8a95a0" strokeWidth={6} strokeLinecap="round" />
            <ellipse cx={354} cy={211} rx={5} ry={2.4} fill="var(--il-bg)" transform="rotate(-8 354 211)" />
          </g>
        </Move>
      )}
      {phase === 'trim' && <Arrow d="M290 200 C300 210 300 222 290 232" n={3} start={[300, 186]} />}
      {phase === 'thread' && <Target c={[110, 228]} r={18} />}
    </g>
  );
}

/* ── İşi çevirme ──────────────────────────────────────── */
export function TurnScene() {
  return (
    <g>
      <g transform="translate(0 20)">
        <Needle base={[420, 150]} tip={[150, 150]} w={14} />
        {[180, 216, 252, 288, 324].map((x) => (
          <g key={x}>
            <LoopBack c={[x, 150]} angle={0} color={YARN.main} w={28} h={34} nw={14} yw={8} />
            <LoopFront c={[x, 150]} angle={0} color={YARN.main} w={28} h={34} nw={14} yw={8} />
          </g>
        ))}
      </g>
      <Arrow d="M380 80 C300 30 140 30 90 110" n={1} start={[394, 92]} />
      <Arrow d="M110 260 C170 290 280 290 330 250" start={[96, 252]} />
    </g>
  );
}
