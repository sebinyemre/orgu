import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import type { Project } from '@/types';
import { Modal } from '@/ui/Modal';
import { Callout } from '@/ui/Callout';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { fmtMeters } from '@/lib/format';
import { useProjects } from '@/store/projects';
import { useStash } from '@/store/stash';
import { YarnMini } from '@/features/stash/YarnTag';
import { materialShort, mmText, toolTitle, usUkText } from '@/features/stash/labels';
import { isHookKind } from '@/features/stash/stashMath';
import { PRJ } from '../i18n';
import { linkedMeters } from '../projectMath';

type Kind = 'yarn' | 'tool';

export function MaterialsTab({ project: p }: { project: Project }) {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const yarns = useStash((s) => s.yarns);
  const tools = useStash((s) => s.tools);
  const update = useProjects((s) => s.update);
  const [picking, setPicking] = useState<Kind | null>(null);
  const [chosen, setChosen] = useState<string[]>([]);
  // Modal'a kararlı kapatma işlevi verilmeli; yoksa her seçimde odak ilk kutuya döner
  const closePicker = useCallback(() => setPicking(null), []);

  const linkedYarns = yarns.filter((y) => p.yarnIds.includes(y.id));
  const linkedTools = tools.filter((x) => p.toolIds.includes(x.id));
  const freeYarns = yarns.filter((y) => !p.yarnIds.includes(y.id));
  const freeTools = tools
    .filter((x) => !p.toolIds.includes(x.id))
    .sort((a, b) => Number(isHookKind(a.kind) !== (p.craft === 'crochet')) - Number(isHookKind(b.kind) !== (p.craft === 'crochet')) || a.sizeMm - b.sizeMm);
  const have = linkedMeters(p.yarnIds, yarns);
  const need = p.pattern?.yarnMeters ?? 0;

  const open = (k: Kind) => {
    setChosen([]);
    setPicking(k);
  };
  const confirm = () => {
    if (picking === 'yarn') update(p.id, { yarnIds: [...p.yarnIds, ...chosen] });
    if (picking === 'tool') update(p.id, { toolIds: [...p.toolIds, ...chosen] });
    setPicking(null);
  };
  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <div className="prj-materials">
      <section className="stack">
        <div className="spread">
          <h3 className="prj-box-title">{t.yarnsTitle}</h3>
          <button type="button" className="btn btn-soft btn-sm" onClick={() => open('yarn')}>
            <Plus />
            {t.addFromStash}
          </button>
        </div>
        {need > 0 && linkedYarns.length > 0 && (
          <Callout tone={have >= need ? 'tip' : 'warn'}>
            <p className="small">
              {t.yarnNeed(fmtMeters(need), fmtMeters(have))} {have >= need ? t.yarnEnough : t.yarnShort(fmtMeters(need - have))}
            </p>
          </Callout>
        )}
        {linkedYarns.length === 0 ? (
          <p className="prj-none">{t.noLinkedYarns}</p>
        ) : (
          <ul className="prj-mat-list">
            {linkedYarns.map((y) => (
              <li key={y.id} className="prj-mat-row">
                <YarnMini
                  yarn={y}
                  right={
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => update(p.id, { yarnIds: p.yarnIds.filter((x) => x !== y.id) })}
                      aria-label={t.removeFromProject}
                      title={t.removeFromProject}
                    >
                      <X />
                    </button>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="stack">
        <div className="spread">
          <h3 className="prj-box-title">{t.toolsTitle}</h3>
          <button type="button" className="btn btn-soft btn-sm" onClick={() => open('tool')}>
            <Plus />
            {t.addFromStash}
          </button>
        </div>
        {p.toolSizeMm !== undefined && (
          <span className="chip" data-tone="denim" style={{ alignSelf: 'flex-start' }}>
            {t.projectTool(`${p.craft === 'knit' ? tc.knit : tc.crochet} ${mmText(p.toolSizeMm, lang)}`)}
          </span>
        )}
        {linkedTools.length === 0 ? (
          <p className="prj-none">{t.noLinkedTools}</p>
        ) : (
          <ul className="prj-mat-list">
            {linkedTools.map((x) => (
              <li key={x.id} className="prj-mat-row">
                <span className="prj-tool-mm" aria-hidden>
                  {mmText(x.sizeMm, lang).replace(' mm', '')}
                </span>
                <span className="grow" style={{ minWidth: 0 }}>
                  <span className="prj-pick-title">{toolTitle(x, lang)}</span>
                  <span className="xsmall muted">{[usUkText(x, lang), x.lengthCm ? `${x.lengthCm} cm` : '', x.material ? materialShort(x.material, lang) : ''].filter(Boolean).join(' · ')}</span>
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={() => update(p.id, { toolIds: p.toolIds.filter((id) => id !== x.id) })}
                  aria-label={t.removeFromProject}
                  title={t.removeFromProject}
                >
                  <X />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={!!picking}
        onClose={closePicker}
        title={picking === 'tool' ? t.pickTools : t.pickYarns}
        footer={
          <>
            <Link to={picking === 'tool' ? '/sepet?sekme=aletler' : '/sepet'} className="btn btn-ghost" style={{ marginRight: 'auto' }}>
              {t.goStash}
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => setPicking(null)}>
              {tc.cancel}
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm} disabled={chosen.length === 0}>
              {tc.add}
            </button>
          </>
        }
      >
        {(picking === 'yarn' ? freeYarns : freeTools).length === 0 ? (
          <p className="muted">{(picking === 'yarn' ? yarns : tools).length === 0 ? (picking === 'yarn' ? t.stashEmptyYarn : t.stashEmptyTools) : t.allLinked}</p>
        ) : (
          <ul className="prj-pick">
            {picking === 'yarn'
              ? freeYarns.map((y) => (
                  <li key={y.id}>
                    <label className="prj-pick-row">
                      <input type="checkbox" checked={chosen.includes(y.id)} onChange={() => toggle(y.id)} />
                      <YarnMini yarn={y} />
                    </label>
                  </li>
                ))
              : freeTools.map((x) => (
                  <li key={x.id}>
                    <label className="prj-pick-row">
                      <input type="checkbox" checked={chosen.includes(x.id)} onChange={() => toggle(x.id)} />
                      <span className="grow">
                        <span className="prj-pick-title">{toolTitle(x, lang)}</span>
                        <span className="xsmall muted">{[usUkText(x, lang), x.lengthCm ? `${x.lengthCm} cm` : ''].filter(Boolean).join(' · ')}</span>
                      </span>
                    </label>
                  </li>
                ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
