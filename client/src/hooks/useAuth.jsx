import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { login as loginRequest, registerAdmin as registerRequest } from '../api/auth'
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
} from '../utils/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadAuthSession())
  const [isLoading] = useState(false)

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials)
    saveAuthSession(data)
    setSession(data)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const data = await registerRequest(payload)
    saveAuthSession(data)
    setSession(data)
    return data
  }, [])

  const logout = useCallback(() => {
    clearAuthSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isLoading,
      login,
      register,
      logout,
    }),
    [session, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
