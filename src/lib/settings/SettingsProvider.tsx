import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { fetchOrCreateSettings, updateSettings as updateSettingsApi } from './api'
import { DEFAULT_SETTINGS, type UserSettings, type UserSettingsInput } from './types'
import { useAuth } from '../auth/useAuth'

interface SettingsContextValue {
  settings: UserSettings
  loading: boolean
  updateSettings: (input: Partial<UserSettingsInput>) => Promise<void>
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      setSettings(null)
      setLoading(false)
      return
    }
    setLoading(true)
    fetchOrCreateSettings()
      .then(setSettings)
      .finally(() => setLoading(false))
  }, [session])

  const updateSettings = useCallback(async (input: Partial<UserSettingsInput>) => {
    const updated = await updateSettingsApi(input)
    setSettings(updated)
  }, [])

  return (
    <SettingsContext.Provider
      value={{ settings: settings ?? { ...DEFAULT_SETTINGS, user_id: '', updated_at: '' }, loading, updateSettings }}
    >
      {children}
    </SettingsContext.Provider>
  )
}