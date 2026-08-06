import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Clock, Filter, ShieldCheck } from 'lucide-react'
import { Badge, Card, Table } from '@/components/ui'
import { getAuditLogsApi } from '@/services/auditLogsApi'
import type { AuditLogItem } from '@/services/auditLogsApi'

export function AuditLogsPage() {
  const [filterAction, setFilterAction] = useState<string>('ALL')

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => getAuditLogsApi(100),
  })

  const filteredLogs = (logs || []).filter((log) => {
    if (filterAction === 'ALL') return true
    return log.action.includes(filterAction)
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2f81f7]" />
            Audit Logs
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Immutably record security, deployment, user updates, and operational events.
          </p>
        </div>
      </div>

      {/* Action Filter */}
      <div className="flex items-center space-x-3">
        <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] border border-[var(--border-color)] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#2f81f7]"
          aria-label="Filter audit logs by event type"
        >
          <option value="ALL">All Event Types</option>
          <option value="PROJECT">Project Events</option>
          <option value="USER">User Events</option>
          <option value="ENVIRONMENT">Environment Events</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <Card padded={false}>
        <Table<AuditLogItem>
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          columns={[
            {
              key: 'action',
              header: 'ACTION',
              render: (item) => (
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      item.action.includes('DELETE')
                        ? 'danger'
                        : item.action.includes('CREATE')
                        ? 'success'
                        : 'info'
                    }
                  >
                    {item.action}
                  </Badge>
                </div>
              ),
            },
            {
              key: 'resource_type',
              header: 'RESOURCE',
              render: (item) => (
                <span className="font-mono text-xs text-[var(--text-primary)]">
                  {item.resource_type}
                  {item.resource_id && <span className="text-[var(--text-secondary)]"> ({item.resource_id})</span>}
                </span>
              ),
            },
            {
              key: 'ip_address',
              header: 'IP ADDRESS',
              render: (item) => (
                <code className="text-xs text-[var(--text-secondary)]">{item.ip_address || '127.0.0.1'}</code>
              ),
            },
            {
              key: 'created_at',
              header: 'TIMESTAMP',
              className: 'text-right',
              render: (item) => (
                <div className="flex items-center justify-end space-x-1.5 text-xs text-[var(--text-secondary)]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(item.created_at).toLocaleString()}</span>
                </div>
              ),
            },
          ]}
          data={filteredLogs}
        />
      </Card>
    </motion.div>
  )
}
