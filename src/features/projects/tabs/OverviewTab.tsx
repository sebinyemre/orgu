import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import type { Gauge, Project } from '@/types';
import { Field } from '@/ui/Field';
import { ProgressRing } from '@/ui/ProgressRing';
import { useLang, useMsgs } from '@/i18n';
import { fmtDate, fmtDuration, timeAgo } from '@/lib/format';
import { projectProgress, projectSeconds, useProjects } from '@/store/projects';
import { HOOK_SIZES, NEEDLE_SIZES } from '@/knowledge/tools';
import { OptionalNumber } from '@/features/counters/OptionalNumber';
import { mmText } from '@/features/stash/labels';
import { localizeUs } from '@/features/stash/stashMath';
import { STS } from '@/features/stash/i18n';
import { PRJ } from '../i18n';
import { STATUSES, STATUS_TONE, clock, gaugeNotesOf, statusPatch, type ProjectExt } from '../projectMath';
import { SwatchArt, TimerButton, useDraft } from '../bits';
import { useNow } from '../hooks';

export function OverviewTab({ project: p }: { project: Project }) {
  const t = useMsgs(PRJ);
  const update = useProjects((s) => s.update);
  const running = !!p.timerStartedAt;
  const now = useNow(running);
  const progress = projectProgress(p);
  const totalSteps = p.pattern?.sections.reduce((n, s) => n + s.steps.length, 0) ?? 0;
  const [notes, setNotes, flushNotes] = useDraft(p.notes, (v) => update(p.id, { notes: v }));

  return (
    <div className="prj-overview">
      <section className="card prj-ov-status">
        <h3 className="prj-box-title">{t.statusLabel}</h3>
        <div className="prj-status-row" role="group" aria-label={t.statusLabel}>
          {STATUSES.map((s) => (
            <button key={s} type="button" className="prj-status-btn" data-tone={STATUS_TONE[s]} aria-pressed={p.status === s} onClick={() => p.status !== s && update(p.id, statusPatch(p, s))}>
              {t.status[s]}
            </button>
          ))}
        </div>
        <dl className="prj-dates">
          <div>
            <dt>{t.created}</dt>
            <dd>{fmtDate(p.createdAt)}</dd>
          </div>
          {p.startedAt && (
            <div>
              <dt>{t.started}</dt>
              <dd>{fmtDate(p.startedAt)}</dd>
            </div>
          )}
          {p.finishedAt && (
            <div>
              <dt>{t.finished}</dt>
              <dd>{fmtDate(p.finishedAt)}</dd>
            </div>
          )}
          <div>
            <dt>{t.lastWorked}</dt>
            <dd>{timeAgo(p.updatedAt)}</dd>
          </div>
        </dl>
      </section>

      <section className="card prj-ov-progress">
        <ProgressRing value={progress / 100} size={96} stroke={9} color={p.color} label={t.progressTitle}>
          <b className="tabular">{t.progress(progress)}</b>
        </ProgressRing>
        <div className="grow stack-sm" style={{ minWidth: 0 }}>
          <h3 className="prj-box-title">{t.progressTitle}</h3>
          <p className="small muted" style={{ margin: 0 }}>
            {p.pattern ? t.stepsDone(p.doneSteps.length, totalSteps) : t.progressHint}
          </p>
          {p.status !== 'bitti' && (
            <button type="button" className="btn btn-soft btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => update(p.id, statusPatch(p, 'bitti'))}>
              <CircleCheck />
              {t.markFinished}
            </button>
          )}
        </div>
      </section>

      <section className="card prj-ov-timer" data-running={running || undefined}>
        <h3 className="prj-box-title">{running ? t.timerRunning : t.totalTime}</h3>
        <div className="prj-clock tabular" aria-live="off">
          {clock(projectSeconds(p, now))}
        </div>
        <div className="xsmall faint">{fmtDuration(projectSeconds(p, now))}</div>
        <TimerButton project={p} />
      </section>

      <SwatchCard project={p} />

      <section className="card prj-ov-notes">
        <Field label={t.notes} htmlFor="prj-notes">
          <textarea id="prj-notes" className="textarea prj-lined" value={notes} placeholder={t.notesPh} onChange={(e) => setNotes(e.target.value)} onBlur={flushNotes} rows={6} />
        </Field>
      </section>
    </div>
  );
}

function SwatchCard({ project: p }: { project: Project }) {
  const t = useMsgs(PRJ);
  const ts = useMsgs(STS);
  const lang = useLang();
  const update = useProjects((s) => s.update);
  const [g, setG] = useState<Partial<Gauge>>(() => ({ ...p.gauge }));
  const [gNotes, setGNotes, flushG] = useDraft(gaugeNotesOf(p), (v) => {
    const patch: Partial<ProjectExt> = { gaugeNotes: v };
    update(p.id, patch);
  });
  const setGauge = (patch: Partial<Gauge>) => {
    const next = { ...g, ...patch };
    setG(next);
    if (next.stitches && next.rows) update(p.id, { gauge: { stitches: next.stitches, rows: next.rows } });
    else if (!next.stitches && !next.rows) update(p.id, { gauge: undefined });
  };
  const sizes = p.craft === 'knit' ? NEEDLE_SIZES : HOOK_SIZES;
  return (
    <section className="card prj-swatch">
      <div className="prj-swatch-art">
        <SwatchArt color={p.color} craft={p.craft} />
        <span className="prj-swatch-ruler" aria-hidden>
          10 cm
        </span>
      </div>
      <div className="prj-swatch-fields">
        <div>
          <h3 className="prj-swatch-title">{t.swatch}</h3>
          <div className="xsmall faint">{t.swatchLede}</div>
        </div>
        <div className="prj-form-grid prj-form-grid-tight">
          <Field label={t.stitches} htmlFor="sw-st">
            <OptionalNumber id="sw-st" value={g.stitches} onChange={(n) => setGauge({ stitches: n })} integer={false} />
          </Field>
          <Field label={t.rows} htmlFor="sw-rows">
            <OptionalNumber id="sw-rows" value={g.rows} onChange={(n) => setGauge({ rows: n })} integer={false} />
          </Field>
        </div>
        <Field label={p.craft === 'knit' ? t.needleSize : t.hookSize} htmlFor="sw-size">
          <select id="sw-size" className="select" value={p.toolSizeMm ?? ''} onChange={(e) => update(p.id, { toolSizeMm: e.target.value ? Number(e.target.value) : undefined })}>
            <option value="">{t.none}</option>
            {sizes.map((s) => (
              <option key={s.mm} value={s.mm}>
                {mmText(s.mm, lang)}
                {s.us ? ` · US ${localizeUs(s.us, ts.steel, s.steel)}` : ''}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.swatchNotes} htmlFor="sw-notes">
          <input id="sw-notes" className="input" value={gNotes} placeholder={t.swatchNotesPh} onChange={(e) => setGNotes(e.target.value)} onBlur={flushG} maxLength={120} />
        </Field>
      </div>
    </section>
  );
}
