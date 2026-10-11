/** Hesaplayıcıların küçük çizimleri: cetvel, ilmek haritası, daire turları, WPI çizimi, kalınlık cetveli */
import { useLang } from '@/i18n';
import { fmt } from '@/lib/format';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import type { Group } from '@/engine/math/distribute';
import type { YarnWeightId } from '@/types';
import { toUnit } from './logic';
import { useUnits, useUnitLabel } from './ui';

/** Okunaklı cetvel aralığı */
function niceStep(range: number): number {
  const raw = range / 6;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

interface RulerBar {
  key: string;
  cm: number;
  label: string;
  best?: boolean;
}

/** Hedef genişlik ile seçeneklerin genişliğini karşılaştıran cetvel */
export function WidthRuler({ targetCm, targetLabel, bars }: { targetCm: number; targetLabel: string; bars: RulerBar[] }) {
  const units = useUnits();
  const unit = useUnitLabel();
  const lang = useLang();
  const maxCm = Math.max(targetCm, ...bars.map((b) => b.cm)) * 1.08;
  const maxU = toUnit(maxCm, units);
  const step = niceStep(maxU);
  const W = 320;
  const pad = 8;
  const x = (u: number) => pad + (u / maxU) * (W - pad * 2);
  const barH = 22;
  const top = 40;
  const H = top + bars.length * (barH + 10) + 6;
  const ticks: number[] = [];
  for (let v = 0; v <= maxU + 1e-9; v += step / 2) ticks.push(v);
  const tx = x(toUnit(targetCm, units));
  return (
    <svg className="calc-ruler" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${targetLabel}: ${fmt(toUnit(targetCm, units), 1, lang)} ${unit}`}>
      <rect x="0" y="0" width={W} height="20" rx="4" fill="var(--kraft)" />
      {ticks.map((v, i) => {
        const major = i % 2 === 0;
        return (
          <g key={i}>
            <line x1={x(v)} x2={x(v)} y1="0" y2={major ? 10 : 6} stroke="var(--kraft-ink)" strokeWidth="1" />
            {major && v > 0 && x(v) < W - 14 && (
              <text x={x(v)} y="18" fontSize="8" textAnchor="middle" fill="var(--kraft-ink)">
                {fmt(v, step < 1 ? 1 : 0, lang)}
              </text>
            )}
          </g>
        );
      })}

      {bars.map((b, i) => {
        const y = top + i * (barH + 10);
        const w = x(toUnit(b.cm, units)) - pad;
        return (
          <g key={b.key}>
            <rect x={pad} y={y} width={Math.max(2, w)} height={barH} rx="5" fill={b.best ? 'var(--accent)' : 'var(--paper-3)'} />
            <rect
              x={pad}
              y={y}
              width={Math.max(2, w)}
              height={barH}
              rx="5"
              fill="none"
              stroke={b.best ? 'var(--accent)' : 'var(--line-2)'}
              strokeDasharray="3 3"
              strokeOpacity="0.8"
            />
            <text x={pad + 8} y={y + barH / 2 + 4} fontSize="10.5" fontWeight="700" fill={b.best ? 'var(--accent-ink)' : 'var(--ink)'}>
              {b.label}
            </text>
          </g>
        );
      })}
      <line x1={tx} x2={tx} y1="20" y2={H - 2} stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={tx > W - 70 ? tx - 4 : tx + 4} y="33" fontSize="9.5" fontWeight="800" fill="var(--ink)" textAnchor={tx > W - 70 ? 'end' : 'start'}>
        {targetLabel} · {fmt(toUnit(targetCm, units), 1, lang)} {unit}
      </text>
    </svg>
  );
}

/** Eşit dağıtım haritası: her ilmek bir kare; artırma/eksiltme işaretli */
export function StitchMap({ groups, kind, craft, labels }: { groups: Group[]; kind: 'inc' | 'dec'; craft: 'knit' | 'crochet'; labels: { plain: string; shape: string } }) {
  // tükettiği ilmek sayısı: şiş artırması 0 (ilmek arasına), tığ artırması 1, eksiltme 2
  const cells: { t: 'p' | 's'; w: number }[] = [];
  for (const g of groups) {
    for (let i = 0; i < g.plain; i++) cells.push({ t: 'p', w: 1 });
    if (g.shape) cells.push({ t: 's', w: kind === 'dec' ? 2 : craft === 'knit' ? 0 : 1 });
  }
  if (cells.length > 600) return null;
  return (
    <div className="calc-map" role="img" aria-label={`${labels.plain}, ${labels.shape}`}>
      {cells.map((c, i) =>
        c.t === 'p' ? (
          <span key={i} className="calc-map-st" />
        ) : (
          <span key={i} className={`calc-map-shape ${kind}${c.w === 0 ? ' between' : c.w === 2 ? ' double' : ''}`} title={labels.shape}>
            {kind === 'inc' ? '+' : '−'}
          </span>
        ),
      )}
    </div>
  );
}

/** Tığ dairesi: iç içe turlar */
export function CircleRings({ rounds, label }: { rounds: { n: number; stitches: number }[]; label: string }) {
  const n = rounds.length;
  const R = 92;
  const shown = rounds.slice(0, 60);
  return (
    <svg className="calc-rings" viewBox="0 0 200 200" role="img" aria-label={label}>
      {[...shown].reverse().map((r) => {
        const rad = (r.n / n) * R;
        const hue = r.n % 2 === 0;
        return <circle key={r.n} cx="100" cy="100" r={rad} fill={hue ? 'var(--plum-soft)' : 'var(--card)'} stroke="var(--plum)" strokeOpacity="0.55" strokeWidth="1" />;
      })}
      {shown.length <= 24 &&
        shown.map((r) => {
          // her turda başlangıç sayısı kadar artırma noktası
          const start = rounds[0].stitches;
          const rad = ((r.n - 0.5) / n) * R;
          if (r.n === 1) return null;
          return Array.from({ length: start }, (_, i) => {
            const a = (i / start) * Math.PI * 2 + (r.n % 2 === 0 ? Math.PI / start : 0) - Math.PI / 2;
            return <circle key={`${r.n}-${i}`} cx={100 + Math.cos(a) * rad} cy={100 + Math.sin(a) * rad} r={Math.min(2.4, R / n / 3)} fill="var(--plum)" />;
          });
        })}
      <circle cx="100" cy="100" r={Math.max(2, R / n / 2.5)} fill="var(--plum)" />
    </svg>
  );
}

/** WPI çizimi: kaleme sarılmış ip ve 2,5 cm işareti */
export function WpiIllustration({ label, lengthLabel, color = '#b5523b' }: { label: string; lengthLabel: string; color?: string }) {
  const wraps = 9;
  const x0 = 70;
  const gap = 13;
  return (
    <svg className="calc-wpi-art" viewBox="0 0 320 130" role="img" aria-label={label}>
      {/* kalem */}
      <rect x="20" y="40" width="250" height="26" rx="4" fill="var(--mustard)" />
      <rect x="20" y="40" width="250" height="8" rx="3" fill="#fff" opacity="0.25" />
      <path d="M270 40 L300 53 L270 66 Z" fill="var(--kraft)" />
      <path d="M292 49.5 L300 53 L292 56.5 Z" fill="var(--ink)" />
      <rect x="8" y="40" width="16" height="26" rx="3" fill="var(--rose)" />
      {/* sarımlar */}
      {Array.from({ length: wraps }, (_, i) => {
        const x = x0 + i * gap;
        return <path key={i} d={`M${x} 36 C${x + 7} 44 ${x + 7} 62 ${x} 70`} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />;
      })}
      <path
        d={`M${x0 + (wraps - 1) * gap} 70 C${x0 + wraps * gap + 10} 82 ${x0 + wraps * gap + 30} 70 ${x0 + wraps * gap + 50} 92`}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* cetvel */}
      <rect x="40" y="96" width="250" height="26" rx="3" fill="var(--kraft)" />
      {Array.from({ length: 26 }, (_, i) => (
        <line key={i} x1={40 + i * 10} x2={40 + i * 10} y1="96" y2={i % 5 === 0 ? 108 : 103} stroke="var(--kraft-ink)" strokeWidth="1" />
      ))}
      <rect x={x0 - 6} y="94" width={gap * wraps} height="30" fill="var(--highlight)" stroke="var(--ink)" strokeDasharray="3 2" />
      <text x={x0 - 6 + (gap * wraps) / 2} y="119" fontSize="10" fontWeight="800" textAnchor="middle" fill="var(--ink)">
        {lengthLabel}
      </text>
      {Array.from({ length: wraps }, (_, i) => (
        <text key={i} x={x0 + 3 + i * gap} y="30" fontSize="9" textAnchor="middle" fill="var(--ink-2)" fontWeight="700">
          {i + 1}
        </text>
      ))}
    </svg>
  );
}

/** 0–7 kalınlık cetveli, seçili kategori vurgulu */
export function WeightScale({ active, onPick }: { active: YarnWeightId; onPick?: (id: YarnWeightId) => void }) {
  const lang = useLang();
  return (
    <div className="calc-scale" role="list">
      {YARN_WEIGHTS.map((w) => (
        <button
          key={w.id}
          type="button"
          role="listitem"
          className={`calc-scale-step${w.id === active ? ' on' : ''}`}
          onClick={() => onPick?.(w.id)}
          aria-current={w.id === active ? 'true' : undefined}
          title={`${w.name[lang]} (${w.en})`}
        >
          <span className="calc-scale-thread" style={{ height: 3 + w.id * 2.2 }} />
          <span className="calc-scale-n">{w.id}</span>
          <span className="calc-scale-name">{w.name[lang]}</span>
        </button>
      ))}
    </div>
  );
}
