/**
 * Örülmüş kumaş önizlemesi: grafik hücrelerini gerçek örgü görünümüyle (V, boncuk, delik…) çizer.
 * GEÇİCİ SÜRÜM: Kareli kağıt modülü engine/chart/fabric.ts ile tam sürümü yazacak. Props sözleşmesi sabittir.
 */
import type { Craft, PaletteColor } from '@/types';

export interface FabricPreviewProps {
  width: number;
  height: number;
  /** üstten alta, satır öncelikli sembol kimlikleri */
  symbols: string[];
  colors?: number[];
  palette?: Pick<PaletteColor, 'hex'>[];
  craft: Craft;
  /** tek renk kumaşta ip rengi */
  yarnColor?: string;
  /** desen tekrarlarıyla döşenecek yatay/dikey kopya sayısı */
  tileX?: number;
  tileY?: number;
  /** bir ilmeğin piksel genişliği */
  stitchPx?: number;
  className?: string;
  ariaLabel?: string;
}

export function FabricPreview({ width, height, symbols, yarnColor = '#d9c6a5', stitchPx = 14, className, ariaLabel }: FabricPreviewProps) {
  return (
    <div className={className} role="img" aria-label={ariaLabel} style={{ display: 'grid', gridTemplateColumns: `repeat(${width}, ${stitchPx}px)`, background: yarnColor, borderRadius: 8, padding: 6, width: 'fit-content' }}>
      {symbols.slice(0, width * height).map((s, i) => (
        <div key={i} style={{ width: stitchPx, height: stitchPx * 0.8, fontSize: stitchPx * 0.7, textAlign: 'center', lineHeight: 1, color: 'rgba(0,0,0,.35)' }}>
          {s === 'p' ? '•' : s === 'yo' ? '○' : 'v'}
        </div>
      ))}
    </div>
  );
}
