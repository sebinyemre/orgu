/**
 * Grafikten yazılı tarif üretir (geçerli dilde).
 *
 * - Şiş, düz örgü: ön yüz sıraları sağdan sola, arka yüz sıraları soldan sağa okunur; arka yüzde sembolün
 *   `ws` anlamı kullanılır (boş kare = ön yüzde düz, arka yüzde ters).
 * - Yuvarlak örgü: her tur ön yüzdür, sağdan sola okunur.
 * - Tığ: sıralar gidiş-dönüş okunur; boş kare temel ilmektir (sık iğne).
 * - Ardışık aynı ilmekler birleştirilir ("k5", "5 düz", "5 d", "5 m"); renkli grafikte renk harfleri yazılır.
 * - Sıra içindeki tekrarlar köşeli parantezle kısaltılır: "[2 düz, 2 ters] 5 kez".
 * - Her sıranın aldığı ve bıraktığı ilmek sayısı (consumes/produces) denetlenir.
 */
import type { ChartDoc, Lang, PaletteColor } from '@/types';
import { SYMBOL_BY_ID, symbolName } from '@/knowledge/symbols';
import { CROCHET_BASICS, KNIT_VOCAB, crochetAbbr, crochetName, crochetNameLower, type CrochetBasicId, type TermsCtx } from '@/knowledge/terms';
import { paletteLetter, rowSide, rowUnits, type Grid } from './grid';

export type ChartLike = Pick<ChartDoc, 'width' | 'height' | 'colors' | 'symbols' | 'craft' | 'mode' | 'firstRowRS'> & {
  palette: Pick<PaletteColor, 'letter'>[];
};

export type ColorMode = 'colors' | 'symbols' | 'both';

export interface ToTextOptions {
  terms: TermsCtx;
  leftHanded?: boolean;
  /** sıra içi tekrarları köşeli parantezle kısalt (varsayılan: açık) */
  compact?: boolean;
  /** renk ve sembol kullanımını zorla; verilmezse grafikten anlaşılır */
  colorMode?: ColorMode;
}

export interface TextToken {
  x: number;
  span: number;
  /** etkin sembol: şişte boş kare 'k', tığda boş kare '' (temel ilmek) */
  sym: string;
  /** etkin palet indeksi (renk kullanılmıyorsa -2) */
  color: number;
}

export interface TextRun {
  sym: string;
  color: number;
  count: number;
  /** tokens içindeki ilk indeks */
  start: number;
}

export interface RowText {
  /** 1 tabanlı, alttan */
  row: number;
  y: number;
  rs: boolean;
  dir: 'rtl' | 'ltr';
  label: string;
  text: string;
  tokens: TextToken[];
  runs: TextRun[];
  stitchesIn: number;
  stitchesOut: number;
  warning?: string;
}

export interface LegendEntry {
  id: string;
  name: string;
  rs: string;
  ws: string;
}

export interface ChartText {
  intro: string;
  rows: RowText[];
  colorMode: ColorMode;
  warnings: { row: number; text: string }[];
  legend: LegendEntry[];
}

/* ── Dil tabloları ──────────────────────────────────────────────── */

interface Words {
  times: (t: string, n: number) => string;
  bracket: (u: string, n: number) => string;
  colorRun: (letter: string, n: number) => string;
  withColor: (op: string, letter: string) => string;
  knitLead: [string, string];
  sts: (n: number) => string;
  mismatch: (need: number, have: number) => string;
  castOnFlat: (n: number) => string;
  castOnRound: (n: number) => string;
  chainFlat: (n: number, basic: string) => string;
  chainRound: (n: number) => string;
  kp: (op: 'k' | 'p', n: number) => string;
}

