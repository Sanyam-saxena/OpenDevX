/**
 * Application Runtime Environment Configuration
 * Single source of truth for environment variables loaded by Vite.
 */

const DEFAULT_API_BASE_URL = 'http://localhost:8000'

export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL
  if (url && typeof url === 'string' && url.trim() !== '') {
    return url.trim().replace(/\/+$/, '') // strip trailing slashes if any
  }

  // Development safety fallback to prevent relative 404 routing to port 5173
  if (import.meta.env.DEV) {
    return DEFAULT_API_BASE_URL
  }

  throw new Error(
    'CRITICAL: VITE_API_BASE_URL environment variable is missing or empty in production build.',
  )
}

export const env = {
  get apiBaseUrl(): string {
    return getApiBaseUrl()
  },
  appEnv: (import.meta.env.VITE_APP_ENV as string) || 'development',
  isDev: Boolean(import.meta.env.DEV),
} as const
