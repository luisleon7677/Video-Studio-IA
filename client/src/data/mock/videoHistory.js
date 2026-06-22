export const videoStatuses = [
  { id: 'all', label: 'Todos' },
  { id: 'completed', label: 'Completados' },
  { id: 'processing', label: 'Procesando' },
  { id: 'failed', label: 'Fallidos' },
]

export const generatedVideos = [
  {
    id: 'vid-001',
    fileName: 'promo_verano_2026_ia.mp4',
    sourceFileName: 'promo_verano_raw.mp4',
    templateName: 'Promo producto — 60s',
    templateId: 'tpl-001',
    generatedAt: '2026-05-30T11:42:18',
    durationSec: 62,
    sizeBytes: 48_200_000,
    status: 'completed',
  },
  {
    id: 'vid-002',
    fileName: 'reel_instagram_mayo_ia.mp4',
    sourceFileName: 'reel_borrador.mov',
    templateName: 'Reel Instagram — tendencia',
    templateId: 'tpl-002',
    generatedAt: '2026-05-30T09:15:03',
    durationSec: 26,
    sizeBytes: 12_400_000,
    status: 'completed',
  },
  {
    id: 'vid-003',
    fileName: 'testimonial_cliente_a_ia.mp4',
    sourceFileName: 'entrevista_cliente.mp4',
    templateName: 'Testimonial cliente',
    templateId: 'tpl-003',
    generatedAt: '2026-05-29T16:28:44',
    durationSec: 91,
    sizeBytes: 71_800_000,
    status: 'completed',
  },
  {
    id: 'vid-004',
    fileName: 'catalogo_q2_procesando.mp4',
    sourceFileName: 'catalogo_q2_fuente.mp4',
    templateName: 'Catálogo temporada',
    templateId: 'tpl-004',
    generatedAt: '2026-05-30T12:05:00',
    durationSec: 0,
    sizeBytes: 0,
    status: 'processing',
  },
  {
    id: 'vid-005',
    fileName: 'explicador_saas_ia.mp4',
    sourceFileName: 'demo_producto.mp4',
    templateName: 'Explicador servicio B2B',
    templateId: 'tpl-006',
    generatedAt: '2026-05-28T14:33:27',
    durationSec: 118,
    sizeBytes: 95_600_000,
    status: 'completed',
  },
  {
    id: 'vid-006',
    fileName: 'montaje_transiciones_ia.mp4',
    sourceFileName: 'clip_largo_sin_cortes.mp4',
    templateName: 'Montaje IA — transiciones',
    templateId: 'tpl-005',
    generatedAt: '2026-05-27T10:12:09',
    durationSec: 84,
    sizeBytes: 52_300_000,
    status: 'completed',
  },
  {
    id: 'vid-007',
    fileName: 'promo_fallida_render.mp4',
    sourceFileName: 'promo_corrupta.mp4',
    templateName: 'Promo producto — 60s',
    templateId: 'tpl-001',
    generatedAt: '2026-05-26T18:44:51',
    durationSec: 0,
    sizeBytes: 0,
    status: 'failed',
  },
  {
    id: 'vid-008',
    fileName: 'reel_tendencia_junio_ia.mp4',
    sourceFileName: 'material_junio.mov',
    templateName: 'Reel Instagram — tendencia',
    templateId: 'tpl-002',
    generatedAt: '2026-05-25T08:20:33',
    durationSec: 24,
    sizeBytes: 11_100_000,
    status: 'completed',
  },
]

const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export function formatGeneratedAt(isoString) {
  return dateTimeFormatter.format(new Date(isoString))
}

export function formatDuration(seconds) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatFileSize(bytes) {
  if (!bytes) return '—'
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
}
