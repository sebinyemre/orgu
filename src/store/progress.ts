/** Ders ilerlemesi: tamamlanan dersler, kalınan adım, günlük seri */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const today = () => new Date().toISOString().slice(0, 10);

interface ProgressState {
  /** ders id → tamamlanma zamanı */
  done: Record<string, number>;
  /** ders id → son görülen adım */
  step: Record<string, number>;
  lastLesson?: string;
  /** çalışılan günler (YYYY-AA-GG) */
  days: string[];
  /** alıştırma sayaçları */
  practice: Record<string, number>;
  visit: (lessonId: string, stepIdx: number) => void;
  complete: (lessonId: string) => void;
  uncomplete: (lessonId: string) => void;
  setPractice: (lessonId: string, n: number) => void;
  reset: () => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      done: {},
      step: {},
      days: [],
      practice: {},
      visit: (id, i) =>
        set((s) => ({
          step: { ...s.step, [id]: i },
          lastLesson: id,
          days: s.days.includes(today()) ? s.days : [...s.days, today()].slice(-400),
        })),
      complete: (id) =>
        set((s) => ({
          done: { ...s.done, [id]: s.done[id] ?? Date.now() },
          lastLesson: id,
          days: s.days.includes(today()) ? s.days : [...s.days, today()].slice(-400),
        })),
      uncomplete: (id) =>
        set((s) => {
          const done = { ...s.done };
          delete done[id];
          return { done };
        }),
      setPractice: (id, n) => set((s) => ({ practice: { ...s.practice, [id]: Math.max(0, n) } })),
      reset: () => set({ done: {}, step: {}, lastLesson: undefined, days: [], practice: {} }),
    }),
    { name: 'ilmek.ilerleme', version: 1 },
  ),
);

/** Bugüne kadar kesintisiz çalışılan gün sayısı */
export function streakOf(days: string[], now = new Date()): number {
  const set = new Set(days);
  let n = 0;
  const d = new Date(now);
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
