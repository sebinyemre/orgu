/**
 * Eşit artırma / eksiltme dağıtıcı.
 * "Elimde 87 ilmek var, sırayı örerken 12 artırma yapmalıyım" → *6 ör, 1 artır* …
 */
import type { Craft, Lang } from '@/types';

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

export function distribute(current: number, count: number, kind: ShapeKind, mode: WorkMode, craft: Craft = 'knit', lang: Lang = 'tr'): DistributeResult {
  const E = ERR[lang];
  const fail = (error: string): DistributeResult => ({ ok: false, error, groups: [], before: current, after: current, text: '', parts: [] });
  if (!Number.isInteger(current) || current < 1) return fail(E.minSt);
  if (!Number.isInteger(count) || count < 1) return fail(E.minCount);
  const use = consumption(craft, kind);
  const plainTotal = current - use * count;
  if (plainTotal < 0) return fail(E.need(count, use * count, kind));
  if (kind === 'inc' && craft === 'knit' && mode === 'flat' && count > current - 1 && current > 1) {
    // ilmekler arasına en fazla current-1 artırma sığar (kenarları hariç)
    if (count > current + 1) return fail(E.tooMany);
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
  return { ok: true, groups, before: current, after, parts, text: describe(parts, kind, craft, lang) };
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

const ERR: Record<Lang, { minSt: string; minCount: string; tooMany: string; need: (n: number, sts: number, kind: ShapeKind) => string }> = {
  tr: {
    minSt: 'İlmek sayısı en az 1 olmalı.',
    minCount: 'Artırma/eksiltme sayısı en az 1 olmalı.',
    tooMany: 'Bu kadar artırma için ilmek sayısı yetersiz.',
    need: (n, sts, k) => `${n} ${k === 'dec' ? 'eksiltme' : 'artırma'} için en az ${sts} ilmek gerekir.`,
  },
  en: {
    minSt: 'You need at least 1 stitch.',
    minCount: 'Enter at least 1 increase or decrease.',
    tooMany: 'Not enough stitches for that many increases.',
    need: (n, sts, k) => `${n} ${k === 'dec' ? 'decreases' : 'increases'} need at least ${sts} stitches.`,
  },
  es: {
    minSt: 'Necesitas al menos 1 punto.',
    minCount: 'Indica al menos 1 aumento o disminución.',
    tooMany: 'No hay puntos suficientes para tantos aumentos.',
    need: (n, sts, k) => `${n} ${k === 'dec' ? 'disminuciones' : 'aumentos'} necesitan al menos ${sts} puntos.`,
  },
  pt: {
    minSt: 'Você precisa de pelo menos 1 ponto.',
    minCount: 'Informe pelo menos 1 aumento ou diminuição.',
    tooMany: 'Não há pontos suficientes para tantos aumentos.',
    need: (n, sts, k) => `${n} ${k === 'dec' ? 'diminuições' : 'aumentos'} precisam de pelo menos ${sts} pontos.`,
  },
};

const WORDS: Record<Lang, { knitInc: string; knitDec: string; croInc: string; croDec: string; knitPlain: (n: number) => string; croPlain: (n: number) => string; times: (n: number) => string }> = {
  tr: {
    knitInc: '1 artır',
    knitDec: '2 ilmeği birlikte ör',
    croInc: 'sonraki ilmeğe 2 ilmek ör (artır)',
    croDec: 'sonraki 2 ilmeği birlikte ör (eksilt)',
    knitPlain: (n) => `${n} ör`,
    croPlain: (n) => `${n} ilmeğe birer ilmek`,
    times: (n) => `${n} kez`,
  },
  en: {
    knitInc: 'make 1',
    knitDec: 'k2tog',
    croInc: '2 sts in next stitch (inc)',
    croDec: 'work next 2 sts together (dec)',
    knitPlain: (n) => `k${n}`,
    croPlain: (n) => `1 st in each of next ${n}`,
    times: (n) => `${n} times`,
  },
  es: {
    knitInc: 'aumentar 1',
    knitDec: 'tejer 2 juntos',
    croInc: '2 puntos en el siguiente (aum)',
    croDec: 'cerrar los 2 siguientes juntos (dism)',
    knitPlain: (n) => `tejer ${n}`,
    croPlain: (n) => `1 punto en cada uno de los ${n} siguientes`,
    times: (n) => `${n} veces`,
  },
  pt: {
    knitInc: 'aumentar 1',
    knitDec: 'tricotar 2 juntos',
    croInc: '2 pontos no seguinte (aum)',
    croDec: 'fechar os 2 seguintes juntos (dim)',
    knitPlain: (n) => `tricotar ${n}`,
    croPlain: (n) => `1 ponto em cada um dos ${n} seguintes`,
    times: (n) => `${n} vezes`,
  },
};

function describe(parts: Part[], kind: ShapeKind, craft: Craft, lang: Lang): string {
  const w = WORDS[lang];
  const shapeWord = craft === 'knit' ? (kind === 'inc' ? w.knitInc : w.knitDec) : kind === 'inc' ? w.croInc : w.croDec;
  const plainWord = (n: number) => (craft === 'knit' ? w.knitPlain(n) : w.croPlain(n));
  const out: string[] = [];
  for (const p of parts) {
    if (p.kind === 'plain') out.push(plainWord(p.n));
    else if (p.kind === 'shape') out.push(shapeWord);
    else {
      const body = p.plain > 0 ? `${plainWord(p.plain)}, ${shapeWord}` : shapeWord;
      out.push(p.times > 1 ? `*${body}* ${w.times(p.times)}` : body);
    }
  }
  return out.join('; ') + '.';
}

/** Şekillendirme sıklığı: "60 sırada 12 eksiltme" → her 5 sırada bir */
export function shapingFrequency(rows: number, events: number, lang: Lang = 'tr'): { every: number; extra: number; text: string } {
  if (events <= 0 || rows <= 0) return { every: 0, extra: 0, text: '' };
  const every = Math.floor(rows / events);
  const extra = rows - every * events;
  const T: Record<Lang, (e: number, x: number) => string> = {
    tr: (e, x) => (x === 0 ? `Her ${e} sırada bir` : `Her ${e} sırada bir (son ${x} sıra düz devam)`),
    en: (e, x) => (x === 0 ? `Every ${e} rows` : `Every ${e} rows (then ${x} rows even)`),
    es: (e, x) => (x === 0 ? `Cada ${e} vueltas` : `Cada ${e} vueltas (luego ${x} vueltas sin cambios)`),
    pt: (e, x) => (x === 0 ? `A cada ${e} carreiras` : `A cada ${e} carreiras (depois ${x} carreiras sem alterações)`),
  };
  return { every, extra, text: T[lang](every, extra) };
}
