import { useState, type FormEvent } from 'react';
import { Clock, PenLine, Tally5, Trash2 } from 'lucide-react';
import type { JournalEntry, Project } from '@/types';
import { Field } from '@/ui/Field';
import { EmptyState } from '@/ui/EmptyState';
import { confirmDialog } from '@/ui/Confirm';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { fmtDate } from '@/lib/format';
import { shade } from '@/lib/color';
import { useProjects } from '@/store/projects';
import { OptionalNumber } from '@/features/counters/OptionalNumber';
import { PRJ } from '../i18n';
import { dateInputValue, journalSeries, parseDateInput, sortedJournal, type SeriesPoint } from '../projectMath';
import { MoodFace, MoodPicker } from '../MoodFace';

type Mood = NonNullable<JournalEntry['mood']>;

/** Oturum başına örülen sıra: tek seri, sade sütunlar; en yüksek ve son değer etiketli */
function RowsChart({ points, color }: { points: SeriesPoint[]; color: string }) {
  const t = useMsgs(PRJ);
  const max = Math.max(...points.map((p) => p.rows));
  const sum = points.reduce((n, p) => n + p.rows, 0);
  const maxIdx = points.findIndex((p) => p.rows === max);
  return (
    <figure className="prj-rows-chart card">
      <figcaption className="spread">
        <b>{t.chartTitle}</b>
        <span className="xsmall muted">{t.chartTotal(sum, points.length)}</span>
      </figcaption>
      <div className="prj-bars" role="list">
        {points.map((pt, i) => {
          const label = t.barTitle(fmtDate(pt.date, true), pt.rows);
          return (
            <div key={pt.id} className="prj-bar-slot" role="listitem" title={label} aria-label={label}>
              {(i === maxIdx || i === points.length - 1) && <span className="prj-bar-val tabular">{pt.rows}</span>}
              <span className="prj-bar" style={{ height: `${Math.max(4, (pt.rows / max) * 100)}%`, background: shade(color, -0.12) }} />
            </div>
          );
        })}
      </div>
      <div className="prj-bars-axis xsmall faint">
        <span>{fmtDate(points[0].date, true)}</span>
        <span>{fmtDate(points[points.length - 1].date, true)}</span>
      </div>
    </figure>
  );
}

interface Draft {
  date: string;
  text: string;
  rows?: number;
  minutes?: number;
  mood?: Mood;
}

export function JournalTab({ project: p }: { project: Project }) {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const addJournal = useProjects((s) => s.addJournal);
  const removeJournal = useProjects((s) => s.removeJournal);
  const [d, setD] = useState<Draft>(() => ({ date: dateInputValue(Date.now()), text: '' }));
  const set = (patch: Partial<Draft>) => setD((x) => ({ ...x, ...patch }));
  const entries = sortedJournal(p.journal);
  const series = journalSeries(p.journal);
  const canAdd = !!(d.text.trim() || d.rows || d.minutes || d.mood);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    addJournal(p.id, { date: parseDateInput(d.date) ?? Date.now(), text: d.text.trim(), rowsDone: d.rows || undefined, minutes: d.minutes || undefined, mood: d.mood });
    setD((x) => ({ date: x.date, text: '' }));
  };
  const askRemove = async (id: string) => {
    if (await confirmDialog(t.deleteEntryConfirm, { confirmLabel: tc.delete, danger: true })) removeJournal(p.id, id);
  };

  return (
    <div className="prj-journal">
      <form className="card prj-entry-form stack" onSubmit={submit}>
        <h3 className="prj-box-title">
          <PenLine aria-hidden />
          {t.newEntry}
        </h3>
        <Field label={t.entryText} htmlFor="j-text">
          <textarea id="j-text" className="textarea prj-lined" rows={3} value={d.text} placeholder={t.entryPh} onChange={(e) => set({ text: e.target.value })} />
        </Field>
        <div className="prj-form-grid prj-form-grid-3">
          <Field label={t.date} htmlFor="j-date">
            <input id="j-date" type="date" className="input" value={d.date} max={dateInputValue(Date.now())} onChange={(e) => set({ date: e.target.value })} />
          </Field>
          <Field label={t.rowsDone} htmlFor="j-rows">
            <OptionalNumber id="j-rows" value={d.rows} onChange={(n) => set({ rows: n })} />
          </Field>
          <Field label={t.minutes} htmlFor="j-min">
            <OptionalNumber id="j-min" value={d.minutes} onChange={(n) => set({ minutes: n })} />
          </Field>
        </div>
        <div className="stack-sm">
          <span className="label">{t.mood}</span>
          <MoodPicker value={d.mood} onChange={(mood) => set({ mood })} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }} disabled={!canAdd}>
          {t.addEntry}
        </button>
      </form>

      <div className="stack">
        {series.length >= 2 && <RowsChart points={series} color={p.color} />}
        {entries.length === 0 ? (
          <EmptyState title={t.emptyJournal} color={p.color}>
            {t.emptyJournalText}
          </EmptyState>
        ) : (
          <ol className="prj-entries">
            {entries.map((j) => (
              <li key={j.id} className="prj-entry">
                <div className="prj-entry-side">
                  <span className="prj-entry-date">{fmtDate(j.date, true)}</span>
                  {j.mood && <MoodFace mood={j.mood} size={34} title={t.moods[j.mood - 1]} />}
                </div>
                <div className="grow" style={{ minWidth: 0 }}>
                  {j.text && <p className="prj-entry-text">{j.text}</p>}
                  <div className="row">
                    {j.rowsDone ? (
                      <span className="chip" data-tone="terracotta">
                        <Tally5 />
                        {t.rowsChip(j.rowsDone)}
                      </span>
                    ) : null}
                    {j.minutes ? (
                      <span className="chip" data-tone="denim">
                        <Clock />
                        {tc.minutes(j.minutes)}
                      </span>
                    ) : null}
                    {j.mood && <span className="xsmall muted">{t.moods[j.mood - 1]}</span>}
                  </div>
                </div>
                <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => void askRemove(j.id)} aria-label={t.deleteEntry} title={t.deleteEntry}>
                  <Trash2 />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
