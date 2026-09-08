import { MOVEMENT_TYPE_LABELS, type MovementFilters } from '../types'
import type { Account } from '../../accounts/types'

interface MovementFiltersBarProps {
  filters: MovementFilters
  accounts: Account[]
  onChange: (filters: MovementFilters) => void
}

export function MovementFiltersBar({ filters, accounts, onChange }: MovementFiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        aria-label="Filtrar por tipo"
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value as MovementFilters['type'] })}
        className="rounded-input border border-bone bg-ivory px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
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
        className="rounded-input border border-bone bg-ivory px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
      >
        <option value="todas">Todas las cuentas</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>

      <input
        aria-label="Desde"
        type="date"
        value={filters.dateFrom ?? ''}
        onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || null })}
        className="rounded-input border border-bone bg-ivory px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
      />
      <input
        aria-label="Hasta"
        type="date"
        value={filters.dateTo ?? ''}
        onChange={(e) => onChange({ ...filters, dateTo: e.target.value || null })}
        className="rounded-input border border-bone bg-ivory px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
      />
    </div>
  )
}