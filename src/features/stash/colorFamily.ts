/** İp renklerini filtre için kaba renk ailelerine ayırır (saf fonksiyon). */
import { hexToHsl } from '@/lib/color';

export type ColorFamily = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'brown' | 'neutral';

export const COLOR_FAMILIES: ColorFamily[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'neutral'];

/** Filtre düğmelerinde gösterilecek örnek ip renkleri (veri rengi) */
export const FAMILY_SWATCH: Record<ColorFamily, string> = {
  red: '#c0392b',
  orange: '#e07a3a',
  yellow: '#f2c84b',
  green: '#5f7a61',
  blue: '#46698a',
  purple: '#7d4e6d',
  pink: '#f4a7b9',
  brown: '#8b6f4e',
  neutral: '#e8dcc4',
};

export function colorFamily(hex: string): ColorFamily {
  const { h, s, l } = hexToHsl(hex);
  if (l < 0.12 || s < 0.1 || (l < 0.2 && s < 0.2) || (l > 0.8 && s < 0.5) || l > 0.95) return 'neutral';
  if (h >= 12 && h < 50 && s < 0.45 && l < 0.75) return 'brown';
  if ((h >= 300 || h < 15) && l > 0.68) return 'pink';
  if (h < 9 || h >= 330) return 'red';
  if (h < 36) return 'orange';
  if (h < 66) return 'yellow';
  if (h < 175) return 'green';
  if (h < 250) return 'blue';
  return 'purple';
}
