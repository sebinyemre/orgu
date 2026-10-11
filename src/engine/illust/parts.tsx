/**
 * Resimli adım motorunun çizim parçaları (SVG).
 *
 * Katman kuralı: bir ilmek ya da ip şişin/tığın ARKASINDAN geçiyorsa o parça şişten ÖNCE,
 * ÖNÜNDEN geçiyorsa SONRA çizilir. Sahne kurucular (knit.tsx, crochet.tsx) bu sırayı yönetir.
 *
 * Animasyonlar SMIL ile yapılır ve döngü süresine (Scene dur) göre zamanlanır.
 * `at: [başla, bitir]` döngü içindeki kesirlerdir (0–1).
 */
import { createContext, useContext, useId, type ReactNode } from 'react';
import { shade } from '@/lib/color';
import { add, angleOf, deg, mul, norm, perp, pt, sub, type P } from './geom';
import { C } from './theme';

/* ── Sahne bağlamı ─────────────────────────────────────── */
export interface SceneCtx {
  /** benzersiz id öneki */
  uid: string;
  /** döngü süresi (sn) */
  dur: number;
  /** animasyon açık mı */
  animate: boolean;
  /** solak modunda aynalı mı */
  mirrored: boolean;
}

export const SceneContext = createContext<SceneCtx>({ uid: 's', dur: 3, animate: true, mirrored: false });
export const useScene = () => useContext(SceneContext);

export type At = [number, number];

const SPL = '0 0 1 1; .45 0 .25 1; 0 0 1 1';

/** Değerler arası geçişi döngü içinde [a, b] aralığında yapan animate özellikleri */
function timing(at: At, dur: number) {
  const a = Math.max(0.001, Math.min(0.998, at[0]));
  const b = Math.max(a + 0.001, Math.min(0.999, at[1]));
  return { dur: `${dur}s`, repeatCount: 'indefinite', keyTimes: `0;${a};${b};1`, calcMode: 'spline', keySplines: SPL } as const;
}

/** Bir grubu döngü içinde bir konumdan son konumuna taşır (son konum: grubun normal konumu) */
export function Move({ from, at = [0.1, 0.6], children, fadeIn }: { from: P; at?: At; children: ReactNode; fadeIn?: boolean }) {
  const { dur, animate } = useScene();
  if (!animate) return <g>{children}</g>;
  return (
    <g>
      <animateTransform attributeName="transform" type="translate" values={`${pt(from)};${pt(from)};0 0;0 0`} {...timing(at, dur)} />
      {fadeIn && <animate attributeName="opacity" values="0;0;1;1" {...timing([at[0], at[0] + 0.12], dur)} />}
      {children}
    </g>
  );
}

/** Bir grubu döngü içinde normal konumundan `to` kadar kaydırır */
export function Slide({ to, at = [0.3, 0.7], children }: { to: P; at?: At; children: ReactNode }) {
  const { dur, animate } = useScene();
  if (!animate) return <g>{children}</g>;
  return (
    <g>
      <animateTransform attributeName="transform" type="translate" values={`0 0;0 0;${pt(to)};${pt(to)}`} {...timing(at, dur)} />
      {children}
    </g>
  );
}

/** Döngü içinde belirip kaybolma */
export function Fade({ at = [0.5, 0.65], out, children }: { at?: At; out?: boolean; children: ReactNode }) {
  const { dur, animate } = useScene();
  if (!animate) return out ? null : <g>{children}</g>;
  return (
    <g>
      <animate attributeName="opacity" values={out ? '1;1;0;0' : '0;0;1;1'} {...timing(at, dur)} />
      {children}
    </g>
  );
}

/* ── İp ────────────────────────────────────────────────── */
interface YarnProps {
  d: string;
  color: string;
  w?: number;
  /** döngü içinde baştan sona çizilerek belirir */
  draw?: At;
  /** soluk (geçmiş adım) */
  faded?: boolean;
  /** ip ucu: yuvarlak kesik */
  cap?: 'round' | 'butt';
}

