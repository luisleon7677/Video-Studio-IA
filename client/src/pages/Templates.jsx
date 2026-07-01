import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import {
  AudioLines,
  CheckCircle2,
  ExternalLink,
  FileAudio,
  Loader2,
  Music2,
  Plus,
  Search,
  UploadCloud,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Panel, { PanelHeader } from '../components/ui/Panel'
import Button from '../components/ui/Button'
import MetricTile from '../components/ui/MetricTile'
import { createSound, fetchSounds } from '../api/sounds'

const emptyForm = { name: '', file: null }

export default function Templates() {
  const fileInputRef = useRef(null)
  const [sounds, setSounds] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const selectedFileName = form.file?.name ?? ''

  const loadSounds = useCallback(async () => {
    try {
      setError('')
      const data = await fetchSounds({ search })
      setSounds(data.items ?? [])
    } catch (loadError) {
      setError(loadError.message)
      setSounds([])
    }
  }, [search])

  useEffect(() => {
    startTransition(() => {
      void loadSounds()
    })
  }, [loadSounds])

  const mp3Count = useMemo(
    () => sounds.filter((sound) => sound.url?.toLowerCase().includes('.mp3')).length,
    [sounds],
  )

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.file) {
      setError('Selecciona un archivo MP3.')
      return
    }

    if (!form.file.name.toLowerCase().endsWith('.mp3')) {
      setError('El archivo debe ser MP3.')
      return
    }

    try {
      setIsUploading(true)
      const created = await createSound({
        name: form.name.trim(),
        file: form.file,
      })
      setForm(emptyForm)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      await loadSounds()
      setSuccess(`Audio "${created.name}" cargado en S3.`)
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Audios"
        description="Biblioteca de efectos de sonido MP3 para el estudio de video."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricTile
          label="Audios registrados"
          value={String(sounds.length)}
          icon={AudioLines}
          accent="text-record"
        />
        <MetricTile
          label="Archivos MP3"
          value={String(mp3Count)}
          icon={Music2}
          accent="text-chart-1"
        />
        <MetricTile
          label="Destino S3"
          value="sounds"
          icon={FileAudio}
          accent="text-chart-2"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <Panel padding={false}>
          <PanelHeader title="Nuevo audio" meta="Nombre del efecto y archivo MP3" />

          <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-5">
            <label className="block space-y-1.5">
              <span className="studio-label">Nombre del efecto</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Ej. Impacto cinematico"
                required
                minLength={3}
                className="h-10 w-full rounded-md border border-border-soft bg-input px-3 text-sm studio-focus-ring"
              />
            </label>

            <label
              htmlFor="sound-file"
              className="studio-focus-ring flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border-subtle bg-input px-4 py-5 text-center transition hover:bg-accent"
            >
              {isUploading ? <Loader2 className="animate-spin" size={26} /> : <UploadCloud size={26} />}
              <span className="mt-3 text-sm font-semibold">
                {selectedFileName || 'Seleccionar MP3'}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                Se subira a dashboard/video_studio/sounds/
              </span>
            </label>
            <input
              ref={fileInputRef}
              id="sound-file"
              type="file"
              accept="audio/mpeg,.mp3"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                setForm((current) => ({ ...current, file }))
              }}
              className="sr-only"
            />

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {success ? (
              <p className="flex items-center gap-2 text-sm text-chart-1">
                <CheckCircle2 className="size-4" />
                {success}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isUploading || form.name.trim().length < 3 || !form.file}
              className="w-full"
            >
              {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Cargar audio
            </Button>
          </form>
        </Panel>

        <Panel padding={false}>
          <div className="border-b border-border-subtle px-4 py-3 sm:px-5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar audio..."
                className="h-8 w-full rounded-md border border-border-soft bg-input pl-8 pr-3 text-sm studio-focus-ring"
              />
            </div>
          </div>

          <div className="divide-y divide-border-subtle">
            {isPending ? (
              <div className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Cargando audios...
              </div>
            ) : sounds.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                {search ? 'No hay audios que coincidan con la busqueda.' : 'Aun no hay audios cargados.'}
              </div>
            ) : (
              sounds.map((sound) => (
                <article key={sound.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-viewport text-record ring-1 ring-border-soft">
                    <FileAudio className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{sound.name}</p>
                    <p className="studio-timecode mt-0.5 truncate">{sound.url}</p>
                    {sound.url ? (
                      <audio controls src={sound.url} className="mt-2 h-8 w-full max-w-md" />
                    ) : null}
                  </div>
                  <a
                    href={sound.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground studio-focus-ring"
                    aria-label="Abrir audio"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </article>
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
