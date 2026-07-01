import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircle2,
  FileAudio,
  Loader2,
  Music2,
  Pause,
  Play,
  RotateCcw,
  UploadCloud,
} from 'lucide-react'
import { createSound, fetchSounds } from '../../api/sounds'

const DURATION_OPTIONS = [5, 10, 15, 30]
const FALLBACK_WAVEFORM = Array.from({ length: 96 }, (_, index) => {
  const wave = Math.sin(index * 0.45) * 0.34 + Math.sin(index * 0.13) * 0.22
  return Math.max(0.12, Math.min(0.92, Math.abs(wave) + 0.18))
})

export default function AudioClipSelector({ value, onChange }) {
  const audioRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [sounds, setSounds] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [duration, setDuration] = useState(10)
  const [audioDuration, setAudioDuration] = useState(0)
  const [waveform, setWaveform] = useState(FALLBACK_WAVEFORM)
  const [uploadName, setUploadName] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectedSound = useMemo(
    () => sounds.find((sound) => String(sound.id) === selectedId) ?? null,
    [selectedId, sounds],
  )

  const maxStart = Math.max(0, audioDuration - duration)
  const safeStartTime = Math.min(startTime, maxStart)

  const loadSounds = useCallback(async () => {
    setIsLoading(true)
    setStatus({ type: 'loading', message: 'Cargando audios...' })

    try {
      const result = await fetchSounds()
      setSounds(result.items ?? [])
      setStatus({ type: '', message: '' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'No se pudieron cargar los audios.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSounds()
  }, [loadSounds])

  useEffect(() => {
    if (!selectedSound) {
      onChange(null)
      return
    }

    onChange({
      audioid: selectedSound.id,
      url: selectedSound.url,
      startTime: Number(safeStartTime.toFixed(2)),
      duration,
    })
  }, [duration, onChange, safeStartTime, selectedSound])

  useEffect(() => {
    if (!selectedSound?.url) {
      setWaveform(FALLBACK_WAVEFORM)
      setAudioDuration(0)
      setStartTime(0)
      return
    }

    setStartTime(0)
    setIsPlaying(false)
    setWaveform(FALLBACK_WAVEFORM)

    let isActive = true

    async function loadWaveform() {
      try {
        const response = await fetch(selectedSound.url)
        const buffer = await response.arrayBuffer()
        const audioContext = new AudioContext()
        const decoded = await audioContext.decodeAudioData(buffer)
        const data = buildWaveform(decoded)
        await audioContext.close()

        if (!isActive) return
        setWaveform(data)
        setAudioDuration(decoded.duration)
      } catch {
        if (!isActive) return
        setWaveform(FALLBACK_WAVEFORM)
      }
    }

    void loadWaveform()

    return () => {
      isActive = false
    }
  }, [selectedSound])

  useEffect(() => {
    drawWaveform({
      canvas: canvasRef.current,
      waveform,
      startTime: safeStartTime,
      duration,
      audioDuration,
    })
  }, [audioDuration, duration, safeStartTime, waveform])

  useEffect(() => {
    if (startTime > maxStart) {
      setStartTime(maxStart)
    }
  }, [maxStart, startTime])

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setStatus({ type: '', message: '' })

    if (!file.name.toLowerCase().endsWith('.mp3')) {
      setStatus({ type: 'error', message: 'Selecciona un archivo MP3.' })
      return
    }

    const cleanName = uploadName.trim() || file.name.replace(/\.[^.]+$/, '')

    try {
      setIsUploading(true)
      const created = await createSound({ name: cleanName, file })
      const result = await fetchSounds()
      setSounds(result.items ?? [])
      setSelectedId(String(created.id))
      setUploadName('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setStatus({ type: 'success', message: 'Audio cargado y seleccionado.' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'No se pudo cargar el audio.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  async function playClip() {
    if (!audioRef.current || !selectedSound) return

    audioRef.current.currentTime = safeStartTime
    await audioRef.current.play()
    setIsPlaying(true)
  }

  function pauseClip() {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  function replayClip() {
    pauseClip()
    window.setTimeout(() => {
      void playClip()
    }, 0)
  }

  function handleTimeUpdate() {
    const audio = audioRef.current
    if (!audio) return

    if (audio.currentTime >= safeStartTime + duration) {
      audio.pause()
      audio.currentTime = safeStartTime
      setIsPlaying(false)
    }
  }

  function handleStartChange(event) {
    const nextStart = Number(event.target.value)
    setStartTime(nextStart)

    if (audioRef.current && isPlaying) {
      audioRef.current.currentTime = nextStart
    }
  }

  return (
    <section className="rounded-lg border border-border-subtle bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="studio-label">Audio</p>
          <h2 className="mt-1 text-sm font-semibold tracking-normal">Fragmento musical</h2>
        </div>
        {value ? (
          <span className="rounded-md border border-border-soft bg-input px-2 py-1 font-mono text-[11px] text-muted-foreground">
            {formatTime(value.startTime)} / {value.duration}s
          </span>
        ) : null}
      </div>

      <label className="mt-4 block text-sm font-semibold" htmlFor="sound-select">
        Audio guardado
      </label>
      <select
        id="sound-select"
        value={selectedId}
        onChange={(event) => setSelectedId(event.target.value)}
        disabled={isLoading}
        className="studio-focus-ring mt-2 h-11 w-full rounded-md border border-border-soft bg-input px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">{isLoading ? 'Cargando audios...' : 'Seleccionar audio'}</option>
        {sounds.map((sound) => (
          <option key={sound.id} value={sound.id}>
            {sound.name}
          </option>
        ))}
      </select>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <input
          value={uploadName}
          onChange={(event) => setUploadName(event.target.value)}
          placeholder="Nombre si cargas uno nuevo"
          className="studio-focus-ring h-10 min-w-0 rounded-md border border-border-soft bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
        <label
          htmlFor="clip-audio-upload"
          className="studio-focus-ring inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-border-subtle bg-card px-3 text-sm font-semibold text-foreground transition hover:bg-accent"
        >
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
          MP3
        </label>
        <input
          ref={fileInputRef}
          id="clip-audio-upload"
          type="file"
          accept="audio/mpeg,.mp3"
          onChange={handleUpload}
          className="sr-only"
        />
      </div>

      <div className="mt-4 rounded-md border border-border-soft bg-input p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileAudio className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-semibold">
              {selectedSound?.name || 'Sin audio seleccionado'}
            </span>
          </div>
          <span className="studio-timecode shrink-0">{formatTime(audioDuration)}</span>
        </div>

        <div className="relative overflow-hidden rounded-md border border-border-soft bg-viewport">
          <canvas ref={canvasRef} className="block h-24 w-full" />
          <input
            type="range"
            min="0"
            max={maxStart || 0}
            step="0.1"
            value={safeStartTime}
            onChange={handleStartChange}
            disabled={!selectedSound || maxStart <= 0}
            className="absolute inset-x-3 bottom-2 h-1 accent-primary disabled:opacity-40"
          />
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {DURATION_OPTIONS.map((seconds) => (
            <button
              key={seconds}
              type="button"
              onClick={() => setDuration(seconds)}
              className={`studio-focus-ring h-8 rounded-md border text-xs font-semibold transition ${
                duration === seconds
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border-soft bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {seconds}s
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={isPlaying ? pauseClip : playClip}
            disabled={!selectedSound}
            className="studio-focus-ring inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            {isPlaying ? 'Pausar' : 'Probar fragmento'}
          </button>
          <button
            type="button"
            onClick={replayClip}
            disabled={!selectedSound}
            className="studio-focus-ring inline-flex h-9 w-10 items-center justify-center rounded-md border border-border-subtle bg-card text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Volver a escuchar"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      {status.message ? (
        <p
          className={`mt-3 flex items-center gap-2 text-sm ${
            status.type === 'error' ? 'text-destructive' : 'text-muted-foreground'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 className="size-4 text-chart-1" /> : null}
          {status.type === 'loading' ? <Loader2 className="size-4 animate-spin" /> : null}
          <span>{status.message}</span>
        </p>
      ) : null}

      {selectedSound?.url ? (
        <audio
          ref={audioRef}
          src={selectedSound.url}
          preload="metadata"
          onLoadedMetadata={(event) => setAudioDuration(event.currentTarget.duration || 0)}
          onTimeUpdate={handleTimeUpdate}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
      ) : (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Music2 className="size-3.5" />
          Selecciona o carga un MP3 para elegir el fragmento.
        </div>
      )}
    </section>
  )
}

function buildWaveform(audioBuffer) {
  const channel = audioBuffer.getChannelData(0)
  const samples = 96
  const blockSize = Math.floor(channel.length / samples)

  return Array.from({ length: samples }, (_, index) => {
    const start = index * blockSize
    let sum = 0

    for (let i = 0; i < blockSize; i += 1) {
      sum += Math.abs(channel[start + i] ?? 0)
    }

    return Math.max(0.08, Math.min(1, sum / Math.max(1, blockSize) * 3.2))
  })
}

function drawWaveform({ canvas, waveform, startTime, duration, audioDuration }) {
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.max(1, Math.floor(rect.width * dpr))
  canvas.height = Math.max(1, Math.floor(rect.height * dpr))

  const context = canvas.getContext('2d')
  if (!context) return

  context.scale(dpr, dpr)
  context.clearRect(0, 0, rect.width, rect.height)

  const barGap = 3
  const barWidth = Math.max(2, rect.width / waveform.length - barGap)
  const centerY = rect.height / 2
  const selectedStartRatio = audioDuration ? startTime / audioDuration : 0
  const selectedEndRatio = audioDuration ? (startTime + duration) / audioDuration : 0

  waveform.forEach((value, index) => {
    const x = index * (barWidth + barGap) + 8
    const barHeight = Math.max(8, value * (rect.height - 26))
    const ratio = index / waveform.length
    const selected = ratio >= selectedStartRatio && ratio <= selectedEndRatio

    context.fillStyle = selected ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.32)'
    context.fillRect(x, centerY - barHeight / 2, barWidth, barHeight)
  })

  if (audioDuration > 0) {
    const markerX = Math.max(0, Math.min(rect.width, selectedStartRatio * rect.width))
    const selectedWidth = Math.max(2, (selectedEndRatio - selectedStartRatio) * rect.width)

    context.fillStyle = 'rgba(255,255,255,0.12)'
    context.fillRect(markerX, 0, selectedWidth, rect.height)
    context.fillStyle = 'rgba(255,255,255,0.95)'
    context.fillRect(markerX, 0, 2, rect.height)
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}
