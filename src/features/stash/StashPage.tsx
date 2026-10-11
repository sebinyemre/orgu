import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Spool, X } from 'lucide-react';
import type { FiberId, Tool, Yarn, YarnWeightId } from '@/types';
import { PageHeader } from '@/ui/PageHeader';
import { Tabs } from '@/ui/Tabs';
import { EmptyState } from '@/ui/EmptyState';
import { confirmDialog } from '@/ui/Confirm';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { useStash } from '@/store/stash';
import { FIBERS } from '@/knowledge/fibers';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import { fmt, fmtMeters } from '@/lib/format';
import { STS } from './i18n';
import { YarnTag } from './YarnTag';
import { YarnModal } from './YarnModal';
import { IdeasModal } from './IdeasModal';
import { ToolModal, type ToolData } from './ToolModal';
import { ToolsPanel } from './ToolsPanel';
import { EMPTY_FILTER, filterYarns, stashTotals, type YarnFilter } from './stashMath';
import { COLOR_FAMILIES, FAMILY_SWATCH, colorFamily, type ColorFamily } from './colorFamily';
import { fiberName, toolTitle, weightLong, weightShort, yarnTitle } from './labels';
import './stash.css';

type Tab = 'ipler' | 'aletler';

export default function StashPage() {
  const t = useMsgs(STS);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get('sekme') === 'aletler' ? 'aletler' : 'ipler';
  const setTab = (v: Tab) => setParams(v === 'ipler' ? {} : { sekme: v }, { replace: true });

  const yarns = useStash((s) => s.yarns);
  const tools = useStash((s) => s.tools);
  const { addYarn, updateYarn, removeYarn, addTool, updateTool, removeTool } = useStash.getState();

  const [yarnEdit, setYarnEdit] = useState<{ id?: string } | null>(null);
  const [ideasId, setIdeasId] = useState<string>();
  const [toolEdit, setToolEdit] = useState<{ tool?: Tool; preset?: Partial<ToolData> } | null>(null);
  const [filter, setFilter] = useState<YarnFilter>(EMPTY_FILTER);

  const totals = useMemo(() => stashTotals(yarns), [yarns]);
  const shown = useMemo(() => filterYarns(yarns, filter, (id) => fiberName(id, lang)), [yarns, filter, lang]);
  const families = useMemo(() => COLOR_FAMILIES.filter((f) => yarns.some((y) => colorFamily(y.colorHex) === f)), [yarns]);
  const fibersPresent = useMemo(() => FIBERS.filter((f) => yarns.some((y) => y.fibers.includes(f.id))), [yarns]);
  const weightsPresent = useMemo(() => YARN_WEIGHTS.filter((w) => yarns.some((y) => y.weight === w.id)), [yarns]);
  const filtering = filter.q !== '' || filter.weight !== 'all' || filter.fiber !== 'all' || filter.family !== 'all';
  const maxW = Math.max(1, ...totals.byWeight.map((w) => w.meters));

  const editYarn = yarnEdit?.id ? yarns.find((y) => y.id === yarnEdit.id) : undefined;

  const askRemoveYarn = async (y: Yarn) => {
    if (await confirmDialog(t.deleteYarn(yarnTitle(y, lang)), { confirmLabel: tc.delete, danger: true })) removeYarn(y.id);
  };
  const askRemoveTool = async (tool: Tool) => {
    if (await confirmDialog(t.deleteTool(toolTitle(tool, lang)), { confirmLabel: tc.delete, danger: true })) removeTool(tool.id);
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow={t.eyebrow}
        title={tc.navStash}
        lede={t.lede}
        actions={
          tab === 'ipler' ? (
            <button className="btn btn-primary" onClick={() => setYarnEdit({})}>
              <Plus />
              {t.addYarn}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setToolEdit({})}>
              <Plus />
              {t.addTool}
            </button>
          )
        }
      />

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        label={tc.navStash}
        tabs={[
          { id: 'ipler', label: `${t.tabYarn} (${yarns.length})` },
          { id: 'aletler', label: `${t.tabTools} (${tools.length})` },
        ]}
      />

      {tab === 'aletler' ? (
        <ToolsPanel tools={tools} onAdd={(preset) => setToolEdit({ preset })} onEdit={(tool) => setToolEdit({ tool })} onDelete={askRemoveTool} />
      ) : yarns.length === 0 ? (
        <EmptyState
          title={t.emptyYarnTitle}
          color="#b5523b"
          action={
            <button className="btn btn-primary" onClick={() => setYarnEdit({})}>
              <Plus />
              {t.addYarn}
            </button>
          }
        >
          {t.emptyYarnText}
        </EmptyState>
      ) : (
        <div className="stack-lg">
          <section className="stash-totals">
            <div className="stash-totals-stats">
              <div className="stat">
                <span className="stat-value">{fmtMeters(totals.meters)}</span>
                <span className="stat-label">{t.totalMeters}</span>
              </div>
              <div className="stat">
                <span className="stat-value">{fmt(totals.skeins, 1)}</span>
                <span className="stat-label">{t.skeins}</span>
              </div>
              <div className="stat">
                <span className="stat-value">{yarns.length}</span>
                <span className="stat-label">{t.yarns}</span>
              </div>
            </div>
            <div className="stash-weights">
              <div className="stat-label">{t.byWeight}</div>
              {totals.byWeight.map((w) => (
                <button
                  key={w.weight}
                  type="button"
                  className="stash-weight-row"
                  aria-pressed={filter.weight === w.weight}
                  title={`${weightLong(w.weight, lang)}: ${fmtMeters(w.meters)}`}
                  onClick={() => setFilter((f) => ({ ...f, weight: f.weight === w.weight ? 'all' : w.weight }))}
                >
                  <span className="stash-weight-name">{weightShort(w.weight, lang)}</span>
                  <span className="stash-weight-bar" aria-hidden>
                    <span style={{ width: `${(w.meters / maxW) * 100}%` }} />
                  </span>
                  <span className="stash-weight-val tabular">{fmtMeters(w.meters)}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="stack-sm">
            <div className="stash-filters">
              <label className="stash-search">
                <Search aria-hidden />
                <input className="input" type="search" value={filter.q} placeholder={t.searchPh} aria-label={tc.search} onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))} />
              </label>
              <select
                className="select"
                aria-label={t.weight}
                value={String(filter.weight)}
                onChange={(e) => setFilter((f) => ({ ...f, weight: e.target.value === 'all' ? 'all' : (Number(e.target.value) as YarnWeightId) }))}
              >
                <option value="all">{t.allWeights}</option>
                {weightsPresent.map((w) => (
                  <option key={w.id} value={w.id}>
                    {weightShort(w.id, lang)}
                  </option>
                ))}
              </select>
              <select className="select" aria-label={t.fiber} value={filter.fiber} onChange={(e) => setFilter((f) => ({ ...f, fiber: e.target.value as FiberId | 'all' }))}>
                <option value="all">{t.allFibers}</option>
                {fibersPresent.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name[lang]}
                  </option>
                ))}
              </select>
            </div>
            {families.length > 1 && (
              <div className="stash-families" role="group" aria-label={t.colorFamily}>
                <button type="button" className="stash-fam" aria-pressed={filter.family === 'all'} onClick={() => setFilter((f) => ({ ...f, family: 'all' }))}>
                  <Spool aria-hidden />
                  {t.anyColor}
                </button>
                {families.map((fam: ColorFamily) => (
                  <button key={fam} type="button" className="stash-fam" aria-pressed={filter.family === fam} onClick={() => setFilter((f) => ({ ...f, family: f.family === fam ? 'all' : fam }))}>
                    <span className="stash-fam-dot" style={{ background: FAMILY_SWATCH[fam] }} aria-hidden />
                    {t.families[fam]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {shown.length === 0 ? (
            <div className="empty">
              <p style={{ margin: 0 }}>{t.noMatch}</p>
              <button className="btn btn-soft btn-sm" onClick={() => setFilter(EMPTY_FILTER)}>
                <X />
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <>
              {filtering && (
                <div className="row">
                  <span className="xsmall faint">
                    {shown.length} / {yarns.length}
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={() => setFilter(EMPTY_FILTER)}>
                    <X />
                    {t.clearFilters}
                  </button>
                </div>
              )}
              <div className="stash-grid">
                {shown.map((y) => (
                  <YarnTag key={y.id} yarn={y} onEdit={() => setYarnEdit({ id: y.id })} onIdeas={() => setIdeasId(y.id)} onDelete={() => void askRemoveYarn(y)} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <YarnModal open={!!yarnEdit} yarn={editYarn} onClose={() => setYarnEdit(null)} onSave={(data) => (editYarn ? updateYarn(editYarn.id, data) : addYarn(data))} />
      <IdeasModal yarn={ideasId ? yarns.find((y) => y.id === ideasId) : undefined} onClose={() => setIdeasId(undefined)} />
      <ToolModal
        open={!!toolEdit}
        tool={toolEdit?.tool}
        preset={toolEdit?.preset}
        onClose={() => setToolEdit(null)}
        onSave={(data) => (toolEdit?.tool ? updateTool(toolEdit.tool.id, data) : addTool(data))}
      />
    </div>
  );
}
