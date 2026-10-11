/** İp ekleme/düzenleme: etiket bilgileri, kalınlık (ya da metre/gramdan tahmin), lif, metraj. */
import { useState, type FormEvent } from 'react';
import type { FiberId, Yarn, YarnWeightId } from '@/types';
import { Modal } from '@/ui/Modal';
import { Field, Stepper } from '@/ui/Field';
import { ColorPicker } from '@/ui/ColorPicker';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { FIBERS } from '@/knowledge/fibers';
import { YARN_WEIGHTS, weightFromLength } from '@/knowledge/yarnWeights';
import { HOOK_SIZES, NEEDLE_SIZES, type NeedleSize } from '@/knowledge/tools';
import { nameColor } from '@/lib/color';
import { fmt, fmtMeters } from '@/lib/format';
import { OptionalNumber } from '@/features/counters/OptionalNumber';
import { STS } from './i18n';
import { mmText, rangeMm, weightLong } from './labels';
import { localizeUs, metersPer100g } from './stashMath';
import './stash.css';

export type YarnData = Omit<Yarn, 'id' | 'createdAt'>;

interface Props {
  open: boolean;
  yarn?: Yarn;
  onClose: () => void;
  onSave: (data: YarnData) => void;
}

export function YarnModal(props: Props) {
  const t = useMsgs(STS);
  return (
    <Modal open={props.open} onClose={props.onClose} title={props.yarn ? t.editYarn : t.addYarn}>
      <YarnForm {...props} />
    </Modal>
  );
}

interface Draft {
  brand: string;
  name: string;
  colorName: string;
  colorHex: string;
  weight: YarnWeightId | 'auto';
  fibers: FiberId[];
  metersPerSkein?: number;
  gramsPerSkein?: number;
  skeins: number;
  dyeLot: string;
  suggestedNeedleMm?: number;
  suggestedHookMm?: number;
  notes: string;
}

function SizeSelect({ id, list, value, onChange, none, steel }: { id: string; list: NeedleSize[]; value?: number; onChange: (v?: number) => void; none: string; steel: string }) {
  const lang = useLang();
  return (
    <select id={id} className="select" value={value ?? ''} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}>
      <option value="">{none}</option>
      {list.map((s) => (
        <option key={s.mm} value={s.mm}>
          {mmText(s.mm, lang)}
          {s.us ? ` · US ${localizeUs(s.us, steel)}` : ''}
        </option>
      ))}
    </select>
  );
}

