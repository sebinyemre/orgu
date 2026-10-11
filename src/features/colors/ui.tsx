/** Renk stüdyosunun ortak parçaları: sayfa iskeleti, renk listesi, renk düzenleme penceresi, örgü tuvali */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { PageHeader } from '@/ui/PageHeader';
import { Modal } from '@/ui/Modal';
import { ColorPicker } from '@/ui/ColorPicker';
import { useStash } from '@/store/stash';
import { inkOn, nameColor } from '@/lib/color';
import { fmt, letterFor } from '@/lib/format';
import type { Lang } from '@/types';
import { CLR } from './i18n';
import { drawKnit, type KnitDrawOptions } from './fabric';

export type ToolId = 'palet' | 'serit' | 'sicaklik' | 'granny';

/** Yüzde: tr "%12", en/pt "12%", es "12 %" */
export function fmtPct(n: number, lang: Lang): string {
  const v = fmt(n, 0, lang);
  return lang === 'tr' ? `%${v}` : lang === 'es' ? `${v} %` : `${v}%`;
}

export function ToolLayout({ id, icon, children }: { id: ToolId; icon: ReactNode; children: ReactNode }) {
  const t = useMsgs(CLR);
  const meta = t.tools[id];
  return (
    <div className="page cs-page">
      <Link to="/renk" className="btn btn-ghost btn-sm cs-back">
        <ArrowLeft />
        {t.back}
      </Link>
      <PageHeader
        eyebrow={t.hubEyebrow}
        title={
          <span className="cs-title">
            <span className="cs-title-icon" aria-hidden>
              {icon}
            </span>
            {meta.title}
          </span>
        }
        lede={meta.desc}
      />
      {children}
    </div>
  );
}

/** Satıra sığmazsa alta geçen seçenek düğmeleri (dar ekranda kaydırma çubuğu yerine) */
export function ChipSelect<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="cs-chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className="chip" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Sepetteki iplerin renkleri (tekrarsız) */
export function useStashColors(): { hex: string; label: string }[] {
  const yarns = useStash((s) => s.yarns);
  return useMemo(() => {
    const seen = new Set<string>();
    const out: { hex: string; label: string }[] = [];
    for (const y of yarns) {
      const hex = y.colorHex?.toLowerCase();
      if (!hex || seen.has(hex)) continue;
      seen.add(hex);
      out.push({
        hex,
        label: [y.name || y.brand, y.colorName].filter(Boolean).join(' · '),
      });
    }
    return out;
  }, [yarns]);
}

/** Sepetteki ip renkleri: etiketli düğmeler */
export function StashColors({ value, onPick }: { value?: string; onPick: (hex: string) => void }) {
  const t = useMsgs(CLR);
  const list = useStashColors();
  if (!list.length) return null;
  return (
    <div className="stack-sm">
      <span className="label">{t.stash}</span>
      <div className="row" style={{ gap: 6 }}>
        {list.map((c) => (
          <button
            key={c.hex}
            type="button"
            className="swatch swatch-lg"
            style={{ background: c.hex }}
            aria-pressed={value?.toLowerCase() === c.hex}
            aria-label={c.label}
            title={c.label}
            onClick={() => onPick(c.hex)}
          />
        ))}
      </div>
    </div>
  );
}

/** Renk değiştirme penceresi: hazır ip renkleri, sepetteki ipler, serbest seçici */
export function ColorEditModal({ open, color, title, onClose, onChange }: { open: boolean; color: string; title: string; onClose: () => void; onChange: (hex: string) => void }) {
  const lang = useLang();
  const c = useMsgs(COMMON);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <button type="button" className="btn btn-primary" onClick={onClose}>
          {c.done}
        </button>
      }
    >
      <div className="stack">
        <div className="cs-edit-preview" style={{ background: color, color: inkOn(color) }}>
          <strong>{nameColor(color, lang)}</strong>
          <span className="mono small">{color.toUpperCase()}</span>
        </div>
        <ColorPicker value={color} onChange={onChange} />
        <StashColors value={color} onPick={onChange} />
      </div>
    </Modal>
  );
}

/** Harfli, düzenlenebilir renk listesi (2–max renk) */
export function ColorList({ colors, onChange, min = 2, max = 8 }: { colors: string[]; onChange: (c: string[]) => void; min?: number; max?: number }) {
  const t = useMsgs(CLR);
  const lang = useLang();
  const [edit, setEdit] = useState<number | null>(null);
  const add = () => {
    const pool = ['#f5f0e6', '#d39a2c', '#5f7a61', '#b5523b', '#46698a', '#7d4e6d', '#f4a7b9', '#2f2925', '#9fd8cb', '#f2c84b'];
    const next = pool.find((p) => !colors.includes(p)) ?? '#9e9e9e';
    onChange([...colors, next]);
  };
  return (
    <div className="cs-colors">
      {colors.map((hex, i) => (
        <div key={i} className="cs-color">
          <button
            type="button"
            className="cs-color-btn"
            style={{ background: hex, color: inkOn(hex) }}
            onClick={() => setEdit(i)}
            aria-label={`${t.editColor}: ${t.letter(letterFor(i))}, ${nameColor(hex, lang)}`}
          >
            {letterFor(i)}
          </button>
          <span className="cs-color-name">{nameColor(hex, lang)}</span>
          {colors.length > min && (
            <button type="button" className="cs-color-x" onClick={() => onChange(colors.filter((_, j) => j !== i))} aria-label={`${t.removeColor}: ${letterFor(i)}`}>
              <X />
            </button>
          )}
        </div>
      ))}
      {colors.length < max && (
        <button type="button" className="cs-color-add" onClick={add} aria-label={t.addColor} title={t.addColor}>
          <Plus />
        </button>
      )}
      <ColorEditModal
        open={edit !== null}
        color={edit !== null ? (colors[edit] ?? '#000000') : '#000000'}
        title={edit !== null ? t.letter(letterFor(edit)) : ''}
        onClose={() => setEdit(null)}
        onChange={(hex) => edit !== null && onChange(colors.map((c, j) => (j === edit ? hex : c)))}
      />
    </div>
  );
}

/** Örgü tuvali: hücreleri V ilmekleriyle çizer */
export function KnitCanvas({
  className,
  ariaLabel,
  canvasRef,
  ...o
}: KnitDrawOptions & {
  className?: string;
  ariaLabel: string;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}) {
  const own = useRef<HTMLCanvasElement>(null);
  const ref = canvasRef ?? own;
  const [size, setSize] = useState({ width: 0, height: 0 });
  const key = `${o.cols}x${o.rows}:${o.stW}:${o.gray ? 1 : 0}:${o.cells.join('')}`;
  useEffect(() => {
    if (ref.current) setSize(drawKnit(ref.current, o));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{
        width: size.width || undefined,
        aspectRatio: size.width ? `${size.width} / ${size.height}` : undefined,
      }}
    />
  );
}
