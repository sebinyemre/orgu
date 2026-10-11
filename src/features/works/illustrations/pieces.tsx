/**
 * Eser çizimleri: her biri 200 × 160'lık bir sahnede, ip renkleriyle boyanır.
 * Çizgiler hafif titreşimli; dolgular ip rengi, doku çizgileri rengin koyu/açık tonu.
 */
import { useId, type ReactElement } from 'react';
import { shade } from '@/lib/color';
import { jitter, rng, smooth, vStitch, wline, wrect, type P } from './draw';

export interface PieceProps {
  colors: string[];
  variant?: string;
}

const INK = 'var(--ink)';
const OUT = { stroke: INK, strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
const c = (colors: string[], i: number) => colors[i % colors.length] ?? '#b5523b';
const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '');

function Shadow({ cx = 100, cy = 148, rx = 70 }: { cx?: number; cy?: number; rx?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={6} fill={INK} opacity={0.08} />;
}

/* ── Atkı: askıdaki iki kol ─────────────────────────────── */
export function ScarfPiece({ colors, variant = 'garter' }: PieceProps) {
  const id = uid();
  const main = c(colors, 0);
  const band = (x: number, top: number, bottom: number, seed: number) => smooth(jitter([[x, top], [x + 34, top], [x + 35, (top + bottom) / 2], [x + 36, bottom], [x + 1, bottom + 2], [x - 1, (top + bottom) / 2]], 1, seed), true, 0.2);
  const b1 = band(58, 30, 136, 3);
  const b2 = band(96, 30, 122, 7);
  const tex = (clip: string, x: number, top: number, bottom: number, seed: number) => {
    const els: ReactElement[] = [];
    const r = rng(seed);
    if (variant === 'stripes') {
      for (let y = top, i = 0; y < bottom + 4; y += 8, i++) els.push(<rect key={`s${y}`} x={x - 4} y={y} width={46} height={8} fill={c(colors, Math.floor(i / 1))} />);
      for (let y = top + 2; y < bottom; y += 4) els.push(<path key={`d${y}`} d={wline(x, y, x + 36, y, seed + y, 0.6)} stroke={INK} strokeOpacity={0.12} strokeWidth={1} fill="none" />);
    } else if (variant === 'rib') {
      for (let xx = x + 3; xx < x + 36; xx += 5) els.push(<path key={`r${xx}`} d={wline(xx, top, xx + 0.5, bottom + 2, seed + xx, 1.2)} stroke={shade(main, -0.28)} strokeWidth={2.2} fill="none" />);
    } else {
      for (let y = top + 4; y < bottom; y += 5) els.push(<path key={`g${y}`} d={`M${x} ${y} q 4 ${2 + r()} 9 0 t 9 0 t 9 0 t 9 0`} stroke={shade(main, -0.22)} strokeWidth={1.4} fill="none" />);
    }
    return <g clipPath={`url(#${clip})`}>{els}</g>;
  };
  const fringe = (x: number, y: number, seed: number) => {
    const r = rng(seed);
    return Array.from({ length: 7 }, (_, i) => <path key={i} d={wline(x + 3 + i * 5, y, x + 2 + i * 5 + (r() - 0.5) * 3, y + 12 + r() * 4, seed + i, 1.5)} stroke={shade(main, -0.1)} strokeWidth={2.2} strokeLinecap="round" fill="none" />);
  };
  return (
    <>
      <Shadow cy={150} rx={56} />
      <defs>
        <clipPath id={`a${id}`}>
          <path d={b1} />
        </clipPath>
        <clipPath id={`b${id}`}>
          <path d={b2} />
        </clipPath>
      </defs>
      {variant !== 'stripes' && fringe(58, 137, 11)}
      {variant !== 'stripes' && fringe(96, 123, 13)}
      <path d={b1} fill={variant === 'stripes' ? c(colors, 0) : main} />
      {tex(`a${id}`, 58, 30, 136, 21)}
      <path d={b1} fill="none" {...OUT} />
      <path d={b2} fill={variant === 'stripes' ? c(colors, 1) : shade(main, 0.08)} />
      {tex(`b${id}`, 96, 30, 122, 23)}
      <path d={b2} fill="none" {...OUT} />
      {/* askı çubuğu */}
      <path d={wline(30, 28, 170, 30, 5, 1)} stroke="var(--kraft-ink)" strokeWidth={6} strokeLinecap="round" fill="none" />
      <path d={wline(30, 28, 170, 30, 5, 1)} stroke="var(--kraft)" strokeWidth={3} strokeLinecap="round" fill="none" />
    </>
  );
}

/* ── Bere ───────────────────────────────────────────────── */
export function BeaniePiece({ colors, variant = 'rib' }: PieceProps) {
  const id = uid();
  const main = c(colors, 0);
  const brimC = colors.length > 1 ? c(colors, 1) : shade(main, -0.06);
  const dome = smooth(jitter([[42, 112], [46, 70], [70, 40], [100, 32], [130, 40], [154, 70], [158, 112]], 1, 4), false, 0.5) + ' L158 112 L42 112 Z';
  const brim = smooth(wrect(36, 106, 128, 32, 9, 1, 4), true, 0.15);
  const pomp = colors.length > 1 ? c(colors, 1) : shade(main, 0.15);
  const body: ReactElement[] = [];
  if (variant === 'cable') {
    for (let x = 52; x < 152; x += 20) {
      const d = Array.from({ length: 6 }, (_, i) => `M${x - 5} ${44 + i * 12} q 5 6 10 0 M${x + 5} ${44 + i * 12} q -5 6 -10 0`).join(' ');
      body.push(<path key={x} d={d} stroke={shade(main, -0.32)} strokeWidth={2} fill="none" />);
      body.push(<path key={`p${x}`} d={wline(x + 10, 40, x + 10, 112, x, 1)} stroke={shade(main, -0.2)} strokeWidth={1.2} strokeDasharray="1 3" fill="none" />);
    }
  } else if (variant === 'crochet') {
    for (let y = 46; y < 112; y += 8) for (let x = 40; x < 162; x += 7) body.push(<path key={`${x}-${y}`} d={`M${x} ${y + 4} l 0 -5 m -2.5 0 l 5 0`} stroke={shade(main, -0.28)} strokeWidth={1.3} fill="none" />);
  } else {
    for (let x = 48; x < 156; x += 6) body.push(<path key={x} d={wline(x, 34, x + (x - 100) * 0.12, 112, x, 1.2)} stroke={shade(main, -0.25)} strokeWidth={1.8} fill="none" />);
  }
  const brimTex: ReactElement[] = [];
  for (let x = 40; x < 162; x += 5) brimTex.push(<path key={x} d={wline(x, 108, x, 137, x + 3, 0.8)} stroke={shade(brimC, -0.25)} strokeWidth={variant === 'crochet' ? 1.2 : 2} fill="none" />);
  const showPom = variant === 'cable' || variant === 'crochet';
  return (
    <>
      <Shadow cy={146} rx={64} />
      <defs>
        <clipPath id={`d${id}`}>
          <path d={dome} />
        </clipPath>
        <clipPath id={`r${id}`}>
          <path d={brim} />
        </clipPath>
      </defs>
      <path d={dome} fill={main} />
      <g clipPath={`url(#d${id})`}>{body}</g>
      <path d={dome} fill="none" {...OUT} />
      <path d={brim} fill={brimC} />
      <g clipPath={`url(#r${id})`}>{brimTex}</g>
      <path d={brim} fill="none" {...OUT} />
      {showPom && (
        <g>
          <circle cx={100} cy={26} r={17} fill={pomp} />
          {Array.from({ length: 22 }, (_, i) => {
            const a = (i / 22) * Math.PI * 2;
            return <path key={i} d={wline(100 + Math.cos(a) * 8, 26 + Math.sin(a) * 8, 100 + Math.cos(a) * 19, 26 + Math.sin(a) * 19, i, 1.5)} stroke={shade(pomp, -0.25)} strokeWidth={1.4} fill="none" />;
          })}
          <circle cx={100} cy={26} r={17} fill="none" {...OUT} strokeDasharray="3 2" />
        </g>
      )}
    </>
  );
}

/* ── Boyunluk ───────────────────────────────────────────── */
export function CowlPiece({ colors }: PieceProps) {
  const id = uid();
  const main = c(colors, 0);
  const outer = smooth(jitter([[40, 52], [100, 36], [160, 52], [164, 100], [158, 128], [100, 142], [42, 128], [36, 100]], 1, 6), true, 0.45);
  const r = rng(3);
  const dots: ReactElement[] = [];
  for (let y = 62; y < 138; y += 6) for (let x = 40 + ((y / 6) % 2) * 3; x < 164; x += 6) dots.push(<circle key={`${x}-${y}`} cx={x + (r() - 0.5)} cy={y + (r() - 0.5) + Math.abs(x - 100) * -0.12} r={1.2} fill={shade(main, -0.35)} />);
  return (
    <>
      <Shadow cy={148} rx={66} />
      <defs>
        <clipPath id={`c${id}`}>
          <path d={outer} />
        </clipPath>
      </defs>
      <path d={outer} fill={main} />
      <g clipPath={`url(#c${id})`}>{dots}</g>
      <ellipse cx={100} cy={52} rx={58} ry={14} fill={shade(main, -0.3)} stroke={INK} strokeWidth={2} />
      <path d="M48 56 Q100 72 152 56" fill="none" stroke={shade(main, 0.2)} strokeWidth={2} opacity={0.7} />
      <path d={outer} fill="none" {...OUT} />
    </>
  );
}

/* ── Battaniye (dalga ya da büyükanne kareleri) ────────── */
export function BlanketPiece({ colors, variant = 'waves' }: PieceProps) {
  const id = uid();
  const main = c(colors, 0);
  const edge = colors.length > 1 ? c(colors, colors.length - 1) : shade(main, -0.1);
  const outline: P[] = [[24, 34], [176, 26], [182, 116], [150, 134], [30, 138]];
  const shape = smooth(jitter(outline, 1, 8), true, 0.12);
  const inner: ReactElement[] = [];
  if (variant === 'granny') {
    const s = 22;
    for (let gy = 0; gy < 5; gy++)
      for (let gx = 0; gx < 7; gx++) {
        const x = 26 + gx * s;
        const y = 30 + gy * s;
        for (let k = 3; k >= 1; k--) inner.push(<rect key={`${gx}-${gy}-${k}`} x={x + (3 - k) * 3.2} y={y + (3 - k) * 3.2} width={s - (3 - k) * 6.4} height={s - (3 - k) * 6.4} fill={c(colors, (gx + gy + k) % Math.max(1, colors.length - 1))} />);
        inner.push(<rect key={`o${gx}-${gy}`} x={x} y={y} width={s} height={s} fill="none" stroke={edge} strokeWidth={2.2} />);
      }
  } else {
    for (let y = 36; y < 140; y += 9) inner.push(<path key={y} d={`M18 ${y} q 9 -7 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0`} stroke={shade(main, -0.25)} strokeWidth={1.6} fill="none" />);
  }
  const fold = smooth(jitter([[150, 134], [182, 116], [160, 108]], 0.6, 2), true, 0.1);
  return (
    <>
      <Shadow cy={146} rx={76} />
      <defs>
        <clipPath id={`k${id}`}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} fill={main} />
      <g clipPath={`url(#k${id})`}>{inner}</g>
      <path d={shape} fill="none" stroke={edge} strokeWidth={7} strokeLinejoin="round" opacity={0.95} />
      <path d={shape} fill="none" {...OUT} />
      <path d={fold} fill={shade(edge, -0.12)} {...OUT} />
    </>
  );
}

