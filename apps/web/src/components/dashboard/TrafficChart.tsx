import { TrendingUp } from 'lucide-react'
import type { TrafficPoint } from '@/services/dashboardApi'

interface Props {
  data: TrafficPoint[]
}

export function TrafficChart({ data }: Props) {
  const maxReq = 120

  return (
    <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">REQUESTS · LAST 30 MIN</p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-[var(--text-primary)]">100</span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">req/s</span>
          </div>
        </div>
        <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative h-40 w-full pt-2">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3fb950" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3fb950" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="0" x2="500" y2="0" stroke="var(--border-color)" strokeDasharray="3 3" opacity="0.4" />
          <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border-color)" strokeDasharray="3 3" opacity="0.4" />
          <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border-color)" strokeDasharray="3 3" opacity="0.4" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border-color)" opacity="0.4" />

          {/* Area fill path */}
          <path
            d={`M 0,120 ${data.map((d, i) => `L ${(i / (data.length - 1)) * 500},${120 - (d.requests_per_sec / maxReq) * 120}`).join(' ')} L 500,120 Z`}
            fill="url(#trafficGradient)"
          />

          {/* Line path */}
          <path
            d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / (data.length - 1)) * 500},${120 - (d.requests_per_sec / maxReq) * 120}`).join(' ')}
            fill="none"
            stroke="#3fb950"
            strokeWidth="2.5"
          />

          {/* Data Points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={(i / (data.length - 1)) * 500}
              cy={120 - (d.requests_per_sec / maxReq) * 120}
              r="3"
              fill="#3fb950"
              className="hover:r-5 transition-all"
            />
          ))}
        </svg>

        {/* X Axis Timestamps */}
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)] pt-2">
          {data.filter((_, idx) => idx % 2 === 0).map((d) => (
            <span key={d.timestamp}>{d.timestamp}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
