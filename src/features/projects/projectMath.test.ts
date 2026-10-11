import { describe, expect, it } from 'vitest';
import type { Project, Yarn } from '@/types';
import { clock, dateInputValue, journalSeries, linkedMeters, parseDateInput, sortedJournal, statusPatch } from './projectMath';

const base = (extra: Partial<Project> = {}): Project => ({
  id: 'p',
  name: 'Atkı',
  craft: 'knit',
  status: 'sirada',
  color: '#b5523b',
  toolIds: [],
  yarnIds: [],
  chartIds: [],
  counters: [],
  notes: '',
  journal: [],
  photoIds: [],
  doneSteps: [],
  timeSpentSec: 0,
  createdAt: 0,
  updatedAt: 0,
  ...extra,
});

describe('durum değişikliği', () => {
  it('örülüyor: başlangıç tarihi yazılır, varsa korunur', () => {
    expect(statusPatch(base(), 'oruluyor', 1000)).toEqual({ status: 'oruluyor', startedAt: 1000 });
    expect(statusPatch(base({ startedAt: 5 }), 'oruluyor', 1000)).toEqual({ status: 'oruluyor' });
  });
  it('bitti: bitiş tarihi ve çalışan süre durur', () => {
    const p = base({ status: 'oruluyor', startedAt: 10, timeSpentSec: 60, timerStartedAt: 1000 });
    const patch = statusPatch(p, 'bitti', 61000);
    expect(patch.finishedAt).toBe(61000);
    expect(patch.timeSpentSec).toBe(120);
    expect('timerStartedAt' in patch && patch.timerStartedAt).toBeUndefined();
  });
  it('bitti durumundan çıkınca bitiş tarihi silinir', () => {
    const patch = statusPatch(base({ status: 'bitti', finishedAt: 5 }), 'uykuda');
    expect('finishedAt' in patch).toBe(true);
    expect(patch.finishedAt).toBeUndefined();
  });
});

describe('yardımcılar', () => {
  it('kronometre biçimi', () => {
    expect(clock(0)).toBe('0:00');
    expect(clock(75)).toBe('1:15');
    expect(clock(3723)).toBe('1:02:03');
  });
  it('günlük serisi eskiden yeniye ve yalnızca sıralı notlar', () => {
    const j = [
      { id: 'a', date: 30, text: '', rowsDone: 5 },
      { id: 'b', date: 10, text: '', rowsDone: 8 },
      { id: 'c', date: 20, text: '' },
    ];
    expect(journalSeries(j).map((p) => p.id)).toEqual(['b', 'a']);
    expect(sortedJournal(j).map((p) => p.id)).toEqual(['a', 'c', 'b']);
    expect(
      journalSeries(
        Array.from({ length: 20 }, (_, i) => ({ id: String(i), date: i, text: '', rowsDone: 1 })),
        14,
      ),
    ).toHaveLength(14);
  });
  it('bağlı ip metrajı', () => {
    const y = (id: string, m: number, s: number) => ({ id, metersPerSkein: m, skeins: s }) as Yarn;
    expect(linkedMeters(['a', 'x'], [y('a', 200, 2), y('b', 100, 1)])).toBe(400);
  });
  it('tarih girişi gidiş-dönüş', () => {
    const ts = parseDateInput('2026-03-05')!;
    expect(dateInputValue(ts)).toBe('2026-03-05');
    expect(parseDateInput('kötü')).toBeNull();
  });
});
