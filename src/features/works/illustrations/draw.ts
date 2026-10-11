/**
 * El çizimi görünümlü SVG yardımcıları: tohumlu titreşim ve yumuşak eğriler.
 * Aynı tohum her zaman aynı çizimi verir (sayfa yenilenince çizim oynamaz).
 */
export type P = [number, number];

export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Noktaları hafifçe oynatır (el çizimi titreşimi) */
export function jitter(pts: P[], amp: number, seed: number): P[] {
  const r = rng(seed);
  return pts.map(([x, y]) => [x + (r() - 0.5) * 2 * amp, y + (r() - 0.5) * 2 * amp]);
}

const f = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom → kübik Bezier: noktalardan geçen yumuşak yol */
export function smooth(pts: P[], closed = true, t = 0.5): string {
  if (pts.length < 2) return '';
  const n = pts.length;
  const get = (i: number): P => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const c1: P = [p1[0] + ((p2[0] - p0[0]) * t) / 3, p1[1] + ((p2[1] - p0[1]) * t) / 3];
    const c2: P = [p2[0] - ((p3[0] - p1[0]) * t) / 3, p2[1] - ((p3[1] - p1[1]) * t) / 3];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

/** Hafif kavisli el çizimi çizgi */
export function wline(x1: number, y1: number, x2: number, y2: number, seed: number, amp = 1): string {
  const r = rng(seed);
  const mx = (x1 + x2) / 2 + (r() - 0.5) * 2 * amp;
  const my = (y1 + y2) / 2 + (r() - 0.5) * 2 * amp;
  return `M${f(x1)} ${f(y1)} Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}`;
}

/** Dikdörtgeni kenar boyunca ara noktalarla titreşimli çokgen yapar */
export function wrect(x: number, y: number, w: number, h: number, seed: number, amp = 1.2, per = 3): P[] {
  const pts: P[] = [];
  const edge = (ax: number, ay: number, bx: number, by: number) => {
    for (let i = 0; i < per; i++) pts.push([ax + ((bx - ax) * i) / per, ay + ((by - ay) * i) / per]);
  };
  edge(x, y, x + w, y);
  edge(x + w, y, x + w, y + h);
  edge(x + w, y + h, x, y + h);
  edge(x, y + h, x, y);
  return jitter(pts, amp, seed);
}

/** Örgü "V"si: bir düz ilmek */
export function vStitch(x: number, y: number, w: number, h: number): string {
  return `M${f(x - w / 2)} ${f(y - h / 2)} Q${f(x - w / 6)} ${f(y + h / 3)} ${f(x)} ${f(y + h / 2)} Q${f(x + w / 6)} ${f(y + h / 3)} ${f(x + w / 2)} ${f(y - h / 2)}`;
}
