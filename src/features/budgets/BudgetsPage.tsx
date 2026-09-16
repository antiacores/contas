import { useState } from 'react'
import { Plus, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBudgets } from './useBudgets'
import { createBudget, deleteBudget, updateBudget } from './api/budgets'
import { useCategories } from '../categories/useCategories'
import { BudgetProgressCard } from './components/BudgetProgressCard'
import { BudgetFormModal } from './components/BudgetFormModal'
import { PeriodSelector } from './components/PeriodSelector'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { PageHeader } from '../../components/PageHeader'
import { currentPeriod, type Budget, type BudgetInput, type BudgetPeriod, type BudgetWithProgress } from './types'

export function BudgetsPage() {
  const [period, setPeriod] = useState<BudgetPeriod>(currentPeriod())
  const { budgets, loading, error, refresh } = useBudgets(period)
  const { categories } = useCategories()
  const [editingBudget, setEditingBudget] = useState<Budget | null | undefined>(undefined)
  const [deletingBudget, setDeletingBudget] = useState<BudgetWithProgress | null>(null)

  const gastoCategories = categories.filter((c) => c.type === 'gasto')
  const budgetedCategoryIds = new Set(budgets.map((b) => b.category_id))

  const availableCategories = editingBudget
    ? gastoCategories.filter((c) => c.id === editingBudget.category_id)
    : gastoCategories.filter((c) => !budgetedCategoryIds.has(c.id))

  async function handleSubmit(input: BudgetInput) {
    if (editingBudget) {
      await updateBudget(editingBudget.id, input)
    } else {
      await createBudget(input)
    }
    setEditingBudget(undefined)
    await refresh()
  }

  async function handleConfirmDelete() {
    if (!deletingBudget) return
    await deleteBudget(deletingBudget.id)
    setDeletingBudget(null)
    await refresh()
  }

  const noGastoCategories = gastoCategories.length === 0
  const noAvailableCategories = !editingBudget && availableCategories.length === 0

  return (
    <div>
      <PageHeader
        title="Presupuestos"
        action={
          <div className="flex gap-2">
            <Link
              to="/categorias"
              className="flex items-center gap-2 rounded-button border border-bone bg-ivory px-4 py-2 text-sm font-medium text-charcoal hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
            >
              <Tag size={16} />
              Editar categorías
            </Link>
            <button
              onClick={() => setEditingBudget(null)}
              disabled={noGastoCategories || noAvailableCategories}
              className="flex items-center gap-2 rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              Nuevo presupuesto
            </button>
          </div>
        }
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 pb-12 sm:px-6 lg:px-10">
        {noGastoCategories && !loading && (
          <p className="rounded-card border border-bone bg-ivory p-4 text-center text-sm text-stone">
            Necesitas categorías de gasto antes de crear presupuestos.{' '}
            <Link to="/categorias" className="font-medium text-charcoal underline">
              Ir a Categorías
            </Link>
          </p>
        )}

        {!noGastoCategories && <PeriodSelector period={period} onChange={setPeriod} />}

        {loading && <p className="py-10 text-center text-sm text-stone">Cargando…</p>}

        {error && (
          <p role="alert" className="text-center text-sm text-error">
            {error}
          </p>
        )}

        {!loading && !error && budgets.length === 0 && !noGastoCategories && (
          <div className="flex flex-col items-center gap-4 rounded-card border border-bone bg-ivory py-16">
            <p className="text-stone">No tienes presupuestos todavía.</p>
            <button
              onClick={() => setEditingBudget(null)}
              className="rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90"
            >
              Crear tu primer presupuesto
            </button>
          </div>
        )}

        {budgets.map((budget) => (
          <BudgetProgressCard
            key={budget.id}
            budget={budget}
            isAnnual={period.month === null}
            onEdit={() => setEditingBudget(budget)}
            onDelete={() => setDeletingBudget(budget)}
          />
        ))}
      </div>

      {editingBudget !== undefined && (
        <BudgetFormModal
          budget={editingBudget}
          availableCategories={availableCategories}
          onClose={() => setEditingBudget(undefined)}
          onSubmit={handleSubmit}
        />
      )}

      {deletingBudget && (
        <ConfirmDialog
          title="Eliminar presupuesto"
          message={`¿Seguro que quieres eliminar el presupuesto de "${deletingBudget.category_name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingBudget(null)}
        />
      )}
    </div>
  )
}