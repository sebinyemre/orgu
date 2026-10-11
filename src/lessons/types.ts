/** Ders içerik modeli: resimli adımlar, ihtiyaç listesi, alıştırma, kısa sınav */
import type { ReactNode } from 'react';
import type { L10n } from '@/i18n';

export interface LessonStep {
  /** kısa başlık, emir kipinde: "Bat", "Sar" */
  title: L10n;
  /** 1–3 cümlelik açıklama. Tığ terimleri için {sc} {dc} yer tutucuları kullanılabilir */
  text: L10n;
  /** çizim: Scene içine konacak sahne öğeleri */
  scene: () => ReactNode;
  /** döngü süresi (sn) */
  dur?: number;
  viewBox?: string;
  tip?: L10n;
  warn?: L10n;
  /** tığdaki ilmek sayısı (rozet olarak gösterilir) */
  loopsOnHook?: number;
}

export type NeedKind = 'yarn' | 'needles' | 'circular' | 'dpn' | 'hook' | 'scissors' | 'tapestry' | 'markers' | 'tape' | 'stuffing' | 'cable' | 'counter';

export interface LessonNeed {
  kind: NeedKind;
  text: L10n;
}

export interface QuizQuestion {
  q: L10n;
  options: L10n[];
  answer: number;
  explain?: L10n;
  scene?: () => ReactNode;
}

export interface Lesson {
  id: string;
  intro: L10n;
  needs?: LessonNeed[];
  steps: LessonStep[];
  practice?: { text: L10n; target: number; unit: 'stitch' | 'row' | 'round' | 'chain' };
  quiz?: QuizQuestion[];
  summary?: L10n[];
}

export const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });
