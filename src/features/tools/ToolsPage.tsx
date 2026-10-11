/** Atölye araçları: telefonda alt menüdeki "Araçlar" sekmesi; tüm Yarat araçlarına tek yerden geçiş */
import { Link } from 'react-router-dom';
import { ArrowRight, Settings } from 'lucide-react';
import { PageHeader } from '@/ui/PageHeader';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { CREATE_NAV, type NavItem } from '@/layout/nav';
import { QuickCounterCard } from '@/features/counters/QuickCounterCard';
import '@/features/calculators/calculators.css';

/** her aracın kendi rengi (kart simgesinde) */
const TONE: Record<string, string> = {
  '/kareli': 'var(--denim)',
  '/tarif': 'var(--terracotta)',
  '/sayaclar': 'var(--plum)',
  '/hesap': 'var(--mustard)',
  '/renk': 'var(--rose)',
  '/sepet': 'var(--sage)',
};

const TOOLS: NavItem[] = CREATE_NAV.flatMap((g) => g.items).filter((i) => i.to in TONE);

export default function ToolsPage() {
  const t = useMsgs(COMMON);
  return (
    <div className="page">
      <PageHeader title={t.groupTools} />
      <div className="stack">
        <QuickCounterCard />
        <div className="grid-2">
          {TOOLS.map((i) => {
            const Icon = i.icon;
            return (
              <Link key={i.to} to={i.to} className="card card-link calc-card" style={{ ['--tone' as string]: TONE[i.to] }}>
                <span className="calc-card-icon" aria-hidden>
                  <Icon />
                </span>
                <span className="grow" style={{ minWidth: 0 }}>
                  <span className="card-title">{t[i.label]}</span>
                  {i.desc && <span className="calc-card-desc">{t[i.desc]}</span>}
                </span>
                <ArrowRight className="calc-card-arrow" aria-hidden />
              </Link>
            );
          })}
          <Link to="/ayarlar" className="card card-link calc-card card-sunken" style={{ ['--tone' as string]: 'var(--ink-2)' }}>
            <span className="calc-card-icon" aria-hidden>
              <Settings />
            </span>
            <span className="grow" style={{ minWidth: 0 }}>
              <span className="card-title">{t.navSettings}</span>
              <span className="calc-card-desc">{t.descSettings}</span>
            </span>
            <ArrowRight className="calc-card-arrow" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
