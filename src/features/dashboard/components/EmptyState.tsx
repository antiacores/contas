interface EmptyStateProps {
  message: string
}

// Estado vacío genérico y reutilizable. La app nunca debe sentirse "rota"
// o a medio construir cuando todavía no hay datos — solo tranquila.
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center py-6">
      <p className="text-sm text-stone">{message}</p>
    </div>
  )
}