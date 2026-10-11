/** Hesaplayıcıların ortak parçaları: birimli uzunluk girişi, ölçü örneği alanları, sonuç kutuları */
import { useId, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '@/store/settings';
import { useLang, useMsgs } from '@/i18n';
import { NumberInput } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { YarnBall } from '@/ui/YarnBall';
import { PageHeader } from '@/ui/PageHeader';
import { TechniqueLink } from '@/features/learn/TechniqueLink';
import { LESSON_BY_ID } from '@/knowledge/curriculum';
import { fmt, fmtLength } from '@/lib/format';
import type { Lang, Units } from '@/types';
import type { YarnWeightInfo } from '@/knowledge/yarnWeights';
import { CALC } from './i18n';
import { fromUnit, gaugeSpanCm, toUnit } from './logic';
import type { CalcId } from './registry';

export function useUnits(): Units {
  return useSettings((s) => s.units);
}

/** "cm" ya da dile göre "inç / in / pulg / pol" */
export function useUnitLabel(): string {
  const units = useUnits();
  const t = useMsgs(CALC);
  return units === 'in' ? t.unitIn : 'cm';
}

/** Uzunluk biçimleyici (kullanıcının birimiyle) */
export function useLen() {
  const units = useUnits();
  const lang = useLang();
  return (cm: number, digits: 0 | 1 | 2 = 1) => fmtLength(cm, units, digits, lang);
}

/** Ölçü örneği açıklığının yazısı: "10 cm" ya da "4 in" */
export function useSpanText(): string {
  const units = useUnits();
  const len = useLen();
  return len(gaugeSpanCm(units), 0);
}

interface LengthInputProps {
  /** cm cinsinden değer */
  cm: number;
  onChange: (cm: number) => void;
  id?: string;
  ariaLabel?: string;
  min?: number;
}

/** Değeri cm tutan, kullanıcıya kendi biriminde gösteren giriş */
export function LengthInput({ cm, onChange, id, ariaLabel, min = 0 }: LengthInputProps) {
  const units = useUnits();
  const unit = useUnitLabel();
  return <NumberInput id={id} value={toUnit(cm, units)} onChange={(v) => onChange(fromUnit(v, units))} min={min} suffix={unit} ariaLabel={ariaLabel} />;
}

/** Etiketli alan (kimlik bağlamalı) */
export function LabeledField({ label, hint, children }: { label: ReactNode; hint?: ReactNode; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {children(id)}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export interface SpanCount {
  count: number;
  overCm: number;
}

/** "X ilmek, Y genişlikte" iki alan */
export function SpanCountFields({
  value,
  onChange,
  countLabel,
  overLabel,
  integer = false,
}: {
  value: SpanCount;
  onChange: (v: SpanCount) => void;
  countLabel: string;
  overLabel: string;
  integer?: boolean;
}) {
  return (
    <div className="calc-pair">
      <LabeledField label={countLabel}>
        {(id) => <NumberInput id={id} value={value.count} min={0} integer={integer} onChange={(n) => onChange({ ...value, count: n })} />}
      </LabeledField>
      <LabeledField label={overLabel}>{(id) => <LengthInput id={id} cm={value.overCm} onChange={(cm) => onChange({ ...value, overCm: cm })} />}</LabeledField>
    </div>
  );
}

/** Sayfa iskeleti: geri bağlantısı, başlık, iki sütun (girdiler / sonuç) */
export function CalcLayout({ id, icon, children, result, after }: { id: CalcId; icon: ReactNode; children: ReactNode; result: ReactNode; after?: ReactNode }) {
  const t = useMsgs(CALC);
  const meta = t.calcs[id];
  return (
    <div className="page calc-page">
      <Link to="/hesap" className="btn btn-ghost btn-sm calc-back">
        <ArrowLeft />
        {t.allCalcs}
      </Link>
      <PageHeader
        eyebrow={t.hubEyebrow}
        title={
          <span className="calc-title">
            <span className="calc-title-icon" aria-hidden>
              {icon}
            </span>
            {meta.title}
          </span>
        }
        lede={meta.desc}
      />
      <div className="calc-grid">
        <section className="card calc-inputs" aria-label={t.inputs}>
          {children}
        </section>
        <section className="calc-result" aria-live="polite" aria-label={t.result}>
          {result}
        </section>
      </div>
      {after && <div className="calc-after">{after}</div>}
    </div>
  );
}

/** Büyük sonuç kutusu */
export function BigResult({ label, value, sub, tone }: { label?: ReactNode; value: ReactNode; sub?: ReactNode; tone?: 'accent' | 'plain' }) {
  return (
    <div className={`calc-big${tone === 'plain' ? ' plain' : ''}`}>
      {label && <div className="stat-label">{label}</div>}
      <div className="calc-big-value">{value}</div>
      {sub && <div className="calc-big-sub">{sub}</div>}
    </div>
  );
}

/** "Nasıl ölçülür?" kutusu */
export function HowTo({ children }: { children: ReactNode }) {
  const t = useMsgs(CALC);
  return (
    <Callout tone="tip" title={t.howToMeasure}>
      {children}
    </Callout>
  );
}

/** İlgili dersler (yerinde açılan teknik bağlantıları) */
export function RelatedLessons({ ids }: { ids: string[] }) {
  const t = useMsgs(CALC);
  const list = ids.filter((id) => LESSON_BY_ID[id]);
  if (!list.length) return null;
  return (
    <div className="calc-related">
      <div className="stat-label">{t.relatedLessons}</div>
      <ul className="calc-related-list">
        {list.map((id) => (
          <li key={id}>
            <TechniqueLink lessonId={id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Yumak sayısı kadar küçük yumak çizer (son yumak kesirli) */
export function YarnBalls({ skeins, color = '#b5523b', max = 24 }: { skeins: number; color?: string; max?: number }) {
  if (!(skeins > 0)) return null;
  const whole = Math.floor(skeins);
  const part = skeins - whole;
  const n = Math.min(max, Math.ceil(skeins));
  return (
    <div className="calc-balls" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <YarnBall key={i} color={color} size={30} tail={i === n - 1} amount={i === whole && part > 0 ? Math.max(0.2, part) : 1} />
      ))}
      {Math.ceil(skeins) > max && <span className="faint small">+{Math.ceil(skeins) - max}</span>}
    </div>
  );
}

/** Yüzde: tr "%12", en/pt "12%", es "12 %" */
export function fmtPct(n: number, lang: Lang, digits: 0 | 1 = 0): string {
  const v = fmt(n, digits, lang);
  if (lang === 'tr') return `%${v}`;
  if (lang === 'es') return `${v} %`;
  return `${v}%`;
}

export function usePct() {
  const lang = useLang();
  return (n: number, digits: 0 | 1 = 0) => fmtPct(n, lang, digits);
}

/** "4 · Orta (Medium)"; İngilizcede ad zaten aynıysa parantez yazılmaz */
export function weightLabel(w: YarnWeightInfo, lang: Lang): string {
  const name = w.name[lang];
  return name.toLowerCase() === w.en.toLowerCase() ? `${w.id} · ${name}` : `${w.id} · ${name} (${w.en})`;
}

/** Ondalıklı sayı biçimi kısayolu */
export function useNum() {
  const lang = useLang();
  return (n: number, d: 0 | 1 | 2 = 1) => fmt(n, d, lang);
}
