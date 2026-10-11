import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function CalculatorsPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="planla" title="Hesaplayıcılar" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
