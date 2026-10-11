/**
 * Tarif hazırlayıcı: alet → ip → ne örüleceği → ölçü ve desen → ölçü örneği.
 * Her değişiklikte tarif canlı üretilir; özet kartı ilmek sayısını ve ip miktarını gösterir.
 * Sorgu: ?tur=<şablon>&ip=<sepetteki ip kimliği>
 */
import { useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowDown, FolderPlus, Plus, Printer, SlidersHorizontal, X } from 'lucide-react';
import type { Craft, FiberId, Gauge, Units, Yarn, YarnWeightId } from '@/types';
import { PageHeader } from '@/ui/PageHeader';
import { Field, NumberInput, Stepper, Switch } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { ColorPicker } from '@/ui/ColorPicker';
import { YarnBall } from '@/ui/YarnBall';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { useTerms } from '@/ui/Term';
import { useSettings } from '@/store/settings';
import { useStash } from '@/store/stash';
import { useProjects } from '@/store/projects';
import { toast } from '@/store/toast';
import { fmt, fmtLength, fmtMeters } from '@/lib/format';
import { inkOn } from '@/lib/color';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import { FIBERS } from '@/knowledge/fibers';
import { HOOK_SIZES, NEEDLE_SIZES, TOOL_KIND_LABEL } from '@/knowledge/tools';
import { PATTERN_BY_ID, multipleText, patternChartCells } from '@/knowledge/stitchPatterns';
import { normalizeGauge } from '@/engine/math/gauge';
import { skeinsFor } from '@/engine/math/yarn';
import {
  BLANKET_CENTERS,
  COWL_STITCHES,
  CROCHET_SCARF_STITCHES,
  HAT_BODIES,
  HAT_RIBS,
  KNIT_SCARF_STITCHES,
  TEMPLATE_BY_ID,
  generatePattern,
  isTemplateId,
  resolveGauge,
  type PatternParams,
  type TemplateId,
  type YarnSpec,
} from '@/engine/patterns';
import { gaugeLabel } from '@/engine/patterns/common';
import { ChartView } from '@/features/chart/ChartView';
import { FabricPreview } from '@/features/chart/FabricPreview';
import { WorkIllustration } from '@/features/works/illustrations';
import { PatternView } from './PatternView';
import { DIMS, ILLUSTRATION, PRESETS, TEMPLATE_ORDER, matchPreset, type DimKey, type Opts } from './presets';
import { useRecipeDraft, type RecipeToolKind } from './store';
import { R } from './i18n';
import './recipe.css';

const KNIT_KINDS = ['sis-duz', 'sis-misinali', 'sis-corap', 'sis-degistirilebilir'];

const toUnits = (cm: number, u: Units) => (u === 'in' ? Math.round((cm / 2.54) * 10) / 10 : cm);
const fromUnits = (v: number, u: Units) => (u === 'in' ? Math.round(v * 2.54 * 10) / 10 : v);

function craftOf(kind: RecipeToolKind): Craft {
  return kind === 'tig' ? 'crochet' : 'knit';
}

