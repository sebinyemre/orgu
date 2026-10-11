/**
 * Şiş sahnesi kurucusu (yakın plan): sol şiş + ilmekler, sağ şiş, örülmüş kumaş, çalışan ip, hareketler.
 *
 * Örgüyü karşıdan (ön yüzden) görüyoruz. Sol şiş soldan gelir, ucu sağa bakar; sağ şiş sağdan gelir.
 * Katman sırası her pozda açıkça belirlenir: arkadan geçen önce, önden geçen sonra çizilir.
 */
import type { ReactNode } from 'react';
import { add, mul, rad, type P } from './geom';
import { Arrow, Fade, KnitFabric, LoopBack, LoopFront, Move, Needle, Slide, Tag, Target, Yarn, type At } from './parts';
import { YARN } from './theme';

/* ── ölçek ── */
export const K = {
  needleW: 15,
  gap: 46,
  loopW: 36,
  loopH: 46,
  yarnW: 9.5,
  rowH: 30,
  needleLen: 330,
};

const LN_BASE: P = [-60, 168];
const LN_TIP: P = [246, 152];
const LN_ANGLE = (Math.atan2(LN_TIP[1] - LN_BASE[1], LN_TIP[0] - LN_BASE[0]) * 180) / Math.PI;

export type RnPose = 'rest' | 'insertK' | 'insertP' | 'pullK' | 'pullP' | 'insertK2' | 'insertTbl' | 'away' | 'beside';

/** Sağ şiş pozları: uç noktası, uçtan dibe doğru açı, sol şişin arkasında mı */
export const RN: Record<RnPose, { tip: P; angle: number; behind: boolean }> = {
  rest: { tip: [292, 158], angle: 10, behind: false },
  beside: { tip: [268, 162], angle: 8, behind: false },
  insertK: { tip: [186, 112], angle: 40, behind: true },
  insertK2: { tip: [150, 112], angle: 34, behind: true },
  /** arka bacaktan (burgulu): sağdan sola, sol şişin arkasından */
  insertTbl: { tip: [180, 140], angle: 12, behind: true },
  insertP: { tip: [170, 170], angle: -6, behind: false },
  pullK: { tip: [214, 190], angle: -2, behind: false },
  pullP: { tip: [196, 128], angle: 34, behind: true },
  away: { tip: [330, 170], angle: 8, behind: false },
};

const dirOf = (angle: number): P => [Math.cos(rad(angle)), Math.sin(rad(angle))];
const lnUnit: P = dirOf(LN_ANGLE);

/** Sol şişte i. ilmeğin merkezi (0 = uca en yakın) */
export function leftLoopAt(i: number): P {
  return add(LN_TIP, mul(lnUnit, -(36 + K.gap * i)));
}

/** Sağ şişte j. ilmeğin merkezi (0 = uca en yakın) */
export function rightLoopAt(pose: RnPose, j: number, first = 40): P {
  const r = RN[pose];
  return add(r.tip, mul(dirOf(r.angle), first + K.gap * j));
}

const hangAngle = (a: number) => {
  let x = a % 180;
  if (x > 90) x -= 180;
  if (x < -90) x += 180;
  return x;
};

const loopProps = { w: K.loopW, h: K.loopH, nw: K.needleW, yw: K.yarnW };

