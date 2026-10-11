/* ──────────────────────────────────────────────────────────────
   Paylaşılan veri tipleri. Tüm modüller bu sözleşmeye göre konuşur.
   ────────────────────────────────────────────────────────────── */

/** Arayüz dili */
export type Lang = 'tr' | 'en' | 'es' | 'pt';

/** Zanaat: şiş (düz/misinalı/çorap şişi) ya da tığ */
export type Craft = 'knit' | 'crochet';

/** Craft Yarn Council standardı ip kalınlığı: 0 (dantel) … 7 (jumbo) */
export type YarnWeightId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type FiberId =
  | 'yun'
  | 'merino'
  | 'alpaka'
  | 'moher'
  | 'kasmir'
  | 'pamuk'
  | 'keten'
  | 'bambu'
  | 'ipek'
  | 'akrilik'
  | 'polyester'
  | 'kadife'
  | 'penye'
  | 'naylon'
  | 'viskon'
  | 'karisim';

/** Ölçü örneği: 10 cm × 10 cm karede ilmek ve sıra sayısı */
export interface Gauge {
  stitches: number;
  rows: number;
}

/** Kalınlık birimi */
export type Units = 'cm' | 'in';

/* ── İp sepeti ─────────────────────────────────────────── */
export interface Yarn {
  id: string;
  brand: string;
  name: string;
  colorName: string;
  colorHex: string;
  weight: YarnWeightId;
  fibers: FiberId[];
  metersPerSkein: number;
  gramsPerSkein: number;
  /** elde kalan yumak sayısı (ondalıklı olabilir: 2.5 yumak) */
  skeins: number;
  dyeLot?: string;
  /** etikette önerilen şiş/tığ (mm) */
  suggestedNeedleMm?: number;
  suggestedHookMm?: number;
  notes?: string;
  createdAt: number;
}

export type ToolKind =
  | 'sis-duz' // düz şiş (çift)
  | 'sis-misinali' // misinalı (yuvarlak) şiş
  | 'sis-corap' // çorap şişi (5'li)
  | 'sis-degistirilebilir' // değiştirilebilir uçlu set
  | 'tig' // tığ
  | 'tunus-tigi'; // Tunus işi (Afgan) tığı

export type ToolMaterial = 'metal' | 'bambu' | 'ahsap' | 'plastik' | 'karbon' | 'ergonomik';

export interface Tool {
  id: string;
  kind: ToolKind;
  sizeMm: number;
  /** misinalı şişte toplam boy (cm), düz şişte şiş boyu */
  lengthCm?: number;
  material?: ToolMaterial;
  count: number;
  notes?: string;
  createdAt: number;
}

/* ── Sayaçlar ──────────────────────────────────────────── */
export type CounterStyle = 'mekanik' | 'centik' | 'boncuk' | 'yumak';

export interface CounterReminder {
  id: string;
  /** bu değere gelince uyar */
  at: number;
  /** varsa her N'de bir tekrar et (at, at+N, at+2N …) */
  every?: number;
  text: string;
}

export interface Counter {
  id: string;
  name: string;
  value: number;
  target?: number;
  style: CounterStyle;
  /** bu sayaç her `every` artışta `toId` sayacını +1 yapar ve kendini sıfırlar */
  link?: { toId: string; every: number };
  reminders: CounterReminder[];
  /** artış zaman damgaları (en fazla 500) — hız istatistiği için */
  history: number[];
  createdAt: number;
}

/* ── Projeler ──────────────────────────────────────────── */
export type ProjectStatus = 'fikir' | 'sirada' | 'oruluyor' | 'uykuda' | 'bitti';

export interface JournalEntry {
  id: string;
  date: number;
  text: string;
  /** 1 (zorlandım) … 5 (çok keyifli) */
  mood?: 1 | 2 | 3 | 4 | 5;
  rowsDone?: number;
  minutes?: number;
}

export interface Project {
  id: string;
  name: string;
  craft: Craft;
  status: ProjectStatus;
  /** kapak rengi (ip rengi) */
  color: string;
  toolIds: string[];
  yarnIds: string[];
  chartIds: string[];
  counters: Counter[];
  gauge?: Gauge;
  /** proje için kullanılan şiş/tığ (mm), envanterde yoksa */
  toolSizeMm?: number;
  notes: string;
  journal: JournalEntry[];
  /** IndexedDB'deki fotoğraf anahtarları */
  photoIds: string[];
  /** Model sihirbazından gelen tarif */
  pattern?: GeneratedPattern;
  /** tarifte tamamlanan adım id'leri */
  doneSteps: string[];
  timeSpentSec: number;
  timerStartedAt?: number;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  finishedAt?: number;
}

