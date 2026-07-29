import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { useAuth } from '@/hooks/useAuth'
import { useHealth } from '@/hooks/useHealth'

export function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const { data: health, isLoading: healthLoading } = useHealth()

  return (
    <Container className="py-16 space-y-12">
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <Badge variant="info">Internal Developer Platform v0.2.0</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Engineered for Developer Velocity
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          OpenDevX provides unified project management, automated environment provisioning, role-based governance, and real-time operational telemetry.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="lg">
                Go to Dashboard →
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Platform Status
            </h2>
            <Badge
              variant={
                healthLoading
                  ? 'neutral'
                  : health?.status === 'healthy'
                    ? 'success'
                    : 'warning'
              }
            >
              {healthLoading ? 'checking...' : health?.status || 'operational'}
            </Badge>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
              <span>API Service</span>
              <span className="font-mono font-medium text-gray-900 dark:text-white">
                {health?.service || 'OpenDevX API'} (v{health?.version || '0.1.0'})
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
              <span>Database Engine</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {health?.components?.database?.status === 'healthy' ? 'PostgreSQL Connected' : 'Ready'}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
              <span>Cache Engine</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {health?.components?.redis?.status === 'healthy' ? 'Redis Active' : 'Ready'}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Quick Navigation
            </h2>
            {user && <span className="text-xs text-gray-500">Logged in as {user.full_name}</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/dashboard"
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <p className="font-bold text-sm text-gray-900 dark:text-white">Dashboard</p>
              <p className="text-xs text-gray-500 mt-1">Platform metrics & status</p>
            </Link>
            <Link
              to="/projects"
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <p className="font-bold text-sm text-gray-900 dark:text-white">Projects</p>
              <p className="text-xs text-gray-500 mt-1">Manage cloud services</p>
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  )
}