/** Büküm dokulu ip şeridi */
export function Yarn({ d, color, w = 7, draw, faded, cap = 'round' }: YarnProps) {
  const { uid, dur, animate } = useScene();
  const id = useId().replace(/:/g, '');
  const dark = shade(color, -0.38);
  const light = shade(color, 0.32);
  const body = (
    <g opacity={faded ? 0.45 : 1}>
      <path d={d} fill="none" stroke={dark} strokeWidth={w + 2.4} strokeLinecap={cap} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={light} strokeWidth={w * 0.38} strokeLinecap="round" strokeDasharray={`${w * 0.7} ${w * 1.05}`} opacity={0.85} />
    </g>
  );
  if (!draw || !animate) return body;
  const mid = `${uid}m${id}`;
  return (
    <g>
      <defs>
        <mask id={mid} maskUnits="userSpaceOnUse">
          <path d={d} fill="none" stroke="#fff" strokeWidth={w + 8} strokeLinecap="round" pathLength={100} strokeDasharray="100 100">
            <animate attributeName="stroke-dashoffset" values="100;100;0;0" {...timing(draw, dur)} />
          </path>
        </mask>
      </defs>
      <g mask={`url(#${mid})`}>{body}</g>
    </g>
  );
}

/* ── Şiş ───────────────────────────────────────────────── */
interface NeedleProps {
  base: P;
  tip: P;
  /** kalınlık (px) */
  w?: number;
  color?: string;
  /** dip ucu: topuz (düz şiş), misina (misinalı şiş) ya da sivri (çorap şişi) */
  end?: 'knob' | 'cable' | 'point' | 'none';
}

export function Needle({ base, tip, w = 9, color, end = 'knob' }: NeedleProps) {
  const id = useId().replace(/:/g, '');
  const { uid } = useScene();
  const u = norm(sub(tip, base));
  const n = perp(u);
  const hw = w / 2;
  const taper = w * 2.6;
  const ts = sub(tip, mul(u, taper));
  const fill = color ?? C.needle;
  const gid = `${uid}n${id}`;
  const g1 = add(base, mul(n, hw));
  const g2 = sub(base, mul(n, hw));
  const tipR = Math.max(1.2, w * 0.16);
  const tipL = add(sub(tip, mul(u, tipR)), mul(n, tipR));
  const tipRr = sub(sub(tip, mul(u, tipR)), mul(n, tipR));
  const d = `M${pt(add(base, mul(n, hw)))} L${pt(add(ts, mul(n, hw)))} L${pt(tipL)} Q${pt(tip)} ${pt(tipRr)} L${pt(sub(ts, mul(n, hw)))} L${pt(sub(base, mul(n, hw)))}Z`;
  return (
    <g>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={g1[0]} y1={g1[1]} x2={g2[0]} y2={g2[1]}>
          <stop offset="0" stopColor={C.needleShade} />
          <stop offset="0.28" stopColor={fill} />
          <stop offset="0.45" stopColor={C.needleLight} />
          <stop offset="0.7" stopColor={fill} />
          <stop offset="1" stopColor={C.needleShade} />
        </linearGradient>
      </defs>
      {end === 'cable' && <path d={`M${pt(base)} q${pt(mul(u, -30))} ${pt(add(mul(u, -60), mul(n, 40)))}`} fill="none" stroke={C.inkSoft} strokeWidth={w * 0.35} strokeLinecap="round" />}
      <path d={d} fill={`url(#${gid})`} stroke={C.ink} strokeWidth={1.1} strokeLinejoin="round" />
      {end === 'knob' && (
        <g>
          <circle cx={base[0]} cy={base[1]} r={w * 1.05} fill={C.needleShade} stroke={C.ink} strokeWidth={1.1} />
          <circle cx={base[0] - w * 0.25} cy={base[1] - w * 0.3} r={w * 0.3} fill={C.needleLight} opacity={0.7} />
        </g>
      )}
    </g>
  );
}

/* ── Tığ ───────────────────────────────────────────────── */
interface HookProps {
  /** tığ ucunun (kanca) konumu */
  tip: P;
  /** derece: 0 = gövde sağa doğru uzanır, uç solda */
  angle?: number;
  length?: number;
  w?: number;
  color?: string;
  /** boğaz aşağı baksın */
  throatDown?: boolean;
}

