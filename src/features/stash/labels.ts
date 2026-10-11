/** Sepet metin yardımcıları (dile göre) */
import type { FiberId, Lang, Tool, Yarn, YarnWeightId } from '@/types';
import { FIBERS } from '@/knowledge/fibers';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import { TOOL_KIND_LABEL, TOOL_MATERIAL_LABEL } from '@/knowledge/tools';
import { fmt } from '@/lib/format';
import { STS } from './i18n';
import { toolSizeInfo } from './stashMath';

export const fiberName = (id: FiberId, lang: Lang) => FIBERS.find((f) => f.id === id)?.name[lang] ?? id;

/** "4 · Orta" */
export const weightShort = (w: YarnWeightId, lang: Lang) => `${w} · ${YARN_WEIGHTS[w].name[lang]}`;

/** "4 · Orta (Medium)" ya da İngilizcede "4 · Medium" */
export function weightLong(w: YarnWeightId, lang: Lang): string {
  const info = YARN_WEIGHTS[w];
  const n = info.name[lang];
  return n.toLowerCase() === info.en.toLowerCase() ? `${w} · ${n}` : `${w} · ${n} (${info.en})`;
}

export const mmText = (mm: number, lang: Lang) => `${fmt(mm, 2, lang)} mm`;
export const rangeMm = (r: [number, number], lang: Lang) => `${fmt(r[0], 2, lang)}–${fmt(r[1], 2, lang)} mm`;

/** Görünen ip adı: marka + ad, ikisi de yoksa renk adı */
export function yarnTitle(y: Pick<Yarn, 'brand' | 'name' | 'colorName'>, lang: Lang): string {
  return [y.brand, y.name].filter((s) => s?.trim()).join(' ') || y.colorName || STS[lang].unnamed;
}

/** Malzeme kısa adı: parantez içindeki açıklama atılır */
export const materialShort = (m: NonNullable<Tool['material']>, lang: Lang) => TOOL_MATERIAL_LABEL[m][lang].split(' (')[0];

/** "Misinalı şiş 4,5 mm" */
export function toolTitle(t: Pick<Tool, 'kind' | 'sizeMm'>, lang: Lang): string {
  return `${TOOL_KIND_LABEL[t.kind][lang]} ${mmText(t.sizeMm, lang)}`;
}

/** "US 7 · UK 7" */
export function usUkText(t: Pick<Tool, 'kind' | 'sizeMm'>, lang: Lang): string {
  const s = toolSizeInfo(t, STS[lang].steel);
  return [s.us && `US ${s.us}`, s.uk && `UK ${s.uk}`].filter(Boolean).join(' · ');
}
