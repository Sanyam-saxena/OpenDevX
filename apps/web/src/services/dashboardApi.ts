import { apiClient } from '@/api/client'

export interface ServiceHealthItem {
  id: string
  name: string
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL'
  detail: string
  icon_type: string
}

export interface KpiMetrics {
  cpu_avg: number
  memory_avg: number
  network_mbps: number
  deploys_24h: number
  uptime_pct: number
  cost_mtd: number
}

export interface TrafficPoint {
  timestamp: string
  requests_per_sec: number
}

export interface LiveEventItem {
  id: string
  channel: 'SLACK' | 'DISCORD' | 'JENKINS' | 'GITHUB'
  message: string
  timestamp: string
  level: 'info' | 'warning' | 'success' | 'danger'
}

export interface LastDeployment {
  version: string
  status: string
  author: string
  commit_sha: string
  duration: string
  deployed_at: string
  environment: string
}

export async function getServicesHealthApi(): Promise<ServiceHealthItem[]> {
  const res = await apiClient.get<ServiceHealthItem[]>('/api/v1/dashboard/services-health')
  return res.data
}

export async function getKpiMetricsApi(): Promise<KpiMetrics> {
  const res = await apiClient.get<KpiMetrics>('/api/v1/dashboard/kpis')
  return res.data
}

export async function getTrafficApi(): Promise<TrafficPoint[]> {
  const res = await apiClient.get<TrafficPoint[]>('/api/v1/dashboard/traffic')
  return res.data
}

export async function getLiveEventsApi(): Promise<LiveEventItem[]> {
  const res = await apiClient.get<LiveEventItem[]>('/api/v1/dashboard/live-events')
  return res.data
}

export async function getLastDeploymentApi(): Promise<LastDeployment> {
  const res = await apiClient.get<LastDeployment>('/api/v1/dashboard/last-deployment')
  return res.data
}
