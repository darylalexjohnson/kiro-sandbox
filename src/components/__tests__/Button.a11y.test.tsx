import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Button } from '../Button'

describe('Button accessibility', () => {
  it('has no violations for the primary variant', async () => {
    const { container } = render(<Button variant="primary">Primary</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations for the secondary variant', async () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations for the ghost variant', async () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations across sizes', async () => {
    const { container } = render(
      <>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations for an icon-style aria-label-only button', async () => {
    const { container } = render(
      <Button aria-label="Close">
        <span aria-hidden="true">×</span>
      </Button>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations for a disabled button', async () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
