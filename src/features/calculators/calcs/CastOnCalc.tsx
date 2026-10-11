import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RulerDimensionLine } from 'lucide-react';
import type { Craft } from '@/types';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { Segmented } from '@/ui/Segmented';
import { NumberInput, Stepper } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { useTerms } from '@/ui/Term';
import { PATTERN_BY_ID, PATTERN_CATEGORY_LABEL, STITCH_PATTERNS, multipleText, type PatternCategory } from '@/knowledge/stitchPatterns';
import { CROCHET_BASICS, type CrochetBasicId } from '@/knowledge/terms';
import { fmt } from '@/lib/format';
import { CALC } from '../i18n';
import { castOn, foundationChain, gaugeSpanCm, niceDefault, patternPerTen, perTenCm } from '../logic';
import { BigResult, CalcLayout, fmtPct, HowTo, LabeledField, LengthInput, RelatedLessons, SpanCountFields, useLen, useSpanText, useUnits, type SpanCount } from '../ui';
import { WidthRuler } from '../visuals';

const CUSTOM = '__custom';
const FOUNDATION_IDS: CrochetBasicId[] = ['sc', 'hdc', 'dc', 'tr'];

function defaultBasicFor(patternId: string): CrochetBasicId {
  if (patternId === 'tig-yarim-trabzan') return 'hdc';
  if (patternId === 'tig-trabzan' || patternId === 'tig-v' || patternId === 'tig-kabartma-lastik') return 'dc';
  return 'sc';
}

