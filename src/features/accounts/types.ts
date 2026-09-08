export type AccountType = 'debito' | 'credito' | 'ahorro' | 'efectivo' | 'nomina' | 'inversion'

export interface Account {
  id: string
  user_id: string
  name: string
  bank: string | null
  type: AccountType
  color: string
  initial_balance: number
  current_balance: number // calculado en la vista accounts_with_balance, nunca se guarda directo
  currency: string
  position: number
  created_at: string
}

// Forma que envía el formulario al crear/editar — sin campos que gestiona la BD.
export type AccountInput = Pick<Account, 'name' | 'bank' | 'type' | 'color' | 'initial_balance' | 'currency'>

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  debito: 'Débito',
  credito: 'Crédito',
  ahorro: 'Ahorro',
  efectivo: 'Efectivo',
  nomina: 'Nómina',
  inversion: 'Inversión',
}