/** Grafik kartları için küçük canlı resim */
import { useEffect, useRef } from 'react';
import type { ChartDoc } from '@/types';
import { cellAspect } from '@/engine/math/gauge';
import { renderStaticChart } from '@/engine/chart/render';
import { useChartPrefs } from './prefs';
import { useChartTheme, useDpr } from './theme';

interface Props {
  chart: Pick<ChartDoc, 'width' | 'height' | 'colors' | 'symbols' | 'palette' | 'repeat' | 'proportional' | 'gauge'>;
  /** kutu boyutu (CSS px) */
  maxW?: number;
  maxH?: number;
  className?: string;
}

export function ChartThumb({ chart, maxW = 260, maxH = 170, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useChartTheme();
  const dpr = useDpr();
  const paper = useChartPrefs((s) => s.paper);
  const style = useChartPrefs((s) => s.symbolStyle);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const aspect = chart.proportional && chart.gauge ? cellAspect(chart.gauge) : 1;
    const cell = Math.max(1, Math.min((maxW - 4) / (chart.width * aspect), (maxH - 4) / chart.height, 22));
    const size = renderStaticChart(c, chart, { cell, aspect, theme, dpr, paper, symbolStyle: style, repeat: chart.repeat, numbers: false });
    c.style.width = `${size.width}px`;
    c.style.height = `${size.height}px`;
  }, [chart, maxW, maxH, theme, dpr, paper, style]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
