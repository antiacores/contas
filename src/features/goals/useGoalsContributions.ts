import { useCallback, useEffect, useState } from 'react'
import { listContributions } from './api/contributions'
import type { GoalContribution } from './types'

export function useGoalContributions(goalId: string) {
  const [contributions, setContributions] = useState<GoalContribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listContributions(goalId)
      setContributions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el historial.')
    } finally {
      setLoading(false)
    }
  }, [goalId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { contributions, loading, error, refresh }
}