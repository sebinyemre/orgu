import { SYMBOL_BY_ID, type ChartSymbol } from '@/knowledge/symbols';

interface Props {
  symbol: ChartSymbol | string;
  /** hücre yüksekliği (px); genişlik span ile çarpılır */
  size?: number;
  ink?: string;
  bg?: string;
  /** çizgi kalınlığı (100'lük kutuda) */
  weight?: number;
  title?: string;
  className?: string;
  /** kutu çerçevesi çiz */
  framed?: boolean;
}

/** Grafik sembolünü SVG olarak çizer (paletler, lejantlar, dersler için). */
export function SymbolGlyph({ symbol, size = 28, ink = 'currentColor', bg = 'var(--card)', weight = 8, title, className, framed }: Props) {
  const sym = typeof symbol === 'string' ? SYMBOL_BY_ID[symbol] : symbol;
  if (!sym) return null;
  const span = sym.span ?? 1;
  const w = size * span;
  return (
    <svg width={w} height={size} viewBox={`0 0 ${100 * span} 100`} className={className} role="img" aria-label={title ?? sym.name}>
      {title && <title>{title}</title>}
      {(framed || sym.bg) && (
        <rect x="1.5" y="1.5" width={100 * span - 3} height="97" rx="6" fill={sym.bg ? 'var(--ink-3)' : 'none'} fillOpacity={sym.bg ? 0.45 : 1} stroke="var(--line-2)" strokeWidth="3" />
      )}
      {sym.under && <path d={sym.under} fill="none" stroke={ink} strokeWidth={weight} strokeLinecap="round" />}
      {sym.d && sym.under && <path d={sym.d} fill="none" stroke={bg} strokeWidth={weight * 3.4} strokeLinecap="round" />}
      {sym.d && <path d={sym.d} fill="none" stroke={ink} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" />}
      {sym.fd && <path d={sym.fd} fill={ink} />}
    </svg>
  );
}
