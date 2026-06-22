import { memo } from 'react'

function MetricTile({ label, value, delta, icon: Icon, accent = 'text-primary' }) {
  return (
    <article className="studio-panel flex flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="studio-label">{label}</p>
        {Icon ? (
          <span className={`flex size-7 items-center justify-center rounded-md bg-muted ${accent}`}>
            <Icon className="size-3.5" strokeWidth={2} />
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
      {delta ? (
        <p className="mt-2 studio-timecode">
          <span className="text-record">{delta}</span>
          <span className="text-muted-foreground"> · vs. mes anterior</span>
        </p>
      ) : null}
    </article>
  )
}

export default memo(MetricTile)
