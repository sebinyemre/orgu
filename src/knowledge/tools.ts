/** Şiş ve tığ ölçüleri: Türkiye'de numara = mm. US ve eski UK karşılıkları. */
import type { ToolKind, ToolMaterial } from '@/types';

export interface NeedleSize {
  mm: number;
  us?: string;
  uk?: string;
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
  { mm: 0.6, us: '14 (çelik)' },
  { mm: 0.75, us: '12 (çelik)' },
  { mm: 1.0, us: '10 (çelik)' },
  { mm: 1.25, us: '8 (çelik)' },
  { mm: 1.5, us: '7 (çelik)' },
  { mm: 1.75, us: '4 (çelik)' },
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

export const TOOL_KIND_LABEL: Record<ToolKind, string> = {
  'sis-duz': 'Düz şiş',
  'sis-misinali': 'Misinalı şiş',
  'sis-corap': 'Çorap şişi',
  'sis-degistirilebilir': 'Değiştirilebilir uçlu şiş',
  tig: 'Tığ',
  'tunus-tigi': 'Tunus işi tığı',
};

export const TOOL_KIND_INFO: Record<ToolKind, string> = {
  'sis-duz': 'Gidiş-dönüş (düz) örgü için; atkı, battaniye, parçalı kazak.',
  'sis-misinali': 'Uçları misinayla bağlı şiş. Hem yuvarlak (bere, boyunluk, kazak gövdesi) hem de çok ilmekli düz örgü (battaniye) için. Boy: 40 cm bere, 60–80 cm kazak, 80+ cm magic loop.',
  'sis-corap': 'Dört-beş kısa çift uçlu şiş; çorap, eldiven, bere tepesi gibi küçük çaplı yuvarlak örgü.',
  'sis-degistirilebilir': 'Uçlar ve misinalar ayrı; tek setle her boy ve numara.',
  tig: 'Tek uçlu kancalı alet. Numara = gövde kalınlığı (mm).',
  'tunus-tigi': 'Uzun gövdeli (veya misinalı) tığ; ilmekler şiş gibi gövdede toplanır.',
};

export const TOOL_MATERIAL_LABEL: Record<ToolMaterial, string> = {
  metal: 'Metal (hızlı, kaygan)',
  bambu: 'Bambu (sıcak, kaymaz — yeni başlayan için ideal)',
  ahsap: 'Ahşap',
  plastik: 'Plastik',
  karbon: 'Karbon',
  ergonomik: 'Ergonomik saplı',
};

/** Misinalı şiş boyu önerisi (yuvarlak örgüde çevre cm'ye göre) */
export function circularLengthFor(circumferenceCm: number): { lengthCm: number; note: string } {
  if (circumferenceCm < 35) return { lengthCm: 0, note: 'Bu çap için misinalı şiş kısa kalmaz ama ilmekler yetmez: çorap şişi ya da "magic loop" (80+ cm misina) kullan.' };
  if (circumferenceCm < 55) return { lengthCm: 40, note: '40 cm misinalı şiş (bere, boyunluk).' };
  if (circumferenceCm < 75) return { lengthCm: 60, note: '60 cm misinalı şiş.' };
  if (circumferenceCm < 110) return { lengthCm: 80, note: '80 cm misinalı şiş (kazak gövdesi).' };
  return { lengthCm: 100, note: '100–120 cm misinalı şiş.' };
}

export function nearestSize(list: NeedleSize[], mm: number): NeedleSize {
  return list.reduce((a, b) => (Math.abs(b.mm - mm) < Math.abs(a.mm - mm) ? b : a));
}
