/**
 * Standart beden ölçüleri (cm). Kaynak: Craft Yarn Council beden tabloları ve yaygın örgü tarifleri.
 * Ölçüler vücut ölçüsüdür; örgü ölçüsü için bolluk/darlık payı (ease) ayrıca eklenir.
 */

export interface HeadSize {
  id: string;
  label: string;
  /** baş çevresi */
  circumference: number;
  /** bere boyu (alından tepeye, kıvrımsız) */
  hatHeight: number;
}

export const HEAD_SIZES: HeadSize[] = [
  { id: 'yenidogan', label: 'Yenidoğan', circumference: 35, hatHeight: 13 },
  { id: 'bebek-3-6', label: 'Bebek (3–6 ay)', circumference: 41, hatHeight: 15 },
  { id: 'bebek-6-12', label: 'Bebek (6–12 ay)', circumference: 45, hatHeight: 16.5 },
  { id: 'cocuk-1-3', label: 'Çocuk (1–3 yaş)', circumference: 48, hatHeight: 17.5 },
  { id: 'cocuk-3-10', label: 'Çocuk (3–10 yaş)', circumference: 51, hatHeight: 19 },
  { id: 'genc', label: 'Genç / küçük yetişkin', circumference: 54, hatHeight: 20 },
  { id: 'kadin', label: 'Yetişkin (orta)', circumference: 56, hatHeight: 21 },
  { id: 'erkek', label: 'Yetişkin (büyük)', circumference: 58.5, hatHeight: 22 },
];

/** Bere için önerilen darlık payı: örgü çevresi = baş çevresi × (1 - pay) */
export const HAT_NEGATIVE_EASE = 0.1;

export interface RectSize {
  id: string;
  label: string;
  width: number;
  length: number;
}

export const SCARF_SIZES: RectSize[] = [
  { id: 'cocuk', label: 'Çocuk atkısı', width: 14, length: 110 },
  { id: 'standart', label: 'Standart atkı', width: 20, length: 160 },
  { id: 'genis', label: 'Geniş atkı', width: 28, length: 180 },
  { id: 'sal', label: 'Şal atkı', width: 50, length: 190 },
];

export const BLANKET_SIZES: RectSize[] = [
  { id: 'puset', label: 'Puset / araba koltuğu', width: 70, length: 80 },
  { id: 'bebek', label: 'Bebek battaniyesi', width: 80, length: 100 },
  { id: 'kucak', label: 'Kucak örtüsü', width: 100, length: 130 },
  { id: 'tekli', label: 'Tek kişilik', width: 150, length: 200 },
  { id: 'cift', label: 'Çift kişilik', width: 200, length: 220 },
];

export interface CowlSize {
  id: string;
  label: string;
  circumference: number;
  height: number;
}

export const COWL_SIZES: CowlSize[] = [
  { id: 'cocuk', label: 'Çocuk boyunluğu', circumference: 45, height: 18 },
  { id: 'dar', label: 'Dar boyunluk', circumference: 55, height: 22 },
  { id: 'standart', label: 'Standart boyunluk', circumference: 65, height: 25 },
  { id: 'cift-tur', label: 'Çift tur dolanan', circumference: 130, height: 25 },
];

/** Göğüs çevresine göre kazak bedenleri (yetişkin, vücut ölçüsü) */
export const CHEST_SIZES: { label: string; chest: number }[] = [
  { label: 'XS', chest: 76 },
  { label: 'S', chest: 86 },
  { label: 'M', chest: 96 },
  { label: 'L', chest: 106 },
  { label: 'XL', chest: 117 },
  { label: '2XL', chest: 127 },
  { label: '3XL', chest: 137 },
];

/** Ayak uzunluğu (cm) — çorap için; ayak çevresi yaklaşık olarak ayak uzunluğuna yakındır */
export const FOOT_SIZES: { label: string; footLength: number; footCirc: number }[] = [
  { label: 'Bebek (0–6 ay)', footLength: 9, footCirc: 10 },
  { label: 'Bebek (6–12 ay)', footLength: 11, footCirc: 12 },
  { label: 'Çocuk (2–4 yaş)', footLength: 14, footCirc: 15 },
  { label: 'Çocuk (5–8 yaş)', footLength: 17.5, footCirc: 17 },
  { label: 'Kadın 36–37', footLength: 23, footCirc: 21 },
  { label: 'Kadın 38–39', footLength: 24.5, footCirc: 22 },
  { label: 'Erkek 41–42', footLength: 26.5, footCirc: 24 },
  { label: 'Erkek 43–45', footLength: 28, footCirc: 25 },
];

/** Amigurumi top / küre çapı önerileri */
export const BALL_SIZES: { id: string; label: string; diameter: number }[] = [
  { id: 'mini', label: 'Mini (anahtarlık)', diameter: 4 },
  { id: 'kucuk', label: 'Küçük', diameter: 7 },
  { id: 'orta', label: 'Orta (oyuncak top)', diameter: 10 },
  { id: 'buyuk', label: 'Büyük', diameter: 15 },
];

/** Bardak altlığı / daire çapları */
export const CIRCLE_SIZES: { id: string; label: string; diameter: number }[] = [
  { id: 'bardak', label: 'Bardak altlığı', diameter: 10 },
  { id: 'kupa', label: 'Kupa / demlik altlığı', diameter: 15 },
  { id: 'nihale', label: 'Nihale', diameter: 22 },
  { id: 'minder', label: 'Minder', diameter: 40 },
];
