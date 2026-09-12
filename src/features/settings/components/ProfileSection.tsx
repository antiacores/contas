import { useState, type FormEvent } from 'react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../lib/auth/useAuth'
import { SettingsSection } from './SettingsSection'

export function ProfileSection() {
  const { user } = useAuth()

  const [newEmail, setNewEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMessage, setEmailMessage] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  async function handleUpdateEmail(event: FormEvent) {
    event.preventDefault()
    setEmailError(null)
    setEmailMessage(null)

    if (!newEmail.trim()) {
      setEmailError('Escribe el nuevo correo.')
      return
    }

    setEmailLoading(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    setEmailLoading(false)

    if (error) {
      setEmailError(error.message)
      return
    }

    setEmailMessage('Revisa tu correo (el actual y el nuevo) para confirmar el cambio.')
    setNewEmail('')
  }

  async function handleUpdatePassword(event: FormEvent) {
    event.preventDefault()
    setPasswordError(null)
    setPasswordMessage(null)

    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.')
      return
    }

    setPasswordLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordLoading(false)

    if (error) {
      setPasswordError(error.message)
      return
    }

    setPasswordMessage('Contraseña actualizada.')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <SettingsSection title="Perfil">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-taupe">Correo actual</span>
        <span className="text-charcoal">{user?.email}</span>
      </div>

      <form onSubmit={handleUpdateEmail} className="flex flex-col gap-2 border-t border-bone pt-4">
        <label htmlFor="new-email" className="text-sm font-medium text-slate">
          Cambiar correo
        </label>
        <div className="flex gap-2">
          <input
            id="new-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="nuevo@correo.com"
            className="flex-1 rounded-input border border-bone bg-warm-white px-4 py-2.5 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
          />
          <button
            type="submit"
            disabled={emailLoading}
            className="rounded-button bg-charcoal px-4 py-2.5 text-sm font-medium text-warm-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {emailLoading ? 'Enviando…' : 'Actualizar'}
          </button>
        </div>
        {emailMessage && <p className="text-sm text-success">{emailMessage}</p>}
        {emailError && (
          <p role="alert" className="text-sm text-error">
            {emailError}
          </p>
        )}
      </form>

      <form onSubmit={handleUpdatePassword} className="flex flex-col gap-2 border-t border-bone pt-4">
        <label htmlFor="new-password" className="text-sm font-medium text-slate">
          Cambiar contraseña
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nueva contraseña"
          className="rounded-input border border-bone bg-warm-white px-4 py-2.5 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
        />
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmar contraseña"
          className="rounded-input border border-bone bg-warm-white px-4 py-2.5 text-charcoal placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-slate/40"
        />
        <button
          type="submit"
          disabled={passwordLoading}
          className="self-start rounded-button bg-charcoal px-4 py-2.5 text-sm font-medium text-warm-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {passwordLoading ? 'Guardando…' : 'Actualizar contraseña'}
        </button>
        {passwordMessage && <p className="text-sm text-success">{passwordMessage}</p>}
        {passwordError && (
          <p role="alert" className="text-sm text-error">
            {passwordError}
          </p>
        )}
      </form>
    </SettingsSection>
  )
}