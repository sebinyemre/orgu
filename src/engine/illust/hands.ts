/**
 * El pozları (sağ el, elin üstünden görünüş; parmaklar yukarı). Sol el için Hand bileşeninde flip kullanılır.
 * Açılar derece: -90 yukarı, 0 sağ, 90 aşağı, 180 sol. Her parmak 3 boğum (başparmak 2).
 */
import type { FingerPose, HandPose } from './parts';

const PALM = 'M-31 -26 C-37 -2 -33 26 -20 42 C-19 52 -19 60 -18 66 L18 66 C19 60 19 52 20 42 C33 26 37 -2 32 -28 C18 -38 -17 -38 -31 -26Z';

const base = {
  index: [-21, -31] as [number, number],
  middle: [-7, -35] as [number, number],
  ring: [8, -34] as [number, number],
  pinky: [22, -29] as [number, number],
  thumb: [-27, 6] as [number, number],
};

const lens = {
  index: [23, 15, 12],
  middle: [26, 17, 13],
  ring: [24, 15, 12],
  pinky: [19, 12, 10],
  thumb: [20, 17],
};

const w = { index: 12.5, middle: 13, ring: 12.5, pinky: 11, thumb: 14.5 };

function f(name: keyof typeof base, angles: number[], scale = 1, behind = false): FingerPose {
  return { base: base[name], angles, lens: lens[name].map((l) => l * scale), w: w[name], behind };
}

/** kıvrık parmak: kısa görünür (üstten bakışta boğumlar) */
const curled = (name: 'index' | 'middle' | 'ring' | 'pinky', tilt = 0): FingerPose => ({
  base: base[name],
  angles: [-90 + tilt, -40 + tilt, 40 + tilt],
  lens: [lens[name][0] * 0.55, lens[name][1] * 0.45, lens[name][2] * 0.4],
  w: w[name],
});

export const HANDS: Record<string, HandPose> = {
  open: {
    palm: PALM,
    fingers: [f('index', [-100, -97, -95]), f('middle', [-90, -90, -90]), f('ring', [-81, -83, -85]), f('pinky', [-70, -73, -76]), f('thumb', [-150, -125])],
  },
  /** işaret parmağı yukarıda (ip gerginliği), diğerleri kıvrık */
  point: {
    palm: PALM,
    fingers: [f('index', [-96, -94, -92]), curled('middle'), curled('ring', 6), curled('pinky', 12), f('thumb', [-150, -110])],
  },
  /** şişi avuçta tutar: parmaklar şişin üstünden kıvrılır */
  grip: {
    palm: PALM,
    fingers: [
      f('index', [-110, -150, 160], 0.85),
      f('middle', [-100, -150, 170], 0.8),
      f('ring', [-90, -140, 175], 0.75),
      f('pinky', [-80, -130, 180], 0.7),
      f('thumb', [-120, -70]),
    ],
  },
  /** sapan: başparmak ve işaret parmağı V şeklinde açık, diğerleri ipleri tutar */
  slingshot: {
    palm: PALM,
    fingers: [f('index', [-78, -76, -74], 1.05), curled('middle', 10), curled('ring', 14), curled('pinky', 18), f('thumb', [-160, -140], 1.1)],
  },
  /** kalem tutuşu: başparmak ve işaret parmağı uçta buluşur */
  pencil: {
    palm: PALM,
    fingers: [f('index', [-120, -150, -170], 0.95), f('middle', [-110, -140, -165], 0.9), curled('ring', -10), curled('pinky', -4), f('thumb', [-150, -100])],
  },
  /** bıçak tutuşu: işaret parmağı tığın üstünde uzanır */
  knife: {
    palm: PALM,
    fingers: [f('index', [-140, -150, -155]), f('middle', [-110, -150, 170], 0.8), f('ring', [-100, -145, 175], 0.75), f('pinky', [-90, -140, 180], 0.7), f('thumb', [-170, -150])],
  },
};

/** Parmağın ucunun yerel koordinatı (sahnede ip/şiş bağlamak için) */
export function fingerTip(pose: HandPose, i: number): [number, number] {
  const fp = pose.fingers[i];
  let p = fp.base;
  fp.angles.forEach((a, k) => {
    const r = (a * Math.PI) / 180;
    p = [p[0] + Math.cos(r) * fp.lens[k], p[1] + Math.sin(r) * fp.lens[k]];
  });
  return p;
}
