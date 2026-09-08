import { useCallback, useEffect, useState } from 'react'
import { listMovements } from './api/movements'
import { DEFAULT_FILTERS, type Movement, type MovementFilters } from './types'

export function useMovements(initialFilters: MovementFilters = DEFAULT_FILTERS, limit?: number) {
  const [movements, setMovements] = useState<Movement[]>([])
  const [filters, setFilters] = useState<MovementFilters>(initialFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listMovements(filters, limit)
      setMovements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los movimientos.')
    } finally {
      setLoading(false)
    }
  }, [filters, limit])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { movements, filters, setFilters, loading, error, refresh }
}