/**
 * Birleşik sahneler: eller, serbest ip (kaygan düğüm, sihirli halka), başparmakla ilmek atma, tutuşlar.
 * Her sahne bir `phase` alır ve o adımın çizimini + oklarını üretir.
 */
import type { ReactNode } from 'react';
import { add, mul, type P } from './geom';
import { Arrow, Ball, Fade, Hand, HookLoopBack, HookLoopFront, Hook, LoopBack, LoopFront, Move, Needle, Target, Yarn, type At } from './parts';
import { HANDS, fingerTip } from './hands';
import { YARN } from './theme';

/** Elin yerel noktasını sahne koordinatına çevirir */
function handPoint(local: P, at: P, scale: number, rotate: number, flip: boolean): P {
  const x = (flip ? -local[0] : local[0]) * scale;
  const y = local[1] * scale;
  const r = (rotate * Math.PI) / 180;
  return [at[0] + x * Math.cos(r) - y * Math.sin(r), at[1] + x * Math.sin(r) + y * Math.cos(r)];
}

/* ── Kaygan düğüm ─────────────────────────────────────── */
export type SlipKnotPhase = 'loop' | 'through' | 'tighten' | 'onHook';

export function SlipKnotScene({ phase, tool = 'needle' }: { phase: SlipKnotPhase; tool?: 'needle' | 'hook' }) {
  const main = YARN.main;
  const work = YARN.second;
  if (phase === 'loop') {
    return (
      <g>
        <Yarn d="M20 236 C80 236 130 232 168 214 C212 192 226 140 200 112 C176 88 132 104 132 142 C132 180 170 214 220 232" color={main} w={10} draw={[0.05, 0.55]} />
        <Yarn d="M220 232 C270 248 320 250 352 246" color={work} w={10} />
        <Ball c={[372, 244]} r={24} color={work} />
        <Arrow d="M226 100 C250 120 246 160 228 186" n={1} start={[226, 84]} show={[0.55, 0.65]} />
      </g>
    );
  }
  if (phase === 'through') {
    return (
      <g>
        {/* halkanın arkasından ip katı (çalışan ipten) yukarı çekilir */}
        <Yarn d="M220 232 C270 248 320 250 352 246" color={work} w={10} />
        <Move from={[0, 50]} at={[0.15, 0.6]}>
          <Yarn d="M196 214 C186 180 180 136 170 120 C162 104 188 98 196 116 C204 136 204 180 214 226" color={work} w={10} />
        </Move>
        <Yarn d="M20 236 C80 236 130 232 168 214 C212 192 226 140 200 112 C176 88 132 104 132 142 C132 180 170 214 220 232" color={main} w={10} />
        <Ball c={[372, 244]} r={24} color={work} />
        <Arrow d="M232 250 C238 200 232 150 200 96" n={2} start={[238, 266]} />
      </g>
    );
  }
  // tighten / onHook: çıkan ilmek şişe ya da tığa takılır, iki uç çekilerek sıkılır
  const isHook = tool === 'hook' || phase === 'onHook';
  return (
    <g>
      <Yarn d="M30 250 C90 246 140 236 176 216" color={main} w={10} />
      <Yarn d="M222 214 C262 234 320 246 352 246" color={work} w={10} />
      {/* düğüm */}
      <Yarn d="M176 216 C186 196 210 196 222 214 C210 232 186 232 176 216" color={main} w={10} />
      {isHook ? (
        <g>
          <HookLoopBack c={[200, 168]} angle={-20} color={work} ry={16} rx={9} w={10} />
          <Hook tip={[150, 170]} angle={-20} length={300} w={15} throatDown />
          <HookLoopFront c={[200, 168]} angle={-20} color={work} ry={16} rx={9} w={10} />
          <Yarn d="M192 184 C190 196 192 206 198 214" color={work} w={10} />
        </g>
      ) : (
        <g>
          <LoopBack c={[200, 150]} angle={0} color={work} w={34} h={60} nw={15} yw={10} />
          <Needle base={[420, 150]} tip={[110, 150]} w={15} />
          <LoopFront c={[200, 150]} angle={0} color={work} w={34} h={60} nw={15} yw={10} />
        </g>
      )}
      <Ball c={[372, 244]} r={24} color={work} />
      <Arrow d="M150 262 C110 270 76 272 40 270" n={3} start={[166, 262]} />
      <Arrow d="M250 262 C290 270 316 272 330 272" start={[236, 262]} />
    </g>
  );
}

