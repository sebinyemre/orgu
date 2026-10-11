/**
 * Tığ sahnesi kurucusu (yakın plan): tığ, tığdaki ilmekler, çalışılan sıra ya da zincir, çalışan ip.
 *
 * Her tığ ilmeği şu hareketlerin bir dizisidir: ip at (yo), bat (insert), ipi çek (pull up),
 * n ilmekten geçir (through n). Sahne tığdaki ilmek sayısını ve hareketi gösterir.
 * Katman sırası: tığın arkasından geçen ilmek yarıları önce, öndekiler sonra çizilir.
 */
import type { ReactNode } from 'react';
import { shade } from '@/lib/color';
import { add, mul, rad, type P } from './geom';
import { Arrow, Fade, HookLoopBack, HookLoopFront, Move, Hook, Target, Yarn, Tag, type At } from './parts';
import { YARN } from './theme';

export const CK = {
  hookW: 14,
  hookLen: 340,
  yarnW: 9,
  st: 48,
  rowY: 232,
  scH: 44,
  dcH: 80,
  loopRy: 14,
  loopRx: 8,
};

export type HookPose = 'up' | 'inserted' | 'pulled' | 'chain' | 'ring' | 'post';

export const HOOK: Record<HookPose, { tip: P; angle: number }> = {
  up: { tip: [118, 128], angle: -24 },
  inserted: { tip: [148, 240], angle: -46 },
  pulled: { tip: [124, 150], angle: -28 },
  chain: { tip: [108, 118], angle: -20 },
  ring: { tip: [176, 186], angle: -40 },
  post: { tip: [140, 214], angle: -36 },
};

const dirOf = (a: number): P => [Math.cos(rad(a)), Math.sin(rad(a))];

/** Tığdaki k. ilmeğin merkezi (0 = uca en yakın) */
export function hookLoopAt(pose: HookPose, k: number): P {
  const h = HOOK[pose];
  return add(h.tip, mul(dirOf(h.angle), 40 + k * 20));
}

/** Hedef ilmeğin (önceki sıranın) x konumu */
export const TARGET_X = 150;

export interface CrochetSceneProps {
  hook?: HookPose;
  hookFrom?: HookPose;
  hookAt?: At;
  /** tığdaki ilmek sayısı (yo hariç) */
  loops?: number;
  /** ilmeklerin renkleri (0 = uca en yakın); verilmezse ip rengi */
  loopColors?: string[];
  /** tığa atılmış ip (boğazda) */
  yo?: boolean;
  /** atılan ip çizilerek belirsin */
  yoDraw?: At;
  /** n ilmekten geçirme: bu ilmekler kaybolur */
  through?: { n: number; at: At };
  /** çalışılan zemin */
  work?: 'row' | 'chain' | 'none';
  rowKind?: 'sc' | 'hdc' | 'dc';
  /** bu sırada önceden örülmüş ilmek sayısı (sağda) */
  done?: number;
  /** zincir modunda zincir sayısı */
  chainCount?: number;
  /** hedef ilmeği işaretle */
  target?: boolean;
  /** hedef: önceki sıranın ilmeği ya da zincir (tığdan itibaren kaçıncı) */
  chainTarget?: number;
  /** yalnız arka/ön halka */
  loopPart?: 'both' | 'back' | 'front';
  /** hedef ilmekten tığa çekilmiş uzun ilmek (yeni ilmek) */
  pulledLoop?: boolean;
  arrows?: ReactNode;
  extra?: ReactNode;
  color?: string;
  yarnColor?: string;
  labels?: { yarn?: string; loops?: string };
}

