export type CategoryType = 'ingreso' | 'gasto'

export interface Category {
  id: string
  user_id: string
  name: string
  type: CategoryType
  color: string
  position: number
  created_at: string
}

export type CategoryInput = Pick<Category, 'name' | 'type' | 'color'>

// Sugerencias iniciales tomadas de PROJECT.md — el usuario las puede
// agregar con un clic, editarlas o borrarlas después; no son fijas.
export const SUGGESTED_CATEGORIES: CategoryInput[] = [
  { name: 'Nómina', type: 'ingreso', color: '#6F8E72' },
  { name: 'Freelance', type: 'ingreso', color: '#6F8E72' },
  { name: 'Regalos', type: 'ingreso', color: '#6F8E72' },
  { name: 'Inversiones', type: 'ingreso', color: '#6F8E72' },
  { name: 'Supermercado', type: 'gasto', color: '#A7645C' },
  { name: 'Transporte', type: 'gasto', color: '#A7645C' },
  { name: 'Gasolina', type: 'gasto', color: '#A7645C' },
  { name: 'Restaurantes', type: 'gasto', color: '#A7645C' },
  { name: 'Salud', type: 'gasto', color: '#A7645C' },
  { name: 'Educación', type: 'gasto', color: '#A7645C' },
  { name: 'Gym', type: 'gasto', color: '#A7645C' },
  { name: 'Suscripciones', type: 'gasto', color: '#A7645C' },
  { name: 'Compras', type: 'gasto', color: '#A7645C' },
  { name: 'Viajes', type: 'gasto', color: '#A7645C' },
  { name: 'Mascotas', type: 'gasto', color: '#A7645C' },
  { name: 'Hogar', type: 'gasto', color: '#A7645C' },
]