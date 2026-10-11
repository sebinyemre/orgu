/**
 * Sözlük verisi: bilgi bankasındaki terimlerden (KNIT_VOCAB, CROCHET_BASICS, semboller, desenler, ip kalınlıkları)
 * ve burada yazılan ek terimlerden dört dilli satırlar üretir.
 * İngilizcede ABD ve Birleşik Krallık adları farklıysa ikisi de tutulur; Türkçede tığ terimleri iki trabzan sistemiyle verilir.
 */
import type { Lang } from '@/types';
import type { L10n } from '@/i18n';
import { KNIT_VOCAB, crochetAbbr, crochetName, type CrochetBasicId, type TermsCtx } from '@/knowledge/terms';
import { CROCHET_SYMBOLS, SYMBOL_BY_ID, symbolName } from '@/knowledge/symbols';
import { PATTERN_BY_ID } from '@/knowledge/stitchPatterns';
import { TOOL_KIND_LABEL } from '@/knowledge/tools';
import { YARN_WEIGHTS } from '@/knowledge/yarnWeights';
import type { ToolKind } from '@/types';

export type GlossGroup = 'temel' | 'sis' | 'tig' | 'teknik' | 'alet' | 'ip';
export const GLOSS_GROUPS: GlossGroup[] = ['temel', 'sis', 'tig', 'teknik', 'alet', 'ip'];

export interface GlossCell {
  text: string;
  abbr?: string;
}

export interface GlossRow {
  id: string;
  group: GlossGroup;
  tr: GlossCell;
  /** Türkçede ikinci adlandırma (tığda "İngilizce adlarla eşleşen" trabzan sistemi) */
  tr2?: GlossCell;
  /** ABD İngilizcesi */
  en: GlossCell;
  /** Birleşik Krallık İngilizcesi (farklıysa) */
  uk?: GlossCell;
  es: GlossCell;
  pt: GlossCell;
  lessonId?: string;
}

/* ── Yardımcılar ── */
const c = (text: string, abbr?: string): GlossCell => (abbr ? { text, abbr } : { text });
const ctx = (lang: Lang, trabzan: TermsCtx['trabzan'] = 'ipatma', crochetEn: TermsCtx['crochetEn'] = 'us'): TermsCtx => ({ lang, trabzan, crochetEn });

type Q = [tr: string | GlossCell, en: string | GlossCell, es: string | GlossCell, pt: string | GlossCell];
const cell = (v: string | GlossCell): GlossCell => (typeof v === 'string' ? { text: v } : v);
function row(id: string, group: GlossGroup, q: Q, extra: Partial<Pick<GlossRow, 'uk' | 'tr2' | 'lessonId'>> = {}): GlossRow {
  return { id, group, tr: cell(q[0]), en: cell(q[1]), es: cell(q[2]), pt: cell(q[3]), ...extra };
}
const fromL10n = (v: L10n, abbr?: Partial<Record<Lang, string>>): Q => [c(v.tr, abbr?.tr), c(v.en, abbr?.en), c(v.es, abbr?.es), c(v.pt, abbr?.pt)];

