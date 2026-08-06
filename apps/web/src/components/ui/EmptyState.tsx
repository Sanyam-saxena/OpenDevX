import type { ReactNode } from 'react'
import { FolderPlus } from 'lucide-react'
import { Button } from './Button'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  leftIcon?: ReactNode
}

export function EmptyState({
  icon = <FolderPlus className="w-10 h-10 text-[var(--text-secondary)]" />,
  title,
  description,
  actionLabel,
  onAction,
  leftIcon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] my-4">
      <div className="p-3 bg-[var(--bg-surface)] rounded-full mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="text-xs text-[var(--text-secondary)] max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} leftIcon={leftIcon}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
