import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

export function Card({ padded = true, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={[
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        'dark:border-gray-800 dark:bg-gray-900',
        padded ? 'p-6' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
