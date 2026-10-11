import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Project } from '@/types';
import { EmptyState } from '@/ui/EmptyState';
import { confirmDialog } from '@/ui/Confirm';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { useProjects } from '@/store/projects';
import { CNT } from '@/features/counters/i18n';
import { CounterWidget } from '@/features/counters/CounterWidget';
import { CounterEditor } from '@/features/counters/CounterEditor';
import { FocusMode } from '@/features/counters/FocusMode';
import { counterDisplayName, moveId, reachesTarget } from '@/features/counters/counterMath';
import { counterFeedback } from '@/features/counters/feedback';
import { useCounterKeys } from '@/features/counters/useCounterKeys';
import { PRJ } from '../i18n';

export function CountersTab({ project: p }: { project: Project }) {
  const t = useMsgs(PRJ);
  const tn = useMsgs(CNT);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const { addCounter, updateCounter, removeCounter, increment, update } = useProjects.getState();
  const [editing, setEditing] = useState<{ id?: string } | null>(null);
  const [focusId, setFocusId] = useState<string>();
  const [activeId, setActiveId] = useState<string>();
  const ids = p.counters.map((c) => c.id);
  const editCounter = editing?.id ? p.counters.find((c) => c.id === editing.id) : undefined;
  const focusCounter = focusId ? p.counters.find((c) => c.id === focusId) : undefined;

  useCounterKeys(
    !editing && !focusId,
    () => (activeId && ids.includes(activeId) ? activeId : ids[0]),
    (id, d) => {
      const c = useProjects
        .getState()
        .projects.find((x) => x.id === p.id)
        ?.counters.find((x) => x.id === id);
      if (!c || (d < 0 && c.value <= 0)) return;
      const reached = reachesTarget(c, d) ? counterDisplayName(c.name, lang) : undefined;
      counterFeedback(d, increment(p.id, id, d), reached);
      setActiveId(id);
    },
  );

  const askRemove = async (id: string) => {
    const c = p.counters.find((x) => x.id === id);
    if (c && (await confirmDialog(tn.deleteConfirm(counterDisplayName(c.name, lang)), { confirmLabel: tc.delete, danger: true }))) removeCounter(p.id, id);
  };

  return (
    <div className="stack">
      <div className="spread">
        <p className="small muted" style={{ margin: 0 }}>
          {t.countersLede}
        </p>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing({})}>
          <Plus />
          {tn.newCounter}
        </button>
      </div>
      {p.counters.length === 0 ? (
        <EmptyState title={tn.emptyTitle} color={p.color}>
          {tn.emptyText}
        </EmptyState>
      ) : (
        <div className="cnt-grid">
          {p.counters.map((c, i) => (
            <CounterWidget
              key={c.id}
              counter={c}
              color={p.color}
              linkedName={c.link ? p.counters.find((x) => x.id === c.link!.toId)?.name : undefined}
              onIncrement={(d) => increment(p.id, c.id, d)}
              onChange={(patch) => updateCounter(p.id, c.id, patch)}
              onRemove={() => removeCounter(p.id, c.id)}
              onEdit={() => setEditing({ id: c.id })}
              onFocusMode={() => setFocusId(c.id)}
              onMove={(dir) => {
                const order = moveId(ids, c.id, dir);
                update(p.id, { counters: order.map((id) => p.counters.find((x) => x.id === id)!) });
              }}
              canMove={{ up: i > 0, down: i < p.counters.length - 1 }}
              onActivate={() => setActiveId(c.id)}
              size={p.counters.length === 1 ? 'lg' : 'md'}
            />
          ))}
        </div>
      )}
      <CounterEditor
        open={!!editing}
        counter={editCounter}
        siblings={p.counters}
        defaultName={p.counters.length === 0 ? (p.craft === 'crochet' ? tn.defaults.roundRow : tn.defaults.row) : ''}
        onClose={() => setEditing(null)}
        onSave={(d) => (editCounter ? updateCounter(p.id, editCounter.id, d) : addCounter(p.id, d))}
        onDelete={editCounter ? () => void askRemove(editCounter.id) : undefined}
      />
      {focusCounter && <FocusMode counter={focusCounter} color={p.color} context={p.name} onIncrement={(d) => increment(p.id, focusCounter.id, d)} onClose={() => setFocusId(undefined)} />}
    </div>
  );
}
