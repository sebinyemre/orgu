import { YARN_SWATCHES } from '@/knowledge/swatches';

interface Props {
  value: string;
  onChange: (hex: string) => void;
  /** hazır ip renkleri göster */
  presets?: string[];
  label?: string;
}

/** Hazır ip renkleri + serbest renk seçici */
export function ColorPicker({ value, onChange, presets = YARN_SWATCHES.map((s) => s.hex), label = 'Renk' }: Props) {
  return (
    <div className="row" role="group" aria-label={label} style={{ gap: 6 }}>
      {presets.map((hex) => (
        <button key={hex} type="button" className="swatch" style={{ background: hex }} aria-pressed={hex.toLowerCase() === value.toLowerCase()} aria-label={hex} onClick={() => onChange(hex)} />
      ))}
      <input type="color" className="input" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Özel renk" />
    </div>
  );
}
