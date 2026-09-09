import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStatistics } from './useStatistics'
import { CategoryBreakdownChart } from './components/CategoryBreakdownChart'
import { MonthlyTrendChart } from './components/MonthlyTrendChart'
import { NetWorthTrendChart } from './components/NetWorthTrendChart'
import { PeriodSelector } from '../budgets/components/PeriodSelector'
import { currentPeriod, type BudgetPeriod } from '../budgets/types'

export function StatisticsPage() {
  const [categoryPeriod, setCategoryPeriod] = useState<BudgetPeriod>(currentPeriod())
  const { categoryBreakdown, monthlyTotals, netWorthHistory, loading, error } =
    useStatistics(categoryPeriod)

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="flex items-center gap-3 px-6 py-6 sm:px-10">
        <Link
          to="/"
          aria-label="Volver al dashboard"
          className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold text-charcoal">Estadísticas</h1>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-12 sm:px-10">
        {error && (
          <p role="alert" className="text-center text-sm text-error">
            {error}
          </p>
        )}

        <section className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-taupe">Gastos por categoría</h2>
          </div>
          <PeriodSelector period={categoryPeriod} onChange={setCategoryPeriod} />
          {loading ? (
            <p className="py-16 text-center text-sm text-stone">Cargando…</p>
          ) : (
            <CategoryBreakdownChart data={categoryBreakdown} />
          )}
        </section>

        <section className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-6">
          <h2 className="text-sm font-medium text-taupe">Ingresos vs. gastos (últimos 6 meses)</h2>
          {loading ? (
            <p className="py-16 text-center text-sm text-stone">Cargando…</p>
          ) : (
            <MonthlyTrendChart data={monthlyTotals} />
          )}
        </section>

        <section className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-6">
          <h2 className="text-sm font-medium text-taupe">Tendencia de patrimonio (últimos 6 meses)</h2>
          {loading ? (
            <p className="py-16 text-center text-sm text-stone">Cargando…</p>
          ) : (
            <NetWorthTrendChart data={netWorthHistory} />
          )}
        </section>
      </main>
    </div>
  )
}