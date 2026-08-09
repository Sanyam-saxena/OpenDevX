import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Code2,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  Key,
  Lock,
  Layers,
  Server,
  Database,
  Shield,
  Cpu,
  ChevronRight,
  ShieldX
} from 'lucide-react'
import { Badge, Card, Modal, Button } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

type DocSectionId = 'auth' | 'rbac' | 'api'

export function DocsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [activeSection, setActiveSection] = useState<DocSectionId>('auth')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedApiRoute, setSelectedApiRoute] = useState<string>('copilot')
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const sections = [
    {
      id: 'auth' as DocSectionId,
      title: 'Authentication & JWT Bearer Tokens',
      icon: ShieldCheck,
      color: 'text-[#2f81f7]',
      badge: 'Security & Auth',
      shortDesc: 'Complete guide on OAuth2 Password flow, JWT Access Tokens, and Authorization headers.',
    },
    {
      id: 'rbac' as DocSectionId,
      title: 'Platform Architecture & RBAC',
      icon: Terminal,
      color: 'text-[#3fb950]',
      badge: 'System & Roles',
      shortDesc: 'Role-Based Access Control matrix (Admin, Operator, Viewer) and microservices architecture.',
    },
    {
      id: 'api' as DocSectionId,
      title: 'REST API & OpenAPI Specification',
      icon: Code2,
      color: 'text-[#d29922]',
      badge: 'API Catalog',
      shortDesc: 'Interactive v1 API endpoints inspector, JSON request/response payloads, and live Swagger UI.',
    },
  ]

  const apiEndpoints = [
    {
      id: 'copilot',
      method: 'POST',
      path: '/api/v1/projects/ai/copilot/chat',
      summary: 'Chat with OpenDevX AI DevOps Copilot Assistant',
      desc: 'Process natural language DevOps queries, FinOps cost analysis, deployment status, and RCA recommendations.',
      requestBody: JSON.stringify({ query: 'How can I reduce cloud infrastructure cost?' }, null, 2),
      responseBody: JSON.stringify(
        {
          query: 'How can I reduce cloud infrastructure cost?',
          reply: 'Based on OpenDevX FinOps analytics, your highest spending component is Amazon EKS cluster nodes ($145/mo). Migrating to Graviton3 saves $32.00/mo.',
          suggestions: ['Show detailed cost breakdown', 'How to migrate node pools to Graviton3?']
        },
        null,
        2
      )
    },
    {
      id: 'projects',
      method: 'GET',
      path: '/api/v1/projects',
      summary: 'List All Platform Projects',
      desc: 'Retrieves a paginated list of projects, environments, and migration metadata.',
      requestBody: 'None (Query Params: page=1, limit=10)',
      responseBody: JSON.stringify(
        {
          items: [
            {
              id: 'd9f2a1b0-4c3e-4b2a-8f1a-9e0b1c2d3e4f',
              name: 'Portfolio - Sanyam Saxena',
              slug: 'portfolio-sanyam-saxena',
              environments: ['Development', 'Staging', 'Production']
            }
          ],
          total: 4,
          page: 1,
          pages: 1
        },
        null,
        2
      )
    },
    {
      id: 'auth_login',
      method: 'POST',
      path: '/api/v1/auth/login',
      summary: 'Authenticate User & Issue JWT Token',
      desc: 'Exchanges OAuth2 password credentials for a 30-minute JWT bearer access token.',
      requestBody: 'username=admin@example.com&password=admin_password (x-www-form-urlencoded)',
      responseBody: JSON.stringify(
        {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          token_type: 'bearer',
          expires_in: 1800
        },
        null,
        2
      )
    },
    {
      id: 'rca',
      method: 'POST',
      path: '/api/v1/projects/{project_id}/ai/rca',
      summary: 'Perform AI Root Cause Analysis',
      desc: 'Analyzes application crash logs and returns automated one-click remediation plans.',
      requestBody: JSON.stringify({ error_log: 'ERROR: asyncpg.exceptions.TooManyConnectionsError: max connections exceeded' }, null, 2),
      responseBody: JSON.stringify(
        {
          analysis_id: 'rca-9a8b7c6d',
          severity: 'HIGH',
          root_cause_title: 'PostgreSQL Connection Pool Timeout',
          explanation: 'The application attempted 50 concurrent async queries, exceeding max_connections=20 pool limit.',
          one_click_fix_available: true,
          fix_action_name: 'Bump DB Pool Limit to 50 & Apply PgBouncer Proxy'
        },
        null,
        2
      )
    }
  ]

  const activeApiRouteObj = apiEndpoints.find((r) => r.id === selectedApiRoute) || apiEndpoints[0]

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
            Click any section card below to view detailed in-UI guidelines, API references, and architecture specs.
          </p>
        </div>
        {isAdmin ? (
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#58a6ff] hover:underline bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-2 rounded-md transition-colors"
          >
            Open Swagger API Docs
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setShowUnauthorizedModal(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-2 rounded-md transition-colors hover:border-red-500/40 cursor-pointer"
          >
            Open Swagger API Docs
            <Lock className="w-3.5 h-3.5 text-red-400" />
          </button>
        )}

        {/* Unauthorized Access Modal */}
        <Modal
          isOpen={showUnauthorizedModal}
          onClose={() => setShowUnauthorizedModal(false)}
          title="Access Restricted"
          description="This resource requires elevated permissions"
          footer={
            <Button variant="primary" onClick={() => setShowUnauthorizedModal(false)}>
              Understood
            </Button>
          }
        >
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
              <ShieldX className="w-10 h-10 text-red-400" />
            </div>
            <div className="space-y-1.5">
              <p className="font-bold text-base text-[var(--text-primary)]">Not Authorized</p>
              <p className="text-sm text-[var(--text-secondary)] max-w-xs">
                The Swagger API documentation is restricted to Admin users only. Please contact your platform administrator to request access.
              </p>
            </div>
            <div className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md text-xs font-mono text-red-400 w-full text-center">
              Required role: <span className="font-bold">admin</span> · Your role: <span className="font-bold">{user?.role ?? 'unknown'}</span>
            </div>
          </div>
        </Modal>
      </div>

      {/* Interactive 3 Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((sec) => {
          const Icon = sec.icon
          const isSelected = activeSection === sec.id

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className="text-left w-full focus:outline-none cursor-pointer"
            >
              <Card
                className={`flex flex-col justify-between h-full transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-[var(--accent-color)] border-[var(--accent-color)] bg-[var(--bg-surface)] shadow-lg'
                    : 'hover:border-[var(--border-color)]/80 hover:bg-[var(--bg-surface)]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg">
                        <Icon className={`w-5 h-5 ${sec.color}`} />
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        {sec.badge}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/40">
                        Active View
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5">{sec.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{sec.shortDesc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-color)]/60 flex items-center justify-between text-xs font-semibold text-[var(--accent-color)]">
                  <span>View Details</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                </div>
              </Card>
            </button>
          )
        })}
      </div>

      {/* Detailed Content View for Selected Option */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm space-y-6"
        >
          {/* OPTION 1: AUTHENTICATION & JWT */}
          {activeSection === 'auth' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#2f81f7]/15 rounded-lg border border-[#2f81f7]/30 text-[#2f81f7]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--text-primary)]">
                      Authentication & JWT Bearer Tokens
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Security guidelines for protected API calls using HTTP Authorization Bearer headers.
                    </p>
                  </div>
                </div>
                <Badge variant="info">JWT Bearer Security</Badge>
              </div>

              {/* Specs Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Header Format</span>
                  </div>
                  <code className="text-xs font-mono text-[var(--accent-color)] block pt-1">
                    Authorization: Bearer &lt;token&gt;
                  </code>
                </div>

                <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Token Expiry</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Access Token: <strong>30 minutes</strong> | Refresh Token: <strong>7 days</strong>
                  </p>
                </div>

                <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Algorithm & Secret</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Algorithm: <strong>HS256</strong> with secret key validation
                  </p>
                </div>
              </div>

              {/* Code Snippets */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Authentication Code Examples
                </h3>

                {/* cURL Example */}
                <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-secondary)] font-bold">1. Obtain JWT Access Token (cURL)</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `curl -X POST "http://localhost:8000/api/v1/auth/login" \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d "username=admin@example.com&password=admin_password"`,
                          'curl-login'
                        )
                      }
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === 'curl-login' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
{`curl -X POST "http://localhost:8000/api/v1/auth/login" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "username=admin@example.com&password=admin_password"`}
                  </pre>
                </div>

                {/* Python Request Example */}
                <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-secondary)] font-bold">2. Query Protected Endpoints (Python HTTPX)</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `import httpx\n\ntoken = "YOUR_JWT_ACCESS_TOKEN"\nheaders = {"Authorization": f"Bearer {token}"}\n\nresponse = httpx.post(\n    "http://localhost:8000/api/v1/projects/ai/copilot/chat",\n    json={"query": "How can I reduce cloud infrastructure cost?"},\n    headers=headers\n)\nprint(response.json())`,
                          'python-code'
                        )
                      }
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === 'python-code' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-sky-300 overflow-x-auto">
{`import httpx

token = "YOUR_JWT_ACCESS_TOKEN"
headers = {"Authorization": f"Bearer {token}"}

response = httpx.post(
    "http://localhost:8000/api/v1/projects/ai/copilot/chat",
    json={"query": "How can I reduce cloud infrastructure cost?"},
    headers=headers
)
print(response.json())`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* OPTION 2: PLATFORM ARCHITECTURE & RBAC */}
          {activeSection === 'rbac' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#3fb950]/15 rounded-lg border border-[#3fb950]/30 text-[#3fb950]">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--text-primary)]">
                      Platform Architecture & RBAC Permissions
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)]">
                      System design blueprint and Role-Based Access Control Matrix across Viewer, Operator, and Admin roles.
                    </p>
                  </div>
                </div>
                <Badge variant="success">Role-Based Access</Badge>
              </div>

              {/* Architecture Blueprint Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)] mb-1">
                    <Server className="w-4 h-4 text-sky-400" />
                    <span>FastAPI Backend</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Async Python 3.12, Uvicorn ASGI server, Pydantic schemas, and structured JSON logging.
                  </p>
                </div>

                <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)] mb-1">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>PostgreSQL & Redis</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Async SQLAlchemy connection pool + Redis in-memory cache for session rate limiting.
                  </p>
                </div>

                <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)] mb-1">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>React Vite Web UI</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    TypeScript, TailwindCSS design tokens, Framer Motion animations, and React Query caching.
                  </p>
                </div>

                <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)] mb-1">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>DevOps AI Copilot</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Real-time FinOps cost analytics, automated RCA diagnostic engine, and security audits.
                  </p>
                </div>
              </div>

              {/* RBAC Table Matrix */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Role-Based Access Control (RBAC) Permission Matrix
                </h3>

                <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[var(--bg-surface)] text-[var(--text-secondary)] font-bold border-b border-[var(--border-color)]">
                      <tr>
                        <th className="p-3">Resource / Action</th>
                        <th className="p-3">Viewer</th>
                        <th className="p-3">Operator</th>
                        <th className="p-3">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
                      <tr>
                        <td className="p-3 font-semibold">View Dashboard & Projects</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Chat with DevOps AI Copilot</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Create / Migrate Projects</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Delete Projects & Environments</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Access Audit Logs</td>
                        <td className="p-3 text-red-400">✗ Denied</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Manage Platform Users & Roles</td>
                        <td className="p-3 text-red-400">✗ Denied</td>
                        <td className="p-3 text-red-400">✗ Denied</td>
                        <td className="p-3 text-emerald-400">✓ Allowed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* OPTION 3: REST API & OPENAPI SPECIFICATION */}
          {activeSection === 'api' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#d29922]/15 rounded-lg border border-[#d29922]/30 text-[#d29922]">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--text-primary)]">
                      REST API & OpenAPI Specification
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Interactive API catalog, request/response payload schemas, and live endpoint testing.
                    </p>
                  </div>
                </div>
                <Badge variant="warning">OpenAPI v3.0</Badge>
              </div>

              {/* Endpoint Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[var(--border-color)]">
                {apiEndpoints.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedApiRoute(r.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors shrink-0 flex items-center space-x-2 cursor-pointer ${
                      selectedApiRoute === r.id
                        ? 'bg-[var(--accent-color)] text-white shadow-xs'
                        : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${r.method === 'POST' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {r.method}
                    </span>
                    <span>{r.path}</span>
                  </button>
                ))}
              </div>

              {/* Selected Route Inspector */}
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-4 space-y-4 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                  <div>
                    <span className="text-sm font-bold text-[var(--text-primary)] font-sans">
                      {activeApiRouteObj.summary}
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
                      {activeApiRouteObj.desc}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {activeApiRouteObj.method}
                    </span>
                    <code className="text-xs text-[var(--accent-color)]">{activeApiRouteObj.path}</code>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Request Body */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[var(--text-secondary)] font-sans uppercase tracking-wider block">
                      Sample Request Payload
                    </span>
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 overflow-x-auto">
                      <pre className="text-sky-300">{activeApiRouteObj.requestBody}</pre>
                    </div>
                  </div>

                  {/* Response Body */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[var(--text-secondary)] font-sans uppercase tracking-wider block">
                      Sample Response 200 OK Payload
                    </span>
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 overflow-x-auto">
                      <pre className="text-emerald-400">{activeApiRouteObj.responseBody}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
