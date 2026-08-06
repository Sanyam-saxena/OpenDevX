import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Container,
  ExternalLink,
  FolderGit2,
  GitBranch,
  Globe,
  Grid,
  Import,
  Info,
  Layers,
  List,
  Plus,
  RefreshCw,
  Search,
  Server,
  Sparkles,
  Tag,
  Trash2,
  X,
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
  Table,
} from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useCreateProject, useDeleteProject, useProjects } from '@/hooks/useProjects'
import type { Project } from '@/types/api'

// Helper to slugify text for URL slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const DEFAULT_PROJECT_TYPES = [
  { label: 'Microservice', icon: '⚡' },
  { label: 'API Backend', icon: '🔌' },
  { label: 'Frontend App', icon: '🎨' },
  { label: 'Full Stack', icon: '🧱' },
  { label: 'Data Pipeline', icon: '📊' },
  { label: 'CLI Tool', icon: '🛠️' },
  { label: 'Library / SDK', icon: '📦' },
  { label: 'Infrastructure', icon: '☁️' },
]

const MIGRATION_PROVIDERS = [
  {
    id: 'github',
    name: 'GitHub / GitLab',
    category: 'Git Repository',
    icon: GitBranch,
    description: 'Import directly from source code repositories with automatic environment discovery.',
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    id: 'aws',
    name: 'AWS Cloud',
    category: 'Cloud Infrastructure',
    icon: Cloud,
    description: 'Migrate ECS, EKS, EC2, or Serverless workloads from Amazon Web Services.',
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'docker',
    name: 'Docker Compose / K8s',
    category: 'Containerized Service',
    icon: Container,
    description: 'Import multi-container docker-compose.yml or Kubernetes Helm manifests.',
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
  {
    id: 'vercel',
    name: 'Vercel / Netlify / Heroku',
    category: 'PaaS Platform',
    icon: Server,
    description: 'Re-host web applications and microservices from PaaS providers.',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: 'gcp',
    name: 'GCP / Azure / Custom',
    category: 'Custom Source',
    icon: Globe,
    description: 'Migrate from Google Cloud Platform, Azure, or any custom API endpoint.',
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  },
]

const MIGRATION_MODES = [
  {
    id: 'live_sync',
    name: 'Live Sync / Parallel Run',
    desc: 'Keep existing infrastructure running while establishing live synchronization with OpenDevX.',
    badge: 'Recommended',
  },
  {
    id: 'full_replatform',
    name: 'Full Re-platform / Direct Import',
    desc: 'Import configuration, source code, environments, and secrets directly into OpenDevX.',
    badge: 'Complete Import',
  },
  {
    id: 'lift_shift',
    name: 'Lift & Shift Containerization',
    desc: 'Containerize current application binaries/manifests without modifying underlying code.',
    badge: 'Quick Migration',
  },
]

const DEFAULT_ENVIRONMENTS = ['Development', 'Production']

export function ProjectsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const { data: projectsData, isLoading } = useProjects(page, 10)
  const createMutation = useCreateProject()
  const deleteMutation = useDeleteProject()

  // ═══ Create & Migrate Modal State ═══
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [createMode, setCreateMode] = useState<'scratch' | 'migrate'>('scratch')
  const [wizardStep, setWizardStep] = useState<number>(1) // Step 1: Details, 2: Envs/Configs, 3: Review

  // Common Fields
  const [name, setName] = useState('')
  const [slugValue, setSlugValue] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [description, setDescription] = useState('')
  const [repoUrl, setRepoUrl] = useState('')

  // Tag Selection State (Multi-select + custom tags)
  const [tagOptions, setTagOptions] = useState<{ label: string; icon: string }[]>([...DEFAULT_PROJECT_TYPES])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false)
  const [customTagInput, setCustomTagInput] = useState('')

  const [environments, setEnvironments] = useState<string[]>([...DEFAULT_ENVIRONMENTS])
  const [newEnvInput, setNewEnvInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Migration Specific Fields
  const [selectedProvider, setSelectedProvider] = useState<string>('github')
  const [sourceUrl, setSourceUrl] = useState<string>('')
  const [migrationMode, setMigrationMode] = useState<string>('live_sync')
  const [envVarsText, setEnvVarsText] = useState<string>('')

  const canCreate = Boolean(user)
  const canDelete = Boolean(user)

  const handleNameChange = (val: string) => {
    setName(val)
    if (!slugEdited) {
      setSlugValue(slugify(val))
    }
  }

  const handleSlugChange = (val: string) => {
    setSlugValue(slugify(val))
    setSlugEdited(true)
  }

  const handleSourceUrlChange = (url: string) => {
    setSourceUrl(url)
    if (!name && url) {
      const parts = url.replace(/\.git$/, '').split('/')
      const lastPart = parts[parts.length - 1]
      if (lastPart) {
        const derivedName = lastPart.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        setName(derivedName)
        if (!slugEdited) {
          setSlugValue(slugify(derivedName))
        }
      }
    }
  }

  const toggleTypeTag = (tagLabel: string) => {
    setSelectedTypes((prev) =>
      prev.includes(tagLabel) ? prev.filter((t) => t !== tagLabel) : [...prev, tagLabel],
    )
  }

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim()
    if (!trimmed) return
    if (!tagOptions.some((t) => t.label.toLowerCase() === trimmed.toLowerCase())) {
      setTagOptions((prev) => [...prev, { label: trimmed, icon: '🏷️' }])
    }
    if (!selectedTypes.includes(trimmed)) {
      setSelectedTypes((prev) => [...prev, trimmed])
    }
    setCustomTagInput('')
    setIsAddingCustomTag(false)
  }

  const addEnvironment = () => {
    const trimmed = newEnvInput.trim()
    if (!trimmed) return
    if (environments.map((e) => e.toLowerCase()).includes(trimmed.toLowerCase())) {
      toast.error(`Environment "${trimmed}" already added`)
      return
    }
    setEnvironments((prev) => [...prev, trimmed])
    setNewEnvInput('')
  }

  const removeEnvironment = (envName: string) => {
    setEnvironments((prev) => prev.filter((e) => e !== envName))
  }

  const resetModal = () => {
    setWizardStep(1)
    setName('')
    setSlugValue('')
    setSlugEdited(false)
    setDescription('')
    setRepoUrl('')
    setSelectedTypes([])
    setIsAddingCustomTag(false)
    setCustomTagInput('')
    setEnvironments([...DEFAULT_ENVIRONMENTS])
    setNewEnvInput('')
    setSelectedProvider('github')
    setSourceUrl('')
    setMigrationMode('live_sync')
    setEnvVarsText('')
    setError(null)
  }

  const openCreateModal = () => {
    resetModal()
    setCreateMode('scratch')
    setIsModalOpen(true)
  }

  const openMigrateModal = () => {
    resetModal()
    setCreateMode('migrate')
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    resetModal()
  }

  const handleCreateSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Project name is required.')
      setWizardStep(1)
      return
    }
    if (!slugValue.trim()) {
      setError('Project slug cannot be empty.')
      setWizardStep(1)
      return
    }

    try {
      const isMigration = createMode === 'migrate'
      const projectTypeStr = selectedTypes.length > 0 ? selectedTypes.join(', ') : isMigration ? 'Migrated Workload' : undefined

      const created = await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        slug: slugValue.trim() || undefined,
        repo_url: (isMigration ? sourceUrl : repoUrl).trim() || undefined,
        project_type: projectTypeStr,
        migration_source: isMigration ? selectedProvider : undefined,
        migration_status: isMigration ? 'active' : undefined,
        environments: environments.length > 0 ? environments : DEFAULT_ENVIRONMENTS,
      })

      toast.success(
        <span>
          {isMigration ? 'Migrated project' : 'Project'} <strong>{created.name}</strong> created successfully with {created.environments.length} environments.
        </span>,
        { duration: 4000 },
      )
      handleClose()
      navigate(`/projects/${created.id}`)
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      const msg = typeof detail === 'string' ? detail : 'Failed to create project. Name or slug may already exist.'
      setError(msg)
    }
  }

  // Project Deletion State
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const promptDeleteProject = (id: string, projName: string) => {
    setProjectToDelete({ id, name: projName })
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    try {
      await deleteMutation.mutateAsync(projectToDelete.id)
      toast.success(`Project "${projectToDelete.name}" deleted`)
      setProjectToDelete(null)
    } catch {
      toast.error('Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }


  const filteredProjects =
    projectsData?.items?.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())),
    ) || []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[var(--accent-color)]" />
            Projects ({projectsData?.total || 0})
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Services, applications, and infrastructure stacks managed across platform environments.
          </p>
        </div>
        {canCreate && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={openMigrateModal}
              leftIcon={<Import className="w-4 h-4 text-purple-400" />}
            >
              Migrate Project
            </Button>
            <Button
              variant="primary"
              onClick={openCreateModal}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Project
            </Button>
          </div>
        )}
      </div>

      {/* Filter & View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter projects by name or slug..."
            className="w-full bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] pl-9 pr-3 py-2 rounded-md border border-[var(--border-color)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] placeholder-[var(--text-secondary)] transition-colors"
            aria-label="Filter projects"
          />
        </div>

        <div className="flex items-center space-x-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded text-xs flex items-center cursor-pointer transition-colors ${
              viewMode === 'grid'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs flex items-center cursor-pointer transition-colors ${
              viewMode === 'table'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Table View"
            aria-label="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.04, ease: 'easeOut' }}
              >
                <Card interactive className="flex flex-col justify-between h-full relative group">
                  <div>
                    <div className="flex items-start justify-between">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-base font-bold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors flex items-center gap-1.5"
                      >
                        {project.name}
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                      </Link>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => promptDeleteProject(project.id, project.name)}
                          className="text-[var(--text-secondary)] hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-[#da3633]/10 transition-colors cursor-pointer"
                          title="Delete Project"
                          aria-label={`Delete ${project.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs font-mono text-[var(--text-secondary)]">/{project.slug}</code>
                      {project.migration_source && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                          <Import className="w-2.5 h-2.5" />
                          {project.migration_source}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {project.environments.map((env) => (
                        <Badge key={env.id} variant={env.is_active ? 'success' : 'neutral'}>
                          {env.name}
                        </Badge>
                      ))}
                    </div>
                    <Link to={`/projects/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Table<Project>
            keyExtractor={(p) => p.id}
            columns={[
              {
                key: 'name',
                header: 'PROJECT NAME',
                render: (p) => (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/projects/${p.id}`}
                      className="font-bold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors"
                    >
                      {p.name}
                    </Link>
                    {p.migration_source && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        Migrated ({p.migration_source})
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: 'slug',
                header: 'SLUG',
                render: (p) => <code className="text-xs text-[var(--text-secondary)]">/{p.slug}</code>,
              },
              {
                key: 'environments',
                header: 'ENVIRONMENTS',
                render: (p) => (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {p.environments.map((env) => (
                      <Badge key={env.id} variant={env.is_active ? 'success' : 'neutral'}>
                        {env.name}
                      </Badge>
                    ))}
                  </div>
                ),
              },
              {
                key: 'actions',
                header: 'ACTIONS',
                className: 'text-right',
                render: (p) => (
                  <div className="flex items-center justify-end space-x-2">
                    <Link to={`/projects/${p.id}`}>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </Link>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => promptDeleteProject(p.id, p.name)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-[#da3633]/10"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
            data={filteredProjects}
          />
        )
      ) : (
        <EmptyState
          title="No projects found"
          description={
            searchQuery
              ? `No projects matched "${searchQuery}".`
              : 'Create a new project or migrate an existing workload to OpenDevX.'
          }
          actionLabel={canCreate ? 'Create Project' : undefined}
          onAction={openCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
        />
      )}

      {/* Pagination Controls */}
      {projectsData && projectsData.pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
          <span>
            Page {projectsData.page} of {projectsData.pages} ({projectsData.total} total projects)
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= projectsData.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          CREATE & MIGRATE PROJECT WIZARD MODAL
          ═════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={
          createMode === 'migrate'
            ? 'Migrate Existing Project'
            : 'Create New Project'
        }
        description={
          createMode === 'migrate'
            ? 'Import an existing workload from Git, Cloud, Docker, or PaaS into OpenDevX.'
            : 'Initialize a new service or application stack with custom environments.'
        }
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            {/* Wizard Step Progress */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  wizardStep >= 1 ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-surface)]'
                }`}
              >
                1
              </span>
              <div className={`w-4 h-0.5 rounded ${wizardStep >= 2 ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-color)]'}`} />
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  wizardStep >= 2 ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-surface)]'
                }`}
              >
                2
              </span>
              <div className={`w-4 h-0.5 rounded ${wizardStep === 3 ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-color)]'}`} />
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  wizardStep === 3 ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-surface)]'
                }`}
              >
                3
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              {wizardStep > 1 && (
                <Button variant="outline" type="button" onClick={() => setWizardStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              {wizardStep < 3 ? (
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => {
                    if (wizardStep === 1 && !name.trim()) {
                      setError('Project name is required before proceeding.')
                      return
                    }
                    setError(null)
                    setWizardStep((s) => s + 1)
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleCreateSubmit}
                  isLoading={createMutation.isPending}
                  leftIcon={createMode === 'migrate' ? <Import className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                >
                  {createMode === 'migrate' ? 'Start Migration' : 'Create Project'}
                </Button>
              )}
            </div>
          </div>
        }
      >
        {error && (
          <div
            className="mb-4 rounded-lg bg-red-50 dark:bg-[#da3633]/10 border border-red-200 dark:border-[#da3633]/30 p-3 text-xs text-red-700 dark:text-[#f85149] font-semibold flex items-start gap-2"
            role="alert"
          >
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ═══ CREATE FROM SCRATCH FLOW ═══ */}
        {createMode === 'scratch' && (
          <form onSubmit={handleCreateSubmit} className="space-y-5">
            {/* Step 1: Identity */}
            {wizardStep === 1 && (
              <motion.div
                key="scratch-step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <Input
                  label="PROJECT NAME"
                  type="text"
                  required
                  id="scratch-project-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Payment Gateway Service"
                  helperText="A human-readable name for your project."
                  leftIcon={<FolderGit2 className="w-4 h-4" />}
                />

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    URL SLUG
                    <span className="font-normal text-[var(--text-secondary)] normal-case tracking-normal">(auto-generated)</span>
                  </label>
                  <div className="flex items-center gap-0">
                    <span className="bg-[var(--bg-surface)] border border-r-0 border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-mono px-3 py-2 rounded-l-md h-9 flex items-center select-none">
                      /projects/
                    </span>
                    <input
                      id="scratch-project-slug"
                      type="text"
                      value={slugValue}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="payment-gateway-service"
                      className="flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-mono px-3 py-2 h-9 rounded-r-md border border-[var(--border-color)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] placeholder-[var(--text-secondary)] transition-colors"
                      aria-label="Project slug"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="scratch-project-desc" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    DESCRIPTION
                  </label>
                  <textarea
                    id="scratch-project-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm rounded-md border border-[var(--border-color)] p-3 focus:outline-none focus:border-[var(--accent-color)] placeholder-[var(--text-secondary)] transition-colors resize-none"
                    placeholder="Core service handling Stripe & PayPal payment transactions..."
                  />
                </div>

                <Input
                  label="REPOSITORY URL (OPTIONAL)"
                  type="url"
                  id="scratch-project-repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/org/payment-gateway"
                  leftIcon={<GitBranch className="w-4 h-4" />}
                />

                {/* Multi-select Project Type Tags with "+" Custom Tag button */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      PROJECT TYPE TAGS
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] font-normal normal-case">
                      (select one or more tags)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {tagOptions.map((pt) => {
                      const isSelected = selectedTypes.includes(pt.label)
                      return (
                        <button
                          key={pt.label}
                          type="button"
                          onClick={() => toggleTypeTag(pt.label)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all duration-150 cursor-pointer font-medium ${
                            isSelected
                              ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-sm'
                              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <span>{pt.icon}</span>
                          {pt.label}
                        </button>
                      )
                    })}

                    {/* Inline Custom Tag Input or "+" Button */}
                    {isAddingCustomTag ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddCustomTag()
                            }
                            if (e.key === 'Escape') {
                              setIsAddingCustomTag(false)
                            }
                          }}
                          placeholder="New tag…"
                          autoFocus
                          className="bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs px-2.5 py-1 rounded-full border border-[var(--accent-color)] focus:outline-none w-28"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomTag}
                          className="p-1 text-xs rounded-full bg-[var(--accent-color)] text-white hover:opacity-90"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingCustomTag(false)}
                          className="p-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomTag(true)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border border-dashed border-[var(--border-color)] hover:border-[var(--accent-color)] text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors cursor-pointer"
                        title="Add custom tag"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Tag
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Environments */}
            {wizardStep === 2 && (
              <motion.div
                key="scratch-step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    PROVISION PLATFORM ENVIRONMENTS
                  </label>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Development and Production environments are included by default. Add any additional custom environments needed for this project.
                  </p>
                </div>

                <div className="space-y-2">
                  {environments.map((env) => (
                    <div
                      key={env}
                      className="flex items-center justify-between px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--success-color)]" />
                        <span className="font-semibold text-[var(--text-primary)]">{env}</span>
                        <code className="text-[var(--text-secondary)] font-mono">/{slugify(env)}</code>
                      </div>
                      {DEFAULT_ENVIRONMENTS.includes(env) ? (
                        <span className="text-[var(--text-secondary)] text-[10px] italic">default</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeEnvironment(env)}
                          className="text-[var(--text-secondary)] hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-[#da3633]/10 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newEnvInput}
                    onChange={(e) => setNewEnvInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addEnvironment()
                      }
                    }}
                    placeholder="Add environment (e.g. Staging, QA, UAT)…"
                    className="flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs px-3 py-2 rounded-md border border-[var(--border-color)] focus:outline-none focus:border-[var(--accent-color)] placeholder-[var(--text-secondary)] transition-colors"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={addEnvironment} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {wizardStep === 3 && (
              <motion.div
                key="scratch-step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                    <div>
                      <h4 className="font-bold text-base text-[var(--text-primary)]">{name}</h4>
                      <code className="text-xs text-[var(--text-secondary)] font-mono">/projects/{slugValue}</code>
                    </div>
                    {selectedTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedTypes.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full text-xs font-semibold border border-[var(--accent-color)]/30">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {description && (
                    <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>
                  )}

                  {repoUrl && (
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <GitBranch className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                      <span className="truncate">{repoUrl}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[var(--text-secondary)] uppercase font-semibold text-[10px] tracking-wider block mb-1">
                      Target Environments ({environments.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {environments.map((e) => (
                        <Badge key={e} variant="success">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 rounded-lg text-xs text-[var(--text-primary)] flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent-color)] mt-0.5 flex-shrink-0" />
                  <span>
                    Clicking <strong>Create Project</strong> will immediately provision database containers and operational routes for this project.
                  </span>
                </div>
              </motion.div>
            )}
          </form>
        )}

        {/* ═══ MIGRATE EXISTING PROJECT FLOW ═══ */}
        {createMode === 'migrate' && (
          <form onSubmit={handleCreateSubmit} className="space-y-5">
            {/* Step 1: Provider & Source URL */}
            {wizardStep === 1 && (
              <motion.div
                key="migrate-step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Import className="w-3.5 h-3.5 text-purple-400" />
                    SELECT MIGRATION SOURCE PLATFORM
                  </label>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Select where your existing application or infrastructure is hosted.
                  </p>
                </div>

                {/* Source Providers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MIGRATION_PROVIDERS.map((prov) => {
                    const Icon = prov.icon
                    const isSelected = selectedProvider === prov.id
                    return (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => setSelectedProvider(prov.id)}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                          isSelected
                            ? 'bg-purple-500/10 border-purple-500 ring-1 ring-purple-500'
                            : 'bg-[var(--bg-primary)] border-[var(--border-color)] hover:border-purple-500/50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${prov.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-xs text-[var(--text-primary)] block truncate">
                            {prov.name}
                          </span>
                          <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5 line-clamp-1">
                            {prov.description}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Source Repository / Endpoint URL */}
                <Input
                  label="EXISTING REPOSITORY OR SERVICE URL"
                  type="url"
                  required
                  id="migrate-source-url"
                  value={sourceUrl}
                  onChange={(e) => handleSourceUrlChange(e.target.value)}
                  placeholder="e.g. https://github.com/my-company/payment-service.git"
                  helperText="URL of the repository or cloud service to migrate into OpenDevX."
                  leftIcon={<GitBranch className="w-4 h-4 text-purple-400" />}
                />

                {/* Target Project Name & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="TARGET OPENDEVX PROJECT NAME"
                    type="text"
                    required
                    id="migrate-project-name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Payment Service"
                  />
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      TARGET URL SLUG
                    </label>
                    <input
                      id="migrate-project-slug"
                      type="text"
                      value={slugValue}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="payment-service"
                      className="bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-mono px-3 py-2 h-9 rounded-md border border-[var(--border-color)] focus:outline-none focus:border-purple-500 placeholder-[var(--text-secondary)]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Migration Strategy & Environments */}
            {wizardStep === 2 && (
              <motion.div
                key="migrate-step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                    SELECT MIGRATION STRATEGY & MODE
                  </label>
                </div>

                <div className="space-y-2">
                  {MIGRATION_MODES.map((mode) => {
                    const isSelected = migrationMode === mode.id
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setMigrationMode(mode.id)}
                        className={`w-full p-3 text-left rounded-xl border transition-all cursor-pointer flex items-start justify-between space-x-3 ${
                          isSelected
                            ? 'bg-purple-500/10 border-purple-500 ring-1 ring-purple-500'
                            : 'bg-[var(--bg-primary)] border-[var(--border-color)] hover:border-purple-500/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[var(--text-primary)]">{mode.name}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300">
                              {mode.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-1">{mode.desc}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                            isSelected ? 'border-purple-500 bg-purple-500' : 'border-[var(--border-color)]'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Environment mapping */}
                <div className="flex flex-col space-y-2 pt-2">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    MIGRATE ENVIRONMENTS
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {environments.map((e) => (
                      <Badge key={e} variant="success">
                        {e}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Environment Variables Import */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center justify-between">
                    <span>IMPORT ENVIRONMENT VARIABLES / SECRETS (OPTIONAL)</span>
                    <span className="font-mono text-[10px] text-[var(--text-secondary)]">.env format</span>
                  </label>
                  <textarea
                    value={envVarsText}
                    onChange={(e) => setEnvVarsText(e.target.value)}
                    rows={3}
                    className="w-full bg-[var(--bg-primary)] font-mono text-xs text-[var(--text-primary)] rounded-md border border-[var(--border-color)] p-3 focus:outline-none focus:border-purple-500 placeholder-[var(--text-secondary)] resize-none"
                    placeholder={"DATABASE_URL=postgres://...\nREDIS_HOST=10.0.0.1\nAPI_KEY=sk_live_..."}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Migration Blueprint Review */}
            {wizardStep === 3 && (
              <motion.div
                key="migrate-step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div className="p-4 bg-[var(--bg-surface)] border border-purple-500/30 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                        Migration Blueprint
                      </span>
                      <h4 className="font-bold text-base text-[var(--text-primary)] mt-0.5">{name}</h4>
                      <code className="text-xs text-[var(--text-secondary)] font-mono">/projects/{slugValue}</code>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/40 uppercase">
                      {selectedProvider}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[var(--text-secondary)] text-[10px] uppercase block">Source Repository</span>
                      <span className="font-mono text-[var(--text-primary)] truncate block">{sourceUrl}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)] text-[10px] uppercase block">Strategy</span>
                      <span className="font-semibold text-purple-400 block">{migrationMode.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[var(--text-secondary)] uppercase font-semibold text-[10px] tracking-wider block mb-1">
                      Target Environments to Sync
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {environments.map((e) => (
                        <Badge key={e} variant="success">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-xs text-[var(--text-primary)] flex items-start gap-2">
                  <Import className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Clicking <strong>Start Migration</strong> will import project metadata, provision environments on OpenDevX, and register synchronization hooks for <strong>{sourceUrl}</strong>.
                  </span>
                </div>
              </motion.div>
            )}
          </form>
        )}
      </Modal>

      {/* Delete Project Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        description={
          <span>
            Are you sure you want to delete project <strong>"{projectToDelete?.name}"</strong>? This action cannot be undone and will permanently remove all associated environments and data.
          </span>
        }
        confirmText="Delete Project"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

