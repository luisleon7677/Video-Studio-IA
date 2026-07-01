import { LayoutDashboard, Film, Music2, Receipt, Sparkles, History, UsersRound } from 'lucide-react'

export const navItems = [
  // {
  //   id: 'dashboard',
  //   label: 'Dashboard',
  //   path: '/',
  //   icon: LayoutDashboard,
  //   description: 'Resumen general del sistema',
  // },
  {
    id: 'animations',
    label: 'Animaciones Remotion',
    path: '/animations',
    icon: Film,
    description: 'Plantillas de remotion',
  },
  {
    id: 'sounds',
    label: 'Audios',
    path: '/audios',
    icon: Music2,
    description: 'Efectos de sonido para videos',
  },
  // {
  //   id: 'ai-processing',
  //   label: 'Procesamiento con IA',
  //   path: '/procesamiento-ia',
  //   icon: Sparkles,
  //   description: 'Video + plantilla → montaje automático',
  // },
  {
    id: 'video-history',
    label: 'Historial de videos',
    path: '/historial-videos',
    icon: History,
    description: 'Videos generados por IA',
  },
  {
    id: 'sales-history',
    label: 'Historial de ventas',
    path: '/historial-ventas',
    icon: Receipt,
    description: 'Ventas por vendedor, código y canal',
  },
  {
    id: 'sellers',
    label: 'Vendedores',
    path: '/vendedores',
    icon: UsersRound,
    description: 'Directorio de vendedores por empresa',
  },
]
