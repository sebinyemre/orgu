/**
 * Kareli kağıt düzenleyicisi: telefonda alttaki araç çubuğu ve alttan açılan paneller,
 * masaüstünde solda araç rayı, sağda sekmeli panel.
 */
import { fillTerms } from '@/knowledge/terms';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Highlighter, Maximize, PanelBottomOpen, Redo2, Undo2, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { ChartDoc } from '@/types';
import { useCharts } from '@/store/charts';
import { useSettings } from '@/store/settings';
import { EmptyState } from '@/ui/EmptyState';
import { SymbolGlyph } from '@/ui/SymbolGlyph';
import { Tabs } from '@/ui/Tabs';
import { useTerms } from '@/ui/Term';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { SYMBOL_BY_ID, symbolName } from '@/knowledge/symbols';
import { chartToText, rowLine } from '@/engine/chart/toText';
import { colorCounts, usedSymbols } from '@/engine/chart/grid';
import { CH } from './i18n';
import { useChartPrefs } from './prefs';
import { EditorCanvas } from './editor/EditorCanvas';
import { InkWell, TOOLS, ToolButtons, ToolOptions } from './editor/Toolbar';
import { ColorsPanel } from './editor/ColorsPanel';
import { SymbolsPanel } from './editor/SymbolsPanel';
import { WrittenPanel } from './editor/WrittenPanel';
import { FabricPanel } from './editor/FabricPanel';
import { ChartPanel } from './editor/ChartPanel';
import { chartImage, exportPng, type ExportCtx } from './editor/exporters';
import { clearSel, copySel, cutSel, deselect, pasteClip } from './editor/actions';
import { docPatch, getViewApi, loadChart, placeFloating, redo, setTool, undo, useEditor } from './editor/state';
import './chart.css';

type PanelId = 'colors' | 'symbols' | 'written' | 'fabric' | 'chart';

export default function ChartEditorPage() {
  const { chartId } = useParams();
  const exists = useCharts((s) => s.charts.some((c) => c.id === chartId));
  const t = useMsgs(CH);
  if (!chartId || !exists)
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
  return <Editor key={chartId} chartId={chartId} />;
}

