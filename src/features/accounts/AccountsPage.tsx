import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useAccounts } from './useAccounts'
import { createAccount, deleteAccount, reorderAccounts, updateAccount } from './api/accounts'
import { SortableAccountCard } from './components/SortableAccountCard'
import { AccountFormModal } from './components/AccountFormModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import type { Account, AccountInput } from './types'

export function AccountsPage() {
  const { accounts, loading, error, refresh, setAccounts } = useAccounts()
  const [editingAccount, setEditingAccount] = useState<Account | null | undefined>(undefined)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  async function handleSubmit(input: AccountInput) {
    if (editingAccount) {
      await updateAccount(editingAccount.id, input)
    } else {
      await createAccount(input)
    }
    setEditingAccount(undefined)
    await refresh()
  }

  async function handleConfirmDelete() {
    if (!deletingAccount) return
    await deleteAccount(deletingAccount.id)
    setDeletingAccount(null)
    await refresh()
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = accounts.findIndex((a) => a.id === active.id)
    const newIndex = accounts.findIndex((a) => a.id === over.id)
    const reordered = arrayMove(accounts, oldIndex, newIndex)

    setAccounts(reordered)
    try {
      await reorderAccounts(reordered.map((a) => a.id))
    } catch {
      await refresh()
    }
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Volver al dashboard"
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold text-charcoal">Cuentas</h1>
        </div>

        <button
          onClick={() => setEditingAccount(null)}
          className="flex items-center gap-2 rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
        >
          <Plus size={16} />
          Nueva cuenta
        </button>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-3 px-6 pb-12 sm:px-10">
        {loading && <p className="py-10 text-center text-sm text-stone">Cargando…</p>}

        {error && (
          <p role="alert" className="text-center text-sm text-error">
            {error}
          </p>
        )}

        {!loading && !error && accounts.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-card border border-bone bg-ivory py-16">
            <p className="text-stone">No tienes cuentas todavía.</p>
            <button
              onClick={() => setEditingAccount(null)}
              className="rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90"
            >
              Crear tu primera cuenta
            </button>
          </div>
        )}

        {accounts.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={accounts.map((a) => a.id)} strategy={verticalListSortingStrategy}>
              {accounts.map((account) => (
                <SortableAccountCard
                  key={account.id}
                  account={account}
                  onEdit={() => setEditingAccount(account)}
                  onDelete={() => setDeletingAccount(account)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </main>

      {editingAccount !== undefined && (
        <AccountFormModal
          account={editingAccount}
          onClose={() => setEditingAccount(undefined)}
          onSubmit={handleSubmit}
        />
      )}

      {deletingAccount && (
        <ConfirmDialog
          title="Eliminar cuenta"
          message={`¿Seguro que quieres eliminar "${deletingAccount.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingAccount(null)}
        />
      )}
    </div>
  )
}