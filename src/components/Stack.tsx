import type { ReactNode } from 'react'
import './Stack.css'

export type StackGap = 1 | 2 | 3 | 4 | 6 | 8 | 12

export interface StackProps {
  direction?: 'row' | 'column'
  gap?: StackGap
  children: ReactNode
  className?: string
}

export function Stack({
  direction = 'column',
  gap = 4,
  children,
  className,
}: StackProps) {
  return (
    <div
      className={['stack', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: `var(--space-${gap})`,
      }}
    >
      {children}
    </div>
  )
}
