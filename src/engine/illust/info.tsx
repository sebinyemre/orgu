/**
 * Bilgi sahneleri: malzeme panosu, ip etiketi, şiş/tığ numara kartı, ip kalınlıkları.
 * Çizimlerde yalnızca sayılar ve semboller kullanılır; açıklama ders metnindedir (dil bağımsız çizim).
 */
import type { NeedKind } from '@/lessons/types';
import { NeedIcon } from './tools';
import { Badge, Target, Yarn } from './parts';
import { shade } from '@/lib/color';

/** Malzemeler panosu: simgeler ızgarada, istenen biri vurgulu */
export function ToolsBoardScene({ kinds, highlight }: { kinds: NeedKind[]; highlight?: NeedKind[] }) {
  const cols = Math.min(4, kinds.length);
  const rows = Math.ceil(kinds.length / cols);
  const cw = 360 / cols;
  const rh = Math.min(120, 260 / rows);
  return (
    <g>
      {kinds.map((k, i) => {
        const cx = 20 + cw * (i % cols) + cw / 2;
        const cy = 20 + rh * Math.floor(i / cols) + rh / 2 + (300 - 40 - rh * rows) / 2;
        const on = !highlight || highlight.includes(k);
        const size = Math.min(cw, rh) * 0.78;
        return (
          <g key={k} opacity={on ? 1 : 0.28}>
            <rect x={cx - size / 2 - 8} y={cy - size / 2 - 8} width={size + 16} height={size + 16} rx={16} fill="var(--card)" stroke="var(--line)" />
            <g transform={`translate(${cx - size / 2} ${cy - size / 2})`}>
              <NeedIcon kind={k} size={size} />
            </g>
            {highlight?.includes(k) && <Target c={[cx, cy]} r={size * 0.62} />}
          </g>
        );
      })}
    </g>
  );
}

/** İp etiketi (banderol): kalınlık numarası, metre/gram, şiş ve tığ numarası, ölçü örneği, yıkama, lot */
export type LabelPart = 'weight' | 'length' | 'needle' | 'gauge' | 'care' | 'lot' | 'fiber';

export function YarnLabelScene({ highlight }: { highlight?: LabelPart | LabelPart[] }) {
  const hl = (p: LabelPart) => (Array.isArray(highlight) ? highlight.includes(p) : highlight === p);
  const box = (x: number, y: number, w: number, h: number, p: LabelPart) => (
    <rect x={x} y={y} width={w} height={h} rx={10} fill={hl(p) ? 'var(--il-highlight)' : 'transparent'} fillOpacity={0.22} stroke={hl(p) ? 'var(--il-highlight)' : 'transparent'} strokeWidth={3} />
  );
  const ink = 'var(--il-ink)';
  return (
    <g style={{ fontFamily: 'var(--font-body)' }}>
      {/* yumak */}
      <ellipse cx={200} cy={150} rx={180} ry={70} fill="#e0a24a" stroke="#8a5a2b" strokeWidth={2} />
      {Array.from({ length: 14 }, (_, k) => (
        <path key={k} d={`M${30 + k * 26} 92 C${40 + k * 26} 140 ${24 + k * 26} 170 ${36 + k * 26} 212`} stroke="#fff1d6" strokeWidth={3} opacity={0.5} fill="none" />
      ))}
      {/* banderol */}
      <rect x={70} y={70} width={260} height={160} rx={8} fill="#fffaf0" stroke="#b9a68a" strokeWidth={2} />
      {box(80, 80, 70, 70, 'weight')}
      {/* CYC kalınlık simgesi */}
      <g transform="translate(115 115)">
        <path d="M-24 18 C-30 -6 -14 -26 0 -26 C14 -26 30 -6 24 18 Z" fill="#fff" stroke={ink} strokeWidth={2.5} />
        <text y={10} textAnchor="middle" fontSize={26} fontWeight={800} fill={ink}>
          4
        </text>
      </g>
      {box(160, 80, 160, 34, 'fiber')}
      <text x={240} y={103} textAnchor="middle" fontSize={16} fontWeight={800} fill={ink}>
        75% · 25%
      </text>
      {box(160, 116, 160, 34, 'length')}
      <text x={240} y={139} textAnchor="middle" fontSize={17} fontWeight={800} fill={ink}>
        100 g · 200 m
      </text>
      {box(80, 156, 120, 64, 'needle')}
      {/* şiş ve tığ simgesi */}
      <g transform="translate(96 168)">
        <path d="M0 40 L22 0 M8 42 L30 4" stroke="#8a95a0" strokeWidth={4} strokeLinecap="round" />
        <text x={40} y={20} fontSize={14} fontWeight={800} fill={ink}>
          4,5–5
        </text>
        <text x={40} y={40} fontSize={14} fontWeight={800} fill={ink}>
          5–6
        </text>
      </g>
      {box(204, 156, 62, 64, 'gauge')}
      <g transform="translate(212 162)">
        <rect width={46} height={46} fill="none" stroke={ink} strokeWidth={2} />
        <text x={23} y={18} textAnchor="middle" fontSize={11} fontWeight={800} fill={ink}>
          18
        </text>
        <text x={23} y={38} textAnchor="middle" fontSize={11} fontWeight={800} fill={ink}>
          24
        </text>
      </g>
      {box(270, 156, 54, 64, 'care')}
      {/* yıkama simgeleri: el yıkama leğeni, ütü */}
      <g transform="translate(278 166)" stroke={ink} strokeWidth={2} fill="none">
        <path d="M2 14 L6 28 L32 28 L36 14 M0 14 C8 8 14 18 20 12 C26 8 30 16 38 12" />
        <text x={19} y={25} textAnchor="middle" fontSize={11} fontWeight={800} fill={ink} stroke="none">
          30°
        </text>
        <path d="M6 44 L30 44 L28 36 L12 36 Z" />
      </g>
      {/* lot no */}
      <g transform="translate(70 238)">
        <rect width={260} height={30} rx={6} fill="#fffaf0" stroke="#b9a68a" strokeWidth={2} />
        {box(4, 2, 252, 26, 'lot')}
        <text x={130} y={21} textAnchor="middle" fontSize={14} fontWeight={800} fill={ink} letterSpacing={2}>
          LOT 2471 · 1023
        </text>
      </g>
    </g>
  );
}

