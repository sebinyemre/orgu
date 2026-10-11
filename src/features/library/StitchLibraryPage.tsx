import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function StitchLibraryPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="kütüphane" title="Desen kütüphanesi" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
