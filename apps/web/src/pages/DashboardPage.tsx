import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Database,
  FolderGit2,
  Layers,
  Plus,
  Radio,
  Server,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react'
import { Badge, Button, Card, CardDescription, CardHeader, CardTitle, CardSkeleton, EmptyState } from '@/components/ui'
import { useHealth } from '@/hooks/useHealth'
import { useProjects } from '@/hooks/useProjects'

export function DashboardPage() {
  const { data: health, isLoading: healthLoading } = useHealth()
  const { data: projectsData, isLoading: projectsLoading } = useProjects(1, 5)

  const totalProjects = projectsData?.total || 0
  const totalEnvironments =
    projectsData?.items?.reduce((acc, p) => acc + p.environments.length, 0) || 0

  const kpis = [
    {
      title: 'Active Projects',
      count: totalProjects,
      trend: '+12% this month',
      icon: FolderGit2,
      color: 'text-[#2f81f7]',
      bg: 'bg-[#2f81f7]/15',
    },
    {
      title: 'Environments',
      count: totalEnvironments,
      trend: 'Across all services',
      icon: Layers,
      color: 'text-[#3fb950]',
      bg: 'bg-[#238636]/15',
    },
    {
      title: 'Active Deployments',
      count: 24,
      trend: '99.9% success rate',
      icon: Zap,
      color: 'text-[#d29922]',
      bg: 'bg-[#d29922]/15',
    },
    {
      title: 'Platform Users',
      count: 8,
      trend: 'RBAC active',
      icon: Users,
      color: 'text-[#a371f7]',
      bg: 'bg-[#a371f7]/15',
    },
  ]

  const activityEvents = [
    {
      id: 1,
      type: 'PROJECT_CREATE',
      title: 'Project created',
      details: 'Created new project container service',
      time: '10m ago',
      user: 'admin@example.com',
    },
    {
      id: 2,
      type: 'USER_LOGIN',
      title: 'User authentication',
      details: 'Logged in via OAuth2 Bearer',
      time: '25m ago',
      user: 'testuser@example.com',
    },
    {
      id: 3,
      type: 'ENVIRONMENT_UPDATE',
      title: 'Environment scaled',
      details: 'Updated production cluster replicas',
      time: '1h ago',
      user: 'operator@example.com',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            Developer Platform Console
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Real-time status overview, environment health, and recent operational metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/projects">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Create Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.2, ease: 'easeOut' }}
            >
              <Card interactive className="relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-[var(--text-primary)]">
                    {kpi.count}
                  </span>
                  <span className="text-[11px] font-medium text-[#3fb950] flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    {kpi.trend}
                  </span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Row 2: Infrastructure Health Status Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#2f81f7] animate-pulse" />
          Infrastructure Health
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-[#58a6ff]" />
                <span className="text-xs font-semibold text-[var(--text-primary)]">API Service</span>
              </div>
              <Badge
                variant={
                  healthLoading
                    ? 'neutral'
                    : health?.status === 'healthy'
                    ? 'success'
                    : 'danger'
                }
              >
                {healthLoading ? 'checking...' : health?.status || 'unknown'}
              </Badge>
            </div>
            <p className="mt-3 text-lg font-bold text-[var(--text-primary)]">
              {health?.service || 'OpenDevX API'}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">v{health?.version || '0.1.0'} • FastAPI</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-[#3fb950]" />
                <span className="text-xs font-semibold text-[var(--text-primary)]">PostgreSQL</span>
              </div>
              <Badge
                variant={
                  health?.components?.database?.status === 'healthy'
                    ? 'success'
                    : 'danger'
                }
              >
                {health?.components?.database?.status || 'disconnected'}
              </Badge>
            </div>
            <p className="mt-3 text-lg font-bold text-[var(--text-primary)]">Primary DB</p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Async SQLAlchemy Pool</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-[#d29922]" />
                <span className="text-xs font-semibold text-[var(--text-primary)]">Redis Cache</span>
              </div>
              <Badge
                variant={
                  health?.components?.redis?.status === 'healthy'
                    ? 'success'
                    : 'danger'
                }
              >
                {health?.components?.redis?.status || 'disconnected'}
              </Badge>
            </div>
            <p className="mt-3 text-lg font-bold text-[var(--text-primary)]">In-Memory Store</p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Session & Rate Limit Cache</p>
          </Card>
        </div>
      </div>

      {/* Row 3: Active Projects & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects List Preview */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#2f81f7]" />
              Recent Projects ({totalProjects})
            </h2>
            <Link to="/projects" className="text-xs text-[#58a6ff] hover:underline">
              View all →
            </Link>
          </div>

          {projectsLoading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : projectsData?.items?.length ? (
            <div className="space-y-3">
              {projectsData.items.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.04, ease: 'easeOut' }}
                >
                  <Card interactive>
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-sm font-bold text-[var(--text-primary)] hover:text-[#58a6ff] transition-colors"
                        >
                          {project.name}
                        </Link>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">
                          {project.description || 'No description provided.'}
                        </p>
                      </div>
                      <Badge variant="info" showDot={false}>
                        {project.environments.length} envs
                      </Badge>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>slug: <code className="text-[var(--text-primary)]">{project.slug}</code></span>
                      <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active projects"
              description="Get started by creating your first platform project."
            />
          )}
        </div>

        {/* Activity Timeline */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#a371f7]" />
            Activity Timeline
          </h2>
          <Card className="space-y-4">
            {activityEvents.map((evt) => (
              <div key={evt.id} className="flex items-start space-x-3 text-xs">
                <div className="p-1.5 bg-[var(--bg-surface)] text-[#58a6ff] rounded-md mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-primary)]">{evt.title}</p>
                  <p className="text-[var(--text-secondary)] mt-0.5">{evt.details}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                    <span>{evt.user}</span>
                    <span>{evt.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* Quick Action Box */}
          <Card className="space-y-3">
            <CardHeader className="mb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Shortcuts for common admin tasks</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/projects">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <FolderGit2 className="w-3.5 h-3.5 mr-1" />
                  Projects
                </Button>
              </Link>
              <Link to="/users">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Users className="w-3.5 h-3.5 mr-1" />
                  Users
                </Button>
              </Link>
              <Link to="/audit-logs">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Audit Logs
                </Button>
              </Link>
              <Link to="/metrics">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Activity className="w-3.5 h-3.5 mr-1" />
                  Metrics
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
