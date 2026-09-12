import { ArrowLeft, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ProfileSection } from './components/ProfileSection'
import { PreferencesSection } from './components/PreferencesSection'

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      <header className="flex items-center gap-3 px-6 py-6 sm:px-10">
        <Link
          to="/"
          aria-label="Volver al dashboard"
          className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold text-charcoal">Configuración</h1>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 pb-12 sm:px-10">
        <ProfileSection />
        <PreferencesSection />

        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center justify-center gap-2 rounded-button border border-bone bg-ivory px-4 py-3 text-sm font-medium text-error hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </main>
    </div>
  )
}