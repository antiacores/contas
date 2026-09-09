import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGoals } from './useGoals'
import { createGoal } from './api/goals'
import { GoalCard } from './components/GoalCard'
import { GoalFormModal } from './components/GoalFormModal'
import type { GoalInput } from './types'

export function GoalsPage() {
  const { goals, loading, error, refresh } = useGoals()
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(input: GoalInput) {
    await createGoal(input)
    setShowForm(false)
    await refresh()
  }

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
          <h1 className="text-xl font-semibold text-charcoal">Metas</h1>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
        >
          <Plus size={16} />
          Nueva meta
        </button>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-3 px-6 pb-12 sm:px-10">
        {loading && <p className="py-10 text-center text-sm text-stone">Cargando…</p>}

        {error && (
          <p role="alert" className="text-center text-sm text-error">
            {error}
          </p>
        )}

        {!loading && !error && goals.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-card border border-bone bg-ivory py-16">
            <p className="text-stone">No tienes metas todavía.</p>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90"
            >
              Crear tu primera meta
            </button>
          </div>
        )}

        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </main>

      {showForm && (
        <GoalFormModal goal={null} onClose={() => setShowForm(false)} onSubmit={handleSubmit} />
      )}
    </div>
  )
}