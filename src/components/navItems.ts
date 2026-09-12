import {
  LayoutDashboard,
  Wallet,
  Tag,
  ArrowRightLeft,
  PiggyBank,
  Target,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  // Para resaltar el item activo también en subrutas (ej. /ahorros/123 resalta "Ahorros").
  matchPrefix?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cuentas', label: 'Cuentas', icon: Wallet },
  { to: '/categorias', label: 'Categorías', icon: Tag },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowRightLeft },
  { to: '/presupuestos', label: 'Presupuestos', icon: PiggyBank },
  { to: '/ahorros', label: 'Ahorros', icon: Target, matchPrefix: true },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
]