/** Tığ: ucu `tip` noktasında, gövdesi açıya göre uzanır */
export function Hook({ tip, angle = 0, length = 260, w = 10, color, throatDown }: HookProps) {
  const id = useId().replace(/:/g, '');
  const { uid } = useScene();
  const hw = w / 2;
  const L = length;
  const fill = color ?? C.hook;
  const gid = `${uid}h${id}`;
  // yerel koordinat: uç (0,0), gövde +x yönünde
  const head = `M${L} ${-hw} L${w * 2.1} ${-hw} C${w * 1.5} ${-hw} ${w * 1.25} ${hw * 0.3} ${w * 0.85} ${hw * 0.25} C${w * 0.55} ${hw * 0.2} ${w * 0.5} ${-hw * 0.4} ${w * 0.38} ${-hw * 0.95} C${w * 0.25} ${-hw * 1.3} ${-w * 0.05} ${-hw * 0.9} ${-w * 0.08} ${-hw * 0.1} C${-w * 0.12} ${hw * 0.8} ${w * 0.3} ${hw} ${w * 0.7} ${hw} L${L} ${hw}Z`;
  const rest = `M${L * 0.42} ${-hw * 1.35} L${L * 0.66} ${-hw * 1.35} Q${L * 0.69} 0 ${L * 0.66} ${hw * 1.35} L${L * 0.42} ${hw * 1.35} Q${L * 0.39} 0 ${L * 0.42} ${-hw * 1.35}Z`;
  return (
    <g transform={`translate(${pt(tip)}) rotate(${angle})${throatDown ? ' scale(1 -1)' : ''}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1={-hw} x2="0" y2={hw} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.hookShade} />
          <stop offset="0.35" stopColor={fill} />
          <stop offset="0.5" stopColor={shade('#ffffff', 0)} stopOpacity={0.55} />
          <stop offset="0.65" stopColor={fill} />
          <stop offset="1" stopColor={C.hookShade} />
        </linearGradient>
      </defs>
      <path d={head} fill={`url(#${gid})`} stroke={C.ink} strokeWidth={1.1} strokeLinejoin="round" />
      <path d={rest} fill={C.hookShade} stroke={C.ink} strokeWidth={1.1} />
    </g>
  );
}

/** Tığın ucundaki boğaz noktası (ip burada yakalanır) — çağıran sahnede kullanmak için */
export function hookThroat(tip: P, angle: number, w = 10): P {
  const r = (angle * Math.PI) / 180;
  const local: P = [w * 0.85, 0];
  return [tip[0] + local[0] * Math.cos(r) - local[1] * Math.sin(r), tip[1] + local[0] * Math.sin(r) + local[1] * Math.cos(r)];
}

/* ── Şişteki ilmek ─────────────────────────────────────── */
export interface LoopGeom {
  /** ilmeğin şişi kestiği merkez */
  c: P;
  /** şiş açısı (derece) */
  angle: number;
  /** ilmek genişliği */
  w?: number;
  /** şişin altına sarkma boyu */
  h?: number;
  /** şiş kalınlığı */
  nw?: number;
  /** ters monte: sol bacak önde (burgulu) */
  twisted?: boolean;
  /** ip kalınlığı */
  yw?: number;
}

function loopPaths({ c, angle, w = 22, h = 30, nw = 9, twisted }: LoopGeom) {
  const r = nw / 2 + 2.5;
  // yerel: şiş yatay, ilmek merkezi (0,0)
  const back: P[] = [
    [-w * 0.5, h],
    [-w * 0.42, h * 0.45],
    [-w * 0.3, 0],
  ];
  const top = `M${-w * 0.3} ${-0} C${-w * 0.3} ${-r * 1.9} ${w * 0.3} ${-r * 1.9} ${w * 0.3} 0`;
  const frontLeg = `M${w * 0.3} 0 C${w * 0.34} ${h * 0.35} ${w * 0.46} ${h * 0.6} ${w * 0.5} ${h}`;
  const backLeg = `M${back[0][0]} ${back[0][1]} C${back[1][0]} ${back[1][1] + 6} ${back[2][0]} ${h * 0.25} ${back[2][0]} 0`;
  const tf = `translate(${pt(c)}) rotate(${angle})${twisted ? ' scale(-1 1)' : ''}`;
  return { tf, top, frontLeg, backLeg };
}

/** İlmeğin şişin arkasında kalan bacağı (şişten önce çiz) */
export function LoopBack(props: LoopGeom & { color: string; faded?: boolean }) {
  const p = loopPaths(props);
  return (
    <g transform={p.tf}>
      <Yarn d={p.backLeg} color={props.color} faded={props.faded} w={props.yw} />
    </g>
  );
}

/** İlmeğin şişin önündeki bacağı ve tepe kavisi (şişten sonra çiz) */
export function LoopFront(props: LoopGeom & { color: string; faded?: boolean }) {
  const p = loopPaths(props);
  return (
    <g transform={p.tf}>
      <Yarn d={p.frontLeg} color={props.color} faded={props.faded} w={props.yw} />
      <Yarn d={p.top} color={props.color} faded={props.faded} w={props.yw} />
    </g>
  );
}

/* ── Tığdaki ilmek ─────────────────────────────────────── */
/** Tığ gövdesini saran ilmeğin arka yarısı (tığdan önce çiz) */
export function HookLoopBack({ c, angle = 0, color, ry = 10, rx = 5, w = 6 }: { c: P; angle?: number; color: string; ry?: number; rx?: number; w?: number }) {
  return (
    <g transform={`translate(${pt(c)}) rotate(${angle})`}>
      <Yarn d={`M0 ${-ry} C${rx * 1.6} ${-ry} ${rx * 1.6} ${ry} 0 ${ry}`} color={color} w={w} />
    </g>
  );
}

/** Tığ gövdesini saran ilmeğin ön yarısı (tığdan sonra çiz) */
export function HookLoopFront({ c, angle = 0, color, ry = 10, rx = 5, w = 6 }: { c: P; angle?: number; color: string; ry?: number; rx?: number; w?: number }) {
  return (
    <g transform={`translate(${pt(c)}) rotate(${angle})`}>
      <Yarn d={`M0 ${-ry} C${-rx * 1.6} ${-ry} ${-rx * 1.6} ${ry} 0 ${ry}`} color={color} w={w} />
    </g>
  );
}

/* ── Ok ────────────────────────────────────────────────── */
interface ArrowProps {
  d: string;
  /** 1, 2, 3… numaralı rozet (okun başında) */
  n?: number;
  start?: P;
  color?: string;
  /** akan kesik çizgi */
  flow?: boolean;
  /** döngü içinde görünür olduğu aralık */
  show?: At;
  w?: number;
}

/** Hareket oku: ucunda ok başı, isteğe bağlı numara rozeti, akan kesik çizgi */
export function Arrow({ d, n, start, color = C.arrow, flow = true, show, w = 4 }: ArrowProps) {
  const { uid, dur, animate, mirrored } = useScene();
  const id = useId().replace(/:/g, '');
  const mid = `${uid}a${id}`;
  const el = (
    <g>
      <defs>
        <marker id={mid} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.6" markerHeight="3.6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 L2.5 5Z" fill={color} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke="var(--il-bg)" strokeWidth={w + 4} strokeLinecap="round" opacity={0.85} />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={flow ? '9 7' : undefined} markerEnd={`url(#${mid})`} className={flow && animate ? 'il-flow' : undefined} />
      {n !== undefined && start && (
        <g transform={`translate(${pt(start)})`}>
          <circle r={12} fill={color} stroke="var(--il-bg)" strokeWidth={2.5} />
          <text x={0} y={5} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff" transform={mirrored ? 'scale(-1 1)' : undefined} style={{ fontFamily: 'var(--font-body)' }}>
            {n}
          </text>
        </g>
      )}
    </g>
  );
  if (!show || !animate) return el;
  return (
    <g>
      <animate attributeName="opacity" values="0;0;1;1" {...timing(show, dur)} />
      {el}
    </g>
  );
}

/** "Buraya bat" halkası (nabız gibi atar) */
export function Target({ c, r = 13, color = C.highlight }: { c: P; r?: number; color?: string }) {
  const { dur, animate } = useScene();
  return (
    <g>
      <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray="4 4" opacity={0.95}>
        {animate && <animate attributeName="r" values={`${r};${r * 1.25};${r}`} dur={`${Math.max(1, dur / 2)}s`} repeatCount="indefinite" />}
      </circle>
    </g>
  );
}

/** Sayı rozeti (numaralı nokta) */
export function Badge({ c, n, color = C.arrow2 }: { c: P; n: number | string; color?: string }) {
  const { mirrored } = useScene();
  return (
    <g transform={`translate(${pt(c)})`}>
      <circle r={11} fill={color} stroke="var(--il-bg)" strokeWidth={2} />
      <text y={4.5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff" transform={mirrored ? 'scale(-1 1)' : undefined} style={{ fontFamily: 'var(--font-body)' }}>
        {n}
      </text>
    </g>
  );
}

/** Kısa yazı etiketi (çizim içinde, aynalamaya dayanıklı) */
export function Tag({ c, text, anchor = 'middle', color = C.inkSoft, size = 13 }: { c: P; text: string; anchor?: 'start' | 'middle' | 'end'; color?: string; size?: number }) {
  const { mirrored } = useScene();
  const a = mirrored ? (anchor === 'start' ? 'end' : anchor === 'end' ? 'start' : 'middle') : anchor;
  return (
    <g transform={`translate(${pt(c)})${mirrored ? ' scale(-1 1)' : ''}`}>
      <text textAnchor={a} fontSize={size} fontWeight={700} fill={color} stroke="var(--il-bg)" strokeWidth={4} paintOrder="stroke" style={{ fontFamily: 'var(--font-hand)', fontSize: size * 1.35 }}>
        {text}
      </text>
    </g>
  );
}

/* ── Yumak ─────────────────────────────────────────────── */
export function Ball({ c, r = 26, color }: { c: P; r?: number; color: string }) {
  const id = useId().replace(/:/g, '');
  const { uid } = useScene();
  const cid = `${uid}b${id}`;
  const light = shade(color, 0.3);
  const dark = shade(color, -0.3);
  return (
    <g>
      <defs>
        <clipPath id={cid}>
          <circle cx={c[0]} cy={c[1]} r={r} />
        </clipPath>
      </defs>
      <circle cx={c[0]} cy={c[1]} r={r} fill={color} stroke={dark} strokeWidth={1.5} />
      <g clipPath={`url(#${cid})`} fill="none" strokeWidth={2}>
        {[0.3, 0.6, 0.9].map((k) => (
          <ellipse key={k} cx={c[0]} cy={c[1]} rx={r * 1.4} ry={r * k} stroke={light} transform={`rotate(-28 ${pt(c)})`} opacity={0.8} />
        ))}
        {[0.25, 0.55, 0.85].map((k) => (
          <ellipse key={k} cx={c[0]} cy={c[1]} rx={r * 1.3} ry={r * k} stroke={dark} transform={`rotate(62 ${pt(c)})`} opacity={0.5} />
        ))}
      </g>
    </g>
  );
}

/* ── Örülmüş kumaş (şişin altında sarkan kısım) ───────── */
interface KnitFabricProps {
  /** her sütunun üst ilmek merkezi (x) */
  xs: number[];
  /** ilk (en üst) sıranın üst kenarı y */
  top: number;
  rows: number;
  color: string;
  /** sütun eni ve sıra boyu */
  sw?: number;
  rh?: number;
  /** 'k' düz (V), 'p' ters (boncuk) — sütun bazında */
  kinds?: ('k' | 'p')[];
  faded?: boolean;
  /** sütunun eğimi (şiş açısına uyum) */
  slope?: number;
  /** ip kalınlığı */
  yw?: number;
}

/** V'ler ve boncuklarla örülmüş kumaş parçası */
export function KnitFabric({ xs, top, rows, color, sw = 24, rh = 18, kinds, faded, slope = 0, yw = 6 }: KnitFabricProps) {
  const dark = shade(color, -0.32);
  const light = shade(color, 0.22);
  const items: ReactNode[] = [];
  for (let r = rows - 1; r >= 0; r--) {
    xs.forEach((x, i) => {
      const y = top + r * rh + slope * (x - xs[0]);
      const k = kinds?.[i] ?? 'k';
      const key = `${r}-${i}`;
      if (k === 'k') {
        const legL = `M${x - sw * 0.42} ${y} C${x - sw * 0.36} ${y + rh * 0.55} ${x - sw * 0.12} ${y + rh * 0.95} ${x} ${y + rh * 1.15}`;
        const legR = `M${x + sw * 0.42} ${y} C${x + sw * 0.36} ${y + rh * 0.55} ${x + sw * 0.12} ${y + rh * 0.95} ${x} ${y + rh * 1.15}`;
        items.push(
          <g key={key}>
            <path d={legL} stroke={dark} strokeWidth={yw + 2.4} fill="none" strokeLinecap="round" />
            <path d={legR} stroke={dark} strokeWidth={yw + 2.4} fill="none" strokeLinecap="round" />
            <path d={legL} stroke={color} strokeWidth={yw} fill="none" strokeLinecap="round" />
            <path d={legR} stroke={color} strokeWidth={yw} fill="none" strokeLinecap="round" />
            <path d={legL} stroke={light} strokeWidth={yw * 0.36} fill="none" strokeLinecap="round" strokeDasharray={`${yw * 0.7} ${yw * 0.9}`} />
            <path d={legR} stroke={light} strokeWidth={yw * 0.36} fill="none" strokeLinecap="round" strokeDasharray={`${yw * 0.7} ${yw * 0.9}`} />
          </g>,
        );
      } else {
        items.push(
          <g key={key}>
            <ellipse cx={x} cy={y + rh * 0.55} rx={sw * 0.5} ry={Math.max(yw * 0.75, rh * 0.3)} fill={color} stroke={dark} strokeWidth={1.4} />
            <path d={`M${x - sw * 0.35} ${y + rh * 0.5} Q${x} ${y + rh * 0.3} ${x + sw * 0.35} ${y + rh * 0.5}`} stroke={light} strokeWidth={yw * 0.3} fill="none" />
          </g>,
        );
      }
    });
  }
  return <g opacity={faded ? 0.5 : 1}>{items}</g>;
}

/* ── El (parametrik "kapsül parmaklı" el) ─────────────── */
export interface FingerPose {
  /** parmak kökünün avuç içindeki yeri (yerel) */
  base: P;
  /** her boğumun mutlak açısı (derece, -90 = yukarı) */
  angles: number[];
  /** boğum uzunlukları */
  lens: number[];
  /** kalınlık */
  w: number;
  /** avucun arkasında mı çizilsin */
  behind?: boolean;
}

export interface HandPose {
  palm: string;
  fingers: FingerPose[];
}

function fingerPath(f: FingerPose): string {
  let p = f.base;
  const pts: P[] = [p];
  f.angles.forEach((a, i) => {
    const r = (a * Math.PI) / 180;
    p = [p[0] + Math.cos(r) * f.lens[i], p[1] + Math.sin(r) * f.lens[i]];
    pts.push(p);
  });
  return pts.map((q, i) => `${i ? 'L' : 'M'}${pt(q)}`).join(' ');
}

interface HandProps {
  pose: HandPose;
  at: P;
  scale?: number;
  rotate?: number;
  /** sol el için yatay aynala */
  flip?: boolean;
  /** yarı saydam (arkadaki ip/şiş görünsün) */
  ghost?: boolean;
}

/** Parmakları kapsül şeklinde çizilen sade el (işaret dili kartlarındaki gibi) */
export function Hand({ pose, at, scale = 1, rotate = 0, flip, ghost }: HandProps) {
  const tf = `translate(${pt(at)}) rotate(${rotate}) scale(${flip ? -scale : scale} ${scale})`;
  const finger = (f: FingerPose, i: number) => {
    const d = fingerPath(f);
    return (
      <g key={i}>
        <path d={d} stroke={C.skinLine} strokeWidth={f.w + 2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={C.skin} strokeWidth={f.w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };
  return (
    <g transform={tf} opacity={ghost ? 0.88 : 1}>
      {pose.fingers.filter((f) => f.behind).map(finger)}
      <path d={pose.palm} fill={C.skin} stroke={C.skinLine} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={pose.palm} fill={C.skinShade} opacity={0.25} transform="translate(3 4) scale(0.92)" />
      {pose.fingers.filter((f) => !f.behind).map(finger)}
    </g>
  );
}

/** Açılı bir doğrunun açısını derece olarak verir (sahne kurucular için) */
export const lineAngle = (a: P, b: P) => deg(angleOf(a, b));
