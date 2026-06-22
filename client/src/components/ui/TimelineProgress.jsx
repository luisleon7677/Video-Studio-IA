export default function TimelineProgress({ value, label, showLabel = true }) {
  return (
    <div className="w-full">
      {showLabel ? (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="studio-timecode font-medium text-foreground">{value}%</span>
        </div>
      ) : null}
      <div className="relative h-1.5 overflow-hidden rounded-sm bg-secondary">
        <div
          className="absolute inset-y-0 left-0 rounded-sm bg-record transition-[width] duration-300 ease-out"
          style={{ width: `${value}%` }}
        />
        <div
          className="absolute inset-y-0 w-px bg-record/80"
          style={{ left: `${value}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
