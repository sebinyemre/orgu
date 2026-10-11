/**
 * Sayaç yüzleri: mekanik (dönen rakam), çentik (kurşun kalem), boncuk (abaküs), yumak (ip izi).
 * Hepsi yalnızca görseldir (aria-hidden); erişilebilir ad, onları saran düğmededir.
 */
import { Fragment, useId, useState } from 'react';
import type { CounterStyle } from '@/types';
import { shade } from '@/lib/color';
import { fmt } from '@/lib/format';
import { abacusDigits, digitCount, jitter, ringProgress, tallyWindow } from './counterMath';

export type FaceSize = 'sm' | 'md' | 'lg' | 'xl';

interface FaceProps {
  value: number;
  target?: number;
  size: FaceSize;
  /** ip rengi (yumak ve vurgu). Verilmezse vurgu rengi. */
  color?: string;
}

/* ── Mekanik: dönen rakamlar ───────────────────────────── */

function FlipDigit({ d }: { d: string }) {
  const [s, setS] = useState({ cur: d, prev: d, n: 0 });
  if (s.cur !== d) setS({ cur: d, prev: s.cur, n: s.n + 1 });
  const flipping = s.n > 0 && s.prev !== s.cur;
  return (
    <span className="cnt-flip">
      <span className="cnt-half cnt-top">
        <span>{s.cur}</span>
      </span>
      <span className="cnt-half cnt-bot">
        <span>{flipping ? s.prev : s.cur}</span>
      </span>
      {flipping && (
        <Fragment key={s.n}>
          <span className="cnt-half cnt-top cnt-flap-top">
            <span>{s.prev}</span>
          </span>
          <span className="cnt-half cnt-bot cnt-flap-bot">
            <span>{s.cur}</span>
          </span>
        </Fragment>
      )}
    </span>
  );
}

export function MechanicalFace({ value, size }: FaceProps) {
  const n = digitCount(value);
  const str = String(Math.max(0, Math.floor(value))).padStart(n, '0');
  return (
    <span className={`cnt-mech cnt-mech-${size}`} aria-hidden>
      <span className="cnt-mech-knob" />
      <span className="cnt-mech-body">
        <span className="cnt-mech-window">
          {str.split('').map((d, i) => (
            <FlipDigit key={n - i} d={d} />
          ))}
        </span>
        {size !== 'sm' && <span className="cnt-mech-screw" />}
      </span>
    </span>
  );
}

/* ── Çentik: beşerli kurşun kalem çizgileri ────────────── */

const TALLY_LAYOUT: Record<FaceSize, { perRow: number; rows: number }> = {
  sm: { perRow: 4, rows: 1 },
  md: { perRow: 5, rows: 2 },
  lg: { perRow: 5, rows: 4 },
  xl: { perRow: 5, rows: 4 },
};

export function TallyFace({ value, size }: FaceProps) {
  const { perRow, rows } = TALLY_LAYOUT[size];
  const cap = perRow * rows * 5;
  const { shown, hidden } = tallyWindow(value, cap);
  const W = 16 + perRow * 58;
  const H = 10 + rows * 50;
  const marks = [];
  for (let i = 0; i < shown; i++) {
    const g = Math.floor(i / 5);
    const k = i % 5;
    const x0 = 22 + (g % perRow) * 58;
    const y0 = 6 + Math.floor(g / perRow) * 50;
    const j1 = jitter(i, 1);
    const j2 = jitter(i, 2);
    const j3 = jitter(i, 3);
    let d: string;
    if (k < 4) {
      const x = x0 + 4 + k * 10 + j1 * 1.4;
      d = `M${x} ${y0 + 6 + j2 * 2}Q${x + j3 * 2.2} ${y0 + 22} ${x + j1 * 1.6} ${y0 + 40 + j3 * 1.5}`;
    } else {
      d = `M${x0 - 3} ${y0 + 33 + j2 * 2}Q${x0 + 20} ${y0 + 23 + j3 * 3} ${x0 + 42} ${y0 + 9 + j1 * 2}`;
    }
    marks.push(<path key={i} d={d} pathLength={1} className="cnt-mark" />);
  }
  return (
    <span className={`cnt-tally cnt-tally-${size}`} aria-hidden>
      <span className="cnt-tally-num">{fmt(value, 0)}</span>
      <span className="cnt-paper">
        <svg viewBox={`0 0 ${W} ${H}`} className="cnt-tally-svg">
          {Array.from({ length: rows }, (_, r) => (
            <line key={r} x1="0" x2={W} y1={6 + r * 50 + 46} y2={6 + r * 50 + 46} className="cnt-tally-rule" />
          ))}
          <line x1="12" x2="12" y1="0" y2={H} className="cnt-tally-margin" />
          {marks}
        </svg>
        {hidden > 0 && <span className="cnt-tally-hidden">+{fmt(hidden, 0)}</span>}
      </span>
    </span>
  );
}

/* ── Boncuk: abaküs (birler, onlar, yüzler) ────────────── */

