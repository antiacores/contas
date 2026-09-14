import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  backTo?: string // si se da, muestra flecha de volver (para pantallas anidadas, ej. detalle de un ahorro)
  action?: ReactNode
}

export function PageHeader({ title, backTo, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        {backTo && (
          <Link
            to={backTo}
            aria-label="Volver"
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <ArrowLeft size={20} />
          </Link>
        )}
        <h1 className="text-xl font-semibold text-charcoal">{title}</h1>
      </div>
      {action}
    </header>
  )
}