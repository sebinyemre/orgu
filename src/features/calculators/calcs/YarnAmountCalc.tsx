import { useState } from 'react';
import { Scale } from 'lucide-react';
import type { Craft, Gauge, YarnWeightId } from '@/types';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { Segmented } from '@/ui/Segmented';
import { NumberInput } from '@/ui/Field';
import { Tabs } from '@/ui/Tabs';
import { useTerms } from '@/ui/Term';
import { useStash } from '@/store/stash';
import { BLANKET_SIZES, CIRCLE_SIZES, COWL_SIZES, HAT_NEGATIVE_EASE, HEAD_SIZES, SCARF_SIZES } from '@/knowledge/sizes';
import { STITCH_PATTERNS, PATTERN_BY_ID } from '@/knowledge/stitchPatterns';
import { YARN_WEIGHTS, typicalGauge } from '@/knowledge/yarnWeights';
import type { StitchKind } from '@/engine/math/yarn';
import { fmt, fmtMeters } from '@/lib/format';
import type { L10n } from '@/i18n';
import { CALC } from '../i18n';
import { areaOf, gaugeSpanCm, gramsFromSwatch, metersForCm2, metersToYards, niceDefault, perSpan, perTenCm, type ShapeKind } from '../logic';
import { BigResult, CalcLayout, HowTo, LabeledField, LengthInput, RelatedLessons, YarnBalls, useLen, useSpanText, useUnits, weightLabel } from '../ui';

type ProjectKind = 'atki' | 'battaniye' | 'boyunluk' | 'bere' | 'daire' | 'ozel';

interface SizeOpt {
  id: string;
  label: L10n;
  a: number;
  b: number;
}

const SIZE_TABLE: Record<ProjectKind, { shape: ShapeKind; sizes: SizeOpt[] }> = {
  atki: {
    shape: 'rect',
    sizes: SCARF_SIZES.map((s) => ({
      id: s.id,
      label: s.label,
      a: s.width,
      b: s.length,
    })),
  },
  battaniye: {
    shape: 'rect',
    sizes: BLANKET_SIZES.map((s) => ({
      id: s.id,
      label: s.label,
      a: s.width,
      b: s.length,
    })),
  },
  boyunluk: {
    shape: 'tube',
    sizes: COWL_SIZES.map((s) => ({
      id: s.id,
      label: s.label,
      a: s.circumference,
      b: s.height,
    })),
  },
  bere: {
    shape: 'tube',
    sizes: HEAD_SIZES.map((s) => ({
      id: s.id,
      label: s.label,
      a: Math.round(s.circumference * (1 - HAT_NEGATIVE_EASE) * 10) / 10,
      b: s.hatHeight,
    })),
  },
  daire: {
    shape: 'circle',
    sizes: CIRCLE_SIZES.map((s) => ({
      id: s.id,
      label: s.label,
      a: s.diameter,
      b: 0,
    })),
  },
  ozel: { shape: 'rect', sizes: [] },
};

const PROJECTS: ProjectKind[] = ['atki', 'bere', 'boyunluk', 'battaniye', 'daire', 'ozel'];

interface ProjectState {
  kind: ProjectKind;
  sizeId: string;
  a: number;
  b: number;
}

function ProjectPicker({ value, onChange }: { value: ProjectState; onChange: (v: ProjectState) => void }) {
  const t = useMsgs(CALC);
  const lang = useLang();
  const len = useLen();
  const table = SIZE_TABLE[value.kind];
  const pickKind = (kind: ProjectKind) => {
    const first = SIZE_TABLE[kind].sizes[1] ?? SIZE_TABLE[kind].sizes[0];
    onChange(first ? { kind, sizeId: first.id, a: first.a, b: first.b } : { kind, sizeId: '', a: value.a || 50, b: value.b || 60 });
  };
  const aLabel = table.shape === 'circle' ? t.diameter : table.shape === 'tube' ? t.circumference : t.width;
  const bLabel = table.shape === 'tube' ? t.height : t.length;
  return (
    <div className="stack">
      <LabeledField label={t.yarn.project}>
        {(id) => (
          <select id={id} className="select" value={value.kind} onChange={(e) => pickKind(e.target.value as ProjectKind)}>
            {PROJECTS.map((p) => (
              <option key={p} value={p}>
                {t.yarn.projects[p]}
              </option>
            ))}
          </select>
        )}
      </LabeledField>
      {table.sizes.length > 0 && (
        <LabeledField label={t.yarn.size}>
          {(id) => (
            <select
              id={id}
              className="select"
              value={value.sizeId}
              onChange={(e) => {
                const s = table.sizes.find((x) => x.id === e.target.value);
                if (s) onChange({ ...value, sizeId: s.id, a: s.a, b: s.b });
              }}
            >
              {table.sizes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label[lang]} ({len(s.a, 0)}
                  {table.shape !== 'circle' ? ` × ${len(s.b, 0)}` : ''})
                </option>
              ))}
            </select>
          )}
        </LabeledField>
      )}
      <div className="calc-pair">
        <LabeledField label={aLabel}>{(id) => <LengthInput id={id} cm={value.a} onChange={(a) => onChange({ ...value, a })} />}</LabeledField>
        {table.shape !== 'circle' && <LabeledField label={bLabel}>{(id) => <LengthInput id={id} cm={value.b} onChange={(b) => onChange({ ...value, b })} />}</LabeledField>}
      </div>
    </div>
  );
}

