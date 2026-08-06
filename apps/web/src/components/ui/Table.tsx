import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TableRowSkeleton } from './Skeleton'

export interface Column<T> {
  key: string
  header: ReactNode
  render?: (item: T) => ReactNode
  className?: string
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  keyExtractor: (item: T) => string | number
}

export function Table<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No items found',
  keyExtractor,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] shadow-sm">
      <table className="w-full text-left text-sm text-[var(--text-primary)] min-w-[600px]">
        <thead className="bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-secondary)] border-b border-[var(--border-color)] uppercase tracking-wider select-none">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`py-3 px-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRowSkeleton key={idx} columns={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-xs text-[var(--text-secondary)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <motion.tr
                key={keyExtractor(item)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.03, ease: 'easeOut' }}
                className="hover:bg-[var(--bg-surface)]/60 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-3.5 px-4 ${col.className || ''}`}>
                    {col.render
                      ? col.render(item)
                      : (item as Record<string, unknown>)[col.key] != null
                      ? String((item as Record<string, unknown>)[col.key])
                      : ''}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
