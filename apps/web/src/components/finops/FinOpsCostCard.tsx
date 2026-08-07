import { useState, useEffect } from 'react'
import { DollarSign, TrendingDown, Lightbulb } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import { getFinOpsSummaryApi, type FinOpsSummary } from '@/services/finopsApi'

interface Props {
  projectId: string
}

export function FinOpsCostCard({ projectId }: Props) {
  const [summary, setSummary] = useState<FinOpsSummary | null>(null)

  useEffect(() => {
    getFinOpsSummaryApi(projectId).then(setSummary).catch(() => {})
  }, [projectId])

  if (!summary) return null

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-rose-400" />
            FinOps Infrastructure Cost Estimator
          </h2>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            Cloud Billing Breakdown & Cost Optimization Recommendations
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold font-mono text-[var(--text-primary)]">${summary.cost_mtd}</p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 justify-end">
            <TrendingDown className="w-3 h-3" />
            {summary.mom_change_pct}% MoM
          </span>
        </div>
      </div>

      {/* Breakdown Progress Bars */}
      <div className="space-y-2.5">
        <p className="text-[10px] font-mono font-bold uppercase text-[var(--text-secondary)]">Cost Distribution</p>
        {summary.breakdown.map((item) => (
          <div key={item.service} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-primary)]">{item.service}</span>
              <span className="font-bold text-[var(--text-primary)]">${item.cost} ({item.percentage}%)</span>
            </div>
            <div className="w-full bg-[var(--bg-primary)] h-1.5 rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* FinOps Recommendations */}
      <div className="border-t border-[var(--border-color)] pt-3 space-y-2">
        <p className="text-[10px] font-mono font-bold uppercase text-[var(--text-secondary)] flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          FinOps Savings Advisor
        </p>
        {summary.recommendations.map((rec) => (
          <div key={rec.id} className="p-2.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-[var(--text-primary)]">{rec.title}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{rec.description}</p>
            </div>
            <span className="px-2 py-1 text-[10px] font-bold font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap ml-2">
              Save {rec.potential_savings}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
