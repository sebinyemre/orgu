import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function GlossaryPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="kütüphane" title="Sözlük" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
