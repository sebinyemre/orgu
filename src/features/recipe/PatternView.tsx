/**
 * Tarif görünümü: basılı bir örgü tarifi gibi dizilmiş başlık, ölçüler, malzemeler, kısaltmalar,
 * işaretlenebilir adımlar, notlar ve şemalar. Tarif hazırlayıcı, eserler ve projeler kullanır.
 * Tarif farklı bir dilde kaydedildiyse geçerli dilde yeniden üretilir (adım kimlikleri korunur).
 */
import { useMemo } from 'react';
import { Check, Repeat } from 'lucide-react';
import type { GeneratedPattern, PatternDiagram, PatternStep } from '@/types';
import { useLang, useMsgs } from '@/i18n';
import { useSettings } from '@/store/settings';
import { useTerms } from '@/ui/Term';
import { fmt, fmtMeters } from '@/lib/format';
import { skeinsFor } from '@/engine/math/yarn';
import { TechniqueLink } from '@/features/learn/TechniqueLink';
import { RichText } from './RichText';
import { RoundsDiagram } from './diagrams/RoundsDiagram';
import { GrannyDiagram } from './diagrams/GrannyDiagram';
import { Schematic } from './diagrams/Schematic';
import { relocalizePattern } from './relocalize';
import { R } from './i18n';
import './recipe.css';

export interface PatternViewProps {
  pattern: GeneratedPattern;
  /** tamamlanan adım id'leri (verilirse adımlar işaretlenebilir olur) */
  doneSteps?: string[];
  onToggleStep?: (stepId: string) => void;
  /** proje sayfası içinde daha sıkışık görünüm */
  compact?: boolean;
}

interface ParamsView {
  gaugeLabel?: string;
  extraDiagrams?: PatternDiagram[];
  yarn?: { metersPerSkein?: number; colors?: { hex: string }[] };
}

