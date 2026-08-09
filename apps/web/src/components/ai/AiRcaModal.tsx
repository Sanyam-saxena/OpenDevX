import { useState } from 'react'
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react'
import { Modal, Button, Badge } from '@/components/ui'
import { analyzeLogRcaApi, applyRcaFixApi, resetRcaFixApi, type RcaResult } from '@/services/aiRcaApi'
import { toast } from 'sonner'

interface Props {
  projectId: string
  isOpen: boolean
  onClose: () => void
}

export function AiRcaModal({ projectId, isOpen, onClose }: Props) {
  const [result, setResult] = useState<RcaResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isApplyingFix, setIsApplyingFix] = useState(false)

  /** Close and always reset back to the initial "ready" state */
  const handleClose = () => {
    setResult(null)
    setIsLoading(false)
    setIsApplyingFix(false)
    onClose()
  }

  const handleRunRca = async () => {
    setIsLoading(true)
    try {
      const data = await analyzeLogRcaApi(projectId)
      setResult(data)
    } catch {
      toast.error('Failed to run AI Root Cause Analysis. Please check API connectivity.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyFix = async () => {
    setIsApplyingFix(true)
    try {
      await applyRcaFixApi(projectId)
      const updatedData = await analyzeLogRcaApi(projectId)
      setResult(updatedData)
      toast.success('Fix applied and verified — database connection pool expanded to 50 connections.')
    } catch {
      toast.error('Failed to apply one-click fix. Please retry.')
    } finally {
      setIsApplyingFix(false)
    }
  }

  const handleResetIncident = async () => {
    try {
      await resetRcaFixApi(projectId)
      setResult(null)
      toast.info('Test incident reset. Run a new diagnosis to detect the simulated error again.')
    } catch {
      toast.error('Failed to reset RCA state.')
    }
  }

  const isHealthy = result?.severity === 'HEALTHY'

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="AI Root Cause Analysis (RCA)"
      description="Automated log diagnosis and one-click remediation engine"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Close
          </Button>
          {!result ? (
            <Button
              variant="primary"
              onClick={handleRunRca}
              isLoading={isLoading}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              {isLoading ? 'Scanning Logs...' : 'Run AI Diagnosis'}
            </Button>
          ) : isHealthy ? (
            <Button
              variant="outline"
              onClick={handleResetIncident}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset Test Incident
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleApplyFix}
              isLoading={isApplyingFix}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {isApplyingFix ? 'Applying Fix...' : 'Apply One-Click Fix'}
            </Button>
          )}
        </>
      }
    >
      {/* Initial state: ready to diagnose */}
      {!result && !isLoading && (
        <div className="py-8 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-[var(--accent-color)] mx-auto animate-pulse" />
          <p className="font-bold text-sm text-[var(--text-primary)]">Ready for AI Diagnosis</p>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            Click "Run AI Diagnosis" to scan system logs and identify active incidents, configuration errors, or performance bottlenecks.
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-8 text-center space-y-3">
          <div className="flex justify-center gap-1.5">
            <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="font-bold text-sm text-[var(--text-primary)]">Scanning System Logs...</p>
          <p className="text-xs text-[var(--text-secondary)]">Analyzing error patterns, connection telemetry, and pod health.</p>
        </div>
      )}

      {/* Healthy result: no issues detected */}
      {result && isHealthy && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex flex-col items-center text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
            <div>
              <p className="font-bold text-sm text-emerald-300">No Issues Found — All Systems Healthy</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed max-w-sm mx-auto">
                {result.explanation}
              </p>
            </div>
            <Badge variant="success">HEALTHY STATUS</Badge>
          </div>

          <div className="space-y-2 border-t border-[var(--border-color)] pt-3">
            <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Verification Checks Passed:</p>
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              {result.remediation_plan.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Issue detected: show RCA with remediation steps */}
      {result && !isHealthy && (
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-red-400 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {result.root_cause_title}
              </span>
              <Badge variant="danger">{result.severity} SEVERITY</Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">{result.explanation}</p>
          </div>

          <div className="space-y-2 border-t border-[var(--border-color)] pt-3">
            <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Automated Remediation Plan:</p>
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              {result.remediation_plan.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold font-mono shrink-0">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  )
}
