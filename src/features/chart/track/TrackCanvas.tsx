/**
 * Takip modu canvas'ı: mıknatıs cetvel (sürüklenebilir), bitmiş sıralarda fosforlu bant,
 * üstteki sıralar soluk, sıradaki ilmek işareti ve okuma yönü oku.
 */
import { useCallback, useEffect, useRef } from 'react';
import type { ChartDoc } from '@/types';
import { useSettings } from '@/store/settings';
import { cellAspect } from '@/engine/math/gauge';
import { drawChart, drawNumbers, hash01, numberMargins, withAlpha } from '@/engine/chart/render';
import { rowSide, rowUnits } from '@/engine/chart/grid';
import { useChartPrefs } from '../prefs';
import { useChartTheme, useDpr, useFontsReady } from '../theme';

interface Props {
  chart: ChartDoc;
  row: number;
  stitch: number;
  onSetPos: (row: number, stitch: number) => void;
  label: string;
}

export function TrackCanvas({ chart, row, stitch, onSetPos, label }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useChartTheme();
  const dpr = useDpr();
  const fonts = useFontsReady();
  const paper = useChartPrefs((s) => s.paper);
  const symbolStyle = useChartPrefs((s) => s.symbolStyle);
  const leftHanded = useSettings((s) => s.leftHanded);
  const aspect = chart.proportional && chart.gauge ? cellAspect(chart.gauge) : 1;

  const env = useRef({ chart, row, stitch, theme, dpr, paper, symbolStyle, leftHanded, aspect, onSetPos });
  env.current = { chart, row, stitch, theme, dpr, paper, symbolStyle, leftHanded, aspect, onSetPos };
  const V = useRef({ w: 0, h: 0, scale: 20, ox: 0, oy: 0, fitted: false, raf: 0, anim: 0 });

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const E = env.current;
    const v = V.current;
    const c = E.chart;
    const cw = v.scale * E.aspect,
      ch = v.scale;
    ctx.setTransform(E.dpr, 0, 0, E.dpr, 0, 0);
    ctx.clearRect(0, 0, v.w, v.h);
    ctx.save();
    ctx.shadowColor = E.theme.dark ? withAlpha(E.theme.paper, 0.9) : withAlpha(E.theme.ink, 0.16);
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = E.theme.gridBg;
    ctx.fillRect(v.ox, v.oy, c.width * cw, c.height * ch);
    ctx.restore();
    drawChart(ctx, c, { x: v.ox, y: v.oy, cw, ch, dpr: E.dpr, theme: E.theme, paper: E.paper, symbolStyle: E.symbolStyle, leftHanded: E.leftHanded, clip: { x: 0, y: 0, w: v.w, h: v.h }, repeat: c.repeat });

    const r = Math.max(1, Math.min(c.height, E.row));
    const y = c.height - r;
    const top = v.oy + y * ch;
    const W = c.width * cw;

    // bitmiş sıralar: fosforlu bant şeritleri
    for (let yy = y + 1; yy < c.height; yy++) {
      const ty = v.oy + yy * ch;
      if (ty > v.h || ty + ch < 0) continue;
      const j = (k: number) => (hash01(yy, k) - 0.5) * Math.min(6, ch * 0.18);
      ctx.fillStyle = E.theme.highlight;
      ctx.beginPath();
      ctx.moveTo(v.ox - 4 + j(1), ty + 1 + j(2) * 0.3);
      ctx.lineTo(v.ox + W + 4 + j(3), ty + 1 + j(4) * 0.3);
      ctx.lineTo(v.ox + W + 4 + j(5), ty + ch - 1);
      ctx.lineTo(v.ox - 4 + j(6), ty + ch - 1);
      ctx.closePath();
      ctx.fill();
    }

    // üstteki sıralar soluk
    if (y > 0) {
      ctx.fillStyle = withAlpha(E.theme.paper, 0.66);
      ctx.fillRect(v.ox - 2, v.oy - 2, W + 4, y * ch + 2);
    }

    // sıradaki ilmeğe kadar örülenler
    const side = rowSide(r, c, E.leftHanded);
    const units = rowUnits(c, y, side.dir);
    const done = Math.max(0, Math.min(units.length, E.stitch - 1));
    ctx.fillStyle = E.theme.highlightStrong;
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < done; i++) ctx.fillRect(v.ox + units[i].x * cw, top, units[i].span * cw, ch);
    ctx.globalAlpha = 1;

    // mıknatıs cetvel: sıranın hemen üstünde, ekran boyunca
    const barH = Math.max(14, Math.min(34, ch * 0.9));
    const barTop = top - barH;
    ctx.save();
    ctx.fillStyle = E.theme.ruler;
    ctx.fillRect(0, barTop, v.w, barH);
    ctx.fillStyle = withAlpha(E.theme.rulerEdge, 0.9);
    ctx.fillRect(0, top - 2, v.w, 2.5);
    ctx.fillRect(0, top + ch - 0.5, v.w, 2.5);
    // tutamak
    const gx = v.w - 34;
    ctx.fillStyle = E.theme.rulerEdge;
    for (let i = 0; i < 3; i++)
      for (let k = 0; k < 2; k++) {
        ctx.beginPath();
        ctx.arc(gx + i * 8, barTop + barH / 2 + (k - 0.5) * 7, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    // okuma yönü oku (sıranın başladığı kenarda)
    const ay = barTop + barH / 2;
    const rtl = side.dir === 'rtl';
    const startX = rtl ? Math.min(v.w - 60, v.ox + W - 6) : Math.max(14, v.ox + 6);
    const len = Math.min(64, Math.max(30, W * 0.25));
    const endX = rtl ? startX - len : startX + len;
    ctx.strokeStyle = E.theme.rulerEdge;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, ay);
    ctx.lineTo(endX, ay);
    const hd = rtl ? 1 : -1;
    ctx.moveTo(endX + hd * 7, ay - 6);
    ctx.lineTo(endX, ay);
    ctx.lineTo(endX + hd * 7, ay + 6);
    ctx.stroke();
    ctx.restore();

    // sıradaki ilmek
    const cur = units[Math.min(units.length - 1, E.stitch - 1)];
    if (cur && E.stitch <= units.length) {
      const x = v.ox + cur.x * cw;
      ctx.save();
      // iki tonlu işaret: her renk karenin üstünde görünsün
      const lw = Math.max(2, Math.min(4, ch * 0.14));
      ctx.strokeStyle = E.theme.ink;
      ctx.lineWidth = lw + 2;
      ctx.strokeRect(x + 1, top + 1, cur.span * cw - 2, ch - 2);
      ctx.strokeStyle = E.theme.gridBg;
      ctx.lineWidth = Math.max(1, lw * 0.45);
      ctx.strokeRect(x + 1, top + 1, cur.span * cw - 2, ch - 2);
      ctx.fillStyle = E.theme.danger;
      const mx = x + (cur.span * cw) / 2;
      ctx.beginPath();
      ctx.moveTo(mx - 6, top - 9);
      ctx.lineTo(mx + 6, top - 9);
      ctx.lineTo(mx, top - 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    drawNumbers(ctx, c, { x: v.ox, y: v.oy, cw, ch }, E.theme, { mode: c.mode, firstRowRS: c.firstRowRS, leftHanded: E.leftHanded, sticky: { w: v.w, h: v.h }, paper: E.paper, activeRow: r });
  }, []);

  const requestDraw = useCallback(() => {
    if (V.current.raf) return;
    V.current.raf = requestAnimationFrame(() => {
      V.current.raf = 0;
      draw();
    });
  }, [draw]);

  const fit = useCallback(() => {
    const v = V.current;
    const c = env.current.chart;
    if (!v.w) return;
    const m = numberMargins(c.width, c.height, 20, 20);
    const s = Math.max(6, Math.min(44, (v.w - m.side * 2 - 16) / (c.width * env.current.aspect)));
    v.scale = s;
    v.ox = Math.round((v.w - c.width * s * env.current.aspect) / 2);
    const y = c.height - env.current.row;
    v.oy = Math.round(v.h * 0.58 - (y + 0.5) * s);
    // grafik kısa ise ortala
    if (c.height * s < v.h - 60) v.oy = Math.round((v.h - c.height * s) / 2 + 6);
    v.fitted = true;
    requestDraw();
  }, [requestDraw]);

  /** sıra ekrandan çıkarsa yumuşakça ortala */
  const follow = useCallback(() => {
    const v = V.current;
    const c = env.current.chart;
    const y = c.height - env.current.row;
    const top = v.oy + y * v.scale;
    if (top > v.h * 0.25 && top + v.scale < v.h * 0.85) return requestDraw();
    const target = Math.round(v.h * 0.58 - (y + 0.5) * v.scale);
    const from = v.oy;
    const t0 = performance.now();
    cancelAnimationFrame(v.anim);
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 220);
      v.oy = from + (target - from) * (1 - Math.pow(1 - k, 3));
      draw();
      if (k < 1) v.anim = requestAnimationFrame(step);
    };
    v.anim = requestAnimationFrame(step);
  }, [draw, requestDraw]);

  useEffect(() => {
    const wrap = wrapRef.current,
      cv = canvasRef.current;
    if (!wrap || !cv) return;
    const ro = new ResizeObserver(() => {
      const rect = wrap.getBoundingClientRect();
      const v = V.current;
      v.w = Math.max(1, Math.floor(rect.width));
      v.h = Math.max(1, Math.floor(rect.height));
      cv.width = Math.round(v.w * env.current.dpr);
      cv.height = Math.round(v.h * env.current.dpr);
      cv.style.width = `${v.w}px`;
      cv.style.height = `${v.h}px`;
      if (!v.fitted) fit();
      else requestDraw();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [fit, requestDraw]);

  useEffect(() => {
    const cv = canvasRef.current;
    const v = V.current;
    if (!cv || !v.w) return;
    cv.width = Math.round(v.w * dpr);
    cv.height = Math.round(v.h * dpr);
    requestDraw();
  }, [dpr, requestDraw]);

  useEffect(() => {
    if (V.current.fitted) follow();
  }, [row, follow]);
  useEffect(requestDraw, [stitch, chart, theme, paper, symbolStyle, leftHanded, fonts, aspect, requestDraw]);

  // hareketler: dokun = konum, cetveli sürükle = sıra, sürükle = kaydır, iki parmak = yakınlaştır
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const pts = new Map<number, { x: number; y: number }>();
    let mode: 'none' | 'tap' | 'pan' | 'ruler' | 'pinch' = 'none';
    let start = { x: 0, y: 0, t: 0 };
    let last = { x: 0, y: 0 };
    let pinch = { d: 1, cx: 0, cy: 0, s: 1 };
    const local = (e: PointerEvent | WheelEvent) => {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const zoomAt = (ns: number, cx: number, cy: number) => {
      const v = V.current;
      const next = Math.max(4, Math.min(80, ns));
      const k = next / v.scale;
      v.ox = cx - (cx - v.ox) * k;
      v.oy = cy - (cy - v.oy) * k;
      v.scale = next;
      requestDraw();
    };
    const rowAtY = (py: number) => {
      const v = V.current;
      const c = env.current.chart;
      const y = Math.floor((py - v.oy) / v.scale);
      return Math.max(1, Math.min(c.height, c.height - y));
    };
    const onDown = (e: PointerEvent) => {
      cv.setPointerCapture(e.pointerId);
      const p = local(e);
      pts.set(e.pointerId, p);
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, s: V.current.scale };
        mode = 'pinch';
        return;
      }
      start = { ...p, t: performance.now() };
      last = p;
      const v = V.current;
      const c = env.current.chart;
      const top = v.oy + (c.height - env.current.row) * v.scale;
      const barH = Math.max(14, Math.min(34, v.scale * 0.9));
      mode = p.y >= top - barH - 6 && p.y <= top + 2 ? 'ruler' : 'tap';
    };
    const onMove = (e: PointerEvent) => {
      if (!pts.has(e.pointerId)) return;
      const p = local(e);
      pts.set(e.pointerId, p);
      if (mode === 'pinch' && pts.size >= 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const cx = (a.x + b.x) / 2,
          cy = (a.y + b.y) / 2;
        V.current.ox += cx - pinch.cx;
        V.current.oy += cy - pinch.cy;
        pinch.cx = cx;
        pinch.cy = cy;
        zoomAt((pinch.s * d) / pinch.d, cx, cy);
        return;
      }
      if (mode === 'ruler') {
        const barH = Math.max(14, Math.min(34, V.current.scale * 0.9));
        const r = rowAtY(p.y + barH / 2 + V.current.scale / 2);
        if (r !== env.current.row) env.current.onSetPos(r, 1);
        return;
      }
      if (mode === 'tap' && Math.hypot(p.x - start.x, p.y - start.y) > 7) mode = 'pan';
      if (mode === 'pan') {
        V.current.ox += p.x - last.x;
        V.current.oy += p.y - last.y;
        last = p;
        requestDraw();
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (mode === 'tap' && performance.now() - start.t < 600) {
        const v = V.current;
        const c = env.current.chart;
        const x = Math.floor((start.x - v.ox) / (v.scale * env.current.aspect));
        const y = Math.floor((start.y - v.oy) / v.scale);
        if (x >= 0 && y >= 0 && x < c.width && y < c.height) {
          const r = c.height - y;
          const units = rowUnits(c, y, rowSide(r, c, env.current.leftHanded).dir);
          const i = units.findIndex((u) => x >= u.x && x < u.x + u.span);
          env.current.onSetPos(r, i >= 0 ? i + 1 : 1);
        }
      }
      if (pts.size === 1 && mode === 'pinch') {
        mode = 'pan';
        last = [...pts.values()][0];
        return;
      }
      if (pts.size === 0) mode = 'none';
    };
    const onCancel = (e: PointerEvent) => {
      pts.delete(e.pointerId);
      if (!pts.size) mode = 'none';
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = local(e);
      const mouseWheel = e.deltaMode === 1 || (e.deltaX === 0 && Math.abs(e.deltaY) >= 40 && Number.isInteger(e.deltaY));
      if (e.ctrlKey || e.metaKey) zoomAt(V.current.scale * Math.exp(-e.deltaY * 0.012), p.x, p.y);
      else if (mouseWheel) {
        V.current.oy -= e.deltaY * 0.5;
        requestDraw();
      } else {
        V.current.ox -= e.deltaX;
        V.current.oy -= e.deltaY;
        requestDraw();
      }
    };
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('pointercancel', onCancel);
    cv.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      cv.removeEventListener('pointerdown', onDown);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('pointercancel', onCancel);
      cv.removeEventListener('wheel', onWheel);
    };
  }, [requestDraw]);

  return (
    <div ref={wrapRef} className="chart-track-canvas">
      <canvas ref={canvasRef} className="chart-canvas" role="img" aria-label={label} />
    </div>
  );
}
