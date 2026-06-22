import { getAuthToken } from '../utils/authStorage'

export function withAuthHeaders(headers = {}) {
  const token = getAuthToken()
  if (!token) return headers

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  }
}