export interface KnitSceneProps {
  left?: number;
  right?: number;
  rn?: RnPose;
  /** sağ şiş bu pozdan gelir (animasyon) */
  rnFrom?: RnPose;
  rnAt?: At;
  yarn?: 'back' | 'front';
  /** sağ şişe sarılan ip */
  wrap?: 'k' | 'p';
  wrapDraw?: At;
  /** sağ şiş ucundaki yeni ilmek ('yo': şişin üstünden atılmış ip) */
  newLoop?: 'k' | 'p' | 'yo';
  /** yeni ilmeğin rengi (kaydırılan ilmek kumaş renginde görünür) */
  newLoopColor?: string;
  /** sol şişteki ilk ilmek düşüyor */
  dropping?: At;
  /** kaç ilmek birlikte düşer (2 birlikte örmede 2) */
  dropN?: number;
  dropped?: boolean;
  target?: boolean | number | number[];
  leftKinds?: ('k' | 'p')[];
  rightKinds?: ('k' | 'p')[];
  arrows?: ReactNode;
  extra?: ReactNode;
  color?: string;
  /** çalışan ip ve yeni ilmeğin rengi (öğretici kontrast) */
  yarnColor?: string;
  /** sol şişteki ilmeklerin renkleri (0 = uca en yakın) */
  leftColors?: string[];
  /** kumaşı gösterme (ilmek atma başında) */
  noFabric?: boolean;
  /** etiketler (çizim içinde el yazısı) */
  labels?: { left?: string; right?: string; yarn?: string };
  /** sağ şiş hiç gösterilmesin */
  noRight?: boolean;
  /** sol şişteki ilk ilmeğin üstünde atılmış ip (selanik: ilmek ve ip birlikte) */
  leftYo?: boolean;
}

function RightNeedle({ pose, right, color, ycol, kinds, newLoop }: { pose: RnPose; right: number; color: string; ycol: string; kinds?: ('k' | 'p')[]; newLoop?: 'k' | 'p' | 'yo' }) {
  const r = RN[pose];
  const base = add(r.tip, mul(dirOf(r.angle), K.needleLen));
  const ha = hangAngle(r.angle);
  const shift = newLoop ? 1 : 0;
  // sağ şiş eğikken eski ilmekler kadraj dışına kayar; yalnız dinlenme pozlarında göster
  const showOld = pose === 'rest' || pose === 'beside' || pose === 'away' || pose === 'pullK';
  const loops = showOld ? Array.from({ length: right }, (_, j) => rightLoopAt(pose, j + shift)) : [];
  const nc = newLoop ? rightLoopAt(pose, 0, 30) : null;
  const top = loops.length ? loops[0][1] + K.loopH - 6 : 0;
  return (
    <g>
      {loops.length > 0 && <KnitFabric xs={loops.map((c) => c[0])} top={top} rows={3} color={color} kinds={kinds} sw={K.gap} rh={K.rowH} yw={K.yarnW} slope={Math.tan(rad(ha))} />}
      
      {loops.map((c, j) => (
        <LoopBack key={`b${j}`} c={c} angle={ha} color={color} {...loopProps} />
      ))}
      {nc && <LoopBack c={nc} angle={ha} color={ycol} {...loopProps} h={K.loopH * (newLoop === 'yo' ? 0.42 : 0.7)} />}
      <Needle base={base} tip={r.tip} w={K.needleW} />
      {loops.map((c, j) => (
        <LoopFront key={`f${j}`} c={c} angle={ha} color={color} {...loopProps} />
      ))}
      {nc && <LoopFront c={nc} angle={ha} color={ycol} {...loopProps} h={K.loopH * (newLoop === 'yo' ? 0.42 : 0.7)} />}
    </g>
  );
}

