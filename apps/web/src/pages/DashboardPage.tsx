import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { useHealth } from '@/hooks/useHealth'
import { useProjects } from '@/hooks/useProjects'

export function DashboardPage() {
  const { data: health, isLoading: healthLoading } = useHealth()
  const { data: projectsData, isLoading: projectsLoading } = useProjects(1, 5)

  return (
    <Container className="py-8 space-y-8">
      <PageHeader
        title="Platform Overview"
        description="Monitor cloud-native operational health, platform services, and active projects."
      >
        <Link to="/projects">
          <Button variant="primary">Manage Projects</Button>
        </Link>
      </PageHeader>

      {/* Health Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              API Status
            </span>
            <Badge
              variant={
                healthLoading
                  ? 'neutral'
                  : health?.status === 'healthy'
                    ? 'success'
                    : health?.status === 'degraded'
                      ? 'warning'
                      : 'error'
              }
            >
              {healthLoading ? 'checking...' : health?.status || 'unknown'}
            </Badge>
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {health?.service || 'OpenDevX API'}
          </p>
          <p className="mt-1 text-xs text-gray-500">v{health?.version || '0.1.0'}</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Database
            </span>
            <Badge
              variant={
                health?.components?.database?.status === 'healthy'
                  ? 'success'
                  : 'error'
              }
            >
              {health?.components?.database?.status || 'disconnected'}
            </Badge>
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            PostgreSQL
          </p>
          <p className="mt-1 text-xs text-gray-500">Async engine pool</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cache
            </span>
            <Badge
              variant={
                health?.components?.redis?.status === 'healthy'
                  ? 'success'
                  : 'error'
              }
            >
              {health?.components?.redis?.status || 'disconnected'}
            </Badge>
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Redis
          </p>
          <p className="mt-1 text-xs text-gray-500">Async connection pool</p>
        </Card>
      </div>

      {/* Projects List Preview */}
      <Card padded={false}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Active Projects ({projectsData?.total || 0})
          </h2>
          <Link to="/projects" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            View all →
          </Link>
        </div>

        {projectsLoading ? (
          <div className="p-6 text-center text-gray-500 text-sm">Loading projects...</div>
        ) : projectsData?.items?.length ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {projectsData.items.map((project) => (
              <div key={project.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div>
                  <Link
                    to={`/projects/${project.id}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {project.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{project.description || 'No description provided.'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{project.environments.length} envs</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No projects found. Create your first project to get started!
          </div>
        )}
      </Card>
    </Container>
  )
}
