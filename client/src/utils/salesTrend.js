import { getCompanyColor } from './companyColors'

const shortDateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
})

export function formatTrendDate(dateKey) {
  return shortDateFormatter.format(new Date(`${dateKey}T12:00:00`))
}

export function buildTrendChartModel(points, companies, width, height, padding) {
  if (points.length === 0 || companies.length === 0) {
    return { lines: [], yTicks: [], xLabels: [], maxValue: 0 }
  }

  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom

  let maxValue = 0
  for (const point of points) {
    for (const company of companies) {
      maxValue = Math.max(maxValue, point.counts[company] ?? 0)
    }
  }

  const yMax = Math.max(maxValue, 1)
  const xStep = points.length <= 1 ? 0 : plotWidth / (points.length - 1)

  const xAt = (index) => padding.left + index * xStep
  const yAt = (value) => padding.top + plotHeight - (value / yMax) * plotHeight

  const lines = companies.map((company) => ({
    company,
    stroke: getCompanyColor(company),
    path: points
      .map((point, pointIndex) => {
        const x = xAt(pointIndex)
        const y = yAt(point.counts[company] ?? 0)
        return `${pointIndex === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
      })
      .join(' '),
  }))

  const tickCount = Math.min(yMax, 4)
  const yTicks = Array.from({ length: tickCount + 1 }, (_, tick) => {
    const value = Math.round((yMax / tickCount) * tick)
    return { value, y: yAt(value) }
  })

  const labelIndexes = pickLabelIndexes(points.length)
  const xLabels = labelIndexes.map((index) => ({
    index,
    x: xAt(index),
    label: formatTrendDate(points[index].date),
  }))

  return { lines, yTicks, xLabels, maxValue: yMax }
}

function pickLabelIndexes(length) {
  if (length <= 1) return [0]
  if (length <= 4) return Array.from({ length }, (_, index) => index)

  const indexes = new Set([0, length - 1])
  const middleCount = 3

  for (let step = 1; step < middleCount; step += 1) {
    indexes.add(Math.round((length - 1) * (step / middleCount)))
  }

  return [...indexes].sort((a, b) => a - b)
}
