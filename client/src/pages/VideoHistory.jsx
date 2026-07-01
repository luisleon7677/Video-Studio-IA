import { useEffect, useMemo, useState } from 'react'
import {
  Clapperboard,
  Download,
  ExternalLink,
  Loader2,
  Play,
  Search,
  Sparkles,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import MetricTile from '../components/ui/MetricTile'
import VideoStatusBadge from '../components/videos/VideoStatusBadge'
import { fetchRemotionVideoHistory } from '../api/video-history'
import { videoStatuses } from '../data/mock/videoHistory'

export default function VideoHistory() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadVideos() {
      setIsLoading(true)
      setError('')

      try {
        const result = await fetchRemotionVideoHistory()
        if (!isActive) return
        setVideos(result.items ?? [])
      } catch (loadError) {
        if (!isActive) return
        setError(loadError.message || 'No se pudo cargar el historial de videos.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadVideos()

    return () => {
      isActive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return videos.filter((video) => {
      const matchesStatus = statusFilter === 'all' || getStatusKey(video.status) === statusFilter
      const matchesSearch =
        !query ||
        video.name.toLowerCase().includes(query) ||
        video.url.toLowerCase().includes(query)

      return matchesStatus && matchesSearch
    })
  }, [search, statusFilter, videos])

  const completedCount = videos.filter((video) => getStatusKey(video.status) === 'completed').length

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Historial de videos"
        description="Videos finales renderizados con Remotion y almacenados en S3."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricTile
          label="Videos Remotion"
          value={String(videos.length)}
          icon={Clapperboard}
          accent="text-record"
        />
        <MetricTile
          label="Listos en S3"
          value={String(completedCount)}
          icon={Sparkles}
          accent="text-chart-1"
        />
        <MetricTile
          label="Tipo de video"
          value="1"
          icon={Play}
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre o URL..."
                className="h-8 w-full min-w-[200px] rounded-md border border-border-soft bg-input pl-8 pr-3 text-sm studio-focus-ring sm:w-52"
              />
            </div>
            <div className="flex rounded-md border border-border-soft p-0.5">
              {videoStatuses.map((status) => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => setStatusFilter(status.id)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors studio-focus-ring ${
                    statusFilter === status.id
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error ? (
          <div className="border-b border-border-subtle px-5 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="studio-label px-5 py-2.5">Video generado</th>
                <th className="studio-label px-5 py-2.5">Ubicacion S3</th>
                <th className="studio-label px-5 py-2.5">Tipo</th>
                <th className="studio-label px-5 py-2.5">Estado</th>
                <th className="studio-label px-5 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Cargando historial...
                    </span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    No hay videos Remotion que coincidan con la busqueda.
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
                          <p className="truncate font-medium">{video.name}</p>
                          <p className="studio-timecode text-[10px]">ID {video.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[360px] truncate px-5 py-3.5 text-muted-foreground">
                      {video.url}
                    </td>
                    <td className="px-5 py-3.5 font-mono tabular-nums">{video.type}</td>
                    <td className="px-5 py-3.5">
                      <VideoStatusBadge status={getStatusKey(video.status)} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <a
                          href={video.url}
                          download
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground studio-focus-ring"
                          aria-label="Descargar"
                        >
                          <Download className="size-4" />
                        </a>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground studio-focus-ring"
                          aria-label="Abrir"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:hidden">
          {isLoading ? (
            <p className="col-span-full inline-flex items-center justify-center gap-2 py-6 text-center text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Cargando historial...
            </p>
          ) : filtered.length === 0 ? (
            <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
              No hay videos Remotion que coincidan con la busqueda.
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
                      <p className="truncate font-medium">{video.name}</p>
                      <p className="studio-timecode mt-0.5">ID {video.id}</p>
                    </div>
                  </div>
                  <VideoStatusBadge status={getStatusKey(video.status)} />
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                  <dt className="text-muted-foreground">Tipo</dt>
                  <dd className="font-mono tabular-nums">{video.type}</dd>
                  <dt className="text-muted-foreground">S3</dt>
                  <dd className="truncate font-medium">{video.url}</dd>
                </dl>
                <div className="flex gap-2 pt-1">
                  <a
                    href={video.url}
                    download
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-border-subtle bg-card px-3 text-xs font-medium text-foreground transition hover:bg-accent studio-focus-ring"
                  >
                    <Download className="size-3.5" />
                    Descargar
                  </a>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border-subtle bg-card px-3 text-xs font-medium text-foreground transition hover:bg-accent studio-focus-ring"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </Panel>
    </div>
  )
}

function getStatusKey(status) {
  if (status === 2) return 'processing'
  if (status === 3) return 'failed'
  return 'completed'
}