/* ── Temel terimler ── */
function basics(): GlossRow[] {
  const V = KNIT_VOCAB;
  return [
    row('ilmek', 'temel', [c('İlmek'), c('Stitch', 'st'), c('Punto', 'pto'), c('Ponto', 'pt')]),
    row('sira', 'temel', [c(cap(V.tr.rowWord)), c(cap(V.en.rowWord)), c(cap(V.es.rowWord), 'v'), c(cap(V.pt.rowWord), 'carr')]),
    row('tur', 'temel', [c(cap(V.tr.roundWord)), c(cap(V.en.roundWord), 'rnd'), c(cap(V.es.roundWord), 'v'), c(cap(V.pt.roundWord), 'v')]),
    row('on-yuz', 'temel', [c(cap(V.tr.rs), V.tr.rsShort), c(cap(V.en.rs), V.en.rsShort), c(cap(V.es.rs), V.es.rsShort), c(cap(V.pt.rs), V.pt.rsShort)]),
    row('arka-yuz', 'temel', [c(cap(V.tr.ws), V.tr.wsShort), c(cap(V.en.ws), V.en.wsShort), c(cap(V.es.ws), V.es.wsShort), c(cap(V.pt.ws), V.pt.wsShort)]),
    row('ilmek-at', 'temel', [cap(V.tr.castOn), c(cap(V.en.castOn), 'CO'), cap(V.es.castOn), cap(V.pt.castOn)], { lessonId: 'sis-ilmek-atma-sisle' }),
    row('ilmek-kapat', 'temel', [cap(V.tr.bindOff), c(cap(V.en.bindOff), 'BO'), cap(V.es.bindOff), cap(V.pt.bindOff)], { uk: c('Cast off'), lessonId: 'sis-ilmek-kapatma' }),
    row('tekrarla', 'temel', [cap(V.tr.repeat), c(cap(V.en.repeat), 'rep'), c(cap(V.es.repeat), 'rep'), c(cap(V.pt.repeat), 'rep')]),
    row('olcu-ornegi', 'temel', ['Ölçü örneği', 'Gauge', 'Muestra', 'Amostra'], { uk: c('Tension'), lessonId: 'sis-olcu-ornegi' }),
    row('artirma', 'temel', [c('Artırma'), c('Increase', 'inc'), c('Aumento', 'aum'), c('Aumento', 'aum')], { lessonId: 'sis-artirma' }),
    row('eksiltme', 'temel', [c('Eksiltme'), c('Decrease', 'dec'), c('Disminución', 'dism'), c('Diminuição', 'dim')], { lessonId: 'sis-eksiltme' }),
    row('duz-devam', 'temel', ['Şekil vermeden devam et', 'Work even', 'Tejer recto, sin aumentos ni disminuciones', 'Trabalhar reto, sem aumentos nem diminuições'], {
      uk: c('Work straight'),
    }),
    row('isaretleyici-tak', 'temel', [c('İşaretleyici tak'), c('Place marker', 'pm'), c('Colocar marcador', 'cm'), c('Colocar marcador')]),
    row('kalan', 'temel', [c('Kalan'), c('Remaining', 'rem'), c('Restante', 'rest'), c('Restante', 'rest')]),
    row('grafik', 'temel', ['Grafik (şema)', 'Chart', 'Gráfico', 'Gráfico'], { lessonId: 'sis-grafik-okuma' }),
    row('kenar-ilmegi', 'temel', ['Kenar ilmeği', 'Selvage stitch', 'Punto de orillo', 'Ponto de ourela'], { uk: c('Selvedge stitch') }),
  ];
}

const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);

/* ── Şiş ilmekleri ve kumaşlar ── */
const UK_FABRIC: Record<string, string> = {
  jarse: 'Stocking stitch',
  'ters-jarse': 'Reverse stocking stitch',
  pirinc: 'Moss stitch',
  'cift-pirinc': 'Double moss stitch',
};