function useIsDesktop() {
  const [d, setD] = useState(() => window.matchMedia('(min-width: 960px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)');
    const on = () => setD(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return d;
}

function Editor({ chartId }: { chartId: string }) {
  const t = useMsgs(CH);
  const nav = useNavigate();
  const chart = useCharts((s) => s.charts.find((x) => x.id === chartId))!;
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<PanelId>('colors');
  const [sheet, setSheet] = useState(false);
  const [printing, setPrinting] = useState<PrintData | null>(null);
  const desktop = useIsDesktop();
  const { ctx: terms } = useTerms();
  const leftHanded = useSettings((s) => s.leftHanded);
  const paper = useChartPrefs((s) => s.paper);
  const symbolStyle = useChartPrefs((s) => s.symbolStyle);
  const canUndo = useEditor((s) => s.canUndo);
  const canRedo = useEditor((s) => s.canRedo);
  const zoom = useEditor((s) => s.zoom);

  useLayoutEffect(() => {
    const c0 = useCharts.getState().charts.find((x) => x.id === chartId);
    if (c0) loadChart(c0);
    setReady(true);
  }, [chartId]);

  // otomatik kayıt
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const save = () => {
      timer = undefined;
      const s = useEditor.getState();
      if (s.id !== chartId) return;
      useCharts.getState().update(chartId, docPatch(s.doc));
    };
    const unsub = useEditor.subscribe((s, prev) => {
      if (s.rev !== prev.rev && s.id === chartId) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(save, 450);
      }
    });
    const flush = () => {
      if (timer) {
        clearTimeout(timer);
        save();
      }
    };
    const onVis = () => document.visibilityState === 'hidden' && flush();
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      unsub();
      placeFloating();
      flush();
      if (useEditor.getState().rev > 0) save();
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [chartId]);

  // klavye kısayolları
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = document.activeElement as HTMLElement | null;
      const typing = !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
      if (document.querySelector('.modal-backdrop')) return;
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (mod && k === 'z') {
        if (typing) return;
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && k === 'y') {
        if (typing) return;
        e.preventDefault();
        redo();
        return;
      }
      if (typing) return;
      const s = useEditor.getState();
      if (mod && k === 'c' && (s.selection || s.floating)) {
        e.preventDefault();
        copySel();
        return;
      }
      if (mod && k === 'x' && (s.selection || s.floating)) {
        e.preventDefault();
        cutSel();
        return;
      }
      if (mod && k === 'v') {
        e.preventDefault();
        pasteClip();
        return;
      }
      if (mod || e.altKey) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && (s.selection || s.floating)) {
        e.preventDefault();
        clearSel();
        return;
      }
      if (e.key === 'Escape') {
        if (s.floating || s.selection) deselect();
        else setSheet(false);
        return;
      }
      if (e.key === 'Enter' && s.floating && a?.tagName !== 'BUTTON') {
        e.preventDefault();
        placeFloating();
        return;
      }
      if (e.key === '+' || e.key === '=') return getViewApi()?.zoomBy(1.25);
      if (e.key === '-' || e.key === '_') return getViewApi()?.zoomBy(0.8);
      if (e.key === '0') return getViewApi()?.fit();
      const tool = TOOLS.find((x) => x.key.toLowerCase() === k);
      if (tool) setTool(tool.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const exportCtx = (): ExportCtx => ({ chart: { ...chart, ...docPatch(useEditor.getState().doc) } as ChartDoc, terms, leftHanded, paper, symbolStyle, t });
  // yazdırma görüntüsü ekranda gizli kalır; her istekte yenilenip yazdırma penceresi açılır
  const doPrint = () => setPrinting(makePrintData(exportCtx()));
  useEffect(() => {
    if (!printing) return;
    const id = setTimeout(() => window.print(), 150);
    return () => clearTimeout(id);
  }, [printing]);

  const tabs: { id: PanelId; label: string }[] = [
    { id: 'colors', label: t.tabColors },
    { id: 'symbols', label: t.tabSymbols },
    { id: 'written', label: t.tabWritten },
    { id: 'fabric', label: t.tabFabric },
    { id: 'chart', label: t.tabChart },
  ];
  const openPanel = (p: PanelId) => {
    setTab(p);
    setSheet(true);
  };
  const paint = useEditor((s) => s.paint);

  if (!ready) return null;
  const panelOpen = desktop || sheet;

  return (
    <div className="chart-editor-root">
      <div className="chart-editor" data-sheet={sheet}>
        <header className="chart-ed-head">
          <Link className="btn btn-ghost btn-icon" to="/kareli" aria-label={t.backToList} title={t.backToList}>
            <ArrowLeft />
          </Link>
          <input className="chart-ed-name" value={chart.name} onChange={(e) => useCharts.getState().update(chartId, { name: e.target.value })} aria-label={t.chartName} maxLength={120} />
          <div className="row-nowrap chart-ed-actions">
            <button className="btn btn-ghost btn-icon" onClick={undo} disabled={!canUndo} aria-label={`${t.undo} (Ctrl+Z)`} title={`${t.undo} (Ctrl+Z)`}>
              <Undo2 />
            </button>
            <button className="btn btn-ghost btn-icon" onClick={redo} disabled={!canRedo} aria-label={`${t.redo} (Ctrl+Shift+Z)`} title={`${t.redo} (Ctrl+Shift+Z)`}>
              <Redo2 />
            </button>
            <div className="chart-zoom">
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => getViewApi()?.zoomBy(0.8)} aria-label={t.zoomOut} title={t.zoomOut}>
                <ZoomOut />
              </button>
              <span className="chart-zoom-val tabular" aria-live="off">
                {Math.round(zoom)} px
              </span>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => getViewApi()?.zoomBy(1.25)} aria-label={t.zoomIn} title={t.zoomIn}>
                <ZoomIn />
              </button>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => getViewApi()?.fit()} aria-label={t.fit} title={`${t.fit} (0)`}>
                <Maximize />
              </button>
            </div>
            <button className="btn btn-primary btn-sm chart-track-btn" onClick={() => nav(`/kareli/${chartId}/takip`)} title={t.trackLong} aria-label={t.trackLong}>
              <Highlighter /> <span className="chart-hide-sm">{t.trackLong}</span>
            </button>
          </div>
        </header>

        <ToolOptions
          onTilePreview={() => {
            useChartPrefs.getState().set({ fabricTile: 3, fabricOnlyRepeat: true });
            if (desktop) setTab('fabric');
            else openPanel('fabric');
          }}
        />

        <div className="chart-stage">
          <EditorCanvas meta={chart} />
          <button className="btn btn-icon chart-fit-fab" onClick={() => getViewApi()?.fit()} aria-label={t.fit} title={t.fit}>
            <Maximize />
          </button>
        </div>

        <nav className="chart-tools" aria-label={t.tools}>
          <InkWell onClick={() => (desktop ? setTab(paint === 'symbol' ? 'symbols' : 'colors') : openPanel(paint === 'symbol' ? 'symbols' : 'colors'))} />
          <ToolButtons />
          <button className="btn btn-ghost btn-icon chart-panel-toggle" onClick={() => (sheet ? setSheet(false) : openPanel(tab))} aria-label={sheet ? t.closePanel : t.openPanel} aria-expanded={sheet}>
            <PanelBottomOpen />
          </button>
        </nav>

        <aside className="chart-panel" data-open={panelOpen} aria-label={t.panels} hidden={!panelOpen}>
          <div className="chart-panel-head">
            <Tabs<PanelId> tabs={tabs} value={tab} onChange={setTab} label={t.panels} />
            {!desktop && (
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSheet(false)} aria-label={t.closePanel}>
                <X />
              </button>
            )}
          </div>
          <div className="chart-panel-body">
            {tab === 'colors' && <ColorsPanel meta={chart} />}
            {tab === 'symbols' && <SymbolsPanel craft={chart.craft} />}
            {tab === 'written' && <WrittenPanel meta={chart} />}
            {tab === 'fabric' && <FabricPanel meta={chart} />}
            {tab === 'chart' && <ChartPanel chart={chart} onPng={() => exportPng(exportCtx())} onPrint={doPrint} />}
          </div>
        </aside>
      </div>

      {printing && <PrintSheet data={printing} />}
    </div>
  );
}

