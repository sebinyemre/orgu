import type { DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { Clock, History, Tally5, Trash2 } from 'lucide-react';
import type { Project, ProjectStatus } from '@/types';
import { YarnBall } from '@/ui/YarnBall';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { fmtDuration, timeAgo } from '@/lib/format';
import { shade } from '@/lib/color';
import { projectProgress, projectSeconds } from '@/store/projects';
import { PopMenu } from '@/features/counters/PopMenu';
import { counterDisplayName } from '@/features/counters/counterMath';
import { PRJ } from './i18n';
import { CNT } from '@/features/counters/i18n';
import { STATUSES, STATUS_TONE } from './projectMath';
import { useNow, usePhoto } from './hooks';
import './projects.css';

export function PhotoImg({ id, alt, className }: { id: string; alt: string; className?: string }) {
  const src = usePhoto(id);
  return src ? <img src={src} alt={alt} className={className} loading="lazy" decoding="async" /> : <span className={`prj-photo-ph ${className ?? ''}`} aria-hidden />;
}

interface Props {
  project: Project;
  onMove: (status: ProjectStatus) => void;
  onDelete: () => void;
  /** durum etiketini göster (karışık listelerde) */
  showStatus?: boolean;
  draggable?: boolean;
}

export function ProjectCard({ project: p, onMove, onDelete, showStatus, draggable }: Props) {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const tm = useMsgs(CNT);
  const lang = useLang();
  const running = !!p.timerStartedAt;
  const now = useNow(running, 30000);
  const progress = projectProgress(p);
  const main = p.counters[0];
  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('text/plain', p.id);
    e.dataTransfer.effectAllowed = 'move';
  };
  return (
    <article className="prj-card" data-status={p.status} draggable={draggable} onDragStart={draggable ? onDragStart : undefined}>
      <Link to={`/projeler/${p.id}`} className="prj-card-link" draggable={false}>
        {p.photoIds[0] && (
          <span className="prj-card-photo">
            <PhotoImg id={p.photoIds[0]} alt="" />
          </span>
        )}
        <span className="prj-card-body">
          <span className="prj-card-head">
            <YarnBall color={p.color} size={30} />
            <span className="xsmall muted prj-card-sub">
              {p.craft === 'knit' ? tc.knit : tc.crochet}
              {showStatus && (
                <span className="chip" data-tone={STATUS_TONE[p.status]}>
                  {t.status[p.status]}
                </span>
              )}
            </span>
          </span>
          <span className="prj-card-name">{p.name}</span>
          {(p.pattern || p.status === 'bitti') && (
            <span className="prj-card-progress">
              <span className="progress" aria-hidden>
                <span style={{ width: `${progress}%`, background: shade(p.color, -0.12) }} />
              </span>
              <span className="xsmall tabular">{t.progress(progress)}</span>
            </span>
          )}
          <span className="prj-card-meta xsmall">
            {(running || p.timeSpentSec > 0) && (
              <span className={running ? 'prj-running' : undefined}>
                <Clock aria-hidden />
                {fmtDuration(projectSeconds(p, now))}
              </span>
            )}
            {main && main.value > 0 && (
              <span>
                <Tally5 aria-hidden />
                {t.counterValue(counterDisplayName(main.name, lang), main.value)}
              </span>
            )}
            <span>
              <History aria-hidden />
              {timeAgo(p.updatedAt)}
            </span>
          </span>
        </span>
      </Link>
      <PopMenu
        small
        className="prj-card-menu"
        label={tm.more}
        items={[
          ...STATUSES.map((s) => ({ label: `${t.moveTo}: ${t.status[s]}`, onClick: () => onMove(s), current: s === p.status, disabled: s === p.status })),
          'sep' as const,
          { label: tc.delete, icon: <Trash2 />, onClick: onDelete, danger: true },
        ]}
      />
    </article>
  );
}
