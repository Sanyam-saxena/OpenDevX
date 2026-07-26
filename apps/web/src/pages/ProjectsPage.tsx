import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { useCreateProject, useDeleteProject, useProjects } from '@/hooks/useProjects'

export function ProjectsPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const { data: projectsData, isLoading } = useProjects(page, 10)
  const createMutation = useCreateProject()
  const deleteMutation = useDeleteProject()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const canCreate = user?.role === 'operator' || user?.role === 'admin'
  const canDelete = user?.role === 'admin'

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await createMutation.mutateAsync({ name, description })
      setIsModalOpen(false)
      setName('')
      setDescription('')
    } catch {
      setError('Failed to create project. Name may already exist.')
    }
  }

  const handleDelete = async (id: string, projName: string) => {
    if (confirm(`Are you sure you want to delete project "${projName}"?`)) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <Container className="py-8 space-y-6">
      <PageHeader
        title="Projects"
        description="Organize services, microservices, and applications managed by OpenDevX."
      >
        {canCreate && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Create Project
          </Button>
        )}
      </PageHeader>

      <Card padded={false}>
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading projects...</div>
        ) : projectsData?.items?.length ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {projectsData.items.map((project) => (
              <div key={project.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-base font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {project.name}
                    </Link>
                    <span className="text-xs font-mono text-gray-400">/{project.slug}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {project.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    {project.environments.map((env) => (
                      <Badge key={env.id} variant={env.is_active ? 'success' : 'neutral'}>
                        {env.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id, project.name)}
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-gray-500">
            No projects exist yet.
          </div>
        )}

        {/* Pagination Controls */}
        {projectsData && projectsData.pages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Page {projectsData.page} of {projectsData.pages} ({projectsData.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= projectsData.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        {error && (
          <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            {error}
          </div>
        )}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Payment Service"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Core microservice for handling transaction workflows..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  )
}
