import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDebts } from './useDebts'
import { createDebt, deleteDebt, registerDebtPayment, toggleDebtActive, updateDebt } from './api/debts'
import { useAccounts } from '../accounts/useAccounts'
import { DebtCard } from './components/DebtCard'
import { DebtFormModal } from './components/DebtFormModal'
import { PaymentFormModal } from './components/PaymentFormModal'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { PageHeader } from '../../components/PageHeader'
import type { Debt, DebtInput } from './types'

export function DebtsPage() {
  const { debts, loading, error, refresh } = useDebts()
  const { accounts } = useAccounts()
  const [editingDebt, setEditingDebt] = useState<Debt | null | undefined>(undefined)
  const [payingDebt, setPayingDebt] = useState<Debt | null>(null)
  const [deletingDebt, setDeletingDebt] = useState<Debt | null>(null)

  const noAccounts = accounts.length === 0
  const active = debts.filter((d) => d.active && d.remaining_balance > 0)
  const finished = debts.filter((d) => !d.active || d.remaining_balance <= 0)

  async function handleSubmit(input: DebtInput) {
    if (editingDebt) {
      await updateDebt(editingDebt.id, input)
    } else {
      await createDebt(input)
    }
    setEditingDebt(undefined)
    await refresh()
  }

  async function handleRegisterPayment(amount: number, date: string) {
    if (!payingDebt) return
    await registerDebtPayment(payingDebt, amount, date)
    setPayingDebt(null)
    await refresh()
  }

  async function handleToggleActive(debt: Debt) {
    await toggleDebtActive(debt)
    await refresh()
  }

  async function handleConfirmDelete() {
    if (!deletingDebt) return
    await deleteDebt(deletingDebt.id)
    setDeletingDebt(null)
    await refresh()
  }

  return (
    <div>
      <PageHeader
        title="Deudas"
        action={
          <button
            onClick={() => setEditingDebt(null)}
            disabled={noAccounts}
            className="flex items-center gap-2 rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            Nueva deuda
          </button>
        }
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-12 sm:px-6 lg:px-10">
        {noAccounts && !loading && (
          <p className="rounded-card border border-bone bg-ivory p-4 text-center text-sm text-stone">
            Necesitas al menos una cuenta antes de registrar deudas.{' '}
            <Link to="/cuentas" className="font-medium text-charcoal underline">
              Crear cuenta
            </Link>
          </p>
        )}

        {loading && <p className="py-10 text-center text-sm text-stone">Cargando…</p>}

        {error && (
          <p role="alert" className="text-center text-sm text-error">
            {error}
          </p>
        )}

        {!loading && !error && debts.length === 0 && !noAccounts && (
          <div className="flex flex-col items-center gap-4 rounded-card border border-bone bg-ivory py-16">
            <p className="text-stone">No tienes deudas registradas.</p>
            <button
              onClick={() => setEditingDebt(null)}
              className="rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90"
            >
              Crear tu primera deuda
            </button>
          </div>
        )}

        {active.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-taupe">Activas</h2>
            {active.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onRegisterPayment={() => setPayingDebt(debt)}
                onToggleActive={() => handleToggleActive(debt)}
                onEdit={() => setEditingDebt(debt)}
                onDelete={() => setDeletingDebt(debt)}
              />
            ))}
          </section>
        )}

        {finished.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-taupe">Liquidadas / archivadas</h2>
            {finished.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onRegisterPayment={() => setPayingDebt(debt)}
                onToggleActive={() => handleToggleActive(debt)}
                onEdit={() => setEditingDebt(debt)}
                onDelete={() => setDeletingDebt(debt)}
              />
            ))}
          </section>
        )}
      </div>

      {editingDebt !== undefined && (
        <DebtFormModal
          debt={editingDebt}
          accounts={accounts}
          onClose={() => setEditingDebt(undefined)}
          onSubmit={handleSubmit}
        />
      )}

      {payingDebt && (
        <PaymentFormModal
          debt={payingDebt}
          onClose={() => setPayingDebt(null)}
          onSubmit={handleRegisterPayment}
        />
      )}

      {deletingDebt && (
        <ConfirmDialog
          title="Eliminar deuda"
          message={`¿Seguro que quieres eliminar "${deletingDebt.name}"? Los movimientos ya registrados no se borran.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingDebt(null)}
        />
      )}
    </div>
  )
}