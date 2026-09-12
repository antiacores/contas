import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth/AuthProvider'
import { SettingsProvider } from './lib/settings/SettingsProvider'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage'
import { UpdatePasswordPage } from './features/auth/UpdatePasswordPage'
import { DashboardPage } from './features/dashboard/DashboardPage'

// Code-splitting: cada una de estas pantallas se descarga solo cuando el
// usuario navega a su ruta, no de entrada al abrir la app. Esto le pega
// especialmente bien a Estadísticas (recharts) y Cuentas (dnd-kit), que son
// las dependencias más pesadas del proyecto.
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
const StatisticsPage = lazy(() =>
  import('./features/statistics/StatisticsPage').then((m) => ({ default: m.StatisticsPage })),
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
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cuentas"
                element={
                  <ProtectedRoute>
                    <AccountsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categorias"
                element={
                  <ProtectedRoute>
                    <CategoriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movimientos"
                element={
                  <ProtectedRoute>
                    <MovementsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/presupuestos"
                element={
                  <ProtectedRoute>
                    <BudgetsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/metas"
                element={
                  <ProtectedRoute>
                    <GoalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/metas/:goalId"
                element={
                  <ProtectedRoute>
                    <GoalDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estadisticas"
                element={
                  <ProtectedRoute>
                    <StatisticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuracion"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App