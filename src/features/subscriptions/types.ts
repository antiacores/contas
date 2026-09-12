export type SubscriptionFrequency = 'semanal' | 'quincenal' | 'mensual' | 'anual'

export interface Subscription {
  id: string
  user_id: string
  name: string
  amount: number
  frequency: SubscriptionFrequency
  next_payment_date: string
  account_id: string
  category_id: string | null
  color: string
  active: boolean
  created_at: string
  // Enriquecidos vía join, solo lectura:
  account_name?: string
  category_name?: string | null
  category_color?: string | null
}

export type SubscriptionInput = Pick<
  Subscription,
  'name' | 'amount' | 'frequency' | 'next_payment_date' | 'account_id' | 'category_id' | 'color' | 'active'
>

export const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
  semanal: 'Semanal',
  quincenal: 'Quincenal',
  mensual: 'Mensual',
  anual: 'Anual',
}