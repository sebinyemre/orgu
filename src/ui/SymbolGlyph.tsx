import { SYMBOL_BY_ID, glyphOf, symbolName, type ChartSymbol, type SymbolStyle } from '@/knowledge/symbols';
import { useTerms } from './Term';

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
  style?: SymbolStyle;
}

/** Grafik sembolünü SVG olarak çizer (paletler, lejantlar, dersler için). */
export function SymbolGlyph({ symbol, size = 28, ink = 'currentColor', bg = 'var(--card)', weight = 8, title, className, framed, style = 'cyc' }: Props) {
  const { ctx } = useTerms();
  const sym = typeof symbol === 'string' ? SYMBOL_BY_ID[symbol] : symbol;
  if (!sym) return null;
  const g = glyphOf(sym, style);
  const span = sym.span ?? 1;
  const w = size * span;
  const label = title ?? symbolName(sym, ctx);
  return (
    <svg width={w} height={size} viewBox={`0 0 ${100 * span} 100`} className={className} role="img" aria-label={label}>
      <title>{label}</title>
      {(framed || sym.bg) && (
        <rect x="1.5" y="1.5" width={100 * span - 3} height="97" rx="6" fill={sym.bg ? 'var(--ink-3)' : 'none'} fillOpacity={sym.bg ? 0.45 : 1} stroke="var(--line-2)" strokeWidth="3" />
      )}
      {g.under && <path d={g.under} fill="none" stroke={ink} strokeWidth={weight} strokeLinecap="round" />}
      {g.d && g.under && <path d={g.d} fill="none" stroke={bg} strokeWidth={weight * 3.4} strokeLinecap="round" />}
      {g.d && <path d={g.d} fill="none" stroke={ink} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" />}
      {g.fd && <path d={g.fd} fill={ink} />}
    </svg>
  );
}
