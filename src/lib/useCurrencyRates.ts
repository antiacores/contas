import { useEffect, useState } from 'react'
import { getExchangeRate } from './exchangeRate'

// Trae el tipo de cambio de todas las monedas distintas a `target` que aparezcan
// en `currencies`, en una sola tanda. Devuelve una función `convert` lista para
// usar — si una moneda ya es la de destino, o el tipo de cambio no cargó todavía,
// no rompe: devuelve el monto tal cual en vez de fallar o mostrar NaN.
export function useCurrencyRates(currencies: string[], target: string) {
  const uniqueForeign = Array.from(new Set(currencies)).filter((c) => c && c !== target)
  const key = uniqueForeign.slice().sort().join(',')

  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(uniqueForeign.length > 0)

  useEffect(() => {
    let cancelled = false

    if (uniqueForeign.length === 0) {
      setRates({})
      setLoading(false)
      return
    }

    setLoading(true)
    Promise.all(uniqueForeign.map((c) => getExchangeRate(c, target).then((rate) => [c, rate] as const)))
      .then((entries) => {
        if (!cancelled) setRates(Object.fromEntries(entries))
      })
      .catch(() => {
        if (!cancelled) setRates({})
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, target])

  function convert(amount: number, from: string): number {
    if (!from || from === target) return amount
    const rate = rates[from]
    return rate ? amount * rate : amount
  }

  return { rates, loading, convert }
}