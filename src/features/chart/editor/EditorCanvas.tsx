/**
 * Düzenleyici canvas'ı: çizim, yakınlaştırma/kaydırma (tekerlek, iki parmak, el aracı, boşluk tuşu)
 * ve araç mantığı. Hücreler React ile değil, doğrudan canvas'a çizilir.
 */
import { useCallback, useEffect, useRef } from 'react';
import type { ChartDoc, ChartRect } from '@/types';
import { useSettings } from '@/store/settings';
import { toast } from '@/store/toast';
import { useLang } from '@/i18n';
import { cellAspect } from '@/engine/math/gauge';
import { drawChart, drawNumbers, withAlpha } from '@/engine/chart/render';
import {
  clearRegion,
  clipRect,
  eraseCell,
  extractRegion,
  floodFill,
  inBounds,
  lineCells,
  mirrorSymbol,
  normRect,
  paintCell,
  rectCells,
  spanOf,
  symmetryTargets,
  unitAt,
} from '@/engine/chart/grid';
import { textBitmap } from '@/engine/chart/font';
import { useChartPrefs } from '../prefs';
import { useChartTheme, useDpr, useFontsReady } from '../theme';
import { CH } from '../i18n';
import { applyDoc, beginEdit, cancelEdit, commitEdit, placeFloating, setTool, setViewApi, snapshot, touch, useEditor, type ToolId } from './state';

type Meta = Pick<ChartDoc, 'mode' | 'firstRowRS' | 'craft' | 'proportional' | 'gauge'>;

interface Cell {
  x: number;
  y: number;
}

const MIN_SCALE = 2;
const MAX_SCALE = 72;
const PAINT_TOOLS: ToolId[] = ['pencil', 'eraser', 'fill', 'line', 'rect'];

