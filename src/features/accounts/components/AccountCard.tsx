import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { ACCOUNT_TYPE_LABELS, type Account } from '../types'
import { BankBadge } from './BankBadge'

interface AccountCardProps {
  account: Account
  onEdit: () => void
  onDelete: () => void
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
})

export function AccountCard({ account, onEdit, onDelete, dragHandleProps }: AccountCardProps) {
  return (
    <div className="flex items-center justify-between rounded-card border border-bone bg-ivory p-5">
      <div className="flex items-center gap-3">
        {dragHandleProps && (
          <button
            {...dragHandleProps}
            aria-label={`Reordenar ${account.name}`}
            className="cursor-grab touch-none rounded-button p-1 text-stone hover:bg-bone active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </button>
        )}

        <span
          aria-hidden="true"
          className="h-10 w-10 shrink-0 rounded-full"
          style={{ backgroundColor: account.color }}
        />
        <div>
          <p className="font-medium text-charcoal">{account.name}</p>
          <div className="flex items-center gap-1.5 text-sm text-taupe">
            <span>{ACCOUNT_TYPE_LABELS[account.type]}</span>
            {account.bank && (
              <>
                <span>·</span>
                <BankBadge bank={account.bank} />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-medium text-charcoal">{formatter.format(account.current_balance)}</span>
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