export default function CastOnCalc() {
  const t = useMsgs(CALC);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const terms = useTerms();
  const units = useUnits();
  const len = useLen();
  const span = useSpanText();
  const [params] = useSearchParams();
  const initial = PATTERN_BY_ID[params.get('desen') ?? ''];

  const [craft, setCraft] = useState<Craft>(initial?.craft ?? 'knit');
  const [patternId, setPatternId] = useState<string>(initial?.id ?? 'pirinc');
  const [custom, setCustom] = useState({ multiple: 4, plus: 2 });
  const [mode, setMode] = useState<'flat' | 'round'>('flat');
  const [gauge, setGauge] = useState<SpanCount>({
    count: initial?.craft === 'crochet' ? 15 : 18,
    overCm: gaugeSpanCm(units),
  });
  const [widthCm, setWidthCm] = useState(() => niceDefault(30, 12, units));
  const [edgeEach, setEdgeEach] = useState(0);
  const [measuredIn, setMeasuredIn] = useState<'pattern' | 'stockinette'>('pattern');
  const [basic, setBasic] = useState<CrochetBasicId>(defaultBasicFor(initial?.id ?? ''));

  const pickCraft = (k: Craft) => {
    setCraft(k);
    const first = k === 'knit' ? 'pirinc' : 'tig-sik-igne';
    setPatternId(first);
    setBasic(defaultBasicFor(first));
    setGauge((g) => ({ ...g, count: k === 'knit' ? 18 : 15 }));
  };
  const pickPattern = (id: string) => {
    setPatternId(id);
    if (id !== CUSTOM) setBasic(defaultBasicFor(id));
  };

  const pattern = patternId === CUSTOM ? undefined : PATTERN_BY_ID[patternId];
  const roundMissing = mode === 'round' && !!pattern && !pattern.round;
  const working = pattern ? (mode === 'round' && pattern.round ? pattern.round : pattern.flat) : { multiple: custom.multiple, plus: custom.plus };
  const edge = mode === 'flat' ? edgeEach * 2 : 0;
  const factor = pattern?.widthFactor ?? 1;
  const basePerTen = perTenCm(gauge.count, gauge.overCm);
  const perTen = patternPerTen(basePerTen, factor, measuredIn);
  const res = castOn({
    widthCm,
    perTen,
    multiple: working.multiple,
    plus: working.plus,
    edge,
  });
  const name = (p: (typeof STITCH_PATTERNS)[number]) => (p.craft === 'crochet' ? terms.fill(p.name[lang]) : p.name[lang]);

  const groups = useMemo(() => {
    const m = new Map<PatternCategory, typeof STITCH_PATTERNS>();
    for (const p of STITCH_PATTERNS.filter((x) => x.craft === craft)) m.set(p.category, [...(m.get(p.category) ?? []), p]);
    return [...m.entries()];
  }, [craft]);

  const foundationRow = pattern?.craft === 'crochet' ? pattern.flat.rows.find((r) => r.label.en === 'Foundation chain') : undefined;
  const ruleText = multipleText(working, lang);
  const pctText = fmtPct(Math.abs(1 - factor) * 100, lang);
  const lessons = [...(craft === 'knit' ? ['sis-olcu-ornegi', 'sis-ilmek-atma-sisle'] : ['tig-zincir', 'tig-donus']), ...(pattern?.lessonIds ?? [])].filter(
    (v, i, a) => a.indexOf(v) === i,
  );

  const options = res
    ? [
        {
          key: 'lower',
          title: res.upper.stitches !== res.lower.stitches ? t.castOn.fewer : t.castOn.closest,
          o: res.lower,
        },
        ...(res.upper.stitches !== res.lower.stitches ? [{ key: 'upper', title: t.castOn.more, o: res.upper }] : []),
      ]
    : [];

  return (
    <CalcLayout
      id="ilmek-sayisi"
      icon={<RulerDimensionLine />}
      result={
        res ? (
          <div className="stack">
            <BigResult
              label={t.result}
              value={craft === 'knit' ? t.castOn.castOnN(res.best.stitches) : t.castOn.makeN(res.best.stitches)}
              sub={
                <>
                  {t.castOn.widthIs(len(res.best.widthCm))}
                  {edge > 0 && <> · {t.castOn.withEdges(edge)}</>}
                </>
              }
            />
            <div className="calc-options">
              {options.map(({ key, title, o }) => {
                const best = o.stitches === res.best.stitches;
                const f = craft === 'crochet' && mode === 'flat' ? foundationChain(o.stitches, CROCHET_BASICS[basic]) : null;
                return (
                  <div key={key} className={`card calc-option${best ? ' is-best' : ''}`}>
                    <div className="spread">
                      <span className="stat-label">{title}</span>
                      {best && options.length > 1 && (
                        <span className="chip" data-tone="accent">
                          {t.castOn.closest}
                        </span>
                      )}
                    </div>
                    <div className="calc-option-n">{c.stitches(o.stitches)}</div>
                    <div className="small muted">
                      {len(o.widthCm)}
                      {Math.abs(o.diffCm) >= 0.05 && <> · {t.castOn.diff(`${o.diffCm >= 0 ? '+' : '−'}${len(Math.abs(o.diffCm))}`)}</>}
                    </div>
                    {f && (
                      <div className="small calc-option-foot">
                        {t.castOn.foundation}: {f.chain}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="small faint">{t.castOn.exact(fmt(res.exact, 1, lang))}</div>
            <div className="card">
              <div className="stat-label">{t.castOn.rulerTitle}</div>
              <WidthRuler
                targetCm={widthCm}
                targetLabel={t.castOn.target}
                bars={options.map(({ key, o }) => ({
                  key,
                  cm: o.widthCm,
                  label: `${o.stitches} · ${len(o.widthCm)}`,
                  best: o.stitches === res.best.stitches,
                }))}
              />
            </div>
            {craft === 'crochet' && (
              <div className="card stack-sm">
                <div className="stat-label">{t.castOn.foundation}</div>
                {mode === 'flat' ? (
                  (() => {
                    const f = foundationChain(res.best.stitches, CROCHET_BASICS[basic]);
                    return (
                      <>
                        <p className="calc-instruction">{t.castOn.foundationText(f.chain, terms.lower(basic), f.intoChain, res.best.stitches)}</p>
                        {f.skippedCount && <p className="small muted">{t.castOn.skippedCount}</p>}
                      </>
                    );
                  })()
                ) : (
                  <p className="calc-instruction">{terms.fill(t.castOn.roundFoundation(res.best.stitches))}</p>
                )}
                {foundationRow && (
                  <p className="small muted">
                    <strong>{t.castOn.patternFoundation}:</strong> {terms.fill(foundationRow.text[lang])}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : null
      }
      after={
        <>
          <HowTo>{t.castOn.tip(units === 'in' ? `6 × 6 ${t.unitIn}` : '15 × 15 cm', span)}</HowTo>
          <RelatedLessons ids={lessons} />
        </>
      }
    >
      <div className="stack">
        <Segmented<Craft>
          label={t.craft}
          value={craft}
          onChange={pickCraft}
          options={[
            { value: 'knit', label: c.knit },
            { value: 'crochet', label: c.crochet },
          ]}
        />
        <LabeledField label={t.stitchPattern}>
          {(id) => (
            <select id={id} className="select" value={patternId} onChange={(e) => pickPattern(e.target.value)}>
              {groups.map(([cat, list]) => (
                <optgroup key={cat} label={PATTERN_CATEGORY_LABEL[cat][lang]}>
                  {list.map((p) => (
                    <option key={p.id} value={p.id}>
                      {name(p)}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value={CUSTOM}>{t.customRepeat}</option>
            </select>
          )}
        </LabeledField>
        {patternId === CUSTOM && (
          <div className="calc-pair">
            <LabeledField label={t.multiple}>
              {(id) => <NumberInput id={id} integer min={1} value={custom.multiple} onChange={(n) => setCustom((s) => ({ ...s, multiple: n }))} />}
            </LabeledField>
            <LabeledField label={t.plus}>
              {(id) => <NumberInput id={id} integer min={0} value={custom.plus} onChange={(n) => setCustom((s) => ({ ...s, plus: n }))} />}
            </LabeledField>
          </div>
        )}
        <div className="small">
          <span className="chip" data-tone="denim">
            {t.castOn.rule(ruleText)}
          </span>
        </div>
        <Segmented
          label={t.flat}
          value={mode}
          onChange={setMode}
          options={[
            { value: 'flat', label: t.flat },
            { value: 'round', label: t.round },
          ]}
        />
        {roundMissing && <p className="small muted">{t.roundUnavailable}</p>}

        <div className="calc-sep" />
        <div className="label">{t.gauge}</div>
        <SpanCountFields value={gauge} onChange={setGauge} countLabel={t.stitches} overLabel={t.over} />
        <span className="hint">{t.gaugeHint(span)}</span>
        {pattern && factor !== 1 && (
          <LabeledField label={t.castOn.measuredIn}>
            {() => (
              <>
                <Segmented
                  label={t.castOn.measuredIn}
                  value={measuredIn}
                  onChange={setMeasuredIn}
                  options={[
                    { value: 'pattern', label: t.castOn.measuredPattern },
                    {
                      value: 'stockinette',
                      label: craft === 'knit' ? t.castOn.measuredKnitBase : t.castOn.measuredCrochetBase,
                    },
                  ]}
                />
                {measuredIn === 'stockinette' && <span className="hint">{t.castOn.factorNote(pctText)}</span>}
              </>
            )}
          </LabeledField>
        )}

        <div className="calc-sep" />
        <LabeledField label={mode === 'round' ? t.castOn.targetCirc : t.castOn.targetWidth}>{(id) => <LengthInput id={id} cm={widthCm} onChange={setWidthCm} />}</LabeledField>
        {mode === 'flat' && (
          <LabeledField label={t.castOn.edgeSts} hint={t.castOn.edgeHint}>
            {() => <Stepper value={edgeEach} onChange={setEdgeEach} min={0} max={4} ariaLabel={t.castOn.edgeSts} />}
          </LabeledField>
        )}
        {craft === 'crochet' && mode === 'flat' && (
          <LabeledField label={t.castOn.foundationStitch}>
            {(id) => (
              <select id={id} className="select" value={basic} onChange={(e) => setBasic(e.target.value as CrochetBasicId)}>
                {FOUNDATION_IDS.map((b) => (
                  <option key={b} value={b}>
                    {terms.label(b)}
                  </option>
                ))}
              </select>
            )}
          </LabeledField>
        )}
        {res === null && <Callout tone="warn">{t.gaugeHint(span)}</Callout>}
      </div>
    </CalcLayout>
  );
}
