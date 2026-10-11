import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function ProjectPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="projelerim" title="Proje" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
