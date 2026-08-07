import { useState, useEffect } from 'react'
import { Layers, Terminal, RefreshCw } from 'lucide-react'
import { Card, Button, Badge, Modal } from '@/components/ui'
import { listPodsApi, getPodLogsApi, type K8sPod } from '@/services/k8sApi'
import { toast } from 'sonner'

interface Props {
  projectId: string
}

export function K8sPodStatusCard({ projectId }: Props) {
  const [pods, setPods] = useState<K8sPod[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPodLogs, setSelectedPodLogs] = useState<{ pod_id: string; logs: string } | null>(null)
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  const fetchPods = async () => {
    setIsLoading(true)
    try {
      const data = await listPodsApi(projectId)
      setPods(data)
    } catch {
      // Fallback
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPods()
  }, [projectId])

  const handleOpenLogs = async (podId: string) => {
    setIsLoadingLogs(true)
    try {
      const data = await getPodLogsApi(projectId, podId)
      setSelectedPodLogs(data)
    } catch {
      toast.error('Failed to fetch pod logs')
    } finally {
      setIsLoadingLogs(false)
    }
  }

  return (
    <>
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Kubernetes Cluster Pods ({pods.length})
            </h2>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              EKS Managed Node Group (ip-10-0-12-44.ec2.internal)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPods}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-indigo-400" />}
          >
            Refresh Pods
          </Button>
        </div>

        <div className="divide-y divide-[var(--border-color)]">
          {pods.map((pod) => (
            <div key={pod.pod_id} className="py-3 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs font-mono text-[var(--text-primary)]">{pod.name}</span>
                  <Badge variant="success">READY {pod.ready}</Badge>
                </div>
                <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                  CPU: {pod.cpu_usage} • RAM: {pod.memory_usage} • Node: {pod.node}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenLogs(pod.pod_id)}
                leftIcon={<Terminal className="w-3.5 h-3.5 text-indigo-400" />}
              >
                Logs
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Pod Log Modal */}
      {selectedPodLogs && (
        <Modal
          isOpen={Boolean(selectedPodLogs)}
          onClose={() => setSelectedPodLogs(null)}
          title={`Container Logs — ${selectedPodLogs.pod_id}`}
          description="Live stdout/stderr stream from Kubernetes pod"
          footer={
            <Button variant="ghost" onClick={() => setSelectedPodLogs(null)}>
              Close
            </Button>
          }
        >
          <div className="p-3.5 bg-slate-950 text-slate-200 rounded-md font-mono text-xs overflow-x-auto max-h-80 whitespace-pre-wrap border border-slate-800">
            {selectedPodLogs.logs}
          </div>
        </Modal>
      )}
    </>
  )
}