export default function RecipePage() {
  const t = useMsgs(R);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const terms = useTerms();
  const units = useSettings((s) => s.units);
  const yarns = useStash((s) => s.yarns);
  const tools = useStash((s) => s.tools);
  const createFromPattern = useProjects((s) => s.createFromPattern);
  const nav = useNavigate();
  const d = useRecipeDraft();
  const [sp] = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLElement>(null);
  const craft = craftOf(d.toolKind);

  // ?tur= ve ?ip= ile ön seçim
  const qTur = sp.get('tur');
  const qIp = sp.get('ip');
  useEffect(() => {
    const tur = qTur;
    const ip = qIp;
    const patch: Parameters<typeof d.patch>[0] = {};
    if (isTemplateId(tur)) {
      patch.template = tur;
      const crafts = TEMPLATE_BY_ID[tur].crafts;
      if (!crafts.includes(craftOf(d.toolKind))) patch.toolKind = crafts[0] === 'crochet' ? 'tig' : tur === 'bere' || tur === 'boyunluk' ? 'sis-misinali' : 'sis-duz';
      else if ((tur === 'bere' || tur === 'boyunluk') && d.toolKind === 'sis-duz') patch.toolKind = 'sis-misinali';
    }
    const y = ip ? yarns.find((x) => x.id === ip) : undefined;
    if (y) {
      patch.yarnMode = 'stash';
      patch.yarnIds = [y.id];
      const kind = patch.toolKind ?? d.toolKind;
      const mm = kind === 'tig' ? y.suggestedHookMm : y.suggestedNeedleMm;
      const w = YARN_WEIGHTS[y.weight];
      patch.toolMm = mm ?? (kind === 'tig' ? (w.hookMm[0] + w.hookMm[1]) / 2 : (w.needleMm[0] + w.needleMm[1]) / 2);
      patch.toolMm = nearestListed(patch.toolMm, kind === 'tig');
    }
    if (Object.keys(patch).length) d.patch(patch);
  }, [qTur, qIp]); // eslint-disable-line react-hooks/exhaustive-deps

  // şablon zanaate uymuyorsa ilk uygun şablona geç
  const template: TemplateId = TEMPLATE_BY_ID[d.template].crafts.includes(craft) ? d.template : (TEMPLATE_ORDER.find((x) => TEMPLATE_BY_ID[x].crafts.includes(craft)) ?? 'atki');
  const opts = d.opts[template];

  /* ── ip ── */
  const chosen: Yarn[] = d.yarnMode === 'stash' ? d.yarnIds.map((id) => yarns.find((y) => y.id === id)).filter((y): y is Yarn => !!y) : [];
  const yarn: YarnSpec = useMemo(() => {
    if (chosen.length) {
      const f = chosen[0];
      return {
        weight: f.weight,
        name: [f.brand, f.name].filter(Boolean).join(' '),
        fibers: f.fibers,
        metersPerSkein: f.metersPerSkein || undefined,
        gramsPerSkein: f.gramsPerSkein || undefined,
        colors: chosen.map((y) => ({ hex: y.colorHex, name: y.colorName || undefined, yarnId: y.id })),
      };
    }
    return {
      weight: d.custom.weight,
      fibers: d.custom.fiber ? [d.custom.fiber] : undefined,
      metersPerSkein: d.custom.metersPerSkein || undefined,
      gramsPerSkein: d.custom.gramsPerSkein || undefined,
      colors: d.custom.colors.map((hex) => ({ hex })),
    };
  }, [chosen.map((y) => y.id).join(','), d.custom, d.yarnMode]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── ölçü örneği ── */
  const myGauge: Gauge | undefined =
    d.gaugeMode === 'mine' && d.mine.stitches > 0 && d.mine.rows > 0 && d.mine.overW > 0 && d.mine.overH > 0
      ? normalizeGauge(d.mine.stitches, fromUnits(d.mine.overW, units), d.mine.rows, fromUnits(d.mine.overH, units))
      : undefined;

  const params: PatternParams = {
    ...opts,
    lang,
    ctx: terms.ctx,
    units,
    toolMm: d.toolMm,
    toolKind: d.toolKind,
    yarn,
    gauge: myGauge,
    craft: template === 'olcu-ornegi' ? craft : opts.craft,
  };
  const gStitch = TEMPLATE_BY_ID[template].gaugeStitch(params);
  const typical = resolveGauge({ ...params, gauge: undefined }, craft, gStitch);
  const pattern = useMemo(() => {
    try {
      return generatePattern(template, params);
    } catch {
      return null;
    }
  }, [JSON.stringify({ ...params, ctx: terms.ctx })]); // eslint-disable-line react-hooks/exhaustive-deps

  const wInfo = YARN_WEIGHTS[yarn.weight];
  const range = craft === 'knit' ? wInfo.needleMm : wInfo.hookMm;
  const rangeTxt = `${fmt(range[0], 2, lang)}–${fmt(range[1], 2, lang)} mm`;
  const mismatch = d.toolMm < range[0] - 0.75 || d.toolMm > range[1] + 1.25;
  const multi = yarn.colors.length > 1;
  const setOpt = (o: Opts) => d.patchOpts(template, o);
  const scrollTo = (el: HTMLElement | null) => el?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const save = () => {
    if (!pattern) return;
    const p = createFromPattern(pattern, { color: yarn.colors[0]?.hex, yarnIds: chosen.map((y) => y.id), toolSizeMm: d.toolMm });
    toast(t.saved, { tone: 'success' });
    nav(`/projeler/${p.id}`);
  };

  const castOn = pattern?.params.castOn as number | undefined;
  const ringStart = template === 'amigurumi-top' || template === 'bardak-altligi' || template === 'bere-tig';
  const castLabel = craft === 'knit' ? t.castOnKnit : ringStart ? t.castOnRing : t.castOnChain;
  const skeins = pattern && yarn.metersPerSkein ? Math.max(1, Math.ceil(skeinsFor(pattern.yarnMeters, yarn.metersPerSkein) - 0.05)) : 0;

  return (
    <div className="page rp-page" ref={topRef}>
      <PageHeader eyebrow={t.eyebrow} title={t.title} lede={t.lede} />
      <div className="rp-layout">
        <div className="rp-form">
          {/* 1 · Alet */}
          <section className="card rp-step" aria-labelledby="rp-s1">
            <StepHead n={1} id="rp-s1" title={t.step1} />
            <ChoiceChips<RecipeToolKind>
              label={t.step1}
              value={d.toolKind}
              onChange={(k) => d.patch({ toolKind: k, toolMm: nearestListed(d.toolMm, k === 'tig') })}
              options={[
                { value: 'sis-duz', label: t.kindStraight },
                { value: 'sis-misinali', label: t.kindCircular },
                { value: 'tig', label: t.kindHook },
              ]}
            />
            {tools.filter((x) => (craft === 'crochet' ? x.kind === 'tig' : KNIT_KINDS.includes(x.kind))).length > 0 && (
              <div className="stack-sm">
                <div className="rp-sub">{t.fromStashTools}</div>
                <div className="rp-chips">
                  {tools
                    .filter((x) => (craft === 'crochet' ? x.kind === 'tig' : KNIT_KINDS.includes(x.kind)))
                    .map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        className="rp-chip"
                        aria-pressed={Math.abs(x.sizeMm - d.toolMm) < 0.01}
                        onClick={() => d.patch({ toolMm: x.sizeMm, toolKind: x.kind === 'tig' ? 'tig' : x.kind === 'sis-misinali' || x.kind === 'sis-degistirilebilir' ? 'sis-misinali' : 'sis-duz' })}
                      >
                        {fmt(x.sizeMm, 2, lang)} mm <small>{TOOL_KIND_LABEL[x.kind][lang]}</small>
                      </button>
                    ))}
                </div>
              </div>
            )}
            <Field label={t.size} htmlFor="rp-size" hint={t.suggestedTool(rangeTxt)}>
              <select id="rp-size" className="select" value={String(d.toolMm)} onChange={(e) => d.patch({ toolMm: Number(e.target.value) })}>
                {(craft === 'crochet' ? HOOK_SIZES.filter((s) => s.mm >= 2) : NEEDLE_SIZES).map((s) => (
                  <option key={s.mm} value={String(s.mm)}>
                    {t.sizeOption(fmt(s.mm, 2, lang), s.us && !s.us.includes('(') ? s.us : undefined)}
                  </option>
                ))}
              </select>
            </Field>
            {mismatch && <Callout tone="warn">{t.toolMismatch(rangeTxt)}</Callout>}
          </section>

          {/* 2 · İp */}
          <section className="card rp-step" aria-labelledby="rp-s2">
            <StepHead n={2} id="rp-s2" title={t.step2} />
            <ChoiceChips<'stash' | 'custom'>
              label={t.step2}
              value={d.yarnMode}
              onChange={(m) => d.patch({ yarnMode: m })}
              options={[
                { value: 'stash', label: t.yarnFromStash },
                { value: 'custom', label: t.yarnDescribe },
              ]}
            />
            {d.yarnMode === 'stash' ? (
              yarns.length ? (
                <>
                  <p className="hint">{t.pickYarnHint}</p>
                  <div className="rp-yarns">
                    {yarns.map((y) => {
                      const idx = d.yarnIds.indexOf(y.id);
                      return (
                        <button
                          key={y.id}
                          type="button"
                          className="rp-yarn"
                          aria-pressed={idx >= 0}
                          onClick={() => d.patch({ yarnIds: idx >= 0 ? d.yarnIds.filter((x) => x !== y.id) : [...d.yarnIds, y.id] })}
                        >
                          <YarnBall color={y.colorHex} size={40} tail={false} />
                          <span className="grow">
                            <span className="rp-yarn-name">{[y.brand, y.name].filter(Boolean).join(' ') || y.colorName}</span>
                            <span className="rp-yarn-meta" style={{ display: 'block' }}>
                              {t.stashYarnMeta(`${y.colorName} · ${YARN_WEIGHTS[y.weight].name[lang]}`, fmtMeters(y.metersPerSkein * y.skeins, lang))}
                            </span>
                          </span>
                          {idx >= 0 && <span className="rp-yarn-order">{String.fromCharCode(65 + idx)}</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <Callout tone="info">
                  <p>{t.noStashYarn}</p>
                  <Link to="/sepet" className="btn btn-soft btn-sm">
                    {t.goStash}
                  </Link>
                </Callout>
              )
            ) : null}
            {(d.yarnMode === 'custom' || !chosen.length) && <CustomYarnForm />}
          </section>

          {/* 3 · Ne öreceksin? */}
          <section className="card rp-step" aria-labelledby="rp-s3">
            <StepHead n={3} id="rp-s3" title={t.step3} />
            <div className="rp-tpls">
              {TEMPLATE_ORDER.filter((id) => TEMPLATE_BY_ID[id].crafts.includes(craft)).map((id) => (
                <button key={id} type="button" className="rp-tpl" aria-pressed={template === id} onClick={() => d.patch({ template: id })}>
                  <span className="rp-tpl-art">
                    <WorkIllustration kind={ILLUSTRATION[id].kind} variant={ILLUSTRATION[id].variant} colors={yarn.colors.map((x) => x.hex)} />
                  </span>
                  <span className="rp-tpl-name">{terms.fill(t.templates[id][0])}</span>
                  <span className="rp-tpl-desc">{terms.fill(t.templates[id][1])}</span>
                </button>
              ))}
            </div>
            {(template === 'bere' || template === 'boyunluk') && d.toolKind === 'sis-duz' && <Callout tone="info">{t.needCircular}</Callout>}
          </section>

          {/* 4 · Ölçü ve desen */}
          <section className="card rp-step" aria-labelledby="rp-s4">
            <StepHead n={4} id="rp-s4" title={t.step4} />
            <SizeAndStitch template={template} opts={opts} setOpt={setOpt} craft={craft} multi={multi} colors={yarn.colors.map((x) => x.hex)} />
          </section>

          {/* 5 · Ölçü örneği */}
          <section className="card rp-step" aria-labelledby="rp-s5">
            <StepHead n={5} id="rp-s5" title={t.step5} />
            <ChoiceChips<'typical' | 'mine'>
              label={t.step5}
              value={d.gaugeMode}
              onChange={(m) => d.patch({ gaugeMode: m, mine: m === 'mine' && d.gaugeMode === 'typical' ? { ...d.mine, stitches: Math.round(typical.stitches), rows: Math.round(typical.rows), overW: toUnits(10, units), overH: toUnits(10, units) } : d.mine })}
              options={[
                { value: 'typical', label: t.typical },
                { value: 'mine', label: t.mine },
              ]}
            />
            {d.gaugeMode === 'typical' ? (
              <p className="muted">
                {t.perTen(fmt(typical.stitches, 1, lang), fmt(typical.rows, 1, lang), fmtLength(10, units, 0, lang))} · {terms.fill(gaugeLabel(gStitch, lang))}
              </p>
            ) : (
              <>
                <p className="hint">{t.gaugeHint(terms.fill(gaugeLabel(gStitch, lang)))}</p>
                <div className="rp-fields">
                  <Field label={t.gaugeStitches} htmlFor="rp-gs">
                    <NumberInput id="rp-gs" value={d.mine.stitches} min={1} max={200} onChange={(v) => d.patch({ mine: { ...d.mine, stitches: v } })} />
                  </Field>
                  <Field label={t.overWidth} htmlFor="rp-gw">
                    <NumberInput id="rp-gw" value={d.mine.overW} min={1} max={100} suffix={units} onChange={(v) => d.patch({ mine: { ...d.mine, overW: v } })} />
                  </Field>
                  <Field label={t.gaugeRows} htmlFor="rp-gr">
                    <NumberInput id="rp-gr" value={d.mine.rows} min={1} max={300} onChange={(v) => d.patch({ mine: { ...d.mine, rows: v } })} />
                  </Field>
                  <Field label={t.overHeight} htmlFor="rp-gh">
                    <NumberInput id="rp-gh" value={d.mine.overH} min={1} max={100} suffix={units} onChange={(v) => d.patch({ mine: { ...d.mine, overH: v } })} />
                  </Field>
                </div>
                {myGauge && <p className="small muted">{t.perTen(fmt(myGauge.stitches, 1, lang), fmt(myGauge.rows, 1, lang), fmtLength(10, units, 0, lang))}</p>}
              </>
            )}
            {template !== 'olcu-ornegi' && (
              <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => d.patch({ template: 'olcu-ornegi' })}>
                <SlidersHorizontal aria-hidden />
                {t.swatchFirst}
              </button>
            )}
          </section>
        </div>

        {/* Özet */}
        <aside className="rp-aside">
          <div className="card card-kraft rp-summary" aria-live="polite">
            <div className="spread">
              <h2 className="card-title" style={{ margin: 0 }}>
                {t.summary}
              </h2>
              <span className="chip">{craft === 'knit' ? c.knit : c.crochet}</span>
            </div>
            <div className="rp-tpl-art" style={{ background: 'transparent' }}>
              <WorkIllustration kind={ILLUSTRATION[template].kind} variant={ILLUSTRATION[template].variant} colors={yarn.colors.map((x) => x.hex)} />
            </div>
            <div className="rp-stats">
              {castOn !== undefined && (
                <div className="stat">
                  <span className="stat-label">{castLabel}</span>
                  <span className="stat-value">{c.stitches(castOn)}</span>
                </div>
              )}
              {pattern && (
                <div className="stat">
                  <span className="stat-label">{t.yarnTotal}</span>
                  <span className="stat-value">{fmtMeters(pattern.yarnMeters, lang)}</span>
                  {skeins > 0 && <span className="small">{t.skeinsShort(skeins)}</span>}
                </div>
              )}
            </div>
            {pattern && <p className="small" style={{ margin: 0 }}>{pattern.finishedSize}</p>}
            <button type="button" className="btn btn-primary btn-block" onClick={() => scrollTo(outRef.current)}>
              <ArrowDown aria-hidden />
              {t.showPattern}
            </button>
          </div>
        </aside>
      </div>

      {/* Çıktı */}
      <section className="rp-output" ref={outRef} aria-labelledby="rp-out">
        <h2 id="rp-out" className="section-title no-print">
          {t.output}
        </h2>
        <div className="rp-actions">
          <button type="button" className="btn btn-primary" onClick={save} disabled={!pattern}>
            <FolderPlus aria-hidden />
            {t.saveProject}
          </button>
          <button type="button" className="btn btn-soft" onClick={() => window.print()}>
            <Printer aria-hidden />
            {c.print}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => scrollTo(topRef.current)}>
            <SlidersHorizontal aria-hidden />
            {t.change}
          </button>
        </div>
        {pattern ? <PatternView pattern={pattern} /> : <Callout tone="warn">{t.unknownTemplate}</Callout>}
      </section>
    </div>
  );
}

function nearestListed(mm: number, hook: boolean): number {
  const list = (hook ? HOOK_SIZES.filter((s) => s.mm >= 2) : NEEDLE_SIZES).map((s) => s.mm);
  return list.reduce((a, b) => (Math.abs(b - mm) < Math.abs(a - mm) ? b : a), list[0]);
}

/** Kaydırma gerektirmeyen, telefonda alt satıra geçen seçim düğmeleri */
function ChoiceChips<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <div className="rp-chips" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} aria-pressed={o.value === value} className="rp-chip" onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function StepHead({ n, id, title }: { n: number; id: string; title: string }) {
  return (
    <div className="rp-step-head">
      <span className="rp-step-no" aria-hidden>
        {n}
      </span>
      <h2 id={id} className="rp-step-title">
        {title}
      </h2>
    </div>
  );
}

/* ── Kendi ipini tarif et ─────────────────────────────── */
function CustomYarnForm() {
  const t = useMsgs(R);
  const lang = useLang();
  const d = useRecipeDraft();
  const cy = d.custom;
  return (
    <div className="stack">
      <div className="rp-fields rp-fields-wide">
        <Field label={t.weight} htmlFor="rp-w" hint={YARN_WEIGHTS[cy.weight].shelf[lang]}>
          <select id="rp-w" className="select" value={cy.weight} onChange={(e) => d.patchCustom({ weight: Number(e.target.value) as YarnWeightId })}>
            {YARN_WEIGHTS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id} · {w.name[lang]} ({w.en})
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="rp-fields">
        <Field label={t.fiber} htmlFor="rp-f">
          <select id="rp-f" className="select" value={cy.fiber} onChange={(e) => d.patchCustom({ fiber: e.target.value as FiberId | '' })}>
            <option value="">{t.anyFiber}</option>
            {FIBERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name[lang]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.metersPerSkein} htmlFor="rp-m">
          <NumberInput id="rp-m" value={cy.metersPerSkein} min={0} max={5000} integer suffix="m" onChange={(v) => d.patchCustom({ metersPerSkein: v })} />
        </Field>
        <Field label={t.gramsPerSkein} htmlFor="rp-g">
          <NumberInput id="rp-g" value={cy.gramsPerSkein} min={0} max={2000} integer suffix="g" onChange={(v) => d.patchCustom({ gramsPerSkein: v })} />
        </Field>
      </div>
      <div className="field">
        <span className="label">{t.colors}</span>
        <div className="rp-colors">
          {cy.colors.map((hex, i) => (
            <div key={i} className="rp-color-row">
              <span className="rp-color-letter" style={{ background: hex, color: inkOn(hex) }} title={t.colorN(String.fromCharCode(65 + i))}>
                {String.fromCharCode(65 + i)}
              </span>
              <div className="grow">
                <ColorPicker value={hex} onChange={(h) => d.patchCustom({ colors: cy.colors.map((x, j) => (j === i ? h : x)) })} label={t.colorN(String.fromCharCode(65 + i))} />
              </div>
              {cy.colors.length > 1 && (
                <button type="button" className="btn btn-ghost btn-icon btn-sm" aria-label={t.removeColor} onClick={() => d.patchCustom({ colors: cy.colors.filter((_, j) => j !== i) })}>
                  <X aria-hidden />
                </button>
              )}
            </div>
          ))}
        </div>
        {cy.colors.length < 6 && (
          <button type="button" className="btn btn-soft btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => d.patchCustom({ colors: [...cy.colors, ['#d39a2c', '#5f7a61', '#46698a', '#7d4e6d', '#f5f0e6'][cy.colors.length - 1] ?? '#c47f7f'] })}>
            <Plus aria-hidden />
            {t.addColor}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Ölçü ve desen ────────────────────────────────────── */
function SizeAndStitch({ template, opts, setOpt, craft, multi, colors }: { template: TemplateId; opts: Opts; setOpt: (o: Opts) => void; craft: Craft; multi: boolean; colors: string[] }) {
  const t = useMsgs(R);
  const lang = useLang();
  const terms = useTerms();
  const units = useSettings((s) => s.units);
  const presets = PRESETS[template];
  const active = matchPreset(template, opts);
  const dims = DIMS[template];
  const dimLabel: Record<DimKey, string> = {
    widthCm: t.width,
    lengthCm: t.length,
    circumferenceCm: template === 'boyunluk' ? t.circumference : t.headCirc,
    heightCm: template === 'boyunluk' ? t.height : t.hatHeight,
    diameterCm: t.diameterField,
    swatchCm: t.swatchSize,
  };
  const stitchList: string[] =
    template === 'atki' ? KNIT_SCARF_STITCHES : template === 'atki-tig' ? [...CROCHET_SCARF_STITCHES] : template === 'boyunluk' ? COWL_STITCHES : template === 'bebek-battaniyesi' ? BLANKET_CENTERS : template === 'olcu-ornegi' && craft === 'knit' ? KNIT_SCARF_STITCHES.concat(['jarse']) : [];
  const stitchIdFor = template === 'bere' ? opts.bodyId : opts.stitchId;

  return (
    <div className="stack">
      {presets.length > 0 && (
        <div className="field">
          <span className="label">{t.presets}</span>
          <div className="rp-chips">
            {presets.map((p) => (
              <button key={p.id} type="button" className="rp-chip" aria-pressed={active === p.id} onClick={() => setOpt(p.params)}>
                {p.label[lang]}
                <small>
                  {Object.entries(p.params)
                    .filter(([k]) => k.endsWith('Cm'))
                    .map(([, v]) => fmtLength(v as number, units, units === 'in' ? 1 : 0, lang))
                    .join(' × ')}
                </small>
              </button>
            ))}
          </div>
        </div>
      )}
      {dims.length > 0 && (
        <div className="rp-fields">
          {dims.map((k) => (
            <Field key={k} label={dimLabel[k]} htmlFor={`rp-${k}`}>
              <NumberInput id={`rp-${k}`} value={toUnits((opts[k] as number) ?? 0, units)} min={1} max={units === 'in' ? 120 : 300} suffix={units} onChange={(v) => setOpt({ [k]: fromUnits(v, units) } as Opts)} />
            </Field>
          ))}
        </div>
      )}

      {/* desen seçimi */}
      {template === 'bere' && (
        <>
          <StitchChips label={t.rib} list={[...HAT_RIBS]} value={opts.ribId} onPick={(id) => setOpt({ ribId: id })} />
          <StitchChips label={t.body} list={[...HAT_BODIES]} value={opts.bodyId} onPick={(id) => setOpt({ bodyId: id })} />
        </>
      )}
      {stitchList.length > 0 && <StitchChips label={template === 'bebek-battaniyesi' ? t.stitchPattern : t.stitchPattern} list={stitchList} value={opts.stitchId} onPick={(id) => setOpt({ stitchId: id })} />}
      {stitchIdFor && PATTERN_BY_ID[stitchIdFor] && <StitchPreview id={stitchIdFor} color={colors[0] ?? '#b5523b'} mode={template === 'bere' || template === 'boyunluk' ? 'round' : 'flat'} />}

      {/* seçenekler */}
      <div className="rp-options">
        {template === 'atki' && <Switch checked={!!opts.selvedge} onChange={(v) => setOpt({ selvedge: v })} label={t.selvedge} hint={t.selvedgeHint} />}
        {(template === 'atki' || template === 'atki-tig') && <Switch checked={!!opts.fringe} onChange={(v) => setOpt({ fringe: v })} label={t.fringe} />}
        {(template === 'atki' || template === 'atki-tig' || template === 'amigurumi-top') &&
          (multi ? (
            <Field label={t.stripes} hint={t.stripesHint}>
              <Stepper value={opts.stripeRows ?? 0} min={0} max={20} onChange={(v) => setOpt({ stripeRows: v })} ariaLabel={t.stripes} />
            </Field>
          ) : (
            <p className="hint">{t.stripesNeedColors}</p>
          ))}
        {template === 'amigurumi-top' && <Switch checked={opts.staggered ?? true} onChange={(v) => setOpt({ staggered: v })} label={t.staggered} hint={t.staggeredHint} />}
        {(template === 'bardak-altligi' || (template === 'olcu-ornegi' && craft === 'crochet')) && (
          <Field label={t.crochetStitch}>
            <ChoiceChips
              value={opts.crochetStitch ?? 'hdc'}
              onChange={(v) => setOpt({ crochetStitch: v })}
              options={(['sc', 'hdc', 'dc'] as const).map((s) => ({ value: s, label: terms.name(s) }))}
              label={t.crochetStitch}
            />
          </Field>
        )}
        {template === 'bardak-altligi' && (
          <>
            <Field label={t.count}>
              <Stepper value={opts.count ?? 4} min={1} max={12} onChange={(v) => setOpt({ count: v })} ariaLabel={t.count} />
            </Field>
            {multi && (
              <Field label={t.colorMode}>
                <ChoiceChips
                  value={opts.colorMode ?? 'per-piece'}
                  onChange={(v) => setOpt({ colorMode: v })}
                  options={[
                    { value: 'per-piece', label: t.perPiece },
                    { value: 'rounds', label: t.perRound },
                  ]}
                  label={t.colorMode}
                />
              </Field>
            )}
            <Switch checked={opts.edge === 'crab'} onChange={(v) => setOpt({ edge: v ? 'crab' : 'none' })} label={t.crabEdge} />
          </>
        )}
        {template === 'buyukanne-karesi' && (
          <>
            <Field label={t.rounds}>
              <Stepper value={opts.rounds ?? 4} min={1} max={15} onChange={(v) => setOpt({ rounds: v })} ariaLabel={t.rounds} />
            </Field>
            <Switch checked={(opts.blanketCols ?? 0) > 0} onChange={(v) => setOpt(v ? { blanketCols: 5, blanketRows: 6 } : { blanketCols: 0, blanketRows: 0 })} label={t.blanket} />
            {(opts.blanketCols ?? 0) > 0 && (
              <>
                <div className="rp-fields">
                  <Field label={t.cols}>
                    <Stepper value={opts.blanketCols ?? 5} min={1} max={30} onChange={(v) => setOpt({ blanketCols: v })} ariaLabel={t.cols} />
                  </Field>
                  <Field label={t.rowsSq}>
                    <Stepper value={opts.blanketRows ?? 6} min={1} max={30} onChange={(v) => setOpt({ blanketRows: v })} ariaLabel={t.rowsSq} />
                  </Field>
                  <Field label={t.borderRounds}>
                    <Stepper value={opts.borderRounds ?? 2} min={0} max={10} onChange={(v) => setOpt({ borderRounds: v })} ariaLabel={t.borderRounds} />
                  </Field>
                </div>
                <Field label={t.join}>
                  <ChoiceChips
                    value={opts.join ?? 'slst'}
                    onChange={(v) => setOpt({ join: v })}
                    options={[
                      { value: 'slst', label: terms.fill(t.joinSlst) },
                      { value: 'sc', label: terms.fill(t.joinSc) },
                      { value: 'whip', label: t.joinWhip },
                    ]}
                    label={t.join}
                  />
                </Field>
              </>
            )}
          </>
        )}
        {template === 'bere' && (
          <>
            <div className="rp-fields">
              <Field label={t.brimHeight} htmlFor="rp-brim">
                <NumberInput id="rp-brim" value={toUnits(opts.brimCm ?? 5, units)} min={1} max={30} suffix={units} onChange={(v) => setOpt({ brimCm: fromUnits(v, units) })} />
              </Field>
            </div>
            <Switch checked={!!opts.foldBrim} onChange={(v) => setOpt({ foldBrim: v })} label={t.foldBrim} />
          </>
        )}
        {template === 'bere-tig' && (
          <>
            <Field label={t.brimType}>
              <ChoiceChips
                value={opts.brim ?? 'rib'}
                onChange={(v) => setOpt({ brim: v })}
                options={[
                  { value: 'rib', label: t.brimRib },
                  { value: 'sc', label: terms.fill(t.brimSc) },
                  { value: 'none', label: t.none },
                ]}
                label={t.brimType}
              />
            </Field>
            {opts.brim !== 'none' && (
              <div className="rp-fields">
                <Field label={t.brimHeight} htmlFor="rp-brim2">
                  <NumberInput id="rp-brim2" value={toUnits(opts.brimCm ?? 4, units)} min={1} max={20} suffix={units} onChange={(v) => setOpt({ brimCm: fromUnits(v, units) })} />
                </Field>
              </div>
            )}
          </>
        )}
        {(template === 'bere' || template === 'bere-tig') && <Switch checked={!!opts.pompom} onChange={(v) => setOpt({ pompom: v })} label={t.pompom} />}
        {template === 'boyunluk' && (
          <Field label={t.edge}>
            <ChoiceChips
              value={opts.edge ?? 'none'}
              onChange={(v) => setOpt({ edge: v })}
              options={[
                { value: 'none', label: t.none },
                { value: 'rib', label: t.edgeRib },
                { value: 'garter', label: t.edgeGarter },
              ]}
              label={t.edge}
            />
          </Field>
        )}
        {template === 'bebek-battaniyesi' && (
          <div className="rp-fields">
            <Field label={t.border}>
              <ChoiceChips
                value={opts.borderId ?? 'haraso'}
                onChange={(v) => setOpt({ borderId: v })}
                options={(['haraso', 'pirinc'] as const).map((id) => ({ value: id, label: PATTERN_BY_ID[id].name[lang] }))}
                label={t.border}
              />
            </Field>
            <Field label={t.borderWidth} htmlFor="rp-bw">
              <NumberInput id="rp-bw" value={toUnits(opts.borderCm ?? 4, units)} min={1} max={20} suffix={units} onChange={(v) => setOpt({ borderCm: fromUnits(v, units) })} />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

function StitchChips({ label, list, value, onPick }: { label: string; list: string[]; value?: string; onPick: (id: string) => void }) {
  const lang = useLang();
  const terms = useTerms();
  const uniq = [...new Set(list)].filter((id) => PATTERN_BY_ID[id]);
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="rp-chips" role="radiogroup" aria-label={label}>
        {uniq.map((id) => (
          <button key={id} type="button" role="radio" aria-checked={value === id} aria-pressed={value === id} className="rp-chip" onClick={() => onPick(id)}>
            {terms.fill(PATTERN_BY_ID[id].name[lang])}
          </button>
        ))}
      </div>
    </div>
  );
}

function StitchPreview({ id, color, mode }: { id: string; color: string; mode: 'flat' | 'round' }) {
  const t = useMsgs(R);
  const lang = useLang();
  const terms = useTerms();
  const sp = PATTERN_BY_ID[id];
  const cells = patternChartCells(sp);
  const w = mode === 'round' && sp.round ? sp.round : sp.flat;
  return (
    <div className="rp-preview">
      {cells && (
        <div className="rp-preview-art" aria-label={t.preview}>
          <FabricPreview width={cells.width} height={cells.height} symbols={cells.symbols} craft={sp.craft} yarnColor={color} tileX={1} tileY={Math.max(1, Math.ceil(6 / cells.height))} stitchPx={10} ariaLabel={t.preview} />
        </div>
      )}
      <div className="stack-sm">
        <b>{terms.fill(sp.name[lang])}</b>
        <span className="small muted">{terms.fill(sp.summary[lang])}</span>
        <span className="chip" data-tone="denim" style={{ alignSelf: 'flex-start' }}>
          {t.rule(multipleText(w, lang))}
        </span>
        {cells && cells.width <= 24 && cells.height >= 2 && (
          <div style={{ overflowX: 'auto' }}>
            <ChartView width={cells.width} height={cells.height} symbols={cells.symbols} craft={sp.craft} cell={12} ariaLabel={terms.fill(sp.name[lang])} />
          </div>
        )}
      </div>
    </div>
  );
}
