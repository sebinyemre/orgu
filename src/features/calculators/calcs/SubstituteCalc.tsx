import { useState } from 'react';
import { Replace } from 'lucide-react';
import type { YarnWeightId } from '@/types';
import { useLang, useMsgs } from '@/i18n';
import { Segmented } from '@/ui/Segmented';
import { NumberInput } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { useStash } from '@/store/stash';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import { fmt, fmtMeters } from '@/lib/format';
import { CALC } from '../i18n';
import { M_PER_YD, metersToYards, substitution } from '../logic';
import { BigResult, CalcLayout, LabeledField, RelatedLessons, YarnBalls, useUnits, weightLabel } from '../ui';

type LenUnit = 'm' | 'yd';

function WeightSelect({ value, onChange, id, allowUnknown }: { value: YarnWeightId | -1; onChange: (v: YarnWeightId | -1) => void; id: string; allowUnknown?: boolean }) {
  const t = useMsgs(CALC);
  const lang = useLang();
  return (
    <select id={id} className="select" value={value} onChange={(e) => onChange(Number(e.target.value) as YarnWeightId | -1)}>
      {allowUnknown && <option value={-1}>{t.sub.unknown}</option>}
      {YARN_WEIGHTS.map((w) => (
        <option key={w.id} value={w.id}>
          {weightLabel(w, lang)}
        </option>
      ))}
    </select>
  );
}

