import { memo } from 'react'
import { Scissors } from 'lucide-react'
import { formatTimecode } from '../../data/mock/videoEditing'

function EditingTimeline({
  durationSec,
  keyMoments,
  fragments,
  playheadSec,
  selectedMomentId,
  onSelectMoment,
  onCutMoment,
}) {
  const toPercent = (sec) => (sec / durationSec) * 100
  const playheadPercent = toPercent(playheadSec)

  const rulerSteps = 6

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="studio-label">Línea de tiempo · fuente</p>
        <span className="studio-timecode">{formatTimecode(durationSec)} total</span>
      </div>

      <div className="relative">
        <div className="mb-1 flex justify-between border-b border-border-soft pb-1">
          {Array.from({ length: rulerSteps + 1 }, (_, i) => (
            <span key={i} className="studio-timecode text-[9px]">
              {formatTimecode((durationSec / rulerSteps) * i)}
            </span>
          ))}
        </div>

        <div className="relative h-14 rounded-sm bg-viewport ring-1 ring-border-soft">
          <div className="absolute inset-y-2 left-0 right-0 mx-1 rounded-sm bg-record/20" title="Video fuente" />

          {keyMoments.map((moment) => {
            const left = toPercent(moment.startSec)
            const width = toPercent(moment.endSec - moment.startSec)
            const isSelected = selectedMomentId === moment.id
            return (
              <button
                key={moment.id}
                type="button"
                onClick={() => onSelectMoment(moment.id)}
                className={`absolute inset-y-1 rounded-sm border transition-all studio-focus-ring ${
                  isSelected
                    ? 'border-record bg-record/35 ring-1 ring-record/40'
                    : 'border-chart-1/50 bg-chart-1/25 hover:bg-chart-1/35'
                }`}
                style={{ left: `${left}%`, width: `${width}%` }}
                title={`${moment.label} (${formatTimecode(moment.startSec)})`}
              />
            )
          })}

          {keyMoments.map((moment) => (
            <span
              key={`pin-${moment.id}`}
              className="absolute top-0 z-10 -translate-x-1/2"
              style={{ left: `${toPercent(moment.startSec)}%` }}
            >
              <span
                className={`block size-2 rotate-45 border ${
                  selectedMomentId === moment.id
                    ? 'border-record bg-record'
                    : 'border-chart-1 bg-chart-1'
                }`}
                aria-hidden="true"
              />
            </span>
          ))}

          <div
            className="absolute inset-y-0 z-20 w-px bg-foreground shadow-[0_0_6px_var(--record)]"
            style={{ left: `${playheadPercent}%` }}
            aria-hidden="true"
          />
          <div
            className="absolute top-0 z-20 size-2.5 -translate-x-1/2 rounded-full bg-foreground ring-2 ring-record"
            style={{ left: `${playheadPercent}%` }}
            aria-label={`Playhead ${formatTimecode(playheadSec)}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="studio-label">Fragmentos agrupados</p>
          <span className="studio-timecode">{fragments.length} clips</span>
        </div>

        {fragments.length === 0 ? (
          <div className="flex h-12 items-center justify-center rounded-sm border border-dashed border-border-subtle bg-muted/30">
            <p className="text-xs text-muted-foreground">
              Corta en los marcadores para agrupar fragmentos aquí
            </p>
          </div>
        ) : (
          <div className="relative min-h-12 rounded-sm bg-secondary/50 ring-1 ring-border-soft">
            {fragments.map((clip) => (
              <div
                key={clip.id}
                className="absolute inset-y-1.5 flex items-center overflow-hidden rounded-sm border border-border-subtle bg-card px-2 shadow-sm"
                style={{
                  left: `${toPercent(clip.startSec)}%`,
                  width: `${toPercent(clip.endSec - clip.startSec)}%`,
                }}
                title={clip.label}
              >
                <span className="truncate text-[10px] font-medium">{clip.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMomentId ? (
        <button
          type="button"
          onClick={onCutMoment}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-record/30 bg-record/10 py-2 text-sm font-medium text-record transition-colors hover:bg-record/15 studio-focus-ring"
        >
          <Scissors className="size-4" />
          Cortar segmento seleccionado
        </button>
      ) : null}
    </div>
  )
}

export default memo(EditingTimeline)
