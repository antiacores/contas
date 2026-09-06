import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AuthLayout } from './AuthLayout'
import { FormField } from './components/FormField'
import { SubmitButton } from './components/SubmitButton'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-contrasena`,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AuthLayout title="Revisa tu correo" subtitle="Te enviamos un enlace para recuperar tu contraseña.">
        <p className="text-center text-sm text-taupe">
          Si <span className="font-medium text-charcoal">{email}</span> tiene una cuenta, en unos
          minutos recibirás un correo con instrucciones.
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
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace a tu correo."
      footer={
        <Link to="/login" className="font-medium text-charcoal underline">
          Volver a iniciar sesión
        </Link>
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

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        <SubmitButton loading={loading}>Enviar enlace</SubmitButton>
      </form>
    </AuthLayout>
  )
}