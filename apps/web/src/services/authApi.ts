import { apiClient } from '@/api/client'
import type { TokenResponse, User } from '@/types/api'

export async function loginApi(email: string, password: string): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/api/v1/auth/login', {
    email,
    password,
  })
  return response.data
}

export async function registerApi(
  email: string,
  password: string,
  full_name: string,
  role = 'viewer',
): Promise<User> {
  const response = await apiClient.post<User>('/api/v1/auth/register', {
    email,
    password,
    full_name,
    role,
  })
  return response.data
}

export async function getMeApi(): Promise<User> {
  const response = await apiClient.get<User>('/api/v1/auth/me')
  return response.data
}