/* ── Amigurumi top ──────────────────────────────────────── */
export function BallPiece({ colors }: PieceProps) {
  const id = uid();
  const a = c(colors, 0);
  const b = colors.length > 1 ? c(colors, 1) : shade(a, -0.15);
  const cx = 100;
  const cy = 82;
  const R = 56;
  const bands: ReactElement[] = [];
  for (let i = -4; i <= 4; i++) bands.push(<ellipse key={i} cx={cx} cy={cy + i * 14} rx={R * 1.2} ry={9} fill={i % 2 === 0 ? a : b} transform={`rotate(-12 ${cx} ${cy})`} />);
  const stitches: ReactElement[] = [];
  for (let i = -3; i <= 3; i++) for (let k = -5; k <= 5; k++) stitches.push(<path key={`${i}-${k}`} d={vStitch(cx + k * 10 + i * 2, cy + i * 14, 6, 6)} stroke={INK} strokeOpacity={0.18} strokeWidth={1} fill="none" />);
  return (
    <>
      <Shadow cy={146} rx={50} />
      <defs>
        <clipPath id={`o${id}`}>
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
        <radialGradient id={`h${id}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#o${id})`}>
        <rect x={0} y={0} width={200} height={160} fill={a} />
        {bands}
        {stitches}
      </g>
      <circle cx={cx} cy={cy} r={R} fill={`url(#h${id})`} />
      <path d={smooth(jitter(Array.from({ length: 14 }, (_, i): P => [cx + Math.cos((i / 14) * Math.PI * 2) * R, cy + Math.sin((i / 14) * Math.PI * 2) * R]), 0.8, 5), true, 0.55)} fill="none" {...OUT} />
    </>
  );
}

