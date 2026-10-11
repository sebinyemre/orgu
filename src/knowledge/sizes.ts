import type { L10n } from '@/i18n';

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

/**
 * Standart beden ölçüleri (cm). Kaynak: Craft Yarn Council beden tabloları ve yaygın örgü tarifleri.
 * Ölçüler vücut ölçüsüdür; örgü ölçüsü için bolluk/darlık payı (ease) ayrıca eklenir.
 */

export interface HeadSize {
  id: string;
  label: L10n;
  /** baş çevresi */
  circumference: number;
  /** bere boyu (alından tepeye, kıvrımsız) */
  hatHeight: number;
}

export const HEAD_SIZES: HeadSize[] = [
  { id: 'yenidogan', label: l('Yenidoğan', 'Newborn', 'Recién nacido', 'Recém-nascido'), circumference: 35, hatHeight: 13 },
  { id: 'bebek-3-6', label: l('Bebek (3–6 ay)', 'Baby (3–6 months)', 'Bebé (3–6 meses)', 'Bebê (3–6 meses)'), circumference: 41, hatHeight: 15 },
  { id: 'bebek-6-12', label: l('Bebek (6–12 ay)', 'Baby (6–12 months)', 'Bebé (6–12 meses)', 'Bebê (6–12 meses)'), circumference: 45, hatHeight: 16.5 },
  { id: 'cocuk-1-3', label: l('Çocuk (1–3 yaş)', 'Toddler (1–3 yrs)', 'Niño (1–3 años)', 'Criança (1–3 anos)'), circumference: 48, hatHeight: 17.5 },
  { id: 'cocuk-3-10', label: l('Çocuk (3–10 yaş)', 'Child (3–10 yrs)', 'Niño (3–10 años)', 'Criança (3–10 anos)'), circumference: 51, hatHeight: 19 },
  { id: 'genc', label: l('Genç / küçük yetişkin', 'Teen / small adult', 'Adolescente / adulto pequeño', 'Adolescente / adulto pequeno'), circumference: 54, hatHeight: 20 },
  { id: 'kadin', label: l('Yetişkin (orta)', 'Adult (medium)', 'Adulto (mediano)', 'Adulto (médio)'), circumference: 56, hatHeight: 21 },
  { id: 'erkek', label: l('Yetişkin (büyük)', 'Adult (large)', 'Adulto (grande)', 'Adulto (grande)'), circumference: 58.5, hatHeight: 22 },
];

/** Bere için önerilen darlık payı: örgü çevresi = baş çevresi × (1 - pay) */
export const HAT_NEGATIVE_EASE = 0.1;

export interface RectSize {
  id: string;
  label: L10n;
  width: number;
  length: number;
}

export const SCARF_SIZES: RectSize[] = [
  { id: 'cocuk', label: l('Çocuk atkısı', 'Child scarf', 'Bufanda infantil', 'Cachecol infantil'), width: 14, length: 110 },
  { id: 'standart', label: l('Standart atkı', 'Standard scarf', 'Bufanda estándar', 'Cachecol padrão'), width: 20, length: 160 },
  { id: 'genis', label: l('Geniş atkı', 'Wide scarf', 'Bufanda ancha', 'Cachecol largo'), width: 28, length: 180 },
  { id: 'sal', label: l('Şal atkı', 'Wrap', 'Chal estola', 'Xale estola'), width: 50, length: 190 },
];

export const BLANKET_SIZES: RectSize[] = [
  { id: 'puset', label: l('Puset / araba koltuğu', 'Stroller / car seat', 'Cochecito / silla de coche', 'Carrinho / cadeirinha'), width: 70, length: 80 },
  { id: 'bebek', label: l('Bebek battaniyesi', 'Baby blanket', 'Manta de bebé', 'Manta de bebê'), width: 80, length: 100 },
  { id: 'kucak', label: l('Kucak örtüsü', 'Lap blanket', 'Manta de regazo', 'Manta de colo'), width: 100, length: 130 },
  { id: 'tekli', label: l('Tek kişilik', 'Single bed', 'Cama individual', 'Solteiro'), width: 150, length: 200 },
  { id: 'cift', label: l('Çift kişilik', 'Double bed', 'Cama doble', 'Casal'), width: 200, length: 220 },
];