/* ── Model sihirbazı çıktısı ───────────────────────────── */
export interface PatternStep {
  id: string;
  /** "3. tur", "1.–4. sıra" gibi */
  label: string;
  /**
   * Adım metni. Teknik bağlantısı için [[dersId|görünen metin]] ya da [[dersId]] yazılır;
   * PatternView bunları dokunulabilir "nasıl yapılır" bağlantısına çevirir.
   */
  text: string;
  /** adım sonunda iğnede/turda olması gereken ilmek sayısı */
  count?: number;
  /** ilgili Akademi dersleri */
  lessonIds?: string[];
  /** bu adım kaç kez tekrarlanır (sayaç önerisi) */
  repeat?: number;
  /** bu adımda kullanılan renk (hex) */
  color?: string;
  note?: string;
}

export interface PatternSection {
  id: string;
  title: string;
  intro?: string;
  steps: PatternStep[];
}

export interface PatternMaterial {
  label: string;
  detail: string;
}

export interface PatternAbbr {
  abbr: string;
  meaning: string;
  lessonId?: string;
}

/** Tarifle birlikte çizilecek şema */
export type PatternDiagram =
  | { kind: 'rounds'; craft: Craft; rounds: { stitches: number; label?: string; color?: string; symbol?: string; incPositions?: number[]; decPositions?: number[] }[]; centerLabel?: string }
  | { kind: 'granny'; rounds: number; colors: string[] }
  | { kind: 'schematic'; shape: 'rect' | 'beanie' | 'tube' | 'circle' | 'sphere'; widthCm: number; heightCm: number; labels?: Record<string, string> };

export interface GeneratedPattern {
  templateId: string;
  title: string;
  craft: Craft;
  summary: string;
  materials: PatternMaterial[];
  gauge: Gauge;
  /** tahmini ip ihtiyacı (metre) */
  yarnMeters: number;
  finishedSize: string;
  abbreviations: PatternAbbr[];
  sections: PatternSection[];
  notes: string[];
  diagram?: PatternDiagram;
  /** sihirbazda girilen parametreler (yeniden üretmek için) */
  params: Record<string, unknown>;
  createdAt: number;
}

/* ── Kareli kağıt (desen grafiği) ──────────────────────── */
export interface PaletteColor {
  id: string;
  hex: string;
  name: string;
  /** A, B, C … tarifteki renk harfi */
  letter: string;
  yarnId?: string;
}

export interface ChartRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Grafik hücreleri satır-öncelikli düz dizilerde tutulur.
 * y=0 grafiğin EN ÜST satırıdır; örgüde 1. sıra en alttaki satırdır (y = height-1).
 * colors[i] = palet indeksi (-1: boş/arka plan), symbols[i] = sembol id'si ('' : sembolsüz).
 */
export interface ChartDoc {
  id: string;
  name: string;
  craft: Craft;
  width: number;
  height: number;
  colors: number[];
  symbols: string[];
  palette: PaletteColor[];
  /** düz (gidiş-dönüş) ya da yuvarlak örgü */
  mode: 'flat' | 'round';
  /** 1. sıra ön yüz mü? (düz örgüde okuma yönünü belirler) */
  firstRowRS: boolean;
  gauge?: Gauge;
  /** hücreler ölçü örneğine göre oranlı mı çizilsin */
  proportional: boolean;
  repeat?: ChartRect;
  notes?: string;
  projectId?: string;
  /** takip modu: şu an örülen sıra (1 tabanlı, alttan) ve sıradaki ilmek (1 tabanlı, okuma yönünde) */
  progress?: { row: number; stitch: number };
  createdAt: number;
  updatedAt: number;
}

/* ── Ayarlar ───────────────────────────────────────────── */
/**
 * Trabzan adlandırma sistemi:
 *  - 'ipatma'  : trabzan = 1 ip atma (US dc), ikili = 2 (tr), üçlü = 3 (dtr)
 *  - 'ingilizce': yarım = hdc, ikili trabzan = dc, üçlü = tr, dörtlü = dtr
 */
export type TrabzanConvention = 'ipatma' | 'ingilizce';

export type ThemeSetting = 'auto' | 'light' | 'dark';

export interface Settings {
  lang: Lang;
  /** İngilizce tığ terimleri: ABD ya da Birleşik Krallık */
  crochetEn: 'us' | 'uk';
  trabzan: TrabzanConvention;
  units: Units;
  theme: ThemeSetting;
  leftHanded: boolean;
  counterSound: boolean;
  counterVibrate: boolean;
  keepAwake: boolean;
  /** tığ terimlerinin yanında US kısaltmasını göster (İngilizce dışındaki dillerde) */
  showEnglish: boolean;
  /** animasyon hızı çarpanı */
  animSpeed: number;
  onboarded: boolean;
}
