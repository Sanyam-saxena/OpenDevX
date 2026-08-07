import type { KpiMetrics } from '@/services/dashboardApi'

interface Props {
  metrics: KpiMetrics
}

export function KpiMetricsBar({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">CPU · AVG</p>
        <p className="text-xl font-bold text-sky-400 font-mono">{metrics.cpu_avg}%</p>
      </div>

      <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">MEMORY · AVG</p>
        <p className="text-xl font-bold text-indigo-400 font-mono">{metrics.memory_avg}%</p>
      </div>

      <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">NETWORK</p>
        <p className="text-xl font-bold text-emerald-400 font-mono">{metrics.network_mbps} <span className="text-xs font-normal">Mbps</span></p>
      </div>

      <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">DEPLOYS · 24H</p>
        <p className="text-xl font-bold text-amber-400 font-mono">{metrics.deploys_24h}</p>
      </div>

      <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">UPTIME</p>
        <p className="text-xl font-bold text-teal-400 font-mono">{metrics.uptime_pct}%</p>
      </div>

      <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">$ COST · MTD</p>
        <p className="text-xl font-bold text-rose-400 font-mono">${metrics.cost_mtd}</p>
      </div>
    </div>
  )
}
