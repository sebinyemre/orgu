import type { ReactNode } from 'react';
import { AlertTriangle, GraduationCap, Info, Lightbulb, OctagonAlert } from 'lucide-react';
import { useLang } from '@/i18n';

const PROF = { tr: 'Usta ipucu', en: 'From the workshop', es: 'Consejo del taller', pt: 'Dica do ateliê' };

type Tone = 'info' | 'tip' | 'warn' | 'danger' | 'prof';

const ICONS: Record<Tone, ReactNode> = {
  info: <Info />,
  tip: <Lightbulb />,
  warn: <AlertTriangle />,
  danger: <OctagonAlert />,
  prof: <GraduationCap />,
};

interface Props {
  tone?: Tone;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Bilgi kutusu. tone="prof" → "Usta ipucu" el yazısı başlığıyla */
export function Callout({ tone = 'info', title, children, className }: Props) {
  const lang = useLang();
  return (
    <div className={`callout ${className ?? ''}`} data-tone={tone}>
      {ICONS[tone]}
      <div className="grow">
        {(title || tone === 'prof') && <div className="callout-title">{title ?? PROF[lang]}</div>}
        {children}
      </div>
    </div>
  );
}
