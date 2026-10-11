import { Link } from 'react-router-dom';
import { EmptyState } from '@/ui/EmptyState';

export function NotFound() {
  return (
    <div className="page">
      <EmptyState title="Bu ilmek kaçmış!" action={<Link to="/" className="btn btn-primary">Derslere dön</Link>}>
        Aradığın sayfa bulunamadı.
      </EmptyState>
    </div>
  );
}