/** Bir ilmeğin üst halkaları: arka halka (koyu) ve ön halka; birlikte yatay bir göz gibi görünür */
function StitchTop({ x, y, color, part = 'both', faded }: { x: number; y: number; color: string; part?: 'both' | 'back' | 'front'; faded?: boolean }) {
  const w = CK.st * 0.44;
  const back = `M${x - w} ${y + 1} C${x - w * 0.55} ${y - 11} ${x + w * 0.55} ${y - 11} ${x + w} ${y + 1}`;
  const front = `M${x - w} ${y + 1} C${x - w * 0.55} ${y + 11} ${x + w * 0.55} ${y + 11} ${x + w} ${y + 1}`;
  const dim = (on: boolean) => (on ? color : shade(color, -0.18));
  return (
    <g opacity={faded ? 0.5 : 1}>
      <Yarn d={back} color={dim(part !== 'front')} w={CK.yarnW * 0.9} />
      <Yarn d={front} color={dim(part !== 'back')} w={CK.yarnW * 0.9} />
    </g>
  );
}

/** Bir ilmeğin gövdesi: sık iğnede çapraz (X), uzun ilmeklerde dik gövde ve sarım */
function StitchPost({ x, y0, y1, color, kind = 'sc' }: { x: number; y0: number; y1: number; color: string; kind?: 'sc' | 'hdc' | 'dc' }) {
  const w = CK.st * 0.26;
  if (kind === 'sc') {
    return (
      <g>
        <Yarn d={`M${x - w} ${y0} C${x - w * 0.3} ${(y0 + y1) / 2 + 4} ${x + w * 0.3} ${(y0 + y1) / 2 - 4} ${x + w} ${y1}`} color={shade(color, -0.1)} w={CK.yarnW * 0.85} />
        <Yarn d={`M${x + w} ${y0} C${x + w * 0.3} ${(y0 + y1) / 2 + 4} ${x - w * 0.3} ${(y0 + y1) / 2 - 4} ${x - w} ${y1}`} color={color} w={CK.yarnW * 0.85} />
      </g>
    );
  }
  const m = (y0 + y1) / 2;
  return (
    <g>
      <Yarn d={`M${x - w * 0.5} ${y0} L${x - w * 0.45} ${y1}`} color={shade(color, -0.1)} w={CK.yarnW * 0.85} />
      <Yarn d={`M${x + w * 0.5} ${y0} L${x + w * 0.45} ${y1}`} color={color} w={CK.yarnW * 0.85} />
      <Yarn d={`M${x - w * 1.1} ${m + 10} C${x - w * 0.4} ${m + 4} ${x + w * 0.4} ${m - 6} ${x + w * 1.1} ${m - 12}`} color={color} w={CK.yarnW * 0.85} />
    </g>
  );
}

