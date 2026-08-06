import { apiClient } from '@/api/client'
import type { PaginatedResponse, User } from '@/types/api'

export async function getUsersApi(page = 1, size = 10): Promise<PaginatedResponse<User>> {
  const response = await apiClient.get<PaginatedResponse<User>>('/api/v1/users', {
    params: { page, size },
  })
  return response.data
}

export async function updateUserApi(
  userId: string,
  data: { role?: string; is_active?: boolean; full_name?: string },
): Promise<User> {
  const response = await apiClient.put<User>(`/api/v1/users/${userId}`, data)
  return response.data
}
