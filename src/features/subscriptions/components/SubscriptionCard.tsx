import { CheckCircle2, Pause, Pencil, Play, Trash2 } from 'lucide-react'
import { FREQUENCY_LABELS, type Subscription } from '../types'
import { daysUntil } from '../dateUtils'
import { useSettings } from '../../../lib/settings/useSettings'
import { formatCurrency } from '../../../lib/format'
import { SubscriptionLogo } from './SubscriptionLogo'

interface SubscriptionCardProps {
  subscription: Subscription
  onMarkPaid: () => void
  onToggleActive: () => void
  onEdit: () => void
  onDelete: () => void
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' })

export function SubscriptionCard({
  subscription,
  onMarkPaid,
  onToggleActive,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  const { settings } = useSettings()
  const days = daysUntil(subscription.next_payment_date)
  const isOverdue = days < 0
  const isSoon = days >= 0 && days <= 3

  return (
    <div className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SubscriptionLogo name={subscription.name} fallbackColor={subscription.color} size={36} />
          <div className="flex items-center gap-2">
            <span className="font-medium text-charcoal">{subscription.name}</span>
            {!subscription.active && (
              <span className="rounded-button bg-bone px-2 py-0.5 text-xs text-taupe">Pausada</span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            aria-label={`Editar ${subscription.name}`}
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onToggleActive}
            aria-label={subscription.active ? 'Pausar' : 'Reactivar'}
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            {subscription.active ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={onDelete}
            aria-label={`Eliminar ${subscription.name}`}
            className="rounded-button p-2 text-taupe hover:bg-bone hover:text-error focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-charcoal">
          {formatCurrency(subscription.amount, settings.currency)} ·{' '}
          {FREQUENCY_LABELS[subscription.frequency]}
        </span>
        <span className="text-stone">
          {subscription.account_name}
          {subscription.category_name ? ` · ${subscription.category_name}` : ''}
        </span>
      </div>

      {subscription.active && (
        <div className="flex items-center justify-between">
          <span className={isOverdue ? 'text-sm font-medium text-error' : isSoon ? 'text-sm font-medium text-warning' : 'text-sm text-stone'}>
            {isOverdue
              ? `Venció el ${dateFormatter.format(new Date(`${subscription.next_payment_date}T00:00:00`))}`
              : days === 0
                ? 'Próximo pago: hoy'
                : `Próximo pago en ${days} días (${dateFormatter.format(new Date(`${subscription.next_payment_date}T00:00:00`))})`}
          </span>
          <button
            onClick={onMarkPaid}
            className="flex items-center gap-1.5 rounded-button bg-charcoal px-3 py-1.5 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <CheckCircle2 size={14} />
            Marcar como pagado
          </button>
        </div>
      )}
    </div>
  )
}