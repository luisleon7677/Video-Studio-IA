import { Film, Users, Clock, Sparkles } from 'lucide-react'

export const dashboardStats = [
  { label: 'Proyectos activos', value: '24', delta: '+12%', icon: Film, accent: 'text-chart-1' },
  { label: 'Vendedores activos', value: '18', delta: '+3', icon: Users, accent: 'text-chart-2' },
  { label: 'Videos generados', value: '156', delta: '+28%', icon: Sparkles, accent: 'text-record' },
  { label: 'Horas ahorradas', value: '342h', delta: '+15%', icon: Clock, accent: 'text-chart-3' },
]

export const recentProjects = [
  { name: 'Promo Verano 2026', vendor: 'María López', status: 'En edición', progress: 72 },
  { name: 'Catálogo Productos Q2', vendor: 'Carlos Ruiz', status: 'Renderizando', progress: 45 },
  { name: 'Testimonial Cliente A', vendor: 'Ana Torres', status: 'Completado', progress: 100 },
  { name: 'Reel Instagram', vendor: 'Pedro Sánchez', status: 'Borrador', progress: 18 },
]

export const recentActivity = [
  { action: 'Video exportado', detail: 'Promo Verano 2026 — 1080p', time: 'Hace 12 min' },
  { action: 'Nuevo vendedor', detail: 'Laura Méndez se unió al equipo', time: 'Hace 1 h' },
  { action: 'IA completó guion', detail: 'Catálogo Productos Q2', time: 'Hace 2 h' },
  { action: 'Proyecto creado', detail: 'Reel Instagram — Pedro Sánchez', time: 'Hace 4 h' },
]

export const monthlyPerformance = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88]

export const MONTH_LABELS = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
