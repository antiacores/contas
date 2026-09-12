import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables de entorno de Supabase. Revisa tu archivo .env (usa .env.example como referencia).',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Estos 3 ya son el default de supabase-js, pero los dejamos explícitos:
    // persistSession guarda la sesión en localStorage (sobrevive a cerrar la app/pestaña),
    // autoRefreshToken renueva el token de acceso solo antes de que expire,
    // así nunca deberías tener que volver a iniciar sesión salvo que cierres sesión a propósito.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})