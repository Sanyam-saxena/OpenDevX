import { apiClient } from '@/api/client'
import type { HealthResponse } from '@/types/api'

export async function getHealthApi(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>('/api/v1/health')
  return response.data
}
