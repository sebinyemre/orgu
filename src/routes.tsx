import { lazy } from 'react';
import { createHashRouter, type RouteObject } from 'react-router-dom';
import { AppShell } from '@/layout/AppShell';
import { NotFound } from '@/features/NotFound';

const p = <T,>(f: () => Promise<{ default: T }>) => lazy(f as () => Promise<{ default: React.ComponentType }>);

const HomePage = p(() => import('@/features/learn/HomePage'));
const LessonPage = p(() => import('@/features/learn/LessonPage'));
const ProPage = p(() => import('@/features/learn/ProPage'));
const StitchLibraryPage = p(() => import('@/features/library/StitchLibraryPage'));
const StitchPatternPage = p(() => import('@/features/library/StitchPatternPage'));
const GlossaryPage = p(() => import('@/features/library/GlossaryPage'));
const ToolsPage = p(() => import('@/features/tools/ToolsPage'));
const WorksPage = p(() => import('@/features/works/WorksPage'));
const WorkPage = p(() => import('@/features/works/WorkPage'));
const ChartListPage = p(() => import('@/features/chart/ChartListPage'));
const ChartEditorPage = p(() => import('@/features/chart/ChartEditorPage'));
const ChartTrackPage = p(() => import('@/features/chart/ChartTrackPage'));
const CountersPage = p(() => import('@/features/counters/CountersPage'));
const CalculatorsPage = p(() => import('@/features/calculators/CalculatorsPage'));
const RecipePage = p(() => import('@/features/recipe/RecipePage'));
const ProjectsPage = p(() => import('@/features/projects/ProjectsPage'));
const ProjectPage = p(() => import('@/features/projects/ProjectPage'));
const StashPage = p(() => import('@/features/stash/StashPage'));
const ColorStudioPage = p(() => import('@/features/colors/ColorStudioPage'));
const SettingsPage = p(() => import('@/features/settings/SettingsPage'));
const IllustLab = p(() => import('@/features/learn/IllustLab'));

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/ders/:lessonId', element: <LessonPage /> },
      { path: '/pro', element: <ProPage /> },
      { path: '/desenler', element: <StitchLibraryPage /> },
      { path: '/desenler/:patternId', element: <StitchPatternPage /> },
      { path: '/sozluk', element: <GlossaryPage /> },
      { path: '/araclar', element: <ToolsPage /> },
      { path: '/yarat', element: <WorksPage /> },
      { path: '/yarat/:workId', element: <WorkPage /> },
      { path: '/kareli', element: <ChartListPage /> },
      { path: '/kareli/:chartId', element: <ChartEditorPage /> },
      { path: '/kareli/:chartId/takip', element: <ChartTrackPage /> },
      { path: '/sayaclar', element: <CountersPage /> },
      { path: '/hesap', element: <CalculatorsPage /> },
      { path: '/hesap/:calcId', element: <CalculatorsPage /> },
      { path: '/tarif', element: <RecipePage /> },
      { path: '/projeler', element: <ProjectsPage /> },
      { path: '/projeler/:projectId', element: <ProjectPage /> },
      { path: '/sepet', element: <StashPage /> },
      { path: '/renk', element: <ColorStudioPage /> },
      { path: '/renk/:toolId', element: <ColorStudioPage /> },
      { path: '/ayarlar', element: <SettingsPage /> },
      ...(import.meta.env.DEV ? [{ path: '/lab', element: <IllustLab /> }] : []),
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createHashRouter(routes);
