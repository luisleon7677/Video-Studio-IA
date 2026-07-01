import { withAuthHeaders } from './http'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function parseError(response, fallback) {
  try {
    const data = await response.json()
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message
    }
  } catch {
    // ignore parse errors
  }
  return fallback
}

export async function fetchSounds({ search = '' } = {}) {
  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())

  const query = params.toString()
  const response = await fetch(`${API_BASE}/sounds${query ? `?${query}` : ''}`, {
    headers: withAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudieron cargar los audios'))
  }

  return response.json()
}

export async function createSound({ name, file }) {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/sounds`, {
    method: 'POST',
    headers: withAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudo cargar el audio'))
  }

  return response.json()
}
