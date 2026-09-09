import { useCallback, useEffect, useState } from 'react'
import { listBudgets } from './api/budgets'
import { listMovements } from '../movements/api/movements'
import { DEFAULT_FILTERS } from '../movements/types'
import type { BudgetWithProgress } from './types'

function startOfMonth(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [budgetsList, gastosDelMes] = await Promise.all([
        listBudgets(),
        listMovements({ ...DEFAULT_FILTERS, type: 'gasto', dateFrom: startOfMonth() }),
      ])

      // Suma lo gastado este mes, agrupado por categoría — se calcula en el
      // cliente reutilizando los movimientos ya filtrados, sin una vista SQL extra.
      const spentByCategory = new Map<string, number>()
      for (const movement of gastosDelMes) {
        if (!movement.category_id) continue
        spentByCategory.set(
          movement.category_id,
          (spentByCategory.get(movement.category_id) ?? 0) + movement.amount,
        )
      }

      setBudgets(
        budgetsList.map((budget) => ({
          ...budget,
          spent: spentByCategory.get(budget.category_id) ?? 0,
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los presupuestos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { budgets, loading, error, refresh }
}