/** Tığ sahnesi */
export function CrochetScene(p: CrochetSceneProps) {
  const pose = p.hook ?? 'up';
  const h = HOOK[pose];
  const color = p.color ?? YARN.main;
  const ycol = p.yarnColor ?? YARN.second;
  const loops = p.loops ?? 1;
  const work = p.work ?? 'row';
  const kind = p.rowKind ?? 'sc';
  const done = p.done ?? 3;
  const rowTop = CK.rowY;
  const curH = kind === 'sc' ? CK.scH : kind === 'hdc' ? CK.scH * 1.4 : CK.dcH;

  /* ── zemin ── */
  const ground: ReactNode[] = [];
  let targetPoint: P = [TARGET_X, rowTop];
  if (work === 'row') {
    const xs = Array.from({ length: 10 }, (_, k) => TARGET_X + (k - 3) * CK.st);
    // önceki sıranın gövdeleri (alttan gelen)
    xs.forEach((x, i) => ground.push(<StitchTop key={`ppt${i}`} x={x} y={rowTop + 58} color={color} faded />));
    xs.forEach((x, i) => ground.push(<StitchPost key={`pp${i}`} x={x} y0={rowTop + 56} y1={rowTop + 6} color={color} kind={kind === 'sc' ? 'sc' : kind} />));
    // bu sıranın örülmüş ilmekleri (sağda)
    xs.forEach((x, i) => {
      const k = i - 3;
      if (k >= 1 && k <= done) ground.push(<StitchPost key={`cp${i}`} x={x} y0={rowTop + 2} y1={rowTop - curH + 6} color={color} kind={kind} />);
    });
    xs.forEach((x, i) => {
      const k = i - 3;
      if (k === 0) return; // hedef ilmek ayrıca çizilir
      ground.push(<StitchTop key={`pt${i}`} x={x} y={rowTop} color={color} />);
      if (k >= 1 && k <= done) ground.push(<StitchTop key={`ct${i}`} x={x} y={rowTop - curH} color={color} />);
    });
    targetPoint = [TARGET_X, rowTop];
  } else if (work === 'chain') {
    const n = p.chainCount ?? 8;
    const start = add(hookLoopAt(pose, loops - 1), [10, 22]);
    for (let i = 0; i < n; i++) {
      const c: P = [start[0] + 8 + i * 30, start[1] + 30 + i * 9];
      ground.push(
        <g key={`ch${i}`}>
          <Yarn d={`M${c[0] - 14} ${c[1]} C${c[0] - 10} ${c[1] - 13} ${c[0] + 10} ${c[1] - 13} ${c[0] + 15} ${c[1] + 1} C${c[0] + 10} ${c[1] + 13} ${c[0] - 10} ${c[1] + 13} ${c[0] - 14} ${c[1]}`} color={color} w={CK.yarnW * 0.85} />
        </g>,
      );
      if (p.chainTarget === i + 1) targetPoint = c;
    }
  }

  /* ── çalışan ip (sol üstten, işaret parmağından gelir) ── */
  const firstLoop = hookLoopAt(pose, 0);
  const feed: P = [12, 26];
  const workYarn = `M${feed[0]} ${feed[1]} C${80} ${40} ${firstLoop[0] - 40} ${firstLoop[1] - 50} ${firstLoop[0] - 4} ${firstLoop[1] - 8}`;

  /* ── tığdaki ilmekler ── */
  const loopEls = Array.from({ length: loops }, (_, k) => {
    const c = hookLoopAt(pose, k);
    const col = p.loopColors?.[k] ?? color;
    const fading = p.through && k < p.through.n - (p.yo ? 1 : 0);
    return { c, col, fading };
  });
  const backs = loopEls.map((l, k) => {
    const el = <HookLoopBack key={`hb${k}`} c={l.c} angle={h.angle} color={l.col} ry={CK.loopRy} rx={CK.loopRx} w={CK.yarnW} />;
    return l.fading && p.through ? (
      <Fade key={`fb${k}`} at={[p.through.at[1] - 0.05, p.through.at[1] + 0.05]} out>
        {el}
      </Fade>
    ) : (
      el
    );
  });
  const fronts = loopEls.map((l, k) => {
    const el = <HookLoopFront key={`hf${k}`} c={l.c} angle={h.angle} color={l.col} ry={CK.loopRy} rx={CK.loopRx} w={CK.yarnW} />;
    return l.fading && p.through ? (
      <Fade key={`ff${k}`} at={[p.through.at[1] - 0.05, p.through.at[1] + 0.05]} out>
        {el}
      </Fade>
    ) : (
      el
    );
  });

  // atılan ip (boğazda): arkadan üstten aşar, önden iner
  const u = dirOf(h.angle);
  const nrm: P = [-u[1], u[0]];
  const yoC = add(h.tip, mul(u, 20));
  const yoTop = add(yoC, mul(nrm, -(CK.hookW / 2 + CK.yarnW / 2)));
  const yoBot = add(yoC, mul(nrm, CK.hookW / 2 + CK.yarnW / 2));
  const yoBack = `M${feed[0]} ${feed[1]} C${70} ${30} ${yoTop[0] - 40} ${yoTop[1] - 50} ${yoTop[0]} ${yoTop[1]}`;
  const yoFront = `M${yoTop[0]} ${yoTop[1]} C${yoTop[0] - 14} ${yoTop[1] + 2} ${yoBot[0] - 14} ${yoBot[1] - 2} ${yoBot[0] + 2} ${yoBot[1] + 4} C${yoBot[0] + 14} ${yoBot[1] + 8} ${yoBot[0] + 26} ${yoBot[1] + 4} ${yoBot[0] + 34} ${yoBot[1] - 6}`;

  const hookEl = <Hook tip={h.tip} angle={h.angle} length={CK.hookLen} w={CK.hookW} throatDown />;
  const hookGroup = (
    <g>
      {backs}
      {p.yo && <Yarn d={yoBack} color={ycol} w={CK.yarnW} draw={p.yoDraw ? [p.yoDraw[0], p.yoDraw[0] + (p.yoDraw[1] - p.yoDraw[0]) * 0.6] : undefined} />}
      {hookEl}
      {/* hedef ilmek tığın önünde (tığ altından geçer) */}
      {pose === 'inserted' && work === 'row' && <StitchTop x={TARGET_X} y={rowTop} color={color} part={p.loopPart} />}
      {p.pulledLoop && work === 'row' && (
        <g>
          <Yarn d={`M${TARGET_X - 10} ${rowTop + 4} C${TARGET_X - 14} ${rowTop - 30} ${firstLoop[0] - 20} ${firstLoop[1] + 30} ${firstLoop[0] - 6} ${firstLoop[1] + CK.loopRy}`} color={ycol} w={CK.yarnW} />
          <Yarn d={`M${TARGET_X + 10} ${rowTop + 4} C${TARGET_X + 12} ${rowTop - 26} ${firstLoop[0] + 16} ${firstLoop[1] + 30} ${firstLoop[0] + 6} ${firstLoop[1] + CK.loopRy}`} color={ycol} w={CK.yarnW} />
        </g>
      )}
      {fronts}
      {p.yo && <Yarn d={yoFront} color={ycol} w={CK.yarnW} draw={p.yoDraw ? [p.yoDraw[0] + (p.yoDraw[1] - p.yoDraw[0]) * 0.6, p.yoDraw[1]] : undefined} />}
    </g>
  );
  const from = p.hookFrom ? HOOK[p.hookFrom] : null;
  const moved = from ? (
    <Move from={[from.tip[0] - h.tip[0], from.tip[1] - h.tip[1]]} at={p.hookAt ?? [0.08, 0.5]}>
      {hookGroup}
    </Move>
  ) : (
    hookGroup
  );

  return (
    <g>
      {!p.yo && <Yarn d={workYarn} color={ycol} w={CK.yarnW} />}
      {ground}
      {work === 'row' && pose !== 'inserted' && <StitchTop x={TARGET_X} y={rowTop} color={color} part={p.loopPart} />}
      {moved}
      {p.target && <Target c={targetPoint} r={26} />}
      {p.labels?.yarn && <Tag c={[64, 36]} text={p.labels.yarn} anchor="start" />}
      {p.labels?.loops && <Tag c={[firstLoop[0] + 60, firstLoop[1] - 40]} text={p.labels.loops} anchor="start" />}
      {p.extra}
      {p.arrows}
    </g>
  );
}

/* ── Hazır oklar ── */
export const crochetArrows = {
  /** ip at: ip tığın arkasından üstüne, önüne */
  yo: (n = 1) => <Arrow d="M118 84 C150 70 186 100 172 136" n={n} start={[104, 86]} />,
  /** bat: tığ ucu ilmeğin iki halkasının altından */
  insert: (n = 1) => <Arrow d="M118 150 C112 190 124 222 142 240" n={n} start={[112, 136]} />,
  /** ipi çek: ilmeği yukarı, ilmeğin içinden */
  pullUp: (n = 2) => <Arrow d="M168 236 C178 214 176 194 166 176" n={n} start={[176, 252]} />,
  /** n ilmekten geçir: boğazdan gövdeye doğru */
  through: (n = 3) => <Arrow d="M150 128 C178 112 204 104 232 92" n={n} start={[136, 134]} />,
};

