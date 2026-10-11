/**
 * Bir resimli adımı çizen SVG sahnesi. Çocukları sahne parçalarıdır (parts.tsx).
 * Döngülü animasyon (SMIL) dur saniyede bir tekrar eder; solak modunda yatay aynalanır.
 */
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type ReactNode } from 'react';
import { useSettings } from '@/store/settings';
import { SceneContext } from './parts';
import './illust.css';

export interface SceneHandle {
  pause: () => void;
  play: () => void;
  restart: () => void;
}

interface Props {
  children: ReactNode;
  /** döngü süresi (sn, hız ayarından önce) */
  dur?: number;
  /** animasyon kapalı: sahnenin son hâli çizilir */
  still?: boolean;
  paused?: boolean;
  label?: string;
  className?: string;
  /** görünüm kutusu */
  viewBox?: string;
  /** arka plana hafif kareli desen */
  grid?: boolean;
}

export const Scene = forwardRef<SceneHandle, Props>(function Scene({ children, dur = 3.2, still, paused, label, className, viewBox = '0 0 400 300', grid = true }, ref) {
  const speed = useSettings((s) => s.animSpeed);
  const mirrored = useSettings((s) => s.leftHanded);
  const uid = useId().replace(/:/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const animate = !still && !reduce;
  const realDur = dur / (speed || 1);

  useImperativeHandle(ref, () => ({
    pause: () => svg.current?.pauseAnimations(),
    play: () => svg.current?.unpauseAnimations(),
    restart: () => {
      svg.current?.setCurrentTime(0);
      svg.current?.unpauseAnimations();
    },
  }));

  useEffect(() => {
    if (!svg.current) return;
    if (paused) svg.current.pauseAnimations();
    else svg.current.unpauseAnimations();
  }, [paused]);

  const [, , w, h] = viewBox.split(' ').map(Number);
  return (
    <SceneContext.Provider value={{ uid, dur: realDur, animate, mirrored }}>
      <svg ref={svg} viewBox={viewBox} className={`il-scene ${className ?? ''}`} role="img" aria-label={label}>
        {grid && (
          <g>
            <defs>
              <pattern id={`${uid}grid`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0 L0 0 0 20" fill="none" stroke="var(--il-grid)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={w} height={h} fill={`url(#${uid}grid)`} />
          </g>
        )}
        <g transform={mirrored ? `translate(${w} 0) scale(-1 1)` : undefined}>{children}</g>
      </svg>
    </SceneContext.Provider>
  );
});
