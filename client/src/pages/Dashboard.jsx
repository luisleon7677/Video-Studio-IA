import {
  Film,
  Users,
  TrendingUp,
  Clock,
  Play,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'

const stats = [
  { label: 'Proyectos activos', value: '24', change: '+12%', icon: Film, color: 'text-chart-1' },
  { label: 'Vendedores activos', value: '18', change: '+3', icon: Users, color: 'text-chart-2' },
  { label: 'Videos generados', value: '156', change: '+28%', icon: Sparkles, color: 'text-primary' },
  { label: 'Horas ahorradas', value: '342h', change: '+15%', icon: Clock, color: 'text-chart-3' },
]

const recentProjects = [
  { name: 'Promo Verano 2026', vendor: 'María López', status: 'En edición', progress: 72 },
  { name: 'Catálogo Productos Q2', vendor: 'Carlos Ruiz', status: 'Renderizando', progress: 45 },
  { name: 'Testimonial Cliente A', vendor: 'Ana Torres', status: 'Completado', progress: 100 },
  { name: 'Reel Instagram', vendor: 'Pedro Sánchez', status: 'Borrador', progress: 18 },
]

const activity = [
  { action: 'Video exportado', detail: 'Promo Verano 2026 — 1080p', time: 'Hace 12 min' },
  { action: 'Nuevo vendedor', detail: 'Laura Méndez se unió al equipo', time: 'Hace 1 h' },
  { action: 'IA completó guion', detail: 'Catálogo Productos Q2', time: 'Hace 2 h' },
  { action: 'Proyecto creado', detail: 'Reel Instagram — Pedro Sánchez', time: 'Hace 4 h' },
]

function StatCard({ label, value, change, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`rounded-lg bg-secondary p-2.5 ${color}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <TrendingUp className="size-3.5 text-primary" />
        <span className="font-medium text-primary">{change}</span>
        <span>vs. mes anterior</span>
      </p>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bienvenido a Video Studio IA</h2>
            <p className="mt-1 max-w-xl text-muted-foreground">
              Crea, edita y gestiona videos con inteligencia artificial. Aquí tienes un resumen de tu actividad.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            <Play className="size-4" />
            Nuevo proyecto
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-semibold">Proyectos recientes</h3>
            <button type="button" className="flex items-center gap-1 text-sm text-primary hover:underline">
              Ver todos
              <ArrowUpRight className="size-4" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentProjects.map((project) => (
              <div key={project.name} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.vendor}</p>
                </div>
                <div className="flex items-center gap-4 sm:w-64">
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">{project.status}</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-semibold">Actividad reciente</h3>
          </div>
          <ul className="divide-y divide-border">
            {activity.map((item) => (
              <li key={item.detail} className="px-5 py-4">
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 font-semibold">Rendimiento mensual</h3>
        <div className="flex h-48 items-end justify-between gap-2 sm:gap-4">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-primary/20 transition-all hover:bg-primary/40"
                style={{ height: `${height}%` }}
              />
              <span className="hidden text-xs text-muted-foreground sm:block">
                {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
