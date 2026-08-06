import { apiClient } from '@/api/client'

export interface SecretItem {
  key: string
  masked_value: string
  provider: string
  updated_at: number
}

export async function listSecretsApi(projectId: string): Promise<SecretItem[]> {
  const res = await apiClient.get<SecretItem[]>(`/api/v1/projects/${projectId}/secrets`)
  return res.data
}

export async function createSecretApi(
  projectId: string,
  key: string,
  value: string,
): Promise<SecretItem> {
  const res = await apiClient.post<SecretItem>(`/api/v1/projects/${projectId}/secrets`, {
    key,
    value,
  })
  return res.data
}

export async function deleteSecretApi(projectId: string, secretKey: string): Promise<void> {
  await apiClient.delete(`/api/v1/projects/${projectId}/secrets/${secretKey}`)
}
