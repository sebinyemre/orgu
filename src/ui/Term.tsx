import { useSettings } from '@/store/settings';
import { CROCHET_BASICS, crochetAbbr, crochetName, crochetNameLower, crochetLabel, type CrochetBasicId } from '@/knowledge/terms';

/** Tığ terimlerini kullanıcının trabzan sistemine göre veren kanca */
export function useTerms() {
  const conv = useSettings((s) => s.trabzan);
  const showEnglish = useSettings((s) => s.showEnglish);
  return {
    conv,
    showEnglish,
    name: (id: CrochetBasicId) => crochetName(id, conv),
    lower: (id: CrochetBasicId) => crochetNameLower(id, conv),
    abbr: (id: CrochetBasicId) => crochetAbbr(id, conv),
    label: (id: CrochetBasicId) => crochetLabel(id, conv, showEnglish),
  };
}

/** <Term id="dc" /> → "Trabzan" + (ayarlıysa) küçük "US dc" çipi */
export function Term({ id, lower, chip = true }: { id: CrochetBasicId; lower?: boolean; chip?: boolean }) {
  const t = useTerms();
  const b = CROCHET_BASICS[id];
  return (
    <span className="nowrap">
      {lower ? t.lower(id) : t.name(id)}
      {chip && t.showEnglish && id !== 'ch' && (
        <span className="chip" data-tone="denim" style={{ marginLeft: 6, verticalAlign: 'middle' }} title={`${b.usName} (UK: ${b.ukName})`}>
          {b.us}
        </span>
      )}
    </span>
  );
}
