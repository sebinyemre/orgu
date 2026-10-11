import { useSettings } from '@/store/settings';
import { CONVENTION_INFO, CROCHET_BASICS, crochetName, type CrochetBasicId } from '@/knowledge/terms';
import type { TrabzanConvention } from '@/types';
import { SymbolGlyph } from '@/ui/SymbolGlyph';

const IDS: CrochetBasicId[] = ['sc', 'hdc', 'dc', 'tr', 'dtr'];

/** İki trabzan adlandırma sistemini yan yana gösterip seçtirir */
export function TrabzanChooser() {
  const conv = useSettings((s) => s.trabzan);
  const set = useSettings((s) => s.set);
  return (
    <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
      {(['ipatma', 'ingilizce'] as TrabzanConvention[]).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => set({ trabzan: c })}
          className="card"
          aria-pressed={conv === c}
          style={{
            textAlign: 'left',
            cursor: 'pointer',
            borderWidth: 2,
            borderColor: conv === c ? 'var(--accent)' : 'var(--line)',
            background: conv === c ? 'var(--accent-soft)' : 'var(--card)',
          }}
        >
          <div className="card-title">{CONVENTION_INFO[c].title}</div>
          <table className="small" style={{ marginTop: 6 }}>
            <tbody>
              {IDS.map((id) => (
                <tr key={id}>
                  <td style={{ width: 30, paddingBottom: 2 }}>
                    <SymbolGlyph symbol={CROCHET_BASICS[id].symbol} size={22} />
                  </td>
                  <td style={{ fontWeight: 700 }}>{crochetName(id, c)}</td>
                  <td className="faint" style={{ textAlign: 'right' }}>
                    US {CROCHET_BASICS[id].us} · {CROCHET_BASICS[id].yarnOvers} ip at.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </button>
      ))}
    </div>
  );
}
