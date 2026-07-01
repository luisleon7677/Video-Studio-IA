import { withAuthHeaders } from './http'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function fetchRemotionVideoHistory() {
  const response = await fetch(`${API_BASE}/videos/animations/history`, {
    headers: withAuthHeaders(),
  })

  if (!response.ok) {
    const errorText = await readErrorMessage(response)
    throw new Error(errorText || 'No se pudo cargar el historial de videos')
  }

  return response.json()
}

async function readErrorMessage(response) {
  const errorText = await response.text().catch(() => '')

  if (!errorText) return ''

  try {
    const errorJson = JSON.parse(errorText)
    return errorJson.message || errorText
  } catch {
    return errorText
  }
}
