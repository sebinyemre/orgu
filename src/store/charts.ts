import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChartDoc, Craft, PaletteColor } from '@/types';
import { uid } from '@/lib/id';
import { getLang, type L10n } from '@/i18n';

/** Varsayılan adlar: oluşturulduğu andaki uygulama dilinde */
const NEW_NAME: L10n = { tr: 'Yeni desen', en: 'New chart', es: 'Gráfico nuevo', pt: 'Gráfico novo' };
const COPY: L10n = { tr: 'kopya', en: 'copy', es: 'copia', pt: 'cópia' };
const PALETTE_NAMES: Record<string, L10n> = {
  '#f5f0e6': { tr: 'Ekru', en: 'Ecru', es: 'Crudo', pt: 'Cru' },
  '#b5523b': { tr: 'Kiremit', en: 'Terracotta', es: 'Teja', pt: 'Terracota' },
  '#d39a2c': { tr: 'Hardal', en: 'Mustard', es: 'Mostaza', pt: 'Mostarda' },
  '#5f7a61': { tr: 'Adaçayı', en: 'Sage', es: 'Salvia', pt: 'Sálvia' },
  '#46698a': { tr: 'Denim', en: 'Denim', es: 'Vaquero', pt: 'Jeans' },
  '#2f2925': { tr: 'Kömür', en: 'Charcoal', es: 'Carbón', pt: 'Carvão' },
};

export const DEFAULT_PALETTE: Omit<PaletteColor, 'id'>[] = [
  { hex: '#f5f0e6', name: 'Ekru', letter: 'A' },
  { hex: '#b5523b', name: 'Kiremit', letter: 'B' },
  { hex: '#d39a2c', name: 'Hardal', letter: 'C' },
  { hex: '#5f7a61', name: 'Adaçayı', letter: 'D' },
  { hex: '#46698a', name: 'Denim', letter: 'E' },
  { hex: '#2f2925', name: 'Kömür', letter: 'F' },
];

export interface NewChartOptions {
  name?: string;
  craft?: Craft;
  width?: number;
  height?: number;
  mode?: ChartDoc['mode'];
  palette?: Omit<PaletteColor, 'id'>[];
  fill?: number;
}

export function blankChart(o: NewChartOptions = {}): ChartDoc {
  const width = o.width ?? 30;
  const height = o.height ?? 30;
  const now = Date.now();
  return {
    id: uid('grafik'),
    name: o.name ?? NEW_NAME[getLang()],
    craft: o.craft ?? 'knit',
    width,
    height,
    colors: new Array(width * height).fill(o.fill ?? 0),
    symbols: new Array(width * height).fill(''),
    palette: (o.palette ?? DEFAULT_PALETTE.map((p) => ({ ...p, name: PALETTE_NAMES[p.hex]?.[getLang()] ?? p.name }))).map((p) => ({ ...p, id: uid('renk') })),
    mode: o.mode ?? 'flat',
    firstRowRS: true,
    gauge: o.craft === 'crochet' ? { stitches: 18, rows: 20 } : { stitches: 22, rows: 30 },
    proportional: false,
    createdAt: now,
    updatedAt: now,
  };
}

interface ChartsState {
  charts: ChartDoc[];
  add: (c: ChartDoc) => ChartDoc;
  create: (o?: NewChartOptions) => ChartDoc;
  update: (id: string, patch: Partial<ChartDoc>) => void;
  remove: (id: string) => void;
  duplicate: (id: string, name?: string) => ChartDoc | undefined;
  replaceAll: (charts: ChartDoc[]) => void;
}

export const useCharts = create<ChartsState>()(
  persist(
    (set, get) => ({
      charts: [],
      add: (c) => {
        set((s) => ({ charts: [c, ...s.charts] }));
        return c;
      },
      create: (o) => get().add(blankChart(o)),
      update: (id, patch) => set((s) => ({ charts: s.charts.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c)) })),
      remove: (id) => set((s) => ({ charts: s.charts.filter((c) => c.id !== id) })),
      duplicate: (id, name) => {
        const src = get().charts.find((c) => c.id === id);
        if (!src) return undefined;
        const now = Date.now();
        const copy: ChartDoc = { ...src, id: uid('grafik'), name: name ?? `${src.name} (${COPY[getLang()]})`, colors: [...src.colors], symbols: [...src.symbols], createdAt: now, updatedAt: now, progress: undefined };
        set((s) => ({ charts: [copy, ...s.charts] }));
        return copy;
      },
      replaceAll: (charts) => set({ charts }),
    }),
    { name: 'ilmek.grafikler', version: 1 },
  ),
);
