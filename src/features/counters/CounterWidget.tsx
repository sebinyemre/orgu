/**
 * Yeniden kullanılabilir sayaç bileşeni (Sayaçlar, Projelerim, grafik takip modu).
 *
 *   <CounterWidget counter={c} onIncrement={(d) => store.increment(c.id, d)} onChange={(p) => store.update(c.id, p)} />
 *
 * `onIncrement` tetiklenen hatırlatıcıları döndürürse ses, titreşim ve bildirim burada verilir.
 */
import { useMemo, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Bell, Gauge, Link2, Maximize2, Minus, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import type { Counter } from '@/types';
import type { FiredReminder } from '@/engine/counters';
import { nextReminder, ratePerHour } from '@/engine/counters';
import { confirmDialog } from '@/ui/Confirm';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { fmt } from '@/lib/format';
import { CNT } from './i18n';
import { CounterFace, type FaceSize } from './faces';
import { counterDisplayName, reachesTarget, targetProgress } from './counterMath';
import { counterFeedback } from './feedback';
import { PopMenu } from './PopMenu';
import './counters.css';

export interface CounterWidgetProps {
  counter: Counter;
  /** artır/azalt; tetiklenen hatırlatıcıları döndürürse geri bildirim verilir */
  onIncrement: (delta: number) => FiredReminder[] | void;
  /** değer, ad, stil vb. değişikliği (sıfırlama `{ value: 0 }` gönderir) */
  onChange: (patch: Partial<Counter>) => void;
  onRemove?: () => void;
  onEdit?: () => void;
  onFocusMode?: () => void;
  onMove?: (dir: -1 | 1) => void;
  /** öne/arkaya taşıma düğmelerinin etkinliği */
  canMove?: { up: boolean; down: boolean };
  size?: 'sm' | 'md' | 'lg';
  /** bağlı olduğu sayacın adı (counter.link varsa) */
  linkedName?: string;
  /** ip rengi (proje rengi) */
  color?: string;
  /** dokunulduğunda (klavye hedefi seçimi için) */
  onActivate?: () => void;
  className?: string;
}

export function CounterWidget({ counter, onIncrement, onChange, onRemove, onEdit, onFocusMode, onMove, canMove, size = 'md', linkedName, color, onActivate, className }: CounterWidgetProps) {
  const t = useMsgs(CNT);
  const tc = useMsgs(COMMON);
  const lang = useLang();
  const name = counterDisplayName(counter.name, lang);
  const next = useMemo(() => nextReminder(counter), [counter]);
  const rate = useMemo(() => ratePerHour(counter), [counter]);
  const prog = targetProgress(counter);

  const step = (delta: 1 | -1) => {
    onActivate?.();
    if (delta < 0 && counter.value <= 0) return;
    const reached = reachesTarget(counter, delta) ? name : undefined;
    const fired = onIncrement(delta) ?? [];
    counterFeedback(delta, fired, reached);
  };

  const reset = async () => {
    if (await confirmDialog(t.resetConfirm(name), { confirmLabel: t.reset, danger: true })) onChange({ value: 0 });
  };
  const remove = async () => {
    if (onRemove && (await confirmDialog(t.deleteConfirm(name), { confirmLabel: tc.delete, danger: true }))) onRemove();
  };

  const faceSize: FaceSize = size;
  const tint = color ? ({ '--cnt-tint': color } as CSSProperties) : undefined;
  const linkChip = counter.link && linkedName ? t.linkedChip(counter.link.every, counterDisplayName(linkedName, lang)) : null;

  if (size === 'sm') {
    return (
      <div className={`cnt-widget cnt-sm ${className ?? ''}`} data-counter-id={counter.id} data-style={counter.style} style={tint}>
        <button type="button" className="cnt-face-btn" onClick={() => step(1)} aria-label={t.incLabel(name, counter.value)}>
          <CounterFace style={counter.style} value={counter.value} target={counter.target} size="sm" color={color} />
        </button>
        <div className="grow cnt-sm-info">
          <div className="cnt-name" title={name}>
            {name}
          </div>
          {next ? (
            <div className="cnt-next xsmall">
              <Bell aria-hidden />
              <span>
                {next.at} · {next.reminder.text}
              </span>
            </div>
          ) : prog !== null ? (
            <div className="xsmall faint tabular">
              {fmt(counter.value, 0)} / {fmt(counter.target!, 0)}
            </div>
          ) : null}
        </div>
        <button type="button" className="btn btn-ghost btn-icon" onClick={() => step(-1)} aria-label={t.decLabel(name)} disabled={counter.value <= 0}>
          <Minus />
        </button>
        <button type="button" className="btn btn-primary btn-icon" onClick={() => step(1)} aria-label={t.incLabel(name, counter.value)}>
          <Plus />
        </button>
      </div>
    );
  }

  return (
    <div className={`cnt-widget cnt-${size} ${className ?? ''}`} data-counter-id={counter.id} data-style={counter.style} onPointerDown={onActivate} style={tint}>
      <div className="cnt-head">
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="cnt-name" title={name}>
            {name}
          </div>
          {linkChip && (
            <span className="chip cnt-link-chip" data-tone="denim" title={linkChip}>
              <Link2 aria-hidden />
              {linkChip}
            </span>
          )}
        </div>
        {onFocusMode && (
          <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={onFocusMode} aria-label={t.focus} title={t.focus}>
            <Maximize2 />
          </button>
        )}
        <PopMenu
          small
          label={t.more}
          items={[
            onEdit && { label: tc.edit, icon: <Pencil />, onClick: onEdit },
            onFocusMode && { label: t.focus, icon: <Maximize2 />, onClick: onFocusMode },
            onMove && { label: t.moveUp, icon: <ArrowLeft />, onClick: () => onMove(-1), disabled: canMove ? !canMove.up : false },
            onMove && { label: t.moveDown, icon: <ArrowRight />, onClick: () => onMove(1), disabled: canMove ? !canMove.down : false },
            { label: t.reset, icon: <RotateCcw />, onClick: reset, disabled: counter.value === 0 },
            onRemove && 'sep',
            onRemove && { label: tc.delete, icon: <Trash2 />, onClick: remove, danger: true },
          ]}
        />
      </div>

      <button type="button" className="cnt-face-btn" onClick={() => step(1)} aria-label={t.incLabel(name, counter.value)}>
        <CounterFace style={counter.style} value={counter.value} target={counter.target} size={faceSize} color={color} />
      </button>

      {prog !== null && counter.style !== 'yumak' && (
        <div className="cnt-target">
          <div className="progress" aria-hidden>
            <span style={{ width: `${prog * 100}%`, ...(color ? { background: color } : null) }} />
          </div>
          <span className="xsmall tabular faint">
            {fmt(counter.value, 0)} / {fmt(counter.target!, 0)}
          </span>
        </div>
      )}

      <div className="cnt-meta">
        {next && (
          <span className="cnt-next" title={t.nextReminder}>
            <Bell aria-hidden />
            <span>
              <b className="tabular">{next.at}</b> · {next.reminder.text}
              <span className="faint"> ({t.left(next.at - counter.value)})</span>
            </span>
          </span>
        )}
        {rate !== null && (
          <span className="cnt-rate">
            <Gauge aria-hidden />
            {t.perHour(fmt(rate, rate < 10 ? 1 : 0))}
          </span>
        )}
      </div>

      <div className="cnt-actions">
        <button type="button" className="btn btn-soft btn-icon" onClick={() => step(-1)} aria-label={t.decLabel(name)} disabled={counter.value <= 0}>
          <Minus />
        </button>
        <button type="button" className="btn btn-primary grow cnt-plus" onClick={() => step(1)} aria-label={t.incLabel(name, counter.value)}>
          <Plus />
          <span>1</span>
        </button>
        <button type="button" className="btn btn-ghost btn-icon" onClick={reset} aria-label={t.reset} title={t.reset} disabled={counter.value === 0}>
          <RotateCcw />
        </button>
      </div>
    </div>
  );
}