const W: Record<Lang, Words> = {
  tr: {
    times: (t, n) => `${n} kez ${t}`,
    bracket: (u, n) => `[${u}] ${n} kez`,
    colorRun: (L, n) => `${L} ile ${n}`,
    withColor: (op, L) => `${L} ile ${op}`,
    knitLead: ['Düz ör', 'Ters ör'],
    sts: (n) => `(${n} ilmek)`,
    mismatch: (need, have) => `Bu sıra ${need} ilmek ister, önceki sıra ${have} ilmek bırakıyor.`,
    castOnFlat: (n) => `${n} ilmek at.`,
    castOnRound: (n) => `${n} ilmek at, burmadan birleştir.`,
    chainFlat: (n, b) => `${n} zincir çek. İlk sırayı ${b} ile ör.`,
    chainRound: (n) => `${n} zincir çek, kör ilmekle birleştirip halka yap.`,
    kp: (op, n) => `${n} ${op === 'k' ? 'düz' : 'ters'}`,
  },
  en: {
    times: (t, n) => `${t} ${n} times`,
    bracket: (u, n) => `[${u}] ${n} times`,
    colorRun: (L, n) => `${n} in ${L}`,
    withColor: (op, L) => `${op} in ${L}`,
    knitLead: ['Knit', 'Purl'],
    sts: (n) => `(${n} sts)`,
    mismatch: (need, have) => `This row needs ${need} stitches but the previous row leaves ${have}.`,
    castOnFlat: (n) => `Cast on ${n} stitches.`,
    castOnRound: (n) => `Cast on ${n} stitches and join in the round without twisting.`,
    chainFlat: (n, b) => `Ch ${n}. Work the first row in ${b}.`,
    chainRound: (n) => `Ch ${n} and join with a sl st to form a ring.`,
    kp: (op, n) => `${op}${n}`,
  },
  es: {
    times: (t, n) => `${t} ${n} veces`,
    bracket: (u, n) => `[${u}] ${n} veces`,
    colorRun: (L, n) => `${n} con ${L}`,
    withColor: (op, L) => `${op} con ${L}`,
    knitLead: ['Al derecho', 'Al revés'],
    sts: (n) => `(${n} puntos)`,
    mismatch: (need, have) => `Esta vuelta necesita ${need} puntos, pero la anterior deja ${have}.`,
    castOnFlat: (n) => `Montar ${n} puntos.`,
    castOnRound: (n) => `Montar ${n} puntos y unir en redondo sin torcer.`,
    chainFlat: (n, b) => `Hacer ${n} cadenetas. Tejer la primera vuelta en ${b}.`,
    chainRound: (n) => `Hacer ${n} cadenetas y cerrar en anillo con un punto raso.`,
    kp: (op, n) => `${n} ${op === 'k' ? 'd' : 'r'}`,
  },
  pt: {
    times: (t, n) => `${t} ${n} vezes`,
    bracket: (u, n) => `[${u}] ${n} vezes`,
    colorRun: (L, n) => `${n} com ${L}`,
    withColor: (op, L) => `${op} com ${L}`,
    knitLead: ['Em meia', 'Em tricô'],
    sts: (n) => `(${n} pontos)`,
    mismatch: (need, have) => `Esta carreira precisa de ${need} pontos, mas a anterior deixa ${have}.`,
    castOnFlat: (n) => `Montar ${n} pontos.`,
    castOnRound: (n) => `Montar ${n} pontos e unir em circular sem torcer.`,
    chainFlat: (n, b) => `Fazer ${n} correntinhas. Trabalhar a primeira carreira em ${b}.`,
    chainRound: (n) => `Fazer ${n} correntinhas e fechar em anel com um ponto baixíssimo.`,
    kp: (op, n) => `${n} ${op === 'k' ? 'm' : 't'}`,
  },
};

const lowerFirst = (s: string, lang: Lang) => (s ? s.charAt(0).toLocaleLowerCase(lang === 'tr' ? 'tr-TR' : lang) + s.slice(1) : s);

/* ── Yardımcılar ────────────────────────────────────────────────── */

function effectiveSym(id: string, craft: ChartDoc['craft']): string {
  if (!id || !SYMBOL_BY_ID[id]) return craft === 'knit' ? 'k' : '';
  return id;
}

/** Tığda sembolün temel ilmeği (dönüş zinciri hesabı için) */
function crochetBasicOf(sym: string): CrochetBasicId {
  return SYMBOL_BY_ID[sym]?.basic ?? 'sc';
}

/** Grafikte renk ve sembol kullanımını belirler */
export function detectColorMode(chart: ChartLike): ColorMode {
  const seen = new Set<number>();
  let symbols = false;
  for (let i = 0; i < chart.width * chart.height; i++) {
    const s = chart.symbols[i];
    if (s === 'ns') continue;
    seen.add(Math.max(0, chart.colors[i] ?? 0));
    if (s && s !== '>') {
      if (chart.craft === 'crochet' || s !== 'k') symbols = true;
    }
  }
  const colors = seen.size > 1;
  if (colors && symbols) return 'both';
  if (colors) return 'colors';
  return 'symbols';
}

/** Bir ilmek işleminin metni (adet dahil) */
function opText(sym: string, n: number, rs: boolean, chart: ChartLike, ctx: TermsCtx): string {
  const lang = ctx.lang;
  const w = W[lang];
  if (chart.craft === 'knit') {
    if (sym === 'k' || sym === 'p') {
      const op = (sym === 'k') === rs ? 'k' : 'p';
      return w.kp(op, n);
    }
    const s = SYMBOL_BY_ID[sym];
    const t = s ? (rs ? s.rs : s.ws)?.[lang] || s.name[lang].toLocaleLowerCase() : sym;
    return n === 1 ? t : w.times(t, n);
  }
  // tığ
  const s = sym ? SYMBOL_BY_ID[sym] : undefined;
  let name: string;
  if (!s) name = lang === 'tr' ? crochetNameLower('sc', ctx) : crochetAbbr('sc', ctx);
  else if (s.group === 'temel' && s.basic) name = lang === 'tr' ? crochetNameLower(s.basic, ctx) : crochetAbbr(s.basic, ctx);
  else if (lang === 'en' && ctx.crochetEn === 'us') name = s.en;
  else name = lowerFirst(symbolName(s, ctx), lang);
  return `${n} ${name}`;
}

