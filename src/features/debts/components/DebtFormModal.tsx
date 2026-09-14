import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Account } from '../../accounts/types'
import type { Debt, DebtInput } from '../types'

interface DebtFormModalProps {
  debt: Debt | null
  accounts: Account[]
  onClose: () => void
  onSubmit: (input: DebtInput) => Promise<void>
}

const COLOR_OPTIONS = ['#A7645C', '#C69B5B', '#8A9AA5', '#6F8E72', '#817768', '#A89D8D']

export function DebtFormModal({ debt, accounts, onClose, onSubmit }: DebtFormModalProps) {
  const [name, setName] = useState(debt?.name ?? '')
  const [totalAmount, setTotalAmount] = useState(debt ? String(debt.total_amount) : '')
  const [interestRate, setInterestRate] = useState(debt?.interest_rate != null ? String(debt.interest_rate) : '')
  const [monthlyPayment, setMonthlyPayment] = useState(debt ? String(debt.monthly_payment) : '')
  const [nextDueDate, setNextDueDate] = useState(debt?.next_due_date ?? new Date().toISOString().slice(0, 10))
  const [accountId, setAccountId] = useState(debt?.account_id ?? accounts[0]?.id ?? '')
  const [color, setColor] = useState(debt?.color ?? COLOR_OPTIONS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('El nombre/acreedor es obligatorio.')
      return
    }
    const parsedTotal = Number(totalAmount)
    if (Number.isNaN(parsedTotal) || parsedTotal <= 0) {
      setError('El monto total debe ser mayor a cero.')
      return
    }
    const parsedMonthly = Number(monthlyPayment)
    if (Number.isNaN(parsedMonthly) || parsedMonthly <= 0) {
      setError('El pago mensual debe ser mayor a cero.')
      return
    }
    let parsedInterest: number | null = null
    if (interestRate.trim() !== '') {
      parsedInterest = Number(interestRate)
      if (Number.isNaN(parsedInterest) || parsedInterest < 0) {
        setError('La tasa de interés debe ser un número válido.')
        return
      }
    }
    if (!accountId) {
      setError('Elige una cuenta.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name: name.trim(),
        total_amount: parsedTotal,
        interest_rate: parsedInterest,
        monthly_payment: parsedMonthly,
        next_due_date: nextDueDate,
        account_id: accountId,
        color,
        active: debt?.active ?? true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la deuda.')
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="debt-form-title"
      className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center overflow-y-auto bg-charcoal/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-md animate-scale-in rounded-modal bg-warm-white p-6 max-h-[85vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="debt-form-title" className="text-lg font-semibold text-charcoal">
            {debt ? 'Editar deuda' : 'Nueva deuda'}
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
            <label htmlFor="name" className="text-sm font-medium text-slate">
              Acreedor / descripción
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. iPhone a 12 MSI, Préstamo de mamá"
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="total-amount" className="text-sm font-medium text-slate">
              Monto total
            </label>
            <input
              id="total-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              disabled={!!debt}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:opacity-60"
              required
            />
            {debt && (
              <p className="text-xs text-stone">
                El monto total no se puede editar una vez creada — el saldo restante ya refleja tus pagos.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="interest-rate" className="text-sm font-medium text-slate">
              Tasa de interés anual % (opcional)
            </label>
            <input
              id="interest-rate"
              type="number"
              step="0.01"
              min="0"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Déjalo vacío si es a meses sin intereses"
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="monthly-payment" className="text-sm font-medium text-slate">
              Pago mensual
            </label>
            <input
              id="monthly-payment"
              type="number"
              step="0.01"
              min="0.01"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="next-due" className="text-sm font-medium text-slate">
              Próximo pago
            </label>
            <input
              id="next-due"
              type="date"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="account" className="text-sm font-medium text-slate">
              ¿De qué cuenta pagas?
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

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-slate">Color</legend>
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
            {loading ? 'Guardando…' : debt ? 'Guardar cambios' : 'Crear deuda'}
          </button>
        </form>
      </div>
    </div>
  )
}