import { create } from 'zustand';
import { Modal } from './Modal';
import { getLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';

interface ConfirmState {
  open: boolean;
  message: string;
  title: string;
  confirmLabel: string;
  danger: boolean;
  resolve?: (v: boolean) => void;
}

const useConfirmStore = create<ConfirmState>()(() => ({ open: false, message: '', title: '', confirmLabel: '', danger: false }));

/** await confirmDialog('Silinsin mi?') → true/false */
export function confirmDialog(message: string, opts: { title?: string; confirmLabel?: string; danger?: boolean } = {}): Promise<boolean> {
  return new Promise((resolve) => {
    useConfirmStore.setState({
      open: true,
      message,
      title: opts.title ?? COMMON[getLang()].confirmTitle,
      confirmLabel: opts.confirmLabel ?? COMMON[getLang()].yes,
      danger: opts.danger ?? false,
      resolve,
    });
  });
}

export function ConfirmHost() {
  const s = useConfirmStore();
  const t = useMsgs(COMMON);
  const close = (v: boolean) => {
    s.resolve?.(v);
    useConfirmStore.setState({ open: false, resolve: undefined });
  };
  return (
    <Modal
      open={s.open}
      onClose={() => close(false)}
      title={s.title}
      footer={
        <>
          <button className="btn btn-ghost" onClick={() => close(false)}>
            {t.cancel}
          </button>
          <button className={`btn ${s.danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => close(true)} autoFocus>
            {s.confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ margin: 0 }}>{s.message}</p>
    </Modal>
  );
}
