import { useState } from 'react'
import type { FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { useProject } from '@/hooks/useProjects'
import { createEnvironmentApi } from '@/services/projectsApi'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: project, isLoading, refetch } = useProject(id || '')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [envName, setEnvName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canCreateEnv = user?.role === 'operator' || user?.role === 'admin'

  const handleCreateEnvironment = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return
    setError(null)
    setIsSubmitting(true)
    try {
      await createEnvironmentApi(id, envName)
      setIsModalOpen(false)
      setEnvName('')
      refetch()
    } catch {
      setError('Failed to add environment. Name may already exist.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="text-center text-sm text-gray-500">Loading project details...</div>
      </Container>
    )
  }

  if (!project) {
    return (
      <Container className="py-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Not Found</h1>
        <Link to="/projects">
          <Button variant="secondary">Back to Projects</Button>
        </Link>
      </Container>
    )
  }

  return (
    <Container className="py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/projects" className="hover:underline">Projects</Link>
        <span>/</span>
        <span className="font-semibold text-gray-900 dark:text-white">{project.name}</span>
      </div>

      <PageHeader
        title={project.name}
        description={project.description || 'No description provided.'}
      >
        {canCreateEnv && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Add Environment
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Environments ({project.environments.length})
          </h2>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {project.environments.map((env) => (
              <div key={env.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{env.name}</p>
                  <p className="text-xs font-mono text-gray-400">/{env.slug}</p>
                </div>
                <Badge variant={env.is_active ? 'success' : 'neutral'}>
                  {env.is_active ? 'active' : 'disabled'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Metadata
          </h2>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-gray-400">Project Slug:</span>
              <p className="font-mono font-semibold text-gray-900 dark:text-white">{project.slug}</p>
            </div>
            <div>
              <span className="text-gray-400">Created:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Environment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Environment">
        {error && (
          <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            {error}
          </div>
        )}
        <form onSubmit={handleCreateEnvironment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Environment Name
            </label>
            <input
              type="text"
              required
              value={envName}
              onChange={(e) => setEnvName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Staging"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Environment'}
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  )
}
