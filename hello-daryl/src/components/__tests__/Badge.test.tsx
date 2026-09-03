import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies the neutral variant class by default', () => {
    render(<Badge>Neutral</Badge>)
    expect(screen.getByText('Neutral')).toHaveClass('badge', 'badge--neutral')
  })

  it('applies the accent variant class when requested', () => {
    render(<Badge variant="accent">Accent</Badge>)
    expect(screen.getByText('Accent')).toHaveClass('badge', 'badge--accent')
  })
})
