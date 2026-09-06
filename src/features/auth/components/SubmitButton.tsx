import type { ButtonHTMLAttributes } from 'react'

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export function SubmitButton({ loading, children, disabled, ...props }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="rounded-button bg-charcoal px-4 py-3 font-medium text-warm-white
                 transition-opacity
                 hover:opacity-90
                 focus:outline-none focus:ring-2 focus:ring-slate/40
                 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {loading ? 'Cargando…' : children}
    </button>
  )
}