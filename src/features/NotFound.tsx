import { Link } from 'react-router-dom';
import { EmptyState } from '@/ui/EmptyState';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';

export function NotFound() {
  const t = useMsgs(COMMON);
  return (
    <div className="page">
      <EmptyState title={t.notFoundTitle} action={<Link to="/" className="btn btn-primary">{t.backToLessons}</Link>}>
        {t.notFoundText}
      </EmptyState>
    </div>
  );
}
