import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { ACCOUNT_TYPE_LABELS, type Account } from '../types'
import { BankBadge } from './BankBadge'
import { formatCurrency } from '../../../lib/format'

interface AccountCardProps {
  account: Account
  onEdit: () => void
  onDelete: () => void
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>
}

export function AccountCard({ account, onEdit, onDelete, dragHandleProps }: AccountCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {dragHandleProps && (
          <button
            {...dragHandleProps}
            aria-label={`Reordenar ${account.name}`}
            className="cursor-grab touch-none rounded-button p-1 text-stone hover:bg-bone active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </button>
        )}

        {account.bank ? (
          <BankBadge bank={account.bank} size={40} />
        ) : (
          <span
            aria-hidden="true"
            className="h-10 w-10 shrink-0 rounded-full"
            style={{ backgroundColor: account.color }}
          />
        )}
        <div className="min-w-0">
          <p className="truncate font-medium text-charcoal">{account.name}</p>
          <span className="text-sm text-taupe">{ACCOUNT_TYPE_LABELS[account.type]}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        {account.type === 'credito' && account.credit_limit ? (
          <div className="text-right">
            <span className="block font-medium text-charcoal">
              {formatCurrency(Math.max(account.credit_limit + account.current_balance, 0), account.currency)}
              <span className="ml-1 text-xs font-normal text-stone">disponible</span>
            </span>
            <span className="text-xs text-stone">
              de {formatCurrency(account.credit_limit, account.currency)}
            </span>
          </div>
        ) : (
          <span className="font-medium text-charcoal">
            {formatCurrency(account.current_balance, account.currency)}
          </span>
        )}
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