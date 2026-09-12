import { supabase } from '../../../lib/supabase'
import type { Subscription, SubscriptionInput } from '../types'
import { advanceDate } from '../dateUtils'

const SELECT_WITH_JOINS = `*, account:accounts(name), category:categories(name, color)`

function mapRow(row: any): Subscription {
  return {
    ...row,
    account_name: row.account?.name,
    category_name: row.category?.name ?? null,
    category_color: row.category?.color ?? null,
  }
}

export async function listSubscriptions(): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(SELECT_WITH_JOINS)
    .order('next_payment_date', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function createSubscription(input: SubscriptionInput): Promise<Subscription> {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert(input)
    .select(SELECT_WITH_JOINS)
    .single()

  if (error) throw error
  return mapRow(data)
}

export async function updateSubscription(id: string, input: SubscriptionInput): Promise<Subscription> {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(input)
    .eq('id', id)
    .select(SELECT_WITH_JOINS)
    .single()

  if (error) throw error
  return mapRow(data)
}

export async function deleteSubscription(id: string): Promise<void> {
  const { error } = await supabase.from('subscriptions').delete().eq('id', id)
  if (error) throw error
}

export async function toggleSubscriptionActive(subscription: Subscription): Promise<Subscription> {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ active: !subscription.active })
    .eq('id', subscription.id)
    .select(SELECT_WITH_JOINS)
    .single()

  if (error) throw error
  return mapRow(data)
}

// Marca la suscripción como pagada: crea el movimiento de gasto vinculado
// (subscription_id) y avanza next_payment_date según la frecuencia.
export async function markSubscriptionAsPaid(subscription: Subscription): Promise<Subscription> {
  const { error: movementError } = await supabase.from('movements').insert({
    account_id: subscription.account_id,
    transfer_account_id: null,
    category_id: subscription.category_id,
    type: 'gasto',
    description: subscription.name,
    amount: subscription.amount,
    date: new Date().toISOString().slice(0, 10),
    subscription_id: subscription.id,
  })
  if (movementError) throw movementError

  const nextDate = advanceDate(subscription.next_payment_date, subscription.frequency)
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ next_payment_date: nextDate })
    .eq('id', subscription.id)
    .select(SELECT_WITH_JOINS)
    .single()

  if (error) throw error
  return mapRow(data)
}