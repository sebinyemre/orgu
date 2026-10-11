import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function ChartListPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="planla" title="Kareli kağıt" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
