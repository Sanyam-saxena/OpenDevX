import { useState } from 'react'
import { GitCommit, ExternalLink, CheckCircle2, RotateCcw, Clock } from 'lucide-react'
import type { LastDeployment } from '@/services/dashboardApi'
import { Modal, Button, Badge } from '@/components/ui'
import { toast } from 'sonner'

interface Props {
  deployment: LastDeployment
}

const DEPLOYMENT_HISTORY_LOGS = [
  {
    version: 'api v3.20.6',
    status: 'SUCCESS',
    author: 'Admin',
    commit_sha: '01fd63a',
    commit_msg: 'Fix asyncpg connection pool max limit to 50',
    duration: '6m 37s',
    timestamp: '6 minutes ago',
    environment: 'production',
  },
  {
    version: 'api v3.20.5',
    status: 'SUCCESS',
    author: 'sarah.chen',
    commit_sha: '8f2a1b9',
    commit_msg: 'Add Prometheus HTTP duration telemetry histogram',
    duration: '4m 12s',
    timestamp: '3 hours ago',
    environment: 'production',
  },
  {
    version: 'api v3.20.4',
    status: 'SUCCESS',
    author: 'james.wu',
    commit_sha: '4c3d2e1',
    commit_msg: 'Update FastAPI CORS middleware origin rules',
    duration: '5m 01s',
    timestamp: '1 day ago',
    environment: 'staging',
  },
  {
    version: 'api v3.20.3',
    status: 'SUCCESS',
    author: 'Admin',
    commit_sha: '9a8b7c6',
    commit_msg: 'Initial release of OpenDevX v3 platform API',
    duration: '7m 15s',
    timestamp: '3 days ago',
    environment: 'production',
  },
]

export function LastDeploymentBanner({ deployment }: Props) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [rollingBack, setRollingBack] = useState<string | null>(null)

  const handleRollback = (ver: string) => {
    setRollingBack(ver)
    setTimeout(() => {
      setRollingBack(null)
      toast.success(`Automated rollback to ${ver} initiated. Zero-downtime Pod replacement active.`)
      setIsHistoryOpen(false)
    }, 1200)
  }

  return (
    <>
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

        <button
          type="button"
          onClick={() => setIsHistoryOpen(true)}
          className="text-xs font-mono text-[var(--accent-color)] hover:underline flex items-center gap-1 cursor-pointer bg-[var(--bg-surface)] px-3 py-1.5 rounded-md border border-[var(--border-color)] transition-colors"
        >
          History <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Deployment History Modal */}
      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="Deployment & Release History"
        description="Production release log history, commit SHAs, and rollback controls"
        maxWidth="2xl"
        footer={
          <Button variant="ghost" onClick={() => setIsHistoryOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] uppercase border-b border-[var(--border-color)] pb-2 font-bold">
            <span>Release Version</span>
            <span>Environment & Commit</span>
            <span>Duration</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {DEPLOYMENT_HISTORY_LOGS.map((log) => (
              <div key={log.version} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[var(--text-primary)] text-xs">{log.version}</span>
                    <Badge variant={log.status === 'SUCCESS' ? 'success' : 'neutral'}>
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-sans">{log.commit_msg}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end text-[11px] text-[var(--text-primary)]">
                      <GitCommit className="w-3 h-3 text-[var(--accent-color)]" />
                      <span>{log.commit_sha}</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">({log.author})</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1 justify-end">
                      <Clock className="w-2.5 h-2.5" /> {log.duration} • {log.timestamp}
                    </span>
                  </div>

                  {log.version !== deployment.version && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRollback(log.version)}
                      isLoading={rollingBack === log.version}
                      leftIcon={<RotateCcw className="w-3 h-3" />}
                    >
                      Rollback
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
