import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Category, CategoryInput, CategoryType } from '../types'

interface CategoryFormModalProps {
  category: Category | null
  onClose: () => void
  onSubmit: (input: CategoryInput) => Promise<void>
}

const COLOR_OPTIONS = ['#6F8E72', '#A7645C', '#C69B5B', '#8A9AA5', '#817768', '#A89D8D']

export function CategoryFormModal({ category, onClose, onSubmit }: CategoryFormModalProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [type, setType] = useState<CategoryType>(category?.type ?? 'gasto')
  const [color, setColor] = useState(category?.color ?? COLOR_OPTIONS[1])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), type, color })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la categoría.')
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
      className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center overflow-y-auto bg-charcoal/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-md animate-scale-in rounded-modal bg-warm-white p-6 max-h-[85vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="category-form-title" className="text-lg font-semibold text-charcoal">
            {category ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-button p-1 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate">
              Nombre
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Supermercado"
              className="rounded-input border border-bone bg-ivory px-4 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
              required
            />
          </div>

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-slate">Tipo</legend>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('gasto')}
                aria-pressed={type === 'gasto'}
                className={`flex-1 rounded-button border px-4 py-2 text-sm font-medium ${
                  type === 'gasto'
                    ? 'border-charcoal bg-charcoal text-warm-white'
                    : 'border-bone bg-ivory text-charcoal hover:bg-bone'
                }`}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => setType('ingreso')}
                aria-pressed={type === 'ingreso'}
                className={`flex-1 rounded-button border px-4 py-2 text-sm font-medium ${
                  type === 'ingreso'
                    ? 'border-charcoal bg-charcoal text-warm-white'
                    : 'border-bone bg-ivory text-charcoal hover:bg-bone'
                }`}
              >
                Ingreso
              </button>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-slate">Color</legend>
            <div className="flex flex-wrap gap-2">
  {COLOR_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={`Color ${option}`}
                  aria-pressed={color === option}
                  onClick={() => setColor(option)}
                  className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-slate/40 ${
                    color === option ? 'ring-2 ring-charcoal ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: option }}
                />
              ))}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="text-sm text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-button bg-charcoal px-4 py-3 font-medium text-warm-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Guardando…' : category ? 'Guardar cambios' : 'Crear categoría'}
          </button>
        </form>
      </div>
    </div>
  )
}