/* ── Bardak altlıkları ─────────────────────────────────── */
export function CoastersPiece({ colors }: PieceProps) {
  const disc = (cx: number, cy: number, rot: number, k: number) => {
    const rings: ReactElement[] = [];
    const n = 4;
    for (let i = n; i >= 1; i--) rings.push(<circle key={i} cx={cx} cy={cy} r={(i * 34) / n} fill={c(colors, (i - 1 + k) % colors.length)} />);
    for (let i = 1; i <= n; i++) rings.push(<circle key={`l${i}`} cx={cx} cy={cy} r={(i * 34) / n - 1.5} fill="none" stroke={INK} strokeOpacity={0.18} strokeDasharray="2.5 2.5" />);
    return (
      <g key={k} transform={`rotate(${rot} ${cx} ${cy})`}>
        <ellipse cx={cx + 2} cy={cy + 4} rx={35} ry={35} fill={INK} opacity={0.07} />
        {rings}
        <circle cx={cx} cy={cy} r={34} fill="none" {...OUT} />
      </g>
    );
  };
  return (
    <>
      {disc(68, 92, -8, 2)}
      {disc(132, 98, 10, 1)}
      {disc(100, 62, 0, 0)}
    </>
  );
}

/* ── Büyükanne karesi ───────────────────────────────────── */
export function GrannyPiece({ colors }: PieceProps) {
  const n = 4;
  const cx = 100;
  const cy = 80;
  const els: ReactElement[] = [];
  els.push(<rect key="bg" x={cx - 62} y={cy - 62} width={124} height={124} rx={6} fill={c(colors, n - 1)} transform={`rotate(-6 ${cx} ${cy})`} />);
  for (let k = n; k >= 1; k--) {
    const h = 10 + k * 13;
    const col = c(colors, k - 1);
    els.push(<rect key={`r${k}`} x={cx - h} y={cy - h} width={2 * h} height={2 * h} rx={3} fill={col} transform={`rotate(-6 ${cx} ${cy})`} />);
    // kümeler
    for (let s = 0; s < 4; s++) {
      for (let i = 0; i < k; i++) {
        const along = -h + (2 * h * (i + 0.5)) / k;
        const pos = [
          [cx + along, cy - h + 6],
          [cx + h - 6, cy + along],
          [cx - along, cy + h - 6],
          [cx - h + 6, cy - along],
        ][s];
        els.push(<circle key={`c${k}-${s}-${i}`} cx={pos[0]} cy={pos[1]} r={2.6} fill={shade(col, -0.3)} transform={`rotate(-6 ${cx} ${cy})`} />);
      }
    }
  }
  return (
    <>
      <Shadow cy={148} rx={60} />
      {els}
      <rect x={cx - 62} y={cy - 62} width={124} height={124} rx={6} fill="none" {...OUT} transform={`rotate(-6 ${cx} ${cy})`} />
    </>
  );
}

