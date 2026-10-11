/** Malzeme simgeleri (ihtiyaç listesi ve malzeme dersleri için küçük çizimler) */
import type { NeedKind } from '@/lessons/types';

const S = 'var(--ink)';

function Svg({ children, size = 44 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden fill="none" stroke={S} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function NeedIcon({ kind, size }: { kind: NeedKind; size?: number }) {
  switch (kind) {
    case 'yarn':
      return (
        <Svg size={size}>
          <circle cx="22" cy="24" r="15" fill="#e0a24a" />
          <path d="M9 18c8-4 18-4 26 2M8 26c9-5 20-5 28 1M11 33c7-3 16-3 22 0" stroke="#fff5e6" />
          <path d="M33 34c4 3 8 3 11 0" stroke="#e0a24a" strokeWidth={2.5} />
        </Svg>
      );
    case 'needles':
      return (
        <Svg size={size}>
          <path d="M8 40 L38 8" stroke="#8a95a0" strokeWidth={4} />
          <path d="M14 42 L42 12" stroke="#8a95a0" strokeWidth={4} />
          <circle cx="8" cy="40" r="3.5" fill="#b5523b" stroke={S} />
          <circle cx="14" cy="42" r="3.5" fill="#b5523b" stroke={S} />
        </Svg>
      );
    case 'circular':
      return (
        <Svg size={size}>
          <path d="M10 14 L20 24" stroke="#8a95a0" strokeWidth={4} />
          <path d="M38 14 L28 24" stroke="#8a95a0" strokeWidth={4} />
          <path d="M20 24 C20 44 28 44 28 24" stroke="#5f7a61" strokeWidth={2.5} />
        </Svg>
      );
    case 'dpn':
      return (
        <Svg size={size}>
          {[8, 16, 24, 32].map((x) => (
            <path key={x} d={`M${x} 40 L${x + 8} 8`} stroke="#8a95a0" strokeWidth={3} />
          ))}
        </Svg>
      );
    case 'hook':
      return (
        <Svg size={size}>
          <path d="M12 38 L36 10" stroke="#5aa6a0" strokeWidth={5} />
          <path d="M34 12 c3-4 6-2 4 1" stroke={S} strokeWidth={2} />
          <path d="M18 31 L24 24" stroke="#2f716c" strokeWidth={7} />
        </Svg>
      );
    case 'scissors':
      return (
        <Svg size={size}>
          <circle cx="12" cy="34" r="6" />
          <circle cx="26" cy="38" r="6" />
          <path d="M16 30 L38 8 M22 33 L40 14" />
        </Svg>
      );
    case 'tapestry':
      return (
        <Svg size={size}>
          <path d="M10 40 L38 10" strokeWidth={3} stroke="#8a95a0" />
          <ellipse cx="35" cy="13" rx="2" ry="4" transform="rotate(45 35 13)" />
          <path d="M35 13 C42 20 30 30 24 40" stroke="#b5523b" strokeWidth={2} />
        </Svg>
      );
    case 'markers':
      return (
        <Svg size={size}>
          <circle cx="14" cy="16" r="6" stroke="#b5523b" strokeWidth={3} />
          <circle cx="32" cy="18" r="6" stroke="#46698a" strokeWidth={3} />
          <path d="M18 32 a6 6 0 1 0 12 0 l-6 -8z" stroke="#d39a2c" strokeWidth={3} />
        </Svg>
      );
    case 'tape':
      return (
        <Svg size={size}>
          <rect x="6" y="12" width="26" height="26" rx="6" fill="#d39a2c" />
          <circle cx="19" cy="25" r="5" fill="#fff5e6" />
          <path d="M32 30 L44 30 L44 36 L32 36" fill="#f2c84b" />
          <path d="M36 30 v3 M40 30 v3" />
        </Svg>
      );
    case 'stuffing':
      return (
        <Svg size={size}>
          <path d="M10 30 c-4-8 6-14 10-8 c2-8 14-8 14 0 c8-2 10 8 4 12 c2 6-8 8-12 4 c-4 4-14 2-12-4 c-6 0-8-6-4-4z" fill="#fffdf8" />
        </Svg>
      );
    case 'cable':
      return (
        <Svg size={size}>
          <path d="M8 36 C16 36 16 14 24 14 C32 14 32 36 40 36" stroke="#8a95a0" strokeWidth={4} />
        </Svg>
      );
    case 'counter':
      return (
        <Svg size={size}>
          <rect x="10" y="10" width="28" height="28" rx="8" fill="#e6dacb" />
          <rect x="15" y="18" width="18" height="10" rx="2" fill="#fffdf8" />
          <path d="M19 23 h2 M24 23 h2 M29 23 h1" />
        </Svg>
      );
  }
}
