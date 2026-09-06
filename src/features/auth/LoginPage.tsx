import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AuthLayout } from './AuthLayout'
import { FormField } from './components/FormField'
import { SubmitButton } from './components/SubmitButton'
import { GoogleButton } from './components/GoogleButton'
import { Divider } from './components/Divider'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (signInError) {
      setError(
        signInError.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos.'
          : signInError.message,
      )
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <AuthLayout
      title="Contas"
      subtitle="Tus finanzas, en orden."
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-medium text-charcoal underline">
            Crea una
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        <SubmitButton loading={loading}>Iniciar sesión</SubmitButton>

        <Link
          to="/recuperar-contrasena"
          className="text-center text-sm text-taupe underline hover:text-slate"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
            <div className="mt-6 flex flex-col gap-4">
        <Divider label="o" />
        <GoogleButton />
      </div>
    </AuthLayout>
  )
}