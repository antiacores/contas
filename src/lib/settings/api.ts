import { supabase } from '../supabase'
import { DEFAULT_SETTINGS, type UserSettings, type UserSettingsInput } from './types'

export async function fetchOrCreateSettings(): Promise<UserSettings> {
  const { data, error } = await supabase.from('user_settings').select('*').maybeSingle()
  if (error) throw error
  if (data) return data as UserSettings

  // Primera vez que este usuario entra a Configuración: crea su fila con defaults.
  const { data: created, error: insertError } = await supabase
    .from('user_settings')
    .insert(DEFAULT_SETTINGS)
    .select()
    .single()

  if (insertError) throw insertError
  return created as UserSettings
}

export async function updateSettings(input: Partial<UserSettingsInput>): Promise<UserSettings> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error('No hay sesión activa.')

  const { data, error } = await supabase
    .from('user_settings')
    .update(input)
    .eq('user_id', userData.user.id)
    .select()
    .single()

  if (error) throw error
  return data as UserSettings
}