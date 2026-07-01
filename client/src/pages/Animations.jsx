import { useCallback, useEffect, useMemo, useState } from 'react'
import { Player } from '@remotion/player'
import {
  ArrowLeft,
  CheckCircle2,
  Clapperboard,
  FileVideo,
  Loader2,
  Play,
  UploadCloud,
} from 'lucide-react'
import { renderAnimationVideo, uploadAnimationVideo } from '../api/api-remotion'
import { fetchSellerById, fetchSellers } from '../api/sellers'
import AudioClipSelector from '../components/audio/AudioClipSelector'
import { useAuth } from '../hooks/useAuth'
import { ModernSale } from '../remotion/templates/ModernSale'
import { modernSaleMetadata } from '../remotion/templates/ModernSale/metadata'
import { VentaExitosa } from '../remotion/templates/VentaExitosa'
import { ventaExitosaMetadata } from '../remotion/templates/VentaExitosa/metadata'

const templates = [
  {
    ...modernSaleMetadata,
    component: ModernSale,
  },
  {
    ...ventaExitosaMetadata,
    component: VentaExitosa,
  },
]

const initialStatus = {
  type: '',
  message: '',
}

export default function Animation() {
  const { user } = useAuth()
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [outputName, setOutputName] = useState('')
  const [introFileName, setIntroFileName] = useState('')
  const [introVideoUrl, setIntroVideoUrl] = useState('')
  const [outroVideoUrl, setOutroVideoUrl] = useState('')
  const [audioClip, setAudioClip] = useState(null)
  const [selectedSellerId, setSelectedSellerId] = useState('')
  const [sellers, setSellers] = useState([])
  const [sellerVideos, setSellerVideos] = useState([])
  const [uploadStatus, setUploadStatus] = useState(initialStatus)
  const [sellerStatus, setSellerStatus] = useState(initialStatus)
  const [renderStatus, setRenderStatus] = useState(initialStatus)
  const [renderDownloadUrl, setRenderDownloadUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingSellers, setIsLoadingSellers] = useState(false)
  const [isLoadingSellerVideos, setIsLoadingSellerVideos] = useState(false)
  const [isRendering, setIsRendering] = useState(false)

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [selectedTemplateId],
  )

  const selectedSeller = useMemo(
    () => sellers.find((seller) => String(seller.id) === selectedSellerId),
    [selectedSellerId, sellers],
  )

  const previewProps = useMemo(
    () => ({
      nombre: sellerName.trim() || undefined,
      introVideoUrl: introVideoUrl || undefined,
      outroVideoUrl: outroVideoUrl || undefined,
      music: audioClip?.url || undefined,
      musicStart: audioClip?.startTime ?? undefined,
      musicDuration: audioClip?.duration ?? undefined,
    }),
    [audioClip, introVideoUrl, outroVideoUrl, sellerName],
  )

  const selectedOutroLabel = useMemo(() => {
    const video = sellerVideos.find((item) => item.url === outroVideoUrl)
    return video?.name || 'Video final por defecto'
  }, [outroVideoUrl, sellerVideos])

  useEffect(() => {
    let isActive = true

    async function loadSellers() {
      setIsLoadingSellers(true)
      setSellerStatus({ type: 'loading', message: 'Cargando vendedores...' })

      try {
        const result = await fetchSellers({ limit: 100 })
        if (!isActive) return

        setSellers(result.items ?? [])
        setSellerStatus(initialStatus)
      } catch (error) {
        if (!isActive) return

        setSellerStatus({
          type: 'error',
          message: error.message || 'No se pudo cargar la lista de vendedores.',
        })
      } finally {
        if (isActive) {
          setIsLoadingSellers(false)
        }
      }
    }

    loadSellers()

    return () => {
      isActive = false
    }
  }, [])

  const openTemplate = useCallback((templateId) => {
    setSelectedTemplateId(templateId)
    setSellerName('')
    setOutputName('')
    setIntroFileName('')
    setIntroVideoUrl('')
    setOutroVideoUrl('')
    setAudioClip(null)
    setSelectedSellerId('')
    setSellerVideos([])
    setUploadStatus(initialStatus)
    setSellerStatus(initialStatus)
    setRenderStatus(initialStatus)
    setRenderDownloadUrl('')
  }, [])

  const closeTemplate = useCallback(() => {
    setSelectedTemplateId('')
  }, [])

  const handleIntroVideoChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0]
      if (!file || !selectedTemplate) return

      setIntroFileName(file.name)
      setIsUploading(true)
      setUploadStatus({ type: 'loading', message: 'Subiendo intro a S3...' })

      try {
        const result = await uploadAnimationVideo({
          file,
          templateId: selectedTemplate.id,
          name: file.name,
        })

        setIntroVideoUrl(result.url)
        setUploadStatus({ type: 'success', message: 'Intro cargada y aplicada al preview.' })
      } catch (error) {
        setIntroVideoUrl('')
        setUploadStatus({
          type: 'error',
          message: error.message || 'No se pudo subir el video principal.',
        })
      } finally {
        setIsUploading(false)
      }
    },
    [selectedTemplate],
  )

  const handleSellerChange = useCallback(async (event) => {
    const sellerId = event.target.value

    setSelectedSellerId(sellerId)
    setOutroVideoUrl('')
    setSellerVideos([])
    setSellerStatus(initialStatus)

    if (!sellerId) return

    setIsLoadingSellerVideos(true)
    setSellerStatus({ type: 'loading', message: 'Cargando videos del vendedor...' })

    try {
      const seller = await fetchSellerById(sellerId)
      const videos = seller.videos ?? []

      setSellerName((currentName) => currentName || seller.name || '')
      setSellerVideos(videos)
      setSellerStatus(
        videos.length
          ? initialStatus
          : { type: 'empty', message: 'Este vendedor no tiene videos disponibles.' },
      )
    } catch (error) {
      setSellerStatus({
        type: 'error',
        message: error.message || 'No se pudieron cargar los videos del vendedor.',
      })
    } finally {
      setIsLoadingSellerVideos(false)
    }
  }, [])

  const handleAudioClipChange = useCallback((nextAudioClip) => {
    setAudioClip(nextAudioClip)
  }, [])

  const handleRender = useCallback(async () => {
    if (!selectedTemplate) return
    const cleanOutputName = outputName.trim()

    if (cleanOutputName.length < 3) {
      setRenderStatus({
        type: 'error',
        message: 'Escribe un nombre para guardar el video en S3.',
      })
      return
    }

    setIsRendering(true)
    setRenderDownloadUrl('')
    setRenderStatus({ type: 'loading', message: 'Renderizando y subiendo a S3...' })

    try {
      const result = await renderAnimationVideo({
        compositionId: selectedTemplate.id,
        templateId: selectedTemplate.id,
        inputProps: previewProps,
        outputName: cleanOutputName,
        idAdmin: user?.id,
        idSound: audioClip?.audioid,
        audioConfig: audioClip
          ? {
              audioid: audioClip.audioid,
              startTime: audioClip.startTime,
              duration: audioClip.duration,
            }
          : undefined,
      })

      setRenderDownloadUrl(result.downloadUrl || '')
      setRenderStatus({
        type: 'success',
        message: result.message || 'Video renderizado y subido a S3.',
      })
    } catch (error) {
      setRenderStatus({
        type: 'error',
        message: error.message || 'No se pudo solicitar el render.',
      })
    } finally {
      setIsRendering(false)
    }
  }, [audioClip, outputName, previewProps, selectedTemplate, user?.id])

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

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
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
                  width: '100%',
                  maxWidth: '960px',
                }}
              >
                <Player
                  key={selectedTemplate.id}
                  component={selectedTemplate.component}
                  durationInFrames={selectedTemplate.durationInFrames}
                  compositionWidth={selectedTemplate.width}
                  compositionHeight={selectedTemplate.height}
                  fps={selectedTemplate.fps}
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
                placeholder="Vendedor"
                className="studio-focus-ring mt-2 h-11 w-full rounded-md border border-border-soft bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground"
              />

              <label className="mt-4 block text-sm font-semibold" htmlFor="intro-video">
                Video principal
              </label>
              <label
                htmlFor="intro-video"
                className="studio-focus-ring mt-2 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border-subtle bg-input px-4 py-4 text-center transition hover:bg-accent"
              >
                {isUploading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={24} />}
                <span className="mt-2 text-sm font-semibold">
                  {introFileName || 'Cargar intro'}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Si no cargas uno, se usa el intro por defecto de public.
                </span>
              </label>
              <input
                id="intro-video"
                type="file"
                accept="video/*"
                onChange={handleIntroVideoChange}
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
              <p className="studio-label">Outro</p>

              <label className="mt-4 block text-sm font-semibold" htmlFor="seller-select">
                Vendedor
              </label>
              <select
                id="seller-select"
                value={selectedSellerId}
                onChange={handleSellerChange}
                disabled={isLoadingSellers}
                className="studio-focus-ring mt-2 h-11 w-full rounded-md border border-border-soft bg-input px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {isLoadingSellers ? 'Cargando vendedores...' : 'Seleccionar vendedor'}
                </option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
              </select>

              <label className="mt-4 block text-sm font-semibold" htmlFor="outro-video">
                Video final de 10 segundos
              </label>
              <select
                id="outro-video"
                value={outroVideoUrl}
                onChange={(event) => setOutroVideoUrl(event.target.value)}
                disabled={!selectedSellerId || isLoadingSellerVideos || sellerVideos.length === 0}
                className="studio-focus-ring mt-2 h-11 w-full rounded-md border border-border-soft bg-input px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {isLoadingSellerVideos ? 'Cargando videos...' : 'Usar outro por defecto'}
                </option>
                {sellerVideos.map((video) => (
                  <option key={video.id ?? video.url} value={video.url}>
                    {video.name}
                  </option>
                ))}
              </select>

              {sellerStatus.message ? (
                <p
                  className={`mt-3 text-sm ${
                    sellerStatus.type === 'error' ? 'text-destructive' : 'text-muted-foreground'
                  }`}
                >
                  {sellerStatus.message}
                </p>
              ) : null}
            </section>

            <AudioClipSelector value={audioClip} onChange={handleAudioClipChange} />

            <section className="rounded-lg border border-border-subtle bg-card p-4 shadow-sm">
              <p className="studio-label">Salida</p>
              <label className="mt-4 block text-sm font-semibold" htmlFor="output-name">
                Nombre del video
              </label>
              <input
                id="output-name"
                value={outputName}
                onChange={(event) => setOutputName(event.target.value)}
                placeholder="venta-julio-remotion"
                className="studio-focus-ring mt-2 h-11 w-full rounded-md border border-border-soft bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground"
              />

              <div className="mt-4 rounded-md border border-border-soft bg-input p-3">
                <div className="flex items-start gap-3">
                  <FileVideo className="mt-0.5 text-muted-foreground" size={18} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {sellerName.trim() || selectedSeller?.name || 'Vendedor'}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      Intro: {introFileName || 'default-intro.mp4'}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      Outro: {selectedOutroLabel}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      Audio: {audioClip ? `${audioClip.startTime}s / ${audioClip.duration}s` : 'sin musica'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRender}
                disabled={isRendering || isUploading || isLoadingSellerVideos || outputName.trim().length < 3}
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

              {renderDownloadUrl ? (
                <a
                  href={renderDownloadUrl}
                  download
                  className="studio-focus-ring mt-3 inline-flex h-10 w-full items-center justify-center rounded-md border border-border-subtle bg-card px-3 text-sm font-bold text-foreground transition hover:bg-accent"
                >
                  Ver o descargar desde S3
                </a>
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
          {templates.length} plantilla estandar
        </span>
      </header>

      <section className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => (
          <article
            key={template.id}
            className="overflow-hidden rounded-lg border border-border-subtle bg-card shadow-sm"
          >
            <div className="bg-viewport p-3">
              <div
                className="mx-auto overflow-hidden rounded-md bg-black"
                style={{
                  aspectRatio: `${template.width} / ${template.height}`,
                  width: '100%',
                  maxHeight: '260px',
                }}
              >
                <Player
                  component={template.component}
                  durationInFrames={template.durationInFrames}
                  compositionWidth={template.width}
                  compositionHeight={template.height}
                  fps={template.fps}
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  inputProps={{}}
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
        ))}
      </section>
    </main>
  )
}
