const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function formatTemplateDate(isoString) {
  if (!isoString) return '—'
  return dateTimeFormatter.format(new Date(isoString))
}

export function contentPreview(content, maxLength = 80) {
  const normalized = content.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength)}…`
}

export function countRecentlyUpdated(templates, days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return templates.filter((tpl) => {
    if (!tpl.updatedAt) return false
    return new Date(tpl.updatedAt).getTime() >= cutoff
  }).length
}
