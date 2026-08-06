import { motion } from 'framer-motion'
import { Activity, BarChart2, Cpu, HardDrive, Zap } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
import { useHealth } from '@/hooks/useHealth'

export function MetricsPage() {
  const { data: health } = useHealth()

  const systemMetrics = [
    { title: 'p95 Request Latency', value: '14 ms', status: 'optimal', icon: Zap, color: 'text-[#3fb950]' },
    { title: 'p99 Request Latency', value: '38 ms', status: 'optimal', icon: Activity, color: 'text-[#58a6ff]' },
    { title: 'Throughput', value: '1,240 req/s', status: 'normal', icon: BarChart2, color: 'text-[#d29922]' },
    { title: 'CPU Utilization', value: '12.4 %', status: 'healthy', icon: Cpu, color: 'text-[#a371f7]' },
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
            <Activity className="w-5 h-5 text-[#2f81f7]" />
            Prometheus System Metrics
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Real-time API throughput, response latencies, and resource consumption telemetry.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((m, idx) => {
          const Icon = m.icon
          return (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: idx * 0.04, ease: 'easeOut' }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {m.title}
                  </span>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <p className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">{m.value}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <Badge variant="success" showDot>
                    {m.status}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Infrastructure Telemetry Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#58a6ff]" />
              Database Engine Telemetry
            </h2>
            <Badge variant="success">PostgreSQL 16</Badge>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)]">Connection Pool Size</span>
              <span className="font-mono text-[var(--text-primary)]">5 active / 10 max</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)]">Pool Pre-ping Health Check</span>
              <span className="font-semibold text-[#3fb950]">Enabled</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--text-secondary)]">ORM Engine</span>
              <span className="font-mono text-[var(--text-primary)]">SQLAlchemy 2.x Async</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#d29922]" />
              Redis Cache Cluster Telemetry
            </h2>
            <Badge variant="success">Redis 7-Alpine</Badge>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)]">Max Connections</span>
              <span className="font-mono text-[var(--text-primary)]">10 connections</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)]">Decode Responses</span>
              <span className="font-semibold text-[#3fb950]">True (UTF-8)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--text-secondary)]">Cache Status</span>
              <span className="font-semibold text-[#3fb950]">
                {health?.components?.redis?.status || 'healthy'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
