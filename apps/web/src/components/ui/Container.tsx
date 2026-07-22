import type { HTMLAttributes } from 'react'

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
}

export function Container({
  size = 'xl',
  className = '',
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={[
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
