import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from './navItems'

function isActive(pathname: string, to: string, matchPrefix?: boolean): boolean {
  if (to === '/') return pathname === '/'
  return matchPrefix ? pathname.startsWith(to) : pathname === to
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation()

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.to, item.matchPrefix)
        const Icon = item.icon
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? 'bg-charcoal text-warm-white' : 'text-charcoal hover:bg-bone'
            }`}
          >
            <Icon size={18} strokeWidth={2} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-warm-white">
      {/* Sidebar fija — solo desde md hacia arriba (tablet/laptop) */}
      <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-bone md:bg-ivory">
        <div className="px-6 py-6">
          <span className="text-lg font-semibold text-charcoal">Contas</span>
        </div>
        <NavLinks />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior — solo en móvil, con botón de menú */}
        <header className="flex items-center justify-between border-b border-bone bg-warm-white px-4 py-4 md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
            className="rounded-button p-2 text-charcoal hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold text-charcoal">Contas</span>
          <span className="w-9" aria-hidden="true" /> {/* espaciador para centrar el título */}
        </header>

        {/* Drawer — overlay que se abre desde la izquierda, solo en móvil */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            onClick={() => setDrawerOpen(false)}
          >
            <div className="absolute inset-0 bg-charcoal/40" />
            <div
              className="absolute left-0 top-0 flex h-full w-64 flex-col bg-ivory pt-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between px-6">
                <span className="text-lg font-semibold text-charcoal">Contas</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Cerrar menú"
                  className="rounded-button p-1 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
                >
                  <X size={20} />
                </button>
              </div>
              <NavLinks onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}