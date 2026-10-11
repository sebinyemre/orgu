import { useMemo } from 'react';
import type { Craft } from '@/types';
import { SYMBOL_BY_ID, SYMBOL_GROUP_LABEL, symbolName, symbolsFor, type ChartSymbol, type SymbolStyle } from '@/knowledge/symbols';
import { Segmented } from '@/ui/Segmented';
import { SymbolGlyph } from '@/ui/SymbolGlyph';
import { useTerms } from '@/ui/Term';
import { fillTerms } from '@/knowledge/terms';
import { useMsgs } from '@/i18n';
import { usedSymbols } from '@/engine/chart/grid';
import { TechniqueLink } from '@/features/learn/TechniqueLink';
import { useChartPrefs } from '../prefs';
import { CH } from '../i18n';
import { pickSymbol, useEditor } from './state';

export function StyleSwitch() {
  const t = useMsgs(CH);
  const style = useChartPrefs((s) => s.symbolStyle);
  const set = useChartPrefs((s) => s.set);
  return (
    <div className="field">
      <span className="label">{t.symbolStyle}</span>
      <Segmented<SymbolStyle>
        value={style}
        onChange={(v) => set({ symbolStyle: v })}
        label={t.symbolStyle}
        options={[
          { value: 'cyc', label: t.styleCyc },
          { value: 'jis', label: t.styleJis },
        ]}
      />
    </div>
  );
}

export function SymbolsPanel({ craft }: { craft: Craft }) {
  const t = useMsgs(CH);
  const { ctx } = useTerms();
  const style = useChartPrefs((s) => s.symbolStyle);
  const symbol = useEditor((s) => s.symbol);
  const paint = useEditor((s) => s.paint);
  const rev = useEditor((s) => s.rev);
  const doc = useEditor((s) => s.doc);
  const syms = symbolsFor(craft);
  const groups = useMemo(() => {
    const g = new Map<ChartSymbol['group'], ChartSymbol[]>();
    for (const s of syms) g.set(s.group, [...(g.get(s.group) ?? []), s]);
    const order = Object.keys(SYMBOL_GROUP_LABEL);
    return [...g.entries()].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  }, [syms]);
  const used = useMemo(() => usedSymbols(doc).map((id) => SYMBOL_BY_ID[id]).filter(Boolean), [rev, doc]);
  const sel = SYMBOL_BY_ID[symbol];
  const lang = ctx.lang;

  return (
    <div className="stack chart-symbols">
      <StyleSwitch />
      {groups.map(([g, list]) => (
        <section key={g}>
          <h4 className="chart-sym-group">{SYMBOL_GROUP_LABEL[g][lang]}</h4>
          <div className="chart-sym-grid">
            {list.map((s) => {
              const name = symbolName(s, ctx);
              const active = symbol === s.id && paint !== 'color';
              return (
                <button key={s.id} type="button" className="chart-sym" data-span={s.span ?? 1} aria-pressed={active} title={`${name} (${s.en})`} aria-label={name} onClick={() => pickSymbol(s.id)}>
                  <SymbolGlyph symbol={s} size={26} framed style={style} weight={8} title={name} />
                  <span className="chart-sym-name">{name}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {sel && (
        <div className="card card-sunken chart-sym-info">
          <div className="row-nowrap" style={{ alignItems: 'flex-start' }}>
            <SymbolGlyph symbol={sel} size={34} framed style={style} weight={8} />
            <div className="grow">
              <div style={{ fontWeight: 800 }}>
                {symbolName(sel, ctx)} <span className="chip">{sel.en}</span>
              </div>
              <div className="small muted">{fillTerms(sel.hint[lang], ctx)}</div>
              {sel.span && sel.span > 1 && <div className="xsmall faint">{t.span(sel.span)}</div>}
              {sel.rs?.[lang] && craft === 'knit' && (
                <div className="xsmall" style={{ marginTop: 4 }}>
                  <b>{t.rsSide}:</b> {sel.rs[lang]} · <b>{t.wsSide}:</b> {sel.ws?.[lang]}
                </div>
              )}
            </div>
            {sel.lessonId && <TechniqueLink lessonId={sel.lessonId} iconOnly />}
          </div>
        </div>
      )}

      <section>
        <h4 className="chart-sym-group">{t.usedSymbols}</h4>
        {used.length ? (
          <ul className="list chart-legend">
            {used.map((s) => (
              <li key={s.id} className="row-nowrap">
                <SymbolGlyph symbol={s} size={24} framed style={style} weight={8} />
                <span className="grow small">
                  <b>{symbolName(s, ctx)}</b>
                  {craft === 'knit' && s.rs?.[lang] ? (
                    <span className="faint">
                      {' '}
                      · {t.rsSide}: {s.rs[lang]} · {t.wsSide}: {s.ws?.[lang]}
                    </span>
                  ) : (
                    <span className="faint"> · {fillTerms(s.hint[lang], ctx)}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="small muted">{craft === 'knit' ? t.noUsedSymbols : ''}</p>
        )}
      </section>
    </div>
  );
}
