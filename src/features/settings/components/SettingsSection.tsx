import type { ReactNode } from 'react'

interface SettingsSectionProps {
  title: string
  children: ReactNode
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-card border border-bone bg-ivory p-6">
      <h2 className="text-sm font-medium text-taupe">{title}</h2>
      {children}
    </section>
  )
}