export function EditorCanvas({ meta }: { meta: Meta }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useChartTheme();
  const dpr = useDpr();
  const fonts = useFontsReady();
  const paper = useChartPrefs((s) => s.paper);
  const symbolStyle = useChartPrefs((s) => s.symbolStyle);
  const numbers = useChartPrefs((s) => s.numbers);
  const leftHanded = useSettings((s) => s.leftHanded);
  const lang = useLang();
  const aspect = meta.proportional && meta.gauge ? cellAspect(meta.gauge) : 1;

  const env = useRef({ aspect, meta, theme, dpr, paper, symbolStyle, numbers, leftHanded, lang });
  env.current = { aspect, meta, theme, dpr, paper, symbolStyle, numbers, leftHanded, lang };

  const R = useRef({
    w: 0,
    h: 0,
    scale: 16,
    ox: 0,
    oy: 0,
    fitted: false,
    dims: '',
    raf: 0,
    hover: null as Cell | null,
    preview: null as Cell[] | null,
    rectPreview: null as ChartRect | null,
  });

  /* ── çizim ───────────────────────────────────────────────────── */
  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const r = R.current;
    const E = env.current;
    const s = useEditor.getState();
    const d = s.doc;
    const cw = r.scale * E.aspect,
      ch = r.scale;
    ctx.setTransform(E.dpr, 0, 0, E.dpr, 0, 0);
    ctx.clearRect(0, 0, r.w, r.h);

    // masadaki kağıt yaprağının gölgesi
    ctx.save();
    ctx.shadowColor = E.theme.dark ? withAlpha(E.theme.paper, 0.9) : withAlpha(E.theme.ink, 0.16);
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = E.theme.gridBg;
    ctx.fillRect(r.ox, r.oy, d.width * cw, d.height * ch);
    ctx.restore();

    const common = { cw, ch, dpr: E.dpr, theme: E.theme, paper: E.paper, symbolStyle: E.symbolStyle, leftHanded: E.leftHanded, clip: { x: 0, y: 0, w: r.w, h: r.h } };
    drawChart(ctx, d, { ...common, x: r.ox, y: r.oy, repeat: d.repeat });

    // yüzen bölge
    if (s.floating) {
      const f = s.floating;
      const fx = r.ox + f.x * cw,
        fy = r.oy + f.y * ch;
      ctx.save();
      ctx.shadowColor = E.theme.dark ? withAlpha(E.theme.paper, 0.9) : withAlpha(E.theme.ink, 0.3);
      ctx.shadowBlur = 10;
      ctx.fillStyle = E.theme.gridBg;
      ctx.fillRect(fx, fy, f.region.width * cw, f.region.height * ch);
      ctx.restore();
      drawChart(ctx, { ...f.region, palette: d.palette }, { ...common, x: fx, y: fy });
    }

    // önizleme (çizgi, dikdörtgen)
    if (r.preview?.length) {
      const hex = s.paint !== 'symbol' && s.color >= 0 ? d.palette[s.color]?.hex : undefined;
      ctx.save();
      ctx.fillStyle = hex ? withAlpha(hex, 0.75) : withAlpha(E.theme.accent, 0.25);
      for (const c of r.preview) if (inBounds(d, c.x, c.y)) ctx.fillRect(r.ox + c.x * cw, r.oy + c.y * ch, cw, ch);
      ctx.restore();
    }

    // seçim ve tekrar önizlemesi
    const sel = s.floating ? { x: s.floating.x, y: s.floating.y, w: s.floating.region.width, h: s.floating.region.height } : s.selection;
    if (sel && s.tool === 'select') {
      ctx.save();
      ctx.fillStyle = withAlpha(E.theme.accent, 0.08);
      ctx.fillRect(r.ox + sel.x * cw, r.oy + sel.y * ch, sel.w * cw, sel.h * ch);
      ctx.strokeStyle = E.theme.accent;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(r.ox + sel.x * cw, r.oy + sel.y * ch, sel.w * cw, sel.h * ch);
      ctx.restore();
    }
    if (r.rectPreview) {
      ctx.save();
      ctx.strokeStyle = E.theme.danger;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(r.ox + r.rectPreview.x * cw, r.oy + r.rectPreview.y * ch, r.rectPreview.w * cw, r.rectPreview.h * ch);
      ctx.restore();
    }

    // simetri eksenleri
    if (s.symmetry !== 'none' && PAINT_TOOLS.includes(s.tool)) {
      ctx.save();
      ctx.strokeStyle = withAlpha(E.theme.accent, 0.8);
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 5]);
      ctx.beginPath();
      if (s.symmetry === 'v' || s.symmetry === 'both') {
        const ax = r.ox + (d.width * cw) / 2;
        ctx.moveTo(ax, r.oy - 8);
        ctx.lineTo(ax, r.oy + d.height * ch + 8);
      }
      if (s.symmetry === 'h' || s.symmetry === 'both') {
        const ay = r.oy + (d.height * ch) / 2;
        ctx.moveTo(r.ox - 8, ay);
        ctx.lineTo(r.ox + d.width * cw + 8, ay);
      }
      ctx.stroke();
      ctx.restore();
    }

    // fare imleci: hücre çerçevesi ya da yazı damgası gölgesi
    if (r.hover && inBounds(d, r.hover.x, r.hover.y)) {
      const hv = r.hover;
      ctx.save();
      if (s.tool === 'text' && s.stampText.trim()) {
        const bmp = textBitmap(s.stampText, E.lang);
        const hex = s.color >= 0 ? d.palette[s.color]?.hex : undefined;
        ctx.fillStyle = hex ? withAlpha(hex, 0.7) : withAlpha(E.theme.accent, 0.4);
        for (let y = 0; y < bmp.height; y++)
          for (let x = 0; x < bmp.width; x++) if (bmp.cells[y * bmp.width + x] && inBounds(d, hv.x + x, hv.y + y)) ctx.fillRect(r.ox + (hv.x + x) * cw, r.oy + (hv.y + y) * ch, cw, ch);
        ctx.strokeStyle = E.theme.accent;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(r.ox + hv.x * cw, r.oy + hv.y * ch, Math.min(bmp.width, d.width - hv.x) * cw, Math.min(bmp.height, d.height - hv.y) * ch);
      } else if (s.tool !== 'hand' && s.tool !== 'select') {
        const span = s.tool === 'pencil' && s.paint !== 'color' ? spanOf(s.symbol) : 1;
        const x0 = Math.min(hv.x, d.width - span);
        ctx.strokeStyle = E.theme.accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(r.ox + x0 * cw + 1, r.oy + hv.y * ch + 1, span * cw - 2, ch - 2);
      }
      ctx.restore();
    }

    if (E.numbers) drawNumbers(ctx, d, { x: r.ox, y: r.oy, cw, ch }, E.theme, { mode: E.meta.mode, firstRowRS: E.meta.firstRowRS, leftHanded: E.leftHanded, sticky: { w: r.w, h: r.h }, paper: E.paper });
  }, []);

  const requestDraw = useCallback(() => {
    if (R.current.raf) return;
    R.current.raf = requestAnimationFrame(() => {
      R.current.raf = 0;
      draw();
    });
  }, [draw]);

  /* ── görünüm ─────────────────────────────────────────────────── */
  const syncZoom = () => {
    const z = Math.round(R.current.scale * 10) / 10;
    if (useEditor.getState().zoom !== z) useEditor.setState({ zoom: z });
  };

  const fit = useCallback(() => {
    const r = R.current;
    const d = useEditor.getState().doc;
    if (!r.w || !r.h) return;
    const a = env.current.aspect;
    const num = env.current.numbers ? 1 : 0;
    const sidePad = 16 + num * (String(Math.max(d.width, d.height)).length * 9 + 14);
    const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE * 0.6, (r.w - sidePad * 2) / (d.width * a), (r.h - 24 - num * 22) / d.height));
    r.scale = s;
    r.ox = Math.round((r.w - d.width * s * a) / 2);
    r.oy = Math.round((r.h - num * 18 - d.height * s) / 2);
    r.fitted = true;
    syncZoom();
    requestDraw();
  }, [requestDraw]);

  const zoomAt = useCallback(
    (ns: number, cx: number, cy: number) => {
      const r = R.current;
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, ns));
      const k = next / r.scale;
      r.ox = cx - (cx - r.ox) * k;
      r.oy = cy - (cy - r.oy) * k;
      r.scale = next;
      clampView();
      syncZoom();
      requestDraw();
    },
    [requestDraw],
  );

  /** grafik tamamen ekrandan çıkmasın */
  const clampView = () => {
    const r = R.current;
    const d = useEditor.getState().doc;
    const W = d.width * r.scale * env.current.aspect,
      H = d.height * r.scale;
    const keep = 48;
    r.ox = Math.min(r.w - keep, Math.max(keep - W, r.ox));
    r.oy = Math.min(r.h - keep, Math.max(keep - H, r.oy));
  };

  useEffect(() => {
    setViewApi({
      zoomBy: (f) => zoomAt(R.current.scale * f, R.current.w / 2, R.current.h / 2),
      fit,
      centerCell: () => {
        const r = R.current;
        return { x: Math.floor((r.w / 2 - r.ox) / (r.scale * env.current.aspect)), y: Math.floor((r.h / 2 - r.oy) / r.scale) };
      },
    });
    return () => setViewApi(null);
  }, [fit, zoomAt]);

  // boyut
  useEffect(() => {
    const wrap = wrapRef.current,
      cv = canvasRef.current;
    if (!wrap || !cv) return;
    const ro = new ResizeObserver(() => {
      const rect = wrap.getBoundingClientRect();
      const r = R.current;
      const w = Math.max(1, Math.floor(rect.width)),
        h = Math.max(1, Math.floor(rect.height));
      if (r.fitted && r.w && r.h) {
        // ortayı koru
        r.ox += (w - r.w) / 2;
        r.oy += (h - r.h) / 2;
      }
      r.w = w;
      r.h = h;
      const D = env.current.dpr;
      cv.width = Math.round(w * D);
      cv.height = Math.round(h * D);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      if (!r.fitted) fit();
      else requestDraw();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [fit, requestDraw]);

  // dpr değişince canvas boyutu
  useEffect(() => {
    const cv = canvasRef.current;
    const r = R.current;
    if (!cv || !r.w) return;
    cv.width = Math.round(r.w * dpr);
    cv.height = Math.round(r.h * dpr);
    requestDraw();
  }, [dpr, requestDraw]);

  // durum değişince yeniden çiz; boyut değişince sığdır
  useEffect(
    () =>
      useEditor.subscribe((s) => {
        const dims = `${s.doc.width}x${s.doc.height}`;
        if (R.current.dims !== dims) {
          const first = !R.current.dims;
          R.current.dims = dims;
          if (!first) fit();
        }
        requestDraw();
      }),
    [fit, requestDraw],
  );
  useEffect(() => {
    if (R.current.fitted) fit();
  }, [aspect, numbers, fit]);
  useEffect(requestDraw, [theme, paper, symbolStyle, leftHanded, fonts, meta.mode, meta.firstRowRS, lang, requestDraw]);

  /* ── araçlar ve hareketler ───────────────────────────────────── */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const pointers = new Map<number, { x: number; y: number; type: string }>();
    let mode: 'none' | 'tool' | 'pan' | 'pinch' = 'none';
    let space = false;
    let last = { x: 0, y: 0 };
    let pinch = { dist: 1, cx: 0, cy: 0, scale: 1 };
    let stroke: {
      tool: ToolId;
      start: Cell;
      last: Cell;
      units: Set<number>;
      floatFrom?: Cell;
      floatAt?: Cell;
      selecting?: boolean;
    } | null = null;

    const local = (e: PointerEvent | WheelEvent) => {
      const rect = cv.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const cellOf = (p: { x: number; y: number }): Cell => {
      const r = R.current;
      return { x: Math.floor((p.x - r.ox) / (r.scale * env.current.aspect)), y: Math.floor((p.y - r.oy) / r.scale) };
    };
    const clampCell = (c: Cell): Cell => {
      const d = useEditor.getState().doc;
      return { x: Math.max(0, Math.min(d.width - 1, c.x)), y: Math.max(0, Math.min(d.height - 1, c.y)) };
    };

    const paintAt = (c: Cell, tool: ToolId) => {
      const s = useEditor.getState();
      const d = s.doc;
      const span = tool === 'eraser' || s.paint === 'color' ? 1 : spanOf(s.symbol);
      for (const tg of symmetryTargets(d.width, d.height, c.x, c.y, s.symmetry, span)) {
        if (!inBounds(d, tg.x, tg.y)) continue;
        if (tool === 'eraser') {
          eraseCell(d, tg.x, tg.y, s.paint);
          continue;
        }
        if (span > 1 && stroke?.units.has(tg.y * d.width + tg.x)) continue;
        const res = paintCell(d, tg.x, tg.y, { mode: s.paint, color: s.color, symbol: tg.flipX ? mirrorSymbol(s.symbol) : s.symbol });
        if (res && span > 1 && stroke) for (let i = 0; i < res.span; i++) stroke.units.add(tg.y * d.width + res.x + i);
      }
    };

    const shapeCells = (tool: ToolId, a: Cell, b: Cell): Cell[] => {
      const s = useEditor.getState();
      const d = s.doc;
      const base = tool === 'line' ? lineCells(a.x, a.y, b.x, b.y) : rectCells(a.x, a.y, b.x, b.y, s.rectFilled);
      const out: Cell[] = [];
      for (const [x, y] of base) for (const tg of symmetryTargets(d.width, d.height, x, y, s.symmetry)) out.push({ x: tg.x, y: tg.y });
      return out;
    };

    const pick = (c: Cell) => {
      const s = useEditor.getState();
      const d = s.doc;
      if (!inBounds(d, c.x, c.y)) return;
      const col = d.colors[c.y * d.width + c.x];
      const u = unitAt(d, c.x, c.y);
      useEditor.setState({ color: col >= 0 ? col : s.color, symbol: u.id || s.symbol });
    };

    const insideFloating = (c: Cell) => {
      const f = useEditor.getState().floating;
      return !!f && c.x >= f.x && c.y >= f.y && c.x < f.x + f.region.width && c.y < f.y + f.region.height;
    };
    const insideSel = (c: Cell) => {
      const sel = useEditor.getState().selection;
      return !!sel && c.x >= sel.x && c.y >= sel.y && c.x < sel.x + sel.w && c.y < sel.y + sel.h;
    };

    const toolDown = (p: { x: number; y: number }) => {
      const s = useEditor.getState();
      const tool = s.tool;
      const raw = cellOf(p);
      const d = s.doc;
      stroke = { tool, start: raw, last: raw, units: new Set() };
      switch (tool) {
        case 'pencil':
        case 'eraser':
          beginEdit();
          if (inBounds(d, raw.x, raw.y)) paintAt(raw, tool);
          touch();
          break;
        case 'fill': {
          if (!inBounds(d, raw.x, raw.y)) break;
          if (s.paint !== 'color' && spanOf(s.symbol) > 1) {
            toast(CH[env.current.lang].cableNoFill);
            break;
          }
          beginEdit();
          for (const tg of symmetryTargets(d.width, d.height, raw.x, raw.y, s.symmetry)) floodFill(d, tg.x, tg.y, { mode: s.paint, color: s.color, symbol: s.symbol });
          commitEdit();
          break;
        }
        case 'line':
        case 'rect': {
          const c = clampCell(raw);
          stroke.start = c;
          R.current.preview = shapeCells(tool, c, c);
          touch();
          break;
        }
        case 'picker':
          pick(raw);
          break;
        case 'text': {
          if (!inBounds(d, raw.x, raw.y) || !s.stampText.trim()) break;
          const bmp = textBitmap(s.stampText, env.current.lang);
          beginEdit();
          for (let y = 0; y < bmp.height; y++)
            for (let x = 0; x < bmp.width; x++)
              if (bmp.cells[y * bmp.width + x] && inBounds(d, raw.x + x, raw.y + y)) paintCell(d, raw.x + x, raw.y + y, { mode: s.paint, color: s.color, symbol: s.symbol });
          commitEdit();
          break;
        }
        case 'repeat': {
          const c = clampCell(raw);
          stroke.start = c;
          R.current.rectPreview = normRect(c.x, c.y, c.x, c.y);
          touch();
          break;
        }
        case 'select': {
          if (s.floating) {
            if (insideFloating(raw)) {
              stroke.floatFrom = raw;
              stroke.floatAt = { x: s.floating.x, y: s.floating.y };
              break;
            }
            placeFloating();
          }
          if (useEditor.getState().selection && insideSel(raw)) {
            // seçili alanı kaldır ve taşı
            const sel = useEditor.getState().selection!;
            beginEdit();
            const region = extractRegion(d, sel);
            clearRegion(d, sel);
            useEditor.setState({ floating: { x: sel.x, y: sel.y, region } });
            stroke.floatFrom = raw;
            stroke.floatAt = { x: sel.x, y: sel.y };
            touch();
            break;
          }
          const c = clampCell(raw);
          stroke.start = c;
          stroke.selecting = true;
          useEditor.setState({ selection: normRect(c.x, c.y, c.x, c.y) });
          break;
        }
        default:
          break;
      }
    };

    const toolMove = (p: { x: number; y: number }) => {
      if (!stroke) return;
      const s = useEditor.getState();
      const raw = cellOf(p);
      if (raw.x === stroke.last.x && raw.y === stroke.last.y) return;
      const prev = stroke.last;
      stroke.last = raw;
      switch (stroke.tool) {
        case 'pencil':
        case 'eraser':
          for (const [x, y] of lineCells(prev.x, prev.y, raw.x, raw.y).slice(1)) if (inBounds(s.doc, x, y)) paintAt({ x, y }, stroke.tool);
          touch();
          break;
        case 'line':
        case 'rect':
          R.current.preview = shapeCells(stroke.tool, stroke.start, clampCell(raw));
          touch();
          break;
        case 'picker':
          pick(raw);
          break;
        case 'repeat': {
          const c = clampCell(raw);
          R.current.rectPreview = normRect(stroke.start.x, stroke.start.y, c.x, c.y);
          touch();
          break;
        }
        case 'select':
          if (stroke.floatFrom && stroke.floatAt && s.floating) {
            useEditor.setState({ floating: { ...s.floating, x: stroke.floatAt.x + raw.x - stroke.floatFrom.x, y: stroke.floatAt.y + raw.y - stroke.floatFrom.y } });
          } else if (stroke.selecting) {
            const c = clampCell(raw);
            useEditor.setState({ selection: normRect(stroke.start.x, stroke.start.y, c.x, c.y) });
          }
          break;
        default:
          break;
      }
    };

    const toolUp = () => {
      if (!stroke) return;
      const s = useEditor.getState();
      const st = stroke;
      stroke = null;
      switch (st.tool) {
        case 'pencil':
        case 'eraser':
          commitEdit();
          break;
        case 'line':
        case 'rect': {
          const cells = R.current.preview ?? [];
          R.current.preview = null;
          beginEdit();
          stroke = { tool: 'pencil', start: st.start, last: st.start, units: new Set() };
          for (const c of cells) if (inBounds(s.doc, c.x, c.y)) paintCellNoSym(c);
          stroke = null;
          commitEdit();
          break;
        }
        case 'picker':
          setTool(s.lastTool === 'picker' ? 'pencil' : s.lastTool);
          break;
        case 'repeat': {
          const rp = R.current.rectPreview;
          R.current.rectPreview = null;
          if (rp) {
            const r2 = clipRect(rp, s.doc.width, s.doc.height);
            if (r2) applyDoc({ ...snapshot(s.doc), repeat: r2 });
          }
          touch();
          break;
        }
        case 'select':
          if (st.floatFrom) touch();
          break;
        default:
          break;
      }
    };

    /** dikdörtgen/çizgi uygulaması: simetri noktaları zaten hesaplandı */
    const paintCellNoSym = (c: Cell) => {
      const s = useEditor.getState();
      const d = s.doc;
      const span = s.paint === 'color' ? 1 : spanOf(s.symbol);
      if (span > 1 && stroke?.units.has(c.y * d.width + c.x)) return;
      const res = paintCell(d, c.x, c.y, { mode: s.paint, color: s.color, symbol: s.symbol });
      if (res && span > 1 && stroke) for (let i = 0; i < res.span; i++) stroke.units.add(c.y * d.width + res.x + i);
    };

    const cancelTool = () => {
      if (!stroke) return;
      R.current.preview = null;
      R.current.rectPreview = null;
      if (stroke.tool === 'pencil' || stroke.tool === 'eraser') cancelEdit();
      stroke = null;
      touch();
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button === 2) return;
      cv.setPointerCapture(e.pointerId);
      const p = local(e);
      pointers.set(e.pointerId, { ...p, type: e.pointerType });
      R.current.hover = e.pointerType === 'mouse' ? cellOf(p) : null;
      if (pointers.size === 2) {
        if (mode === 'tool') cancelTool();
        const [a, b] = [...pointers.values()];
        pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, scale: R.current.scale };
        mode = 'pinch';
        return;
      }
      if (pointers.size > 2) return;
      last = p;
      const tool = useEditor.getState().tool;
      if (e.button === 1 || space || tool === 'hand') {
        mode = 'pan';
        cv.style.cursor = 'grabbing';
        return;
      }
      mode = 'tool';
      toolDown(p);
    };

    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (!pointers.has(e.pointerId)) {
        if (e.pointerType === 'mouse') {
          const c = cellOf(p);
          const h = R.current.hover;
          if (!h || h.x !== c.x || h.y !== c.y) {
            R.current.hover = c;
            requestDraw();
          }
        }
        return;
      }
      pointers.set(e.pointerId, { ...p, type: e.pointerType });
      if (mode === 'pinch' && pointers.size >= 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const cx = (a.x + b.x) / 2,
          cy = (a.y + b.y) / 2;
        const r = R.current;
        r.ox += cx - pinch.cx;
        r.oy += cy - pinch.cy;
        pinch.cx = cx;
        pinch.cy = cy;
        zoomAt((pinch.scale * dist) / pinch.dist, cx, cy);
        return;
      }
      if (mode === 'pan') {
        R.current.ox += p.x - last.x;
        R.current.oy += p.y - last.y;
        last = p;
        clampView();
        requestDraw();
        return;
      }
      if (mode === 'tool') {
        if (e.pointerType === 'mouse') R.current.hover = cellOf(p);
        toolMove(p);
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      if (mode === 'tool') toolUp();
      if (pointers.size === 1 && mode === 'pinch') {
        mode = 'pan';
        last = [...pointers.values()][0];
        return;
      }
      if (pointers.size === 0) {
        mode = 'none';
        cv.style.cursor = '';
      }
    };

    const onCancel = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (mode === 'tool') cancelTool();
      if (pointers.size === 0) mode = 'none';
    };

    const onLeave = () => {
      if (R.current.hover) {
        R.current.hover = null;
        requestDraw();
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = local(e);
      const mouseWheel = e.deltaMode === 1 || (e.deltaX === 0 && Math.abs(e.deltaY) >= 40 && Number.isInteger(e.deltaY));
      if (e.ctrlKey || e.metaKey || mouseWheel) {
        const k = e.deltaMode === 1 ? 0.06 : e.ctrlKey ? 0.012 : 0.0018;
        zoomAt(R.current.scale * Math.exp(-e.deltaY * k), p.x, p.y);
      } else {
        R.current.ox -= e.deltaX;
        R.current.oy -= e.deltaY;
        clampView();
        requestDraw();
      }
    };

    const isTyping = () => {
      const a = document.activeElement as HTMLElement | null;
      return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const a = document.activeElement;
      if (e.code === 'Space' && !isTyping() && (!a || a === document.body || a === cv)) {
        if (!space) {
          space = true;
          cv.style.cursor = 'grab';
        }
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        space = false;
        cv.style.cursor = '';
      }
    };

    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('pointercancel', onCancel);
    cv.addEventListener('pointerleave', onLeave);
    cv.addEventListener('wheel', onWheel, { passive: false });
    const noMenu = (e: Event) => e.preventDefault();
    cv.addEventListener('contextmenu', noMenu);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      cv.removeEventListener('pointerdown', onDown);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('pointercancel', onCancel);
      cv.removeEventListener('pointerleave', onLeave);
      cv.removeEventListener('wheel', onWheel);
      cv.removeEventListener('contextmenu', noMenu);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [requestDraw, zoomAt]);

  const tool = useEditor((s) => s.tool);
  const cursor = tool === 'hand' ? 'grab' : tool === 'select' ? 'default' : tool === 'picker' ? 'copy' : 'crosshair';

  return (
    <div ref={wrapRef} className="chart-stage-canvas">
      <canvas ref={canvasRef} className="chart-canvas" style={{ cursor }} tabIndex={-1} aria-hidden />
    </div>
  );
}
