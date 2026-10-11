/**
 * Ölçülü çizim: dikdörtgen (atkı, battaniye, örnek), bere, tüp (boyunluk), daire ve küre.
 */
import { useId, type ReactElement } from 'react';
import type { PatternDiagram } from '@/types';
import { useMsgs } from '@/i18n';
import { R } from '../i18n';

type Sch = Extract<PatternDiagram, { kind: 'schematic' }>;

const INK = 'var(--ink-2)';

function Dim({ x1, y1, x2, y2, label, side = 'below', marker }: { x1: number; y1: number; x2: number; y2: number; label: string; side?: 'below' | 'right' | 'above'; marker: string }) {
  const vertical = x1 === x2;
  const tick = 5;
  const tx = vertical ? x1 + 8 : (x1 + x2) / 2;
  const ty = vertical ? (y1 + y2) / 2 : side === 'above' ? y1 - 8 : y1 + 16;
  return (
    <g className="pv-dim">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={1} markerStart={`url(#${marker})`} markerEnd={`url(#${marker})`} />
      {vertical ? (
        <>
          <line x1={x1 - tick} y1={y1} x2={x1 + tick} y2={y1} stroke={INK} strokeWidth={1} />
          <line x1={x1 - tick} y1={y2} x2={x1 + tick} y2={y2} stroke={INK} strokeWidth={1} />
        </>
      ) : (
        <>
          <line x1={x1} y1={y1 - tick} x2={x1} y2={y1 + tick} stroke={INK} strokeWidth={1} />
          <line x1={x2} y1={y1 - tick} x2={x2} y2={y1 + tick} stroke={INK} strokeWidth={1} />
        </>
      )}
      <text x={tx} y={ty} textAnchor={vertical ? 'start' : 'middle'} dominantBaseline="central" fontSize={13} fontWeight={700} fill="var(--ink)">
        {label}
      </text>
    </g>
  );
}

export function Schematic({ d, color = '#d39a2c' }: { d: Sch; color?: string }) {
  const t = useMsgs(R);
  const mk = `pva${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const L = d.labels ?? {};
  const W = 340;
  const H = 280;
  let body: ReactElement;
  const fill = { fill: color, fillOpacity: 0.3, stroke: 'var(--ink)', strokeWidth: 1.6, strokeLinejoin: 'round' as const };

  if (d.shape === 'rect') {
    const ratio = d.heightCm / d.widthCm;
    const broken = ratio > 2.6;
    const maxW = 180;
    const maxH = 200;
    let w = maxW;
    let h = broken ? maxH : Math.min(maxH, maxW * ratio);
    if (!broken && h === maxH) w = maxH / ratio;
    if (broken) w = Math.max(48, Math.min(90, maxH / ratio * 2.4));
    const x = (W - w) / 2 - 20;
    const y = (H - h) / 2 - 8;
    const win = L.window ? (w * 10) / d.widthCm : 0;
    body = (
      <>
        {broken ? (
          <path
            d={`M${x} ${y} H${x + w} V${y + h * 0.45} l-${w * 0.12} 6 l${w * 0.24} 6 l-${w * 0.12} 6 V${y + h} H${x} V${y + h * 0.45 + 18} l${w * 0.12} -6 l-${w * 0.24} -6 l${w * 0.12} -6 Z`}
            {...fill}
          />
        ) : (
          <rect x={x} y={y} width={w} height={h} rx={2} {...fill} />
        )}
        {win > 0 && <rect x={x + (w - win) / 2} y={y + (h - win) / 2} width={win} height={win} fill="none" stroke="var(--ink)" strokeDasharray="4 3" strokeWidth={1.2} />}
        {win > 0 && (
          <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" fontSize={11} fill="var(--ink)">
            {L.window}
          </text>
        )}
        {L.width && <Dim marker={mk} x1={x} y1={y + h + 14} x2={x + w} y2={y + h + 14} label={L.width} />}
        {L.height && <Dim marker={mk} x1={x + w + 16} y1={y} x2={x + w + 16} y2={y + h} label={L.height} side="right" />}
      </>
    );
  } else if (d.shape === 'beanie') {
    const w = 170;
    const h = Math.max(110, Math.min(200, (w * d.heightCm) / Math.max(1, d.widthCm)));
    const x = (W - w) / 2 - 24;
    const y = (H - h) / 2 - 4;
    const dome = Math.min(h * 0.42, w * 0.5);
    const brim = h * 0.2;
    body = (
      <>
        <path d={`M${x} ${y + h} V${y + dome} C${x} ${y - dome * 0.25} ${x + w} ${y - dome * 0.25} ${x + w} ${y + dome} V${y + h} Z`} {...fill} />
        <path d={`M${x} ${y + h - brim} H${x + w}`} stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="5 4" />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={x + ((i + 0.5) * w) / 11} y1={y + h - brim + 3} x2={x + ((i + 0.5) * w) / 11} y2={y + h - 3} stroke="var(--ink)" strokeOpacity={0.35} />
        ))}
        {L.width && <Dim marker={mk} x1={x} y1={y + h + 14} x2={x + w} y2={y + h + 14} label={`${t.around} ${L.width}`} />}
        {L.height && <Dim marker={mk} x1={x + w + 16} y1={y + dome * 0.12} x2={x + w + 16} y2={y + h} label={L.height} side="right" />}
      </>
    );
  } else if (d.shape === 'tube') {
    const w = 170;
    const h = Math.max(70, Math.min(170, (w * d.heightCm) / Math.max(1, d.widthCm)));
    const x = (W - w) / 2 - 24;
    const y = (H - h) / 2 + 6;
    const ry = 18;
    body = (
      <>
        <path d={`M${x} ${y} V${y + h} A${w / 2} ${ry} 0 0 0 ${x + w} ${y + h} V${y} Z`} {...fill} />
        <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry={ry} fill={color} fillOpacity={0.12} stroke="var(--ink)" strokeWidth={1.6} />
        {L.width && <Dim marker={mk} x1={x} y1={y + h + ry + 14} x2={x + w} y2={y + h + ry + 14} label={`${t.around} ${L.width}`} />}
        {L.height && <Dim marker={mk} x1={x + w + 16} y1={y} x2={x + w + 16} y2={y + h} label={L.height} side="right" />}
      </>
    );
  } else {
    const r = 92;
    const cx = W / 2;
    const cy = H / 2 - 10;
    body = (
      <>
        <circle cx={cx} cy={cy} r={r} {...fill} />
        {d.shape === 'sphere' && (
          <>
            <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.28} fill="none" stroke="var(--ink)" strokeOpacity={0.45} strokeDasharray="4 4" />
            <ellipse cx={cx - r * 0.35} cy={cy - r * 0.4} rx={r * 0.22} ry={r * 0.13} transform={`rotate(-30 ${cx - r * 0.35} ${cy - r * 0.4})`} fill="#fff" fillOpacity={0.45} />
          </>
        )}
        {L.width && <Dim marker={mk} x1={cx - r} y1={cy + r + 16} x2={cx + r} y2={cy + r + 16} label={`${t.diameter} ${L.width}`} />}
      </>
    );
  }
  return (
    <figure className="pv-diagram">
      <svg viewBox={`0 0 ${W} ${H}`} className="pv-diagram-svg" role="img" aria-label={t.schematicCaption}>
        <defs>
          <marker id={mk} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-2)" />
          </marker>
        </defs>
        {body}
      </svg>
      <figcaption>{t.schematicCaption}</figcaption>
    </figure>
  );
}