function runsOf(tokens: TextToken[], from: number, to: number): TextRun[] {
  const runs: TextRun[] = [];
  for (let i = from; i < to; i++) {
    const t = tokens[i];
    const last = runs[runs.length - 1];
    if (last && last.sym === t.sym && last.color === t.color) last.count++;
    else runs.push({ sym: t.sym, color: t.color, count: 1, start: i });
  }
  return runs;
}

interface RepeatSplit {
  s: number;
  L: number;
  k: number;
}

/** Sıradaki en iyi tekrar bölünmesi: önek + [birim] × k + sonek */
export function findRepeat(keys: number[]): RepeatSplit | null {
  const n = keys.length;
  if (n < 4) return null;
  const runCount = (a: number, b: number) => {
    if (b <= a) return 0;
    let r = 1;
    for (let i = a + 1; i < b; i++) if (keys[i] !== keys[i - 1]) r++;
    return r;
  };
  const full = runCount(0, n);
  let best: RepeatSplit | null = null;
  let bestScore = full;
  const maxL = Math.floor(n / 2);
  for (let L = 1; L <= maxL; L++) {
    const unitRunsCache = new Map<number, number>();
    const maxS = Math.min(n - 2 * L, 12);
    for (let s = 0; s <= maxS; s++) {
      let k = 1;
      outer: while (s + (k + 1) * L <= n) {
        const base = s,
          off = s + k * L;
        for (let i = 0; i < L; i++) if (keys[base + i] !== keys[off + i]) break outer;
        k++;
      }
      if (k < 2) continue;
      let ur = unitRunsCache.get(s);
      if (ur === undefined) {
        ur = runCount(s, s + L);
        unitRunsCache.set(s, ur);
      }
      if (ur < 2) continue;
      const end = s + k * L;
      // birim bir dizinin ortasından başlıyorsa ya da bitiyorsa küçük ceza (daha doğal bölünme seçilsin)
      const cut = (s > 0 && keys[s - 1] === keys[s] ? 0.5 : 0) + (end < n && keys[end] === keys[end - 1] ? 0.25 : 0);
      const score = runCount(0, s) + ur + runCount(end, n) + 1 + cut;
      if (score < bestScore) {
        bestScore = score;
        best = { s, L, k };
      }
    }
  }
  return best;
}

/* ── Ana işlev ──────────────────────────────────────────────────── */

