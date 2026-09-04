import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BackgroundFX } from '../BackgroundFX'

describe('BackgroundFX', () => {
  it('renders a decorative root with the bg-fx class and aria-hidden', () => {
    const { container } = render(<BackgroundFX />)
    const root = container.querySelector('.bg-fx')
    expect(root).not.toBeNull()
    expect(root).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders four blob elements', () => {
    const { container } = render(<BackgroundFX />)
    expect(container.querySelectorAll('.bg-fx__blob')).toHaveLength(4)
  })

  it('exposes no heading and no landmark role', () => {
    const { queryByRole } = render(<BackgroundFX />)
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('dialog')).toBeNull()
    expect(queryByRole('main')).toBeNull()
  })
})
