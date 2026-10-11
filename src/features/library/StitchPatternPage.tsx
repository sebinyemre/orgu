import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calculator, ChevronLeft, ChevronRight, Scissors } from 'lucide-react';
import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { Tabs } from '@/ui/Tabs';
import { Segmented } from '@/ui/Segmented';
import { Callout } from '@/ui/Callout';
import { NumberInput } from '@/ui/Field';
import { SymbolGlyph } from '@/ui/SymbolGlyph';
import { useTerms } from '@/ui/Term';
import { useSettings } from '@/store/settings';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { ChartView } from '@/features/chart/ChartView';
import { FabricPreview } from '@/features/chart/FabricPreview';
import { TechniqueLink } from '@/features/learn/TechniqueLink';
import { PATTERN_BY_ID, PATTERN_CATEGORY_LABEL, STITCH_PATTERNS, multipleText, patternChartCells, type StitchPattern } from '@/knowledge/stitchPatterns';
import { SYMBOL_BY_ID, symbolName, type SymbolStyle } from '@/knowledge/symbols';
import { CROCHET_BASICS, KNIT_VOCAB, yarnOverText, type CrochetBasicId } from '@/knowledge/terms';
import { castOnFor } from '@/engine/math/gauge';
import { gaugeSpanCm, niceDefault, perTenCm } from '@/features/calculators/logic';
import { LengthInput, useLen, useSpanText, useUnits } from '@/features/calculators/ui';
import { LIB } from './i18n';
import { englishName, tilesFor } from './logic';
import './library.css';

/** "Kaç ilmek?" küçük hesaplayıcısı: jarse ölçüsü + genişlik → desen katına uyan ilmek */
function MiniCalc({ p }: { p: StitchPattern }) {
  const t = useMsgs(LIB);
  const units = useUnits();
  const len = useLen();
  const span = useSpanText();
  const [width, setWidth] = useState(() => niceDefault(25, 10, units));
  const [gauge, setGauge] = useState(p.craft === 'knit' ? 20 : 15);
  const perTen = perTenCm(gauge, gaugeSpanCm(units));
  // lastik gibi büzen desenlerde 10 cm'ye daha çok ilmek sığar
  const r = width > 0 && perTen > 0 ? castOnFor(width, perTen / p.widthFactor, p.flat.multiple, p.flat.plus) : null;
  const other = r && (r.best.stitches === r.lower.stitches ? r.upper : r.lower);
  return (
    <div className="card stack lib-calc">
      <h2 className="card-title">{t.calcTitle}</h2>
      <div className="lib-calc-grid">
        <div className="field">
          <label className="label" htmlFor="lib-w">
            {t.calcWidth}
          </label>
          <LengthInput id="lib-w" cm={width} onChange={setWidth} />
        </div>
        <div className="field">
          <label className="label" htmlFor="lib-g">
            {p.craft === 'knit' ? t.calcGaugeKnit(span) : t.calcGaugeCrochet(span)}
          </label>
          <NumberInput id="lib-g" value={gauge} min={1} onChange={setGauge} />
        </div>
      </div>
      {r && (
        <div className="lib-calc-result" aria-live="polite">
          <strong className="lib-calc-n">{p.craft === 'knit' ? t.calcCastOn(r.best.stitches) : t.calcMake(r.best.stitches)}</strong>
          <span className="muted">{t.calcWidthIs(len(r.best.widthCm))}</span>
          {other && other.stitches !== r.best.stitches && <span className="small faint">{t.calcOther(other.stitches, len(other.widthCm))}</span>}
          {p.widthFactor !== 1 && <span className="small faint">{t.calcFactor}</span>}
        </div>
      )}
      <Link className="btn btn-ghost btn-sm lib-calc-more" to={`/hesap/ilmek-sayisi?desen=${p.id}`}>
        <Calculator />
        {t.calcMore}
      </Link>
    </div>
  );
}

function Instructions({ p, which }: { p: StitchPattern; which: 'flat' | 'round' }) {
  const t = useMsgs(LIB);
  const lang = useLang();
  const terms = useTerms();
  const w = which === 'round' && p.round ? p.round : p.flat;
  const fill = (s: string) => (p.craft === 'crochet' ? terms.fill(s) : s);
  return (
    <div className="stack">
      <ol className="lib-rows">
        {w.rows.map((r, i) => (
          <li key={i}>
            <span className="lib-row-label">{fill(r.label[lang])}</span>
            <span className="lib-row-text">{fill(r.text[lang])}</span>
          </li>
        ))}
      </ol>
      {w.repeat && (
        <p className="lib-repeat">
          <strong>{t.repeat}:</strong> {fill(w.repeat[lang])}
        </p>
      )}
      {w.note && <Callout tone="info">{fill(w.note[lang])}</Callout>}
    </div>
  );
}

