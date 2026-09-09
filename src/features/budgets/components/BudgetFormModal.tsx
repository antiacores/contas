import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Category } from '../../categories/types'
import type { Budget, BudgetInput } from '../types'

interface BudgetFormModalProps {
  budget: Budget | null
  availableCategories: Category[]
  onClose: () => void
  onSubmit: (input: BudgetInput) => Promise<void>
}

export function BudgetFormModal({
  budget,
  availableCategories,
  onClose,
  onSubmit,
}: BudgetFormModalProps) {
  const [categoryId, setCategoryId] = useState(budget?.category_id ?? availableCategories[0]?.id ?? '')
  const [amount, setAmount] = useState(budget ? String(budget.amount) : '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!categoryId) {
      setError('Elige una categoría.')
      return
    }

    const parsedAmount = Number(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('El monto debe ser mayor a cero.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({ category_id: categoryId, amount: parsedAmount })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el presupuesto.')
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="budget-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-modal bg-warm-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="budget-form-title" className="text-lg font-semibold text-charcoal">
            {budget ? 'Editar presupuesto' : 'Nuevo presupuesto'}
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
            <label htmlFor="category" className="text-sm font-medium text-slate">
              Categoría
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={Boolean(budget)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:opacity-60"
            >
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {budget && (
              <p className="text-xs text-stone">La categoría no se puede cambiar una vez creado.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="amount" className="text-sm font-medium text-slate">
              Monto mensual
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

          {error && (
            <p role="alert" className="text-sm text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !categoryId}
            className="mt-2 rounded-button bg-charcoal px-4 py-3 font-medium text-warm-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Guardando…' : budget ? 'Guardar cambios' : 'Crear presupuesto'}
          </button>
        </form>
      </div>
    </div>
  )
}