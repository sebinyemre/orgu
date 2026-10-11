import { useToasts } from '@/store/toast';

export function ToastHost() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} className="toast" onClick={() => dismiss(t.id)} style={{ border: 0 }}>
          {t.icon && <span aria-hidden>{t.icon}</span>}
          {t.text}
        </button>
      ))}
    </div>
  );
}
