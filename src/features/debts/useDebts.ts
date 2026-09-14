import { useCallback, useEffect, useState } from 'react'
import { listDebts } from './api/debts'
import type { Debt } from './types'

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listDebts()
      setDebts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las deudas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { debts, loading, error, refresh }
}