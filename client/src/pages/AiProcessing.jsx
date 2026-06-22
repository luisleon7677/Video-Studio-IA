import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Upload,
  FileVideo,
  Sparkles,
  Shuffle,
  Loader2,
  CheckCircle2,
  Download,
  RotateCcw,
  Trash2,
  Bot,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Panel, { PanelHeader } from '../components/ui/Panel'
import Button from '../components/ui/Button'
import MonitorFrame from '../components/ui/MonitorFrame'
import { fetchTemplates } from '../api/templates'
import { formatTimecode } from '../data/mock/videoEditing'
import { contentPreview, formatTemplateDate } from '../utils/templates'

const PROCESS_STEPS = [
  'Analizando contenido del video…',
  'Interpretando plantilla de prompt…',
  'Aplicando modelo de edición IA…',
  'Generando cortes y transiciones…',
  'Renderizando video final…',
]

const PROCESS_MS = 4500

function pickRandomTemplate(templates) {
  if (!templates.length) return null
  const index = Math.floor(Math.random() * templates.length)
  return templates[index]
}

export default function AiProcessing() {
  const fileInputRef = useRef(null)
  const [templates, setTemplates] = useState([])
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [templatesError, setTemplatesError] = useState('')
  const [video, setVideo] = useState(null)
  const [selectionMode, setSelectionMode] = useState('manual')
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [processStatus, setProcessStatus] = useState('idle')
  const [processStep, setProcessStep] = useState(0)
  const [processProgress, setProcessProgress] = useState(0)
  const [resultMeta, setResultMeta] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadTemplates() {
      setTemplatesLoading(true)
      setTemplatesError('')

      try {
        const data = await fetchTemplates()
        if (cancelled) return

        setTemplates(data.items)
        setSelectedTemplateId((current) => {
          if (current && data.items.some((tpl) => tpl.id === current)) return current
          return data.items[0]?.id ?? null
        })
      } catch (err) {
        if (!cancelled) {
          setTemplatesError(err.message)
          setTemplates([])
          setSelectedTemplateId(null)
        }
      } finally {
        if (!cancelled) setTemplatesLoading(false)
      }
    }

    void loadTemplates()
    return () => {
      cancelled = true
    }
  }, [])

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) ?? templates[0] ?? null,
    [templates, selectedTemplateId],
  )

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setVideo({
      name: file.name,
      size: file.size,
      durationSec: 84,
    })
    setProcessStatus('idle')
    setProcessStep(0)
    setProcessProgress(0)
    setResultMeta(null)
  }, [])

  const handleRandomTemplate = useCallback(() => {
    const random = pickRandomTemplate(templates)
    if (!random) return
    setSelectionMode('random')
    setSelectedTemplateId(random.id)
  }, [templates])

  const handleManualSelect = useCallback((id) => {
    setSelectionMode('manual')
    setSelectedTemplateId(id)
  }, [])

  const clearVideo = useCallback(() => {
    setVideo(null)
    setProcessStatus('idle')
    setProcessStep(0)
    setProcessProgress(0)
    setResultMeta(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const runProcessing = useCallback(() => {
    if (!video || !selectedTemplate) return

    setProcessStatus('processing')
    setProcessStep(0)
    setProcessProgress(0)
    setResultMeta(null)

    const stepInterval = PROCESS_MS / PROCESS_STEPS.length
    let step = 0

    const stepTimer = window.setInterval(() => {
      step += 1
      setProcessStep(step)
      setProcessProgress(Math.min(100, Math.round((step / PROCESS_STEPS.length) * 100)))
      if (step >= PROCESS_STEPS.length) window.clearInterval(stepTimer)
    }, stepInterval)

    window.setTimeout(() => {
      window.clearInterval(stepTimer)
      setProcessStatus('done')
      setProcessProgress(100)
      setResultMeta({
        fileName: video.name.replace(/\.[^.]+$/, '_ia.mp4'),
        durationSec: video.durationSec,
        templateName: selectedTemplate.name,
        processedAt: new Date().toISOString(),
      })
    }, PROCESS_MS + 200)
  }, [video, selectedTemplate])

  const resetForNewRun = useCallback(() => {
    setProcessStatus('idle')
    setProcessStep(0)
    setProcessProgress(0)
    setResultMeta(null)
  }, [])

  const canProcess = video && selectedTemplate && processStatus !== 'processing'

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Procesamiento con IA"
        description="Carga un video, elige una plantilla de prompt (manual o aleatoria) y genera un montaje editado con el modelo de inteligencia artificial."
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="grid gap-3 sm:grid-cols-4">
        {['Cargar video', 'Elegir plantilla', 'Procesar con IA', 'Video editado'].map(
          (label, index) => {
            const stepDone =
              (index === 0 && video) ||
              (index === 1 && selectedTemplate) ||
              (index === 2 && processStatus === 'done') ||
              (index === 3 && resultMeta)
            const stepActive =
              (index === 0 && !video) ||
              (index === 1 && video && processStatus === 'idle') ||
              (index === 2 && video && processStatus === 'processing') ||
              (index === 3 && processStatus === 'done')

            return (
              <div
                key={label}
                className={`studio-panel flex items-center gap-2.5 px-3 py-2.5 ${
                  stepActive ? 'ring-1 ring-record/30' : ''
                }`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                    stepDone
                      ? 'bg-record text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepDone ? '✓' : index + 1}
                </span>
                <span className="text-xs font-medium">{label}</span>
              </div>
            )
          },
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Panel padding={false}>
            <PanelHeader title="Video de entrada" meta={video ? 'Listo' : 'Pendiente'} />
            <div className="p-4">
              {!video ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-3 rounded-lg border border-dashed border-border-subtle bg-muted/20 px-4 py-10 transition-colors hover:border-record/40 hover:bg-record/5 studio-focus-ring"
                >
                  <Upload className="size-6 text-record" />
                  <span className="text-sm font-medium">Cargar video</span>
                  <span className="text-xs text-muted-foreground">MP4, MOV, WebM</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 rounded-md bg-accent/50 p-3 ring-1 ring-border-subtle">
                    <FileVideo className="mt-0.5 size-4 shrink-0 text-record" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{video.name}</p>
                      <p className="studio-timecode mt-1">
                        {formatTimecode(video.durationSec)} ·{' '}
                        {(video.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearVideo}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground studio-focus-ring"
                      aria-label="Quitar video"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Cambiar archivo
                  </Button>
                </div>
              )}
            </div>
          </Panel>

          <Panel padding={false}>
            <PanelHeader
              title="Plantilla de prompt"
              meta={
                selectionMode === 'random'
                  ? 'Selección aleatoria'
                  : 'Selección manual'
              }
            />
            <div className="space-y-3 p-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleRandomTemplate}
                disabled={templatesLoading || templates.length === 0}
              >
                <Shuffle className="size-4" />
                Elegir plantilla al azar
              </Button>

              <p className="studio-label">O selecciona manualmente</p>
              {templatesError ? (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {templatesError}
                </p>
              ) : templatesLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin text-record" />
                  Cargando plantillas…
                </div>
              ) : templates.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No hay plantillas en la base de datos. Crea una en el módulo Plantillas.
                </p>
              ) : (
                <ul className="max-h-48 space-y-1 overflow-y-auto">
                  {templates.map((tpl) => {
                    const isSelected = selectedTemplateId === tpl.id
                    return (
                      <li key={tpl.id}>
                        <button
                          type="button"
                          onClick={() => handleManualSelect(tpl.id)}
                          className={`w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors studio-focus-ring ${
                            isSelected && selectionMode === 'manual'
                              ? 'studio-nav-active font-medium'
                              : isSelected && selectionMode === 'random'
                                ? 'bg-record/10 ring-1 ring-record/25'
                                : 'hover:bg-accent/60'
                          }`}
                        >
                          <span className="block truncate">{tpl.name}</span>
                          <span className="studio-timecode mt-0.5 block truncate text-[10px]">
                            {formatTemplateDate(tpl.updatedAt)} · {contentPreview(tpl.content, 48)}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel padding={false}>
            <PanelHeader
              title="Prompt aplicado"
              meta={selectedTemplate?.name ?? '—'}
            />
            <div className="p-4">
              <pre className="studio-inset max-h-40 overflow-auto whitespace-pre-wrap p-3 font-mono text-[11px] leading-relaxed text-foreground/90">
                {selectedTemplate?.content ?? 'Selecciona una plantilla.'}
              </pre>
            </div>
          </Panel>

          <Panel padding={false}>
            <PanelHeader
              title="Motor IA"
              meta={processStatus === 'done' ? 'Completado' : 'Listo para procesar'}
            />
            <div className="space-y-4 p-4">
              {processStatus === 'processing' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-record" />
                    {PROCESS_STEPS[Math.min(processStep, PROCESS_STEPS.length - 1)]}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-record transition-[width] duration-300"
                      style={{ width: `${processProgress}%` }}
                    />
                  </div>
                  <p className="studio-timecode">{processProgress}%</p>
                </div>
              ) : processStatus === 'done' && resultMeta ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 rounded-md bg-record/10 p-3 ring-1 ring-record/20">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-record" />
                    <div>
                      <p className="text-sm font-medium">Procesamiento completado</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Plantilla: {resultMeta.templateName}
                      </p>
                    </div>
                  </div>

                  <MonitorFrame timecode={`00:00 / ${formatTimecode(resultMeta.durationSec)}`}>
                    <div className="relative z-10 text-center">
                      <Bot className="mx-auto size-10 text-record/80" />
                      <p className="mt-2 text-sm font-medium text-foreground/90">
                        Video editado con IA
                      </p>
                      <p className="studio-timecode mt-1">{resultMeta.fileName}</p>
                    </div>
                  </MonitorFrame>

                  <div className="flex flex-wrap gap-2">
                    <Button>
                      <Download className="size-4" />
                      Descargar video
                    </Button>
                    <Button variant="secondary" onClick={resetForNewRun}>
                      <RotateCcw className="size-4" />
                      Nuevo procesamiento
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    El modelo aplicará la plantilla sobre el video cargado para generar cortes,
                    transiciones y estructura narrativa automáticamente.
                  </p>
                  <Button className="w-full" disabled={!canProcess} onClick={runProcessing}>
                    <Sparkles className="size-4" />
                    Procesar video con IA
                  </Button>
                </>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
