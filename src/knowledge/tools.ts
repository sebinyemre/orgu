/** Şiş ve tığ ölçüleri: Türkiye'de numara = mm. US ve eski UK karşılıkları. */
import type { Lang, ToolKind, ToolMaterial } from '@/types';
import type { L10n } from '@/i18n';

export interface NeedleSize {
  mm: number;
  us?: string;
  uk?: string;
  /** ABD'de ince çelik tığ numarası (dantel tığı) */
  steel?: boolean;
}

/** Şiş ölçüleri (mm ↔ US ↔ eski UK/Kanada) */
export const NEEDLE_SIZES: NeedleSize[] = [
  { mm: 1.5, us: '000', uk: '16' },
  { mm: 2, us: '0', uk: '14' },
  { mm: 2.25, us: '1', uk: '13' },
  { mm: 2.5, us: '1.5', uk: '13' },
  { mm: 2.75, us: '2', uk: '12' },
  { mm: 3, us: '2.5', uk: '11' },
  { mm: 3.25, us: '3', uk: '10' },
  { mm: 3.5, us: '4', uk: '9' },
  { mm: 3.75, us: '5', uk: '9' },
  { mm: 4, us: '6', uk: '8' },
  { mm: 4.5, us: '7', uk: '7' },
  { mm: 5, us: '8', uk: '6' },
  { mm: 5.5, us: '9', uk: '5' },
  { mm: 6, us: '10', uk: '4' },
  { mm: 6.5, us: '10.5', uk: '3' },
  { mm: 7, us: '10.75', uk: '2' },
  { mm: 7.5, uk: '1' },
  { mm: 8, us: '11', uk: '0' },
  { mm: 9, us: '13', uk: '00' },
  { mm: 10, us: '15', uk: '000' },
  { mm: 12, us: '17' },
  { mm: 12.75, us: '17' },
  { mm: 15, us: '19' },
  { mm: 19, us: '35' },
  { mm: 25, us: '50' },
];

/** Tığ ölçüleri (mm ↔ US harf/numara ↔ eski UK) */
export const HOOK_SIZES: NeedleSize[] = [
  { mm: 0.6, us: '14', steel: true },
  { mm: 0.75, us: '12', steel: true },
  { mm: 1.0, us: '10', steel: true },
  { mm: 1.25, us: '8', steel: true },
  { mm: 1.5, us: '7', steel: true },
  { mm: 1.75, us: '4', steel: true },
  { mm: 2.0, uk: '14' },
  { mm: 2.25, us: 'B-1', uk: '13' },
  { mm: 2.5, uk: '12' },
  { mm: 2.75, us: 'C-2' },
  { mm: 3.0, uk: '11' },
  { mm: 3.25, us: 'D-3', uk: '10' },
  { mm: 3.5, us: 'E-4', uk: '9' },
  { mm: 3.75, us: 'F-5' },
  { mm: 4.0, us: 'G-6', uk: '8' },
  { mm: 4.5, us: '7', uk: '7' },
  { mm: 5.0, us: 'H-8', uk: '6' },
  { mm: 5.5, us: 'I-9', uk: '5' },
  { mm: 6.0, us: 'J-10', uk: '4' },
  { mm: 6.5, us: 'K-10½', uk: '3' },
  { mm: 7.0, uk: '2' },
  { mm: 8.0, us: 'L-11' },
  { mm: 9.0, us: 'M/N-13' },
  { mm: 10.0, us: 'N/P-15' },
  { mm: 12.0 },
  { mm: 15.0, us: 'P/Q' },
  { mm: 16.0, us: 'Q' },
  { mm: 19.0, us: 'S' },
  { mm: 25.0, us: 'T/U/X' },
];

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

export const TOOL_KIND_LABEL: Record<ToolKind, L10n> = {
  'sis-duz': l('Düz şiş', 'Straight needles', 'Agujas rectas', 'Agulhas retas'),
  'sis-misinali': l('Misinalı şiş', 'Circular needles', 'Agujas circulares', 'Agulha circular'),
  'sis-corap': l('Çorap şişi', 'Double-pointed needles', 'Agujas de doble punta', 'Agulhas de pontas duplas'),
  'sis-degistirilebilir': l('Değiştirilebilir uçlu şiş', 'Interchangeable needles', 'Agujas intercambiables', 'Agulhas intercambiáveis'),
  tig: l('Tığ', 'Crochet hook', 'Aguja de ganchillo', 'Agulha de crochê'),
  'tunus-tigi': l('Tunus işi tığı', 'Tunisian hook', 'Aguja de ganchillo tunecino', 'Agulha de crochê tunisiano'),
};

