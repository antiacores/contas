import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth/AuthProvider'
import { SettingsProvider } from './lib/settings/SettingsProvider'
import { ProtectedLayout } from './routes/ProtectedLayout'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage'
import { UpdatePasswordPage } from './features/auth/UpdatePasswordPage'

// Code-splitting: cada una de estas pantallas se descarga solo cuando el
// usuario navega a su ruta, no de entrada al abrir la app. Dashboard va aquí
// también porque ahora incluye las gráficas de recharts — así login/registro
// (lo primero que ve cualquiera sin sesión) se mantienen ligeros.
const DashboardPage = lazy(() =>
  import('./features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const AccountsPage = lazy(() =>
  import('./features/accounts/AccountsPage').then((m) => ({ default: m.AccountsPage })),
)
const CategoriesPage = lazy(() =>
  import('./features/categories/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
)
const MovementsPage = lazy(() =>
  import('./features/movements/MovementsPage').then((m) => ({ default: m.MovementsPage })),
)
const BudgetsPage = lazy(() =>
  import('./features/budgets/BudgetsPage').then((m) => ({ default: m.BudgetsPage })),
)
const GoalsPage = lazy(() =>
  import('./features/goals/GoalsPage').then((m) => ({ default: m.GoalsPage })),
)
const GoalDetailPage = lazy(() =>
  import('./features/goals/GoalDetailPage').then((m) => ({ default: m.GoalDetailPage })),
)
const SubscriptionsPage = lazy(() =>
  import('./features/subscriptions/SubscriptionsPage').then((m) => ({ default: m.SubscriptionsPage })),
)
const SettingsPage = lazy(() =>
  import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-white">
      <p className="text-sm text-stone">Cargando…</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
              <Route path="/actualizar-contrasena" element={<UpdatePasswordPage />} />

              {/* Todas las rutas de aquí abajo comparten el menú lateral y el
                  chequeo de sesión, gracias a ProtectedLayout + <Outlet />. */}
              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/cuentas" element={<AccountsPage />} />
                <Route path="/categorias" element={<CategoriesPage />} />
                <Route path="/movimientos" element={<MovementsPage />} />
                <Route path="/presupuestos" element={<BudgetsPage />} />
                <Route path="/ahorros" element={<GoalsPage />} />
                <Route path="/ahorros/:goalId" element={<GoalDetailPage />} />
                <Route path="/suscripciones" element={<SubscriptionsPage />} />
                <Route path="/configuracion" element={<SettingsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App