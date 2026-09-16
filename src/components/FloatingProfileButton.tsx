import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth/useAuth'

// Ícono de perfil fijo en la esquina superior derecha, visible en todas las
// pantallas de móvil (reemplaza al botón de perfil que en escritorio vive al
// fondo del sidebar). Mismo criterio: foto de Google si existe, si no, inicial.
export function FloatingProfileButton() {
  const { user } = useAuth()

  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? ''
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <Link
      to="/configuracion"
      aria-label="Configuración"
      className="fixed right-4 z-40 md:hidden"
    style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-10 w-10 rounded-full object-cover ring-2 ring-warm-white"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bone text-sm font-semibold text-charcoal ring-2 ring-warm-white">
          {initial}
        </span>
      )}
    </Link>
  )
}