/**
 * "Bu iple ne örerim?" tahminleri (saf fonksiyonlar).
 * Her şablon için ipin kalınlığına uygun tipik ölçü örneği alınır, alan ve ilmek türünden metre hesaplanır;
 * eldeki metrajın yettiği en büyük beden seçilir.
 */
import type { Craft, Gauge, YarnWeightId } from '@/types';
import type { L10n } from '@/i18n';
import { typicalGauge } from '@/knowledge/yarnWeights';
import { BALL_SIZES, BLANKET_SIZES, CIRCLE_SIZES, COWL_SIZES, HAT_NEGATIVE_EASE, HEAD_SIZES, SCARF_SIZES } from '@/knowledge/sizes';
import { metersForArea, PATTERN_YARN_FACTOR, type StitchKind } from '@/engine/math/yarn';

export type TemplateId = 'atki' | 'bere' | 'boyunluk' | 'bebek-battaniyesi' | 'amigurumi-top' | 'bardak-altligi' | 'buyukanne-karesi';

export const TEMPLATE_IDS: TemplateId[] = ['atki', 'bere', 'boyunluk', 'bebek-battaniyesi', 'amigurumi-top', 'bardak-altligi', 'buyukanne-karesi'];

export type Dims = { kind: 'rect'; w: number; h: number } | { kind: 'tube'; circ: number; h: number } | { kind: 'round'; d: number };

interface SizeDef {
  label?: L10n;
  dims: Dims;
  /** örülecek yüzey alanı (cm²) */
  area: number;
}

interface TemplateDef {
  id: TemplateId;
  craft: Craft;
  stitch: StitchKind;
  /** bu şablona uygun kalınlık aralığı (CYC) */
  weights: [YarnWeightId, YarnWeightId];
  factor: number;
  /** ölçüyü sıkılaştırma (amigurumi: daha küçük tığ) */
  tighten?: number;
  /** küçük parça: kaç adet çıktığı gösterilir */
  small?: boolean;
  sizes: SizeDef[];
}

const rect = (w: number, h: number, label?: L10n): SizeDef => ({ label, dims: { kind: 'rect', w, h }, area: w * h });

const TEMPLATES: TemplateDef[] = [
  {
    id: 'atki',
    craft: 'knit',
    stitch: 'knit',
    weights: [1, 7],
    factor: PATTERN_YARN_FACTOR.haraso,
    sizes: SCARF_SIZES.filter((s) => s.id !== 'sal').map((s) => rect(s.width, s.length, s.label)),
  },
  {
    id: 'bere',
    craft: 'knit',
    stitch: 'knit',
    weights: [2, 6],
    factor: PATTERN_YARN_FACTOR.lastik,
    sizes: HEAD_SIZES.filter((s) => ['bebek-6-12', 'cocuk-3-10', 'kadin', 'erkek'].includes(s.id)).map((s) => {
      const circ = s.circumference * (1 - HAT_NEGATIVE_EASE);
      return { label: s.label, dims: { kind: 'tube', circ: Math.round(circ), h: s.hatHeight }, area: circ * s.hatHeight };
    }),
  },
  {
    id: 'boyunluk',
    craft: 'knit',
    stitch: 'knit',
    weights: [2, 7],
    factor: PATTERN_YARN_FACTOR.lastik,
    sizes: COWL_SIZES.map((s) => ({ label: s.label, dims: { kind: 'tube', circ: s.circumference, h: s.height }, area: s.circumference * s.height })),
  },
  {
    id: 'bebek-battaniyesi',
    craft: 'knit',
    stitch: 'knit',
    weights: [2, 5],
    factor: PATTERN_YARN_FACTOR.haraso,
    sizes: BLANKET_SIZES.filter((s) => s.id === 'puset' || s.id === 'bebek').map((s) => rect(s.width, s.length, s.label)),
  },
  {
    id: 'amigurumi-top',
    craft: 'crochet',
    stitch: 'sc',
    weights: [1, 6],
    factor: 1,
    tighten: 1.15,
    sizes: BALL_SIZES.map((s) => ({ label: s.label, dims: { kind: 'round', d: s.diameter }, area: Math.PI * s.diameter * s.diameter })),
  },
  {
    id: 'bardak-altligi',
    craft: 'crochet',
    stitch: 'sc',
    weights: [2, 5],
    factor: 1,
    small: true,
    sizes: CIRCLE_SIZES.filter((s) => s.id === 'bardak').map((s) => ({ label: s.label, dims: { kind: 'round', d: s.diameter }, area: (Math.PI * s.diameter * s.diameter) / 4 })),
  },
  {
    id: 'buyukanne-karesi',
    craft: 'crochet',
    stitch: 'dc',
    weights: [1, 5],
    factor: 0.9,
    small: true,
    sizes: [rect(15, 15)],
  },
];

export type Fit = 'ok' | 'tight' | 'short';

export interface YarnIdea {
  templateId: TemplateId;
  craft: Craft;
  size: SizeDef;
  /** tahmini gereken metre (fire payı dahil) */
  meters: number;
  have: number;
  fit: Fit;
  /** küçük parçalarda kaç adet çıkar */
  pieces?: number;
}

function gaugeFor(t: TemplateDef, weight: YarnWeightId): Gauge {
  const g = typicalGauge(weight, t.craft, t.stitch === 'dc' ? 'dc' : t.stitch === 'hdc' ? 'hdc' : undefined);
  const k = t.tighten ?? 1;
  return { stitches: g.stitches * k, rows: g.rows * k };
}

/** Bir alan için tahmini metre (fire payı %10) */
export function metersForSize(t: TemplateDef, size: SizeDef, weight: YarnWeightId): number {
  const g = gaugeFor(t, weight);
  // alanı 10 cm genişlikte şeride çevirerek hesapla
  return metersForArea(10, size.area / 10, g, t.stitch, t.factor);
}

export function fitOf(meters: number, have: number): Fit {
  if (have <= 0 || meters > have) return 'short';
  return meters / have > 0.85 ? 'tight' : 'ok';
}

/** Bu kalınlık ve metrajla örülebilecekler: önce yetenler, sonra sınırda, sonra eksik kalanlar */
export function yarnIdeas(weight: YarnWeightId, have: number): YarnIdea[] {
  const out: YarnIdea[] = [];
  for (const t of TEMPLATES) {
    if (weight < t.weights[0] || weight > t.weights[1]) continue;
    const sized = t.sizes.map((size) => ({ size, meters: metersForSize(t, size, weight) })).sort((a, b) => a.meters - b.meters);
    // rahat yeten (%85 altı) en büyük beden; yoksa sınırda yeten; o da yoksa en küçüğü
    const comfy = sized.filter((s) => fitOf(s.meters, have) === 'ok');
    const fitting = sized.filter((s) => s.meters <= have);
    const pick = comfy.length ? comfy[comfy.length - 1] : fitting.length ? fitting[fitting.length - 1] : sized[0];
    out.push({
      templateId: t.id,
      craft: t.craft,
      size: pick.size,
      meters: pick.meters,
      have,
      fit: fitOf(pick.meters, have),
      pieces: t.small ? Math.floor(have / pick.meters) : undefined,
    });
  }
  const rank: Record<Fit, number> = { ok: 0, tight: 1, short: 2 };
  return out.sort((a, b) => rank[a.fit] - rank[b.fit]);
}

/** Tarif hazırlayıcıya geçiş bağlantısı */
export function ideaHref(yarnId: string, templateId: TemplateId): string {
  return `/tarif?ip=${encodeURIComponent(yarnId)}&tur=${templateId}`;
}