export interface CowlSize {
  id: string;
  label: L10n;
  circumference: number;
  height: number;
}

export const COWL_SIZES: CowlSize[] = [
  { id: 'cocuk', label: l('Çocuk boyunluğu', 'Child cowl', 'Cuello infantil', 'Gola infantil'), circumference: 45, height: 18 },
  { id: 'dar', label: l('Dar boyunluk', 'Snug cowl', 'Cuello ajustado', 'Gola justa'), circumference: 55, height: 22 },
  { id: 'standart', label: l('Standart boyunluk', 'Standard cowl', 'Cuello estándar', 'Gola padrão'), circumference: 65, height: 25 },
  { id: 'cift-tur', label: l('Çift tur dolanan', 'Double-wrap cowl', 'Cuello de doble vuelta', 'Gola de duas voltas'), circumference: 130, height: 25 },
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
export const FOOT_SIZES: { label: L10n; footLength: number; footCirc: number }[] = [
  { label: l('Bebek (0–6 ay)', 'Baby (0–6 months)', 'Bebé (0–6 meses)', 'Bebê (0–6 meses)'), footLength: 9, footCirc: 10 },
  { label: l('Bebek (6–12 ay)', 'Baby (6–12 months)', 'Bebé (6–12 meses)', 'Bebê (6–12 meses)'), footLength: 11, footCirc: 12 },
  { label: l('Çocuk (2–4 yaş)', 'Child (2–4 yrs)', 'Niño (2–4 años)', 'Criança (2–4 anos)'), footLength: 14, footCirc: 15 },
  { label: l('Çocuk (5–8 yaş)', 'Child (5–8 yrs)', 'Niño (5–8 años)', 'Criança (5–8 anos)'), footLength: 17.5, footCirc: 17 },
  { label: l('Kadın 36–37', 'Women EU 36–37', 'Mujer 36–37', 'Feminino 34–35'), footLength: 23, footCirc: 21 },
  { label: l('Kadın 38–39', 'Women EU 38–39', 'Mujer 38–39', 'Feminino 36–37'), footLength: 24.5, footCirc: 22 },
  { label: l('Erkek 41–42', 'Men EU 41–42', 'Hombre 41–42', 'Masculino 39–40'), footLength: 26.5, footCirc: 24 },
  { label: l('Erkek 43–45', 'Men EU 43–45', 'Hombre 43–45', 'Masculino 41–43'), footLength: 28, footCirc: 25 },
];

/** Amigurumi top / küre çapı önerileri */
export const BALL_SIZES: { id: string; label: L10n; diameter: number }[] = [
  { id: 'mini', label: l('Mini (anahtarlık)', 'Mini (keychain)', 'Mini (llavero)', 'Mini (chaveiro)'), diameter: 4 },
  { id: 'kucuk', label: l('Küçük', 'Small', 'Pequeña', 'Pequena'), diameter: 7 },
  { id: 'orta', label: l('Orta (oyuncak top)', 'Medium (toy ball)', 'Mediana (pelota)', 'Média (bola)'), diameter: 10 },
  { id: 'buyuk', label: l('Büyük', 'Large', 'Grande', 'Grande'), diameter: 15 },
];

/** Bardak altlığı / daire çapları */
export const CIRCLE_SIZES: { id: string; label: L10n; diameter: number }[] = [
  { id: 'bardak', label: l('Bardak altlığı', 'Coaster', 'Posavasos', 'Porta-copos'), diameter: 10 },
  { id: 'kupa', label: l('Kupa / demlik altlığı', 'Mug / teapot mat', 'Salvamanteles de taza', 'Descanso de caneca'), diameter: 15 },
  { id: 'nihale', label: l('Nihale', 'Trivet', 'Salvamanteles', 'Descanso de panela'), diameter: 22 },
  { id: 'minder', label: l('Minder', 'Cushion', 'Cojín', 'Almofada'), diameter: 40 },
];
