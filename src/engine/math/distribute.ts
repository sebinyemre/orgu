/**
 * Eşit artırma / eksiltme dağıtıcı.
 * "Elimde 87 ilmek var, sırayı örerken 12 artırma yapmalıyım" → *6 ör, 1 artır* …
 */
import type { Craft } from '@/types';

export type ShapeKind = 'inc' | 'dec';
export type WorkMode = 'flat' | 'round';

export interface Group {
  /** düz örülecek ilmek */
  plain: number;
  /** bu gruptan sonra şekillendirme yapılır mı */
  shape: boolean;
}

export interface DistributeResult {
  ok: boolean;
  error?: string;
  /** sıranın tamamı: sırayla gruplar */
  groups: Group[];
  before: number;
  after: number;
  /** insan okunur talimat */
  text: string;
  /** sıkıştırılmış çalışma parçaları */
  parts: Part[];
}

export type Part = { kind: 'plain'; n: number } | { kind: 'repeat'; plain: number; times: number } | { kind: 'shape' };

/**
 * Bir ilmeği tüketen/üreten miktar:
 *  - şiş artırma (M1/ip atma): 0 tüketir, 1 üretir
 *  - şiş eksiltme (2 birlikte): 2 tüketir, 1 üretir
 *  - tığ artırma (aynı ilmeğe 2): 1 tüketir, 2 üretir
 *  - tığ eksiltme (2 birlikte): 2 tüketir, 1 üretir
 */
function consumption(craft: Craft, kind: ShapeKind): number {
  if (kind === 'dec') return 2;
  return craft === 'knit' ? 0 : 1;
}

export function distribute(current: number, count: number, kind: ShapeKind, mode: WorkMode, craft: Craft = 'knit'): DistributeResult {
  const fail = (error: string): DistributeResult => ({ ok: false, error, groups: [], before: current, after: current, text: '', parts: [] });
  if (!Number.isInteger(current) || current < 1) return fail('İlmek sayısı en az 1 olmalı.');
  if (!Number.isInteger(count) || count < 1) return fail('Artırma/eksiltme sayısı en az 1 olmalı.');
  const use = consumption(craft, kind);
  const plainTotal = current - use * count;
  if (plainTotal < 0) return fail(kind === 'dec' ? `${count} eksiltme için en az ${use * count} ilmek gerekir.` : `${count} artırma için en az ${use * count} ilmek gerekir.`);
  if (kind === 'inc' && craft === 'knit' && mode === 'flat' && count > current - 1 && current > 1) {
    // ilmekler arasına en fazla current-1 artırma sığar (kenarları hariç)
    if (count > current + 1) return fail('Bu kadar artırma için ilmek sayısı yetersiz.');
  }

  const groups: Group[] = [];
  if (mode === 'round') {
    // count grup; her grubun sonunda şekillendirme
    const sizes = spread(plainTotal, count);
    for (const s of sizes) groups.push({ plain: s, shape: true });
  } else {
    // düz örgü: kenarlarda yarım aralık, şekillendirmeler içeride
    const sizes = spread(plainTotal, count + 1, true);
    sizes.forEach((s, i) => groups.push({ plain: s, shape: i < count }));
  }

  const after = kind === 'inc' ? current + count : current - count;
  const parts = compress(groups, mode);
  return { ok: true, groups, before: current, after, parts, text: describe(parts, kind, craft) };
}

/**
 * total'i n gruba olabildiğince eşit böler.
 * edges=true ise ilk ve son grup yarım ağırlıklıdır (düz örgüde kenar payı).
 */
export function spread(total: number, n: number, edges = false): number[] {
  if (n <= 0) return [];
  if (!edges || n < 3) {
    const q = Math.floor(total / n);
    let r = total - q * n;
    // fazla ilmekleri eşit aralıklarla dağıt
    const out = new Array(n).fill(q);
    if (r > 0) {
      const step = n / r;
      for (let i = 0; i < r; i++) out[Math.floor(i * step)]++;
      r = 0;
    }
    return out;
  }
  // kenarlar + (n-2) iç grup; iç grup ≈ total/(n-1), kenarlar ≈ yarısı
  const inner = n - 2;
  const unit = total / (n - 1);
  const innerSizes = spread(Math.round(unit * inner), inner);
  const rest = total - innerSizes.reduce((a, b) => a + b, 0);
  const first = Math.floor(rest / 2);
  return [first, ...innerSizes, rest - first];
}

function compress(groups: Group[], mode: WorkMode): Part[] {
  const parts: Part[] = [];
  const shaped = groups.filter((g) => g.shape);
  const tail = groups.filter((g) => !g.shape);
  if (mode === 'flat' && groups.length > 0) {
    // ilk grup: başlangıç düzü
    const [first, ...rest] = groups;
    if (first.plain > 0) parts.push({ kind: 'plain', n: first.plain });
    if (first.shape) parts.push({ kind: 'shape' });
    const middle = rest.filter((g) => g.shape);
    pushRuns(parts, middle);
    const last = rest.filter((g) => !g.shape);
    for (const g of last) if (g.plain > 0) parts.push({ kind: 'plain', n: g.plain });
    return parts;
  }
  pushRuns(parts, shaped);
  for (const g of tail) if (g.plain > 0) parts.push({ kind: 'plain', n: g.plain });
  return parts;
}

/** Aynı büyüklükteki grupları tekrar olarak birleştirir (önce büyükler) */
function pushRuns(parts: Part[], groups: Group[]) {
  const counts = new Map<number, number>();
  for (const g of groups) counts.set(g.plain, (counts.get(g.plain) ?? 0) + 1);
  const sizes = [...counts.keys()].sort((a, b) => b - a);
  for (const s of sizes) parts.push({ kind: 'repeat', plain: s, times: counts.get(s)! });
}

function describe(parts: Part[], kind: ShapeKind, craft: Craft): string {
  const shapeWord =
    craft === 'knit' ? (kind === 'inc' ? '1 artır' : '2 ilmeği birlikte ör') : kind === 'inc' ? 'sonraki ilmeğe 2 ilmek ör (artır)' : 'sonraki 2 ilmeği birlikte ör (eksilt)';
  const plainWord = (n: number) => (craft === 'knit' ? `${n} ör` : `${n} ilmeğe birer ilmek`);
  const out: string[] = [];
  for (const p of parts) {
    if (p.kind === 'plain') out.push(plainWord(p.n));
    else if (p.kind === 'shape') out.push(shapeWord);
    else {
      const body = p.plain > 0 ? `${plainWord(p.plain)}, ${shapeWord}` : shapeWord;
      out.push(p.times > 1 ? `*${body}* — ${p.times} kez` : body);
    }
  }
  return out.join('; ') + '.';
}

/** Şekillendirme sıklığı: "60 sırada 12 eksiltme" → her 5 sırada bir */
export function shapingFrequency(rows: number, events: number): { every: number; extra: number; text: string } {
  if (events <= 0 || rows <= 0) return { every: 0, extra: 0, text: '' };
  const every = Math.floor(rows / events);
  const extra = rows - every * events;
  const text = extra === 0 ? `Her ${every} sırada bir` : `Her ${every} sırada bir (son ${extra} sıra düz devam)`;
  return { every, extra, text };
}
