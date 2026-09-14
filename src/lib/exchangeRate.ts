// Tipo de cambio en vivo, vía Frankfurter (datos del Banco Central Europeo,
// gratis, sin necesidad de clave — funciona directo desde el navegador).
export async function getExchangeRate(base: string, quote: string): Promise<number> {
  if (base === quote) return 1

  const response = await fetch(`https://api.frankfurter.dev/v2/rate/${base}/${quote}`)
  if (!response.ok) {
    throw new Error('No se pudo obtener el tipo de cambio en este momento.')
  }
  const data = await response.json()
  return data.rate as number
}