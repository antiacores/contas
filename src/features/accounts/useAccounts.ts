import { useCallback, useEffect, useState } from 'react'
import { listAccounts } from './api/accounts'
import type { Account } from './types'

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listAccounts()
      setAccounts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las cuentas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { accounts, loading, error, refresh }
}