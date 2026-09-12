export type Currency = 'MXN' | 'USD' | 'EUR'
export type Language = 'es' // único idioma soportado por ahora; el campo ya existe para el futuro
export type Theme = 'claro' // único tema soportado por ahora; el campo ya existe para el futuro

export interface UserSettings {
  user_id: string
  currency: Currency
  language: Language
  theme: Theme
  updated_at: string
}

export type UserSettingsInput = Pick<UserSettings, 'currency' | 'language' | 'theme'>

export const CURRENCY_LABELS: Record<Currency, string> = {
  MXN: 'Peso mexicano (MXN)',
  USD: 'Dólar estadounidense (USD)',
  EUR: 'Euro (EUR)',
}

export const DEFAULT_SETTINGS: UserSettingsInput = {
  currency: 'MXN',
  language: 'es',
  theme: 'claro',
}