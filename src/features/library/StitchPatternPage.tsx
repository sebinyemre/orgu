import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function StitchPatternPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="kütüphane" title="Desen" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
