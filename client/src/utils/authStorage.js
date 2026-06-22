const AUTH_KEY = 'vsi:auth:v1'

export function loadAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.token || !parsed?.user?.id) return null
    return parsed
  } catch {
    return null
  }
}

export function saveAuthSession(session) {
  try {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        token: session.token,
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        },
      }),
    )
  } catch {
    // Incognito, quota exceeded, or disabled storage
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(AUTH_KEY)
  } catch {
    // ignore
  }
}

export function getAuthToken() {
  return loadAuthSession()?.token ?? null
}
