/** Alet çantası: şiş ölçer şeridi ve türe göre gruplanmış şiş/tığ listesi. */
import type { CSSProperties } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { Tool } from '@/types';
import { EmptyState } from '@/ui/EmptyState';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { TOOL_KIND_LABEL } from '@/knowledge/tools';
import { fmt } from '@/lib/format';
import { PopMenu } from '@/features/counters/PopMenu';
import { STS } from './i18n';
import { CNT } from '@/features/counters/i18n';
import { materialShort, mmText, usUkText } from './labels';
import { GAUGE_SIZES, TOOL_KINDS, ownedSizes } from './stashMath';
import type { ToolData } from './ToolModal';
import './stash.css';

interface Props {
  tools: Tool[];
  onAdd: (preset?: Partial<ToolData>) => void;
  onEdit: (tool: Tool) => void;
  onDelete: (tool: Tool) => void;
}

export function NeedleGauge({ tools, onAdd, onEdit }: Omit<Props, 'onDelete'>) {
  const t = useMsgs(STS);
  const lang = useLang();
  const owned = ownedSizes(tools);
  const rows = [
    { key: 'needle' as const, label: t.gaugeNeedles, map: owned.needles },
    { key: 'hook' as const, label: t.gaugeHooks, map: owned.hooks },
  ];
  return (
    <section className="stash-gauge" aria-labelledby="stash-gauge-title">
      <div className="stash-gauge-ruler" aria-hidden />
      <h3 id="stash-gauge-title" className="stash-gauge-title">
        {t.gaugeTitle}
      </h3>
      <p className="xsmall stash-gauge-lede">{t.gaugeLede}</p>
      {rows.map((r) => (
        <div key={r.key} className="stash-gauge-row">
          <span className="stash-gauge-label">{r.label}</span>
          <div className="stash-gauge-holes">
            {GAUGE_SIZES.map((mm) => {
              const n = r.map.get(mm) ?? 0;
              const text = mmText(mm, lang);
              return (
                <button
                  key={mm}
                  type="button"
                  className="stash-hole"
                  data-owned={n > 0 || undefined}
                  style={{ '--hole': `${8 + mm * 2.6}px` } as CSSProperties}
                  aria-label={n > 0 ? t.owned(text) : t.missing(text)}
                  title={n > 0 ? t.owned(text) : t.missing(text)}
                  onClick={() => {
                    if (n > 0) {
                      const tool = tools.find((x) => x.sizeMm === mm && (r.key === 'hook') === (x.kind === 'tig' || x.kind === 'tunus-tigi'));
                      if (tool) onEdit(tool);
                    } else onAdd({ kind: r.key === 'hook' ? 'tig' : 'sis-duz', sizeMm: mm, lengthCm: r.key === 'hook' ? undefined : 35 });
                  }}
                >
                  <span className="stash-hole-dot" />
                  <span className="stash-hole-mm">{fmt(mm, 1)}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

export function ToolsPanel({ tools, onAdd, onEdit, onDelete }: Props) {
  const t = useMsgs(STS);
  const tc = useMsgs(COMMON);
  const tm = useMsgs(CNT);
  const lang = useLang();
  const groups = TOOL_KINDS.map((k) => ({ kind: k, list: tools.filter((x) => x.kind === k).sort((a, b) => a.sizeMm - b.sizeMm) })).filter((g) => g.list.length);

  return (
    <div className="stack-lg">
      <NeedleGauge tools={tools} onAdd={onAdd} onEdit={onEdit} />
      {groups.length === 0 ? (
        <EmptyState
          title={t.emptyToolsTitle}
          color="#7d4e6d"
          action={
            <button className="btn btn-primary" onClick={() => onAdd()}>
              <Plus />
              {t.addTool}
            </button>
          }
        >
          {t.emptyToolsText}
        </EmptyState>
      ) : (
        groups.map((g) => (
          <section key={g.kind}>
            <h3 className="section-title">
              {TOOL_KIND_LABEL[g.kind][lang]}
              <span className="chip">{g.list.reduce((n, x) => n + x.count, 0)}</span>
            </h3>
            <ul className="stash-tools">
              {g.list.map((tool) => {
                const meta = [tool.lengthCm ? `${fmt(tool.lengthCm, 0)} cm` : '', tool.material ? materialShort(tool.material, lang) : '', tool.notes ?? ''].filter(Boolean).join(' · ');
                return (
                  <li key={tool.id} className="stash-tool">
                    <button type="button" className="stash-tool-main" onClick={() => onEdit(tool)} aria-label={`${tc.edit}: ${TOOL_KIND_LABEL[tool.kind][lang]} ${mmText(tool.sizeMm, lang)}`}>
                      <span className="stash-tool-mm">
                        <b>{fmt(tool.sizeMm, 2)}</b>
                        <small>mm</small>
                      </span>
                      <span className="grow" style={{ minWidth: 0 }}>
                        <span className="stash-tool-sizes">{usUkText(tool, lang) || mmText(tool.sizeMm, lang)}</span>
                        {meta && <span className="xsmall muted stash-tool-meta">{meta}</span>}
                      </span>
                      {tool.count > 1 && <span className="chip">× {tool.count}</span>}
                    </button>
                    <PopMenu
                      small
                      label={tm.more}
                      items={[
                        { label: tc.edit, icon: <Pencil />, onClick: () => onEdit(tool) },
                        { label: tc.delete, icon: <Trash2 />, onClick: () => onDelete(tool), danger: true },
                      ]}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
