import { useState } from 'react';
import { CircleDot } from 'lucide-react';
import type { YarnWeightId } from '@/types';
import { useLang, useMsgs } from '@/i18n';
import { Segmented } from '@/ui/Segmented';
import { Switch } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { useTerms } from '@/ui/Term';
import { YARN_WEIGHTS, typicalGauge } from '@/knowledge/yarnWeights';
import { CROCHET_BASICS } from '@/knowledge/terms';
import { fmt } from '@/lib/format';
import { CALC } from '../i18n';
import { circlePlan, gaugeSpanCm, niceDefault, perSpan, perTenCm, type CircleRound } from '../logic';
import { BigResult, CalcLayout, LabeledField, LengthInput, RelatedLessons, SpanCountFields, useLen, useSpanText, useUnits, type SpanCount, weightLabel } from '../ui';
import { CircleRings } from '../visuals';

type St = 'sc' | 'hdc' | 'dc';
const START: Record<St, number> = { sc: 6, hdc: 8, dc: 12 };

export default function CircleCalc() {
  const t = useMsgs(CALC);
  const lang = useLang();
  const terms = useTerms();
  const units = useUnits();
  const len = useLen();
  const span = useSpanText();
  const [diameter, setDiameter] = useState(() => niceDefault(15, 6, units));
  const [st, setSt] = useState<St>('sc');
  const [weight, setWeight] = useState<YarnWeightId>(4);
  const [mode, setMode] = useState<'typical' | 'own'>('typical');
  const [own, setOwn] = useState<SpanCount>({
    count: 14,
    overCm: gaugeSpanCm(units),
  });
  const [stagger, setStagger] = useState(true);

  const rowsPerTen = mode === 'typical' ? typicalGauge(weight, 'crochet', st).rows : perTenCm(own.count, own.overCm);
  const start = START[st];
  const plan = circlePlan(diameter, start, rowsPerTen, stagger);
  // İspanyolca, Portekizce ve İngilizce tariflerde kısaltma, Türkçede tam ad kullanılır
  const stWord = lang === 'tr' ? terms.lower(st) : terms.abbr(st);
  const b = CROCHET_BASICS[st];

  const roundText = (r: CircleRound) => {
    if (r.kind === 'ring') {
      if (st === 'sc') return t.circle.ringPlain(start, stWord);
      if (b.turningCounts) return t.circle.ringCounts(b.turningCh, start - 1, stWord);
      return t.circle.ringChain(b.turningCh, start, stWord);
    }
    if (r.kind === 'incAll') return t.circle.incAll(stWord);
    if (r.offset > 0) return t.circle.stagger2(r.offset, r.plain, r.times - 1, r.plain - r.offset, stWord);
    return t.circle.repeat(r.plain, stWord, r.times);
  };

  return (
    <CalcLayout
      id="tig-daire"
      icon={<CircleDot />}
      result={
        plan ? (
          <div className="stack">
            <BigResult
              label={t.result}
              value={t.circle.rounds(plan.rounds.length)}
              sub={`${t.circle.finalDiameter(len(plan.finalDiameterCm))} · ${t.circle.lastRound(plan.rounds[plan.rounds.length - 1].stitches)}`}
            />
            <div className="card calc-rings-card">
              <CircleRings rounds={plan.rounds} label={t.circle.visual} />
            </div>
          </div>
        ) : (
          <Callout tone="warn">{t.circle.rowGaugeHint(span)}</Callout>
        )
      }
      after={
        <>
          {plan && (
            <div className="card">
              <div className="calc-rounds" role="table" aria-label={t.circle.visual}>
                <div className="calc-rounds-head" role="row">
                  <span role="columnheader">{t.circle.colRound}</span>
                  <span role="columnheader">{t.circle.colSts}</span>
                  <span role="columnheader">{t.circle.colHow}</span>
                  <span role="columnheader">{t.circle.colDiam}</span>
                </div>
                {plan.rounds.map((r) => (
                  <div key={r.n} className="calc-rounds-row" role="row">
                    <span role="cell" className="calc-rounds-n">
                      {r.n}
                    </span>
                    <span role="cell" className="tabular">
                      <strong>{r.stitches}</strong>
                    </span>
                    <span role="cell" className="calc-rounds-text">
                      {roundText(r)}
                    </span>
                    <span role="cell" className="faint small tabular">
                      {len(r.diameterCm)}
                    </span>
                  </div>
                ))}
              </div>
              {lang !== 'tr' && (
                <p className="small faint" style={{ margin: '8px 0 0' }}>
                  {stWord} = {terms.lower(st)}
                </p>
              )}
              <p className="small muted" style={{ margin: '8px 0 0' }}>
                {terms.fill(t.circle.closeNote)}
              </p>
            </div>
          )}
          <Callout tone="prof">{t.circle.tip}</Callout>
          <RelatedLessons ids={['tig-sihirli-halka', 'tig-artirma', 'tig-daire']} />
        </>
      }
    >
      <div className="stack">
        <LabeledField label={t.circle.target}>{(id) => <LengthInput id={id} cm={diameter} onChange={setDiameter} />}</LabeledField>
        <LabeledField label={t.circle.stitch} hint={t.circle.starts(start)}>
          {() => (
            <Segmented<St>
              label={t.circle.stitch}
              value={st}
              onChange={setSt}
              options={(['sc', 'hdc', 'dc'] as const).map((k) => ({
                value: k,
                label: terms.name(k),
              }))}
            />
          )}
        </LabeledField>
        <div className="calc-sep" />
        <Segmented
          label={t.gauge}
          value={mode}
          onChange={setMode}
          options={[
            { value: 'typical', label: t.typicalGauge },
            { value: 'own', label: t.ownGauge },
          ]}
        />
        {mode === 'typical' ? (
          <LabeledField
            label={t.yarnWeight}
            hint={t.gaugeLine(span, fmt(perSpan(typicalGauge(weight, 'crochet', st).stitches, gaugeSpanCm(units)), 0, lang), fmt(perSpan(rowsPerTen, gaugeSpanCm(units)), 0, lang))}
          >
            {(id) => (
              <select id={id} className="select" value={weight} onChange={(e) => setWeight(Number(e.target.value) as YarnWeightId)}>
                {YARN_WEIGHTS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {weightLabel(w, lang)}
                  </option>
                ))}
              </select>
            )}
          </LabeledField>
        ) : (
          <>
            <SpanCountFields value={own} onChange={setOwn} countLabel={t.rows} overLabel={t.overHeight} />
            <span className="hint">{t.circle.rowGaugeHint(span)}</span>
          </>
        )}
        <Switch checked={stagger} onChange={setStagger} label={t.circle.stagger} hint={t.circle.staggerHint} />
      </div>
    </CalcLayout>
  );
}
