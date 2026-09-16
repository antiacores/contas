import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'
import { useAuth } from '../lib/auth/useAuth'
import { BottomNav } from './BottomNav'
import { FloatingProfileButton } from './FloatingProfileButton'

function isActive(pathname: string, to: string, matchPrefix?: boolean): boolean {
  if (to === '/') return pathname === '/'
  return matchPrefix ? pathname.startsWith(to) : pathname === to
}

function Logo() {
  return <img src="/apple-touch-icon.png" alt="" className="h-7 w-7 shrink-0 rounded-md" />
}

function NavLinks() {
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

// Botón de perfil del sidebar de escritorio: foto de Google si iniciaste
// sesión así, o la inicial de tu nombre/correo como respaldo. En móvil este
// mismo rol lo cumple FloatingProfileButton (esquina superior derecha).
function ProfileButton() {
  const { user } = useAuth()
  const { pathname } = useLocation()

  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? ''
  const initial = displayName.charAt(0).toUpperCase()
  const active = pathname === '/configuracion'

  return (
    <Link
      to="/configuracion"
      className={`flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition-colors ${
        active ? 'bg-charcoal text-warm-white' : 'text-charcoal hover:bg-bone'
      }`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-7 w-7 shrink-0 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            active ? 'bg-warm-white text-charcoal' : 'bg-bone text-charcoal'
          }`}
        >
          {initial}
        </span>
      )}
      <span className="truncate">{displayName}</span>
    </Link>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-warm-white">
      {/* Sidebar fija — solo desde md hacia arriba (tablet/laptop). Sin cambios. */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:overflow-y-auto md:border-r md:border-bone md:bg-ivory">
        <div className="flex items-center gap-2 px-6 py-6">
          <Logo />
          <span className="text-lg font-semibold text-charcoal">Contas</span>
        </div>
        <NavLinks />
        <div className="mt-auto border-t border-bone p-3">
          <ProfileButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* En móvil: sin barra superior — el avatar flotante y la barra de
            abajo cubren navegación y perfil; cada pantalla ya trae su propio
            título vía PageHeader. pb-20 dejar espacio para no tapar contenido
            con la barra fija de abajo. */}
        <FloatingProfileButton />
        <main className="min-w-0 flex-1 pb-20 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:pb-0 md:pt-0">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}