/**
 * Sayaç motoru (saf fonksiyonlar).
 * - Bağlı sayaç: A sayacı her `every` artışta B'yi +1 yapar ve kendini sıfırlar
 *   (ör. "tekrar içi sıra" 8'e gelince "tekrar" sayacı +1).
 * - Hatırlatıcılar: değer `at`'e (veya at + k·every'ye) ulaşınca tetiklenir.
 */
import type { Counter, CounterReminder } from '@/types';
import { uid } from '@/lib/id';

export interface FiredReminder {
  counterId: string;
  counterName: string;
  value: number;
  reminder: CounterReminder;
}

export interface IncrementResult {
  counters: Counter[];
  fired: FiredReminder[];
  /** bağlantı nedeniyle sıfırlanan sayaçlar */
  rolled: string[];
}

const HISTORY_MAX = 500;

export function makeCounter(name: string, partial: Partial<Counter> = {}): Counter {
  return {
    id: uid('sayac'),
    name,
    value: 0,
    style: 'mekanik',
    reminders: [],
    history: [],
    createdAt: Date.now(),
    ...partial,
  };
}

export function reminderMatches(r: CounterReminder, value: number): boolean {
  if (value === r.at) return true;
  if (r.every && r.every > 0 && value > r.at) return (value - r.at) % r.every === 0;
  return false;
}

/** Bir sonraki hatırlatıcı (değerden büyük en küçük tetik noktası) */
export function nextReminder(c: Counter): { at: number; reminder: CounterReminder } | null {
  let best: { at: number; reminder: CounterReminder } | null = null;
  for (const r of c.reminders) {
    let at: number;
    if (c.value < r.at) at = r.at;
    else if (r.every && r.every > 0) at = r.at + (Math.floor((c.value - r.at) / r.every) + 1) * r.every;
    else continue;
    if (!best || at < best.at) best = { at, reminder: r };
  }
  return best;
}

export function incrementCounter(counters: Counter[], id: string, delta = 1, now = Date.now()): IncrementResult {
  const list = counters.map((c) => ({ ...c }));
  const byId = new Map(list.map((c) => [c.id, c]));
  const fired: FiredReminder[] = [];
  const rolled: string[] = [];

  const bump = (cid: string, d: number, depth: number) => {
    const c = byId.get(cid);
    if (!c || depth > 8) return;
    const next = Math.max(0, c.value + d);
    if (next === c.value) return;
    c.value = next;
    if (d > 0) {
      c.history = [...c.history, now].slice(-HISTORY_MAX);
      for (const r of c.reminders) if (reminderMatches(r, next)) fired.push({ counterId: c.id, counterName: c.name, value: next, reminder: r });
      if (c.link && c.link.every > 0 && next >= c.link.every) {
        c.value = 0;
        rolled.push(c.id);
        bump(c.link.toId, 1, depth + 1);
      }
    } else if (d < 0 && c.history.length) {
      c.history = c.history.slice(0, -1);
    }
  };

  bump(id, delta, 0);
  return { counters: list, fired, rolled };
}

/** Son N artışa göre "saatte kaç sıra" hızı */
export function ratePerHour(c: Counter, windowSize = 20): number | null {
  const h = c.history.slice(-windowSize);
  if (h.length < 3) return null;
  const spanMs = h[h.length - 1] - h[0];
  if (spanMs <= 0) return null;
  // aradaki 10 dakikadan uzun molaları çıkar
  let active = 0;
  for (let i = 1; i < h.length; i++) active += Math.min(h[i] - h[i - 1], 10 * 60 * 1000);
  if (active <= 0) return null;
  return ((h.length - 1) / active) * 3600 * 1000;
}
