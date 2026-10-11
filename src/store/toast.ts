import { create } from 'zustand';
import { uid } from '@/lib/id';

export interface ToastItem {
  id: string;
  text: string;
  tone?: 'default' | 'success' | 'warn';
  icon?: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (text: string, opts?: Partial<Omit<ToastItem, 'id' | 'text'>> & { ms?: number }) => void;
  dismiss: (id: string) => void;
}

export const useToasts = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (text, opts) => {
    const id = uid('t');
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, text, tone: opts?.tone, icon: opts?.icon }] }));
    setTimeout(() => get().dismiss(id), opts?.ms ?? 2600);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Bileşen dışından kısa bildirim */
export const toast = (text: string, opts?: Parameters<ToastState['push']>[1]) => useToasts.getState().push(text, opts);
