/**
 * Tarif görünümü (Tarif hazırlayıcı ve Projelerim tarafından kullanılır).
 * GEÇİCİ: Tarif hazırlayıcı modülü bu bileşeni tam hâliyle yeniden yazacak; props sözleşmesi sabittir.
 */
import type { GeneratedPattern } from '@/types';

export interface PatternViewProps {
  pattern: GeneratedPattern;
  /** tamamlanan adım id'leri (verilirse adımlar işaretlenebilir olur) */
  doneSteps?: string[];
  onToggleStep?: (stepId: string) => void;
  /** proje sayfası içinde daha sıkışık görünüm */
  compact?: boolean;
}

export function PatternView({ pattern, doneSteps, onToggleStep }: PatternViewProps) {
  return (
    <div className="stack">
      {pattern.sections.map((s) => (
        <section key={s.id} className="card">
          <h3>{s.title}</h3>
          <ul className="list">
            {s.steps.map((st) => (
              <li key={st.id}>
                <label className="row-nowrap">
                  {onToggleStep && <input type="checkbox" checked={doneSteps?.includes(st.id) ?? false} onChange={() => onToggleStep(st.id)} />}
                  <span>
                    <b>{st.label}</b> {st.text}
                    {st.count !== undefined && <span className="faint"> ({st.count} ilmek)</span>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
