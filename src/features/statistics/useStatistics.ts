import { useCallback, useEffect, useState } from 'react'
import { listAccounts } from '../accounts/api/accounts'
import { listMovements } from '../movements/api/movements'
import { listAllContributions } from '../goals/api/contributions'
import { DEFAULT_FILTERS } from '../movements/types'
import type { BudgetPeriod } from '../budgets/types'
import { getPeriodRange } from '../budgets/dateRange'
import { buildNetWorthHistory, type NetWorthPoint } from './netWorthHistory'

export interface CategorySlice {
  name: string
  value: number
  color: string
}

export interface MonthlyTotal {
  label: string
  ingresos: number
  gastos: number
}

const MONTH_ABBR = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function useStatistics(categoryPeriod: BudgetPeriod) {
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategorySlice[]>([])
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([])
  const [netWorthHistory, setNetWorthHistory] = useState<NetWorthPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sixMonthsAgoStart = new Date()
      sixMonthsAgoStart.setMonth(sixMonthsAgoStart.getMonth() - 5)
      sixMonthsAgoStart.setDate(1)
      const trendFrom = sixMonthsAgoStart.toISOString().slice(0, 10)

      const { start: catStart, end: catEnd } = getPeriodRange(categoryPeriod)

      const [accounts, allMovements, contributions, categoryMovements] = await Promise.all([
        listAccounts(),
        listMovements(DEFAULT_FILTERS), // todo el historial, para reconstruir patrimonio
        listAllContributions(),
        listMovements({ ...DEFAULT_FILTERS, type: 'gasto', dateFrom: catStart, dateTo: catEnd }),
      ])

      // --- Gastos por categoría (periodo seleccionado) ---
      const byCategory = new Map<string, CategorySlice>()
      for (const m of categoryMovements) {
        const key = m.category_id ?? 'sin-categoria'
        const name = m.category_name ?? 'Sin categoría'
        const color = m.category_color ?? '#A89D8D'
        const existing = byCategory.get(key)
        if (existing) existing.value += m.amount
        else byCategory.set(key, { name, value: m.amount, color })
      }
      setCategoryBreakdown(Array.from(byCategory.values()).sort((a, b) => b.value - a.value))

      // --- Ingresos vs. Gastos por mes (últimos 6 meses) ---
      const monthMap = new Map<string, MonthlyTotal>()
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        monthMap.set(key, { label: MONTH_ABBR[d.getMonth()], ingresos: 0, gastos: 0 })
      }
      const trendMovements = allMovements.filter((m) => m.date >= trendFrom)
      for (const m of trendMovements) {
        const d = new Date(`${m.date}T00:00:00`)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        const bucket = monthMap.get(key)
        if (!bucket) continue
        if (m.type === 'ingreso') bucket.ingresos += m.amount
        if (m.type === 'gasto') bucket.gastos += m.amount
      }
      setMonthlyTotals(Array.from(monthMap.values()))

      // --- Tendencia de patrimonio (últimos 6 meses, reconstruido) ---
      setNetWorthHistory(buildNetWorthHistory(accounts, allMovements, contributions, 6))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las estadísticas.')
    } finally {
      setLoading(false)
    }
  }, [categoryPeriod.year, categoryPeriod.month])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { categoryBreakdown, monthlyTotals, netWorthHistory, loading, error, refresh }
}