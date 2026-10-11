import { useState } from 'react';
import { Grid2x2 } from 'lucide-react';
import { useLang, useMsgs } from '@/i18n';
import { Tabs } from '@/ui/Tabs';
import { NumberInput } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { fmt } from '@/lib/format';
import { CALC } from '../i18n';
import { CM_PER_IN, compareGauge, convertPatternCount, gaugeSpanCm, niceDefault, normalizeSwatch, perSpan, perTenCm } from '../logic';
import { BigResult, CalcLayout, HowTo, LabeledField, LengthInput, RelatedLessons, usePct, useLen, useSpanText, useUnitLabel, useUnits } from '../ui';

interface G3 {
  st: number;
  rows: number;
  overCm: number;
}

function GaugeBlock({ title, value, onChange }: { title: string; value: G3; onChange: (v: G3) => void }) {
  const t = useMsgs(CALC);
  return (
    <div className="stack-sm">
      <div className="label">{title}</div>
      <div className="calc-triple">
        <LabeledField label={t.stitches}>{(id) => <NumberInput id={id} min={0} value={value.st} onChange={(st) => onChange({ ...value, st })} />}</LabeledField>
        <LabeledField label={t.rows}>{(id) => <NumberInput id={id} min={0} value={value.rows} onChange={(rows) => onChange({ ...value, rows })} />}</LabeledField>
        <LabeledField label={t.over}>{(id) => <LengthInput id={id} cm={value.overCm} onChange={(overCm) => onChange({ ...value, overCm })} />}</LabeledField>
      </div>
    </div>
  );
}

