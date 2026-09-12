import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useCategories } from './useCategories'
import { createCategory, createCategories, deleteCategory, updateCategory } from './api/categories'
import { CategoryFormModal } from './components/CategoryFormModal'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { PageHeader } from '../../components/PageHeader'
import { SUGGESTED_CATEGORIES, type Category, type CategoryInput } from './types'

export function CategoriesPage() {
  const { categories, loading, error, refresh } = useCategories()
  const [editingCategory, setEditingCategory] = useState<Category | null | undefined>(undefined)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [seeding, setSeeding] = useState(false)

  const gastos = categories.filter((c) => c.type === 'gasto')
  const ingresos = categories.filter((c) => c.type === 'ingreso')

  async function handleSubmit(input: CategoryInput) {
    if (editingCategory) {
      await updateCategory(editingCategory.id, input)
    } else {
      await createCategory(input)
    }
    setEditingCategory(undefined)
    await refresh()
  }

  async function handleConfirmDelete() {
    if (!deletingCategory) return
    await deleteCategory(deletingCategory.id)
    setDeletingCategory(null)
    await refresh()
  }

  async function handleSeed() {
    setSeeding(true)
    try {
      await createCategories(SUGGESTED_CATEGORIES)
      await refresh()
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Categorías"
        action={
          <button
            onClick={() => setEditingCategory(null)}
            className="flex items-center gap-2 rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Plus size={16} />
            Nueva categoría
          </button>
        }
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-12 sm:px-6 lg:px-10">
        {loading && <p className="py-10 text-center text-sm text-stone">Cargando…</p>}

        {error && (
          <p role="alert" className="text-center text-sm text-error">
            {error}
          </p>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-card border border-bone bg-ivory py-16">
            <p className="text-stone">No tienes categorías todavía.</p>
            <div className="flex gap-2">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="rounded-button border border-bone bg-warm-white px-4 py-2 text-sm font-medium text-charcoal hover:bg-bone disabled:opacity-60"
              >
                {seeding ? 'Agregando…' : 'Usar categorías sugeridas'}
              </button>
              <button
                onClick={() => setEditingCategory(null)}
                className="rounded-button bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90"
              >
                Crear una propia
              </button>
            </div>
          </div>
        )}

        {gastos.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-taupe">Gastos</h2>
            {gastos.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                onEdit={() => setEditingCategory(cat)}
                onDelete={() => setDeletingCategory(cat)}
              />
            ))}
          </section>
        )}

        {ingresos.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-taupe">Ingresos</h2>
            {ingresos.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                onEdit={() => setEditingCategory(cat)}
                onDelete={() => setDeletingCategory(cat)}
              />
            ))}
          </section>
        )}
      </div>

      {editingCategory !== undefined && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setEditingCategory(undefined)}
          onSubmit={handleSubmit}
        />
      )}

      {deletingCategory && (
        <ConfirmDialog
          title="Eliminar categoría"
          message={`¿Seguro que quieres eliminar "${deletingCategory.name}"? Los movimientos que la usan quedarán sin categoría.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingCategory(null)}
        />
      )}
    </div>
  )
}

function CategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: Category
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-card border border-bone bg-ivory p-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="text-charcoal">{category.name}</span>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onEdit}
          aria-label={`Editar ${category.name}`}
          className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          aria-label={`Eliminar ${category.name}`}
          className="rounded-button p-2 text-taupe hover:bg-bone hover:text-error focus:outline-none focus:ring-2 focus:ring-slate/40"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}