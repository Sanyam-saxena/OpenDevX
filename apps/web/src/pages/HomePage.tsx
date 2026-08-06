import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  FolderGit2,
  Layers,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { useHealth } from '@/hooks/useHealth'

export function HomePage() {
  const { isAuthenticated } = useAuth()
  const { data: health, isLoading: healthLoading } = useHealth()

  const features = [
    {
      title: 'Unified Project Management',
      icon: FolderGit2,
      color: 'text-[#2f81f7]',
      bgGlow: 'hover:border-[#2f81f7]/40',
      description:
        'Organize microservices, API backends, and frontend applications across deployment stages.',
    },
    {
      title: 'Automated Environment Provisioning',
      icon: Layers,
      color: 'text-[#3fb950]',
      bgGlow: 'hover:border-[#3fb950]/40',
      description:
        'Automatically provision development, staging, and production environments with isolation.',
    },
    {
      title: 'Enterprise RBAC Governance',
      icon: ShieldCheck,
      color: 'text-[#a371f7]',
      bgGlow: 'hover:border-[#a371f7]/40',
      description:
        'Strict role-based permissions (Viewer, Operator, Admin) enforcing least-privilege security.',
    },
    {
      title: 'Real-Time Operational Telemetry',
      icon: Zap,
      color: 'text-[#d29922]',
      bgGlow: 'hover:border-[#d29922]/40',
      description:
        'Live Prometheus request latency, system metrics, and audit logging out of the box.',
    },
  ]

  return (
    <div className="relative py-8 sm:py-12 space-y-12 sm:space-y-16 max-w-5xl mx-auto">
      {/* Dynamic Animated Background Mesh & Grid Flow Canvas */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transform-gpu">
        {/* Animated Moving Grid Lines */}
        <div className="absolute inset-0 bg-grid-pattern animate-grid-flow opacity-70" />
        
        {/* Ambient Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-radial-glow opacity-80" />

        {/* Floating Animated Color Mesh Orbs - Hardware Accelerated */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 left-1/4 w-[400px] h-[400px] bg-[var(--glow-color-1)] blur-3xl rounded-full transform-gpu will-change-transform"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -35, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute top-1/3 -right-24 w-[450px] h-[450px] bg-[var(--glow-color-2)] blur-3xl rounded-full transform-gpu will-change-transform"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25],
            x: [0, 25, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute -bottom-20 left-1/3 w-[380px] h-[380px] bg-[var(--glow-color-3)] blur-3xl rounded-full transform-gpu will-change-transform"
        />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="text-center space-y-6 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#238636]/15 border border-[#238636]/40 rounded-full text-xs font-mono text-[#16a34a] dark:text-[#3fb950] shadow-xs backdrop-blur-xs transition-transform duration-200 ease-out cursor-default transform-gpu"
        >
          <Terminal className="w-3.5 h-3.5 animate-pulse text-[#238636]" />
          <span className="font-semibold">OpenDevX Developer Platform v0.2.0</span>
        </motion.div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
          Engineered for Developer Velocity
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          OpenDevX provides unified project management, automated environment provisioning, role-based governance, and real-time operational telemetry.
        </p>

        <div className="flex items-center justify-center gap-3 pt-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Console Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
        {features.map((feat, idx) => {
          const Icon = feat.icon
          return (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05, ease: 'easeOut' }}
            >
              <Card interactive className={`flex flex-col justify-between h-full ${feat.bgGlow}`}>
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2.5 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] shadow-xs transition-[transform,border-color] duration-200 ease-out group-hover:scale-105 group-hover:border-[var(--accent-color)] transform-gpu">
                      <Icon className={`w-5 h-5 ${feat.color}`} />
                    </div>
                    <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight">{feat.title}</h3>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">{feat.description}</p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Platform Status Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.32, ease: 'easeOut' }}
        className="relative z-10"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[var(--accent-color)]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Platform Status Overview
              </h2>
            </div>
            <Badge
              variant={
                healthLoading
                  ? 'neutral'
                  : health?.status === 'healthy'
                  ? 'success'
                  : 'warning'
              }
            >
              {healthLoading ? 'checking...' : health?.status || 'operational'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-color)] transition-colors shadow-xs">
              <span className="text-[var(--text-secondary)] font-semibold">API Service</span>
              <p className="font-bold text-[var(--text-primary)] mt-1 truncate">
                {health?.service || 'OpenDevX API'} (v{health?.version || '0.1.0'})
              </p>
            </div>
            <div className="p-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--success-color)] transition-colors shadow-xs">
              <span className="text-[var(--text-secondary)] font-semibold">Database Engine</span>
              <p className="font-bold text-[var(--success-color)] mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PostgreSQL Pool Connected
              </p>
            </div>
            <div className="p-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--success-color)] transition-colors shadow-xs">
              <span className="text-[var(--text-secondary)] font-semibold">Cache Cluster</span>
              <p className="font-bold text-[var(--success-color)] mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Redis Cache Active
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
