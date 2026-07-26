import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProjectApi,
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
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      createProjectApi(name, description),
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
