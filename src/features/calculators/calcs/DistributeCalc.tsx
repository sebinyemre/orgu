import { useState } from 'react';
import { Columns3 } from 'lucide-react';
import type { Craft } from '@/types';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { Segmented } from '@/ui/Segmented';
import { NumberInput } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { distribute, shapingFrequency, type ShapeKind, type WorkMode } from '@/engine/math/distribute';
import { CALC } from '../i18n';
import { BigResult, CalcLayout, LabeledField, RelatedLessons } from '../ui';
import { StitchMap } from '../visuals';

export default function DistributeCalc() {
  const t = useMsgs(CALC);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const [craft, setCraft] = useState<Craft>('knit');
  const [mode, setMode] = useState<WorkMode>('flat');
  const [kind, setKind] = useState<ShapeKind>('inc');
  const [current, setCurrent] = useState(87);
  const [count, setCount] = useState(12);
  const [rows, setRows] = useState(60);
  const [events, setEvents] = useState(10);

  const r = distribute(current, count, kind, mode, craft, lang);
  const freq = shapingFrequency(rows, events, lang);
  const shapeLabel = kind === 'dec' ? t.dist.legendDec : craft === 'crochet' ? t.dist.legendIncCrochet : t.dist.legendInc;
  const lessons = craft === 'knit' ? (kind === 'inc' ? ['sis-artirma'] : ['sis-eksiltme']) : kind === 'inc' ? ['tig-artirma'] : ['tig-eksiltme'];

  return (
    <CalcLayout
      id="esit-dagitim"
      icon={<Columns3 />}
      result={
        r.ok ? (
          <div className="stack">
            <BigResult label={t.dist.instructions} value={<span className="calc-instruction-big">{r.text}</span>} sub={t.dist.beforeAfter(r.before, r.after)} />
            <div className="card stack-sm">
              <div className="stat-label">{t.dist.map}</div>
              <StitchMap groups={r.groups} kind={kind} craft={craft} labels={{ plain: t.dist.legendPlain, shape: shapeLabel }} />
              <div className="row small muted calc-legend">
                <span className="row-nowrap">
                  <span className="calc-map-st" aria-hidden /> {t.dist.legendPlain}
                </span>
                <span className="row-nowrap">
                  <span className={`calc-map-shape ${kind}`} aria-hidden>
                    {kind === 'inc' ? '+' : '−'}
                  </span>{' '}
                  {shapeLabel}
                </span>
              </div>
              <p className="small muted" style={{ margin: 0 }}>
                {mode === 'flat' ? t.dist.flatNote : t.dist.roundNote}
              </p>
            </div>
          </div>
        ) : (
          <Callout tone="warn">{r.error}</Callout>
        )
      }
      after={
        <>
          <div className="card stack">
            <div className="card-title">{t.dist.spreadTitle}</div>
            <div className="calc-pair">
              <LabeledField label={t.dist.spreadRows}>{(id) => <NumberInput id={id} integer min={1} value={rows} onChange={setRows} />}</LabeledField>
              <LabeledField label={t.dist.spreadEvents}>{(id) => <NumberInput id={id} integer min={1} value={events} onChange={setEvents} />}</LabeledField>
            </div>
            {freq.text && (
              <p className="calc-instruction" style={{ margin: 0 }}>
                {freq.text}
              </p>
            )}
          </div>
          <Callout tone="prof">{t.dist.tip}</Callout>
          <RelatedLessons ids={lessons} />
        </>
      }
    >
      <div className="stack">
        <Segmented<Craft>
          label={t.craft}
          value={craft}
          onChange={setCraft}
          options={[
            { value: 'knit', label: c.knit },
            { value: 'crochet', label: c.crochet },
          ]}
        />
        <Segmented<WorkMode>
          label={t.flat}
          value={mode}
          onChange={setMode}
          options={[
            { value: 'flat', label: t.flat },
            { value: 'round', label: t.round },
          ]}
        />
        <Segmented<ShapeKind>
          label={t.dist.kind}
          value={kind}
          onChange={setKind}
          options={[
            { value: 'inc', label: t.dist.inc },
            { value: 'dec', label: t.dist.dec },
          ]}
        />
        <div className="calc-pair">
          <LabeledField label={t.dist.current}>{(id) => <NumberInput id={id} integer min={1} value={current} onChange={setCurrent} />}</LabeledField>
          <LabeledField label={kind === 'inc' ? t.dist.incCount : t.dist.decCount}>
            {(id) => <NumberInput id={id} integer min={1} value={count} onChange={setCount} />}
          </LabeledField>
        </div>
      </div>
    </CalcLayout>
  );
}
