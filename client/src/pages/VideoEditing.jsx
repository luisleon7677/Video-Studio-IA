import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Upload,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Scissors,
  FileVideo,
  Loader2,
  Sparkles,
  Download,
  Trash2,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Panel, { PanelHeader } from '../components/ui/Panel'
import Button from '../components/ui/Button'
import MonitorFrame from '../components/ui/MonitorFrame'
import EditingTimeline from '../components/video-editing/EditingTimeline'
import {
  mockKeyMoments,
  formatTimecode,
  formatTimeRange,
} from '../data/mock/videoEditing'

const ANALYSIS_MS = 2200

export default function VideoEditing() {
  const fileInputRef = useRef(null)
  const [video, setVideo] = useState(null)
  const [analysisStatus, setAnalysisStatus] = useState('idle')
  const [keyMoments, setKeyMoments] = useState([])
  const [fragments, setFragments] = useState([])
  const [selectedMomentId, setSelectedMomentId] = useState(null)
  const [playheadSec, setPlayheadSec] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const durationSec = video?.durationSec ?? 84

  const selectedMoment = useMemo(
    () => keyMoments.find((m) => m.id === selectedMomentId) ?? null,
    [keyMoments, selectedMomentId],
  )

  useEffect(() => {
    if (!isPlaying || !video) return undefined
    const id = window.setInterval(() => {
      setPlayheadSec((prev) => {
        if (prev >= durationSec - 0.1) {
          setIsPlaying(false)
          return durationSec
        }
        return prev + 0.5
      })
    }, 500)
    return () => window.clearInterval(id)
  }, [isPlaying, video, durationSec])

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setVideo({
      name: file.name,
      size: file.size,
      durationSec: 84,
    })
    setAnalysisStatus('idle')
    setKeyMoments([])
    setFragments([])
    setSelectedMomentId(null)
    setPlayheadSec(0)
    setIsPlaying(false)
  }, [])

  const runAnalysis = useCallback(() => {
    if (!video) return
    setAnalysisStatus('running')
    setKeyMoments([])
    setFragments([])
    setSelectedMomentId(null)

    window.setTimeout(() => {
      setKeyMoments(mockKeyMoments)
      setAnalysisStatus('done')
      setSelectedMomentId(mockKeyMoments[0]?.id ?? null)
      setPlayheadSec(mockKeyMoments[0]?.startSec ?? 0)
    }, ANALYSIS_MS)
  }, [video])

  const handleSelectMoment = useCallback(
    (id) => {
      setSelectedMomentId(id)
      const moment = keyMoments.find((m) => m.id === id)
      if (moment) setPlayheadSec(moment.startSec)
    },
    [keyMoments],
  )

  const handleCutMoment = useCallback(() => {
    if (!selectedMoment) return
    const exists = fragments.some((f) => f.sourceMomentId === selectedMoment.id)
    if (exists) return

    setFragments((prev) => [
      ...prev,
      {
        id: `clip-${selectedMoment.id}`,
        sourceMomentId: selectedMoment.id,
        label: selectedMoment.label,
        startSec: selectedMoment.startSec,
        endSec: selectedMoment.endSec,
      },
    ])
  }, [selectedMoment])

  const clearVideo = useCallback(() => {
    setVideo(null)
    setAnalysisStatus('idle')
    setKeyMoments([])
    setFragments([])
    setSelectedMomentId(null)
    setPlayheadSec(0)
    setIsPlaying(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Edición de Video"
        description="Carga un video, detecta momentos clave con el analizador Python y corta manualmente los fragmentos en la línea de tiempo."
        actions={
          video ? (
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" />
                Cambiar video
              </Button>
              <Button variant="secondary" size="md" onClick={clearVideo}>
                <Trash2 className="size-4" />
                Quitar
              </Button>
            </>
          ) : null
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <Panel padding={false}>
            <PanelHeader title="Fuente" meta={video ? 'Video cargado' : 'Sin archivo'} />
            <div className="space-y-3 p-4">
              {!video ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-3 rounded-lg border border-dashed border-border-subtle bg-muted/20 px-4 py-8 transition-colors hover:border-record/40 hover:bg-record/5 studio-focus-ring"
                >
                  <span className="flex size-11 items-center justify-center rounded-md bg-muted text-record">
                    <Upload className="size-5" />
                  </span>
                  <span className="text-sm font-medium">Cargar video</span>
                  <span className="text-center text-xs text-muted-foreground">
                    MP4, MOV, WebM · El analizador Python procesará el archivo
                  </span>
                </button>
              ) : (
                <div className="rounded-md bg-accent/50 p-3 ring-1 ring-border-subtle">
                  <div className="flex items-start gap-2.5">
                    <FileVideo className="mt-0.5 size-4 shrink-0 text-record" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{video.name}</p>
                      <p className="studio-timecode mt-1">
                        {formatTimecode(durationSec)} · {(video.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                disabled={!video || analysisStatus === 'running'}
                onClick={runAnalysis}
              >
                {analysisStatus === 'running' ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {analysisStatus === 'running'
                  ? 'Analizando momentos…'
                  : 'Detectar momentos clave'}
              </Button>

              {analysisStatus === 'done' ? (
                <p className="text-xs text-muted-foreground">
                  Script <span className="font-mono text-foreground/80">detect_key_moments.py</span>{' '}
                  completado · {keyMoments.length} marcadores
                </p>
              ) : null}
            </div>
          </Panel>

          <Panel padding={false}>
            <PanelHeader
              title="Momentos clave"
              meta={
                analysisStatus === 'done'
                  ? `${keyMoments.length} detectados`
                  : 'Pendiente de análisis'
              }
            />
            <ul className="max-h-64 divide-y divide-border-subtle overflow-y-auto">
              {keyMoments.length === 0 ? (
                <li className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Ejecuta el analizador para ver los puntos de corte sugeridos.
                </li>
              ) : (
                keyMoments.map((moment) => {
                  const isActive = selectedMomentId === moment.id
                  const isCut = fragments.some((f) => f.sourceMomentId === moment.id)
                  return (
                    <li key={moment.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectMoment(moment.id)}
                        className={`w-full px-4 py-3 text-left transition-colors studio-focus-ring ${
                          isActive ? 'bg-accent' : 'hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{moment.label}</p>
                          {isCut ? (
                            <span className="rounded bg-record/10 px-1.5 py-0.5 text-[10px] font-medium text-record">
                              Cortado
                            </span>
                          ) : (
                            <span className="studio-timecode">
                              {Math.round(moment.confidence * 100)}%
                            </span>
                          )}
                        </div>
                        <p className="studio-timecode mt-0.5">
                          {formatTimeRange(moment.startSec, moment.endSec)}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                          {moment.reason}
                        </p>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </Panel>
        </div>

        <div className="space-y-4">
          {!video ? (
            <div className="studio-panel flex min-h-[320px] items-center justify-center p-8">
              <p className="max-w-sm text-center text-sm text-muted-foreground">
                Sube un video para comenzar. Los momentos clave aparecerán en la línea de tiempo
                tras el análisis automático.
              </p>
            </div>
          ) : (
            <>
              <MonitorFrame
                timecode={`${formatTimecode(playheadSec)} / ${formatTimecode(durationSec)}`}
              >
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="relative z-10 flex size-14 items-center justify-center rounded-full bg-record text-primary-foreground shadow-md transition-[filter] hover:brightness-110 studio-focus-ring"
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? (
                    <Pause className="size-6" />
                  ) : (
                    <Play className="size-6 translate-x-0.5" fill="currentColor" />
                  )}
                </button>
              </MonitorFrame>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-subtle bg-card px-3 py-2">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-accent studio-focus-ring"
                    aria-label="Retroceder al marcador anterior"
                    onClick={() => {
                      const idx = keyMoments.findIndex((m) => m.id === selectedMomentId)
                      const prev = keyMoments[Math.max(0, idx - 1)]
                      if (prev) handleSelectMoment(prev.id)
                    }}
                    disabled={!keyMoments.length}
                  >
                    <SkipBack className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-record p-2 text-primary-foreground studio-focus-ring"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  >
                    {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-accent studio-focus-ring"
                    aria-label="Avanzar al siguiente marcador"
                    onClick={() => {
                      const idx = keyMoments.findIndex((m) => m.id === selectedMomentId)
                      const next = keyMoments[Math.min(keyMoments.length - 1, idx + 1)]
                      if (next) handleSelectMoment(next.id)
                    }}
                    disabled={!keyMoments.length}
                  >
                    <SkipForward className="size-4" />
                  </button>
                  <span className="ml-2 studio-timecode text-foreground/90">
                    {formatTimecode(playheadSec)} / {formatTimecode(durationSec)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!selectedMoment}
                    onClick={handleCutMoment}
                  >
                    <Scissors className="size-3.5" />
                    Cortar selección
                  </Button>
                  <Button variant="secondary" size="sm" disabled={!fragments.length}>
                    <Download className="size-3.5" />
                    Exportar clips
                  </Button>
                </div>
              </div>

              <Panel padding={false}>
                <PanelHeader
                  title="Montaje manual"
                  meta={
                    analysisStatus === 'done'
                      ? 'Marcadores IA · cortes manuales abajo'
                      : 'Esperando análisis'
                  }
                />
                <div className="p-4 sm:p-5">
                  {analysisStatus === 'done' ? (
                    <EditingTimeline
                      durationSec={durationSec}
                      keyMoments={keyMoments}
                      fragments={fragments}
                      playheadSec={playheadSec}
                      selectedMomentId={selectedMomentId}
                      onSelectMoment={handleSelectMoment}
                      onCutMoment={handleCutMoment}
                    />
                  ) : (
                    <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-subtle bg-muted/20 px-4 text-center">
                      {analysisStatus === 'running' ? (
                        <>
                          <Loader2 className="size-6 animate-spin text-record" />
                          <p className="text-sm text-muted-foreground">
                            Ejecutando detección de escenas y picos de audio…
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          La línea de tiempo se habilitará cuando el script Python termine de
                          marcar los momentos clave.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Panel>

              {selectedMoment && analysisStatus === 'done' ? (
                <div className="studio-panel border-record/20 bg-record/5 p-4">
                  <p className="studio-label mb-1">Segmento seleccionado</p>
                  <p className="font-medium">{selectedMoment.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedMoment.reason}</p>
                  <p className="studio-timecode mt-2">
                    {formatTimeRange(selectedMoment.startSec, selectedMoment.endSec)} · confianza{' '}
                    {Math.round(selectedMoment.confidence * 100)}%
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
