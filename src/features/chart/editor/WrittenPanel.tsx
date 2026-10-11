import { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Copy } from 'lucide-react';
import type { ChartDoc } from '@/types';
import { useSettings } from '@/store/settings';
import { toast } from '@/store/toast';
import { Segmented } from '@/ui/Segmented';
import { Switch } from '@/ui/Field';
import { Callout } from '@/ui/Callout';
import { SymbolGlyph } from '@/ui/SymbolGlyph';
import { useTerms } from '@/ui/Term';
import { useMsgs } from '@/i18n';
import { fillTerms } from '@/knowledge/terms';
import { chartTextPlain, chartToText } from '@/engine/chart/toText';
import { c2cIntro, c2cRowText, c2cRows } from '@/engine/chart/c2c';
import { useChartPrefs } from '../prefs';
import { CH } from '../i18n';
import { useEditor } from './state';

type Meta = Pick<ChartDoc, 'craft' | 'mode' | 'firstRowRS'>;

export function WrittenPanel({ meta }: { meta: Meta }) {
  const t = useMsgs(CH);
  const { ctx } = useTerms();
  const leftHanded = useSettings((s) => s.leftHanded);
  const compact = useChartPrefs((s) => s.compact);
  const view = useChartPrefs((s) => s.writtenView);
  const style = useChartPrefs((s) => s.symbolStyle);
  const setPrefs = useChartPrefs((s) => s.set);
  const rev = useEditor((s) => s.rev);
  const doc = useEditor((s) => s.doc);
  const c2c = meta.craft === 'crochet' && view === 'c2c';

  const text = useMemo(
    () => chartToText({ ...doc, craft: meta.craft, mode: meta.mode, firstRowRS: meta.firstRowRS }, { terms: ctx, leftHanded, compact }),
    // rev: hücreler yerinde değiştiği için işlem bitince yeniden hesapla
    [rev, doc, meta.craft, meta.mode, meta.firstRowRS, ctx.lang, ctx.trabzan, ctx.crochetEn, leftHanded, compact],
  );
  const letter = (c: number) => doc.palette[c]?.letter ?? 'A';
  const c2cData = useMemo(
    () => (c2c ? c2cRows(doc.width, doc.height, doc.colors, { leftHanded }).map((r) => c2cRowText(r, ctx.lang, letter, leftHanded)) : []),
    [c2c, rev, doc, ctx.lang, leftHanded],
  );

  const copy = async () => {
    const plain = c2c ? [fillTerms(c2cIntro(ctx.lang), ctx), ...c2cData.map((r) => `${r.label}: ${r.text}`)].join('\n') : chartTextPlain(text);
    try {
      await navigator.clipboard.writeText(plain);
      toast(t.textCopied, { tone: 'success' });
    } catch {
      toast(t.readError, { tone: 'warn' });
    }
  };

  return (
    <div className="stack chart-written">
      {meta.craft === 'crochet' && (
        <Segmented<'rows' | 'c2c'>
          value={view}
          onChange={(v) => setPrefs({ writtenView: v })}
          label={t.writtenTitle}
          options={[
            { value: 'rows', label: t.rowByRow },
            { value: 'c2c', label: t.c2c },
          ]}
        />
      )}
      <div className="spread">
        {!c2c ? <Switch checked={compact} onChange={(v) => setPrefs({ compact: v })} label={t.compact} /> : <span className="small muted">{t.c2cNote}</span>}
        <button className="btn btn-ghost btn-sm" onClick={copy}>
          <Copy /> {t.copyText}
        </button>
      </div>

      {c2c ? (
        <>
          <p className="small chart-written-intro">{fillTerms(c2cIntro(ctx.lang), ctx)}</p>
          <ol className="chart-rows">
            {c2cData.map((r, i) => (
              <li key={i}>
                <span className="chart-row-label">{r.label}</span> <span>{r.text}</span>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <p className="chart-written-intro">{text.intro}</p>
          {text.warnings.length > 0 && (
            <Callout tone="warn" title={t.warnings}>
              <ul className="chart-warn-list">
                {text.warnings.slice(0, 6).map((w) => (
                  <li key={w.row}>
                    <b>{text.rows[w.row - 1]?.label}</b>: {w.text}
                  </li>
                ))}
              </ul>
            </Callout>
          )}
          {text.rows.length === 0 ? (
            <p className="muted">{t.noRows}</p>
          ) : (
            <ol className="chart-rows">
              {text.rows.map((r) => (
                <li key={r.row} data-warn={!!r.warning}>
                  <span className="chart-row-label">
                    {r.label}
                    <span className="chart-row-dir" title={r.dir === 'rtl' ? t.readRtl : t.readLtr} aria-label={r.dir === 'rtl' ? t.readRtl : t.readLtr}>
                      {r.dir === 'rtl' ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                    </span>
                  </span>{' '}
                  <span>{r.text}</span>
                  {r.warning && <span className="chart-row-warn">{r.warning}</span>}
                </li>
              ))}
            </ol>
          )}
          {(text.legend.length > 0 || text.colorMode !== 'symbols') && (
            <section>
              <h4 className="chart-sym-group">{t.legend}</h4>
              <ul className="list chart-legend">
                {text.colorMode !== 'symbols' &&
                  doc.palette.map((p) => (
                    <li key={p.id} className="row-nowrap">
                      <span className="swatch" style={{ background: p.hex }} />
                      <span className="small">
                        <b>{p.letter}</b> · {p.name}
                      </span>
                    </li>
                  ))}
                {text.legend.map((l) => (
                  <li key={l.id} className="row-nowrap">
                    <SymbolGlyph symbol={l.id} size={22} framed style={style} weight={8} />
                    <span className="small">
                      <b>{l.name}</b>
                      {meta.craft === 'knit' && l.rs && (
                        <span className="faint">
                          {' '}
                          · {t.rsSide}: {l.rs} · {t.wsSide}: {l.ws}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
