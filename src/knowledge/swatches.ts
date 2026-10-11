/** Hazır ip renkleri (paletler ve renk seçiciler için) */
import type { L10n } from '@/i18n';

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

export const YARN_SWATCHES: { hex: string; name: L10n }[] = [
  { hex: '#f5f0e6', name: l('Ekru', 'Ecru', 'Crudo', 'Cru') },
  { hex: '#e8dcc4', name: l('Bej', 'Beige', 'Beige', 'Bege') },
  { hex: '#c8b49a', name: l('Vizon', 'Taupe', 'Topo', 'Fendi') },
  { hex: '#8b6f4e', name: l('Taba', 'Camel', 'Camel', 'Caramelo') },
  { hex: '#5c3d2e', name: l('Kahve', 'Brown', 'Marrón', 'Marrom') },
  { hex: '#2f2925', name: l('Kömür', 'Charcoal', 'Carbón', 'Grafite') },
  { hex: '#9e9e9e', name: l('Gri', 'Grey', 'Gris', 'Cinza') },
  { hex: '#8e1b2a', name: l('Bordo', 'Burgundy', 'Burdeos', 'Bordô') },
  { hex: '#c0392b', name: l('Kırmızı', 'Red', 'Rojo', 'Vermelho') },
  { hex: '#b5523b', name: l('Kiremit', 'Terracotta', 'Teja', 'Terracota') },
  { hex: '#e97c6a', name: l('Mercan', 'Coral', 'Coral', 'Coral') },
  { hex: '#f4a7b9', name: l('Pembe', 'Pink', 'Rosa', 'Rosa') },
  { hex: '#f8d3dc', name: l('Pudra', 'Powder pink', 'Rosa empolvado', 'Rosa bebê') },
  { hex: '#d39a2c', name: l('Hardal', 'Mustard', 'Mostaza', 'Mostarda') },
  { hex: '#f2c84b', name: l('Sarı', 'Yellow', 'Amarillo', 'Amarelo') },
  { hex: '#8a9a5b', name: l('Haki', 'Olive', 'Caqui', 'Cáqui') },
  { hex: '#5f7a61', name: l('Adaçayı', 'Sage', 'Salvia', 'Sálvia') },
  { hex: '#1f4d3a', name: l('Zümrüt', 'Emerald', 'Esmeralda', 'Esmeralda') },
  { hex: '#9fd8cb', name: l('Mint', 'Mint', 'Menta', 'Menta') },
  { hex: '#2a9d8f', name: l('Petrol', 'Teal', 'Verde azulado', 'Verde-petróleo') },
  { hex: '#87ceeb', name: l('Bebe mavisi', 'Baby blue', 'Celeste', 'Azul-bebê') },
  { hex: '#46698a', name: l('Denim', 'Denim', 'Vaquero', 'Jeans') },
  { hex: '#1b2a4a', name: l('Lacivert', 'Navy', 'Azul marino', 'Azul-marinho') },
  { hex: '#b39ddb', name: l('Lila', 'Lilac', 'Lila', 'Lilás') },
  { hex: '#7d4e6d', name: l('Mürdüm', 'Plum', 'Ciruela', 'Ameixa') },
];