function knit(): GlossRow[] {
  const V = KNIT_VOCAB;
  const out: GlossRow[] = [
    row('duz', 'sis', [c(cap(V.tr.k), V.tr.kAbbr), c(cap(V.en.k), V.en.kAbbr), c(cap(V.es.k), V.es.kAbbr), c(cap(V.pt.k), V.pt.kAbbr)], { lessonId: 'sis-duz-ilmek' }),
    row('ters', 'sis', [c(cap(V.tr.p), V.tr.pAbbr), c(cap(V.en.p), V.en.pAbbr), c(cap(V.es.p), V.es.pAbbr), c(cap(V.pt.p), V.pt.pAbbr)], { lessonId: 'sis-ters-ilmek' }),
    row('ip-at', 'sis', [c(cap(V.tr.yo)), c(cap(V.en.yo), 'yo'), c(cap(V.es.yo), 'laz'), c(cap(V.pt.yo), 'laç')], {
      uk: c('Yarn forward / yarn round needle', 'yfwd / yrn'),
      lessonId: 'sis-ip-atma',
    }),
    row('kaydir', 'sis', [c(cap(V.tr.sl)), c(cap(V.en.sl), 'sl'), c(cap(V.es.sl), 'desl'), c(cap(V.pt.sl), 'desl')], { lessonId: 'sis-kaydirma' }),
  ];
  for (const id of ['k2tog', 'ssk', 'cdd', 'm1l', 'm1r', 'kfb', 'ktbl', 'mb', 'c4l', 'c4r']) {
    const s = SYMBOL_BY_ID[id];
    if (s) out.push(row(`sym-${id}`, 'sis', fromL10n(s.name, { en: s.en }), { lessonId: s.lessonId }));
  }
  for (const id of ['haraso', 'jarse', 'ters-jarse', 'lastik-1x1', 'lastik-2x2', 'pirinc', 'cift-pirinc', 'selanik', 'burgu-6']) {
    const p = PATTERN_BY_ID[id];
    if (!p) continue;
    const q = fromL10n(p.name);
    // İngilizcede desenin yaygın adı (ABD)
    q[1] = c(id === 'cift-pirinc' ? 'Moss stitch' : p.name.en);
    out.push(row(`desen-${id}`, 'sis', q, { uk: UK_FABRIC[id] ? c(UK_FABRIC[id]) : undefined, lessonId: p.lessonIds[p.lessonIds.length - 1] }));
  }
  return out;
}

/* ── Tığ ilmekleri ── */
const BASIC_IDS: CrochetBasicId[] = ['ch', 'slst', 'sc', 'hdc', 'dc', 'tr', 'dtr'];
const BASIC_LESSON: Partial<Record<CrochetBasicId, string>> = {
  ch: 'tig-zincir',
  slst: 'tig-kor-ilmek',
  sc: 'tig-sik-igne',
  hdc: 'tig-yarim-trabzan',
  dc: 'tig-trabzan',
  tr: 'tig-trabzan-2',
  dtr: 'tig-trabzan-3',
};

function crochetCell(id: CrochetBasicId, x: TermsCtx): GlossCell {
  return c(crochetName(id, x), crochetAbbr(id, x));
}

/** Addaki temel ilmek adını başka geleneğin adıyla değiştirir ("Front post double crochet" → "Front post treble") */
function swapName(name: string, basic: CrochetBasicId | undefined, from: TermsCtx, to: TermsCtx): string {
  if (!basic) return name;
  const a = crochetName(basic, from);
  const b = crochetName(basic, to);
  if (a === b) return name;
  const i = name.toLocaleLowerCase(from.lang).indexOf(a.toLocaleLowerCase(from.lang));
  if (i < 0) return name;
  const rep = i === 0 ? b : b.charAt(0).toLocaleLowerCase(to.lang) + b.slice(1);
  return name.slice(0, i) + rep + name.slice(i + a.length);
}

function crochet(): GlossRow[] {
  const out: GlossRow[] = BASIC_IDS.map((id) => {
    const ip = crochetCell(id, ctx('tr', 'ipatma'));
    const ing = crochetCell(id, ctx('tr', 'ingilizce'));
    const us = crochetCell(id, ctx('en', 'ipatma', 'us'));
    const uk = crochetCell(id, ctx('en', 'ipatma', 'uk'));
    return {
      id: `tig-${id}`,
      group: 'tig' as const,
      tr: ip,
      tr2: ing.text !== ip.text ? ing : undefined,
      en: us,
      uk: uk.text !== us.text || uk.abbr !== us.abbr ? uk : undefined,
      es: crochetCell(id, ctx('es')),
      pt: crochetCell(id, ctx('pt')),
      lessonId: BASIC_LESSON[id],
    };
  });
  for (const id of ['scinc', 'sc2tog', 'dcinc', 'dc2tog', 'scblo', 'scflo', 'shell', 'v', 'puff', 'bobble', 'popcorn', 'fpdc', 'bpdc', 'crab']) {
    const s = CROCHET_SYMBOLS.find((x) => x.id === id);
    if (!s) continue;
    const ip = symbolName(s, ctx('tr', 'ipatma'));
    const us = symbolName(s, ctx('en', 'ipatma', 'us'));
    const computed = ['scinc', 'sc2tog', 'dcinc', 'dc2tog'].includes(id);
    // sembol adları sabit yazılmış; temel ilmek adı geçiyorsa diğer geleneğe çevir
    const ing = computed ? symbolName(s, ctx('tr', 'ingilizce')) : swapName(ip, s.basic, ctx('tr', 'ipatma'), ctx('tr', 'ingilizce'));
    const uk = computed ? symbolName(s, ctx('en', 'ipatma', 'uk')) : swapName(us, s.basic, ctx('en', 'ipatma', 'us'), ctx('en', 'ipatma', 'uk'));
    out.push({
      id: `tsym-${id}`,
      group: 'tig',
      tr: c(ip),
      tr2: ing !== ip ? c(ing) : undefined,
      en: c(us, s.en),
      uk: uk !== us ? c(uk) : undefined,
      es: c(symbolName(s, ctx('es'))),
      pt: c(symbolName(s, ctx('pt'))),
      lessonId: s.lessonId,
    });
  }
  return out;
}

