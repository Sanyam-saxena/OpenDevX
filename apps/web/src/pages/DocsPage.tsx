import { motion } from 'framer-motion'
import { BookOpen, Code2, ExternalLink, ShieldCheck, Terminal } from 'lucide-react'
import { Card } from '@/components/ui'

export function DocsPage() {
  const sections = [
    {
      title: 'Authentication & JWT Bearer Tokens',
      icon: ShieldCheck,
      color: 'text-[#2f81f7]',
      description:
        'All protected API routes require a valid JWT Access Token passed via HTTP Authorization header: Authorization: Bearer <token>.',
    },
    {
      title: 'Platform Architecture & RBAC',
      icon: Terminal,
      color: 'text-[#3fb950]',
      description:
        'OpenDevX implements Role-Based Access Control (Viewer, Operator, Admin). Admin users manage platform accounts and audit logs.',
    },
    {
      title: 'REST API & OpenAPI Specification',
      icon: Code2,
      color: 'text-[#d29922]',
      description:
        'Interactive Swagger UI and OpenAPI documentation are available at /docs and /openapi.json on the backend API server.',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#2f81f7]" />
            Developer Documentation
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Platform architecture guidelines, API reference, and developer quickstart guides.
          </p>
        </div>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#58a6ff] hover:underline bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-1.5 rounded-md transition-colors"
        >
          Open Swagger API Docs
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Docs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((sec, idx) => {
          const Icon = sec.icon
          return (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: idx * 0.04, ease: 'easeOut' }}
            >
              <Card interactive className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center space-x-2.5 mb-3">
                    <div className="p-2 bg-[var(--bg-surface)] rounded-lg">
                      <Icon className={`w-5 h-5 ${sec.color}`} />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{sec.title}</h3>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{sec.description}</p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
