/** Projelerim için saf yardımcılar (React'ten bağımsız, test edilir). */
import type { JournalEntry, Project, ProjectStatus, Yarn } from '@/types';

export const STATUSES: ProjectStatus[] = ['fikir', 'sirada', 'oruluyor', 'uykuda', 'bitti'];

/** Washi bant / çip tonu */
export const STATUS_TONE: Record<ProjectStatus, 'plum' | 'mustard' | 'terracotta' | 'denim' | 'sage'> = {
  fikir: 'plum',
  sirada: 'mustard',
  oruluyor: 'terracotta',
  uykuda: 'denim',
  bitti: 'sage',
};

/**
 * Durum değişikliğinin yan etkileri:
 * - "Örülüyor"a geçince başlangıç tarihi yoksa yazılır.
 * - "Bitti"ye geçince bitiş tarihi yazılır, çalışan süre durdurulur.
 * - "Bitti"den çıkınca bitiş tarihi silinir.
 */
export function statusPatch(p: Project, status: ProjectStatus, now = Date.now()): Partial<Project> {
  const patch: Partial<Project> = { status };
  if (status === 'oruluyor' && !p.startedAt) patch.startedAt = now;
  if (status === 'bitti') {
    patch.finishedAt = p.finishedAt ?? now;
    patch.startedAt = p.startedAt ?? now;
    if (p.timerStartedAt) {
      patch.timeSpentSec = p.timeSpentSec + Math.round((now - p.timerStartedAt) / 1000);
      patch.timerStartedAt = undefined;
    }
  } else if (p.status === 'bitti') {
    patch.finishedAt = undefined;
  }
  return patch;
}

/** Saniye → "1:02:03" ya da "2:03" (kronometre görünümü) */
export function clock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

export interface SeriesPoint {
  id: string;
  date: number;
  rows: number;
}

/** Günlükteki sıra ilerlemesi: eskiden yeniye, yalnızca sıra yazılan notlar, en fazla `max` nokta */
export function journalSeries(journal: JournalEntry[], max = 14): SeriesPoint[] {
  return journal
    .filter((j) => (j.rowsDone ?? 0) > 0)
    .map((j) => ({ id: j.id, date: j.date, rows: j.rowsDone! }))
    .sort((a, b) => a.date - b.date)
    .slice(-max);
}

/** Günlük notları yeniden eskiye */
export function sortedJournal(journal: JournalEntry[]): JournalEntry[] {
  return [...journal].sort((a, b) => b.date - a.date);
}

/** Bağlı iplerdeki toplam metre (sepette bulunmayan kimlikler atlanır) */
export function linkedMeters(yarnIds: string[], yarns: Yarn[]): number {
  return yarns.filter((y) => yarnIds.includes(y.id)).reduce((n, y) => n + y.metersPerSkein * y.skeins, 0);
}

/** <input type="date"> değeri (yerel saat) */
export function dateInputValue(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** "2026-10-11" → o günün öğlesi (yerel), saat dilimi kaymalarından korunmak için */
export function parseDateInput(v: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12).getTime();
}

/** Bir projenin ölçü notu. `Project` tipinde henüz alan yok; ileride `gaugeNotes` eklenecek. */
export type ProjectExt = Project & { gaugeNotes?: string };
export const gaugeNotesOf = (p: Project): string => (p as ProjectExt).gaugeNotes ?? '';
