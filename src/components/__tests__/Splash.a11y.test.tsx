import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Splash } from '../Splash'

describe('Splash accessibility', () => {
  it('has no violations on the container', async () => {
    const { container } = render(<Splash />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('keeps its accessibility contract intact', async () => {
    render(<Splash />)
    expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument()
    const headings = screen.getAllByRole('heading')
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveAccessibleName('Hello, Daryl')
  })
})
