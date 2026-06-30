import { withAuthHeaders } from './http'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function uploadAnimationVideo({ file, templateId, name }) {
  const formData = new FormData()
  formData.append('file', file)

  if (templateId) {
    formData.append('templateId', templateId)
  }

  if (name?.trim()) {
    formData.append('name', name.trim())
  }

  const response = await fetch(`${API_BASE}/videos/animations/upload`, {
    method: 'POST',
    headers: withAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(errorText || 'No se pudo subir el video de la plantilla')
  }

  return response.json()
}

export async function renderAnimationVideo({ compositionId, templateId, inputProps }) {
  const response = await fetch(`${API_BASE}/videos/animations/render`, {
    method: 'POST',
    headers: withAuthHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      compositionId,
      templateId,
      inputProps,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(errorText || 'No se pudo solicitar el render del video')
  }

  return response.json()
}
