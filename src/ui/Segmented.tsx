import type { ReactNode } from 'react';

export interface SegOption<T extends string | number> {
  value: T;
  label: ReactNode;
  title?: string;
}

interface Props<T extends string | number> {
  options: SegOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
  className?: string;
}

/** Bölümlü seçici (radyo düğmesi grubu gibi) */
export function Segmented<T extends string | number>({ options, value, onChange, label, className }: Props<T>) {
  return (
    <div className={`seg ${className ?? ''}`} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" aria-pressed={o.value === value} title={o.title} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
