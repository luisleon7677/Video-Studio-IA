import { withAuthHeaders } from './http'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function fetchSellers({ page = 1, limit = 8, search = '', company = 'all' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    company,
  })

  if (search.trim()) {
    params.set('search', search.trim())
  }

  const response = await fetch(`${API_BASE}/sellers?${params.toString()}`)

  if (!response.ok) {
    throw new Error('No se pudo cargar la lista de vendedores')
  }

  return response.json()
}

export async function fetchSellerById(id) {
  const response = await fetch(`${API_BASE}/sellers/${id}`)

  if (!response.ok) {
    throw new Error('No se pudo cargar el vendedor')
  }

  return response.json()
}

export async function uploadSellerVideo({ sellerId, file, name }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('idSeller', String(sellerId))

  if (name?.trim()) {
    formData.append('name', name.trim())
  }

  const response = await fetch(`${API_BASE}/videos/capcut/upload`, {
    method: 'POST',
    headers: withAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(errorText || 'No se pudo subir el video del vendedor')
  }

  return response.json()
}