export default function GaugeCalc() {
  const t = useMsgs(CALC);
  const lang = useLang();
  const units = useUnits();
  const unit = useUnitLabel();
  const len = useLen();
  const pct = usePct();
  const span = useSpanText();
  const spanCm = gaugeSpanCm(units);
  const [tab, setTab] = useState<'compare' | 'normalize'>('compare');
  const [pat, setPat] = useState<G3>({ st: 22, rows: 30, overCm: spanCm });
  const [mine, setMine] = useState<G3>({ st: 20, rows: 28, overCm: spanCm });
  const [counts, setCounts] = useState({
    st: 110,
    rows: 140,
    widthCm: niceDefault(50, 20, units),
  });
  const [sw, setSw] = useState({
    st: 26,
    w: niceDefault(12, 5, units),
    rows: 36,
    h: niceDefault(12, 5, units),
  });

  const pg = {
    stitches: perTenCm(pat.st, pat.overCm),
    rows: perTenCm(pat.rows, pat.overCm),
  };
  const mg = {
    stitches: perTenCm(mine.st, mine.overCm),
    rows: perTenCm(mine.rows, mine.overCm),
  };
  const cmp = compareGauge(pg, mg);
  const norm = normalizeSwatch(sw.st, sw.w, sw.rows, sw.h);
  const unitCm = units === 'in' ? CM_PER_IN : 1;

  const widthLine = cmp ? (Math.abs(cmp.widthPct) < 0.5 ? t.conv.same : cmp.widthPct > 0 ? t.conv.wider(pct(cmp.widthPct)) : t.conv.narrower(pct(-cmp.widthPct))) : '';
  const heightLine =
    cmp && Number.isFinite(cmp.heightPct) && Math.abs(cmp.heightPct) >= 0.5 ? (cmp.heightPct > 0 ? t.conv.taller(pct(cmp.heightPct)) : t.conv.shorter(pct(-cmp.heightPct))) : '';

  const result =
    tab === 'compare' ? (
      cmp ? (
        <div className="stack">
          <BigResult label={t.result} value={widthLine} sub={heightLine} />
          <Callout tone={cmp.advice === 'ok' ? 'tip' : 'warn'}>{cmp.advice === 'up' ? t.conv.up : cmp.advice === 'down' ? t.conv.down : t.conv.ok}</Callout>
          <div className="card stack-sm">
            <div className="stat-label">{t.conv.withMine}</div>
            {counts.st > 0 && <div className="calc-instruction">{t.conv.stsInstead(counts.st, convertPatternCount(counts.st, pg.stitches, mg.stitches))}</div>}
            {counts.rows > 0 && Number.isFinite(mg.rows) && (
              <div className="calc-instruction">{t.conv.rowsInstead(counts.rows, convertPatternCount(counts.rows, pg.rows, mg.rows))}</div>
            )}
            {counts.widthCm > 0 && <div className="small muted">{t.conv.widthCompare(len(counts.widthCm), len((counts.widthCm * pg.stitches) / mg.stitches))}</div>}
          </div>
        </div>
      ) : null
    ) : norm ? (
      <div className="stack">
        <BigResult
          label={t.result}
          value={t.gaugeLineSts(span, fmt(perSpan(norm.stitches, spanCm), 1, lang))}
          sub={Number.isFinite(norm.rows) ? `${fmt(perSpan(norm.rows, spanCm), 1, lang)} ${t.rows.toLocaleLowerCase(lang)}` : undefined}
        />
        <div className="card small stack-sm">
          <div className="stat-label">{t.conv.perOne(unit)}</div>
          <div>
            {fmt((norm.stitches * unitCm) / 10, 2, lang)} {t.stitches.toLocaleLowerCase(lang)}
            {Number.isFinite(norm.rows) && (
              <>
                {' · '}
                {fmt((norm.rows * unitCm) / 10, 2, lang)} {t.rows.toLocaleLowerCase(lang)}
              </>
            )}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <CalcLayout
      id="olcu-ornegi"
      icon={<Grid2x2 />}
      result={result}
      after={
        <>
          <HowTo>{t.conv.tip}</HowTo>
          <RelatedLessons ids={['sis-olcu-ornegi']} />
        </>
      }
    >
      <Tabs
        tabs={[
          { id: 'compare', label: t.conv.tabCompare },
          { id: 'normalize', label: t.conv.tabNormalize },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'compare' ? (
        <div className="stack">
          <GaugeBlock title={t.conv.patternGauge} value={pat} onChange={setPat} />
          <GaugeBlock title={t.conv.myGauge} value={mine} onChange={setMine} />
          <div className="calc-sep" />
          <div className="label">{t.conv.patternCounts}</div>
          <div className="calc-triple">
            <LabeledField label={t.conv.patternSts}>
              {(id) => <NumberInput id={id} integer min={0} value={counts.st} onChange={(st) => setCounts((s) => ({ ...s, st }))} />}
            </LabeledField>
            <LabeledField label={t.conv.patternRows}>
              {(id) => <NumberInput id={id} integer min={0} value={counts.rows} onChange={(rows) => setCounts((s) => ({ ...s, rows }))} />}
            </LabeledField>
            <LabeledField label={t.conv.patternWidth}>
              {(id) => <LengthInput id={id} cm={counts.widthCm} onChange={(widthCm) => setCounts((s) => ({ ...s, widthCm }))} />}
            </LabeledField>
          </div>
        </div>
      ) : (
        <div className="stack">
          <p className="small muted" style={{ margin: 0 }}>
            {t.conv.normalizeIntro}
          </p>
          <div className="calc-pair">
            <LabeledField label={t.conv.counted}>{(id) => <NumberInput id={id} min={0} value={sw.st} onChange={(st) => setSw((s) => ({ ...s, st }))} />}</LabeledField>
            <LabeledField label={t.conv.measuredW}>{(id) => <LengthInput id={id} cm={sw.w} onChange={(w) => setSw((s) => ({ ...s, w }))} />}</LabeledField>
          </div>
          <div className="calc-pair">
            <LabeledField label={t.conv.countedRows}>{(id) => <NumberInput id={id} min={0} value={sw.rows} onChange={(rows) => setSw((s) => ({ ...s, rows }))} />}</LabeledField>
            <LabeledField label={t.conv.measuredH}>{(id) => <LengthInput id={id} cm={sw.h} onChange={(h) => setSw((s) => ({ ...s, h }))} />}</LabeledField>
          </div>
        </div>
      )}
    </CalcLayout>
  );
}
