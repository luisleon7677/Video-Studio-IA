export default function PageLoader() {
  return (
    <div className="flex min-h-[32vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-record/40" />
          <span className="relative inline-flex size-2 rounded-full bg-record" />
        </span>
        <p className="studio-timecode text-foreground/80">Cargando módulo…</p>
      </div>
    </div>
  )
}
