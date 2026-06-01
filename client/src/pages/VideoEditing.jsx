import {
  Plus,
  Upload,
  Scissors,
  Type,
  Music,
  Wand2,
  Download,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Layers,
  Image,
  Mic,
} from 'lucide-react'

const projects = [
  { id: 1, name: 'Promo Verano 2026', duration: '1:24', updated: 'Hace 2 h', thumbnail: 'from-chart-1/30 to-primary/20' },
  { id: 2, name: 'Catálogo Q2', duration: '2:45', updated: 'Ayer', thumbnail: 'from-chart-2/30 to-chart-3/20' },
  { id: 3, name: 'Reel Instagram', duration: '0:30', updated: 'Hace 3 días', thumbnail: 'from-chart-4/30 to-chart-5/20' },
]

const tools = [
  { icon: Scissors, label: 'Cortar' },
  { icon: Type, label: 'Texto' },
  { icon: Music, label: 'Audio' },
  { icon: Image, label: 'Imagen' },
  { icon: Mic, label: 'Voz IA' },
  { icon: Wand2, label: 'Efectos IA' },
  { icon: Layers, label: 'Capas' },
]

const timelineClips = [
  { label: 'Intro', width: '20%', color: 'bg-chart-1' },
  { label: 'Producto A', width: '35%', color: 'bg-primary' },
  { label: 'Transición', width: '10%', color: 'bg-chart-3' },
  { label: 'Producto B', width: '25%', color: 'bg-chart-2' },
  { label: 'Outro', width: '10%', color: 'bg-chart-4' },
]

export default function VideoEditing() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Edición de Video</h2>
          <p className="text-sm text-muted-foreground">
            Crea y edita proyectos de video con herramientas potenciadas por IA
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Upload className="size-4" />
            Importar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            <Plus className="size-4" />
            Nuevo proyecto
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Mis proyectos</h3>
          <ul className="space-y-2">
            {projects.map((project, index) => (
              <li key={project.id}>
                <button
                  type="button"
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    index === 0
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent hover:border-border hover:bg-accent'
                  }`}
                >
                  <div className={`mb-2 aspect-video rounded-md bg-gradient-to-br ${project.thumbnail}`} />
                  <p className="truncate text-sm font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.duration} · {project.updated}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-muted to-secondary">
              <button
                type="button"
                className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90"
                aria-label="Reproducir vista previa"
              >
                <Play className="size-7 translate-x-0.5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-lg p-2 hover:bg-accent" aria-label="Anterior">
                  <SkipBack className="size-4" />
                </button>
                <button type="button" className="rounded-lg bg-primary p-2 text-primary-foreground" aria-label="Pausar">
                  <Pause className="size-4" />
                </button>
                <button type="button" className="rounded-lg p-2 hover:bg-accent" aria-label="Siguiente">
                  <SkipForward className="size-4" />
                </button>
                <span className="ml-2 font-mono text-sm text-muted-foreground">00:32 / 01:24</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent"
              >
                <Download className="size-4" />
                Exportar
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Línea de tiempo</h3>
              <span className="text-xs text-muted-foreground">Promo Verano 2026</span>
            </div>
            <div className="mb-2 h-8 rounded-md bg-secondary" />
            <div className="flex h-12 gap-1 overflow-hidden rounded-md">
              {timelineClips.map((clip) => (
                <div
                  key={clip.label}
                  className={`${clip.color} flex items-center justify-center overflow-hidden rounded text-xs font-medium text-white`}
                  style={{ width: clip.width }}
                  title={clip.label}
                >
                  <span className="truncate px-1">{clip.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-6 rounded-md bg-secondary/60" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Herramientas de edición</h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {tools.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <Icon className="size-5 text-primary" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
        <Wand2 className="mx-auto size-8 text-primary" />
        <h3 className="mt-3 font-semibold">Asistente IA de edición</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Describe los cambios que necesitas y la IA generará cortes, transiciones y efectos automáticamente.
        </p>
        <div className="mx-auto mt-4 flex max-w-lg flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Ej: Añade una transición suave entre escenas..."
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Aplicar con IA
          </button>
        </div>
      </div>
    </div>
  )
}
