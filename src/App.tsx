import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { applyTheme, useSettings } from '@/store/settings';
import { ConfirmHost } from '@/ui/Confirm';
import { ToastHost } from '@/ui/Toasts';
import { Onboarding } from '@/features/settings/Onboarding';

export default function App() {
  const theme = useSettings((s) => s.theme);
  const leftHanded = useSettings((s) => s.leftHanded);
  const lang = useSettings((s) => s.lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => applyTheme('auto');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.hand = leftHanded ? 'left' : 'right';
  }, [leftHanded]);

  return (
    <>
      <RouterProvider router={router} />
      <ConfirmHost />
      <ToastHost />
      <Onboarding />
    </>
  );
}