/* ── İp gerginliği: sol elde ip ───────────────────────── */
export function TensionScene({ tool = 'hook' }: { tool?: 'hook' | 'needle' }) {
  const at: P = [262, 168];
  const sc = 1.75;
  const pose = HANDS.point;
  const idx = handPoint(fingerTip(pose, 0), at, sc, -18, true);
  const pinkyBase = handPoint([24, -24], at, sc, -18, true);
  const work = YARN.second;
  return (
    <g>
      <Ball c={[370, 286]} r={26} color={work} />
      {/* top ucundan serçe parmağına, arkadan işaret parmağına */}
      <Yarn d={`M352 276 C330 250 ${pinkyBase[0] + 30} ${pinkyBase[1] + 40} ${pinkyBase[0]} ${pinkyBase[1]}`} color={work} w={8} />
      <Hand pose={pose} at={at} scale={sc} rotate={-18} flip />
      <Yarn d={`M${pinkyBase[0] - 4} ${pinkyBase[1] - 4} C${pinkyBase[0] - 20} ${pinkyBase[1] - 30} ${idx[0] + 20} ${idx[1] + 30} ${idx[0] + 2} ${idx[1] + 8}`} color={work} w={8} />
      <Yarn d={`M${idx[0] + 2} ${idx[1] + 8} C${idx[0] - 4} ${idx[1] - 8} ${idx[0] - 24} ${idx[1] - 6} ${idx[0] - 40} ${idx[1] + 14} C${idx[0] - 70} ${idx[1] + 40} 120 150 96 160`} color={work} w={8} />
      {tool === 'hook' ? <Hook tip={[70, 170]} angle={-30} length={150} w={13} throatDown /> : <Needle base={[-20, 186]} tip={[96, 162]} w={13} />}
      <Target c={idx} r={18} />
    </g>
  );
}

/* ── Başparmakla (çift kuyruklu) ilmek atma ───────────── */
export type LongTailPhase = 'setup' | 'thumb' | 'index' | 'back' | 'tighten';

