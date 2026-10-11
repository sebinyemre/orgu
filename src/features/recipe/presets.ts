/** Tarif hazırlayıcı: şablon varsayılanları, hazır ölçüler ve çizim eşlemesi */
import type { L10n } from '@/i18n';
import type { TemplateId, PatternParams } from '@/engine/patterns';
import type { IllustrationKey } from '@/content/works';
import { BALL_SIZES, BLANKET_SIZES, CIRCLE_SIZES, COWL_SIZES, HEAD_SIZES, SCARF_SIZES } from '@/knowledge/sizes';

export type Opts = Partial<PatternParams>;

export const TEMPLATE_ORDER: TemplateId[] = ['atki', 'bere', 'boyunluk', 'bebek-battaniyesi', 'amigurumi-top', 'bardak-altligi', 'buyukanne-karesi', 'atki-tig', 'bere-tig', 'olcu-ornegi'];

export const DEFAULTS: Record<TemplateId, Opts> = {
  atki: { widthCm: 20, lengthCm: 160, stitchId: 'haraso', selvedge: true, fringe: false, stripeRows: 0 },
  bere: { circumferenceCm: 56, heightCm: 21, ribId: 'lastik-2x2', bodyId: 'jarse', brimCm: 5, foldBrim: false, pompom: false },
  boyunluk: { circumferenceCm: 65, heightCm: 25, stitchId: 'pirinc', edge: 'none' },
  'bebek-battaniyesi': { widthCm: 80, lengthCm: 100, stitchId: 'cift-pirinc', borderId: 'haraso', borderCm: 4 },
  'olcu-ornegi': { swatchCm: 15, stitchId: 'jarse', crochetStitch: 'sc' },
  'amigurumi-top': { diameterCm: 10, staggered: true, stripeRows: 0 },
  'bardak-altligi': { diameterCm: 10, crochetStitch: 'hdc', count: 4, colorMode: 'per-piece', edge: 'none' },
  'buyukanne-karesi': { rounds: 4, blanketCols: 0, blanketRows: 0, join: 'slst', borderRounds: 2 },
  'atki-tig': { widthCm: 18, lengthCm: 160, stitchId: 'tig-yarim-trabzan', stripeRows: 0, fringe: false },
  'bere-tig': { circumferenceCm: 56, heightCm: 21, brim: 'rib', brimCm: 4, pompom: false },
};

export interface Preset {
  id: string;
  label: L10n;
  params: Opts;
}

const scarf: Preset[] = SCARF_SIZES.map((s) => ({ id: s.id, label: s.label, params: { widthCm: s.width, lengthCm: s.length } }));
const heads: Preset[] = HEAD_SIZES.map((s) => ({ id: s.id, label: s.label, params: { circumferenceCm: s.circumference, heightCm: s.hatHeight } }));
const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

export const PRESETS: Record<TemplateId, Preset[]> = {
  atki: scarf,
  'atki-tig': scarf,
  bere: heads,
  'bere-tig': heads,
  boyunluk: COWL_SIZES.map((s) => ({ id: s.id, label: s.label, params: { circumferenceCm: s.circumference, heightCm: s.height } })),
  'bebek-battaniyesi': BLANKET_SIZES.slice(0, 3).map((s) => ({ id: s.id, label: s.label, params: { widthCm: s.width, lengthCm: s.length } })),
  'amigurumi-top': BALL_SIZES.map((s) => ({ id: s.id, label: s.label, params: { diameterCm: s.diameter } })),
  'bardak-altligi': CIRCLE_SIZES.slice(0, 3).map((s) => ({ id: s.id, label: s.label, params: { diameterCm: s.diameter } })),
  'buyukanne-karesi': [],
  'olcu-ornegi': [10, 15, 20].map((n) => ({ id: String(n), label: l(`${n} cm`, `${n} cm`, `${n} cm`, `${n} cm`), params: { swatchCm: n } })),
};

/** Hangi ölçü alanları gösterilir */
export type DimKey = 'widthCm' | 'lengthCm' | 'circumferenceCm' | 'heightCm' | 'diameterCm' | 'swatchCm';
export const DIMS: Record<TemplateId, DimKey[]> = {
  atki: ['widthCm', 'lengthCm'],
  'atki-tig': ['widthCm', 'lengthCm'],
  'bebek-battaniyesi': ['widthCm', 'lengthCm'],
  bere: ['circumferenceCm', 'heightCm'],
  'bere-tig': ['circumferenceCm', 'heightCm'],
  boyunluk: ['circumferenceCm', 'heightCm'],
  'amigurumi-top': ['diameterCm'],
  'bardak-altligi': ['diameterCm'],
  'buyukanne-karesi': [],
  'olcu-ornegi': ['swatchCm'],
};

export const ILLUSTRATION: Record<TemplateId, { kind: IllustrationKey; variant?: string }> = {
  atki: { kind: 'scarf', variant: 'garter' },
  bere: { kind: 'beanie', variant: 'rib' },
  boyunluk: { kind: 'cowl' },
  'bebek-battaniyesi': { kind: 'blanket', variant: 'waves' },
  'olcu-ornegi': { kind: 'dishcloth' },
  'amigurumi-top': { kind: 'ball' },
  'bardak-altligi': { kind: 'coasters' },
  'buyukanne-karesi': { kind: 'granny' },
  'atki-tig': { kind: 'scarf', variant: 'stripes' },
  'bere-tig': { kind: 'beanie', variant: 'crochet' },
};

/** Ölçüler hazır bir bedene uyuyor mu */
export function matchPreset(t: TemplateId, o: Opts): string | undefined {
  return PRESETS[t].find((p) => Object.entries(p.params).every(([k, v]) => (o as Record<string, unknown>)[k] === v))?.id;
}
