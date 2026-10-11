import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid3x3, Link2, Link2Off, Play, Plus } from 'lucide-react';
import type { ChartDoc, Project } from '@/types';
import { EmptyState } from '@/ui/EmptyState';
import { Modal } from '@/ui/Modal';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { useCharts } from '@/store/charts';
import { useProjects } from '@/store/projects';
import { timeAgo } from '@/lib/format';
import { SafeChartView } from '../SafeLazy';
import { PopMenu } from '@/features/counters/PopMenu';
import { PRJ } from '../i18n';

const THUMB = 200;

function Thumb({ c }: { c: ChartDoc }) {
  const t = useMsgs(PRJ);
  const cell = Math.max(2, Math.min(14, Math.floor(THUMB / Math.max(c.width, c.height))));
  return (
    <SafeChartView
      fallback={
        <span className="prj-chart-none">
          <Grid3x3 aria-hidden />
          {t.previewUnavailable}
        </span>
      }
      width={c.width}
      height={c.height}
      symbols={c.symbols}
      colors={c.colors}
      palette={c.palette}
      craft={c.craft}
      mode={c.mode}
      firstRowRS={c.firstRowRS}
      cell={cell}
      highlightRow={c.progress?.row}
      ariaLabel={c.name}
    />
  );
}

export function ChartsTab({ project: p }: { project: Project }) {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const nav = useNavigate();
  const charts = useCharts((s) => s.charts);
  const update = useProjects((s) => s.update);
  const [picking, setPicking] = useState(false);
  const linked = useMemo(() => charts.filter((c) => c.projectId === p.id || p.chartIds.includes(c.id)), [charts, p.id, p.chartIds]);
  const others = charts.filter((c) => !linked.includes(c));

  const link = (c: ChartDoc) => {
    useCharts.getState().update(c.id, { projectId: p.id });
    if (!p.chartIds.includes(c.id)) update(p.id, { chartIds: [...p.chartIds, c.id] });
  };
  const unlink = (c: ChartDoc) => {
    if (c.projectId === p.id) useCharts.getState().update(c.id, { projectId: undefined });
    update(p.id, { chartIds: p.chartIds.filter((x) => x !== c.id) });
  };
  const createChart = () => {
    const store = useCharts.getState();
    const c = store.create({ name: p.name, craft: p.craft });
    store.update(c.id, { projectId: p.id, ...(p.gauge ? { gauge: p.gauge } : null) });
    update(p.id, { chartIds: [...p.chartIds, c.id] });
    nav(`/kareli/${c.id}`);
  };

  const actions = (
    <div className="row">
      <button type="button" className="btn btn-primary btn-sm" onClick={createChart}>
        <Plus />
        {t.newChart}
      </button>
      {others.length > 0 && (
        <button type="button" className="btn btn-soft btn-sm" onClick={() => setPicking(true)}>
          <Link2 />
          {t.linkChart}
        </button>
      )}
    </div>
  );

  return (
    <div className="stack">
      <div className="spread">
        <p className="small muted" style={{ margin: 0 }}>
          {t.chartsLede}
        </p>
        {linked.length > 0 && actions}
      </div>
      {linked.length === 0 ? (
        <EmptyState title={t.noCharts} color={p.color} action={actions}>
          {t.noChartsText}
        </EmptyState>
      ) : (
        <div className="prj-charts">
          {linked.map((c) => (
            <article key={c.id} className="prj-chart">
              <Link to={`/kareli/${c.id}`} className="prj-chart-thumb paper-grid" aria-label={`${tc.open}: ${c.name}`}>
                <Thumb c={c} />
              </Link>
              <div className="prj-chart-info">
                <div className="spread" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="prj-chart-name">{c.name}</div>
                    <div className="xsmall muted">
                      {t.chartSize(c.width, c.height)}
                      {c.progress ? ` · ${t.chartRow(c.progress.row, c.height)}` : ''} · {timeAgo(c.updatedAt)}
                    </div>
                  </div>
                  <PopMenu small label={t.unlink} items={[{ label: t.unlink, icon: <Link2Off />, onClick: () => unlink(c) }]} />
                </div>
                <div className="row">
                  <Link to={`/kareli/${c.id}`} className="btn btn-soft btn-sm">
                    {tc.open}
                  </Link>
                  <Link to={`/kareli/${c.id}/takip`} className="btn btn-primary btn-sm">
                    <Play />
                    {t.follow}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={picking} onClose={() => setPicking(false)} title={t.pickChart}>
        {others.length === 0 ? (
          <p className="muted">{t.noOtherCharts}</p>
        ) : (
          <ul className="prj-pick">
            {others.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="prj-pick-row prj-pick-btn"
                  onClick={() => {
                    link(c);
                    setPicking(false);
                  }}
                >
                  <span className="grow">
                    <span className="prj-pick-title">{c.name}</span>
                    <span className="xsmall muted">
                      {t.chartSize(c.width, c.height)} · {timeAgo(c.updatedAt)}
                    </span>
                  </span>
                  <Link2 aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
