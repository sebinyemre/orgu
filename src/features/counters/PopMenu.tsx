import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import './popmenu.css';

export interface PopMenuItem {
  label: ReactNode;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** seçili (ör. geçerli durum) */
  current?: boolean;
}

interface Props {
  items: (PopMenuItem | 'sep' | false | null | undefined)[];
  label: string;
  icon?: ReactNode;
  /** menü hangi yana açılsın */
  align?: 'start' | 'end';
  className?: string;
  small?: boolean;
}

/** Üç nokta menüsü: dışarı tıklayınca ve Esc ile kapanır, ok tuşlarıyla gezilir. */
export function PopMenu({ items, label, icon, align = 'end', className, small }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        root.current?.querySelector<HTMLElement>('.pm-trigger')?.focus();
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const list = Array.from(root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []);
        const i = list.indexOf(document.activeElement as HTMLElement);
        const next = e.key === 'ArrowDown' ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
        list[next]?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey, true);
    const t = setTimeout(() => root.current?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus(), 20);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey, true);
      clearTimeout(t);
    };
  }, [open]);

  const list = items.filter(Boolean) as (PopMenuItem | 'sep')[];
  return (
    <div className={`pm ${className ?? ''}`} ref={root} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className={`btn btn-ghost btn-icon pm-trigger${small ? ' btn-sm' : ''}`}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        {icon ?? <MoreVertical />}
      </button>
      {open && (
        <div className="pm-list" role="menu" id={id} data-align={align}>
          {list.map((it, i) =>
            it === 'sep' ? (
              <div key={`s${i}`} className="pm-sep" role="separator" />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                className="pm-item"
                data-danger={it.danger || undefined}
                aria-current={it.current || undefined}
                disabled={it.disabled}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  it.onClick();
                }}
              >
                {it.icon}
                <span>{it.label}</span>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
