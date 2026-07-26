import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, subtitle, description, children }: PageHeaderProps) {
  const sub = description || subtitle
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
        {sub && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{sub}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}
