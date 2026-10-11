import { useEffect, useRef } from 'react';

/** Odakta bir pencere (modal, odak modu) varsa klavye kısayolları devre dışı */
function overlayOpen(): boolean {
  return !!document.querySelector('.modal-backdrop, .cnt-focus');
}

function isTyping(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

/**
 * Sayaç klavye kısayolları: Boşluk (ya da +) = +1, eksi = −1.
 * Hedef: odaktaki öğenin içinde bulunduğu `[data-counter-id]`, yoksa `fallbackId()` (son dokunulan ya da ilk sayaç).
 */
export function useCounterKeys(enabled: boolean, fallbackId: () => string | undefined, onStep: (id: string, delta: 1 | -1) => void): void {
  const ref = useRef({ fallbackId, onStep });
  ref.current = { fallbackId, onStep };
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target) || overlayOpen()) return;
      const plus = e.key === ' ' || e.key === '+';
      const minus = e.key === '-' || e.key === 'Subtract' || e.key === '−';
      if (!plus && !minus) return;
      // odaktaki düğme boşlukla kendi işini yapsın (çift sayım olmasın)
      if (e.key === ' ' && e.target instanceof HTMLElement && e.target.closest('button, a, [role="button"]')) return;
      const host = document.activeElement instanceof HTMLElement ? document.activeElement.closest<HTMLElement>('[data-counter-id]') : null;
      const id = host?.dataset.counterId ?? ref.current.fallbackId();
      if (!id) return;
      e.preventDefault();
      ref.current.onStep(id, plus ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
