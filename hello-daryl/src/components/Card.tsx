import type { ReactNode } from 'react'
import './Card.css'

export interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={['card', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
