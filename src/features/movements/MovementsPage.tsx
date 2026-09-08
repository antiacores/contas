import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMovements } from './useMovements'
import { createMovement, deleteMovement, updateMovement } from './api/movements'
import { useAccounts } from '../accounts/useAccounts'
import { useCategories } from '../categories/useCategories'
import { MovementRow } from './components/MovementRow'
import { MovementFormModal } from './components/MovementFormModal'
import { MovementFiltersBar } from './components/MovementFiltersBar'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import type { Movement, MovementInput } from './types'

export function MovementsPage() {
  const { movements, filters, setFilters, loading, error, refresh } = useMovements()
  const { accounts } = useAccounts()
  const { categories } = useCategories()
  const [editingMovement, setEditingMovement] = useState<Movement | null | undefined>(undefined)
  const [deletingMovement, setDeletingMovement] = useState<Movement | null>(null)

  async function handleSubmit(input: MovementInput) {
    if (editingMovement) {
      await updateMovement(editingMovement.id, input)
    } else {
      await createMovement(input)
    }
    setEditingMovement(undefined)
    await refresh()
  }

  async function handleConfirmDelete() {
    if (!deletingMovement) return
    await deleteMovement(deletingMovement.id)
    setDeletingMovement(null)
    await refresh()
  }

  const noAccounts = accounts.length === 0

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Volver al dashboard"
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold text-charcoal">Movimientos</h1>
        </div>

        <button
          onClick={() => setEditingMovement(null)}
          disabled={noAccounts}
          className="flex items-center gap-2 rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} />
          Nuevo movimiento
        </button>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-12 sm:px-10">
        {noAccounts && !loading && (
          <p className="rounded-card border border-bone bg-ivory p-4 text-center text-sm text-stone">
            Necesitas al menos una cuenta antes de registrar movimientos.{' '}
            <Link to="/cuentas" className="font-medium text-charcoal underline">
              Crear cuenta
            </Link>
          </p>
        )}

        {!noAccounts && <MovementFiltersBar filters={filters} accounts={accounts} onChange={setFilters} />}

        {loading && <p className="py-10 text-center text-sm text-stone">Cargando…</p>}

        {error && (
          <p role="alert" className="text-center text-sm text-error">
            {error}
          </p>
        )}

        {!loading && !error && movements.length === 0 && !noAccounts && (
          <p className="py-16 text-center text-sm text-stone">No hay movimientos.</p>
        )}

        <div className="flex flex-col gap-2">
          {movements.map((movement) => (
            <MovementRow
              key={movement.id}
              movement={movement}
              onEdit={() => setEditingMovement(movement)}
              onDelete={() => setDeletingMovement(movement)}
            />
          ))}
        </div>
      </main>

      {editingMovement !== undefined && (
        <MovementFormModal
          movement={editingMovement}
          accounts={accounts}
          categories={categories}
          onClose={() => setEditingMovement(undefined)}
          onSubmit={handleSubmit}
        />
      )}

      {deletingMovement && (
        <ConfirmDialog
          title="Eliminar movimiento"
          message="¿Seguro que quieres eliminar este movimiento? Esta acción no se puede deshacer."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingMovement(null)}
        />
      )}
    </div>
  )
}