import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/auth/useAuth'
import { AppLayout } from '../components/AppLayout'

// Reemplaza al viejo ProtectedRoute: en vez de envolver cada <Route> a mano,
// esto se usa UNA vez como ruta padre — todas las rutas hijas heredan
// automáticamente el chequeo de sesión y el layout con menú.
export function ProtectedLayout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-white">
        <p className="text-sm text-taupe">Cargando…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}