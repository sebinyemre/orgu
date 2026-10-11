/** Testler ve örnekler için hazır parametreler */
import type { Lang } from '@/types';
import type { PatternParams } from './types';

export function baseParams(lang: Lang = 'tr', over: Partial<PatternParams> = {}): PatternParams {
  return {
    lang,
    ctx: { lang, trabzan: 'ipatma', crochetEn: 'us' },
    units: 'cm',
    toolMm: 4.5,
    yarn: { weight: 4, metersPerSkein: 200, gramsPerSkein: 100, colors: [{ hex: '#b5523b' }, { hex: '#d39a2c' }, { hex: '#5f7a61' }, { hex: '#46698a' }] },
    ...over,
  };
}

/** Bir tarifteki tüm metinler (yer tutucu ve yasaklı ifade denetimi için) */
export function allText(p: { title: string; summary: string; sections: { title: string; intro?: string; steps: { label: string; text: string; note?: string }[] }[]; notes: string[]; materials: { label: string; detail: string }[]; abbreviations: { abbr: string; meaning: string }[]; finishedSize: string }): string {
  return [
    p.title,
    p.summary,
    p.finishedSize,
    ...p.sections.flatMap((s) => [s.title, s.intro ?? '', ...s.steps.flatMap((st) => [st.label, st.text, st.note ?? ''])]),
    ...p.notes,
    ...p.materials.flatMap((m) => [m.label, m.detail]),
    ...p.abbreviations.flatMap((a) => [a.abbr, a.meaning]),
  ].join('\n');
}
