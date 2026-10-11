/** Sayaç görünümleri için saf yardımcılar (React'ten bağımsız, test edilir). */
import type { Counter, Lang } from '@/types';
import { CNT } from './i18n';

/**
 * Çentik görünümünde en fazla `cap` çizgi gösterilir. Fazlası "sayfa" olarak gizlenir:
 * 53 değer, 50 kapasite → 3 çizgi görünür, 50 gizli.
 */
export function tallyWindow(value: number, cap: number): { shown: number; hidden: number } {
  const v = Math.max(0, Math.floor(value));
  if (v === 0 || cap <= 0) return { shown: 0, hidden: 0 };
  const page = Math.floor((v - 1) / cap);
  return { shown: v - page * cap, hidden: page * cap };
}

/** Abaküs basamakları: birler ilk sırada. 1234, 3 sıra → [4, 3, 2] ve taşma (1000) */
export function abacusDigits(value: number, rows: number): { digits: number[]; overflow: number } {
  const v = Math.max(0, Math.floor(value));
  const cap = 10 ** rows;
  const rest = v % cap;
  const digits: number[] = [];
  for (let i = 0; i < rows; i++) digits.push(Math.floor(rest / 10 ** i) % 10);
  return { digits, overflow: v - rest };
}

/**
 * Yumak halkasının doluluğu (0–1).
 * Hedef varsa hedefe göre; yoksa her 10'da bir tur tamamlanır (10 → dolu, 11 → 0,1).
 */
export function ringProgress(value: number, target?: number): number {
  if (target && target > 0) return Math.max(0, Math.min(1, value / target));
  if (value <= 0) return 0;
  const r = value % 10;
  return r === 0 ? 1 : r / 10;
}

/** Hedef ilerlemesi (hedef yoksa null) */
export function targetProgress(c: Pick<Counter, 'value' | 'target'>): number | null {
  if (!c.target || c.target <= 0) return null;
  return Math.max(0, Math.min(1, c.value / c.target));
}

/** Bu artış hedefe ulaştırıyor mu? */
export function reachesTarget(c: Pick<Counter, 'value' | 'target'>, delta: number): boolean {
  return !!c.target && delta > 0 && c.value < c.target && c.value + delta >= c.target;
}

/** Deterministik "el çizimi" titremesi: -1 … 1 */
export function jitter(i: number, salt = 0): number {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/** Mekanik sayaçta gösterilecek basamak sayısı (en az 3) */
export function digitCount(value: number, min = 3): number {
  return Math.max(min, String(Math.max(0, Math.floor(value))).length);
}

/**
 * Depoların ilk kurulumda Türkçe verdiği hazır sayaç adları.
 * Kullanıcı bu adları değiştirmediyse geçerli dilde gösterilir.
 */
const DEFAULT_TR: Record<string, keyof (typeof CNT)['tr']['defaults']> = {
  'Sıra sayacı': 'rowCounter',
  Sıra: 'row',
  İlmek: 'stitch',
  Tekrar: 'repeat',
  Tur: 'round',
  'Tur / Sıra': 'roundRow',
  Sayaç: 'counter',
};

export function counterDisplayName(name: string, lang: Lang): string {
  if (lang === 'tr') return name;
  const key = DEFAULT_TR[name.trim()];
  return key ? CNT[lang].defaults[key] : name;
}

/** Bağlantı hedefi olabilecek sayaçlar: kendisi ve doğrudan geri bağlananlar hariç */
export function linkCandidates(counters: Counter[], selfId: string | undefined): Counter[] {
  return counters.filter((c) => c.id !== selfId && (!selfId || c.link?.toId !== selfId));
}

/** Listede bir öğeyi bir adım öne/arkaya taşır (yeni kimlik dizisi) */
export function moveId(ids: string[], id: string, dir: -1 | 1): string[] {
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return ids;
  const next = [...ids];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
