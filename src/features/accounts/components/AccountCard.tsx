import { Pencil, Trash2 } from 'lucide-react'
import { ACCOUNT_TYPE_LABELS, type Account } from '../types'

interface AccountCardProps {
  account: Account
  onEdit: () => void
  onDelete: () => void
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
})

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  return (
    <div className="flex items-center justify-between rounded-card border border-bone bg-ivory p-5">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="h-10 w-10 shrink-0 rounded-full"
          style={{ backgroundColor: account.color }}
        />
        <div>
          <p className="font-medium text-charcoal">{account.name}</p>
          <p className="text-sm text-taupe">
            {ACCOUNT_TYPE_LABELS[account.type]}
            {account.bank ? ` · ${account.bank}` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-medium text-charcoal">{formatter.format(account.balance)}</span>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            aria-label={`Editar ${account.name}`}
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            aria-label={`Eliminar ${account.name}`}
            className="rounded-button p-2 text-taupe hover:bg-bone hover:text-error focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}