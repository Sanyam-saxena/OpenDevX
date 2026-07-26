import { useQuery } from '@tanstack/react-query'
import { getHealthApi } from '@/services/healthApi'

export function useHealth(refetchInterval = 30_000) {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealthApi,
    refetchInterval,
  })
}
