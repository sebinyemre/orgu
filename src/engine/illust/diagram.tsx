/**
 * Sembol şemaları: tığ işi daire, büyükanne karesi, sıra şemaları ve şiş grafiği okuma.
 * Semboller bilgi bankasındaki CYC çizimleriyle aynıdır; böylece derste görülen şema,
 * kareli kağıt ve tarif ekranındakiyle birebir eşleşir.
 */
import type { ReactNode } from 'react';
import { SYMBOL_BY_ID, glyphOf } from '@/knowledge/symbols';
import { Arrow, Badge, Fade } from './parts';
import { C } from './theme';
import { add, mul, rad, type P } from './geom';

/** tur renkleri (şemalarda turları ayırt etmek için sırayla) */
export const ROUND_COLORS = ['#b5523b', '#3f6c8a', '#5f7a61', '#c08a2e', '#7d4e6d', '#2f7f7a'];

export interface Mark {
  id: string;
  /** sembolün merkezi */
  at: P;
  /** derece; 0 = sembolün üstü yukarı bakar */
  angle?: number;
  size?: number;
  color?: string;
  /** vurgulama ve sıralı belirme için grup numarası */
  group?: number;
}

/** Tek sembol (100 birimlik kutudan ölçeklenir) */
export function SymbolMark({ id, at, angle = 0, size = 34, color = C.ink, weight = Math.max(9, 330 / size) }: Mark & { weight?: number }) {
  const sym = SYMBOL_BY_ID[id];
  if (!sym) return null;
  const g = glyphOf(sym);
  const span = sym.span ?? 1;
  const s = size / 100;
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle}) scale(${s}) translate(${-50 * span} -50)`}>
      {g.under && <path d={g.under} fill="none" stroke={color} strokeWidth={weight} strokeLinecap="round" />}
      {g.d && g.under && <path d={g.d} fill="none" stroke="var(--il-bg)" strokeWidth={weight * 3.2} strokeLinecap="round" />}
      {g.d && <path d={g.d} fill="none" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" />}
      {g.fd && <path d={g.fd} fill={color} />}
    </g>
  );
}

/**
 * Sembol kümesi. `focus` verilirse o gruptaki semboller tam renkte, öncekiler soluk, sonrakiler gizli.
 * `reveal` ile odak grubu döngü içinde sırayla belirir.
 */
export function Diagram({ marks, focus, reveal = true, extra }: { marks: Mark[]; focus?: number; reveal?: boolean; extra?: ReactNode }) {
  const shown = focus === undefined ? marks : marks.filter((m) => (m.group ?? 0) <= focus);
  const inFocus = focus === undefined ? [] : shown.filter((m) => (m.group ?? 0) === focus);
  const n = inFocus.length;
  return (
    <g>
      {shown.map((m, i) => {
        const el = <SymbolMark key={i} {...m} />;
        if (focus === undefined) return el;
        if ((m.group ?? 0) < focus) return <g key={i} opacity={0.32}>{el}</g>;
        if (!reveal) return el;
        const k = inFocus.indexOf(m);
        const a = 0.08 + (0.62 * k) / Math.max(1, n);
        return (
          <Fade key={i} at={[a, a + 0.04]}>
            {el}
          </Fade>
        );
      })}
      {extra}
    </g>
  );
}

const polar = (c: P, r: number, deg: number): P => add(c, mul([Math.cos(rad(deg)), Math.sin(rad(deg))], r));

/* ── Düz daire (tığ, birleştirilen turlar) ───────────────── */
/**
 * Klasik daire: 1. tur sihirli halkaya 6 ilmek, her turda 6 artırma.
 * `stitch` sık iğne ya da trabzan; `joined` ise tur başında zincir ve sonunda kör ilmek gösterilir.
 */
export function circleMarks({ rounds = 4, center = [200, 150] as P, stitch = 'sc', joined = true, start = 6, step = 34, size = 24 }: { rounds?: number; center?: P; stitch?: 'sc' | 'dc'; joined?: boolean; start?: number; step?: number; size?: number }): Mark[] {
  const marks: Mark[] = [{ id: 'mr', at: center, size: size * 1.1, color: ROUND_COLORS[0], group: 0 }];
  for (let r = 1; r <= rounds; r++) {
    const count = start * r;
    const radius = step * r - (stitch === 'dc' ? 0 : 4);
    const color = ROUND_COLORS[(r - 1) % ROUND_COLORS.length];
    // tur başı: yukarıda (−90°); ilmekler saat yönünün tersine dizilir (tığcının önden gördüğü yön)
    const gap = joined ? 360 / (count + 1.2) : 360 / count;
    const startDeg = -90 - gap * 0.6;
    if (joined) {
      marks.push({ id: 'ch', at: polar(center, radius, -90), angle: 90, size: size * 0.75, color, group: r });
    }
    for (let k = 0; k < count; k++) {
      const deg = startDeg - gap * k;
      marks.push({ id: stitch, at: polar(center, radius, deg), angle: deg + 90, size: stitch === 'dc' ? size * 1.35 : size, color, group: r });
    }
    if (joined) marks.push({ id: 'slst', at: polar(center, radius - 2, -90 + gap * 0.55), size: size * 0.7, color, group: r });
  }
  return marks;
}

/** Spiral turlar (amigurumi): tur başı işaretçisi ve sürekli dönen ilmekler */
export function spiralMarks({ rounds = 3, center = [200, 150] as P, size = 22 }: { rounds?: number; center?: P; size?: number }): Mark[] {
  const marks: Mark[] = [{ id: 'mr', at: center, size: size * 1.1, color: ROUND_COLORS[0], group: 0 }];
  for (let r = 1; r <= rounds; r++) {
    const count = 6 * r;
    const color = ROUND_COLORS[(r - 1) % ROUND_COLORS.length];
    for (let k = 0; k < count; k++) {
      const t = k / count;
      const radius = 30 * r - 6 + t * 30;
      const deg = -90 - 360 * t;
      marks.push({ id: 'sc', at: polar(center, radius, deg), angle: deg + 90, size, color, group: r });
    }
  }
  return marks;
}

/** Merkezi şemayı verilen yarıçapa yakınlaştıran viewBox (4:3) */
export function zoomView(r: number, center: P = [200, 150]): string {
  const h = Math.min(150, r);
  const w = (h * 4) / 3;
  return `${center[0] - w} ${center[1] - h} ${w * 2} ${h * 2}`;
}

/** Sembollerin kapladığı alanı 4:3 bir viewBox'a sığdırır (en fazla tam sahne) */
export function fitView(marks: Mark[], pad = 24): string {
  if (!marks.length) return '0 0 400 300';
  let x0 = Infinity,
    y0 = Infinity,
    x1 = -Infinity,
    y1 = -Infinity;
  for (const m of marks) {
    const r = (m.size ?? 34) / 2;
    x0 = Math.min(x0, m.at[0] - r);
    x1 = Math.max(x1, m.at[0] + r);
    y0 = Math.min(y0, m.at[1] - r);
    y1 = Math.max(y1, m.at[1] + r);
  }
  let w = x1 - x0 + pad * 2;
  let h = y1 - y0 + pad * 2;
  if (w / h > 4 / 3) h = (w * 3) / 4;
  else w = (h * 4) / 3;
  w = Math.min(400, w);
  h = Math.min(300, h);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
}

/** Tur numaraları (sağda, rozet) */
export function RoundBadges({ rounds, center = [200, 150] as P, step = 34 }: { rounds: number; center?: P; step?: number }) {
  return (
    <g>
      {Array.from({ length: rounds }, (_, i) => (
        <Badge key={i} c={[center[0] + step * (i + 1) - 4, center[1] + 14]} n={i + 1} color={ROUND_COLORS[i % ROUND_COLORS.length]} />
      ))}
    </g>
  );
}

/* ── Büyükanne karesi ─────────────────────────────────── */
/**
 * 1. tur: halkaya 4 × (3 trabzan, 2 zincir). 2. tur: köşelere (3 trabzan, 2 zincir, 3 trabzan), aralara 1 zincir.
 * 3. tur: köşeler aynı, kenar boşluklarına 3 trabzan, aralarına 1'er zincir.
 */
export function grannyMarks({ rounds = 3, center = [200, 150] as P, size = 24 }: { rounds?: number; center?: P; size?: number }): Mark[] {
  const marks: Mark[] = [{ id: 'mr', at: center, size: size * 1.1, color: ROUND_COLORS[0], group: 0 }];
  const H = (r: number) => 16 + r * 32; // turun dış kenarı (merkezden)
  for (let r = 1; r <= rounds; r++) {
    const color = ROUND_COLORS[(r - 1) % ROUND_COLORS.length];
    const base = H(r - 1) + (r === 1 ? 0 : 3);
    const dcH = H(r) - base - 2;
    const dMid = base + dcH / 2;
    for (let s = 0; s < 4; s++) {
      const outDeg = -90 + s * 90;
      const out: P = [Math.cos(rad(outDeg)), Math.sin(rad(outDeg))];
      const tan: P = [-out[1], out[0]];
      const at = (u: number, d: number): P => add(center, add(mul(out, d), mul(tan, u)));
      const cluster = (u: number, tilt = 0) => {
        for (const k of [-1, 0, 1]) marks.push({ id: 'dc', at: at(u + k * 8, dMid), angle: outDeg + 90 + tilt + k * 7, size: dcH, color, group: r });
      };
      const ch = (u: number) => marks.push({ id: 'ch', at: at(u, H(r) - 2), angle: outDeg + 90, size: size * 0.62, color, group: r });
      if (r === 1) cluster(0);
      else {
        const e = H(r - 1) - 6;
        cluster(-e, -12);
        cluster(e, 12);
        const inner = r - 2;
        const slots = inner + 1;
        for (let j = 0; j < inner; j++) cluster(-e + ((2 * e) / slots) * (j + 1));
        for (let j = 0; j < slots; j++) ch(-e + ((2 * e) / slots) * (j + 0.5));
      }
      // köşe: 2 zincir
      const hr = H(r);
      marks.push({ id: 'ch', at: at(hr - 8, hr - 1), angle: outDeg + 90, size: size * 0.6, color, group: r });
      marks.push({ id: 'ch', at: at(hr - 1, hr - 8), angle: outDeg, size: size * 0.6, color, group: r });
    }
  }
  return marks;
}

/* ── Sıra şemaları (yelpaze, V, fıstık…) ──────────────── */
/** Zincir sırası: soldan sağa ovaller */
export function chainRowMarks(count: number, y: number, x0: number, step: number, size = 22, group = 0): Mark[] {
  return Array.from({ length: count }, (_, i) => ({ id: 'ch', at: [x0 + i * step, y] as P, size, color: ROUND_COLORS[0], group }));
}

/** Aynı tabandan yelpaze gibi açılan ilmekler */
export function fanMarks(base: P, count: number, spread: number, id: string, h: number, color: string, group: number): Mark[] {
  const out: Mark[] = [];
  for (let k = 0; k < count; k++) {
    const a = count === 1 ? 0 : -spread / 2 + (spread * k) / (count - 1);
    const center = add(base, mul([Math.sin(rad(a)), -Math.cos(rad(a))], h / 2));
    out.push({ id, at: center, angle: a, size: h, color, group });
  }
  return out;
}

/* ── Şiş grafiği okuma ───────────────────────────────── */
/**
 * Kareli grafik: sağ alttan başlanır. Ön yüz sıraları (tek) sağdan sola, arka yüz sıraları (çift) soldan sağa okunur.
 * `cells[0]` en ALT sıra; boş hücre = ön yüzde düz; '#rrggbb' renkli kare (renkli örgü grafiği).
 */
export function ChartReadScene({
  cells,
  row,
  round = false,
  cell = 28,
  showNumbers = true,
}: {
  cells: string[][];
  /** vurgulanan sıra (1'den) */
  row?: number;
  /** yuvarlak örgü: her tur sağdan sola */
  round?: boolean;
  cell?: number;
  showNumbers?: boolean;
}) {
  const H = cells.length;
  const W = Math.max(...cells.map((r) => r.length));
  const x0 = 200 - (W * cell) / 2;
  const y0 = 150 - (H * cell) / 2 + 4;
  const yOf = (r: number) => y0 + (H - 1 - r) * cell; // r: 0 = alt
  const rs = (r: number) => round || r % 2 === 0; // 1. sıra (r=0) ön yüz
  const els: ReactNode[] = [];
  const syms: ReactNode[] = [];
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const id = cells[r][c];
      const x = x0 + c * cell;
      const y = yOf(r);
      els.push(<rect key={`b${r}-${c}`} x={x} y={y} width={cell} height={cell} fill={id?.startsWith('#') ? id : 'var(--il-bg)'} stroke={C.grid} strokeWidth={1.4} />);
      const span = SYMBOL_BY_ID[id]?.span ?? 1;
      if (id && id !== 'k' && !id.startsWith('#')) syms.push(<SymbolMark key={`s${r}-${c}`} id={id} at={[x + (cell * span) / 2, y + cell / 2]} size={cell * 0.92} weight={10} />);
    }
  }
  const hl = row !== undefined ? row - 1 : undefined;
  return (
    <g style={{ fontFamily: 'var(--font-body)' }}>
      {els}
      {syms}
      <rect x={x0} y={y0} width={W * cell} height={H * cell} fill="none" stroke={C.inkSoft} strokeWidth={2} />
      {hl !== undefined && (
        <g>
          <rect x={x0 - 3} y={yOf(hl) - 3} width={W * cell + 6} height={cell + 6} rx={5} fill="var(--il-highlight)" fillOpacity={0.22} stroke="var(--il-highlight)" strokeWidth={3} />
          {rs(hl) ? (
            <Arrow d={`M${x0 + W * cell + 30} ${yOf(hl) + cell / 2} L${x0 + W * cell + 8} ${yOf(hl) + cell / 2}`} flow={false} />
          ) : (
            <Arrow d={`M${x0 - 30} ${yOf(hl) + cell / 2} L${x0 - 8} ${yOf(hl) + cell / 2}`} flow={false} />
          )}
        </g>
      )}
      {showNumbers &&
        Array.from({ length: H }, (_, r) => {
          const right = rs(r);
          return (
            <text key={`n${r}`} x={right ? x0 + W * cell + 38 : x0 - 38} y={yOf(r) + cell / 2 + 5} textAnchor={right ? 'start' : 'end'} fontSize={14} fontWeight={800} fill={hl === r ? C.arrow : C.inkSoft}>
              {r + 1}
            </text>
          );
        })}
    </g>
  );
}
