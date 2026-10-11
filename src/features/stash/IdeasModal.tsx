/** "Bu iple ne örerim?": kalınlık ve eldeki metraja göre şablon önerileri, tarif hazırlayıcıya geçiş. */
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CircleAlert, CircleMinus } from 'lucide-react';
import type { Yarn } from '@/types';
import { Modal } from '@/ui/Modal';
import { YarnBall } from '@/ui/YarnBall';
import { Callout } from '@/ui/Callout';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { fmt, fmtLength, fmtMeters } from '@/lib/format';
import { yarnMetersLeft } from '@/store/stash';
import { useSettings } from '@/store/settings';
import { STS } from './i18n';
import { ideaHref, yarnIdeas, type Dims, type YarnIdea } from './ideas';
import { weightShort, yarnTitle } from './labels';
import './stash.css';

function dimsText(d: Dims, units: 'cm' | 'in', lang: ReturnType<typeof useLang>): string {
  const digits = units === 'in' ? 1 : 0;
  const u = (cm: number) => fmt(units === 'in' ? cm / 2.54 : cm, digits, lang);
  const full = (cm: number) => fmtLength(cm, units, digits, lang);
  if (d.kind === 'round') return `ø ${full(d.d)}`;
  if (d.kind === 'tube') return `${u(d.circ)} × ${full(d.h)}`;
  return `${u(d.w)} × ${full(d.h)}`;
}

export function IdeasModal({ yarn, onClose }: { yarn: Yarn | undefined; onClose: () => void }) {
  const t = useMsgs(STS);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const units = useSettings((s) => s.units);
  if (!yarn) return null;
  const have = yarnMetersLeft(yarn);
  const ideas = yarnIdeas(yarn.weight, have);

  const fitChip = (i: YarnIdea) => {
    if (i.fit === 'ok')
      return (
        <span className="chip" data-tone="success">
          <Check />
          {t.fitOk}
        </span>
      );
    if (i.fit === 'tight')
      return (
        <span className="chip" data-tone="mustard">
          <CircleAlert />
          {t.fitTight}
        </span>
      );
    const missing = i.meters - have;
    return (
      <span className="chip" data-tone="danger">
        <CircleMinus />
        {t.fitShort(fmtMeters(missing))}
      </span>
    );
  };

  return (
    <Modal open onClose={onClose} title={t.ideas} wide>
      <div className="stack">
        <div className="stash-mini" style={{ padding: 0 }}>
          <YarnBall color={yarn.colorHex} size={48} />
          <div className="grow">
            <div className="stash-mini-title">{yarnTitle(yarn, lang)}</div>
            <div className="xsmall muted">{[yarn.colorName, weightShort(yarn.weight, lang), fmtMeters(have)].filter(Boolean).join(' · ')}</div>
          </div>
        </div>
        <p className="small muted" style={{ margin: 0 }}>
          {t.ideasLede(fmtMeters(have))}
        </p>
        {ideas.length === 0 ? (
          <Callout tone="info">{t.noIdeas}</Callout>
        ) : (
          <ul className="stash-ideas">
            {ideas.map((i) => {
              const ratio = Math.min(1, have > 0 ? i.meters / have : 1);
              const label = i.size.label ? i.size.label[lang] : t.squareSize;
              const short = i.fit === 'short' && yarn.metersPerSkein > 0 ? Math.ceil(((i.meters - have) / yarn.metersPerSkein) * 2) / 2 : 0;
              return (
                <li key={i.templateId} className="stash-idea" data-fit={i.fit}>
                  <div className="spread" style={{ alignItems: 'flex-start' }}>
                    <div style={{ minWidth: 0 }}>
                      <div className="stash-idea-name">{t.templates[i.templateId]}</div>
                      <div className="xsmall muted">
                        {label} · {dimsText(i.size.dims, units, lang)} · {i.craft === 'knit' ? tc.knit : tc.crochet}
                      </div>
                    </div>
                    {fitChip(i)}
                  </div>
                  <div className="stash-idea-bar" aria-hidden>
                    <span style={{ width: `${ratio * 100}%` }} />
                  </div>
                  <div className="spread xsmall">
                    <span className="muted">
                      {t.need(fmtMeters(i.meters))}
                      {i.pieces !== undefined && i.pieces > 1 && <b> · {t.pieces(i.pieces)}</b>}
                      {short > 0 && <span> · {t.moreSkeins(short, fmt(short, 1))}</span>}
                    </span>
                    <Link to={ideaHref(yarn.id, i.templateId)} className="btn btn-ghost btn-sm" onClick={onClose}>
                      {t.makeIt}
                      <ArrowRight />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
