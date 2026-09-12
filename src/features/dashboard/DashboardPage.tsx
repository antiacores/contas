import { useState } from 'react'
import { Wallet, TrendingUp, Scale } from 'lucide-react'
import { DashboardHeader } from './components/DashboardHeader'
import { SummaryCard } from './components/SummaryCard'
import { RecentMovementsCard } from './components/RecentMovementsCard'
import { useAccounts } from '../accounts/useAccounts'
import { useMovements } from '../movements/useMovements'
import { DEFAULT_FILTERS } from '../movements/types'
import { useStatistics } from '../statistics/useStatistics'
import { CategoryBreakdownChart } from '../statistics/components/CategoryBreakdownChart'
import { MonthlyTrendChart } from '../statistics/components/MonthlyTrendChart'
import { NetWorthTrendChart } from '../statistics/components/NetWorthTrendChart'
import { PeriodSelector } from '../budgets/components/PeriodSelector'
import { currentPeriod, type BudgetPeriod } from '../budgets/types'

function startOfMonth(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
}

export function DashboardPage() {
  const { accounts, loading: accountsLoading } = useAccounts()
  const { movements: recentMovements, loading: recentLoading } = useMovements(DEFAULT_FILTERS, 5)
  const { movements: monthMovements, loading: monthLoading } = useMovements({
    ...DEFAULT_FILTERS,
    dateFrom: startOfMonth(),
  })

  const [categoryPeriod, setCategoryPeriod] = useState<BudgetPeriod>(currentPeriod())
  const { categoryBreakdown, monthlyTotals, netWorthHistory, loading: statsLoading } =
    useStatistics(categoryPeriod)

  // Saldo: dinero líquido disponible (excluye tarjetas de crédito, que son deuda).
  // Patrimonio: suma de TODAS las cuentas — si una cuenta de crédito tiene saldo
  // negativo (deuda), ya resta sola gracias a cómo se calcula accounts_with_balance.
  const saldo =
    accounts.length === 0
      ? null
      : accounts.filter((a) => a.type !== 'credito').reduce((sum, a) => sum + a.current_balance, 0)

  const patrimonio =
    accounts.length === 0 ? null : accounts.reduce((sum, a) => sum + a.current_balance, 0)

  const balanceMensual =
    monthMovements.length === 0
      ? null
      : monthMovements.reduce((sum, m) => {
          if (m.type === 'ingreso') return sum + m.amount
          if (m.type === 'gasto') return sum - m.amount
          return sum // transferencias y ajustes no cuentan como flujo del mes
        }, 0)

  return (
    <div>
      <DashboardHeader />

      <div className="flex flex-col gap-4 px-4 pb-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Saldo"
            value={accountsLoading ? null : saldo}
            emptyMessage="Añade una cuenta para ver tu saldo."
            icon={<Wallet size={18} strokeWidth={2} className="text-stone" />}
          />
          <SummaryCard
            label="Patrimonio"
            value={accountsLoading ? null : patrimonio}
            emptyMessage="Aún no hay patrimonio que mostrar."
            icon={<TrendingUp size={18} strokeWidth={2} className="text-stone" />}
          />
          <SummaryCard
            label="Balance mensual"
            value={monthLoading ? null : balanceMensual}
            emptyMessage="Registra movimientos para ver tu balance."
            icon={<Scale size={18} strokeWidth={2} className="text-stone" />}
          />
        </div>

        {/* En pantallas grandes, gráficas y últimos movimientos van lado a lado;
            en móvil se apilan (mobile-first, como pide el DESIGN_SYSTEM). */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <section className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-taupe">Gastos por categoría</h2>
              </div>
              <PeriodSelector period={categoryPeriod} onChange={setCategoryPeriod} />
              {statsLoading ? (
                <p className="py-16 text-center text-sm text-stone">Cargando…</p>
              ) : (
                <CategoryBreakdownChart data={categoryBreakdown} />
              )}
            </section>

            <section className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-6">
              <h2 className="text-sm font-medium text-taupe">Ingresos vs. gastos (últimos 6 meses)</h2>
              {statsLoading ? (
                <p className="py-16 text-center text-sm text-stone">Cargando…</p>
              ) : (
                <MonthlyTrendChart data={monthlyTotals} />
              )}
            </section>

            <section className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-6">
              <h2 className="text-sm font-medium text-taupe">Tendencia de patrimonio (últimos 6 meses)</h2>
              {statsLoading ? (
                <p className="py-16 text-center text-sm text-stone">Cargando…</p>
              ) : (
                <NetWorthTrendChart data={netWorthHistory} />
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <RecentMovementsCard movements={recentMovements} loading={recentLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}