/** İki şiş ve ilmekler */
export function KnitScene(p: KnitSceneProps) {
  const left = p.left ?? 4;
  const right = p.right ?? 2;
  const pose = p.rn ?? 'rest';
  const color = p.color ?? YARN.main;
  const ycol = p.yarnColor ?? YARN.second;
  const r = RN[pose];

  const leftLoops = Array.from({ length: left }, (_, i) => leftLoopAt(i));
  const dropN = Math.min(p.dropN ?? 1, left);
  const first = leftLoops[0];
  const firsts = leftLoops.slice(0, dropN);
  const others = leftLoops.slice(dropN);
  const showFirst = left > 0 && !p.dropped;
  const fabLoops = p.dropped ? others : leftLoops;
  const fabTop = fabLoops.length ? Math.max(...fabLoops.map((c) => c[1])) + K.loopH - 6 : 0;
  const slope = Math.tan(rad(LN_ANGLE));

  // çalışan ip: sağ şişteki en yeni ilmekten, yoksa sol şişin ilk ilmeğinden çıkar
  const showOld = pose === 'rest' || pose === 'beside' || pose === 'away' || pose === 'pullK';
  const src: P = p.newLoop ? rightLoopAt(pose, 0, 30) : right > 0 && showOld ? rightLoopAt(pose, 0) : add(first ?? LN_TIP, [K.loopW * 0.5, K.loopH]);
  const yStart: P = add(src, [K.loopW * 0.5, K.loopH * 0.8]);
  const front = p.yarn === 'front';
  const workYarn = front
    ? `M${yStart[0]} ${yStart[1]} C${yStart[0] - 4} ${yStart[1] + 40} ${yStart[0] + 40} ${yStart[1] + 80} ${yStart[0] + 90} ${380}`
    : `M${yStart[0]} ${yStart[1]} C${yStart[0] + 30} ${yStart[1] + 16} ${yStart[0] + 70} ${yStart[1] + 60} ${yStart[0] + 120} ${380}`;

  const rnEl = p.noRight ? null : <RightNeedle pose={pose} right={right} color={color} ycol={p.newLoopColor ?? ycol} kinds={p.rightKinds} newLoop={p.newLoop} />;
  const fromPose = p.rnFrom ? RN[p.rnFrom] : null;
  const rnMoved = rnEl && fromPose ? (
    <Move from={[fromPose.tip[0] - r.tip[0], fromPose.tip[1] - r.tip[1]]} at={p.rnAt ?? [0.08, 0.55]}>
      {rnEl}
    </Move>
  ) : (
    rnEl
  );
  const wrapEl = p.wrap && !p.noRight ? <Wrap pose={pose} kind={p.wrap} color={ycol} draw={p.wrapDraw} /> : null;

  const drop = (el: ReactNode) =>
    p.dropping && el ? (
      <Fade at={[p.dropping[1] - 0.02, p.dropping[1] + 0.1]} out>
        <Slide to={[44, 14]} at={p.dropping}>
          {el}
        </Slide>
      </Fade>
    ) : (
      el
    );

  const lc = (i: number) => p.leftColors?.[i] ?? color;
  const firstBack = showFirst ? (
    <g>
      {firsts.map((c, i) => (
        <LoopBack key={i} c={c} angle={LN_ANGLE} color={lc(i)} {...loopProps} />
      ))}
    </g>
  ) : null;
  const firstFront = showFirst ? (
    <g>
      {firsts.map((c, i) => (
        <LoopFront key={i} c={c} angle={LN_ANGLE} color={lc(i)} {...loopProps} />
      ))}
    </g>
  ) : null;

  return (
    <g transform="translate(0 -46)">
      {/* çalışan ip arkadaysa en arkada */}
      {!front && <Yarn d={workYarn} color={ycol} w={K.yarnW} />}

      {!p.noFabric && fabLoops.length > 0 && <KnitFabric xs={fabLoops.map((c) => c[0])} top={fabTop} rows={3} color={color} kinds={p.leftKinds} sw={K.gap} rh={K.rowH} yw={K.yarnW} slope={slope} />}
      {others.map((c, i) => (
        <LoopBack key={`lb${i}`} c={c} angle={LN_ANGLE} color={lc(i + dropN)} {...loopProps} />
      ))}
      {drop(firstBack)}

      {r.behind && rnMoved}
      {r.behind && wrapEl}

      <Needle base={LN_BASE} tip={LN_TIP} w={K.needleW} />

      {others.map((c, i) => (
        <LoopFront key={`lf${i}`} c={c} angle={LN_ANGLE} color={lc(i + dropN)} {...loopProps} />
      ))}

      {!r.behind && rnMoved}
      {!r.behind && wrapEl}
      {drop(firstFront)}
      {p.leftYo && first && drop(
        <g>
          <LoopFront c={add(first, [3, -2])} angle={LN_ANGLE} color={ycol} {...loopProps} w={K.loopW * 1.1} h={K.loopH * 0.45} />
        </g>,
      )}

      {front && <Yarn d={workYarn} color={ycol} w={K.yarnW} />}

      {p.target !== undefined && p.target !== false && (Array.isArray(p.target) ? p.target : [typeof p.target === 'number' ? p.target : 0]).map((i) => <Target key={i} c={leftLoopAt(i)} r={24} />)}
      {p.labels?.left && <Tag c={[60, 116]} text={p.labels.left} />}
      {p.labels?.right && <Tag c={[350, 126]} text={p.labels.right} />}
      {p.labels?.yarn && <Tag c={[yStart[0] + 96, 286]} text={p.labels.yarn} anchor="end" />}
      {p.extra}
      {p.arrows}
    </g>
  );
}

