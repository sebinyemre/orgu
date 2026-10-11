import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, Search } from 'lucide-react';
import { useLang, useMsgs } from '@/i18n';
import { Tabs } from '@/ui/Tabs';
import { Callout } from '@/ui/Callout';
import { HOOK_SIZES, NEEDLE_SIZES } from '@/knowledge/tools';
import { weightFromTool } from '@/knowledge/yarnWeights';
import { fmt } from '@/lib/format';
import { CALC } from '../i18n';
import { cleanUs, matchSize } from '../logic';
import { CalcLayout, HowTo, RelatedLessons } from '../ui';

export default function NeedleSizesCalc() {
  const t = useMsgs(CALC);
  const lang = useLang();
  const [tab, setTab] = useState<'knit' | 'crochet'>('knit');
  const [q, setQ] = useState('');
  const list = tab === 'knit' ? NEEDLE_SIZES : HOOK_SIZES;
  const hits = useMemo(() => new Set(list.filter((s) => matchSize(s, q)).map((s) => s.mm)), [list, q]);
  const firstHit = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    if (hits.size)
      firstHit.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
  }, [hits]);
  let marked = false;

  return (
    <CalcLayout
      id="sis-tig-olcu"
      icon={<ArrowLeftRight />}
      result={
        <div className="stack">
          <Callout tone="info">{t.sizes.metricNote}</Callout>
          <Callout tone="warn">{t.sizes.ukNote}</Callout>
        </div>
      }
      after={
        <>
          <HowTo>{t.sizes.howTo}</HowTo>
          <RelatedLessons ids={['haz-numaralar', 'haz-ip-secimi']} />
        </>
      }
    >
      <Tabs
        tabs={[
          { id: 'knit', label: t.sizes.needles },
          { id: 'crochet', label: t.sizes.hooks },
        ]}
        value={tab}
        onChange={setTab}
      />
      <div className="stack">
        <div className="calc-search">
          <Search aria-hidden />
          <input className="input" type="search" value={q} placeholder={t.sizes.search} aria-label={t.sizes.search} onChange={(e) => setQ(e.target.value)} />
        </div>
        {q.trim() && <div className="small muted">{hits.size ? t.sizes.matches(hits.size) : t.sizes.noMatch}</div>}
        <div className="table-wrap calc-size-table">
          <table className="table">
            <thead>
              <tr>
                <th>{t.sizes.colMm}</th>
                <th>{t.sizes.colUs}</th>
                <th>{t.sizes.colUk}</th>
                <th>{t.sizes.colWeight}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const us = cleanUs(s.us, s.steel);
                const hit = hits.has(s.mm);
                const ref = hit && !marked ? firstHit : undefined;
                if (hit) marked = true;
                const w = weightFromTool(s.mm, tab);
                return (
                  <tr key={s.mm} aria-current={hit ? 'true' : undefined} ref={ref}>
                    <td className="tabular">
                      <strong>{fmt(s.mm, 2, lang)}</strong>
                    </td>
                    <td>
                      {us.us || <span className="faint">·</span>}
                      {us.steel && (
                        <span className="chip" style={{ marginLeft: 6 }}>
                          {t.sizes.steel}
                        </span>
                      )}
                    </td>
                    <td>{s.uk ?? <span className="faint">·</span>}</td>
                    <td className="small">
                      {us.steel ? (
                        <span className="faint">{w.name[lang]}</span>
                      ) : (
                        <>
                          {w.id} · {w.name[lang]}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </CalcLayout>
  );
}
