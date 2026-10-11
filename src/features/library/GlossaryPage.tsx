import { useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import type { Lang } from '@/types';
import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { SymbolGlyph } from '@/ui/SymbolGlyph';
import { getTermsCtx, useTerms } from '@/ui/Term';
import { fillTerms } from '@/knowledge/terms';
import { LANGS, useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { TechniqueLink } from '@/features/learn/TechniqueLink';
import { CROCHET_BASICS, KNIT_VOCAB, crochetAbbr, crochetName, dialectOf, yarnOverText, type CrochetBasicId, type TermsCtx } from '@/knowledge/terms';
import { CROCHET_SYMBOLS, KNIT_SYMBOLS, symbolName, type ChartSymbol } from '@/knowledge/symbols';
import { HOOK_SIZES, NEEDLE_SIZES } from '@/knowledge/tools';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import { fmt, normalizeSearch } from '@/lib/format';
import { cleanUs } from '@/features/calculators/logic';
import { CALC } from '@/features/calculators/i18n';
import { LIB } from './i18n';
import { GLOSS_GROUPS, WEIGHT_NAMES, glossaryRows, type GlossCell, type GlossGroup, type GlossRow } from './glossary';
import { columnOrder, searchGlossary } from './logic';
import './library.css';

const ENDONYM: Record<Lang, string> = Object.fromEntries(LANGS.map((l) => [l.id, l.name])) as Record<Lang, string>;

function Cell({ c }: { c: GlossCell }) {
  return (
    <>
      <span className="lib-term">{c.text}</span>
      {c.abbr && <span className="lib-abbr">{c.abbr}</span>}
    </>
  );
}

function LangCell({ r, l }: { r: GlossRow; l: Lang }) {
  const t = useMsgs(LIB);
  if (l === 'tr' && r.tr2) {
    return (
      <span className="lib-cell">
        <span className="lib-alt">
          <span className="lib-alt-label">{t.sysA}</span>
          <Cell c={r.tr} />
        </span>
        <span className="lib-alt">
          <span className="lib-alt-label">{t.sysB}</span>
          <Cell c={r.tr2} />
        </span>
      </span>
    );
  }
  if (l === 'en' && r.uk) {
    return (
      <span className="lib-cell">
        <span className="lib-alt">
          <span className="lib-alt-label">US</span>
          <Cell c={r.en} />
        </span>
        <span className="lib-alt">
          <span className="lib-alt-label">UK</span>
          <Cell c={r.uk} />
        </span>
      </span>
    );
  }
  return (
    <span className="lib-cell">
      <Cell c={r[l]} />
    </span>
  );
}

const header = (l: Lang) => (l === 'en' ? `${ENDONYM.en} (US / UK)` : ENDONYM[l]);

function GlossTable({ rows }: { rows: GlossRow[] }) {
  const lang = useLang();
  const cols = columnOrder(lang);
  return (
    <div className="table-wrap lib-gwrap">
      <table className="table lib-gtable">
        <thead>
          <tr>
            {cols.map((l, i) => (
              <th key={l} className={i === 0 ? 'lib-me' : undefined} scope="col">
                {header(l)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {cols.map((l, i) => (
                <td key={l} className={i === 0 ? 'lib-me' : undefined} data-label={l === 'en' ? 'EN (US / UK)' : l.toUpperCase()}>
                  <LangCell r={r} l={l} />
                  {i === 0 && r.lessonId && (
                    <span className="lib-lesson">
                      <TechniqueLink lessonId={r.lessonId} iconOnly />
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TRAP_IDS: CrochetBasicId[] = ['sc', 'hdc', 'dc', 'tr', 'dtr'];

function TrapCard() {
  const t = useMsgs(LIB);
  const terms = useTerms();
  const dialect = dialectOf(terms.ctx);
  const cols: { key: string; label: string; ctx: TermsCtx }[] = [
    { key: 'en-us', label: 'US', ctx: { lang: 'en', trabzan: 'ipatma', crochetEn: 'us' } },
    { key: 'en-uk', label: 'UK', ctx: { lang: 'en', trabzan: 'ipatma', crochetEn: 'uk' } },
    { key: 'tr-ipatma', label: `TR · ${t.sysA}`, ctx: { lang: 'tr', trabzan: 'ipatma', crochetEn: 'us' } },
    { key: 'tr-ingilizce', label: `TR · ${t.sysB}`, ctx: { lang: 'tr', trabzan: 'ingilizce', crochetEn: 'us' } },
    { key: 'es', label: ENDONYM.es, ctx: { lang: 'es', trabzan: 'ipatma', crochetEn: 'us' } },
    { key: 'pt', label: ENDONYM.pt, ctx: { lang: 'pt', trabzan: 'ipatma', crochetEn: 'us' } },
  ];
  return (
    <section className="card card-stitched lib-trap stack" aria-labelledby="lib-trap-title">
      <h2 id="lib-trap-title" className="lib-trap-title">
        {t.trapTitle}
      </h2>
      <div className="lib-trap-text">
        {t.trapText.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="table-wrap">
        <table className="table lib-trap-table">
          <thead>
            <tr>
              <th scope="col">{t.symbol}</th>
              <th scope="col">{t.yarnOvers}</th>
              {cols.map((c) => (
                <th key={c.key} scope="col" className={c.key === dialect ? 'lib-me' : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRAP_IDS.map((id) => (
              <tr key={id}>
                <td>
                  <SymbolGlyph symbol={CROCHET_BASICS[id].symbol} size={26} />
                </td>
                <td className="tabular">
                  <strong>{CROCHET_BASICS[id].yarnOvers}</strong>
                </td>
                {cols.map((c) => (
                  <td key={c.key} className={c.key === dialect ? 'lib-me' : undefined}>
                    <span className="lib-term">{crochetName(id, c.ctx)}</span>
                    <span className="lib-abbr">{crochetAbbr(id, c.ctx)}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Tığ sembolü için kısa açıklama: temel ilmeklerde ip atma sayısı ve US/UK kısaltması */
function crochetHow(s: ChartSymbol, lang: Lang): string {
  if (s.basic && s.group === 'temel' && s.basic !== 'ch' && s.basic !== 'slst') {
    const b = CROCHET_BASICS[s.basic];
    const ref = `US ${b.us} · UK ${b.uk}`;
    return b.yarnOvers ? `${yarnOverText(b.yarnOvers, lang)} · ${ref}` : ref;
  }
  return fillTerms(s.hint[lang], getTermsCtx());
}

function SymbolTable({ list, knit, query }: { list: ChartSymbol[]; knit: boolean; query: string }) {
  const t = useMsgs(LIB);
  const lang = useLang();
  const terms = useTerms();
  const V = KNIT_VOCAB[lang];
  const q = normalizeSearch(query.trim());
  const shown = list.filter((s) => !q || normalizeSearch([s.en, ...Object.values(s.name), symbolName(s, terms.ctx)].join(' ')).includes(q));
  if (!shown.length) return null;
  return (
    <div className="table-wrap lib-gwrap">
      <table className="table lib-gtable lib-symtable">
        <thead>
          <tr>
            <th scope="col">CYC</th>
            <th scope="col">JIS</th>
            <th scope="col" className="lib-me">
              {t.colName}
            </th>
            {knit ? (
              <>
                <th scope="col">{t.colRs}</th>
                <th scope="col">{t.colWs}</th>
              </>
            ) : (
              <th scope="col">{t.colHow}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {shown.map((s) => (
            <tr key={s.id}>
              <td data-label="CYC">
                <SymbolGlyph symbol={s} size={30} framed style="cyc" />
              </td>
              <td data-label="JIS">
                <SymbolGlyph symbol={s} size={30} framed style="jis" />
              </td>
              <td className="lib-me" data-label={t.colName}>
                <span className="lib-term">{symbolName(s, terms.ctx)}</span>
                <span className="lib-abbr">{s.en}</span>
              </td>
              {knit ? (
                <>
                  <td data-label={`${V.rsShort} · ${t.colRs}`}>{s.rs?.[lang]}</td>
                  <td data-label={`${V.wsShort} · ${t.colWs}`}>{s.ws?.[lang]}</td>
                </>
              ) : (
                <td data-label={t.colHow}>{crochetHow(s, lang)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SizeMini({ title, list, steel }: { title: string; list: typeof NEEDLE_SIZES; steel: string }) {
  const lang = useLang();
  return (
    <div className="stack-sm">
      <div className="stat-label">{title}</div>
      <div className="table-wrap lib-size-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">mm</th>
              <th scope="col">US</th>
              <th scope="col">UK</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => {
              const us = cleanUs(s.us, s.steel);
              return (
                <tr key={s.mm}>
                  <td className="tabular">
                    <strong>{fmt(s.mm, 2, lang)}</strong>
                  </td>
                  <td>
                    {us.us || '·'}
                    {us.steel && <span className="faint small"> ({steel})</span>}
                  </td>
                  <td>{s.uk ?? '·'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Section({ id, title, children, sref }: { id: string; title: ReactNode; children: ReactNode; sref?: (el: HTMLElement | null) => void }) {
  return (
    <section id={id} ref={sref} className="lib-gsection">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}

export default function GlossaryPage() {
  const t = useMsgs(LIB);
  const c = useMsgs(COMMON);
  const calc = useMsgs(CALC);
  const lang = useLang();
  const [q, setQ] = useState('');
  const rows = useMemo(() => searchGlossary(glossaryRows(), q), [q]);
  const refs = useRef<Partial<Record<string, HTMLElement | null>>>({});
  const groups = GLOSS_GROUPS.map((g) => ({ g, list: rows.filter((r) => r.group === g) })).filter((x) => x.list.length);
  const searching = q.trim() !== '';
  const jump = (id: string) => refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const extra: { id: string; label: string }[] = searching
    ? []
    : [
        { id: 'semboller', label: t.symbolsTitle },
        { id: 'numaralar', label: t.toolsTitle },
        { id: 'kalinliklar', label: t.weightsTitle },
      ];

  return (
    <div className="page">
      <PageHeader eyebrow={c.groupLibrary} title={c.navGlossary} lede={t.glossLede} />
      <div className="lib-gtools">
        <div className="lib-search">
          <Search aria-hidden />
          <input className="input" type="search" value={q} placeholder={t.glossSearch} aria-label={t.glossSearch} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="lib-chips lib-jump" role="navigation" aria-label={c.navGlossary}>
          {groups.map(({ g }) => (
            <button key={g} type="button" className="chip" onClick={() => jump(`g-${g}`)}>
              {t.groups[g as GlossGroup]}
            </button>
          ))}
          {extra.map((x) => (
            <button key={x.id} type="button" className="chip" data-tone="denim" onClick={() => jump(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
        <span className="small muted" aria-live="polite">
          {t.terms(rows.length)}
        </span>
      </div>

      {groups.length === 0 && <EmptyState title={t.glossEmpty} />}

      {groups.map(({ g, list }) => (
        <Section key={g} id={`g-${g}`} title={t.groups[g]} sref={(el) => (refs.current[`g-${g}`] = el)}>
          {g === 'tig' && <TrapCard />}
          <GlossTable rows={list} />
        </Section>
      ))}

      {!searching && !groups.some((x) => x.g === 'tig') && <TrapCard />}

      <Section id="semboller" title={t.symbolsTitle} sref={(el) => (refs.current.semboller = el)}>
        <p className="muted lib-section-lede">{t.symbolsText}</p>
        <h3 className="lib-subtitle">{c.knit}</h3>
        <SymbolTable list={KNIT_SYMBOLS} knit query={q} />
        <h3 className="lib-subtitle">{c.crochet}</h3>
        <SymbolTable list={CROCHET_SYMBOLS} knit={false} query={q} />
      </Section>

      {!searching && (
        <>
          <Section id="numaralar" title={t.toolsTitle} sref={(el) => (refs.current.numaralar = el)}>
            <div className="lib-size-grid">
              <SizeMini title={t.needles} list={NEEDLE_SIZES} steel={calc.sizes.steel} />
              <SizeMini title={t.hooks} list={HOOK_SIZES} steel={calc.sizes.steel} />
            </div>
            <Link className="btn btn-soft btn-sm lib-more" to="/hesap/sis-tig-olcu">
              {t.toolsMore}
              <ArrowRight />
            </Link>
          </Section>

          <Section id="kalinliklar" title={t.weightsTitle} sref={(el) => (refs.current.kalinliklar = el)}>
            <div className="table-wrap lib-gwrap">
              <table className="table lib-gtable lib-weights">
                <thead>
                  <tr>
                    <th scope="col" className="lib-me">
                      {t.colWeight}
                    </th>
                    <th scope="col">US</th>
                    <th scope="col">UK</th>
                    <th scope="col">WPI</th>
                    <th scope="col">{t.colNeedle}</th>
                    <th scope="col">{t.colHook}</th>
                  </tr>
                </thead>
                <tbody>
                  {YARN_WEIGHTS.map((w) => (
                    <tr key={w.id}>
                      <td className="lib-me" data-label={t.colWeight}>
                        <span className="lib-term">
                          {w.id} · {w.name[lang]}
                        </span>
                        <span className="lib-abbr">{w.en}</span>
                      </td>
                      <td data-label="US">{WEIGHT_NAMES[w.id].us}</td>
                      <td data-label="UK">{WEIGHT_NAMES[w.id].uk}</td>
                      <td data-label="WPI" className="tabular">
                        {w.wpi[0]}–{w.wpi[1]}
                      </td>
                      <td data-label={t.colNeedle} className="tabular">
                        {fmt(w.needleMm[0], 2, lang)}–{fmt(w.needleMm[1], 2, lang)}
                      </td>
                      <td data-label={t.colHook} className="tabular">
                        {fmt(w.hookMm[0], 2, lang)}–{fmt(w.hookMm[1], 2, lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
