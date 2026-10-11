import type { LucideIcon } from 'lucide-react';
import { BookA, Calculator, FolderHeart, GraduationCap, Grid3x3, NotebookPen, Palette, Settings, ShoppingBasket, SquareStack, Tally5, Wrench } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  /** alt menüde kısa ad */
  short?: string;
  icon: LucideIcon;
  /** kısa açıklama (menü ve araçlar sayfasında) */
  desc?: string;
  end?: boolean;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  { items: [{ to: '/', label: 'Dersler', icon: GraduationCap, end: true, desc: 'Adım adım resimli şiş ve tığ dersleri' }] },
  {
    title: 'Kütüphane',
    items: [
      { to: '/desenler', label: 'Desen kütüphanesi', short: 'Desenler', icon: SquareStack, desc: 'Haraşo, lastik, selanik, burgu ve tığ desenleri' },
      { to: '/sozluk', label: 'Sözlük', icon: BookA, desc: 'Türkçe ve İngilizce terimler, kısaltmalar' },
    ],
  },
  {
    title: 'Atölye araçları',
    items: [
      { to: '/kareli', label: 'Kareli kağıt', icon: Grid3x3, desc: 'Desen grafiği çiz, örerken sıra sıra takip et' },
      { to: '/tarif', label: 'Tarif hazırlayıcı', icon: NotebookPen, desc: 'Şişini, ipini ve ölçünü gir, adım adım tarif al' },
      { to: '/sayaclar', label: 'Sayaçlar', icon: Tally5, desc: 'Sıra, ilmek ve tekrar sayaçları' },
      { to: '/hesap', label: 'Hesaplayıcılar', icon: Calculator, desc: 'Kaç ilmek, eşit artırma, ip miktarı' },
      { to: '/renk', label: 'Renk stüdyosu', icon: Palette, desc: 'Palet, şerit ve sıcaklık battaniyesi' },
    ],
  },
  {
    title: 'Benim',
    items: [
      { to: '/projeler', label: 'Projelerim', short: 'Projeler', icon: FolderHeart, desc: 'Örgü defterin' },
      { to: '/sepet', label: 'İp sepeti', icon: ShoppingBasket, desc: 'İplerin, şişlerin ve tığların' },
    ],
  },
];

export const SETTINGS_ITEM: NavItem = { to: '/ayarlar', label: 'Ayarlar', icon: Settings, desc: 'Trabzan adları, tema, solak modu, yedek' };
export const TOOLS_ITEM: NavItem = { to: '/araclar', label: 'Araçlar', icon: Wrench, desc: 'Kareli kağıt, sayaçlar, hesaplayıcılar' };

/** Telefonda alt menü */
export const BOTTOM_NAV: string[] = ['/', '/desenler', '/araclar', '/projeler'];

export const ALL_ITEMS: NavItem[] = [...NAV.flatMap((g) => g.items), TOOLS_ITEM, SETTINGS_ITEM];
