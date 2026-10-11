/**
 * Takip modu: grafikle örmek. Mıknatıs cetvel, fosforlu bant, büyük +1 düğmeleri,
 * o sıranın yazılı tarifi (geçerli dilde, renk dizileriyle), ekranı açık tutma, tık sesi ve titreşim.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, RotateCcw, Sun, SunDim, Vibrate, VibrateOff, Volume2, VolumeX, X } from 'lucide-react';
import type { ChartDoc } from '@/types';
import { useCharts } from '@/store/charts';
import { useSettings } from '@/store/settings';
import { clickSound, keepScreenOn, vibrate } from '@/lib/device';
import { inkOn } from '@/lib/color';
import { confirmDialog } from '@/ui/Confirm';
import { EmptyState } from '@/ui/EmptyState';
import { useTerms } from '@/ui/Term';
import { useMsgs } from '@/i18n';
import { KNIT_VOCAB } from '@/knowledge/terms';
import { chartToText, runIndexAt, runText } from '@/engine/chart/toText';
import { rowSide, rowUnits } from '@/engine/chart/grid';
import { TrackCanvas } from './track/TrackCanvas';
import { useChartPrefs } from './prefs';
import { CH } from './i18n';
import './chart.css';

export default function ChartTrackPage() {
  const { chartId } = useParams();
  const chart = useCharts((s) => s.charts.find((c) => c.id === chartId));
  const t = useMsgs(CH);
  if (!chart)
    return (
      <div className="page">
        <EmptyState
          title={t.notFound}
          action={
            <Link className="btn btn-primary" to="/kareli">
              {t.backToList}
            </Link>
          }
        >
          {t.notFoundText}
        </EmptyState>
      </div>
    );
  return <Tracker chart={chart} />;
}

interface Pos {
  row: number;
  stitch: number;
}

function Tracker({ chart }: { chart: ChartDoc }) {
  const t = useMsgs(CH);
  const nav = useNavigate();
  const { ctx } = useTerms();
  const settings = useSettings();
  const compact = useChartPrefs((s) => s.compact);
  const H = chart.height;
  const [pos, setPos] = useState<Pos>(() => ({ row: Math.max(1, Math.min(H, chart.progress?.row ?? 1)), stitch: Math.max(1, chart.progress?.stitch ?? 1) }));
  const hist = useRef<Pos[]>([]);

  const text = useMemo(() => chartToText(chart, { terms: ctx, leftHanded: settings.leftHanded, compact }), [chart.colors, chart.symbols, chart.width, chart.height, chart.mode, chart.firstRowRS, chart.craft, chart.palette, ctx.lang, ctx.trabzan, ctx.crochetEn, settings.leftHanded, compact]);
  const rowT = text.rows[pos.row - 1];
  const y = H - pos.row;
  const side = rowSide(pos.row, chart, settings.leftHanded);
  const units = useMemo(() => rowUnits(chart, y, side.dir), [chart, y, side.dir]);
  const n = units.length;
  const finished = pos.row >= H && pos.stitch > n;

  // ekran açık
  useEffect(() => {
    if (!settings.keepAwake) return;
    void keepScreenOn(true);
    return () => void keepScreenOn(false);
  }, [settings.keepAwake]);

  // ilerlemeyi kaydet
  useEffect(() => {
    const p = chart.progress;
    if (p && p.row === pos.row && p.stitch === pos.stitch) return;
    useCharts.getState().update(chart.id, { progress: { row: pos.row, stitch: pos.stitch } });
  }, [pos]);

  const feedback = useCallback(
    (kind: 'tick' | 'tock' | 'ding') => {
      if (settings.counterSound) clickSound(kind);
      if (settings.counterVibrate) vibrate(kind === 'tick' ? 8 : kind === 'tock' ? [14, 40, 14] : [30, 60, 30, 60, 60]);
    },
    [settings.counterSound, settings.counterVibrate],
  );

  const go = useCallback((p: Pos) => {
    setPos((cur) => {
      if (cur.row === p.row && cur.stitch === p.stitch) return cur;
      hist.current.push(cur);
      if (hist.current.length > 300) hist.current.shift();
      return p;
    });
  }, []);

  const nextRow = useCallback(() => {
    if (pos.row >= H) {
      if (!finished) {
        feedback('ding');
        go({ row: H, stitch: n + 1 });
      }
      return;
    }
    feedback('tock');
    go({ row: pos.row + 1, stitch: 1 });
  }, [pos, H, n, finished, feedback, go]);

  const plus = useCallback(() => {
    if (finished) return;
    if (pos.stitch < n) {
      feedback('tick');
      go({ row: pos.row, stitch: pos.stitch + 1 });
    } else nextRow();
  }, [pos, n, finished, feedback, go, nextRow]);

  const minus = useCallback(() => {
    if (pos.stitch > 1 && !(finished && pos.stitch > n)) {
      go({ row: pos.row, stitch: Math.min(pos.stitch - 1, n) });
    } else if (finished) go({ row: H, stitch: n });
    else if (pos.row > 1) {
      const prevY = H - (pos.row - 1);
      const prevN = rowUnits(chart, prevY, rowSide(pos.row - 1, chart, settings.leftHanded).dir).length;
      go({ row: pos.row - 1, stitch: Math.max(1, prevN) });
    }
    if (settings.counterVibrate) vibrate(6);
  }, [pos, n, H, finished, chart, settings.leftHanded, settings.counterVibrate, go]);

  const undo = useCallback(() => {
    const p = hist.current.pop();
    if (p) setPos(p);
    else minus();
  }, [minus]);

  const reset = async () => {
    if (!(await confirmDialog(t.resetConfirm, { confirmLabel: t.restart }))) return;
    hist.current = [];
    setPos({ row: 1, stitch: 1 });
  };

  // klavye
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('.modal-backdrop')) return;
      const a = document.activeElement as HTMLElement | null;
      if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) return;
      // odaktaki düğme kendi işini yapsın (Boşluk/Enter iki kez saymasın)
      const onControl = !!a && (a.tagName === 'BUTTON' || a.tagName === 'A');
      if (onControl && (e.code === 'Space' || e.key === 'Enter')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        plus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        nextRow();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        undo();
      } else if (e.key === 'Escape') nav(`/kareli/${chart.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [plus, nextRow, undo, nav, chart.id]);

  const v = KNIT_VOCAB[ctx.lang];
  const stitchIdx = Math.min(n - 1, pos.stitch - 1);
  const curRun = rowT && n ? runIndexAt(rowT, stitchIdx) : -1;
  const isColors = text.colorMode !== 'symbols';

  return (
    <div className="chart-track">
      <header className="chart-track-head">
        <Link to={`/kareli/${chart.id}`} className="btn btn-ghost btn-icon" aria-label={t.exitTrack} title={t.exitTrack}>
          <X />
        </Link>
        <div className="grow chart-track-title">
          <div className="chart-track-name">{chart.name}</div>
          <div className="chart-track-sub">
            {chart.mode === 'round' ? v.round(pos.row) : v.row(pos.row)} · {t.rowOf(pos.row, H)}
          </div>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={() => settings.set({ counterSound: !settings.counterSound })} aria-pressed={settings.counterSound} aria-label={t.sound} title={t.sound}>
          {settings.counterSound ? <Volume2 /> : <VolumeX />}
        </button>
        <button className="btn btn-ghost btn-icon" onClick={() => settings.set({ counterVibrate: !settings.counterVibrate })} aria-pressed={settings.counterVibrate} aria-label={t.vibrate} title={t.vibrate}>
          {settings.counterVibrate ? <Vibrate /> : <VibrateOff />}
        </button>
        <button className="btn btn-ghost btn-icon" onClick={() => settings.set({ keepAwake: !settings.keepAwake })} aria-pressed={settings.keepAwake} aria-label={t.keepAwake} title={t.keepAwake}>
          {settings.keepAwake ? <Sun /> : <SunDim />}
        </button>
      </header>

      <div className="chart-track-stage">
        <TrackCanvas chart={chart} row={pos.row} stitch={pos.stitch} onSetPos={(row, stitch) => go({ row, stitch })} label={`${chart.name}: ${rowT?.label ?? ''}`} />
      </div>

      <section className="chart-track-panel" aria-live="polite">
        <div className="chart-track-card">
          <div className="spread" style={{ gap: 8 }}>
            <div className="row" style={{ gap: 6 }}>
              <span className="chart-track-row">{rowT?.label ?? ''}</span>
            </div>
            <span className="chart-track-dir">
              {side.dir === 'rtl' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              {side.dir === 'rtl' ? t.readDirRtl : t.readDirLtr}
            </span>
          </div>

          {finished ? (
            <p className="chart-track-done hand">{t.chartDone}</p>
          ) : (
            <>
              {rowT && rowT.runs.length > 0 && (
                <ol className="chart-runs" aria-label={rowT.label}>
                  {rowT.runs.map((r, i) => {
                    const p = chart.palette[r.color];
                    const active = i === curRun;
                    const inRun = active ? stitchIdx - r.start + 1 : 0;
                    return (
                      <li key={i} className="chart-run" data-active={active} data-done={i < curRun}>
                        {isColors && p && (
                          <span className="chart-run-sw" style={{ background: p.hex, color: inkOn(p.hex) }}>
                            {p.letter}
                          </span>
                        )}
                        <span className="chart-run-text">{runText(chart, text.colorMode, r, rowT.rs, ctx)}</span>
                        {active && r.count > 1 && <span className="chart-run-prog">{t.runOf(inRun, r.count)}</span>}
                      </li>
                    );
                  })}
                </ol>
              )}
              <p className="chart-track-text">{rowT?.text}</p>
              {rowT?.warning && <p className="chart-track-warn">{rowT.warning}</p>}
              {text.rows[pos.row] && (
                <p className="chart-track-next">
                  <b>{t.upNext}:</b> {text.rows[pos.row].label}: {text.rows[pos.row].text}
                </p>
              )}
            </>
          )}
          <div className="spread xsmall faint">
            <span className="tabular">{n ? t.stitchOf(Math.min(pos.stitch, n), n) : ''}</span>
            <button className="btn btn-ghost btn-sm" onClick={reset}>
              <RotateCcw /> {t.restart}
            </button>
          </div>
        </div>

        <div className="chart-track-buttons">
          <button className="btn chart-btn-minus" onMouseDown={(e) => e.preventDefault()} onClick={undo} aria-label={t.back1} title={`${t.back1} (Backspace)`}>
            <Minus />
          </button>
          <button className="btn btn-primary chart-btn-plus" onMouseDown={(e) => e.preventDefault()} onClick={plus} disabled={finished}>
            <Plus /> {t.plusStitch}
          </button>
          <button className="btn btn-soft chart-btn-row" onMouseDown={(e) => e.preventDefault()} onClick={nextRow} disabled={finished}>
            {t.nextRow}
          </button>
        </div>
        <p className="xsmall faint chart-track-hint">
          {t.tapHint} <span className="chart-hide-touch">{t.keysHint}</span>
        </p>
      </section>
    </div>
  );
}
