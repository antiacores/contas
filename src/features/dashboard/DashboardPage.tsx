import { Wallet, TrendingUp, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardHeader } from './components/DashboardHeader'
import { SummaryCard } from './components/SummaryCard'
import { RecentMovementsCard } from './components/RecentMovementsCard'
import { useAccounts } from '../accounts/useAccounts'
import { useMovements } from '../movements/useMovements'
import { DEFAULT_FILTERS } from '../movements/types'

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
    <div className="min-h-screen bg-warm-white">
      <DashboardHeader />

      <main className="mx-auto flex max-w-4xl flex-col gap-4 px-6 pb-12 sm:px-10">
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

        <div className="flex flex-wrap gap-4 text-sm">
          <Link to="/cuentas" className="font-medium text-charcoal underline hover:text-slate">
            Administrar cuentas →
          </Link>
          <Link to="/categorias" className="font-medium text-charcoal underline hover:text-slate">
            Categorías →
          </Link>
          <Link to="/presupuestos" className="font-medium text-charcoal underline hover:text-slate">
            Presupuestos →
          </Link>
          <Link to="/metas" className="font-medium text-charcoal underline hover:text-slate">
            Metas →
          </Link>
          <Link to="/estadisticas" className="font-medium text-charcoal underline hover:text-slate">
            Estadísticas →
          </Link>
          <Link to="/configuracion" className="font-medium text-charcoal underline hover:text-slate">
            Configuración →
          </Link>
        </div>

        <RecentMovementsCard movements={recentMovements} loading={recentLoading} />
      </main>
    </div>
  )
}