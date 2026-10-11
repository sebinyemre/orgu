import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function StashPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="malzeme" title="İp sepeti" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
