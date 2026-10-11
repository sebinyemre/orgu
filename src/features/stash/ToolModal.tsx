/** Şiş/tığ ekleme ve düzenleme */
import { useState, type FormEvent } from 'react';
import type { Tool, ToolKind, ToolMaterial } from '@/types';
import { Modal } from '@/ui/Modal';
import { Field, Stepper } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { TOOL_KIND_INFO, TOOL_KIND_LABEL, TOOL_MATERIAL_LABEL, nearestSize } from '@/knowledge/tools';
import { OptionalNumber } from '@/features/counters/OptionalNumber';
import { STS } from './i18n';
import { mmText } from './labels';
import { TOOL_KINDS, localizeUs, sizesFor } from './stashMath';
import './stash.css';

export type ToolData = Omit<Tool, 'id' | 'createdAt'>;

interface Props {
  open: boolean;
  tool?: Tool;
  /** yeni alet için ön değer (şiş ölçerden) */
  preset?: Partial<ToolData>;
  onClose: () => void;
  onSave: (data: ToolData) => void;
}

const MATERIALS: ToolMaterial[] = ['metal', 'bambu', 'ahsap', 'plastik', 'karbon', 'ergonomik'];
const LENGTHS: Partial<Record<ToolKind, number[]>> = {
  'sis-misinali': [40, 60, 80, 100, 120],
  'sis-duz': [25, 35, 40],
  'sis-corap': [15, 20],
};

export function ToolModal(props: Props) {
  const t = useMsgs(STS);
  return (
    <Modal open={props.open} onClose={props.onClose} title={props.tool ? t.editTool : t.addTool}>
      <ToolForm {...props} />
    </Modal>
  );
}

function ToolForm({ tool, preset, onClose, onSave }: Props) {
  const t = useMsgs(STS);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const [d, setD] = useState<ToolData>(() => tool ?? { kind: 'sis-misinali', sizeMm: 4, count: 1, lengthCm: 80, ...preset });
  const set = (p: Partial<ToolData>) => setD((x) => ({ ...x, ...p }));
  const sizes = sizesFor(d.kind);

  const changeKind = (kind: ToolKind) => {
    const list = sizesFor(kind);
    const sizeMm = list.some((s) => s.mm === d.sizeMm) ? d.sizeMm : nearestSize(list, d.sizeMm).mm;
    const lengths = LENGTHS[kind];
    set({
      kind,
      sizeMm,
      lengthCm: lengths ? (d.lengthCm && lengths.includes(d.lengthCm) ? d.lengthCm : lengths[Math.floor(lengths.length / 2)]) : undefined,
      count: kind === 'sis-corap' ? Math.max(d.count, 5) : d.count,
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ ...d, notes: d.notes?.trim() || undefined, lengthCm: d.kind === 'tig' ? undefined : d.lengthCm });
    onClose();
  };

  return (
    <form className="stack-lg" onSubmit={submit}>
      <Field label={t.toolKind} htmlFor="t-kind">
        <select id="t-kind" className="select" value={d.kind} onChange={(e) => changeKind(e.target.value as ToolKind)} autoFocus>
          {TOOL_KINDS.map((k) => (
            <option key={k} value={k}>
              {TOOL_KIND_LABEL[k][lang]}
            </option>
          ))}
        </select>
      </Field>
      <Callout tone="info">
        <p className="small">{TOOL_KIND_INFO[d.kind][lang]}</p>
      </Callout>

      <div className="stash-form-grid">
        <Field label={t.size} htmlFor="t-size">
          <select id="t-size" className="select" value={d.sizeMm} onChange={(e) => set({ sizeMm: Number(e.target.value) })}>
            {sizes.map((s) => (
              <option key={s.mm} value={s.mm}>
                {mmText(s.mm, lang)}
                {[s.us && ` · US ${localizeUs(s.us, t.steel)}`, s.uk && ` · UK ${s.uk}`].filter(Boolean).join('')}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.count}>
          <Stepper value={d.count} onChange={(n) => set({ count: n })} min={1} max={99} ariaLabel={t.count} />
        </Field>
      </div>

      {d.kind !== 'tig' && (
        <div className="stack-sm">
          <Field label={t.length} hint={t.lengthHint} htmlFor="t-len">
            <OptionalNumber id="t-len" value={d.lengthCm} onChange={(n) => set({ lengthCm: n })} suffix="cm" />
          </Field>
          {LENGTHS[d.kind] && (
            <div className="row" style={{ gap: 6 }}>
              {LENGTHS[d.kind]!.map((l) => (
                <button key={l} type="button" className="chip" data-tone="denim" aria-pressed={d.lengthCm === l} onClick={() => set({ lengthCm: l })}>
                  {l} cm
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Field label={t.material} htmlFor="t-mat">
        <select id="t-mat" className="select" value={d.material ?? ''} onChange={(e) => set({ material: (e.target.value || undefined) as ToolMaterial | undefined })}>
          <option value="">{t.none}</option>
          {MATERIALS.map((m) => (
            <option key={m} value={m}>
              {TOOL_MATERIAL_LABEL[m][lang]}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t.notes} htmlFor="t-notes">
        <input id="t-notes" className="input" value={d.notes ?? ''} onChange={(e) => set({ notes: e.target.value })} maxLength={80} />
      </Field>

      <div className="modal-footer" style={{ marginTop: 0 }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          {tc.cancel}
        </button>
        <button type="submit" className="btn btn-primary">
          {tc.save}
        </button>
      </div>
    </form>
  );
}
