/** Cihaz özellikleri: ekranı açık tutma, titreşim, tık sesi */

type WakeLockSentinelLike = { release: () => Promise<void>; released?: boolean };

let sentinel: WakeLockSentinelLike | null = null;
let wanted = false;

async function acquire() {
  try {
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<WakeLockSentinelLike> } };
    if (!nav.wakeLock || document.visibilityState !== 'visible') return;
    sentinel = await nav.wakeLock.request('screen');
  } catch {
    sentinel = null;
  }
}

function onVisibility() {
  if (wanted && document.visibilityState === 'visible') void acquire();
}

/** Ekranın kararmasını engeller (örerken telefon kapanmasın). */
export async function keepScreenOn(on: boolean): Promise<void> {
  wanted = on;
  if (on) {
    document.addEventListener('visibilitychange', onVisibility);
    await acquire();
  } else {
    document.removeEventListener('visibilitychange', onVisibility);
    try {
      await sentinel?.release();
    } catch {
      /* yoksay */
    }
    sentinel = null;
  }
}

export function vibrate(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* desteklenmiyor */
  }
}

let ctx: AudioContext | null = null;

/** Mekanik sayaç "tık" sesi (WebAudio ile sentezlenir, dosya gerekmez) */
export function clickSound(kind: 'tick' | 'tock' | 'ding' = 'tick'): void {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    if (kind === 'ding') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(1320, t + 0.08);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      osc.start(t);
      osc.stop(t + 0.62);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(kind === 'tick' ? 1900 : 1300, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.12, t + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      osc.start(t);
      osc.stop(t + 0.05);
    }
    osc.connect(gain).connect(ctx.destination);
  } catch {
    /* ses kapalı olabilir */
  }
}
