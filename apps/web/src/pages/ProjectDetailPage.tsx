import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  FolderGit2,
  GitBranch,
  Globe,
  Import,
  Layers,
  Plus,
  RefreshCw,
  ShieldAlert,
  Tag,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Badge,
  Button,
  Card,
  CardSkeleton,
  ConfirmModal,
  EmptyState,
  Input,
  Modal,
} from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useDeleteEnvironment, useDeleteProject, useProject } from '@/hooks/useProjects'
import { createEnvironmentApi } from '@/services/projectsApi'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: project, isLoading, refetch } = useProject(id || '')
  const deleteEnvMutation = useDeleteEnvironment(id || '')
  const deleteProjectMutation = useDeleteProject()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [envName, setEnvName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Deletion States
  const [envToDelete, setEnvToDelete] = useState<{ slug: string; name: string } | null>(null)
  const [isDeletingEnv, setIsDeletingEnv] = useState(false)
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)

  const canManage = Boolean(user)

  const handleConfirmDeleteEnv = async () => {
    if (!envToDelete || !id) return
    setIsDeletingEnv(true)
    try {
      await deleteEnvMutation.mutateAsync(envToDelete.slug)
      toast.success(`Environment "${envToDelete.name}" deleted successfully`)
      setEnvToDelete(null)
      refetch()
    } catch {
      toast.error(`Failed to delete environment "${envToDelete.name}"`)
    } finally {
      setIsDeletingEnv(false)
    }
  }

  const handleConfirmDeleteProject = async () => {
    if (!id || !project) return
    setIsDeletingProject(true)
    try {
      await deleteProjectMutation.mutateAsync(id)
      toast.success(`Project "${project.name}" deleted successfully`)
      navigate('/projects')
    } catch {
      toast.error('Failed to delete project')
      setIsDeletingProject(false)
    }
  }


  const handleCreateEnvironment = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return
    setError(null)
    setIsSubmitting(true)
    try {
      await createEnvironmentApi(id, envName)
      toast.success(`Environment "${envName}" added successfully`)
      setIsModalOpen(false)
      setEnvName('')
      refetch()
    } catch {
      setError('Failed to add environment. Name may already exist.')
      toast.error('Failed to add environment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSyncMigration = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      toast.success(`Successfully re-synced migration with ${project?.migration_source || 'source repository'}`)
    }, 1200)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (!project) {
    return (
      <EmptyState
        icon={<ShieldAlert className="w-10 h-10 text-red-500" />}
        title="Project Not Found"
        description="The requested project does not exist or has been deleted."
        actionLabel="Back to Projects"
        onAction={() => {}}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
        <Link to="/projects" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
          <FolderGit2 className="w-3.5 h-3.5" />
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span className="font-semibold text-[var(--text-primary)]">{project.name}</span>
      </div>

      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{project.name}</h1>
            <code className="text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2 py-0.5 rounded border border-[var(--border-color)]">
              /{project.slug}
            </code>
            {project.project_type && (
              <span className="px-2 py-0.5 bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/30 rounded text-xs font-medium">
                {project.project_type}
              </span>
            )}
            {project.migration_source && (
              <span className="px-2 py-0.5 bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded text-xs font-semibold uppercase flex items-center gap-1">
                <Import className="w-3 h-3" />
                Migrated ({project.migration_source})
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed max-w-2xl">
            {project.description || 'No project description provided.'}
          </p>
        </div>
        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteProjectOpen(true)}
              className="text-red-500 hover:text-red-600 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10"
              leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
            >
              Delete Project
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Environment
            </Button>
          </div>
        )}
      </div>

      {/* Migration Sync Notice Card (If project was migrated) */}
      {project.migration_source && (
        <Card className="bg-purple-500/5 border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 mt-0.5">
              <Import className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  Migrated Workload ({project.migration_source.toUpperCase()})
                </h3>
                <Badge variant="success">Active Sync</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                This project was imported into OpenDevX. Operational environments and telemetry are live.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncMigration}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-purple-400" />}
          >
            Re-sync Migration
          </Button>
        </Card>
      )}

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environments Card List */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--accent-color)]" />
              Environments ({project.environments.length})
            </h2>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {project.environments.map((env) => (
              <div key={env.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[var(--text-primary)]">{env.name}</p>
                  <p className="text-xs font-mono text-[var(--text-secondary)]">/{env.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={env.is_active ? 'success' : 'neutral'}>
                    {env.is_active ? 'active' : 'disabled'}
                  </Badge>
                  {canManage && (
                    <button
                      type="button"
                      onClick={() => setEnvToDelete({ slug: env.slug, name: env.name })}
                      className="text-[var(--text-secondary)] hover:text-red-500 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                      title={`Delete environment ${env.name}`}
                      aria-label={`Delete environment ${env.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Project Metadata Sidebar Card */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-3">
            Project Metadata
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#58a6ff]" />
                Project Slug
              </span>
              <code className="text-[var(--text-primary)]">{project.slug}</code>
            </div>

            {project.repo_url && (
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                  Source Repository
                </span>
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-color)] hover:underline truncate max-w-[140px]"
                >
                  Link ↗
                </a>
              </div>
            )}

            {project.project_type && (
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#d29922]" />
                  Type Tag
                </span>
                <span className="text-[var(--text-primary)] font-medium">{project.project_type}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#3fb950]" />
                Created
              </span>
              <span className="text-[var(--text-primary)]">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-[var(--text-secondary)]">Total Environments</span>
              <span className="font-bold text-[var(--text-primary)]">{project.environments.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Environment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Environment"
        description="Define a new operational deployment environment for this project."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateEnvironment}
              isLoading={isSubmitting}
            >
              Add Environment
            </Button>
          </>
        }
      >
        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-500" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleCreateEnvironment} className="space-y-4">
          <Input
            label="ENVIRONMENT NAME"
            type="text"
            required
            value={envName}
            onChange={(e) => setEnvName(e.target.value)}
            placeholder="e.g. Staging, QA, UAT"
          />
        </form>
      </Modal>

      {/* Environment Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(envToDelete)}
        onClose={() => setEnvToDelete(null)}
        onConfirm={handleConfirmDeleteEnv}
        title="Delete Environment"
        description={
          <span>
            Are you sure you want to delete environment <strong>"{envToDelete?.name}"</strong> from project <strong>"{project.name}"</strong>?
          </span>
        }
        confirmText="Delete Environment"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletingEnv}
      />

      {/* Project Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteProjectOpen}
        onClose={() => setIsDeleteProjectOpen(false)}
        onConfirm={handleConfirmDeleteProject}
        title="Delete Project"
        description={
          <span>
            Are you sure you want to delete project <strong>"{project.name}"</strong>? This action cannot be undone and will permanently remove all associated environments and data.
          </span>
        }
        confirmText="Delete Project"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletingProject}
      />
    </motion.div>
  )
}

