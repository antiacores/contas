import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Account } from '../../accounts/types'
import type { Category } from '../../categories/types'
import { MOVEMENT_TYPE_LABELS, type Movement, type MovementInput, type MovementType } from '../types'

interface MovementFormModalProps {
  movement: Movement | null
  accounts: Account[]
  categories: Category[]
  onClose: () => void
  onSubmit: (input: MovementInput) => Promise<void>
}

const MOVEMENT_TYPES = Object.keys(MOVEMENT_TYPE_LABELS) as MovementType[]

export function MovementFormModal({
  movement,
  accounts,
  categories,
  onClose,
  onSubmit,
}: MovementFormModalProps) {
  const [type, setType] = useState<MovementType>(movement?.type ?? 'gasto')
  const [accountId, setAccountId] = useState(movement?.account_id ?? accounts[0]?.id ?? '')
  const [transferAccountId, setTransferAccountId] = useState(movement?.transfer_account_id ?? '')
  const [categoryId, setCategoryId] = useState(movement?.category_id ?? '')
  const [description, setDescription] = useState(movement?.description ?? '')
  const [amount, setAmount] = useState(movement ? String(Math.abs(movement.amount)) : '')
  const [date, setDate] = useState(movement?.date ?? new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const needsCategory = type === 'ingreso' || type === 'gasto'
  const needsTransferAccount = type === 'transferencia'
  const availableCategories = categories.filter((c) => c.type === type)
  const availableTransferAccounts = accounts.filter((a) => a.id !== accountId)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!accountId) {
      setError('Elige una cuenta.')
      return
    }
    if (needsTransferAccount && !transferAccountId) {
      setError('Elige la cuenta destino.')
      return
    }

    const parsedAmount = Number(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount === 0) {
      setError('El monto debe ser un número distinto de cero.')
      return
    }
    if (type !== 'ajuste' && parsedAmount < 0) {
      setError('El monto debe ser positivo para este tipo de movimiento.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        account_id: accountId,
        transfer_account_id: needsTransferAccount ? transferAccountId : null,
        category_id: needsCategory && categoryId ? categoryId : null,
        type,
        description: description.trim() || null,
        amount: parsedAmount,
        date,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el movimiento.')
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="movement-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-charcoal/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-modal bg-warm-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="movement-form-title" className="text-lg font-semibold text-charcoal">
            {movement ? 'Editar movimiento' : 'Nuevo movimiento'}
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
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-slate">Tipo</legend>
            <div className="grid grid-cols-2 gap-2">
              {MOVEMENT_TYPES.map((movementType) => (
                <button
                  key={movementType}
                  type="button"
                  onClick={() => setType(movementType)}
                  aria-pressed={type === movementType}
                  className={`rounded-button border px-3 py-2 text-sm font-medium ${
                    type === movementType
                      ? 'border-charcoal bg-charcoal text-warm-white'
                      : 'border-bone bg-ivory text-charcoal hover:bg-bone'
                  }`}
                >
                  {MOVEMENT_TYPE_LABELS[movementType]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="account" className="text-sm font-medium text-slate">
              {needsTransferAccount ? 'Cuenta origen' : 'Cuenta'}
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

          {needsTransferAccount && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="transfer-account" className="text-sm font-medium text-slate">
                Cuenta destino
              </label>
              <select
                id="transfer-account"
                value={transferAccountId}
                onChange={(e) => setTransferAccountId(e.target.value)}
                className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
              >
                <option value="">Elige una cuenta</option>
                {availableTransferAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {needsCategory && (
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
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-slate">
              Descripción (opcional)
            </label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Compra en Costco"
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="amount" className="text-sm font-medium text-slate">
              Monto
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
            {type === 'ajuste' && (
              <p className="text-xs text-stone">Usa un número negativo para restar saldo.</p>
            )}
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
            {loading ? 'Guardando…' : movement ? 'Guardar cambios' : 'Crear movimiento'}
          </button>
        </form>
      </div>
    </div>
  )
}