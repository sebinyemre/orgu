import { useId } from 'react';
import { shade } from '@/lib/color';

interface Props {
  color: string;
  size?: number;
  /** sarkan ip ucu */
  tail?: boolean;
  /** 0–1: yumağın ne kadarı kaldı (küçülür) */
  amount?: number;
  title?: string;
  className?: string;
}

/** Her renkte çizilebilen ip yumağı illüstrasyonu */
export function YarnBall({ color, size = 48, tail = true, amount = 1, title, className }: Props) {
  const id = useId().replace(/:/g, '');
  const r = 16 + 10 * Math.max(0.15, Math.min(1, amount));
  const light = shade(color, 0.32);
  const dark = shade(color, -0.25);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <clipPath id={`b${id}`}>
          <circle cx="30" cy="34" r={r} />
        </clipPath>
        <radialGradient id={`g${id}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      {tail && <path d={`M${30 + r * 0.7} ${34 + r * 0.6} c6 4 12 6 22 2`} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />}
      <circle cx="30" cy="34" r={r} fill={`url(#g${id})`} />
      <g clipPath={`url(#b${id})`} fill="none" strokeLinecap="round" strokeWidth="1.6">
        <g stroke={light} opacity="0.75" transform="rotate(-28 30 34)">
          <ellipse cx="30" cy="34" rx={r * 1.4} ry={r * 0.28} />
          <ellipse cx="30" cy="34" rx={r * 1.4} ry={r * 0.55} />
          <ellipse cx="30" cy="34" rx={r * 1.4} ry={r * 0.82} />
        </g>
        <g stroke={dark} opacity="0.55" transform="rotate(62 30 34)">
          <ellipse cx="30" cy="34" rx={r * 1.3} ry={r * 0.22} />
          <ellipse cx="30" cy="34" rx={r * 1.3} ry={r * 0.5} />
          <ellipse cx="30" cy="34" rx={r * 1.3} ry={r * 0.78} />
        </g>
      </g>
      <circle cx="30" cy="34" r={r} fill="none" stroke={dark} strokeOpacity="0.35" />
    </svg>
  );
}