const BEAD_ROWS: Record<FaceSize, number> = { sm: 2, md: 3, lg: 3, xl: 3 };
const ROW_TONES = ['var(--terracotta)', 'var(--mustard)', 'var(--sage)'];

export function BeadFace({ value, size }: FaceProps) {
  const rows = BEAD_ROWS[size];
  const { digits } = abacusDigits(value, rows);
  const L = 30;
  const R = 262;
  const H = 12 + rows * 26;
  return (
    <span className={`cnt-beads cnt-beads-${size}`} aria-hidden>
      <svg viewBox={`0 0 ${R + 10} ${H}`} className="cnt-beads-svg">
        <rect x="1" y="1" width={R + 8} height={H - 2} rx="9" className="cnt-beads-frame" />
        {digits
          .map((d, place) => ({ d, place }))
          .reverse()
          .map(({ d, place }, row) => {
            const y = 14 + row * 26;
            const tone = ROW_TONES[place % ROW_TONES.length];
            return (
              <g key={place}>
                <text x="16" y={y + 4} className="cnt-beads-place" textAnchor="middle">
                  {10 ** place}
                </text>
                <line x1={L} x2={R} y1={y} y2={y} className="cnt-beads-wire" />
                {Array.from({ length: 10 }, (_, i) => {
                  const x = i < d ? L + 9 + i * 17 : R - 9 - (9 - i) * 17;
                  return (
                    <g key={i} className="cnt-bead" style={{ transform: `translateX(${x}px)` }}>
                      <circle cx="0" cy={y} r="8" fill={i < 5 ? tone : `color-mix(in srgb, ${tone} 55%, var(--card))`} />
                      <circle cx="-2.6" cy={y - 2.8} r="2.2" className="cnt-bead-shine" />
                    </g>
                  );
                })}
              </g>
            );
          })}
      </svg>
      <span className="cnt-beads-num">{fmt(value, 0)}</span>
    </span>
  );
}

/* ── Yumak: hedefe doğru ip izi bırakan yumak ──────────── */

export function YarnFace({ value, target, size, color }: FaceProps) {
  const id = useId().replace(/:/g, '');
  const p = ringProgress(value, target);
  const hex = color && color.startsWith('#') ? color : undefined;
  const yarn = color ?? 'var(--accent)';
  const light = hex ? shade(hex, 0.35) : 'color-mix(in srgb, var(--accent) 55%, white)';
  const dark = hex ? shade(hex, -0.25) : 'color-mix(in srgb, var(--accent) 70%, black)';
  const off = 100 * (1 - p);
  return (
    <span className={`cnt-yarn cnt-yarn-${size}`} aria-hidden>
      <svg viewBox="0 0 120 120" className="cnt-yarn-svg">
        <defs>
          <mask id={`m${id}`}>
            <circle
              cx="60"
              cy="60"
              r="46"
              pathLength={100}
              fill="none"
              stroke="white"
              strokeWidth="11"
              strokeDasharray="100"
              className="cnt-yarn-arc"
              style={{ strokeDashoffset: off }}
              transform="rotate(-90 60 60)"
            />
          </mask>
          <radialGradient id={`g${id}`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor={light} />
            <stop offset="0.6" stopColor={yarn} />
            <stop offset="1" stopColor={dark} />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="46" className="cnt-yarn-track" />
        <circle cx="60" cy="60" r="46" className="cnt-yarn-seam" />
        <circle
          cx="60"
          cy="60"
          r="46"
          pathLength={100}
          fill="none"
          stroke={yarn}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="100"
          className="cnt-yarn-arc"
          style={{ strokeDashoffset: off }}
          transform="rotate(-90 60 60)"
        />
        <circle cx="60" cy="60" r="46" pathLength={100} fill="none" stroke={light} strokeWidth="9" strokeDasharray="0.7 1.5" mask={`url(#m${id})`} opacity="0.7" />
        <g className="cnt-yarn-ball" style={{ transform: `rotate(${p * 360}deg)` }}>
          <g transform="translate(60 14)">
            <circle r="10.5" fill={`url(#g${id})`} />
            <g fill="none" stroke={light} strokeWidth="1.3" opacity="0.8" strokeLinecap="round">
              <path d="M-9 -3 Q0 -9 9 -4" />
              <path d="M-10 2 Q0 -4 10 1" />
              <path d="M-8 7 Q0 1 8 6" />
            </g>
            <circle r="10.5" fill="none" stroke={dark} strokeOpacity="0.35" />
          </g>
        </g>
      </svg>
      <span className="cnt-yarn-center">
        <span className="cnt-yarn-num">{fmt(value, 0)}</span>
        {target ? <span className="cnt-yarn-target">/ {fmt(target, 0)}</span> : null}
      </span>
    </span>
  );
}

export function CounterFace({ style, ...p }: FaceProps & { style: CounterStyle }) {
  switch (style) {
    case 'centik':
      return <TallyFace {...p} />;
    case 'boncuk':
      return <BeadFace {...p} />;
    case 'yumak':
      return <YarnFace {...p} />;
    default:
      return <MechanicalFace {...p} />;
  }
}
