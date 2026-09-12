import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Goal, GoalInput } from '../types'

interface GoalFormModalProps {
  goal: Goal | null
  onClose: () => void
  onSubmit: (input: GoalInput) => Promise<void>
}

const COLOR_OPTIONS = ['#6F8E72', '#8A9AA5', '#C69B5B', '#A7645C', '#817768', '#A89D8D']

export function GoalFormModal({ goal, onClose, onSubmit }: GoalFormModalProps) {
  const [name, setName] = useState(goal?.name ?? '')
  const [targetAmount, setTargetAmount] = useState(goal ? String(goal.target_amount) : '')
  const [targetDate, setTargetDate] = useState(goal?.target_date ?? '')
  const [color, setColor] = useState(goal?.color ?? COLOR_OPTIONS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }

    const parsedAmount = Number(targetAmount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('La cantidad objetivo debe ser mayor a cero.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name: name.trim(),
        target_amount: parsedAmount,
        target_date: targetDate || null,
        color,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el ahorro.')
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-form-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-md rounded-modal bg-warm-white p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="goal-form-title" className="text-lg font-semibold text-charcoal">
            {goal ? 'Editar ahorro' : 'Nuevo ahorro'}
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
              Objetivo
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Fondo de emergencia"
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="target-amount" className="text-sm font-medium text-slate">
              Cantidad objetivo
            </label>
            <input
              id="target-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="target-date" className="text-sm font-medium text-slate">
              Fecha límite (opcional)
            </label>
            <input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
            />
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
            {loading ? 'Guardando…' : goal ? 'Guardar cambios' : 'Crear ahorro'}
          </button>
        </form>
      </div>
    </div>
  )
}