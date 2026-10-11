/**
 * Salt okunur grafik görünümü (desen kütüphanesi, dersler, eserler için).
 * GEÇİCİ SÜRÜM: Kareli kağıt modülü canvas tabanlı tam sürümü yazacak. Props sözleşmesi sabittir.
 */
import type { ChartRect, Craft, PaletteColor } from '@/types';
import type { SymbolStyle } from '@/knowledge/symbols';
import { SymbolGlyph } from '@/ui/SymbolGlyph';

export interface ChartViewProps {
  width: number;
  height: number;
  /** üstten alta, satır öncelikli sembol kimlikleri ('' = boş) */
  symbols: string[];
  /** palet indeksleri (-1 = boş); verilmezse hücreler zemin rengindedir */
  colors?: number[];
  palette?: Pick<PaletteColor, 'hex'>[];
  craft: Craft;
  mode?: 'flat' | 'round';
  firstRowRS?: boolean;
  /** hücre boyu (px) */
  cell?: number;
  symbolStyle?: SymbolStyle;
  showNumbers?: boolean;
  /** 1 tabanlı, alttan; vurgulanacak sıra */
  highlightRow?: number;
  repeat?: ChartRect;
  className?: string;
  ariaLabel?: string;
}

export function ChartView({ width, height, symbols, colors, palette, cell = 20, symbolStyle = 'cyc', className, ariaLabel }: ChartViewProps) {
  return (
    <div className={className} role="img" aria-label={ariaLabel} style={{ display: 'grid', gridTemplateColumns: `repeat(${width}, ${cell}px)`, gap: 0, border: '1px solid var(--grid-line-strong)', width: 'fit-content', background: 'var(--grid-bg)' }}>
      {Array.from({ length: width * height }, (_, i) => {
        const c = colors?.[i] ?? -1;
        const bg = c >= 0 && palette?.[c] ? palette[c].hex : 'transparent';
        return (
          <div key={i} style={{ width: cell, height: cell, background: bg, border: '0.5px solid var(--grid-line)', display: 'grid', placeItems: 'center' }}>
            {symbols[i] && <SymbolGlyph symbol={symbols[i]} size={cell - 4} style={symbolStyle} />}
          </div>
        );
      })}
    </div>
  );
}