/** Şiş ölçer kartı ve farklı kalınlıkta şişler */
export function NeedleGaugeScene({ highlight }: { highlight?: number }) {
  const sizes = [2, 3, 4, 5, 6, 8, 10];
  const ink = 'var(--il-ink)';
  return (
    <g style={{ fontFamily: 'var(--font-body)' }}>
      <rect x={30} y={40} width={150} height={220} rx={16} fill="#d39a2c" stroke="#8a5a2b" strokeWidth={2} />
      {sizes.map((s, i) => {
        const cy = 66 + i * 30;
        return (
          <g key={s}>
            <circle cx={70} cy={cy} r={s * 1.25 + 2} fill="var(--il-bg)" stroke="#8a5a2b" strokeWidth={1.5} />
            <text x={110} y={cy + 6} fontSize={16} fontWeight={800} fill={ink}>
              {s}
            </text>
            {highlight === s && <Target c={[70, cy]} r={s * 1.25 + 12} />}
          </g>
        );
      })}
      {sizes.slice(1).map((s, i) => (
        <g key={`n${s}`}>
          <path d={`M${210 + i * 30} 270 L${210 + i * 30} 60`} stroke="#8a95a0" strokeWidth={s * 1.4} strokeLinecap="round" />
          <circle cx={210 + i * 30} cy={270} r={s * 1.1 + 2} fill="#b5523b" stroke={ink} strokeWidth={1} />
          <text x={210 + i * 30} y={44} textAnchor="middle" fontSize={14} fontWeight={800} fill={ink}>
            {s}
          </text>
        </g>
      ))}
    </g>
  );
}

/** 0'dan 7'ye ip kalınlıkları (yan yana ip parçaları) */
export function YarnWeightsScene({ highlight }: { highlight?: number }) {
  const ink = 'var(--il-ink)';
  const colors = ['#e8dcc4', '#f4a7b9', '#87ceeb', '#9fd8cb', '#e0a24a', '#b5523b', '#5f7a61', '#7d4e6d'];
  return (
    <g style={{ fontFamily: 'var(--font-body)' }}>
      {colors.map((c, i) => {
        const y = 40 + i * 32;
        const w = 2 + i * 2.6;
        return (
          <g key={i} opacity={highlight === undefined || highlight === i ? 1 : 0.35}>
            <Badge c={[34, y]} n={i} color={shade(c, -0.35)} />
            <Yarn d={`M60 ${y} C140 ${y - 8} 260 ${y + 8} 370 ${y}`} color={c} w={w} />
          </g>
        );
      })}
      <text x={0} y={0} fill={ink} />
    </g>
  );
}
