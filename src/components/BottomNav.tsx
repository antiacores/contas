import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { MOBILE_NAV_ITEMS } from './navItems'

function isActive(pathname: string, to: string, matchPrefix?: boolean): boolean {
  if (to === '/') return pathname === '/'
  return matchPrefix ? pathname.startsWith(to) : pathname === to
}

// Barra fija de navegación en móvil, con el botón "+" central elevado para
// agregar un movimiento desde cualquier pantalla — nunca hay que "buscar"
// dónde registrar un gasto, cumple lo que pide PRODUCT_VISION.md ("menos
// de 5 segundos"). Los 4 destinos van solo con ícono; el activo se resalta
// con fondo oscuro, igual que en el sidebar de escritorio.
export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [firstHalf, secondHalf] = [MOBILE_NAV_ITEMS.slice(0, 2), MOBILE_NAV_ITEMS.slice(2)]

  function handleNewMovement() {
    navigate('/movimientos', { state: { openNew: true } })
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-bone bg-warm-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
      {firstHalf.map((item) => {
        const active = isActive(pathname, item.to, item.matchPrefix)
        const Icon = item.icon
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={`flex h-11 w-11 items-center justify-center rounded-button transition-colors ${
              active ? 'bg-charcoal text-warm-white' : 'text-taupe hover:bg-bone'
            }`}
          >
            <Icon size={20} strokeWidth={2} />
          </Link>
        )
      })}

      <button
        onClick={handleNewMovement}
        aria-label="Nuevo movimiento"
        className="-mt-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-charcoal text-warm-white shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
      >
        <Plus size={26} />
      </button>

      {secondHalf.map((item) => {
        const active = isActive(pathname, item.to, item.matchPrefix)
        const Icon = item.icon
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={`flex h-11 w-11 items-center justify-center rounded-button transition-colors ${
              active ? 'bg-charcoal text-warm-white' : 'text-taupe hover:bg-bone'
            }`}
          >
            <Icon size={20} strokeWidth={2} />
          </Link>
        )
      })}
    </nav>
  )
}