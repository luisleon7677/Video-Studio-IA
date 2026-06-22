import { memo, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import Panel, { PanelHeader } from '../ui/Panel'
import ChannelBadge from './ChannelBadge'
import { buildTrendChartModel } from '../../utils/salesTrend'

const CHART_WIDTH = 640
const CHART_HEIGHT = 200
const PADDING = { top: 16, right: 16, bottom: 32, left: 40 }

function SalesTrendChart({ companies, points, isLoading }) {
  const chart = useMemo(
    () => buildTrendChartModel(points, companies, CHART_WIDTH, CHART_HEIGHT, PADDING),
    [points, companies],
  )

  const hasData = points.length > 0 && companies.length > 0

  return (
    <Panel padding={false}>
      <PanelHeader
        title="Ventas por empresa"
        meta={
          companies.length > 0
            ? `Evolución diaria · ${companies.join(' · ')}`
            : 'Evolución diaria por empresa'
        }
      />

      <div className="px-4 pb-4 pt-2 sm:px-5">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            Cargando tendencia…
          </div>
        ) : !hasData ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
            <TrendingUp className="size-5 text-muted-foreground/60" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Aún no hay ventas registradas para mostrar la tendencia.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              {companies.map((company) => (
                <ChannelBadge key={company} channel={company} />
              ))}
            </div>

            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                className="h-48 w-full min-w-[320px]"
                role="img"
                aria-label="Gráfico lineal de ventas diarias por empresa"
              >
                {chart.yTicks.map((tick) => (
                  <g key={tick.value}>
                    <line
                      x1={PADDING.left}
                      x2={CHART_WIDTH - PADDING.right}
                      y1={tick.y}
                      y2={tick.y}
                      stroke="var(--border-subtle)"
                      strokeWidth="1"
                    />
                    <text
                      x={PADDING.left - 8}
                      y={tick.y + 4}
                      textAnchor="end"
                      className="fill-muted-foreground font-mono text-[10px] tabular-nums"
                    >
                      {tick.value}
                    </text>
                  </g>
                ))}

                {chart.lines.map((line) => (
                  <path
                    key={line.company}
                    d={line.path}
                    fill="none"
                    stroke={line.stroke}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {chart.xLabels.map(({ x, label, index }) => (
                  <text
                    key={`${label}-${index}`}
                    x={x}
                    y={CHART_HEIGHT - 8}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono text-[10px] uppercase tracking-wide"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>
          </>
        )}
      </div>
    </Panel>
  )
}

export default memo(SalesTrendChart)
