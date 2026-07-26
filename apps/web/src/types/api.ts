export type Role = 'admin' | 'operator' | 'viewer'

export interface User {
  id: string
  email: string
  full_name: string
  role: Role
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
}

export interface Environment {
  id: string
  project_id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  slug: string
  description?: string | null
  owner_id?: string | null
  environments: Environment[]
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id?: string | null
  action: string
  resource_type: string
  resource_id?: string | null
  details?: Record<string, unknown> | null
  ip_address?: string | null
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface ComponentHealth {
  status: 'healthy' | 'unhealthy'
  message?: string | null
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  service: string
  version: string
  environment: string
  components: Record<string, ComponentHealth>
}
