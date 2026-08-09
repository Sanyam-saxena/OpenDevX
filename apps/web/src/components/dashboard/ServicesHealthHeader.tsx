import { Box, Cpu, GitBranch, Layers, Activity } from 'lucide-react'
import type { ServiceHealthItem } from '@/services/dashboardApi'

interface Props {
  services: ServiceHealthItem[]
}

export function ServicesHealthHeader({ services }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {services.map((srv) => {
        const isHealthy = srv.status === 'HEALTHY'
        return (
          <div
            key={srv.id}
            className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col justify-between space-y-2 hover:border-[var(--accent-color)]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {srv.id === 'docker' && <Box className="w-4 h-4 text-sky-400" />}
                {srv.id === 'kubernetes' && <Layers className="w-4 h-4 text-indigo-400" />}
                {srv.id === 'jenkins' && <Activity className="w-4 h-4 text-amber-400" />}
                {srv.id === 'github' && <GitBranch className="w-4 h-4 text-purple-400" />}
                {srv.id === 'terraform' && <Cpu className="w-4 h-4 text-emerald-400" />}
                {srv.id === 'prometheus' && <Activity className="w-4 h-4 text-rose-400" />}
                <span className="font-bold text-xs text-[var(--text-primary)]">{srv.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'
                  }`}
                />
                <span
                  className={`text-[9px] font-bold tracking-wider uppercase ${
                    isHealthy ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {srv.status}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] font-mono">{srv.detail}</p>
          </div>
        )
      })}
    </div>
  )
}
