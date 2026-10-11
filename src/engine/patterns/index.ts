/**
 * Tarif üreticileri kaydı. Diğer modüller şablonlara /tarif?tur=<id>&ip=<yarnId> ile bağlanır.
 */
import type { Craft, GeneratedPattern } from '@/types';
import type { PatternParams, TemplateId, TemplateInfo } from './types';
import { amigurumiBall } from './amigurumiBall';
import { coaster } from './coaster';
import { granny } from './granny';
import { crochetScarf, BASE_STITCH, CROCHET_SCARF_STITCHES, type CrochetScarfStitch } from './crochetScarf';
import { crochetHat } from './crochetHat';
import { knitScarf } from './knitScarf';
import { knitHat } from './knitHat';
import { cowl } from './cowl';
import { babyBlanket } from './babyBlanket';
import { swatch } from './swatch';

export type { PatternParams, TemplateId, YarnSpec, YarnColor, CrochetStitch, PatternOverrides } from './types';

type Generator = (p: PatternParams) => GeneratedPattern;

export interface TemplateDef extends TemplateInfo {
  generate: Generator;
}

export const TEMPLATES: TemplateDef[] = [
  { id: 'atki', crafts: ['knit'], gaugeStitch: () => 'jarse', generate: knitScarf },
  { id: 'bere', crafts: ['knit'], gaugeStitch: () => 'jarse', generate: knitHat },
  { id: 'boyunluk', crafts: ['knit'], gaugeStitch: () => 'jarse', generate: cowl },
  { id: 'bebek-battaniyesi', crafts: ['knit'], gaugeStitch: () => 'jarse', generate: babyBlanket },
  { id: 'amigurumi-top', crafts: ['crochet'], gaugeStitch: () => 'sc', generate: amigurumiBall },
  { id: 'bardak-altligi', crafts: ['crochet'], gaugeStitch: (p) => p.crochetStitch ?? 'hdc', generate: coaster },
  { id: 'buyukanne-karesi', crafts: ['crochet'], gaugeStitch: () => 'dc', generate: granny },
  {
    id: 'atki-tig',
    crafts: ['crochet'],
    gaugeStitch: (p) => BASE_STITCH[(CROCHET_SCARF_STITCHES as readonly string[]).includes(p.stitchId ?? '') ? (p.stitchId as CrochetScarfStitch) : 'tig-yarim-trabzan'],
    generate: crochetScarf,
  },
  { id: 'bere-tig', crafts: ['crochet'], gaugeStitch: () => 'hdc', generate: crochetHat },
  { id: 'olcu-ornegi', crafts: ['knit', 'crochet'], gaugeStitch: (p) => ((p.craft ?? (p.toolKind === 'tig' ? 'crochet' : 'knit')) === 'knit' ? 'jarse' : (p.crochetStitch ?? 'sc')), generate: swatch },
];

export const TEMPLATE_BY_ID = Object.fromEntries(TEMPLATES.map((t) => [t.id, t])) as Record<TemplateId, TemplateDef>;

export const TEMPLATE_IDS = TEMPLATES.map((t) => t.id);

export function isTemplateId(x: unknown): x is TemplateId {
  return typeof x === 'string' && x in TEMPLATE_BY_ID;
}

export function templatesFor(craft: Craft): TemplateDef[] {
  return TEMPLATES.filter((t) => t.crafts.includes(craft));
}

/** Şablondan tarif üretir */
export function generatePattern(id: TemplateId, p: PatternParams): GeneratedPattern {
  const t = TEMPLATE_BY_ID[id];
  if (!t) throw new Error(`Bilinmeyen şablon: ${id}`);
  return t.generate({ ...p, ctx: { ...p.ctx, lang: p.lang } });
}

export { CROCHET_SCARF_STITCHES, BASE_STITCH } from './crochetScarf';
export { KNIT_SCARF_STITCHES } from './knitScarf';
export { HAT_RIBS, HAT_BODIES } from './knitHat';
export { COWL_STITCHES } from './cowl';
export { BLANKET_CENTERS } from './babyBlanket';
export { resolveGauge } from './common';
export { lessonIdsIn, lk } from './builder';
