import { LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { ProfileSection } from './components/ProfileSection'
import { PreferencesSection } from './components/PreferencesSection'
import { PageHeader } from '../../components/PageHeader'

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Configuración" />

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pb-12 sm:px-6 lg:px-10">
        <ProfileSection />
        <PreferencesSection />

        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center justify-center gap-2 rounded-button border border-bone bg-ivory px-4 py-3 text-sm font-medium text-error hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}