import { useState } from 'react'
import { findServiceByName } from '../services'

const LOGO_DEV_TOKEN = import.meta.env.VITE_LOGO_DEV_TOKEN

interface SubscriptionLogoProps {
  name: string
  fallbackColor: string
  size?: number
}

// Mismo patrón que BankBadge: si el nombre coincide con el catálogo de
// servicios conocidos, muestra el logo real vía logo.dev; si no coincide
// (es un "Otro" con texto libre) o el logo falla al cargar, cae a un
// cuadrado con las iniciales y el color que el usuario eligió.
export function SubscriptionLogo({ name, fallbackColor, size = 40 }: SubscriptionLogoProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const service = findServiceByName(name)
  const logoUrl =
    service && LOGO_DEV_TOKEN ? `https://img.logo.dev/${service.domain}?token=${LOGO_DEV_TOKEN}` : null
  const style = { width: size, height: size }

  if (logoUrl && !imageFailed) {
    return (
      <span
        title={name}
        style={style}
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-warm-white ring-1 ring-bone"
      >
        <img
          src={logoUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      </span>
    )
  }

  const initials = name.trim().slice(0, 2).toUpperCase() || '?'
  return (
    <span
      title={name}
      aria-label={name}
      style={style}
      className="flex shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-warm-white"
    >
      <span
        style={{ backgroundColor: fallbackColor, width: '100%', height: '100%', borderRadius: '0.5rem' }}
        className="flex items-center justify-center"
      >
        {initials}
      </span>
    </span>
  )
}