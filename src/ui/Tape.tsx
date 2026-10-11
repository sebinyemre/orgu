import type { ReactNode } from 'react';

type Tone = 'mustard' | 'sage' | 'rose' | 'denim' | 'plum' | 'terracotta';

/** Washi bant etiketi */
export function Tape({ children, tone = 'mustard', corner, className }: { children: ReactNode; tone?: Tone; corner?: boolean; className?: string }) {
  return (
    <span className={`tape${corner ? ' tape-corner' : ''} ${className ?? ''}`} data-tone={tone}>
      {children}
    </span>
  );
}
