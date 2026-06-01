import { LayoutDashboard, Film, Users } from 'lucide-react'

export const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    description: 'Resumen general del sistema',
  },
  {
    id: 'video-editing',
    label: 'Edición de Video',
    path: '/edicion-video',
    icon: Film,
    description: 'Proyectos y editor de video con IA',
  },
  {
    id: 'vendors',
    label: 'Vendedores',
    path: '/vendedores',
    icon: Users,
    description: 'Gestión del equipo comercial',
  },
]
