// Fuente única para formatear dinero en toda la app. Antes cada pantalla
// tenía su propio `Intl.NumberFormat` con 'MXN' quemado — ahora todos
// reciben el código de moneda desde useSettings() y lo pasan aquí.
const formatterCache = new Map<string, Intl.NumberFormat>()

export function formatCurrency(amount: number, currencyCode: string): string {
  let formatter = formatterCache.get(currencyCode)
  if (!formatter) {
    formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    })
    formatterCache.set(currencyCode, formatter)
  }
  return formatter.format(amount)
}