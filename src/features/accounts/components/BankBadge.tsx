import { useState } from 'react'
import { getBankById } from '../banks'

interface BankBadgeProps {
  bank: string | null
  size?: number // en px — default 24 (uso inline junto al tipo de cuenta)
}

// Muestra el logo real del banco (vía Clearbit, por dominio). Si la imagen
// falla al cargar (dominio no encontrado, servicio caído, banco "Otro"
// con texto libre, etc.), cae de vuelta al badge de iniciales con color.
export function BankBadge({ bank, size = 24 }: BankBadgeProps) {
  const [imageFailed, setImageFailed] = useState(false)

  if (!bank) return null

  const known = getBankById(bank)
  const initials = known ? known.initials : bank.slice(0, 2).toUpperCase()
  const color = known ? known.color : '#A89D8D'
  const label = known ? known.name : bank
  const logoUrl = known?.domain ? `https://logo.clearbit.com/${known.domain}` : null
  const style = { width: size, height: size }

  if (logoUrl && !imageFailed) {
    return (
      <span
        title={label}
        style={style}
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-warm-white ring-1 ring-bone"
      >
        <img
          src={logoUrl}
          alt={label}
          className="h-full w-full object-contain p-0.5"
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
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-warm-white"
    >
      <span
        style={{ backgroundColor: color, width: '100%', height: '100%', borderRadius: '9999px' }}
        className="flex items-center justify-center text-[10px]"
      >
        {initials}
      </span>
    </span>
  )
}