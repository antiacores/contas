import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AuthLayout } from './AuthLayout'
import { FormField } from './components/FormField'
import { SubmitButton } from './components/SubmitButton'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const { error: signUpError } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AuthLayout title="Revisa tu correo" subtitle="Te enviamos un enlace para confirmar tu cuenta.">
        <p className="text-center text-sm text-taupe">
          Abre el correo que enviamos a <span className="font-medium text-charcoal">{email}</span> y
          sigue el enlace para activar tu cuenta.
        </p>
        <Link
          to="/login"
          className="mt-6 block text-center text-sm font-medium text-charcoal underline"
        >
          Volver a iniciar sesión
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a ordenar tus finanzas."
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-charcoal underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          id="email"
          label="Correo"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormField
          id="confirm-password"
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        <SubmitButton loading={loading}>Crear cuenta</SubmitButton>
      </form>
    </AuthLayout>
  )
}