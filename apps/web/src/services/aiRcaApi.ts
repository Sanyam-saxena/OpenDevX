import { apiClient } from '@/api/client'

export interface RcaResult {
  analysis_id: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'HEALTHY' | string
  root_cause_title: string
  explanation: string
  remediation_plan: string[]
  one_click_fix_available: boolean
  fix_action_name: string
}

export interface CopilotChatResponse {
  query: string
  reply: string
  suggestions: string[]
}

export async function analyzeLogRcaApi(projectId: string, errorLog?: string): Promise<RcaResult> {
  const res = await apiClient.post<RcaResult>(`/api/v1/projects/${projectId}/ai/rca`, {
    error_log: errorLog || 'ERROR: asyncpg.exceptions.TooManyConnectionsError',
  })
  return res.data
}

export async function applyRcaFixApi(projectId: string): Promise<void> {
  await apiClient.post(`/api/v1/projects/${projectId}/ai/rca/apply-fix`)
}

export async function resetRcaFixApi(projectId: string): Promise<void> {
  await apiClient.post(`/api/v1/projects/${projectId}/ai/rca/reset`)
}

export async function sendCopilotChatApi(query: string): Promise<CopilotChatResponse> {
  const res = await apiClient.post<CopilotChatResponse>('/api/v1/projects/ai/copilot/chat', {
    query,
  })
  return res.data
}
