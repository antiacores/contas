import { MOVEMENT_TYPE_LABELS, type MovementFilters } from '../types'
import type { Account } from '../../accounts/types'

interface MovementFiltersBarProps {
  filters: MovementFilters
  accounts: Account[]
  onChange: (filters: MovementFilters) => void
}

const inputClass =
  'w-full rounded-input border border-bone bg-ivory px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40'

export function MovementFiltersBar({ filters, accounts, onChange }: MovementFiltersBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <select
        aria-label="Filtrar por tipo"
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value as MovementFilters['type'] })}
        className={inputClass}
      >
        <option value="todos">Todos los tipos</option>
        {Object.entries(MOVEMENT_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por cuenta"
        value={filters.accountId}
        onChange={(e) => onChange({ ...filters, accountId: e.target.value })}
        className={inputClass}
      >
        <option value="todas">Todas las cuentas</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>

      {/* Las dos fechas siempre van juntas, en su propia fila. El "look" de
          pastilla vive en el <div> contenedor, no en el <input> directamente —
          en iOS Safari, los inputs de fecha nativos ignoran parte del borde/radio
          personalizado, así que envolverlos evita que se vean pegados sin separación. */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-input border border-bone bg-ivory px-3 py-2">
          <input
            aria-label="Desde"
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || null })}
            className="w-full bg-transparent text-sm text-charcoal focus:outline-none"
          />
        </div>
        <div className="rounded-input border border-bone bg-ivory px-3 py-2">
          <input
            aria-label="Hasta"
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value || null })}
            className="w-full bg-transparent text-sm text-charcoal focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}