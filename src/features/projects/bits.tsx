/** Proje sayfasında paylaşılan küçük parçalar: süre düğmesi, taslak kaydetme, ölçü örneği çizimi. */
import { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Craft, Project } from '@/types';
import { useProjects, projectSeconds } from '@/store/projects';
import { shade } from '@/lib/color';
import { useMsgs } from '@/i18n';
import { PRJ } from './i18n';
import { clock, statusPatch } from './projectMath';
import { useNow } from './hooks';

/** Süreyi başlat/durdur; çalışırken canlı saat gösterir */
export function TimerButton({ project: p, compact }: { project: Project; compact?: boolean }) {
  const t = useMsgs(PRJ);
  const running = !!p.timerStartedAt;
  const now = useNow(running);
  const toggle = () => {
    const s = useProjects.getState();
    if (running) s.stopTimer(p.id);
    else {
      if (p.status === 'fikir' || p.status === 'sirada' || p.status === 'uykuda') s.update(p.id, statusPatch(p, 'oruluyor'));
      else if (!p.startedAt) s.update(p.id, { startedAt: Date.now() });
      s.startTimer(p.id);
    }
  };
  return (
    <button
      type="button"
      className={`btn ${running ? 'btn-soft prj-timer-on' : 'btn-primary'}`}
      onClick={toggle}
      aria-pressed={running}
      aria-label={running ? t.timerStop : t.timerStart}
      title={running ? t.timerStop : t.timerStart}
    >
      {running ? <Pause /> : <Play />}
      {running ? <span className="tabular">{clock(projectSeconds(p, now))}</span> : !compact && <span>{t.timerStart}</span>}
    </button>
  );
}

/**
 * Yazarken yerelde tutulan, durunca (ya da odak çıkınca) kaydedilen metin.
 * Dışarıdan değer değişirse ve bekleyen yazım yoksa yerel değer güncellenir.
 */
export function useDraft(value: string, save: (v: string) => void, delay = 600) {
  const [v, setV] = useState(value);
  const saveRef = useRef(save);
  saveRef.current = save;
  const pending = useRef<string | null>(null);
  useEffect(() => {
    if (pending.current === null) setV(value);
  }, [value]);
  useEffect(() => {
    if (pending.current === null) return;
    const h = setTimeout(() => {
      if (pending.current !== null) {
        saveRef.current(pending.current);
        pending.current = null;
      }
    }, delay);
    return () => clearTimeout(h);
  }, [v, delay]);
  useEffect(
    () => () => {
      if (pending.current !== null) saveRef.current(pending.current);
    },
    [],
  );
  const change = (nv: string) => {
    pending.current = nv;
    setV(nv);
  };
  const flush = () => {
    if (pending.current !== null) {
      saveRef.current(pending.current);
      pending.current = null;
    }
  };
  return [v, change, flush] as const;
}

/** Proje renginde küçük örülmüş kare: şişte V ilmekler, tığda sık iğne sıraları */
export function SwatchArt({ color, craft, size = 132 }: { color: string; craft: Craft; size?: number }) {
  const id = useId().replace(/:/g, '');
  const dark = shade(color, -0.28);
  const light = shade(color, 0.22);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden className="prj-swatch-svg">
      <defs>
        {craft === 'knit' ? (
          <pattern id={`k${id}`} width="10" height="9" patternUnits="userSpaceOnUse">
            <path d="M1.2 0.8 Q2.8 6.5 5 8.4" fill="none" stroke={dark} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M8.8 0.8 Q7.2 6.5 5 8.4" fill="none" stroke={dark} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M2 1.4 Q3.2 5.6 4.8 7.2" fill="none" stroke={light} strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
            <path d="M8 1.4 Q6.8 5.6 5.2 7.2" fill="none" stroke={light} strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
          </pattern>
        ) : (
          <pattern id={`k${id}`} width="10" height="16" patternUnits="userSpaceOnUse">
            <rect x="1.2" y="1.5" width="7.6" height="6" rx="2.6" fill="none" stroke={dark} strokeWidth="1.8" />
            <rect x="6.2" y="9.5" width="7.6" height="6" rx="2.6" fill="none" stroke={dark} strokeWidth="1.8" />
            <rect x="-3.8" y="9.5" width="7.6" height="6" rx="2.6" fill="none" stroke={dark} strokeWidth="1.8" />
            <path d="M3 4.5h4M8 12.5h4M-2 12.5h4" stroke={light} strokeWidth="0.9" strokeLinecap="round" />
          </pattern>
        )}
      </defs>
      <rect x="2" y="2" width="116" height="116" rx="5" fill={color} />
      <rect x="2" y="2" width="116" height="116" rx="5" fill={`url(#k${id})`} />
      <rect x="2" y="2" width="116" height="116" rx="5" fill="none" stroke={dark} strokeOpacity="0.4" />
    </svg>
  );
}
