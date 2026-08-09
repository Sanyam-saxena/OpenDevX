import { useState, useEffect } from 'react'
import { CheckCircle2, Play, ArrowRight, Terminal } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import { getPipelineDagApi, triggerPipelineApi, type PipelineDag } from '@/services/pipelineApi'
import { toast } from 'sonner'

interface Props {
  projectId: string
}

export function PipelineVisualizerCard({ projectId }: Props) {
  const [dag, setDag] = useState<PipelineDag | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTriggering, setIsTriggering] = useState(false)
  const [activeStageId, setActiveStageId] = useState<string | null>(null)

  const fetchDag = async () => {
    setIsLoading(true)
    try {
      const res = await getPipelineDagApi(projectId)
      setDag(res)
      if (res.stages.length > 0) setActiveStageId(res.stages[0].id)
    } catch {
      // Fallback
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDag()
  }, [projectId])

  const handleTrigger = async () => {
    setIsTriggering(true)
    try {
      const res = await triggerPipelineApi(projectId)
      toast.success(res.message || 'CI/CD Pipeline run triggered successfully!')
      await fetchDag()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to trigger pipeline execution'
      toast.error(msg)
    } finally {
      setIsTriggering(false)
    }
  }

  const activeStage = dag?.stages.find((s) => s.id === activeStageId)

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Play className="w-4 h-4 text-emerald-400" />
            Interactive CI/CD Pipeline Visualizer (DAG)
          </h2>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            Automated Build ➔ Security ➔ Helm Deploy Graph
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleTrigger}
          isLoading={isTriggering}
          leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400" />}
        >
          Run Pipeline 🚀
        </Button>
      </div>

      {/* DAG Visual Nodes */}
      {dag && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 overflow-x-auto py-2">
          {dag.stages.map((stg, idx) => {
            const isSelected = stg.id === activeStageId
            return (
              <div key={stg.id} className="flex items-center space-x-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveStageId(stg.id)}
                  className={`flex-1 md:flex-none p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-sm'
                      : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[var(--text-secondary)]">STAGE {idx + 1}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="font-bold text-xs">{stg.name}</p>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-1">{stg.duration_ms}ms</p>
                </button>

                {idx < dag.stages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] hidden md:block shrink-0 opacity-50" />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Stage Log Inspector */}
      {activeStage && (
        <div className="p-3 rounded-md bg-slate-950 text-slate-200 font-mono text-xs space-y-1 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" />
              {activeStage.name} Execution Log
            </span>
            <span>Duration: {activeStage.duration_ms}ms</span>
          </div>
          <p className="text-emerald-300 font-semibold">{activeStage.logs}</p>
        </div>
      )}
    </Card>
  )
}
