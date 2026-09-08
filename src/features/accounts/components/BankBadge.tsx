import { getBankById } from '../banks'

interface BankBadgeProps {
  bank: string | null
}

// Acepta tanto un id conocido del catálogo (ej. "bbva") como texto libre
// de cuentas creadas antes de este catálogo — en ese caso genera iniciales
// a partir del texto, con un color neutro.
export function BankBadge({ bank }: BankBadgeProps) {
  if (!bank) return null

  const known = getBankById(bank)
  const initials = known ? known.initials : bank.slice(0, 2).toUpperCase()
  const color = known ? known.color : '#A89D8D'
  const label = known ? known.name : bank

  return (
    <span
      title={label}
      aria-label={label}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-warm-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  )
}