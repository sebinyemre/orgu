import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';

export default function ProjectPage() {
  const t = useMsgs(COMMON);
  return (
    <div className="page">
      <PageHeader title={t.navProjects} />
      <EmptyState title={t.comingSoon}>{t.comingSoonText}</EmptyState>
    </div>
  );
}
