import { useCallback, useEffect, useState } from 'react'
import { listGoals } from './api/goals'
import type { Goal } from './types'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listGoals()
      setGoals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las metas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { goals, loading, error, refresh }
}