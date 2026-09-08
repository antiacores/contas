export type MovementType = 'ingreso' | 'gasto' | 'transferencia' | 'ajuste'

export interface Movement {
  id: string
  user_id: string
  account_id: string
  transfer_account_id: string | null
  category_id: string | null
  type: MovementType
  description: string | null
  amount: number
  date: string // YYYY-MM-DD
  created_at: string
  // Campos "enriquecidos" vía join, solo para lectura/despliegue:
  account_name?: string
  transfer_account_name?: string | null
  category_name?: string | null
  category_color?: string | null
}

export type MovementInput = Pick
  Movement,
  'account_id' | 'transfer_account_id' | 'category_id' | 'type' | 'description' | 'amount' | 'date'
>

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