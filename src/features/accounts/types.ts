export type AccountType = 'debito' | 'credito' | 'ahorro' | 'efectivo' | 'nomina' | 'inversion'

export interface Account {
  id: string
  user_id: string
  name: string
  bank: string | null
  type: AccountType
  color: string
  balance: number
  currency: string
  position: number
  created_at: string
}

// Forma que envía el formulario al crear/editar — sin campos que gestiona la BD.
export type AccountInput = Pick<Account, 'name' | 'bank' | 'type' | 'color' | 'balance' | 'currency'>

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  debito: 'Débito',
  credito: 'Crédito',
  ahorro: 'Ahorro',
  efectivo: 'Efectivo',
  nomina: 'Nómina',
  inversion: 'Inversión',
}