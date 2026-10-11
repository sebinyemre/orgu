/**
 * Yuvarlak örgü sahneleri (yukarıdan bakış): misinalı şiş halkası, magic loop, çorap şişleri, bere.
 * Halka sahnelerinde ilmek atma kenarı (küçük boncuklar) halkanın İÇİNE bakar; burulma varsa
 * kenar bir yerde dışarı taşar ve bu çizimde açıkça görünür.
 */
import type { ReactNode } from 'react';
import { shade } from '@/lib/color';
import { add, ellipse, mul, rad, sub, norm, perp, smooth, type P } from './geom';
import { Arrow, Ball, Badge, LoopBack, LoopFront, Move, Needle, Target, Yarn } from './parts';
import { C, YARN } from './theme';

const MARKER = '#c4473a';
const EDGE = '#a8662f';

/* ── yardımcılar ── */
const onEllipse = (c: P, rx: number, ry: number, deg: number): P => [c[0] + rx * Math.cos(rad(deg)), c[1] + ry * Math.sin(rad(deg))];
/** elipsin o noktadaki içe bakan birim normali */
const inward = (c: P, rx: number, ry: number, deg: number): P => norm(sub(c, onEllipse(c, rx, ry, deg)));

/** Halkada bir ilmek: kabloyu saran küçük göz + içte (ya da dışta) ilmek atma boncuğu */
function RingStitch({ at, n, color, out }: { at: P; n: P; color: string; out?: boolean }) {
  const t = perp(n);
  const ang = (Math.atan2(t[1], t[0]) * 180) / Math.PI;
  return <Yarn d={ellipse(add(at, mul(n, out ? -6 : 6)), 6, 11, ang + 90)} color={color} w={4.5} />;
}

/** İlmek atma kenarı: ilmeklerin altından geçen sürekli çizgi */
function CastOnEdge({ points }: { points: P[] }) {
  return <Yarn d={smooth(points)} color={EDGE} w={6} />;
}

/* ── Misinalı şiş halkası ─────────────────────────────── */
export type CircularPhase = 'cast' | 'twisted' | 'check' | 'marker' | 'join' | 'around';

export function CircularScene({ phase, count = 24 }: { phase: CircularPhase; count?: number }) {
  const c: P = [200, 136];
  const rx = 138;
  const ry = 86;
  const gapL = 116; // sol şiş ucunun başladığı açı
  const gapR = 64;
  const tipL: P = [188, 236];
  const tipR: P = [214, 236];
  const baseL = onEllipse(c, rx, ry, gapL + 30);
  const baseR = onEllipse(c, rx, ry, gapR - 30);
  const cable = `M${baseR[0]} ${baseR[1]} A${rx} ${ry} 0 1 0 ${baseL[0]} ${baseL[1]}`;
  const twisted = phase === 'twisted';
  // ilmekler: sol şiş ucundan başlayıp halka boyunca saat yönünün tersine sağ uca kadar
  const span = 360 - (gapL - gapR) - 26;
  const stitches = Array.from({ length: count }, (_, k) => {
    const deg = gapL + 12 + (span * k) / (count - 1);
    const at = onEllipse(c, rx, ry, deg);
    const n = inward(c, rx, ry, deg);
    // burulmuş: sağ yarıda kenar dışarı döner
    const out = twisted && ((deg % 360) + 360) % 360 > 300;
    return { at, n, out, deg };
  });
  const ycol = YARN.second;
  const lastR = stitches[stitches.length - 1].at;
  const yarn = `M${lastR[0]} ${lastR[1]} C${lastR[0] + 30} ${lastR[1] + 30} 300 270 330 262`;
  return (
    <g>
      <path d={cable} fill="none" stroke={C.inkSoft} strokeWidth={4} strokeLinecap="round" />
      <Needle base={baseL} tip={tipL} w={10} end="none" />
      <Needle base={baseR} tip={tipR} w={10} end="none" />
      {stitches.map((s, k) => (
        <RingStitch key={k} at={s.at} n={s.n} color={YARN.main} out={s.out} />
      ))}
      <CastOnEdge points={stitches.map((s) => add(s.at, mul(s.n, s.out ? -17 : 17)))} />
      <Yarn d={yarn} color={ycol} w={6} />
      <Ball c={[338, 262]} r={22} color={ycol} />
      {twisted && <Target c={onEllipse(c, rx, ry, 300)} r={30} color={C.arrow} />}
      {phase === 'check' && (
        <g>
          <Arrow d={`M${c[0] - 60} ${c[1] + 4} C${c[0] - 30} ${c[1] - 26} ${c[0] + 30} ${c[1] - 26} ${c[0] + 60} ${c[1] + 4}`} n={1} start={[c[0] - 74, c[1] + 10]} flow={false} />
          <Target c={c} r={60} />
        </g>
      )}
      {(phase === 'marker' || phase === 'join' || phase === 'around') && (
        <g>
          <ellipse cx={tipR[0] + 26} cy={tipR[1] - 9} rx={5} ry={10} transform={`rotate(-62 ${tipR[0] + 26} ${tipR[1] - 9})`} fill="none" stroke={MARKER} strokeWidth={4} />
          {phase === 'marker' && <Target c={[tipR[0] + 26, tipR[1] - 9]} r={18} />}
        </g>
      )}
      {phase === 'join' && <Arrow d={`M${tipR[0] + 6} ${tipR[1] + 26} C${tipR[0] - 2} ${tipR[1] + 44} ${tipL[0] - 10} ${tipL[1] + 40} ${tipL[0] - 16} ${tipL[1] + 8}`} n={2} start={[tipR[0] + 20, tipR[1] + 30]} />}
      {phase === 'around' && (
        <Arrow d={`M${c[0] + 70} ${c[1] + 52} A${rx - 50} ${ry - 34} 0 1 0 ${c[0] - 70} ${c[1] + 50}`} n={3} start={[c[0] + 82, c[1] + 58]} />
      )}
    </g>
  );
}

