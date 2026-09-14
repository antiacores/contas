import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSubscriptions } from './useSubscriptions'
import {
  createSubscription,
  deleteSubscription,
  markSubscriptionAsPaid,
  toggleSubscriptionActive,
  updateSubscription,
} from './api/subscriptions'
import { useAccounts } from '../accounts/useAccounts'
import { useCategories } from '../categories/useCategories'
import { SubscriptionCard } from './components/SubscriptionCard'
import { SubscriptionFormModal } from './components/SubscriptionFormModal'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { PageHeader } from '../../components/PageHeader'
import type { Subscription, SubscriptionInput } from './types'

export function SubscriptionsPage() {
  const { subscriptions, loading, error, refresh } = useSubscriptions()
  const { accounts } = useAccounts()
  const { categories } = useCategories()
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null | undefined>(undefined)
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null)

  const noAccounts = accounts.length === 0
  const active = subscriptions.filter((s) => s.active)
  const paused = subscriptions.filter((s) => !s.active)

  async function handleSubmit(input: SubscriptionInput) {
    if (editingSubscription) {
      await updateSubscription(editingSubscription.id, input)
    } else {
      await createSubscription(input)
    }
    setEditingSubscription(undefined)
    await refresh()
  }

  async function handleMarkPaid(subscription: Subscription) {
    await markSubscriptionAsPaid(subscription)
    await refresh()
  }

  async function handleToggleActive(subscription: Subscription) {
    await toggleSubscriptionActive(subscription)
    await refresh()
  }

  async function handleConfirmDelete() {
    if (!deletingSubscription) return
    await deleteSubscription(deletingSubscription.id)
    setDeletingSubscription(null)
    await refresh()
  }

  return (
    <div>
      <PageHeader
        title="Suscripciones"
        action={
          <button
            onClick={() => setEditingSubscription(null)}
            disabled={noAccounts}
            className="flex items-center gap-2 rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            Nueva suscripción
          </button>
        }
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-12 sm:px-6 lg:px-10">
        {noAccounts && !loading && (
          <p className="rounded-card border border-bone bg-ivory p-4 text-center text-sm text-stone">
            Necesitas al menos una cuenta antes de registrar suscripciones.{' '}
            <Link to="/cuentas" className="font-medium text-charcoal underline">
              Crear cuenta
            </Link>
          </p>
        )}

        {loading && <p className="py-10 text-center text-sm text-stone">Cargando…</p>}

        {error && (
          <p role="alert" className="text-center text-sm text-error">
            {error}
          </p>
        )}

        {!loading && !error && subscriptions.length === 0 && !noAccounts && (
          <div className="flex flex-col items-center gap-4 rounded-card border border-bone bg-ivory py-16">
            <p className="text-stone">No tienes suscripciones todavía.</p>
            <button
              onClick={() => setEditingSubscription(null)}
              className="rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90"
            >
              Crear tu primera suscripción
            </button>
          </div>
        )}

        {active.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-taupe">Activas</h2>
            {active.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onMarkPaid={() => handleMarkPaid(subscription)}
                onToggleActive={() => handleToggleActive(subscription)}
                onEdit={() => setEditingSubscription(subscription)}
                onDelete={() => setDeletingSubscription(subscription)}
              />
            ))}
          </section>
        )}

        {paused.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-taupe">Pausadas</h2>
            {paused.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onMarkPaid={() => handleMarkPaid(subscription)}
                onToggleActive={() => handleToggleActive(subscription)}
                onEdit={() => setEditingSubscription(subscription)}
                onDelete={() => setDeletingSubscription(subscription)}
              />
            ))}
          </section>
        )}
      </div>

      {editingSubscription !== undefined && (
        <SubscriptionFormModal
          subscription={editingSubscription}
          accounts={accounts}
          categories={categories}
          onClose={() => setEditingSubscription(undefined)}
          onSubmit={handleSubmit}
        />
      )}

      {deletingSubscription && (
        <ConfirmDialog
          title="Eliminar suscripción"
          message={`¿Seguro que quieres eliminar "${deletingSubscription.name}"? Los movimientos ya registrados no se borran.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingSubscription(null)}
        />
      )}
    </div>
  )
}