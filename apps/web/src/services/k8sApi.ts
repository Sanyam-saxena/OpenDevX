import { apiClient } from '@/api/client'

export interface K8sPod {
  pod_id: string
  name: string
  status: 'Running' | 'Pending' | 'CrashLoopBackOff' | 'Failed'
  ready: string
  restarts: number
  cpu_usage: string
  memory_usage: string
  node: string
  age: string
}

export async function listPodsApi(projectId: string): Promise<K8sPod[]> {
  const res = await apiClient.get<K8sPod[]>(`/api/v1/projects/${projectId}/k8s/pods`)
  return res.data
}

export async function getPodLogsApi(
  projectId: string,
  podId: string,
): Promise<{ pod_id: string; container: string; logs: string }> {
  const res = await apiClient.get<{ pod_id: string; container: string; logs: string }>(
    `/api/v1/projects/${projectId}/k8s/pods/${podId}/logs`,
  )
  return res.data
}
