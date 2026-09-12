import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { ACCOUNT_TYPE_LABELS, type Account, type AccountInput, type AccountType } from '../types'
import { BANKS, getBankById } from '../banks'
import { useSettings } from '../../../lib/settings/useSettings'

interface AccountFormModalProps {
  account: Account | null // null = crear nueva; con valor = editar
  onClose: () => void
  onSubmit: (input: AccountInput) => Promise<void>
}

const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]

const COLOR_OPTIONS = ['#817768', '#A89D8D', '#6F8E72', '#8A9AA5', '#C69B5B', '#A7645C']

export function AccountFormModal({ account, onClose, onSubmit }: AccountFormModalProps) {
  const { settings } = useSettings()
  const [name, setName] = useState(account?.name ?? '')
  const initialBank = account?.bank ?? ''
  const initialKnownBank = getBankById(initialBank)
  const [bankId, setBankId] = useState(initialKnownBank ? initialKnownBank.id : initialBank ? 'otro' : '')
  const [bankCustomName, setBankCustomName] = useState(initialKnownBank ? '' : initialBank)
  const [type, setType] = useState<AccountType>(account?.type ?? 'debito')
  const [color, setColor] = useState(account?.color ?? COLOR_OPTIONS[0])
  const [balance, setBalance] = useState(String(account?.initial_balance ?? 0))
  // Para crédito, mostramos la deuda como número positivo ("cuánto debo"),
  // aunque por dentro se guarda como initial_balance negativo.
  const [currentDebt, setCurrentDebt] = useState(
    account && account.type === 'credito' ? String(Math.abs(account.initial_balance)) : '0',
  )
  const [creditLimit, setCreditLimit] = useState(
    account?.credit_limit != null ? String(account.credit_limit) : '',
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCredit = type === 'credito'

  // Cierra el modal con Escape, por accesibilidad de teclado (DESIGN_SYSTEM.md lo exige).
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }

    let parsedInitialBalance: number
    let parsedCreditLimit: number | null = null

    if (isCredit) {
      const parsedDebt = Number(currentDebt)
      if (Number.isNaN(parsedDebt) || parsedDebt < 0) {
        setError('La deuda actual debe ser un número mayor o igual a cero.')
        return
      }
      if (creditLimit.trim() !== '') {
        parsedCreditLimit = Number(creditLimit)
        if (Number.isNaN(parsedCreditLimit) || parsedCreditLimit <= 0) {
          setError('El límite de crédito debe ser un número mayor a cero.')
          return
        }
        if (parsedDebt > parsedCreditLimit) {
          setError('La deuda actual no puede ser mayor al límite de crédito.')
          return
        }
      }
      parsedInitialBalance = -parsedDebt // la deuda resta del saldo
    } else {
      parsedInitialBalance = Number(balance)
      if (Number.isNaN(parsedInitialBalance)) {
        setError('El saldo debe ser un número válido.')
        return
      }
    }

    setLoading(true)
    try {
      await onSubmit({
        name: name.trim(),
        bank: bankId === '' ? null : bankId === 'otro' ? bankCustomName.trim() || null : bankId,
        type,
        color,
        initial_balance: parsedInitialBalance,
        credit_limit: isCredit ? parsedCreditLimit : null,
        currency: account?.currency ?? settings.currency,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la cuenta.')
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-form-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-md rounded-modal bg-warm-white p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="account-form-title" className="text-lg font-semibold text-charcoal">
            {account ? 'Editar cuenta' : 'Nueva cuenta'}
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
              Nombre
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Cuenta principal"
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bank" className="text-sm font-medium text-slate">
              Banco (opcional)
            </label>
            <select
              id="bank"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
            >
              <option value="">Sin banco</option>
              {BANKS.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          {bankId === 'otro' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bank-custom" className="text-sm font-medium text-slate">
                Nombre del banco
              </label>
              <input
                id="bank-custom"
                value={bankCustomName}
                onChange={(e) => setBankCustomName(e.target.value)}
                placeholder="Ej. Banco Regional"
                className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="type" className="text-sm font-medium text-slate">
              Tipo
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as AccountType)}
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
            >
              {ACCOUNT_TYPES.map((accountType) => (
                <option key={accountType} value={accountType}>
                  {ACCOUNT_TYPE_LABELS[accountType]}
                </option>
              ))}
            </select>
          </div>

          {isCredit ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="credit-limit" className="text-sm font-medium text-slate">
                  Límite de crédito (opcional)
                </label>
                <input
                  id="credit-limit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  placeholder="Ej. 30000"
                  className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
                />
                <p className="text-xs text-stone">
                  Si lo dejas vacío, no podremos calcular cuánto tienes disponible.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="current-debt" className="text-sm font-medium text-slate">
                  Deuda actual
                </label>
                <input
                  id="current-debt"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentDebt}
                  onChange={(e) => setCurrentDebt(e.target.value)}
                  className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
                  required
                />
                {account && (
                  <p className="text-xs text-stone">
                    Lo que ves en la lista de cuentas ya incluye tus movimientos — esto solo ajusta el
                    punto de partida.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="balance" className="text-sm font-medium text-slate">
                Saldo inicial
              </label>
              <input
                id="balance"
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-slate/40"
                required
              />
              {account && (
                <p className="text-xs text-stone">
                  El saldo que ves en la lista de cuentas ya incluye tus movimientos — esto solo ajusta el
                  punto de partida.
                </p>
              )}
            </div>
          )}

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
            {loading ? 'Guardando…' : account ? 'Guardar cambios' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}