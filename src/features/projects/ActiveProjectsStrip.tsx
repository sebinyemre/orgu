/**
 * Ana sayfalar için: örülmekte olan projelerin yatay şeridi ve "devam et" düğmeleri.
 *
 *   <ActiveProjectsStrip />                    // en fazla 6 proje, boşsa küçük bir yönlendirme
 *   <ActiveProjectsStrip limit={3} showEmpty={false} />
 */
import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Play, Plus, Tally5 } from 'lucide-react';
import { YarnBall } from '@/ui/YarnBall';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { fmtDuration } from '@/lib/format';
import { shade } from '@/lib/color';
import { projectProgress, projectSeconds, useProjects } from '@/store/projects';
import { counterDisplayName } from '@/features/counters/counterMath';
import { PRJ } from './i18n';
import { useNow } from './hooks';
import './projects.css';

export interface ActiveProjectsStripProps {
  /** en fazla kaç proje (varsayılan 6) */
  limit?: number;
  /** başlık (varsayılan: "Şişte olanlar") */
  title?: ReactNode;
  /** örülen proje yoksa kısa yönlendirme göster (varsayılan true); false ise hiçbir şey çizilmez */
  showEmpty?: boolean;
  className?: string;
}

export function ActiveProjectsStrip({ limit = 6, title, showEmpty = true, className }: ActiveProjectsStripProps) {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const all = useProjects((s) => s.projects);
  const active = useMemo(
    () =>
      all
        .filter((p) => p.status === 'oruluyor')
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, limit),
    [all, limit],
  );
  const anyRunning = active.some((p) => p.timerStartedAt);
  const now = useNow(anyRunning, 30000);

  if (!active.length && !showEmpty) return null;

  return (
    <section className={`prj-strip ${className ?? ''}`} aria-label={typeof title === 'string' ? title : t.stripTitle}>
      <div className="spread prj-strip-head">
        <h2 className="prj-strip-title">{title ?? t.stripTitle}</h2>
        <Link to="/projeler" className="btn btn-ghost btn-sm">
          {t.allProjects}
          <ArrowRight />
        </Link>
      </div>
      {active.length === 0 ? (
        <div className="prj-strip-empty">
          <YarnBall color="#d39a2c" size={44} />
          <p className="small muted grow" style={{ margin: 0 }}>
            {t.stripEmpty}
          </p>
          <div className="row">
            <Link to="/yarat" className="btn btn-soft btn-sm">
              {tc.navWorks}
            </Link>
            <Link to="/projeler" className="btn btn-ghost btn-sm">
              <Plus />
              {t.newProject}
            </Link>
          </div>
        </div>
      ) : (
        <ul className="prj-strip-list">
          {active.map((p) => {
            const progress = projectProgress(p);
            const main = p.counters[0];
            return (
              <li key={p.id} className="prj-strip-item">
                <Link to={`/projeler/${p.id}`} className="prj-strip-main" aria-label={`${t.open}: ${p.name}`}>
                  <YarnBall color={p.color} size={46} />
                  <span className="grow" style={{ minWidth: 0 }}>
                    <span className="prj-strip-name">{p.name}</span>
                    <span className="prj-strip-meta xsmall muted">
                      {main && (
                        <span>
                          <Tally5 aria-hidden />
                          {t.counterValue(counterDisplayName(main.name, lang), main.value)}
                        </span>
                      )}
                      {(p.timerStartedAt || p.timeSpentSec > 0) && (
                        <span className={p.timerStartedAt ? 'prj-running' : undefined}>
                          <Clock aria-hidden />
                          {fmtDuration(projectSeconds(p, now))}
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
                {p.pattern && (
                  <span className="progress prj-strip-progress" aria-label={t.progress(progress)} role="img">
                    <span style={{ width: `${progress}%`, background: shade(p.color, -0.12) }} />
                  </span>
                )}
                <Link
                  to={`/projeler/${p.id}?sekme=${p.counters.length ? 'sayaclar' : p.pattern ? 'tarif' : 'genel'}`}
                  className="btn btn-primary btn-sm prj-strip-go"
                  onClick={() => useProjects.getState().setActive(p.id)}
                >
                  <Play />
                  {tc.continue}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
