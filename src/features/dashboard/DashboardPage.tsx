import { Wallet, TrendingUp, Scale } from 'lucide-react'
import { DashboardHeader } from './components/DashboardHeader'
import { SummaryCard } from './components/SummaryCard'
import { RecentMovementsCard, type Movement } from './components/RecentMovementsCard'

// Fase 3: cascarón del dashboard con estados vacíos reales.
// Los valores en null/[] representan "todavía no hay cuentas ni movimientos",
// no "el saldo es cero" — esa distinción importa para la UI.
// Cuando Fase 4 (Cuentas) y Fase 5 (Movimientos) existan, estos valores
// se reemplazan por datos reales desde Supabase sin tocar el layout.
export function DashboardPage() {
  const saldo: number | null = null
  const patrimonio: number | null = null
  const balanceMensual: number | null = null
  const movimientos: Movement[] = []

  return (
    <div className="min-h-screen bg-warm-white">
      <DashboardHeader />

      <main className="mx-auto flex max-w-4xl flex-col gap-4 px-6 pb-12 sm:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Saldo"
            value={saldo}
            emptyMessage="Añade una cuenta para ver tu saldo."
            icon={<Wallet size={18} strokeWidth={2} className="text-stone" />}
          />
          <SummaryCard
            label="Patrimonio"
            value={patrimonio}
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

        <RecentMovementsCard movements={movimientos} />
      </main>
    </div>
  )
}