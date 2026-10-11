import { useEffect, useState, type ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';

interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

/** Etiket + kontrol + ipucu */
export function Field({ label, hint, children, className, htmlFor }: FieldProps) {
  return (
    <div className={`field ${className ?? ''}`}>
      <label className="label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

/** "3,5" ve "3.5" ikisini de kabul eder */
export function parseNum(s: string): number {
  const n = parseFloat(s.replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}

function show(n: number | undefined): string {
  if (n === undefined || !Number.isFinite(n)) return '';
  return String(Math.round(n * 1000) / 1000).replace('.', ',');
}

interface NumberInputProps {
  value: number | undefined;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  suffix?: ReactNode;
  id?: string;
  placeholder?: string;
  integer?: boolean;
  ariaLabel?: string;
  className?: string;
}

/** Türkçe ondalık virgülü kabul eden sayı girişi (yazarken bozulmaz) */
export function NumberInput({ value, onChange, min, max, suffix, id, placeholder, integer, ariaLabel, className }: NumberInputProps) {
  const [text, setText] = useState(show(value));
  useEffect(() => {
    if (parseNum(text) !== value) setText(show(value));
  }, [value]);
  const commit = (s: string) => {
    setText(s);
    let n = parseNum(s);
    if (!Number.isFinite(n)) return;
    if (integer) n = Math.round(n);
    if (min !== undefined && n < min) return;
    if (max !== undefined && n > max) return;
    onChange(n);
  };
  const input = (
    <input
      id={id}
      className={`input ${className ?? ''}`}
      inputMode={integer ? 'numeric' : 'decimal'}
      value={text}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(e) => commit(e.target.value)}
      onBlur={() => setText(show(value))}
    />
  );
  if (!suffix) return input;
  return (
    <div className="input-group">
      {input}
      <span className="input-suffix">{suffix}</span>
    </div>
  );
}

interface StepperProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel?: string;
}

/** – [ 12 ] + */
export function Stepper({ value, onChange, min = 0, max = 99999, step = 1, ariaLabel }: StepperProps) {
  const t = useMsgs(COMMON);
  const set = (n: number) => onChange(Math.min(max, Math.max(min, Math.round(n / step) * step)));
  return (
    <div className="stepper" role="group" aria-label={ariaLabel}>
      <button type="button" onClick={() => set(value - step)} aria-label={t.decrease} disabled={value <= min}>
        <Minus size={16} />
      </button>
      <input
        inputMode="numeric"
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => {
          const n = parseNum(e.target.value);
          if (Number.isFinite(n)) set(n);
        }}
      />
      <button type="button" onClick={() => set(value + step)} aria-label={t.increase} disabled={value >= max}>
        <Plus size={16} />
      </button>
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  hint?: ReactNode;
}

export function Switch({ checked, onChange, label, hint }: SwitchProps) {
  return (
    <label className="switch">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span style={{ fontWeight: 700 }}>{label}</span>
        {hint && (
          <span className="hint" style={{ display: 'block' }}>
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
