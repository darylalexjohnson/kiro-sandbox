import type { MouseEvent, ReactNode } from 'react'
import './Button.css'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  'aria-label'?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  children,
}: ButtonProps) {
  const className = `btn btn--${variant} btn--${size}`

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
