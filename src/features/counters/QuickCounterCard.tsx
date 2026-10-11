/** Ana sayfa için küçük hızlı sayaç kartı: ilk hızlı sayaç ve büyük +1. */
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { useQuickCounters } from '@/store/counters';
import { useMsgs } from '@/i18n';
import { CNT } from './i18n';
import { CounterWidget } from './CounterWidget';
import './counters.css';

export interface QuickCounterCardProps {
  className?: string;
}

export function QuickCounterCard({ className }: QuickCounterCardProps) {
  const t = useMsgs(CNT);
  const counter = useQuickCounters((s) => s.counters[0]);
  const linkedName = useQuickCounters((s) => (counter?.link ? s.counters.find((c) => c.id === counter.link!.toId)?.name : undefined));
  const add = useQuickCounters((s) => s.add);
  const increment = useQuickCounters((s) => s.increment);
  const update = useQuickCounters((s) => s.update);
  return (
    <section className={`card cnt-quick stack-sm ${className ?? ''}`} aria-label={t.quickTitle}>
      <div className="spread">
        <span className="eyebrow">{t.quickTitle}</span>
        <Link to="/sayaclar" className="btn btn-ghost btn-sm">
          {t.allCounters}
          <ArrowRight />
        </Link>
      </div>
      {counter ? (
        <CounterWidget counter={counter} size="sm" linkedName={linkedName} onIncrement={(d) => increment(counter.id, d)} onChange={(p) => update(counter.id, p)} />
      ) : (
        <button className="btn btn-soft" onClick={() => add({ name: t.defaults.rowCounter })}>
          <Plus />
          {t.addFirst}
        </button>
      )}
    </section>
  );
}
