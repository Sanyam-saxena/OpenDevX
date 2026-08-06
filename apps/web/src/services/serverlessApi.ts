import { apiClient } from '@/api/client'

export interface ServerlessExecution {
  execution_id: string
  function_name: string
  runtime: string
  status: string
  duration_ms: number
  timestamp: number
  logs: string
}

export async function listServerlessFunctionsApi(
  projectId: string,
): Promise<ServerlessExecution[]> {
  const res = await apiClient.get<ServerlessExecution[]>(
    `/api/v1/projects/${projectId}/serverless/functions`,
  )
  return res.data
}

export async function invokeServerlessFunctionApi(
  projectId: string,
  functionName: string,
): Promise<ServerlessExecution> {
  const res = await apiClient.post<ServerlessExecution>(
    `/api/v1/projects/${projectId}/serverless/invoke`,
    {
      function_name: functionName,
    },
  )
  return res.data
}
