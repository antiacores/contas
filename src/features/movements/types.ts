export type MovementType = 'ingreso' | 'gasto' | 'transferencia' | 'ajuste'

export interface Movement {
  id: string
  user_id: string
  account_id: string
  transfer_account_id: string | null
  category_id: string | null
  subscription_id: string | null // se llena solo al "marcar como pagado" una suscripción
  debt_id: string | null // se llena solo al "registrar pago" de una deuda
  type: MovementType
  description: string | null
  amount: number
  date: string
  created_at: string
  account_name?: string
  account_currency?: string // moneda de la cuenta de origen — cada movimiento se muestra en su propia moneda
  transfer_account_name?: string | null
  category_name?: string | null
  category_color?: string | null
  subscription_name?: string | null
  debt_name?: string | null
}

export type MovementInput = Pick<Movement, 'account_id' | 'transfer_account_id' | 'category_id' | 'type' | 'description' | 'amount' | 'date'>

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  ingreso: 'Ingreso',
  gasto: 'Gasto',
  transferencia: 'Transferencia',
  ajuste: 'Ajuste',
}

export interface MovementFilters {
  type: MovementType | 'todos'
  accountId: string | 'todas'
  dateFrom: string | null
  dateTo: string | null
}

export const DEFAULT_FILTERS: MovementFilters = {
  type: 'todos',
  accountId: 'todas',
  dateFrom: null,
  dateTo: null,
}