/* ── Teknikler ── */
function techniques(): GlossRow[] {
  const mr = SYMBOL_BY_ID.mr;
  return [
    row('sihirli-halka', 'teknik', fromL10n(mr.name, { en: 'MR' }), { uk: c('Magic loop / adjustable ring'), lessonId: 'tig-sihirli-halka' }),
    row('temel-zincir', 'teknik', ['Temel zincir', 'Foundation chain', 'Cadeneta base', 'Correntinha de base'], { lessonId: 'tig-zincir' }),
    row('donus-zinciri', 'teknik', [c('Dönüş zinciri'), c('Turning chain', 't-ch'), c('Cadeneta de giro'), c('Correntinha de subida')], { lessonId: 'tig-donus' }),
    row('ipi-kes', 'teknik', ['İpi kes ve ilmekten geçir', 'Fasten off', 'Rematar y cortar el hilo', 'Arrematar e cortar o fio'], { lessonId: 'tig-bitirme' }),
    row('uc-gizle', 'teknik', ['Uç gizleme', 'Weave in ends', 'Esconder las hebras', 'Esconder as pontas'], { lessonId: 'sis-uc-gizleme' }),
    row('yuvarlak-birlestir', 'teknik', ['Yuvarlakta birleştir', 'Join in the round', 'Unir en redondo', 'Unir em circular'], { lessonId: 'sis-misinali' }),
    row('magic-loop', 'teknik', ['Magic loop', 'Magic loop', 'Magic loop', 'Magic loop'], { lessonId: 'sis-magic-loop' }),
    row('ilmek-al', 'teknik', [c('Kenardan ilmek alma'), c('Pick up and knit', 'PU'), c('Recoger puntos'), c('Levantar pontos')]),
    row('kisa-sira', 'teknik', ['Kısa sıra', 'Short rows', 'Vueltas cortas', 'Carreiras encurtadas']),
    row('graft', 'teknik', ['Kitchener (ilmek ilmek birleştirme)', 'Kitchener stitch', 'Punto Kitchener (injerto)', 'Ponto Kitchener (enxerto)'], { uk: c('Grafting') }),
    row('sokme', 'teknik', ['Sökmek', 'Frog (rip out)', 'Deshacer', 'Desmanchar']),
    row('sekillendirme', 'teknik', ['Islak dinlendirme (blok)', 'Blocking', 'Bloqueo', 'Blocagem']),
    row('renk-degistir', 'teknik', ['Renk değiştirme', 'Change color', 'Cambio de color', 'Troca de cor'], { lessonId: 'tig-renk-degistirme' }),
    row('arka-halka', 'teknik', [c('Yalnız arka halkadan'), c('Back loop only', 'BLO'), c('Solo por la hebra de atrás'), c('Só pela alça de trás')], { lessonId: 'tig-halkalar' }),
    row('on-halka', 'teknik', [c('Yalnız ön halkadan'), c('Front loop only', 'FLO'), c('Solo por la hebra de delante'), c('Só pela alça da frente')], { lessonId: 'tig-halkalar' }),
  ];
}

