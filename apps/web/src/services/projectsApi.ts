import { apiClient } from '@/api/client'
import type { Environment, PaginatedResponse, Project } from '@/types/api'

export async function listProjectsApi(
  page = 1,
  size = 10,
): Promise<PaginatedResponse<Project>> {
  const response = await apiClient.get<PaginatedResponse<Project>>('/api/v1/projects', {
    params: { page, size },
  })
  return response.data
}

export async function getProjectApi(id: string): Promise<Project> {
  const response = await apiClient.get<Project>(`/api/v1/projects/${id}`)
  return response.data
}

export async function createProjectApi(payload: {
  name: string
  description?: string
  slug?: string
  repo_url?: string
  project_type?: string
  migration_source?: string
  migration_status?: string
  environments?: string[]
}): Promise<Project> {
  const response = await apiClient.post<Project>('/api/v1/projects', payload)
  return response.data
}

export async function deleteProjectApi(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/projects/${id}`)
}

export async function listEnvironmentsApi(projectId: string): Promise<Environment[]> {
  const response = await apiClient.get<Environment[]>(
    `/api/v1/projects/${projectId}/environments`,
  )
  return response.data
}

export async function createEnvironmentApi(
  projectId: string,
  name: string,
): Promise<Environment> {
  const response = await apiClient.post<Environment>(
    `/api/v1/projects/${projectId}/environments`,
    { name },
  )
  return response.data
}

export async function deleteEnvironmentApi(
  projectId: string,
  slug: string,
): Promise<void> {
  await apiClient.delete(`/api/v1/projects/${projectId}/environments/${slug}`)
}

