import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AccountCard } from './AccountCard'
import type { Account } from '../types'

interface SortableAccountCardProps {
  account: Account
  onEdit: () => void
  onDelete: () => void
}

export function SortableAccountCard({ account, onEdit, onDelete }: SortableAccountCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: account.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <AccountCard
        account={account}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}