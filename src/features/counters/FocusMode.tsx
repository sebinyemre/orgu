/** Odak modu: tek bir dev sayaç; ekranın her yerine dokunmak +1. Ayara göre ekran açık tutulur. */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Minus, X } from 'lucide-react';
import type { Counter } from '@/types';
import type { FiredReminder } from '@/engine/counters';
import { nextReminder } from '@/engine/counters';
import { keepScreenOn } from '@/lib/device';
import { useSettings } from '@/store/settings';
import { useLang, useMsgs } from '@/i18n';
import { fmt } from '@/lib/format';
import { CNT } from './i18n';
import { CounterFace } from './faces';
import { counterDisplayName, reachesTarget, targetProgress } from './counterMath';
import { counterFeedback } from './feedback';
import './counters.css';

export interface FocusModeProps {
  counter: Counter;
  onIncrement: (delta: number) => FiredReminder[] | void;
  onClose: () => void;
  color?: string;
  /** üst başlıkta küçük bağlam metni (ör. proje adı) */
  context?: string;
}

export function FocusMode({ counter, onIncrement, onClose, color, context }: FocusModeProps) {
  const t = useMsgs(CNT);
  const lang = useLang();
  const keepAwake = useSettings((s) => s.keepAwake);
  const name = counterDisplayName(counter.name, lang);
  const ref = useRef<HTMLDivElement>(null);
  // pencere gövdeye taşındığı için bulunduğu dünyanın (Öğren/Yarat) vurgu rengini taşı
  const [world] = useState(() => document.querySelector('.shell')?.getAttribute('data-world') ?? undefined);
  const live = useRef(counter);
  live.current = counter;

  const step = (delta: 1 | -1) => {
    const c = live.current;
    if (delta < 0 && c.value <= 0) return;
    const reached = reachesTarget(c, delta) ? name : undefined;
    counterFeedback(delta, onIncrement(delta) ?? [], reached);
  };
  const stepRef = useRef(step);
  stepRef.current = step;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (keepAwake) void keepScreenOn(true);
    return () => {
      if (keepAwake) void keepScreenOn(false);
    };
  }, [keepAwake]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const onBtn = e.target instanceof HTMLElement && !!e.target.closest('button');
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRef.current();
      } else if (e.key === ' ' || e.key === 'Enter' || e.key === '+' || e.key === 'ArrowUp') {
        if (onBtn && (e.key === ' ' || e.key === 'Enter')) return;
        e.preventDefault();
        stepRef.current(1);
      } else if (e.key === '-' || e.key === 'ArrowDown' || e.key === 'Subtract') {
        e.preventDefault();
        stepRef.current(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);

  const next = nextReminder(counter);
  const prog = targetProgress(counter);

  return createPortal(
    <div ref={ref} className="cnt-focus" role="dialog" aria-modal="true" aria-label={`${t.focus}: ${name}`} tabIndex={-1} onClick={() => step(1)} data-style={counter.style} data-world={world} style={color ? ({ '--cnt-tint': color } as CSSProperties) : undefined}>
      <div className="cnt-focus-top" onClick={(e) => e.stopPropagation()}>
        <div className="grow" style={{ minWidth: 0 }}>
          {context && <div className="xsmall faint cnt-focus-context">{context}</div>}
          <div className="cnt-focus-name">{name}</div>
        </div>
        <button type="button" className="btn btn-icon btn-lg" onClick={() => step(-1)} aria-label={t.decLabel(name)} disabled={counter.value <= 0}>
          <Minus />
        </button>
        <button type="button" className="btn btn-icon btn-lg" onClick={onClose} aria-label={t.exitFocus} title={t.exitFocus}>
          <X />
        </button>
      </div>

      <div className="cnt-focus-face" aria-live="polite" aria-atomic="true">
        <span className="sr-only">
          {name}: {counter.value}
        </span>
        <CounterFace style={counter.style} value={counter.value} target={counter.target} size="xl" color={color} />
      </div>

      <div className="cnt-focus-bottom">
        {prog !== null && counter.style !== 'yumak' && (
          <div className="cnt-target" style={{ width: 'min(420px, 100%)' }}>
            <div className="progress" aria-hidden>
              <span style={{ width: `${prog * 100}%`, ...(color ? { background: color } : null) }} />
            </div>
            <span className="small tabular faint">
              {fmt(counter.value, 0)} / {fmt(counter.target!, 0)}
            </span>
          </div>
        )}
        {next && (
          <div className="cnt-next cnt-focus-next">
            <Bell aria-hidden />
            <span>
              <b className="tabular">{next.at}</b> · {next.reminder.text} <span className="faint">({t.left(next.at - counter.value)})</span>
            </span>
          </div>
        )}
        <div className="hand cnt-focus-hint">{t.focusHint}</div>
      </div>
    </div>,
    document.body,
  );
}
