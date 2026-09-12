import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { PageHeader } from '../../components/PageHeader'
import type { Account, AccountInput } from './types'

export function AccountsPage() {
  const { accounts, loading, error, refresh, setAccounts } = useAccounts()
  const [editingAccount, setEditingAccount] = useState<Account | null | undefined>(undefined)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)

  // Requiere un pequeño desplazamiento antes de iniciar el arrastre,
  // así un simple click en la card no se confunde con un drag.
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

    // Optimista: actualiza la UI de inmediato, y persiste en segundo plano.
    setAccounts(reordered)
    try {
      await reorderAccounts(reordered.map((a) => a.id))
    } catch {
      await refresh() // si falla, recupera el orden real del servidor
    }
  }

  return (
    <div>
      <PageHeader
        title="Cuentas"
        action={
          <button
            onClick={() => setEditingAccount(null)}
            className="flex items-center gap-2 rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Plus size={16} />
            Nueva cuenta
          </button>
        }
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 pb-12 sm:px-6 lg:px-10">
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
      </div>

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