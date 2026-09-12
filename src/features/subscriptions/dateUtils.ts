import type { SubscriptionFrequency } from './types'

// Calcula la siguiente fecha de pago al marcar una suscripción como pagada.
// Siempre avanza desde la fecha que tenía programada, sin importar si la
// marcaste antes o después de esa fecha — mantiene el ciclo predecible.
export function advanceDate(dateStr: string, frequency: SubscriptionFrequency): string {
  const d = new Date(`${dateStr}T00:00:00`)
  switch (frequency) {
    case 'semanal':
      d.setDate(d.getDate() + 7)
      break
    case 'quincenal':
      d.setDate(d.getDate() + 14)
      break
    case 'mensual':
      d.setMonth(d.getMonth() + 1)
      break
    case 'anual':
      d.setFullYear(d.getFullYear() + 1)
      break
  }
  return d.toISOString().slice(0, 10)
}

export function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${dateStr}T00:00:00`)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}