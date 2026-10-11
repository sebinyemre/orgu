/** Kareli kağıt görünüm tercihleri (cihazda kalıcı) */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SymbolStyle } from '@/knowledge/symbols';
import type { PaperStyle } from '@/engine/chart/render';

export interface ChartPrefs {
  paper: PaperStyle;
  symbolStyle: SymbolStyle;
  numbers: boolean;
  compact: boolean;
  fabricTile: 1 | 2 | 3;
  fabricOnlyRepeat: boolean;
  /** kumaş önizlemesi yakınlığı (1 = panele sığdır) */
  fabricZoom: number;
  writtenView: 'rows' | 'c2c';
  set: (p: Partial<Omit<ChartPrefs, 'set'>>) => void;
}

export const useChartPrefs = create<ChartPrefs>()(
  persist(
    (set) => ({
      paper: 'clean',
      symbolStyle: 'cyc',
      numbers: true,
      compact: true,
      fabricTile: 1,
      fabricOnlyRepeat: true,
      fabricZoom: 1,
      writtenView: 'rows',
      set: (p) => set(p),
    }),
    { name: 'ilmek.kareli.tercihler', version: 1 },
  ),
);
