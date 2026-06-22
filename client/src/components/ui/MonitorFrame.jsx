export default function MonitorFrame({ children, timecode, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-lg border border-border-subtle bg-viewport shadow-md ${className}`}>
      <div className="flex items-center justify-between border-b border-border-soft bg-viewport px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-record/90" aria-hidden="true" />
          <span className="studio-label text-[9px] text-muted-foreground">Preview</span>
        </div>
        {timecode ? <span className="studio-timecode text-foreground/80">{timecode}</span> : null}
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-3 border border-border-soft/40" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-3">
          <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-foreground/25" />
          <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-foreground/25" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-foreground/25" />
          <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-foreground/25" />
        </div>
        <div className="relative flex aspect-video items-center justify-center bg-viewport">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--viewport-glow),transparent_70%)]"
            aria-hidden="true"
          />
          {children}
        </div>
      </div>
    </div>
  )
}