/* ── Magic loop ──────────────────────────────────────── */
export type MagicLoopPhase = 'split' | 'pull' | 'knit' | 'turn';

/** Önden görünüş: ilmeklerin yarısı öndeki şiş ucunda, yarısı arkadaki kabloda; kablo iki yandan halka yapar */
export function MagicLoopScene({ phase }: { phase: MagicLoopPhase }) {
  const yFront = 196;
  const yBack = 128;
  const x0 = 120;
  const x1 = 290;
  const n = 6;
  const xs = Array.from({ length: n }, (_, i) => x0 + 18 + ((x1 - x0 - 36) * i) / (n - 1));
  const lp = { w: 20, h: 26, nw: 9, yw: 6 };
  const backOnNeedle = phase === 'split';
  // ön ilmekler örüldükçe sağdaki uca geçer
  const worked = phase === 'knit' ? 2 : 0;
  const ycol = YARN.second;
  const tipBPulled = phase !== 'split';
  return (
    <g>
      {/* sol halka: iki yarının arasından çıkan kablo */}
      <path d={`M${x0} ${yFront} C${x0 - 90} ${yFront + 10} ${x0 - 90} ${yBack - 10} ${x0} ${yBack}`} fill="none" stroke={C.inkSoft} strokeWidth={4} />
      {/* arka yarı: kablo ya da şiş */}
      {backOnNeedle ? (
        <Needle base={[x0, yBack]} tip={[x1 + 20, yBack - 4]} w={10} end="none" />
      ) : (
        <path d={`M${x0} ${yBack} L${x1 + 10} ${yBack - 2}`} fill="none" stroke={C.inkSoft} strokeWidth={4} />
      )}
      {xs.map((x, i) => (
        <LoopBack key={`bb${i}`} c={[x, yBack - 1]} angle={0} color={YARN.main} {...lp} faded />
      ))}
      {xs.map((x, i) => (
        <LoopFront key={`bf${i}`} c={[x, yBack - 1]} angle={0} color={YARN.main} {...lp} faded />
      ))}
      {/* arka şiş ucu dışarı çekilince kablosu sağdan halka yapar */}
      {tipBPulled && (
        <Move from={phase === 'pull' ? [-120, 0] : [0, 0]} at={[0.1, 0.55]}>
          <g>
            <path
              d={phase === 'knit' || phase === 'turn' ? `M${x1 + 10} ${yBack - 2} C${x1 + 90} ${yBack - 10} ${x1 + 110} ${yFront + 40} ${x1 + 56} ${yFront + 18}` : `M${x1 + 10} ${yBack - 2} C${x1 + 60} ${yBack - 6} ${x1 + 80} ${yBack - 40} ${x1 + 70} ${yBack - 60}`}
              fill="none"
              stroke={C.inkSoft}
              strokeWidth={4}
            />
            {phase === 'knit' || phase === 'turn' ? <Needle base={[x1 + 56, yFront + 18]} tip={[x1 - 30, yFront - 26]} w={10} end="none" /> : <Needle base={[x1 + 70, yBack - 60]} tip={[x1 + 10, yBack - 150]} w={10} end="none" />}
          </g>
        </Move>
      )}
      {/* ön yarı: şiş ucunda */}
      <Needle base={[x0, yFront]} tip={[x1 + 24, yFront - 4]} w={10} end="none" />
      {xs.map((x, i) =>
        i >= n - worked ? null : (
          <g key={`f${i}`}>
            <LoopBack c={[x, yFront - 1]} angle={0} color={YARN.main} {...lp} />
            <LoopFront c={[x, yFront - 1]} angle={0} color={YARN.main} {...lp} />
          </g>
        ),
      )}
      {phase === 'knit' && <Yarn d={`M${x1 - 40} ${yBack + 6} C${x1 - 30} ${yBack + 40} ${x1 + 20} ${yFront + 50} 360 290`} color={ycol} w={6} />}
      {phase === 'split' && <Arrow d={`M${x0 - 20} ${yFront + 40} C${x0 - 70} ${yFront + 30} ${x0 - 84} ${yBack + 50} ${x0 - 66} ${yBack + 26}`} n={1} start={[x0 - 6, yFront + 46]} />}
      {phase === 'pull' && <Arrow d={`M${x1 - 30} ${yBack - 46} C${x1} ${yBack - 80} ${x1 + 40} ${yBack - 90} ${x1 + 60} ${yBack - 110}`} n={2} start={[x1 - 44, yBack - 40]} />}
      {phase === 'knit' && <Arrow d={`M${x1 - 50} ${yFront + 44} C${x1 - 20} ${yFront + 60} ${x1 + 10} ${yFront + 50} ${x1 + 30} ${yFront + 30}`} n={3} start={[x1 - 64, yFront + 44]} />}
      {phase === 'turn' && <Arrow d={`M200 278 C250 290 300 282 330 262 C344 250 340 236 330 230`} n={4} start={[186, 278]} />}
    </g>
  );
}

