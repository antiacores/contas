import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Debt } from '../types'
import { useSettings } from '../../../lib/settings/useSettings'
import { formatCurrency } from '../../../lib/format'

interface PaymentFormModalProps {
  debt: Debt
  onClose: () => void
  onSubmit: (amount: number, date: string) => Promise<void>
}

export function PaymentFormModal({ debt, onClose, onSubmit }: PaymentFormModalProps) {
  const { settings } = useSettings()
  const [amount, setAmount] = useState(String(Math.min(debt.monthly_payment, debt.remaining_balance)))
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const parsedAmount = Number(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('El monto debe ser mayor a cero.')
      return
    }

    setLoading(true)
    try {
      await onSubmit(parsedAmount, date)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el pago.')
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-form-title"
      className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center overflow-y-auto bg-charcoal/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-md animate-scale-in rounded-modal bg-warm-white p-6 max-h-[85vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="payment-form-title" className="text-lg font-semibold text-charcoal">
            Registrar pago — {debt.name}
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
            <p className="text-xs text-stone">
              Saldo restante actual: {formatCurrency(debt.remaining_balance, settings.currency)}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className="text-sm font-medium text-slate">
              Fecha
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

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
            {loading ? 'Guardando…' : 'Registrar pago'}
          </button>
        </form>
      </div>
    </div>
  )
}