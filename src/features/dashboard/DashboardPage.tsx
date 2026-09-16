import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, TrendingUp, Scale, PiggyBank, Repeat, HandCoins, type LucideIcon } from 'lucide-react'
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
import { useSettings } from '../../lib/settings/useSettings'
import { useCurrencyRates } from '../../lib/useCurrencyRates'

function startOfMonth(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
}

interface QuickAccessItem {
  to: string
  label: string
  icon: LucideIcon
  color: string
}

// Con la barra de abajo reducida a 4 destinos + el botón "+", Ahorros,
// Suscripciones y Deudas ya no viven en la navegación permanente — su acceso
// directo vive aquí, como cards, no como simples links de texto.
const QUICK_ACCESS: QuickAccessItem[] = [
  { to: '/ahorros', label: 'Ahorros', icon: PiggyBank, color: '#6F8E72' },
  { to: '/suscripciones', label: 'Suscripciones', icon: Repeat, color: '#8A9AA5' },
  { to: '/deudas', label: 'Deudas', icon: HandCoins, color: '#A7645C' },
]

export function DashboardPage() {
  const { settings } = useSettings()
  const { accounts, loading: accountsLoading } = useAccounts()
  const { movements: recentMovements, loading: recentLoading } = useMovements(DEFAULT_FILTERS, 5)
  const { movements: monthMovements, loading: monthLoading } = useMovements({
    ...DEFAULT_FILTERS,
    dateFrom: startOfMonth(),
  })

  // Si tienes cuentas en más de una moneda, convertimos todo a tu moneda
  // principal (con el tipo de cambio del día) antes de sumar los totales —
  // cada cuenta individual se sigue mostrando en la suya propia.
  const currenciesInUse = [
    ...accounts.map((a) => a.currency),
    ...monthMovements.map((m) => m.account_currency ?? settings.currency),
  ]
  const { convert } = useCurrencyRates(currenciesInUse, settings.currency)

  const [categoryPeriod, setCategoryPeriod] = useState<BudgetPeriod>(currentPeriod())
  const { categoryBreakdown, monthlyTotals, netWorthHistory, loading: statsLoading } =
    useStatistics(categoryPeriod)

  // Saldo: dinero líquido disponible (excluye tarjetas de crédito, que son deuda).
  // Patrimonio: suma de TODAS las cuentas — si una cuenta de crédito tiene saldo
  // negativo (deuda), ya resta sola gracias a cómo se calcula accounts_with_balance.
  const saldo =
    accounts.length === 0
      ? null
      : accounts
          .filter((a) => a.type !== 'credito')
          .reduce((sum, a) => sum + convert(a.current_balance, a.currency), 0)

  const patrimonio =
    accounts.length === 0
      ? null
      : accounts.reduce((sum, a) => sum + convert(a.current_balance, a.currency), 0)

  const balanceMensual =
    monthMovements.length === 0
      ? null
      : monthMovements.reduce((sum, m) => {
          const amount = convert(m.amount, m.account_currency ?? settings.currency)
          if (m.type === 'ingreso') return sum + amount
          if (m.type === 'gasto') return sum - amount
          return sum // transferencias y ajustes no cuentan como flujo del mes
        }, 0)

  return (
    <div className="flex flex-col gap-4 px-4 pb-12 pt-6 sm:px-6 lg:px-10">
      {/* Las 4 cards "de un vistazo": 2x2 en móvil, una sola fila en laptop. */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
        <RecentMovementsCard movements={recentMovements} loading={recentLoading} compact />
      </div>

      {/* Accesos rápidos: Ahorros, Suscripciones y Deudas ya no están en el
          menú permanente — viven aquí como cards. */}
      <div className="grid grid-cols-3 gap-3">
        {QUICK_ACCESS.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-2 rounded-card border border-bone bg-ivory px-3 py-4 text-center hover:bg-bone/40"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${item.color}26` }}
              >
                <Icon size={18} strokeWidth={2} style={{ color: item.color }} />
              </span>
              <span className="text-sm font-medium text-charcoal">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Gráficas — gastos por categoría e ingresos/gastos lado a lado en laptop. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-6">
          <h2 className="text-sm font-medium text-taupe">Gastos por categoría</h2>
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
      </div>

      <section className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-6">
        <h2 className="text-sm font-medium text-taupe">Tendencia de patrimonio (últimos 6 meses)</h2>
        {statsLoading ? (
          <p className="py-16 text-center text-sm text-stone">Cargando…</p>
        ) : (
          <NetWorthTrendChart data={netWorthHistory} />
        )}
      </section>
    </div>
  )
}