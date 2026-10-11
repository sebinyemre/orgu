/**
 * Büyükanne karesi şeması: her tur kendi renginde, üçlü küme ve köşe zincirleriyle.
 */
import type { ReactElement } from 'react';
import { useMsgs } from '@/i18n';
import { R } from '../i18n';

const S = 400;
const C = S / 2;

export function GrannyDiagram({ rounds, colors }: { rounds: number; colors: string[] }) {
  const t = useMsgs(R);
  const n = Math.max(1, rounds);
  const inner = 16;
  const step = (182 - inner) / n;
  const els: ReactElement[] = [];
  for (let k = 1; k <= n; k++) {
    const color = colors[(k - 1) % colors.length] ?? '#b5523b';
    const h = inner + k * step;
    const base = h - step * 0.86;
    const top = h - step * 0.14;
    const sw = Math.max(1.6, Math.min(4, step / 6));
    // dört kenar: dış normal (nx, ny) ve kenar yönü (tx, ty)
    const sides = [
      { nx: 0, ny: -1, tx: 1, ty: 0 },
      { nx: 1, ny: 0, tx: 0, ty: 1 },
      { nx: 0, ny: 1, tx: -1, ty: 0 },
      { nx: -1, ny: 0, tx: 0, ty: -1 },
    ];
    sides.forEach((sd, si) => {
      for (let i = 0; i < k; i++) {
        const along = -h + (2 * h * (i + 0.5)) / k;
        const span = Math.min(step * 0.42, (h / k) * 0.62);
        [-1, 0, 1].forEach((f) => {
          const bx = C + sd.nx * base + sd.tx * (along + f * span * 0.35);
          const by = C + sd.ny * base + sd.ty * (along + f * span * 0.35);
          const ex = C + sd.nx * top + sd.tx * (along + f * span);
          const ey = C + sd.ny * top + sd.ty * (along + f * span);
          els.push(<line key={`u${k}-${si}-${i}-${f}`} x1={bx} y1={by} x2={ex} y2={ey} stroke="var(--ink)" strokeOpacity={0.35} strokeWidth={sw + 1.6} strokeLinecap="round" />);
          els.push(<line key={`l${k}-${si}-${i}-${f}`} x1={bx} y1={by} x2={ex} y2={ey} stroke={color} strokeWidth={sw} strokeLinecap="round" />);
          // trabzan çentiği
          const mx = (bx + ex) / 2 + sd.tx * sw * 0.9;
          const my = (by + ey) / 2 + sd.ty * sw * 0.9;
          els.push(<line key={`n${k}-${si}-${i}-${f}`} x1={(bx + ex) / 2} y1={(by + ey) / 2} x2={mx} y2={my} stroke="var(--ink)" strokeOpacity={0.5} strokeWidth={0.8} />);
        });
      }
      // köşe zinciri (2 halka)
      const cx = C + (sd.nx + sd.tx) * (h - step * 0.5);
      const cy = C + (sd.ny + sd.ty) * (h - step * 0.5);
      const rr = Math.max(2.2, Math.min(5, step / 7));
      els.push(<ellipse key={`c${k}-${si}`} cx={cx} cy={cy} rx={rr * 1.25} ry={rr * 0.75} transform={`rotate(${45 + si * 90} ${cx} ${cy})`} fill="none" stroke="var(--ink-2)" strokeWidth={1} />);
    });
  }
  return (
    <figure className="pv-diagram">
      <svg viewBox={`0 0 ${S} ${S}`} className="pv-diagram-svg" role="img" aria-label={t.grannyCaption(n)}>
        <rect x={C - inner - n * step - 6} y={C - inner - n * step - 6} width={2 * (inner + n * step + 6)} height={2 * (inner + n * step + 6)} rx={8} fill="var(--card-2)" stroke="var(--line-2)" strokeDasharray="4 4" />
        {els}
        <circle cx={C} cy={C} r={inner * 0.55} fill="none" stroke="var(--ink)" strokeWidth={1.4} />
      </svg>
      <figcaption>
        <div className="pv-legend">
          {Array.from({ length: n }, (_, i) => (
            <span key={i} className="pv-legend-item">
              <span className="pv-legend-dot" style={{ background: colors[i % colors.length] }} />
              {t.roundNo(String(i + 1))}
            </span>
          ))}
        </div>
        <span>{t.grannyCaption(n)}</span>
      </figcaption>
    </figure>
  );
}
