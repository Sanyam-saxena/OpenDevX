import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = 'text',
      className = '',
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const isPassword = type === 'password'
    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[var(--text-secondary)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled}
            className={`w-full bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm rounded-md border ${
              error ? 'border-[#da3633]' : 'border-[var(--border-color)]'
            } px-3 py-2 ${leftIcon ? 'pl-9' : ''} ${
              isPassword || rightIcon ? 'pr-10' : ''
            } placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7] disabled:opacity-50 transition-colors ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none p-1 rounded cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <div className="absolute right-3 text-[var(--text-secondary)] pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#f85149] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--text-secondary)]">{helperText}</p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