export function LongTailScene({ phase, stitches = 2 }: { phase: LongTailPhase; stitches?: number }) {
  const at: P = [214, 262];
  const sc = 1.95;
  const pose = HANDS.slingshot;
  const flip = true;
  const rot = 0;
  const idxTip = handPoint(fingerTip(pose, 0), at, sc, rot, flip);
  const thTip = handPoint(fingerTip(pose, 4), at, sc, rot, flip);
  const palmL = handPoint([-12, 10], at, sc, rot, flip);
  const palmR = handPoint([10, 4], at, sc, rot, flip);
  const tail = YARN.main;
  const work = YARN.second;
  const nTip: P = [96, 62];
  const nBase: P = [430, 70];
  const loopX = (k: number) => 132 + k * 34;
  const knot: P = [loopX(stitches - 1) + 2, 98];

  // ip şekli: düğümden başparmağa (kuyruk) ve işaret parmağına (çalışan ip)
  const thumbFront: P = add(thTip, [-6, 10]);
  const idxFront: P = add(idxTip, [10, 8]);
  const strandThumb = `M${knot[0]} ${knot[1]} C${knot[0] + 30} ${knot[1] + 50} ${thumbFront[0] - 10} ${thumbFront[1] - 30} ${thumbFront[0]} ${thumbFront[1]} C${thTip[0] + 22} ${thTip[1] + 6} ${thTip[0] + 16} ${thTip[1] + 30} ${palmR[0]} ${palmR[1]}`;
  const strandIdx = `M${knot[0] - 4} ${knot[1]} C${knot[0] - 30} ${knot[1] + 30} ${idxFront[0] + 30} ${idxFront[1] - 10} ${idxFront[0]} ${idxFront[1]} C${idxTip[0] - 16} ${idxTip[1] - 4} ${idxTip[0] - 20} ${idxTip[1] + 30} ${palmL[0]} ${palmL[1]}`;

  const loops = Array.from({ length: stitches }, (_, k) => loopX(k));
  const arrows: Record<LongTailPhase, ReactNode> = {
    setup: null,
    thumb: <Arrow d={`M${nTip[0] - 6} ${nTip[1] + 10} C${thumbFront[0] - 60} ${thumbFront[1] + 20} ${thumbFront[0] - 10} ${thumbFront[1] + 30} ${thumbFront[0] + 6} ${thumbFront[1] - 6}`} n={1} start={[nTip[0] - 14, nTip[1] - 6]} />,
    index: <Arrow d={`M${thumbFront[0] + 4} ${thumbFront[1] - 20} C${idxFront[0] + 60} ${idxFront[1] - 40} ${idxFront[0] + 20} ${idxFront[1] - 30} ${idxFront[0] + 4} ${idxFront[1] + 6}`} n={2} start={[thumbFront[0] + 14, thumbFront[1] - 30]} />,
    back: <Arrow d={`M${idxFront[0] + 6} ${idxFront[1] + 18} C${thumbFront[0] - 30} ${thumbFront[1] + 40} ${thumbFront[0] - 50} ${thumbFront[1] - 20} ${nTip[0] + 40} ${nTip[1] + 20}`} n={3} start={[idxFront[0] + 16, idxFront[1] + 30]} />,
    tighten: <Arrow d={`M${thTip[0] - 4} ${thTip[1] + 30} C${thTip[0] + 20} ${thTip[1] + 50} ${thTip[0] + 40} ${thTip[1] + 50} ${thTip[0] + 60} ${thTip[1] + 30}`} n={4} start={[thTip[0] - 14, thTip[1] + 30]} />,
  };

  return (
    <g>
      <Hand pose={pose} at={at} scale={sc} rotate={rot} flip={flip} part="back" />
      {/* ilmekler şişin arkasında kalan bacaklar */}
      {loops.map((x, k) => (
        <LoopBack key={`b${k}`} c={[x, 66 + (x - 96) * 0.024]} angle={1.4} color={k === stitches - 1 && phase === 'tighten' ? work : tail} w={26} h={30} nw={13} yw={8} />
      ))}
      <Yarn d={strandThumb} color={tail} w={8} />
      <Hand pose={pose} at={at} scale={sc} rotate={rot} flip={flip} part="front" />
      <Yarn d={strandIdx} color={work} w={8} />
      <Needle base={nBase} tip={nTip} w={13} />
      {loops.map((x, k) => (
        <LoopFront key={`f${k}`} c={[x, 66 + (x - 96) * 0.024]} angle={1.4} color={k === stitches - 1 && phase === 'tighten' ? work : tail} w={26} h={30} nw={13} yw={8} />
      ))}
      {phase === 'thumb' && <Target c={thumbFront} r={16} />}
      {phase === 'index' && <Target c={idxFront} r={16} />}
      {arrows[phase]}
    </g>
  );
}

/* ── Tutuşlar ─────────────────────────────────────────── */
/** İki elle şiş tutuşu: 'english' (ip sağ elde) ya da 'continental' (ip sol elde) */
export function HoldNeedlesScene({ style }: { style: 'english' | 'continental' }) {
  const L = HANDS.grip;
  const R = HANDS.grip;
  const lAt: P = [92, 214];
  const rAt: P = [308, 214];
  const work = YARN.second;
  const idxR = handPoint(fingerTip(HANDS.point, 0), rAt, 1.45, -24, false);
  return (
    <g>
      <Hand pose={L} at={lAt} scale={1.45} rotate={24} flip part="back" />
      <Hand pose={style === 'english' ? HANDS.point : R} at={rAt} scale={1.45} rotate={-24} part="back" />
      <Needle base={[24, 262]} tip={[214, 150]} w={12} />
      <Needle base={[376, 262]} tip={[190, 150]} w={12} />
      {/* ilmekler sol şişte */}
      {[0, 1, 2, 3].map((k) => {
        const c: P = add([200, 158], mul([-0.86, 0.51], 26 + k * 22));
        return (
          <g key={k}>
            <LoopBack c={c} angle={-30} color={YARN.main} w={20} h={22} nw={12} yw={7} />
            <LoopFront c={c} angle={-30} color={YARN.main} w={20} h={22} nw={12} yw={7} />
          </g>
        );
      })}
      <Hand pose={L} at={lAt} scale={1.45} rotate={24} flip part="front" />
      <Hand pose={style === 'english' ? HANDS.point : R} at={rAt} scale={1.45} rotate={-24} part="front" />
      {style === 'english' ? (
        <Yarn d={`M196 170 C230 150 ${idxR[0] - 20} ${idxR[1] - 20} ${idxR[0]} ${idxR[1] - 6} C${idxR[0] + 14} ${idxR[1] + 6} ${idxR[0] + 30} ${idxR[1] + 60} 380 300`} color={work} w={7} />
      ) : (
        <Yarn d={`M196 170 C170 140 ${handPoint(fingerTip(HANDS.grip, 0), lAt, 1.45, 24, true)[0] + 10} 110 70 120 C40 130 20 200 10 300`} color={work} w={7} />
      )}
      <Target c={style === 'english' ? idxR : [90, 120]} r={18} />
    </g>
  );
}