/** Sağ şiş ucuna sarılan ip */
function Wrap({ pose, kind, color, draw }: { pose: RnPose; kind: 'k' | 'p'; color: string; draw?: At }) {
  const r = RN[pose];
  const u = dirOf(r.angle);
  const n: P = [-u[1], u[0]];
  const c = add(r.tip, mul(u, 26));
  const over = add(c, mul(n, -(K.needleW / 2 + K.yarnW / 2)));
  const under = add(c, mul(n, K.needleW / 2 + K.yarnW / 2));
  const half = (k: 0 | 1): At | undefined => (draw ? (k === 0 ? [draw[0], (draw[0] + draw[1]) / 2] : [(draw[0] + draw[1]) / 2, draw[1]]) : undefined);
  if (kind === 'k') {
    // arkadan (sağ alttan) gelir, şişin üstünden aşar, önden iki şişin arasına iner
    const back = `M${c[0] + 70} ${c[1] + 90} C${c[0] + 40} ${c[1] + 40} ${over[0] + 22} ${over[1] - 4} ${over[0]} ${over[1]}`;
    const frontD = `M${over[0]} ${over[1]} C${over[0] - 16} ${over[1] + 2} ${under[0] - 18} ${under[1] + 2} ${under[0] - 4} ${under[1] + 18}`;
    return (
      <g>
        <Yarn d={back} color={color} w={K.yarnW} draw={half(0)} />
        <Yarn d={frontD} color={color} w={K.yarnW} draw={half(1)} />
      </g>
    );
  }
  // ters: ip önde; şişin üstünden arkaya aşar, iki şişin arasından öne iner
  const frontIn = `M${c[0] + 40} ${c[1] + 110} C${c[0] + 30} ${c[1] + 50} ${over[0] + 18} ${over[1] - 6} ${over[0]} ${over[1]}`;
  const backDown = `M${over[0]} ${over[1]} C${over[0] - 14} ${over[1] + 4} ${under[0] - 10} ${under[1]} ${under[0] + 2} ${under[1] + 16}`;
  return (
    <g>
      <Yarn d={backDown} color={color} w={K.yarnW} draw={half(1)} />
      <Yarn d={frontIn} color={color} w={K.yarnW} draw={half(0)} />
    </g>
  );
}

/* ── Hazır oklar (numaralı) ── */
export const knitArrows = {
  insertK: (n = 1) => <Arrow d="M300 196 C268 200 236 186 202 136" n={n} start={[316, 200]} />,
  insertP: (n = 1) => <Arrow d="M312 132 C276 128 236 150 192 168" n={n} start={[326, 128]} />,
  wrapK: (n = 2) => <Arrow d="M262 214 C268 170 236 112 208 110 C192 110 186 128 196 150" n={n} start={[268, 228]} />,
  wrapP: (n = 2) => <Arrow d="M232 262 C240 214 222 150 196 150 C180 150 180 172 190 186" n={n} start={[236, 276]} />,
  pullK: (n = 3) => <Arrow d="M196 104 C178 140 186 180 222 206" n={n} start={[204, 90]} />,
  pullP: (n = 3) => <Arrow d="M196 200 C206 176 206 150 214 124" n={n} start={[188, 214]} />,
  drop: (n = 4) => <Arrow d="M218 118 C246 108 272 120 280 144" n={n} start={[206, 108]} />,
};
