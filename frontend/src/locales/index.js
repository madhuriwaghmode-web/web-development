import en from './en'
import hi from './hi'
import mr from './mr'

export const translations = { en, hi, mr }

export function getTranslation(languageCode) {
  return translations[languageCode] || translations.en
}

// Small helper for "dashboard.totalPatients" style lookups with an English fallback.
export function translate(languageCode, path) {
  const dict = getTranslation(languageCode)
  const fallback = translations.en
  const parts = path.split('.')
  let node = dict
  let fallbackNode = fallback
  for (const part of parts) {
    node = node?.[part]
    fallbackNode = fallbackNode?.[part]
  }
  return node ?? fallbackNode ?? path
}
