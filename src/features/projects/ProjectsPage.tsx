import { useMemo, useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { NotebookPen, Plus, Scissors } from 'lucide-react';
import type { Project, ProjectStatus } from '@/types';
import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { Segmented } from '@/ui/Segmented';
import { Tape } from '@/ui/Tape';
import { confirmDialog } from '@/ui/Confirm';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { projectSeconds, useProjects } from '@/store/projects';
import { deletePhoto } from '@/lib/photos';
import { fmtDuration } from '@/lib/format';
import { PRJ } from './i18n';
import { STATUSES, STATUS_TONE, statusPatch } from './projectMath';
import { ProjectCard } from './ProjectCard';
import { ProjectFormModal } from './ProjectFormModal';
import { useMedia } from './hooks';
import './projects.css';

export default function ProjectsPage() {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const projects = useProjects((s) => s.projects);
  const update = useProjects((s) => s.update);
  const remove = useProjects((s) => s.remove);
  const desktop = useMedia('(min-width: 960px)');
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [creating, setCreating] = useState<{ status?: ProjectStatus } | null>(null);
  const [over, setOver] = useState<ProjectStatus>();

  const byStatus = useMemo(() => {
    const m = Object.fromEntries(STATUSES.map((s) => [s, [] as Project[]])) as Record<ProjectStatus, Project[]>;
    for (const p of [...projects].sort((a, b) => b.updatedAt - a.updatedAt)) m[p.status].push(p);
    return m;
  }, [projects]);
  const totalSec = projects.reduce((n, p) => n + projectSeconds(p), 0);

  const move = (p: Project, status: ProjectStatus) => {
    if (p.status !== status) update(p.id, statusPatch(p, status));
  };
  const askDelete = async (p: Project) => {
    if (!(await confirmDialog(t.deleteConfirm(p.name), { confirmLabel: tc.delete, danger: true }))) return;
    for (const id of p.photoIds) void deletePhoto(id);
    remove(p.id);
  };
  const onDrop = (e: DragEvent, status: ProjectStatus) => {
    e.preventDefault();
    setOver(undefined);
    const id = e.dataTransfer.getData('text/plain');
    const p = useProjects.getState().projects.find((x) => x.id === id);
    if (p) move(p, status);
  };

  const card = (p: Project, showStatus = false) => <ProjectCard key={p.id} project={p} draggable={desktop} showStatus={showStatus} onMove={(s) => move(p, s)} onDelete={() => void askDelete(p)} />;

  const list = filter === 'all' ? STATUSES.flatMap((s) => byStatus[s]) : byStatus[filter];

  return (
    <div className="page page-wide prj-page">
      <PageHeader
        eyebrow={t.eyebrow}
        title={tc.navProjects}
        lede={t.lede}
        actions={
          <button className="btn btn-primary" onClick={() => setCreating({})}>
            <Plus />
            {t.newProject}
          </button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title={t.emptyTitle}
          color="#b5523b"
          action={
            <div className="row" style={{ justifyContent: 'center' }}>
              <Link to="/yarat" className="btn btn-soft">
                <Scissors />
                {tc.navWorks}
              </Link>
              <Link to="/tarif" className="btn btn-soft">
                <NotebookPen />
                {tc.navRecipe}
              </Link>
              <button className="btn btn-primary" onClick={() => setCreating({})}>
                <Plus />
                {t.newProject}
              </button>
            </div>
          }
        >
          {t.emptyText}
        </EmptyState>
      ) : (
        <>
          <div className="prj-stats">
            <div className="stat">
              <span className="stat-value">{byStatus.oruluyor.length}</span>
              <span className="stat-label">{t.statActive}</span>
            </div>
            <div className="stat">
              <span className="stat-value">{byStatus.bitti.length}</span>
              <span className="stat-label">{t.statDone}</span>
            </div>
            <div className="stat">
              <span className="stat-value">{fmtDuration(totalSec)}</span>
              <span className="stat-label">{t.statTime}</span>
            </div>
          </div>

          {desktop ? (
            <div className="prj-board">
              {STATUSES.map((s) => (
                <section
                  key={s}
                  className="prj-col"
                  data-over={over === s || undefined}
                  aria-label={t.status[s]}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (over !== s) setOver(s);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(undefined);
                  }}
                  onDrop={(e) => onDrop(e, s)}
                >
                  <header className="prj-col-head">
                    <Tape tone={STATUS_TONE[s]}>{t.status[s]}</Tape>
                    <span className="chip">{byStatus[s].length}</span>
                  </header>
                  <div className="prj-col-list">
                    {byStatus[s].map((p) => card(p))}
                    {byStatus[s].length === 0 && <p className="prj-col-empty">{over === s ? t.dropHere : t.statusEmpty[s]}</p>}
                    <button type="button" className="btn btn-ghost btn-sm prj-col-add" onClick={() => setCreating({ status: s })} aria-label={`${t.newProject}: ${t.status[s]}`}>
                      <Plus />
                      {t.newProject}
                    </button>
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="stack">
              <Segmented<ProjectStatus | 'all'>
                value={filter}
                onChange={setFilter}
                label={t.statusLabel}
                className="prj-filter"
                options={[{ value: 'all' as const, label: `${t.all} ${projects.length}` }, ...STATUSES.map((s) => ({ value: s, label: `${t.status[s]} ${byStatus[s].length}` }))]}
              />
              {list.length === 0 ? <p className="prj-col-empty">{filter !== 'all' && t.statusEmpty[filter]}</p> : <div className="prj-list">{list.map((p) => card(p, filter === 'all'))}</div>}
            </div>
          )}
        </>
      )}

      <ProjectFormModal open={!!creating} initialStatus={creating?.status} onClose={() => setCreating(null)} />
    </div>
  );
}
