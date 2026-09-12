import { useState } from 'react'
import { useSettings } from '../../../lib/settings/useSettings'
import { CURRENCY_LABELS, type Currency } from '../../../lib/settings/types'
import { SettingsSection } from './SettingsSection'

const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[]

export function PreferencesSection() {
  const { settings, updateSettings } = useSettings()
  const [saving, setSaving] = useState(false)

  async function handleCurrencyChange(currency: Currency) {
    setSaving(true)
    try {
      await updateSettings({ currency })
    } finally {
      setSaving(false)
    }
  }

  return (
    <SettingsSection title="Preferencias">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="currency" className="text-sm font-medium text-slate">
          Moneda
        </label>
        <select
          id="currency"
          value={settings.currency}
          onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
          disabled={saving}
          className="rounded-input border border-bone bg-warm-white px-4 py-2.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:opacity-60"
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {CURRENCY_LABELS[code]}
            </option>
          ))}
        </select>
        <p className="text-xs text-stone">Se aplica a todos los montos mostrados en la app.</p>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-bone pt-4">
        <label htmlFor="language" className="text-sm font-medium text-slate">
          Idioma
        </label>
        <select
          id="language"
          value="es"
          disabled
          className="rounded-input border border-bone bg-bone px-4 py-2.5 text-stone disabled:cursor-not-allowed"
        >
          <option value="es">Español</option>
        </select>
        <p className="text-xs text-stone">Próximamente — por ahora Contas solo está disponible en español.</p>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-bone pt-4">
        <label htmlFor="theme" className="text-sm font-medium text-slate">
          Tema
        </label>
        <select
          id="theme"
          value="claro"
          disabled
          className="rounded-input border border-bone bg-bone px-4 py-2.5 text-stone disabled:cursor-not-allowed"
        >
          <option value="claro">Claro</option>
        </select>
        <p className="text-xs text-stone">Próximamente — el modo oscuro está en desarrollo.</p>
      </div>
    </SettingsSection>
  )
}