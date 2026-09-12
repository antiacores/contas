import { useState } from 'react'
import { getBankById } from '../banks'

interface BankBadgeProps {
  bank: string | null
  size?: number // en px — default 24 (uso inline junto al tipo de cuenta)
}

const LOGO_DEV_TOKEN = import.meta.env.VITE_LOGO_DEV_TOKEN

// Muestra el logo real del banco (vía logo.dev, por dominio — sucesor oficial
// de Clearbit, que cerró su API de logos en diciembre 2025). Si la imagen
// falla al cargar (dominio no encontrado, banco "Otro" con texto libre,
// falta la clave de logo.dev, etc.), cae de vuelta al badge de iniciales.
export function BankBadge({ bank, size = 24 }: BankBadgeProps) {
  const [imageFailed, setImageFailed] = useState(false)

  if (!bank) return null

  const known = getBankById(bank)
  const initials = known ? known.initials : bank.slice(0, 2).toUpperCase()
  const color = known ? known.color : '#A89D8D'
  const label = known ? known.name : bank
  const logoUrl =
    known?.domain && LOGO_DEV_TOKEN
      ? `https://img.logo.dev/${known.domain}?token=${LOGO_DEV_TOKEN}`
      : null
  const style = { width: size, height: size }

  if (logoUrl && !imageFailed) {
    return (
      <span
        title={label}
        style={style}
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-warm-white ring-1 ring-bone"
      >
        <img
  src={logoUrl}
  alt={label}
  className="h-full w-full object-cover"
  onError={() => setImageFailed(true)}
/>
      </span>
    )
  }

  return (
    <span
      title={label}
      aria-label={label}
      style={style}
      className="flex shrink-0 items-center justify-center rounded-lg font-semibold text-warm-white"
    >
      <span
        style={{ backgroundColor: color, width: '100%', height: '100%', borderRadius: '0.5rem' }}
        className="flex items-center justify-center text-[10px]"
      >
        {initials}
      </span>
    </span>
  )
}