function ChartBlock({ p, mode }: { p: StitchPattern; mode: 'flat' | 'round' }) {
  const t = useMsgs(LIB);
  const lang = useLang();
  const terms = useTerms();
  const [style, setStyle] = useState<SymbolStyle>('cyc');
  const cells = useMemo(() => {
    const c = patternChartCells(p);
    // tek sıralık grafikler (lastik, jarse) birkaç sıra tekrarlanarak gösterilir
    return c && c.height === 1 ? { ...c, height: 4, symbols: [...c.symbols, ...c.symbols, ...c.symbols, ...c.symbols] } : c;
  }, [p]);
  if (!cells) return null;
  const ids = [...new Set(cells.symbols.filter(Boolean))];
  const syms = ids.map((id) => SYMBOL_BY_ID[id]).filter(Boolean);
  const hasJis = syms.some((s) => s.jis);
  const V = KNIT_VOCAB[lang];
  /** "US dc · 1 ip atma"; İngilizcede karşı geleneğin kısaltması */
  const basicRef = (id: CrochetBasicId) => {
    const b = CROCHET_BASICS[id];
    const ref = lang === 'en' ? (terms.ctx.crochetEn === 'uk' ? `US ${b.us}` : `UK ${b.uk}`) : `US ${b.us}`;
    return b.yarnOvers ? `${ref} · ${yarnOverText(b.yarnOvers, lang)}` : ref;
  };
  const name = p.craft === 'crochet' ? terms.fill(p.name[lang]) : p.name[lang];
  const tiles = tilesFor(cells.width, cells.height, 30, 18);
  return (
    <div className="lib-chart-grid">
      <section className="card stack">
        <div className="spread">
          <h2 className="card-title">{t.chart}</h2>
          {hasJis && (
            <Segmented<SymbolStyle>
              label={t.style}
              value={style}
              onChange={setStyle}
              options={[
                { value: 'cyc', label: t.styleCyc },
                { value: 'jis', label: t.styleJis },
              ]}
            />
          )}
        </div>
        <div className="lib-chart-wrap">
          <ChartView
            width={cells.width}
            height={cells.height}
            symbols={cells.symbols}
            craft={p.craft}
            mode={mode}
            firstRowRS
            cell={24}
            symbolStyle={style}
            ariaLabel={`${t.chart}: ${name}`}
          />
        </div>
        {p.chartIsApprox && <Callout tone="warn">{t.chartApprox}</Callout>}
        <p className="small muted" style={{ margin: 0 }}>
          {p.craft === 'knit' ? t.chartKnit : t.chartCrochet}
        </p>
        <div className="stack-sm">
          <span className="stat-label">{t.legend}</span>
          <ul className="lib-legend">
            {syms.map((s) => (
              <li key={s.id}>
                <SymbolGlyph symbol={s} size={s.span && s.span > 2 ? 18 : 28} framed style={style} />
                <span className="grow">
                  <strong>{symbolName(s, terms.ctx)}</strong>
                  <span className="small muted lib-legend-how">
                    {p.craft === 'knit' && s.rs && s.ws ? (
                      <>
                        {V.rsShort}: {s.rs[lang]} · {V.wsShort}: {s.ws[lang]}
                      </>
                    ) : s.basic && s.group === 'temel' && s.basic !== 'ch' ? (
                      basicRef(s.basic)
                    ) : (
                      s.hint[lang]
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="card stack">
        <h2 className="card-title">{p.craft === 'crochet' ? t.fabricCrochet : t.fabric}</h2>
        <div className="lib-fabric-wrap">
          <FabricPreview
            width={cells.width}
            height={cells.height}
            symbols={cells.symbols}
            craft={p.craft}
            yarnColor="#d9c6a5"
            tileX={tiles.x}
            tileY={tiles.y}
            stitchPx={14}
            ariaLabel={`${p.craft === 'crochet' ? t.fabricCrochet : t.fabric}: ${name}`}
          />
        </div>
      </section>
    </div>
  );
}

export default function StitchPatternPage() {
  const { patternId } = useParams();
  return <PatternView key={patternId} patternId={patternId} />;
}

function PatternView({ patternId }: { patternId?: string }) {
  const t = useMsgs(LIB);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const terms = useTerms();
  const crochetEn = useSettings((s) => s.crochetEn);
  const p = PATTERN_BY_ID[patternId ?? ''];
  const [tab, setTab] = useState<'flat' | 'round'>('flat');

  if (!p) {
    return (
      <div className="page">
        <EmptyState
          title={t.notFound}
          action={
            <Link className="btn btn-primary" to="/desenler">
              {c.navPatterns}
            </Link>
          }
        />
      </div>
    );
  }

  const fill = (s: string) => (p.craft === 'crochet' ? terms.fill(s) : s);
  const name = fill(p.name[lang]);
  const en = englishName(p, crochetEn);
  const idx = STITCH_PATTERNS.indexOf(p);
  const prev = STITCH_PATTERNS[idx - 1];
  const next = STITCH_PATTERNS[idx + 1];
  const mode = tab === 'round' && p.round ? 'round' : 'flat';
  const scarf = `/tarif?tur=${p.craft === 'crochet' ? 'atki-tig' : 'atki'}&desen=${p.id}`;

  return (
    <div className="page lib-pattern">
      <Link to="/desenler" className="btn btn-ghost btn-sm lib-back">
        <ArrowLeft />
        {c.navPatterns}
      </Link>
      <PageHeader
        eyebrow={PATTERN_CATEGORY_LABEL[p.category][lang]}
        title={name}
        lede={fill(p.summary[lang])}
        actions={
          <Link className="btn btn-primary" to={scarf}>
            <Scissors />
            {p.craft === 'crochet' ? t.makeScarfCrochet : t.makeScarfKnit}
          </Link>
        }
      />
      <div className="row lib-meta">
        <span className="chip">{p.craft === 'knit' ? c.knit : c.crochet}</span>
        <span className="chip" data-tone="plum">
          {t.level}: {t.levels[p.level]}
        </span>
        {p.reversible && (
          <span className="chip" data-tone="sage">
            {t.reversible}
          </span>
        )}
        <span className="chip" data-tone={p.curls ? 'mustard' : 'sage'}>
          {p.curls ? t.curls : t.noCurl}
        </span>
        {lang !== 'en' && (
          <span className="small muted">
            {t.inEnglish}: <em>{en}</em>
          </span>
        )}
        {p.aka?.length ? (
          <span className="small muted">
            {t.aka}: {p.aka.map((a) => fill(a[lang])).join(', ')}
          </span>
        ) : null}
      </div>

      <div className="lib-top-grid">
        <section className="card stack">
          <div className="lib-rules">
            <div className="stat-label">{t.rule}</div>
            <div className="lib-rule-big">{multipleText(p.flat, lang)}</div>
            {p.round && <div className="small muted">{t.roundRule(multipleText(p.round, lang))}</div>}
          </div>
          {p.round ? (
            <Tabs
              tabs={[
                { id: 'flat', label: t.flat },
                { id: 'round', label: t.round },
              ]}
              value={tab}
              onChange={setTab}
            />
          ) : (
            <div className="label">{t.flat}</div>
          )}
          <Instructions p={p} which={mode} />
        </section>
        <MiniCalc p={p} />
      </div>

      <ChartBlock p={p} mode={mode} />

      <div className="lib-top-grid">
        <section className="card stack">
          <h2 className="card-title">{t.uses}</h2>
          <div className="row">
            {p.uses.map((u) => (
              <span key={u.en} className="chip" data-tone="sage">
                {u[lang]}
              </span>
            ))}
          </div>
          {p.lessonIds.length > 0 && (
            <>
              <div className="stat-label">{t.lessons}</div>
              <ul className="lib-lessons">
                {p.lessonIds.map((id) => (
                  <li key={id}>
                    <TechniqueLink lessonId={id} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
        {p.tips.length > 0 && (
          <Callout tone="prof">
            <ul className="lib-tips">
              {p.tips.map((tip, i) => (
                <li key={i}>{fill(tip[lang])}</li>
              ))}
            </ul>
          </Callout>
        )}
      </div>

      <nav className="lib-pager" aria-label={c.navPatterns}>
        {prev ? (
          <Link className="btn btn-ghost" to={`/desenler/${prev.id}`}>
            <ChevronLeft />
            <span>
              <span className="xsmall faint lib-pager-label">{t.prev}</span>
              {prev.craft === 'crochet' ? terms.fill(prev.name[lang]) : prev.name[lang]}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="btn btn-ghost lib-pager-next" to={`/desenler/${next.id}`}>
            <span>
              <span className="xsmall faint lib-pager-label">{t.next}</span>
              {next.craft === 'crochet' ? terms.fill(next.name[lang]) : next.name[lang]}
            </span>
            <ChevronRight />
          </Link>
        ) : (
          <Link className="btn btn-ghost" to="/desenler">
            {c.navPatterns}
            <ArrowRight />
          </Link>
        )}
      </nav>
    </div>
  );
}
