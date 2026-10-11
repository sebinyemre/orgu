import { describe, expect, it } from 'vitest';
import { incrementCounter, makeCounter, nextReminder, reminderMatches } from './counters';

describe('sayaç motoru', () => {
  it('bağlı sayaç her N artışta hedefi +1 yapar ve sıfırlanır', () => {
    const rep = makeCounter('Tekrar');
    const row = makeCounter('Sıra', { link: { toId: rep.id, every: 4 } });
    let list = [row, rep];
    for (let i = 0; i < 9; i++) list = incrementCounter(list, row.id).counters;
    expect(list.find((c) => c.id === row.id)!.value).toBe(1);
    expect(list.find((c) => c.id === rep.id)!.value).toBe(2);
  });

  it('hatırlatıcılar tek seferlik ve tekrarlı tetiklenir', () => {
    const r = { id: 'r', at: 6, every: 6, text: 'Eksilt' };
    expect(reminderMatches(r, 6)).toBe(true);
    expect(reminderMatches(r, 12)).toBe(true);
    expect(reminderMatches(r, 13)).toBe(false);
    const c = makeCounter('Sıra', { value: 7, reminders: [r] });
    expect(nextReminder(c)?.at).toBe(12);
    const res = incrementCounter([{ ...c, value: 11 }], c.id);
    expect(res.fired).toHaveLength(1);
  });

  it('sıfırın altına inmez', () => {
    const c = makeCounter('Sıra');
    expect(incrementCounter([c], c.id, -1).counters[0].value).toBe(0);
  });
});
