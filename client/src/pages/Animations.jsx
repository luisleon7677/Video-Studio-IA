import { useCallback, useMemo, useState } from 'react'
import { Player } from '@remotion/player'
import { ArrowLeft, CheckCircle2, Clapperboard, FileVideo, Loader2, Play, UploadCloud } from 'lucide-react'
import { renderAnimationVideo, uploadAnimationVideo } from '../api/api-remotion'
import { CinematicZoomCelebration } from '../remotion/templates/Cinema'
import { VentaAnimada } from '../remotion/templates/VentaAnimada'
import { VentaSimple } from '../remotion/templates/VentaSimple'
import { SaleScene } from '../remotion/templates/TemplateProps'

const DEFAULT_VIDEO_URL =
  'https://universityibc.s3.us-east-1.amazonaws.com/dashboard/video_studio/plantillas_remotion/venta4.mp4'
const DEFAULT_SELLER_NAME = 'Luis'

const templates = [
  {
    id: 'sale-scene',
    compositionId: 'sale-scene',
    name: 'Escena Venta',
    description: 'Venta personalizada con video de fondo y nombre del vendedor.',
    component: SaleScene,
    durationInFrames: 300,
    width: 1080,
    height: 1920,
    defaultProps: {
      videoUrl:
        'https://universityibc.s3.us-east-1.amazonaws.com/dashboard/video_studio/plantillas_remotion/testventa.mp4',
      nombre: 'Venta Props',
    },
  },
  {
    id: 'cinema',
    compositionId: 'CinematicZoomCelebration',
    name: 'Cinema',
    description: 'Celebracion cinematica con zoom, confeti y tarjeta de venta.',
    component: CinematicZoomCelebration,
    durationInFrames: 390,
    width: 1920,
    height: 1080,
    defaultProps: {
      videoUrl: DEFAULT_VIDEO_URL,
      nombre: 'Juan Perez',
    },
  },
  {
    id: 'venta-animada',
    compositionId: 'VentaAnimada',
    name: 'Venta animada',
    description: 'Oferta directa con video base, texto principal y llamado a la accion.',
    component: VentaAnimada,
    durationInFrames: 390,
    width: 1080,
    height: 1920,
    defaultProps: {
      videoUrl: DEFAULT_VIDEO_URL,
      nombre: DEFAULT_SELLER_NAME,
    },
  },
  {
    id: 'venta-simple',
    compositionId: 'VentaSimple',
    name: 'Venta simple',
    description: 'Oferta vertical con lista de beneficios y llamado a la accion.',
    component: VentaSimple,
    durationInFrames: 390,
    width: 1080,
    height: 1920,
    defaultProps: {
      videoUrl: undefined,
      nombre: DEFAULT_SELLER_NAME,
    },
  },
]

const initialStatus = {
  type: '',
  message: '',
}

