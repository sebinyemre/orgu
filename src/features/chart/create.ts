/** Yeni grafik oluşturma yardımcıları (boş, şablon, yazı, fotoğraf); adlar geçerli dilde */
import type { ChartDoc, Craft, Lang, PaletteColor } from '@/types';
import { blankChart } from '@/store/charts';
import { nameColor } from '@/lib/color';
import { uid } from '@/lib/id';
import { fillTerms, type TermsCtx } from '@/knowledge/terms';
import { paletteLetter } from '@/engine/chart/grid';
import { textBitmap } from '@/engine/chart/font';
import type { ChartTemplate } from '@/engine/chart/templates';

export const PRESET_SIZES: [number, number][] = [
  [10, 10],
  [20, 20],
  [30, 30],
  [40, 40],
  [24, 32],
  [60, 80],
  [100, 100],
];

/** Varsayılan palet: ekru, kiremit, hardal, adaçayı, denim, kömür */
export const STARTER_HEXES = ['#f5f0e6', '#b5523b', '#d39a2c', '#5f7a61', '#46698a', '#2f2925'];

export function localPalette(hexes: string[], lang: Lang, names?: (string | undefined)[], yarnIds?: (string | undefined)[]): Omit<PaletteColor, 'id'>[] {
  return hexes.map((hex, i) => ({
    hex,
    name: names?.[i] || nameColor(hex, lang),
    letter: paletteLetter(i),
    ...(yarnIds?.[i] ? { yarnId: yarnIds[i] } : {}),
  }));
}

export interface BlankOptions {
  name: string;
  craft: Craft;
  mode: ChartDoc['mode'];
  width: number;
  height: number;
  lang: Lang;
}

export function makeBlank(o: BlankOptions): ChartDoc {
  return blankChart({ name: o.name, craft: o.craft, mode: o.mode, width: o.width, height: o.height, palette: localPalette(STARTER_HEXES, o.lang), fill: 0 });
}

export function makeFromTemplate(t: ChartTemplate, name: string, ctx: TermsCtx): ChartDoc {
  const d = t.build();
  const base = blankChart({ name, craft: t.craft, mode: t.mode, width: d.width, height: d.height, palette: localPalette(d.palette, ctx.lang) });
  return { ...base, colors: d.colors.slice(), symbols: d.symbols.slice(), repeat: d.repeat, notes: d.notes ? fillTerms(d.notes[ctx.lang], ctx) : undefined };
}

export function makeFromText(text: string, o: { name: string; craft: Craft; mode: ChartDoc['mode']; lang: Lang; bg: string; ink: string; margin?: number }): ChartDoc {
  const bmp = textBitmap(text, o.lang);
  const m = o.margin ?? 2;
  const width = Math.max(1, Math.min(200, bmp.width + m * 2));
  const height = Math.max(1, Math.min(200, bmp.height + m * 2));
  const base = blankChart({ name: o.name, craft: o.craft, mode: o.mode, width, height, palette: localPalette([o.bg, o.ink], o.lang), fill: 0 });
  const colors = base.colors.slice();
  for (let y = 0; y < bmp.height; y++)
    for (let x = 0; x < bmp.width; x++) {
      const tx = x + m,
        ty = y + m;
      if (tx < width && ty < height && bmp.cells[y * bmp.width + x]) colors[ty * width + tx] = 1;
    }
  return { ...base, colors };
}

export function makeFromPixels(o: {
  name: string;
  craft: Craft;
  lang: Lang;
  width: number;
  height: number;
  indices: number[];
  hexes: string[];
  names?: (string | undefined)[];
  yarnIds?: (string | undefined)[];
  proportional: boolean;
}): ChartDoc {
  const base = blankChart({ name: o.name, craft: o.craft, mode: 'flat', width: o.width, height: o.height, palette: localPalette(o.hexes, o.lang, o.names, o.yarnIds) });
  return { ...base, colors: o.indices.slice(0, o.width * o.height), proportional: o.proportional };
}

/** Kopya: yeni kimlik, ilerleme sıfır */
export function copyChart(c: ChartDoc, name: string): ChartDoc {
  const now = Date.now();
  return {
    ...c,
    id: uid('grafik'),
    name,
    colors: [...c.colors],
    symbols: [...c.symbols],
    palette: c.palette.map((p) => ({ ...p, id: uid('renk') })),
    progress: undefined,
    createdAt: now,
    updatedAt: now,
  };
}
