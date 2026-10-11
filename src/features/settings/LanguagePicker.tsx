import { LANGS, useLang } from '@/i18n';
import { useSettings } from '@/store/settings';

/** Dört dil düğmesi (adlar kendi dillerinde) */
export function LanguagePicker({ big }: { big?: boolean }) {
  const lang = useLang();
  const set = useSettings((s) => s.set);
  return (
    <div className={big ? 'grid-2' : 'seg'} style={big ? { gap: 'var(--space-2)', width: '100%' } : undefined} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          aria-pressed={lang === l.id}
          className={big ? `btn btn-lg ${lang === l.id ? 'btn-primary' : ''}` : undefined}
          onClick={() => {
            set({ lang: l.id });
            document.documentElement.lang = l.id;
          }}
          lang={l.id}
        >
          {l.name}
        </button>
      ))}
    </div>
  );
}
