/**
 * Tarif kurucusu: bölümleri ve adımları sabit kimliklerle toplar, en sonda tığ terimlerini doldurur
 * ve metindeki [[dersId|metin]] bağlantılarından adımın ders listesini çıkarır.
 * Adım kimlikleri dilden bağımsızdır (aynı parametrelerle her dilde aynı kimlik), böylece
 * projede işaretlenen adımlar dil değişince de korunur.
 */
import type { Craft, GeneratedPattern, Gauge, PatternAbbr, PatternDiagram, PatternMaterial, PatternSection, PatternStep } from '@/types';
import { fillTerms, type TermsCtx } from '@/knowledge/terms';

const LINK_RE = /\[\[([a-z0-9-]+)(?:\|[^\]]*)?\]\]/g;

/** Metindeki ders kimlikleri */
export function lessonIdsIn(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(LINK_RE)) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

/** [[dersId|metin]] yazar */
export const lk = (lessonId: string, text: string) => `[[${lessonId}|${text}]]`;

export interface StepOpts {
  count?: number;
  lessonIds?: string[];
  repeat?: number;
  color?: string;
  note?: string;
}

export interface PatternMeta {
  title: string;
  summary: string;
  materials: PatternMaterial[];
  gauge: Gauge;
  yarnMeters: number;
  finishedSize: string;
  abbreviations: PatternAbbr[];
  notes: string[];
  diagram?: PatternDiagram;
  params: Record<string, unknown>;
}

export class PatternBuilder {
  sections: PatternSection[] = [];
  private cur: PatternSection | null = null;

  constructor(
    readonly templateId: string,
    readonly craft: Craft,
    readonly ctx: TermsCtx,
  ) {}

  section(id: string, title: string, intro?: string): this {
    this.cur = { id, title, intro, steps: [] };
    this.sections.push(this.cur);
    return this;
  }

  step(label: string, text: string, opts: StepOpts = {}): PatternStep {
    if (!this.cur) throw new Error('section() önce çağrılmalı');
    const st: PatternStep = { id: `${this.cur.id}-${this.cur.steps.length + 1}`, label, text, ...opts };
    this.cur.steps.push(st);
    return st;
  }

  /** son eklenen adım */
  last(): PatternStep | undefined {
    return this.cur?.steps[this.cur.steps.length - 1];
  }

  build(meta: PatternMeta): GeneratedPattern {
    const f = (s: string) => fillTerms(s, this.ctx);
    const fo = (s?: string) => (s === undefined ? undefined : f(s));
    const sections = this.sections
      .filter((s) => s.steps.length > 0)
      .map((s) => ({
        ...s,
        title: f(s.title),
        intro: fo(s.intro),
        steps: s.steps.map((st) => {
          const text = f(st.text);
          const ids = [...lessonIdsIn(text), ...(st.lessonIds ?? [])].filter((x, i, a) => a.indexOf(x) === i);
          const out: PatternStep = { ...st, label: f(st.label), text, note: fo(st.note) };
          if (ids.length) out.lessonIds = ids;
          else delete out.lessonIds;
          if (out.note === undefined) delete out.note;
          return out;
        }),
      }));
    let diagram = meta.diagram;
    if (diagram?.kind === 'schematic' && diagram.labels) {
      diagram = { ...diagram, labels: Object.fromEntries(Object.entries(diagram.labels).map(([k, v]) => [k, f(v)])) };
    }
    return {
      templateId: this.templateId,
      title: f(meta.title),
      craft: this.craft,
      summary: f(meta.summary),
      materials: meta.materials.map((m) => ({ label: f(m.label), detail: f(m.detail) })),
      gauge: { stitches: round1(meta.gauge.stitches), rows: round1(meta.gauge.rows) },
      yarnMeters: Math.round(meta.yarnMeters),
      finishedSize: f(meta.finishedSize),
      abbreviations: meta.abbreviations.map((a) => ({ ...a, abbr: f(a.abbr), meaning: f(a.meaning) })),
      sections,
      notes: meta.notes.map(f),
      diagram,
      params: fillParams(meta.params, f),
      createdAt: Date.now(),
    };
  }
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** params içindeki görünen metinler (ölçü örneği etiketi, ek şema etiketleri) */
function fillParams(params: Record<string, unknown>, f: (s: string) => string): Record<string, unknown> {
  const out: Record<string, unknown> = { ...params };
  for (const k of ['gaugeLabel', 'gaugeStitch']) if (typeof out[k] === 'string') out[k] = f(out[k] as string);
  if (Array.isArray(out.extraDiagrams)) {
    out.extraDiagrams = (out.extraDiagrams as PatternDiagram[]).map((d) =>
      d.kind === 'schematic' && d.labels ? { ...d, labels: Object.fromEntries(Object.entries(d.labels).map(([k, v]) => [k, f(v)])) } : d,
    );
  }
  return out;
}

/** Üreticinin kendi matematiğini doğrulaması: tutarsızlık bir programlama hatasıdır */
export function assertMath(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new Error(`Tarif hesabı tutarsız: ${msg}`);
}
