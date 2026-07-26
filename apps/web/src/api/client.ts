import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const API_TIMEOUT_MS = 15_000

export const TOKEN_STORAGE_KEY = 'opendevx_access_token'
export const REFRESH_TOKEN_STORAGE_KEY = 'opendevx_refresh_token'

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function setStoredTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const refreshToken = getStoredRefreshToken()
      const originalRequest = error.config

      if (
        refreshToken &&
        originalRequest &&
        !(originalRequest as unknown as Record<string, unknown>)._retry
      ) {
        ;(originalRequest as unknown as Record<string, unknown>)._retry = true
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/auth/refresh`,
            { refresh_token: refreshToken },
          )
          const { access_token, refresh_token: new_refresh_token } = res.data
          setStoredTokens(access_token, new_refresh_token)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
          }
          return apiClient(originalRequest)
        } catch {
          clearStoredTokens()
        }
      }
    }
    return Promise.reject(error)
  },
)
