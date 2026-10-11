/** Projeye bağlı olmayan "hızlı sayaçlar" (Sayaçlar sayfası ve ana sayfa) */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Counter } from '@/types';
import { incrementCounter, makeCounter, type FiredReminder } from '@/engine/counters';
import { defaultCounterName } from './counterNames';

interface QuickCountersState {
  counters: Counter[];
  add: (c?: Partial<Counter> & { name: string }) => Counter;
  update: (id: string, patch: Partial<Counter>) => void;
  remove: (id: string) => void;
  increment: (id: string, delta?: number) => FiredReminder[];
  reorder: (ids: string[]) => void;
  replaceAll: (counters: Counter[]) => void;
}

export const useQuickCounters = create<QuickCountersState>()(
  persist(
    (set) => ({
      counters: [makeCounter(defaultCounterName('rowCounter'))],
      add: (c) => {
        const counter = makeCounter(c?.name ?? defaultCounterName('counter'), c);
        set((s) => ({ counters: [...s.counters, counter] }));
        return counter;
      },
      update: (id, patch) => set((s) => ({ counters: s.counters.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      remove: (id) =>
        set((s) => ({
          counters: s.counters.filter((c) => c.id !== id).map((c) => (c.link?.toId === id ? { ...c, link: undefined } : c)),
        })),
      increment: (id, delta = 1) => {
        let fired: FiredReminder[] = [];
        set((s) => {
          const res = incrementCounter(s.counters, id, delta);
          fired = res.fired;
          return { counters: res.counters };
        });
        return fired;
      },
      reorder: (ids) => set((s) => ({ counters: ids.map((id) => s.counters.find((c) => c.id === id)!).filter(Boolean) })),
      replaceAll: (counters) => set({ counters }),
    }),
    { name: 'ilmek.sayaclar', version: 1 },
  ),
);
