import { Wallet, TrendingUp, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardHeader } from './components/DashboardHeader'
import { SummaryCard } from './components/SummaryCard'
import { RecentMovementsCard, type Movement } from './components/RecentMovementsCard'
import { useAccounts } from '../accounts/useAccounts'

// Fase 3: layout con estados vacíos. Fase 4: Saldo y Patrimonio ya
// se calculan a partir de cuentas reales; Balance mensual sigue en null
// hasta que existan movimientos (Fase 5).
export function DashboardPage() {
  const { accounts, loading } = useAccounts()

  // Simplificación por ahora: las cuentas de crédito representan deuda
  // (lo que se debe), así que restan del patrimonio en vez de sumar.
  // Cuando exista un modelo de deudas/inversiones más completo, esto se refina.
  const saldo = accounts.length === 0 ? null : sumByType(accounts, (t) => t !== 'credito')
  const deuda = accounts.length === 0 ? 0 : sumByType(accounts, (t) => t === 'credito')
  const patrimonio = accounts.length === 0 ? null : (saldo ?? 0) - deuda

  const balanceMensual: number | null = null
  const movimientos: Movement[] = []

  return (
    <div className="min-h-screen bg-warm-white">
      <DashboardHeader />

      <main className="mx-auto flex max-w-4xl flex-col gap-4 px-6 pb-12 sm:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Saldo"
            value={loading ? null : saldo}
            emptyMessage="Añade una cuenta para ver tu saldo."
            icon={<Wallet size={18} strokeWidth={2} className="text-stone" />}
          />
          <SummaryCard
            label="Patrimonio"
            value={loading ? null : patrimonio}
            emptyMessage="Aún no hay patrimonio que mostrar."
            icon={<TrendingUp size={18} strokeWidth={2} className="text-stone" />}
          />
          <SummaryCard
            label="Balance mensual"
            value={balanceMensual}
            emptyMessage="Registra movimientos para ver tu balance."
            icon={<Scale size={18} strokeWidth={2} className="text-stone" />}
          />
        </div>

        <Link
          to="/cuentas"
          className="self-start text-sm font-medium text-charcoal underline hover:text-slate"
        >
          Administrar cuentas →
        </Link>

        <RecentMovementsCard movements={movimientos} />
      </main>
    </div>
  )
}

function sumByType(
  accounts: { type: string; balance: number }[],
  predicate: (type: string) => boolean,
): number {
  return accounts.filter((a) => predicate(a.type)).reduce((total, a) => total + a.balance, 0)
}