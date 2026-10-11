/**
 * Eserler galerisi (Yarat dünyasının ana sayfası): zanaat, zorluk, tür ve aramayla süzülen eser kartları.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, GraduationCap, NotebookPen, Search, X } from 'lucide-react';
import type { Craft } from '@/types';
import { PageHeader } from '@/ui/PageHeader';
import { Segmented } from '@/ui/Segmented';
import { Tape } from '@/ui/Tape';
import { useLang, useMsgs } from '@/i18n';
import { useTerms } from '@/ui/Term';
import { normalizeSearch } from '@/lib/format';
import { lessonHref } from '@/knowledge/curriculum';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import { WORKS, hoursText, type WorkCategory, type WorkDef } from '@/content/works';
import { WorkIllustration } from './illustrations';
import { WK } from './i18n';
import './works.css';

const CATS: WorkCategory[] = ['accessories', 'home', 'baby', 'toys'];
const TAPE: Record<WorkCategory, 'mustard' | 'sage' | 'rose' | 'denim'> = { accessories: 'denim', home: 'mustard', baby: 'rose', toys: 'sage' };

const LINKS = [
  { href: 'https://www.ravelry.com/help/search?query=free+patterns', key: 'ravelry' as const },
  { href: 'https://www.garnstudio.com/search.php?lang=us', key: 'drops' as const },
  { href: 'https://www.garnstudio.com/search.php?c=baby&lang=en', key: 'dropsBaby' as const },
];

export function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  const t = useMsgs(WK);
  return (
    <span className="wk-diff" role="img" aria-label={t.diffAria(t.diff[level - 1])} title={t.diff[level - 1]}>
      {[1, 2, 3].map((i) => (
        <span key={i} data-on={i <= level || undefined} />
      ))}
    </span>
  );
}

function WorkCard({ w }: { w: WorkDef }) {
  const t = useMsgs(WK);
  const lang = useLang();
  const { fill } = useTerms();
  return (
    <Link to={`/yarat/${w.id}`} className="card card-link wk-card">
      <Tape tone={TAPE[w.category]} corner>
        {t.cats[w.category]}
      </Tape>
      <div className="wk-card-art">
        <WorkIllustration kind={w.illustration} variant={w.variant} colors={w.defaultColors} />
      </div>
      <div className="wk-card-body">
        <h3 className="wk-card-title">{fill(w.title[lang])}</h3>
        <p className="wk-card-blurb">{fill(w.blurb[lang])}</p>
        <div className="wk-card-meta">
          <span className="chip" data-tone={w.craft === 'knit' ? 'terracotta' : 'sage'}>
            {w.craft === 'knit' ? t.knit : t.crochet}
          </span>
          <DifficultyDots level={w.difficulty} />
          <span className="wk-meta-item">
            <Clock aria-hidden />
            {hoursText(w.hours, lang)}
          </span>
          <span className="wk-meta-item">{YARN_WEIGHTS[w.yarnWeight].name[lang]}</span>
        </div>
      </div>
    </Link>
  );
}

export default function WorksPage() {
  const t = useMsgs(WK);
  const lang = useLang();
  const { fill } = useTerms();
  const [craft, setCraft] = useState<'all' | Craft>('all');
  const [diffs, setDiffs] = useState<number[]>([]);
  const [cats, setCats] = useState<WorkCategory[]>([]);
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const nq = normalizeSearch(q.trim());
    return WORKS.filter((w) => {
      if (craft !== 'all' && w.craft !== craft) return false;
      if (diffs.length && !diffs.includes(w.difficulty)) return false;
      if (cats.length && !cats.includes(w.category)) return false;
      if (!nq) return true;
      const hay = normalizeSearch([fill(w.title[lang]), fill(w.blurb[lang]), w.keywords?.[lang] ?? '', t.cats[w.category], w.title.en].join(' '));
      return nq.split(/\s+/).every((part) => hay.includes(part));
    });
  }, [craft, diffs, cats, q, lang, fill, t]);

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const filtered = craft !== 'all' || diffs.length > 0 || cats.length > 0 || q.trim() !== '';

  return (
    <div className="page wk-page">
      <PageHeader eyebrow={t.eyebrow} title={t.title} lede={t.lede} />

      <div className="wk-learn">
        <span className="wk-learn-label">{t.newHere}</span>
        <Link className="wk-learn-card" to={lessonHref('sis-tutus')}>
          <GraduationCap aria-hidden />
          <span>
            <b>{t.knitBasics}</b>
            <small>{t.knitBasicsDesc}</small>
          </span>
        </Link>
        <Link className="wk-learn-card" to={lessonHref('tig-tutus')}>
          <GraduationCap aria-hidden />
          <span>
            <b>{t.crochetBasics}</b>
            <small>{t.crochetBasicsDesc}</small>
          </span>
        </Link>
      </div>

      <div className="wk-filters" role="search">
        <label className="wk-search">
          <Search aria-hidden />
          <input className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
        </label>
        <Segmented
          label={t.craft}
          value={craft}
          onChange={setCraft}
          options={[
            { value: 'all', label: t.all },
            { value: 'knit', label: t.knit },
            { value: 'crochet', label: t.crochet },
          ]}
        />
        <div className="wk-chip-row" role="group" aria-label={t.difficulty}>
          {[1, 2, 3].map((d) => (
            <button key={d} type="button" className="wk-filter-chip" aria-pressed={diffs.includes(d)} onClick={() => toggle(diffs, d, setDiffs)}>
              <DifficultyDots level={d as 1 | 2 | 3} />
              {t.diff[d - 1]}
            </button>
          ))}
        </div>
        <div className="wk-chip-row" role="group" aria-label={t.category}>
          {CATS.map((c) => (
            <button key={c} type="button" className="wk-filter-chip" aria-pressed={cats.includes(c)} onClick={() => toggle(cats, c, setCats)}>
              {t.cats[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="spread wk-count">
        <span className="small muted">{t.results(list.length)}</span>
        {filtered && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setCraft('all');
              setDiffs([]);
              setCats([]);
              setQ('');
            }}
          >
            <X aria-hidden />
            {t.clear}
          </button>
        )}
      </div>

      {list.length ? (
        <div className="wk-grid">
          {list.map((w) => (
            <WorkCard key={w.id} w={w} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="hand">{t.empty}</div>
        </div>
      )}

      <section className="wk-bottom">
        <div className="card card-stitched wk-maker">
          <NotebookPen aria-hidden className="wk-maker-icon" />
          <div className="grow">
            <h2 className="card-title">{t.makerTitle}</h2>
            <p className="muted small">{t.makerDesc}</p>
            <Link to="/tarif" className="btn btn-primary">
              {t.makerCta}
            </Link>
          </div>
        </div>
        <div className="card card-sunken wk-more">
          <h2 className="card-title">{t.moreTitle}</h2>
          <p className="muted small">{t.moreDesc}</p>
          <ul className="wk-links">
            {LINKS.map((l) => (
              <li key={l.key}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {t[l.key]}
                  <ExternalLink aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
