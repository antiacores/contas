import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-white px-6">
      <div className="w-full max-w-sm rounded-card border border-bone bg-ivory p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-charcoal">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-taupe">{subtitle}</p>}
        </div>

        {children}

        {footer && <div className="mt-6 text-center text-sm text-taupe">{footer}</div>}
      </div>
    </main>
  )
}