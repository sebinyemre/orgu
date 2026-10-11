import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function ProjectsPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="ör" title="Projelerim" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
