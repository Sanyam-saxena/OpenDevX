import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Cpu,
  FileCode,
  Layers,
  Server,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function PublicSpecsPage() {
  const specsSections = [
    {
      title: 'Control Plane Architecture',
      icon: Server,
      color: 'text-[#2f81f7]',
      description:
        'FastAPI asynchronous gateway utilizing SQLAlchemy async connection pooling for database isolation and Redis in-memory pub/sub caching for high-concurrency throughput.',
    },
    {
      title: 'Interactive CI/CD DAG Engine',
      icon: Layers,
      color: 'text-[#3fb950]',
      description:
        'Directed Acyclic Graph (DAG) execution engine featuring 5 standard deployment stages: Source Checkout, Code Linting, Trivy Security Scanning, Docker Image Packaging, and Helm Kubernetes Deployment.',
    },
    {
      title: 'Gemini AI Root Cause Analysis (RCA)',
      icon: Sparkles,
      color: 'text-[#a371f7]',
      description:
        'Continuous log diagnostic pipeline integrating LLM contextual reasoning to identify stack trace anomalies, OOM pod terminations, and database connection leaks with automated one-click remediation payloads.',
    },
    {
      title: 'FinOps Cloud Cost Telemetry',
      icon: Zap,
      color: 'text-[#d29922]',
      description:
        'Real-time spending analysis across cloud infrastructure resources (AWS EKS nodes, RDS instances, S3 storage, and unattached EBS volumes) with automated Graviton3 architectural savings modeling.',
    },
    {
      title: 'Enterprise Security & RBAC Governance',
      icon: Shield,
      color: 'text-rose-400',
      description:
        'AWS KMS secret key encryption, OAuth2 Bearer JWT authorization flow, Trivy container image scanning, and strict role-based privilege enforcement across Viewer, Operator, and Admin roles.',
    },
    {
      title: 'Prometheus & Audit Telemetry',
      icon: Cpu,
      color: 'text-cyan-400',
      description:
        'Sub-millisecond Prometheus request latency tracking, pod CPU/memory telemetry scraping, and immutable audit event logging tracking all system mutations.',
    },
  ]

  const apiEndpoints = [
    { method: 'GET', path: '/api/v1/health', desc: 'System health probe & service availability check' },
    { method: 'POST', path: '/api/v1/rca/diagnose', desc: 'Gemini AI Root Cause Analysis log diagnostic engine' },
    { method: 'GET', path: '/api/v1/projects', desc: 'Fetch platform microservices & project configurations' },
    { method: 'POST', path: '/api/v1/pipelines/trigger', desc: 'Trigger automated CI/CD DAG pipeline execution' },
    { method: 'GET', path: '/api/v1/metrics/prometheus', desc: 'Retrieve live request latency & cluster metrics' },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-8 space-y-6 px-4 sm:px-8 min-h-screen flex flex-col justify-start">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <Link to="/">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Homepage
          </Button>
        </Link>

        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wide text-[var(--text-primary)]">
            OpenDevX Technical Specifications
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center space-y-2 max-w-3xl mx-auto"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Platform Architecture & Technical Specifications
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Comprehensive public reference guide explaining OpenDevX system design, microservice control plane architecture, Gemini AI RCA diagnostic specs, and public API interfaces for external viewers.
        </p>
      </motion.div>

      {/* 6 Technical Specification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {specsSections.map((sec, idx) => {
          const Icon = sec.icon
          return (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
            >
              <Card className="p-5 flex flex-col justify-between h-full hover:border-[var(--accent-color)]/60 transition-all shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                      <Icon className={`w-5 h-5 ${sec.color}`} />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">{sec.title}</h3>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{sec.description}</p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Public REST API Specifications Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-[#3fb950]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Public REST API Endpoint Interfaces</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                <th className="pb-2 font-semibold">METHOD</th>
                <th className="pb-2 font-semibold">ENDPOINT ROUTE</th>
                <th className="pb-2 font-semibold">INTERFACE DESCRIPTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]/50">
              {apiEndpoints.map((ep) => (
                <tr key={ep.path} className="hover:bg-[var(--bg-surface)]/50 transition-colors">
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                        ep.method === 'GET'
                          ? 'bg-[#238636]/20 text-[#3fb950]'
                          : 'bg-[#2f81f7]/20 text-[#2f81f7]'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-[var(--text-primary)]">{ep.path}</td>
                  <td className="py-2.5 text-[var(--text-secondary)] font-sans text-xs">{ep.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
