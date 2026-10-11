import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function ChartTrackPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="kareli kağıt" title="Takip modu" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
