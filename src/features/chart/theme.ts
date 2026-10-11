/** Canvas çizimleri için tasarım belirteçlerini (CSS değişkenleri) okur; tema değişince yeniler. */
import { useEffect, useState } from 'react';
import { luminanceOf, type ChartTheme } from '@/engine/chart/render';

export function readChartTheme(el?: Element | null): ChartTheme {
  const cs = getComputedStyle(el ?? document.documentElement);
  const v = (n: string, d: string) => cs.getPropertyValue(n).trim() || d;
  const gridBg = v('--grid-bg', '#fffefb');
  return {
    gridBg,
    gridLine: v('--grid-line', '#cfdde6'),
    gridStrong: v('--grid-line-strong', '#8fb0c4'),
    number: v('--grid-number', '#6f8ea2'),
    ink: v('--ink', '#2f2925'),
    ink3: v('--ink-3', '#8f8378'),
    paper: v('--paper', '#fbf6ee'),
    card: v('--card', '#fffdf9'),
    highlight: v('--highlight', 'rgba(255, 226, 64, 0.5)'),
    highlightStrong: v('--highlight-strong', 'rgba(255, 210, 0, 0.75)'),
    ruler: v('--ruler', 'rgba(70, 105, 138, 0.18)'),
    rulerEdge: v('--ruler-edge', '#46698a'),
    danger: v('--danger', '#b4423a'),
    accent: v('--accent', '#46698a'),
    fontBody: v('--font-body', 'Nunito, system-ui, sans-serif'),
    fontHand: v('--font-hand', 'Caveat, cursive'),
    dark: luminanceOf(gridBg) < 0.3,
  };
}

/** Tema (açık/koyu) değişince yenilenen canvas renkleri */
export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(() => readChartTheme(document.querySelector('.shell')));
  useEffect(() => {
    const update = () => setTheme(readChartTheme(document.querySelector('.shell')));
    const raf = requestAnimationFrame(update);
    const mo = new MutationObserver(() => requestAnimationFrame(update));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', update);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      mq.removeEventListener('change', update);
    };
  }, []);
  return theme;
}

/** Yazı tipleri yüklenince artan sayaç (canvas yazıları yeniden çizilsin) */
export function useFontsReady(): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && setN((x) => x + 1));
    const on = () => alive && setN((x) => x + 1);
    document.fonts?.addEventListener?.('loadingdone', on);
    return () => {
      alive = false;
      document.fonts?.removeEventListener?.('loadingdone', on);
    };
  }, []);
  return n;
}

/** Cihaz piksel oranı (yakınlaştırınca değişebilir) */
export function useDpr(): number {
  const [dpr, setDpr] = useState(() => Math.min(3, window.devicePixelRatio || 1));
  useEffect(() => {
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const on = () => setDpr(Math.min(3, window.devicePixelRatio || 1));
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [dpr]);
  return dpr;
}
