import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth/useAuth'

// Placeholder de la Fase 3. Solo confirma que el login funciona
// y que hay una sesión real conectada a Supabase.
export function DashboardPage() {
  const { user } = useAuth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-warm-white px-6 text-center">
      <h1 className="text-2xl font-semibold text-charcoal">Bienvenido a Contas</h1>
      <p className="text-taupe">Sesión iniciada como {user?.email}</p>
      <button
        onClick={() => supabase.auth.signOut()}
        className="rounded-button border border-bone bg-ivory px-4 py-2 text-sm font-medium text-charcoal hover:bg-bone"
      >
        Cerrar sesión
      </button>
    </main>
  )
}