/* ── Bulaşık bezi ───────────────────────────────────────── */
export function DishclothPiece({ colors }: PieceProps) {
  const id = uid();
  const main = c(colors, 0);
  const edge = colors.length > 1 ? c(colors, 1) : shade(main, -0.1);
  const sq = smooth(wrect(44, 22, 112, 112, 12, 1.2, 4), true, 0.15);
  const dots: ReactElement[] = [];
  for (let y = 34; y < 124; y += 5) for (let x = 56 + ((y / 5) % 2) * 2.5; x < 146; x += 5) dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={1.1} fill={shade(main, -0.35)} />);
  return (
    <>
      <Shadow cy={146} rx={60} />
      <g transform="rotate(5 100 78)">
        <defs>
          <clipPath id={`q${id}`}>
            <path d={sq} />
          </clipPath>
        </defs>
        <path d={sq} fill={edge} />
        <rect x={53} y={31} width={94} height={94} fill={main} />
        <g clipPath={`url(#q${id})`}>{dots}</g>
        <path d={sq} fill="none" {...OUT} />
        <path d="M150 20 q 12 -14 2 -18 q -10 -2 -8 14" fill="none" stroke={edge} strokeWidth={3} strokeLinecap="round" />
      </g>
    </>
  );
}

/* ── Bebek patiği ───────────────────────────────────────── */
export function BootiesPiece({ colors }: PieceProps) {
  const main = c(colors, 0);
  const cuff = colors.length > 1 ? c(colors, 1) : shade(main, 0.2);
  const one = (dx: number, dy: number, seed: number) => {
    const foot = smooth(jitter([[dx + 6, dy + 70], [dx + 4, dy + 44], [dx + 20, dy + 36], [dx + 44, dy + 40], [dx + 72, dy + 48], [dx + 84, dy + 62], [dx + 76, dy + 74], [dx + 40, dy + 76]], 0.8, seed), true, 0.5);
    const cuffP = smooth(wrect(dx + 6, dy + 10, 36, 32, seed + 3, 0.8, 3), true, 0.2);
    const ridges = Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${dx + 8} ${dy + 48 + i * 5} q 34 ${4 - i * 0.4} 70 ${8 - i * 1.2}`} stroke={shade(main, -0.22)} strokeWidth={1.3} fill="none" />);
    const ribs = Array.from({ length: 7 }, (_, i) => <path key={i} d={wline(dx + 10 + i * 5, dy + 13, dx + 10 + i * 5, dy + 40, seed + i, 0.6)} stroke={shade(cuff, -0.25)} strokeWidth={1.8} fill="none" />);
    return (
      <g key={seed}>
        <path d={foot} fill={main} />
        {ridges}
        <path d={foot} fill="none" {...OUT} />
        <path d={cuffP} fill={cuff} />
        {ribs}
        <path d={cuffP} fill="none" {...OUT} />
      </g>
    );
  };
  return (
    <>
      <Shadow cy={140} rx={78} />
      {one(18, 50, 3)}
      {one(98, 58, 9)}
    </>
  );
}

/* ── File çanta ─────────────────────────────────────────── */
export function BagPiece({ colors }: PieceProps) {
  const id = uid();
  const main = c(colors, 0);
  const band = colors.length > 1 ? c(colors, 1) : shade(main, -0.15);
  const body = smooth(jitter([[58, 56], [142, 56], [156, 92], [150, 130], [100, 142], [50, 130], [44, 92]], 0.8, 4), true, 0.4);
  const mesh: ReactElement[] = [];
  for (let k = -12; k < 16; k++) {
    mesh.push(<path key={`a${k}`} d={`M${40 + k * 10} 56 l 60 90`} stroke={main} strokeWidth={2.4} fill="none" />);
    mesh.push(<path key={`b${k}`} d={`M${40 + k * 10} 56 l -60 90`} stroke={main} strokeWidth={2.4} fill="none" />);
  }
  return (
    <>
      <Shadow cy={148} rx={58} />
      <defs>
        <clipPath id={`m${id}`}>
          <path d={body} />
        </clipPath>
      </defs>
      {/* içindeki portakal ve elma */}
      <circle cx={84} cy={108} r={17} fill="#e9963f" />
      <circle cx={114} cy={114} r={15} fill="#9bb55a" />
      <circle cx={104} cy={90} r={14} fill="#e97c6a" />
      <path d={body} fill={main} fillOpacity={0.12} />
      <g clipPath={`url(#m${id})`}>{mesh}</g>
      <path d={body} fill="none" {...OUT} strokeOpacity={0.55} />
      {/* saplar */}
      <path d="M70 52 C 66 14, 98 10, 96 50" fill="none" stroke={band} strokeWidth={6} strokeLinecap="round" />
      <path d="M104 50 C 104 10, 136 14, 130 52" fill="none" stroke={band} strokeWidth={6} strokeLinecap="round" />
      <path d={smooth(wrect(54, 48, 92, 12, 3, 0.8, 3), true, 0.2)} fill={band} {...OUT} />
    </>
  );
}

/* ── Kulaklık bant ──────────────────────────────────────── */
export function HeadbandPiece({ colors }: PieceProps) {
  const id = uid();
  const main = c(colors, 0);
  const strip = colors.length > 1 ? c(colors, 1) : shade(main, -0.12);
  const cx = 100;
  const cy = 78;
  // halka: dış ve iç elips; ön ortada büzgüyle daralır
  const ring = (rx: number, ry: number, pinch: number) =>
    Array.from({ length: 36 }, (_, i): P => {
      const a = (i / 36) * Math.PI * 2;
      const front = Math.max(0, Math.sin(a));
      const near = Math.exp(-Math.pow((a - Math.PI / 2) / 0.32, 2));
      return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry * (1 - pinch * near) + front * 0];
    });
  const outer = smooth(jitter(ring(74, 46, 0.18), 0.6, 3), true, 0.5);
  const inner = smooth(jitter(ring(56, 26, -0.35), 0.5, 5), true, 0.5);
  const ribs: ReactElement[] = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * 58;
    const y1 = cy + Math.sin(a) * 28;
    const x2 = cx + Math.cos(a) * 72;
    const y2 = cy + Math.sin(a) * 44;
    ribs.push(<path key={i} d={wline(x1, y1, x2, y2, i, 0.5)} stroke={shade(main, Math.sin(a) < 0 ? -0.4 : -0.25)} strokeWidth={1.8} fill="none" />);
  }
  return (
    <>
      <Shadow cy={140} rx={70} />
      <defs>
        <mask id={`h${id}`}>
          <rect x={0} y={0} width={200} height={160} fill="#fff" />
          <path d={inner} fill="#000" />
        </mask>
        <clipPath id={`o${id}`}>
          <path d={outer} />
        </clipPath>
      </defs>
      <g mask={`url(#h${id})`} clipPath={`url(#o${id})`}>
        <path d={outer} fill={main} />
        <path d={`M${cx - 80} ${cy} H${cx + 80} V${cy - 60} H${cx - 80} Z`} fill={INK} opacity={0.12} />
        {ribs}
      </g>
      <path d={outer} fill="none" {...OUT} />
      <path d={inner} fill="none" {...OUT} />
      <path d={smooth(wrect(cx - 11, cy + 22, 22, 28, 5, 0.6, 2), true, 0.2)} fill={strip} {...OUT} />
      <path d={`M${cx - 7} ${cy + 28} h 14 M${cx - 7} ${cy + 36} h 14 M${cx - 7} ${cy + 44} h 14`} stroke={shade(strip, -0.3)} strokeWidth={1.4} />
    </>
  );
}
