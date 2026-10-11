/** Tüm verileri tek JSON olarak yedekle / geri yükle */
import { useCharts } from './charts';
import { useQuickCounters } from './counters';
import { useProgress } from './progress';
import { useProjects } from './projects';
import { useSettings } from './settings';
import { useStash } from './stash';

export const BACKUP_VERSION = 2;

/**
 * Doğrudan yerel depodan taşınan diğer kayıtlar: ders ilerlemesi, renk stüdyosu, tarif formu,
 * kareli kağıt tercihleri. Usta paketi kilidi yedeğe girmez (satın alma mağazadan geri yüklenir).
 */
const EXTRA_KEYS = ['ilmek.ilerleme', 'ilmek.renk', 'ilmek.tarif', 'ilmek.kareli.tercihler'] as const;

function readExtra(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of EXTRA_KEYS) {
    try {
      const v = localStorage.getItem(k);
      if (v) out[k] = JSON.parse(v);
    } catch {
      /* okunamayan kaydı atla */
    }
  }
  return out;
}

export function exportAll() {
  const { yarns, tools } = useStash.getState();
  const { projects } = useProjects.getState();
  const { charts } = useCharts.getState();
  const { counters } = useQuickCounters.getState();
  const { set: _s, reset: _r, ...settings } = useSettings.getState();
  return { app: 'ilmek-ilmek', version: BACKUP_VERSION, exportedAt: new Date().toISOString(), settings, yarns, tools, projects, charts, counters, extra: readExtra() };
}

export type ImportError = 'unreadable' | 'notBackup' | 'failed';

export function importAll(raw: unknown): { ok: true } | { ok: false; error: ImportError } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'unreadable' };
  const d = raw as Record<string, unknown>;
  if (d.app !== 'ilmek-ilmek') return { ok: false, error: 'notBackup' };
  try {
    if (Array.isArray(d.yarns) || Array.isArray(d.tools))
      useStash.getState().replaceAll({ yarns: (d.yarns as never[]) ?? [], tools: (d.tools as never[]) ?? [] });
    if (Array.isArray(d.projects)) useProjects.getState().replaceAll(d.projects as never[]);
    if (Array.isArray(d.charts)) useCharts.getState().replaceAll(d.charts as never[]);
    if (Array.isArray(d.counters)) useQuickCounters.getState().replaceAll(d.counters as never[]);
    if (d.settings && typeof d.settings === 'object') useSettings.getState().set(d.settings as never);
    if (d.extra && typeof d.extra === 'object') {
      const extra = d.extra as Record<string, unknown>;
      for (const k of EXTRA_KEYS) if (k in extra) localStorage.setItem(k, JSON.stringify(extra[k]));
      void useProgress.persist.rehydrate();
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'failed' };
  }
}
