/** Yeni proje / projeyi düzenle: ad, zanaat, durum, renk, şiş-tığ numarası, sepetten ip ve alet. */
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Craft, Project, ProjectStatus } from '@/types';
import { Modal } from '@/ui/Modal';
import { Field } from '@/ui/Field';
import { Segmented } from '@/ui/Segmented';
import { ColorPicker } from '@/ui/ColorPicker';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { PROJECT_COLORS, useProjects } from '@/store/projects';
import { useStash } from '@/store/stash';
import { HOOK_SIZES, NEEDLE_SIZES } from '@/knowledge/tools';
import { YARN_SWATCHES } from '@/knowledge/swatches';
import { makeCounter } from '@/engine/counters';
import { CNT } from '@/features/counters/i18n';
import { YarnMini } from '@/features/stash/YarnTag';
import { mmText, toolTitle, usUkText } from '@/features/stash/labels';
import { isHookKind, localizeUs } from '@/features/stash/stashMath';
import { STS } from '@/features/stash/i18n';
import { PRJ } from './i18n';
import { STATUSES, statusPatch } from './projectMath';
import './projects.css';

interface Props {
  open: boolean;
  /** düzenlenecek proje; yoksa yeni */
  project?: Project;
  /** yeni proje için başlangıç durumu */
  initialStatus?: ProjectStatus;
  onClose: () => void;
}

export function ProjectFormModal(props: Props) {
  const t = useMsgs(PRJ);
  return (
    <Modal open={props.open} onClose={props.onClose} title={props.project ? t.editProject : t.newProject}>
      <ProjectForm {...props} />
    </Modal>
  );
}

interface Draft {
  name: string;
  craft: Craft;
  status: ProjectStatus;
  color: string;
  toolSizeMm?: number;
  yarnIds: string[];
  toolIds: string[];
}

