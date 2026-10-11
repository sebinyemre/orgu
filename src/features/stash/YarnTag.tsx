/** İp etiketi gibi tasarlanmış ip kartı ve projelerde kullanılan küçük ip satırı. */
import type { CSSProperties, ReactNode } from 'react';
import { Lightbulb, Pencil, Trash2 } from 'lucide-react';
import type { Yarn } from '@/types';
import { YarnBall } from '@/ui/YarnBall';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { fmt, fmtMeters } from '@/lib/format';
import { yarnMetersLeft } from '@/store/stash';
import { PopMenu } from '@/features/counters/PopMenu';
import { STS } from './i18n';
import { CNT } from '@/features/counters/i18n';
import { fiberName, weightShort, yarnTitle } from './labels';
import './stash.css';

interface YarnTagProps {
  yarn: Yarn;
  onEdit: () => void;
  onIdeas: () => void;
  onDelete: () => void;
}

export function YarnTag({ yarn: y, onEdit, onIdeas, onDelete }: YarnTagProps) {
  const t = useMsgs(STS);
  const tc = useMsgs(COMMON);
  const tm = useMsgs(CNT);
  const lang = useLang();
  const left = yarnMetersLeft(y);
  const title = [y.brand, y.name].filter((s) => s.trim());
  return (
    <article className="stash-tag" style={{ '--yarn': y.colorHex } as CSSProperties}>
      <span className="stash-tag-hole" aria-hidden />
      <div
        role="button"
        tabIndex={0}
        className="stash-tag-main"
        onClick={onEdit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit();
          }
        }}
        aria-label={`${tc.edit}: ${yarnTitle(y, lang)}`}
      >
        <div className="stash-tag-top">
          <YarnBall color={y.colorHex} size={64} amount={Math.min(1, 0.35 + y.skeins / 6)} />
          <div className="grow" style={{ minWidth: 0 }}>
            {title.length > 1 && <div className="stash-tag-brand">{y.brand}</div>}
            <div className="stash-tag-name">{title.length > 1 ? y.name : yarnTitle(y, lang)}</div>
            {y.colorName && (
              <div className="stash-tag-color">
                <span className="swatch" style={{ background: y.colorHex, width: 14, height: 14 }} aria-hidden />
                {y.colorName}
              </div>
            )}
          </div>
        </div>
        <div className="stash-tag-perf" aria-hidden />
        <dl className="stash-tag-specs">
          <div>
            <dt>{t.specWeight}</dt>
            <dd>{weightShort(y.weight, lang)}</dd>
          </div>
          <div>
            <dt>{t.specFiber}</dt>
            <dd>{y.fibers.length ? y.fibers.map((f) => fiberName(f, lang)).join(', ') : '·'}</dd>
          </div>
          <div>
            <dt>{t.specSkein}</dt>
            <dd>{t.perSkein(fmt(y.gramsPerSkein, 0), fmtMeters(y.metersPerSkein))}</dd>
          </div>
          <div>
            <dt>{t.specHave}</dt>
            <dd>{t.skeinsN(y.skeins, fmt(y.skeins, 1))}</dd>
          </div>
        </dl>
        <div className="stash-tag-foot">
          <div className="stash-tag-total">
            <b>{fmtMeters(left)}</b> <span>{t.left}</span>
          </div>
          {y.dyeLot && <span className="stash-lot">{t.lot(y.dyeLot)}</span>}
        </div>
      </div>
      <div className="stash-tag-actions">
        <button type="button" className="btn btn-sm stash-ideas-btn" onClick={onIdeas}>
          <Lightbulb />
          {t.ideas}
        </button>
        <PopMenu
          small
          label={tm.more}
          items={[
            { label: tc.edit, icon: <Pencil />, onClick: onEdit },
            { label: t.ideas, icon: <Lightbulb />, onClick: onIdeas },
            'sep',
            { label: tc.delete, icon: <Trash2 />, onClick: onDelete, danger: true },
          ]}
        />
      </div>
    </article>
  );
}

/** Küçük ip satırı (proje malzemeleri, seçiciler) */
export function YarnMini({ yarn: y, right, sub }: { yarn: Yarn; right?: ReactNode; sub?: ReactNode }) {
  const lang = useLang();
  const t = useMsgs(STS);
  return (
    <span className="stash-mini">
      <YarnBall color={y.colorHex} size={40} tail={false} />
      <span className="grow" style={{ minWidth: 0 }}>
        <span className="stash-mini-title">{yarnTitle(y, lang)}</span>
        <span className="xsmall muted stash-mini-sub">{[y.colorName, weightShort(y.weight, lang), `${fmtMeters(yarnMetersLeft(y))} ${t.left}`].filter(Boolean).join(' · ')}</span>
        {sub}
      </span>
      {right}
    </span>
  );
}
