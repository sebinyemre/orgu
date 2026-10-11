import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function ToolsPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="araçlar" title="Atölye araçları" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
