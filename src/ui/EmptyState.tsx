import type { ReactNode } from 'react';
import { YarnBall } from './YarnBall';

interface Props {
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  color?: string;
}

export function EmptyState({ title, children, action, color = '#d39a2c' }: Props) {
  return (
    <div className="empty">
      <YarnBall color={color} size={72} />
      <div className="hand">{title}</div>
      {children && <div style={{ maxWidth: '46ch' }}>{children}</div>}
      {action}
    </div>
  );
}
