import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';

export default function RecipePage() {
  return (
    <div className="page">
      <PageHeader eyebrow="araçlar" title="Tarif hazırlayıcı" />
      <EmptyState title="Hazırlanıyor">Bu bölüm yakında burada.</EmptyState>
    </div>
  );
}
