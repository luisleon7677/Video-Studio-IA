import {
  Plus,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  TrendingUp,
  Video,
  Star,
  Filter,
} from 'lucide-react'

const vendors = [
  {
    id: 1,
    name: 'María López',
    email: 'maria.lopez@empresa.com',
    phone: '+34 612 345 678',
    region: 'Madrid',
    projects: 12,
    videos: 34,
    performance: 94,
    status: 'Activo',
    avatar: 'ML',
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@empresa.com',
    phone: '+34 623 456 789',
    region: 'Barcelona',
    projects: 9,
    videos: 28,
    performance: 87,
    status: 'Activo',
    avatar: 'CR',
  },
  {
    id: 3,
    name: 'Ana Torres',
    email: 'ana.torres@empresa.com',
    phone: '+34 634 567 890',
    region: 'Valencia',
    projects: 15,
    videos: 42,
    performance: 98,
    status: 'Activo',
    avatar: 'AT',
  },
  {
    id: 4,
    name: 'Pedro Sánchez',
    email: 'pedro.sanchez@empresa.com',
    phone: '+34 645 678 901',
    region: 'Sevilla',
    projects: 6,
    videos: 18,
    performance: 72,
    status: 'Inactivo',
    avatar: 'PS',
  },
  {
    id: 5,
    name: 'Laura Méndez',
    email: 'laura.mendez@empresa.com',
    phone: '+34 656 789 012',
    region: 'Bilbao',
    projects: 3,
    videos: 7,
    performance: 81,
    status: 'Activo',
    avatar: 'LM',
  },
]

const summary = [
  { label: 'Total vendedores', value: '18', icon: Star },
  { label: 'Activos este mes', value: '15', icon: TrendingUp },
  { label: 'Videos entregados', value: '129', icon: Video },
]

function StatusBadge({ status }) {
  const isActive = status === 'Activo'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'bg-muted text-muted-foreground'
      }`}
    >
      {status}
    </span>
  )
}

export default function Vendors() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Vendedores</h2>
          <p className="text-sm text-muted-foreground">
            Administra tu equipo comercial y el rendimiento de sus proyectos de video
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
        >
          <Plus className="size-4" />
          Agregar vendedor
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
              </div>
              <div className="rounded-lg bg-secondary p-2.5 text-primary">
                <Icon className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold">Equipo comercial</h3>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar vendedor..."
                className="h-9 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              <Filter className="size-4" />
              Filtrar
            </button>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-5 py-3 font-medium">Vendedor</th>
                <th className="px-5 py-3 font-medium">Región</th>
                <th className="px-5 py-3 font-medium">Proyectos</th>
                <th className="px-5 py-3 font-medium">Videos</th>
                <th className="px-5 py-3 font-medium">Rendimiento</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="text-sm hover:bg-muted/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {vendor.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">{vendor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{vendor.region}</td>
                  <td className="px-5 py-4">{vendor.projects}</td>
                  <td className="px-5 py-4">{vendor.videos}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${vendor.performance}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{vendor.performance}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={vendor.status} />
                  </td>
                  <td className="px-5 py-4">
                    <button type="button" className="rounded-lg p-1.5 hover:bg-accent" aria-label="Más opciones">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border md:hidden">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {vendor.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">{vendor.region}</p>
                  </div>
                </div>
                <StatusBadge status={vendor.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span className="truncate text-xs">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5" />
                  <span className="text-xs">{vendor.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Proyectos: </span>
                  <span className="font-medium">{vendor.projects}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Videos: </span>
                  <span className="font-medium">{vendor.videos}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${vendor.performance}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{vendor.performance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
