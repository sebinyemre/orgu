/**
 * Örülmüş kumaş önizlemesi: grafik hücrelerini gerçek örgü görünümüyle (V, boncuk, delik, burgu…) çizer.
 * Diğer modüller (desen kütüphanesi, eserler) de kullanır; props sözleşmesi sabittir.
 */
import { useEffect, useRef } from 'react';
import type { Craft, PaletteColor } from '@/types';
import { fabricSize, renderFabric } from '@/engine/chart/fabric';
import { useDpr } from './theme';

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

/** Çok büyük kumaşlarda canvas sınırını aşmamak için piksel bütçesi */
const MAX_PIXELS = 9_000_000;

export function FabricPreview({ width, height, symbols, colors, palette, craft, yarnColor, tileX = 1, tileY = 1, stitchPx = 14, className, ariaLabel }: FabricPreviewProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const dpr0 = useDpr();

  useEffect(() => {
    const c = ref.current;
    if (!c || width < 1 || height < 1) return;
    const size = fabricSize({ width, height, craft }, { stitchPx, tileX, tileY });
    const area = size.width * size.height;
    const dpr = Math.max(0.5, Math.min(dpr0, Math.sqrt(MAX_PIXELS / Math.max(1, area))));
    const out = renderFabric(c, { width, height, symbols, colors, palette, craft, yarnColor }, { stitchPx, dpr, tileX, tileY });
    c.style.width = `${out.width}px`;
    c.style.aspectRatio = `${out.width} / ${out.height}`;
  }, [width, height, symbols, colors, palette, craft, yarnColor, tileX, tileY, stitchPx, dpr0]);

  return <canvas ref={ref} className={`chart-fabric ${className ?? ''}`} role="img" aria-label={ariaLabel} style={{ maxWidth: '100%', height: 'auto' }} />;
}
