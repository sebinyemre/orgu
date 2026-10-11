/** Sayaç geri bildirimi: tık sesi, titreşim, hatırlatıcı bildirimi (ayarlara göre). */
import type { FiredReminder } from '@/engine/counters';
import { clickSound, vibrate } from '@/lib/device';
import { useSettings } from '@/store/settings';
import { toast } from '@/store/toast';
import { counterDisplayName } from './counterMath';
import { CNT } from './i18n';

/**
 * Bir artış/azalışın ardından çağrılır.
 * - +1: tık + kısa titreşim
 * - hatırlatıcı tetiklendiyse: bildirim + zil + çift titreşim
 * - hedefe ulaşıldıysa (reachedName verilirse): bildirim + zil
 */
export function counterFeedback(delta: number, fired: FiredReminder[] = [], reachedName?: string): void {
  const s = useSettings.getState();
  const lang = s.lang;
  if (fired.length) {
    for (const f of fired) toast(`${counterDisplayName(f.counterName, lang)} ${f.value}: ${f.reminder.text}`, { tone: 'warn', ms: 4200 });
    if (s.counterSound) clickSound('ding');
    if (s.counterVibrate) vibrate([40, 60, 40]);
    return;
  }
  if (reachedName) {
    toast(CNT[lang].targetReached(reachedName), { tone: 'success', ms: 3200 });
    if (s.counterSound) clickSound('ding');
    if (s.counterVibrate) vibrate([30, 40, 30]);
    return;
  }
  if (delta > 0) {
    if (s.counterSound) clickSound('tick');
    if (s.counterVibrate) vibrate(12);
  } else if (delta < 0) {
    if (s.counterSound) clickSound('tock');
    if (s.counterVibrate) vibrate(8);
  }
}