/* ── Çorap şişleri (üçgen) ───────────────────────────── */
export type DpnPhase = 'divide' | 'join' | 'knit' | 'ladder';

export function DpnScene({ phase, perNeedle = 5 }: { phase: DpnPhase; perNeedle?: number }) {
  const c: P = [196, 150];
  const R = 100;
  const v = [-90, 30, 150].map((a) => [c[0] + R * Math.cos(rad(a)), c[1] + R * Math.sin(rad(a))] as P);
  const edges: [P, P][] = [
    [v[1], v[0]],
    [v[0], v[2]],
    [v[2], v[1]],
  ];
  const ycol = YARN.second;
  const items: ReactNode[] = [];
  edges.forEach(([a, b], e) => {
    const u = norm(sub(b, a));
    const ext = 22;
    const base = sub(a, mul(u, ext));
    const tip = add(b, mul(u, ext));
    const nIn = perp(u); // kenarın içe bakan normali (saat yönünde dolaşım)
    items.push(<Needle key={`n${e}`} base={base} tip={tip} w={9} end="point" />);
    const edge: P[] = [];
    for (let k = 0; k < perNeedle; k++) {
      const t = (k + 0.5) / perNeedle;
      const at: P = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      items.push(<RingStitch key={`s${e}-${k}`} at={at} n={mul(nIn, -1) as P} color={YARN.main} />);
      edge.push(add(at, mul(nIn, -17)));
    }
    items.push(<CastOnEdge key={`e${e}`} points={edge} />);
    if (phase === 'divide') {
      const mid = add([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], mul(nIn, 30));
      items.push(<Badge key={`b${e}`} c={mid} n={perNeedle} color={C.arrow2} />);
    }
  });
  // çalışma ucu ve 4. şiş: alt köşe (v[1] ile v[2] arası alt kenarın sağ ucu)
  const work = v[1];
  return (
    <g>
      {items}
      {(phase === 'knit' || phase === 'ladder') && <Needle base={[work[0] + 80, work[1] + 60]} tip={[work[0] - 34, work[1] - 22]} w={9} end="point" />}
      <Yarn d={`M${work[0] + 4} ${work[1] + 10} C${work[0] + 30} ${work[1] + 50} 340 280 360 290`} color={ycol} w={6} />
      {phase === 'join' && <Arrow d={`M${work[0] + 20} ${work[1] + 34} C${work[0] - 4} ${work[1] + 50} ${work[0] - 30} ${work[1] + 20} ${work[0] - 24} ${work[1] - 6}`} n={1} start={[work[0] + 34, work[1] + 38]} />}
      {phase === 'knit' && <Arrow d={`M${work[0] + 40} ${work[1] - 40} C${work[0] + 10} ${work[1] - 70} ${work[0] - 30} ${work[1] - 80} ${work[0] - 50} ${work[1] - 110}`} n={2} start={[work[0] + 52, work[1] - 30]} />}
      {phase === 'ladder' && v.map((p, i) => <Target key={i} c={p} r={22} />)}
    </g>
  );
}

