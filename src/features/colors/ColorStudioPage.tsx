import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function ColorStudioPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="planla" title="Renk stüdyosu" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
