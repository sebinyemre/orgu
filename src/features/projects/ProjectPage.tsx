import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Camera, ClipboardList, Grid3x3, NotebookPen, Pencil, ScrollText, ShoppingBasket, Tally5, Trash2 } from 'lucide-react';
import type { ProjectStatus } from '@/types';
import { EmptyState } from '@/ui/EmptyState';
import { YarnBall } from '@/ui/YarnBall';
import { Tape } from '@/ui/Tape';
import { Tabs } from '@/ui/Tabs';
import { confirmDialog } from '@/ui/Confirm';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { useProjects } from '@/store/projects';
import { deletePhoto } from '@/lib/photos';
import { PopMenu } from '@/features/counters/PopMenu';
import { mmText } from '@/features/stash/labels';
import { PRJ, type ProjectTab } from './i18n';
import { CNT } from '@/features/counters/i18n';
import { STATUSES, STATUS_TONE, statusPatch } from './projectMath';
import { ProjectFormModal } from './ProjectFormModal';
import { TimerButton } from './bits';
import { OverviewTab } from './tabs/OverviewTab';
import { PatternTab } from './tabs/PatternTab';
import { CountersTab } from './tabs/CountersTab';
import { ChartsTab } from './tabs/ChartsTab';
import { MaterialsTab } from './tabs/MaterialsTab';
import { JournalTab } from './tabs/JournalTab';
import { PhotosTab } from './tabs/PhotosTab';
import './projects.css';

const TABS: ProjectTab[] = ['genel', 'tarif', 'sayaclar', 'grafikler', 'malzeme', 'gunluk', 'foto'];
const ICONS: Record<ProjectTab, typeof ClipboardList> = {
  genel: ClipboardList,
  tarif: ScrollText,
  sayaclar: Tally5,
  grafikler: Grid3x3,
  malzeme: ShoppingBasket,
  gunluk: NotebookPen,
  foto: Camera,
};

export default function ProjectPage() {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const tm = useMsgs(CNT);
  const lang = useLang();
  const nav = useNavigate();
  const { projectId } = useParams();
  const project = useProjects((s) => s.projects.find((p) => p.id === projectId));
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState(false);
  const raw = params.get('sekme') as ProjectTab | null;
  const tab: ProjectTab = raw && TABS.includes(raw) ? raw : project?.pattern ? 'tarif' : 'genel';
  const setTab = (v: ProjectTab) => setParams({ sekme: v }, { replace: true });

  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) useProjects.getState().setActive(project.id);
  }, [project?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // telefonda seçili sekme görünür kalsın
  useEffect(() => {
    const bar = tabsRef.current?.querySelector<HTMLElement>('.tabs');
    const sel = bar?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (bar && sel && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = sel.offsetLeft - (bar.clientWidth - sel.offsetWidth) / 2;
  }, [tab, !!project]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!project) {
    return (
      <div className="page">
        <EmptyState
          title={t.notFoundTitle}
          action={
            <Link to="/projeler" className="btn btn-primary">
              <ArrowLeft />
              {tc.navProjects}
            </Link>
          }
        >
          {t.notFoundText}
        </EmptyState>
      </div>
    );
  }
  const p = project;

  const askDelete = async () => {
    if (
      !(await confirmDialog(t.deleteConfirm(p.name), {
        confirmLabel: tc.delete,
        danger: true,
      }))
    )
      return;
    for (const id of p.photoIds) void deletePhoto(id);
    useProjects.getState().remove(p.id);
    nav('/projeler');
  };
  const move = (s: ProjectStatus) => p.status !== s && useProjects.getState().update(p.id, statusPatch(p, s));

  const counts: Partial<Record<ProjectTab, number>> = {
    sayaclar: p.counters.length,
    grafikler: p.chartIds.length,
    malzeme: p.yarnIds.length + p.toolIds.length,
    gunluk: p.journal.length,
    foto: p.photoIds.length,
  };

  return (
    <div className="page prj-detail">
      <Link to="/projeler" className="btn btn-ghost btn-sm prj-back">
        <ArrowLeft />
        {tc.navProjects}
      </Link>

      <header className="prj-hero">
        <YarnBall color={p.color} size={76} className="prj-hero-ball" />
        <div className="grow" style={{ minWidth: 0 }}>
          <Tape tone={STATUS_TONE[p.status]}>{t.status[p.status]}</Tape>
          <h1 className="prj-hero-title">{p.name}</h1>
          <div className="row xsmall muted">
            <span className="chip">{p.craft === 'knit' ? tc.knit : tc.crochet}</span>
            {p.toolSizeMm !== undefined && (
              <span className="chip" data-tone="denim">
                {mmText(p.toolSizeMm, lang)}
              </span>
            )}
          </div>
        </div>
        <div className="prj-hero-actions">
          <TimerButton project={p} />
          <PopMenu
            label={tm.more}
            items={[
              {
                label: t.editProject,
                icon: <Pencil />,
                onClick: () => setEditing(true),
              },
              'sep',
              ...STATUSES.map((s) => ({
                label: `${t.moveTo}: ${t.status[s]}`,
                onClick: () => move(s),
                current: s === p.status,
                disabled: s === p.status,
              })),
              'sep' as const,
              {
                label: tc.delete,
                icon: <Trash2 />,
                onClick: () => void askDelete(),
                danger: true,
              },
            ]}
          />
        </div>
      </header>

      <div ref={tabsRef}>
        <Tabs<ProjectTab>
          value={tab}
          onChange={setTab}
          label={p.name}
          tabs={TABS.map((id) => {
            const Icon = ICONS[id];
            const n = counts[id];
            return {
              id,
              icon: <Icon aria-hidden />,
              label: (
                <>
                  {t.tabs[id]}
                  {n ? <span className="prj-tab-count">{n}</span> : null}
                </>
              ),
            };
          })}
        />
      </div>

      <div className="prj-tab-body" role="tabpanel" aria-label={t.tabs[tab]}>
        {tab === 'genel' && <OverviewTab project={p} />}
        {tab === 'tarif' && <PatternTab project={p} />}
        {tab === 'sayaclar' && <CountersTab project={p} />}
        {tab === 'grafikler' && <ChartsTab project={p} />}
        {tab === 'malzeme' && <MaterialsTab project={p} />}
        {tab === 'gunluk' && <JournalTab project={p} />}
        {tab === 'foto' && <PhotosTab project={p} />}
      </div>

      <ProjectFormModal open={editing} project={p} onClose={() => setEditing(false)} />
    </div>
  );
}
