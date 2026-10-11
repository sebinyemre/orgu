/** Varsayılan sayaç adları: sayaç oluşturulduğu andaki uygulama dilinde yazılır */
import { getLang } from '@/i18n';

const DEFAULT_NAMES = {
  row: { tr: 'Sıra', en: 'Row', es: 'Vuelta', pt: 'Carreira' },
  rowCounter: { tr: 'Sıra sayacı', en: 'Row counter', es: 'Contador de vueltas', pt: 'Contador de carreiras' },
  round: { tr: 'Tur / Sıra', en: 'Round / Row', es: 'Vuelta', pt: 'Volta / Carreira' },
  stitch: { tr: 'İlmek', en: 'Stitch', es: 'Punto', pt: 'Ponto' },
  counter: { tr: 'Sayaç', en: 'Counter', es: 'Contador', pt: 'Contador' },
} as const;

export const defaultCounterName = (k: keyof typeof DEFAULT_NAMES): string => DEFAULT_NAMES[k][getLang()];
