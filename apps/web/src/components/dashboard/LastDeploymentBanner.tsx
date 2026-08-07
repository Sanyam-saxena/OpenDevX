import { GitCommit, ExternalLink, CheckCircle2 } from 'lucide-react'
import type { LastDeployment } from '@/services/dashboardApi'

interface Props {
  deployment: LastDeployment
}

export function LastDeploymentBanner({ deployment }: Props) {
  return (
    <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">LAST DEPLOYMENT</p>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{deployment.version}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {deployment.status}
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] font-mono flex items-center gap-2">
          <span>by {deployment.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <GitCommit className="w-3 h-3 text-[var(--accent-color)]" />
            commit {deployment.commit_sha}
          </span>
          <span>•</span>
          <span>{deployment.duration}</span>
        </p>
      </div>

      <a
        href="#history"
        className="text-xs font-mono text-[var(--accent-color)] hover:underline flex items-center gap-1 cursor-pointer"
      >
        History <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  )
}
