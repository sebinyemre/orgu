import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { NotebookPen, Ruler, Scissors, Spool } from 'lucide-react';
import type { Project } from '@/types';
import { EmptyState } from '@/ui/EmptyState';
import { ProgressRing } from '@/ui/ProgressRing';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { fmt, fmtMeters } from '@/lib/format';
import { projectProgress, useProjects } from '@/store/projects';
import { Callout } from '@/ui/Callout';
import { SafePatternView } from '../SafeLazy';
import { PRJ } from '../i18n';
import { useTerms } from '@/ui/Term';
import { useSettings } from '@/store/settings';
import { relocalizePattern } from '@/features/recipe/relocalize';

export function PatternTab({ project: p }: { project: Project }) {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const toggleStep = useProjects((s) => s.toggleStep);
  const { ctx } = useTerms();
  const units = useSettings((s) => s.units);
  // kaydedildiği dilde kalmasın: başlık ve özet de geçerli dilde ve birimde gösterilir
  const shown = useMemo(() => (p.pattern ? relocalizePattern(p.pattern, ctx, units) : undefined), [p.pattern, ctx.lang, ctx.trabzan, ctx.crochetEn, units]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!p.pattern || !shown) {
    return (
      <EmptyState
        title={t.noPattern}
        color={p.color}
        action={
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link to="/yarat" className="btn btn-soft">
              <Scissors />
              {tc.navWorks}
            </Link>
            <Link to="/tarif" className="btn btn-primary">
              <NotebookPen />
              {tc.navRecipe}
            </Link>
          </div>
        }
      >
        {t.noPatternText}
      </EmptyState>
    );
  }
  const pat = shown;
  const total = pat.sections.reduce((n, s) => n + s.steps.length, 0);
  const progress = projectProgress(p);
  return (
    <div className="stack">
      <section className="card prj-pattern-head">
        <div className="grow stack-sm" style={{ minWidth: 0 }}>
          <h3 style={{ margin: 0 }}>{pat.title}</h3>
          {pat.summary && (
            <p className="small muted" style={{ margin: 0 }}>
              {pat.summary}
            </p>
          )}
          <div className="row">
            {pat.yarnMeters > 0 && (
              <span className="chip" data-tone="terracotta">
                <Spool />
                {t.patternMeters(fmtMeters(pat.yarnMeters))}
              </span>
            )}
            {pat.finishedSize && (
              <span className="chip" data-tone="denim">
                <Ruler />
                {t.finishedSize}: {pat.finishedSize}
              </span>
            )}
            {pat.gauge && (
              <span className="chip" data-tone="sage">
                {t.swatch}: {fmt(pat.gauge.stitches, 1)} × {fmt(pat.gauge.rows, 1)} / 10 cm
              </span>
            )}
          </div>
        </div>
        <ProgressRing value={progress / 100} size={72} stroke={7} color={p.color} label={t.stepsDone(p.doneSteps.length, total)}>
          <b className="small tabular">{t.progress(progress)}</b>
        </ProgressRing>
      </section>
      <SafePatternView pattern={pat} doneSteps={p.doneSteps} onToggleStep={(id) => toggleStep(p.id, id)} compact fallback={<Callout tone="warn">{t.patternUnavailable}</Callout>} />
    </div>
  );
}
