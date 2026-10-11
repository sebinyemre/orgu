import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';

export default function CountersPage() {
  const t = useMsgs(COMMON);
  return (
    <div className="page">
      <PageHeader title={t.navCounters} />
      <EmptyState title={t.comingSoon}>{t.comingSoonText}</EmptyState>
    </div>
  );
}
