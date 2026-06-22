import { LayoutDashboard, Film, LayoutTemplate, Receipt, Sparkles, History } from 'lucide-react'

export const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    description: 'Resumen general del sistema',
  },
  // {
  //   id: 'video-editing',
  //   label: 'Edición de Video',
  //   path: '/edicion-video',
  //   icon: Film,
  //   description: 'Carga, detección de momentos y corte manual',
  // },
  {
    id: 'templates',
    label: 'Plantillas',
    path: '/plantillas',
    icon: LayoutTemplate,
    description: 'Prompts reutilizables para guiones y montaje',
  },
  {
    id: 'ai-processing',
    label: 'Procesamiento con IA',
    path: '/procesamiento-ia',
    icon: Sparkles,
    description: 'Video + plantilla → montaje automático',
  },
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
]
