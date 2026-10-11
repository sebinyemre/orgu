/**
 * Eser sayfası: büyük çizim (renkler seçilebilir), beden, gerekenler, önce bilinmesi gereken teknikler,
 * tam tarif (PatternView) ve "Bu projeye başla".
 */
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Play, Printer, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/ui/PageHeader';
import { EmptyState } from '@/ui/EmptyState';
import { ColorPicker } from '@/ui/ColorPicker';
import { useLang, useMsgs } from '@/i18n';
import { useTerms } from '@/ui/Term';
import { useSettings } from '@/store/settings';
import { useStash } from '@/store/stash';
import { useProjects } from '@/store/projects';
import { toast } from '@/store/toast';
import { YARN_SWATCHES } from '@/knowledge/swatches';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import { TOOL_KIND_LABEL } from '@/knowledge/tools';
import { fmt, fmtMeters } from '@/lib/format';
import { TechniqueLink } from '@/features/learn/TechniqueLink';
import { PatternView } from '@/features/recipe/PatternView';
import { WORK_BY_ID, generateWork, hoursText } from '@/content/works';
import { WorkIllustration } from './illustrations';
import { DifficultyDots } from './WorksPage';
import { WK } from './i18n';
import './works.css';

/** Eser kimliğinden tarif hazırlayıcı şablonu (uyarlanabilir eserler için) */
const TEMPLATE_OF: Record<string, string> = {
  'haraso-atki': 'atki',
  'yalanci-selanik-atki': 'atki',
  'lastik-bere': 'bere',
  'burgulu-bere': 'bere',
  'yelpaze-battaniye': 'bebek-battaniyesi',
  'pirinc-boyunluk': 'boyunluk',
  'cizgili-top': 'amigurumi-top',
  'buyukanne-karesi': 'buyukanne-karesi',
  'buyukanne-battaniye': 'buyukanne-karesi',
  'bardak-altligi-seti': 'bardak-altligi',
  'tig-bere': 'bere-tig',
  'kum-atki': 'atki-tig',
};

export default function WorkPage() {
  const { workId = '' } = useParams();
  const t = useMsgs(WK);
  const w = WORK_BY_ID[workId];
  if (!w) {
    return (
      <div className="page">
        <PageHeader title={t.title} />
        <EmptyState title={t.notFound} action={<Link to="/yarat" className="btn btn-primary">{t.back}</Link>} />
      </div>
    );
  }
  return <WorkDetail key={w.id} workId={w.id} />;
}