export function chartToText(chart: ChartLike, o: ToTextOptions): ChartText {
  const ctx = o.terms;
  const lang = ctx.lang;
  const w = W[lang];
  const v = KNIT_VOCAB[lang];
  const mode = o.colorMode ?? detectColorMode(chart);
  const useColor = mode !== 'symbols';
  const compact = o.compact ?? true;
  const grid: Grid = { width: chart.width, height: chart.height, colors: chart.colors, symbols: chart.symbols };
  const letter = (c: number) => chart.palette[c]?.letter ?? paletteLetter(Math.max(0, c));
  const knit = chart.craft === 'knit';

  const runText = (r: TextRun, rs: boolean) => {
    if (mode === 'colors') return w.colorRun(letter(r.color), r.count);
    const op = opText(r.sym, r.count, rs, chart, ctx);
    return mode === 'both' ? w.withColor(op, letter(r.color)) : op;
  };
  const partText = (tokens: TextToken[], a: number, b: number, rs: boolean) => runsOf(tokens, a, b).map((r) => runText(r, rs));

  const rows: RowText[] = [];
  const warnings: { row: number; text: string }[] = [];
  let prevOut = -1;
  const keyOf = new Map<string, number>();

  for (let row = 1; row <= chart.height; row++) {
    const y = chart.height - row;
    const side = rowSide(row, chart, o.leftHanded);
    const units = rowUnits(grid, y, side.dir);
    const tokens: TextToken[] = units.map((u) => ({
      x: u.x,
      span: u.span,
      sym: mode === 'colors' ? (knit ? 'k' : '') : effectiveSym(u.id, chart.craft),
      color: useColor ? Math.max(0, chart.colors[y * chart.width + u.x] ?? 0) : -2,
    }));
    let stitchesIn = 0,
      stitchesOut = 0;
    for (const t of tokens) {
      const s = SYMBOL_BY_ID[t.sym];
      if (knit) {
        stitchesIn += s?.consumes ?? t.span;
        stitchesOut += s?.produces ?? t.span;
      } else {
        stitchesIn += t.span;
        stitchesOut += t.span;
      }
    }
    const runs = runsOf(tokens, 0, tokens.length);

    // metin
    let parts: string[];
    const split = compact ? findRepeat(tokens.map((t) => {
      const k = `${t.sym}|${t.color}`;
      let n = keyOf.get(k);
      if (n === undefined) {
        n = keyOf.size;
        keyOf.set(k, n);
      }
      return n;
    })) : null;
    if (split) {
      const { s, L, k } = split;
      parts = [...partText(tokens, 0, s, side.rs), w.bracket(partText(tokens, s, s + L, side.rs).join(', '), k), ...partText(tokens, s + k * L, tokens.length, side.rs)];
    } else parts = partText(tokens, 0, tokens.length, side.rs);

    let body = parts.join(', ');
    if (mode === 'colors' && tokens.length) {
      const lead = knit ? (chart.mode === 'round' || side.rs ? w.knitLead[0] : w.knitLead[1]) : crochetName('sc', ctx);
      body = `${lead}: ${body}`;
    }
    if (!tokens.length) body = '';
    const text = body ? `${body}. ${w.sts(stitchesOut)}` : '';

    const label = knit
      ? chart.mode === 'round'
        ? v.round(row)
        : `${v.row(row)} (${side.rs ? v.rsShort : v.wsShort})`
      : chart.mode === 'round'
        ? v.round(row)
        : v.row(row);

    let warning: string | undefined;
    if (knit && prevOut >= 0 && stitchesIn !== prevOut) {
      warning = w.mismatch(stitchesIn, prevOut);
      warnings.push({ row, text: warning });
    }
    prevOut = stitchesOut;
    rows.push({ row, y, rs: side.rs, dir: side.dir, label, text, tokens, runs, stitchesIn, stitchesOut, warning });
  }

  // giriş: ilmek atma / temel zincir
  const first = rows[0];
  const n0 = first ? first.stitchesIn : 0;
  let intro = '';
  if (knit) intro = chart.mode === 'round' ? w.castOnRound(n0) : w.castOnFlat(n0);
  else {
    const basicSym = first?.tokens[0]?.sym ?? '';
    const b = CROCHET_BASICS[crochetBasicOf(basicSym)];
    if (chart.mode === 'round') intro = w.chainRound(n0);
    else {
      const chain = n0 + Math.max(0, b.firstInChainFromHook - 1 - (b.turningCounts ? 1 : 0));
      intro = w.chainFlat(chain, crochetNameLower(b.id, ctx));
    }
  }

  // lejant
  const legend: LegendEntry[] = [];
  const seen = new Set<string>();
  for (const r of rows)
    for (const t of r.tokens) {
      if (!t.sym || seen.has(t.sym)) continue;
      seen.add(t.sym);
      const s = SYMBOL_BY_ID[t.sym];
      if (!s) continue;
      legend.push({ id: s.id, name: symbolName(s, ctx), rs: s.rs?.[lang] ?? '', ws: s.ws?.[lang] ?? '' });
    }
  for (const s of chart.symbols)
    if (s === 'ns' && !seen.has('ns')) {
      seen.add('ns');
      const sym = SYMBOL_BY_ID.ns;
      legend.push({ id: 'ns', name: sym.name[lang], rs: sym.hint[lang], ws: sym.hint[lang] });
    }

  return { intro, rows, colorMode: mode, warnings, legend };
}

/** Tek bir dizinin (run) metni: takip modunda çip olarak gösterilir. Renk modunda yalnız adet döner. */
export function runText(chart: ChartLike, mode: ColorMode, r: TextRun, rs: boolean, terms: TermsCtx): string {
  if (mode === 'colors') return String(r.count);
  return opText(r.sym, r.count, rs, chart, terms);
}

/** Bir sıranın tek satırlık hâli: "1. sıra (ÖY): ..." */
export function rowLine(r: RowText): string {
  return r.text ? `${r.label}: ${r.text}` : r.label;
}

/** Tüm tarifin düz metni (kopyalama ve yazdırma için) */
export function chartTextPlain(t: ChartText, opts: { topDown?: boolean } = {}): string {
  const rows = opts.topDown ? [...t.rows].reverse() : t.rows;
  return [t.intro, ...rows.map(rowLine)].join('\n');
}

/** Bir sıranın birim (token) dizisinde verilen indeksin hangi run'da olduğunu bulur */
export function runIndexAt(r: RowText, tokenIndex: number): number {
  for (let i = r.runs.length - 1; i >= 0; i--) if (r.runs[i].start <= tokenIndex) return i;
  return 0;
}
