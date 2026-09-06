import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { GoogleIcon } from './GoogleIcon'

export function GoogleButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setError(null)
    setLoading(true)

    // El navegador redirige a Google; al volver, Supabase ya deja la sesión
    // activa y el AuthProvider existente la detecta solo.
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

    if (oauthError) {
      setError(oauthError.message)
      setLoading(false)
    }
    // No hace falta setLoading(false) en el caso exitoso: la página
    // navega fuera de la app hacia Google.
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-button border border-bone bg-warm-white px-4 py-3
                   font-medium text-charcoal
                   hover:bg-bone
                   focus:outline-none focus:ring-2 focus:ring-slate/40
                   disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {loading ? 'Redirigiendo…' : 'Continuar con Google'}
      </button>
      {error && (
        <p role="alert" className="text-center text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}