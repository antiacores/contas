import { useState } from 'react'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGoals } from './useGoals'
import { useGoalContributions } from './useGoalContributions'
import { updateGoal, deleteGoal } from './api/goals'
import { createContribution, deleteContribution } from './api/contributions'
import { GoalFormModal } from './components/GoalFormModal'
import { ContributionFormModal } from './components/ContributionFormModal'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import type { GoalContribution, GoalInput } from './types'

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

export function GoalDetailPage() {
  const { goalId } = useParams<{ goalId: string }>()
  const navigate = useNavigate()
  const { goals, refresh: refreshGoals } = useGoals()
  const { contributions, loading, error, refresh: refreshContributions } = useGoalContributions(
    goalId ?? '',
  )

  const [showEditGoal, setShowEditGoal] = useState(false)
  const [showAddContribution, setShowAddContribution] = useState(false)
  const [deletingContribution, setDeletingContribution] = useState<GoalContribution | null>(null)
  const [deletingGoal, setDeletingGoal] = useState(false)

  const goal = goals.find((g) => g.id === goalId)

  if (!goal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-white">
        <p className="text-sm text-stone">Cargando meta…</p>
      </div>
    )
  }

  const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
  const reached = goal.current_amount >= goal.target_amount

  async function handleEditGoal(input: GoalInput) {
    await updateGoal(goal!.id, input)
    setShowEditGoal(false)
    await refreshGoals()
  }

  async function handleAddContribution(input: Parameters<typeof createContribution>[0]) {
    await createContribution(input)
    setShowAddContribution(false)
    await Promise.all([refreshContributions(), refreshGoals()])
  }

  async function handleConfirmDeleteContribution() {
    if (!deletingContribution) return
    await deleteContribution(deletingContribution.id)
    setDeletingContribution(null)
    await Promise.all([refreshContributions(), refreshGoals()])
  }

  async function handleConfirmDeleteGoal() {
    await deleteGoal(goal!.id)
    navigate('/metas', { replace: true })
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <Link
            to="/metas"
            aria-label="Volver a metas"
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold text-charcoal">{goal.name}</h1>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setShowEditGoal(true)}
            aria-label="Editar meta"
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setDeletingGoal(true)}
            aria-label="Eliminar meta"
            className="rounded-button p-2 text-taupe hover:bg-bone hover:text-error focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-12 sm:px-10">
        <div className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-6">
          {reached && <p className="text-sm font-medium text-success">¡Meta cumplida! 🎉</p>}
          <div
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-3 w-full overflow-hidden rounded-full bg-bone"
          >
            <div
              className={`h-full rounded-full transition-all ${reached ? 'bg-success' : 'bg-charcoal'}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-charcoal">
              {formatter.format(goal.current_amount)}
            </span>
            <span className="text-sm text-stone">de {formatter.format(goal.target_amount)}</span>
          </div>
          {goal.target_date && (
            <p className="text-sm text-stone">
              Fecha límite: {dateFormatter.format(new Date(`${goal.target_date}T00:00:00`))}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-taupe">Historial de aportaciones</h2>
          <button
            onClick={() => setShowAddContribution(true)}
            className="flex items-center gap-2 rounded-button bg-charcoal px-3 py-1.5 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Plus size={14} />
            Agregar
          </button>
        </div>

        {loading && <p className="py-6 text-center text-sm text-stone">Cargando…</p>}

        {error && (
          <p role="alert" className="text-center text-sm text-error">
            {error}
          </p>
        )}

        {!loading && !error && contributions.length === 0 && (
          <p className="py-10 text-center text-sm text-stone">Todavía no hay aportaciones.</p>
        )}

        <div className="flex flex-col gap-2">
          {contributions.map((contribution) => (
            <div
              key={contribution.id}
              className="flex items-center justify-between rounded-card border border-bone bg-ivory p-4"
            >
              <div>
                <p className="text-charcoal">{contribution.note || 'Aportación'}</p>
                <p className="text-xs text-stone">
                  {dateFormatter.format(new Date(`${contribution.date}T00:00:00`))}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-medium ${contribution.amount < 0 ? 'text-error' : 'text-success'}`}
                >
                  {formatter.format(contribution.amount)}
                </span>
                <button
                  onClick={() => setDeletingContribution(contribution)}
                  aria-label="Eliminar aportación"
                  className="rounded-button p-2 text-taupe hover:bg-bone hover:text-error focus:outline-none focus:ring-2 focus:ring-slate/40"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showEditGoal && (
        <GoalFormModal goal={goal} onClose={() => setShowEditGoal(false)} onSubmit={handleEditGoal} />
      )}

      {showAddContribution && (
        <ContributionFormModal
          goalId={goal.id}
          onClose={() => setShowAddContribution(false)}
          onSubmit={handleAddContribution}
        />
      )}

      {deletingContribution && (
        <ConfirmDialog
          title="Eliminar aportación"
          message="¿Seguro que quieres eliminar esta aportación? Esto reducirá el saldo actual de la meta."
          onConfirm={handleConfirmDeleteContribution}
          onCancel={() => setDeletingContribution(null)}
        />
      )}

      {deletingGoal && (
        <ConfirmDialog
          title="Eliminar meta"
          message={`¿Seguro que quieres eliminar "${goal.name}"? Se borrará también todo su historial de aportaciones.`}
          onConfirm={handleConfirmDeleteGoal}
          onCancel={() => setDeletingGoal(false)}
        />
      )}
    </div>
  )
}