/* ── Aletler ── */
function tools(): GlossRow[] {
  const kinds: ToolKind[] = ['sis-duz', 'sis-misinali', 'sis-corap', 'sis-degistirilebilir', 'tig', 'tunus-tigi'];
  const out: GlossRow[] = kinds.map((k) => row(`alet-${k}`, 'alet', fromL10n(TOOL_KIND_LABEL[k], k === 'sis-corap' ? { en: 'DPN' } : undefined)));
  out.push(
    row('isaretleyici', 'alet', [c('İlmek işaretleyici'), c('Stitch marker', 'm'), c('Marcador de puntos'), c('Marcador de pontos')]),
    row('burgu-sisi', 'alet', [c('Burgu şişi (yardımcı şiş)'), c('Cable needle', 'cn'), c('Aguja auxiliar'), c('Agulha auxiliar')], { lessonId: 'sis-burgu' }),
    row('sayac', 'alet', ['Sıra sayacı', 'Row counter', 'Contador de vueltas', 'Contador de carreiras']),
    row('yun-igne', 'alet', ['Yün iğnesi', 'Tapestry needle', 'Aguja lanera', 'Agulha de tapeçaria'], { uk: c('Darning needle') }),
    row('ilmek-tutucu', 'alet', ['İlmek tutucu', 'Stitch holder', 'Guardapuntos', 'Alfinete para pontos']),
    row('sis-olcer', 'alet', ['Şiş ölçer', 'Needle gauge', 'Medidor de agujas', 'Medidor de agulhas'], { lessonId: 'haz-numaralar' }),
  );
  return out;
}

/* ── İp ── */
/** CYC kalınlıklarının yaygın ABD ve İngiltere adları */
export const WEIGHT_NAMES: Record<number, { us: string; uk: string }> = {
  0: { us: 'Lace, cobweb', uk: '1 ply, 2 ply' },
  1: { us: 'Fingering, sock', uk: '3 ply, 4 ply' },
  2: { us: 'Sport', uk: '4 ply, 5 ply' },
  3: { us: 'DK, light worsted', uk: 'DK (8 ply)' },
  4: { us: 'Worsted, aran', uk: 'Aran (10 ply)' },
  5: { us: 'Bulky, chunky', uk: 'Chunky (12 ply)' },
  6: { us: 'Super bulky, roving', uk: 'Super chunky' },
  7: { us: 'Jumbo', uk: 'Jumbo' },
};

function yarn(): GlossRow[] {
  const out: GlossRow[] = YARN_WEIGHTS.map((w) => {
    const q = fromL10n(w.name);
    q[1] = c(`${w.en}: ${WEIGHT_NAMES[w.id].us}`, String(w.id));
    return row(`ip-${w.id}`, 'ip', q, { uk: c(WEIGHT_NAMES[w.id].uk) });
  });
  out.push(
    row('yumak', 'ip', ['Yumak', 'Skein, ball', 'Ovillo', 'Novelo'], { uk: c('Ball') }),
    row('cile', 'ip', ['Çile', 'Hank', 'Madeja', 'Meada']),
    row('boya-partisi', 'ip', ['Boya partisi (lot)', 'Dye lot', 'Lote de tintura', 'Lote de tingimento'], { lessonId: 'haz-ip-secimi' }),
    row('kat', 'ip', ['Kat (büküm)', 'Ply', 'Cabo', 'Cabo']),
    row('wpi', 'ip', [c('İnçteki sarım', 'WPI'), c('Wraps per inch', 'WPI'), c('Vueltas por pulgada', 'WPI'), c('Voltas por polegada', 'WPI')]),
  );
  return out;
}

let cache: GlossRow[] | null = null;
/** Bütün sözlük satırları (gruplara göre sıralı) */
export function glossaryRows(): GlossRow[] {
  if (!cache) cache = [...basics(), ...knit(), ...crochet(), ...techniques(), ...tools(), ...yarn()];
  return cache;
}
