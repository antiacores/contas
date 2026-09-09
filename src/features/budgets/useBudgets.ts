import { useCallback, useEffect, useState } from 'react'
import { listBudgets } from './api/budgets'
import { listMovements } from '../movements/api/movements'
import { DEFAULT_FILTERS } from '../movements/types'
import { getPeriodRange } from './dateRange'
import { currentPeriod, type BudgetPeriod, type BudgetWithProgress } from './types'

export function useBudgets(period: BudgetPeriod = currentPeriod()) {
  const [budgets, setBudgets] = useState<BudgetWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { start, end } = getPeriodRange(period)
      const [budgetsList, gastosDelPeriodo] = await Promise.all([
        listBudgets(),
        listMovements({ ...DEFAULT_FILTERS, type: 'gasto', dateFrom: start, dateTo: end }),
      ])

      const spentByCategory = new Map<string, number>()
      for (const movement of gastosDelPeriodo) {
        if (!movement.category_id) continue
        spentByCategory.set(
          movement.category_id,
          (spentByCategory.get(movement.category_id) ?? 0) + movement.amount,
        )
      }

      // En modo "año completo" (month=null), la meta es el presupuesto mensual x 12.
      const multiplier = period.month === null ? 12 : 1

      setBudgets(
        budgetsList.map((budget) => ({
          ...budget,
          spent: spentByCategory.get(budget.category_id) ?? 0,
          target: budget.amount * multiplier,
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los presupuestos.')
    } finally {
      setLoading(false)
    }
  }, [period.year, period.month])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { budgets, loading, error, refresh }
}