import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Counter, GeneratedPattern, JournalEntry, Project } from '@/types';
import { uid } from '@/lib/id';
import { incrementCounter, makeCounter, type FiredReminder } from '@/engine/counters';

export type NewProject = Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>> & Pick<Project, 'name' | 'craft'>;

interface ProjectsState {
  projects: Project[];
  /** en son açılan/çalışılan proje */
  activeId?: string;
  create: (p: NewProject) => Project;
  /** sihirbaz tarifinden proje oluşturur (sıra sayacı ve tekrar sayacı hazır gelir) */
  createFromPattern: (pattern: GeneratedPattern, extra?: Partial<Project>) => Project;
  update: (id: string, patch: Partial<Project>) => void;
  remove: (id: string) => void;
  setActive: (id: string | undefined) => void;
  toggleStep: (id: string, stepId: string) => void;
  // sayaçlar
  addCounter: (id: string, counter?: Partial<Counter> & { name: string }) => Counter;
  updateCounter: (id: string, counterId: string, patch: Partial<Counter>) => void;
  removeCounter: (id: string, counterId: string) => void;
  increment: (id: string, counterId: string, delta?: number) => FiredReminder[];
  // günlük
  addJournal: (id: string, entry: Omit<JournalEntry, 'id'>) => void;
  removeJournal: (id: string, entryId: string) => void;
  // kronometre
  startTimer: (id: string) => void;
  stopTimer: (id: string) => void;
  replaceAll: (projects: Project[]) => void;
}

const touch = (p: Project): Project => ({ ...p, updatedAt: Date.now() });

export const PROJECT_COLORS = ['#b5523b', '#d39a2c', '#5f7a61', '#7d4e6d', '#46698a', '#c47f7f', '#2a9d8f', '#8b6f4e'];

export const useProjects = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeId: undefined,

      create: (p) => {
        const now = Date.now();
        const project: Project = {
          status: 'sirada',
          color: PROJECT_COLORS[get().projects.length % PROJECT_COLORS.length],
          toolIds: [],
          yarnIds: [],
          chartIds: [],
          counters: [makeCounter('Sıra')],
          notes: '',
          journal: [],
          photoIds: [],
          doneSteps: [],
          timeSpentSec: 0,
          ...p,
          id: uid('proje'),
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ projects: [project, ...s.projects], activeId: project.id }));
        return project;
      },

      createFromPattern: (pattern, extra) => {
        const row = makeCounter(pattern.craft === 'crochet' ? 'Tur / Sıra' : 'Sıra');
        const st = makeCounter('İlmek', { style: 'centik' });
        return get().create({
          name: pattern.title,
          craft: pattern.craft,
          pattern,
          gauge: pattern.gauge,
          counters: [row, st],
          status: 'sirada',
          ...extra,
        });
      },

      update: (id, patch) => set((s) => ({ projects: s.projects.map((p) => (p.id === id ? touch({ ...p, ...patch }) : p)) })),

      remove: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id), activeId: s.activeId === id ? undefined : s.activeId })),

      setActive: (id) => set({ activeId: id }),

      toggleStep: (id, stepId) =>
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== id) return p;
            const done = p.doneSteps.includes(stepId) ? p.doneSteps.filter((x) => x !== stepId) : [...p.doneSteps, stepId];
            return touch({ ...p, doneSteps: done, status: p.status === 'sirada' || p.status === 'fikir' ? 'oruluyor' : p.status, startedAt: p.startedAt ?? Date.now() });
          }),
        })),

      addCounter: (id, counter) => {
        const c = makeCounter(counter?.name ?? 'Sayaç', counter);
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? touch({ ...p, counters: [...p.counters, c] }) : p)) }));
        return c;
      },

      updateCounter: (id, counterId, patch) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? touch({ ...p, counters: p.counters.map((c) => (c.id === counterId ? { ...c, ...patch } : c)) }) : p)),
        })),

      removeCounter: (id, counterId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? touch({
                  ...p,
                  counters: p.counters
                    .filter((c) => c.id !== counterId)
                    .map((c) => (c.link?.toId === counterId ? { ...c, link: undefined } : c)),
                })
              : p,
          ),
        })),

      increment: (id, counterId, delta = 1) => {
        let fired: FiredReminder[] = [];
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== id) return p;
            const res = incrementCounter(p.counters, counterId, delta);
            fired = res.fired;
            return touch({
              ...p,
              counters: res.counters,
              status: delta > 0 && (p.status === 'sirada' || p.status === 'fikir') ? 'oruluyor' : p.status,
              startedAt: p.startedAt ?? (delta > 0 ? Date.now() : undefined),
            });
          }),
          activeId: id,
        }));
        return fired;
      },

      addJournal: (id, entry) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? touch({ ...p, journal: [{ ...entry, id: uid('not') }, ...p.journal] }) : p)),
        })),

      removeJournal: (id, entryId) =>
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? touch({ ...p, journal: p.journal.filter((j) => j.id !== entryId) }) : p)) })),

      startTimer: (id) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id && !p.timerStartedAt ? touch({ ...p, timerStartedAt: Date.now() }) : p)),
          activeId: id,
        })),

      stopTimer: (id) =>
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== id || !p.timerStartedAt) return p;
            const add = Math.round((Date.now() - p.timerStartedAt) / 1000);
            return touch({ ...p, timerStartedAt: undefined, timeSpentSec: p.timeSpentSec + add });
          }),
        })),

      replaceAll: (projects) => set({ projects }),
    }),
    { name: 'ilmek.projeler', version: 1 },
  ),
);

/** Kronometre çalışıyorsa anlık süre dahil toplam saniye */
export function projectSeconds(p: Project, now = Date.now()): number {
  return p.timeSpentSec + (p.timerStartedAt ? Math.round((now - p.timerStartedAt) / 1000) : 0);
}

/** Tarif adımlarına göre ilerleme yüzdesi (0–100) */
export function projectProgress(p: Project): number {
  if (p.status === 'bitti') return 100;
  const total = p.pattern?.sections.reduce((n, s) => n + s.steps.length, 0) ?? 0;
  if (!total) return 0;
  return Math.round((p.doneSteps.length / total) * 100);
}
