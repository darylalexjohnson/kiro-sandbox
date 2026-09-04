import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('renders its children inside a .card element', () => {
    render(
      <Card>
        <p>Card body</p>
      </Card>,
    )
    const body = screen.getByText('Card body')
    expect(body).toBeInTheDocument()
    expect(body.closest('.card')).not.toBeNull()
  })

  it('passes through an extra className', () => {
    render(<Card className="extra">Content</Card>)
    const content = screen.getByText('Content')
    expect(content).toHaveClass('card', 'extra')
  })
})
