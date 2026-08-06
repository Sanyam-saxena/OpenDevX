import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProjectApi,
  deleteEnvironmentApi,
  deleteProjectApi,
  getProjectApi,
  listProjectsApi,
} from '@/services/projectsApi'

export function useProjects(page = 1, size = 10) {
  return useQuery({
    queryKey: ['projects', page, size],
    queryFn: () => listProjectsApi(page, size),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => getProjectApi(id),
    enabled: Boolean(id),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      name: string
      description?: string
      slug?: string
      repo_url?: string
      project_type?: string
      migration_source?: string
      migration_status?: string
      environments?: string[]
    }) => createProjectApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProjectApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteEnvironment(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slug: string) => deleteEnvironmentApi(projectId, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

