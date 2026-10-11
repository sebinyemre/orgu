import { YARN_SWATCHES } from '@/knowledge/swatches';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';

interface Props {
  value: string;
  onChange: (hex: string) => void;
  /** hazır ip renkleri göster */
  presets?: string[];
  label?: string;
}

/** Hazır ip renkleri + serbest renk seçici */
export function ColorPicker({ value, onChange, presets = YARN_SWATCHES.map((s) => s.hex), label }: Props) {
  const t = useMsgs(COMMON);
  const lang = useLang();
  const nameOf = (hex: string) => YARN_SWATCHES.find((s) => s.hex === hex)?.name[lang] ?? hex;
  return (
    <div className="row" role="group" aria-label={label ?? t.color} style={{ gap: 6 }}>
      {presets.map((hex) => (
        <button key={hex} type="button" className="swatch" style={{ background: hex }} aria-pressed={hex.toLowerCase() === value.toLowerCase()} aria-label={nameOf(hex)} title={nameOf(hex)} onClick={() => onChange(hex)} />
      ))}
      <input type="color" className="input" value={value} onChange={(e) => onChange(e.target.value)} aria-label={t.customColor} />
    </div>
  );
}