function WorkDetail({ workId }: { workId: string }) {
  const w = WORK_BY_ID[workId];
  const t = useMsgs(WK);
  const lang = useLang();
  const terms = useTerms();
  const units = useSettings((s) => s.units);
  const yarns = useStash((s) => s.yarns);
  const createFromPattern = useProjects((s) => s.createFromPattern);
  const nav = useNavigate();
  const [sizeId, setSizeId] = useState(w.defaultSize);
  const [colors, setColors] = useState<string[]>(w.defaultColors.slice(0, w.colorSlots.length));
  const [slot, setSlot] = useState(0);

  const pattern = useMemo(() => generateWork(w.id, { sizeId, colors }, terms.ctx, units), [w.id, sizeId, colors, terms.ctx.lang, terms.ctx.trabzan, terms.ctx.crochetEn, units]); // eslint-disable-line react-hooks/exhaustive-deps
  const stashHex = useMemo(() => [...new Set(yarns.map((y) => y.colorHex.toLowerCase()))].slice(0, 12), [yarns]);
  const presets = useMemo(() => [...stashHex, ...YARN_SWATCHES.map((s) => s.hex).filter((h) => !stashHex.includes(h.toLowerCase()))], [stashHex]);
  const title = terms.fill(w.title[lang]);
  const tpl = TEMPLATE_OF[w.id];

  const start = () => {
    const p = createFromPattern(pattern, { color: colors[0], toolSizeMm: w.toolMm });
    toast(t.started, { tone: 'success' });
    nav(`/projeler/${p.id}`);
  };

  return (
    <div className="page wk-detail">
      <Link to="/yarat" className="btn btn-ghost btn-sm wk-back no-print">
        <ArrowLeft aria-hidden />
        {t.back}
      </Link>

      <div className="wk-hero">
        <div className="wk-hero-art no-print">
          <div className="wk-hero-stage paper-grid">
            <WorkIllustration kind={w.illustration} variant={w.variant} colors={colors} title={title} />
          </div>
          <div className="wk-colors">
            <div className="label">{t.colors}</div>
            <div className="wk-slots" role="group" aria-label={t.colors}>
              {w.colorSlots.map((s, i) => (
                <button key={i} type="button" aria-pressed={slot === i} className="wk-slot" onClick={() => setSlot(i)} title={t.pickColorFor(terms.fill(s[lang]))}>
                  <span className="swatch" style={{ background: colors[i] }} />
                  <span>{terms.fill(s[lang])}</span>
                </button>
              ))}
            </div>
            <ColorPicker
              value={colors[slot] ?? '#b5523b'}
              onChange={(hex) => setColors((cs) => cs.map((c, i) => (i === slot ? hex : c)))}
              presets={presets}
              label={t.pickColorFor(terms.fill(w.colorSlots[slot][lang]))}
            />
            {stashHex.length > 0 && <span className="hint">{t.stashColors}: {stashHex.length}</span>}
          </div>
        </div>

        <div className="wk-hero-info">
          <div className="eyebrow">{w.craft === 'knit' ? t.knit : t.crochet}</div>
          <h1 className="wk-title">{title}</h1>
          <p className="lede muted">{terms.fill(w.blurb[lang])}</p>
          <dl className="wk-facts">
            <div>
              <dt>{t.difficulty}</dt>
              <dd>
                <DifficultyDots level={w.difficulty} /> {t.diff[w.difficulty - 1]}
              </dd>
            </div>
            <div>
              <dt>{t.hours}</dt>
              <dd>
                <Clock aria-hidden className="wk-ico" /> {hoursText(w.hours, lang)}
              </dd>
            </div>
            <div>
              <dt>{t.yarn}</dt>
              <dd>
                {YARN_WEIGHTS[w.yarnWeight].name[lang]} · {t.about(fmtMeters(pattern.yarnMeters, lang))}
              </dd>
            </div>
            <div>
              <dt>{t.tool}</dt>
              <dd>
                {TOOL_KIND_LABEL[w.toolKind][lang]} · {fmt(w.toolMm, 2, lang)} mm
              </dd>
            </div>
          </dl>

          <div className="field no-print">
            <span className="label">{t.size}</span>
            <div className="rp-chips wk-sizes" role="radiogroup" aria-label={t.size}>
              {w.sizes.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={sizeId === s.id} aria-pressed={sizeId === s.id} className="rp-chip" onClick={() => setSizeId(s.id)}>
                  {s.label[lang]}
                </button>
              ))}
            </div>
            <span className="hint">
              {t.finished}: {pattern.finishedSize}
            </span>
          </div>

          <div className="wk-know no-print">
            <div className="label">{t.knowFirst}</div>
            <div className="wk-know-list">
              {w.lessons.map((id) => (
                <span key={id} className="wk-know-chip">
                  <TechniqueLink lessonId={id} />
                </span>
              ))}
            </div>
            <span className="hint">{t.knowFirstHint}</span>
          </div>

          <div className="wk-actions no-print">
            <button type="button" className="btn btn-primary btn-lg" onClick={start}>
              <Play aria-hidden />
              {t.start}
            </button>
            <button type="button" className="btn btn-soft" onClick={() => window.print()}>
              <Printer aria-hidden />
              {t.print}
            </button>
            {tpl && (
              <Link to={`/tarif?tur=${tpl}`} className="btn btn-ghost">
                <SlidersHorizontal aria-hidden />
                {t.customize}
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="wk-need no-print" aria-labelledby="wk-need">
        <h2 id="wk-need" className="section-title">
          {t.youNeed}
        </h2>
        <ul className="wk-need-list">
          {pattern.materials.map((m, i) => (
            <li key={i}>
              <b>{m.label}</b>
              {m.detail && <span>{m.detail}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="wk-pattern" className="wk-pattern">
        <h2 id="wk-pattern" className="section-title no-print">
          {t.pattern}
        </h2>
        <PatternView pattern={pattern} />
      </section>
    </div>
  );
}
