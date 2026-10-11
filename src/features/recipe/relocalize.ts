/**
 * Kayıtlı bir tarifi geçerli dilde (ve tığ terim geleneğinde, birimde) yeniden üretir.
 * Tarif, ürettiği parametreleri `params` içinde taşır; adım kimlikleri dilden bağımsız olduğu için
 * projede işaretlenen adımlar korunur.
 */
import type { GeneratedPattern, Units } from '@/types';
import type { TermsCtx } from '@/knowledge/terms';
import { generatePattern, isTemplateId, type PatternParams } from '@/engine/patterns';
import { generateWork, WORK_BY_ID } from '@/content/works';

export function relocalizePattern(p: GeneratedPattern, ctx: TermsCtx, units: Units): GeneratedPattern {
  const params = p.params as Partial<PatternParams> & { workColors?: string[] };
  const pctx = params.ctx;
  const same = params.lang === ctx.lang && pctx?.trabzan === ctx.trabzan && pctx?.crochetEn === ctx.crochetEn && (params.units ?? units) === units;
  if (same || !params.lang) return p;
  try {
    if (params.workId && WORK_BY_ID[params.workId]) {
      const out = generateWork(params.workId, { sizeId: params.workSizeId, colors: params.yarn?.colors.map((c) => c.hex), yarn: params.yarn, toolMm: params.toolMm, gauge: params.gauge }, ctx, units);
      return { ...out, createdAt: p.createdAt };
    }
    if (isTemplateId(p.templateId)) {
      const rest = { ...(params as PatternParams) };
      delete rest.overrides;
      const out = generatePattern(p.templateId, { ...rest, lang: ctx.lang, ctx, units });
      return { ...out, createdAt: p.createdAt };
    }
  } catch {
    /* eski ya da bozuk parametre: kayıtlı metni göster */
  }
  return p;
}
