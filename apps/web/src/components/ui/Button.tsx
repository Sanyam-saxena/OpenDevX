import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white border border-[var(--accent-hover)] shadow-sm hover:shadow-md hover:shadow-[var(--accent-color)]/25 active:scale-[0.98]',
  secondary:
    'bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-xs hover:border-[var(--accent-color)] hover:shadow-sm font-semibold',
  danger:
    'bg-[#dc2626] hover:bg-[#b91c1c] text-white border border-transparent shadow-sm hover:shadow-md hover:shadow-red-500/20 active:scale-[0.98]',
  warning:
    'bg-[#d97706] hover:bg-[#b45309] text-white border border-transparent shadow-sm hover:shadow-md hover:shadow-amber-500/20 active:scale-[0.98]',
  outline:
    'bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-xs font-semibold',
  ghost:
    'bg-transparent hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-md gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-lg gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    const baseClass =
      'inline-flex items-center justify-center font-sans transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-1 focus:ring-offset-[var(--bg-primary)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none cursor-pointer transform-gpu'

    const classes = `${baseClass} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'
