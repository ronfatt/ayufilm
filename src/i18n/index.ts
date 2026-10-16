/**
 * Internationalization Index & Context Hooks
 * Primary: Bahasa Melayu ('ms')
 * Bilingual: Bahasa Melayu + Terjemahan Cina ('ms_zh')
 * Chinese: Bahasa Cina ('zh')
 */

export * from './translations';
import { TRANSLATIONS, Locale, TranslationDictionary } from './translations';

export function getDictionary(locale: Locale): TranslationDictionary {
  return TRANSLATIONS[locale] || TRANSLATIONS['ms'];
}

export const COPY = TRANSLATIONS['ms']; // Default fallback to Malay