export const TOOL_KIND_INFO: Record<ToolKind, L10n> = {
  'sis-duz': l('Gidiş-dönüş (düz) örgü için: atkı, battaniye, parçalı kazak.', 'For flat knitting back and forth: scarves, blankets, sweater pieces.', 'Para tejer en plano de ida y vuelta: bufandas, mantas, piezas de jersey.', 'Para tricô reto, em idas e voltas: cachecóis, mantas, partes de suéter.'),
  'sis-misinali': l(
    'Uçları misinayla bağlı şiş. Yuvarlak örgü (bere, boyunluk, kazak gövdesi) ve çok ilmekli düz örgü (battaniye) için. Boy: bere 40 cm, kazak 60–80 cm, magic loop 80 cm ve üzeri.',
    'Two tips joined by a cable. For knitting in the round (hats, cowls, sweater bodies) and for wide flat pieces. Length: hats 40 cm (16"), sweaters 60–80 cm, magic loop 80 cm+.',
    'Dos puntas unidas por un cable. Para tejer en redondo (gorros, cuellos, cuerpos de jersey) y piezas planas anchas. Largo: gorro 40 cm, jersey 60–80 cm, magic loop 80 cm o más.',
    'Duas pontas unidas por um cabo. Para tricô circular (gorros, golas, corpos de suéter) e peças retas largas. Comprimento: gorro 40 cm, suéter 60–80 cm, magic loop 80 cm ou mais.',
  ),
  'sis-corap': l('Dört-beş kısa çift uçlu şiş: çorap, eldiven, bere tepesi gibi dar yuvarlak örgü.', 'Four or five short double-pointed needles for small circumferences: socks, mittens, hat crowns.', 'Cuatro o cinco agujas cortas de doble punta para diámetros pequeños: calcetines, manoplas, coronillas.', 'Quatro ou cinco agulhas curtas de pontas duplas para diâmetros pequenos: meias, luvas, topo de gorros.'),
  'sis-degistirilebilir': l('Uçlar ve misinalar ayrı; tek setle her boy ve numara.', 'Tips and cables come apart: one set for every length and size.', 'Puntas y cables separables: un solo juego para cualquier largo y número.', 'Pontas e cabos separados: um só kit para qualquer comprimento e número.'),
  tig: l('Tek uçlu kancalı alet. Numara gövde kalınlığıdır (mm).', 'A single hooked tool. The size is the shaft diameter in mm.', 'Herramienta de un gancho. El número es el diámetro en mm.', 'Ferramenta com um gancho. O número é o diâmetro em mm.'),
  'tunus-tigi': l('Uzun gövdeli ya da misinalı tığ; ilmekler şiş gibi gövdede toplanır.', 'A long (or corded) hook that holds many loops like a needle.', 'Aguja larga (o con cable) que sostiene muchos puntos como una aguja de tejer.', 'Agulha longa (ou com cabo) que segura muitos pontos como no tricô.'),
};

export const TOOL_MATERIAL_LABEL: Record<ToolMaterial, L10n> = {
  metal: l('Metal (hızlı, kaygan)', 'Metal (fast, slick)', 'Metal (rápido, resbaladizo)', 'Metal (rápido, liso)'),
  bambu: l('Bambu (sıcak, kaymaz, yeni başlayana ideal)', 'Bamboo (warm, grippy, great for beginners)', 'Bambú (cálido, no resbala, ideal para empezar)', 'Bambu (macio, não escorrega, ideal para iniciantes)'),
  ahsap: l('Ahşap', 'Wood', 'Madera', 'Madeira'),
  plastik: l('Plastik', 'Plastic', 'Plástico', 'Plástico'),
  karbon: l('Karbon', 'Carbon', 'Carbono', 'Carbono'),
  ergonomik: l('Ergonomik saplı', 'Ergonomic handle', 'Mango ergonómico', 'Cabo ergonômico'),
};

/** Misinalı şiş boyu önerisi (yuvarlak örgüde çevre cm'ye göre) */
export function circularLengthFor(circumferenceCm: number, lang: Lang): { lengthCm: number; note: string } {
  const N: Record<Lang, string[]> = {
    tr: ['Bu çap için ilmekler 40 cm misinaya yetmez: çorap şişi ya da "magic loop" (80 cm ve üzeri misina) kullan.', '40 cm misinalı şiş (bere, boyunluk).', '60 cm misinalı şiş.', '80 cm misinalı şiş (kazak gövdesi).', '100–120 cm misinalı şiş.'],
    en: ['Too few stitches for a 40 cm cable: use double-pointed needles or magic loop (80 cm+ cable).', '40 cm (16") circular (hats, cowls).', '60 cm (24") circular.', '80 cm (32") circular (sweater bodies).', '100–120 cm (40–47") circular.'],
    es: ['Pocos puntos para un cable de 40 cm: usa agujas de doble punta o magic loop (cable de 80 cm o más).', 'Circular de 40 cm (gorros, cuellos).', 'Circular de 60 cm.', 'Circular de 80 cm (cuerpos de jersey).', 'Circular de 100–120 cm.'],
    pt: ['Poucos pontos para um cabo de 40 cm: use agulhas de pontas duplas ou magic loop (cabo de 80 cm ou mais).', 'Circular de 40 cm (gorros, golas).', 'Circular de 60 cm.', 'Circular de 80 cm (corpos de suéter).', 'Circular de 100–120 cm.'],
  };
  const n = N[lang];
  if (circumferenceCm < 35) return { lengthCm: 0, note: n[0] };
  if (circumferenceCm < 55) return { lengthCm: 40, note: n[1] };
  if (circumferenceCm < 75) return { lengthCm: 60, note: n[2] };
  if (circumferenceCm < 110) return { lengthCm: 80, note: n[3] };
  return { lengthCm: 100, note: n[4] };
}

export function nearestSize(list: NeedleSize[], mm: number): NeedleSize {
  return list.reduce((a, b) => (Math.abs(b.mm - mm) < Math.abs(a.mm - mm) ? b : a));
}