function YarnForm({ yarn, onClose, onSave }: Props) {
  const t = useMsgs(STS);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const [d, setD] = useState<Draft>(() =>
    yarn
      ? { ...yarn, dyeLot: yarn.dyeLot ?? '', notes: yarn.notes ?? '' }
      : { brand: '', name: '', colorName: nameColor('#b5523b', lang), colorHex: '#b5523b', weight: 4, fibers: [], skeins: 1, dyeLot: '', notes: '' },
  );
  const [nameTouched, setNameTouched] = useState(!!yarn);
  const set = (p: Partial<Draft>) => setD((x) => ({ ...x, ...p }));

  const per100 = metersPer100g(d.metersPerSkein ?? 0, d.gramsPerSkein ?? 0);
  const estimate = per100 ? weightFromLength(per100) : null;
  const info = d.weight === 'auto' ? estimate : YARN_WEIGHTS[d.weight];
  const canSave = !!(d.brand.trim() || d.name.trim() || d.colorName.trim());

  const toggleFiber = (f: FiberId) => set({ fibers: d.fibers.includes(f) ? d.fibers.filter((x) => x !== f) : [...d.fibers, f] });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    const weight: YarnWeightId = d.weight === 'auto' ? (estimate?.id ?? 4) : d.weight;
    onSave({
      brand: d.brand.trim(),
      name: d.name.trim(),
      colorName: d.colorName.trim(),
      colorHex: d.colorHex,
      weight,
      fibers: d.fibers,
      metersPerSkein: d.metersPerSkein ?? 0,
      gramsPerSkein: d.gramsPerSkein ?? 0,
      skeins: d.skeins,
      dyeLot: d.dyeLot.trim() || undefined,
      suggestedNeedleMm: d.suggestedNeedleMm,
      suggestedHookMm: d.suggestedHookMm,
      notes: d.notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <form className="stack-lg" onSubmit={submit}>
      <div className="stash-form-grid">
        <Field label={t.brand} htmlFor="y-brand">
          <input id="y-brand" className="input" value={d.brand} onChange={(e) => set({ brand: e.target.value })} maxLength={40} autoFocus />
        </Field>
        <Field label={t.name} htmlFor="y-name">
          <input id="y-name" className="input" value={d.name} onChange={(e) => set({ name: e.target.value })} maxLength={50} />
        </Field>
      </div>

      <div className="stack-sm">
        <span className="label">{t.colorNo}</span>
        <ColorPicker value={d.colorHex} onChange={(hex) => set({ colorHex: hex, ...(nameTouched ? null : { colorName: nameColor(hex, lang) }) })} />
        <Field label={t.colorName} htmlFor="y-cname">
          <input
            id="y-cname"
            className="input"
            value={d.colorName}
            onChange={(e) => {
              setNameTouched(true);
              set({ colorName: e.target.value });
            }}
            maxLength={40}
          />
        </Field>
      </div>

      <div className="stash-form-grid">
        <Field label={t.metersPerSkein} htmlFor="y-m">
          <OptionalNumber id="y-m" value={d.metersPerSkein} onChange={(n) => set({ metersPerSkein: n })} suffix="m" integer={false} />
        </Field>
        <Field label={t.gramsPerSkein} htmlFor="y-g">
          <OptionalNumber id="y-g" value={d.gramsPerSkein} onChange={(n) => set({ gramsPerSkein: n })} suffix="g" integer={false} />
        </Field>
      </div>

      <Field label={t.weight} htmlFor="y-w">
        <select id="y-w" className="select" value={String(d.weight)} onChange={(e) => set({ weight: e.target.value === 'auto' ? 'auto' : (Number(e.target.value) as YarnWeightId) })}>
          {YARN_WEIGHTS.map((w) => (
            <option key={w.id} value={w.id}>
              {weightLong(w.id, lang)}
            </option>
          ))}
          <option value="auto">{t.weightNotSure}</option>
        </select>
      </Field>
      {d.weight === 'auto' && !estimate && (
        <p className="hint" style={{ marginTop: -12 }}>
          {t.estimateNeeds}
        </p>
      )}
      {info && (
        <div className="stash-weight-info" data-estimate={d.weight === 'auto' || undefined}>
          {d.weight === 'auto' && (
            <div className="spread">
              <b>{t.estimate(weightLong(info.id, lang))}</b>
              <button type="button" className="btn btn-soft btn-sm" onClick={() => set({ weight: info.id })}>
                {t.useEstimate}
              </button>
            </div>
          )}
          <p className="small" style={{ margin: 0 }}>
            {info.shelf[lang]}
          </p>
          <div className="row xsmall muted">
            {per100 && d.weight === 'auto' && <span className="chip">{t.per100(fmtMeters(per100))}</span>}
            <span className="chip" data-tone="denim">
              {t.needleRange(rangeMm(info.needleMm, lang))}
            </span>
            <span className="chip" data-tone="plum">
              {t.hookRange(rangeMm(info.hookMm, lang))}
            </span>
            <span className="chip">
              WPI {info.wpi[0]}–{info.wpi[1]}
            </span>
          </div>
        </div>
      )}

      <div className="stack-sm">
        <span className="label">{t.fibers}</span>
        <div className="row" style={{ gap: 6 }}>
          {FIBERS.map((f) => (
            <button key={f.id} type="button" className="chip stash-fiber-chip" aria-pressed={d.fibers.includes(f.id)} onClick={() => toggleFiber(f.id)}>
              {f.name[lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="stash-form-grid">
        <Field label={t.skeinsLeft} hint={t.skeinsHint}>
          <Stepper value={d.skeins} onChange={(n) => set({ skeins: n })} step={0.5} min={0} max={999} ariaLabel={t.skeinsLeft} />
        </Field>
        <Field label={t.dyeLot} hint={t.dyeLotHint} htmlFor="y-lot">
          <input id="y-lot" className="input" value={d.dyeLot} onChange={(e) => set({ dyeLot: e.target.value })} maxLength={20} />
        </Field>
      </div>
      {d.metersPerSkein ? (
        <p className="hint" style={{ marginTop: -12 }}>
          {fmtMeters(d.metersPerSkein * d.skeins)} · {fmt(d.skeins, 1)} × {fmtMeters(d.metersPerSkein)}
        </p>
      ) : null}

      <div className="stash-form-grid">
        <Field label={t.labelNeedle} htmlFor="y-needle">
          <SizeSelect id="y-needle" list={NEEDLE_SIZES} value={d.suggestedNeedleMm} onChange={(v) => set({ suggestedNeedleMm: v })} none={t.none} steel={t.steel} />
        </Field>
        <Field label={t.labelHook} htmlFor="y-hook">
          <SizeSelect id="y-hook" list={HOOK_SIZES} value={d.suggestedHookMm} onChange={(v) => set({ suggestedHookMm: v })} none={t.none} steel={t.steel} />
        </Field>
      </div>

      <Field label={t.notes} htmlFor="y-notes">
        <textarea id="y-notes" className="textarea" value={d.notes} onChange={(e) => set({ notes: e.target.value })} rows={3} />
      </Field>

      <div className="modal-footer" style={{ marginTop: 0 }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          {tc.cancel}
        </button>
        <button type="submit" className="btn btn-primary" disabled={!canSave}>
          {tc.save}
        </button>
      </div>
    </form>
  );
}
