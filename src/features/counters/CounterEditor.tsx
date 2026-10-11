/** Sayaç ekleme/düzenleme penceresi: ad, görünüm, hedef, bağlantı, hatırlatıcılar. */
import { useState, type FormEvent } from 'react';
import { BellPlus, Trash2 } from 'lucide-react';
import type { Counter, CounterReminder, CounterStyle } from '@/types';
import { Modal } from '@/ui/Modal';
import { Field, NumberInput, Switch } from '@/ui/Field';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { uid } from '@/lib/id';
import { CNT } from './i18n';
import { CounterFace } from './faces';
import { counterDisplayName, linkCandidates } from './counterMath';
import { OptionalNumber } from './OptionalNumber';
import './counters.css';

export interface CounterDraft {
  name: string;
  style: CounterStyle;
  value: number;
  target?: number;
  link?: { toId: string; every: number };
  reminders: CounterReminder[];
}

export interface CounterEditorProps {
  open: boolean;
  /** düzenlenecek sayaç; verilmezse yeni sayaç */
  counter?: Counter;
  /** aynı listedeki sayaçlar (bağlantı seçenekleri) */
  siblings: Counter[];
  onClose: () => void;
  onSave: (draft: CounterDraft) => void;
  onDelete?: () => void;
  defaultName?: string;
  defaultStyle?: CounterStyle;
}

const STYLES: CounterStyle[] = ['mekanik', 'centik', 'boncuk', 'yumak'];
const SAMPLE: Record<CounterStyle, number> = { mekanik: 27, centik: 7, boncuk: 34, yumak: 6 };

export function CounterEditor(props: CounterEditorProps) {
  const t = useMsgs(CNT);
  return (
    <Modal open={props.open} onClose={props.onClose} title={props.counter ? t.editCounter : t.newCounter}>
      <EditorForm {...props} />
    </Modal>
  );
}

