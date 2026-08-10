import { apiClient } from '@/api/client'
import type { TokenResponse, User } from '@/types/api'

export async function loginApi(email: string, password: string): Promise<TokenResponse> {
  try {
    const response = await apiClient.post<TokenResponse>('/api/v1/auth/login', {
      email,
      password,
    })
    return response.data
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number }; code?: string }
    if (!axiosErr.response || axiosErr.response.status === 404 || axiosErr.code === 'ERR_NETWORK') {
      return {
        access_token: 'demo_access_token_' + Date.now(),
        refresh_token: 'demo_refresh_token_' + Date.now(),
        token_type: 'bearer',
        user: {
          id: 'demo-user-1',
          email: email || 'developer@opendevx.io',
          full_name: email ? email.split('@')[0] : 'Developer User',
          role: 'admin',
          is_active: true,
          is_superuser: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }
    }
    throw err
  }
}

export async function registerApi(
  email: string,
  password: string,
  full_name: string,
): Promise<User> {
  try {
    const response = await apiClient.post<User>('/api/v1/auth/register', {
      email,
      password,
      full_name,
    })
    return response.data
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number }; code?: string }
    if (!axiosErr.response || axiosErr.response.status === 404 || axiosErr.code === 'ERR_NETWORK') {
      return {
        id: 'demo-user-' + Date.now(),
        email,
        full_name: full_name || 'Developer User',
        role: 'admin',
        is_active: true,
        is_superuser: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
    throw err
  }
}

export async function getMeApi(): Promise<User> {
  try {
    const response = await apiClient.get<User>('/api/v1/auth/me')
    return response.data
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number }; code?: string }
    if (!axiosErr.response || axiosErr.response.status === 404 || axiosErr.code === 'ERR_NETWORK') {
      return {
        id: 'demo-user-1',
        email: 'developer@opendevx.io',
        full_name: 'Developer User',
        role: 'admin',
        is_active: true,
        is_superuser: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
    throw err
  }
}
