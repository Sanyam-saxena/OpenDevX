import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clearStoredTokens, getStoredAccessToken, setStoredTokens } from '@/api/client'
import { getMeApi, loginApi } from '@/services/authApi'
import type { User } from '@/types/api'
import { AuthContext } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadUser() {
      const storedUserStr = localStorage.getItem('opendevx_user')
      if (storedUserStr) {
        try {
          const parsed = JSON.parse(storedUserStr)
          setUser(parsed)
          setIsLoading(false)
          return
        } catch {}
      }

      const token = getStoredAccessToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const me = await getMeApi()
        setUser(me)
        localStorage.setItem('opendevx_user', JSON.stringify(me))
      } catch {
        clearStoredTokens()
        localStorage.removeItem('opendevx_user')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginApi(email, password)
    setStoredTokens(data.access_token, data.refresh_token)
    setUser(data.user)
    localStorage.setItem('opendevx_user', JSON.stringify(data.user))
  }, [])

  const logout = useCallback(() => {
    clearStoredTokens()
    localStorage.removeItem('opendevx_user')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
