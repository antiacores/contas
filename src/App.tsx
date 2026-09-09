import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth/AuthProvider'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage'
import { UpdatePasswordPage } from './features/auth/UpdatePasswordPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { AccountsPage } from './features/accounts/AccountsPage'
import { CategoriesPage } from './features/categories/CategoriesPage'
import { MovementsPage } from './features/movements/MovementsPage'
import { BudgetsPage } from './features/budgets/BudgetsPage'
import { GoalsPage } from './features/goals/GoalsPage'
import { GoalDetailPage } from './features/goals/GoalDetailPage'
import { StatisticsPage } from './features/statistics/StatisticsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App