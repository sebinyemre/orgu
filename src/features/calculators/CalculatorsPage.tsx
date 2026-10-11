import type { ComponentType } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { CALC } from './i18n';
import { CALC_GROUPS, CALC_ICON, CALC_TONE, isCalcId, type CalcId } from './registry';
import CastOnCalc from './calcs/CastOnCalc';
import DistributeCalc from './calcs/DistributeCalc';
import YarnAmountCalc from './calcs/YarnAmountCalc';
import NeedleSizesCalc from './calcs/NeedleSizesCalc';
import WpiCalc from './calcs/WpiCalc';
import SizeTablesCalc from './calcs/SizeTablesCalc';
import CircleCalc from './calcs/CircleCalc';
import SubstituteCalc from './calcs/SubstituteCalc';
import GaugeCalc from './calcs/GaugeCalc';
import './calculators.css';

const VIEWS: Record<CalcId, ComponentType> = {
  'ilmek-sayisi': CastOnCalc,
  'esit-dagitim': DistributeCalc,
  'ip-miktari': YarnAmountCalc,
  'sis-tig-olcu': NeedleSizesCalc,
  'ip-kalinligi': WpiCalc,
  beden: SizeTablesCalc,
  'tig-daire': CircleCalc,
  'ip-degistirme': SubstituteCalc,
  'olcu-ornegi': GaugeCalc,
};

function Hub() {
  const t = useMsgs(CALC);
  const c = useMsgs(COMMON);
  return (
    <div className="page">
      <PageHeader eyebrow={t.hubEyebrow} title={c.navCalculators} lede={t.hubLede} />
      {CALC_GROUPS.map((g) => (
        <section key={g.title}>
          <h2 className="section-title">{t[g.title]}</h2>
          <div className="grid-3">
            {g.ids.map((id) => {
              const Icon = CALC_ICON[id];
              return (
                <Link key={id} to={`/hesap/${id}`} className="card card-link calc-card" style={{ ['--tone' as string]: CALC_TONE[id] }}>
                  <span className="calc-card-icon" aria-hidden>
                    <Icon />
                  </span>
                  <span className="grow">
                    <span className="card-title">{t.calcs[id].title}</span>
                    <span className="calc-card-desc">{t.calcs[id].desc}</span>
                  </span>
                  <ArrowRight className="calc-card-arrow" aria-hidden />
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function CalculatorsPage() {
  const { calcId } = useParams();
  const t = useMsgs(CALC);
  if (!calcId) return <Hub />;
  if (!isCalcId(calcId)) {
    return (
      <div className="page">
        <EmptyState
          title={t.notFound}
          action={
            <Link className="btn btn-primary" to="/hesap">
              {t.allCalcs}
            </Link>
          }
        />
      </div>
    );
  }
  const View = VIEWS[calcId];
  return <View key={calcId} />;
}
