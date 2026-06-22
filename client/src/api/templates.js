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

export async function fetchTemplates({ search = '' } = {}) {
  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())

  const query = params.toString()
  const response = await fetch(`${API_BASE}/templates${query ? `?${query}` : ''}`)

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudieron cargar las plantillas'))
  }

  return response.json()
}

export async function fetchTemplate(id) {
  const response = await fetch(`${API_BASE}/templates/${id}`)

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudo cargar la plantilla'))
  }

  return response.json()
}

export async function createTemplate(payload) {
  const response = await fetch(`${API_BASE}/templates`, {
    method: 'POST',
    headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudo crear la plantilla'))
  }

  return response.json()
}

export async function updateTemplate(id, payload) {
  const response = await fetch(`${API_BASE}/templates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudo actualizar la plantilla'))
  }

  return response.json()
}

export async function deleteTemplate(id) {
  const response = await fetch(`${API_BASE}/templates/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudo eliminar la plantilla'))
  }

  return response.json()
}
