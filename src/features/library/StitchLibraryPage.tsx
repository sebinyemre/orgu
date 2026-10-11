import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import type { Craft } from '@/types';
import { PageHeader } from '@/ui/PageHeader';
import { Segmented } from '@/ui/Segmented';
import { EmptyState } from '@/ui/EmptyState';
import { useTerms } from '@/ui/Term';
import { useLang, useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { PATTERN_CATEGORY_LABEL, STITCH_PATTERNS, multipleText, type PatternCategory } from '@/knowledge/stitchPatterns';
import { LIB } from './i18n';
import { categoriesOf, filterPatterns, type PatternFilter } from './logic';
import { PatternThumb } from './PatternThumb';
import './library.css';

const EMPTY: PatternFilter = { craft: 'all', category: 'all', level: 0, reversible: false, noCurl: false, query: '' };
const KEY = 'ilmek.desenSuzgec';

function readFilter(): PatternFilter {
  try {
    return { ...EMPTY, ...JSON.parse(sessionStorage.getItem(KEY) ?? '{}') };
  } catch {
    return EMPTY;
  }
}

export default function StitchLibraryPage() {
  const t = useMsgs(LIB);
  const c = useMsgs(COMMON);
  const lang = useLang();
  const terms = useTerms();
  const [f, setF] = useState<PatternFilter>(readFilter);
  const update = (patch: Partial<PatternFilter>) =>
    setF((old) => {
      const next = { ...old, ...patch };
      try {
        sessionStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* yoksay */
      }
      return next;
    });
  const list = useMemo(() => filterPatterns(STITCH_PATTERNS, f), [f]);
  const cats = categoriesOf(STITCH_PATTERNS, f.craft);
  const dirty = f.craft !== 'all' || f.category !== 'all' || f.level !== 0 || f.reversible || f.noCurl || f.query.trim() !== '';
  const nameOf = (p: (typeof STITCH_PATTERNS)[number]) => (p.craft === 'crochet' ? terms.fill(p.name[lang]) : p.name[lang]);

  return (
    <div className="page">
      <PageHeader eyebrow={c.groupLibrary} title={c.navPatterns} lede={t.lede} />

      <div className="lib-filters card card-sunken" role="search" aria-label={t.filters}>
        <div className="lib-search">
          <Search aria-hidden />
          <input className="input" type="search" value={f.query} placeholder={t.search} aria-label={t.search} onChange={(e) => update({ query: e.target.value })} />
        </div>
        <div className="row lib-filter-row">
          <Segmented<Craft | 'all'>
            label={`${c.knit} / ${c.crochet}`}
            value={f.craft}
            onChange={(craft) => update({ craft, category: 'all' })}
            options={[
              { value: 'all', label: t.all },
              { value: 'knit', label: c.knit },
              { value: 'crochet', label: c.crochet },
            ]}
          />
          <div className="lib-chips" role="group" aria-label={t.level}>
            {([1, 2, 3] as const).map((l) => (
              <button key={l} type="button" className="chip" data-tone="plum" aria-pressed={f.level === l} onClick={() => update({ level: f.level === l ? 0 : l })}>
                {t.levels[l]}
              </button>
            ))}
          </div>
          <div className="lib-chips" role="group">
            <button type="button" className="chip" data-tone="sage" aria-pressed={f.reversible} onClick={() => update({ reversible: !f.reversible })}>
              {t.reversible}
            </button>
            <button type="button" className="chip" data-tone="sage" aria-pressed={f.noCurl} onClick={() => update({ noCurl: !f.noCurl })}>
              {t.noCurl}
            </button>
          </div>
        </div>
        <div className="lib-chips" role="group" aria-label={t.category}>
          <button type="button" className="chip" data-tone="accent" aria-pressed={f.category === 'all'} onClick={() => update({ category: 'all' })}>
            {t.all}
          </button>
          {cats.map((cat: PatternCategory) => (
            <button
              key={cat}
              type="button"
              className="chip"
              data-tone="accent"
              aria-pressed={f.category === cat}
              onClick={() => update({ category: f.category === cat ? 'all' : cat })}
            >
              {PATTERN_CATEGORY_LABEL[cat][lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="spread lib-count">
        <span className="small muted" aria-live="polite">
          {t.results(list.length)}
        </span>
        {dirty && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => update(EMPTY)}>
            <X />
            {t.clearFilters}
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState title={t.noResults}>
          <button type="button" className="btn btn-soft" onClick={() => update(EMPTY)}>
            {t.clearFilters}
          </button>
        </EmptyState>
      ) : (
        <div className="grid-3">
          {list.map((p) => {
            const name = nameOf(p);
            return (
              <Link key={p.id} to={`/desenler/${p.id}`} className="card card-link card-flush lib-card">
                <PatternThumb p={p} label={name} />
                <span className="lib-card-body">
                  <span className="lib-card-top">
                    <span className="card-title">{name}</span>
                  </span>
                  <span className="small muted">{multipleText(p.flat, lang)}</span>
                  <span className="row lib-badges">
                    <span className="chip">{p.craft === 'knit' ? c.knit : c.crochet}</span>
                    <span className="chip" data-tone="plum">
                      {t.levels[p.level]}
                    </span>
                    {p.reversible && (
                      <span className="chip" data-tone="sage">
                        {t.reversible}
                      </span>
                    )}
                    {p.curls ? (
                      <span className="chip" data-tone="mustard">
                        {t.curls}
                      </span>
                    ) : (
                      <span className="chip" data-tone="sage">
                        {t.noCurl}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
