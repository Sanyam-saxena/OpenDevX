import { apiClient } from '@/api/client'

export interface EventItem {
  id: string
  event_type: string
  source: string
  status: string
  payload: Record<string, unknown>
  timestamp: number
}

export async function listEventsApi(projectId: string): Promise<EventItem[]> {
  const res = await apiClient.get<EventItem[]>(`/api/v1/projects/${projectId}/events`)
  return res.data
}

export async function dispatchEventApi(
  projectId: string,
  eventType: string,
  payload?: Record<string, unknown>,
): Promise<EventItem> {
  const res = await apiClient.post<EventItem>(`/api/v1/projects/${projectId}/events/dispatch`, {
    event_type: eventType,
    payload: payload || { triggered_by: 'OpenDevX Frontend Dashboard' },
  })
  return res.data
}