export default function SubstituteCalc() {
  const t = useMsgs(CALC);
  const lang = useLang();
  const units = useUnits();
  const yarns = useStash((s) => s.yarns);
  const [lenUnit, setLenUnit] = useState<LenUnit>(units === 'in' ? 'yd' : 'm');
  const [mode, setMode] = useState<'total' | 'skeins'>('skeins');
  const [total, setTotal] = useState(800);
  const [pSkeins, setPSkeins] = useState(5);
  const [pSkeinLen, setPSkeinLen] = useState(160);
  const [pGrams, setPGrams] = useState(50);
  const [pWeight, setPWeight] = useState<YarnWeightId | -1>(4);
  const [myLen, setMyLen] = useState(180);
  const [myGrams, setMyGrams] = useState(100);
  const [myWeight, setMyWeight] = useState<YarnWeightId | -1>(4);
  const [yarnId, setYarnId] = useState('');
  const yarn = yarns.find((y) => y.id === yarnId);

  const toM = (v: number) => (lenUnit === 'yd' ? v * M_PER_YD : v);
  const needM = mode === 'total' ? toM(total) : toM(pSkeins * pSkeinLen);
  const myM = toM(myLen);
  const r = substitution(needM, myM);
  const lenText = (m: number) => (lenUnit === 'yd' ? `${fmt(metersToYards(m), 0, lang)} yd` : fmtMeters(m, lang));
  const gap = pWeight >= 0 && myWeight >= 0 ? Math.abs(pWeight - myWeight) : -1;
  const per100 = (len: number, g: number) => (g > 0 ? (toM(len) * 100) / g : NaN);

  const pickYarn = (id: string) => {
    setYarnId(id);
    const y = yarns.find((x) => x.id === id);
    if (!y) return;
    setMyWeight(y.weight);
    if (y.metersPerSkein > 0) setMyLen(lenUnit === 'yd' ? Math.round(metersToYards(y.metersPerSkein)) : y.metersPerSkein);
    if (y.gramsPerSkein > 0) setMyGrams(y.gramsPerSkein);
  };

  const unitSuffix = lenUnit;
  return (
    <CalcLayout
      id="ip-degistirme"
      icon={<Replace />}
      result={
        r ? (
          <div className="stack">
            <BigResult label={t.result} value={t.yarn.buySkeins(r.buy)} sub={`${t.sub.needs(lenText(needM))} ${t.sub.exact(fmt(r.exact, 1, lang))}`} />
            <div className="card stack-sm">
              <YarnBalls skeins={r.exact} color={yarn?.colorHex ?? '#5f7a61'} />
              <div className="small muted">{t.sub.leftover(lenText(r.leftover))}</div>
            </div>
            {r.tight && <Callout tone="warn">{t.sub.tight}</Callout>}
            {gap === 0 && <Callout tone="tip">{t.sub.same}</Callout>}
            {gap === 1 && <Callout tone="warn">{t.sub.near}</Callout>}
            {gap >= 2 && <Callout tone="danger">{t.sub.far}</Callout>}
            {mode === 'skeins' && pGrams > 0 && myGrams > 0 && (
              <p className="small muted" style={{ margin: 0 }}>
                {t.sub.lengthPerGram(lenText(per100(pSkeinLen, pGrams)), lenText(per100(myLen, myGrams)))}
              </p>
            )}
          </div>
        ) : null
      }
      after={
        <>
          <Callout tone="prof">{t.sub.tip}</Callout>
          <RelatedLessons ids={['haz-ip-secimi']} />
        </>
      }
    >
      <div className="stack">
        <Segmented<LenUnit>
          label={t.sub.totalLength}
          value={lenUnit}
          onChange={setLenUnit}
          options={[
            { value: 'm', label: t.meters },
            { value: 'yd', label: t.yards },
          ]}
        />
        <div className="label">{t.sub.patternYarn}</div>
        <Segmented
          label={t.sub.patternYarn}
          value={mode}
          onChange={setMode}
          options={[
            { value: 'skeins', label: t.sub.bySkeins },
            { value: 'total', label: t.sub.byTotal },
          ]}
        />
        {mode === 'total' ? (
          <LabeledField label={t.sub.totalLength}>{(id) => <NumberInput id={id} min={0} value={total} onChange={setTotal} suffix={unitSuffix} />}</LabeledField>
        ) : (
          <div className="calc-triple">
            <LabeledField label={t.sub.patternSkeins}>{(id) => <NumberInput id={id} min={0} value={pSkeins} onChange={setPSkeins} />}</LabeledField>
            <LabeledField label={t.sub.patternSkeinLen}>{(id) => <NumberInput id={id} min={0} value={pSkeinLen} onChange={setPSkeinLen} suffix={unitSuffix} />}</LabeledField>
            <LabeledField label={t.yarn.skeinGrams}>{(id) => <NumberInput id={id} min={0} value={pGrams} onChange={setPGrams} suffix="g" />}</LabeledField>
          </div>
        )}
        <LabeledField label={t.sub.patternWeight}>{(id) => <WeightSelect id={id} value={pWeight} onChange={setPWeight} allowUnknown />}</LabeledField>

        <div className="calc-sep" />
        <div className="label">{t.sub.myYarn}</div>
        {yarns.length > 0 && (
          <LabeledField label={t.fromStash}>
            {(id) => (
              <select id={id} className="select" value={yarnId} onChange={(e) => pickYarn(e.target.value)}>
                <option value="">{t.none}</option>
                {yarns.map((y) => (
                  <option key={y.id} value={y.id}>
                    {[y.brand, y.name, y.colorName].filter(Boolean).join(' · ')}
                  </option>
                ))}
              </select>
            )}
          </LabeledField>
        )}
        <div className="calc-pair">
          <LabeledField label={t.sub.mySkeinLen}>{(id) => <NumberInput id={id} min={1} value={myLen} onChange={setMyLen} suffix={unitSuffix} />}</LabeledField>
          <LabeledField label={t.yarn.skeinGrams}>{(id) => <NumberInput id={id} min={0} value={myGrams} onChange={setMyGrams} suffix="g" />}</LabeledField>
        </div>
        <LabeledField label={t.sub.myWeight}>{(id) => <WeightSelect id={id} value={myWeight} onChange={setMyWeight} allowUnknown />}</LabeledField>
      </div>
    </CalcLayout>
  );
}
