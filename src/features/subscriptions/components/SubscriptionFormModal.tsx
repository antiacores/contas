import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Account } from '../../accounts/types'
import type { Category } from '../../categories/types'
import { FREQUENCY_LABELS, type Subscription, type SubscriptionFrequency, type SubscriptionInput } from '../types'
import { SUBSCRIPTION_SERVICES, findServiceByName } from '../services'

interface SubscriptionFormModalProps {
  subscription: Subscription | null
  accounts: Account[]
  categories: Category[]
  onClose: () => void
  onSubmit: (input: SubscriptionInput) => Promise<void>
}

const FREQUENCIES = Object.keys(FREQUENCY_LABELS) as SubscriptionFrequency[]

const COLOR_OPTIONS = ['#8A9AA5', '#6F8E72', '#A7645C', '#C69B5B', '#817768', '#A89D8D']

export function SubscriptionFormModal({
  subscription,
  accounts,
  categories,
  onClose,
  onSubmit,
}: SubscriptionFormModalProps) {
  const initialService = subscription ? findServiceByName(subscription.name) : undefined
  const [serviceKey, setServiceKey] = useState(initialService ? initialService.name : 'otro')
  const [customName, setCustomName] = useState(initialService ? '' : subscription?.name ?? '')
  const [amount, setAmount] = useState(subscription ? String(subscription.amount) : '')
  const [frequency, setFrequency] = useState<SubscriptionFrequency>(subscription?.frequency ?? 'mensual')
  const [nextPaymentDate, setNextPaymentDate] = useState(
    subscription?.next_payment_date ?? new Date().toISOString().slice(0, 10),
  )
  const [accountId, setAccountId] = useState(subscription?.account_id ?? accounts[0]?.id ?? '')
  const [categoryId, setCategoryId] = useState(subscription?.category_id ?? '')
  const [color, setColor] = useState(subscription?.color ?? COLOR_OPTIONS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const gastoCategories = categories.filter((c) => c.type === 'gasto')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const finalName = serviceKey === 'otro' ? customName.trim() : serviceKey
    if (!finalName) {
      setError('El nombre del servicio es obligatorio.')
      return
    }
    const parsedAmount = Number(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('El monto debe ser mayor a cero.')
      return
    }
    if (!accountId) {
      setError('Elige una cuenta.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name: finalName,
        amount: parsedAmount,
        frequency,
        next_payment_date: nextPaymentDate,
        account_id: accountId,
        category_id: categoryId || null,
        color,
        active: subscription?.active ?? true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la suscripción.')
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-form-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-md rounded-modal bg-warm-white p-6 max-h-[85vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="subscription-form-title" className="text-lg font-semibold text-charcoal">
            {subscription ? 'Editar suscripción' : 'Nueva suscripción'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-button p-1 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="service" className="text-sm font-medium text-slate">
              Servicio
            </label>
            <select
              id="service"
              value={serviceKey}
              onChange={(e) => setServiceKey(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
            >
              <option value="otro">Otro</option>
              {SUBSCRIPTION_SERVICES.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {serviceKey === 'otro' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="custom-name" className="text-sm font-medium text-slate">
                Nombre del servicio
              </label>
              <input
                id="custom-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ej. Gimnasio local"
                className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="amount" className="text-sm font-medium text-slate">
              Monto
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="frequency" className="text-sm font-medium text-slate">
              Frecuencia
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
            >
              {FREQUENCIES.map((freq) => (
                <option key={freq} value={freq}>
                  {FREQUENCY_LABELS[freq]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="next-payment" className="text-sm font-medium text-slate">
              Próximo pago
            </label>
            <input
              id="next-payment"
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="account" className="text-sm font-medium text-slate">
              Cuenta
            </label>
            <select
              id="account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium text-slate">
              Categoría (opcional)
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
            >
              <option value="">Sin categoría</option>
              {gastoCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-slate">Color</legend>
            <p className="text-xs text-stone">Se usa solo si el servicio no tiene un logo disponible.</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={`Color ${option}`}
                  aria-pressed={color === option}
                  onClick={() => setColor(option)}
                  className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-slate/40 ${
                    color === option ? 'ring-2 ring-charcoal ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: option }}
                />
              ))}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="text-sm text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-button bg-charcoal px-4 py-3 font-medium text-warm-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Guardando…' : subscription ? 'Guardar cambios' : 'Crear suscripción'}
          </button>
        </form>
      </div>
    </div>
  )
}