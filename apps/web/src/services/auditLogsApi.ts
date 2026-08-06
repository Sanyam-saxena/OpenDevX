import { apiClient } from '@/api/client'

export interface AuditLogItem {
  id: string
  user_id: string | null
  action: string
  resource_type: string
  resource_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export async function getAuditLogsApi(limit = 50): Promise<AuditLogItem[]> {
  const response = await apiClient.get<AuditLogItem[]>('/api/v1/audit-logs', {
    params: { limit },
  })
  return response.data
}