export default function Animation() {
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('')
  const [uploadStatus, setUploadStatus] = useState(initialStatus)
  const [renderStatus, setRenderStatus] = useState(initialStatus)
  const [isUploading, setIsUploading] = useState(false)
  const [isRendering, setIsRendering] = useState(false)

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [selectedTemplateId],
  )

  const previewProps = useMemo(() => {
    const defaults = selectedTemplate?.defaultProps ?? {
      videoUrl: DEFAULT_VIDEO_URL,
      nombre: DEFAULT_SELLER_NAME,
    }

    return {
      videoUrl: uploadedVideoUrl || defaults.videoUrl,
      nombre: sellerName.trim() || defaults.nombre,
    }
  }, [selectedTemplate, sellerName, uploadedVideoUrl])

  const openTemplate = useCallback((templateId) => {
    setSelectedTemplateId(templateId)
    setSellerName('')
    setSelectedFileName('')
    setUploadedVideoUrl('')
    setUploadStatus(initialStatus)
    setRenderStatus(initialStatus)
  }, [])

  const closeTemplate = useCallback(() => {
    setSelectedTemplateId('')
  }, [])

  const handleVideoChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0]
      if (!file || !selectedTemplate) return

      setSelectedFileName(file.name)
      setIsUploading(true)
      setUploadStatus({ type: 'loading', message: 'Subiendo video a S3...' })

      try {
        const result = await uploadAnimationVideo({
          file,
          templateId: selectedTemplate.id,
          name: file.name,
        })

        setUploadedVideoUrl(result.url)
        setUploadStatus({ type: 'success', message: 'Video cargado y aplicado al preview.' })
      } catch (error) {
        setUploadedVideoUrl('')
        setUploadStatus({
          type: 'error',
          message: error.message || 'No se pudo subir el video.',
        })
      } finally {
        setIsUploading(false)
      }
    },
    [selectedTemplate],
  )

  const handleRender = useCallback(async () => {
    if (!selectedTemplate) return

    setIsRendering(true)
    setRenderStatus({ type: 'loading', message: 'Preparando render...' })

    try {
      const result = await renderAnimationVideo({
        compositionId: selectedTemplate.compositionId,
        templateId: selectedTemplate.id,
        inputProps: previewProps,
      })

      setRenderStatus({
        type: 'success',
        message: result.message || 'Solicitud de render enviada.',
      })
    } catch (error) {
      setRenderStatus({
        type: 'error',
        message: error.message || 'No se pudo solicitar el render.',
      })
    } finally {
      setIsRendering(false)
    }
  }, [previewProps, selectedTemplate])

  if (selectedTemplate) {
    const aspectRatio = `${selectedTemplate.width} / ${selectedTemplate.height}`

    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={closeTemplate}
            className="studio-focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-border-subtle bg-card px-3 text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            <ArrowLeft size={17} />
            Volver
          </button>

          <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            <Clapperboard size={15} />
            {selectedTemplate.name}
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 overflow-hidden rounded-lg border border-border-subtle bg-card shadow-sm">
            <div className="border-b border-border-soft px-4 py-3">
              <p className="studio-label">Preview</p>
              <h1 className="mt-1 text-xl font-bold tracking-normal">Personalizacion de plantilla</h1>
            </div>

            <div className="bg-viewport p-4 sm:p-6">
              <div
                className="mx-auto overflow-hidden rounded-md bg-black"
                style={{
                  aspectRatio,
                  maxHeight: 'calc(100vh - 260px)',
                  maxWidth: selectedTemplate.width > selectedTemplate.height ? '100%' : '440px',
                }}
              >
                <Player
                  key={`${selectedTemplate.id}-${previewProps.videoUrl}-${previewProps.nombre}`}
                  component={selectedTemplate.component}
                  durationInFrames={selectedTemplate.durationInFrames}
                  compositionWidth={selectedTemplate.width}
                  compositionHeight={selectedTemplate.height}
                  fps={30}
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  inputProps={previewProps}
                />
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <section className="rounded-lg border border-border-subtle bg-card p-4 shadow-sm">
              <p className="studio-label">Datos</p>

              <label className="mt-4 block text-sm font-semibold" htmlFor="seller-name">
                Nombre del vendedor
              </label>
              <input
                id="seller-name"
                value={sellerName}
                onChange={(event) => setSellerName(event.target.value)}
                placeholder={selectedTemplate.defaultProps.nombre}
                className="studio-focus-ring mt-2 h-11 w-full rounded-md border border-border-soft bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground"
              />

              <label className="mt-4 block text-sm font-semibold" htmlFor="template-video">
                Video para la plantilla
              </label>
              <label
                htmlFor="template-video"
                className="studio-focus-ring mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border-subtle bg-input px-4 py-5 text-center transition hover:bg-accent"
              >
                {isUploading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={24} />}
                <span className="mt-2 text-sm font-semibold">
                  {selectedFileName || 'Cargar video'}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Al seleccionar un archivo se sube a S3 y cambia el preview.
                </span>
              </label>
              <input
                id="template-video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="sr-only"
              />

              {uploadStatus.message ? (
                <p
                  className={`mt-3 text-sm ${
                    uploadStatus.type === 'error' ? 'text-destructive' : 'text-muted-foreground'
                  }`}
                >
                  {uploadStatus.message}
                </p>
              ) : null}
            </section>

            <section className="rounded-lg border border-border-subtle bg-card p-4 shadow-sm">
              <p className="studio-label">Salida</p>
              <div className="mt-4 rounded-md border border-border-soft bg-input p-3">
                <div className="flex items-start gap-3">
                  <FileVideo className="mt-0.5 text-muted-foreground" size={18} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{previewProps.nombre}</p>
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {previewProps.videoUrl || 'Video base de la plantilla'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRender}
                disabled={isRendering || isUploading}
                className="studio-focus-ring mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRendering ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                Renderizar video
              </button>

              {renderStatus.message ? (
                <div
                  className={`mt-3 flex gap-2 rounded-md border px-3 py-2 text-sm ${
                    renderStatus.type === 'error'
                      ? 'border-destructive/30 text-destructive'
                      : 'border-border-soft text-muted-foreground'
                  }`}
                >
                  {renderStatus.type === 'success' ? <CheckCircle2 size={17} /> : null}
                  <span>{renderStatus.message}</span>
                </div>
              ) : null}
            </section>
          </aside>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="studio-label">Plantillas Remotion</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-normal">Animaciones</h1>
        </div>

        <span className="rounded-full border border-border-subtle bg-card px-3 py-2 text-sm font-bold text-muted-foreground">
          {templates.length} plantillas
        </span>
      </header>

      <section className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => {
          const previewRatio = `${template.width} / ${template.height}`

          return (
            <article
              key={template.id}
              className="overflow-hidden rounded-lg border border-border-subtle bg-card shadow-sm"
            >
              <div className="bg-viewport p-3">
                <div
                  className="mx-auto overflow-hidden rounded-md bg-black"
                  style={{
                    aspectRatio: previewRatio,
                    maxHeight: template.width > template.height ? '210px' : '300px',
                  }}
                >
                  <Player
                    component={template.component}
                    durationInFrames={template.durationInFrames}
                    compositionWidth={template.width}
                    compositionHeight={template.height}
                    fps={30}
                    controls
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    inputProps={template.defaultProps}
                  />
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-extrabold tracking-normal">{template.name}</h2>
                <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">
                  {template.description}
                </p>

                <button
                  type="button"
                  onClick={() => openTemplate(template.id)}
                  className="studio-focus-ring mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  <Clapperboard size={17} />
                  Usar plantilla
                </button>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
