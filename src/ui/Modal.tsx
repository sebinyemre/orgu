import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  /** telefonda alttan açılan sayfa gibi davran */
  sheet?: boolean;
  labelledBy?: string;
}

/** Erişilebilir modal: Esc ile kapanır, odak içeride tutulur, telefonda alt sayfa. */
export function Modal({ open, onClose, title, children, footer, wide, sheet = true }: Props) {
  const t = useMsgs(COMMON);
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => {
      const auto = ref.current?.querySelector<HTMLElement>('[autofocus], input, select, textarea');
      (auto ?? ref.current)?.focus();
    }, 30);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className={`modal-backdrop${sheet ? ' as-sheet' : ''}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`modal${wide ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" tabIndex={-1}>
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} aria-label={t.close}>
              <X />
            </button>
          </div>
        )}
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
