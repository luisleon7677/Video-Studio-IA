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

export async function login({ email, password }) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudo iniciar sesión'))
  }

  return response.json()
}

export async function registerAdmin({ name, email, password, inviteCode }) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, inviteCode }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudo completar el registro'))
  }

  return response.json()
}
