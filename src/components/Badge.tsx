import type { ReactNode } from 'react'
import './Badge.css'

export interface BadgeProps {
  children: ReactNode
  variant?: 'neutral' | 'accent'
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{children}</span>
}
