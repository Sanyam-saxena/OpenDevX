import { Radio, ExternalLink } from 'lucide-react'
import type { LiveEventItem } from '@/services/dashboardApi'

interface Props {
  events: LiveEventItem[]
}

export function LiveEventStream({ events }: Props) {
  return (
    <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
          <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
          EVENT STREAM
        </h3>
        <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1 hover:underline cursor-pointer">
          all <ExternalLink className="w-3 h-3" />
        </span>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto">
        {events.map((evt) => (
          <div key={evt.id} className="flex items-start justify-between space-x-3 text-xs">
            <div className="flex items-start space-x-2">
              <span className="px-1.5 py-0.5 text-[9px] font-bold font-mono rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase mt-0.5">
                {evt.channel}
              </span>
              <p className="text-[var(--text-primary)] font-mono text-[11px] leading-relaxed">
                {evt.message}
              </p>
            </div>
            <span className="text-[10px] text-[var(--text-secondary)] font-mono whitespace-nowrap">
              {evt.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
