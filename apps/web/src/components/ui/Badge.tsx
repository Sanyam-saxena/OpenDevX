import type { HTMLAttributes, ReactNode } from 'react'

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'error' | 'info' | 'neutral'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: ReactNode
  showDot?: boolean
  className?: string
}

const dangerStyle = {
  bg: 'bg-red-50 dark:bg-[#da3633]/15',
  text: 'text-red-700 dark:text-[#f85149] font-bold',
  border: 'border-red-200 dark:border-[#da3633]/40',
  dot: 'bg-red-600 dark:bg-[#f85149]',
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-[#238636]/15',
    text: 'text-emerald-700 dark:text-[#3fb950] font-bold',
    border: 'border-emerald-200 dark:border-[#238636]/40',
    dot: 'bg-emerald-600 dark:bg-[#3fb950]',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-[#d29922]/15',
    text: 'text-amber-800 dark:text-[#d29922] font-bold',
    border: 'border-amber-200 dark:border-[#d29922]/40',
    dot: 'bg-amber-600 dark:bg-[#d29922]',
  },
  danger: dangerStyle,
  error: dangerStyle,
  info: {
    bg: 'bg-blue-50 dark:bg-[#2f81f7]/15',
    text: 'text-blue-700 dark:text-[#58a6ff] font-bold',
    border: 'border-blue-200 dark:border-[#2f81f7]/40',
    dot: 'bg-blue-600 dark:bg-[#58a6ff]',
  },
  neutral: {
    bg: 'bg-slate-100 dark:bg-[#30363d]/50',
    text: 'text-slate-800 dark:text-[#cbd5e1] font-bold',
    border: 'border-slate-300 dark:border-[#484f58]',
    dot: 'bg-slate-600 dark:bg-[#8b949e]',
  },
}

export function Badge({
  variant = 'neutral',
  children,
  showDot = true,
  className = '',
  ...props
}: BadgeProps) {
  const styles = variantStyles[variant] || variantStyles.neutral

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${className}`}
      {...props}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />}
      {children}
    </span>
  )
}
