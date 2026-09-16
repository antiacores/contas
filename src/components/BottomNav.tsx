import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { MOBILE_NAV_ITEMS, type NavItem } from './navItems'

function isActive(pathname: string, to: string, matchPrefix?: boolean): boolean {
  if (to === '/') return pathname === '/'
  return matchPrefix ? pathname.startsWith(to) : pathname === to
}

function NavButton({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      aria-label={item.label}
      className={`flex h-11 w-11 items-center justify-center rounded-button transition-all active:scale-90 ${
        active ? 'bg-charcoal text-warm-white' : 'text-taupe hover:bg-bone'
      }`}
    >
      {/* La key cambia solo cuando se vuelve activo — eso es lo que hace que
          el rebote se dispare de nuevo cada vez, no solo la primera vez. */}
      <Icon key={active ? 'active' : 'inactive'} size={20} strokeWidth={2} className={active ? 'animate-tab-bounce' : ''} />
    </Link>
  )
}

// Barra fija de navegación en móvil, con el botón "+" central elevado para
// agregar un movimiento desde cualquier pantalla — nunca hay que "buscar"
// dónde registrar un gasto, cumple lo que pide PRODUCT_VISION.md ("menos
// de 5 segundos"). Los 4 destinos van solo con ícono; el activo se resalta
// con fondo oscuro y un rebote sutil, igual que en el sidebar de escritorio
// pero con más "vida" — y todos los botones se encogen un poco al presionarlos.
export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [firstHalf, secondHalf] = [MOBILE_NAV_ITEMS.slice(0, 2), MOBILE_NAV_ITEMS.slice(2)]

  function handleNewMovement() {
    navigate('/movimientos', { state: { openNew: true } })
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-bone bg-warm-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
      {firstHalf.map((item) => (
        <NavButton key={item.to} item={item} active={isActive(pathname, item.to, item.matchPrefix)} />
      ))}

      <button
        onClick={handleNewMovement}
        aria-label="Nuevo movimiento"
        className="-mt-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-charcoal text-warm-white shadow-lg transition-transform hover:opacity-90 active:scale-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
      >
        <Plus size={26} />
      </button>

      {secondHalf.map((item) => (
        <NavButton key={item.to} item={item} active={isActive(pathname, item.to, item.matchPrefix)} />
      ))}
    </nav>
  )
}