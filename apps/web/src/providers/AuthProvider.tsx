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
      const token = getStoredAccessToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const me = await getMeApi()
        setUser(me)
      } catch {
        clearStoredTokens()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // NOTE: Do NOT wrap in try/finally here.
    // Let errors propagate to the caller (LoginPage) so it can display them.
    const data = await loginApi(email, password)
    setStoredTokens(data.access_token, data.refresh_token)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    clearStoredTokens()
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