function EditorForm({ counter, siblings, onClose, onSave, onDelete, defaultName, defaultStyle }: CounterEditorProps) {
  const t = useMsgs(CNT);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const [d, setD] = useState<CounterDraft>(() =>
    counter
      ? { name: counterDisplayName(counter.name, lang), style: counter.style, value: counter.value, target: counter.target, link: counter.link, reminders: counter.reminders.map((r) => ({ ...r })) }
      : { name: defaultName ?? '', style: defaultStyle ?? 'mekanik', value: 0, reminders: [] },
  );
  const candidates = linkCandidates(siblings, counter?.id);
  const set = (patch: Partial<CounterDraft>) => setD((x) => ({ ...x, ...patch }));
  const setRem = (id: string, patch: Partial<CounterReminder>) => set({ reminders: d.reminders.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  const addRem = (text = '') => set({ reminders: [...d.reminders, { id: uid('hat'), at: Math.max(1, d.value + 1), text }] });
  const linkTarget = d.link ? candidates.find((c) => c.id === d.link!.toId) : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const name = d.name.trim() || t.defaults.counter;
    const reminders = d.reminders.filter((r) => r.text.trim() && r.at > 0).map((r) => ({ ...r, text: r.text.trim(), every: r.every && r.every > 0 ? r.every : undefined }));
    const link = d.link && linkTarget && d.link.every > 0 ? d.link : undefined;
    onSave({ ...d, name, reminders, link, target: d.target && d.target > 0 ? d.target : undefined });
    onClose();
  };

  return (
    <form className="stack-lg" onSubmit={submit}>
      <Field label={t.name} htmlFor="cnt-name">
        <input id="cnt-name" className="input" value={d.name} placeholder={t.namePlaceholder} onChange={(e) => set({ name: e.target.value })} maxLength={40} autoFocus />
      </Field>

      <fieldset className="cnt-fieldset">
        <legend className="label">{t.style}</legend>
        <div className="cnt-style-grid" role="radiogroup" aria-label={t.style}>
          {STYLES.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={d.style === s} className="cnt-style-tile" onClick={() => set({ style: s })}>
              <span className="cnt-style-preview">
                <CounterFace style={s} value={SAMPLE[s]} target={s === 'yumak' ? 10 : undefined} size="sm" />
              </span>
              <span className="cnt-style-name">{t.styleName[s]}</span>
              <span className="xsmall faint">{t.styleDesc[s]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid-2" style={{ gap: 'var(--space-3)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))' }}>
        <Field label={t.current} hint={t.currentHint} htmlFor="cnt-value">
          <NumberInput id="cnt-value" value={d.value} onChange={(n) => set({ value: n })} min={0} integer />
        </Field>
        <Field label={t.target} hint={t.targetHint} htmlFor="cnt-target">
          <OptionalNumber id="cnt-target" value={d.target} onChange={(n) => set({ target: n })} min={1} />
        </Field>
      </div>

      <div className="stack-sm">
        {candidates.length ? (
          <Switch checked={!!d.link} onChange={(on) => set({ link: on ? { toId: candidates[0].id, every: d.link?.every ?? 8 } : undefined })} label={t.link} />
        ) : (
          <>
            <span className="label">{t.link}</span>
            <span className="hint">{t.linkNeedsOther}</span>
          </>
        )}
        {d.link && candidates.length > 0 && (
          <div className="cnt-link-box">
            <div className="grid-2" style={{ gap: 'var(--space-3)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))' }}>
              <Field label={t.linkEvery} htmlFor="cnt-every">
                <NumberInput id="cnt-every" value={d.link.every} onChange={(n) => set({ link: { ...d.link!, every: n } })} min={1} integer />
              </Field>
              <Field label={t.linkTarget} htmlFor="cnt-to">
                <select id="cnt-to" className="select" value={d.link.toId} onChange={(e) => set({ link: { ...d.link!, toId: e.target.value } })}>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {counterDisplayName(c.name, lang)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {linkTarget && (
              <p className="small muted" style={{ margin: 0 }}>
                {t.linkSentence(d.link.every, counterDisplayName(linkTarget.name, lang))}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="stack-sm">
        <div>
          <div className="label">{t.reminders}</div>
          <div className="hint">{t.remindersHint}</div>
        </div>
        {d.reminders.map((r, i) => (
          <div key={r.id} className="cnt-rem-row">
            <Field label={t.reminderAt} htmlFor={`rem-at-${i}`}>
              <NumberInput id={`rem-at-${i}`} value={r.at} onChange={(n) => setRem(r.id, { at: n })} min={1} integer />
            </Field>
            <Field label={t.reminderEvery} htmlFor={`rem-every-${i}`}>
              <OptionalNumber id={`rem-every-${i}`} value={r.every} onChange={(n) => setRem(r.id, { every: n })} min={1} placeholder={t.none} />
            </Field>
            <Field label={t.reminderText} htmlFor={`rem-text-${i}`} className="cnt-rem-text">
              <input id={`rem-text-${i}`} className="input" value={r.text} onChange={(e) => setRem(r.id, { text: e.target.value })} maxLength={60} />
            </Field>
            <button
              type="button"
              className="btn btn-ghost btn-icon cnt-rem-del"
              onClick={() => set({ reminders: d.reminders.filter((x) => x.id !== r.id) })}
              aria-label={t.removeReminder}
              title={t.removeReminder}
            >
              <Trash2 />
            </button>
          </div>
        ))}
        <div className="row">
          <button type="button" className="btn btn-soft btn-sm" onClick={() => addRem()}>
            <BellPlus />
            {t.addReminder}
          </button>
          <span className="xsmall faint">{t.quickAdd}:</span>
          {t.presets.map((p) => (
            <button key={p} type="button" className="chip" data-tone="plum" onClick={() => addRem(p)}>
              + {p}
            </button>
          ))}
        </div>
      </div>

      <div className="modal-footer" style={{ marginTop: 0 }}>
        {onDelete && (
          <button
            type="button"
            className="btn btn-danger"
            style={{ marginRight: 'auto' }}
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            <Trash2 />
            {tc.delete}
          </button>
        )}
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
