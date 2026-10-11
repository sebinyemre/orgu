import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Download, FileDown, FileUp, Highlighter, LayoutTemplate, Plus, Trash2 } from 'lucide-react';
import type { ChartDoc } from '@/types';
import { useCharts } from '@/store/charts';
import { toast } from '@/store/toast';
import { uid } from '@/lib/id';
import { downloadJSON, pickFile, slugify } from '@/lib/download';
import { timeAgo } from '@/lib/format';
import { confirmDialog } from '@/ui/Confirm';
import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { exportCharts, parseChartsJSON } from '@/engine/chart/io';
import { ChartThumb } from './ChartThumb';
import { NewChartDialog } from './NewChartDialog';
import { copyChart } from './create';
import { CH } from './i18n';
import './chart.css';

export default function ChartListPage() {
  const t = useMsgs(CH);
  const c = useMsgs(COMMON);
  const charts = useCharts((s) => s.charts);
  const nav = useNavigate();
  const [open, setOpen] = useState<false | 'blank' | 'template'>(false);

  const doImport = async () => {
    const f = await pickFile('application/json,.json');
    if (!f) return;
    try {
      const list = parseChartsJSON(JSON.parse(await f.text()), uid);
      if (!list.length) throw new Error('empty');
      const add = useCharts.getState().add;
      [...list].reverse().forEach((x) => add(x));
      toast(t.imported(list.length), { tone: 'success' });
    } catch {
      toast(t.readError, { tone: 'warn' });
    }
  };

  const exportAll = () => downloadJSON(exportCharts(charts), `kareli-${new Date().toISOString().slice(0, 10)}.json`);

  const sorted = [...charts].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="page chart-list-page">
      <PageHeader
        eyebrow={t.eyebrow}
        title={c.navChart}
        lede={t.lede}
        actions={
          <>
            <button className="btn btn-ghost" onClick={doImport}>
              <FileUp /> {t.importJson}
            </button>
            {charts.length > 0 && (
              <button className="btn btn-ghost" onClick={exportAll}>
                <FileDown /> {t.exportAll}
              </button>
            )}
            <button className="btn btn-primary" onClick={() => setOpen('blank')}>
              <Plus /> {t.newChart}
            </button>
          </>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          title={t.emptyTitle}
          color="#46698a"
          action={
            <div className="row" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setOpen('blank')}>
                <Plus /> {t.newChart}
              </button>
              <button className="btn btn-soft" onClick={() => setOpen('template')}>
                <LayoutTemplate /> {t.startTemplate}
              </button>
            </div>
          }
        >
          {t.emptyText}
        </EmptyState>
      ) : (
        <div className="chart-cards">
          {sorted.map((ch) => (
            <ChartCard key={ch.id} chart={ch} onOpen={() => nav(`/kareli/${ch.id}`)} />
          ))}
        </div>
      )}

      {open && <NewChartDialog initial={open} onClose={() => setOpen(false)} />}
    </div>
  );
}

function ChartCard({ chart, onOpen }: { chart: ChartDoc; onOpen: () => void }) {
  const t = useMsgs(CH);
  const c = useMsgs(COMMON);
  const nav = useNavigate();
  const remove = async () => {
    if (!(await confirmDialog(t.deleteConfirm(chart.name), { title: t.deleteTitle, confirmLabel: c.delete, danger: true }))) return;
    useCharts.getState().remove(chart.id);
    toast(t.deleted);
  };
  const duplicate = () => {
    const copy = copyChart(chart, t.copyName(chart.name));
    useCharts.getState().add(copy);
  };
  return (
    <article className="card chart-card">
      <Link to={`/kareli/${chart.id}`} className="chart-card-thumb paper-grid" aria-label={`${c.open}: ${chart.name}`}>
        <ChartThumb chart={chart} />
      </Link>
      <div className="chart-card-body">
        <h3 className="card-title chart-card-title">
          <Link to={`/kareli/${chart.id}`} onClick={(e) => (e.preventDefault(), onOpen())}>
            {chart.name}
          </Link>
        </h3>
        <div className="row chart-card-meta">
          <span className="chip" data-tone="denim">
            {t.size(chart.width, chart.height)}
          </span>
          <span className="chip">{chart.craft === 'knit' ? c.knit : c.crochet}</span>
          <span className="chip">{chart.mode === 'round' ? t.round : t.flat}</span>
          {chart.progress && (
            <span className="chip" data-tone="mustard">
              {t.rowProgress(Math.min(chart.progress.row, chart.height), chart.height)}
            </span>
          )}
        </div>
        <div className="xsmall faint">{timeAgo(chart.updatedAt)}</div>
      </div>
      <div className="chart-card-actions">
        <button className="btn btn-soft btn-sm" onClick={() => nav(`/kareli/${chart.id}/takip`)}>
          <Highlighter /> {t.track}
        </button>
        <span className="grow" />
        <button className="btn btn-ghost btn-icon btn-sm" onClick={duplicate} aria-label={t.duplicate} title={t.duplicate}>
          <Copy />
        </button>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => downloadJSON(exportCharts([chart]), `${slugify(chart.name)}.json`)} aria-label={t.exportJson} title={t.exportJson}>
          <Download />
        </button>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={remove} aria-label={c.delete} title={c.delete}>
          <Trash2 />
        </button>
      </div>
    </article>
  );
}
