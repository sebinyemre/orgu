import { useSettings } from '@/store/settings';
import { CROCHET_BASICS, crochetAbbr, crochetLabel, crochetName, crochetNameLower, fillTerms, type CrochetBasicId, type TermsCtx } from '@/knowledge/terms';

/** Geçerli terim bağlamı (bileşen dışında) */
export function getTermsCtx(): TermsCtx {
  const s = useSettings.getState();
  return { lang: s.lang, trabzan: s.trabzan, crochetEn: s.crochetEn };
}

/** Tığ terimlerini kullanıcının diline ve geleneğine göre veren kanca */
export function useTerms() {
  const lang = useSettings((s) => s.lang);
  const trabzan = useSettings((s) => s.trabzan);
  const crochetEn = useSettings((s) => s.crochetEn);
  const showEnglish = useSettings((s) => s.showEnglish);
  const ctx: TermsCtx = { lang, trabzan, crochetEn };
  return {
    ctx,
    lang,
    showEnglish,
    name: (id: CrochetBasicId) => crochetName(id, ctx),
    lower: (id: CrochetBasicId) => crochetNameLower(id, ctx),
    abbr: (id: CrochetBasicId) => crochetAbbr(id, ctx),
    label: (id: CrochetBasicId) => crochetLabel(id, ctx, showEnglish),
    fill: (text: string) => fillTerms(text, ctx),
  };
}

/** <Term id="dc" /> → ad + (ayarlıysa) küçük US/UK etiketi */
export function Term({ id, lower, chip = true }: { id: CrochetBasicId; lower?: boolean; chip?: boolean }) {
  const t = useTerms();
  const b = CROCHET_BASICS[id];
  const ref = t.lang === 'en' ? (t.ctx.crochetEn === 'uk' ? `US ${b.us}` : `UK ${b.uk}`) : `US ${b.us}`;
  return (
    <span className="nowrap">
      {lower ? t.lower(id) : t.name(id)}
      {chip && t.showEnglish && id !== 'ch' && (
        <span className="chip" data-tone="denim" style={{ marginLeft: 6, verticalAlign: 'middle' }} title={`US ${b.usName} · UK ${b.ukName}`}>
          {ref}
        </span>
      )}
    </span>
  );
}
