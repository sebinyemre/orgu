import { useState } from 'react';
import { PencilRuler } from 'lucide-react';
import { useLang, useMsgs } from '@/i18n';
import { Callout } from '@/ui/Callout';
import { Stepper } from '@/ui/Field';
import { useTerms } from '@/ui/Term';
import { YARN_WEIGHTS, typicalGauge, weightFromWpi, weightAliases } from '@/knowledge/yarnWeights';
import { fmt } from '@/lib/format';
import type { YarnWeightId } from '@/types';
import { CALC } from '../i18n';
import { CM_PER_IN, gaugeSpanCm, perSpan, wpiFrom } from '../logic';
import { BigResult, CalcLayout, LabeledField, LengthInput, RelatedLessons, useLen, useSpanText, useUnits } from '../ui';
import { WeightScale, WpiIllustration } from '../visuals';

export default function WpiCalc() {
  const t = useMsgs(CALC);
  const lang = useLang();
  const terms = useTerms();
  const units = useUnits();
  const len = useLen();
  const span = useSpanText();
  const [wraps, setWraps] = useState(10);
  const [lengthCm, setLengthCm] = useState(units === 'in' ? CM_PER_IN : 2.5);
  const [picked, setPicked] = useState<YarnWeightId | null>(null);

  const wpi = wpiFrom(wraps, lengthCm);
  const found = Number.isFinite(wpi) ? weightFromWpi(wpi) : YARN_WEIGHTS[4];
  const w = picked !== null ? YARN_WEIGHTS[picked] : found;
  const spanCm = gaugeSpanCm(units);
  const kg = typicalGauge(w.id, 'knit');
  const cg = typicalGauge(w.id, 'crochet');
  const mmRange = (r: [number, number]) => `${fmt(r[0], 2, lang)}–${fmt(r[1], 2, lang)} mm`;
  const stRange = (r: [number, number]) => `${fmt(perSpan(r[0], spanCm), 0, lang)}–${fmt(perSpan(r[1], spanCm), 0, lang)}`;
  const lengthText = len(lengthCm, 1);
  // takma adlar Türkçe ve İngilizce karışık; diğer dillerde yalnızca uluslararası (İngilizce) adlar
  const aliases = weightAliases(w, lang);

  return (
    <CalcLayout
      id="ip-kalinligi"
      icon={<PencilRuler />}
      result={
        <div className="stack">
          <BigResult label={t.wpi.category} value={`${w.id} · ${w.name[lang]}`} sub={`${w.en} · ${fmt(w.wpi[0], 0, lang)}–${fmt(w.wpi[1], 0, lang)} WPI`} />
          <div className="card calc-facts">
            <dl>
              <dt>{t.wpi.needles}</dt>
              <dd>{mmRange(w.needleMm)}</dd>
              <dt>{t.wpi.hooks}</dt>
              <dd>{mmRange(w.hookMm)}</dd>
              <dt>{t.wpi.knitGauge(span)}</dt>
              <dd>
                {stRange(w.knitSts)} <span className="faint small">({fmt(perSpan(kg.stitches, spanCm), 0, lang)})</span>
              </dd>
              <dt>{t.wpi.crochetGauge(span, terms.lower('sc'))}</dt>
              <dd>
                {stRange(w.crochetSts)} <span className="faint small">({fmt(perSpan(cg.stitches, spanCm), 0, lang)})</span>
              </dd>
              <dt>{t.wpi.metersPer100}</dt>
              <dd>
                {fmt(w.metersPer100g[0], 0, lang)}–{fmt(w.metersPer100g[1], 0, lang)} m
              </dd>
              <dt>{t.wpi.aliases}</dt>
              <dd>{aliases.join(', ')}</dd>
            </dl>
            <p className="small muted" style={{ margin: '8px 0 0' }}>
              {w.shelf[lang]}
            </p>
            <div className="row" style={{ marginTop: 8 }}>
              <span className="stat-label">{t.wpi.uses}</span>
              {w.uses.map((u) => (
                <span key={u.en} className="chip" data-tone="sage">
                  {u[lang]}
                </span>
              ))}
            </div>
          </div>
        </div>
      }
      after={
        <>
          <div className="card stack">
            <div className="card-title">{t.howToMeasure}</div>
            <WpiIllustration label={t.wpi.illustration} lengthLabel={len(units === 'in' ? CM_PER_IN : 2.5, 1)} />
            <ol className="steps">
              {t.wpi.steps(units === 'in' ? len(CM_PER_IN, 0) : len(2.5, 1)).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <Callout tone="warn">{t.wpi.screenWarn}</Callout>
          </div>
          <RelatedLessons ids={['haz-ip-secimi', 'haz-numaralar']} />
        </>
      }
    >
      <div className="stack">
        <p className="small muted" style={{ margin: 0 }}>
          {t.wpi.wpiExplain}
        </p>
        <div className="calc-pair">
          <LabeledField label={t.wpi.wraps}>
            {() => (
              <Stepper
                value={wraps}
                min={1}
                max={60}
                ariaLabel={t.wpi.wraps}
                onChange={(n) => {
                  setWraps(n);
                  setPicked(null);
                }}
              />
            )}
          </LabeledField>
          <LabeledField label={t.wpi.overLength}>
            {(id) => (
              <LengthInput
                id={id}
                cm={lengthCm}
                onChange={(cm) => {
                  setLengthCm(cm);
                  setPicked(null);
                }}
              />
            )}
          </LabeledField>
        </div>
        <div className="calc-wpi-value">
          <span className="calc-big-value">{Number.isFinite(wpi) ? fmt(wpi, 1, lang) : '–'}</span>
          <span className="stat-label">{t.wpi.wpiIs}</span>
          <span className="faint small">
            {wraps} / {lengthText}
          </span>
        </div>
        <div className="calc-sep" />
        <div className="stat-label">{t.wpi.scale}</div>
        <WeightScale active={w.id} onPick={setPicked} />
      </div>
    </CalcLayout>
  );
}
