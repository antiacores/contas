import type { BudgetPeriod } from './types'

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

// Devuelve el rango [start, end] en formato YYYY-MM-DD para el periodo dado.
// month=null implica el año completo (para el modo "Ver por año").
export function getPeriodRange(period: BudgetPeriod): { start: string; end: string } {
  if (period.month === null) {
    return {
      start: toISODate(new Date(period.year, 0, 1)),
      end: toISODate(new Date(period.year, 11, 31)),
    }
  }
  return {
    start: toISODate(new Date(period.year, period.month, 1)),
    end: toISODate(new Date(period.year, period.month + 1, 0)), // día 0 = último día del mes anterior
  }
}

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function isCurrentOrFuture(period: BudgetPeriod): boolean {
  const now = new Date()
  if (period.month === null) return period.year >= now.getFullYear()
  return period.year > now.getFullYear() || (period.year === now.getFullYear() && period.month >= now.getMonth())
}