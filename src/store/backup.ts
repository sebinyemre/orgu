/** Tüm verileri tek JSON olarak yedekle / geri yükle */
import { useCharts } from './charts';
import { useQuickCounters } from './counters';
import { useProjects } from './projects';
import { useSettings } from './settings';
import { useStash } from './stash';

export const BACKUP_VERSION = 1;

export function exportAll() {
  const { yarns, tools } = useStash.getState();
  const { projects } = useProjects.getState();
  const { charts } = useCharts.getState();
  const { counters } = useQuickCounters.getState();
  const { set: _s, reset: _r, ...settings } = useSettings.getState();
  return { app: 'ilmek-ilmek', version: BACKUP_VERSION, exportedAt: new Date().toISOString(), settings, yarns, tools, projects, charts, counters };
}

export function importAll(raw: unknown): { ok: true } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Dosya okunamadı.' };
  const d = raw as Record<string, unknown>;
  if (d.app !== 'ilmek-ilmek') return { ok: false, error: 'Bu bir İlmek İlmek yedeği değil.' };
  try {
    if (Array.isArray(d.yarns) || Array.isArray(d.tools))
      useStash.getState().replaceAll({ yarns: (d.yarns as never[]) ?? [], tools: (d.tools as never[]) ?? [] });
    if (Array.isArray(d.projects)) useProjects.getState().replaceAll(d.projects as never[]);
    if (Array.isArray(d.charts)) useCharts.getState().replaceAll(d.charts as never[]);
    if (Array.isArray(d.counters)) useQuickCounters.getState().replaceAll(d.counters as never[]);
    if (d.settings && typeof d.settings === 'object') useSettings.getState().set(d.settings as never);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
