import {
  LayoutDashboard,
  Wallet,
  Tag,
  ArrowRightLeft,
  Gauge,
  PiggyBank,
  Repeat,
  HandCoins,
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
  { to: '/presupuestos', label: 'Presupuestos', icon: Gauge },
  { to: '/ahorros', label: 'Ahorros', icon: PiggyBank, matchPrefix: true },
  { to: '/suscripciones', label: 'Suscripciones', icon: Repeat },
  { to: '/deudas', label: 'Deudas', icon: HandCoins },
]

// Barra de abajo en móvil: solo 4 destinos (más el botón "+" central, que no
// es una ruta de navegación sino la acción de agregar movimiento). Categorías
// se edita desde dentro de Presupuestos; Ahorros/Suscripciones/Deudas se
// acceden como accesos rápidos desde el Dashboard.
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowRightLeft },
  { to: '/presupuestos', label: 'Presupuestos', icon: Gauge },
  { to: '/cuentas', label: 'Cuentas', icon: Wallet },
]