import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authService, getToken, setToken } from '../api'

const AuthContext = createContext(null)

const ADMIN_EMAIL = 'admin@echopride.com'

function normalizeIdentifier(identifier) {
  const trimmed = String(identifier || '').trim().toLowerCase()
  if (trimmed === 'admin') return ADMIN_EMAIL
  return trimmed
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ready, setReady] = useState(false)
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    let cancelled = false
    const token = getToken()
    if (!token) {
      setReady(true)
      return undefined
    }
    authService
      .profile()
      .then((res) => {
        if (cancelled) return
        const user = res?.user
        if (user && user.role === 'admin') {
          setAdminUser(user)
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      })
      .catch(() => {
        if (cancelled) return
        setIsAuthenticated(false)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (identifier, password) => {
    const email = normalizeIdentifier(identifier)
    try {
      const data = await authService.login({ email, password })
      const user = data?.user
      if (!user || user.role !== 'admin') {
        return { ok: false, error: 'Admin access required. Please use an admin account.' }
      }
      setToken(data.accessToken)
      setAdminUser(user)
      setIsAuthenticated(true)
      setReady(true)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err?.message || 'Invalid email or password.' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      /* refresh cookie may already be gone */
    }
    setToken(null)
    setAdminUser(null)
    setIsAuthenticated(false)
  }, [])

  const value = { isAuthenticated, ready, adminUser, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
