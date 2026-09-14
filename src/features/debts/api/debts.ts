import { supabase } from '../../../lib/supabase'
import type { Debt, DebtInput } from '../types'

const SELECT_WITH_JOINS = `*, account:accounts(name)`

function mapRow(row: any): Debt {
  return {
    ...row,
    account_name: row.account?.name,
  }
}

function addOneMonth(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 10)
}

export async function listDebts(): Promise<Debt[]> {
  const { data, error } = await supabase
    .from('debts_with_balance')
    .select(SELECT_WITH_JOINS)
    .order('next_due_date', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapRow)
}

async function fetchWithBalance(id: string): Promise<Debt> {
  const { data, error } = await supabase
    .from('debts_with_balance')
    .select(SELECT_WITH_JOINS)
    .eq('id', id)
    .single()

  if (error) throw error
  return mapRow(data)
}

export async function createDebt(input: DebtInput): Promise<Debt> {
  const { data, error } = await supabase.from('debts').insert(input).select().single()
  if (error) throw error
  return fetchWithBalance(data.id)
}

export async function updateDebt(id: string, input: DebtInput): Promise<Debt> {
  const { error } = await supabase.from('debts').update(input).eq('id', id)
  if (error) throw error
  return fetchWithBalance(id)
}

export async function deleteDebt(id: string): Promise<void> {
  const { error } = await supabase.from('debts').delete().eq('id', id)
  if (error) throw error
}

export async function toggleDebtActive(debt: Debt): Promise<Debt> {
  const { error } = await supabase.from('debts').update({ active: !debt.active }).eq('id', debt.id)
  if (error) throw error
  return fetchWithBalance(debt.id)
}

// Registra un pago: crea el movimiento de gasto vinculado (debt_id), el
// registro de pago (para el historial y el cálculo de saldo restante), avanza
// next_due_date un mes, y si el saldo llega a $0, marca la deuda como liquidada.
export async function registerDebtPayment(debt: Debt, amount: number, date: string): Promise<Debt> {
  const { error: paymentError } = await supabase.from('debt_payments').insert({
    debt_id: debt.id,
    amount,
    date,
  })
  if (paymentError) throw paymentError

  const { error: movementError } = await supabase.from('movements').insert({
    account_id: debt.account_id,
    transfer_account_id: null,
    category_id: null,
    type: 'gasto',
    description: debt.name,
    amount,
    date,
    debt_id: debt.id,
  })
  if (movementError) throw movementError

  const newRemaining = debt.remaining_balance - amount
  const updates: Partial<DebtInput> = { next_due_date: addOneMonth(debt.next_due_date) }
  if (newRemaining <= 0) {
    updates.active = false
  }

  const { error } = await supabase.from('debts').update(updates).eq('id', debt.id)
  if (error) throw error

  return fetchWithBalance(debt.id)
}