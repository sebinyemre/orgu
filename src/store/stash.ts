import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tool, Yarn } from '@/types';
import { uid } from '@/lib/id';

interface StashState {
  yarns: Yarn[];
  tools: Tool[];
  addYarn: (y: Omit<Yarn, 'id' | 'createdAt'>) => Yarn;
  updateYarn: (id: string, patch: Partial<Yarn>) => void;
  removeYarn: (id: string) => void;
  addTool: (t: Omit<Tool, 'id' | 'createdAt'>) => Tool;
  updateTool: (id: string, patch: Partial<Tool>) => void;
  removeTool: (id: string) => void;
  replaceAll: (data: { yarns: Yarn[]; tools: Tool[] }) => void;
}

export const useStash = create<StashState>()(
  persist(
    (set) => ({
      yarns: [],
      tools: [],
      addYarn: (y) => {
        const yarn: Yarn = { ...y, id: uid('ip'), createdAt: Date.now() };
        set((s) => ({ yarns: [yarn, ...s.yarns] }));
        return yarn;
      },
      updateYarn: (id, patch) => set((s) => ({ yarns: s.yarns.map((y) => (y.id === id ? { ...y, ...patch } : y)) })),
      removeYarn: (id) => set((s) => ({ yarns: s.yarns.filter((y) => y.id !== id) })),
      addTool: (t) => {
        const tool: Tool = { ...t, id: uid('alet'), createdAt: Date.now() };
        set((s) => ({ tools: [...s.tools, tool].sort((a, b) => a.kind.localeCompare(b.kind) || a.sizeMm - b.sizeMm) }));
        return tool;
      },
      updateTool: (id, patch) => set((s) => ({ tools: s.tools.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      removeTool: (id) => set((s) => ({ tools: s.tools.filter((t) => t.id !== id) })),
      replaceAll: (data) => set({ yarns: data.yarns, tools: data.tools }),
    }),
    { name: 'ilmek.sepet', version: 1 },
  ),
);

/** Bir ipin elde kalan toplam metresi */
export function yarnMetersLeft(y: Yarn): number {
  return y.metersPerSkein * y.skeins;
}
