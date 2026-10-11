import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function ChartEditorPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="kareli kağıt" title="Desen editörü" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
