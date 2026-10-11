import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { Callout } from '@/ui/Callout';
import { confirmDialog } from '@/ui/Confirm';
import { useQuickCounters } from '@/store/counters';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { CNT } from './i18n';
import { CounterWidget } from './CounterWidget';
import { CounterEditor } from './CounterEditor';
import { FocusMode } from './FocusMode';
import { counterDisplayName, moveId, reachesTarget } from './counterMath';
import { counterFeedback } from './feedback';
import { useCounterKeys } from './useCounterKeys';
import './counters.css';

export default function CountersPage() {
  const t = useMsgs(CNT);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const counters = useQuickCounters((s) => s.counters);
  const add = useQuickCounters((s) => s.add);
  const update = useQuickCounters((s) => s.update);
  const remove = useQuickCounters((s) => s.remove);
  const increment = useQuickCounters((s) => s.increment);
  const reorder = useQuickCounters((s) => s.reorder);
  const [editing, setEditing] = useState<{ id?: string } | null>(null);
  const [focusId, setFocusId] = useState<string>();
  const [activeId, setActiveId] = useState<string>();

  const editCounter = editing?.id ? counters.find((c) => c.id === editing.id) : undefined;
  const focusCounter = focusId ? counters.find((c) => c.id === focusId) : undefined;
  const ids = counters.map((c) => c.id);

  useCounterKeys(
    !editing && !focusId,
    () => (activeId && ids.includes(activeId) ? activeId : ids[0]),
    (id, d) => {
      const c = useQuickCounters.getState().counters.find((x) => x.id === id);
      if (!c || (d < 0 && c.value <= 0)) return;
      const reached = reachesTarget(c, d) ? counterDisplayName(c.name, lang) : undefined;
      counterFeedback(d, increment(id, d), reached);
      setActiveId(id);
    },
  );

  const askRemove = async (id: string) => {
    const c = counters.find((x) => x.id === id);
    if (c && (await confirmDialog(t.deleteConfirm(counterDisplayName(c.name, lang)), { confirmLabel: tc.delete, danger: true }))) remove(id);
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow={t.eyebrow}
        title={tc.navCounters}
        lede={t.lede}
        actions={
          <button className="btn btn-primary" onClick={() => setEditing({})}>
            <Plus />
            {t.newCounter}
          </button>
        }
      />

      {counters.length > 0 && (
        <div className="cnt-keys no-touch" style={{ marginBottom: 'var(--space-3)' }}>
          <span>{t.keysHint}:</span>
          <kbd>{t.keySpace}</kbd>
          <span>+1</span>
          <span aria-hidden>·</span>
          <kbd>−</kbd>
          <span>−1</span>
        </div>
      )}

      {counters.length === 0 ? (
        <EmptyState
          title={t.emptyTitle}
          color="#46698a"
          action={
            <button className="btn btn-primary" onClick={() => setEditing({})}>
              <Plus />
              {t.newCounter}
            </button>
          }
        >
          {t.emptyText}
        </EmptyState>
      ) : (
        <div className="cnt-grid">
          {counters.map((c, i) => {
            const linked = c.link ? counters.find((x) => x.id === c.link!.toId) : undefined;
            return (
              <CounterWidget
                key={c.id}
                counter={c}
                linkedName={linked?.name}
                onIncrement={(d) => increment(c.id, d)}
                onChange={(p) => update(c.id, p)}
                onRemove={() => remove(c.id)}
                onEdit={() => setEditing({ id: c.id })}
                onFocusMode={() => setFocusId(c.id)}
                onMove={(dir) => reorder(moveId(ids, c.id, dir))}
                canMove={{ up: i > 0, down: i < counters.length - 1 }}
                onActivate={() => setActiveId(c.id)}
                size={counters.length === 1 ? 'lg' : 'md'}
              />
            );
          })}
        </div>
      )}

      <Callout tone="prof" className="cnt-tip">
        <p>{t.tip}</p>
      </Callout>

      <CounterEditor
        open={!!editing}
        counter={editCounter}
        siblings={counters}
        defaultName={counters.length === 0 ? t.defaults.row : ''}
        onClose={() => setEditing(null)}
        onSave={(d) => (editCounter ? update(editCounter.id, d) : add(d))}
        onDelete={editCounter ? () => void askRemove(editCounter.id) : undefined}
      />

      {focusCounter && <FocusMode counter={focusCounter} onIncrement={(d) => increment(focusCounter.id, d)} onClose={() => setFocusId(undefined)} />}
    </div>
  );
}
