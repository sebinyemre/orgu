import { useSettings } from '@/store/settings';
import { CROCHET_BASICS, crochetName, type CrochetBasicId, type TermsCtx } from '@/knowledge/terms';
import { SymbolGlyph } from '@/ui/SymbolGlyph';
import { useLang, useMsgs } from '@/i18n';
import { SET } from './i18n';

const IDS: CrochetBasicId[] = ['sc', 'hdc', 'dc', 'tr', 'dtr'];

function TermTable({ ctx }: { ctx: TermsCtx }) {
  const t = useMsgs(SET);
  return (
    <table className="small" style={{ marginTop: 6 }}>
      <tbody>
        {IDS.map((id) => (
          <tr key={id}>
            <td style={{ width: 30, paddingBottom: 2 }}>
              <SymbolGlyph symbol={CROCHET_BASICS[id].symbol} size={22} />
            </td>
            <td style={{ fontWeight: 700 }}>{crochetName(id, ctx)}</td>
            <td className="faint" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              US {CROCHET_BASICS[id].us} · {t.yo(CROCHET_BASICS[id].yarnOvers)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Dilin tığ terim geleneklerini yan yana gösterip seçtirir */
export function CrochetTermsChooser() {
  const lang = useLang();
  const t = useMsgs(SET);
  const s = useSettings();
  const base: TermsCtx = { lang, trabzan: s.trabzan, crochetEn: s.crochetEn };

  const options: { key: string; title: string; active: boolean; ctx: TermsCtx; pick: () => void }[] =
    lang === 'tr'
      ? [
          { key: 'ipatma', title: t.convIpatmaTitle, active: s.trabzan === 'ipatma', ctx: { ...base, trabzan: 'ipatma' }, pick: () => s.set({ trabzan: 'ipatma' }) },
          { key: 'ingilizce', title: t.convIngilizceTitle, active: s.trabzan === 'ingilizce', ctx: { ...base, trabzan: 'ingilizce' }, pick: () => s.set({ trabzan: 'ingilizce' }) },
        ]
      : lang === 'en'
        ? [
            { key: 'us', title: t.convUsTitle, active: s.crochetEn === 'us', ctx: { ...base, crochetEn: 'us' }, pick: () => s.set({ crochetEn: 'us' }) },
            { key: 'uk', title: t.convUkTitle, active: s.crochetEn === 'uk', ctx: { ...base, crochetEn: 'uk' }, pick: () => s.set({ crochetEn: 'uk' }) },
          ]
        : [];

  if (!options.length) {
    return (
      <div className="card">
        <div className="card-title">{t.termsInfo}</div>
        <TermTable ctx={base} />
      </div>
    );
  }

  return (
    <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={o.pick}
          className="card"
          aria-pressed={o.active}
          style={{
            textAlign: 'left',
            cursor: 'pointer',
            borderWidth: 2,
            borderColor: o.active ? 'var(--accent)' : 'var(--line)',
            background: o.active ? 'var(--accent-soft)' : 'var(--card)',
          }}
        >
          <div className="card-title">{o.title}</div>
          <TermTable ctx={o.ctx} />
        </button>
      ))}
    </div>
  );
}
