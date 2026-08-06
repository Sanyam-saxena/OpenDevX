import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  padded?: boolean
  interactive?: boolean
}

export function Card({
  children,
  className = '',
  padded = true,
  interactive = false,
  ...props
}: CardProps) {
  const baseClasses = `bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl ${
    padded ? 'p-5 sm:p-6' : ''
  } transition-[transform,box-shadow,border-color] duration-200 ease-out text-[var(--text-primary)] shadow-[var(--card-shadow)] relative overflow-hidden transform-gpu`

  const interactiveClasses = interactive
    ? 'will-change-transform hover:-translate-y-1 hover:border-[var(--accent-color)] hover:shadow-[var(--card-shadow-hover)] cursor-pointer group'
    : ''

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col space-y-1 mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-base font-bold text-[var(--text-primary)] tracking-tight ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-xs text-[var(--text-secondary)] leading-relaxed ${className}`}>{children}</p>
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between ${className}`}>{children}</div>
}
