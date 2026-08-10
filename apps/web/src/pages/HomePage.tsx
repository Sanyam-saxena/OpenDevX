import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  FolderGit2,
  GitPullRequest,
  Sparkles,
  DollarSign,
  ShieldCheck,
  Activity,
  Mail,
  Send,
  CheckCircle2,
  Server,
  Shield,
  Cpu,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated } = useAuth()
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const capabilities = [
    {
      title: 'Unified Project & Microservice Management',
      icon: FolderGit2,
      color: 'text-[#2f81f7]',
      borderGlow: 'hover:border-[#2f81f7]/50',
      bgTag: 'bg-[#2f81f7]/10 text-[#2f81f7]',
      description:
        'Import, migrate, and orchestrate frontend applications, REST API backends, and serverless workloads across Development, Staging, and Production environments with isolated configurations.',
    },
    {
      title: 'Interactive CI/CD DAG Pipelines',
      icon: GitPullRequest,
      color: 'text-[#3fb950]',
      borderGlow: 'hover:border-[#3fb950]/50',
      bgTag: 'bg-[#3fb950]/10 text-[#3fb950]',
      description:
        'Visual 5-stage pipeline graphs (Source Checkout ➔ Lint & Analysis ➔ Trivy Scan ➔ Docker Build ➔ Helm K8s Deploy) with real-time execution logs and single-click trigger actions.',
    },
    {
      title: 'Gemini AI Root Cause Analysis (RCA)',
      icon: Sparkles,
      color: 'text-[#a371f7]',
      borderGlow: 'hover:border-[#a371f7]/50',
      bgTag: 'bg-[#a371f7]/10 text-[#a371f7]',
      description:
        'Automated log diagnosis and one-click remediation engine that identifies database connection pool timeouts, memory leaks, and pod crash cascades with instant verification fixes.',
    },
    {
      title: 'FinOps Cloud Cost Optimization',
      icon: DollarSign,
      color: 'text-[#d29922]',
      borderGlow: 'hover:border-[#d29922]/50',
      bgTag: 'bg-[#d29922]/10 text-[#d29922]',
      description:
        'Real-time spending breakdowns across EKS nodes, RDS databases, S3 storage, and unattached EBS volumes, accompanied by automated Graviton3 migration cost-savings recommendations.',
    },
    {
      title: 'Enterprise RBAC & Secrets Governance',
      icon: ShieldCheck,
      color: 'text-rose-400',
      borderGlow: 'hover:border-rose-500/50',
      bgTag: 'bg-rose-500/10 text-rose-400',
      description:
        'Centralized AWS KMS encryption key management, Trivy container vulnerability auditing, and strict role-based permission matrices (Viewer, Operator, Admin) enforcing least-privilege security.',
    },
    {
      title: 'Real-Time Operational Telemetry',
      icon: Activity,
      color: 'text-cyan-400',
      borderGlow: 'hover:border-cyan-500/50',
      bgTag: 'bg-cyan-500/10 text-cyan-400',
      description:
        'Smooth lag-free request throughput charts, live Prometheus latency monitoring (p50/p95/p99), Kubernetes pod CPU/RAM metrics, and immutable platform audit log activity feeds.',
    },
  ]

  const architecturePillars = [
    {
      title: 'Multi-Cluster Workload Resilience',
      icon: Server,
      color: 'text-emerald-400',
      desc: 'Fault-tolerant orchestration ensuring high availability and zero-downtime microservice deployments across environments.',
    },
    {
      title: 'Low-Latency API Gateway Routing',
      icon: Cpu,
      color: 'text-sky-400',
      desc: 'Asynchronous event-driven API gateway providing sub-millisecond route dispatching and real-time response telemetry.',
    },
    {
      title: 'FinOps Cost Telemetry & Optimization',
      icon: DollarSign,
      color: 'text-amber-400',
      desc: 'Automated cost estimation modeling identifying idle resources and recommending architectural cost-efficiency improvements.',
    },
    {
      title: 'Zero-Trust Container Vulnerability Auditing',
      icon: Shield,
      color: 'text-purple-400',
      desc: 'Continuous container security auditing and KMS encryption key management protecting platform workloads.',
    },
  ]

  const workflowSteps = [
    {
      step: '01',
      title: 'Import & Onboard Workloads',
      desc: 'Connect your GitHub repository or Docker container manifest in under 60 seconds to initialize isolated platform environments.',
    },
    {
      step: '02',
      title: 'Automate DAG Builds & AI RCA',
      desc: 'Trigger multi-stage CI/CD pipelines and let Gemini AI diagnose error logs with automated one-click remediation payloads.',
    },
    {
      step: '03',
      title: 'Optimize FinOps & Scale',
      desc: 'Track cluster pod health in real-time, enforce KMS secrets governance, and slash cloud costs with automated Graviton3 node migration.',
    },
  ]

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.message.trim()) {
      toast.error('Please enter your question or message before submitting.')
      return
    }

    const mailtoUrl = `mailto:yosam255316@gmail.com?subject=${encodeURIComponent(
      'OpenDevX Platform Inquiry'
    )}&body=${encodeURIComponent(
      `Name: ${contactForm.name || 'Anonymous User'}\nEmail: ${
        contactForm.email || 'Not provided'
      }\n\nQuestion / Query:\n${contactForm.message}`
    )}`

    window.location.href = mailtoUrl
    toast.success('Your message draft has been opened in your email client!')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="relative py-4 sm:py-6 space-y-12 max-w-6xl mx-auto px-4 sm:px-6 overflow-hidden">
      {/* Dynamic Animated Background Canvas & Floating Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transform-gpu select-none">
        {/* Animated Moving Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 animate-grid-flow" />

        {/* Radial Ambient Glow */}
        <div className="absolute inset-0 bg-radial-glow opacity-90" />

        {/* Floating Glowing Orb 1 - Cyan/Blue */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.6, 0.35],
            x: [0, 45, -20, 0],
            y: [0, -35, 25, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-40 left-1/4 w-[480px] h-[480px] bg-[#2f81f7]/20 blur-3xl rounded-full transform-gpu"
        />

        {/* Floating Glowing Orb 2 - Emerald Green */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.55, 0.3],
            x: [0, -40, 30, 0],
            y: [0, 40, -25, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute top-1/3 -right-28 w-[520px] h-[520px] bg-[#238636]/20 blur-3xl rounded-full transform-gpu"
        />

        {/* Floating Glowing Orb 3 - Purple Accent */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.5, 0.25],
            x: [0, 30, -30, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute bottom-10 left-1/3 w-[420px] h-[420px] bg-[#a371f7]/20 blur-3xl rounded-full transform-gpu"
        />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="text-center space-y-5 relative z-10 pt-2"
      >
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight max-w-4xl mx-auto">
          The Unified AI Control Plane for{' '}
          <span className="bg-gradient-to-r from-[#2f81f7] via-[#3fb950] to-[#a371f7] bg-clip-text text-transparent">
            Cloud Engineering
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-medium">
          OpenDevX accelerates software delivery by standardizing microservice management, interactive CI/CD DAG pipelines, automated Gemini AI Root Cause Analysis (RCA), and FinOps cloud cost optimization in one control plane.
        </p>

        {/* Unified Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to={isAuthenticated ? '/dashboard' : '/login'}>
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started / Sign In'} →
            </Button>
          </Link>
          <Link to="/specs">
            <Button variant="ghost" size="lg">
              Explore Platform Specs 📖
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Conceptual Theoretical Architecture Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl relative z-10"
      >
        {architecturePillars.map((ap) => {
          const Icon = ap.icon
          return (
            <div key={ap.title} className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)]/70 rounded-xl space-y-2">
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${ap.color}`} />
                <h3 className="text-xs font-bold text-[var(--text-primary)]">{ap.title}</h3>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{ap.desc}</p>
            </div>
          )
        })}
      </motion.div>

      {/* 6 Platform Pillars Feature Grid */}
      <div className="space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
            Everything You Need for Modern DevOps
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
            Architected to eliminate developer friction, automate incident recovery, and reduce cloud infrastructure spending.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
              >
                <Card interactive className={`flex flex-col justify-between h-full p-5 transition-all ${cap.borderGlow}`}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] shadow-xs">
                        <Icon className={`w-5 h-5 ${cap.color}`} />
                      </div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight leading-snug">
                        {cap.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                      {cap.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 3-Step Developer Workflow */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-8 relative z-10 shadow-xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            How OpenDevX Operates in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((ws) => (
            <div key={ws.step} className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl space-y-2 relative">
              <span className="text-3xl font-extrabold font-mono text-[var(--accent-color)] opacity-40">{ws.step}</span>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{ws.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{ws.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="relative z-10"
      >
        <Card className="p-6 sm:p-8 border border-[var(--border-color)] shadow-2xl space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Have Questions or Suggestions?
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              If you have any doubts, feature requests, or questions, submit them below.
            </p>
          </div>

          <form onSubmit={handleSendContact} className="space-y-4 max-w-2xl mx-auto text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Chen"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">Your Email</label>
                <input
                  type="email"
                  placeholder="e.g. sarah@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[var(--text-primary)] mb-1">Your Question / Query *</label>
              <textarea
                rows={4}
                required
                placeholder="Type your question or feedback here..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
              />
            </div>

            <div className="flex items-center justify-end">
              <Button type="submit" variant="primary" size="md" rightIcon={<Send className="w-3.5 h-3.5" />}>
                Send Message
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

