import { useCallback, useEffect, useState } from 'react'
import { listSubscriptions } from './api/subscriptions'
import type { Subscription } from './types'

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listSubscriptions()
      setSubscriptions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las suscripciones.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { subscriptions, loading, error, refresh }
}