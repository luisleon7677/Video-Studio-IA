import { useMemo, useState } from 'react'
import {
  Search,
  Filter,
  Clapperboard,
  Sparkles,
  HardDrive,
  Download,
  Play,
  ExternalLink,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Panel, { PanelHeader } from '../components/ui/Panel'
import Button from '../components/ui/Button'
import MetricTile from '../components/ui/MetricTile'
import VideoStatusBadge from '../components/videos/VideoStatusBadge'
import {
  generatedVideos,
  videoStatuses,
  formatGeneratedAt,
  formatDuration,
  formatFileSize,
} from '../data/mock/videoHistory'

export default function VideoHistory() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return generatedVideos
      .filter((video) => statusFilter === 'all' || video.status === statusFilter)
      .filter((video) => {
        if (!query) return true
        return (
          video.fileName.toLowerCase().includes(query) ||
          video.sourceFileName.toLowerCase().includes(query) ||
          video.templateName.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
  }, [statusFilter, search])

  const completedCount = generatedVideos.filter((v) => v.status === 'completed').length
  const totalSize = generatedVideos
    .filter((v) => v.status === 'completed')
    .reduce((sum, v) => sum + v.sizeBytes, 0)

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Historial de videos"
        description="Todos los videos generados por el procesamiento con IA: plantilla aplicada, fecha de creación y estado del render."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricTile
          label="Videos generados"
          value={String(generatedVideos.length)}
          icon={Clapperboard}
          accent="text-record"
        />
        <MetricTile
          label="Completados"
          value={String(completedCount)}
          icon={Sparkles}
          accent="text-chart-1"
        />
        <MetricTile
          label="Almacenamiento IA"
          value={formatFileSize(totalSize)}
          icon={HardDrive}
          accent="text-chart-2"
        />
      </div>

      <Panel padding={false}>
        <div className="flex flex-col gap-3 border-b border-border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Biblioteca de salida</h3>
            <p className="studio-timecode mt-0.5">{filtered.length} videos</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Archivo o plantilla…"
                className="h-8 w-full min-w-[200px] rounded-md border border-border-soft bg-input pl-8 pr-3 text-sm studio-focus-ring sm:w-52"
              />
            </div>
            <div className="flex rounded-md border border-border-soft p-0.5">
              {videoStatuses.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors studio-focus-ring ${
                    statusFilter === st.id
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm">
              <Filter className="size-3.5" />
              Más filtros
            </Button>
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="studio-label px-5 py-2.5">Video generado</th>
                <th className="studio-label px-5 py-2.5">Origen</th>
                <th className="studio-label px-5 py-2.5">Plantilla</th>
                <th className="studio-label px-5 py-2.5">Generado</th>
                <th className="studio-label px-5 py-2.5">Duración</th>
                <th className="studio-label px-5 py-2.5">Estado</th>
                <th className="studio-label px-5 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    No hay videos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filtered.map((video) => (
                  <tr
                    key={video.id}
                    className="transition-colors hover:bg-accent/30 [content-visibility:auto] [contain-intrinsic-size:0_64px]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-viewport ring-1 ring-border-soft">
                          <Play className="size-3.5 text-record" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{video.fileName}</p>
                          <p className="studio-timecode text-[10px]">
                            {formatFileSize(video.sizeBytes)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[140px] truncate px-5 py-3.5 text-muted-foreground">
                      {video.sourceFileName}
                    </td>
                    <td className="max-w-[160px] truncate px-5 py-3.5">{video.templateName}</td>
                    <td className="px-5 py-3.5">
                      <time dateTime={video.generatedAt} className="studio-timecode whitespace-nowrap">
                        {formatGeneratedAt(video.generatedAt)}
                      </time>
                    </td>
                    <td className="px-5 py-3.5 font-mono tabular-nums">
                      {formatDuration(video.durationSec)}
                    </td>
                    <td className="px-5 py-3.5">
                      <VideoStatusBadge status={video.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={video.status !== 'completed'}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 studio-focus-ring"
                          aria-label="Descargar"
                        >
                          <Download className="size-4" />
                        </button>
                        <button
                          type="button"
                          disabled={video.status !== 'completed'}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 studio-focus-ring"
                          aria-label="Abrir"
                        >
                          <ExternalLink className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:hidden">
          {filtered.length === 0 ? (
            <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
              No hay videos que coincidan con la búsqueda.
            </p>
          ) : (
            filtered.map((video) => (
              <article
                key={video.id}
                className="studio-panel space-y-3 p-4 [content-visibility:auto]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-viewport">
                      <Play className="size-4 text-record" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{video.fileName}</p>
                      <p className="studio-timecode mt-0.5">{formatGeneratedAt(video.generatedAt)}</p>
                    </div>
                  </div>
                  <VideoStatusBadge status={video.status} />
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                  <dt className="text-muted-foreground">Origen</dt>
                  <dd className="truncate font-medium">{video.sourceFileName}</dd>
                  <dt className="text-muted-foreground">Plantilla</dt>
                  <dd className="truncate">{video.templateName}</dd>
                  <dt className="text-muted-foreground">Duración</dt>
                  <dd className="font-mono tabular-nums">{formatDuration(video.durationSec)}</dd>
                  <dt className="text-muted-foreground">Tamaño</dt>
                  <dd className="font-mono tabular-nums">{formatFileSize(video.sizeBytes)}</dd>
                </dl>
                {video.status === 'completed' ? (
                  <div className="flex gap-2 pt-1">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Download className="size-3.5" />
                      Descargar
                    </Button>
                    <Button variant="secondary" size="sm">
                      <ExternalLink className="size-3.5" />
                    </Button>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </Panel>
    </div>
  )
}
