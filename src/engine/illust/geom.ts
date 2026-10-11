/** Çizim motoru için küçük vektör ve yol yardımcıları */

export type P = [number, number];

export const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
export const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
export const mul = (a: P, k: number): P => [a[0] * k, a[1] * k];
export const len = (a: P): number => Math.hypot(a[0], a[1]);
export const norm = (a: P): P => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l];
};
export const perp = (a: P): P => [-a[1], a[0]];
export const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
export const deg = (r: number) => (r * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;
export const angleOf = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]);

/** Noktayı merkez etrafında döndürür (derece) */
export function rot(p: P, c: P, d: number): P {
  const r = rad(d);
  const s = Math.sin(r),
    co = Math.cos(r);
  const x = p[0] - c[0],
    y = p[1] - c[1];
  return [c[0] + x * co - y * s, c[1] + x * s + y * co];
}

const f = (n: number) => Math.round(n * 10) / 10;
export const pt = (p: P) => `${f(p[0])} ${f(p[1])}`;

/** Noktalardan geçen yumuşak eğri (Catmull-Rom → kübik Bezier) */
export function smooth(points: P[], tension = 1): string {
  if (points.length < 2) return '';
  if (points.length === 2) return `M${pt(points[0])} L${pt(points[1])}`;
  let d = `M${pt(points[0])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: P = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2: P = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += ` C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d;
}

/** Düz çizgi yolu */
export const line = (a: P, b: P) => `M${pt(a)} L${pt(b)}`;

/** Elips yolu (merkez, yarıçaplar, döndürme) */
export function ellipse(c: P, rx: number, ry: number, rotDeg = 0): string {
  const a = rot([c[0] - rx, c[1]], c, rotDeg);
  const b = rot([c[0] + rx, c[1]], c, rotDeg);
  return `M${pt(a)} A${f(rx)} ${f(ry)} ${f(rotDeg)} 1 0 ${pt(b)} A${f(rx)} ${f(ry)} ${f(rotDeg)} 1 0 ${pt(a)}Z`;
}

/** İki nokta arasında kavisli yol (bükülme: + sola, − sağa) */
export function arc(a: P, b: P, bend: number): string {
  const m = lerp(a, b, 0.5);
  const n = perp(norm(sub(b, a)));
  const c = add(m, mul(n, bend));
  return `M${pt(a)} Q${pt(c)} ${pt(b)}`;
}
