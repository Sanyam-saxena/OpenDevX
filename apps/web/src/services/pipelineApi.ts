import { apiClient } from '@/api/client'

export interface PipelineStage {
  id: string
  name: string
  status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'PENDING'
  duration_ms: number
  logs: string
}

export interface PipelineDag {
  project_id: string
  pipeline_name: string
  status: string
  stages: PipelineStage[]
}

export async function getPipelineDagApi(projectId: string): Promise<PipelineDag> {
  const res = await apiClient.get<PipelineDag>(`/api/v1/projects/${projectId}/pipeline/dag`)
  return res.data
}

export async function triggerPipelineApi(projectId: string): Promise<{ pipeline_id: string; status: string; message: string }> {
  const res = await apiClient.post<{ pipeline_id: string; status: string; message: string }>(
    `/api/v1/projects/${projectId}/pipeline/trigger`,
  )
  return res.data
}