export function PatternView({ pattern: raw, doneSteps, onToggleStep, compact }: PatternViewProps) {
  const t = useMsgs(R);
  const lang = useLang();
  const { ctx } = useTerms();
  const units = useSettings((s) => s.units);
  const pattern = useMemo(() => relocalizePattern(raw, ctx, units), [raw, ctx.lang, ctx.trabzan, ctx.crochetEn, units]); // eslint-disable-line react-hooks/exhaustive-deps
  const params = pattern.params as ParamsView;
  const done = new Set(doneSteps ?? []);
  const allSteps = pattern.sections.flatMap((s) => s.steps);
  const doneCount = allSteps.filter((s) => done.has(s.id)).length;
  const mainColor = params.yarn?.colors?.[0]?.hex ?? '#d39a2c';
  const perSkein = params.yarn?.metersPerSkein;
  const skeins = perSkein ? Math.max(1, Math.ceil(skeinsFor(pattern.yarnMeters, perSkein) - 0.05)) : 0;
  const diagrams = [pattern.diagram, ...(params.extraDiagrams ?? [])].filter(Boolean) as PatternDiagram[];
  const gaugeText = params.gaugeLabel ?? `${fmt(pattern.gauge.stitches, 1, lang)} × ${fmt(pattern.gauge.rows, 1, lang)} = 10 cm`;

  const extras = (
    <>
      <section className="pv-block" aria-labelledby="pv-mat">
        <h3 id="pv-mat" className="pv-h">
          {t.materials}
        </h3>
        <ul className="pv-materials">
          {pattern.materials.map((m, i) => (
            <li key={i}>
              <span className="pv-mat-label">{m.label}</span>
              {m.detail && <span className="pv-mat-detail">{m.detail}</span>}
            </li>
          ))}
        </ul>
      </section>
      {pattern.abbreviations.length > 0 && (
        <section className="pv-block" aria-labelledby="pv-abbr">
          <h3 id="pv-abbr" className="pv-h">
            {t.abbreviations}
          </h3>
          <dl className="pv-abbr">
            {pattern.abbreviations.map((a, i) => (
              <div key={i}>
                <dt>{a.lessonId ? <TechniqueLink lessonId={a.lessonId}>{a.abbr}</TechniqueLink> : a.abbr}</dt>
                <dd>{a.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );

  const diagramBlock = diagrams.length > 0 && (
    <section className="pv-block pv-diagrams" aria-labelledby="pv-dia">
      <h3 id="pv-dia" className="pv-h">
        {t.diagrams}
      </h3>
      <div className="pv-diagram-grid">
        {diagrams.map((d, i) =>
          d.kind === 'rounds' ? <RoundsDiagram key={i} d={d} /> : d.kind === 'granny' ? <GrannyDiagram key={i} rounds={d.rounds} colors={d.colors} /> : <Schematic key={i} d={d} color={mainColor} />,
        )}
      </div>
    </section>
  );

  return (
    <article className={`pv${compact ? ' pv-compact' : ''}`} lang={lang}>
      <header className="pv-head">
        <div className="pv-kicker">{pattern.craft === 'knit' ? t.knitCraft : t.crochetCraft}</div>
        <h2 className="pv-title">{pattern.title}</h2>
        {!compact && <p className="pv-summary">{pattern.summary}</p>}
        <dl className="pv-specs">
          <div>
            <dt>{t.finishedSize}</dt>
            <dd>{pattern.finishedSize}</dd>
          </div>
          <div>
            <dt>{t.gauge}</dt>
            <dd>{gaugeText}</dd>
          </div>
          <div>
            <dt>{t.yarn}</dt>
            <dd>
              {t.aboutMeters(fmtMeters(pattern.yarnMeters, lang))}
              {skeins > 0 && <> · {t.skeins(skeins)}</>}
            </dd>
          </div>
        </dl>
        {onToggleStep && allSteps.length > 0 && (
          <div className="pv-progress no-print">
            <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={allSteps.length} aria-valuenow={doneCount}>
              <span style={{ width: `${(doneCount / allSteps.length) * 100}%` }} />
            </div>
            <span className="xsmall faint">{t.progress(doneCount, allSteps.length)}</span>
          </div>
        )}
      </header>

      <div className="pv-layout">
        <aside className="pv-side">
          {compact ? (
            <details className="pv-details">
              <summary>
                {t.materials} · {t.abbreviations}
              </summary>
              {extras}
            </details>
          ) : (
            extras
          )}
          {!compact && diagramBlock}
        </aside>

        <div className="pv-main">
          {pattern.sections.map((s) => (
            <section key={s.id} className="pv-section" aria-labelledby={`pv-s-${s.id}`}>
              <h3 id={`pv-s-${s.id}`} className="pv-section-title">
                {s.title}
              </h3>
              {s.intro && (
                <p className="pv-intro">
                  <RichText text={s.intro} />
                </p>
              )}
              <ol className="pv-steps">
                {s.steps.map((st) => (
                  <Step key={st.id} st={st} done={done.has(st.id)} onToggle={onToggleStep} />
                ))}
              </ol>
            </section>
          ))}
          {pattern.notes.length > 0 && (
            <section className="pv-block pv-notes" aria-labelledby="pv-notes">
              <h3 id="pv-notes" className="pv-h">
                {t.notes}
              </h3>
              <ul>
                {pattern.notes.map((n, i) => (
                  <li key={i}>
                    <RichText text={n} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {compact && diagramBlock && (
            <details className="pv-details">
              <summary>{t.diagrams}</summary>
              {diagramBlock}
            </details>
          )}
        </div>
      </div>
    </article>
  );
}

function Step({ st, done, onToggle }: { st: PatternStep; done: boolean; onToggle?: (id: string) => void }) {
  const t = useMsgs(R);
  return (
    <li className="pv-step" data-done={done || undefined}>
      {onToggle && (
        <button type="button" className="pv-check" role="checkbox" aria-checked={done} aria-label={t.markStep(st.label)} onClick={() => onToggle(st.id)}>
          {done && <Check aria-hidden />}
        </button>
      )}
      <div className="pv-step-body">
        <div className="pv-step-line">
          <span className="pv-label">{st.label}</span>
          <span className="pv-text">
            <RichText text={st.text} />
          </span>
        </div>
        {(st.count !== undefined || st.repeat || st.color) && (
          <div className="pv-badges">
            {st.color && <span className="pv-color" style={{ background: st.color }} title={st.color} aria-hidden />}
            {st.count !== undefined && <span className="pv-count">{t.stitchesBadge(st.count)}</span>}
            {st.repeat && st.repeat > 1 && (
              <span className="pv-repeat">
                <Repeat aria-hidden />
                {t.repeatBadge(st.repeat)}
              </span>
            )}
          </div>
        )}
        {st.note && (
          <p className="pv-step-note">
            <RichText text={st.note} />
          </p>
        )}
      </div>
    </li>
  );
}

export default PatternView;
