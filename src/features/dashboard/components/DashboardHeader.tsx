import { useAuth } from '../../../lib/auth/useAuth'

export function DashboardHeader() {
  const { user } = useAuth()

  // Solo nos quedamos con la parte antes del @ para un saludo más cercano,
  // en línea con el lenguaje simple que pide PRODUCT_VISION.md.
  const firstName = user?.email?.split('@')[0] ?? ''

  return (
    <header className="px-4 py-6 sm:px-6 lg:px-10">
      <p className="text-sm text-taupe">Hola,</p>
      <h1 className="text-xl font-semibold text-charcoal">{firstName}</h1>
    </header>
  )
}