/**
 * Yuvarlak tur şeması: her tur bir halka, her ilmek sembolüyle çizilir.
 * Artırmalar kiremit, eksiltmeler mürdüm renginde vurgulanır; tur numaraları üstteki boşlukta.
 */
import type { PatternDiagram } from '@/types';
import { SYMBOL_BY_ID, glyphOf, symbolName } from '@/knowledge/symbols';
import { useTerms } from '@/ui/Term';
import { useMsgs } from '@/i18n';
import { R } from '../i18n';

type Rounds = Extract<PatternDiagram, { kind: 'rounds' }>;

const SIZE = 400;
const C = SIZE / 2;
const GAP_DEG = 14;

function annulus(r1: number, r2: number): string {
  const a = (r: number) => `M ${C - r} ${C} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  return `${a(r2)} ${a(r1)}`;
}

function Glyph({ id, x, y, deg, size, ink, sw, craft }: { id: string; x: number; y: number; deg: number; size: number; ink: string; sw: number; craft: 'knit' | 'crochet' }) {
  const sym = SYMBOL_BY_ID[id];
  if (!sym) return null;
  // şişte düz ilmek CYC'de boş kare; şemada Japon tarzı dikey çizgiyle göster
  const g = glyphOf(sym, craft === 'knit' && id === 'k' ? 'jis' : 'cyc');
  const t = `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg.toFixed(2)}) scale(${(size / 100).toFixed(4)}) translate(-50 -50)`;
  return (
    <g transform={t}>
      {g.d && <path d={g.d} fill="none" stroke={ink} strokeWidth={sw} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />}
      {g.fd && <path d={g.fd} fill={ink} />}
    </g>
  );
}

export function RoundsDiagram({ d }: { d: Rounds }) {
  const t = useMsgs(R);
  const terms = useTerms();
  const n = d.rounds.length;
  if (!n) return null;
  const R0 = n > 14 ? 12 : 20;
  const Rmax = 188;
  const dr = (Rmax - R0) / n;
  const showEvery = n > 14 ? 5 : dr < 11 ? 2 : 1;
  const incInk = 'var(--terracotta)';
  const decInk = 'var(--plum)';
  const decId = d.craft === 'knit' ? 'k2tog' : 'sc2tog';
  const baseId = d.rounds[0].symbol ?? (d.craft === 'knit' ? 'k' : 'sc');
  const hasInc = d.rounds.some((r) => r.incPositions?.length);
  const hasDec = d.rounds.some((r) => r.decPositions?.length);
  const baseSym = SYMBOL_BY_ID[baseId];

  return (
    <figure className="pv-diagram">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="pv-diagram-svg" role="img" aria-label={d.craft === 'knit' ? t.crownCaption : t.roundsCaption}>
        {d.rounds.map((r, i) => {
          const r1 = R0 + i * dr;
          return r.color ? <path key={`b${i}`} d={annulus(r1 + 0.6, r1 + dr - 0.6)} fill={r.color} fillOpacity={0.24} fillRule="evenodd" /> : null;
        })}
        {d.rounds.map((_, i) => (
          <circle key={`c${i}`} cx={C} cy={C} r={R0 + (i + 1) * dr} fill="none" stroke="var(--line-2)" strokeWidth={0.6} />
        ))}
        {/* tur başı çizgisi */}
        <line x1={C} y1={C - R0} x2={C} y2={C - Rmax} stroke="var(--ink-3)" strokeWidth={0.8} strokeDasharray="2 3" />
        {d.rounds.map((r, i) => {
          const rMid = R0 + (i + 0.5) * dr;
          const span = 360 - GAP_DEG;
          const arc = ((2 * Math.PI * rMid) / r.stitches) * (span / 360);
          const size = Math.max(4, Math.min(dr * 0.86, arc * 1.08));
          const sw = Math.max(0.7, Math.min(1.7, size / 10));
          const inc = new Set(r.incPositions ?? []);
          const dec = new Set(r.decPositions ?? []);
          return (
            <g key={`r${i}`}>
              {Array.from({ length: r.stitches }, (_, j) => {
                const deg = -90 + GAP_DEG / 2 + (span * (j + 0.5)) / r.stitches;
                const rad = (deg * Math.PI) / 180;
                const x = C + rMid * Math.cos(rad);
                const y = C + rMid * Math.sin(rad);
                const isDec = dec.has(j);
                const id = isDec ? decId : (r.symbol ?? baseId);
                const ink = isDec ? decInk : inc.has(j) ? incInk : 'var(--ink)';
                return <Glyph key={j} id={id} x={x} y={y} deg={deg + 90} size={size} ink={ink} sw={isDec ? sw * 1.8 : inc.has(j) ? sw * 1.35 : sw} craft={d.craft} />;
              })}
            </g>
          );
        })}
        {d.rounds.map((r, i) =>
          (i + 1) % showEvery === 0 || i === n - 1 || (i === 0 && showEvery < 5) ? (
            <g key={`l${i}`}>
              <circle cx={C} cy={C - (R0 + (i + 0.5) * dr)} r={Math.min(7.5, dr * 0.48 + 1.5)} fill="var(--card)" stroke="var(--line-2)" strokeWidth={0.6} />
              <text x={C} y={C - (R0 + (i + 0.5) * dr)} textAnchor="middle" dominantBaseline="central" fontSize={Math.min(9, dr * 0.62 + 2)} fontWeight={700} fill="var(--ink-2)">
                {r.label ?? i + 1}
              </text>
            </g>
          ) : null,
        )}
        {d.craft === 'crochet' ? (
          <circle cx={C} cy={C} r={R0 * 0.55} fill="none" stroke="var(--ink)" strokeWidth={1.4} />
        ) : (
          <circle cx={C} cy={C} r={2.5} fill="var(--ink)" />
        )}
        {d.centerLabel && (
          <text x={C} y={C} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="var(--ink-2)">
            {d.centerLabel}
          </text>
        )}
      </svg>
      <figcaption>
        <div className="pv-legend">
          {baseSym && (
            <span className="pv-legend-item">
              <svg width="18" height="18" viewBox="0 0 100 100" aria-hidden>
                <Glyph id={baseId} x={50} y={50} deg={0} size={100} ink="var(--ink)" sw={1.6} craft={d.craft} />
              </svg>
              {symbolName(baseSym, terms.ctx)}
            </span>
          )}
          {hasInc && (
            <span className="pv-legend-item">
              <span className="pv-legend-dot" style={{ background: 'var(--terracotta)' }} />
              {t.legendInc}
            </span>
          )}
          {hasDec && (
            <span className="pv-legend-item">
              <svg width="18" height="18" viewBox="0 0 100 100" aria-hidden>
                <Glyph id={decId} x={50} y={50} deg={0} size={100} ink="var(--plum)" sw={1.6} craft={d.craft} />
              </svg>
              {t.legendDec}
            </span>
          )}
        </div>
        <span>{d.craft === 'knit' ? t.crownCaption : t.roundsCaption}</span>
      </figcaption>
    </figure>
  );
}
