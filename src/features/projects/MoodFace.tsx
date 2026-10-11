/** Günlük ruh hâli: 1 (zorlandım) … 5 (çok keyifli). Emoji yerine elle çizilmiş küçük yüzler. */
import type { JournalEntry } from '@/types';
import { useMsgs } from '@/i18n';
import { PRJ } from './i18n';

type Mood = NonNullable<JournalEntry['mood']>;

const FILL: Record<Mood, string> = {
  1: 'var(--danger-soft)',
  2: 'var(--warning-soft)',
  3: 'var(--paper-3)',
  4: 'var(--sage-soft)',
  5: 'var(--success-soft)',
};
/** ağız eğriliği: eksi = somurtma, artı = gülümseme */
const CURVE: Record<Mood, number> = { 1: -5, 2: -2.5, 3: 0, 4: 3.5, 5: 6.5 };

export function MoodFace({ mood, size = 28, title }: { mood: Mood; size?: number; title?: string }) {
  const c = CURVE[mood];
  const y = c >= 0 ? 19.5 : 22;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} className="prj-mood">
      {title && <title>{title}</title>}
      <circle cx="16" cy="16" r="13.5" fill={FILL[mood]} stroke="var(--ink-2)" strokeWidth="1.6" />
      {/* teyel dikişi gibi iç halka */}
      <circle cx="16" cy="16" r="10.8" fill="none" stroke="var(--ink-3)" strokeWidth="0.8" strokeDasharray="1.6 2" opacity="0.6" />
      {mood === 1 ? (
        <g stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round">
          <path d="M9.5 11.5 L13 13" />
          <path d="M22.5 11.5 L19 13" />
        </g>
      ) : (
        <g fill="var(--ink)">
          <circle cx="11.6" cy="13" r="1.5" />
          <circle cx="20.4" cy="13" r="1.5" />
        </g>
      )}
      <path d={`M10.5 ${y} Q16 ${y + c} 21.5 ${y}`} fill="none" stroke="var(--ink)" strokeWidth="1.7" strokeLinecap="round" />
      {mood === 5 && (
        <g fill="var(--rose)" opacity="0.55">
          <circle cx="8.6" cy="18" r="1.8" />
          <circle cx="23.4" cy="18" r="1.8" />
        </g>
      )}
    </svg>
  );
}

/** Beş yüzden birini seçme (radyo grubu) */
export function MoodPicker({ value, onChange }: { value?: Mood; onChange: (m: Mood | undefined) => void }) {
  const t = useMsgs(PRJ);
  return (
    <div className="prj-mood-picker" role="radiogroup" aria-label={t.mood}>
      {([1, 2, 3, 4, 5] as Mood[]).map((m) => (
        <button key={m} type="button" role="radio" aria-checked={value === m} className="prj-mood-btn" onClick={() => onChange(value === m ? undefined : m)} title={t.moods[m - 1]}>
          <MoodFace mood={m} size={30} />
          <span className="xsmall">{t.moods[m - 1]}</span>
        </button>
      ))}
    </div>
  );
}
