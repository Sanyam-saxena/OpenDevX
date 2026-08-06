import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  BookOpen,
  ChevronRight,
  FolderGit2,
  GitBranch,
  Globe,
  Layers,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'

export interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ElementType
  category: 'Navigation' | 'Projects' | 'Quick Actions'
  action: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { data: projectsData } = useProjects(1, 50)

  // Quick static navigation links
  const defaultItems: CommandItem[] = [
    {
      id: 'nav-dashboard',
      title: 'Dashboard Profile',
      subtitle: 'Overview of platform statistics, environment health & activity',
      icon: LayoutDashboard,
      category: 'Navigation',
      action: () => navigate('/dashboard'),
    },
    {
      id: 'nav-projects',
      title: 'Projects Hub',
      subtitle: 'Manage microservices, frontend apps & infrastructure stacks',
      icon: FolderGit2,
      category: 'Navigation',
      action: () => navigate('/projects'),
    },
    {
      id: 'nav-users',
      title: 'User Management & Governance',
      subtitle: 'Manage platform accounts, roles & RBAC access permissions',
      icon: Users,
      category: 'Navigation',
      action: () => navigate('/users'),
    },
    {
      id: 'nav-audit-logs',
      title: 'Audit Trail Logs',
      subtitle: 'Inspect real-time security events, resource updates & logs',
      icon: ShieldCheck,
      category: 'Navigation',
      action: () => navigate('/audit-logs'),
    },
    {
      id: 'nav-metrics',
      title: 'System Telemetry & Metrics',
      subtitle: 'Prometheus metrics, latency heatmaps & Grafana monitoring',
      icon: Activity,
      category: 'Navigation',
      action: () => navigate('/metrics'),
    },
    {
      id: 'nav-docs',
      title: 'Platform Documentation',
      subtitle: 'Architecture guide, API reference & deployment manual',
      icon: BookOpen,
      category: 'Navigation',
      action: () => navigate('/docs'),
    },
  ]

  // Dynamic project items from API
  const projectItems: CommandItem[] =
    projectsData?.items?.map((p) => ({
      id: `proj-${p.id}`,
      title: p.name,
      subtitle: `/${p.slug} • ${p.environments.length} environments`,
      icon: Layers,
      category: 'Projects' as const,
      action: () => navigate(`/projects/${p.id}`),
    })) || []

  const allItems = [...projectItems, ...defaultItems]

  const filteredItems = allItems.filter((item) => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    )
  })

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Keyboard navigation inside palette
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action()
          onClose()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Command Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Top Search Input */}
          <div className="relative flex items-center px-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
            <Search className="w-5 h-5 text-[var(--accent-color)] shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, services, metrics, docs, pages... (ESC to close)"
              className="w-full bg-transparent py-4 text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
              aria-label="Search OpenDevX resources"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results List */}
          <div ref={listRef} className="p-2 max-h-[60vh] overflow-y-auto space-y-1 divide-y divide-[var(--border-color)]/30">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => {
                const IconComponent = item.icon
                const isSelected = idx === selectedIndex
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.action()
                      onClose()
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/40 text-[var(--text-primary)]'
                        : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3 truncate pr-2">
                      <div
                        className={`p-2 rounded-md shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[var(--accent-color)] text-white'
                            : 'bg-[var(--bg-surface)] text-[var(--accent-color)]'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[var(--text-primary)]">{item.title}</span>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                            {item.category}
                          </span>
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--accent-color)]' : 'opacity-40'}`} />
                  </button>
                )
              })
            ) : (
              <div className="py-8 text-center text-xs text-[var(--text-secondary)] space-y-1">
                <p className="font-medium text-sm text-[var(--text-primary)]">No matching resources found</p>
                <p>Try searching for project names, slugs, "users", "metrics", or "docs".</p>
              </div>
            )}
          </div>

          {/* Footer Shortcuts Legend */}
          <div className="px-4 py-2.5 bg-[var(--bg-primary)] border-t border-[var(--border-color)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded font-mono text-[10px]">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded font-mono text-[10px]">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded font-mono text-[10px]">ESC</kbd> Close
              </span>
            </div>
            <span className="font-semibold text-[var(--accent-color)]">OpenDevX Command Palette</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