/** Tığ tutuşu: kalem ya da bıçak gibi */
export function HoldHookScene({ grip }: { grip: 'pencil' | 'knife' }) {
  const at: P = [262, 196];
  const sc = 1.6;
  const pose = HANDS[grip];
  return (
    <g>
      <Hand pose={pose} at={at} scale={sc} rotate={-30} part="back" />
      <Hook tip={[90, 120]} angle={grip === 'pencil' ? 18 : 22} length={300} w={15} throatDown />
      <Hand pose={pose} at={at} scale={sc} rotate={-30} part="front" />
      <HookLoopBack c={[124, 131]} angle={18} color={YARN.second} ry={13} rx={7} w={8} />
      <HookLoopFront c={[124, 131]} angle={18} color={YARN.second} ry={13} rx={7} w={8} />
    </g>
  );
}

/* ── Merkezden yumak açma ─────────────────────────────── */
export function CenterPullScene({ phase }: { phase: 'find' | 'pull' }) {
  const c: P = [200, 170];
  return (
    <g>
      {/* yumak (oval sarım) */}
      <ellipse cx={c[0]} cy={c[1]} rx={120} ry={72} fill={YARN.main} stroke="#8a5a2b" strokeWidth={2} />
      {Array.from({ length: 9 }, (_, k) => (
        <path key={k} d={`M${c[0] - 110 + k * 26} ${c[1] - 64} C${c[0] - 90 + k * 26} ${c[1] - 10} ${c[0] - 120 + k * 26} ${c[1] + 30} ${c[0] - 100 + k * 26} ${c[1] + 66}`} stroke="#fff3df" strokeWidth={3} fill="none" opacity={0.55} />
      ))}
      <ellipse cx={c[0] - 118} cy={c[1]} rx={14} ry={22} fill="#7a4e22" />
      {phase === 'find' ? (
        <>
          <Target c={[c[0] - 118, c[1]]} r={26} />
          <Arrow d="M30 70 C50 110 60 140 74 160" n={1} start={[24, 56]} />
        </>
      ) : (
        <>
          <Move from={[30, 0]} at={[0.15, 0.6]}>
            <Yarn d={`M${c[0] - 118} ${c[1]} C${c[0] - 150} ${c[1] - 20} ${c[0] - 170} ${c[1] - 70} ${c[0] - 160} ${c[1] - 120}`} color={YARN.second} w={8} />
          </Move>
          <Arrow d="M60 210 C40 160 40 110 54 60" n={2} start={[66, 226]} />
        </>
      )}
      <Fade at={[0.6, 0.7]}>
        <g />
      </Fade>
    </g>
  );
}

/* ── Sihirli halka ────────────────────────────────────── */
export type MagicRingPhase = 'wrap' | 'insert' | 'pull' | 'chain' | 'work' | 'close';

