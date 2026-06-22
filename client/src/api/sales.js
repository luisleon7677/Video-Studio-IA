const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function fetchSales({ page = 1, limit = 5, search = '', channel = 'all' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    channel,
  })

  if (search.trim()) {
    params.set('search', search.trim())
  }

  const response = await fetch(`${API_BASE}/sales?${params.toString()}`)

  if (!response.ok) {
    throw new Error('No se pudo cargar el historial de ventas')
  }

  return response.json()
}

export async function fetchSalesTrend() {
  const response = await fetch(`${API_BASE}/sales/trend`)

  if (!response.ok) {
    throw new Error('No se pudo cargar la tendencia de ventas')
  }

  return response.json()
}

export async function deleteSale(id) {
  const response = await fetch(`${API_BASE}/sales/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error('No se pudo eliminar la venta')
  }

  return response.json()
}