/* ── Bere ────────────────────────────────────────────── */
export type HatPart = 'all' | 'brim' | 'body' | 'crown' | 'close' | 'measure';

export function HatScene({ part, color = '#b5523b' }: { part: HatPart; color?: string }) {
  const dark = shade(color, -0.3);
  const light = shade(color, 0.25);
  const L = 110;
  const Rr = 290;
  const yBrimB = 262;
  const yBrimT = 220;
  const yBodyT = 130;
  const top: P = [200, 46];
  const crown = `M${L + 6} ${yBodyT} C${L + 10} ${yBodyT - 60} ${top[0] - 60} ${top[1]} ${top[0]} ${top[1]} C${top[0] + 60} ${top[1]} ${Rr - 10} ${yBodyT - 60} ${Rr - 6} ${yBodyT}`;
  const fade = (p: HatPart) => (part === 'all' || part === 'measure' || part === p ? 1 : 0.35);
  const ribs = Array.from({ length: 16 }, (_, i) => L + 6 + (i * (Rr - L - 12)) / 15);
  const bodyCols = Array.from({ length: 11 }, (_, i) => L + 18 + (i * (Rr - L - 36)) / 10);
  return (
    <g>
      {/* gövde */}
      <g opacity={fade('body')}>
        <path d={`M${L + 6} ${yBrimT} L${L + 6} ${yBodyT} L${Rr - 6} ${yBodyT} L${Rr - 6} ${yBrimT}Z`} fill={color} stroke={dark} strokeWidth={2} />
        {bodyCols.map((x, i) =>
          Array.from({ length: 6 }, (_, r) => {
            const y = yBodyT + 6 + r * 14;
            return <path key={`v${i}-${r}`} d={`M${x - 7} ${y} L${x} ${y + 9} L${x + 7} ${y}`} fill="none" stroke={light} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />;
          }),
        )}
      </g>
      {/* tepe */}
      <g opacity={fade('crown')}>
        <path d={`${crown}Z`} fill={color} stroke={dark} strokeWidth={2} />
        {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
          <path key={k} d={`M${200 + k * 26} ${yBodyT} Q${200 + k * 14} ${(yBodyT + top[1]) / 2 + 8} ${top[0]} ${top[1] + 6}`} fill="none" stroke={dark} strokeWidth={2.2} strokeDasharray={k % 2 === 0 ? undefined : '0'} />
        ))}
      </g>
      {/* lastik */}
      <g opacity={fade('brim')}>
        <rect x={L} y={yBrimT} width={Rr - L} height={yBrimB - yBrimT} rx={8} fill={shade(color, -0.08)} stroke={dark} strokeWidth={2} />
        {ribs.map((x, i) => (
          <path key={i} d={`M${x} ${yBrimT + 5} L${x} ${yBrimB - 5}`} stroke={i % 2 === 0 ? light : dark} strokeWidth={i % 2 === 0 ? 4 : 2} strokeLinecap="round" />
        ))}
      </g>
      {part === 'close' && (
        <g>
          <Yarn d={`M${top[0]} ${top[1] + 4} C${top[0] + 20} ${top[1] - 30} ${top[0] + 60} ${top[1] - 34} ${top[0] + 96} ${top[1] - 20}`} color={YARN.second} w={5} />
          <Needle base={[top[0] + 150, top[1] - 6]} tip={[top[0] + 96, top[1] - 20]} w={7} end="none" color="#c9c3b5" />
          <Arrow d={`M${top[0] - 40} ${top[1] + 40} C${top[0] - 20} ${top[1] + 20} ${top[0] - 8} ${top[1] + 14} ${top[0] - 4} ${top[1] + 8}`} n={1} start={[top[0] - 52, top[1] + 50]} />
        </g>
      )}
      {part === 'measure' && (
        <g>
          <Arrow d={`M${L - 4} ${yBrimB + 18} L${Rr + 4} ${yBrimB + 18}`} flow={false} />
          <Arrow d={`M${Rr + 4} ${yBrimB + 18} L${L - 4} ${yBrimB + 18}`} flow={false} />
          <Arrow d={`M${Rr + 22} ${yBrimB} L${Rr + 22} ${top[1] + 4}`} flow={false} />
        </g>
      )}
    </g>
  );
}