function SkeinFields({ meters, grams, onMeters, onGrams }: { meters: number; grams: number; onMeters: (n: number) => void; onGrams: (n: number) => void }) {
  const t = useMsgs(CALC);
  return (
    <div className="calc-pair">
      <LabeledField label={t.yarn.skeinLength}>{(id) => <NumberInput id={id} min={1} value={meters} onChange={onMeters} suffix="m" />}</LabeledField>
      <LabeledField label={t.yarn.skeinGrams}>{(id) => <NumberInput id={id} min={1} value={grams} onChange={onGrams} suffix="g" />}</LabeledField>
    </div>
  );
}

export default function YarnAmountCalc() {
  const t = useMsgs(CALC);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const terms = useTerms();
  const units = useUnits();
  const span = useSpanText();
  const yarns = useStash((s) => s.yarns);

  const [tab, setTab] = useState<'project' | 'swatch'>('project');
  const [craft, setCraft] = useState<Craft>('knit');
  const [project, setProject] = useState<ProjectState>({
    kind: 'atki',
    sizeId: 'standart',
    a: 20,
    b: 160,
  });
  const [weight, setWeight] = useState<YarnWeightId>(4);
  const [gaugeMode, setGaugeMode] = useState<'typical' | 'own'>('typical');
  const [own, setOwn] = useState({
    st: 18,
    rows: 24,
    overCm: gaugeSpanCm(units),
  });
  const [stitch, setStitch] = useState<StitchKind>('knit');
  const [patternId, setPatternId] = useState('jarse');
  const [skeinM, setSkeinM] = useState(200);
  const [skeinG, setSkeinG] = useState(100);
  const [yarnId, setYarnId] = useState('');
  const [sw, setSw] = useState({
    w: niceDefault(15, 6, units),
    h: niceDefault(15, 6, units),
    g: 8,
  });

  const yarn = yarns.find((y) => y.id === yarnId);
  const color = yarn?.colorHex ?? '#d39a2c';

  const pickCraft = (k: Craft) => {
    setCraft(k);
    setStitch(k === 'knit' ? 'knit' : 'sc');
    setPatternId(k === 'knit' ? 'jarse' : 'tig-sik-igne');
  };
  const pickYarn = (id: string) => {
    setYarnId(id);
    const y = yarns.find((x) => x.id === id);
    if (y) {
      setWeight(y.weight);
      if (y.metersPerSkein > 0) setSkeinM(y.metersPerSkein);
      if (y.gramsPerSkein > 0) setSkeinG(y.gramsPerSkein);
    }
  };

  const typStitch = stitch === 'knit' ? 'jarse' : stitch === 'tr' ? 'dc' : stitch;
  const gauge: Gauge =
    gaugeMode === 'typical'
      ? typicalGauge(weight, craft, typStitch)
      : {
          stitches: perTenCm(own.st, own.overCm),
          rows: perTenCm(own.rows, own.overCm),
        };
  const pattern = PATTERN_BY_ID[patternId];
  const factor = pattern?.yarnFactor ?? 1;
  const shape = SIZE_TABLE[project.kind].shape;
  const area = areaOf(shape, project.a, project.b);
  const meters = metersForCm2(area, gauge, stitch, factor);
  const skeins = skeinM > 0 ? meters / skeinM : 0;
  const grams = skeins * skeinG;

  const swGrams = gramsFromSwatch(sw.g, sw.w, sw.h, area);
  const swSkeins = skeinG > 0 ? swGrams / skeinG : 0;
  const swMeters = skeinG > 0 ? (swGrams * skeinM) / skeinG : 0;

  const metersText = (m: number) => (units === 'in' ? `${fmtMeters(m, lang)} (${fmt(metersToYards(m), 0, lang)} yd)` : fmtMeters(m, lang));
  const stitchOpts: { value: StitchKind; label: string }[] =
    craft === 'knit'
      ? [{ value: 'knit', label: t.yarn.knitStitch }]
      : (['sc', 'hdc', 'dc', 'tr'] as const).map((k) => ({
          value: k,
          label: terms.name(k),
        }));

  const result =
    tab === 'project' ? (
      <div className="stack">
        <BigResult label={t.yarn.needed} value={metersText(meters)} sub={`${t.yarn.skeins(fmt(skeins, 1, lang))} · ${t.yarn.gramsAbout(fmt(grams, 0, lang))}`} />
        <div className="card stack-sm">
          <div className="spread">
            <strong>{t.yarn.buySkeins(Math.max(1, Math.ceil(skeins)))}</strong>
          </div>
          <YarnBalls skeins={skeins} color={color} />
          <p className="small muted" style={{ margin: 0 }}>
            {t.yarn.wasteNote}
          </p>
        </div>
        <div className="card small stack-sm">
          <div className="stat-label">{t.yarn.gaugeUsed}</div>
          <div>{t.gaugeLine(span, fmt(perSpan(gauge.stitches, gaugeSpanCm(units)), 1, lang), fmt(perSpan(gauge.rows, gaugeSpanCm(units)), 1, lang))}</div>
          <div className="muted">{t.yarn.factor(fmt(factor, 2, lang))}</div>
        </div>
        <p className="small faint" style={{ margin: 0 }}>
          {t.yarn.estimateNote}
        </p>
      </div>
    ) : (
      <div className="stack">
        <BigResult label={t.yarn.totalWeight} value={`${fmt(swGrams, 0, lang)} g`} sub={`${t.yarn.skeins(fmt(swSkeins, 1, lang))} · ${metersText(swMeters)}`} />
        <div className="card stack-sm">
          <strong>{t.yarn.buySkeins(Math.max(1, Math.ceil(swSkeins)))}</strong>
          <YarnBalls skeins={swSkeins} color={color} />
          <p className="small muted" style={{ margin: 0 }}>
            {t.yarn.safety}
          </p>
        </div>
      </div>
    );

  return (
    <CalcLayout
      id="ip-miktari"
      icon={<Scale />}
      result={result}
      after={
        <>
          {tab === 'swatch' ? (
            <div className="card">
              <div className="card-title">{t.howToMeasure}</div>
              <ol className="steps">
                {t.yarn.steps(units === 'in' ? `6 × 6 ${t.unitIn}` : '15 × 15 cm').map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          ) : (
            <HowTo>{t.castOn.tip(units === 'in' ? `6 × 6 ${t.unitIn}` : '15 × 15 cm', span)}</HowTo>
          )}
          <RelatedLessons ids={craft === 'knit' ? ['haz-ip-secimi', 'sis-olcu-ornegi'] : ['haz-ip-secimi', 'tig-sik-igne']} />
        </>
      }
    >
      <Tabs
        tabs={[
          { id: 'project', label: t.yarn.tabProject },
          { id: 'swatch', label: t.yarn.tabSwatch },
        ]}
        value={tab}
        onChange={setTab}
      />
      <div className="stack">
        {tab === 'project' && (
          <Segmented<Craft>
            label={t.craft}
            value={craft}
            onChange={pickCraft}
            options={[
              { value: 'knit', label: c.knit },
              { value: 'crochet', label: c.crochet },
            ]}
          />
        )}
        <ProjectPicker value={project} onChange={setProject} />
        <div className="calc-sep" />
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
        {tab === 'project' ? (
          <>
            <LabeledField label={t.yarnWeight}>
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
            {craft === 'crochet' && (
              <LabeledField label={t.yarn.stitchType}>
                {() => <Segmented<StitchKind> label={t.yarn.stitchType} value={stitch} onChange={setStitch} options={stitchOpts} />}
              </LabeledField>
            )}
            <LabeledField label={t.stitchPattern}>
              {(id) => (
                <select id={id} className="select" value={patternId} onChange={(e) => setPatternId(e.target.value)}>
                  {STITCH_PATTERNS.filter((p) => p.craft === craft).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.craft === 'crochet' ? terms.fill(p.name[lang]) : p.name[lang]} (×{fmt(p.yarnFactor, 2, lang)})
                    </option>
                  ))}
                </select>
              )}
            </LabeledField>
            <Segmented
              label={t.gauge}
              value={gaugeMode}
              onChange={setGaugeMode}
              options={[
                { value: 'typical', label: t.typicalGauge },
                { value: 'own', label: t.ownGauge },
              ]}
            />
            {gaugeMode === 'own' && (
              <div className="calc-triple">
                <LabeledField label={t.stitches}>{(id) => <NumberInput id={id} min={0} value={own.st} onChange={(n) => setOwn((s) => ({ ...s, st: n }))} />}</LabeledField>
                <LabeledField label={t.rows}>{(id) => <NumberInput id={id} min={0} value={own.rows} onChange={(n) => setOwn((s) => ({ ...s, rows: n }))} />}</LabeledField>
                <LabeledField label={t.over}>{(id) => <LengthInput id={id} cm={own.overCm} onChange={(overCm) => setOwn((s) => ({ ...s, overCm }))} />}</LabeledField>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="calc-triple">
              <LabeledField label={t.yarn.swatchW}>{(id) => <LengthInput id={id} cm={sw.w} onChange={(w) => setSw((s) => ({ ...s, w }))} />}</LabeledField>
              <LabeledField label={t.yarn.swatchH}>{(id) => <LengthInput id={id} cm={sw.h} onChange={(h) => setSw((s) => ({ ...s, h }))} />}</LabeledField>
              <LabeledField label={t.yarn.swatchGrams}>
                {(id) => <NumberInput id={id} min={0} value={sw.g} onChange={(g) => setSw((s) => ({ ...s, g }))} suffix="g" />}
              </LabeledField>
            </div>
          </>
        )}
        <SkeinFields meters={skeinM} grams={skeinG} onMeters={setSkeinM} onGrams={setSkeinG} />
      </div>
    </CalcLayout>
  );
}
