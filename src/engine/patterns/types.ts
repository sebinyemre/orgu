/**
 * Tarif üreticilerinin ortak parametre tipleri.
 * Tüm üreticiler `PatternParams` alır; her şablon yalnızca kendi alanlarını okur (eksikleri varsayılanla doldurur).
 * Parametreler GeneratedPattern.params içinde aynen saklanır; dil değişince tarif aynı parametrelerle yeniden üretilir.
 */
import type { Craft, FiberId, Gauge, Lang, ToolKind, Units, YarnWeightId } from '@/types';
import type { TermsCtx } from '@/knowledge/terms';

export type TemplateId =
  | 'amigurumi-top'
  | 'bardak-altligi'
  | 'buyukanne-karesi'
  | 'atki-tig'
  | 'bere-tig'
  | 'atki'
  | 'bere'
  | 'boyunluk'
  | 'bebek-battaniyesi'
  | 'olcu-ornegi';

export interface YarnColor {
  hex: string;
  /** görünen renk adı (yoksa en yakın hazır renk adı kullanılır) */
  name?: string;
  /** ip sepetindeki ip */
  yarnId?: string;
}

export interface YarnSpec {
  weight: YarnWeightId;
  /** marka + ad */
  name?: string;
  fibers?: FiberId[];
  metersPerSkein?: number;
  gramsPerSkein?: number;
  /** en az bir renk; ilki ana renk */
  colors: YarnColor[];
}

/** Eser sayfasının eklediği başlık/özet/notlar (geçerli dilde) */
export interface PatternOverrides {
  title?: string;
  summary?: string;
  notesBefore?: string[];
  notesAfter?: string[];
}

export type CrochetStitch = 'sc' | 'hdc' | 'dc';

export interface PatternParams {
  lang: Lang;
  ctx: TermsCtx;
  units: Units;
  /** şiş/tığ numarası (mm) */
  toolMm: number;
  toolKind?: ToolKind;
  yarn: YarnSpec;
  /** kullanıcının ölçü örneği (10 cm); yoksa ipe göre tipik ölçü */
  gauge?: Gauge;
  overrides?: PatternOverrides;
  /** eserler galerisinden geliyorsa eser kimliği (yeniden üretmek için) */
  workId?: string;
  workSizeId?: string;

  /* ── ölçüler (cm) ── */
  widthCm?: number;
  lengthCm?: number;
  heightCm?: number;
  /** baş çevresi (bere) ya da boyunluk çevresi */
  circumferenceCm?: number;
  diameterCm?: number;

  /* ── desen seçimleri ── */
  /** STITCH_PATTERNS kimliği (atkı, boyunluk, battaniye ortası, ölçü örneği) */
  stitchId?: string;
  /** bere ağzı lastiği (şiş) */
  ribId?: string;
  /** bere gövdesi (şiş) */
  bodyId?: string;
  /** bardak altlığı / ölçü örneği tığ ilmeği */
  crochetStitch?: CrochetStitch;
  /** ölçü örneği için zanaat */
  craft?: Craft;

  /* ── seçenekler ── */
  selvedge?: boolean;
  /** kaç sırada/turda bir renk değişir (0 = tek renk) */
  stripeRows?: number;
  fringe?: boolean;
  /** amigurumi: kaydırmalı artırma */
  staggered?: boolean;
  /** bardak altlığı adedi */
  count?: number;
  /** bardak altlığı: renkler altlık başına mı, tur başına mı */
  colorMode?: 'per-piece' | 'rounds';
  /** bardak altlığı kenarı */
  edge?: 'none' | 'crab' | 'rib' | 'garter';
  /** büyükanne karesi tur sayısı */
  rounds?: number;
  blanketCols?: number;
  blanketRows?: number;
  borderRounds?: number;
  join?: 'slst' | 'sc' | 'whip';
  /** battaniye kenarı */
  borderId?: 'haraso' | 'pirinc';
  borderCm?: number;
  /** bere ağzı yüksekliği (cm) */
  brimCm?: number;
  /** tığ bere ağzı */
  brim?: 'rib' | 'sc' | 'none';
  /** kıvrık bere ağzı (iki kat) */
  foldBrim?: boolean;
  pompom?: boolean;
  /** ölçü örneği kenarı (cm) */
  swatchCm?: number;

  /* ── eserlere özel ölçüler (cm) ── */
  /** kare parça kenarı (bulaşık bezi) */
  sizeCm?: number;
  /** patik: taban, yan ve bilek */
  footCm?: number;
  sideCm?: number;
  cuffCm?: number;
  /** file çanta: taban çapı, gövde boyu, sap zinciri */
  baseCm?: number;
  bodyCm?: number;
  handleCm?: number;
}

export interface TemplateInfo {
  id: TemplateId;
  /** hangi zanaat(lar) */
  crafts: Craft[];
  /** ölçü örneğinin örüldüğü temel ilmek */
  gaugeStitch: (p: PatternParams) => 'jarse' | CrochetStitch;
}
