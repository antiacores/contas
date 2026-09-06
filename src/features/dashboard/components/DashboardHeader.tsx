import { LogOut } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../lib/auth/useAuth'

export function DashboardHeader() {
  const { user } = useAuth()

  // Solo nos quedamos con la parte antes del @ para un saludo más cercano,
  // en línea con el lenguaje simple que pide PRODUCT_VISION.md.
  const firstName = user?.email?.split('@')[0] ?? ''

  return (
    <header className="flex items-center justify-between px-6 py-6 sm:px-10">
      <div>
        <p className="text-sm text-taupe">Hola,</p>
        <h1 className="text-xl font-semibold text-charcoal">{firstName}</h1>
      </div>

      <button
        onClick={() => supabase.auth.signOut()}
        aria-label="Cerrar sesión"
        className="flex items-center gap-2 rounded-button border border-bone bg-warm-white px-3 py-2 text-sm text-slate hover:bg-bone
                   focus:outline-none focus:ring-2 focus:ring-slate/40"
      >
        <LogOut size={16} strokeWidth={2} />
        Cerrar sesión
      </button>
    </header>
  )
}