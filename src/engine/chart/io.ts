/** Grafik içe/dışa aktarma (JSON) ve doğrulama */
import type { ChartDoc, ChartRect, PaletteColor } from '@/types';
import { MAX_SIZE, normalize, paletteLetter } from './grid';

export const EXPORT_KIND = 'ilmek-ilmek/kareli';

export interface ChartExport {
  kind: typeof EXPORT_KIND;
  version: 1;
  exportedAt: number;
  charts: ChartDoc[];
}

export function exportCharts(charts: ChartDoc[]): ChartExport {
  return { kind: EXPORT_KIND, version: 1, exportedAt: Date.now(), charts };
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const HEX = /^#[0-9a-f]{6}$/i;

function rect(v: unknown, w: number, h: number): ChartRect | undefined {
  if (!isObj(v)) return undefined;
  const r = { x: Math.round(num(v.x, 0)), y: Math.round(num(v.y, 0)), w: Math.round(num(v.w, 0)), h: Math.round(num(v.h, 0)) };
  if (r.w < 1 || r.h < 1 || r.x < 0 || r.y < 0 || r.x + r.w > w || r.y + r.h > h) return undefined;
  return r;
}

/**
 * Tek bir grafiği doğrular ve onarır. Geçersizse null.
 * @param newId yeni kimlik üretici (içe aktarırken çakışmayı önlemek için)
 */
export function sanitizeChart(v: unknown, newId: (prefix: string) => string): ChartDoc | null {
  if (!isObj(v)) return null;
  const width = Math.round(num(v.width, 0));
  const height = Math.round(num(v.height, 0));
  if (width < 1 || height < 1 || width > MAX_SIZE || height > MAX_SIZE) return null;
  const n = width * height;
  const rawPal = Array.isArray(v.palette) ? v.palette : [];
  const palette: PaletteColor[] = rawPal
    .filter(isObj)
    .slice(0, 26)
    .map((p, i) => ({
      id: newId('renk'),
      hex: typeof p.hex === 'string' && HEX.test(p.hex) ? p.hex.toLowerCase() : '#9e9e9e',
      name: typeof p.name === 'string' ? p.name.slice(0, 60) : paletteLetter(i),
      letter: paletteLetter(i),
      ...(typeof p.yarnId === 'string' ? { yarnId: p.yarnId } : {}),
    }));
  const rawC = Array.isArray(v.colors) ? v.colors : [];
  const rawS = Array.isArray(v.symbols) ? v.symbols : [];
  const colors = Array.from({ length: n }, (_, i) => {
    const c = Math.round(num(rawC[i], -1));
    return c >= 0 && c < palette.length ? c : -1;
  });
  const symbols = Array.from({ length: n }, (_, i) => (typeof rawS[i] === 'string' ? (rawS[i] as string).slice(0, 16) : ''));
  normalize({ width, height, colors, symbols });
  const now = Date.now();
  const gauge = isObj(v.gauge) ? { stitches: Math.max(1, num(v.gauge.stitches, 22)), rows: Math.max(1, num(v.gauge.rows, 30)) } : undefined;
  const progress = isObj(v.progress) ? { row: Math.max(1, Math.round(num(v.progress.row, 1))), stitch: Math.max(1, Math.round(num(v.progress.stitch, 1))) } : undefined;
  return {
    id: newId('grafik'),
    name: typeof v.name === 'string' && v.name.trim() ? v.name.slice(0, 120) : 'Grafik',
    craft: v.craft === 'crochet' ? 'crochet' : 'knit',
    width,
    height,
    colors,
    symbols,
    palette,
    mode: v.mode === 'round' ? 'round' : 'flat',
    firstRowRS: v.firstRowRS !== false,
    gauge,
    proportional: v.proportional === true,
    repeat: rect(v.repeat, width, height),
    notes: typeof v.notes === 'string' ? v.notes.slice(0, 5000) : undefined,
    progress,
    createdAt: num(v.createdAt, now),
    updatedAt: now,
  };
}

/** Dosyadan gelen veriyi grafik listesine çevirir: tek grafik, dizi ya da dışa aktarma paketi */
export function parseChartsJSON(data: unknown, newId: (prefix: string) => string): ChartDoc[] {
  let list: unknown[] = [];
  if (Array.isArray(data)) list = data;
  else if (isObj(data) && Array.isArray(data.charts)) list = data.charts;
  else if (isObj(data)) list = [data];
  return list.map((c) => sanitizeChart(c, newId)).filter((c): c is ChartDoc => !!c);
}
