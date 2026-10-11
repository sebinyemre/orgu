import { useEffect, useState, type ReactNode } from 'react';
import { parseNum } from '@/ui/Field';

interface Props {
  value: number | undefined;
  onChange: (n: number | undefined) => void;
  id?: string;
  min?: number;
  integer?: boolean;
  placeholder?: string;
  suffix?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

const show = (n: number | undefined) => (n === undefined || !Number.isFinite(n) ? '' : String(Math.round(n * 100) / 100).replace('.', ','));

/** Boş bırakılabilen sayı girişi (boş = undefined). Virgüllü ondalığı kabul eder. */
export function OptionalNumber({ value, onChange, id, min = 0, integer = true, placeholder, suffix, ariaLabel, className }: Props) {
  const [text, setText] = useState(show(value));
  useEffect(() => {
    const p = parseNum(text);
    if ((Number.isFinite(p) ? p : undefined) !== value) setText(show(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const commit = (s: string) => {
    setText(s);
    if (s.trim() === '') return onChange(undefined);
    let n = parseNum(s);
    if (!Number.isFinite(n)) return;
    if (integer) n = Math.round(n);
    if (n < min) return;
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