function ProjectForm({ project, initialStatus, onClose }: Props) {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const ts = useMsgs(STS);
  const lang = useLang();
  const nav = useNavigate();
  const yarns = useStash((s) => s.yarns);
  const tools = useStash((s) => s.tools);
  const count = useProjects((s) => s.projects.length);
  const [d, setD] = useState<Draft>(() =>
    project
      ? { name: project.name, craft: project.craft, status: project.status, color: project.color, toolSizeMm: project.toolSizeMm, yarnIds: [...project.yarnIds], toolIds: [...project.toolIds] }
      : { name: '', craft: 'knit', status: initialStatus ?? 'sirada', color: PROJECT_COLORS[count % PROJECT_COLORS.length], yarnIds: [], toolIds: [] },
  );
  const set = (p: Partial<Draft>) => setD((x) => ({ ...x, ...p }));
  const toggle = (key: 'yarnIds' | 'toolIds', id: string) => set({ [key]: d[key].includes(id) ? d[key].filter((x) => x !== id) : [...d[key], id] });
  const sizes = d.craft === 'knit' ? NEEDLE_SIZES : HOOK_SIZES;
  const craftTools = tools.filter((x) => (d.craft === 'crochet') === isHookKind(x.kind));
  const presets = [
    ...PROJECT_COLORS,
    ...YARN_SWATCHES.map((s) => s.hex)
      .filter((h) => !PROJECT_COLORS.includes(h))
      .slice(0, 8),
  ];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const name = d.name.trim();
    if (!name) return;
    const store = useProjects.getState();
    const base = { name, craft: d.craft, color: d.color, toolSizeMm: d.toolSizeMm, yarnIds: d.yarnIds, toolIds: d.toolIds };
    if (project) {
      store.update(project.id, { ...base, ...(d.status !== project.status ? statusPatch(project, d.status) : null) });
      onClose();
      return;
    }
    const now = Date.now();
    const created = store.create({
      ...base,
      status: d.status,
      counters: [makeCounter(d.craft === 'crochet' ? CNT[lang].defaults.roundRow : CNT[lang].defaults.row)],
      startedAt: d.status === 'oruluyor' || d.status === 'bitti' ? now : undefined,
      finishedAt: d.status === 'bitti' ? now : undefined,
    });
    onClose();
    nav(`/projeler/${created.id}`);
  };

  return (
    <form className="stack-lg" onSubmit={submit}>
      <Field label={t.name} htmlFor="p-name">
        <input id="p-name" className="input" value={d.name} placeholder={t.namePh} onChange={(e) => set({ name: e.target.value })} maxLength={60} required autoFocus />
      </Field>

      <div className="prj-form-grid">
        <Field label={t.craft}>
          <Segmented<Craft>
            value={d.craft}
            onChange={(craft) => set({ craft, toolSizeMm: undefined, toolIds: d.toolIds.filter((id) => (craft === 'crochet') === isHookKind(tools.find((x) => x.id === id)?.kind ?? 'sis-duz')) })}
            label={t.craft}
            options={[
              { value: 'knit', label: tc.knit },
              { value: 'crochet', label: tc.crochet },
            ]}
          />
        </Field>
        <Field label={t.statusLabel} htmlFor="p-status">
          <select id="p-status" className="select" value={d.status} onChange={(e) => set({ status: e.target.value as ProjectStatus })}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t.status[s]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="stack-sm">
        <span className="label">{t.color}</span>
        <ColorPicker value={d.color} onChange={(color) => set({ color })} presets={presets} label={t.color} />
      </div>

      <Field label={d.craft === 'knit' ? t.needleSize : t.hookSize} htmlFor="p-size">
        <select id="p-size" className="select" value={d.toolSizeMm ?? ''} onChange={(e) => set({ toolSizeMm: e.target.value ? Number(e.target.value) : undefined })}>
          <option value="">{t.none}</option>
          {sizes.map((s) => (
            <option key={s.mm} value={s.mm}>
              {mmText(s.mm, lang)}
              {s.us ? ` · US ${localizeUs(s.us, ts.steel, s.steel)}` : ''}
            </option>
          ))}
        </select>
      </Field>

      <fieldset className="prj-fieldset">
        <legend className="label">{t.linkYarns}</legend>
        {yarns.length === 0 ? (
          <p className="hint" style={{ margin: 0 }}>
            {t.stashEmptyYarn}{' '}
            <Link to="/sepet" onClick={onClose}>
              {t.goStash}
            </Link>
          </p>
        ) : (
          <ul className="prj-pick">
            {yarns.map((y) => (
              <li key={y.id}>
                <label className="prj-pick-row">
                  <input type="checkbox" checked={d.yarnIds.includes(y.id)} onChange={() => toggle('yarnIds', y.id)} />
                  <YarnMini yarn={y} />
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <fieldset className="prj-fieldset">
        <legend className="label">{t.linkTools}</legend>
        {craftTools.length === 0 ? (
          <p className="hint" style={{ margin: 0 }}>
            {t.stashEmptyTools}{' '}
            <Link to="/sepet?sekme=aletler" onClick={onClose}>
              {t.goStash}
            </Link>
          </p>
        ) : (
          <ul className="prj-pick">
            {craftTools.map((x) => (
              <li key={x.id}>
                <label className="prj-pick-row">
                  <input type="checkbox" checked={d.toolIds.includes(x.id)} onChange={() => toggle('toolIds', x.id)} />
                  <span className="grow">
                    <span className="prj-pick-title">{toolTitle(x, lang)}</span>
                    <span className="xsmall muted">{[usUkText(x, lang), x.lengthCm ? `${x.lengthCm} cm` : ''].filter(Boolean).join(' · ')}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <div className="modal-footer" style={{ marginTop: 0 }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          {tc.cancel}
        </button>
        <button type="submit" className="btn btn-primary" disabled={!d.name.trim()}>
          {project ? tc.save : tc.create}
        </button>
      </div>
    </form>
  );
}
