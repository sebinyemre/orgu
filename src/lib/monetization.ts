/** Gelir modeli ayarları: fiyatlar ve reklam yapılandırması */
import type { Lang } from '@/types';

/** Usta paketi fiyatı (mağazada gösterilecek yerel fiyat yerine geçici metin) */
export const PRO_PRICE: Record<Lang, string> = {
  tr: '₺79,99 tek seferlik',
  en: '$2.99 one-time',
  es: '2,99 € pago único',
  pt: 'R$ 14,90 pagamento único',
};

/** Reklam ağı yapılandırılınca true yapılır (mobilde AdMob, webde AdSense) */
export const ADS_ENABLED = false;
