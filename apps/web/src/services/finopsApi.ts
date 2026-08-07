import { apiClient } from '@/api/client'

export interface CostBreakdownItem {
  service: string
  cost: number
  percentage: number
}

export interface CostRecommendation {
  id: string
  title: string
  description: string
  potential_savings: string
  effort: string
}

export interface FinOpsSummary {
  project_id: string
  currency: string
  cost_mtd: number
  cost_projected_month_end: number
  mom_change_pct: number
  breakdown: CostBreakdownItem[]
  recommendations: CostRecommendation[]
}

export async function getFinOpsSummaryApi(projectId: string): Promise<FinOpsSummary> {
  const res = await apiClient.get<FinOpsSummary>(
    `/api/v1/projects/${projectId}/finops/cost-summary`,
  )
  return res.data
}