/* ── Yazdırma ───────────────────────────────────────────────────── */

interface PrintData {
  title: string;
  sub: string;
  img: string;
  colors: { hex: string; letter: string; name: string; n: string }[];
  symbols: { id: string; name: string; meaning: string }[];
  intro: string;
  rows: string[];
  notes?: string;
  labels: { colors: string; symbols: string; written: string };
}

function makePrintData(e: ExportCtx): PrintData {
  const c = e.chart;
  const lang = e.terms.lang;
  const common = COMMON[lang];
  const text = chartToText(c, { terms: e.terms, leftHanded: e.leftHanded, compact: true });
  const counts = colorCounts(c, c.palette.length).counts;
  return {
    title: c.name,
    sub: [e.t.pngSize(c.width, c.height), c.craft === 'knit' ? common.knit : common.crochet, c.mode === 'round' ? e.t.roundLong : e.t.flatLong].join(' · '),
    img: chartImage(e, 1400, 2).toDataURL('image/png'),
    colors: text.colorMode === 'symbols' ? [] : c.palette.map((p, i) => ({ hex: p.hex, letter: p.letter, name: p.name, n: e.t.stitchCount(counts[i] ?? 0) })),
    symbols: usedSymbols(c)
      .map((id) => SYMBOL_BY_ID[id])
      .filter(Boolean)
      .map((s) => ({ id: s.id, name: symbolName(s, e.terms), meaning: c.craft === 'knit' && s.rs?.[lang] ? `${e.t.rsSide}: ${s.rs[lang]} · ${e.t.wsSide}: ${s.ws?.[lang] ?? ''}` : fillTerms(s.hint[lang], e.terms) })),
    intro: text.intro,
    rows: text.rows.map(rowLine),
    notes: c.notes,
    labels: { colors: e.t.legendColors, symbols: e.t.legendSymbols, written: e.t.writtenTitle },
  };
}

function PrintSheet({ data }: { data: PrintData }) {
  const style = useChartPrefs((s) => s.symbolStyle);
  return (
    <section className="chart-print" aria-hidden>
      <h1>{data.title}</h1>
      <p className="chart-print-sub">{data.sub}</p>
      <img src={data.img} alt="" className="chart-print-img" />
      {data.notes && <p className="chart-print-notes">{data.notes}</p>}
      <div className="chart-print-legend">
        {data.colors.length > 0 && (
          <div>
            <h2>{data.labels.colors}</h2>
            <ul>
              {data.colors.map((x) => (
                <li key={x.letter}>
                  <span className="chart-print-sw" style={{ background: x.hex }} /> <b>{x.letter}</b> {x.name} · {x.n}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.symbols.length > 0 && (
          <div>
            <h2>{data.labels.symbols}</h2>
            <ul>
              {data.symbols.map((x) => (
                <li key={x.id}>
                  <SymbolGlyph symbol={x.id} size={18} framed style={style} bg="transparent" /> <b>{x.name}</b> · {x.meaning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <h2>{data.labels.written}</h2>
      <p>{data.intro}</p>
      <ol className="chart-print-rows">
        {data.rows.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ol>
    </section>
  );
}
