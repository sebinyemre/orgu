/**
 * Salt okunur grafik görünümü (desen kütüphanesi, dersler, eserler, takip modu için).
 * Canvas üzerinde keskin çizilir: sıra/ilmek numaraları, vurgulanan sıra, kırmızı tekrar kutusu, CYC/JIS sembolleri.
 */
import { useEffect, useRef } from 'react';
import type { ChartRect, Craft, PaletteColor } from '@/types';
import type { SymbolStyle } from '@/knowledge/symbols';
import { renderStaticChart, type PaperStyle } from '@/engine/chart/render';
import { useSettings } from '@/store/settings';
import { useChartTheme, useDpr, useFontsReady } from './theme';

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
  /** isteğe bağlı: kağıt stili (varsayılan temiz) */
  paper?: PaperStyle;
  /** isteğe bağlı: hücre en/boy oranı (oranlı kağıt) */
  aspect?: number;
}

export function ChartView({
  width,
  height,
  symbols,
  colors,
  palette,
  mode = 'flat',
  firstRowRS = true,
  cell = 20,
  symbolStyle = 'cyc',
  showNumbers = true,
  highlightRow,
  repeat,
  className,
  ariaLabel,
  paper = 'clean',
  aspect = 1,
}: ChartViewProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useChartTheme();
  const dpr = useDpr();
  const fonts = useFontsReady();
  const leftHanded = useSettings((s) => s.leftHanded);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const n = width * height;
    const src = {
      width,
      height,
      symbols,
      colors: colors ?? new Array<number>(n).fill(-1),
      palette: palette ?? [],
    };
    const size = renderStaticChart(c, src, {
      cell,
      aspect,
      theme,
      dpr,
      paper,
      symbolStyle,
      numbers: showNumbers ? { mode, firstRowRS, leftHanded } : false,
      repeat,
      highlightRow,
    });
    c.style.width = `${size.width}px`;
    c.style.aspectRatio = `${size.width} / ${size.height}`;
  }, [width, height, symbols, colors, palette, mode, firstRowRS, cell, symbolStyle, showNumbers, highlightRow, repeat, theme, dpr, fonts, leftHanded, paper, aspect]);

  return <canvas ref={ref} className={`chart-view ${className ?? ''}`} role="img" aria-label={ariaLabel} style={{ maxWidth: '100%', height: 'auto' }} />;
}
