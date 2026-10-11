/**
 * Çok dil desteği: Türkçe, İngilizce, İspanyolca, Portekizce (Brezilya).
 *
 * Kullanım:
 *   const M = defineMessages({ tr: { save: 'Kaydet', n: (k: number) => `${k} ilmek` }, en: {...}, es: {...}, pt: {...} });
 *   const t = useMsgs(M);  t.save, t.n(3)
 * İçerik verisinde çok dilli metin: L10n = { tr, en, es, pt } → tx(value, lang)
 */
import { useSettings } from '@/store/settings';
import type { Lang } from '@/types';

export type { Lang };

export interface LangInfo {
  id: Lang;
  /** kendi dilinde adı */
  name: string;
  locale: string;
}

export const LANGS: LangInfo[] = [
  { id: 'tr', name: 'Türkçe', locale: 'tr-TR' },
  { id: 'en', name: 'English', locale: 'en-US' },
  { id: 'es', name: 'Español', locale: 'es-ES' },
  { id: 'pt', name: 'Português', locale: 'pt-BR' },
];

export const LOCALE: Record<Lang, string> = { tr: 'tr-TR', en: 'en-US', es: 'es-ES', pt: 'pt-BR' };

/** Dört dilde metin (ya da başka değer) */
export type L10n<T = string> = Record<Lang, T>;

/** Çok dilli değerden geçerli dilinkini seçer. Düz metin verilirse olduğu gibi döner. */
export function tx<T>(v: L10n<T> | T, lang: Lang): T {
  if (v && typeof v === 'object' && !Array.isArray(v) && 'tr' in (v as object) && 'en' in (v as object)) return (v as L10n<T>)[lang];
  return v as T;
}

/** Mesaj kataloğu tanımlar: tüm dillerde Türkçe ile aynı anahtarlar zorunludur. */
export function defineMessages<T>(m: { tr: T; en: NoInfer<T>; es: NoInfer<T>; pt: NoInfer<T> }): L10n<T> {
  return m;
}

/** Geçerli dil (bileşen içinde) */
export function useLang(): Lang {
  return useSettings((s) => s.lang);
}

/** Geçerli dil (bileşen dışında) */
export function getLang(): Lang {
  return useSettings.getState().lang;
}

/** Kataloğun geçerli dildeki hâli */
export function useMsgs<T>(m: L10n<T>): T {
  return m[useLang()];
}

export { detectLang } from '@/store/settings';

/** Dile göre büyük/küçük harf (Türkçe i/İ) */
export function upper(s: string, lang: Lang): string {
  return s.toLocaleUpperCase(LOCALE[lang]);
}
export function capitalize(s: string, lang: Lang): string {
  return s ? s.charAt(0).toLocaleUpperCase(LOCALE[lang]) + s.slice(1) : s;
}
export function lowerFirst(s: string, lang: Lang): string {
  return s ? s.charAt(0).toLocaleLowerCase(LOCALE[lang]) + s.slice(1) : s;
}
