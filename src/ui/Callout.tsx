import type { ReactNode } from 'react';
import { AlertTriangle, GraduationCap, Info, Lightbulb, OctagonAlert } from 'lucide-react';

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
  return (
    <div className={`callout ${className ?? ''}`} data-tone={tone}>
      {ICONS[tone]}
      <div className="grow">
        {(title || tone === 'prof') && <div className="callout-title">{title ?? 'Usta ipucu'}</div>}
        {children}
      </div>
    </div>
  );
}
