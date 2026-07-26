import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/pages/LoadingPage'
import type { Role } from '@/types/api'

interface ProtectedRouteProps {
  requiredRole?: Role
}

const ROLE_RANK: Record<Role, number> = {
  admin: 3,
  operator: 2,
  viewer: 1,
}

export function ProtectedRoute({ requiredRole = 'viewer' }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const userRank = ROLE_RANK[user.role] || 0
  const requiredRank = ROLE_RANK[requiredRole] || 1

  if (userRank < requiredRank) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
