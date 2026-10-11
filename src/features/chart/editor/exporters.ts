/** PNG çıktısı (başlık, numaralı grafik, renk ve sembol açıklamaları) ve yazdırma görüntüsü */
import type { ChartDoc } from '@/types';
import type { SymbolStyle } from '@/knowledge/symbols';
import { SYMBOL_BY_ID, symbolName } from '@/knowledge/symbols';
import type { TermsCtx } from '@/knowledge/terms';
import { COMMON } from '@/i18n/common';
import { cellAspect } from '@/engine/math/gauge';
import { drawSymbol } from '@/engine/chart/draw';
import { colorCounts, usedSymbols } from '@/engine/chart/grid';
import { PRINT_THEME, renderStaticChart, withAlpha, type PaperStyle } from '@/engine/chart/render';
import { downloadCanvas, slugify } from '@/lib/download';
import type { ChartMsgs } from '../i18n';

export interface ExportCtx {
  chart: ChartDoc;
  terms: TermsCtx;
  leftHanded: boolean;
  paper: PaperStyle;
  symbolStyle: SymbolStyle;
  t: ChartMsgs;
}

/** Numaralı grafik görüntüsü (her zaman açık renk kağıtta) */
export function chartImage(e: ExportCtx, maxWidth = 1200, dpr = 2): HTMLCanvasElement {
  const c = e.chart;
  const aspect = c.proportional && c.gauge ? cellAspect(c.gauge) : 1;
  const cell = Math.max(8, Math.min(26, Math.floor(maxWidth / (c.width * aspect + 4))));
  const cv = document.createElement('canvas');
  renderStaticChart(cv, c, { cell, aspect, theme: PRINT_THEME, dpr, paper: e.paper, symbolStyle: e.symbolStyle, repeat: c.repeat, numbers: { mode: c.mode, firstRowRS: c.firstRowRS, leftHanded: e.leftHanded }, pad: 4 });
  return cv;
}

export function exportPng(e: ExportCtx): void {
  const c = e.chart;
  const lang = e.terms.lang;
  const common = COMMON[lang];
  const dpr = 2;
  const img = chartImage(e, 1200, dpr);
  const imgW = img.width / dpr,
    imgH = img.height / dpr;
  const pad = 32;
  const W = Math.max(640, imgW + pad * 2);
  const counts = colorCounts(c, c.palette.length).counts;
  const usedColors = c.palette.map((p, i) => ({ p, n: counts[i] })).filter((x) => x.n > 0);
  const syms = usedSymbols(c)
    .map((id) => SYMBOL_BY_ID[id])
    .filter(Boolean);
  const rowH = 30;
  const legendH = (usedColors.length ? 34 + usedColors.length * rowH : 0) + (syms.length ? 40 + syms.length * rowH : 0);
  const titleH = 78;
  const H = pad + titleH + imgH + 20 + legendH + pad + 18;

  const cv = document.createElement('canvas');
  cv.width = Math.ceil(W * dpr);
  cv.height = Math.ceil(H * dpr);
  const ctx = cv.getContext('2d')!;
  ctx.scale(dpr, dpr);
  const th = PRINT_THEME;
  ctx.fillStyle = th.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = th.ink;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `600 28px Fraunces, Georgia, serif`;
  ctx.fillText(c.name, pad, pad + 28, W - pad * 2);
  ctx.font = `700 14px ${th.fontBody}`;
  ctx.fillStyle = th.ink3;
  const sub = [e.t.pngSize(c.width, c.height), c.craft === 'knit' ? common.knit : common.crochet, c.mode === 'round' ? e.t.roundLong : e.t.flatLong].join(' · ');
  ctx.fillText(sub, pad, pad + 52);

  let y = pad + titleH;
  ctx.drawImage(img, Math.round((W - imgW) / 2), y, imgW, imgH);
  y += imgH + 20;

  const heading = (txt: string) => {
    ctx.font = `800 13px ${th.fontBody}`;
    ctx.fillStyle = th.ink3;
    ctx.fillText(txt.toLocaleUpperCase(lang), pad, y + 16);
    y += 30;
  };
  if (usedColors.length) {
    heading(e.t.legendColors);
    for (const { p, n } of usedColors) {
      ctx.fillStyle = p.hex;
      ctx.strokeStyle = th.gridStrong;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect?.(pad, y + 3, 22, 22, 5);
      if (!ctx.roundRect) ctx.rect(pad, y + 3, 22, 22);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = th.ink;
      ctx.font = `800 15px ${th.fontBody}`;
      ctx.fillText(p.letter, pad + 32, y + 20);
      ctx.font = `600 15px ${th.fontBody}`;
      ctx.fillText(`${p.name} · ${e.t.stitchCount(n)}`, pad + 56, y + 20, W - pad * 2 - 56);
      y += rowH;
    }
    y += 6;
  }
  if (syms.length) {
    heading(e.t.legendSymbols);
    for (const s of syms) {
      const span = s.span ?? 1;
      const bw = 22 * span;
      ctx.fillStyle = s.bg ? withAlpha(th.ink3, 0.42) : th.gridBg;
      ctx.fillRect(pad, y + 3, bw, 22);
      ctx.strokeStyle = th.gridStrong;
      ctx.strokeRect(pad + 0.5, y + 3.5, bw - 1, 21);
      drawSymbol(ctx, s, pad, y + 3, bw, 22, { ink: th.ink, bg: th.gridBg, style: e.symbolStyle, lineWidth: 2 });
      ctx.fillStyle = th.ink;
      ctx.font = `700 15px ${th.fontBody}`;
      const name = symbolName(s, e.terms);
      const x0 = pad + bw + 12;
      ctx.fillText(name, x0, y + 20, W - x0 - pad);
      if (c.craft === 'knit' && s.rs?.[lang]) {
        const w = ctx.measureText(name).width;
        ctx.font = `500 14px ${th.fontBody}`;
        ctx.fillStyle = th.ink3;
        ctx.fillText(`  ${e.t.rsSide}: ${s.rs[lang]} · ${e.t.wsSide}: ${s.ws?.[lang] ?? ''}`, x0 + w, y + 20, Math.max(40, W - x0 - w - pad));
      }
      y += rowH;
    }
  }
  ctx.font = `600 12px ${th.fontBody}`;
  ctx.fillStyle = th.ink3;
  ctx.textAlign = 'right';
  ctx.fillText(common.appName, W - pad, H - 14);
  downloadCanvas(cv, `${slugify(c.name)}.png`);
}