export function MagicRingScene({ phase, count = 0 }: { phase: MagicRingPhase; count?: number }) {
  const main = YARN.main;
  const work = YARN.second;
  const ring: P = [190, 196];
  const ringD = `M${ring[0] - 46} ${ring[1]} C${ring[0] - 46} ${ring[1] - 52} ${ring[0] + 46} ${ring[1] - 52} ${ring[0] + 46} ${ring[1]} C${ring[0] + 46} ${ring[1] + 48} ${ring[0] - 46} ${ring[1] + 48} ${ring[0] - 46} ${ring[1] + 6}`;
  const closed = phase === 'close';
  const r = closed ? 0.45 : 1;
  const ringScaled = `M${ring[0] - 46 * r} ${ring[1]} C${ring[0] - 46 * r} ${ring[1] - 52 * r} ${ring[0] + 46 * r} ${ring[1] - 52 * r} ${ring[0] + 46 * r} ${ring[1]} C${ring[0] + 46 * r} ${ring[1] + 48 * r} ${ring[0] - 46 * r} ${ring[1] + 48 * r} ${ring[0] - 46 * r} ${ring[1] + 6}`;
  const tail = `M${ring[0] - 46 * r} ${ring[1] + 6} C${ring[0] - 60} ${ring[1] + 50} ${ring[0] - 40} ${ring[1] + 90} ${ring[0] - 10} 300`;
  const stitches = Array.from({ length: count }, (_, k) => {
    const a = -150 + (k * 300) / Math.max(1, 6);
    const rad = (a * Math.PI) / 180;
    return [ring[0] + Math.cos(rad) * 46 * r, ring[1] + Math.sin(rad) * 46 * r] as P;
  });
  return (
    <g>
      <Yarn d={phase === 'wrap' ? ringD : ringScaled} color={main} w={9} draw={phase === 'wrap' ? [0.05, 0.6] : undefined} />
      <Yarn d={tail} color={main} w={9} />
      {stitches.map((c, k) => (
        <g key={k}>
          <Yarn d={`M${c[0] - 10} ${c[1] - 10} C${c[0] - 6} ${c[1] + 8} ${c[0] + 6} ${c[1] + 8} ${c[0] + 10} ${c[1] - 10}`} color={work} w={8} />
          <Yarn d={`M${c[0] - 12} ${c[1] - 12} C${c[0] - 4} ${c[1] - 22} ${c[0] + 4} ${c[1] - 22} ${c[0] + 12} ${c[1] - 12}`} color={work} w={8} />
        </g>
      ))}
      {phase !== 'wrap' && phase !== 'close' && (
        <g>
          <HookLoopBack c={[ring[0] + 30, ring[1] - 70]} angle={-30} color={work} ry={13} rx={7} w={8} />
          <Hook tip={phase === 'insert' ? [ring[0] - 6, ring[1] + 14] : [ring[0] + 2, ring[1] - 66]} angle={-40} length={300} w={14} throatDown />
          <HookLoopFront c={[ring[0] + 30, ring[1] - 70]} angle={-30} color={work} ry={13} rx={7} w={8} />
        </g>
      )}
      <Yarn d={`M${ring[0] + 30} ${ring[1] - 70} C${ring[0] + 90} ${ring[1] - 110} 330 60 380 40`} color={work} w={9} />
      {phase === 'wrap' && <Arrow d={`M${ring[0] + 70} ${ring[1] + 40} C${ring[0] + 90} ${ring[1] - 30} ${ring[0] + 40} ${ring[1] - 80} ${ring[0] - 20} ${ring[1] - 66}`} n={1} start={[ring[0] + 74, ring[1] + 56]} />}
      {phase === 'insert' && <Arrow d={`M${ring[0] + 60} ${ring[1] - 110} C${ring[0] + 10} ${ring[1] - 90} ${ring[0] - 10} ${ring[1] - 30} ${ring[0] - 6} ${ring[1] + 4}`} n={2} start={[ring[0] + 72, ring[1] - 120]} />}
      {phase === 'pull' && <Arrow d={`M${ring[0]} ${ring[1] + 10} C${ring[0] + 4} ${ring[1] - 30} ${ring[0] + 10} ${ring[1] - 50} ${ring[0] + 22} ${ring[1] - 64}`} n={3} start={[ring[0] - 8, ring[1] + 24]} />}
      {closed && <Arrow d={`M${ring[0] - 64} ${ring[1] + 30} C${ring[0] - 70} ${ring[1] + 60} ${ring[0] - 62} ${ring[1] + 84} ${ring[0] - 50} 292`} n={4} start={[ring[0] - 62, ring[1] + 18]} />}
      {phase === 'work' && <Target c={ring} r={50} />}
    </g>
  );
}

/* ── Yardımcı: etiketli düz sahne ─────────────────────── */
export function CenterNote({ at, children }: { at: At; children: ReactNode }) {
  return <Fade at={at}>{children}</Fade>;
}
